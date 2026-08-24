import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { TrustEvent } from "@/lib/events";

const EVENTS_PATH = path.join(process.cwd(), "data/events.json");

function readEvents(): TrustEvent[] {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeEvents(events: TrustEvent[]): void {
  writeFileSync(EVENTS_PATH, JSON.stringify(events, null, 2), "utf-8");
}

function getNextEventId(events: TrustEvent[]): string {
  const ids = events
    .map((e) => parseInt(e.id.replace("event", ""), 10))
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  return `event${String(max + 1).padStart(3, "0")}`;
}

// GET /api/events — return all events
export async function GET() {
  const events = readEvents();
  return NextResponse.json(events);
}

// POST /api/events — create new event
export async function POST(request: Request) {
  const body = await request.json();

  const { title, date, description, images, videos } = body as {
    title?: string;
    date?: string;
    description?: string;
    images?: string[];
    videos?: string[];
  };

  // Validate required fields
  if (!title || !date || !description) {
    return NextResponse.json(
      { error: "title, date, और description आवश्यक हैं" },
      { status: 400 }
    );
  }

  const events = readEvents();
  const newId = getNextEventId(events);

  const newEvent: TrustEvent = {
    id: newId,
    title,
    date,
    description,
    images: images ?? [],
    videos: videos ?? [],
  };

  // Create directories for the event
  const publicPath = path.join(process.cwd(), "public/events", newId);
  mkdirSync(path.join(publicPath, "images"), { recursive: true });
  mkdirSync(path.join(publicPath, "videos"), { recursive: true });

  events.push(newEvent);
  writeEvents(events);

  return NextResponse.json(newEvent, { status: 201 });
}
