import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getEvents, formatDateHi } from "@/lib/events";
import Countdown from "@/components/Countdown";
import EventCard from "@/components/EventCard";

// Re-render daily so upcoming/past sorting stays fresh between deploys
export const revalidate = 86400;

export default function HomePage() {
  const { upcoming, past } = getEvents();
  const nextEvent = upcoming[0] ?? null;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-saffron-700 text-white">
        <div className="container-site flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <Image src="/logo.svg" alt="लोगो" width={110} height={110} priority />
          <h1 className="font-serif text-3xl font-bold sm:text-5xl">{siteConfig.name}</h1>
          <p className="text-lg text-gold-300 sm:text-2xl">{siteConfig.tagline}</p>

          {nextEvent && (
            <div className="mt-4 rounded-2xl bg-white/10 px-8 py-6 backdrop-blur">
              <p className="mb-1 text-sm uppercase tracking-wide text-saffron-200">आगामी कार्यक्रम</p>
              <h2 className="mb-2 font-serif text-2xl font-bold">{nextEvent.title}</h2>
              <p className="mb-3 text-saffron-100">{formatDateHi(nextEvent.date)}</p>
              <Countdown targetDate={nextEvent.date} />
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              दान करें
            </Link>
            <Link
              href="/events"
              className="inline-block rounded-full border-2 border-white px-6 py-3 font-bold text-white transition hover:bg-white hover:text-maroon-900"
            >
              सभी कार्यक्रम देखें
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights — recent events */}
      {past.length > 0 && (
        <section className="py-14">
          <div className="container-site">
            <h2 className="section-title">झलकियाँ</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {past.slice(0, 2).map((event) => (
                <EventCard key={event.title + event.date} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust signal + donate CTA */}
      <section className="bg-saffron-100 py-14">
        <div className="container-site text-center">
          <h2 className="section-title">सेवा में सहयोग करें</h2>
          <p className="mx-auto mb-2 max-w-2xl text-maroon-800">
            आपका दान भंडारे, सुंदरकांड पाठ एवं जन्मोत्सव के आयोजनों में सीधे उपयोग होता है।
          </p>
          <p className="mb-6 text-sm font-medium text-maroon-700">{siteConfig.registrationNumber}</p>
          <Link href="/donate" className="btn-primary">
            अभी दान करें
          </Link>
        </div>
      </section>
    </>
  );
}
