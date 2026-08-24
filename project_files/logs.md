# Development Logs

## 24 August 2026 (Monday)

### Session Summary
Full-day development session covering scroll animation, event gallery system, admin dashboard, and About page restructure.

---

### Scroll Animation (Home Page)
- Implemented Apple-style scroll-driven 120-frame canvas animation using `components/ScrollCanvas.tsx`
- Built `lib/supports-webp.ts` (WebP detection) and `lib/frame-preloader.ts` (progressive preloader)
- Added CSS filter (`brightness(1.08) saturate(1.14) contrast(1.03)`) + bottom vignette overlay
- Fixed performance: removed all `backdrop-blur`, cached canvas context, preloaded all frames upfront
- Content scrolls over animation with transparent sections and text-shadow for readability
- Full-screen opaque maroon block (`min-h-[100dvh]`) cleanly separates animation zone from footer

### Event Gallery System
- Created `components/GalleryGrid.tsx` — masonry CSS-columns layout with click-to-lightbox
- Created `components/Lightbox.tsx` — fullscreen viewer with keyboard, swipe, image counter, body scroll lock
- Created `components/VideoEmbed.tsx` — YouTube iframe (nocookie) + HTML5 MP4 video player
- Rebuilt `app/events/[slug]/page.tsx` — masonry gallery, video section, Open Graph meta for WhatsApp previews
- Updated `EventCard.tsx` — responsive image grid (1 on mobile, 3 on desktop), WhatsApp share with event page URL

### Event Dashboard (`/dashboard`)
- Password-protected via server-side `/api/auth` route + `DASHBOARD_PASSWORD` env variable
- CRUD: add, edit, delete events via `/api/events` routes
- File upload: images (JPG/PNG/WebP) and videos (MP4/WebM) via `/api/upload`
- Auto-sequential naming: `image_001.jpg`, `image_002.jpg`, `video_001.mp4`, etc.
- Auto-renumbering: when files are removed, remaining files renumber from 001
- Cleanup utility (`/api/cleanup`): removes orphaned files/directories not in events.json
- Next-ID endpoint (`/api/events/next-id`): pre-fetches next event ID for uploads before creation

### Data Architecture
- Added event ID system (`event001`, `event002`, ...) with structured folders: `public/events/{id}/images/` and `/videos/`
- Switched all event pages + home page to `dynamic = "force-dynamic"` for real-time updates
- `lib/events.ts` refactored: `getEventsLive()` reads JSON at runtime, `resolveImagePath()` / `resolveVideoPath()` handle filenames and URLs

### Footer
- 4-column layout: Trust identity, Quick links, Contact (2 phone numbers + WhatsApp + address), Social media
- Transparent on mobile (`bg-transparent`), solid on desktop (`sm:bg-maroon-950`)

### About Page
- Restructured Trustee section: 2-column grid on mobile → 3 → 4 → 5 columns on larger screens
- Circular member photos from `public/members/1.jpg` to `19.jpg` (ranked by position)
- Expanded `siteConfig.trustees` to 19 entries with `name`, `role`, `photo` fields (placeholders for client data)

### Project Setup
- Created `AGENTS.md` at root — AI agent behavior rules, coding conventions, performance mandates
- Updated `project.md`, `structure.md`, `logs.md` to reflect all changes
- Added `.env.local` (gitignored) for dashboard password

---

### Files Created Today
- `lib/supports-webp.ts`
- `lib/frame-preloader.ts`
- `components/ScrollCanvas.tsx`
- `components/GalleryGrid.tsx`
- `components/Lightbox.tsx`
- `components/VideoEmbed.tsx`
- `components/dashboard/EventForm.tsx`
- `components/dashboard/EventList.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- `app/api/auth/route.ts`
- `app/api/events/route.ts`
- `app/api/events/next-id/route.ts`
- `app/api/events/[slug]/route.ts`
- `app/api/upload/route.ts`
- `app/api/cleanup/route.ts`
- `.env.local`

### Files Modified Today
- `app/page.tsx` (home — scroll animation + dynamic rendering)
- `app/events/page.tsx` (dynamic rendering)
- `app/events/[slug]/page.tsx` (full rebuild — gallery, OG meta, dynamic)
- `app/about/page.tsx` (trustee grid with photos)
- `components/EventCard.tsx` (responsive images, share URL)
- `components/Footer.tsx` (4-col, 2 phones, transparent mobile)
- `config/site.ts` (siteUrl, phone_1/2, expanded trustees with photos, stats)
- `lib/events.ts` (full refactor — ID system, live reading, path resolvers)
- `data/events.json` (ID-based schema)
- `next.config.js` (100MB upload limit)
- `AGENTS.md` (project documentation reference)
- `project_files/project.md`
- `project_files/structure.md`
