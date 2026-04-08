import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { clientMailboxPools } from '@/mocks/campaignCalendarMocks'
import { cn } from '@/lib/utils'
import { useCampaignCalendar } from '@/hooks/useCampaignCalendar'
import type { UnifiedCampaign, CapacitySnapshot, UnifiedMailbox } from '@/types/campaignCalendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Tool badge ───────────────────────────────────────────────────────────────

function ToolBadge({ tool }: { tool: 'smartlead' | 'instantly' }) {
  return tool === 'smartlead' ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
      <Icon icon="solar:letter-linear" className="h-3 w-3" />
      Smartlead
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
      <Icon icon="solar:plain-2-linear" className="h-3 w-3" />
      Instantly
    </span>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UnifiedCampaign['status'] }) {
  const map = {
    active: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    paused: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    completed: 'bg-muted text-muted-foreground border-border',
    draft: 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700',
  } as const

  const icons = {
    active: 'solar:play-circle-linear',
    paused: 'solar:pause-circle-linear',
    completed: 'solar:check-circle-linear',
    draft: 'solar:document-linear',
  } as const

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border', map[status])}>
      <Icon icon={icons[status]} className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── End date display ─────────────────────────────────────────────────────────

function EndDateDisplay({ date }: { date: Date | null }) {
  if (!date) return <span className="text-muted-foreground text-xs">—</span>

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return <span className="text-xs text-muted-foreground">Ended</span>
  }
  if (diffDays <= 30) {
    const color = diffDays <= 3 ? 'text-red-600 dark:text-red-400' : diffDays <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
    return <span className={cn('text-xs font-medium', color)}>~{diffDays}d</span>
  }
  return (
    <span className="text-xs text-muted-foreground">
      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
    </span>
  )
}

// ─── Mailboxes popover cell ───────────────────────────────────────────────────

function MailboxCell({ campaign }: { campaign: UnifiedCampaign }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none"
      >
        <Icon icon="solar:inbox-linear" className="h-3.5 w-3.5" />
        {campaign.mailboxCount}
      </button>
      {open && (
        <div className="absolute z-20 left-0 top-6 min-w-[220px] rounded-lg border border-border bg-popover shadow-lg p-2">
          <button
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
          </button>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Mailboxes
          </p>
          {campaign.mailboxes.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1">None assigned</p>
          ) : (
            campaign.mailboxes.map((m) => (
              <div key={m.email} className="flex items-center gap-2 px-1 py-1">
                <Icon icon="solar:letter-linear" className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground truncate">{m.email}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Capacity donut (SVG) ─────────────────────────────────────────────────────

function CapacityRing({
  occupied,
  total,
  size = 56,
}: {
  occupied: number
  total: number
  size?: number
}) {
  const r = (size - 8) / 2
  const circumference = 2 * Math.PI * r
  const pct = total === 0 ? 0 : Math.min(1, occupied / total)
  const dash = pct * circumference

  const color =
    pct >= 0.9
      ? '#ef4444'
      : pct >= 0.6
      ? '#f59e0b'
      : '#10b981'

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="currentColor"
        className="text-foreground"
      >
        {total === 0 ? '0' : Math.round(pct * 100)}%
      </text>
    </svg>
  )
}

// ─── Capacity client card ─────────────────────────────────────────────────────

function CapacityCard({
  snapshot,
  onSelectMailboxes,
}: {
  snapshot: CapacitySnapshot
  onSelectMailboxes: (mailboxes: UnifiedMailbox[]) => void
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleMailbox = (email: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(email) ? next.delete(email) : next.add(email)
      return next
    })
  }

  const handlePlan = () => {
    const chosen = snapshot.freeMailboxList.filter((m) => selected.has(m.email))
    onSelectMailboxes(chosen)
    setSheetOpen(false)
  }

  return (
    <>
      <Card className="hover:shadow-card transition-shadow">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <CapacityRing occupied={snapshot.occupiedMailboxes} total={snapshot.totalMailboxes} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{snapshot.clientName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {snapshot.occupiedMailboxes} / {snapshot.totalMailboxes} mailboxes occupied
              </p>
              {snapshot.freeMailboxes > 0 ? (
                <button
                  onClick={() => setSheetOpen(true)}
                  className="mt-2 text-xs font-medium text-primary hover:underline focus:outline-none flex items-center gap-1"
                >
                  <Icon icon="solar:inbox-out-linear" className="h-3.5 w-3.5" />
                  {snapshot.freeMailboxes} free mailbox{snapshot.freeMailboxes !== 1 ? 'es' : ''}
                </button>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">No free mailboxes</p>
              )}
              {snapshot.dailyCapacityFree > 0 && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  ~{snapshot.dailyCapacityFree.toLocaleString()} emails/day available
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Icon icon="solar:inbox-linear" className="h-5 w-5 text-primary" />
              Free Mailboxes — {snapshot.clientName}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-1 flex-1 overflow-y-auto">
            {snapshot.freeMailboxList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No free mailboxes available.</p>
            ) : (
              snapshot.freeMailboxList.map((m) => (
                <label
                  key={m.email}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(m.email)}
                    onChange={() => toggleMailbox(m.email)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ToolBadge tool={m.tool} />
                      <span className="text-[11px] text-muted-foreground">{m.dailyLimit}/day</span>
                      {m.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          <SheetFooter className="mt-4">
            <Button
              className="w-full gap-2"
              disabled={selected.size === 0}
              onClick={handlePlan}
            >
              <Icon icon="solar:calendar-add-linear" className="h-4 w-4" />
              Plan New Campaign →
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

// ─── Forecast bar chart tooltip ───────────────────────────────────────────────

interface ForecastPayload {
  label: string
  occupiedByClient: Record<string, number>
  campaignsEnding: { campaignName: string; clientName: string; clientId: string; mailboxCount: number }[]
}

function ForecastTooltip({ active, payload }: { active?: boolean; payload?: { payload: ForecastPayload }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-lg min-w-[230px]">
      <p className="text-xs font-semibold text-foreground mb-2">{d.label}</p>

      {/* Per-client occupied counts */}
      <div className="space-y-1 mb-2">
        {Object.entries(clientMailboxPools).map(([clientId, pool], i) => {
          const occupied = d.occupiedByClient[clientId] ?? 0
          const free = pool.total - occupied
          return (
            <div key={clientId} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CLIENT_COLORS[i % CLIENT_COLORS.length] }} />
                <span className="text-xs text-foreground">{pool.clientName}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {occupied.toLocaleString()} / {pool.total.toLocaleString()}
                {free > 0 && <span className="text-emerald-500 ml-1">({free.toLocaleString()} free)</span>}
              </span>
            </div>
          )
        })}
      </div>

      {/* Campaigns ending today */}
      {d.campaignsEnding.length > 0 && (
        <div className="border-t border-border pt-2 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Ending today</p>
          {d.campaignsEnding.map((c) => (
            <div key={c.campaignName} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-foreground truncate max-w-[130px]">{c.campaignName}</p>
                <p className="text-[11px] text-muted-foreground">{c.clientName}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-500 whitespace-nowrap">
                -{c.mailboxCount.toLocaleString()} MBs
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// One colour per client — consistent across chart and tooltip
const CLIENT_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b']

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CampaignCalendar() {
  const navigate = useNavigate()
  const { campaigns, capacityByClient, forecast, isLoading, lastSynced, refetch } =
    useCampaignCalendar()

  const [adminView, setAdminView] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState<string>(Object.keys(clientMailboxPools)[0])

  const switchToClientView = () => {
    setAdminView(false)
  }

  // In client view, filter everything to the selected client
  const visibleCampaigns = adminView
    ? campaigns
    : campaigns.filter((c) => c.clientId === selectedClientId)

  const visibleCapacity = adminView
    ? capacityByClient
    : capacityByClient.filter((c) => c.clientId === selectedClientId)

  // Group visible campaigns by client
  const byClient = visibleCampaigns.reduce<Record<string, UnifiedCampaign[]>>((acc, c) => {
    if (!acc[c.clientId]) acc[c.clientId] = []
    acc[c.clientId].push(c)
    return acc
  }, {})

  const clientOrder = Object.keys(byClient)

  const clientIds = Object.keys(clientMailboxPools)

  // Client schedule: group into periods separated by campaign end dates.
  // Each period = { from, to, activeCampaigns, totalEmailsPerDay }
  const clientSchedule = useMemo(() => {
    if (adminView) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const clientCampaigns = campaigns.filter(
      (c) =>
        c.clientId === selectedClientId &&
        c.estimatedEndDate &&
        (c.status === 'active' || c.status === 'paused'),
    )

    // Collect all unique breakpoint dates (today + each end date)
    const breakpoints = [
      today,
      ...clientCampaigns.map((c) => { const d = new Date(c.estimatedEndDate!); d.setHours(0,0,0,0); return d }),
    ]
    const uniqueDates = [...new Map(breakpoints.map((d) => [d.getTime(), d])).values()]
      .sort((a, b) => a.getTime() - b.getTime())

    return uniqueDates.map((date, i) => {
      const nextDate = uniqueDates[i + 1] ?? null
      // Campaigns still running on this date
      const active = clientCampaigns.filter((c) => {
        const end = new Date(c.estimatedEndDate!)
        end.setHours(0, 0, 0, 0)
        return end >= date
      })
      const totalPerDay = active.reduce((sum, c) => sum + c.mailboxCount * 50, 0)
      const endingOnDate = clientCampaigns.filter((c) => {
        const end = new Date(c.estimatedEndDate!)
        end.setHours(0, 0, 0, 0)
        return end.getTime() === date.getTime()
      })
      return { date, nextDate, activeCampaigns: active, totalPerDay, endingOnDate }
    }).filter((p) => p.activeCampaigns.length > 0 || p.endingOnDate.length > 0)
  }, [adminView, selectedClientId, campaigns])

  const handleSelectMailboxes = (mailboxes: UnifiedMailbox[]) => {
    // Pass selected mailboxes to campaign creation via navigation state
    navigate('/campaigns/create', { state: { preselectedMailboxes: mailboxes } })
  }

  return (
    <div className="min-h-full bg-background">
      {/* ── Header ── */}
      <div className="border-b border-border bg-card px-6 py-5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:calendar-linear" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Campaign Calendar</h1>
              <p className="text-xs text-muted-foreground">
                Last synced{' '}
                {lastSynced.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Client selector — only in client view */}
            {!adminView && (
              <div className="flex items-center gap-2">
                <Icon icon="solar:user-linear" className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="text-sm rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(clientMailboxPools).map(([id, pool]) => (
                    <option key={id} value={id}>{pool.clientName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Admin / Client toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden text-sm">
              <button
                onClick={() => setAdminView(true)}
                className={cn(
                  'px-3 py-1.5 font-medium transition-colors',
                  adminView
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                Admin View
              </button>
              <button
                onClick={switchToClientView}
                className={cn(
                  'px-3 py-1.5 font-medium transition-colors',
                  !adminView
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                Client View
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={isLoading}
              className="gap-2"
            >
              <Icon
                icon={isLoading ? 'solar:refresh-circle-linear' : 'solar:refresh-linear'}
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
              />
              {isLoading ? 'Syncing…' : 'Sync Now'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* ── Section A: Active Campaigns Table (admin only) ── */}
        {adminView && <section>
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="solar:target-linear" className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Active Campaigns</h2>
            <Badge variant="secondary" className="ml-1">
              {visibleCampaigns.filter((c) => c.status === 'active').length} active
            </Badge>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : visibleCampaigns.length === 0 ? (
            <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 gap-3">
              <Icon icon="solar:calendar-linear" className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No active campaigns found.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    {adminView && <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Client</TableHead>}
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Campaign</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Tool</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Stage</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground min-w-[160px]">Progress</TableHead>
                    {adminView && (
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mailboxes</TableHead>
                    )}
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Est. End</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientOrder.map((clientId, clientIdx) => {
                    const clientCampaigns = byClient[clientId]
                    const clientName = clientCampaigns[0].clientName

                    return clientCampaigns.map((campaign, i) => (
                      <TableRow
                        key={campaign.id}
                        className={cn(
                          'hover:bg-muted/30 transition-colors',
                          i === clientCampaigns.length - 1 &&
                            clientIdx < clientOrder.length - 1 &&
                            'border-b-2 border-border',
                        )}
                      >
                        {/* Client name — only in admin view, only on first row of group */}
                        {adminView && (
                          <TableCell className="py-3">
                            {i === 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[10px] font-bold text-primary">
                                    {clientName.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                                  {clientName}
                                </span>
                              </div>
                            ) : null}
                          </TableCell>
                        )}

                        <TableCell className="py-3">
                          <span className="text-xs font-medium text-foreground">{campaign.name}</span>
                        </TableCell>

                        <TableCell className="py-3">
                          <ToolBadge tool={campaign.tool} />
                        </TableCell>

                        <TableCell className="py-3">
                          <StatusBadge status={campaign.status} />
                        </TableCell>

                        <TableCell className="py-3">
                          {campaign.status === 'draft' ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            <span className="text-xs font-medium text-foreground whitespace-nowrap">
                              Email {campaign.stage} of {campaign.totalStages}
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="py-3 min-w-[160px]">
                          <div className="space-y-1">
                            <Progress
                              value={
                                campaign.leadsTotal === 0
                                  ? 0
                                  : Math.round((campaign.leadsContacted / campaign.leadsTotal) * 100)
                              }
                              className="h-1.5"
                            />
                            <span className="text-[11px] text-muted-foreground">
                              {campaign.leadsContacted.toLocaleString()} / {campaign.leadsTotal.toLocaleString()} leads
                            </span>
                          </div>
                        </TableCell>

                        {adminView && (
                          <TableCell className="py-3">
                            <MailboxCell campaign={campaign} />
                          </TableCell>
                        )}

                        <TableCell className="py-3">
                          <EndDateDisplay date={campaign.estimatedEndDate} />
                        </TableCell>

                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Pause campaign"
                            >
                              <Icon icon="solar:pause-circle-linear" className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="View analytics"
                              onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
                            >
                              <Icon icon="solar:chart-2-linear" className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>}

        {/* ── Section B: Mailbox Capacity Panel ── */}
        {adminView && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:server-linear" className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Mailbox Capacity</h2>
              <Badge variant="secondary" className="ml-1">
                {visibleCapacity.reduce((s, c) => s + c.freeMailboxes, 0)} free{adminView ? ' across all clients' : ''}
              </Badge>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleCapacity.map((snapshot) => (
                  <CapacityCard
                    key={snapshot.clientId}
                    snapshot={snapshot}
                    onSelectMailboxes={handleSelectMailboxes}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Client schedule view ── */}
        {!adminView && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:calendar-mark-linear" className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Your Sending Schedule</h2>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-36">Date</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Campaigns Running</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-right w-44">Total Sends / Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientSchedule.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-10">
                        No active campaigns found.
                      </TableCell>
                    </TableRow>
                  ) : clientSchedule.map((period, idx) => {
                    const isToday = idx === 0
                    const fromLabel = period.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    const toLabel = period.nextDate
                      ? period.nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : null
                    const dateRange = toLabel ? `${fromLabel} – ${toLabel}` : `${fromLabel} onwards`

                    return (
                      <TableRow key={period.date.toISOString()} className={cn(isToday && 'bg-primary/5')}>
                        <TableCell className="py-4 align-top">
                          <div className="flex items-center gap-2">
                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                            <span className={cn('text-xs font-semibold', isToday ? 'text-primary' : 'text-foreground')}>
                              {isToday ? 'Today' : fromLabel}
                            </span>
                          </div>
                          {toLabel && (
                            <span className="text-[11px] text-muted-foreground ml-3.5">until {toLabel}</span>
                          )}
                        </TableCell>

                        <TableCell className="py-4 align-top">
                          {period.activeCampaigns.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">No campaigns running</span>
                          ) : (
                            <div className="space-y-2">
                              {period.activeCampaigns.map((c) => (
                                <div key={c.id} className="flex items-center gap-3">
                                  <ToolBadge tool={c.tool} />
                                  <span className="text-xs font-medium text-foreground">{c.name}</span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {c.mailboxCount.toLocaleString()} MBs × 50 =
                                    <span className="font-semibold text-foreground ml-1">
                                      {(c.mailboxCount * 50).toLocaleString()}/day
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="py-4 align-top text-right">
                          <p className="text-base font-bold text-foreground">
                            {period.totalPerDay.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-muted-foreground">emails/day</p>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* ── Section C: Capacity Forecast Timeline (admin only) ── */}
        {adminView && <section>
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="solar:graph-up-linear" className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Capacity Forecast</h2>
            <span className="text-xs text-muted-foreground ml-1">— next 60 days</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-7">
            Occupied mailboxes per client per day. Each bar steps down as that client's campaigns finish. Hover for details.
          </p>

          <Card>
            <CardContent className="pt-4 pb-2 pr-4 pl-2">
              {isLoading ? (
                <Skeleton className="h-52 w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={forecast.map((d) => ({
                      ...d,
                      ...Object.fromEntries(
                        clientIds.map((id) => [`occupied_${id}`, d.occupiedByClient[id] ?? 0])
                      ),
                    }))}
                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    barCategoryGap="20%"
                    barSize={6}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      interval={6}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
                    />
                    <Tooltip content={<ForecastTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                    <Legend
                      iconType="square"
                      iconSize={8}
                      formatter={(value: string) => {
                        const clientId = value.replace('occupied_', '')
                        return <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>{clientMailboxPools[clientId]?.clientName ?? clientId}</span>
                      }}
                    />
                    {clientIds.map((clientId, i) => (
                      <Bar
                        key={clientId}
                        dataKey={`occupied_${clientId}`}
                        stackId="a"
                        fill={CLIENT_COLORS[i % CLIENT_COLORS.length]}
                        radius={i === clientIds.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>}
      </div>
    </div>
  )
}
