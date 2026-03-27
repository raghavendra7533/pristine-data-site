import type { PersonalizationMode } from "@/pages/CreateCampaign";

export interface CampaignTheme {
  id: string;
  icon: string;
  title: string;
  mode: PersonalizationMode;
  info: string;
  stages?: string[];
  iconBg: string;
  iconColor: string;
}

export const campaignThemes: CampaignTheme[] = [
  {
    id: "custom-sales",
    icon: "solar:chat-square-like-linear",
    title: "Custom Sales Outreach",
    mode: "full_ai",
    info: "AI crafts a fully custom outreach sequence based on your instructions.",
    iconBg: "bg-violet-100 dark:bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "selective-ai",
    icon: "solar:tuning-2-linear",
    title: "Selective AI",
    mode: "selective",
    info: "You write the structure, AI fills in dynamic sections. Full control with AI-powered personalization.",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "sales-outreach",
    icon: "solar:target-linear",
    title: "Sales Outreach",
    mode: "full_ai",
    info: "Reach out to qualified prospects with tailored messaging for lead generation.",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    stages: [
      "Stage 1: Cold intro with pain-point hook",
      "Stage 2: Value-driven follow-up with proof point",
      "Stage 3: Case study or social proof",
      "Stage 4: Direct ask for meeting",
      "Stage 5: Breakup email",
    ],
  },
  {
    id: "lead-nurture",
    icon: "solar:heart-linear",
    title: "Lead Nurture",
    mode: "full_ai",
    info: "Develop relationships over time through educational content and value-driven touchpoints.",
    iconBg: "bg-pink-100 dark:bg-pink-500/15",
    iconColor: "text-pink-600 dark:text-pink-400",
    stages: [
      "Stage 1: Educational content share",
      "Stage 2: Industry insight or trend",
      "Stage 3: Relevant webinar/event invite",
      "Stage 4: Personalized recommendation",
      "Stage 5: Soft check-in + meeting option",
    ],
  },
  {
    id: "event-outreach",
    icon: "solar:users-group-rounded-linear",
    title: "Event Outreach",
    mode: "full_ai",
    info: "Reach out to prospects before conferences, webinars, and networking events.",
    iconBg: "bg-orange-100 dark:bg-orange-500/15",
    iconColor: "text-orange-600 dark:text-orange-400",
    stages: [
      "Stage 1: Pre-event intro + value prop",
      "Stage 2: Event-day reminder + booth/session CTA",
      "Stage 3: Post-event follow-up with takeaways",
      "Stage 4: Resource share + meeting ask",
      "Stage 5: Final nudge with social proof",
    ],
  },
  {
    id: "competitor-takeout",
    icon: "solar:graph-up-linear",
    title: "Competitor Takeout",
    mode: "full_ai",
    info: "Target accounts currently using competitor solutions with conversion incentives.",
    iconBg: "bg-rose-100 dark:bg-rose-500/15",
    iconColor: "text-rose-600 dark:text-rose-400",
    stages: [
      "Stage 1: Acknowledge current tool + differentiation hook",
      "Stage 2: Specific limitation they likely face",
      "Stage 3: Migration success story",
      "Stage 4: Offer (audit, trial, incentive)",
      "Stage 5: Final direct ask",
    ],
  },
  {
    id: "awareness",
    icon: "solar:bolt-linear",
    title: "Awareness",
    mode: "full_ai",
    info: "Increase visibility and educate prospects about your brand and solutions.",
    iconBg: "bg-amber-100 dark:bg-amber-500/15",
    iconColor: "text-amber-600 dark:text-amber-400",
    stages: [
      "Stage 1: Brand intro with unique angle",
      "Stage 2: Problem-solution framing",
      "Stage 3: Customer proof or data point",
      "Stage 4: Interactive CTA (demo, quiz, tool)",
      "Stage 5: Final summary + direct ask",
    ],
  },
  {
    id: "recruitment",
    icon: "solar:user-plus-linear",
    title: "Recruitment Outreach",
    mode: "full_ai",
    info: "Attract top talent with personalized outreach highlighting culture and opportunity.",
    iconBg: "bg-cyan-100 dark:bg-cyan-500/15",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    stages: [
      "Stage 1: Role intro + why them",
      "Stage 2: Culture & team story",
      "Stage 3: Compensation / growth angle",
      "Stage 4: Direct ask for a call",
      "Stage 5: Final nudge",
    ],
  },
  {
    id: "static",
    icon: "solar:document-text-linear",
    title: "Static Theme",
    mode: "static",
    info: "Write everything yourself. Only simple merge tokens (first name, company) are available.",
    iconBg: "bg-slate-100 dark:bg-slate-500/15",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
];

export const mockContactLists = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 },
];
