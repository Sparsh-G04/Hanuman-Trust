import eventsData from "@/data/events.json";

export interface TrustEvent {
  title: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  images: string[];
}

/** Read at build time; auto-sorted into upcoming vs past based on today's date. */
export function getEvents(): { upcoming: TrustEvent[]; past: TrustEvent[] } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = (eventsData as TrustEvent[]).slice();

  const upcoming = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date)); // soonest first

  const past = events
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date)); // most recent first

  return { upcoming, past };
}

export function getNextEvent(): TrustEvent | null {
  return getEvents().upcoming[0] ?? null;
}

export function formatDateHi(iso: string): string {
  return new Date(iso).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
