import type { Metadata } from "next";
import { getEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = { title: "कार्यक्रम" };

// Re-render daily so upcoming/past sorting stays fresh between deploys
export const revalidate = 86400;

export default function EventsPage() {
  const { upcoming, past } = getEvents();

  return (
    <div className="container-site py-14">
      <h1 className="section-title">कार्यक्रम</h1>

      {/* Upcoming */}
      <section className="mb-14">
        <h2 className="mb-6 border-b-2 border-saffron-500 pb-2 font-serif text-2xl font-bold text-saffron-700">
          आगामी कार्यक्रम
        </h2>
        {upcoming.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event.title + event.date} event={event} upcoming />
            ))}
          </div>
        ) : (
          <p className="text-maroon-700">
            अभी कोई आगामी कार्यक्रम घोषित नहीं है। कृपया कुछ समय बाद पुनः देखें।
          </p>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="mb-6 border-b-2 border-maroon-700 pb-2 font-serif text-2xl font-bold text-maroon-800">
          संपन्न कार्यक्रम
        </h2>
        {past.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.title + event.date} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-maroon-700">कोई पूर्व कार्यक्रम उपलब्ध नहीं है।</p>
        )}
      </section>
    </div>
  );
}
