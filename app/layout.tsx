import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const notoSans = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-devanagari-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} — ${siteConfig.tagline}। कार्यक्रम, दान एवं संपर्क की जानकारी।`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Browser chrome (address bar) matches the maroon navbar on mobile
  themeColor: "#5c1a1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans text-maroon-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
