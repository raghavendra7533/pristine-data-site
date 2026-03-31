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

/* ─── Main Component: Apollo-style all-stages-on-one-screen ─── */

const CampaignPreview = ({ data, onUpdate }: CampaignPreviewProps) => {
  const isSelective = data.personalizationMode === "selective";
  const [activeStage, setActiveStage] = useState(0);
  const [previewContact, setPreviewContact] = useState(previewContacts[0]);

  // Per-stage data
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
      // Sync first stage back to parent
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


  return (
    <div className="animate-fade-in">
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
        </div>
      </div>

      {/* All stages stacked, each with its own inline preview */}
      <div className="space-y-0">
        {stages.map((stage, idx) => (
          <div key={idx}>
            {/* Stage row: editor + preview side by side */}
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

            {/* Interval between stages */}
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

        {/* Add a step */}
        <div className="flex justify-center pt-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary border border-dashed border-border rounded-lg hover:border-primary/40 transition-colors">
            <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
            Add a step
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;
