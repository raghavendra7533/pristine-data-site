# Blog Section — Design Spec
**Date:** 2026-04-22  
**Status:** Approved

---

## Goal

Migrate 8 existing WordPress/PHP blog posts into the Next.js app as a fully static, SEO/GEO-optimised blog section. Posts are GTM-focused only (no HR, no job search content). The section lives in the footer only (not the main nav).

---

## File Structure

```
app/
  blog/
    page.tsx                  ← /blog index page
    [slug]/
      page.tsx                ← /blog/[slug] individual article
lib/
  blogs.ts                    ← single source of truth for all blog data
components/
  blog/
    BlogCard.tsx              ← card used on the index page grid
    BlogContent.tsx           ← renders structured sections
```

---

## Data Model (`lib/blogs.ts`)

```ts
type Section = {
  heading?: string      // h2 or h3 depending on nesting level
  subheading?: string   // optional h3 under a heading
  body?: string[]       // paragraphs (plain prose)
  list?: string[]       // bullet points
}

type BlogPost = {
  slug: string          // URL-safe, descriptive, GTM-keyword-rich
  title: string         // Article h1
  description: string   // 150-160 chars for meta description + OG
  date: string          // ISO date "YYYY-MM-DD"
  image: string         // path relative to /public, e.g. /images/blog-1.webp
  sections: Section[]   // ordered article body
}

export const blogs: BlogPost[] = [ /* 8 posts */ ]
```

Adding a new blog = prepend a new `BlogPost` object to the `blogs` array. No other changes needed.

---

## The 8 Blog Posts

| # | New Slug | Original Title |
|---|----------|---------------|
| 1 | `quota-killers-what-top-b2b-reps-do-differently` | B2B Sales Is More Challenging Than Ever |
| 2 | `mid-market-b2b-sales-competitive-edge` | Why Mid-Market Sellers Feel Like Underdogs |
| 3 | `why-mid-market-b2b-sales-is-hard` | The Real Deal: Why Mid-Market B2B Sales Is Such a Tough Gig |
| 4 | `b2b-buyer-expectations-sales-challenge-part-1` | Why B2B Companies Are Failing Their Buyers (Part 1) |
| 5 | `buyer-enablement-new-era-b2b-sales` | From Selling to Buyer Enablement |
| 6 | `prospect-research-b2b-sales` | Why Prospect Research Matters |
| 7 | `sales-marketing-alignment-funnel` | Aligning Sales and Marketing Across the Sales Funnel |
| 8 | `b2b-buying-committee-challenge-part-2` | Why B2B Companies Are Failing Their Buyers (Part 2) |

---

## Content Rewrite Rules

Applied to every article:

1. **Strip keyword stuffing** — replace phrases like "AI-powered sales automation tools", "hyper-personalized sales outreach", "best AI tools for prospect research" with plain language equivalents.
2. **Cut per-section product plugs** — remove all "How PristineData.ai Helps" sub-sections throughout the body.
3. **Preserve substance** — keep all stats, frameworks, insights, and structural headings.
4. **One CTA per article** — a single closing section with a short paragraph and two links: "Book a Demo" (`/contact`) and "Take a Tour" (`/try-it`).
5. **GTM only** — any HR or job search framing is removed.

---

## Index Page (`/blog`)

- `Metadata`: title "GTM & B2B Sales Insights | Pristine Data AI", description, canonical, OG, Twitter card
- JSON-LD `ItemList` schema listing all article URLs — picked up by AI search engines (Perplexity, ChatGPT)
- Layout: hero header + responsive grid of `BlogCard` components
- `BlogCard`: image, date, title, 1-line excerpt (first sentence of first body paragraph), link to article
- No pagination (8 posts fit one page)

---

## Individual Article Pages (`/blog/[slug]`)

- `generateStaticParams` exports all slugs → fully static at build time (SSG)
- `generateMetadata` returns per-post title, description, canonical URL, OG image, Twitter card
- JSON-LD `Article` schema: headline, datePublished, author (Pristine Data AI), publisher, image, url
- Layout: article header (title, date, hero image) → `BlogContent` sections → CTA → Related Posts (3 cards)
- Related posts: 3 other posts from `blogs`, excluding current — ordered by recency

---

## Components

### `BlogContent`
Renders `Section[]` as semantic HTML:
- `heading` → `<h2>`
- `subheading` → `<h3>`
- `body[]` → `<p>` per item
- `list[]` → `<ul><li>` per item

Prose styled with Tailwind typography classes (matching existing site font/color system).

### `BlogCard`
Used on both the index page and the related posts section at the bottom of articles.
Props: `post: BlogPost`. Renders image, date, title, excerpt as a linked card.

---

## SEO / GEO Checklist

- [x] Per-page `generateMetadata` (title, description, canonical, OG, Twitter)
- [x] JSON-LD `Article` on each post
- [x] JSON-LD `ItemList` on index
- [x] `generateStaticParams` for full SSG (no server runtime needed)
- [x] Semantic HTML structure (h1 → h2 → h3)
- [x] Human prose (no keyword stuffing)
- [x] Internal linking via related posts
- [x] Footer link to `/blog` (to be noted — footer update is out of scope here but required for crawl discovery)

---

## Out of Scope

- CMS or database — content lives in `lib/blogs.ts`
- Blog search or filtering
- Author profiles
- Pagination
- Comments
- Footer update (separate task)
