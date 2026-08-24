# Implementation Plan: Event Gallery Page Rebuild

## Overview

Rebuild the event detail page to support large photo galleries with a masonry layout, fullscreen lightbox viewer, embedded videos, and OG metadata for WhatsApp rich link previews. Implementation uses TypeScript, Next.js 14 App Router (SSG), and Tailwind CSS — no new dependencies.

## Tasks

- [ ] 1. Update data layer and configuration
  - [ ] 1.1 Add `videos` field to `data/events.json`
    - Add `"videos": []` to every existing event object for backward compatibility
    - _Requirements: Design — Data Models, Error Scenario 2_

  - [ ] 1.2 Update `TrustEvent` interface and add video helpers in `lib/events.ts`
    - Add `videos: string[]` to the `TrustEvent` interface
    - Add `isYouTubeUrl(url: string): boolean` function
    - Add `getYouTubeEmbedUrl(url: string): string` function with regex patterns for watch, short, and embed URL formats
    - Add `isMp4File(url: string): boolean` function
    - Ensure `getEventBySlug` and `getEvents` handle the videos field with `?? []` fallback
    - _Requirements: Design — Data Models, Algorithmic Pseudocode (Video URL Detection), Error Scenario 2_

  - [ ] 1.3 Add `siteUrl` to `config/site.ts`
    - Add `siteUrl: "http://localhost:3000"` to the `siteConfig` object
    - _Requirements: Design — config/site.ts Addition, Key Function 1 (generateMetadata)_

- [ ] 2. Checkpoint — Ensure build passes with updated data schema
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Create Lightbox client component
  - [ ] 3.1 Create `components/Lightbox.tsx`
    - Add `"use client"` directive
    - Implement `LightboxProps` interface: `images: { src: string; alt: string }[]`, `initialIndex: number`, `onClose: () => void`
    - Render fullscreen dark overlay (`bg-black/95`, fixed positioning, z-50)
    - Display current image centered with object-contain
    - Show image counter ("3 / 24") at top
    - Implement close button (X) with min 48px tap target
    - Implement left/right arrow navigation buttons with min 48px tap targets
    - Add keyboard navigation: ArrowLeft (prev), ArrowRight (next), Escape (close)
    - Add touch swipe detection with 50px threshold (swipe left = next, swipe right = prev)
    - Wrap-around navigation: last→first and first→last
    - Lock body scroll on mount (`document.body.style.overflow = "hidden"`), restore on unmount
    - Preload adjacent images (currentIndex ± 1) for smooth navigation
    - All ARIA labels in Hindi
    - _Requirements: Design — Component 2 (Lightbox), Lightbox Navigation Algorithm, Key Function 2, Properties 1 & 4_

  - [ ]* 3.2 Write property tests for Lightbox navigation logic
    - **Property 1: Lightbox index always in bounds** — after any sequence of next/prev operations, currentIndex satisfies `0 <= currentIndex < images.length`
    - **Property 4: Body scroll lock** — overflow is "hidden" when open, restored when closed
    - **Validates: Design — Correctness Properties 1 & 4**

- [ ] 4. Create GalleryGrid client component
  - [ ] 4.1 Create `components/GalleryGrid.tsx`
    - Add `"use client"` directive
    - Implement `GalleryGridProps` interface: `images: { src: string; alt: string }[]`
    - Render CSS columns masonry layout: `columns-2 sm:columns-3 lg:columns-4 gap-3`
    - Each image item: `mb-3 break-inside-avoid overflow-hidden rounded-xl`
    - Use `<img>` tags with `loading="lazy"` for all images
    - Track `selectedIndex` state (null when lightbox closed)
    - On image click: set selectedIndex to open Lightbox
    - Conditionally render Lightbox component when selectedIndex is not null
    - Pass `onClose` handler to reset selectedIndex to null
    - _Requirements: Design — Component 3 (GalleryTrigger/GalleryGrid), Masonry Grid Layout Algorithm, Performance Considerations_

- [ ] 5. Create VideoEmbed server component
  - [ ] 5.1 Create `components/VideoEmbed.tsx`
    - Server component (no `"use client"`)
    - Implement `VideoEmbedProps` interface: `url: string`
    - Detect YouTube URL vs MP4 file using helpers from `lib/events.ts`
    - YouTube: render iframe with `youtube-nocookie.com` embed URL, `loading="lazy"`, responsive `aspect-video` container
    - MP4: render HTML5 `<video>` tag with controls, `aspect-video` container, preload="metadata"
    - Wrap in responsive container with 16:9 aspect ratio (`aspect-video` Tailwind class)
    - _Requirements: Design — Component 4 (VideoEmbed), Video URL Detection Algorithm, Security Considerations_

- [ ] 6. Checkpoint — Ensure build passes with new components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Rebuild event detail page
  - [ ] 7.1 Rewrite `app/events/[slug]/page.tsx`
    - Update `generateMetadata` to produce OG tags: `og:title`, `og:description`, `og:image` (first event image or fallback), `og:url` using `siteConfig.siteUrl`
    - Update `generateStaticParams` to cover all events
    - Rebuild page layout: event header with title, date badge, description
    - Replace existing image grid with `GalleryGrid` component (pass mapped images with src and Hindi alt text)
    - Add `VideoEmbed` section below gallery for `event.videos` (handle `?? []` fallback)
    - Update WhatsApp share button to share event page URL (`${siteConfig.siteUrl}/events/${slug}`) instead of raw text
    - Keep "वापस" navigation link and "अन्य कार्यक्रम देखें" link
    - Use semantic HTML structure: `main`, `section`, `article`
    - _Requirements: Design — Component 1 (EventDetailPage), OG Metadata Generation, Key Functions 1 & 3, Properties 2, 3, 5 & 6_

  - [ ]* 7.2 Write property tests for OG metadata and share URL
    - **Property 2: OG image URL is always absolute** — for any event with images, og:image starts with `siteConfig.siteUrl`
    - **Property 5: WhatsApp share URL matches OG URL** — shared URL equals `metadata.openGraph.url`
    - **Property 6: Static params completeness** — every event in events.json has a corresponding entry in generateStaticParams output
    - **Validates: Design — Correctness Properties 2, 5 & 6**

- [ ] 8. Update EventCard share button
  - [ ] 8.1 Update `components/EventCard.tsx` WhatsApp share link
    - Import `siteConfig` from `@/config/site`
    - Change `shareLink` to use event page URL: `https://wa.me/?text=${encodeURIComponent(`${siteConfig.siteUrl}/events/${getEventSlug(event)}`)}`
    - This ensures WhatsApp link previews show OG metadata (title + thumbnail) instead of plain text
    - _Requirements: Design — Example Usage (EventCard share button updated), Property 5_

- [ ] 9. Final checkpoint — Ensure build passes and all pages render
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific sections of the design document for traceability
- No new npm dependencies are introduced — uses only Next.js, React hooks, and Tailwind CSS
- The design uses TypeScript throughout — all implementations use TypeScript
- Property tests validate correctness properties defined in the design document
- Checkpoints ensure incremental validation after data layer changes and after component creation
- The `videos` field defaults to `[]` for backward compatibility with existing events

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["3.1", "5.1"] },
    { "id": 2, "tasks": ["3.2", "4.1"] },
    { "id": 3, "tasks": ["7.1", "8.1"] },
    { "id": 4, "tasks": ["7.2"] }
  ]
}
```
