/**
 * Progressive frame preloader for scroll-driven animation.
 * Loads image frames in batches, caches them, and supports
 * slow-connection frame skipping.
 */

export interface FramePreloaderConfig {
  totalFrames: number;
  basePath: string; // e.g. "/sequence_webp"
  extension: string; // e.g. "webp"
}

export class FramePreloader {
  private cache: Map<number, HTMLImageElement> = new Map();
  private loading: Set<number> = new Set();
  private totalFrames: number;
  private basePath: string;
  private extension: string;
  private frameStep: number;

  constructor(config: FramePreloaderConfig) {
    this.totalFrames = config.totalFrames;
    this.basePath = config.basePath;
    this.extension = config.extension;

    // On slow connections, skip every other frame
    this.frameStep = this.isSlowConnection() ? 2 : 1;
  }

  /** Get the effective total frames after accounting for frame skipping */
  get effectiveFrames(): number {
    return this.frameStep === 1
      ? this.totalFrames
      : Math.ceil(this.totalFrames / this.frameStep);
  }

  /** Map a progress value (0–1) to the actual frame index (1-based) */
  getFrameIndex(progress: number): number {
    const clamped = Math.max(0, Math.min(1, progress));
    const idx = Math.floor(clamped * (this.totalFrames - 1)) + 1;
    // Snap to nearest valid frame when skipping
    if (this.frameStep > 1) {
      return Math.round(idx / this.frameStep) * this.frameStep || 1;
    }
    return idx;
  }

  /** Preload a range of frames (1-based indices) */
  preloadRange(start: number, end: number): void {
    const clampedStart = Math.max(1, start);
    const clampedEnd = Math.min(this.totalFrames, end);

    for (let i = clampedStart; i <= clampedEnd; i += this.frameStep) {
      this.preloadFrame(i);
    }
  }

  /** Get a cached frame or null if not yet loaded */
  getFrame(index: number): HTMLImageElement | null {
    // If exact frame isn't loaded, try nearest loaded frame
    if (this.cache.has(index)) return this.cache.get(index)!;

    // Fallback to nearest available frame (for frame-skipping scenarios)
    if (this.frameStep > 1) {
      const snapped = Math.round(index / this.frameStep) * this.frameStep || 1;
      if (this.cache.has(snapped)) return this.cache.get(snapped)!;
    }

    return null;
  }

  /** Preload frames ahead of the current position */
  preloadAround(currentIndex: number, batchSize: number = 20): void {
    const ahead = currentIndex + batchSize * this.frameStep;
    this.preloadRange(currentIndex, Math.min(ahead, this.totalFrames));
  }

  private preloadFrame(index: number): void {
    if (this.cache.has(index) || this.loading.has(index)) return;

    this.loading.add(index);
    const img = new Image();
    const paddedIndex = String(index).padStart(3, "0");
    img.src = `${this.basePath}/ezgif-frame-${paddedIndex}.${this.extension}`;

    img.onload = () => {
      this.cache.set(index, img);
      this.loading.delete(index);
    };
    img.onerror = () => {
      this.loading.delete(index);
    };
  }

  private isSlowConnection(): boolean {
    if (typeof navigator === "undefined") return false;
    const conn = (navigator as unknown as { connection?: { effectiveType?: string } })
      .connection;
    if (!conn?.effectiveType) return false;
    return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
  }
}
