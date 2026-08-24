import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getEvents, getEventBySlug, formatDateHi, resolveImagePath, resolveVideoPath } from "@/lib/events";
import { WhatsAppIcon } from "@/components/icons";
import GalleryGrid from "@/components/GalleryGrid";
import VideoEmbed from "@/components/VideoEmbed";

// Dynamic rendering — always reads fresh data from events.json
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = getEventBySlug(params.slug);

  if (!event) {
    return { title: "कार्यक्रम नहीं मिला" };
  }

  const ogImage = event.images.length > 0
    ? `${siteConfig.siteUrl}${resolveImagePath(event.id, event.images[0])}`
    : `${siteConfig.siteUrl}/logo.webp`;

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "article",
      url: `${siteConfig.siteUrl}/events/${event.id}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }],
    },
  };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const videos = event.videos ?? [];
  const shareUrl = `${siteConfig.siteUrl}/events/${event.id}`;
  const waShareLink = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;

  const galleryImages = event.images.map((img, i) => ({
    src: resolveImagePath(event.id, img),
    alt: `${event.title} — फोटो ${i + 1}`,
  }));

  const resolvedVideos = videos.map((v) => resolveVideoPath(event.id, v));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-site py-10">
        {/* Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/events" className="text-sm font-semibold text-maroon-700 hover:text-maroon-900">
            ← सभी कार्यक्रम
          </Link>
        </div>

        {/* Event header */}
        <header className="mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-800">
              {formatDateHi(event.date)}
            </span>
          </div>
          <h1 className="mb-4 font-serif text-3xl font-bold text-maroon-950 sm:text-4xl">
            {event.title}
          </h1>
          <p className="mb-6 max-w-3xl leading-relaxed text-maroon-800">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={waShareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-bold text-white transition hover:brightness-110"
              aria-label="WhatsApp पर साझा करें"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp पर साझा करें
            </a>
            <Link
              href="/events"
              className="inline-flex min-h-[44px] items-center rounded-full border-2 border-maroon-800 px-5 py-2.5 font-bold text-maroon-800 transition hover:bg-maroon-800 hover:text-white"
            >
              अन्य कार्यक्रम देखें
            </Link>
          </div>
        </header>

        {/* Photo Gallery — Masonry */}
        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-maroon-900">
              फोटो गैलरी ({galleryImages.length})
            </h2>
            <GalleryGrid images={galleryImages} />
          </section>
        )}

        {/* Videos */}
        {resolvedVideos.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-maroon-900">
              वीडियो ({resolvedVideos.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {resolvedVideos.map((video) => (
                <VideoEmbed key={video} url={video} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
