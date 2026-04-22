import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WaveCarousel } from '@/components/WaveCarousel'

export const metadata: Metadata = {
  title: 'About Us - Pristine Data AI',
  description:
    'Pristine Data AI was born from the frustration of revenue teams who did everything right — and still couldn\'t predict their pipeline. Learn our story.',
  openGraph: {
    title: 'About Us - Pristine Data AI',
    description:
      'Built in the space where outbound breaks down. Learn how Pristine Data AI helps revenue teams move from volume to precision.',
    url: 'https://pristinedata.ai/about-us',
    siteName: 'Pristine Data AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Pristine Data AI',
    description:
      'Built in the space where outbound breaks down. Learn how Pristine Data AI helps revenue teams move from volume to precision.',
  },
  alternates: {
    canonical: 'https://pristinedata.ai/about-us',
  },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ============================================================
            ACT 1 — THE HOOK (About Us Hero)
            ============================================================ */}
        <section className="min-h-[92vh] flex items-center overflow-hidden bg-slate-950 relative pt-24" id="act1-hook">
          {/* Subtle grid background */}
          <div className="absolute inset-0 grid-bg-dark opacity-[0.07] pointer-events-none"></div>
          {/* Gradient orbs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700/15 rounded-full blur-[100px] pointer-events-none"></div>
          {/* Fade edges */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: Main hero content */}
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-700/50 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                    <Icon icon="solar:users-group-rounded-bold" width={14} />
                    About Pristine Data AI
                  </span>
                </div>
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
                    Built in the space<br />where outbound <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">breaks down.</span>
                  </h1>
                </div>
                <div className="mb-8">
                  <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-lg">
                    We were born from the frustration of revenue teams who did everything right — and still couldn&apos;t predict their pipeline.
                  </p>
                </div>
                <div>
                  <a href="#act2-wound" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group">
                    Read our story
                    <Icon icon="solar:arrow-down-linear" width={16} className="group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right: Visual card */}
              <div>
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Sound like your last quarter?</p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-read-bold" className="text-rose-400" width={10} />
                      </div>
                      <p className="text-slate-300 font-medium">Bought the tools.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-read-bold" className="text-rose-400" width={10} />
                      </div>
                      <p className="text-slate-300 font-medium">Built the sequences.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-read-bold" className="text-rose-400" width={10} />
                      </div>
                      <p className="text-slate-300 font-medium">Hired the SDRs.</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-700/60 pt-6">
                    <p className="text-white font-semibold text-lg leading-snug">So why does pipeline still feel like a coin flip?</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ============================================================
            ACT 2 — THE WOUND
            ============================================================ */}
        <section className="bg-white dark:bg-slate-950 relative py-16 md:py-24" id="act2-wound">
          <div>

            {/* Section header */}
            <div className="text-center mb-8 max-w-6xl mx-auto px-6 w-full">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Icon icon="solar:rewind-back-bold" width={14} />
                The Outbound Cycle
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Five waves. Same ending.
              </h2>
            </div>

            <WaveCarousel />

          </div>
        </section>


        {/* ============================================================
            "SOUND FAMILIAR?" INTERSTITIAL (Dark full-width)
            ============================================================ */}
        <section
          className="overflow-hidden text-white py-28 relative"
          id="sound-familiar"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 70%, #1a0a20 100%)' }}
        >
          {/* Ambient color orbs */}
          <div className="absolute pointer-events-none" style={{ top: '-60px', left: '-80px', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 65%)', borderRadius: '50%' }}></div>
          <div className="absolute pointer-events-none" style={{ bottom: '-80px', right: '-60px', width: '460px', height: '460px', background: 'radial-gradient(circle, rgba(244,63,94,0.28) 0%, transparent 65%)', borderRadius: '50%' }}></div>
          <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 65%)', borderRadius: '50%' }}></div>

          {/* Colored accent line at top */}
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(244,63,94,0.9), transparent)' }}></div>
          {/* Colored accent line at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.6), rgba(139,92,246,0.7), rgba(99,102,241,0.6), transparent)' }}></div>

          <div className="max-w-3xl mx-auto px-6 relative text-center">

            {/* Eyebrow badge */}
            <div className="flex justify-center mb-8">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                style={{ background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}
              >
                <Icon icon="solar:danger-triangle-bold" width={12} />
                The Cycle
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-8">
              Sound familiar?
            </h2>

            {/* Divider spark */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6))' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#818cf8' }}></div>
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.6), transparent)' }}></div>
            </div>

            <div className="space-y-4 text-lg md:text-xl leading-relaxed" style={{ color: 'rgba(148,163,184,1)' }}>
              <p>You&apos;ve lived this cycle.</p>
              <p>Maybe you&apos;re living it right now.</p>
            </div>

            <div className="mt-10 space-y-3 text-base md:text-lg leading-relaxed">
              <p style={{ color: 'rgba(148,163,184,0.85)' }}>The tool changes. The promise changes.</p>
              <p className="font-semibold text-lg md:text-xl">
                <span style={{ background: 'linear-gradient(90deg, #f87171, #fb7185, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800 }}>The outcome doesn&apos;t.</span>
              </p>
            </div>
          </div>
        </section>


        {/* ============================================================
            ACT 3 — THE TURN (Light section, tension breaks)
            ============================================================ */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950" id="act3-turn">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-10">
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-widest mb-6">The false assumption</p>
              <p className="text-2xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                <span className="line-through decoration-rose-500 decoration-2 font-mono">&quot;More activity = more pipeline.&quot;</span>
              </p>
            </div>
            <div>
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-800 mx-auto mb-10"></div>
              <div className="space-y-3 mb-8">
                <p className="text-3xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">Right message.</p>
                <p className="text-3xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">Right account.</p>
                <p className="text-3xl md:text-5xl font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight">Right moment.</p>
              </div>
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-800 mx-auto mb-8"></div>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
                Not volume. <span className="text-slate-900 dark:text-white font-semibold">Precision.</span>
              </p>
            </div>
          </div>
        </section>


        {/* ============================================================
            ACT 4 — THE ANSWER
            ============================================================ */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" id="act4-answer">
          <div className="max-w-6xl mx-auto px-6">

            {/* Part A: Beliefs */}
            <div className="max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                <Icon icon="solar:compass-bold" width={14} />
                What We Built
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-8">
                So we built something different.
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
                    Data should not overwhelm revenue teams. <span className="text-slate-900 dark:text-white font-medium">It should sharpen them.</span>
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
                    AI should not replace judgment. <span className="text-slate-900 dark:text-white font-medium">It should amplify it.</span>
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
                    Outbound should feel less like interruption -- <span className="text-slate-900 dark:text-white font-medium">and more like inevitability.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Part B: Credibility — Ashok's story */}
            <div className="mb-16 md:mb-20">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg dark:shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-5">
                      <Icon icon="solar:fire-bold" width={14} />
                      Forged in Revenue
                    </span>
                    <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                      This company was not created in a lab. It was forged inside quarterly targets, missed forecasts, and board pressure.
                    </p>
                    <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                      Ashok has carried a number. Built pipeline from zero. Scaled teams. Led revenue at 6sense. He has lived through every wave of outbound evolution -- and watched each one promise more than it delivered.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Ashok has</p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Icon icon="solar:medal-ribbons-star-bold" className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" width={18} />
                          <p className="text-sm text-slate-700 dark:text-slate-300">Carried a number. Built pipeline from zero.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon icon="solar:users-group-two-rounded-bold" className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" width={18} />
                          <p className="text-sm text-slate-700 dark:text-slate-300">Scaled teams across geographies.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon icon="solar:buildings-bold" className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" width={18} />
                          <p className="text-sm text-slate-700 dark:text-slate-300">Led revenue at category-defining companies like 6sense.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon icon="solar:chart-2-bold" className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" width={18} />
                          <p className="text-sm text-slate-700 dark:text-slate-300">Navigated enterprise sales with real board accountability.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Part C: Philosophy */}
            <div>
              {/* Three questions: dark editorial band */}
              <div className="relative mb-6 rounded-2xl overflow-hidden bg-slate-900 dark:bg-slate-950 border border-slate-800 p-8 md:p-12">
                <div className="absolute inset-0 grid-bg-dark opacity-[0.08] pointer-events-none"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8">We answer three questions for every deal</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-slate-800">
                  <div className="sm:pr-8">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">01</span>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">Who?</p>
                    <p className="text-sm text-slate-400 leading-relaxed">Who is actually in market right now — not just a title in a spreadsheet?</p>
                  </div>
                  <div className="sm:px-8">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">02</span>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">What changed?</p>
                    <p className="text-sm text-slate-400 leading-relaxed">What signal shifted that makes this moment different from last quarter?</p>
                  </div>
                  <div className="sm:pl-8">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">03</span>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">Why now?</p>
                    <p className="text-sm text-slate-400 leading-relaxed">What narrative will resonate with this buyer at this exact moment?</p>
                  </div>
                </div>
              </div>

              {/* Comparison: two-column bold split */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* The old way */}
                  <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-900/40 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      <Icon icon="solar:close-circle-bold" width={12} />
                      The old way
                    </div>
                    <div className="space-y-8">
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Generic personalization</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Templated &quot;Hey {'{{'}FirstName{'}}'}&quot; outreach at scale is not personalization. It is pattern recognition by the buyer.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Activity metrics</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Emails sent, dials made, sequences enrolled. These are not outcomes. These are symptoms of hoping volume works.</p>
                      </div>
                    </div>
                  </div>
                  {/* The Pristine way */}
                  <div className="p-8 md:p-10 bg-white dark:bg-slate-900">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      <Icon icon="solar:check-circle-bold" width={12} />
                      The Pristine way
                    </div>
                    <div className="space-y-8">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white mb-2">Contextual precision</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Every outreach should feel like it was written for that one buyer, at that one moment, about that one problem.</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white mb-2">Revenue impact</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Pipeline created, opportunities qualified, revenue closed. That is what we measure. That is what matters.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ============================================================
            ACT 5 — THE INVITATION (Dark closing section)
            ============================================================ */}
        <section
          className="overflow-hidden text-white relative"
          id="act5-invitation"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0f172a 75%, #1a0a20 100%)' }}
        >
          {/* Grid */}
          <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none"></div>

          {/* Strong ambient orbs */}
          <div className="absolute top-0 -left-24 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 65%)' }}></div>
          <div className="absolute bottom-0 -right-24 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 65%)' }}></div>
          <div className="absolute top-1/2 left-2/3 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)' }}></div>

          {/* Colored accent line at top */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.9) 30%, rgba(139,92,246,0.9) 50%, rgba(244,63,94,0.9) 70%, transparent 100%)' }}></div>

          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>

          <div className="py-24 md:py-36 max-w-3xl mx-auto px-6 relative text-center">

            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-10 text-[10px] font-bold uppercase tracking-widest text-indigo-300"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }}></span>
              The decision point
            </div>

            <div className="space-y-5 mb-10">
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                You&apos;re not evaluating another tool.
              </p>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                You&apos;re deciding whether outbound stays a volume game —<br className="hidden md:block" /> or becomes a <span style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800 }}>precision game</span>.
              </p>
            </div>

            {/* Divider spark */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6))' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-80"></div>
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.6), transparent)' }}></div>
            </div>

            <div className="mb-12">
              <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-3">
                The future of revenue won&apos;t be won by the loudest teams.
              </p>
              <p className="text-lg md:text-xl text-white font-bold leading-relaxed mb-3">
                It will be won by the sharpest ones.
              </p>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                And we&apos;re here to build them.
              </p>
            </div>
            <div className="mb-14">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold rounded-xl transition-all hover:scale-[1.02]"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(99,102,241,0.4)' }}
              >
                <Icon icon="solar:chat-round-dots-bold" width={18} />
                Talk to us
              </Link>
            </div>
            <div>
              <p className="text-sm italic" style={{ color: 'rgba(148,163,184,0.6)' }}>
                &quot;Because timing isn&apos;t everything. It&apos;s the only thing.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">Our Values</h2>
              <p className="text-slate-600 dark:text-slate-400">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Value 1 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:medal-star-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Confidence without Attitude</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 italic font-medium">&quot;Be excellent without ego.&quot;</p>
              </div>
              {/* Value 2 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:restart-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Deshi Basara</h3>
                <p className="text-sm text-teal-600 dark:text-teal-400 italic font-medium">&quot;Rise every time we fall.&quot;</p>
              </div>
              {/* Value 3 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:graph-up-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Opportunities, Not Guarantees</h3>
                <p className="text-sm text-amber-600 dark:text-amber-400 italic font-medium">&quot;Nothing is owed; everything is earned.&quot;</p>
              </div>
              {/* Value 4 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:heart-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Customers Before Comfort</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 italic font-medium">&quot;Do what&apos;s right for the customer, even when it&apos;s harder for us.&quot;</p>
              </div>
              {/* Value 5 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:compass-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Purpose Over Meaning</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 italic font-medium">&quot;Use your gifts to create outsized value for others.&quot;</p>
              </div>
              {/* Value 6 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                  <Icon icon="solar:users-group-two-rounded-bold" width={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Win as a Team</h3>
                <p className="text-sm text-rose-600 dark:text-rose-400 italic font-medium">&quot;Share context, share credit, share the win.&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">Leadership</h2>
              <p className="text-slate-600 dark:text-slate-400">The visionaries driving Pristine Data AI forward</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Founder 1 */}
              <div className="text-center group">
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/ashok.png" alt="Ashok R" width={192} height={192} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/rajanashok/" target="_blank" rel="noopener" className="absolute top-2 right-2 w-7 h-7 bg-white rounded-md shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={16} />
                  </a>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Ashok R</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">CEO</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">San Francisco</p>
              </div>
              {/* Founder 2 */}
              <div className="text-center group">
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/richard.png" alt="Richard HB" width={192} height={192} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/rhuiebuckius/" target="_blank" rel="noopener" className="absolute top-2 right-2 w-7 h-7 bg-white rounded-md shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={16} />
                  </a>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Richard HB</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">SVP</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">San Francisco</p>
              </div>
              {/* Founder 3 */}
              <div className="text-center group">
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/ranga.png" alt="Ranga K" width={192} height={192} className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Ranga K</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">India Head</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Chennai</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">Our Team</h2>
              <p className="text-slate-600 dark:text-slate-400">The talented people behind the platform</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Team Member 1 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/gobi.webp" alt="Gobinath Rajendiran" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/gobinathrajendiran/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Gobinath R</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Head of Engineering</p>
              </div>
              {/* Team Member 2 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/min.webp" alt="Min Ihm" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/min-ihm/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Min Ihm</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Data Science</p>
              </div>
              {/* Team Member 3 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/annette.webp" alt="Annette Corda" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/anettetrulssoncorda/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Annette Corda</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Market Strategy</p>
              </div>
              {/* Team Member 4 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/arvind.webp" alt="Arvind Gopalan" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/arvind-gopalan-671654123/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Arvind Gopalan</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Prompt Engineering</p>
              </div>
              {/* Team Member 5 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/nirupama.webp" alt="Nirupama Gopalan" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/nirupama-gopalan-65986667/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Nirupama Gopalan</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Project Management</p>
              </div>
              {/* Team Member 6 */}
              <div className="text-center group">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                    <Image src="/assets/team/angelo.webp" alt="Angelo Mandarano" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <a href="https://www.linkedin.com/in/angelomandarano/" target="_blank" rel="noopener" className="absolute top-1 right-1 w-5 h-5 bg-white rounded shadow-md flex items-center justify-center opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110 transition-all duration-300">
                    <Icon icon="logos:linkedin-icon" width={11} />
                  </a>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Angelo Mandarano</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Strategic Data</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">Ready to show up at the right moment?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Join the teams using Pristine Data AI to move from volume to precision — and win on timing.</p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Get in Touch
              <Icon icon="solar:arrow-right-linear" width={18} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
