"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/components/nav-links";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-maroon-900 text-white shadow-md">
      <div className="container-site flex items-center justify-between py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.webp" alt="लोगो" width={44} height={44} priority className="h-15 w-150 shrink-0 sm:h-11 sm:w-11" />
          <span className="min-w-0 font-serif text-xl pt-3 font-bold leading-snug sm:text-lg lg:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="मुख्य नेविगेशन">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 font-medium transition hover:bg-maroon-800 ${
                pathname === link.href ? "bg-saffron-600 text-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-2 flex items-center gap-2 border-l border-maroon-700 pl-3">
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gold-300 hover:text-white">
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gold-300 hover:text-white">
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gold-300 hover:text-white">
                <YouTubeIcon className="h-4 w-4" />
              </a>
            )}
          </span>
        </nav>

        {/* Mobile hamburger — 48px tap target */}
        <button
          className="-mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded hover:bg-maroon-800 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "मेन्यू बंद करें" : "मेन्यू खोलें"}
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-maroon-800 lg:hidden" aria-label="मोबाइल नेविगेशन">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-6 py-4 font-medium hover:bg-maroon-800 ${
                pathname === link.href ? "bg-saffron-600" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
