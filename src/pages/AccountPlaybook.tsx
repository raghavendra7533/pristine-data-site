import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type StakeholderRole = "Champion" | "Influencer" | "Economic Buyer" | "Ops" | "Blocker";
type StakeholderSentiment = "positive" | "neutral" | "negative" | "unknown";
type StakeholderFilter = "all" | "champions" | "blockers" | "neutral" | "new";
type PlaybookType = "first-contact" | "multi-stakeholder" | "new-stakeholder";
type Priority = "High" | "Med" | "Low";
type RiskCategory = "Competitive" | "Workflow" | "Technical" | "Procurement";
type TaskDue = "Today" | "Tomorrow" | "This week";
type TimelineEventType = "meeting" | "email" | "system";

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: StakeholderRole;
  sentiment: StakeholderSentiment;
  lastActiveDaysAgo: number;
  engagementScore: number;
}

interface TalkingPoint { text: string; }
interface FitHypothesis { text: string; priority: Priority; }
interface ValidationQuestion { text: string; actionLabel: string; actionColor: "blue" | "violet" | "emerald"; }
interface LandmineRisk { text: string; category: RiskCategory; }
interface NextAction { id: string; text: string; due: TaskDue; done: boolean; }
interface TimelineEvent { date: string; event: string; type: TimelineEventType; notes?: string; }

interface PlaybookContent {
  talkingPoints: TalkingPoint[];
  fitHypotheses: FitHypothesis[];
  validationQuestions: ValidationQuestion[];
  landmines: LandmineRisk[];
  nextActions: NextAction[];
  timeline: TimelineEvent[];
}

interface AccountPlaybookData {
  id: string;
  name: string;
  type: string;
  location: string;
  employeeCount: number;
  thesis: string;
  stage: string;
  intentScore: number;
  intentLabel: string;
  activeOppsCount: number;
  toolsInUse: string[];
  stakeholders: Stakeholder[];
  playbookContent: Record<PlaybookType, PlaybookContent>;
  meetingContext: {
    title: string;
    dateLabel: string;
    duration: string;
    attendeeInitials: string[];
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS: Record<string, AccountPlaybookData> = {
  "1": {
    id: "1",
    name: "LogicMark",
    type: "SaaS",
    location: "San Francisco",
    employeeCount: 450,
    thesis: "Modernizing revenue stack; RevOps hiring surge; evaluating conversation intelligence.",
    stage: "Discovery",
    intentScore: 78,
    intentLabel: "Warm",
    activeOppsCount: 1,
    toolsInUse: ["Gong", "Outreach"],
    stakeholders: [
      { id: "s1", name: "Kyle Hollingsworth", title: "VP of Sales", role: "Champion", sentiment: "positive", lastActiveDaysAgo: 2, engagementScore: 92 },
      { id: "s2", name: "Sarah Mitchell", title: "RevOps Director", role: "Influencer", sentiment: "positive", lastActiveDaysAgo: 5, engagementScore: 85 },
      { id: "s3", name: "James Chen", title: "CFO", role: "Economic Buyer", sentiment: "unknown", lastActiveDaysAgo: 14, engagementScore: 70 },
      { id: "s4", name: "Lisa Rodriguez", title: "IT Security Lead", role: "Ops", sentiment: "neutral", lastActiveDaysAgo: 21, engagementScore: 45 },
      { id: "s5", name: "David Park", title: "Sales Ops Manager", role: "Influencer", sentiment: "positive", lastActiveDaysAgo: 7, engagementScore: 78 },
    ],
    meetingContext: {
      title: "Discovery Call",
      dateLabel: "Today 2:30 PM · 30 min",
      duration: "30 min",
      attendeeInitials: ["KH", "SM", "DP"],
    },
    playbookContent: {
      "first-contact": {
        talkingPoints: [
          { text: "LogicMark investing in AI capabilities; positioning around measurable ROI." },
          { text: "RevOps hiring suggests process and visibility gaps they want to close." },
          { text: "Current stack indicates sequencing + conversation intelligence evaluation." },
        ],
        fitHypotheses: [
          { text: "Likely pain: integrating diverse data signals into action", priority: "High" },
          { text: "Likely goal: shorten cycles + improve win rates", priority: "High" },
          { text: "Likely constraint: security review + adoption", priority: "Med" },
        ],
        validationQuestions: [
          { text: "How do you prioritize accounts today and measure lift?", actionLabel: "Confirm pain", actionColor: "blue" },
          { text: "Where does pipeline coverage break down?", actionLabel: "Quantify impact", actionColor: "violet" },
          { text: "What would a 90-day win look like?", actionLabel: "Map stakeholders", actionColor: "emerald" },
        ],
        landmines: [
          { text: "Gong in evaluation", category: "Competitive" },
          { text: "Outreach in place", category: "Workflow" },
          { text: "Integration complexity", category: "Technical" },
          { text: "ROI scrutiny", category: "Procurement" },
        ],
        nextActions: [
          { id: "t1", text: "Send ROI framework to CFO", due: "Today", done: false },
          { id: "t2", text: "Schedule tech validation with IT", due: "Tomorrow", done: false },
          { id: "t3", text: "Share case study with RevOps", due: "This week", done: false },
        ],
        timeline: [
          { date: "2 days ago", event: "Discovery call completed", type: "meeting" },
          { date: "5 days ago", event: "Sarah Mitchell added as stakeholder", type: "system" },
          { date: "1 week ago", event: "Intent spike detected — pipeline coverage", type: "system" },
          { date: "1 week ago", event: "Follow-up email sent to Kyle", type: "email" },
        ],
      },
      "multi-stakeholder": {
        talkingPoints: [
          { text: "Align CFO on TCO vs. point-solution sprawl — quantify consolidation savings." },
          { text: "RevOps and Sales Ops need shared visibility; position unified data layer." },
          { text: "IT Security concern is a buying gate — surface compliance docs early." },
        ],
        fitHypotheses: [
          { text: "CFO will evaluate as platform investment, not single-seat tool", priority: "High" },
          { text: "RevOps owns budget but needs VP of Sales sponsorship", priority: "High" },
          { text: "IT may delay timeline 4–6 weeks for security review", priority: "Med" },
          { text: "Sales Ops will champion if workflow disruption is minimal", priority: "Low" },
        ],
        validationQuestions: [
          { text: "Who owns the final vendor decision — Sales or Finance?", actionLabel: "Map authority", actionColor: "blue" },
          { text: "What's the current cost of your existing stack?", actionLabel: "Build TCO case", actionColor: "violet" },
          { text: "Has IT reviewed any similar integrations recently?", actionLabel: "De-risk", actionColor: "emerald" },
        ],
        landmines: [
          { text: "Multiple stakeholders without a single DRI", category: "Workflow" },
          { text: "CFO may defer to Q3 budget cycle", category: "Procurement" },
          { text: "Gong relationship may bias VP of Sales", category: "Competitive" },
        ],
        nextActions: [
          { id: "t4", text: "Send multi-stakeholder alignment deck", due: "Today", done: false },
          { id: "t5", text: "Book CFO intro call via Kyle", due: "Tomorrow", done: false },
          { id: "t6", text: "Draft IT security one-pager", due: "This week", done: false },
        ],
        timeline: [
          { date: "2 days ago", event: "Discovery call completed", type: "meeting" },
          { date: "5 days ago", event: "Sarah Mitchell added as stakeholder", type: "system" },
          { date: "1 week ago", event: "Follow-up email sent to Kyle", type: "email" },
        ],
      },
      "new-stakeholder": {
        talkingPoints: [
          { text: "Set context quickly — reference shared goal of improving pipeline predictability." },
          { text: "Acknowledge their role and why their perspective matters to the evaluation." },
          { text: "Keep intro tight; lead with a question, not a pitch." },
        ],
        fitHypotheses: [
          { text: "New stakeholder may have undiscovered veto power", priority: "High" },
          { text: "Could accelerate timeline if they become a champion", priority: "Med" },
          { text: "Likely unaware of current evaluation status", priority: "Med" },
        ],
        validationQuestions: [
          { text: "How familiar are you with the current evaluation?", actionLabel: "Orient", actionColor: "blue" },
          { text: "What does success look like from your seat?", actionLabel: "Align goals", actionColor: "emerald" },
          { text: "Are there concerns you'd want addressed early?", actionLabel: "Surface risk", actionColor: "violet" },
        ],
        landmines: [
          { text: "Unknown relationship with existing champion", category: "Workflow" },
          { text: "May introduce new security or compliance requirements", category: "Technical" },
        ],
        nextActions: [
          { id: "t7", text: "Send intro + context email to new stakeholder", due: "Today", done: false },
          { id: "t8", text: "Ask Kyle to make a warm intro", due: "Tomorrow", done: false },
        ],
        timeline: [
          { date: "2 days ago", event: "Discovery call completed", type: "meeting" },
          { date: "1 week ago", event: "Intent spike detected — pipeline coverage", type: "system" },
        ],
      },
    },
  },
  "2": {
    id: "2",
    name: "Traction Labs",
    type: "SaaS",
    location: "Austin",
    employeeCount: 180,
    thesis: "Scaling outbound motion; evaluating automation tooling for SDR team.",
    stage: "Evaluation",
    intentScore: 84,
    intentLabel: "Hot",
    activeOppsCount: 2,
    toolsInUse: ["Salesloft", "HubSpot"],
    stakeholders: [
      { id: "s6", name: "Marcus Webb", title: "Head of Sales", role: "Champion", sentiment: "positive", lastActiveDaysAgo: 1, engagementScore: 88 },
      { id: "s7", name: "Priya Nair", title: "Marketing Ops", role: "Influencer", sentiment: "neutral", lastActiveDaysAgo: 10, engagementScore: 62 },
    ],
    meetingContext: {
      title: "Evaluation Review",
      dateLabel: "Tomorrow 11:00 AM · 45 min",
      duration: "45 min",
      attendeeInitials: ["MW", "PN"],
    },
    playbookContent: {
      "first-contact": {
        talkingPoints: [
          { text: "SDR team scaling rapidly — volume without precision creates noise." },
          { text: "HubSpot data hygiene gaps causing mis-prioritization." },
          { text: "Salesloft in place but missing account-level intelligence layer." },
        ],
        fitHypotheses: [
          { text: "Core pain: SDRs targeting wrong accounts due to signal lag", priority: "High" },
          { text: "Likely goal: increase qualified pipeline with same headcount", priority: "High" },
          { text: "Constraint: HubSpot integration complexity", priority: "Med" },
        ],
        validationQuestions: [
          { text: "What's your current ICP definition and how often is it updated?", actionLabel: "Confirm pain", actionColor: "blue" },
          { text: "How do SDRs decide which accounts to work each week?", actionLabel: "Quantify gap", actionColor: "violet" },
          { text: "What would a 2x pipeline look like for your team?", actionLabel: "Anchor goal", actionColor: "emerald" },
        ],
        landmines: [
          { text: "Salesloft contract renewal coming up", category: "Competitive" },
          { text: "HubSpot deeply embedded — change resistance expected", category: "Workflow" },
        ],
        nextActions: [
          { id: "t9", text: "Send SDR use-case one-pager", due: "Today", done: false },
          { id: "t10", text: "Set up pilot proposal", due: "This week", done: false },
        ],
        timeline: [
          { date: "1 day ago", event: "Intro call with Marcus", type: "meeting" },
          { date: "3 days ago", event: "Inbound demo request", type: "system" },
        ],
      },
      "multi-stakeholder": {
        talkingPoints: [
          { text: "Marketing Ops holds data quality — align on shared pipeline metrics." },
          { text: "Head of Sales drives urgency; Marketing Ops controls feasibility." },
          { text: "Frame as augmenting HubSpot, not replacing it." },
        ],
        fitHypotheses: [
          { text: "Marketing Ops is the silent gatekeeper on data integrations", priority: "High" },
          { text: "Sales and Marketing may have conflicting success metrics", priority: "Med" },
        ],
        validationQuestions: [
          { text: "How do Sales and Marketing currently align on account priority?", actionLabel: "Uncover tension", actionColor: "violet" },
          { text: "Who owns the HubSpot data model?", actionLabel: "Map authority", actionColor: "blue" },
        ],
        landmines: [
          { text: "Marketing Ops may slow procurement", category: "Procurement" },
          { text: "Different success metrics across teams", category: "Workflow" },
        ],
        nextActions: [
          { id: "t11", text: "Schedule joint Sales + Marketing call", due: "Tomorrow", done: false },
          { id: "t12", text: "Prepare HubSpot integration FAQ", due: "This week", done: false },
        ],
        timeline: [
          { date: "1 day ago", event: "Intro call with Marcus", type: "meeting" },
        ],
      },
      "new-stakeholder": {
        talkingPoints: [
          { text: "Reference Marcus as the internal sponsor for context-setting." },
          { text: "Lead with the data quality angle — most relevant to ops personas." },
        ],
        fitHypotheses: [
          { text: "New stakeholder may control integration approval", priority: "High" },
        ],
        validationQuestions: [
          { text: "What's your current process for evaluating new data tools?", actionLabel: "Orient", actionColor: "blue" },
        ],
        landmines: [
          { text: "Unfamiliar with existing evaluation context", category: "Workflow" },
        ],
        nextActions: [
          { id: "t13", text: "Send intro email via Marcus", due: "Today", done: false },
        ],
        timeline: [
          { date: "1 day ago", event: "Intro call with Marcus", type: "meeting" },
        ],
      },
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatLastActive(days: number): string {
  if (days === 0) return "Today";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

const ROLE_STYLES: Record<StakeholderRole, string> = {
  Champion: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Influencer: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Economic Buyer": "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  Ops: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  Blocker: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  Med: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Low: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const RISK_STYLES: Record<RiskCategory, string> = {
  Competitive: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  Workflow: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Technical: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Procurement: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
};

const DUE_STYLES: Record<TaskDue, string> = {
  Today: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  Tomorrow: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "This week": "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const ACTION_COLOR_STYLES: Record<"blue" | "violet" | "emerald", string> = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
};

const TIMELINE_ICON: Record<TimelineEventType, { icon: string; color: string }> = {
  meeting: { icon: "solar:video-frame-linear", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  email: { icon: "solar:letter-linear", color: "text-primary bg-primary/10" },
  system: { icon: "solar:settings-linear", color: "text-slate-600 dark:text-slate-400 bg-slate-500/10" },
};

const AVATAR_COLORS = [
  "bg-gradient-to-br from-blue-500 to-violet-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
  "bg-gradient-to-br from-rose-500 to-pink-600",
  "bg-gradient-to-br from-violet-500 to-purple-600",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SentimentIcon({ sentiment }: { sentiment: StakeholderSentiment }) {
  if (sentiment === "positive") return <Icon icon="solar:thumb-up-bold" className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />;
  if (sentiment === "negative") return <Icon icon="solar:thumb-down-bold" className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />;
  if (sentiment === "neutral") return <Icon icon="solar:minus-circle-linear" className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />;
  return <Icon icon="solar:danger-triangle-linear" className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />;
}

function StakeholderCard({ stakeholder, index }: { stakeholder: Stakeholder; index: number }) {
  const initials = stakeholder.name.split(" ").map((n) => n[0]).join("");
  return (
    <div className="p-3 rounded-lg border border-border hover:bg-muted/40 cursor-pointer transition-colors space-y-2">
      <div className="flex items-center gap-2">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0", AVATAR_COLORS[index % AVATAR_COLORS.length])}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate text-foreground">{stakeholder.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{stakeholder.title}</p>
        </div>
        <SentimentIcon sentiment={stakeholder.sentiment} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", ROLE_STYLES[stakeholder.role])}>
          {stakeholder.role}
        </Badge>
        <span className="text-[10px] text-muted-foreground flex-shrink-0">{formatLastActive(stakeholder.lastActiveDaysAgo)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={stakeholder.engagementScore} className="h-1 flex-1" />
        <span className="text-[10px] text-muted-foreground w-7 text-right">{stakeholder.engagementScore}%</span>
      </div>
    </div>
  );
}

function TalkingPointsCard({ points }: { points: TalkingPoint[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Icon icon="solar:chat-dots-bold" className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-sm">Account Talking Points</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Top {points.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2.5">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              {pt.text}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FitHypothesesCard({ hypotheses }: { hypotheses: FitHypothesis[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon icon="solar:target-bold" className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle className="text-sm">Fit Hypotheses</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2.5">
          {hypotheses.map((h, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm text-foreground">
              <span className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                {h.text}
              </span>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 flex-shrink-0", PRIORITY_STYLES[h.priority])}>
                {h.priority}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ValidationQuestionsCard({ questions }: { questions: ValidationQuestion[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Icon icon="solar:question-circle-bold" className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-sm">Questions to Validate</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">Discovery</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2.5">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm text-foreground">
              <span className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                {q.text}
              </span>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 flex-shrink-0", ACTION_COLOR_STYLES[q.actionColor])}>
                {q.actionLabel}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LandminesCard({ risks }: { risks: LandmineRisk[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Icon icon="solar:danger-triangle-bold" className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-sm">Landmines & Risks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2.5">
          {risks.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-sm text-foreground">
              <span className="flex items-center gap-2">
                <Icon icon="solar:danger-triangle-linear" className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                {r.text}
              </span>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 flex-shrink-0", RISK_STYLES[r.category])}>
                {r.category}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function NextActionsCard({
  tasks,
  onToggle,
}: {
  tasks: NextAction[];
  onToggle: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Icon icon="solar:checklist-minimalistic-bold" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-sm">Next Actions</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground">
            <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => onToggle(task.id)}
                  className="h-4 w-4 flex-shrink-0"
                />
                <span className={cn("text-sm", task.done && "line-through text-muted-foreground")}>
                  {task.text}
                </span>
              </div>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 flex-shrink-0", DUE_STYLES[task.due])}>
                {task.due}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ActivityTimelineCard({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Icon icon="solar:history-bold" className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <CardTitle className="text-sm">Activity Timeline</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {events.map((ev, i) => {
            const { icon, color } = TIMELINE_ICON[ev.type];
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
                  <Icon icon={icon} className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-foreground leading-snug">{ev.event}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{ev.date}</p>
                  {ev.notes && <p className="text-[11px] text-muted-foreground mt-0.5 italic">{ev.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AccountPlaybook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const account = id ? MOCK_ACCOUNTS[id] : undefined;

  const [playbookType, setPlaybookType] = useState<PlaybookType>("first-contact");
  const [stakeholderFilter, setStakeholderFilter] = useState<StakeholderFilter>("all");
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [meetingNote, setMeetingNote] = useState("");
  const [tasks, setTasks] = useState<NextAction[]>([]);

  useEffect(() => {
    if (account) {
      setTasks(account.playbookContent[playbookType].nextActions.map((t) => ({ ...t })));
    }
  }, [playbookType, account?.id]);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  if (!account) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6">
        <Icon icon="solar:buildings-2-linear" className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Account not found</h2>
          <p className="text-sm text-muted-foreground mt-1">No account with ID "{id}".</p>
        </div>
        <button onClick={() => navigate("/opportunities")} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
          Back to Playbooks
        </button>
      </div>
    );
  }

  const content = account.playbookContent[playbookType];

  const filteredStakeholders = account.stakeholders.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      s.title.toLowerCase().includes(stakeholderSearch.toLowerCase());
    const matchesFilter =
      stakeholderFilter === "all" ||
      (stakeholderFilter === "champions" && s.role === "Champion") ||
      (stakeholderFilter === "blockers" && s.role === "Blocker") ||
      (stakeholderFilter === "neutral" && s.sentiment === "neutral") ||
      (stakeholderFilter === "new" && s.lastActiveDaysAgo <= 7);
    return matchesSearch && matchesFilter;
  });

  const intentBadgeStyle =
    account.intentScore >= 85
      ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      : account.intentScore >= 70
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";

  const FILTER_TABS: { key: StakeholderFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "champions", label: "Champions" },
    { key: "blockers", label: "Blockers" },
    { key: "neutral", label: "Neutral" },
    { key: "new", label: "New" },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>

      {/* ── Top Nav Bar ── */}
      <div className="border-b border-border bg-card px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/opportunities")}>
          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
          Back to Playbooks
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5" />
            Refresh Intel
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Icon icon="solar:notes-linear" className="h-3.5 w-3.5" />
            Add Note
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <Icon icon="solar:letter-linear" className="h-3.5 w-3.5" />
            Compose Email
          </Button>
        </div>
      </div>

      {/* ── Account Header Bar ── */}
      <div className="border-b border-border bg-card px-5 py-3.5 flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon icon="solar:buildings-2-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">{account.name}</h1>
              <p className="text-xs text-muted-foreground">
                {account.type} · {account.location} · {account.employeeCount} employees
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Icon icon="solar:link-square-linear" className="h-3.5 w-3.5" />
              View CRM
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Icon icon="solar:magnifer-zoom-in-linear" className="h-3.5 w-3.5" />
              Research
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Icon icon="solar:user-plus-rounded-linear" className="h-3.5 w-3.5" />
              Add Stakeholder
            </Button>
          </div>
        </div>

        {/* Thesis row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Account Thesis</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20 gap-1">
            <Icon icon="solar:magic-stick-3-linear" className="h-3 w-3" />
            AI
          </Badge>
          <span className="text-xs text-foreground">{account.thesis}</span>
        </div>

        {/* Tag pills row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
            <Icon icon="solar:chart-2-linear" className="h-3 w-3 mr-1" />
            {account.stage}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", intentBadgeStyle)}>
            {account.intentLabel} · {account.intentScore}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
            {account.activeOppsCount} Active Opp{account.activeOppsCount !== 1 ? "s" : ""}
          </Badge>
          {account.toolsInUse.map((tool) => (
            <Badge key={tool} variant="outline" className="text-[10px] px-2 py-0.5 bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {/* ── Two-Column Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Stakeholder Panel */}
        <div className="w-72 flex-shrink-0 border-r border-border flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <h2 className="text-sm font-semibold text-foreground">Stakeholders</h2>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
              <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search people..."
                value={stakeholderSearch}
                onChange={(e) => setStakeholderSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-3 pb-2 flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStakeholderFilter(tab.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                    stakeholderFilter === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stakeholder list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
            {filteredStakeholders.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-1 pt-2">No stakeholders match this filter.</p>
            ) : (
              filteredStakeholders.map((s, i) => <StakeholderCard key={s.id} stakeholder={s} index={i} />)
            )}
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Playbook type tab bar (sticky) */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-background flex-shrink-0">
            <Tabs value={playbookType} onValueChange={(v) => setPlaybookType(v as PlaybookType)}>
              <TabsList className="h-8">
                <TabsTrigger value="first-contact" className="text-xs px-3">First Contact</TabsTrigger>
                <TabsTrigger value="multi-stakeholder" className="text-xs px-3">Multi-Stakeholder</TabsTrigger>
                <TabsTrigger value="new-stakeholder" className="text-xs px-3">New Stakeholder</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">

            {/* Meeting context bar */}
            <div className="mx-5 mt-4 p-3 rounded-xl border border-border bg-muted/30 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:calendar-bold" className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{account.meetingContext.title}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{account.meetingContext.dateLabel}</span>
              </div>
              {/* Attendee avatars */}
              <div className="flex items-center flex-shrink-0">
                {account.meetingContext.attendeeInitials.map((initials, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-card",
                      AVATAR_COLORS[i % AVATAR_COLORS.length],
                      i > 0 && "-ml-1.5"
                    )}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              {/* Notes input */}
              <Input
                placeholder="Confirm success metrics + next steps"
                value={meetingNote}
                onChange={(e) => setMeetingNote(e.target.value)}
                className="flex-1 h-7 text-xs min-w-[200px] bg-background"
              />
            </div>

            {/* Content cards grid */}
            <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
              <TalkingPointsCard points={content.talkingPoints} />
              <FitHypothesesCard hypotheses={content.fitHypotheses} />
              <ValidationQuestionsCard questions={content.validationQuestions} />
              <LandminesCard risks={content.landmines} />
              <NextActionsCard tasks={tasks} onToggle={handleToggleTask} />
              <ActivityTimelineCard events={content.timeline} />
            </div>

            {/* Deep research accordions */}
            <div className="px-5 pb-6">
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="account-research" className="border border-border rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Icon icon="solar:buildings-2-linear" className="h-4 w-4 text-muted-foreground" />
                      Deep Account Research
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-2">
                    <p><span className="font-medium text-foreground">{account.name}</span> is a {account.type} company headquartered in {account.location} with approximately {account.employeeCount} employees. They are currently evaluating solutions in the revenue intelligence space with a focus on ROI visibility and pipeline predictability.</p>
                    <p>Recent hiring signals indicate expansion of the RevOps function, suggesting a maturation of their go-to-market infrastructure. Intent data shows elevated research activity around conversation intelligence and data enrichment topics over the past 30 days.</p>
                    <p className="text-[11px] italic">Full research report available via the Research button above.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact-research" className="border border-border rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Icon icon="solar:user-linear" className="h-4 w-4 text-muted-foreground" />
                      Deep Contact Research
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-2">
                    {account.stakeholders.slice(0, 2).map((s) => (
                      <div key={s.id} className="space-y-0.5">
                        <p className="font-medium text-foreground text-sm">{s.name} — {s.title}</p>
                        <p className="text-xs">Engagement score: {s.engagementScore}% · Last active: {formatLastActive(s.lastActiveDaysAgo)} · Role: {s.role}</p>
                      </div>
                    ))}
                    <p className="text-[11px] italic">Individual contact profiles available via the stakeholder cards.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
