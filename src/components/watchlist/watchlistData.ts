import { SignalType } from "./SignalFilterBar";

export interface SignalEvent {
  id: string;
  type: SignalType;
  summary: string;
  detectedAt: string; // ISO string
  source: string;
  seenAt: string | null;
}

export interface WatchlistAccount {
  id: string;
  accountName: string;
  domain: string;
  industry: string;
  revenue: string;
  employees: string;
  location: string;
  addedAt: string;
  monitoredSignals: SignalType[];
  signals: SignalEvent[];
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

export const MOCK_WATCHLIST: WatchlistAccount[] = [
  {
    id: "wa1",
    accountName: "Acme Corp",
    domain: "acmecorp.com",
    industry: "Fintech",
    revenue: "$45M–$60M",
    employees: "320",
    location: "San Francisco, CA",
    addedAt: daysAgo(14),
    monitoredSignals: ["new_funding", "hiring_surge", "intent_surge"],
    signals: [
      {
        id: "sig1",
        type: "new_funding",
        summary:
          "Acme Corp announced a $12M Series A led by Sequoia Capital on March 10, 2026. The round will be used to expand the GTM team and accelerate product development.",
        detectedAt: hoursAgo(6),
        source: "TechCrunch via Pristine",
        seenAt: null,
      },
      {
        id: "sig2",
        type: "hiring_surge",
        summary:
          "Acme Corp posted 18 new roles in Sales and Marketing this week — a 3× increase over their quarterly average, signalling aggressive GTM expansion.",
        detectedAt: hoursAgo(30),
        source: "LinkedIn Jobs via Pristine",
        seenAt: null,
      },
    ],
  },
  {
    id: "wa2",
    accountName: "Velocity Health",
    domain: "velocityhealth.com",
    industry: "HealthTech",
    revenue: "$20M–$30M",
    employees: "145",
    location: "Boston, MA",
    addedAt: daysAgo(21),
    monitoredSignals: ["hiring_surge", "new_product", "cost_cutting"],
    signals: [
      {
        id: "sig3",
        type: "new_product",
        summary:
          "Velocity Health launched 'CareFlow 2.0', a new patient journey automation product, at HIMSS 2026 on March 9. It directly competes in the care coordination space.",
        detectedAt: hoursAgo(52),
        source: "HIMSS press release via Pristine",
        seenAt: null,
      },
    ],
  },
  {
    id: "wa3",
    accountName: "PipelineOS",
    domain: "pipelineos.io",
    industry: "SaaS",
    revenue: "$8M–$15M",
    employees: "68",
    location: "Austin, TX",
    addedAt: daysAgo(7),
    monitoredSignals: ["intent_surge", "hiring_surge"],
    signals: [
      {
        id: "sig4",
        type: "intent_surge",
        summary:
          "PipelineOS is showing very high intent signals on topics matching GTM intelligence, revenue operations software, and B2B data enrichment — Bombora score 87/100.",
        detectedAt: daysAgo(4),
        source: "Bombora via Pristine",
        seenAt: daysAgo(3),
      },
    ],
  },
  {
    id: "wa4",
    accountName: "Meridian Capital",
    domain: "meridiancap.com",
    industry: "Financial Services",
    revenue: "$120M–$200M",
    employees: "520",
    location: "New York, NY",
    addedAt: daysAgo(30),
    monitoredSignals: ["new_funding", "cost_cutting", "intent_surge"],
    signals: [
      {
        id: "sig5",
        type: "cost_cutting",
        summary:
          "Meridian Capital announced a restructuring plan reducing headcount by 12% across operations and back-office functions. Leadership cited macroeconomic headwinds.",
        detectedAt: daysAgo(6),
        source: "Bloomberg via Pristine",
        seenAt: null,
      },
    ],
  },
  {
    id: "wa5",
    accountName: "NorthStar Logistics",
    domain: "northstarlogistics.com",
    industry: "Logistics",
    revenue: "$30M–$50M",
    employees: "210",
    location: "Chicago, IL",
    addedAt: daysAgo(45),
    monitoredSignals: ["new_office", "hiring_surge"],
    signals: [
      {
        id: "sig6",
        type: "new_office",
        summary:
          "NorthStar Logistics opened a new regional operations hub in Dallas, TX, expanding their midwest-to-south corridor coverage. Expected to add 40+ roles.",
        detectedAt: daysAgo(9),
        source: "NorthStar press release via Pristine",
        seenAt: daysAgo(8),
      },
    ],
  },
  {
    id: "wa6",
    accountName: "Quanta Analytics",
    domain: "quantaanalytics.ai",
    industry: "Analytics / AI",
    revenue: "$5M–$10M",
    employees: "42",
    location: "Denver, CO",
    addedAt: daysAgo(10),
    monitoredSignals: ["new_funding", "new_product"],
    signals: [],
  },
];

// Search candidates for the Add Account modal
export const SEARCH_ACCOUNTS = [
  { id: "s1", accountName: "Stripe", domain: "stripe.com", industry: "Fintech", employees: "8000", location: "San Francisco, CA" },
  { id: "s2", accountName: "Rippling", domain: "rippling.com", industry: "HR Tech", employees: "2200", location: "San Francisco, CA" },
  { id: "s3", accountName: "Notion", domain: "notion.so", industry: "Productivity SaaS", employees: "400", location: "San Francisco, CA" },
  { id: "s4", accountName: "Loom", domain: "loom.com", industry: "Video Messaging", employees: "300", location: "San Francisco, CA" },
  { id: "s5", accountName: "Ramp", domain: "ramp.com", industry: "Fintech", employees: "1100", location: "New York, NY" },
  { id: "s6", accountName: "Linear", domain: "linear.app", industry: "Dev Tools", employees: "60", location: "Remote" },
  { id: "s7", accountName: "Retool", domain: "retool.com", industry: "Low-code", employees: "400", location: "San Francisco, CA" },
  { id: "s8", accountName: "Deel", domain: "deel.com", industry: "HR Tech", employees: "3000", location: "San Francisco, CA" },
  { id: "s9", accountName: "Clearbit", domain: "clearbit.com", industry: "Data / Analytics", employees: "200", location: "San Francisco, CA" },
  { id: "s10", accountName: "Apollo.io", domain: "apollo.io", industry: "Sales Intelligence", employees: "500", location: "San Francisco, CA" },
];

export function getUrgencyLevel(signals: SignalEvent[]): "hot" | "warm" | "cool" | "none" {
  if (signals.length === 0) return "none";
  const unseenRecent = signals.filter((s) => {
    const age = Date.now() - new Date(s.detectedAt).getTime();
    return age < 48 * 3600_000 && !s.seenAt;
  });
  if (unseenRecent.length > 0) return "hot";
  const recentUnseen = signals.filter((s) => {
    const age = Date.now() - new Date(s.detectedAt).getTime();
    return age < 7 * 24 * 3600_000 && !s.seenAt;
  });
  if (recentUnseen.length > 0) return "warm";
  return "cool";
}

export function formatRecency(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
