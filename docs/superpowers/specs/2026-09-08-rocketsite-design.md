# Project Aurelian — Website Design Spec

**Date:** 2026-09-08
**Status:** Approved

---

## Overview

A single-page website for Project Aurelian, a bi-propellant liquid rocket built from scratch. The site informs visitors about the project, publishes a monthly newsletter, showcases team members, and drives donations via GoFundMe. All content is managed by the team through Sanity CMS — no code required for ongoing updates. The architecture is intentionally component-based and extensible so new sections, pages, or features can be added at any point without disrupting what's already built.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Content Management | Sanity CMS (live client-side API) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (auto-deploy on push to `main`) |
| CMS Dashboard | Sanity Studio at `project-aurelian.sanity.studio` |
| Fonts | Orbitron or Rajdhani (headings) + Inter (body) via Google Fonts |

---

## Repository Structure

```
RocketSite/
├── src/
│   ├── components/         # One file per UI component
│   │   ├── Navbar.jsx
│   │   ├── FloatingDonateButton.jsx
│   │   ├── HeroSection.jsx
│   │   ├── NewsletterSection.jsx
│   │   ├── NewsletterModal.jsx
│   │   ├── AboutSection.jsx
│   │   ├── RocketSection.jsx
│   │   ├── RocketAccordion.jsx
│   │   ├── TimelineSection.jsx
│   │   ├── MembersSection.jsx
│   │   ├── MemberCard.jsx
│   │   ├── SupportSection.jsx
│   │   └── ContactSection.jsx
│   ├── lib/
│   │   └── sanity.js       # Sanity client + GROQ query helpers
│   ├── App.jsx             # Assembles all sections in scroll order
│   └── main.jsx            # Vite entry point
├── studio/                 # Sanity Studio (same repo)
│   └── schemas/            # One schema file per content type
│       ├── newsletter.js
│       ├── member.js
│       ├── rocketSpec.js
│       ├── timelineMilestone.js
│       ├── aboutContent.js
│       ├── supportContent.js
│       └── contactInfo.js
├── public/
│   └── placeholders/       # Gray gradient placeholder images
├── docs/
│   └── superpowers/specs/  # This file
└── .github/
    └── workflows/
        └── deploy.yml      # Build + deploy to GitHub Pages
```

---

## Site Structure & Navigation

**Layout:** Single-page with sticky top navbar. Nav links smooth-scroll to their section. URL hash updates on scroll (e.g. `/#members`) for shareable links. Active section is highlighted in the navbar as the user scrolls.

**Nav items:** `Home` · `Newsletter` · `About` · `Rocket` · `Members` · `Support Us` · `Contact`

**Floating Donate Button:** Fixed bottom-right corner on all sections, always visible. Blue pill-shaped button labeled "Donate" or "Support Us", links to GoFundMe URL stored in Sanity.

---

## Sections (in scroll order)

### 1. Home (Hero)
- Full-width hero image (placeholder: gray gradient with label)
- Project name as styled text logo in navbar top-left: `PROJECT AURELIAN`
- Welcoming headline + 2–3 sentence tagline (content from Sanity)
- Subtle scroll-down cue (animated chevron or arrow)

### 2. Newsletter
- Grid of monthly entry cards, most recent first
- Each card: month/year label, headline, 1–2 sentence preview
- "Read More" button opens a full-screen modal overlay
- Modal: full newsletter content (text blocks + images), scrollable, closeable via X or clicking outside
- Newsletter format is flexible per entry — Sanity Portable Text allows different layouts each month (paragraphs, side-by-side images, image + text, etc.)

### 3. About
- 1–2 paragraphs about Project Aurelian (from Sanity)
- Bullet list of rocket features alongside placeholder rocket photos
- Clean two-column layout: text left, image right (stacks on mobile)

### 4. Rocket
- Section header + short intro paragraph
- Collapsible accordion items for detailed specs (e.g. Propulsion, Dimensions, Materials, Fuel System)
- Each item: click header to expand/collapse with smooth animation
- One item open at a time
- All accordion content managed via Sanity

### 5. Timeline
- Vertical timeline down the page center
- Each node = one month, with a label and bullet list of goals
- Completed goals display a blue checkmark icon
- Entirely managed via Sanity — team checks off items in Studio, changes appear live on site

### 6. Members
- 2-column card grid (stacks to 1-column on mobile)
- Each card: placeholder photo, name, role, resume link, short bio paragraph
- All member data from Sanity — adding or editing a member requires no code

### 7. Support Us
- Placeholder team photo (full-width or contained)
- 1–2 short paragraphs about why support matters (from Sanity)
- Large prominent GoFundMe button

### 8. Contact
- Two contact cards (initially: the two founders)
- Each card: name, role, contact info (email and/or LinkedIn)
- Managed via Sanity — easy to add more contacts later

---

## Visual Design

**Color palette:**
| Role | Color | Hex |
|---|---|---|
| Background (dark) | Deep navy | `#0A0F1E` |
| Background (light alt) | Slightly lighter navy | `#111827` |
| Primary accent | Bright blue | `#2563EB` |
| Hover / secondary | Light blue | `#60A5FA` |
| Text (on dark) | Near-white | `#F8FAFC` |
| Text (on light) | Near-black | `#0F172A` |

Sections alternate between dark and slightly-lighter navy to create visual separation without harsh contrast. Accent blue used sparingly — CTAs, active nav indicators, checkmarks, links.

**Typography:**
- Headings: `Orbitron` or `Rajdhani` — geometric, aerospace feel
- Body: `Inter` — clean and highly readable

**Logo:** `PROJECT AURELIAN` in heading font, letter-spaced, white — styled text placeholder until a real logo is designed.

**Placeholder images:** Gray gradient boxes with a centered "Photo coming soon" label. Same aspect ratios as production images so swapping them in later requires zero layout changes.

---

## Sanity Content Types

| Schema | Fields |
|---|---|
| `newsletter` | title, month, year, preview (short text), body (Portable Text with images) |
| `member` | name, role, photo, resumeUrl, bio |
| `rocketSpec` | title, order, body (Portable Text) |
| `timelineMilestone` | month, year, goals (array of `{text, completed}`) |
| `aboutContent` | paragraphs (Portable Text), featureBullets, photo |
| `supportContent` | paragraphs, goFundMeUrl, photo |
| `contactInfo` | name, role, email, linkedInUrl |

All schemas are extensible — new fields or entirely new content types can be added to Sanity at any time without touching the frontend until those fields are wired up.

---

## CMS Access & Permissions

- Sanity Studio hosted at `project-aurelian.sanity.studio`
- Team members invited via email through the Sanity dashboard
- Role options: `Editor` (can edit content, cannot change schema) or `Administrator`
- Public website has no login — only the Studio does
- Read API is public (standard for Sanity public content sites); write access requires Studio login

---

## Extensibility

The architecture is designed to accommodate new ideas without rework:
- **New section:** Add a component to `src/components/`, add a nav entry, drop it into `App.jsx`
- **New content type:** Add a schema to `studio/schemas/`, add a query in `src/lib/sanity.js`, wire it to the relevant component
- **New page (if needed):** React Router can be added to support full separate pages if the single-page approach ever becomes limiting
- **Selling merch:** A Shopify Buy Button or similar embed can be added to Support Us or a new Store section
- **Privacy policy / cookie consent:** A simple modal banner can be added if needed for GDPR compliance when the domain is live

---

## Deployment

1. Push to `main` branch on GitHub
2. GitHub Actions runs `vite build`
3. Built files deployed to `gh-pages` branch
4. GitHub Pages serves from `gh-pages`

Custom domain: configured in GitHub Pages settings + DNS records once domain is purchased.

---

## Out of Scope (for now)

- Real photography (placeholders used throughout)
- GoFundMe link (placeholder button, link added via Sanity when ready)
- Privacy policy / Terms of Service (deferred until domain is live and legal need is clearer)
- Cookie consent banner (deferred)
- Merch / e-commerce
- Email newsletter delivery (site displays newsletter content; separate tool needed if email delivery is wanted)
