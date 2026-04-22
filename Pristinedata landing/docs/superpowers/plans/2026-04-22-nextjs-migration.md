# Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the 6-page static HTML site in `pristine-data-site/` to a Next.js App Router project with static export (`output: 'export'`) and full SEO metadata on every page.

**Architecture:** Next.js App Router with `output: 'export'` generates flat HTML/CSS/JS deployable to S3 + CloudFront. Shared UI lives in `components/`. Each page is a server component that exports a `metadata` object. Dark mode is managed by a `ThemeProvider` client component.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, `@iconify/react`, `next/font/google` (Manrope), `next/script` (analytics)

---

## File Map

### New files to create (inside `pristine-data-site/`)

```
app/
  layout.tsx              — root layout: font, ThemeProvider, analytics scripts
  globals.css             — all custom CSS from <style> blocks
  page.tsx                — home page (index.html) with metadata
  about-us/
    page.tsx              — about page
  contact-us/
    page.tsx              — contact page
  integrations/
    page.tsx              — integrations page
  stack-audit/
    page.tsx              — stack audit page
  stack-audit-embed/
    page.tsx              — stack audit embed page

components/
  ThemeProvider.tsx       — client component: localStorage dark mode
  Navbar.tsx              — fixed nav, dark toggle, mobile menu
  Footer.tsx              — footer with logo and links
  Hero.tsx                — 80vh hero with typewriter search form
  StatsSection.tsx        — dark stats block (700M+, 90% accuracy)
  WorkflowSection.tsx     — "Stop building Franken-stacks" comparison
  FeaturesSection.tsx     — 4-card intelligence engine section
  ComparisonTable.tsx     — Pristine vs Traditional Stack table

next.config.ts            — output: 'export', images unoptimized
tailwind.config.ts        — ported from inline tailwind.config block
postcss.config.mjs        — standard Next.js postcss config
tsconfig.json             — standard Next.js tsconfig
package.json              — dependencies
public/
  assets/                 — copy of pristine-data-site/assets/
  og-image.png            — placeholder 1200x630 OG image
```

### Files to delete after migration
- `pristine-data-site/index.html`
- `pristine-data-site/about-us.html`
- `pristine-data-site/contact-us.html`
- `pristine-data-site/integrations.html`
- `pristine-data-site/stack-audit.html`
- `pristine-data-site/stack-audit-embed.html`

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `pristine-data-site/package.json`
- Create: `pristine-data-site/next.config.ts`
- Create: `pristine-data-site/tsconfig.json`
- Create: `pristine-data-site/postcss.config.mjs`

- [ ] **Step 1: Run create-next-app inside the site folder**

```bash
cd "pristine-data-site"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-import-alias --eslint
```

When prompted:
- Would you like to use Turbopack? → **No**
- Accept all other defaults

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @iconify/react
```

- [ ] **Step 3: Configure static export in next.config.ts**

Replace the contents of `next.config.ts` with:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000, default Next.js page visible. Kill with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add pristine-data-site/
git commit -m "chore: scaffold Next.js app with static export config"
```

---

## Task 2: Port Tailwind config and global CSS

**Files:**
- Modify: `pristine-data-site/tailwind.config.ts`
- Modify: `pristine-data-site/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#152033',
          950: '#020617',
        },
        brand: {
          red: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(37, 99, 235, 0.1)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 3px; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }

.glass-nav {
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}
.dark .glass-nav {
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
}

.grid-bg {
  background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
    linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
  background-size: 24px 24px;
}
.dark .grid-bg {
  background-image: linear-gradient(to right, #1e293b 1px, transparent 1px),
    linear-gradient(to bottom, #1e293b 1px, transparent 1px);
}

.grid-bg-dark {
  background-image: linear-gradient(to right, #1e293b 1px, transparent 1px),
    linear-gradient(to bottom, #1e293b 1px, transparent 1px);
  background-size: 24px 24px;
}

textarea {
  field-sizing: content;
  min-height: 1.5lh;
}
textarea:focus, input:focus { outline: none; }

.playbook-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}
@media (min-width: 640px) {
  .playbook-grid { grid-template-columns: repeat(2, 1fr); }
}
.dark .playbook-grid { background: #334155; }

.playbook-cell { background: white; padding: 1rem; }
.dark .playbook-cell { background: #0f172a; }

/* Smooth theme transition */
html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,
ul, li, section, article, aside, footer, header, nav {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* 3D Transform utilities */
.rotate-x-5 {
  --tw-rotate-x: 5deg;
  transform: translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), 0)
    rotateX(var(--tw-rotate-x, 0)) rotateY(var(--tw-rotate-y, 0)) !important;
}
.rotate-y-5 {
  --tw-rotate-y: 5deg;
  transform: translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), 0)
    rotateX(var(--tw-rotate-x, 0)) rotateY(var(--tw-rotate-y, 0)) !important;
}
.perspective-midrange { perspective: 800px !important; }
.transform-style-preserve-3d { transform-style: preserve-3d !important; }
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: `out/` folder generated, no errors.

- [ ] **Step 4: Commit**

```bash
git add pristine-data-site/tailwind.config.ts pristine-data-site/app/globals.css
git commit -m "chore: port Tailwind config and global CSS from HTML"
```

---

## Task 3: ThemeProvider component

**Files:**
- Create: `pristine-data-site/components/ThemeProvider.tsx`

- [ ] **Step 1: Create ThemeProvider**

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 2: Commit**

```bash
git add pristine-data-site/components/ThemeProvider.tsx
git commit -m "feat: add ThemeProvider client component for dark mode"
```

---

## Task 4: Root layout

**Files:**
- Modify: `pristine-data-site/app/layout.tsx`

- [ ] **Step 1: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pristinedata.ai'),
  title: {
    default: 'Pristine Data AI - The All-in-One GTM Platform',
    template: '%s | Pristine Data AI',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable}`} suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 overflow-x-hidden selection:bg-rose-100 selection:text-rose-900 dark:selection:bg-indigo-900 dark:selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>

        {/* Warmly */}
        <Script
          id="warmly-script-loader"
          src="https://opps-widget.getwarmly.com/warmly.js?clientId=ff085db792eda57552e92a30070b59cc"
          strategy="afterInteractive"
        />

        {/* reb2b */}
        <Script id="reb2b" strategy="afterInteractive">{`
          !function(key) {
            if (window.reb2b) return;
            window.reb2b = {loaded: true};
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";
            document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
          }("961Y0HXR7RNG");
        `}</Script>

        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vwjincq9ud");
        `}</Script>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Builds successfully. No font or script errors.

- [ ] **Step 3: Commit**

```bash
git add pristine-data-site/app/layout.tsx
git commit -m "feat: add root layout with Manrope font, ThemeProvider, and analytics"
```

---

## Task 5: Navbar component

**Files:**
- Create: `pristine-data-site/components/Navbar.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTheme } from './ThemeProvider'

export function Navbar() {
  const { toggle, theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-300 top-0 glass-nav bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto dark:hidden" />
              <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto hidden dark:block" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Product</Link>
              <Link href="/integrations" className="hover:text-slate-900 dark:hover:text-white transition-colors">Integrations</Link>
              <Link href="/about-us" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen
                ? <Icon icon="solar:close-linear" width={20} />
                : <Icon icon="solar:hamburger-menu-linear" width={20} />}
            </button>
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
            >
              {theme === 'dark'
                ? <Icon icon="solar:sun-2-linear" width={16} />
                : <Icon icon="solar:moon-linear" width={16} />}
            </button>
            <Link
              href="/contact-us"
              className="hidden md:block px-3.5 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden">
          <div className="px-6 py-6 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-slate-800">Product</Link>
            <Link href="/integrations" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-3 border-b border-slate-100 dark:border-slate-800">Integrations</Link>
            <Link href="/about-us" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-3 border-b border-slate-100 dark:border-slate-800">About</Link>
            <div className="pt-4">
              <Link href="/contact-us" className="w-full text-center block py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl">Book a Demo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pristine-data-site/components/Navbar.tsx
git commit -m "feat: add Navbar component with dark mode toggle and mobile menu"
```

---

## Task 6: Footer component

**Files:**
- Create: `pristine-data-site/components/Footer.tsx`

- [ ] **Step 1: Create Footer.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={100} height={28} className="h-7 w-auto dark:hidden" />
          <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={100} height={28} className="h-7 w-auto hidden dark:block" />
        </div>
        <div className="flex gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-200">Product</Link>
          <Link href="/integrations" className="hover:text-slate-700 dark:hover:text-slate-200">Integrations</Link>
          <Link href="/about-us" className="hover:text-slate-700 dark:hover:text-slate-200">About</Link>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">© 2026 Pristine Inc.</div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pristine-data-site/components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

## Task 7: Hero component

**Files:**
- Create: `pristine-data-site/components/Hero.tsx`

- [ ] **Step 1: Create Hero.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

const peoplePhrases = [
  'Find CMOs at Series A companies with $10M+ ARR...',
  'Search for VPs of Sales in London...',
  'Find React Engineers with 5+ years experience...',
  'Show me Founders who recently raised funds...',
  'Find Marketing Directors using HubSpot...',
]

const companyPhrases = [
  'Show me SaaS startups in San Francisco...',
  'List e-commerce brands using Shopify Plus...',
  'Find B2B fintech companies with $50M+ funding...',
  'Show me companies hiring for Enterprise Sales...',
  'List healthcare companies in New York...',
]

export function Hero() {
  const router = useRouter()
  const [tab, setTab] = useState<'people' | 'company'>('people')
  const [placeholder, setPlaceholder] = useState('')
  const phraseIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const phrases = tab === 'people' ? peoplePhrases : companyPhrases
    phraseIdx.current = 0
    charIdx.current = 0
    deleting.current = false
    setPlaceholder('')

    function loop() {
      const phrase = phrases[phraseIdx.current]
      if (!deleting.current) {
        charIdx.current++
        setPlaceholder(phrase.slice(0, charIdx.current))
        if (charIdx.current === phrase.length) {
          deleting.current = true
          timeoutId.current = setTimeout(loop, 1800)
          return
        }
      } else {
        charIdx.current--
        setPlaceholder(phrase.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length
        }
      }
      timeoutId.current = setTimeout(loop, deleting.current ? 40 : 60)
    }

    timeoutId.current = setTimeout(loop, 400)
    return () => { if (timeoutId.current) clearTimeout(timeoutId.current) }
  }, [tab])

  return (
    <section className="min-h-[600px] flex overflow-hidden h-[80vh] pt-16 relative items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-10 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-50/50 dark:bg-rose-900/10 rounded-full blur-[80px] -z-10 opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[80px] -z-10 opacity-60" />

      <div className="z-10 flex flex-col text-center w-full max-w-4xl mx-auto px-6 items-center">
        {/* Badge */}
        <div className="inline-flex gap-1.5 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border rounded-full mb-6 px-3 py-1 shadow-sm items-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
          </span>
          <span className="text-[10px] uppercase dark:text-slate-300 font-semibold text-slate-600 tracking-wider">
            largest coverage in the category - 700M+ Contacts
          </span>
        </div>

        <h1 className="md:text-6xl leading-[1.15] dark:text-white text-4xl font-semibold text-slate-950 tracking-tighter mb-4">
          Your Entire Revenue Stack. <br className="hidden md:block" /> One AI-Powered Platform.
        </h1>

        <p className="leading-relaxed dark:text-slate-400 text-base font-medium text-slate-700 max-w-lg mx-auto mb-10">
          Find prospects, enrich data, and run outreach — all in one place. Stop paying for ZoomInfo, Amplemarket, and OpenAI separately.
        </p>

        {/* Search Card */}
        <div className="relative w-full max-w-2xl mx-auto group">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 ring-4 ring-slate-50/50 dark:ring-slate-800/20">
            <div className="flex flex-col">
              <div className="pt-4 px-4 pb-2">
                <div className="relative flex items-start gap-3">
                  <div className="mt-1 text-slate-400 dark:text-slate-500">
                    <Icon icon="solar:magic-stick-3-linear" width={20} />
                  </div>
                  <textarea
                    className="placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none resize-none leading-relaxed text-lg font-medium text-slate-600 dark:text-slate-200 bg-transparent w-full p-0"
                    rows={2}
                    placeholder={placeholder}
                  />
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-transparent sm:border-slate-50 dark:sm:border-slate-800">
                {/* Tab toggle */}
                <div className="flex items-center gap-1 p-0.5 bg-slate-100/80 dark:bg-slate-800 rounded-lg self-start sm:self-center">
                  {(['people', 'company'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        tab === t
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon icon={t === 'people' ? 'solar:user-circle-linear' : 'solar:buildings-2-linear'} width={14} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/contact-us')}
                  className="sm:w-auto hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 transition-all hover:translate-y-px flex gap-2 text-xs font-semibold text-white bg-slate-900 w-full rounded-lg py-2 px-5 shadow-lg items-center justify-center"
                >
                  Generate Leads
                  <Icon icon="solar:arrow-right-linear" width={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pristine-data-site/components/Hero.tsx
git commit -m "feat: add Hero component with typewriter effect"
```

---

## Task 8: StatsSection component

**Files:**
- Create: `pristine-data-site/components/StatsSection.tsx`

- [ ] **Step 1: Create StatsSection.tsx**

```tsx
import { Icon } from '@iconify/react'

export function StatsSection() {
  return (
    <section className="overflow-hidden text-white bg-slate-900 dark:bg-slate-900/50 pt-24 pb-24 relative border-t border-b border-transparent dark:border-slate-800">
      <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-16 items-center">
          {/* Left: Stats */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-8 text-indigo-400">
              <Icon icon="solar:global-circle-bold" width={20} />
              <span className="text-xs font-semibold uppercase tracking-widest">Unrivaled Scale</span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10">
              <div className="relative group">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.9] mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">700M+</span>
                </h2>
                <p className="text-white text-xl md:text-2xl font-medium tracking-tight group-hover:text-indigo-200 transition-colors">Contacts.</p>
              </div>
              <div className="relative group">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.9] mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">90%</span>
                </h2>
                <p className="md:text-2xl group-hover:text-emerald-200 transition-colors text-xl font-medium text-white tracking-tight">Accuracy.</p>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md border-l-2 border-slate-800 pl-6">
              The world's largest database meets the highest accuracy standards. While others offer stale data, we offer verified reality at scale.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: 'solar:users-group-rounded-bold', color: 'text-indigo-400', label: 'Global Coverage (700M+)' },
                { icon: 'solar:check-circle-bold', color: 'text-emerald-400', label: 'Real-time Verification Engine' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="flex items-center gap-4 text-sm font-medium text-slate-300">
                  <div className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center ${color} border border-slate-700`}>
                    <Icon icon={icon} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Validation Log Card */}
          <div className="relative perspective-midrange group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full translate-x-10 translate-y-10 group-hover:bg-indigo-500/30 transition-all duration-700" />
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:rotate-y-5 hover:rotate-x-5 transform-style-preserve-3d">
              <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-200">Validation Log</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide">Scanning Live</span>
              </div>

              <div className="space-y-3">
                {[
                  { email: 'alex.m@stripe.com', status: 'VALID', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: '' },
                  { email: 'j.doe@uber.com', status: 'VALID', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: 'opacity-80' },
                  { email: 'sarah@deadstartup.io', status: 'BOUNCE', color: 'text-brand-red', icon: 'solar:close-circle-linear', dot: 'bg-brand-red', opacity: 'opacity-50', strike: true },
                  { email: 'mike@vercel.com', status: 'VERIFYING...', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: 'opacity-30' },
                ].map(({ email, status, color, icon, dot, opacity, strike }) => (
                  <div key={email} className={`flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 ${opacity}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      <div className={`text-sm text-slate-200 font-mono ${strike ? 'line-through text-slate-400' : ''}`}>{email}</div>
                    </div>
                    <div className={`text-[10px] font-bold ${color} font-mono flex items-center gap-1.5`}>
                      <Icon icon={icon} width={12} /> {status}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white mb-1 tracking-tight">712M</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Total Records</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400 mb-1 tracking-tight">98.2%</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Deliverability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pristine-data-site/components/StatsSection.tsx
git commit -m "feat: add StatsSection component"
```

---

## Task 9: FeaturesSection and ComparisonTable components

**Files:**
- Create: `pristine-data-site/components/FeaturesSection.tsx`
- Create: `pristine-data-site/components/ComparisonTable.tsx`

- [ ] **Step 1: Create FeaturesSection.tsx**

```tsx
import { Icon } from '@iconify/react'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">The Intelligence Engine</h2>
          <p className="text-base text-slate-700 dark:text-slate-400 max-w-xl mx-auto">
            From raw search to closed deal, powered by granular data and deep AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1: Natural Language Search */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="mb-8 flex-1">
              <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-inner h-full flex flex-col">
                <div className="relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 shadow-sm mb-4">
                  <span className="absolute -top-2 left-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">Prompt</span>
                  "Find me CMOs at SaaS companies with $10M+ ARR"
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Found: 712,405 matches</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">View All</span>
                  </div>
                  {[1, 2].map((n) => (
                    <div key={n} className={`bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 flex items-center gap-3 ${n === 2 ? 'opacity-60' : ''}`}>
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-24 mb-1.5" />
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-16" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Icon icon="solar:check-circle-bold" width={10} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Icon icon="solar:magnifer-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Natural Language Search</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stop filtering columns. Just ask. Our AI parses complex queries to find people, companies, and revenue data instantly.
              </p>
            </div>
          </div>

          {/* Feature 2: Verified SMTP Lists */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="mb-8 flex-1 flex flex-col justify-center">
              <div className="space-y-2">
                {[
                  { initials: 'JM', email: 'john@acme.com', opacity: '' },
                  { initials: 'SD', email: 'sarah@corp.io', opacity: 'opacity-70' },
                  { initials: 'MK', email: 'mike@krea.ai', opacity: 'opacity-40' },
                ].map(({ initials, email, opacity }) => (
                  <div key={email} className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle ${opacity}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">{initials}</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{email}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                      <Icon icon="solar:check-circle-bold" width={12} /> SMTP OK
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Icon icon="solar:shield-check-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Verified SMTP Lists</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Create lists that actually land in the inbox. We perform real-time SMTP pings to verify validity before you export.
              </p>
            </div>
          </div>

          {/* Feature 3: Strategy-Led Outreach */}
          <div className="flex flex-col hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 bg-white dark:bg-slate-950 h-full border-slate-200 dark:border-slate-800 border rounded-2xl p-8 shadow-sm">
            <div className="flex-1 mb-8">
              <div className="text-[11px] leading-loose text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                <span className="text-indigo-500 dark:text-indigo-400">Subject:</span> Solving the {'{{strategic_challenge}}'}<br />
                Hi {'{{first_name}}'},<br />
                <span className="bg-yellow-100/50 dark:bg-yellow-900/20 text-slate-700 dark:text-slate-300 px-1 rounded">Noticed in your Q3 report that reducing CAC is a priority.</span>{' '}
                Given your goal to <span className="bg-yellow-100/50 dark:bg-yellow-900/20 text-slate-700 dark:text-slate-300 px-1 rounded">expand into EMEA</span>...
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Icon icon="solar:target-bold" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Strategy-Led Outreach</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate emails based on the strategic objectives and challenges of the company. We analyze reports to find their pain points.
              </p>
            </div>
          </div>

          {/* Feature 4: Opportunity Playbook */}
          <div className="flex flex-col hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 bg-white dark:bg-slate-950 h-full border-slate-200 dark:border-slate-800 border rounded-2xl p-8 shadow-sm">
            <div className="mb-8 flex-1">
              <div className="playbook-grid">
                {[
                  { icon: 'solar:key-minimalistic-square-linear', label: 'Openers', value: '"Saw your talk at SaaStr..."' },
                  { icon: 'solar:target-linear', label: 'Objectives', value: 'Reduce CAC by 20%' },
                  { icon: 'solar:users-group-rounded-linear', label: 'Social', value: 'Active on LinkedIn (Daily)' },
                  { icon: 'solar:case-minimalistic-linear', label: 'Experience', value: 'Ex-Salesforce VP' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="playbook-cell hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                      <Icon icon={icon} width={12} /> {label}
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Icon icon="solar:book-2-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Opportunity Playbook</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep intelligence on every prospect. Get instant access to Sales Openers, Strategic Objectives, Social Summaries, and Experience data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create ComparisonTable.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const rows = [
  { feature: 'Database Size', pristine: '700M+ Contacts', traditional: '~250M Contacts' },
  { feature: 'Data Accuracy', pristine: '90% Verified', traditional: '~70% Verified' },
  { feature: 'Search Engine', pristine: 'Natural Language AI', traditional: 'Filter Columns' },
  { feature: 'Enrichment Cost', pristine: 'All-in-one Platform', traditional: 'ZoomInfo + Clay + OpenAI + Instantly' },
]

export function ComparisonTable() {
  return (
    <section className="bg-white dark:bg-slate-950 pt-24 pb-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">Why the top 1% choose Pristine</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Don't settle for stale databases or fragmented tools.</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-950">
          {/* Header */}
          <div className="grid grid-cols-2 md:grid-cols-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <div className="hidden md:flex p-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider items-center">Feature</div>
            <div className="col-span-1 p-5 bg-slate-50 dark:bg-slate-900 border-r md:border-x border-slate-200 dark:border-slate-800 flex items-center">
              <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={80} height={24} className="h-6 w-auto dark:hidden" />
              <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={80} height={24} className="h-6 w-auto hidden dark:block" />
            </div>
            <div className="col-span-1 p-5 flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500">Traditional Stack</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map(({ feature, pristine, traditional }) => (
              <div key={feature} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <div className="px-5 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider md:hidden">{feature}</div>
                <div className="grid grid-cols-2 md:grid-cols-3">
                  <div className="hidden md:flex p-5 text-sm font-medium text-slate-700 dark:text-slate-300 items-center">{feature}</div>
                  <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 border-r md:border-x border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <Icon icon="solar:check-circle-bold" width={18} /> {pristine}
                    </div>
                  </div>
                  <div className="p-4 md:p-5 text-sm text-slate-500 dark:text-slate-500">
                    <div className="flex gap-2 items-center">
                      <Icon icon="solar:close-circle-linear" className="text-slate-300 dark:text-slate-600 flex-shrink-0" width={18} />
                      {traditional}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/contact-us"
            className="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-none transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            Book a Custom Demo
            <Icon icon="solar:arrow-right-linear" width={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add pristine-data-site/components/FeaturesSection.tsx pristine-data-site/components/ComparisonTable.tsx
git commit -m "feat: add FeaturesSection and ComparisonTable components"
```

---

## Task 10: Home page (app/page.tsx) with SEO

**Files:**
- Modify: `pristine-data-site/app/page.tsx`

- [ ] **Step 1: Copy assets to public folder**

```bash
cp -r pristine-data-site/assets pristine-data-site/public/
```

Create a placeholder OG image (1200×630 white PNG) if none exists:

```bash
# Skip if you have a real OG image — just ensure public/og-image.png exists
touch pristine-data-site/public/og-image.png
```

- [ ] **Step 2: Replace app/page.tsx**

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { StatsSection } from '@/components/StatsSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { ComparisonTable } from '@/components/ComparisonTable'

export const metadata: Metadata = {
  title: 'Pristine Data AI - The All-in-One GTM Platform',
  description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts. Stop paying for ZoomInfo, Amplemarket, and OpenAI separately.',
  alternates: { canonical: 'https://pristinedata.ai' },
  openGraph: {
    title: 'Pristine Data AI - The All-in-One GTM Platform',
    description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts.',
    url: 'https://pristinedata.ai',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Pristine Data AI' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pristine Data AI - The All-in-One GTM Platform',
    description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts.',
    images: ['/og-image.png'],
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Pristine Data AI',
            applicationCategory: 'BusinessApplication',
            description: 'The all-in-one GTM platform with 700M+ verified contacts, AI-powered search, and automated outreach.',
            url: 'https://pristinedata.ai',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <ComparisonTable />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Run build and verify**

```bash
cd pristine-data-site && npm run build
```

Expected: `out/index.html` generated. No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add pristine-data-site/app/page.tsx pristine-data-site/public/
git commit -m "feat: add home page with full SEO metadata and JSON-LD"
```

---

## Task 11: About Us page

**Files:**
- Create: `pristine-data-site/app/about-us/page.tsx`

- [ ] **Step 1: Read about-us.html to extract content**

Open `pristine-data-site/about-us.html` and identify all sections. Convert the `<body>` content to JSX following the same patterns used in Task 10 (className, next/image for logos, next/link for hrefs, @iconify/react for icons). Wrap in `<Navbar />` and `<Footer />`.

- [ ] **Step 2: Create app/about-us/page.tsx**

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
// ... paste converted JSX from about-us.html body here

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the Pristine Data AI team and our mission to build the world\'s most accurate B2B data platform.',
  alternates: { canonical: 'https://pristinedata.ai/about-us' },
  openGraph: {
    title: 'About Us | Pristine Data AI',
    description: 'Learn about the Pristine Data AI team and our mission.',
    url: 'https://pristinedata.ai/about-us',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Pristine Data AI',
    description: 'Learn about the Pristine Data AI team and our mission.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* converted about-us.html sections */}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: `out/about-us/index.html` generated.

- [ ] **Step 4: Commit**

```bash
git add pristine-data-site/app/about-us/
git commit -m "feat: add About Us page with SEO metadata"
```

---

## Task 12: Contact Us page

**Files:**
- Create: `pristine-data-site/app/contact-us/page.tsx`

- [ ] **Step 1: Convert contact-us.html body to JSX and create page**

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
// ... paste converted JSX from contact-us.html body here

export const metadata: Metadata = {
  title: 'Book a Demo',
  description: 'Book a personalized demo with the Pristine Data AI team and see 700M+ verified contacts in action.',
  alternates: { canonical: 'https://pristinedata.ai/contact-us' },
  openGraph: {
    title: 'Book a Demo | Pristine Data AI',
    description: 'Book a personalized demo with the Pristine Data AI team.',
    url: 'https://pristinedata.ai/contact-us',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Demo | Pristine Data AI',
    description: 'Book a personalized demo with the Pristine Data AI team.',
    images: ['/og-image.png'],
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* converted contact-us.html sections */}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `out/contact-us/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add pristine-data-site/app/contact-us/
git commit -m "feat: add Contact Us page with SEO metadata"
```

---

## Task 13: Integrations page

**Files:**
- Create: `pristine-data-site/app/integrations/page.tsx`

- [ ] **Step 1: Convert integrations.html body to JSX and create page**

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Connect Pristine Data AI with your existing CRM, outreach, and sales tools. Native integrations with HubSpot, Salesforce, Instantly, and more.',
  alternates: { canonical: 'https://pristinedata.ai/integrations' },
  openGraph: {
    title: 'Integrations | Pristine Data AI',
    description: 'Connect Pristine Data AI with your existing tools.',
    url: 'https://pristinedata.ai/integrations',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Integrations | Pristine Data AI',
    description: 'Connect Pristine Data AI with your existing tools.',
    images: ['/og-image.png'],
  },
}

export default function IntegrationsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* converted integrations.html sections */}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `out/integrations/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add pristine-data-site/app/integrations/
git commit -m "feat: add Integrations page with SEO metadata"
```

---

## Task 14: Stack Audit pages

**Files:**
- Create: `pristine-data-site/app/stack-audit/page.tsx`
- Create: `pristine-data-site/app/stack-audit-embed/page.tsx`

- [ ] **Step 1: Convert stack-audit.html body to JSX**

Note: `stack-audit.html` reads a `team_size` query param. In Next.js static export there are no server-side params, so read it client-side with `useSearchParams()` in a `'use client'` component.

Create `app/stack-audit/StackAuditClient.tsx`:

```tsx
'use client'
import { useSearchParams } from 'next/navigation'
// paste the stack-audit interactive section here, reading team_size from useSearchParams()

export function StackAuditClient() {
  const params = useSearchParams()
  const teamSize = params.get('team_size')
  // ... rest of component
  return <div>{/* stack audit content */}</div>
}
```

Create `app/stack-audit/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StackAuditClient } from './StackAuditClient'

export const metadata: Metadata = {
  title: 'Stack Audit',
  description: 'Audit your current GTM stack and discover how much you could save with Pristine Data AI.',
  alternates: { canonical: 'https://pristinedata.ai/stack-audit' },
  openGraph: {
    title: 'GTM Stack Audit | Pristine Data AI',
    description: 'Audit your current GTM stack and discover how much you could save.',
    url: 'https://pristinedata.ai/stack-audit',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTM Stack Audit | Pristine Data AI',
    description: 'Audit your current GTM stack and discover how much you could save.',
    images: ['/og-image.png'],
  },
}

export default function StackAuditPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <StackAuditClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Convert stack-audit-embed.html similarly**

Create `app/stack-audit-embed/page.tsx` — this page typically has no Navbar/Footer (it's an embed). Convert the body, mark as `'use client'` if it uses JS interactivity.

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stack Audit Embed',
  robots: { index: false, follow: false },
}

export default function StackAuditEmbedPage() {
  return (
    <main>
      {/* converted stack-audit-embed.html body — no Navbar/Footer */}
    </main>
  )
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: `out/stack-audit/index.html` and `out/stack-audit-embed/index.html` generated.

- [ ] **Step 4: Commit**

```bash
git add pristine-data-site/app/stack-audit/ pristine-data-site/app/stack-audit-embed/
git commit -m "feat: add Stack Audit and Stack Audit Embed pages"
```

---

## Task 15: Delete old HTML files and final build

**Files:**
- Delete: all `.html` files in `pristine-data-site/`

- [ ] **Step 1: Delete old HTML files**

```bash
cd pristine-data-site
rm index.html about-us.html contact-us.html integrations.html stack-audit.html stack-audit-embed.html
```

- [ ] **Step 2: Run final production build**

```bash
npm run build
```

Expected: Clean build, `out/` folder contains:
```
out/
  index.html
  about-us/index.html
  contact-us/index.html
  integrations/index.html
  stack-audit/index.html
  stack-audit-embed/index.html
  _next/         (JS/CSS bundles)
```

- [ ] **Step 3: Spot-check output**

```bash
cat out/index.html | grep -i "og:title"
```

Expected: `<meta property="og:title" content="Pristine Data AI - The All-in-One GTM Platform" />`

```bash
cat out/index.html | grep -i "description"
```

Expected: meta description tag present.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "feat: complete Next.js migration — remove old HTML files"
git push origin migration
```

---

## Self-Review

**Spec coverage check:**
- ✅ All 6 pages migrated (Tasks 10–14)
- ✅ Next.js static export configured (Task 1)
- ✅ Tailwind config ported (Task 2)
- ✅ Dark mode via ThemeProvider (Task 3)
- ✅ Manrope via next/font (Task 4)
- ✅ Analytics via next/script (Task 4)
- ✅ Navbar with dark toggle + mobile menu (Task 5)
- ✅ Footer (Task 6)
- ✅ All shared components (Tasks 7–9)
- ✅ SEO metadata (og, twitter, canonical, robots, JSON-LD) on all pages (Tasks 10–14)
- ✅ Assets copied to public/ (Task 10)
- ✅ Old HTML files deleted (Task 15)
- ✅ stack-audit query param handled client-side (Task 14)
- ✅ stack-audit-embed robots: noindex (Task 14)
