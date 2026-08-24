/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatDateHi, type TrustEvent, getEventSlug, resolveImagePath } from "@/lib/events";
import { WhatsAppIcon } from "@/components/icons";

/** Event card with photos + WhatsApp share (shares event page URL for rich preview). */
export default function EventCard({
  event,
  upcoming = false,
}: {
  event: TrustEvent;
  upcoming?: boolean;
}) {
  const slug = getEventSlug(event);
  const shareUrl = `${siteConfig.siteUrl}/events/${slug}`;
  const waShareLink = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg">
      {event.images.length > 0 && (
        <div className="grid gap-1 p-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {event.images.slice(0, 3).map((img, index) => (
            <img
              key={img}
              src={resolveImagePath(event.id, img)}
              alt={event.title}
              className={`aspect-video w-full object-cover rounded-2xl ${index > 0 ? "hidden sm:block" : ""}`}
              loading="lazy"
            />
          ))}
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              upcoming ? "bg-saffron-100 text-saffron-800" : "bg-maroon-100 text-maroon-800"
            }`}
          >
            {upcoming ? "आगामी" : "संपन्न"}
          </span>
          <time dateTime={event.date} className="text-sm font-medium text-maroon-700">
            {formatDateHi(event.date)}
          </time>
        </div>
        <h3 className="mb-2 font-serif text-xl font-bold text-maroon-900">{event.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-maroon-800">{event.description}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/events/${slug}`}
            className="inline-flex min-h-[44px] items-center rounded-full border-2 border-maroon-800 px-5 py-2.5 text-sm font-bold text-maroon-800 transition hover:bg-maroon-800 hover:text-white"
          >
            पूरी गैलरी देखें
          </Link>
          <a
            href={waShareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp पर साझा करें
          </a>
        </div>
      </div>
    </article>
  );
}
