import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import type { PersonalizationMode, CampaignData } from "@/pages/CreateCampaign";

interface CampaignSetupProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  onNext: () => void;
}

/* ─── 3 high-level category cards ─── */

type CategoryId = "build-with-ai" | "selective-ai" | "custom-theme" | "prebuilt";

interface CategoryCard {
  id: CategoryId;
  icon: string;
  title: string;
  description: string;
  mode: PersonalizationMode;
  iconBg: string;
  iconColor: string;
}

const categories: CategoryCard[] = [
  {
    id: "build-with-ai",
    icon: "solar:magic-stick-3-linear",
    title: "Build with AI",
    description: "Tell AI what you want. It generates the full email for each stage.",
    mode: "full_ai",
    iconBg: "bg-violet-100 dark:bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "selective-ai",
    icon: "solar:tuning-2-linear",
    title: "Selective AI",
    description: "Write your email with AI tools — slash commands, AI paragraphs, and conditional blocks.",
    mode: "selective",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "custom-theme",
    icon: "solar:document-text-linear",
    title: "Custom Theme",
    description: "Use a theme you've already built and saved. Fully editable per stage.",
    mode: "static",
    iconBg: "bg-slate-100 dark:bg-slate-500/15",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
  {
    id: "prebuilt",
    icon: "solar:widget-5-linear",
    title: "Prebuilt Theme",
    description: "Choose a proven template. AI generates the full email for each stage.",
    mode: "full_ai",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

/* ─── Prebuilt themes (shown in dropdown when "Prebuilt Theme" is selected) ─── */

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
const savedThemesStore: SavedTheme[] = [
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
];

/* ─── Per-stage descriptions for prebuilt themes ─── */

const prebuiltStageDescriptions: Record<string, { title: string; description: string }[]> = {
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

const CampaignSetup = ({ data, onUpdate }: CampaignSetupProps) => {
  const { toast } = useToast();
  const [saveThemeOpen, setSaveThemeOpen] = useState(false);
  const [saveThemeName, setSaveThemeName] = useState("");
  const [savingTheme, setSavingTheme] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({});
  const [customThemeEdits, setCustomThemeEdits] = useState<Record<string, Record<number, string>>>({});
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(savedThemesStore);
  // Derive the selected category from mode + theme
  const isPrebuiltTheme = data.theme === "prebuilt" || prebuiltThemes.some((t) => t.id === data.theme);
  const selectedCategory: CategoryId | null =
    data.personalizationMode === "selective"
      ? "selective-ai"
      : data.personalizationMode === "static"
      ? "custom-theme"
      : data.personalizationMode === "full_ai" && isPrebuiltTheme
      ? "prebuilt"
      : data.personalizationMode === "full_ai" && data.theme === "build-with-ai"
      ? "build-with-ai"
      : null;

  const handleCategorySelect = (categoryId: CategoryId) => {
    const category = categories.find((c) => c.id === categoryId)!;
    const modeChanged = data.personalizationMode !== category.mode;
    onUpdate({
      ...data,
      theme: categoryId === "prebuilt" ? (prebuiltThemes.some((t) => t.id === data.theme) ? data.theme : "prebuilt") : categoryId,
      personalizationMode: category.mode,
      emailBody: modeChanged ? "" : data.emailBody,
      dynamicVariables: modeChanged ? [] : data.dynamicVariables,
    });
  };

  const handlePrebuiltSelect = (themeId: string) => {
    onUpdate({ ...data, theme: themeId });
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

          {/* Campaign Theme — 3 categories */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Campaign Theme <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all w-full",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                    )}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                        cat.iconBg, cat.iconColor
                      )}
                    >
                      <Icon icon={cat.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-foreground leading-tight block">
                        {cat.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground leading-snug mt-0.5 block">
                        {cat.description}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5">
                        <Icon
                          icon="solar:check-circle-bold"
                          className="h-4.5 w-4.5 text-primary"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
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

      {/* ─── Section 2: Mode-specific inline content ─── */}

      {/* Build with AI (full_ai) → Prompt box */}
      {selectedCategory === "build-with-ai" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">What should this campaign do?</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI will generate the full email for each stage. Describe your goals, audience, or tone below.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Textarea
              placeholder="e.g., Reach out to VP-level prospects in fintech who recently raised Series B. Tone should be direct but not pushy..."
              value={data.instructions}
              onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
              className="min-h-24 resize-none"
            />

            {/* Save as Theme inline modal */}
            {saveThemeOpen && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:bookmark-linear" className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Save as Theme</span>
                </div>
                <Input
                  placeholder="Theme name, e.g. 'Series B Fintech Outreach'"
                  value={saveThemeName}
                  onChange={(e) => setSaveThemeName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && saveThemeName.trim()) {
                      setSavingTheme(true);
                      setTimeout(() => {
                        const newTheme: SavedTheme = {
                          id: `theme-${Date.now()}`,
                          name: saveThemeName.trim(),
                          createdAt: new Date().toISOString().split("T")[0],
                          stages: Array.from({ length: data.stages }, (_, i) => ({
                            title: `Stage ${i + 1}`,
                            description: data.instructions || "Custom stage — edit after saving.",
                          })),
                        };
                        savedThemesStore.push(newTheme);
                        setSavedThemes([...savedThemesStore]);
                        setSavingTheme(false);
                        setSaveThemeOpen(false);
                        setSaveThemeName("");
                        toast({ title: "Theme saved", description: "You can reuse it from Custom Theme next time." });
                      }, 600);
                    }
                  }}
                  disabled={savingTheme}
                  autoFocus
                  className="h-8 text-sm"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setSaveThemeOpen(false); setSaveThemeName(""); }}
                    disabled={savingTheme}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!saveThemeName.trim()) return;
                      setSavingTheme(true);
                      setTimeout(() => {
                        const newTheme: SavedTheme = {
                          id: `theme-${Date.now()}`,
                          name: saveThemeName.trim(),
                          createdAt: new Date().toISOString().split("T")[0],
                          stages: Array.from({ length: data.stages }, (_, i) => ({
                            title: `Stage ${i + 1}`,
                            description: data.instructions || "Custom stage — edit after saving.",
                          })),
                        };
                        savedThemesStore.push(newTheme);
                        setSavedThemes([...savedThemesStore]);
                        setSavingTheme(false);
                        setSaveThemeOpen(false);
                        setSaveThemeName("");
                        toast({ title: "Theme saved", description: "You can reuse it from Custom Theme next time." });
                      }, 600);
                    }}
                    disabled={!saveThemeName.trim() || savingTheme}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                      "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {savingTheme ? (
                      <><Icon icon="solar:refresh-linear" className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                    ) : (
                      <><Icon icon="solar:bookmark-linear" className="h-3.5 w-3.5" /> Save Theme</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!saveThemeOpen && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSaveThemeOpen(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                    "border border-border text-muted-foreground",
                    "hover:bg-accent hover:text-foreground transition-colors"
                  )}
                >
                  <Icon icon="solar:bookmark-linear" className="h-3.5 w-3.5" />
                  Save as Theme
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prebuilt Theme (full_ai) → Theme dropdown + Stage breakdown + Hint textarea */}
      {selectedCategory === "prebuilt" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:widget-5-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Prebuilt Theme</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pick a template and optionally add instructions for AI to follow.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Template <span className="text-destructive">*</span>
              </Label>
              <Select
                value={prebuiltThemes.some((t) => t.id === data.theme) ? data.theme : ""}
                onValueChange={(v) => { handlePrebuiltSelect(v); setExpandedStages({}); }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Choose a prebuilt template" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {prebuiltThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon icon={theme.icon} className="h-4 w-4 text-muted-foreground" />
                        <span>{theme.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Per-stage breakdown (F1.1) */}
            {prebuiltThemes.some((t) => t.id === data.theme) && prebuiltStageDescriptions[data.theme] && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-xs text-muted-foreground">
                  This is what Pristine sends at each stage. To customise the sequence,{" "}
                  <button
                    type="button"
                    onClick={() => handleCategorySelect("custom-theme")}
                    className="text-primary hover:underline font-medium"
                  >
                    use Custom Theme
                  </button>.
                </p>
                <div className="space-y-2">
                  {prebuiltStageDescriptions[data.theme].slice(0, data.stages).map((stage, idx) => (
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
                          <Icon icon="solar:lock-linear" className="h-3 w-3 text-muted-foreground/40" />
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

            {prebuiltThemes.some((t) => t.id === data.theme) && (
              <div className="space-y-1.5 animate-fade-in">
                <Label className="text-sm font-medium">
                  Hint <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  placeholder="Add any specific requirements, tone preferences, or audience details..."
                  value={data.instructions}
                  onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
                  className="min-h-24 resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Theme → Saved theme picker with editable stages (F1.2) */}
      {selectedCategory === "custom-theme" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:document-text-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Your Saved Themes</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Select a theme you've previously saved, or switch to Build with AI to create one.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {savedThemes.length === 0 ? (
              /* Empty state */
              <div className="rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-6 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon icon="solar:document-text-linear" className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">You haven't created any custom themes yet.</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Build with AI to create and save your first one.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCategorySelect("build-with-ai")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                    "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  )}
                >
                  <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5" />
                  Switch to Build with AI
                </button>
              </div>
            ) : (
              /* Saved themes list */
              <div className="space-y-3">
                {savedThemes.map((theme) => {
                  const isSelectedTheme = data.theme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={cn(
                        "rounded-lg border-2 transition-all",
                        isSelectedTheme ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30"
                      )}
                    >
                      {/* Theme header */}
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...data, theme: theme.id })}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isSelectedTheme ? "bg-primary/15" : "bg-muted"
                          )}>
                            <Icon icon="solar:document-text-linear" className={cn("h-4 w-4", isSelectedTheme ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{theme.name}</p>
                            <p className="text-[11px] text-muted-foreground">Created {theme.createdAt} · {theme.stages.length} stages</p>
                          </div>
                        </div>
                        {isSelectedTheme && (
                          <Icon icon="solar:check-circle-bold" className="h-4.5 w-4.5 text-primary" />
                        )}
                      </button>

                      {/* Editable stage breakdown when selected */}
                      {isSelectedTheme && (
                        <div className="px-4 pb-3 space-y-2 border-t border-border/40 pt-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Stage Breakdown</span>
                            <span className="text-[10px] text-muted-foreground/50">Click to edit</span>
                          </div>
                          {theme.stages.slice(0, data.stages).map((stage, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border/60 bg-background"
                            >
                              <button
                                type="button"
                                onClick={() => setExpandedStages((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                                className="w-full flex items-center justify-between px-3 py-2 text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-muted-foreground">Stage {idx + 1}</span>
                                  <span className="text-xs text-muted-foreground/60">·</span>
                                  <span className="text-xs font-medium text-foreground/70">{stage.title}</span>
                                </div>
                                <Icon
                                  icon={expandedStages[idx] ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                                  className="h-3.5 w-3.5 text-muted-foreground/50"
                                />
                              </button>
                              {expandedStages[idx] && (
                                <div className="px-3 pb-2.5 animate-in fade-in duration-150">
                                  <Textarea
                                    value={customThemeEdits[theme.id]?.[idx] ?? stage.description}
                                    onChange={(e) => {
                                      setCustomThemeEdits((prev) => ({
                                        ...prev,
                                        [theme.id]: { ...prev[theme.id], [idx]: e.target.value },
                                      }));
                                    }}
                                    className="min-h-16 resize-none text-xs"
                                    placeholder="Describe what AI should do at this stage..."
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignSetup;
