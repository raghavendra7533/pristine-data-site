import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { PersonalizationMode, CampaignData } from "@/pages/CreateCampaign";

interface CampaignSetupProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  onNext: () => void;
}

/* ─── Prebuilt themes (Pristine defaults) ─── */

interface PrebuiltTheme {
  id: string;
  icon: string;
  title: string;
}

const prebuiltThemes: PrebuiltTheme[] = [
  { id: "sales-outreach", icon: "solar:target-linear", title: "Sales Outreach" },
  { id: "lead-nurture", icon: "solar:heart-linear", title: "Lead Nurture" },
  { id: "event-outreach", icon: "solar:users-group-rounded-linear", title: "Event Outreach" },
  { id: "competitor-takeout", icon: "solar:graph-up-linear", title: "Competitor Takeout" },
  { id: "awareness", icon: "solar:bolt-linear", title: "Awareness" },
  { id: "recruitment", icon: "solar:user-plus-linear", title: "Recruitment Outreach" },
];

const mockContactLists = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 },
];

/* ─── Mock saved custom themes ─── */

export interface SavedTheme {
  id: string;
  name: string;
  createdAt: string;
  stages: { title: string; description: string }[];
}

// Shared mutable store so saves persist within session
export const savedThemesStore: SavedTheme[] = [
  {
    id: "theme-1",
    name: "Enterprise ABM Sequence",
    createdAt: "2026-03-10",
    stages: [
      { title: "Warm Intro", description: "AI opens with a reference to a recent company event or leadership change, positioning Pristine as contextually aware." },
      { title: "Pain Point Deep Dive", description: "AI highlights a specific operational bottleneck common in the prospect's industry and connects it to Pristine's value prop." },
      { title: "Case Study Drop", description: "AI pulls a relevant customer success story from Personalization Assets and frames ROI around the prospect's scale." },
    ],
  },
  {
    id: "theme-2",
    name: "Product-Led Growth Drip",
    createdAt: "2026-03-22",
    stages: [
      { title: "Feature Hook", description: "AI highlights a specific feature relevant to the prospect's tech stack and use case." },
      { title: "Social Proof", description: "AI shares metrics from a similar company that adopted the product." },
      { title: "Trial Nudge", description: "A direct, low-friction CTA to start a free trial or book a demo." },
    ],
  },
];

/* ─── Per-stage descriptions for prebuilt themes ─── */

export const prebuiltStageDescriptions: Record<string, { title: string; description: string }[]> = {
  "sales-outreach": [
    { title: "Introduction + Role Acknowledgment", description: "AI opens with a reference to the prospect's strategic objectives and introduces Pristine's relevance to their specific role." },
    { title: "Social Proof", description: "AI finds a relevant case study from your Personalization Assets and frames it around the prospect's industry or pain point." },
    { title: "Value Reinforcement", description: "AI shares a data point or insight tailored to the prospect's company size and vertical, reinforcing urgency." },
    { title: "Direct Ask", description: "A clear, low-friction CTA — typically a 15-minute call — referencing the previous touchpoints." },
    { title: "Breakup Email", description: "A final message that creates soft urgency, summarises the value proposition, and leaves the door open." },
  ],
  "lead-nurture": [
    { title: "Educational Content Share", description: "AI curates a relevant piece of content — blog, report, or guide — based on the prospect's industry and role." },
    { title: "Industry Insight", description: "AI surfaces a trending topic or market shift in the prospect's vertical and ties it back to your solution." },
    { title: "Event / Webinar Invite", description: "AI identifies an upcoming event or webinar relevant to the prospect and frames the invite around their interests." },
    { title: "Personalised Recommendation", description: "AI makes a tailored suggestion based on the prospect's engagement history and firmographic data." },
    { title: "Soft Check-in", description: "A friendly follow-up with a low-commitment meeting option — framed as a quick sync, not a hard sell." },
  ],
  "event-outreach": [
    { title: "Pre-event Intro", description: "AI references the specific event and the prospect's likely attendance, opening with a shared-context hook." },
    { title: "Event-day Reminder", description: "A timely nudge on the day of the event with a CTA to visit your booth or attend your session." },
    { title: "Post-event Follow-up", description: "AI recaps key takeaways from the event and connects them to the prospect's priorities." },
    { title: "Resource Share", description: "AI shares a relevant resource — slides, recording, or whitepaper — and ties it to a meeting ask." },
    { title: "Final Nudge", description: "A closing message with social proof from others met at the event and a direct scheduling link." },
  ],
  "competitor-takeout": [
    { title: "Acknowledge + Differentiate", description: "AI acknowledges the prospect's current tool and opens with a specific differentiation point — not a generic pitch." },
    { title: "Limitation Hook", description: "AI highlights a specific limitation of the competitor product that the prospect is likely experiencing at their scale." },
    { title: "Migration Success Story", description: "AI shares a case study of a similar company that switched, with concrete before/after metrics." },
    { title: "Offer", description: "A direct offer — free audit, extended trial, or migration incentive — framed around reducing switching risk." },
    { title: "Final Direct Ask", description: "A concise closing message that summarises the key reasons to switch and asks for a decision-maker call." },
  ],
  "awareness": [
    { title: "Brand Intro", description: "AI introduces your brand with a unique angle tied to the prospect's industry — not a generic company pitch." },
    { title: "Problem-Solution Framing", description: "AI frames a common industry problem and positions your solution as the answer, using the prospect's context." },
    { title: "Customer Proof", description: "AI surfaces a relevant data point or customer story that builds credibility in the prospect's vertical." },
    { title: "Interactive CTA", description: "AI offers an engaging next step — a demo, ROI calculator, or interactive tool — tailored to the prospect's role." },
    { title: "Summary + Ask", description: "A final message that ties together the previous touchpoints and closes with a single clear ask." },
  ],
  "recruitment": [
    { title: "Role Intro + Why Them", description: "AI personalises the opening based on the candidate's background, highlighting why they're a fit for this specific role." },
    { title: "Culture & Team Story", description: "AI shares a compelling narrative about team culture, work environment, and what makes the role unique." },
    { title: "Compensation / Growth Angle", description: "AI highlights growth opportunities, compensation highlights, or unique benefits relevant to the candidate's seniority." },
    { title: "Direct Ask for a Call", description: "A friendly, low-pressure ask for an exploratory conversation — framed as mutual fit assessment." },
    { title: "Final Nudge", description: "A closing message with social proof from recent hires or team testimonials, keeping the door open." },
  ],
};

/* ─── Helper: build one-liner stage summary ─── */

function getStageSummary(themeId: string, stageCount: number): string {
  const stages = prebuiltStageDescriptions[themeId];
  if (!stages) return "";
  return stages
    .slice(0, stageCount)
    .map((s, i) => `Stage ${i + 1}: ${s.title}`)
    .join(" | ");
}

/* ─── Main Component ─── */

const CampaignSetup = ({ data, onUpdate }: CampaignSetupProps) => {
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({});
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(savedThemesStore);

  const buildMode = data.buildMode ?? null;
  const isPrebuiltSelected = prebuiltThemes.some((t) => t.id === data.theme);
  const isSavedThemeSelected = savedThemes.some((t) => t.id === data.theme);
  const selectedThemeId = data.theme;

  const handleBuildModeSelect = (mode: "saved_theme" | "custom") => {
    onUpdate({
      ...data,
      buildMode: mode,
      personalizationMode: "full_ai",
      theme: mode === "custom" ? "build-your-own" : data.theme,
      // Clear email content when switching modes
      emailBody: "",
      dynamicVariables: [],
    });
  };

  const handleThemeSelect = (themeId: string) => {
    onUpdate({ ...data, theme: themeId });
    setExpandedStages({});
  };

  // Get stage descriptions for the currently selected theme
  const getSelectedStageDescriptions = (): { title: string; description: string }[] | null => {
    if (isPrebuiltSelected) return prebuiltStageDescriptions[selectedThemeId] ?? null;
    const saved = savedThemes.find((t) => t.id === selectedThemeId);
    if (saved) return saved.stages;
    return null;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ─── Section 1: Campaign Basics ─── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Icon icon="solar:document-add-linear" className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Campaign Basics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-5">
          {/* Name + Contact List */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="campaign-name" className="text-sm font-medium">
                Campaign Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Q1 Product Launch"
                value={data.name}
                onChange={(e) => onUpdate({ ...data, name: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-list" className="text-sm font-medium">
                Select Contact List <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.contactList}
                onValueChange={(value) => onUpdate({ ...data, contactList: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Choose a contact list" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockContactLists.map((list) => (
                    <SelectItem key={list.id} value={list.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span>{list.name}</span>
                        <span className="text-xs text-muted-foreground ml-3">
                          ({list.count.toLocaleString()})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ─── Two-path selector ─── */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              How do you want to build this campaign? <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Card A: Saved Themes */}
              <button
                onClick={() => handleBuildModeSelect("saved_theme")}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all w-full",
                  buildMode === "saved_theme"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                )}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Icon icon="solar:widget-5-linear" className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-foreground leading-tight block">
                    Saved Themes
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-snug mt-0.5 block">
                    Start from a proven framework. AI generates personalized emails for each prospect based on the theme rules.
                  </span>
                </div>
                {buildMode === "saved_theme" && (
                  <div className="absolute top-2.5 right-2.5">
                    <Icon icon="solar:check-circle-bold" className="h-4.5 w-4.5 text-primary" />
                  </div>
                )}
              </button>

              {/* Card B: Build Your Own */}
              <button
                onClick={() => handleBuildModeSelect("custom")}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all w-full",
                  buildMode === "custom"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                )}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <Icon icon="solar:magic-stick-3-linear" className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-foreground leading-tight block">
                    Build Your Own
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-snug mt-0.5 block">
                    Write your own email structure. Use AI assistance, write manually, or mix both.
                  </span>
                </div>
                {buildMode === "custom" && (
                  <div className="absolute top-2.5 right-2.5">
                    <Icon icon="solar:check-circle-bold" className="h-4.5 w-4.5 text-primary" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Number of Stages */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Number of Stages <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdate({ ...data, stages: num })}
                  className={`w-10 h-9 rounded-md text-sm font-semibold transition-all ${
                    data.stages === num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Section 2: Saved Themes panel ─── */}
      {buildMode === "saved_theme" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:widget-5-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Choose a Theme</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Select a theme to use as your campaign framework. AI will generate personalized emails based on the theme's stage structure.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {/* Pristine Defaults */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon icon="solar:shield-check-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pristine Defaults</span>
              </div>
              <div className="space-y-1.5">
                {prebuiltThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  const summary = getStageSummary(theme.id, data.stages);
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-lg border-2 px-3.5 py-3 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30 hover:bg-accent/20"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon={theme.icon} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground block">{theme.title}</span>
                        {summary && (
                          <span className="text-[11px] text-muted-foreground leading-snug mt-0.5 block">{summary}</span>
                        )}
                      </div>
                      {isSelected && (
                        <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-primary shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Your Themes</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* User's saved themes */}
            {savedThemes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">No custom themes yet. Use "Build Your Own" to create and save one.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {savedThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  const summary = theme.stages
                    .slice(0, data.stages)
                    .map((s, i) => `Stage ${i + 1}: ${s.title}`)
                    .join(" | ");
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-lg border-2 px-3.5 py-3 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30 hover:bg-accent/20"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon="solar:document-text-linear" className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{theme.name}</span>
                          <span className="text-[10px] text-muted-foreground">{theme.createdAt}</span>
                        </div>
                        {summary && (
                          <span className="text-[11px] text-muted-foreground leading-snug mt-0.5 block">{summary}</span>
                        )}
                      </div>
                      {isSelected && (
                        <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-primary shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stage breakdown when a theme is selected */}
            {(isPrebuiltSelected || isSavedThemeSelected) && getSelectedStageDescriptions() && (
              <div className="space-y-2 animate-fade-in border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:layers-linear" className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Stage Breakdown</span>
                  {isPrebuiltSelected && (
                    <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                      <Icon icon="solar:lock-linear" className="h-2.5 w-2.5" />
                      Read-only
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {getSelectedStageDescriptions()!.slice(0, data.stages).map((stage, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/60 bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedStages((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Stage {idx + 1}</span>
                          <span className="text-xs text-muted-foreground/60">·</span>
                          <span className="text-xs font-medium text-foreground/70">{stage.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isPrebuiltSelected && (
                            <Icon icon="solar:lock-linear" className="h-3 w-3 text-muted-foreground/40" />
                          )}
                          <Icon
                            icon={expandedStages[idx] ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                            className="h-3.5 w-3.5 text-muted-foreground/50"
                          />
                        </div>
                      </button>
                      {expandedStages[idx] && (
                        <div className="px-3.5 pb-3 animate-in fade-in slide-in-from-top-1 duration-150">
                          <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Section 2: Build Your Own panel ─── */}
      {buildMode === "custom" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">
                What do you want this campaign to do?{" "}
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Describe your goals, audience, or tone. Leave blank to write emails manually in the next step.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Textarea
              placeholder="e.g., Target CTOs at fintech companies who use Salesforce, focus on pipeline efficiency..."
              value={data.instructions}
              onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
              className="min-h-24 resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignSetup;
