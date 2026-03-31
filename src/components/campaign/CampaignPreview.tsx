import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { CampaignData, DynamicVariable } from "@/pages/CreateCampaign";
import SelectiveEmailEditor from "./SelectiveEmailEditor";
import { prebuiltStageDescriptions, savedThemesStore } from "./CampaignSetup";
import type { SavedTheme } from "./CampaignSetup";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignPreviewProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  onNext: () => void;
  onBack: () => void;
}

/* ─── Stage data types ─── */

interface StageData {
  subject: string;
  subjectVariables: DynamicVariable[];
  body: string;
  bodyVariables: DynamicVariable[];
  type: "New thread" | "Reply";
}

/* ─── Mock contacts for preview ─── */

const previewContacts = [
  { name: "Ramzan R", email: "ramzan@castlerockin.com", company: "Crack The Campus" },
  { name: "Sarah J", email: "sarah@acmecorp.com", company: "Acme Corp" },
  { name: "Michael C", email: "michael@betasys.com", company: "Beta Systems" },
];

/* ─── Resolve variables to plain text for preview ─── */

function resolvePreviewText(text: string, contact: typeof previewContacts[0], stageIdx: number): string {
  const aiSnippets = [
    `I noticed ${contact.company} recently closed a new funding round — congrats! With growth comes the challenge of scaling outreach without sacrificing quality.`,
    `Came across ${contact.company}'s latest product launch and was impressed by the direction you're heading. Many teams at this stage start looking for smarter ways to reach their ICP.`,
    `With ${contact.company} expanding into new markets, I imagine keeping your pipeline sharp across regions is top of mind. That's exactly where we help.`,
    `Saw that ${contact.company} has been on a hiring spree lately — exciting times! Fast-growing teams often need better data to fuel their outreach engine.`,
    `I read about the recent leadership changes at ${contact.company}. New direction often means fresh priorities — happy to share how we help teams like yours move fast.`,
  ];

  return text
    .replace(/\{\{firstName\}\}/g, contact.name.split(" ")[0])
    .replace(/\{\{lastName\}\}/g, contact.name.split(" ").slice(1).join(" ") || "R")
    .replace(/\{\{companyName\}\}/g, contact.company)
    .replace(/\{\{jobTitle\}\}/g, "CMO")
    .replace(/\{\{industry\}\}/g, "Technology")
    .replace(/\{\{ai:[^}]*\}\}/g, aiSnippets[stageIdx % aiSnippets.length]);
}

function getDefaultBody(stageIdx: number): string {
  const bodies = [
    "Hey {{firstName}},\n\n{{ai:snippet}}\n\nPristine Data AI helps you tackle complex data and manual processes. Speed up your outreach with real-time insights and 90% data accuracy, all while lowering costs.\n\nTake a Tour to see how it works!\n\nBest,\nRaghavendra",
    "Noticed previous emails went unanswered. Pristine Data AI can transform your data challenges into real-time insights and personalized outreach, accelerating your processes significantly.\n\nCurious to see how it works? Let's schedule a quick tour to explore the possibilities!",
    "Pristine Data AI can transform your outreach with real-time insights and 90% accurate data enrichment. Say goodbye to lengthy manual processes and costly contacts.\n\nThis is the last attempt to connect, but a quick tour could reveal how to simplify and scale your strategies effortlessly. Let me know if you're interested!",
    "Hi {{firstName}},\n\nI came across some recent news about {{companyName}} and thought our platform could be particularly relevant.\n\nIf you're open to a quick 10-minute call, I'd love to share how we've helped similar companies.\n\nNo pressure at all.\n\nBest,\nRaghavendra",
    "Hi {{firstName}},\n\nThis will be my last email on this topic. I genuinely believe our platform could help {{companyName}} streamline operations.\n\nFeel free to reach out whenever you're ready.\n\nWarm regards,\nRaghavendra",
  ];
  return bodies[stageIdx % bodies.length];
}

/* ─── Extract DynamicVariable[] from token strings in body text ─── */

const KNOWN_TOKENS: Record<string, { type: DynamicVariable["type"]; label: string }> = {
  "{{firstName}}": { type: "merge", label: "First Name" },
  "{{lastName}}": { type: "merge", label: "Last Name" },
  "{{companyName}}": { type: "merge", label: "Company Name" },
  "{{jobTitle}}": { type: "merge", label: "Job Title" },
  "{{industry}}": { type: "merge", label: "Industry" },
};

function extractVariablesFromBody(body: string): DynamicVariable[] {
  const vars: DynamicVariable[] = [];
  const seen = new Set<string>();

  // Merge tokens
  for (const [token, meta] of Object.entries(KNOWN_TOKENS)) {
    if (body.includes(token) && !seen.has(token)) {
      seen.add(token);
      vars.push({
        id: `default-${meta.label.toLowerCase().replace(/\s/g, "-")}`,
        type: meta.type,
        token,
        label: meta.label,
      });
    }
  }

  // AI tokens like {{ai:snippet}}
  const aiMatches = body.match(/\{\{ai:[^}]*\}\}/g);
  if (aiMatches) {
    for (const token of aiMatches) {
      if (!seen.has(token)) {
        seen.add(token);
        const instruction = token.replace(/^\{\{ai:/, "").replace(/\}\}$/, "");
        vars.push({
          id: `default-ai-${instruction}`,
          type: "ai_paragraph",
          token,
          label: "AI Paragraph",
          aiInstruction: instruction,
        });
      }
    }
  }

  return vars;
}

/* ─── Interval selector ─── */

function IntervalDivider({ delay, onChange }: { delay: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex-1 border-t border-dashed border-border" />
      <div className="mx-3 flex items-center gap-2">
        <Icon icon="solar:clock-circle-linear" className="h-3.5 w-3.5 text-muted-foreground" />
        <Select value={delay} onValueChange={onChange}>
          <SelectTrigger className="h-7 w-auto min-w-[160px] text-xs border-dashed bg-muted/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="immediately">Send immediately</SelectItem>
            <SelectItem value="1d">Send email in 1 day</SelectItem>
            <SelectItem value="2d">Send email in 2 days</SelectItem>
            <SelectItem value="3d">Send email in 3 days</SelectItem>
            <SelectItem value="5d">Send email in 5 days</SelectItem>
            <SelectItem value="7d">Send email in 7 days</SelectItem>
          </SelectContent>
        </Select>
        <button className="p-1 rounded hover:bg-muted transition-colors">
          <Icon icon="solar:pen-linear" className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 border-t border-dashed border-border" />
    </div>
  );
}

/* ─── Single Stage Editor ─── */

function StageEditor({
  stageIdx,
  stageData,
  onStageUpdate,
  isActive,
  onFocus,
  isSelective,
  totalStages,
}: {
  stageIdx: number;
  stageData: StageData;
  onStageUpdate: (data: Partial<StageData>) => void;
  isActive: boolean;
  onFocus: () => void;
  isSelective: boolean;
  totalStages: number;
}) {
  return (
    <div
      onClick={onFocus}
      className={cn(
        "rounded-xl border-2 transition-all cursor-pointer",
        isActive
          ? "border-primary/40 shadow-sm"
          : "border-border/60 hover:border-primary/20"
      )}
    >
      {/* Stage header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 rounded-t-xl border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:letter-linear" className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Step {stageIdx + 1}: Automatic email</span>
          </div>
          <span className="text-xs text-muted-foreground/60">/</span>
          <span className="text-xs text-muted-foreground">Test A</span>
          <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Active
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          {isSelective && (
            <>
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1">
                <Icon icon="solar:pen-linear" className="h-3 w-3" />
                Standard
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1">
                <Icon icon="solar:magic-stick-3-linear" className="h-3 w-3" />
                Prompt
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Icon icon="solar:settings-linear" className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Subject + Type row */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-border/30">
        <div className="flex-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Subject</Label>
          <Input
            value={stageData.subject}
            onChange={(e) => onStageUpdate({ subject: e.target.value })}
            placeholder={`e.g., Unlock Insights at {{companyName}}`}
            className="h-7 text-xs border-0 px-0 shadow-none focus-visible:ring-0 bg-transparent"
          />
        </div>
        <div className="w-28">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</Label>
          <Select
            value={stageData.type}
            onValueChange={(v) => onStageUpdate({ type: v as StageData["type"] })}
          >
            <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="New thread">New thread</SelectItem>
              <SelectItem value="Reply">Reply</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email body */}
      <div className="px-4 py-3">
        <SelectiveEmailEditor
          emailBody={stageData.body}
          dynamicVariables={stageData.bodyVariables}
          onEmailBodyChange={(body) => onStageUpdate({ body })}
          onVariablesChange={(bodyVariables) => onStageUpdate({ bodyVariables })}
          mergeOnly={!isSelective}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:bg-muted transition-colors">
            <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5" />
            Write with AI
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Scheduled</span>
          <span>·</span>
          <span>Delivered</span>
          <span>·</span>
          <span>Bounce</span>
          <span>·</span>
          <span>Reply</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Panel ─── */

function PreviewPanel({
  stageIdx,
  stageData,
  previewContact,
  onPreviewContactChange,
}: {
  stageIdx: number;
  stageData: StageData;
  previewContact: typeof previewContacts[0];
  onPreviewContactChange: (c: typeof previewContacts[0]) => void;
}) {
  const subjectText = stageData.subject || `Unlock Insights at {{companyName}}`;
  const bodyText = stageData.body || getDefaultBody(stageIdx);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">Generate preview for contact</span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-[10px] text-muted-foreground shrink-0">Select contact</Label>
          <Select
            value={previewContact.email}
            onValueChange={(email) => {
              const c = previewContacts.find((c) => c.email === email);
              if (c) onPreviewContactChange(c);
            }}
          >
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {previewContacts.map((c) => (
                <SelectItem key={c.email} value={c.email}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <Icon icon="solar:monitor-linear" className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <Icon icon="solar:copy-linear" className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview email — plain resolved text */}
      <div className="p-4 space-y-2">
        <div className="space-y-1 text-xs">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">To:</span> {previewContact.name} &lt;{previewContact.email}&gt;
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Subject:</span>{" "}
            {stageIdx > 0 ? "Re: " : ""}{resolvePreviewText(subjectText, previewContact, stageIdx)}
          </p>
        </div>
        <div className="border-t border-border pt-3">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
            {resolvePreviewText(bodyText, previewContact, stageIdx)}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ─── Read-only stage structure card (for prebuilt themes) ─── */

const mockAiEmails: Record<string, { subject: string; body: string }[]> = {
  "sales-outreach": [
    { subject: "Quick thought on {{companyName}}'s growth strategy", body: "Hey {{firstName}},\n\nI noticed {{companyName}} has been scaling aggressively this quarter — congrats on the momentum. At this stage, most teams in your space start hitting a wall with outbound: too many tools, inconsistent data, and reps spending 40% of their time on manual research.\n\nWe built Pristine specifically for this inflection point. Happy to share how similar companies cut prospecting time by 60%.\n\nWorth a 15-min chat?" },
    { subject: "Re: Quick thought on {{companyName}}'s growth strategy", body: "Hi {{firstName}},\n\nA quick follow-up — we recently helped a Series B fintech team reduce their cost-per-lead by 45% while doubling reply rates. Their Head of Sales called it \"the single biggest unlock for our outbound motion.\"\n\nI think the parallels to {{companyName}} are striking. Would love to walk through the case study with you." },
    { subject: "Re: Quick thought on {{companyName}}'s growth strategy", body: "{{firstName}},\n\nOne data point that might resonate: companies using AI-enriched prospecting data see 3.2x higher connection rates vs. traditional databases.\n\nGiven {{companyName}}'s current growth trajectory, this could meaningfully accelerate your pipeline this quarter.\n\nShall I send over a quick analysis?" },
    { subject: "Re: Quick thought on {{companyName}}'s growth strategy", body: "Hi {{firstName}},\n\nI know things move fast — just wanted to circle back one more time. I genuinely think 15 minutes could surface some quick wins for {{companyName}}'s outbound strategy.\n\nHere's my calendar link if easier: [link]\n\nEither way, no pressure at all." },
    { subject: "Re: Quick thought on {{companyName}}'s growth strategy", body: "{{firstName}},\n\nThis will be my last note on this — I don't want to be that person. But if better prospecting data, automated enrichment, and AI-powered personalization are ever on your radar, we'd love to help.\n\nWishing {{companyName}} continued success. The door's always open.\n\nBest,\nRaghavendra" },
  ],
  "lead-nurture": [
    { subject: "This report on {{industry}} trends might interest you", body: "Hey {{firstName}},\n\nI came across a recent analysis on how top-performing {{industry}} teams are rethinking their go-to-market motion in 2026. Given your role at {{companyName}}, thought this might be relevant.\n\n[Link to report]\n\nNo agenda here — just sharing something that might be useful." },
    { subject: "Re: This report on {{industry}} trends might interest you", body: "Hi {{firstName}},\n\nFollowing up on that report — one trend that really stood out: companies investing in AI-powered personalization are seeing 2.8x higher engagement rates across their outbound channels.\n\nCurious if this aligns with what you're seeing at {{companyName}}?" },
    { subject: "Re: This report on {{industry}} trends might interest you", body: "{{firstName}},\n\nWe're hosting a small virtual roundtable next Thursday with GTM leaders from companies like yours — focused on how AI is reshaping prospecting.\n\nIt's casual, 30 minutes, and you'd be in great company. Interested?" },
    { subject: "Re: This report on {{industry}} trends might interest you", body: "Hi {{firstName}},\n\nBased on what I've seen from teams in {{industry}}, I think {{companyName}} could benefit from our enrichment-first approach to outbound. Specifically, our ability to surface buying signals before they hit your CRM.\n\nHappy to share a quick walkthrough tailored to your setup." },
    { subject: "Re: This report on {{industry}} trends might interest you", body: "{{firstName}},\n\nJust a friendly check-in. If the timing isn't right, totally understand — but if you ever want to explore how Pristine could fit into {{companyName}}'s stack, I'm a quick Slack or email away.\n\nHope you're having a great week!" },
  ],
};

function getThemeMockEmail(themeId: string, stageIdx: number, contact: typeof previewContacts[0]): { subject: string; body: string } {
  const emails = mockAiEmails[themeId];
  if (emails && emails[stageIdx]) {
    const email = emails[stageIdx];
    return {
      subject: email.subject
        .replace(/\{\{companyName\}\}/g, contact.company)
        .replace(/\{\{firstName\}\}/g, contact.name.split(" ")[0])
        .replace(/\{\{industry\}\}/g, "Technology"),
      body: email.body
        .replace(/\{\{companyName\}\}/g, contact.company)
        .replace(/\{\{firstName\}\}/g, contact.name.split(" ")[0])
        .replace(/\{\{industry\}\}/g, "Technology"),
    };
  }
  // Fallback for themes without mock emails
  return {
    subject: `${stageIdx > 0 ? "Re: " : ""}Unlock Insights at ${contact.company}`,
    body: `Hi ${contact.name.split(" ")[0]},\n\n[AI will generate a personalized email for this stage based on the theme structure and ${contact.company}'s profile.]\n\nBest,\nRaghavendra`,
  };
}

function ThemeStageCard({
  stageIdx,
  stageTitle,
  stageDescription,
  themeId,
  contact,
  totalStages,
  isActive,
  onActivate,
}: {
  stageIdx: number;
  stageTitle: string;
  stageDescription: string;
  themeId: string;
  contact: typeof previewContacts[0];
  totalStages: number;
  isActive?: boolean;
  onActivate?: () => void;
}) {
  const mockEmail = getThemeMockEmail(themeId, stageIdx, contact);

  return (
    <div
      onClick={onActivate}
      className={cn(
        "rounded-xl border-2 cursor-pointer transition-all",
        isActive ? "border-primary/40 shadow-sm" : "border-border/60 hover:border-primary/20"
      )}
    >
      {/* Stage header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 rounded-t-xl border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon icon="solar:letter-linear" className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Step {stageIdx + 1}: {stageTitle}</span>
          <Badge variant="secondary" className="text-[9px] bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400">
            AI Generated
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:lock-linear" className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      </div>

      {/* AI strategy description */}
      <div className="px-4 py-3 border-b border-border/30 bg-primary/[0.02]">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon icon="solar:magic-stick-3-linear" className="h-3 w-3 text-primary" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-primary">AI Strategy</span>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{stageDescription}</p>
          </div>
        </div>
      </div>

      {/* Mock email preview */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="solar:eye-linear" className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Preview</span>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3 space-y-2">
          <div className="space-y-1 text-xs">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">To:</span> {contact.name} &lt;{contact.email}&gt;
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Subject:</span> {mockEmail.subject}
            </p>
          </div>
          <div className="border-t border-border/50 pt-2">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/80">
              {mockEmail.body}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component: Apollo-style all-stages-on-one-screen ─── */

const CampaignPreview = ({ data, onUpdate }: CampaignPreviewProps) => {
  const { toast } = useToast();
  const isSelective = data.personalizationMode === "selective";
  const isPrebuiltTheme = data.buildMode === "saved_theme" && !!prebuiltStageDescriptions[data.theme];
  const themeStages = isPrebuiltTheme ? prebuiltStageDescriptions[data.theme] : null;
  const [activeStage, setActiveStage] = useState(0);
  const [previewContact, setPreviewContact] = useState(previewContacts[0]);
  const [saveThemeOpen, setSaveThemeOpen] = useState(false);
  const [saveThemeName, setSaveThemeName] = useState("");
  const [savingTheme, setSavingTheme] = useState(false);

  const handleSaveTheme = (themeName: string) => {
    setSavingTheme(true);
    setTimeout(() => {
      const newTheme: SavedTheme = {
        id: `theme-${Date.now()}`,
        name: themeName.trim(),
        createdAt: new Date().toISOString().split("T")[0],
        stages: Array.from({ length: data.stages }, (_, i) => ({
          title: `Stage ${i + 1}`,
          description: data.instructions || "Custom stage — edit after saving.",
        })),
      };
      savedThemesStore.push(newTheme);
      setSavingTheme(false);
      setSaveThemeOpen(false);
      setSaveThemeName("");
      toast({ title: "Theme saved", description: "You can reuse it from Saved Themes next time." });
    }, 600);
  };

  // Per-stage data (only used for custom/editor mode)
  const [stages, setStages] = useState<StageData[]>(() =>
    Array.from({ length: data.stages }, (_, i) => {
      const subject = i === 0 ? (data.subjectLine || "") : `Re: ${data.subjectLine || "Unlock Insights at {{companyName}}"}`;
      const body = i === 0 ? (data.emailBody || getDefaultBody(0)) : getDefaultBody(i);
      return {
        subject,
        subjectVariables: i === 0 ? (data.subjectVariables ?? []) : extractVariablesFromBody(subject),
        body,
        bodyVariables: i === 0 ? (data.dynamicVariables?.length ? data.dynamicVariables : extractVariablesFromBody(body)) : extractVariablesFromBody(body),
        type: (i === 0 ? "New thread" : "Reply") as StageData["type"],
      };
    })
  );

  // Interval delays between stages
  const [intervals, setIntervals] = useState<string[]>(() =>
    Array.from({ length: Math.max(0, data.stages - 1) }, () => "3d")
  );

  const updateStage = useCallback((stageIdx: number, partial: Partial<StageData>) => {
    setStages((prev) => {
      const next = [...prev];
      next[stageIdx] = { ...next[stageIdx], ...partial };
      if (stageIdx === 0) {
        const s = next[0];
        onUpdate({
          ...data,
          subjectLine: s.subject,
          subjectVariables: s.subjectVariables,
          emailBody: s.body,
          dynamicVariables: s.bodyVariables,
        });
      }
      return next;
    });
  }, [data, onUpdate]);

  const updateInterval = useCallback((idx: number, val: string) => {
    setIntervals((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  /* ─── Prebuilt theme: read-only structured preview ─── */
  if (isPrebuiltTheme && themeStages) {
    const visibleStages = themeStages.slice(0, data.stages);
    return (
      <div className="animate-fade-in">
        {/* email preview content */}
        <div className="min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon icon="solar:layers-linear" className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{data.stages} steps</span>
            <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400">
              AI-Powered Theme
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-[10px] text-muted-foreground shrink-0">Preview as</Label>
            <Select
              value={previewContact.email}
              onValueChange={(email) => {
                const c = previewContacts.find((c) => c.email === email);
                if (c) setPreviewContact(c);
              }}
            >
              <SelectTrigger className="h-7 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {previewContacts.map((c) => (
                  <SelectItem key={c.email} value={c.email}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stages stacked vertically */}
        <div className="space-y-0">
          {visibleStages.map((stage, idx) => (
            <div key={idx}>
              <ThemeStageCard
                stageIdx={idx}
                stageTitle={stage.title}
                stageDescription={stage.description}
                themeId={data.theme}
                contact={previewContact}
                totalStages={data.stages}
                isActive={activeStage === idx}
                onActivate={() => setActiveStage(idx)}
              />

              {idx < visibleStages.length - 1 && (
                <div className="py-2">
                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <IntervalDivider
                    delay={intervals[idx] || "3d"}
                    onChange={(v) => updateInterval(idx, v)}
                  />
                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-border" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </div> {/* /right column */}
      </div>
    );
  }

  /* ─── Custom / Build Your Own: editable editor ─── */
  return (
    <div className="animate-fade-in">
      {/* email preview content */}
      <div className="min-w-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:layers-linear" className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{data.stages} steps</span>
          <span className="text-xs text-muted-foreground">&raquo;</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Icon icon="solar:minimize-square-linear" className="h-3.5 w-3.5" />
            Collapse steps
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            Save changes
          </Button>
          {!saveThemeOpen && (
            <button
              type="button"
              onClick={() => setSaveThemeOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium h-7",
                "border border-border text-muted-foreground",
                "hover:bg-accent hover:text-foreground transition-colors"
              )}
            >
              <Icon icon="solar:bookmark-linear" className="h-3.5 w-3.5" />
              Save as Theme
            </button>
          )}
          {saveThemeOpen && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Input
                placeholder="Theme name…"
                value={saveThemeName}
                onChange={(e) => setSaveThemeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && saveThemeName.trim()) handleSaveTheme(saveThemeName);
                  if (e.key === "Escape") { setSaveThemeOpen(false); setSaveThemeName(""); }
                }}
                disabled={savingTheme}
                autoFocus
                className="h-7 text-xs w-48"
              />
              <button
                type="button"
                onClick={() => { if (saveThemeName.trim()) handleSaveTheme(saveThemeName); }}
                disabled={!saveThemeName.trim() || savingTheme}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium h-7",
                  "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {savingTheme ? (
                  <><Icon icon="solar:refresh-linear" className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                ) : (
                  <><Icon icon="solar:bookmark-linear" className="h-3.5 w-3.5" /> Save</>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setSaveThemeOpen(false); setSaveThemeName(""); }}
                disabled={savingTheme}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All stages stacked, each with its own inline preview */}
      <div className="space-y-0">
        {stages.map((stage, idx) => (
          <div key={idx}>
            <div className="grid grid-cols-[1fr_380px] gap-4">
              <StageEditor
                stageIdx={idx}
                stageData={stage}
                onStageUpdate={(partial) => updateStage(idx, partial)}
                isActive={activeStage === idx}
                onFocus={() => setActiveStage(idx)}
                isSelective={isSelective}
                totalStages={data.stages}
              />
              <PreviewPanel
                stageIdx={idx}
                stageData={stage}
                previewContact={previewContact}
                onPreviewContactChange={setPreviewContact}
              />
            </div>

            {idx < stages.length - 1 && (
              <div className="py-2">
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-border" />
                </div>
                <IntervalDivider
                  delay={intervals[idx] || "3d"}
                  onChange={(v) => updateInterval(idx, v)}
                />
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-border" />
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary border border-dashed border-border rounded-lg hover:border-primary/40 transition-colors">
            <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
            Add a step
          </button>
        </div>
      </div>
      </div> {/* /right column */}
    </div>
  );
};

export default CampaignPreview;
