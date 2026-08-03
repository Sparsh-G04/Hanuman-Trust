import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getEvents, formatDateHi, getEventSlides } from "@/lib/events";
import Countdown from "@/components/Countdown";
import EventCard from "@/components/EventCard";
import TrustCarousel from "@/components/TrustCarousel";

// Re-render daily so upcoming/past sorting stays fresh between deploys
export const revalidate = 86400;

export default function HomePage() {
  const { upcoming, past } = getEvents();
  const nextEvent = upcoming[0] ?? null;
  const slides = getEventSlides([...upcoming, ...past]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-saffron-700 text-white">
        <div className="container-site flex flex-col items-center gap-5 py-12 text-center sm:gap-6 sm:py-24">
          <Image src="/logo.svg" alt="लोगो" width={110} height={110} priority className="h-20 w-20 sm:h-28 sm:w-28" />
          <h1 className="font-serif text-2xl font-bold sm:text-5xl">{siteConfig.name}</h1>
          <p className="text-base text-gold-300 sm:text-2xl">{siteConfig.tagline}</p>

          {nextEvent && (
            <div className="mt-2 w-full max-w-md rounded-2xl bg-white/10 px-5 py-5 backdrop-blur sm:mt-4 sm:px-8 sm:py-6">
              <p className="mb-1 text-sm uppercase tracking-wide text-saffron-200">आगामी कार्यक्रम</p>
              <h2 className="mb-2 font-serif text-xl font-bold sm:text-2xl">{nextEvent.title}</h2>
              <p className="mb-3 text-saffron-100">{formatDateHi(nextEvent.date)}</p>
              <Countdown targetDate={nextEvent.date} />
            </div>
          )}

          <div className="mt-2 flex w-full max-w-md flex-col gap-3 sm:mt-4 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/donate" className="btn-primary text-center">
              दान करें
            </Link>
            <Link
              href="/events"
              className="inline-block rounded-full border-2 border-white px-6 py-3 text-center font-bold text-white transition hover:bg-white hover:text-maroon-900"
            >
              सभी कार्यक्रम देखें
            </Link>
          </div>
        </div>
      </section>

      {/* Trust gallery carousel */}
      <TrustCarousel slides={slides} />

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
