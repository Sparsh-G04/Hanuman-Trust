# Project Spec: श्री हनुमान जन्मोत्सव सेवा ट्रस्ट — Website

## 1. Overview
A website for a **registered religious trust** (श्री हनुमान जन्मोत्सव सेवा ट्रस्ट) with three core goals:
1. Showcase the trust's events (past + upcoming)
2. Accept online donations/contributions
3. Build donor trust/credibility (registration status, transparency)

**Content language:** Mostly Hindi (Devanagari script) throughout the site.

**Update frequency:** Low — the trust holds events only ~4-5 times a year. Content updates (new events, photos) will be made directly by the developer, not by trust members. **No admin panel or CMS is needed.**

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static/SSG rendering — no backend needed for content |
| Styling | Tailwind CSS | |
| Events data | JSON or MDX file in the repo (e.g. `events.json`) | Edited directly by developer, redeployed via git push. No database. |
| Images | Cloudinary or `/public` folder | Depends on volume of event photos |
| Auth / DB | **None** | Deliberately excluded — no admin login, no Prisma/Neon. Keeps the site simple and low-maintenance given infrequent updates. |
| Payments | Razorpay or PayU checkout | See Donations section below |
| Deployment | Vercel | Auto-deploy on push |
| Fonts | Noto Sans Devanagari / Noto Serif Devanagari | Free, clean Hindi rendering |

### Sample events.json structure
```json
[
  {
    "title": "हनुमान जन्मोत्सव 2026",
    "date": "2026-04-12",
    "description": "...",
    "images": ["event1.jpg", "event2.jpg"],
    "status": "upcoming"
  }
]
```
Next.js reads this at build time and auto-sorts into upcoming vs. past based on the current date.

---

## 3. Site Structure — Navbar (5 tabs)

| # | Hindi Label | English | Contents |
|---|---|---|---|
| 1 | मुखपृष्ठ | Home | Hero banner, next upcoming event with countdown, highlights, donate CTA |
| 2 | हमारे बारे में | About Us | Trust mission/history, **registration number**, trustee/committee names |
| 3 | कार्यक्रम | Events | Upcoming + Past events in one page (two sections). Event photos live here — **no separate gallery tab** |
| 4 | दान करें | Donate | Razorpay/PayU checkout, why donate, registration info |
| 5 | संपर्क करें | Contact | Contact form (see below), address, map |

**Not in navbar (footer/header icons instead):**
- Facebook, Instagram, YouTube — outbound links only, footer + small header icons
- Floating WhatsApp icon — persistent across all pages (see below)

---

## 4. Key Features

### Donations
- Integration: **Razorpay or PayU** online checkout
- Trust is registered — confirm KYC status on their Razorpay/PayU account before build (this is the actual blocker, not the code)
- If trust has **80G registration**, worth adding auto-generated tax receipts (Razorpay webhook → email PDF). **Status unconfirmed — ask trust.**
- Show registration number and transparency info (e.g. funds raised) near the donation form to build trust

### Floating WhatsApp icon
- Fixed-position circular button, bottom-right, visible on every page
- Links to `https://wa.me/<owner-number>` — opens WhatsApp app (mobile) or WhatsApp Web (desktop)
- No backend/API required

### Contact form → WhatsApp redirect
- Form fields: Name, Message
- On submit: builds a `wa.me` deep link with the message pre-filled and redirects the user into WhatsApp
- Example: `https://wa.me/91XXXXXXXXXX?text=नाम: {name}%0Aसंदेश: {message}`
- No backend, no email service, no spam risk — trade-off is nothing is logged server-side if the user doesn't complete the WhatsApp send

### Social links
- Facebook, Instagram, YouTube icons in footer + header
- Outbound links only, not navbar tabs

### Branded loading state
- Trust logo used as the loading indicator sitewide via Next.js `app/loading.tsx`
- Animation: **pulse or scale-bounce preferred over spin** (spin looks odd on non-circular/devotional logos)
- Logo also used as the **favicon** (browser tab icon) — needs a square-cropped export

---

## 5. UI / Design Direction
- **Palette:** Saffron/orange + deep maroon/gold — culturally fitting for a Hanuman trust; avoid generic corporate blue
- **Typography:** Noto Sans/Serif Devanagari
- **Mobile-first:** primary audience will arrive via WhatsApp-shared links on phones
- **Hero section:** rotating banner, next event with countdown ("आगामी कार्यक्रम में X दिन शेष")
- **Trust signals:** registration number, trustee names/photos, visible especially on About and Donate pages
- **Share buttons:** WhatsApp share on event pages to encourage word-of-mouth spread

---

## 6. Open Items — Needed From Client Before/During Build
- [ ] Logo file — transparent PNG or SVG, plus a square-cropped version for favicon
- [ ] Owner's WhatsApp number (for floating icon + contact form redirect)
- [ ] Razorpay/PayU account KYC completion status
- [ ] 80G registration status (determines if tax receipts are needed)
- [ ] Trust registration number (for About/Donate pages)
- [ ] Social media handles/URLs (Facebook, Instagram, YouTube)
- [ ] Event content and photos (at least initial set)
- [ ] Trustee/committee member names (and photos if available)
- [ ] Address / contact details for Contact page
- [ ] Domain name and hosting account access (if not already set up on Vercel)
