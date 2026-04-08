export type Tool = 'smartlead' | 'instantly'

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft'

export interface UnifiedMailbox {
  email: string
  tool: Tool
  tags: string[]
  assignedCampaignIds: string[]
  isFree: boolean
  dailyLimit: number
}

export interface UnifiedCampaign {
  id: string
  name: string
  clientId: string
  clientName: string
  tool: Tool
  status: CampaignStatus
  leadsTotal: number
  leadsContacted: number
  leadsRemaining: number
  maxLeadsPerDay: number
  estimatedEndDate: Date | null
  startDate: Date | null
  stage: number
  totalStages: number
  mailboxCount: number
  mailboxes: UnifiedMailbox[]
}

export interface CapacitySnapshot {
  clientId: string
  clientName: string
  totalMailboxPool: number   // dedicated pool size for this client
  totalMailboxes: number
  occupiedMailboxes: number
  freeMailboxes: number
  freeMailboxList: UnifiedMailbox[]
  dailyCapacityFree: number
}

export interface ForecastDay {
  date: Date
  label: string
  // Per-client occupied mailbox counts — keys are clientId
  occupiedByClient: Record<string, number>
  // Campaigns ending on this exact day
  campaignsEnding: { campaignName: string; clientName: string; clientId: string; mailboxCount: number }[]
}
