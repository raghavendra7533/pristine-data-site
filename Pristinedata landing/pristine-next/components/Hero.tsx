'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

const peoplePhrases = [
  'Find CMOs at Series A companies with $10M+ ARR...',
  'Search for VPs of Sales in London...',
  'Find React Engineers with 5+ years experience...',
  'Show me Founders who recently raised funds...',
  'Find Marketing Directors using HubSpot...',
]

const companyPhrases = [
  'Show me SaaS startups in San Francisco...',
  'List e-commerce brands using Shopify Plus...',
  'Find B2B fintech companies with $50M+ funding...',
  'Show me companies hiring for Enterprise Sales...',
  'List healthcare companies in New York...',
]

export function Hero() {
  const router = useRouter()
  const [tab, setTab] = useState<'people' | 'company'>('people')
  const [placeholder, setPlaceholder] = useState('')
  const phraseIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const phrases = tab === 'people' ? peoplePhrases : companyPhrases
    phraseIdx.current = 0
    charIdx.current = 0
    deleting.current = false
    setPlaceholder('')

    function loop() {
      const phrase = phrases[phraseIdx.current]
      if (!deleting.current) {
        charIdx.current++
        setPlaceholder(phrase.slice(0, charIdx.current))
        if (charIdx.current === phrase.length) {
          deleting.current = true
          timeoutId.current = setTimeout(loop, 1800)
          return
        }
      } else {
        charIdx.current--
        setPlaceholder(phrase.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length
        }
      }
      timeoutId.current = setTimeout(loop, deleting.current ? 40 : 60)
    }

    timeoutId.current = setTimeout(loop, 400)
    return () => { if (timeoutId.current) clearTimeout(timeoutId.current) }
  }, [tab])

  return (
    <section className="min-h-[600px] flex overflow-hidden h-[80vh] pt-16 relative items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-10 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-50/50 dark:bg-rose-900/10 rounded-full blur-[80px] -z-10 opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[80px] -z-10 opacity-60" />

      <div className="z-10 flex flex-col text-center w-full max-w-4xl mx-auto px-6 items-center">
        <div className="inline-flex gap-1.5 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border rounded-full mb-6 px-3 py-1 shadow-sm items-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
          </span>
          <span className="text-[10px] uppercase dark:text-slate-300 font-semibold text-slate-600 tracking-wider">
            largest coverage in the category - 700M+ Contacts
          </span>
        </div>

        <h1 className="md:text-6xl leading-[1.15] dark:text-white text-4xl font-semibold text-slate-950 tracking-tighter mb-4">
          Your Entire Revenue Stack. <br className="hidden md:block" /> One AI-Powered Platform.
        </h1>

        <p className="leading-relaxed dark:text-slate-400 text-base font-medium text-slate-700 max-w-lg mx-auto mb-10">
          Find prospects, enrich data, and run outreach — all in one place. Stop paying for ZoomInfo, Amplemarket, and OpenAI separately.
        </p>

        <div className="relative w-full max-w-2xl mx-auto group">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 ring-4 ring-slate-50/50 dark:ring-slate-800/20">
            <div className="flex flex-col">
              <div className="pt-4 px-4 pb-2">
                <div className="relative flex items-start gap-3">
                  <div className="mt-1 text-slate-400 dark:text-slate-500">
                    <Icon icon="solar:magic-stick-3-linear" width={20} />
                  </div>
                  <textarea
                    className="placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none resize-none leading-relaxed text-lg font-medium text-slate-600 dark:text-slate-200 bg-transparent w-full p-0"
                    rows={2}
                    placeholder={placeholder}
                  />
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-transparent sm:border-slate-50 dark:sm:border-slate-800">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100/80 dark:bg-slate-800 rounded-lg self-start sm:self-center">
                  {(['people', 'company'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        tab === t
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon icon={t === 'people' ? 'solar:user-circle-linear' : 'solar:buildings-2-linear'} width={14} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/contact-us')}
                  className="sm:w-auto hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 transition-all hover:translate-y-px flex gap-2 text-xs font-semibold text-white bg-slate-900 w-full rounded-lg py-2 px-5 shadow-lg items-center justify-center"
                >
                  Generate Leads
                  <Icon icon="solar:arrow-right-linear" width={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
