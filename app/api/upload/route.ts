import { writeFileSync, mkdirSync, readdirSync, renameSync, existsSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// POST /api/upload — upload image or video file to public/events/{eventId}/{type}/
export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file") as File | null;
  const eventId = formData.get("eventId") as string | null;
  const type = formData.get("type") as string | null; // "images" or "videos"

  if (!file || !eventId || !type) {
    return NextResponse.json(
      { error: "file, eventId, और type आवश्यक हैं" },
      { status: 400 }
    );
  }

  if (type !== "images" && type !== "videos") {
    return NextResponse.json(
      { error: "type 'images' या 'videos' होना चाहिए" },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const allowedVideoTypes = ["video/mp4", "video/webm"];

  if (type === "images" && !allowedImageTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "केवल JPG, PNG, WebP फोटो अनुमत हैं" },
      { status: 400 }
    );
  }

  if (type === "videos" && !allowedVideoTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "केवल MP4, WebM वीडियो अनुमत हैं" },
      { status: 400 }
    );
  }

  // Ensure directory exists
  const dirPath = path.join(process.cwd(), "public", "events", eventId, type);
  mkdirSync(dirPath, { recursive: true });

  // First, renumber all existing files to ensure sequential naming from 001
  const prefix = type === "images" ? "image" : "video";
  renumberFiles(dirPath, prefix);

  // Now count current files and assign next number
  const currentCount = countFiles(dirPath, prefix);
  const extension = getExtension(file.name, file.type);
  const fileName = `${prefix}_${String(currentCount + 1).padStart(3, "0")}${extension}`;

  const filePath = path.join(dirPath, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  return NextResponse.json({
    success: true,
    fileName,
    path: `/events/${eventId}/${type}/${fileName}`,
  });
}

/** Count how many files with the given prefix exist in the directory */
function countFiles(dirPath: string, prefix: string): number {
  if (!existsSync(dirPath)) return 0;
  const files = readdirSync(dirPath);
  const pattern = new RegExp(`^${prefix}_\\d+\\.[a-z0-9]+$`, "i");
  return files.filter((f) => pattern.test(f)).length;
}

/** Renumber all files in directory sequentially: prefix_001, prefix_002, etc. */
function renumberFiles(dirPath: string, prefix: string): void {
  if (!existsSync(dirPath)) return;

  const files = readdirSync(dirPath);
  const pattern = new RegExp(`^${prefix}_(\\d+)(\\.[a-z0-9]+)$`, "i");

  // Get all matching files with their current names and extensions
  const matchedFiles = files
    .map((f) => {
      const match = f.match(pattern);
      if (!match) return null;
      return { name: f, num: parseInt(match[1], 10), ext: match[2] };
    })
    .filter((f): f is { name: string; num: number; ext: string } => f !== null)
    .sort((a, b) => a.num - b.num);

  // Check if renumbering is needed
  let needsRenumber = false;
  for (let i = 0; i < matchedFiles.length; i++) {
    if (matchedFiles[i].num !== i + 1) {
      needsRenumber = true;
      break;
    }
  }

  if (!needsRenumber) return;

  // Rename to temp names first to avoid collisions
  const tempNames: { from: string; to: string; finalName: string }[] = [];
  for (let i = 0; i < matchedFiles.length; i++) {
    const file = matchedFiles[i];
    const tempName = `__temp_${i}${file.ext}`;
    const finalName = `${prefix}_${String(i + 1).padStart(3, "0")}${file.ext}`;

    renameSync(path.join(dirPath, file.name), path.join(dirPath, tempName));
    tempNames.push({ from: tempName, to: finalName, finalName });
  }

  // Rename from temp to final
  for (const item of tempNames) {
    renameSync(path.join(dirPath, item.from), path.join(dirPath, item.to));
  }
}

/** Get file extension from filename or MIME type */
function getExtension(filename: string, mimeType: string): string {
  const extFromName = path.extname(filename).toLowerCase();
  if (extFromName) return extFromName;

  const mimeMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };

  return mimeMap[mimeType] ?? ".bin";
}
