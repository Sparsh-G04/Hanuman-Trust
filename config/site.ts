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

  // TODO(client): trust registration number — shown on About & Donate pages
  registrationNumber: "पंजीकरण संख्या: XXXXXXXX (प्रतीक्षित)",

  // ── Contact ───────────────────────────────────────────────────────
  // TODO(client): owner's WhatsApp number in international format, digits only (e.g. "919876543210")
  whatsappNumber: "910000000000",

  // TODO(client): address for Contact page
  address: "मंदिर परिसर, मुख्य मार्ग, शहर — पिन कोड (पता प्रतीक्षित)",

  // TODO(client): Google Maps embed URL (Share → Embed a map → copy src)
  mapEmbedUrl: "",

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
};

export function waLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
