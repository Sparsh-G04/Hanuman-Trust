/* eslint-disable @next/next/no-img-element */
import { formatDateHi, type TrustEvent } from "@/lib/events";
import { WhatsAppIcon } from "@/components/icons";

/** Event card with photos + WhatsApp share (spec: share buttons to encourage word-of-mouth). */
export default function EventCard({
  event,
  upcoming = false,
}: {
  event: TrustEvent;
  upcoming?: boolean;
}) {
  const shareText = `${event.title} — ${formatDateHi(event.date)}\n${event.description}`;
  const shareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg">
      {event.images.length > 0 && (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {event.images.map((img) => (
            <img
              key={img}
              src={`/events/${img}`}
              alt={event.title}
              className="aspect-video w-full object-cover"
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
        <a
          href={shareLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp पर साझा करें
        </a>
      </div>
    </article>
  );
}
