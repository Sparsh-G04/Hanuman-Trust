# Project Structure

> Current structure reflecting the event dashboard, API routes, and gallery features.

```
Hanuman_Trust/
├── app/                          → Pages (App Router file-based routing)
│   ├── layout.tsx                   Root layout (fonts, navbar, footer, WhatsApp float)
│   ├── page.tsx                     Home page (scroll animation + dynamic event content)
│   ├── loading.tsx                  Branded loading state (logo pulse animation)
│   ├── globals.css                  Global styles + Tailwind layers
│   ├── icon.svg                     Favicon
│   ├── about/
│   │   └── page.tsx                 About Us — mission, trustees, registration info
│   ├── contact/
│   │   └── page.tsx                 Contact — form → WhatsApp redirect, address, map
│   ├── donate/
│   │   └── page.tsx                 Donate — payment gateway UI, trust signals
│   ├── events/
│   │   ├── page.tsx                 Events listing — upcoming + past (force-dynamic)
│   │   └── [slug]/
│   │       └── page.tsx             Event gallery — masonry grid, lightbox, videos, OG meta
│   ├── dashboard/
│   │   ├── layout.tsx               Dashboard layout (no site navbar/footer)
│   │   └── page.tsx                 Dashboard UI — password-protected CRUD for events
│   └── api/
│       ├── auth/
│       │   └── route.ts             POST — verify dashboard password (server-side)
│       ├── events/
│       │   ├── route.ts             GET all events, POST new event
│       │   ├── next-id/
│       │   │   └── route.ts         GET next available event ID
│       │   └── [slug]/
│       │       └── route.ts         PUT update event, DELETE event + files
│       ├── upload/
│       │   └── route.ts             POST — upload image/video (auto-sequential naming)
│       ├── cleanup/
│       │   └── route.ts             POST — remove orphaned files from public/events/
│       └── payment/              🔜 Payment gateway routes (pending KYC)
│           ├── create-order/
│           │   └── route.ts
│           ├── verify/
│           │   └── route.ts
│           └── webhook/
│               └── route.ts
│
├── components/                   → Reusable UI components (PascalCase)
│   ├── ContactForm.tsx              Contact form → WhatsApp deep link
│   ├── Countdown.tsx                Live day-countdown to next event
│   ├── EventCard.tsx                Event card with responsive image grid + WhatsApp share
│   ├── Footer.tsx                   4-column footer (transparent mobile, solid desktop)
│   ├── GalleryGrid.tsx              Masonry CSS-columns grid + lightbox trigger (client)
│   ├── icons.tsx                    SVG icon components (Facebook, Instagram, etc.)
│   ├── Lightbox.tsx                 Fullscreen image viewer with keyboard/swipe nav (client)
│   ├── nav-links.ts                 Navigation link definitions
│   ├── Navbar.tsx                   Responsive navbar with mobile menu
│   ├── ScrollCanvas.tsx             Scroll-driven 120-frame canvas animation (client)
│   ├── VideoEmbed.tsx               YouTube iframe (nocookie) or HTML5 video player
│   ├── WhatsAppFloat.tsx            Floating WhatsApp button (bottom-right)
│   └── dashboard/
│       ├── EventForm.tsx            Event create/edit form with file upload (client)
│       └── EventList.tsx            Event list with edit/delete actions (client)
│
├── config/                       → Site-wide configuration
│   └── site.ts                      Single source of truth (name, contacts, social, stats, siteUrl)
│
├── data/                         → Event data (read/written by API at runtime)
│   └── events.json                  All events with id, title, date, description, images, videos
│
├── lib/                          → Utility/helper functions
│   ├── events.ts                    Event helpers (getEventsLive, resolveImagePath, resolveVideoPath, YouTube helpers, ID generation)
│   ├── frame-preloader.ts           Progressive image preloader for scroll animation
│   └── supports-webp.ts            WebP format detection utility
│
├── public/                       → Static assets (served as-is)
│   ├── logo.webp                    Trust logo
│   ├── events/                      Event media (structured by event ID)
│   │   ├── event001/
│   │   │   ├── images/              image_001.jpg, image_002.jpg, ...
│   │   │   └── videos/              video_001.mp4, video_002.mp4, ...
│   │   ├── event002/
│   │   │   ├── images/
│   │   │   └── videos/
│   │   └── ...
│   ├── sequence_webp/               Scroll animation frames (WebP, 120 frames)
│   │   └── ezgif-frame-001.webp → 120.webp
│   └── sequence_jpg/                Scroll animation frames (JPG fallback, 120 frames)
│       └── ezgif-frame-001.jpg → 120.jpg
│
├── project_files/                → Documentation (not deployed)
│   ├── project.md                   Full project specification
│   ├── logs.md                      Development changelog
│   └── structure.md                 This file — project structure reference
│
├── .env.local                    → Environment variables (gitignored)
│                                    DASHBOARD_PASSWORD=xxx
├── .gitignore                    → Includes .env*.local
├── AGENTS.md                     → AI agent behavior rules & coding conventions
├── next.config.js                → Next.js config (100MB upload limit)
├── tailwind.config.ts            → Tailwind CSS config (custom colors, fonts)
├── tsconfig.json                 → TypeScript strict mode config
├── postcss.config.js             → PostCSS config (Tailwind + Autoprefixer)
├── package.json                  → Dependencies & scripts
└── package-lock.json             → Lockfile
```

---

## Key Conventions

| Concern | Convention |
|---------|-----------|
| Pages | `page.tsx` inside route folders |
| Components | PascalCase filenames |
| Utilities | camelCase in `lib/` |
| Config | Single file `config/site.ts` |
| Data | `data/events.json` (managed via API) |
| Event media | `public/events/{eventId}/images/` and `/videos/` |
| Media naming | Auto-sequential: `image_001.jpg`, `video_001.mp4` |
| API Routes | `route.ts` inside `app/api/` route folders |
| Auth | Environment variable `DASHBOARD_PASSWORD` in `.env.local` |

---

## Data Flow

```
Dashboard (/dashboard)
    ↓ POST/PUT/DELETE via fetch
API Routes (/api/events, /api/upload)
    ↓ fs.readFileSync / fs.writeFileSync
data/events.json + public/events/{id}/
    ↓ getEventsLive() reads at request time
Main Website (home, events, event detail pages)
    ↓ dynamic rendering (force-dynamic)
User sees updated content immediately
```

---

## Planned Additions (🔜)

### Payment Integration
- **Gateway:** Razorpay or PayU (pending trust KYC confirmation)
- **Files:** `app/api/payment/` routes + `components/PaymentForm.tsx`
- **Flow:** Client-side form → create order API → redirect to gateway → verify webhook → show success

### Cloud Storage Migration
- When event media volume grows, migrate uploads to Cloudinary/S3
- `resolveImagePath` and `resolveVideoPath` already handle full URLs — just swap filenames for cloud URLs
- No component changes needed

### Media Backend
- Future: dedicated media server/API replaces local file writes
- Dashboard will POST to media backend instead of `/api/upload`
- Website will fetch from media backend instead of `/public/events/`
