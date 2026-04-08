import { useState, useCallback, useMemo } from 'react'
import { mockCampaignsHydrated, mockMailboxes, clientMailboxPools } from '@/mocks/campaignCalendarMocks'
import type { UnifiedCampaign, UnifiedMailbox, CapacitySnapshot, ForecastDay } from '@/types/campaignCalendar'

function buildCapacityByClient(
  campaigns: UnifiedCampaign[],
  mailboxes: UnifiedMailbox[],
): CapacitySnapshot[] {
  return Object.entries(clientMailboxPools).map(([clientId, pool]) => {
    const activeCampaignIds = campaigns
      .filter((c) => c.clientId === clientId && c.status === 'active')
      .map((c) => c.id)

    const occupiedMBs = mailboxes.filter((m) =>
      m.assignedCampaignIds.some((id) => activeCampaignIds.includes(id)),
    )

    const freeMBs = mailboxes.filter(
      (m) => m.isFree && m.assignedCampaignIds.length === 0 &&
        campaigns.filter((c) => c.clientId === clientId).some((c) =>
          m.assignedCampaignIds.length === 0 &&
          m.email.toLowerCase().includes(clientId.replace('-', ''))
        )
    )

    // Occupied count from campaign mailboxCount (more accurate than individual mailbox records)
    const occupiedCount = campaigns
      .filter((c) => c.clientId === clientId && c.status === 'active')
      .reduce((sum, c) => sum + c.mailboxCount, 0)

    const freeCount = pool.total - occupiedCount

    return {
      clientId,
      clientName: pool.clientName,
      totalMailboxPool: pool.total,
      totalMailboxes: pool.total,
      occupiedMailboxes: occupiedCount,
      freeMailboxes: Math.max(0, freeCount),
      freeMailboxList: freeMBs,
      dailyCapacityFree: Math.max(0, freeCount) * 50,
    }
  })
}

function buildForecast(campaigns: UnifiedCampaign[]): ForecastDay[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const clientIds = Object.keys(clientMailboxPools)
  const activeCampaigns = campaigns.filter(
    (c) => (c.status === 'active' || c.status === 'paused') && c.estimatedEndDate,
  )

  return Array.from({ length: 60 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const campaignsEnding = activeCampaigns.filter((c) => {
      const endDate = new Date(c.estimatedEndDate!)
      endDate.setHours(0, 0, 0, 0)
      return endDate.getTime() === date.getTime()
    })

    // Per-client: sum mailboxCount of campaigns still running on this date
    const occupiedByClient: Record<string, number> = {}
    for (const clientId of clientIds) {
      occupiedByClient[clientId] = activeCampaigns
        .filter((c) => {
          if (c.clientId !== clientId) return false
          const endDate = new Date(c.estimatedEndDate!)
          endDate.setHours(0, 0, 0, 0)
          return endDate >= date
        })
        .reduce((sum, c) => sum + c.mailboxCount, 0)
    }

    return {
      date,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      occupiedByClient,
      campaignsEnding: campaignsEnding.map((c) => ({
        campaignName: c.name,
        clientName: c.clientName,
        clientId: c.clientId,
        mailboxCount: c.mailboxCount,
      })),
    }
  })
}

export function useCampaignCalendar() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date>(new Date())
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setLastSynced(new Date())
      setTick((t) => t + 1)
      setIsLoading(false)
    }, 800)
  }, [])

  const campaigns = useMemo(() => {
    void tick
    return mockCampaignsHydrated
  }, [tick])

  const mailboxes = useMemo(() => mockMailboxes, [])

  const capacityByClient = useMemo(
    () => buildCapacityByClient(campaigns, mailboxes),
    [campaigns, mailboxes],
  )

  const forecast = useMemo(() => buildForecast(campaigns), [campaigns])

  return { campaigns, mailboxes, capacityByClient, forecast, isLoading, lastSynced, refetch }
}
