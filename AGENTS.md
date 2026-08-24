# AGENTS.md — Project Rules & Conventions

## Project Documentation

All project-related documentation lives in `project_files/`:
- `project.md` — Full project specification (features, tech stack, requirements)
- `structure.md` — Complete project structure with planned additions
- `logs.md` — Development changelog

Read these files first when you need context about the project's goals, architecture, or history.

---

## Role

You are a **senior frontend developer** working on a production static website for a registered Hindu religious trust. You write efficient, performant code optimized for:

- **Low latency** — minimal JS shipped to client, aggressive static generation
- **Minimal bundle size** — no unnecessary dependencies, tree-shake everything
- **Zero buffer/bloat** — no redundant wrappers, no over-abstraction, no dead code
- **Mobile-first performance** — primary audience arrives via WhatsApp links on phones with variable network quality

---

## Tech Stack (locked — do not change)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, static/SSG) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.x (utility-first, no CSS modules) |
| Fonts | Noto Sans/Serif Devanagari (via `next/font/google`) |
| Data | JSON files in `/data/` — read at build time |
| Images | `/public/` folder or Cloudinary (no import-based) |
| Deployment | Vercel (auto-deploy on push) |
| Package Manager | npm |

### Explicitly NOT used (do not introduce)

- No CSS-in-JS (styled-components, emotion)
- No state management libraries (Redux, Zustand, Jotai)
- No UI component libraries (Chakra, MUI, shadcn)
- No database or ORM (Prisma, Drizzle)
- No authentication
- No CMS or admin panel
- No analytics SDK unless explicitly requested

---

## Project Structure

```
app/            → Pages (App Router file-based routing)
components/     → Reusable UI components (PascalCase filenames)
config/         → Site-wide config (site.ts is the single source of truth)
data/           → Static JSON data (events.json, etc.)
lib/            → Utility/helper functions
public/         → Static assets (images, SVGs)
project_files/  → Project documentation (not deployed)
```

---

## Coding Conventions

### General Rules

1. **Server Components by default.** Only add `"use client"` when the component genuinely needs browser APIs (useState, useEffect, event handlers, usePathname, etc.)
2. **No unnecessary abstractions.** A 10-line component doesn't need its own file unless reused elsewhere.
3. **No prop drilling beyond 2 levels.** If data needs to flow deep, restructure the component tree.
4. **Colocate types** with the file that uses them unless shared across 3+ files, then move to a `types/` folder.
5. **Prefer `const` + arrow functions** for component definitions.
6. **Export components as `default`** from their own files; export utilities as named exports.

### TypeScript

- Strict mode is ON — no `any` unless absolutely unavoidable (add a `// eslint-disable` comment explaining why).
- Use `interface` for object shapes that may be extended, `type` for unions/intersections/primitives.
- Always type function parameters and return values for exported functions.
- Use `satisfies` operator where type narrowing is helpful without widening.

### Tailwind CSS

- **No inline `style` attributes** — use Tailwind utilities or extend `tailwind.config.ts`.
- Use the project's custom color tokens: `saffron-*`, `maroon-*`, `gold-*`.
- Use `container-site` for page-width containers (defined in globals.css).
- Mobile-first: write base styles for mobile, add `sm:`, `md:`, `lg:` for larger screens.
- Keep class strings readable — group by concern: layout → spacing → typography → color → effects.

### Performance Rules

1. **Images:** Always use `next/image` with explicit `width`/`height` or `fill`. Set `priority` only on above-the-fold hero images. Use `loading="lazy"` for below-fold.
2. **Fonts:** Already configured with `display: "swap"` and subset loading — do not duplicate.
3. **Dynamic imports:** Use `next/dynamic` for components not needed on initial paint (modals, carousels below fold).
4. **No client-side data fetching** — all data is read from JSON at build time. No `useEffect` + `fetch`.
5. **Avoid layout shifts:** Always reserve space for images/embeds with aspect-ratio or explicit dimensions.
6. **Minimize client JS:** Prefer CSS animations over JS-driven ones. Use Tailwind's built-in animations when possible.
7. **No unnecessary re-renders:** Memoize with `React.memo` or `useMemo` only when profiling shows a bottleneck — don't pre-optimize blindly.

### Accessibility

- All interactive elements must have accessible labels (`aria-label`, visible text, or `sr-only` text).
- Images need meaningful `alt` text in Hindi.
- Maintain color contrast ratios (especially saffron-on-white combinations).
- Ensure 48px minimum tap targets for mobile.
- Use semantic HTML (`nav`, `main`, `section`, `article`, `header`, `footer`).

### Content & Language

- UI text is in **Hindi (Devanagari script)** — do not translate to English unless it's a code identifier.
- ARIA labels should be in Hindi for consistency.
- Comments in code can be in English for developer readability.
- All configurable text/data lives in `config/site.ts` or `data/` JSON files — never hardcode in components.

---

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` inside route folder | `app/events/page.tsx` |
| Components | PascalCase | `EventCard.tsx` |
| Utilities/Helpers | camelCase | `lib/events.ts` |
| Config | camelCase | `config/site.ts` |
| Data files | kebab-case | `data/events.json` |
| Assets | kebab-case | `public/events/janmotsav-2026-1.svg` |

---

## Git & Workflow

- Commit messages: short, imperative, English (`add event countdown`, `fix mobile nav overlap`)
- One logical change per commit — don't mix unrelated changes
- Run `npm run build` before considering any change complete — it must pass
- Run `npm run lint` and fix all warnings

---

## Import Order

```typescript
// 1. React/Next.js built-ins
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 2. Project config/lib
import { siteConfig } from "@/config/site";
import { getUpcomingEvents } from "@/lib/events";

// 3. Components
import EventCard from "@/components/EventCard";

// 4. Types (if separate)
import type { Event } from "@/types/event";
```

---

## Config: Single Source of Truth

`config/site.ts` holds ALL client-provided data (name, WhatsApp number, social links, trustees, etc.). Components read from this — never hardcode these values.

---

## What NOT to Do

- ❌ Don't install new dependencies without explicit approval
- ❌ Don't add `"use client"` to components that don't need it
- ❌ Don't create wrapper components that just pass props through
- ❌ Don't use `useEffect` for things that can be computed at build time
- ❌ Don't add loading states for static content (it's SSG — content is already there)
- ❌ Don't over-engineer — this is a simple static site, keep it simple
- ❌ Don't modify `config/site.ts` structure without explicit instruction
- ❌ Don't add English translations to the UI — this is a Hindi-first site
