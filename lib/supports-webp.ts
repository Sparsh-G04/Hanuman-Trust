/**
 * Detect WebP support at runtime using a 1px WebP data URI.
 * Result is cached — only runs the test once.
 */

let cachedResult: boolean | null = null;

export function supportsWebP(): Promise<boolean> {
  if (cachedResult !== null) {
    return Promise.resolve(cachedResult);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      cachedResult = img.width === 1;
      resolve(cachedResult);
    };
    img.onerror = () => {
      cachedResult = false;
      resolve(false);
    };
    // 1x1 WebP pixel
    img.src =
      "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJYgCdAEO/hepAA==";
  });
}
