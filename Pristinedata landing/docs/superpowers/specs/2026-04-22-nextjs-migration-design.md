# Next.js Migration Design — Pristine Data Landing Site

**Date:** 2026-04-22  
**Branch:** migration  
**Scope:** Migrate all 6 HTML pages to Next.js static export, add full SEO

---

## Overview

Convert the existing static HTML landing site (`pristine-data-site/`) into a Next.js app with `output: 'export'` for deployment to AWS S3 + CloudFront. All 6 pages are migrated. Full SEO metadata added to every page.

---

## Architecture

### Output Mode
- `next.config.ts`: `output: 'export'` — generates flat HTML/CSS/JS, no server required
- Deploy artifact: `out/` folder → S3 bucket → CloudFront distribution

### Pages (App Router)
| HTML file | Next.js route |
|---|---|
| `index.html` | `app/page.tsx` |
| `about-us.html` | `app/about-us/page.tsx` |
| `contact-us.html` | `app/contact-us/page.tsx` |
| `integrations.html` | `app/integrations/page.tsx` |
| `stack-audit.html` | `app/stack-audit/page.tsx` |
| `stack-audit-embed.html` | `app/stack-audit-embed/page.tsx` |

### Global Layout (`app/layout.tsx`)
- Manrope font via `next/font/google`
- Dark mode `ThemeProvider` (replaces inline `localStorage` script)
- Analytics scripts (Warmly, reb2b, Clarity) via `next/script` with `strategy="afterInteractive"`
- Global `<html>` attributes: `lang="en"`, `className="scroll-smooth"`

---

## Components

All shared UI extracted from `index.html`:

| Component | Purpose |
|---|---|
| `Navbar.tsx` | Fixed nav, dark mode toggle, mobile menu, logo swap |
| `Footer.tsx` | Footer links and branding |
| `Hero.tsx` | 80vh hero, search form, badge, headline |
| `StatsSection.tsx` | Dark stats block (700M+ contacts, etc.) |
| `FeaturesSection.tsx` | Feature cards section |
| `ComparisonTable.tsx` | vs ZoomInfo/Amplemarket comparison |
| `ThemeProvider.tsx` | Client component wrapping `localStorage` dark mode logic |

Page-specific sections (not shared across pages) stay inline in their page file.

---

## SEO

Every page exports a `metadata` object:

```ts
export const metadata: Metadata = {
  title: '...',
  description: '...',
  metadataBase: new URL('https://pristinedata.ai'),
  alternates: { canonical: '/' },
  openGraph: {
    title: '...',
    description: '...',
    url: 'https://pristinedata.ai',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '...',
    description: '...',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}
```

Home page also gets JSON-LD structured data (`SoftwareApplication` schema).

---

## Styling

- Tailwind config ported from inline `tailwind.config` block → `tailwind.config.ts`
- All custom CSS from `<style>` blocks → `app/globals.css`
- Custom utilities preserved: `glass-nav`, `grid-bg`, `grid-bg-dark`, `playbook-grid`, 3D transform classes
- Smooth theme transition rules kept in globals

---

## Icons

- Remove: `<script src="https://code.iconify.design/...">` CDN
- Add: `@iconify/react` npm package
- Usage: `<Icon icon="solar:magic-stick-3-linear" width={20} />` — same icon names, no change to visual output

---

## Dark Mode

- Existing approach: `localStorage` + `document.documentElement.classList.add('dark')` inline script
- New approach: `ThemeProvider` client component with `useEffect` reading `localStorage`, toggling `dark` class on `<html>`
- Theme toggle button stays in `Navbar.tsx`, calls context method

---

## Assets

- Copy `pristine-data-site/assets/` → `pristine-data-site/public/assets/`
- All `src="assets/..."` paths become `/assets/...` (Next.js serves from `public/`)
- Add placeholder `public/og-image.png` (1200×630) for OG tags — to be replaced with real image

---

## Analytics

Three third-party scripts currently in `<head>`:
1. **Warmly** (`getwarmly.com`) — `strategy="afterInteractive"`
2. **reb2b** (inline JS) — `strategy="afterInteractive"`
3. **Microsoft Clarity** (inline JS) — `strategy="afterInteractive"`

All three move to `app/layout.tsx` using `<Script>` from `next/script`.

---

## Out of Scope

- No backend/API routes
- No form submission logic (contact-us form links to external or stays as-is)
- No CMS integration
- No i18n
- No image optimization beyond Next.js defaults (static export limits `next/image` to unoptimized mode)

---

## File Cleanup

After migration is complete, the original `.html` files are deleted. The `pristine-data-site/` folder becomes the Next.js project root.
