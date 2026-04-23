# PRD: GTM Stack Cost Audit Tool

**Product:** Free frontend-only web tool  
**Owner:** Pristine Data AI  
**Goal:** Top-of-funnel lead magnet that validates the tool sprawl narrative and routes high-intent visitors to a Pristine demo

---

## Problem Statement

Sales and RevOps leaders underestimate how much they're spending on fragmented GTM tools. Nobody has done the math for them in real time. This tool does it in 60 seconds — and makes Pristine the obvious alternative.

---

## User

VP Sales, RevOps Lead, CRO, Demand Gen Manager at Series A–C SaaS companies. Already using 3+ GTM tools. Budget-conscious but spending without realizing it.

---

## Core Flow

**Step 1 — Tool Selection**  
User sees a grid of GTM tool logos with checkboxes. Grouped into categories: Prospecting, Enrichment, Outreach/Sequencing, Analytics/Intelligence. Min 15 tools across categories. User checks all tools they currently use.

**Step 2 — Team Size Input**  
Single input: "How many reps on your team?" (slider or number input, range 1–500)

**Step 3 — Live Results (no page reload)**  
Results update dynamically as user makes selections. Shows:
- Total monthly spend
- Total annual spend (highlighted — make it sting)
- Number of overlapping function categories (e.g., "3 of your tools do enrichment")
- Stack Health Score (0–100, calculated from overlap + cost + fragmentation)
- A category breakdown bar showing which jobs-to-be-done are covered by how many tools

**Step 4 — CTA**  
"Your stack has X overlapping functions and costs $Y/year. See what one platform looks like." → Button to book a demo at pristinedata.ai

---

## Tool Data (hardcoded, no API)

| Tool | Category | Monthly Cost/Seat | Notes |
|------|----------|-------------------|-------|
| Apollo.io | Prospecting + Outreach | $99 | Most common tier |
| ZoomInfo | Prospecting + Enrichment | $250 | Estimated per seat |
| Clay | Enrichment | $149 | Growth tier |
| LinkedIn Sales Nav | Prospecting | $99 | Core plan |
| Outreach | Sequencing | $130 | Per seat |
| Salesloft | Sequencing | $125 | Per seat |
| Lemlist | Outreach | $59 | Email outreach |
| Instantly | Outreach | $37 | Sending infra |
| Clearbit | Enrichment | $99 | Estimated |
| Lusha | Enrichment | $79 | Pro tier |
| Hunter.io | Prospecting | $49 | Growth tier |
| Seamless.ai | Prospecting | $147 | Pro |
| Smartlead | Outreach | $94 | Popular tier |
| Gong | Intelligence | $200 | Per seat estimate |
| Bombora | Intent | $200 | Estimated |

---

## Stack Health Score Logic

Start at 100. Deduct:
- **−10** for every category with 2+ tools (overlap penalty)
- **−5** for every $500/month over $1,000 total (cost penalty)
- **−10** if no analytics/intelligence tool present (visibility gap)
- **−5** if outreach and prospecting are in separate tools (fragmentation penalty)

Score bands:
- **80–100** = Lean
- **50–79** = Bloated
- **0–49** = Critical

---

## Design Direction

Dark mode. Matches Pristine's design system (slate backgrounds, white text, clean sans-serif). The annual cost number should be large, red, and impossible to ignore. Stack Health Score displayed as a gauge or bold number with color coding (green → red). No clutter — the math does the selling.

---

## What This Is NOT

- No backend, no database, no auth
- No form gate (frictionless is the point)
- No pricing for Pristine shown (this isn't a pricing page)
- No AI calls needed

---

## Success Metric

Visitors who complete the audit click "Book a Demo" at a higher rate than the existing homepage CTA. Secondary: tool gets shared on LinkedIn by RevOps practitioners.