import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Math Constants ───────────────────────────────────────────────────────────
const EMAILS_PER_MAILBOX_PER_DAY = 5;
const WORKING_DAYS_PER_MONTH = 20;

// Derived:
// monthly_capacity  = mailboxes * EMAILS_PER_MAILBOX_PER_DAY * WORKING_DAYS_PER_MONTH
// daily_capacity    = mailboxes * EMAILS_PER_MAILBOX_PER_DAY
// utilization_pct   = emails_sent_this_month / monthly_capacity
// days_to_next_slot = Math.ceil(emails_remaining / daily_capacity), or 0

// ─── Data Model ───────────────────────────────────────────────────────────────
interface Campaign {
  name: string;
  leads: number;     // unique leads in the campaign
  sent: number;      // total emails sent across all stages so far
  stages: number;    // number of stages (touch points per lead)
}
// Derived per campaign:
//   toBeReached = leads × stages
//   remaining   = max(0, toBeReached - sent)
//   pctReached  = sent / toBeReached

interface ClientCapacity {
  id: string;
  clientName: string;
  tool: "Smartlead" | "Instantly";
  mailboxes: number;           // FIXED — comes from contract/tool setup
  emailsSentThisMonth: number; // actual MTD sends (from tool API)
  lastWeekSends: number;       // emails sent in the previous Mon–Fri week
  campaigns: Campaign[];
  staleList: string;
  staleListDays: number;
}

// TODO: Replace with API call — Ashok to provide client mailbox counts per client
const MOCK_CLIENTS: ClientCapacity[] = [
  {
    id: "1",
    clientName: "Design Pro",
    tool: "Instantly",
    mailboxes: 80,
    emailsSentThisMonth: 1200,
    lastWeekSends: 800,
    campaigns: [
      { name: "Cold Outreach Q2",     leads: 1800, sent: 600,  stages: 2 },
      { name: "Enterprise ABM",        leads: 3200, sent: 600,  stages: 3 },
    ],
    staleList: "Cold Outreach Q2",
    staleListDays: 11,
  },
  {
    id: "2",
    clientName: "Traction Labs",
    tool: "Smartlead",
    mailboxes: 100,
    emailsSentThisMonth: 2800,
    lastWeekSends: 1800,
    campaigns: [
      { name: "SaaS Founder Outreach", leads: 4800, sent: 3200, stages: 2 },
      { name: "Competitor Takeout",    leads: 2200, sent: 1000, stages: 2 },
      { name: "Mid-Market Re-engage",  leads: 1500, sent: 0,    stages: 1 },
    ],
    staleList: "Competitor Takeout",
    staleListDays: 7,
  },
  {
    id: "3",
    clientName: "Maverick",
    tool: "Instantly",
    mailboxes: 150,
    emailsSentThisMonth: 4500,
    lastWeekSends: 3200,
    campaigns: [
      { name: "Biotech Pharma Nurture",  leads: 5000, sent: 3500, stages: 2 },
      { name: "Enterprise Expansion",    leads: 3000, sent: 500,  stages: 3 },
    ],
    staleList: "Enterprise Expansion",
    staleListDays: 9,
  },
  {
    id: "4",
    clientName: "Single Grain",
    tool: "Smartlead",
    mailboxes: 1200,
    emailsSentThisMonth: 90000,
    lastWeekSends: 28500,
    campaigns: [
      { name: "MO",  leads: 3026, sent: 6005, stages: 2 },
      { name: "NMO", leads: 2652, sent: 5187, stages: 2 },
      { name: "C3",  leads: 3409, sent: 2194, stages: 2 },
      { name: "C4",  leads: 4030, sent: 2767, stages: 2 },
    ],
    staleList: "Mid-Market Re-engage",
    staleListDays: 14,
  },
  {
    id: "5",
    clientName: "Akila Cloud",
    tool: "Instantly",
    mailboxes: 400,
    emailsSentThisMonth: 12000,
    lastWeekSends: 7200,
    campaigns: [
      { name: "Cloud Reseller Outreach",    leads: 14500, sent: 8200, stages: 2 },
      { name: "Competitor Takeout — Parla", leads: 5000,  sent: 1800, stages: 1 },
      { name: "APAC Outreach",              leads: 3000,  sent: 0,    stages: 2 },
    ],
    staleList: "APAC Outreach",
    staleListDays: 6,
  },
  {
    id: "6",
    clientName: "Nexla",
    tool: "Smartlead",
    mailboxes: 1100,
    emailsSentThisMonth: 82500,
    lastWeekSends: 26400,
    campaigns: [],
    staleList: "Partner Referral Seq.",
    staleListDays: 3,
  },
];

// ─── Derived Computations ─────────────────────────────────────────────────────
function computeClient(c: ClientCapacity) {
  const monthlyCapacity = c.mailboxes * EMAILS_PER_MAILBOX_PER_DAY * WORKING_DAYS_PER_MONTH;
  const dailyCapacity = c.mailboxes * EMAILS_PER_MAILBOX_PER_DAY;
  const utilizationPct = c.emailsSentThisMonth / monthlyCapacity;

  // Per-campaign derived fields
  const computedCampaigns = c.campaigns.map((camp) => {
    const toBeReached = camp.leads * camp.stages;
    const remaining = Math.max(0, toBeReached - camp.sent);
    const pctReached = toBeReached > 0 ? camp.sent / toBeReached : 0;
    return { ...camp, toBeReached, remaining, pctReached };
  });

  // Total remaining emails across all campaigns
  const emailsRemainingAcrossCampaigns = computedCampaigns.reduce((sum, camp) => sum + camp.remaining, 0);
  const activeCampaigns = computedCampaigns.filter((camp) => camp.remaining > 0).length;

  // Free capacity = what's left after committed sends are accounted for
  const freeCapacity = monthlyCapacity - c.emailsSentThisMonth - emailsRemainingAcrossCampaigns;
  const daysToNextSlot = freeCapacity >= 0 ? 0 : Math.ceil(-freeCapacity / dailyCapacity);

  // Days to burn through all remaining emails at current daily capacity
  const projectedDaysToExhaust =
    emailsRemainingAcrossCampaigns <= 0
      ? 0
      : Math.ceil(emailsRemainingAcrossCampaigns / dailyCapacity);

  // Dynamic today — always reflects the real current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count working days (Mon–Fri) elapsed from the 1st of the current month up to (and including) today
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  let workingDaysElapsed = 0;
  for (let d = new Date(monthStart); d <= today; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) workingDaysElapsed++;
  }
  const dailyPaceActual = workingDaysElapsed > 0
    ? Math.round(c.emailsSentThisMonth / workingDaysElapsed)
    : 0;

  // Next <40% capacity window
  let nextSubFortyWindow: string;
  if (utilizationPct < 0.4) {
    nextSubFortyWindow = "Open now";
  } else {
    const nextMonthFirst = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    nextSubFortyWindow = nextMonthFirst.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Projected exhaust date: today + projectedDaysToExhaust calendar days (skipping weekends)
  let projectedExhaustDate = "";
  if (projectedDaysToExhaust > 0) {
    let remaining = projectedDaysToExhaust;
    const cursor = new Date(today);
    while (remaining > 0) {
      cursor.setDate(cursor.getDate() + 1);
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) remaining--;
    }
    projectedExhaustDate = cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return {
    ...c,
    monthlyCapacity,
    dailyCapacity,
    utilizationPct,
    emailsRemainingAcrossCampaigns,
    activeCampaigns,
    computedCampaigns,
    daysToNextSlot,
    projectedDaysToExhaust,
    projectedExhaustDate,
    nextSubFortyWindow,
    dailyPaceActual,
  };
}

type ComputedClient = ReturnType<typeof computeClient>;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString();

function utilizationBarColor(pct: number) {
  if (pct >= 0.8) return "bg-emerald-500";
  if (pct >= 0.5) return "bg-blue-500";
  return "bg-amber-500";
}

function utilizationTextColor(pct: number) {
  if (pct >= 0.8) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 0.5) return "text-blue-600 dark:text-blue-400";
  return "text-amber-600 dark:text-amber-400";
}

// ─── Badges ──────────────────────────────────────────────────────────────────
function StatusBadge({ client }: { client: ComputedClient }) {
  if (client.emailsRemainingAcrossCampaigns === 0 && client.utilizationPct >= 0.8) {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
        Available
      </Badge>
    );
  }
  if (client.utilizationPct >= 0.8) {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
        On Track
      </Badge>
    );
  }
  if (client.utilizationPct >= 0.5) {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]">
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
      At Risk
    </Badge>
  );
}

function ToolBadge({ tool }: { tool: "Smartlead" | "Instantly" }) {
  if (tool === "Smartlead") {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]">
        Smartlead
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px]">
      Instantly
    </Badge>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────
function ExpandedRow({ client, colSpan, onViewClient }: { client: ComputedClient; colSpan: number; onViewClient: () => void }) {
  const paceVsCapacity = client.dailyPaceActual / client.dailyCapacity;
  const paceLabel =
    paceVsCapacity >= 0.9
      ? { text: "On pace", cls: "text-emerald-600 dark:text-emerald-400" }
      : paceVsCapacity >= 0.6
      ? { text: "Slightly behind", cls: "text-blue-600 dark:text-blue-400" }
      : { text: "Well below target", cls: "text-amber-600 dark:text-amber-400" };

  const staleSeverity =
    client.staleListDays >= 10
      ? "text-red-500 dark:text-red-400"
      : client.staleListDays >= 7
      ? "text-amber-600 dark:text-amber-400"
      : "text-muted-foreground";

  const Signal = ({ icon, iconCls, label, value, valueCls, sub, subCls }: {
    icon: string; iconCls: string; label: string; value: string;
    valueCls?: string; sub: string; subCls: string;
  }) => (
    <div className="flex items-start gap-2.5">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", iconCls)}>
        <Icon icon={icon} className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className={cn("text-sm font-semibold mt-0.5", valueCls ?? "text-foreground")}>{value}</p>
        <p className={cn("text-[10px] mt-0.5 font-medium", subCls)}>{sub}</p>
      </div>
    </div>
  );

  return (
    <tr className="bg-muted/20 border-b">
      <td colSpan={colSpan} className="px-6 py-4">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          <Signal icon="solar:chart-2-linear" iconCls="text-primary bg-primary/10" label="MTD Sends" value={fmt(client.emailsSentThisMonth)} sub={`${(client.utilizationPct * 100).toFixed(1)}% of monthly cap`} subCls="text-muted-foreground" />
          <Signal icon="solar:calendar-week-linear" iconCls="text-violet-600 dark:text-violet-400 bg-violet-500/10" label="Last Week" value={fmt(client.lastWeekSends)} sub={`of ${fmt(client.dailyCapacity * 5)} weekly cap`} subCls="text-muted-foreground" />
          <Signal icon="solar:graph-up-linear" iconCls="text-blue-600 dark:text-blue-400 bg-blue-500/10" label="Daily Pace" value={`${fmt(client.dailyPaceActual)} / day`} sub={paceLabel.text} subCls={paceLabel.cls} />
          <Signal icon="solar:layers-linear" iconCls="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" label="Active Campaigns" value={String(client.activeCampaigns)} sub="Running now" subCls="text-muted-foreground" />
          <Signal icon="solar:calendar-mark-linear" iconCls="text-primary bg-primary/10" label="Next <40% Window" value={client.nextSubFortyWindow} valueCls={client.nextSubFortyWindow === "Open now" ? "text-emerald-600 dark:text-emerald-400" : undefined} sub={client.nextSubFortyWindow === "Open now" ? "Capacity available" : "Month reset"} subCls="text-muted-foreground" />
          <Signal icon="solar:list-check-minimalistic-linear" iconCls="text-amber-600 dark:text-amber-400 bg-amber-500/10" label="Stale List" value={client.staleList} sub={`No activity in ${client.staleListDays}d`} subCls={staleSeverity} />
          <Signal icon="solar:clock-circle-linear" iconCls="text-violet-600 dark:text-violet-400 bg-violet-500/10" label="Projected Completion" value={client.projectedDaysToExhaust === 0 ? "No remaining" : client.projectedExhaustDate} valueCls={client.projectedDaysToExhaust === 0 ? "text-emerald-600 dark:text-emerald-400" : undefined} sub="At current daily cap" subCls="text-muted-foreground" />
          <div className="flex items-center">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onViewClient}>
              <Icon icon="solar:eye-linear" className="h-3.5 w-3.5" />
              View Client
              <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCapacityPlanner() {
  const navigate = useNavigate();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  const clients: ComputedClient[] = MOCK_CLIENTS.map(computeClient).sort(
    (a, b) => a.utilizationPct - b.utilizationPct
  );

  const belowFifty = clients.filter((c) => c.utilizationPct < 0.5);
  const totalMailboxes = clients.reduce((sum, c) => sum + c.mailboxes, 0);
  const totalDailyCapacity = clients.reduce((sum, c) => sum + c.dailyCapacity, 0);

  const COL_COUNT = 11; // total columns including the chevron column

  const toggleExpand = (id: string) =>
    setExpandedClientId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <section className="px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-foreground">Campaign Capacity Planner</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track mailbox usage and plan next campaign windows across all clients.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5" />
            Last refreshed: Today, 9:41 AM
          </div>
        </div>
      </section>

      {/* Alert Strip */}
      {!alertDismissed && belowFifty.length > 0 && (
        <section className="px-6 max-w-7xl mx-auto mb-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <Icon icon="solar:danger-triangle-linear" className="h-4 w-4 flex-shrink-0" />
              <span>
                <span className="font-semibold">
                  {belowFifty.length} client{belowFifty.length > 1 ? "s are" : " is"} using less than 50%
                </span>{" "}
                of available capacity. Assign campaigns before slots go to waste.
              </span>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="flex-shrink-0 p-1 rounded hover:bg-amber-500/20 transition-colors"
              aria-label="Dismiss alert"
            >
              <Icon icon="solar:close-square-linear" className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            </button>
          </div>
        </section>
      )}

      {/* Summary Stat Cards */}
      <section className="px-6 pb-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Clients</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20">
                  <Icon icon="solar:users-group-two-rounded-linear" className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Mailboxes</p>
                  <p className="text-2xl font-bold text-foreground">{fmt(totalMailboxes)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-500/20">
                  <Icon icon="solar:inbox-linear" className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Daily Capacity</p>
                  <p className="text-2xl font-bold text-foreground">{fmt(totalDailyCapacity)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                  <Icon icon="solar:letter-linear" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "bg-gradient-to-br",
              belowFifty.length > 0
                ? "from-amber-500/10 to-amber-500/5 border-amber-500/30"
                : "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20"
            )}
          >
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Clients Below 50%</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    belowFifty.length > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    {belowFifty.length}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  belowFifty.length > 0 ? "bg-amber-500/20" : "bg-emerald-500/20"
                )}>
                  <Icon
                    icon="solar:danger-triangle-linear"
                    className={cn(
                      "h-6 w-6",
                      belowFifty.length > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Client Table */}
      <section className="px-6 pb-8 max-w-7xl mx-auto">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="w-8 px-3 py-3" />
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tool</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Mailboxes</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Mo. Capacity</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Daily Cap.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Sent This Mo.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Remaining</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground min-w-[160px]">Utilization</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Next Slot</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const isExpanded = expandedClientId === client.id;
                  return (
                    <>
                      <tr
                        key={client.id}
                        className={cn(
                          "border-b transition-colors cursor-pointer",
                          isExpanded ? "bg-muted/20" : "hover:bg-muted/30"
                        )}
                        onClick={() => toggleExpand(client.id)}
                      >
                        {/* Chevron */}
                        <td className="px-3 py-3 text-center">
                          <Icon
                            icon="solar:alt-arrow-right-linear"
                            className={cn(
                              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </td>

                        {/* Client */}
                        <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); navigate(`/admin-capacity/${client.id}`); }}>
                          <span className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">{client.clientName}</span>
                        </td>

                        {/* Tool */}
                        <td className="px-4 py-3">
                          <ToolBadge tool={client.tool} />
                        </td>

                        {/* Mailboxes */}
                        <td className="px-4 py-3 text-right text-foreground">{fmt(client.mailboxes)}</td>

                        {/* Monthly Capacity */}
                        <td className="px-4 py-3 text-right text-muted-foreground">{fmt(client.monthlyCapacity)}</td>

                        {/* Daily Capacity */}
                        <td className="px-4 py-3 text-right text-muted-foreground">{fmt(client.dailyCapacity)}</td>

                        {/* Sent This Month */}
                        <td className="px-4 py-3 text-right text-foreground">{fmt(client.emailsSentThisMonth)}</td>

                        {/* Remaining */}
                        <td className="px-4 py-3 text-right">
                          {client.emailsRemainingAcrossCampaigns === 0 ? (
                            <span className="text-muted-foreground text-xs italic">None</span>
                          ) : (
                            fmt(client.emailsRemainingAcrossCampaigns)
                          )}
                        </td>

                        {/* Utilization */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[80px]">
                              <div
                                className={cn("h-full rounded-full transition-all", utilizationBarColor(client.utilizationPct))}
                                style={{ width: `${Math.min(client.utilizationPct * 100, 100)}%` }}
                              />
                            </div>
                            <span className={cn("text-xs font-semibold tabular-nums w-10 text-right", utilizationTextColor(client.utilizationPct))}>
                              {(client.utilizationPct * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>

                        {/* Next Slot */}
                        <td className="px-4 py-3 text-right">
                          {client.daysToNextSlot === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Available now</span>
                          ) : (
                            <span className="text-foreground text-xs">{client.daysToNextSlot} days</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge client={client} />
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <ExpandedRow key={`${client.id}-expanded`} client={client} colSpan={COL_COUNT} onViewClient={() => navigate(`/admin-capacity/${client.id}`)} />
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
