# PM Recommendation: GTM Stack Cost Audit — Placement Strategy

**Decision:** Option C — Both (Embedded Teaser + Standalone Page)
**Date consulted:** 2026-03-08

---

## Strategic Roles

| Asset | Job | Funnel Position |
|-------|-----|-----------------|
| `stack-audit.html` (standalone `/stack-audit`) | Acquisition, SEO, LinkedIn sharing | Top-of-funnel |
| `stack-audit-embed.html` (homepage section) | Conversion accelerant for existing visitors | Mid-funnel |

---

## Why the Standalone Page is Non-Negotiable

- **LinkedIn shareability** — RevOps people need a clean URL (`pristinedata.ai/stack-audit`) to share. Nobody shares a homepage link.
- **SEO** — Can rank for "GTM stack cost calculator," "Apollo + ZoomInfo cost," "sales tool stack ROI"
- **Paid campaigns** — Standalone page is the correct landing page target
- **Higher engagement quality** — Self-selected visitors spend more time, take results more seriously

## Why the Homepage Embed Matters

- Captures mid-funnel visitors who would not navigate to a separate page
- Makes the homepage narrative tangible ("show, don't tell")
- Drives incremental demo bookings from existing homepage traffic

---

## Execution Plan

### Phase 1 (Immediate)
- [x] Deploy `stack-audit.html` as standalone page at `/stack-audit`
- [x] Keep `stack-audit-embed.html` as homepage section — acts as teaser, links to standalone
- [ ] Add "Share on LinkedIn" button to standalone page results with pre-written post text
- [ ] Primary CTA on standalone results: "Book a Demo"

### Phase 2 (Within 2 weeks)
- [ ] Add UTM tracking — distinguish demo bookings from homepage embed vs. standalone vs. LinkedIn referral
- [ ] Instrument standalone page analytics (tool selections, team size) for retargeting
- [ ] Test "gated full results" variant: top-line cost shown free, overlap breakdown requires email

### Phase 3 (Month 2)
- [ ] Evaluate if homepage embed is driving standalone page traffic; if not, test simpler CTA banner
- [ ] Build SEO content cluster: "GTM Stack Benchmarks 2026," "Apollo vs. ZoomInfo: Total Cost Comparison" — all link to `/stack-audit`
- [ ] A/B test standalone page CTA independently of homepage

---

## Risk of Skipping Standalone Page

No shareable URL = LinkedIn distribution dead before it starts. This is the biggest organic growth lever for this tool.

## Risk of Skipping Homepage Embed

Lose "show, don't tell" moment for mid-funnel visitors. Miss conversion lift from interactive hook.

---

## Homepage Embed Design Direction (PM note)

The embed should be a **teaser**, not a miniaturized replica:
- Show 4 recognizable logos (Apollo, ZoomInfo, Clay, Gong)
- Single input: team size
- "Run My Audit →" → navigates to full standalone page

Keep homepage narrative clean. Let the standalone page carry the full experience.
