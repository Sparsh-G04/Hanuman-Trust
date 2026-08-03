import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvents, getEventBySlug, getEventSlug, formatDateHi } from "@/lib/events";
import { WhatsAppIcon } from "@/components/icons";

export const revalidate = 86400;

export async function generateStaticParams() {
  const { upcoming, past } = getEvents();
  return [...upcoming, ...past].map((event) => ({ slug: getEventSlug(event) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = getEventBySlug(params.slug);

  if (!event) {
    return { title: "कार्यक्रम नहीं मिला" };
  }

  return {
    title: `${event.title}`,
    description: event.description,
  };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const shareText = `${event.title} — ${formatDateHi(event.date)}\n${event.description}`;
  const shareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="container-site py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/events" className="text-sm font-semibold text-maroon-700 hover:text-maroon-900">
          ← सभी कार्यक्रमों पर वापस
        </Link>
        <span className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-800">
          कार्यक्रम गैलरी
        </span>
      </div>

      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
        {event.images.length > 0 && (
          <div className="grid gap-1 md:grid-cols-[1.35fr_0.65fr]">
            <img
              src={`/events/${event.images[0]}`}
              alt={event.title}
              className="h-full min-h-[280px] w-full object-cover md:min-h-[420px]"
            />
            <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-1">
              {event.images.slice(1).map((image) => (
                <img
                  key={image}
                  src={`/events/${image}`}
                  alt={event.title}
                  className="h-44 w-full object-cover md:h-[208px]"
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-maroon-100 px-3 py-1 text-xs font-bold text-maroon-800">
              {formatDateHi(event.date)}
            </span>
            <span className="rounded-full bg-gold-300/30 px-3 py-1 text-xs font-bold text-maroon-700">
              सभी तस्वीरें
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 sm:text-4xl">{event.title}</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-maroon-800">{event.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-bold text-white transition hover:brightness-110"
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
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 font-serif text-2xl font-bold text-maroon-900">फोटो गैलरी</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.images.map((image, index) => (
              <figure key={image} className="overflow-hidden rounded-2xl bg-white shadow-md">
                <img
                  src={`/events/${image}`}
                  alt={`${event.title} - फोटो ${index + 1}`}
                  className="h-64 w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-maroon-700">
                  फोटो {index + 1}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
