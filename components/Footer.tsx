import Link from "next/link";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/components/nav-links";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-maroon-950 text-maroon-100">
      <div className="container-site grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">{siteConfig.name}</h3>
          <p className="text-sm leading-relaxed">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm">{siteConfig.registrationNumber}</p>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">त्वरित लिंक</h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-bold text-gold-300">हमसे जुड़ें</h3>
          <div className="flex gap-4">
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold-300">
                <FacebookIcon className="h-6 w-6" />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold-300">
                <InstagramIcon className="h-6 w-6" />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gold-300">
                <YouTubeIcon className="h-6 w-6" />
              </a>
            )}
          </div>
          <p className="mt-4 text-sm">{siteConfig.address}</p>
        </div>
      </div>
      <div className="border-t border-maroon-900 py-4 text-center text-xs text-maroon-300">
        © {new Date().getFullYear()} {siteConfig.name} — सर्वाधिकार सुरक्षित
      </div>
    </footer>
  );
}
