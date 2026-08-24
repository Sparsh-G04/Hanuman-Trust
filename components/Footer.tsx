import Link from "next/link";
import { siteConfig, waLink } from "@/config/site";
import { navLinks } from "@/components/nav-links";
import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="relative z-20 bg-maroon-950/70 text-maroon-100 sm:bg-maroon-950/75 pt-10">
      <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Trust identity */}
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">
            {siteConfig.name}
          </h3>
          <p className="text-sm leading-relaxed">{siteConfig.tagline}</p>
          <p className="mt-3 text-xs text-maroon-300">{siteConfig.registrationNumber}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">त्वरित लिंक</h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">संपर्क</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`tel:${siteConfig.phone_1.replace(/\s/g, "")}`}
                className="transition hover:text-gold-300"
                aria-label="फ़ोन नंबर 1"
              >
                📞 {siteConfig.phone_1}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone_2.replace(/\s/g, "")}`}
                className="transition hover:text-gold-300"
                aria-label="फ़ोन नंबर 2"
              >
                📞 {siteConfig.phone_2}
              </a>
            </li>

            <li className="leading-relaxed text-maroon-200">
              📍 {siteConfig.address}
            </li>
          </ul>
        </div>

        {/* Social media */}
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">हमसे जुड़ें</h3>
          <div className="flex gap-4">
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-maroon-800 p-2.5 transition hover:border-gold-300 hover:text-gold-300"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-maroon-800 p-2.5 transition hover:border-gold-300 hover:text-gold-300"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full border border-maroon-800 p-2.5 transition hover:border-gold-300 hover:text-gold-300"
              >
                <YouTubeIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-maroon-900 py-4 text-center text-xs text-maroon-400">
        © {new Date().getFullYear()} {siteConfig.name} — सर्वाधिकार सुरक्षित
      </div>
    </footer>
  );
}
