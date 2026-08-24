# Project Spec: श्री हनुमान जन्मोत्सव सेवा ट्रस्ट — Website

## 1. Overview
A website for a **registered religious trust** (श्री हनुमान जन्मोत्सव सेवा ट्रस्ट) with three core goals:
1. Showcase the trust's events (past + upcoming)
2. Accept online donations/contributions
3. Build donor trust/credibility (registration status, transparency)

**Content language:** Mostly Hindi (Devanagari script) throughout the site.

**Update frequency:** Managed via a password-protected dashboard at `/dashboard`. No direct file editing needed — the dashboard writes to `events.json` and uploads media to the correct folders.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Dynamic rendering for event pages, SSG-compatible for static pages |
| Styling | Tailwind CSS | |
| Events data | `data/events.json` | Managed via dashboard API, read at request time (force-dynamic) |
| Images/Videos | `/public/events/{eventId}/images/` and `/videos/` | Uploaded via dashboard, auto-named sequentially |
| Auth | Password-protected dashboard (env variable) | Server-side verification via `/api/auth` |
| Payments | Razorpay or PayU checkout | 🔜 Pending KYC confirmation |
| Deployment | Vercel | Auto-deploy on push |
| Fonts | Noto Sans Devanagari / Noto Serif Devanagari | Free, clean Hindi rendering |

### events.json structure
```json
[
  {
    "id": "event001",
    "title": "हनुमान जन्मोत्सव 2026",
    "date": "2026-04-02",
    "description": "...",
    "images": ["image_001.jpg", "image_002.jpg"],
    "videos": ["video_001.mp4", "https://www.youtube.com/watch?v=xxx"]
  }
]
```

### Media file organization
```
public/events/event001/images/image_001.jpg
public/events/event001/images/image_002.jpg
public/events/event001/videos/video_001.mp4
```

- Files auto-named sequentially on upload (image_001, image_002, video_001, etc.)
- Renumbered automatically when files are removed (fills gaps)
- YouTube URLs stored as-is in the videos array

---

## 3. Site Structure — Navbar (5 tabs)

| # | Hindi Label | English | Contents |
|---|---|---|---|
| 1 | मुखपृष्ठ | Home | Scroll animation hero, next event countdown, mission, stats, highlights, donate CTA |
| 2 | हमारे बारे में | About Us | Trust mission/history, **registration number**, trustee/committee names |
| 3 | कार्यक्रम | Events | Upcoming + Past events. Each event links to its gallery page |
| 4 | दान करें | Donate | Razorpay/PayU checkout, why donate, registration info |
| 5 | संपर्क करें | Contact | Contact form → WhatsApp redirect, address, map |

**Additional routes (not in navbar):**
- `/events/{eventId}` — Individual event gallery page (masonry grid + lightbox + video embeds)
- `/dashboard` — Password-protected event management dashboard
- Floating WhatsApp icon — persistent across all pages

---

## 4. Key Features

### Event Dashboard (`/dashboard`)
- Password-protected (server-side auth via environment variable)
- CRUD operations: add, edit, delete events
- File upload: images (JPG, PNG, WebP) and videos (MP4, WebM) with auto-sequential naming
- Auto-creates directory structure for each event
- Cleanup utility removes orphaned files
- Changes reflect immediately on the main site (dynamic rendering)

### Event Gallery Pages (`/events/{eventId}`)
- Masonry grid layout (CSS columns) for images at natural aspect ratios
- Fullscreen lightbox on image click (keyboard + swipe navigation)
- YouTube embeds (nocookie) and local MP4 video players
- Open Graph meta tags with first image for WhatsApp preview
- WhatsApp share button shares the event page URL

### Scroll Animation (Home Page)
- Apple-style scroll-driven 120-frame canvas animation
- WebP primary with JPG fallback
- CSS filter: brightness(1.08) saturate(1.14) contrast(1.03)
- Bottom vignette gradient for footer readability
- Frame sequence in `/public/sequence_webp/` and `/public/sequence_jpg/`

### Donations
- Integration: **Razorpay or PayU** online checkout (🔜 pending KYC)
- Show registration number and transparency info near donation form

### Floating WhatsApp icon
- Fixed-position circular button, bottom-right, visible on every page
- Links to `https://wa.me/<owner-number>`

### Contact form → WhatsApp redirect
- Form fields: Name, Message
- On submit: builds a `wa.me` deep link and redirects to WhatsApp

### Footer
- 4-column layout: Trust identity, Quick links, Contact (2 phone numbers + WhatsApp + address), Social media
- Transparent on mobile, solid bg-maroon-950 on desktop
- Copyright bar at bottom

---

## 5. UI / Design Direction

### Color Theme (derived from reference artwork)

| Token | Hex Range | Usage |
|-------|-----------|-------|
| `vermillion` | `#E84430` → `#F05A3E` | Primary accent, CTAs, active states, navbar highlights |
| `sunset-orange` | `#F28C52` → `#F5A65B` | Secondary accent, gradients, hover states |
| `golden-cream` | `#F5D89A` → `#FCECC4` | Backgrounds, glow effects, card surfaces |
| `slate-charcoal` | `#2D3A4A` → `#3F4F5E` | Body text, dark sections, contrast panels |
| `blossom-pink` | `#E85070` → `#F06888` | Decorative accents, highlights, floral touches |
| `deep-night` | `#1A1A2E` → `#2A1A1A` | Footer, dark overlays, mountain silhouettes |

**Design notes:**
- Scroll animation as full-page background on home
- Content overlays animation with transparent/glass sections (no backdrop-blur for performance)
- Text-shadow for readability over animation
- Opaque maroon block separates animation zone from footer
- Mobile-first: primary audience arrives via WhatsApp links on phones

---

## 6. API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth` | POST | Verify dashboard password (server-side) |
| `/api/events` | GET | Return all events |
| `/api/events` | POST | Create new event (auto-generates ID + directories) |
| `/api/events/next-id` | GET | Return next available event ID |
| `/api/events/[slug]` | PUT | Update event (deletes removed files, renumbers remaining) |
| `/api/events/[slug]` | DELETE | Delete event + all its files/directories |
| `/api/upload` | POST | Upload image/video file (auto-sequential naming) |
| `/api/cleanup` | POST | Remove orphaned files not referenced in events.json |

---

## 7. Open Items — Needed From Client
- [ ] Razorpay/PayU account KYC completion status
- [ ] 80G registration status (determines if tax receipts are needed)
- [ ] Domain name and hosting account access
- [ ] Final production URL (to update `siteUrl` in config)
