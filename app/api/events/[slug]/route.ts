import { readFileSync, writeFileSync, rmSync, unlinkSync, existsSync, readdirSync, renameSync } from "fs";
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

/** Delete a local file from public/events/{eventId}/{type}/{filename} */
function deleteLocalFile(eventId: string, type: "images" | "videos", filename: string): void {
  if (filename.startsWith("http")) return;
  const filePath = path.join(process.cwd(), "public", "events", eventId, type, filename);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

/** Delete entire event directory from public/events/{eventId} */
function deleteEventDirectory(eventId: string): void {
  const dirPath = path.join(process.cwd(), "public", "events", eventId);
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true, force: true });
  }
}

/** Renumber files in directory sequentially and return the new filenames */
function renumberAndGetNames(dirPath: string, prefix: string): string[] {
  if (!existsSync(dirPath)) return [];

  const files = readdirSync(dirPath);
  const pattern = new RegExp(`^${prefix}_(\\d+)(\\.[a-z0-9]+)$`, "i");

  const matchedFiles = files
    .map((f) => {
      const match = f.match(pattern);
      if (!match) return null;
      return { name: f, num: parseInt(match[1], 10), ext: match[2] };
    })
    .filter((f): f is { name: string; num: number; ext: string } => f !== null)
    .sort((a, b) => a.num - b.num);

  // Rename to temp first to avoid collisions
  const results: string[] = [];
  const tempNames: { tempName: string; finalName: string }[] = [];

  for (let i = 0; i < matchedFiles.length; i++) {
    const file = matchedFiles[i];
    const tempName = `__temp_${i}${file.ext}`;
    const finalName = `${prefix}_${String(i + 1).padStart(3, "0")}${file.ext}`;

    renameSync(path.join(dirPath, file.name), path.join(dirPath, tempName));
    tempNames.push({ tempName, finalName });
    results.push(finalName);
  }

  // Rename from temp to final
  for (const item of tempNames) {
    renameSync(path.join(dirPath, item.tempName), path.join(dirPath, item.finalName));
  }

  return results;
}

// PUT /api/events/[slug] — update event by id
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const events = readEvents();
  const index = events.findIndex((e) => e.id === params.slug);

  if (index === -1) {
    return NextResponse.json(
      { error: "कार्यक्रम नहीं मिला" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { title, date, description, images, videos } = body as Partial<TrustEvent>;
  const currentEvent = events[index];

  // If images list is updated, delete removed files then renumber
  if (images !== undefined) {
    const removedImages = currentEvent.images.filter((img) => !images.includes(img));
    for (const img of removedImages) {
      deleteLocalFile(currentEvent.id, "images", img);
    }

    // Renumber remaining files and update the list
    const imagesDir = path.join(process.cwd(), "public", "events", currentEvent.id, "images");
    const newImageNames = renumberAndGetNames(imagesDir, "image");
    currentEvent.images = newImageNames;
  }

  // If videos list is updated, delete removed files then renumber
  if (videos !== undefined) {
    // Separate local files from YouTube URLs
    const localVideosInNew = videos.filter((v) => !v.startsWith("http"));
    const urlVideosInNew = videos.filter((v) => v.startsWith("http"));

    const removedVideos = currentEvent.videos.filter((vid) => !videos.includes(vid));
    for (const vid of removedVideos) {
      deleteLocalFile(currentEvent.id, "videos", vid);
    }

    // Renumber remaining local video files
    const videosDir = path.join(process.cwd(), "public", "events", currentEvent.id, "videos");
    const newVideoNames = renumberAndGetNames(videosDir, "video");

    // Combine: renumbered local files + YouTube URLs
    currentEvent.videos = [...newVideoNames, ...urlVideosInNew];
  }

  // Update other fields
  if (title !== undefined) currentEvent.title = title;
  if (date !== undefined) currentEvent.date = date;
  if (description !== undefined) currentEvent.description = description;

  events[index] = currentEvent;
  writeEvents(events);

  return NextResponse.json(currentEvent);
}

// DELETE /api/events/[slug] — delete event by id + all its files
export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const events = readEvents();
  const index = events.findIndex((e) => e.id === params.slug);

  if (index === -1) {
    return NextResponse.json(
      { error: "कार्यक्रम नहीं मिला" },
      { status: 404 }
    );
  }

  const removed = events.splice(index, 1)[0];
  writeEvents(events);

  // Delete the entire event directory (images + videos)
  deleteEventDirectory(removed.id);

  return NextResponse.json({ message: "कार्यक्रम हटाया गया", event: removed });
}
