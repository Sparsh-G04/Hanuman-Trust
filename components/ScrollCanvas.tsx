"use client";

import { useEffect, useRef } from "react";
import { supportsWebP } from "@/lib/supports-webp";
import { FramePreloader } from "@/lib/frame-preloader";

const TOTAL_FRAMES = 22;

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderRef = useRef<FramePreloader | null>(null);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // ── Draw a single frame (cover-fit) ─────────────────────────────
    function draw(index: number) {
      const img = preloaderRef.current?.getFrame(index);
      if (!img || !ctx) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(w / iw, h / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (w - sw) / 2;
      const sy = (h - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh);
    }

    // ── Resize ──────────────────────────────────────────────────────
    function handleResize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      draw(lastFrameRef.current);
    }

    // ── Scroll → frame mapping ──────────────────────────────────────
    function handleScroll() {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;

        const preloader = preloaderRef.current;
        if (!preloader) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
        const frameIndex = preloader.getFrameIndex(progress);

        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          draw(frameIndex);
        }
      });
    }

    // ── Init preloader ──────────────────────────────────────────────
    let cancelled = false;

    (async () => {
      const webp = await supportsWebP();
      if (cancelled) return;

      const basePath = webp ? "/sequence_webp" : "/sequence_jpg";
      const extension = webp ? "webp" : "jpg";

      const preloader = new FramePreloader({
        totalFrames: TOTAL_FRAMES,
        basePath,
        extension,
      });
      preloaderRef.current = preloader;

      // Preload all frames
      preloader.preloadRange(1, TOTAL_FRAMES);

      // Wait for frame 1 then draw it
      function pollFirstFrame() {
        if (cancelled) return;
        const frame = preloader.getFrame(1);
        if (frame) {
          lastFrameRef.current = 1;
          draw(1);
        } else {
          setTimeout(pollFirstFrame, 16);
        }
      }
      pollFirstFrame();
    })();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url(/sequence_jpg/ezgif-frame-001.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{
            filter: "brightness(1.08) saturate(1.14) contrast(1.03)",
          }}
        />
      </div>
      {/* Bottom-only vignette for footer readability */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, transparent 58%, rgba(0,0,0,0.34) 100%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
