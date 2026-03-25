import { useState } from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAILBOXES = 1500;
const SENDS_PER_MAILBOX = 5;
const DAILY_CAP = MAILBOXES * SENDS_PER_MAILBOX; // 7,500

// ─── Types ───────────────────────────────────────────────────────────────────
interface DaySends {
  date: string;       // "Mar 9"
  dateKey: string;    // "2026-03-09"
  s1: number;
  s2: number;
  s3: number;
}

interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  prospects: number;
  stages: number;
  color: string;
  days: DaySends[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
// 4-week rolling window starting Mon Mar 9 2026
// Daily cap: 7,500 — distributed across 3 campaigns, 2 stages each

const weeks = [
  {
    label: "Week 1",
    days: [
      { date: "Mar 9", dateKey: "2026-03-09", dow: "Mon" },
      { date: "Mar 10", dateKey: "2026-03-10", dow: "Tue" },
      { date: "Mar 11", dateKey: "2026-03-11", dow: "Wed" },
      { date: "Mar 12", dateKey: "2026-03-12", dow: "Thu" },
      { date: "Mar 13", dateKey: "2026-03-13", dow: "Fri" },
    ],
  },
  {
    label: "Week 2",
    days: [
      { date: "Mar 16", dateKey: "2026-03-16", dow: "Mon" },
      { date: "Mar 17", dateKey: "2026-03-17", dow: "Tue" },
      { date: "Mar 18", dateKey: "2026-03-18", dow: "Wed" },
      { date: "Mar 19", dateKey: "2026-03-19", dow: "Thu" },
      { date: "Mar 20", dateKey: "2026-03-20", dow: "Fri" },
    ],
  },
  {
    label: "Week 3",
    days: [
      { date: "Mar 23", dateKey: "2026-03-23", dow: "Mon" },
      { date: "Mar 24", dateKey: "2026-03-24", dow: "Tue" },
      { date: "Mar 25", dateKey: "2026-03-25", dow: "Wed" },
      { date: "Mar 26", dateKey: "2026-03-26", dow: "Thu" },
      { date: "Mar 27", dateKey: "2026-03-27", dow: "Fri" },
    ],
  },
  {
    label: "Week 4",
    days: [
      { date: "Mar 30", dateKey: "2026-03-30", dow: "Mon" },
      { date: "Mar 31", dateKey: "2026-03-31", dow: "Tue" },
      { date: "Apr 1", dateKey: "2026-04-01", dow: "Wed" },
      { date: "Apr 2", dateKey: "2026-04-02", dow: "Thu" },
      { date: "Apr 3", dateKey: "2026-04-03", dow: "Fri" },
    ],
  },
];

const allDays = weeks.flatMap((w) => w.days);

const campaigns: Campaign[] = [
  {
    id: "q1-saas",
    name: "Q1 SaaS Outreach",
    status: "Active",
    prospects: 15000,
    stages: 2,
    color: "blue",
    days: [
      { date: "Mar 9",  dateKey: "2026-03-09", s1: 4500, s2: 0,    s3: 0 },
      { date: "Mar 10", dateKey: "2026-03-10", s1: 4500, s2: 0,    s3: 0 },
      { date: "Mar 11", dateKey: "2026-03-11", s1: 0,    s2: 2500, s3: 0 },
      { date: "Mar 12", dateKey: "2026-03-12", s1: 0,    s2: 2500, s3: 0 },
      { date: "Mar 13", dateKey: "2026-03-13", s1: 0,    s2: 1000, s3: 0 },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare Lead Nurture",
    status: "Active",
    prospects: 10000,
    stages: 2,
    color: "purple",
    days: [
      { date: "Mar 9",  dateKey: "2026-03-09", s1: 3000, s2: 0,    s3: 0 },
      { date: "Mar 10", dateKey: "2026-03-10", s1: 3000, s2: 0,    s3: 0 },
      { date: "Mar 11", dateKey: "2026-03-11", s1: 0,    s2: 1500, s3: 0 },
      { date: "Mar 12", dateKey: "2026-03-12", s1: 0,    s2: 1500, s3: 0 },
      { date: "Mar 13", dateKey: "2026-03-13", s1: 0,    s2: 1000, s3: 0 },
      { date: "Mar 16", dateKey: "2026-03-16", s1: 0,    s2: 500,  s3: 0 },
    ],
  },
  {
    id: "event",
    name: "Event Follow-up",
    status: "Active",
    prospects: 6000,
    stages: 2,
    color: "amber",
    days: [
      { date: "Mar 11", dateKey: "2026-03-11", s1: 3500, s2: 0,    s3: 0 },
      { date: "Mar 12", dateKey: "2026-03-12", s1: 2500, s2: 0,    s3: 0 },
      { date: "Mar 13", dateKey: "2026-03-13", s1: 2500, s2: 0,    s3: 0 },
      { date: "Mar 16", dateKey: "2026-03-16", s1: 0,    s2: 2400, s3: 0 },
      { date: "Mar 17", dateKey: "2026-03-17", s1: 0,    s2: 2400, s3: 0 },
    ],
  },
];

// Compute daily totals across all campaigns
function getDailyTotal(dateKey: string): { s1: number; s2: number; s3: number; total: number } {
  let s1 = 0, s2 = 0, s3 = 0;
  for (const c of campaigns) {
    const day = c.days.find((d) => d.dateKey === dateKey);
    if (day) { s1 += day.s1; s2 += day.s2; s3 += day.s3; }
  }
  return { s1, s2, s3, total: s1 + s2 + s3 };
}

function getCampaignDay(campaign: Campaign, dateKey: string): DaySends | null {
  return campaign.days.find((d) => d.dateKey === dateKey) ?? null;
}

// ─── Stage colour helpers ─────────────────────────────────────────────────────
const stageColors = {
  s1: { bg: "bg-blue-500",   light: "bg-blue-500/20",   text: "text-blue-600 dark:text-blue-400",   label: "Stage 1" },
  s2: { bg: "bg-violet-500", light: "bg-violet-500/20", text: "text-violet-600 dark:text-violet-400", label: "Stage 2" },
  s3: { bg: "bg-amber-500",  light: "bg-amber-500/20",  text: "text-amber-600 dark:text-amber-400",  label: "Stage 3" },
};

function capacityColor(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function capacityTextColor(pct: number) {
  if (pct >= 90) return "text-red-600 dark:text-red-400";
  if (pct >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function capacityDotColor(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

// ─── Tooltip state ────────────────────────────────────────────────────────────
interface TooltipInfo {
  campaignName?: string;
  date: string;
  s1: number;
  s2: number;
  s3: number;
  total: number;
  pct: number;
  x: number;
  y: number;
  isCapacityRow?: boolean;
}

// ─── New Campaign Scheduler ───────────────────────────────────────────────────
const STAGE_DEFAULTS: Record<number, number[]> = {
  1: [100],
  2: [60, 40],
  3: [50, 30, 20],
};

function computeEarliestStart(
  prospectCount: number,
  numStages: number,
  stageSplit: number[],
  stageGap: number
): { week: string; date: string; mailboxesNeeded: number; weeksAway: number } {
  // Simple heuristic: find first Monday where this campaign fits
  const futureDays = allDays.filter((d) => d.dow === "Mon");
  for (let i = 0; i < futureDays.length; i++) {
    const monday = futureDays[i];
    // Project sends for this campaign starting this Monday
    const stage1Sends = Math.round(prospectCount * (stageSplit[0] / 100));
    const daysNeeded = Math.ceil(stage1Sends / DAILY_CAP);
    // Check if daily cap allows it (simplified: check Monday's existing usage)
    const existing = getDailyTotal(monday.dateKey).total;
    const available = DAILY_CAP - existing;
    if (available >= Math.min(stage1Sends, DAILY_CAP * 0.3)) {
      return {
        week: `Week ${i + 1}`,
        date: monday.date,
        mailboxesNeeded: 0,
        weeksAway: i,
      };
    }
  }
  // No slot found — suggest mailbox upgrade
  const extraSends = Math.round(prospectCount * (stageSplit[0] / 100) * 0.3);
  const mailboxesNeeded = Math.ceil(extraSends / SENDS_PER_MAILBOX);
  return { week: "Week 3", date: "Mar 23", mailboxesNeeded, weeksAway: 2 };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CampaignCalendar() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  // Scheduler form state
  const [schedulerName, setSchedulerName] = useState("");
  const [schedulerProspects, setSchedulerProspects] = useState(10000);
  const [schedulerStages, setSchedulerStages] = useState(2);
  const [schedulerGap, setSchedulerGap] = useState(2);
  const [schedulerSplit, setSchedulerSplit] = useState(STAGE_DEFAULTS[2]);

  const handleStageChange = (n: number) => {
    setSchedulerStages(n);
    setSchedulerSplit(STAGE_DEFAULTS[n]);
  };

  const earliest = computeEarliestStart(
    schedulerProspects,
    schedulerStages,
    schedulerSplit,
    schedulerGap
  );
  const showUpgradePrompt = earliest.weeksAway >= 2;

  // This week stats
  const week1Days = weeks[0].days;
  const thisWeekUsed = week1Days.reduce((sum, d) => sum + getDailyTotal(d.dateKey).total, 0);
  const thisWeekCap = DAILY_CAP * 5;
  const thisWeekFree = thisWeekCap - thisWeekUsed;
  const thisWeekPct = Math.round((thisWeekUsed / thisWeekCap) * 100);

  // Next available window
  const nextFreeDay = allDays.find((d) => {
    const t = getDailyTotal(d.dateKey).total;
    return t / DAILY_CAP < 0.8;
  });

  return (
    <div className="min-h-full">
      {/* ── Page Header ── */}
      <div className="px-6 pt-6 pb-4 max-w-screen-xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:calendar-linear" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Campaign Calendar</h1>
              <p className="text-xs text-muted-foreground">
                4-week capacity view · {MAILBOXES.toLocaleString()} mailboxes · {DAILY_CAP.toLocaleString()} sends/day
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowScheduler(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
            Schedule Campaign
          </button>
        </div>
      </div>

      {/* ── Capacity Status Cards ── */}
      <div className="px-6 pb-4 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">This Week — Sends Used</p>
              <p className="text-2xl font-bold text-foreground">{thisWeekUsed.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", capacityDotColor(thisWeekPct))} />
                <span className={cn("text-xs font-medium", capacityTextColor(thisWeekPct))}>
                  {thisWeekPct}% utilised
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Sends Remaining</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {thisWeekFree.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">of {thisWeekCap.toLocaleString()} weekly cap</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Active Campaigns</p>
              <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground mt-1">across {weeks.length} weeks</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Next Available Window</p>
              <p className="text-2xl font-bold text-foreground">{nextFreeDay?.date ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">&gt;20% daily capacity free</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="px-6 pb-3 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-5">
          {(["s1", "s2", "s3"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", stageColors[s].bg)} />
              <span className="text-xs text-muted-foreground">{stageColors[s].label}</span>
            </div>
          ))}
          <div className="ml-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-emerald-500" />&lt;70% cap</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-amber-500" />70–90%</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-red-500" />&gt;90%</div>
          </div>
        </div>
      </div>

      {/* ── Gantt Grid ── */}
      <div className="px-6 pb-8 max-w-screen-xl mx-auto">
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 900 }}>
            <thead>
              {/* Week labels */}
              <tr className="border-b border-border">
                <th className="w-44 px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground bg-muted/30 border-r border-border">
                  Campaign
                </th>
                {weeks.map((week) => (
                  <th
                    key={week.label}
                    colSpan={5}
                    className="px-2 py-2.5 text-center text-xs font-semibold text-foreground bg-muted/30 border-r border-border last:border-r-0"
                  >
                    {week.label}
                  </th>
                ))}
              </tr>
              {/* Day headers */}
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left text-[10px] text-muted-foreground bg-muted/20 border-r border-border" />
                {allDays.map((day, i) => {
                  const isToday = day.dateKey === "2026-03-12";
                  const isLastInWeek = (i + 1) % 5 === 0;
                  return (
                    <th
                      key={day.dateKey}
                      className={cn(
                        "px-1 py-2 text-center bg-muted/20",
                        isLastInWeek && i < allDays.length - 1 ? "border-r border-border" : ""
                      )}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] text-muted-foreground font-medium">{day.dow}</span>
                        <span
                          className={cn(
                            "text-[11px] font-semibold rounded px-1",
                            isToday
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground"
                          )}
                        >
                          {day.date.split(" ")[1]}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Campaign rows */}
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  {/* Campaign label */}
                  <td className="px-4 py-2.5 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        campaign.color === "blue" ? "bg-blue-500" :
                        campaign.color === "purple" ? "bg-violet-500" : "bg-amber-500"
                      )} />
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[130px]">
                          {campaign.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {campaign.prospects.toLocaleString()} prospects · {campaign.stages} stages
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Day cells */}
                  {allDays.map((day, i) => {
                    const dayData = getCampaignDay(campaign, day.dateKey);
                    const total = dayData ? dayData.s1 + dayData.s2 + dayData.s3 : 0;
                    const isLastInWeek = (i + 1) % 5 === 0;
                    const dailyTot = getDailyTotal(day.dateKey).total;

                    return (
                      <td
                        key={day.dateKey}
                        className={cn(
                          "px-1 py-2 text-center align-middle",
                          isLastInWeek && i < allDays.length - 1 ? "border-r border-border" : ""
                        )}
                        onMouseEnter={(e) => {
                          if (!dayData || total === 0) return;
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setTooltip({
                            campaignName: campaign.name,
                            date: day.date,
                            s1: dayData.s1,
                            s2: dayData.s2,
                            s3: dayData.s3,
                            total,
                            pct: Math.round((dailyTot / DAILY_CAP) * 100),
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {total > 0 && dayData ? (
                          <div className="flex flex-col gap-0.5 items-center w-full px-0.5">
                            {dayData.s1 > 0 && (
                              <div
                                className="w-full rounded-sm bg-blue-500 opacity-90"
                                style={{ height: Math.max(4, Math.round((dayData.s1 / DAILY_CAP) * 40)) }}
                                title={`Stage 1: ${dayData.s1.toLocaleString()}`}
                              />
                            )}
                            {dayData.s2 > 0 && (
                              <div
                                className="w-full rounded-sm bg-violet-500 opacity-90"
                                style={{ height: Math.max(4, Math.round((dayData.s2 / DAILY_CAP) * 40)) }}
                                title={`Stage 2: ${dayData.s2.toLocaleString()}`}
                              />
                            )}
                            {dayData.s3 > 0 && (
                              <div
                                className="w-full rounded-sm bg-amber-500 opacity-90"
                                style={{ height: Math.max(4, Math.round((dayData.s3 / DAILY_CAP) * 40)) }}
                                title={`Stage 3: ${dayData.s3.toLocaleString()}`}
                              />
                            )}
                            <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                              {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
                            </span>
                          </div>
                        ) : (
                          <div className="h-8 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Capacity bar row */}
              <tr className="border-t-2 border-border bg-muted/20">
                <td className="px-4 py-3 border-r border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Daily Capacity
                  </p>
                  <p className="text-[10px] text-muted-foreground">{DAILY_CAP.toLocaleString()} max</p>
                </td>
                {allDays.map((day, i) => {
                  const { total } = getDailyTotal(day.dateKey);
                  const pct = Math.round((total / DAILY_CAP) * 100);
                  const isLastInWeek = (i + 1) % 5 === 0;

                  return (
                    <td
                      key={day.dateKey}
                      className={cn(
                        "px-1.5 py-3 align-bottom",
                        isLastInWeek && i < allDays.length - 1 ? "border-r border-border" : ""
                      )}
                      onMouseEnter={(e) => {
                        if (total === 0) return;
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltip({
                          date: day.date,
                          s1: getDailyTotal(day.dateKey).s1,
                          s2: getDailyTotal(day.dateKey).s2,
                          s3: getDailyTotal(day.dateKey).s3,
                          total,
                          pct,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          isCapacityRow: true,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {total > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("text-[9px] font-semibold", capacityTextColor(pct))}>
                            {pct}%
                          </span>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", capacityColor(pct))}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 opacity-30">
                          <span className="text-[9px] text-muted-foreground">0%</span>
                          <div className="w-full bg-muted rounded-full h-2" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hover Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            {tooltip.campaignName && (
              <p className="font-semibold text-foreground mb-1">{tooltip.campaignName}</p>
            )}
            <p className="text-muted-foreground font-medium mb-1.5">{tooltip.date}</p>
            {tooltip.s1 > 0 && (
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-sm bg-blue-500" />
                <span className="text-muted-foreground">Stage 1:</span>
                <span className="font-semibold text-foreground">{tooltip.s1.toLocaleString()}</span>
              </div>
            )}
            {tooltip.s2 > 0 && (
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-sm bg-violet-500" />
                <span className="text-muted-foreground">Stage 2:</span>
                <span className="font-semibold text-foreground">{tooltip.s2.toLocaleString()}</span>
              </div>
            )}
            {tooltip.s3 > 0 && (
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-sm bg-amber-500" />
                <span className="text-muted-foreground">Stage 3:</span>
                <span className="font-semibold text-foreground">{tooltip.s3.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border mt-1.5 pt-1.5 flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-foreground">{tooltip.total.toLocaleString()}</span>
              <span className={cn("font-semibold", capacityTextColor(tooltip.pct))}>{tooltip.pct}% cap</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Scheduler Panel ── */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowScheduler(false)}
          />
          {/* Panel */}
          <div className="w-[420px] bg-card border-l border-border flex flex-col h-full overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:calendar-add-linear" className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Schedule New Campaign</h2>
                  <p className="text-xs text-muted-foreground">Find earliest available start date</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduler(false)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Icon icon="solar:close-linear" className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 px-5 py-5 space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Campaign Name</label>
                <input
                  type="text"
                  value={schedulerName}
                  onChange={(e) => setSchedulerName(e.target.value)}
                  placeholder="e.g. Q2 Mid-Market Push"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Prospect Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">Prospect Count</label>
                  <span className="text-xs font-bold text-primary">{schedulerProspects.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={schedulerProspects}
                  onChange={(e) => setSchedulerProspects(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>1k</span><span>50k</span>
                </div>
              </div>

              {/* Stages */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Number of Stages</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleStageChange(n)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors",
                        schedulerStages === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days between stages */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Days Between Stages</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSchedulerGap(n)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors",
                        schedulerGap === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage Split */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Stage Split</label>
                <div className="space-y-2">
                  {schedulerSplit.map((pct, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-sm flex-shrink-0",
                        idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-violet-500" : "bg-amber-500"
                      )} />
                      <span className="text-xs text-muted-foreground w-14">Stage {idx + 1}</span>
                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-violet-500" : "bg-amber-500"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Auto-calculated defaults</p>
              </div>

              {/* Capacity Summary */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Projected Sends</label>
                <div className="grid grid-cols-2 gap-2">
                  {schedulerSplit.map((pct, idx) => {
                    const sends = Math.round(schedulerProspects * (pct / 100));
                    const days = Math.ceil(sends / DAILY_CAP);
                    return (
                      <div key={idx} className="bg-muted/40 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground">Stage {idx + 1}</p>
                        <p className="text-sm font-bold text-foreground">{sends.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{days} working day{days !== 1 ? "s" : ""}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Earliest Start */}
              <div className={cn(
                "rounded-xl border p-4",
                showUpgradePrompt
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    showUpgradePrompt ? "bg-amber-500/10" : "bg-emerald-500/10"
                  )}>
                    <Icon
                      icon={showUpgradePrompt ? "solar:danger-triangle-linear" : "solar:check-circle-linear"}
                      className={cn(
                        "h-4 w-4",
                        showUpgradePrompt ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Earliest Start: {earliest.date}
                    </p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      showUpgradePrompt ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {showUpgradePrompt
                        ? `${earliest.week} — capacity tight`
                        : `${earliest.week} — capacity available`}
                    </p>
                  </div>
                </div>

                {showUpgradePrompt && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20">
                    <p className="text-xs text-muted-foreground">
                      Add <span className="font-bold text-amber-600 dark:text-amber-400">{earliest.mailboxesNeeded} mailboxes</span> to
                      launch this campaign next week instead.
                    </p>
                    <button className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                      View upgrade options
                      <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-4 flex gap-3">
              <button
                onClick={() => setShowScheduler(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!schedulerName.trim()}
                className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold transition-colors"
              >
                Lock Capacity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
