import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "संपर्क करें" };

export default function ContactPage() {
  return (
    <div className="container-site py-14">
      <h1 className="section-title">संपर्क करें</h1>

      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-maroon-900">संदेश भेजें</h2>
          <ContactForm />
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-maroon-900">पता</h2>
          <p className="mb-6 leading-relaxed text-maroon-800">{siteConfig.address}</p>

          {siteConfig.mapEmbedUrl ? (
            <iframe
              src={siteConfig.mapEmbedUrl}
              title="स्थान मानचित्र"
              className="h-64 w-full rounded-2xl border-0 shadow-md"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            /* TODO(client): set mapEmbedUrl in config/site.ts to show Google Map here */
            <div className="flex h-64 items-center justify-center rounded-2xl bg-saffron-100 text-maroon-700">
              मानचित्र शीघ्र उपलब्ध होगा
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
