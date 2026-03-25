import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import SelectiveEmailEditor from "./SelectiveEmailEditor";

interface CampaignSetupProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  onNext: () => void;
}

/* ─── Campaign themes — each carries its own personalization mode ─── */

interface CampaignTheme {
  id: string;
  icon: string;
  title: string;
  mode: PersonalizationMode;
  info: string;
  stages?: string[];
  iconBg: string;   // tailwind bg class
  iconColor: string; // tailwind text class
}

const campaignThemes: CampaignTheme[] = [
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

const mockContactLists = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 },
];

const CampaignSetup = ({ data, onUpdate }: CampaignSetupProps) => {
  const selectedTheme = campaignThemes.find((t) => t.id === data.theme);
  const currentMode = selectedTheme?.mode ?? "full_ai";

  const handleThemeSelect = (themeId: string) => {
    const theme = campaignThemes.find((t) => t.id === themeId);
    const newMode = theme?.mode ?? "full_ai";
    const modeChanged = currentMode !== newMode;
    onUpdate({
      ...data,
      theme: themeId,
      personalizationMode: newMode,
      emailBody: modeChanged ? "" : data.emailBody,
      dynamicVariables: modeChanged ? [] : data.dynamicVariables,
    });
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

          {/* Campaign Theme */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Campaign Theme <span className="text-destructive">*</span>
            </Label>
            <TooltipProvider delayDuration={200}>
              <div className="grid grid-cols-3 gap-3">
                {campaignThemes.map((theme) => {
                  const isSelected = data.theme === theme.id;
                  const hasStages = theme.stages && theme.stages.length > 0;

                  const card = (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={cn(
                        "relative flex items-center gap-3.5 rounded-xl border-2 px-4 py-4 text-left transition-all w-full",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                          theme.iconBg, theme.iconColor
                        )}
                      >
                        <Icon icon={theme.icon} className="h-5 w-5" />
                      </div>
                      <span className="text-[13px] font-semibold text-foreground leading-tight">
                        {theme.title}
                      </span>
                      {hasStages && (
                        <Icon
                          icon="solar:info-circle-linear"
                          className="h-4 w-4 text-muted-foreground/40 shrink-0 ml-auto"
                        />
                      )}
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

                  if (!hasStages) return <div key={theme.id}>{card}</div>;

                  return (
                    <Tooltip key={theme.id}>
                      <TooltipTrigger asChild>{card}</TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs p-3">
                        <p className="text-xs font-semibold mb-1.5">
                          {theme.title} — Per-Stage Logic
                        </p>
                        <ul className="space-y-1">
                          {theme.stages!.slice(0, data.stages).map((s, i) => (
                            <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                              <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                              {s.replace(/^Stage \d+: /, "")}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
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

      {/* ─── Section 2: Mode-specific content (driven by theme) ─── */}

      {/* Full AI themes → Hint / Instructions */}
      {currentMode === "full_ai" && data.theme && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Hint</CardTitle>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI will generate the full email for each stage. Add any specific requirements or tone preferences below.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Textarea
              placeholder="Add any specific requirements, tone preferences, or audience details..."
              value={data.instructions}
              onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
              className="min-h-24 resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Selective theme (Custom Sales) → Email Editor with AI/conditional blocks */}
      {currentMode === "selective" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:pen-new-round-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Email Editor</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Write your email and insert dynamic variables where you want AI-generated or conditional content.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <SelectiveEmailEditor
              emailBody={data.emailBody}
              dynamicVariables={data.dynamicVariables}
              onEmailBodyChange={(emailBody) => onUpdate({ ...data, emailBody })}
              onVariablesChange={(dynamicVariables) => onUpdate({ ...data, dynamicVariables })}
            />
          </CardContent>
        </Card>
      )}

      {/* Static theme → Editor with merge tokens only */}
      {currentMode === "static" && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:document-text-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Static Email</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Write your email manually. Type{" "}
              <kbd className="px-1 py-0.5 rounded-md bg-muted border border-border text-[10px] font-mono font-semibold">
                /
              </kbd>{" "}
              to insert merge tokens like first name or company.
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <SelectiveEmailEditor
              emailBody={data.emailBody}
              dynamicVariables={data.dynamicVariables}
              onEmailBodyChange={(emailBody) => onUpdate({ ...data, emailBody })}
              onVariablesChange={(dynamicVariables) => onUpdate({ ...data, dynamicVariables })}
              mergeOnly
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignSetup;
