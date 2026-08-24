import { readFileSync, readdirSync, unlinkSync, existsSync, rmSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { TrustEvent } from "@/lib/events";

const EVENTS_PATH = path.join(process.cwd(), "data/events.json");
const PUBLIC_EVENTS_DIR = path.join(process.cwd(), "public", "events");

// POST /api/cleanup — remove orphaned files and directories
export async function POST() {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  const events: TrustEvent[] = JSON.parse(raw);

  const deletedFiles: string[] = [];
  const deletedDirs: string[] = [];

  // Get all event IDs from JSON
  const validEventIds = new Set(events.map((e) => e.id));

  // Check all directories in public/events/
  if (!existsSync(PUBLIC_EVENTS_DIR)) {
    return NextResponse.json({ deletedFiles, deletedDirs, message: "कुछ साफ करने को नहीं था" });
  }

  const eventDirs = readdirSync(PUBLIC_EVENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const dir of eventDirs) {
    const dirPath = path.join(PUBLIC_EVENTS_DIR, dir);

    // If this directory doesn't belong to any event in JSON — delete entire directory
    if (!validEventIds.has(dir)) {
      rmSync(dirPath, { recursive: true, force: true });
      deletedDirs.push(dir);
      continue;
    }

    // Find the event for this directory
    const event = events.find((e) => e.id === dir)!;

    // Clean orphaned images
    const imagesDir = path.join(dirPath, "images");
    if (existsSync(imagesDir)) {
      const imageFiles = readdirSync(imagesDir);
      const validImages = new Set(event.images.filter((img) => !img.startsWith("http")));

      for (const file of imageFiles) {
        if (!validImages.has(file)) {
          unlinkSync(path.join(imagesDir, file));
          deletedFiles.push(`${dir}/images/${file}`);
        }
      }
    }

    // Clean orphaned videos
    const videosDir = path.join(dirPath, "videos");
    if (existsSync(videosDir)) {
      const videoFiles = readdirSync(videosDir);
      const validVideos = new Set(event.videos.filter((vid) => !vid.startsWith("http")));

      for (const file of videoFiles) {
        if (!validVideos.has(file)) {
          unlinkSync(path.join(videosDir, file));
          deletedFiles.push(`${dir}/videos/${file}`);
        }
      }
    }
  }

  return NextResponse.json({
    deletedFiles,
    deletedDirs,
    message: `${deletedFiles.length} फाइलें और ${deletedDirs.length} फोल्डर हटाए गए`,
  });
}
