"use client";

import { useEffect, useState } from "react";
import type { EventSlide } from "@/lib/events";

export default function TrustCarousel({ slides }: { slides: EventSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index] ?? slides[0];

  return (
    <section className="py-14">
      <div className="container-site">
        <h2 className="section-title">ट्रस्ट की झलकियाँ</h2>
        <div className="overflow-hidden rounded-3xl bg-maroon-950 shadow-2xl">
          <div className="relative min-h-[560px]">
            {slides.map((slide, slideIndex) => (
              <img
                key={`${slide.src}-${slideIndex}`}
                src={slide.src}
                alt={slide.title}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                  slideIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/88 via-maroon-900/62 to-maroon-800/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

            <div className="relative flex min-h-[560px] flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-saffron-100 backdrop-blur">
                  ट्रस्ट फोटो गैलरी
                </p>
                <h3 className="font-serif text-3xl font-bold leading-tight sm:text-5xl">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                  {current.caption}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-xl rounded-3xl border border-white/15 bg-black/20 p-5 backdrop-blur-md sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-saffron-200">
                    स्वचालित स्लाइडशो
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                    आयोजन, भंडारा, सुंदरकांड पाठ और जन्मोत्सव की यादें पृष्ठभूमि में बदलती रहती हैं।
                  </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-black/20 p-4 backdrop-blur-md sm:p-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length)}
                      className="min-h-[44px] rounded-full border border-white/40 px-4 py-2 font-bold text-white transition hover:bg-white hover:text-maroon-900"
                    >
                      पिछला
                    </button>

                    <div className="flex gap-2" aria-label="स्लाइड संकेतक">
                      {slides.map((slide, slideIndex) => (
                        <button
                          key={`${slide.src}-indicator-${slideIndex}`}
                          type="button"
                          aria-label={`${slide.title} दिखाएँ`}
                          onClick={() => setIndex(slideIndex)}
                          className={`h-2.5 rounded-full transition-all ${
                            slideIndex === index ? "w-8 bg-saffron-300" : "w-2.5 bg-white/55"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIndex((currentIndex) => (currentIndex + 1) % slides.length)}
                      className="min-h-[44px] rounded-full bg-saffron-600 px-4 py-2 font-bold text-white transition hover:bg-saffron-700"
                    >
                      अगला
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
