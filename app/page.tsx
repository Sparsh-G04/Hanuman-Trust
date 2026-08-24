import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getEvents, formatDateHi, getEventSlides } from "@/lib/events";
import Countdown from "@/components/Countdown";
import EventCard from "@/components/EventCard";
import ScrollCanvas from "@/components/ScrollCanvas";

// Dynamic rendering — always shows latest event data
export const dynamic = "force-dynamic";

export default function HomePage() {
  const { upcoming, past } = getEvents();
  const nextEvent = upcoming[0] ?? null;
  const slides = getEventSlides([...upcoming, ...past]);

  return (
    <>
      {/* Fixed fullscreen canvas — renders behind all content */}
      <ScrollCanvas />

      {/* All page content scrolls over the canvas */}
      <div className="relative z-10 pt-[180px]">
        {/* Hero — content floats directly over animation */}
        <section className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-5 px-4 py-16 text-center text-white sm:gap-6 sm:py-24">
            <Image
              src="/logo.webp"
              alt="लोगो"
              width={110}
              height={110}
              priority
              className="h-30 w-25 drop-shadow-lg sm:h-28 sm:w-28"
            />
            <h1 className="font-serif text-3xl font-bold sm:text-5xl [text-shadow:_0_2px_30px_rgba(0,0,0,0.6)]">
              {siteConfig.name}
            </h1>
            <p className="text-xl text-gold-300 sm:text-2xl [text-shadow:_0_1px_20px_rgba(0,0,0,0.5)]">
              {siteConfig.tagline}
            </p>

            {nextEvent && (
              <div className="mt-2 w-full max-w-md rounded-2xl border border-white/15 bg-black/35 px-5 py-5 sm:mt-4 sm:px-8 sm:py-6">
                <p className="mb-1 text-sm uppercase tracking-wide text-saffron-200">
                  आगामी कार्यक्रम
                </p>
                <h2 className="mb-2 font-serif text-xl font-bold sm:text-2xl">
                  {nextEvent.title}
                </h2>
                <p className="mb-3 text-saffron-100">{formatDateHi(nextEvent.date)}</p>
                <Countdown targetDate={nextEvent.date} />
              </div>
            )}

            <div className="mt-2 flex w-full max-w-md flex-col gap-3 sm:mt-4 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/donate" className="btn-primary text-center">
                दान करें
              </Link>
              <Link href="/events" className="btn-primary text-center">
                सभी कार्यक्रम देखें
              </Link>
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="py-16 sm:py-24">
          <div className="container-site text-center">
            <h2 className="mb-10 font-serif text-2xl font-bold text-gold-300 sm:text-4xl [text-shadow:_0_2px_30px_rgba(0,0,0,0.6)]">
              हमारा उद्देश्य
            </h2>
            <p className="mx-auto mb-12 max-w-3xl rounded-xl bg-black/30 px-5 py-4 text-base leading-relaxed text-white/95 sm:text-lg">
              {siteConfig.mission}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {siteConfig.values.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/35 p-5 transition hover:bg-black/45"
                >
                  <span className="mb-3 block text-4xl text-red-500 font-bold">{item.icon}</span>
                  <h3 className="mb-2 font-serif text-lg font-bold text-gold-300">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/85">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 sm:py-24">
          <div className="container-site">
            <h2 className="mb-10 text-center font-serif text-2xl font-bold text-white sm:text-4xl [text-shadow:_0_2px_30px_rgba(0,0,0,0.6)]">
              संख्या में सेवा
            </h2>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {siteConfig.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-black/35 p-5 text-center"
                >
                  <p className="mb-2 font-serif text-3xl font-bold text-saffron-400 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-white/85">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past events highlights */}
        {past.length > 0 && (
          <section className="py-16 sm:py-24">
            <div className="container-site">
              <h2 className="mb-8 text-center font-serif text-2xl font-bold text-white sm:text-4xl [text-shadow:_0_2px_30px_rgba(0,0,0,0.6)]">
                झलकियाँ
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {past.slice(0, 4).map((event) => (
                  <EventCard key={event.title + event.date} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Donate CTA */}
        <section className="py-16 sm:py-24">
          <div className="container-site flex justify-center">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/35 px-6 py-8 text-center">
              <h2 className="mb-4 font-serif text-2xl font-bold text-gold-300 sm:text-3xl">
                सेवा में सहयोग करें
              </h2>
              <p className="mb-2 text-white/90">
                आपका दान भंडारे, सुंदरकांड पाठ एवं जन्मोत्सव के आयोजनों में सीधे उपयोग होता है।
              </p>
              <p className="mb-6 text-sm font-medium text-white/70">
                {siteConfig.registrationNumber}
              </p>
              <Link href="/donate" className="btn-primary">
                अभी दान करें
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
