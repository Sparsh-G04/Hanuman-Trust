import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "हमारे बारे में" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-site py-14">
        <h1 className="section-title">हमारे बारे में</h1>

        <section className="mx-auto max-w-3xl space-y-4 leading-relaxed text-maroon-800">
          <p>
            {siteConfig.name} एक पंजीकृत धार्मिक ट्रस्ट है, जो श्री हनुमान जी की सेवा एवं भक्ति के
            प्रचार-प्रसार हेतु समर्पित है। ट्रस्ट प्रतिवर्ष हनुमान जन्मोत्सव, सुंदरकांड पाठ, भंडारे एवं
            अन्य धार्मिक आयोजनों का संचालन करता है।
          </p>
          <p>
            हम विगत 22 वर्षों से भक्त शिरोमणि श्री हनुमान बाबा का
            जन्मोत्सव बहुत ही हर्ष और धूमधाम से मनाते आ रहे हैं।
          </p>
          <p>
            विगत 3 वर्षों से प्रभु की आसिम कृपा से श्रीमद् भगवत कथा का भव्य आयोजन कर रहे हैं।
          </p>
          <p>
            प्रत्येक वर्ष स्वतंत्रता दिवस समारोह मनाया जाता रहा है।
            अपने हिन्दू धर्म के सभी त्यौहार और महत्वपूर्ण तिथियों पर भंडारा प्रसाद का वितरण प्रमुख रूप से किया जाता रहा है।
          </p>
        </section>

        <h1 className="section-title">आगामी योजनायें</h1>
        <section className="mx-auto max-w-3xl space-y-4 leading-relaxed text-maroon-800">

          <p>गोशाला निर्माण के लिए प्रयासरत</p>
        </section>

        {/* Registration — trust signal */}
        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-gold-400 bg-gold-300/20 p-6 text-center">
          <h2 className="mb-2 font-serif text-xl font-bold text-maroon-900">पंजीकरण विवरण</h2>
          <p className="text-lg font-medium text-maroon-800">{siteConfig.registrationNumber}</p>
        </section>

        {/* Trustees / Members */}
        <section className="mt-14">
          <h2 className="section-title">ट्रस्टी / समिति सदस्य</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {siteConfig.trustees.map((trustee, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trustee.photo}
                  alt={trustee.name}
                  className="mb-3 h-28 w-28 rounded-full object-cover shadow-md sm:h-32 sm:w-32"
                  loading="lazy"
                />
                <h3 className="text-sm font-bold text-maroon-900 sm:text-base">{trustee.name}</h3>
                <p className="text-xs text-maroon-700 sm:text-sm">{trustee.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
