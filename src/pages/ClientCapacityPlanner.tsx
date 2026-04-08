import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// ─── Math Constants ───────────────────────────────────────────────────────────
const EMAILS_PER_MAILBOX_PER_DAY = 5;
const WORKING_DAYS_PER_MONTH = 20;
const STAGE_GAP_DAYS = 2; // default gap between stage activations (informational)

// Derived:
// daily_capacity   = mailboxes * EMAILS_PER_MAILBOX_PER_DAY
// monthly_capacity = daily_capacity * WORKING_DAYS_PER_MONTH
// weekly_capacity  = daily_capacity * 5

// ─── Stage colors (fixed per stage number) ────────────────────────────────────
const STAGE_COLORS: Record<number, { bg: string; text: string; hex: string }> = {
  1: { bg: "#3b82f620", text: "#3b82f6", hex: "#3b82f6" },   // blue
  2: { bg: "#8b5cf620", text: "#8b5cf6", hex: "#8b5cf6" },   // violet
  3: { bg: "#f59e0b20", text: "#f59e0b", hex: "#f59e0b" },   // amber
};
const FALLBACK_STAGE_COLOR = { bg: "#6b728020", text: "#6b7280", hex: "#6b7280" };

// Campaign dot colors (one per campaign, for the left column indicator)
const CAMPAIGN_DOT_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];

// Capacity utilization colors
function capacityColor(pct: number): { bar: string; text: string } {
  if (pct > 0.9) return { bar: "#ef4444", text: "#ef4444" };
  if (pct >= 0.7) return { bar: "#f59e0b", text: "#f59e0b" };
  return { bar: "#10b981", text: "#10b981" };
}

// ─── Data Model ───────────────────────────────────────────────────────────────
interface CampaignStage {
  stageNumber: number;
  leadsTotal: number;
  leadsSent: number;
  priorityRatio: number;
  startedDaysAgo: number;
}

interface ClientCampaign {
  id: string;
  name: string;
  stages: CampaignStage[];
  status: "Active" | "Completing" | "Paused";
}

interface ClientData {
  id: string;
  clientName: string;
  tool: "Smartlead" | "Instantly";
  mailboxes: number;
  monthlyContractedEmails: number;
  totalEmailsSentThisMonth: number;
  campaigns: ClientCampaign[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
// TODO: Replace with API — pull from SmartLead/Instantly APIs per client
const MOCK_CLIENT_DATA: Record<string, ClientData> = {
  "5": {
    id: "5",
    clientName: "Akila Cloud",
    tool: "Instantly",
    mailboxes: 400,
    monthlyContractedEmails: 40000,
    totalEmailsSentThisMonth: 12000,
    campaigns: [
      {
        id: "c1",
        name: "Cloud Reseller Outreach",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 14500, leadsSent: 8200, priorityRatio: 0.6, startedDaysAgo: 6 },
          { stageNumber: 2, leadsTotal: 8200, leadsSent: 1400, priorityRatio: 0.4, startedDaysAgo: 4 },
        ],
      },
      {
        id: "c2",
        name: "Competitor Takeout — Parla",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 5000, leadsSent: 1800, priorityRatio: 1.0, startedDaysAgo: 2 },
        ],
      },
    ],
  },
  "1": {
    id: "1",
    clientName: "Design Pro",
    tool: "Instantly",
    mailboxes: 80,
    monthlyContractedEmails: 8000,
    totalEmailsSentThisMonth: 1200,
    campaigns: [
      {
        id: "c3",
        name: "Enterprise ABM Q2",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 3200, leadsSent: 600, priorityRatio: 0.6, startedDaysAgo: 3 },
          { stageNumber: 2, leadsTotal: 600, leadsSent: 0, priorityRatio: 0.4, startedDaysAgo: 0 },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    clientName: "Traction Labs",
    tool: "Smartlead",
    mailboxes: 100,
    monthlyContractedEmails: 10000,
    totalEmailsSentThisMonth: 4200,
    campaigns: [
      {
        id: "c4",
        name: "SaaS Founder Cold Outreach",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 4800, leadsSent: 3200, priorityRatio: 0.6, startedDaysAgo: 8 },
          { stageNumber: 2, leadsTotal: 3200, leadsSent: 1000, priorityRatio: 0.4, startedDaysAgo: 6 },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    clientName: "Maverick",
    tool: "Instantly",
    mailboxes: 150,
    monthlyContractedEmails: 15000,
    totalEmailsSentThisMonth: 6000,
    campaigns: [
      {
        id: "c5",
        name: "Biotech Pharma Nurture",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 5000, leadsSent: 3500, priorityRatio: 1.0, startedDaysAgo: 5 },
        ],
      },
      {
        id: "c6",
        name: "Food Production Re-run",
        status: "Active",
        stages: [
          { stageNumber: 1, leadsTotal: 3500, leadsSent: 500, priorityRatio: 0.6, startedDaysAgo: 1 },
          { stageNumber: 2, leadsTotal: 500, leadsSent: 0, priorityRatio: 0.4, startedDaysAgo: 0 },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    clientName: "Single Grain",
    tool: "Smartlead",
    mailboxes: 200,
    monthlyContractedEmails: 20000,
    totalEmailsSentThisMonth: 18400,
    campaigns: [
      {
        id: "c7",
        name: "Q2 Personalization Test",
        status: "Completing",
        stages: [
          { stageNumber: 1, leadsTotal: 6000, leadsSent: 5800, priorityRatio: 0.6, startedDaysAgo: 12 },
          { stageNumber: 2, leadsTotal: 5800, leadsSent: 4200, priorityRatio: 0.4, startedDaysAgo: 10 },
          { stageNumber: 3, leadsTotal: 4200, leadsSent: 3000, priorityRatio: 0.2, startedDaysAgo: 8 },
        ],
      },
    ],
  },
  "6": {
    id: "6",
    clientName: "Nexla",
    tool: "Smartlead",
    mailboxes: 1100,
    monthlyContractedEmails: 110000,
    totalEmailsSentThisMonth: 88000,
    campaigns: [],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString();
const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(Math.round(n));

function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const dow = date.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface CalDay {
  date: Date;
  dayLabel: string;    // "Mon"
  dateNum: number;     // 3
  monthLabel: string;  // "Apr"
  isPast: boolean;
  isToday: boolean;
}

// ─── Projection types ─────────────────────────────────────────────────────────
interface DayStageSends {
  stageNumber: number;
  sends: number;
}

interface DayCampaignSends {
  campaignId: string;
  campaignName: string;
  stages: DayStageSends[];
  total: number;
}

interface CalDayData extends CalDay {
  campaigns: DayCampaignSends[];
  totalSends: number;
  capacityPct: number;
}

// Campaign-to-client mapping (for /campaigns/:id/calendar route)
const CAMPAIGN_TO_CLIENT: Record<string, string> = {
  "1": "2", // Q1 SaaS Outreach → Traction Labs
  "2": "3", // Healthcare Lead Nurture → Maverick
  "3": "1", // Event Follow-up → Design Pro
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientCapacityPlanner() {
  const { clientId: clientIdParam, id: campaignId } = useParams<{ clientId?: string; id?: string }>();
  const clientId = clientIdParam ?? (campaignId ? CAMPAIGN_TO_CLIENT[campaignId] : undefined);
  const navigate = useNavigate();
  const [_expandedCampaignIds, _setExpanded] = useState<string[]>([]);

  const clientData = clientId ? MOCK_CLIENT_DATA[clientId] : undefined;

  const computed = useMemo(() => {
    if (!clientData) return null;

    const today = new Date(2026, 3, 2); // Apr 2, 2026
    today.setHours(0, 0, 0, 0);
    const dailyCapacity = clientData.mailboxes * EMAILS_PER_MAILBOX_PER_DAY;
    const monthlyCapacity = dailyCapacity * WORKING_DAYS_PER_MONTH;
    const weeklyCapacity = dailyCapacity * 5;

    // Build 20 working days (4 weeks × 5 days) starting from Monday of current week
    const monday = getMondayOfWeek(today);
    const weeks: { label: string; days: CalDay[] }[] = [];
    const allDays: CalDay[] = [];
    let cur = new Date(monday);
    for (let w = 0; w < 4; w++) {
      const days: CalDay[] = [];
      for (let d = 0; d < 5; d++) {
        const dayDate = new Date(cur);
        const calDay: CalDay = {
          date: dayDate,
          dayLabel: DAY_LABELS[dayDate.getDay()],
          dateNum: dayDate.getDate(),
          monthLabel: MONTH_LABELS[dayDate.getMonth()],
          isPast: dayDate < today,
          isToday: dayDate.getTime() === today.getTime(),
        };
        days.push(calDay);
        allDays.push(calDay);
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push({ label: `Week ${w + 1}`, days });
    }

    // Initialise per-stage mutable remaining buckets
    type StageState = {
      campaignId: string;
      campaignName: string;
      stageNumber: number;
      remaining: number;
      dailyAlloc: number;
    };

    const stageStates: StageState[] = clientData.campaigns.flatMap((c) =>
      c.stages.map((s) => ({
        campaignId: c.id,
        campaignName: c.name,
        stageNumber: s.stageNumber,
        remaining: Math.max(0, s.leadsTotal - s.leadsSent),
        dailyAlloc: dailyCapacity * s.priorityRatio,
      }))
    );

    // Simulate day by day for all 20 days
    const calDayData: CalDayData[] = allDays.map((calDay) => {
      // Past days: show 0 sends (greyed out)
      if (calDay.isPast) {
        return {
          ...calDay,
          campaigns: clientData.campaigns.map((c) => ({
            campaignId: c.id,
            campaignName: c.name,
            stages: [],
            total: 0,
          })),
          totalSends: 0,
          capacityPct: 0,
        };
      }

      // Today & future: simulate sends
      const campaignMap: Record<string, DayCampaignSends> = {};
      for (const c of clientData.campaigns) {
        campaignMap[c.id] = { campaignId: c.id, campaignName: c.name, stages: [], total: 0 };
      }

      for (const ss of stageStates) {
        if (ss.remaining <= 0) continue;
        const sent = Math.min(ss.remaining, ss.dailyAlloc);
        ss.remaining -= sent;
        if (sent > 0 && campaignMap[ss.campaignId]) {
          campaignMap[ss.campaignId].stages.push({ stageNumber: ss.stageNumber, sends: Math.round(sent) });
          campaignMap[ss.campaignId].total += Math.round(sent);
        }
      }

      const campaigns = Object.values(campaignMap);
      const totalSends = campaigns.reduce((s, c) => s + c.total, 0);
      const cappedTotal = Math.min(totalSends, dailyCapacity);

      return {
        ...calDay,
        campaigns,
        totalSends: cappedTotal,
        capacityPct: dailyCapacity > 0 ? cappedTotal / dailyCapacity : 0,
      };
    });

    // Map days back to weeks
    const weeksWithData = weeks.map((w, wi) => ({
      ...w,
      days: w.days.map((_, di) => calDayData[wi * 5 + di]),
    }));

    // Stat computations
    const week1Days = weeksWithData[0]?.days ?? [];
    const thisWeekSends = week1Days.reduce((s, d) => s + d.totalSends, 0);
    const sendsRemaining = Math.max(0, weeklyCapacity - thisWeekSends);
    const activeCampaignCount = clientData.campaigns.filter((c) =>
      c.stages.some((s) => s.leadsTotal - s.leadsSent > 0)
    ).length;

    // Next available window = first future day where capacity pct < 0.2 (>80% free)
    const nextAvailDay = calDayData.find(
      (d) => !d.isPast && !d.isToday && d.capacityPct < 0.2
    );
    const nextAvailLabel = nextAvailDay
      ? `${nextAvailDay.monthLabel} ${nextAvailDay.dateNum}`
      : "Now";

    const utilizationPct = clientData.totalEmailsSentThisMonth / monthlyCapacity;

    // Total remaining across all campaigns
    const totalRemaining = clientData.campaigns.reduce(
      (s, c) => s + c.stages.reduce((ss, st) => ss + Math.max(0, st.leadsTotal - st.leadsSent), 0),
      0
    );

    return {
      dailyCapacity,
      monthlyCapacity,
      weeklyCapacity,
      utilizationPct,
      thisWeekSends,
      sendsRemaining,
      activeCampaignCount,
      nextAvailLabel,
      nextAvailDay,
      totalRemaining,
      weeksWithData,
      allDays: calDayData,
    };
  }, [clientData]);

  // ─── Not found ────────────────────────────────────────────────────────────
  if (!clientData || !computed) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6">
        <Icon icon="solar:user-cross-linear" className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Client not found</h2>
          <p className="text-sm text-muted-foreground mt-1">No client with ID "{clientId}".</p>
        </div>
        <button onClick={() => navigate("/admin-capacity")} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
          Back to Capacity Planner
        </button>
      </div>
    );
  }

  const {
    dailyCapacity,
    weeklyCapacity,
    utilizationPct,
    thisWeekSends,
    sendsRemaining,
    activeCampaignCount,
    nextAvailLabel,
    weeksWithData,
  } = computed;

  const thisWeekPct = weeklyCapacity > 0 ? thisWeekSends / weeklyCapacity : 0;

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Top Header ── */}
      <div className="border-b px-6 py-4 bg-card">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon icon="solar:calendar-linear" className="h-5 w-5 text-primary" />
            </div>
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                <button onClick={() => navigate("/admin-capacity")} className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Icon icon="solar:arrow-left-linear" className="h-3 w-3" />
                  Capacity Planner
                </button>
                <Icon icon="solar:alt-arrow-right-linear" className="h-3 w-3" />
                <span className="text-foreground">{clientData.clientName}</span>
              </div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Campaign Calendar</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                4-week capacity view · {fmt(clientData.mailboxes)} mailboxes · {fmt(dailyCapacity)} sends/day
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
            Schedule Campaign
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 py-5 space-y-5 flex-1">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* This Week Sends Used */}
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">This Week — Sends Used</p>
            <p className="text-3xl font-bold text-foreground">{fmt(thisWeekSends)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: thisWeekPct > 0.9 ? "#ef4444" : thisWeekPct >= 0.7 ? "#f59e0b" : "#10b981"
              }} />
              <span className="text-xs" style={{
                color: thisWeekPct > 0.9 ? "#ef4444" : thisWeekPct >= 0.7 ? "#f59e0b" : "#10b981"
              }}>
                {Math.round(thisWeekPct * 100)}% utilised
              </span>
            </div>
          </div>

          {/* Sends Remaining */}
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Sends Remaining</p>
            <p className="text-3xl font-bold" style={{ color: "#10b981" }}>{fmt(sendsRemaining)}</p>
            <p className="text-xs text-muted-foreground mt-1">of {fmt(weeklyCapacity)} weekly cap</p>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Active Campaigns</p>
            <p className="text-3xl font-bold text-foreground">{activeCampaignCount}</p>
            <p className="text-xs text-muted-foreground mt-1">across 4 weeks</p>
          </div>

          {/* Next Available Window */}
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Next Available Window</p>
            <p className="text-3xl font-bold text-foreground">{nextAvailLabel}</p>
            <p className="text-xs text-muted-foreground mt-1">&gt;20% daily capacity free</p>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: STAGE_COLORS[1].hex }} />
            Stage 1
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: STAGE_COLORS[2].hex }} />
            Stage 2
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: STAGE_COLORS[3].hex }} />
            Stage 3
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            &lt;70% cap
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500" />
            70–90%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            &gt;90%
          </div>
        </div>

        {/* ── Calendar Grid ── */}
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
            {/* Week header row */}
            <thead>
              <tr className="border-b">
                {/* Campaign column header */}
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground border-r w-48 min-w-[180px]">
                  Campaign
                </th>
                {weeksWithData.map((week, wi) => (
                  <th
                    key={wi}
                    colSpan={5}
                    className={cn(
                      "text-center py-3 text-sm font-bold text-foreground",
                      wi < weeksWithData.length - 1 && "border-r"
                    )}
                  >
                    {week.label}
                  </th>
                ))}
              </tr>

              {/* Day/date sub-header row */}
              <tr className="border-b bg-muted/20">
                <th className="border-r" />
                {weeksWithData.map((week, wi) =>
                  week.days.map((day, di) => (
                    <th
                      key={`${wi}-${di}`}
                      className={cn(
                        "text-center py-2 min-w-[64px]",
                        di === 4 && wi < weeksWithData.length - 1 && "border-r"
                      )}
                    >
                      <p className="text-[10px] text-muted-foreground font-medium">{day.dayLabel}</p>
                      <p className={cn(
                        "text-sm font-bold mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto",
                        day.isToday
                          ? "bg-primary text-primary-foreground"
                          : day.isPast
                          ? "text-muted-foreground/40"
                          : "text-foreground"
                      )}>
                        {day.dateNum}
                      </p>
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {/* Campaign rows */}
              {clientData.campaigns.map((campaign, ci) => (
                <tr key={campaign.id} className="border-b hover:bg-muted/10 transition-colors">
                  {/* Campaign name cell */}
                  <td className="px-4 py-3 border-r">
                    <div className="flex items-start gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: CAMPAIGN_DOT_COLORS[ci % CAMPAIGN_DOT_COLORS.length] }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                          {campaign.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {fmt(campaign.stages.reduce((s, st) => s + st.leadsTotal, 0))} prospects · {campaign.stages.length} stage{campaign.stages.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Day cells */}
                  {weeksWithData.map((week, wi) =>
                    week.days.map((day, di) => {
                      const campaignDay = day.campaigns.find((c) => c.campaignId === campaign.id);
                      const hasSends = campaignDay && campaignDay.stages.length > 0;
                      return (
                        <td
                          key={`${wi}-${di}`}
                          className={cn(
                            "px-1 py-2 text-center align-middle",
                            di === 4 && wi < weeksWithData.length - 1 && "border-r"
                          )}
                        >
                          {day.isPast ? (
                            <div className="flex items-center justify-center h-8">
                              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                            </div>
                          ) : hasSends ? (
                            <div className="flex flex-col gap-0.5">
                              {campaignDay!.stages.map((stageSend) => {
                                const sc = STAGE_COLORS[stageSend.stageNumber] ?? FALLBACK_STAGE_COLOR;
                                return (
                                  <div
                                    key={stageSend.stageNumber}
                                    className="rounded-md px-1.5 py-1 text-center"
                                    style={{ backgroundColor: sc.bg, border: `1px solid ${sc.hex}30` }}
                                  >
                                    <span className="text-[11px] font-semibold" style={{ color: sc.text }}>
                                      {fmtK(stageSend.sends)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-8">
                              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}

              {/* Empty state if no campaigns */}
              {clientData.campaigns.length === 0 && (
                <tr className="border-b">
                  <td colSpan={21} className="text-center py-10 text-sm text-muted-foreground italic">
                    No active campaigns. Full capacity of {fmt(dailyCapacity)} emails/day available.
                  </td>
                </tr>
              )}

              {/* ── Daily Capacity Row ── */}
              <tr className="bg-muted/20">
                <td className="px-4 py-3 border-r">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Daily Capacity</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{fmtK(dailyCapacity)} max</p>
                </td>
                {weeksWithData.map((week, wi) =>
                  week.days.map((day, di) => {
                    const pct = day.capacityPct;
                    const col = capacityColor(pct);
                    const isPast = day.isPast;
                    return (
                      <td
                        key={`cap-${wi}-${di}`}
                        className={cn(
                          "px-1 py-2 text-center",
                          di === 4 && wi < weeksWithData.length - 1 && "border-r"
                        )}
                      >
                        {isPast || pct === 0 ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <p className="text-[10px] font-semibold text-muted-foreground/40">0%</p>
                            <div className="w-full h-1.5 rounded-full bg-muted/30" />
                            <p className="text-[10px] text-muted-foreground/30">0</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-0.5">
                            <p className="text-[10px] font-bold" style={{ color: col.text }}>
                              {Math.round(pct * 100)}%
                            </p>
                            <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(pct * 100, 100)}%`,
                                  backgroundColor: col.bar,
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground">{fmtK(day.totalSends)}</p>
                          </div>
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Utilization footer note ── */}
        <p className="text-[11px] text-muted-foreground italic pb-2">
          Projection assumes current stage priority ratios unchanged. Past days show no activity as simulation runs from today forward.
          Utilization this month: {(utilizationPct * 100).toFixed(1)}% ({fmt(clientData.totalEmailsSentThisMonth)} of {fmt(computed.monthlyCapacity)} emails sent).
        </p>
      </div>
    </div>
  );
}
