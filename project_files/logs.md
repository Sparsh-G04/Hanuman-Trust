# Development Logs

## 24 August 2026 (Monday)

- Created `AGENTS.md` at project root — defines agent behavior rules, coding conventions, tech stack constraints, and performance guidelines for any AI agent working on this codebase.
- Updated `project_files/project.md` — added new color theme (sunset-inspired palette from reference artwork) and documented the scroll animation feature spec.
- Implemented Apple-style scroll-driven frame animation on Home page — built `lib/supports-webp.ts`, `lib/frame-preloader.ts`, `components/ScrollCanvas.tsx`, restructured `app/page.tsx` with new content sections (Mission, Stats, Upcoming Events), and added config data to `config/site.ts`.
- Added CSS filter (`brightness(1.08) saturate(1.14) contrast(1.03)`) to ScrollCanvas for vivid colors + bottom vignette overlay for footer readability.
- Fixed scroll animation performance — removed all `backdrop-blur` from content sections, cached canvas context, preload all 120 frames upfront, removed DPR scaling overhead.
- Restructured home page content: transparent sections over animation, text-shadow for readability, opaque maroon block before footer to cleanly separate animation from footer zone.
- Enhanced Footer component — 4-column layout with 2 phone numbers, WhatsApp link, address, social icons with bordered circles. Transparent on mobile, solid on desktop.
- Implemented Event Gallery Page — masonry CSS-columns grid, fullscreen lightbox with keyboard/swipe navigation, YouTube embed (nocookie) + MP4 video player, Open Graph meta tags for WhatsApp rich previews.
- Created `components/GalleryGrid.tsx` (client) — masonry layout with click-to-open lightbox.
- Created `components/Lightbox.tsx` (client) — fullscreen image viewer with prev/next arrows, swipe, keyboard nav, image counter, body scroll lock.
- Created `components/VideoEmbed.tsx` — YouTube iframe or HTML5 video with responsive 16:9 container.
- Updated `EventCard.tsx` — WhatsApp share now sends event page URL (for OG preview), responsive image grid (1 image on mobile, up to 3 on desktop).
- Implemented Event Dashboard (`/dashboard`) — password-protected CRUD interface for events.
- Created API routes: `/api/events` (GET/POST), `/api/events/[slug]` (PUT/DELETE), `/api/upload` (POST), `/api/auth` (POST), `/api/events/next-id` (GET), `/api/cleanup` (POST).
- Dashboard features: add/edit/delete events, upload images and videos from device, auto-sequential file naming (image_001, image_002, video_001, etc.), auto-renumbering when files are removed.
- Added cleanup utility — removes orphaned files/directories not referenced in events.json.
- Switched event pages and home page to `dynamic = "force-dynamic"` for real-time updates without rebuild.
- Added event ID system (event001, event002, ...) with structured file paths: `public/events/{id}/images/` and `public/events/{id}/videos/`.
- Password protection via server-side `/api/auth` route with `DASHBOARD_PASSWORD` environment variable (`.env.local`, gitignored).
