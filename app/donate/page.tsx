import type { Metadata } from "next";
import { siteConfig, waLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: "दान करें" };

export default function DonatePage() {
  return (
    <div className="container-site py-14">
      <h1 className="section-title">दान करें</h1>

      <div className="mx-auto max-w-2xl">
        {/* Why donate */}
        <section className="mb-8 space-y-4 text-center leading-relaxed text-maroon-800">
          <p>
            आपका दान हनुमान जन्मोत्सव, भंडारे, सुंदरकांड पाठ एवं अन्य धार्मिक आयोजनों में सीधे
            उपयोग होता है। हर योगदान — छोटा हो या बड़ा — सेवा कार्य को आगे बढ़ाता है।
          </p>
        </section>

        {/* Trust signals near donation form (spec) */}
        <section className="mb-8 rounded-2xl border-2 border-gold-400 bg-gold-300/20 p-6 text-center">
          <h2 className="mb-2 font-serif text-lg font-bold text-maroon-900">पारदर्शिता</h2>
          <p className="font-medium text-maroon-800">{siteConfig.registrationNumber}</p>
          <p className="mt-2 text-sm text-maroon-700">
            ट्रस्ट एक पंजीकृत संस्था है। सभी दान का उपयोग पूर्ण पारदर्शिता के साथ किया जाता है।
          </p>
        </section>

        {siteConfig.donationsEnabled ? (
          /* Payment gateway checkout mounts here once KYC is confirmed
             (Razorpay/PayU integration — see project tasks) */
          <section className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-maroon-800">भुगतान गेटवे लोड हो रहा है…</p>
          </section>
        ) : (
          /* Placeholder state — online checkout pending trust's payment-account KYC */
          <section className="rounded-2xl bg-white p-8 text-center shadow-md">
            <h2 className="mb-3 font-serif text-2xl font-bold text-maroon-900">
              ऑनलाइन दान सुविधा शीघ्र आ रही है
            </h2>
            <p className="mb-6 text-maroon-800">
              ऑनलाइन भुगतान की सुविधा जल्द ही उपलब्ध होगी। तब तक दान हेतु कृपया हमसे WhatsApp पर
              संपर्क करें — हम आपको दान की विधि बताएँगे।
            </p>
            <a
              href={waLink("नमस्ते, मैं ट्रस्ट को दान देना चाहता/चाहती हूँ। कृपया विधि बताएँ।")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp पर संपर्क करें
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
