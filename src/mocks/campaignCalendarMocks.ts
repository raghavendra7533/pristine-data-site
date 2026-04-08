import type { UnifiedCampaign, UnifiedMailbox } from '@/types/campaignCalendar'

const today = new Date(2026, 3, 1) // Apr 1 2026

// Each client's total dedicated mailbox pool (fixed, not shared)
export const clientMailboxPools: Record<string, { clientName: string; total: number }> = {
  'single-grain':  { clientName: 'Single Grain',  total: 1000 },
  'akila-cloud':   { clientName: 'Akila Cloud',    total: 500  },
  'maverick':      { clientName: 'Maverick',       total: 800  },
  'traction-labs': { clientName: 'Traction Labs',  total: 600  },
}

function daysFromNow(n: number): Date {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d
}

// ─── Mailboxes (representative samples — real deployments have 100s per domain pool) ──

export const mockMailboxes: UnifiedMailbox[] = [
  // Single Grain — 1000 mailboxes total, 750 occupied
  { email: 'pool-sg-smartlead@singlegrain.io', tool: 'smartlead', tags: ['SG', 'Q2'], assignedCampaignIds: ['sg-1'], isFree: false, dailyLimit: 50 },
  { email: 'pool-sg-instantly@singlegrain.io', tool: 'instantly', tags: ['SG', 'cold'], assignedCampaignIds: ['sg-3'], isFree: false, dailyLimit: 40 },
  { email: 'reserve-sg-1@singlegrain.io', tool: 'smartlead', tags: ['SG'], assignedCampaignIds: [], isFree: true, dailyLimit: 50 },
  { email: 'reserve-sg-2@singlegrain.io', tool: 'instantly', tags: ['SG'], assignedCampaignIds: [], isFree: true, dailyLimit: 40 },

  // Akila Cloud — 500 mailboxes, 380 occupied
  { email: 'pool-ac-instantly@akilacloud.com', tool: 'instantly', tags: ['AC', 'enterprise'], assignedCampaignIds: ['ac-1'], isFree: false, dailyLimit: 45 },
  { email: 'pool-ac-smartlead@akilacloud.com', tool: 'smartlead', tags: ['AC', 'smb'], assignedCampaignIds: ['ac-2'], isFree: false, dailyLimit: 50 },
  { email: 'reserve-ac-1@akilacloud.com', tool: 'instantly', tags: ['AC'], assignedCampaignIds: [], isFree: true, dailyLimit: 45 },
  { email: 'reserve-ac-2@akilacloud.com', tool: 'instantly', tags: ['AC'], assignedCampaignIds: [], isFree: true, dailyLimit: 45 },
  { email: 'reserve-ac-3@akilacloud.com', tool: 'instantly', tags: ['AC'], assignedCampaignIds: [], isFree: true, dailyLimit: 45 },

  // Maverick — 800 mailboxes, 790 occupied (nearly maxed)
  { email: 'pool-mv-smartlead@maverick.io', tool: 'smartlead', tags: ['MV', 'high-vol'], assignedCampaignIds: ['mv-1'], isFree: false, dailyLimit: 60 },
  { email: 'pool-mv-instantly@maverick.io', tool: 'instantly', tags: ['MV'], assignedCampaignIds: ['mv-2'], isFree: false, dailyLimit: 60 },
  { email: 'reserve-mv-1@maverick.io', tool: 'smartlead', tags: ['MV'], assignedCampaignIds: [], isFree: true, dailyLimit: 60 },

  // Traction Labs — 600 mailboxes, 400 occupied
  { email: 'pool-tl-smartlead@tractionlabs.co', tool: 'smartlead', tags: ['TL', 'smb'], assignedCampaignIds: ['tl-1'], isFree: false, dailyLimit: 50 },
  { email: 'pool-tl-instantly@tractionlabs.co', tool: 'instantly', tags: ['TL', 'mid-market'], assignedCampaignIds: ['tl-2'], isFree: false, dailyLimit: 40 },
  { email: 'reserve-tl-1@tractionlabs.co', tool: 'smartlead', tags: ['TL'], assignedCampaignIds: [], isFree: true, dailyLimit: 50 },
  { email: 'reserve-tl-2@tractionlabs.co', tool: 'instantly', tags: ['TL'], assignedCampaignIds: [], isFree: true, dailyLimit: 40 },
]

// ─── Campaigns (mailboxCount reflects real pool sizes) ────────────────────────

export const mockCampaigns: UnifiedCampaign[] = [
  // ── Single Grain (1000 mailboxes total) ──
  {
    id: 'sg-1',
    name: 'Q2 Personalization Test',
    clientId: 'single-grain',
    clientName: 'Single Grain',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 48000,
    leadsContacted: 36400,
    leadsRemaining: 11600,
    maxLeadsPerDay: 2000,
    estimatedEndDate: daysFromNow(6),
    startDate: daysFromNow(-18),
    stage: 3,
    totalStages: 4,
    mailboxCount: 400,
    mailboxes: [],
  },
  {
    id: 'sg-2',
    name: 'Monetary Offer Push',
    clientId: 'single-grain',
    clientName: 'Single Grain',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 35000,
    leadsContacted: 18500,
    leadsRemaining: 16500,
    maxLeadsPerDay: 1700,
    estimatedEndDate: daysFromNow(10),
    startDate: daysFromNow(-12),
    stage: 2,
    totalStages: 3,
    mailboxCount: 350,
    mailboxes: [],
  },
  {
    id: 'sg-3',
    name: 'Competitor Displacement',
    clientId: 'single-grain',
    clientName: 'Single Grain',
    tool: 'instantly',
    status: 'paused',
    leadsTotal: 22000,
    leadsContacted: 6800,
    leadsRemaining: 15200,
    maxLeadsPerDay: 800,
    estimatedEndDate: daysFromNow(22),
    startDate: daysFromNow(-8),
    stage: 1,
    totalStages: 2,
    mailboxCount: 200,
    mailboxes: [],
  },

  // ── Akila Cloud (500 mailboxes total) ──
  {
    id: 'ac-1',
    name: 'Enterprise Outreach Wave 1',
    clientId: 'akila-cloud',
    clientName: 'Akila Cloud',
    tool: 'instantly',
    status: 'active',
    leadsTotal: 60000,
    leadsContacted: 28000,
    leadsRemaining: 32000,
    maxLeadsPerDay: 1800,
    estimatedEndDate: daysFromNow(18),
    startDate: daysFromNow(-20),
    stage: 2,
    totalStages: 5,
    mailboxCount: 250,
    mailboxes: [],
  },
  {
    id: 'ac-2',
    name: 'SMB Nurture Sequence',
    clientId: 'akila-cloud',
    clientName: 'Akila Cloud',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 25000,
    leadsContacted: 9000,
    leadsRemaining: 16000,
    maxLeadsPerDay: 1300,
    estimatedEndDate: daysFromNow(13),
    startDate: daysFromNow(-10),
    stage: 1,
    totalStages: 3,
    mailboxCount: 130,
    mailboxes: [],
  },

  // ── Maverick (800 mailboxes total — nearly maxed) ──
  {
    id: 'mv-1',
    name: 'SaaStr Event Follow-up',
    clientId: 'maverick',
    clientName: 'Maverick',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 18000,
    leadsContacted: 16000,
    leadsRemaining: 2000,
    maxLeadsPerDay: 2400,
    estimatedEndDate: daysFromNow(1),
    startDate: daysFromNow(-25),
    stage: 4,
    totalStages: 4,
    mailboxCount: 480,
    mailboxes: [],
  },
  {
    id: 'mv-2',
    name: 'Mid-Market ICP Blitz',
    clientId: 'maverick',
    clientName: 'Maverick',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 44000,
    leadsContacted: 13200,
    leadsRemaining: 30800,
    maxLeadsPerDay: 2200,
    estimatedEndDate: daysFromNow(14),
    startDate: daysFromNow(-5),
    stage: 1,
    totalStages: 3,
    mailboxCount: 310,
    mailboxes: [],
  },

  // ── Traction Labs (600 mailboxes total) ──
  {
    id: 'tl-1',
    name: 'SMB Warm Intro Sequence',
    clientId: 'traction-labs',
    clientName: 'Traction Labs',
    tool: 'smartlead',
    status: 'active',
    leadsTotal: 30000,
    leadsContacted: 14400,
    leadsRemaining: 15600,
    maxLeadsPerDay: 1500,
    estimatedEndDate: daysFromNow(10),
    startDate: daysFromNow(-15),
    stage: 2,
    totalStages: 4,
    mailboxCount: 200,
    mailboxes: [],
  },
  {
    id: 'tl-2',
    name: 'Mid-Market Decision Maker Push',
    clientId: 'traction-labs',
    clientName: 'Traction Labs',
    tool: 'instantly',
    status: 'active',
    leadsTotal: 40000,
    leadsContacted: 4000,
    leadsRemaining: 36000,
    maxLeadsPerDay: 1200,
    estimatedEndDate: daysFromNow(30),
    startDate: daysFromNow(-3),
    stage: 1,
    totalStages: 3,
    mailboxCount: 200,
    mailboxes: [],
  },
]

// Hydrate mailboxes onto campaigns
export const mockCampaignsHydrated: UnifiedCampaign[] = mockCampaigns.map((c) => ({
  ...c,
  mailboxes: mockMailboxes.filter((m) => m.assignedCampaignIds.includes(c.id)),
}))
