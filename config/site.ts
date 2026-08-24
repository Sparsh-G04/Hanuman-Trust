/**
 * ═══════════════════════════════════════════════════════════════════
 *  CENTRAL SITE CONFIG — all client-provided data lives here.
 *  Every value marked TODO is a PLACEHOLDER awaiting client input.
 *  Swap values here once; the whole site updates.
 * ═══════════════════════════════════════════════════════════════════
 */

export const siteConfig = {
  // ── Identity ──────────────────────────────────────────────────────
  name: "श्री हनुमान जन्मोत्सव सेवा ट्रस्ट",
  nameEn: "Shri Hanuman Janmotsav Seva Trust",
  tagline: "सेवा, भक्ति और समर्पण",

  // ── Site URL (swap to production domain when deployed) ────────────
  siteUrl: "http://localhost:3000",

  // TODO(client): trust registration number — shown on About & Donate pages
  registrationNumber: "पंजीकरण संख्या: 2024/23/IV/241 (प्रतीक्षित)",

  // ── Contact ───────────────────────────────────────────────────────
  // TODO(client): owner's WhatsApp number in international format, digits only (e.g. "919876543210")
  whatsappNumber: "919899429222",

  // TODO(client): contact phone number for display (formatted for readability)
  phone_1: "+91 9811250265",
  phone_2: "+91 9899429222",

  // TODO(client): address for Contact page
  address: `दिलशाद गार्डन दिल्ली
 — 110095 (पता प्रतीक्षित)`,

  // TODO(client): Google Maps embed URL (Share → Embed a map → copy src)
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d218.77040454846343!2d77.32440230173275!3d28.67987909088346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1787564113363!5m2!1sen!2sin",

  // ── Social links ──────────────────────────────────────────────────
  // TODO(client): real profile URLs; leave "" to hide an icon
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },

  // ── Donations ─────────────────────────────────────────────────────
  // Gateway integration pending trust's Razorpay/PayU KYC confirmation.
  // When ready: set donationsEnabled = true and wire the checkout.
  donationsEnabled: false,

  // ── Trustees ──────────────────────────────────────────────────────
  // TODO(client): real trustee/committee names (and photos → /public/trustees/)
  trustees: [
    { name: "श्री (नाम प्रतीक्षित)", role: "अध्यक्ष" },
    { name: "श्री (नाम प्रतीक्षित)", role: "सचिव" },
    { name: "श्री (नाम प्रतीक्षित)", role: "कोषाध्यक्ष" },
  ],

  // ── Mission & Stats (Home page sections) ──────────────────────────
  mission: "श्री हनुमान जन्मोत्सव सेवा ट्रस्ट का उद्देश्य भक्ति, सेवा और समर्पण की भावना से समाज में धार्मिक आयोजनों का संचालन करना है। हम हनुमान जन्मोत्सव, सुंदरकांड पाठ, भंडारा एवं अन्य धार्मिक कार्यक्रमों के माध्यम से जन-जन तक सेवा पहुँचाते हैं।",

  values: [
    { icon: "•|| जय श्री राम ||•", title: "भक्ति", description: "श्री हनुमान जी की आराधना एवं भक्ति का प्रसार" },
    { icon: "🕉️", title: "सेवा", description: "निःस्वार्थ भाव से समाज की सेवा" },
    { icon: "🪔", title: "समर्पण", description: "धर्म और संस्कृति के प्रति पूर्ण समर्पण" },
    { icon: "🔱", title: "एकता", description: "समाज को एकजुट करने का प्रयास" },
  ],

  // TODO(client): replace with actual stats when available
  stats: [
    { value: "22+", label: "वर्षों से सेवारत" },
    { value: "40+", label: "कार्यक्रम आयोजित" },
    { value: "10000+", label: "भोजन प्रसाद वितरित" },
    { value: "2004", label: "स्थापित वर्ष" },
  ],
};

export function waLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
