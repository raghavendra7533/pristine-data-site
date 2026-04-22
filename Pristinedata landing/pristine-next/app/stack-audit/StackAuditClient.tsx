'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const LOGO_TOKEN = 'pk_R0FhQgSqRMmR86Lw1NOJNg'

const CATEGORIES = [
  { id: 'prospecting',  label: 'Prospecting',           icon: 'solar:target-bold',       color: 'indigo' },
  { id: 'enrichment',   label: 'Enrichment',            icon: 'solar:database-bold',     color: 'teal'   },
  { id: 'outreach',     label: 'Outreach & Sequencing', icon: 'solar:letter-bold',       color: 'violet' },
  { id: 'intelligence', label: 'Intelligence & Intent', icon: 'solar:eye-bold',          color: 'amber'  },
] as const

type CategoryId = 'prospecting' | 'enrichment' | 'outreach' | 'intelligence'
type ColorKey = 'indigo' | 'teal' | 'violet' | 'amber'

const COLORS_DARK: Record<ColorKey, { bg: string; border: string; text: string; tag: string; bar: string }> = {
  indigo: { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  text: '#818cf8', tag: '#3730a3', bar: '#6366f1' },
  teal:   { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)',  text: '#2dd4bf', tag: '#134e4a', bar: '#14b8a6' },
  violet: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa', tag: '#4c1d95', bar: '#8b5cf6' },
  amber:  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', tag: '#78350f', bar: '#f59e0b' },
}

const COLORS_LIGHT: Record<ColorKey, { bg: string; border: string; text: string; tag: string; bar: string }> = {
  indigo: { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.20)',  text: '#6366f1', tag: '#e0e7ff', bar: '#6366f1' },
  teal:   { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.20)',  text: '#0d9488', tag: '#ccfbf1', bar: '#14b8a6' },
  violet: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.20)', text: '#7c3aed', tag: '#ede9fe', bar: '#8b5cf6' },
  amber:  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)', text: '#d97706', tag: '#fef3c7', bar: '#f59e0b' },
}

const PROSPECT_TIERS = [
  { label: '<5k',       display: '<5k contacts'      },
  { label: '5-25k',    display: '5-25k contacts'    },
  { label: '25-100k',  display: '25-100k contacts'  },
  { label: '100-250k', display: '100-250k contacts'  },
  { label: '250k+',    display: '250k+ contacts'    },
]
const EMAIL_TIERS = [
  { label: '<25k',     display: '<25k/mo'    },
  { label: '25-100k',  display: '25-100k/mo' },
  { label: '100-250k', display: '100-250k/mo'},
  { label: '250-500k', display: '250-500k/mo'},
  { label: '500k+',    display: '500k+/mo'   },
]

const DATA_TOOLS  = new Set(['apollo','zoominfo','seamless','hunter','clay','clearbit','lusha'])
const EMAIL_TOOLS = new Set(['outreach-io','salesloft','lemlist','instantly','smartlead','apollo'])

const PROSPECT_TAX = [0, 100,  400,  900, 2200]
const EMAIL_TAX    = [0,  60,  180,  380,  750]

interface Tool {
  id: string
  name: string
  domain: string
  cats: CategoryId[]
  cost: number
}

const TOOLS: Tool[] = [
  { id: 'apollo',      name: 'Apollo.io',       domain: 'apollo.io',     cats: ['prospecting','outreach'],           cost: 99  },
  { id: 'zoominfo',    name: 'ZoomInfo',         domain: 'zoominfo.com',  cats: ['prospecting','enrichment'],         cost: 250 },
  { id: 'linkedin-sn', name: 'Sales Navigator',  domain: 'linkedin.com',  cats: ['prospecting'],                      cost: 99  },
  { id: 'seamless',    name: 'Seamless.ai',      domain: 'seamless.ai',   cats: ['prospecting'],                      cost: 147 },
  { id: 'hunter',      name: 'Hunter.io',        domain: 'hunter.io',     cats: ['prospecting'],                      cost: 49  },
  { id: 'clay',        name: 'Clay',             domain: 'clay.com',      cats: ['enrichment'],                       cost: 149 },
  { id: 'clearbit',    name: 'Clearbit',         domain: 'clearbit.com',  cats: ['enrichment'],                       cost: 99  },
  { id: 'lusha',       name: 'Lusha',            domain: 'lusha.com',     cats: ['enrichment'],                       cost: 79  },
  { id: 'outreach-io', name: 'Outreach',         domain: 'outreach.io',   cats: ['outreach'],                         cost: 130 },
  { id: 'salesloft',   name: 'Salesloft',        domain: 'salesloft.com', cats: ['outreach'],                         cost: 125 },
  { id: 'lemlist',     name: 'Lemlist',          domain: 'lemlist.com',   cats: ['outreach'],                         cost: 59  },
  { id: 'instantly',   name: 'Instantly',        domain: 'instantly.ai',  cats: ['outreach'],                         cost: 37  },
  { id: 'smartlead',   name: 'Smartlead',        domain: 'smartlead.ai',  cats: ['outreach'],                         cost: 94  },
  { id: 'gong',        name: 'Gong',             domain: 'gong.io',       cats: ['intelligence'],                     cost: 200 },
  { id: 'bombora',     name: 'Bombora',          domain: 'bombora.com',   cats: ['intelligence'],                     cost: 200 },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 10_000)    return '$' + Math.round(n / 1_000) + 'K'
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + n.toLocaleString()
}

function scoreStyle(score: number): { stroke: string; label: string; desc: string } {
  if (score >= 80) return { stroke: '#10b981', label: 'Lean',     desc: 'Your stack is relatively tight. Watch for creep.' }
  if (score >= 50) return { stroke: '#f59e0b', label: 'Bloated',  desc: 'You\u2019re paying for overlap. Time to audit.' }
  return              { stroke: '#ef4444', label: 'Critical', desc: 'Significant waste. Multiple tools doing the same job.' }
}

function calc(
  selected: Set<string>,
  teamSize: number,
  prospectTier: number,
  emailTier: number,
) {
  const sel = TOOLS.filter(t => selected.has(t.id))
  const monthly = sel.reduce((s, t) => s + t.cost, 0) * teamSize
  const annual  = monthly * 12

  const catCounts: Record<string, number> = {}
  CATEGORIES.forEach(c => { catCounts[c.id] = 0 })
  sel.forEach(t => t.cats.forEach(c => { catCounts[c]++ }))

  const overlappingCats = Object.values(catCounts).filter(v => v >= 2).length

  const selDataTools  = sel.filter(t => DATA_TOOLS.has(t.id))
  const selEmailTools = sel.filter(t => EMAIL_TOOLS.has(t.id))
  const prospectTaxTotal = selDataTools.length * PROSPECT_TAX[prospectTier]
  const emailTaxTotal    = selEmailTools.length > 0 ? EMAIL_TAX[emailTier] : 0
  const volumeTax        = prospectTaxTotal + emailTaxTotal
  const totalMonthly     = monthly + volumeTax
  const totalAnnual      = totalMonthly * 12

  const maxScore = sel.length >= 3 ? 50 : sel.length === 2 ? 70 : 100
  let score = 100
  CATEGORIES.forEach(c => { if (catCounts[c.id] >= 2) score -= 10 })
  const over1k = Math.max(0, totalMonthly - 1000)
  score -= Math.floor(over1k / 500) * 5
  if (volumeTax > 0) score -= Math.min(15, Math.floor(volumeTax / 500) * 3)
  if (sel.length > 0 && catCounts['intelligence'] === 0) score -= 10
  const hasOutreach = catCounts['outreach'] > 0
  const hasProspect = catCounts['prospecting'] > 0
  if (hasOutreach && hasProspect) {
    const combined = sel.some(t => t.cats.includes('outreach') && t.cats.includes('prospecting'))
    if (!combined) score -= 5
  }
  score = Math.max(0, Math.min(maxScore, score))

  const categoryCost: Record<string, number> = {}
  CATEGORIES.forEach(c => {
    const catSel = sel.filter(t => t.cats.includes(c.id as CategoryId))
    categoryCost[c.id] = catSel.reduce((s, t) => s + t.cost, 0) * teamSize
  })

  const categorySavings: Record<string, number> = {}
  CATEGORIES.forEach(c => {
    const catSel = sel.filter(t => t.cats.includes(c.id as CategoryId))
    if (catSel.length >= 2) {
      const cheapest = Math.min(...catSel.map(t => t.cost))
      categorySavings[c.id] = (catSel.reduce((s, t) => s + t.cost, 0) - cheapest) * teamSize
    } else {
      categorySavings[c.id] = 0
    }
  })

  return {
    monthly, annual, overlappingCats, score, catCounts, sel,
    categoryCost, categorySavings,
    prospectTaxTotal, emailTaxTotal, volumeTax,
    totalMonthly, totalAnnual,
    selDataTools, selEmailTools,
  }
}

// ─────────────────────────────────────────────
// RECEIPT HTML builder (returns raw HTML string rendered via dangerouslySetInnerHTML)
// ─────────────────────────────────────────────
function buildReceiptHTML(
  r: ReturnType<typeof calc>,
  teamSize: number,
  prospectTier: number,
  emailTier: number,
): string {
  const { sel, monthly, totalMonthly, totalAnnual, overlappingCats,
          prospectTaxTotal, emailTaxTotal, volumeTax,
          selDataTools, selEmailTools } = r

  const date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
  const totalColor = totalAnnual > 100000 ? '#dc2626' : totalAnnual > 50000 ? '#d97706' : '#1a1a0a'

  let h = ''

  h += `<div style="text-align:center;margin-bottom:8px">
    <div style="font-size:13px;font-weight:900;letter-spacing:0.12em">* PRISTINE DATA AI *</div>
    <div style="font-size:8px;color:#888877;letter-spacing:0.1em;margin-top:1px">GTM STACK COST AUDIT</div>
    <div style="font-size:8px;color:#aaa999;margin-top:2px">${date}</div>
  </div><hr>`

  h += `<div class="r-row" style="font-size:8px;color:#888877;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:3px">
    <span>ITEM</span><span style="min-width:72px;text-align:right">SEAT COST</span>
  </div><hr>`

  sel.forEach(t => {
    const cost = t.cost * teamSize
    h += `<div class="r-row"><span class="r-name">${t.name}</span><span class="r-price">${fmt(cost)}/mo</span></div>
          <div class="r-sub">${teamSize} seats &times; $${t.cost}/seat</div>`
  })

  h += `<hr>
  <div class="r-row" style="font-size:12px;font-weight:700"><span>SUBTOTAL</span><span>${fmt(monthly)}/mo</span></div>`

  if (volumeTax > 0) {
    h += `<hr><div class="r-hdr scale-penalty-block" style="color:#d97706">*** SCALE PENALTY ***</div>`
    h += `<div style="text-align:center;font-size:8px;color:#888877;margin:-2px 0 6px;letter-spacing:0.03em">Each tool bills you separately at this volume.</div>`

    if (prospectTaxTotal > 0 && selDataTools.length > 0) {
      const tl = PROSPECT_TIERS[prospectTier].label
      const pc = PROSPECT_TAX[prospectTier]
      h += `<div style="font-size:8px;color:#666655;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:4px 0 2px">DB: ${tl} contacts</div>`
      selDataTools.forEach(t => {
        h += `<div class="r-row" style="color:#b45309"><span class="r-name">${t.name} overage</span><span class="r-price">+${fmt(pc)}/mo</span></div>`
      })
    }

    if (emailTaxTotal > 0 && selEmailTools.length > 0) {
      const tl = EMAIL_TIERS[emailTier].label
      const ec = EMAIL_TAX[emailTier]
      h += `<div style="font-size:8px;color:#666655;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:4px 0 2px">EMAIL: ${tl}/mo sends</div>`
      h += `<div class="r-row" style="color:#b45309"><span class="r-name">Send volume upgrade</span><span class="r-price">+${fmt(ec)}/mo</span></div>`
      h += `<div class="r-sub">(via whichever of ${selEmailTools.length} tools you send through)</div>`
    }

    h += `<hr><div class="r-row" style="font-size:12px;font-weight:700;color:#b45309">
      <span>SCALE PENALTY</span><span>+${fmt(volumeTax)}/mo</span>
    </div>`
  }

  h += `<hr style="border-color:rgba(0,0,0,0.35)">
  <div class="r-total" style="font-size:12px"><span>TOTAL/MO</span><span>${fmt(totalMonthly)}</span></div>
  <div class="r-total" style="font-size:16px;color:${totalColor}"><span>TOTAL/YR</span><span>${fmt(totalAnnual)}</span></div>
  <hr>`

  if (overlappingCats > 0) {
    h += `<div style="text-align:center;font-size:8px;color:#b45309;padding:4px 0">${overlappingCats} overlapping function${overlappingCats !== 1 ? 's' : ''} detected</div><hr>`
  }

  const repLabel = teamSize === 1 ? '1 rep' : `${teamSize} reps`
  const volLabel = PROSPECT_TIERS[prospectTier].display
  h += `<div style="text-align:center;margin:8px 0 6px;padding:10px 8px;background:rgba(0,0,0,0.06);border-radius:6px">
    <div style="font-size:${totalAnnual >= 100000 ? '20px' : '17px'};font-weight:900;color:${totalColor};letter-spacing:0.02em">${fmt(totalAnnual)}/YR</div>
    <div style="font-size:8px;color:#888877;margin-top:3px;letter-spacing:0.04em">${repLabel} &middot; ${volLabel}</div>
  </div><hr>`

  h += `<div style="margin:8px 0 4px;text-align:center">
    <a href="/contact-us" style="display:block;background:#6366f1;color:#fff;font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;padding:11px 16px;border-radius:10px;text-decoration:none;text-align:center">
      See what this costs on one platform &rarr;
    </a>
    <div style="font-size:8px;color:#888877;margin-top:6px;letter-spacing:0.05em">No commitment &middot; 30-min demo</div>
  </div><hr>
  <div style="text-align:center;font-size:8px;color:#aaa999;letter-spacing:0.1em;padding:2px 0">THANK YOU FOR AUDITING</div>`

  return h
}

// ─────────────────────────────────────────────
// TOOL CARD COMPONENT
// ─────────────────────────────────────────────
function ToolCard({
  tool,
  isSelected,
  onToggle,
  isDark,
}: {
  tool: Tool
  isSelected: boolean
  onToggle: () => void
  isDark: boolean
}) {
  const getColors = (colorName: ColorKey) => isDark ? COLORS_DARK[colorName] : COLORS_LIGHT[colorName]

  const tagHTML = tool.cats.map(cid => {
    const parentCat = CATEGORIES.find(x => x.id === cid)
    const tc = getColors(parentCat ? parentCat.color as ColorKey : 'indigo')
    const label = cid === 'intelligence' ? 'Intel' : cid.charAt(0).toUpperCase() + cid.slice(1, 5)
    return (
      <span
        key={cid}
        className="text-[8px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5"
        style={{ color: tc.text, background: tc.bg }}
      >
        {label}
      </span>
    )
  })

  return (
    <div
      className={`border rounded-xl p-3 select-none cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'border-indigo-500 bg-indigo-500/[0.07] shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_4px_12px_rgba(99,102,241,0.1)]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:-translate-y-px'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.logo.dev/${tool.domain}?token=${LOGO_TOKEN}`}
            alt={tool.name}
            className="w-6 h-6 object-contain rounded"
            onError={(e) => {
              const el = e.currentTarget.parentElement
              if (el) el.innerHTML = `<span class="text-xs font-bold text-slate-400">${tool.name[0]}</span>`
            }}
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold leading-tight truncate text-slate-900 dark:text-slate-100">{tool.name}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            ${tool.cost}<span className="text-slate-300 dark:text-slate-600">/seat</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-wrap gap-1">{tagHTML}</div>
        <div
          className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150 border"
          style={
            isSelected
              ? { background: '#6366f1', borderColor: '#6366f1' }
              : { background: 'transparent', borderColor: isDark ? '#334155' : '#cbd5e1' }
          }
        >
          <svg
            className={`w-2.5 h-2.5 transition-opacity duration-150 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
            viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// AUDIT GATE MODAL
// ─────────────────────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdkvzgk'

function AuditModal({ onDismiss }: { onDismiss: () => void }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 50)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fn = firstName.trim()
    const em = email.trim()
    if (!fn) { setError('First name is required.'); return }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Please enter a valid work email.'); return }

    setSubmitting(true)
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'First Name': fn, 'Work Email': em }),
      })
    } catch (_) {
      // Silently continue
    }
    onDismiss()
  }

  return (
    <div style={{
      display: 'flex', position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(6px)',
      alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        position: 'relative', background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '420px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#1e293b', border: '1px solid #334155', borderRadius: '999px',
            padding: '4px 12px', marginBottom: '16px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase', fontFamily: "'Manrope',sans-serif" }}>
              Free GTM Audit Tool
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px', fontFamily: "'Manrope',sans-serif", lineHeight: 1.25 }}>
            See your GTM stack&apos;s true cost
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontFamily: "'Manrope',sans-serif" }}>
            Free. Takes 60 seconds. No sales call.
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', fontFamily: "'Manrope',sans-serif" }}>
              First Name
            </label>
            <input
              ref={firstRef}
              type="text"
              autoComplete="given-name"
              placeholder="Alex"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', background: '#1e293b',
                border: '1px solid #334155', borderRadius: '8px', padding: '11px 14px',
                fontSize: '14px', color: '#f1f5f9', fontFamily: "'Manrope',sans-serif", outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366f1' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#334155' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', fontFamily: "'Manrope',sans-serif" }}>
              Work Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="alex@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', background: '#1e293b',
                border: '1px solid #334155', borderRadius: '8px', padding: '11px 14px',
                fontSize: '14px', color: '#f1f5f9', fontFamily: "'Manrope',sans-serif", outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366f1' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#334155' }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#f87171', marginBottom: '10px', minHeight: '16px', fontFamily: "'Manrope',sans-serif" }}>
            {error}
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', background: '#6366f1', color: '#fff',
              fontFamily: "'Manrope',sans-serif", fontSize: '14px', fontWeight: 700,
              padding: '13px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              letterSpacing: '0.01em', opacity: submitting ? 0.7 : 1,
            }}
            onMouseOver={e => { if (!submitting) e.currentTarget.style.background = '#4f46e5' }}
            onMouseOut={e => { e.currentTarget.style.background = '#6366f1' }}
          >
            {submitting ? 'Sending\u2026' : 'Run My Free Audit \u2192'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export function StackAuditClient() {
  const searchParams = useSearchParams()

  const initTeamSize = (() => {
    const ts = parseInt(searchParams.get('team_size') ?? '', 10)
    return ts > 0 && ts <= 500 ? ts : 10
  })()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [teamSize, setTeamSize] = useState(initTeamSize)
  const [prospectTier, setProspectTier] = useState(0)
  const [emailTier, setEmailTier] = useState(0)
  const [showModal, setShowModal] = useState(true)
  const [isDark, setIsDark] = useState(false)
  // receipt animation state: 'hidden' | 'animating' | 'visible'
  const [receiptState, setReceiptState] = useState<'hidden' | 'animating' | 'visible'>('hidden')
  const prevCount = useRef(0)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const toggleTool = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isCatAllSelected = (catId: string) => {
    const catTools = TOOLS.filter(t => t.cats.includes(catId as CategoryId))
    return catTools.length > 0 && catTools.every(t => selected.has(t.id))
  }

  const toggleCat = (catId: string) => {
    const catTools = TOOLS.filter(t => t.cats.includes(catId as CategoryId))
    const allOn = catTools.every(t => selected.has(t.id))
    setSelected(prev => {
      const next = new Set(prev)
      catTools.forEach(t => allOn ? next.delete(t.id) : next.add(t.id))
      return next
    })
  }

  const count = selected.size
  const r = calc(selected, teamSize, prospectTier, emailTier)
  const { score } = r
  const CIRC = 339.3

  // Receipt animation effect
  useEffect(() => {
    if (count > 0 && prevCount.current === 0) {
      setReceiptState('animating')
      const t = setTimeout(() => setReceiptState('visible'), 950)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    if (count === 0) {
      setReceiptState('hidden')
      prevCount.current = 0
    } else {
      prevCount.current = count
      if (receiptState === 'hidden') setReceiptState('visible')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const gaugeOffset = count === 0 ? CIRC : CIRC * (1 - score / 100)
  const ss = count > 0 ? scoreStyle(score) : null

  const getColors = (colorName: ColorKey) => isDark ? COLORS_DARK[colorName] : COLORS_LIGHT[colorName]

  return (
    <>
      {showModal && <AuditModal onDismiss={() => setShowModal(false)} />}

      <Navbar />

      <style>{`
        .gauge-bg  { fill: none; stroke: #e2e8f0; stroke-width: 10; }
        .dark .gauge-bg { stroke: #1e293b; }
        .gauge-arc {
          fill: none;
          stroke-width: 10;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 64px 64px;
          transition: stroke-dashoffset 0.75s cubic-bezier(0.34, 1.3, 0.64, 1), stroke 0.4s ease;
        }
        .grid-bg {
          background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .dark .grid-bg {
          background-image: linear-gradient(to right, #1e293b 1px, transparent 1px),
                            linear-gradient(to bottom, #1e293b 1px, transparent 1px);
        }
        @keyframes receipt-print {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0%   0); }
        }
        .receipt-animating {
          animation: receipt-print 0.9s steps(30, end) forwards;
          filter: drop-shadow(0 10px 32px rgba(0,0,0,0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        }
        .receipt-visible {
          filter: drop-shadow(0 10px 32px rgba(0,0,0,0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        }
        .receipt {
          position: relative;
          background: #fafaf3;
          color: #0a0a00;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          font-weight: 600;
          padding: 16px;
          margin: 10px 0;
        }
        .receipt::before {
          content: '';
          position: absolute;
          top: -10px; left: 0; right: 0; height: 10px;
          background:
            linear-gradient(135deg, transparent 33.33%, #fafaf3 33.33%) 0 0,
            linear-gradient(225deg, transparent 33.33%, #fafaf3 33.33%) 0 0;
          background-size: 10px 10px;
          background-repeat: repeat-x;
        }
        .receipt::after {
          content: '';
          position: absolute;
          bottom: -10px; left: 0; right: 0; height: 10px;
          background:
            linear-gradient(315deg, transparent 33.33%, #fafaf3 33.33%) 0 0,
            linear-gradient(45deg,  transparent 33.33%, #fafaf3 33.33%) 0 0;
          background-size: 10px 10px;
          background-repeat: repeat-x;
        }
        .receipt hr { border: none; border-top: 1px dashed rgba(0,0,0,0.2); margin: 7px 0; }
        .r-row  { display:flex; justify-content:space-between; align-items:baseline; gap:4px; line-height:1.75; }
        .r-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .r-price{ font-weight:700; white-space:nowrap; min-width:72px; text-align:right; }
        .r-sub  { font-size:10px; color:#555544; padding-left:8px; margin-top:-2px; margin-bottom:4px; }
        .r-hdr  { text-align:center; font-weight:900; font-size:10px; letter-spacing:0.16em; margin:5px 0; }
        .r-total{ display:flex; justify-content:space-between; font-weight:900; letter-spacing:0.04em; line-height:1.9; }
        .tier-btn {
          padding: 8px 0;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.12s ease;
          text-align: center;
        }
        .tier-btn.active { background:#6366f1; color:#fff; border-color:#6366f1; }
        .tier-btn:not(.active) { background:transparent; color:#94a3b8; border-color:#e2e8f0; }
        .dark .tier-btn:not(.active) { color:#475569; border-color:#1e293b; }
        .tier-btn:hover:not(.active) { border-color: #6366f1 !important; color: #6366f1 !important; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; width: 100%; }
        input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: #e2e8f0; }
        .dark input[type="range"]::-webkit-slider-runnable-track { background: #1e293b; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #6366f1;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 2px #6366f1;
          margin-top: -8px;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .dark input[type="range"]::-webkit-slider-thumb { border-color: #0f172a; }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 0 0 3px rgba(99,102,241,0.4); }
        input[type="range"]::-moz-range-track { height: 6px; border-radius: 3px; background: #e2e8f0; }
        .dark input[type="range"]::-moz-range-track { background: #1e293b; }
        input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #6366f1; border: 3px solid #ffffff; }
        .dark input[type="range"]::-moz-range-thumb { border-color: #0f172a; }
      `}</style>

      {/* Hero */}
      <section className="pt-28 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white dark:from-transparent dark:via-slate-950/60 dark:to-slate-950 pointer-events-none" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Icon icon="solar:calculator-minimalistic-bold" width={13} />
            GTM Stack Cost Audit
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white tracking-tight mb-5 leading-[1.1]">
            Your GTM stack is costing<br className="hidden md:block" /> you more than you think.
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-3 leading-relaxed">
            Check every tool your team uses. Get the real annual number, see where functions overlap, and get a stack health score — in 60 seconds.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-600">Free. No sales call.</p>
        </div>
      </section>

      {/* Main Audit */}
      <section className="pb-28 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT: Tool Grid + Team Size */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Step 1 */}
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">1</span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Which tools does your team currently use?</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Click to select all that apply</p>
                  </div>
                </div>
                <div className="space-y-8">
                  {CATEGORIES.map(cat => {
                    const catTools = TOOLS.filter(t => t.cats.includes(cat.id))
                    const c = getColors(cat.color as ColorKey)
                    const allSelected = isCatAllSelected(cat.id)
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-3 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center border"
                              style={{ background: c.bg, borderColor: c.border }}
                            >
                              <Icon icon={cat.icon} width={14} style={{ color: c.text }} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{cat.label}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-600">{catTools.length} tools</span>
                          </div>
                          <button
                            className="tier-btn text-[10px] transition-colors px-2 py-0.5 rounded border"
                            style={{ color: 'var(--select-btn-text, #64748b)', borderColor: 'var(--select-btn-border, #e2e8f0)' }}
                            onClick={() => toggleCat(cat.id)}
                          >
                            {allSelected ? 'Clear all' : 'Select all'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                          {catTools.map(tool => (
                            <ToolCard
                              key={tool.id + cat.id}
                              tool={tool}
                              isSelected={selected.has(tool.id)}
                              onToggle={() => toggleTool(tool.id)}
                              isDark={isDark}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">2</span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">How many reps on your team?</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Per-seat costs are multiplied by this number</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <input
                      type="range"
                      min={1}
                      max={500}
                      value={teamSize}
                      onChange={e => setTeamSize(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 mt-2 px-1">
                      <span>1</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
                    </div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 flex items-baseline gap-1.5 min-w-[90px] justify-center shrink-0">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{teamSize}</span>
                    <span className="text-xs text-slate-400">reps</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Volume X-Factor */}
              <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-sm font-bold shrink-0">3</span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">What&apos;s your volume?</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      This is where costs get <span className="text-rose-400 font-semibold">exponential</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  {/* Prospect DB tiers */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Icon icon="solar:database-bold" width={12} className="text-teal-500" />
                        Prospect database
                      </label>
                      <span className="text-[10px] font-bold text-indigo-400">{PROSPECT_TIERS[prospectTier].display}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {PROSPECT_TIERS.map((tier, i) => (
                        <button
                          key={tier.label}
                          className={`tier-btn${i === prospectTier ? ' active' : ''}`}
                          onClick={() => setProspectTier(i)}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Email tiers */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Icon icon="solar:letter-bold" width={12} className="text-violet-500" />
                        Emails / month
                      </label>
                      <span className="text-[10px] font-bold text-indigo-400">{EMAIL_TIERS[emailTier].display}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {EMAIL_TIERS.map((tier, i) => (
                        <button
                          key={tier.label}
                          className={`tier-btn${i === emailTier ? ' active' : ''}`}
                          onClick={() => setEmailTier(i)}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Receipt Panel */}
            <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24 space-y-4">

              {/* Stack Health Gauge */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/30 flex items-center gap-4">
                <div className="relative shrink-0">
                  <svg width="80" height="80" viewBox="0 0 128 128">
                    <circle className="gauge-bg" cx="64" cy="64" r="54" />
                    <circle
                      className="gauge-arc"
                      cx="64" cy="64" r="54"
                      stroke={ss ? ss.stroke : (isDark ? '#334155' : '#cbd5e1')}
                      strokeDasharray="339.3"
                      strokeDashoffset={gaugeOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-xl font-bold leading-none"
                      style={{ color: count === 0 ? '#94a3b8' : (isDark ? '#ffffff' : '#0f172a') }}
                    >
                      {count === 0 ? '--' : score}
                    </span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-600 uppercase tracking-wide">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Stack Health</p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: ss ? ss.stroke : '#64748b' }}
                  >
                    {count === 0 ? 'Select tools' : ss?.label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5 max-w-[140px]">
                    {ss?.desc}
                  </p>
                </div>
              </div>

              {/* Empty state */}
              {count === 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/30">
                  <Icon icon="solar:receipt-bold" width={36} className="text-slate-200 dark:text-slate-800 mb-3 block mx-auto" />
                  <p className="text-sm font-bold text-slate-300 dark:text-slate-600">Your cost receipt</p>
                  <p className="text-xs text-slate-400 dark:text-slate-700 mt-1 leading-relaxed">
                    Select tools above —<br />your audit bill prints here.
                  </p>
                </div>
              )}

              {/* Receipt */}
              {receiptState !== 'hidden' && (
                <div className={receiptState === 'animating' ? 'receipt-animating' : 'receipt-visible'}>
                  <div
                    className="receipt"
                    dangerouslySetInnerHTML={{ __html: buildReceiptHTML(r, teamSize, prospectTier, emailTier) }}
                  />
                </div>
              )}

              {count > 0 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-700 px-1 leading-relaxed">
                  Estimates based on publicly listed pricing. Actual costs may vary by contract and tier.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
