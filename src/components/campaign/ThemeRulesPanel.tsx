import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// TODO: pull from themes DB
const THEME_STAGE_RULES: Record<string, string[]> = {
  "sales-outreach": [
    "Open with a pain point specific to the prospect's role and company context.",
    "Lead with social proof — a case study or stat relevant to their industry.",
    "Tight CTA, create urgency without being pushy.",
    "Reference previous emails, reframe the value prop one more time.",
    "Breakup email — close the loop, leave the door open.",
  ],
  "event-followup": [
    "Reference the specific event and anchor to a shared moment or topic.",
    "Bridge from the event context to a concrete business problem you solve.",
    "Propose a specific next step while momentum is fresh.",
    "Follow up on any interest signals from previous emails.",
    "Final touch — keep it brief and human.",
  ],
  "competitive": [
    "Acknowledge what they're currently using and name the gap without disparaging.",
    "Show a concrete switching benefit with a number if possible.",
    "Low-friction CTA — make it easy to say yes to just a conversation.",
    "Address common objections to switching proactively.",
    "Final direct ask — summarize the case in one sentence.",
  ],
  "competitor-takeout": [
    "Acknowledge what they're currently using and name the gap without disparaging.",
    "Show a concrete switching benefit with a number if possible.",
    "Low-friction CTA — make it easy to say yes to just a conversation.",
    "Address common objections to switching proactively.",
    "Final direct ask — summarize the case in one sentence.",
  ],
  "nurture": [
    "Lead with a useful insight or resource — no ask, just value.",
    "Check in on a relevant pain point; position Pristine as the answer.",
    "Soft ask — invite a conversation only if the timing feels right to them.",
    "Share a relevant customer story or use case.",
    "Friendly check-in — keep the relationship warm.",
  ],
  "lead-nurture": [
    "Lead with a useful insight or resource — no ask, just value.",
    "Check in on a relevant pain point; position Pristine as the answer.",
    "Soft ask — invite a conversation only if the timing feels right to them.",
    "Share a relevant customer story or use case.",
    "Friendly check-in — keep the relationship warm.",
  ],
  "awareness": [
    "Announce the relevant capability and immediately tie it to their world.",
    "Show what changes for them specifically — not a feature list, an outcome.",
    "Give them one thing to do: watch a demo, read a case study, or reply.",
    "Reinforce the brand value with a concrete proof point.",
    "Final summary — one clear ask to close the loop.",
  ],
  "event-outreach": [
    "Reference the specific event and anchor to a shared context.",
    "Timely event-day nudge — make the CTA low friction.",
    "Post-event follow-up — connect takeaways to their priorities.",
    "Share a resource and tie it to a meeting ask.",
    "Final nudge with social proof from others met at the event.",
  ],
  "recruitment": [
    "Personalise the opening to the candidate's background and the specific role.",
    "Lead with culture and team story — make the opportunity feel real.",
    "Highlight compensation or growth angle relevant to their seniority.",
    "Friendly, low-pressure ask for an exploratory call.",
    "Final nudge with team testimonials — keep the door open.",
  ],
  "product-launch": [
    "Announce the relevant capability and immediately tie it to their world.",
    "Show what changes for them specifically — not a feature list, an outcome.",
    "Give them one thing to do: watch a demo, read a case study, or reply.",
    "Follow up with a relevant use case for their industry.",
    "Final push — urgency around the launch window if applicable.",
  ],
};

const THEME_LABELS: Record<string, string> = {
  "sales-outreach": "Sales Outreach",
  "lead-nurture": "Lead Nurture",
  "event-outreach": "Event Outreach",
  "competitor-takeout": "Competitor Takeout",
  "awareness": "Awareness",
  "recruitment": "Recruitment Outreach",
  "event-followup": "Event Follow-up",
  "competitive": "Competitive",
  "nurture": "Nurture",
  "product-launch": "Product Launch",
};

const STAGE_LABELS = [
  "Initial Outreach",
  "1st Follow-up",
  "2nd Follow-up",
  "3rd Follow-up",
  "Final Touch",
];

interface ThemeRulesPanelProps {
  buildMode: "saved_theme" | "custom" | undefined;
  themeId: string;
  stageCount: number;
  activeStage: number;
  onStageClick: (idx: number) => void;
  instructions?: string;
}

export default function ThemeRulesPanel({
  buildMode,
  themeId,
  stageCount,
  activeStage,
  onStageClick,
  instructions,
}: ThemeRulesPanelProps) {
  const isSavedTheme = buildMode === "saved_theme";
  const rules = isSavedTheme ? (THEME_STAGE_RULES[themeId] ?? []) : [];
  const themeLabel = THEME_LABELS[themeId] ?? themeId;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 mb-0.5">
          <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">What this campaign does</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {isSavedTheme ? themeLabel : "Custom"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {isSavedTheme ? (
          /* Stage-by-stage rule breakdown */
          Array.from({ length: stageCount }).map((_, idx) => {
            const rule = rules[idx] ?? "AI will craft this stage based on the theme rules.";
            const isActive = activeStage === idx;
            return (
              <button
                key={idx}
                onClick={() => onStageClick(idx)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 transition-all border-l-2",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/40 hover:border-primary/30"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[11px] font-semibold mb-0.5",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {STAGE_LABELS[idx] ?? `Stage ${idx + 1}`}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {rule}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          /* Build Your Own: show AI prompt or empty state */
          <div className="px-1 py-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon icon="solar:document-text-linear" className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">AI Instructions</span>
            </div>
            {instructions?.trim() ? (
              <p className="text-xs text-foreground leading-relaxed bg-muted/30 rounded-lg p-3 border border-border/50">
                {instructions}
              </p>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center">
                <Icon icon="solar:document-add-linear" className="h-5 w-5 text-muted-foreground/40 mx-auto mb-1.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  No AI instructions added. Emails will be written manually in this step.
                </p>
              </div>
            )}

            {/* Stage indicators for Build Your Own */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon icon="solar:layers-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stages</span>
              </div>
              {Array.from({ length: stageCount }).map((_, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onStageClick(idx)}
                    className={cn(
                      "w-full text-left rounded-lg px-3 py-2 transition-all border-l-2",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted/40 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {idx + 1}
                      </div>
                      <span className={cn(
                        "text-[11px] font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {STAGE_LABELS[idx] ?? `Stage ${idx + 1}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
