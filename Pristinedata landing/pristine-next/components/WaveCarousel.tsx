'use client'

import { useEffect, useRef, useState } from 'react'

const WAVE_DURATION = 6000
const PAUSE_RESUME_DELAY = 8000
const CONTINUOUS_THRESHOLD = 1500

const waves = [
  {
    num: '01', label: 'Spray & pray', title: 'Spray-and-pray email',
    promise: 'More emails meant more pipeline. Volume was the strategy. Blast your list, hit your number.',
    reality: 'Open rates collapsed. Domains got blacklisted. Buyers stopped reading after the first sentence.',
    aftermath: '"You told yourself the next approach would be different."',
  },
  {
    num: '02', label: 'Sequencing', title: 'Sequencing at scale',
    promise: 'Multi-touch cadences would nurture prospects through the funnel. Automate the follow-up, free the reps.',
    reality: 'Every team ran the same 7-step playbook. Prospects started recognizing the pattern before step two.',
    aftermath: '"Everyone automated the same cadence. Inboxes became a graveyard of 7-step sequences."',
  },
  {
    num: '03', label: 'Personalization', title: 'Personalization at volume',
    promise: 'If you personalize each message, buyers will engage. Merge fields, custom snippets, dynamic content.',
    reality: 'Buyers saw through it instantly. The same "personal" template from a hundred different vendors.',
    aftermath: '"\'Hey {{FirstName}}, loved your recent post about {{Topic}}\' became the new spam."',
  },
  {
    num: '04', label: 'Intent data', title: 'Intent data',
    promise: 'Know who is researching your category. Target accounts showing buying signals. Right message, right time.',
    reality: 'Everyone had the same intent data. The same accounts got flooded by the same vendors at the same time.',
    aftermath: '"You had better data and somehow worse conversion rates."',
  },
  {
    num: '05', label: 'Account-based', title: 'Account-based everything',
    promise: 'Align sales, marketing, and CS around target accounts. Orchestrate multi-threaded engagement across the buying committee.',
    reality: 'Massive operational overhead. Teams spent more time building account plans than actually engaging accounts.',
    aftermath: '"You\'re sitting in the same pipeline review, asking the same questions."',
  },
]

export function WaveCarousel() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pausedRef = useRef(false)
  const lastClickRef = useRef(0)

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    intervalRef.current = null
    progressRef.current = null
  }

  const startCarousel = (from: number) => {
    clearAll()
    setActive(from)
    setProgress(0)

    const tick = 50
    const steps = WAVE_DURATION / tick
    let elapsed = 0

    progressRef.current = setInterval(() => {
      elapsed += tick
      setProgress(Math.min((elapsed / WAVE_DURATION) * 100, 100))
    }, tick)

    intervalRef.current = setInterval(() => {
      elapsed = 0
      setProgress(0)
      setActive((prev) => {
        const next = (prev + 1) % waves.length
        return next
      })
    }, WAVE_DURATION)
  }

  useEffect(() => {
    startCarousel(0)
    return () => clearAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Restart carousel from current wave when active changes during auto-play
  // (handled inside interval itself, no need to re-init)

  const handleNavClick = (idx: number) => {
    const now = Date.now()
    const isContinuous = now - lastClickRef.current < CONTINUOUS_THRESHOLD
    lastClickRef.current = now

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)

    if (isContinuous) {
      // Manual browsing — pause auto-advance but show progress full
      clearAll()
      pausedRef.current = true
      setActive(idx)
      setProgress(100)
      pauseTimerRef.current = setTimeout(() => {
        pausedRef.current = false
        startCarousel(idx)
      }, PAUSE_RESUME_DELAY)
    } else {
      // Single click — restart timer from this wave
      pausedRef.current = false
      startCarousel(idx)
    }
  }

  return (
    <div className="w-full">
      {/* Nav tabs */}
      <div className="max-w-6xl mx-auto px-6 w-full mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
          <div className="grid grid-cols-5 gap-2 md:gap-6">
            {waves.map((w, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(i)}
                className="text-left"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{w.num}</span>
                  <span className={`text-[10px] md:text-sm truncate transition-colors ${
                    i === active
                      ? 'font-semibold text-slate-900 dark:text-white'
                      : 'font-medium text-slate-500 dark:text-slate-400'
                  }`}>{w.label}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-none"
                    style={{
                      width: i < active ? '100%' : i === active ? `${progress}%` : '0%',
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active wave card */}
      <div className="max-w-6xl mx-auto px-6 w-full">
        {waves.map((w, i) => (
          <div
            key={i}
            className={`transition-all duration-450 ${
              i === active
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-2 pointer-events-none absolute'
            }`}
            style={{ display: i === active ? 'block' : 'none' }}
          >
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-5 md:p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{w.title}</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">The Promise</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{w.promise}</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">The Reality</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{w.reality}</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">The Aftermath</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">{w.aftermath}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
