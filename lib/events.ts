import { readFileSync } from "fs";
import path from "path";

export interface TrustEvent {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  images: string[]; // filenames or full URLs
  videos: string[]; // YouTube URLs or MP4 filenames
}

export interface EventSlide {
  src: string;
  title: string;
  caption: string;
}

// ── Path helpers ────────────────────────────────────────────────────

/** Resolve an image entry to its public URL */
export function resolveImagePath(eventId: string, filename: string): string {
  if (filename.startsWith("http")) return filename;
  return `/events/${eventId}/images/${filename}`;
}

/** Resolve a video entry to its public URL or YouTube URL */
export function resolveVideoPath(eventId: string, entry: string): string {
  if (entry.startsWith("http")) return entry;
  return `/events/${eventId}/videos/${entry}`;
}

// ── Live data reading (runtime, not build-time) ─────────────────────

const EVENTS_PATH = path.join(process.cwd(), "data/events.json");

/** Read events from disk at request time — always fresh */
export function getEventsLive(): { upcoming: TrustEvent[]; past: TrustEvent[] } {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  const events: TrustEvent[] = JSON.parse(raw);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = events
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return { upcoming, past };
}

/** Read all events unsorted (for API/dashboard) */
export function getAllEventsLive(): TrustEvent[] {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  return JSON.parse(raw);
}

// ── Backward-compatible wrappers ────────────────────────────────────

/** Alias for getEventsLive — used by pages */
export function getEvents(): { upcoming: TrustEvent[]; past: TrustEvent[] } {
  return getEventsLive();
}

export function getNextEvent(): TrustEvent | null {
  return getEventsLive().upcoming[0] ?? null;
}

export function getEventBySlug(slug: string): TrustEvent | null {
  const events = getAllEventsLive();
  return events.find((event) => event.id === slug) ?? null;
}

export function getEventSlug(event: Pick<TrustEvent, "id">): string {
  return event.id;
}

// ── ID generation ───────────────────────────────────────────────────

/** Generate next sequential event ID (event001, event002, ...) */
export function getNextEventId(): string {
  const events = getAllEventsLive();
  const ids = events
    .map((e) => parseInt(e.id.replace("event", ""), 10))
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  return `event${String(max + 1).padStart(3, "0")}`;
}

// ── Slides helper (for carousel) ────────────────────────────────────

export function getEventSlides(events: TrustEvent[]): EventSlide[] {
  return events.flatMap((event) =>
    event.images.map((image, index) => ({
      src: resolveImagePath(event.id, image),
      title: event.title,
      caption: `${formatDateHi(event.date)} · फोटो ${index + 1}`,
    })),
  );
}

// ── Video helpers ───────────────────────────────────────────────────

/** Check if a URL is a YouTube link */
export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/** Extract YouTube video ID and return nocookie embed URL */
export function getYouTubeEmbedUrl(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }

  return url;
}

/** Check if URL is an MP4 file */
export function isMp4File(url: string): boolean {
  return url.toLowerCase().endsWith(".mp4");
}

// ── Date formatting ─────────────────────────────────────────────────

export function formatDateHi(iso: string): string {
  return new Date(iso).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
