import { isYouTubeUrl, getYouTubeEmbedUrl, isMp4File } from "@/lib/events";

interface VideoEmbedProps {
  url: string; // Already resolved: full URL (YouTube/cloud) or /events/{id}/videos/{file}
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
  if (isYouTubeUrl(url)) {
    const embedUrl = getYouTubeEmbedUrl(url);
    return (
      <div className="relative z-10 w-full overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          title="वीडियो"
          className="pointer-events-auto absolute inset-0 h-full w-full touch-auto"
          loading="lazy"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  if (isMp4File(url)) {
    return (
      <div className="relative z-10 w-full overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="pointer-events-auto absolute inset-0 h-full w-full touch-auto object-contain"
        >
          आपका ब्राउज़र वीडियो नहीं चला सकता।
        </video>
      </div>
    );
  }

  return null;
}
