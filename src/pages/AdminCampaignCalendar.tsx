// TODO: add admin auth
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stage {
  stage: number;
  startDay: number;
  durationDays: number;
}

interface Campaign {
  id: string;
  name: string;
  stages: Stage[];
}

interface Customer {
  id: string;
  name: string;
  mailboxes: number;
  weeklyCapacity: number;
  sendsUsed: number;
  responseRate: number;
  campaigns: Campaign[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockCustomers: Customer[] = [
  {
    id: "single-grain",
    name: "Single Grain",
    mailboxes: 1000,
    weeklyCapacity: 25000,
    sendsUsed: 18500,
    responseRate: 8.2,
    campaigns: [
      {
        id: "sg-1",
        name: "Q2 Personalization Test",
        stages: [
          { stage: 1, startDay: 0, durationDays: 5 },
          { stage: 2, startDay: 5, durationDays: 4 },
        ],
      },
      {
        id: "sg-2",
        name: "Monetary Offer Push",
        stages: [
          { stage: 1, startDay: 2, durationDays: 7 },
          { stage: 2, startDay: 9, durationDays: 3 },
          { stage: 3, startDay: 12, durationDays: 2 },
        ],
      },
    ],
  },
  {
    id: "akila-cloud",
    name: "Akila Cloud",
    mailboxes: 500,
    weeklyCapacity: 12500,
    sendsUsed: 4800,
    responseRate: 5.1,
    campaigns: [
      {
        id: "ac-1",
        name: "Enterprise Outreach Wave 1",
        stages: [
          { stage: 1, startDay: 1, durationDays: 6 },
          { stage: 2, startDay: 7, durationDays: 5 },
        ],
      },
    ],
  },
  {
    id: "maverick",
    name: "Maverick",
    mailboxes: 800,
    weeklyCapacity: 20000,
    sendsUsed: 19200,
    responseRate: 11.4,
    campaigns: [
      {
        id: "mv-1",
        name: "Competitor Displacement",
        stages: [
          { stage: 1, startDay: 0, durationDays: 4 },
          { stage: 2, startDay: 4, durationDays: 4 },
          { stage: 3, startDay: 8, durationDays: 3 },
          { stage: 4, startDay: 11, durationDays: 3 },
        ],
      },
      {
        id: "mv-2",
        name: "Event Follow-up - SaaStr",
        stages: [
          { stage: 1, startDay: 3, durationDays: 5 },
          { stage: 2, startDay: 8, durationDays: 4 },
        ],
      },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_DAYS = 14;

// ─── Computed stats ───────────────────────────────────────────────────────────
const totalMailboxes = mockCustomers.reduce((s, c) => s + c.mailboxes, 0);
const totalSendsUsed = mockCustomers.reduce((s, c) => s + c.sendsUsed, 0);
const totalCapacity = mockCustomers.reduce((s, c) => s + c.weeklyCapacity, 0);
const sendsRemaining = totalCapacity - totalSendsUsed;
const avgResponseRate = (
  mockCustomers.reduce((s, c) => s + c.responseRate, 0) / mockCustomers.length
).toFixed(1);
const utilizationPct = Math.round((totalSendsUsed / totalCapacity) * 100);

// ─── Stage colour helpers ─────────────────────────────────────────────────────
const stageMeta: Record<number, { bg: string; label: string }> = {
  1: { bg: "bg-blue-500", label: "Stage 1" },
  2: { bg: "bg-emerald-500", label: "Stage 2" },
  3: { bg: "bg-amber-500", label: "Stage 3" },
  4: { bg: "bg-violet-400", label: "Stage 4+" },
};

function getStageBg(stage: number) {
  return stageMeta[Math.min(stage, 4)]?.bg ?? "bg-violet-400";
}

/** For a given campaign and day index, return the active stage or null */
function getActiveStage(campaign: Campaign, dayIndex: number): Stage | null {
  for (const s of campaign.stages) {
    if (dayIndex >= s.startDay && dayIndex < s.startDay + s.durationDays) return s;
  }
  return null;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
const today = new Date(2026, 2, 31); // March 31, 2026

function dayDate(offset: number) {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d;
}

const dayHeaders = Array.from({ length: TOTAL_DAYS }, (_, i) => {
  const d = dayDate(i);
  return {
    dow: d.toLocaleDateString("en-US", { weekday: "short" }),
    dateNum: d.getDate(),
    isToday: i === 0,
  };
});

const week1Label = `Week of ${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
const week2Label = `Week of ${dayDate(7).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
const formattedDate = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminCampaignCalendar() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const displayedCustomers = selectedCustomerId
    ? mockCustomers.filter((c) => c.id === selectedCustomerId)
    : mockCustomers;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:calendar-linear" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">Campaign Operations</h1>
                <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0">
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {mockCustomers.length} customers · {totalMailboxes.toLocaleString()} mailboxes · 2-week view
              </p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">{formattedDate}</span>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
        {/* ── Summary Tiles ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Total Mailboxes</p>
                  <p className="text-2xl font-bold text-foreground">{totalMailboxes.toLocaleString()}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/20">
                  <Icon icon="solar:server-linear" className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Sends Used This Week</p>
                  <p className="text-2xl font-bold text-foreground">{totalSendsUsed.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {utilizationPct}% of capacity
                    </span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/20">
                  <Icon icon="solar:letter-linear" className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Sends Remaining</p>
                  <p className="text-2xl font-bold text-foreground">{sendsRemaining.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">of {totalCapacity.toLocaleString()} weekly cap</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-500/20">
                  <Icon icon="solar:inbox-linear" className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Avg Response Rate</p>
                  <p className="text-2xl font-bold text-foreground">{avgResponseRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Across active campaigns</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/20">
                  <Icon icon="solar:chart-2-linear" className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-5">
          {Object.entries(stageMeta).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", val.bg)} />
              <span className="text-xs text-muted-foreground">{val.label}</span>
            </div>
          ))}
        </div>

        {/* ── Customer List + Gantt Grid ── */}
        <div className="flex gap-5 items-start">
          {/* Left — Customer sidebar */}
          <div className="w-[250px] flex-shrink-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Customers
                </p>
              </div>
              {mockCustomers.map((customer, ci) => {
                const isHighUtil = customer.sendsUsed / customer.weeklyCapacity > 0.9;
                const isIdle = customer.campaigns.length === 0;
                const isSelected = selectedCustomerId === customer.id;
                const utilPct = Math.round((customer.sendsUsed / customer.weeklyCapacity) * 100);

                return (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(isSelected ? null : customer.id)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                      ci < mockCustomers.length - 1 && "border-b border-border/50",
                      isSelected
                        ? "bg-primary/8 border-r-2 border-r-primary"
                        : "hover:bg-muted/40"
                    )}
                  >
                    {/* Customer avatar/indicator */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold",
                      isSelected
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/60 text-muted-foreground"
                    )}>
                      {customer.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={cn(
                          "text-sm font-semibold truncate",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {customer.name}
                        </p>
                        {isHighUtil && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" title="High utilization" />
                        )}
                        {isIdle && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Idle" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">
                          {customer.mailboxes.toLocaleString()} MBs
                        </span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className={cn(
                          "text-[11px] font-medium",
                          isHighUtil
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                        )}>
                          {utilPct}% used
                        </span>
                      </div>
                    </div>

                    <Icon
                      icon="solar:arrow-right-linear"
                      className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("View details for customer:", customer.id);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Gantt table */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full border-collapse" style={{ minWidth: 800 }}>
                <thead>
                  {/* Week labels row */}
                  <tr className="border-b border-border">
                    <th className="w-44 px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground bg-muted/30 border-r border-border" />
                    <th
                      colSpan={7}
                      className="px-2 py-2.5 text-center text-xs font-semibold text-foreground bg-muted/30 border-r border-border"
                    >
                      {week1Label}
                    </th>
                    <th
                      colSpan={7}
                      className="px-2 py-2.5 text-center text-xs font-semibold text-foreground bg-muted/30"
                    >
                      {week2Label}
                    </th>
                  </tr>

                  {/* Day headers row */}
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-[10px] text-muted-foreground bg-muted/20 border-r border-border">
                      Campaign
                    </th>
                    {dayHeaders.map((d, i) => {
                      const isWeekBoundary = i === 7;
                      return (
                        <th
                          key={i}
                          className={cn(
                            "px-1 py-2 text-center bg-muted/20",
                            isWeekBoundary && "border-l-2 border-l-border"
                          )}
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] text-muted-foreground font-medium">{d.dow}</span>
                            <span
                              className={cn(
                                "text-[11px] font-semibold rounded px-1",
                                d.isToday
                                  ? "bg-primary text-primary-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {d.dateNum}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {displayedCustomers.map((customer) => (
                    <>
                      {/* Customer section header (only when showing all) */}
                      {!selectedCustomerId && (
                        <tr key={`header-${customer.id}`} className="bg-muted/15">
                          <td
                            colSpan={TOTAL_DAYS + 1}
                            className="px-4 py-2 border-b border-border/50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {customer.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                — {customer.campaigns.length} campaign{customer.campaigns.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Campaign rows */}
                      {customer.campaigns.map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                        >
                          {/* Campaign name cell */}
                          <td className="px-4 py-2.5 border-r border-border">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                getStageBg(campaign.stages[0]?.stage ?? 1)
                              )} />
                              <p className="text-xs font-semibold text-foreground truncate max-w-[140px]" title={campaign.name}>
                                {campaign.name}
                              </p>
                            </div>
                          </td>

                          {/* Day cells — Gantt bars */}
                          {Array.from({ length: TOTAL_DAYS }, (_, dayIdx) => {
                            const activeStage = getActiveStage(campaign, dayIdx);
                            const isWeekBoundary = dayIdx === 7;

                            if (!activeStage) {
                              return (
                                <td
                                  key={dayIdx}
                                  className={cn(
                                    "px-0 py-2 text-center",
                                    isWeekBoundary && "border-l-2 border-l-border/60"
                                  )}
                                >
                                  <div className="h-7 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-border/60" />
                                  </div>
                                </td>
                              );
                            }

                            const isFirst = dayIdx === activeStage.startDay;
                            const isLast = dayIdx === activeStage.startDay + activeStage.durationDays - 1;
                            const isMid = Math.floor(activeStage.startDay + activeStage.durationDays / 2) === dayIdx;
                            const stageNum = Math.min(activeStage.stage, 4);

                            return (
                              <td
                                key={dayIdx}
                                className={cn(
                                  "px-0 py-2",
                                  isWeekBoundary && "border-l-2 border-l-border/60"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-7 flex items-center justify-center",
                                    getStageBg(activeStage.stage),
                                    "opacity-90",
                                    isFirst && "rounded-l-md ml-0.5",
                                    isLast && "rounded-r-md mr-0.5",
                                    !isFirst && !isLast && "mx-0"
                                  )}
                                >
                                  {isMid && activeStage.durationDays >= 2 && (
                                    <span className="text-[9px] font-semibold text-white/90 truncate px-0.5 leading-none">
                                      S{stageNum}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
