# GTM Stack Audit — Pricing Calculation Model

## How Base Costs Are Calculated

```
Monthly Cost = Σ(selected_tool.cost × team_size)
Annual Cost  = Monthly Cost × 12
```

Each tool has a flat **per-seat monthly price** (publicly listed pricing):

| Tool | Per Seat/Mo | Categories |
|---|---|---|
| Apollo.io | $99 | Prospecting, Outreach |
| ZoomInfo | $250 | Prospecting, Enrichment |
| Sales Navigator | $99 | Prospecting |
| Seamless.ai | $147 | Prospecting |
| Hunter.io | $49 | Prospecting |
| Clay | $149 | Enrichment |
| Clearbit | $99 | Enrichment |
| Lusha | $79 | Enrichment |
| Outreach | $130 | Outreach |
| Salesloft | $125 | Outreach |
| Lemlist | $59 | Outreach |
| Instantly | $37 | Outreach |
| Smartlead | $94 | Outreach |
| Gong | $200 | Intelligence |
| Bombora | $200 | Intelligence |

---

## The X-Factor: Volume-Based Overages (Taxes)

This is where costs become **exponential**. Most GTM tools have a credit or volume model on top of seat pricing. At scale, volume overages frequently exceed the base seat cost.

### Tool Classification

**Data Tools** (charged by prospect/contact database size):
`apollo`, `zoominfo`, `seamless`, `hunter`, `clay`, `clearbit`, `lusha`

**Email Tools** (charged by monthly email send volume):
`outreach-io`, `salesloft`, `lemlist`, `instantly`, `smartlead`, `apollo`

> Apollo appears in both — it charges for contact data exports AND email sequencing sends.

---

### Prospect Database Volume Tax

Monthly overage **per data tool selected** at each tier:

| Tier | Contacts | Overage/Tool/Mo | Basis |
|---|---|---|---|
| 0 | < 5k | $0 | Included in base plan |
| 1 | 5k – 25k | $100 | Credit top-up costs across Apollo, Lusha, Hunter |
| 2 | 25k – 100k | $400 | Plan upgrade or credit overages for Clay, ZoomInfo |
| 3 | 100k – 250k | $900 | Enterprise tier jump for ZoomInfo, Clearbit (HubSpot credits) |
| 4 | 250k+ | $2,200 | Custom enterprise pricing — ZoomInfo, Clearbit, Seamless all spike |

**Example impact (5 data tools at Tier 3, 100-250k contacts):**
`5 tools × $900/mo = $4,500/mo extra = $54,000/yr just in data overages`

**Real-world basis:**
- ZoomInfo: Credits priced at $2–3 each; 100k contacts requires substantial annual credit packs ($15k–75k/yr range)
- Clay: Credits-based at ~$0.14–1.42/contact enrichment row; Pro plan ($800/mo) covers ~3,750–7,500 contacts/mo
- Apollo: Export credits overage ~$0.20/credit; 100k contacts blows through included credits fast
- Clearbit (now HubSpot Breeze): $10/1,000 HubSpot credits; scales linearly with contact volume

---

### Email Send Volume Tax

Monthly overage **per email tool selected** at each tier:

| Tier | Emails/Month | Overage/Tool/Mo | Basis |
|---|---|---|---|
| 0 | < 25k | $0 | Included in base plan |
| 1 | 25k – 100k | $60 | Instantly Hypergrowth upgrade, Smartlead Pro tier |
| 2 | 100k – 250k | $180 | Add-on packs for Instantly; Smartlead custom tier |
| 3 | 250k – 500k | $380 | Instantly Light Speed; Smartlead + Lemlist team expansion |
| 4 | 500k+ | $750 | Enterprise custom for all tools; Instantly maxes out standard plans |

**Example impact (3 email tools at Tier 3, 250–500k emails/mo):**
`3 tools × $380/mo = $1,140/mo extra = $13,680/yr in email volume overages`

**Combined example (realistic scale-up company, 10 reps):**
- 5 data tools at 250k+ contacts → `5 × $2,200 = $11,000/mo` *(each tool bills credits independently)*
- Email send volume at 250-500k/mo → `$380/mo flat` *(you send through one tool — the others are idle)*
- Seat cost (10 reps, all 15 tools) → ~$15,680/mo
- **Total: ~$27,060/mo = ~$324,720/yr**

vs. Pristine Data AI replacing the entire stack.

> **Why data tools multiply but email doesn't:** ZoomInfo, Apollo, Clay, Clearbit, and Lusha each charge their own credits to enrich the same contacts — you pay all five separately. Email is different: you route sends through one sequencer. The other email tools are seat-cost waste, not volume-cost waste.

---

## Stack Health Score

Starts at 100, deductions:

| Condition | Deduction |
|---|---|
| Each category with ≥ 2 overlapping tools | -10 pts |
| Monthly spend > $1,000: every $500 above | -5 pts |
| No intelligence tools selected | -10 pts |
| Has both prospecting + outreach but no combined tool | -5 pts |

Score thresholds:
- **80–100**: Lean (green)
- **50–79**: Bloated (amber)
- **0–49**: Critical (red)

---

## Function Overlap Savings

For each category with ≥ 2 tools:

```
savings = (sum of all tool costs in category − cheapest tool cost) × team_size
```

This represents the minimum monthly waste from paying for duplicate functionality.

---

## Disclaimer

All pricing estimates are based on publicly listed pricing as of early 2026. Volume overage figures are simplified estimates derived from each vendor's published tier structures. Actual costs depend on contract terms, negotiated rates, annual commitments, and usage patterns. Discounts of 20–40% are common on annual enterprise contracts.
