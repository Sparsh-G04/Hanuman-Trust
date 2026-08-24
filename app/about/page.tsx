import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "हमारे बारे में" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-site py-14">
        <h1 className="section-title">हमारे बारे में</h1>

        <section className="mx-auto max-w-3xl space-y-4 leading-relaxed text-maroon-800">
          {/* TODO(client): replace with the trust's real mission/history text */}
          <p>
            {siteConfig.name} एक पंजीकृत धार्मिक ट्रस्ट है, जो श्री हनुमान जी की सेवा एवं भक्ति के
            प्रचार-प्रसार हेतु समर्पित है। ट्रस्ट प्रतिवर्ष हनुमान जन्मोत्सव, सुंदरकांड पाठ, भंडारे एवं
            अन्य धार्मिक आयोजनों का संचालन करता है।
          </p>
          <p>
            हमारा उद्देश्य समाज में सेवा, भक्ति और समर्पण की भावना को बढ़ावा देना तथा सभी आयोजनों में
            पूर्ण पारदर्शिता बनाए रखना है।
          </p>
        </section>

        {/* Registration — trust signal */}
        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-gold-400 bg-gold-300/20 p-6 text-center">
          <h2 className="mb-2 font-serif text-xl font-bold text-maroon-900">पंजीकरण विवरण</h2>
          <p className="text-lg font-medium text-maroon-800">{siteConfig.registrationNumber}</p>
        </section>

        {/* Trustees */}
        <section className="mt-14">
          <h2 className="section-title">ट्रस्टी / समिति सदस्य</h2>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {siteConfig.trustees.map((trustee, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 text-center shadow-md">
                {/* TODO(client): trustee photos → /public/trustees/ */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-saffron-100 font-serif text-3xl text-saffron-700">
                  ॐ
                </div>
                <h3 className="font-bold text-maroon-900">{trustee.name}</h3>
                <p className="text-sm text-maroon-700">{trustee.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
