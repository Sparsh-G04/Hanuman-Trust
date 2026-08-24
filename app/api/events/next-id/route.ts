import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { TrustEvent } from "@/lib/events";

const EVENTS_PATH = path.join(process.cwd(), "data/events.json");

// GET /api/events/next-id — return the next available event ID
export async function GET() {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  const events: TrustEvent[] = JSON.parse(raw);

  const ids = events
    .map((e) => parseInt(e.id.replace("event", ""), 10))
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  const nextId = `event${String(max + 1).padStart(3, "0")}`;

  return NextResponse.json({ nextId });
}
