'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const LOGO_TOKEN = 'pk_R0FhQgSqRMmR86Lw1NOJNg'

const CATEGORIES = [
  { id: 'prospecting',  label: 'Prospecting',           icon: 'solar:target-bold',   color: 'indigo' },
  { id: 'enrichment',   label: 'Enrichment',            icon: 'solar:database-bold', color: 'teal'   },
  { id: 'outreach',     label: 'Outreach & Sequencing', icon: 'solar:letter-bold',   color: 'violet' },
  { id: 'intelligence', label: 'Intelligence & Intent', icon: 'solar:eye-bold',      color: 'amber'  },
] as const

type CategoryId = 'prospecting' | 'enrichment' | 'outreach' | 'intelligence'
type ColorKey = 'indigo' | 'teal' | 'violet' | 'amber'

const COLORS: Record<ColorKey, { text: string; textDark: string }> = {
  indigo: { text: '#6366f1', textDark: '#818cf8' },
  teal:   { text: '#0d9488', textDark: '#2dd4bf' },
  violet: { text: '#7c3aed', textDark: '#a78bfa' },
  amber:  { text: '#d97706', textDark: '#fbbf24' },
}

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

function scoreStyle(score: number): { color: string; label: string } {
  if (score >= 80) return { color: '#10b981', label: '\u00b7 Lean'     }
  if (score >= 50) return { color: '#f59e0b', label: '\u00b7 Bloated'  }
  return              { color: '#ef4444', label: '\u00b7 Critical' }
}

function clampTeam(val: number): number {
  return Math.max(1, Math.min(500, val))
}

function calc(selected: Set<string>, teamSize: number) {
  const sel = TOOLS.filter(t => selected.has(t.id))
  const monthly = sel.reduce((s, t) => s + t.cost, 0) * teamSize
  const annual  = monthly * 12

  const catCounts: Record<string, number> = {}
  CATEGORIES.forEach(c => { catCounts[c.id] = 0 })
  sel.forEach(t => t.cats.forEach(c => { catCounts[c]++ }))

  const overlappingCats = Object.values(catCounts).filter(v => v >= 2).length

  let score = 100
  CATEGORIES.forEach(c => { if (catCounts[c.id] >= 2) score -= 10 })
  const over1k = Math.max(0, monthly - 1000)
  score -= Math.floor(over1k / 500) * 5
  if (sel.length > 0 && catCounts['intelligence'] === 0) score -= 10
  const hasOutreach = catCounts['outreach'] > 0
  const hasProspect = catCounts['prospecting'] > 0
  if (hasOutreach && hasProspect) {
    const combined = sel.some(t => t.cats.includes('outreach') && t.cats.includes('prospecting'))
    if (!combined) score -= 5
  }
  score = Math.max(0, Math.min(100, score))

  return { monthly, annual, overlappingCats, score, catCounts, sel }
}

// ─────────────────────────────────────────────
// LOGO CHIP COMPONENT
// ─────────────────────────────────────────────
function LogoChip({
  tool,
  isSelected,
  onToggle,
}: {
  tool: Tool
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div
      title={`${tool.name} — $${tool.cost}/seat/mo`}
      onClick={onToggle}
      className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden select-none cursor-pointer transition-all duration-150 border ${
        isSelected
          ? 'bg-indigo-500/[0.08] border-indigo-500 shadow-[0_0_0_2px_#6366f1,0_2px_6px_rgba(99,102,241,0.15)]'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.logo.dev/${tool.domain}?token=${LOGO_TOKEN}`}
        alt={tool.name}
        className="w-5 h-5 object-contain rounded"
        onError={e => {
          const el = e.currentTarget.parentElement
          if (el) el.innerHTML = `<span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">${tool.name[0]}</span>`
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function StackAuditEmbedPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [teamSize, setTeamSize] = useState(10)
  const [isDark, setIsDark] = useState(false)

  // Hold-to-repeat refs
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Clean up hold interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }
  }, [])

  const toggleTool = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const adjustTeam = (dir: 1 | -1) => {
    setTeamSize(prev => {
      const step = dir * (prev >= 50 ? 10 : prev >= 10 ? 5 : 1)
      return clampTeam(prev + step)
    })
  }

  const startHold = (dir: 1 | -1) => {
    holdIntervalRef.current = setInterval(() => {
      setTeamSize(prev => {
        const step = dir * (prev >= 50 ? 10 : prev >= 10 ? 5 : 1)
        return clampTeam(prev + step)
      })
    }, 120)
  }

  const stopHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  const count = selected.size
  const { monthly, annual, overlappingCats, score } = calc(selected, teamSize)
  const ss = count > 0 ? scoreStyle(score) : null

  const annualColor = count === 0
    ? (isDark ? '#475569' : '#cbd5e1')
    : annual > 50000 ? '#f43f5e' : annual > 20000 ? '#fb923c' : '#fbbf24'

  const ctaText = count > 0
    ? `<strong style="color:#fff">${fmt(annual)}/yr</strong> &middot; <strong style="color:#fff">${overlappingCats} overlapping</strong> function${overlappingCats !== 1 ? 's' : ''}`
    : ''

  return (
    <section className="py-10 bg-white dark:bg-slate-950">
      <style>{`
        .stepper-btn {
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .stepper-btn:hover {
          background-color: #6366f1;
          color: white;
        }
        .stepper-btn:active {
          transform: scale(0.92);
        }
        .cta-bar {
          transition: opacity 0.35s ease, transform 0.35s ease, max-height 0.4s ease, margin 0.35s ease, padding 0.35s ease;
        }
        .hidden-cta {
          opacity: 0;
          transform: translateY(6px);
          max-height: 0;
          overflow: hidden;
          margin-top: 0 !important;
          padding-top: 0;
          padding-bottom: 0;
        }
        .visible-cta {
          opacity: 1;
          transform: translateY(0);
          max-height: 100px;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
          50% { box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.08); }
        }
        .cost-glow { animation: pulseGlow 2.5s ease-in-out infinite; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-7 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Icon icon="solar:calculator-minimalistic-bold" width={12} />
            Stack Cost Audit
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
            How much is your GTM stack really costing you?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Select the tools your team uses. See the real cost, overlap, and health score in seconds.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 items-start">

          {/* LEFT: Tool Grid */}
          <div className="space-y-3.5">
            {CATEGORIES.map(cat => {
              const catTools = TOOLS.filter(t => t.cats.includes(cat.id))
              const colorKey = COLORS[cat.color as ColorKey]
              const labelColor = isDark ? colorKey.textDark : colorKey.text

              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon icon={cat.icon} width={11} style={{ color: labelColor }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: labelColor }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {catTools.map(tool => (
                      <LogoChip
                        key={tool.id + cat.id}
                        tool={tool}
                        isSelected={selected.has(tool.id)}
                        onToggle={() => toggleTool(tool.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT: Controls + Results */}
          <div className="space-y-3">

            {/* Team Size Stepper */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-bold" width={14} className="text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Team size</span>
              </div>
              <div className="flex items-center gap-0">
                <button
                  id="team-minus"
                  className="stepper-btn w-7 h-7 rounded-l-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-base font-bold select-none"
                  onClick={() => adjustTeam(-1)}
                  onMouseDown={() => startHold(-1)}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                >
                  &minus;
                </button>
                <div className="w-12 h-7 bg-white dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{teamSize}</span>
                </div>
                <button
                  id="team-plus"
                  className="stepper-btn w-7 h-7 rounded-r-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-base font-bold select-none"
                  onClick={() => adjustTeam(1)}
                  onMouseDown={() => startHold(1)}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                >
                  +
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">reps</span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="space-y-2">

              {/* Annual Cost */}
              <div
                className={`bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${count > 0 ? 'cost-glow' : ''}`}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Annual Cost</p>
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="text-xl font-bold leading-none transition-colors duration-300"
                    style={{ color: annualColor }}
                  >
                    {count === 0 ? '$0' : fmt(annual)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-600">/yr</span>
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Health Score</p>
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="text-xl font-bold leading-none transition-colors duration-300"
                    style={{ color: count === 0 ? (isDark ? '#475569' : '#cbd5e1') : ss?.color }}
                  >
                    {count === 0 ? '--' : score}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-600">/100</span>
                  <span
                    className="text-[10px] font-semibold ml-1 transition-colors duration-300"
                    style={{ color: count === 0 ? (isDark ? '#475569' : '#cbd5e1') : ss?.color }}
                  >
                    {count > 0 ? ss?.label : ''}
                  </span>
                </div>
              </div>

              {/* Overlapping Functions */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Overlap</p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-xl font-bold leading-none transition-colors duration-300"
                    style={{ color: count === 0 ? (isDark ? '#475569' : '#cbd5e1') : (overlappingCats > 0 ? '#f59e0b' : '#10b981') }}
                  >
                    {count === 0 ? '--' : overlappingCats}
                  </span>
                  <span
                    className="text-[10px] transition-colors duration-300"
                    style={{ color: count === 0 ? (isDark ? '#475569' : '#cbd5e1') : (isDark ? '#94a3b8' : '#64748b') }}
                  >
                    {count > 0 ? (overlappingCats === 1 ? 'category' : 'categories') : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Bar */}
            <div
              className={`cta-bar rounded-xl bg-indigo-600 px-4 py-3 mt-3 ${count > 0 ? 'visible-cta' : 'hidden-cta'}`}
            >
              <p
                className="text-xs text-indigo-200 mb-2.5"
                dangerouslySetInnerHTML={{ __html: ctaText }}
              />
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 font-bold text-xs rounded-lg transition-all hover:bg-indigo-50 whitespace-nowrap w-full justify-center"
              >
                See what one platform looks like
                <Icon icon="solar:arrow-right-bold" width={13} />
              </Link>
            </div>

          </div>
        </div>

        {/* Fine print */}
        <p className="text-[10px] text-slate-400 dark:text-slate-700 mt-5 text-center leading-relaxed">
          Estimates based on publicly listed pricing. Actual costs may vary by contract and tier.
        </p>
      </div>
    </section>
  )
}
