'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// Note: metadata export doesn't work in 'use client' components.
// Move to a separate layout or use generateMetadata if needed server-side.

export default function ContactPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [inquiry, setInquiry] = useState('Platform Demo')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Required'
    if (!lastName.trim()) errs.lastName = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = 'Enter a valid work email'
    if (!message.trim()) errs.message = 'Please add a message'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'b75d7917-b00d-40aa-95c9-92a2768372a9',
          firstName, lastName, email,
          company: company ? `https://${company}` : '',
          inquiry, message,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setFirstName(''); setLastName(''); setEmail(''); setCompany(''); setMessage('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-1 transition-all outline-none ${
      errors[field]
        ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400'
        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
    }`

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-24 relative">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-10 pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950 pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: Context */}
            <div className="flex flex-col pt-4">
              <div className="inline-flex self-start mb-6 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Support Online
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tighter mb-6">
                Let&apos;s scale your <br className="hidden md:block" /> outbound revenue.
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-md">
                Whether you have a technical question or need a custom enterprise quote, our team is ready to help.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { icon: 'solar:letter-linear', title: 'Chat with Sales', detail: 'sales@pristinedata.ai' },
                  { icon: 'solar:question-circle-linear', title: 'Product Support', detail: 'help@pristinedata.ai' },
                  { icon: 'solar:map-point-linear', title: 'HQ', detail: 'San Francisco, CA' },
                ].map(({ icon, title, detail }) => (
                  <div key={title} className="flex items-start gap-4 group cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors">
                      <Icon icon={icon} width={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-indigo-100 dark:from-slate-800 dark:to-indigo-900/30 rounded-3xl blur opacity-50 dark:opacity-40 -z-10" />
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">First name <span className="text-rose-500">*</span></label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass('firstName')} placeholder="Jane" />
                      {errors.firstName && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1"><Icon icon="solar:danger-circle-linear" width={12} /> {errors.firstName}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Last name <span className="text-rose-500">*</span></label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass('lastName')} placeholder="Doe" />
                      {errors.lastName && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1"><Icon icon="solar:danger-circle-linear" width={12} /> {errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Work email <span className="text-rose-500">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass('email')} placeholder="jane@company.com" />
                    {errors.email && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1"><Icon icon="solar:danger-circle-linear" width={12} /> {errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Company website</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm">https://</span>
                      <input value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-14 pr-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none" placeholder="acme.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">What are you looking for?</label>
                    <div className="relative">
                      <select value={inquiry} onChange={e => setInquiry(e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none cursor-pointer">
                        <option>Platform Demo</option>
                        <option>Pricing Questions</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <Icon icon="solar:alt-arrow-down-linear" width={16} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Message <span className="text-rose-500">*</span></label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className={`${inputClass('message')} resize-none`} placeholder="Tell us about your team's needs..." />
                    {errors.message && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1"><Icon icon="solar:danger-circle-linear" width={12} /> {errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`mt-2 w-full py-3 font-bold rounded-lg shadow-lg transition-all hover:translate-y-px active:translate-y-0.5 flex items-center justify-center gap-2 text-sm ${
                      status === 'success'
                        ? 'bg-emerald-600 text-white'
                        : status === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-slate-900/10 dark:shadow-none'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : status === 'success' ? (
                      <><Icon icon="solar:check-circle-bold" width={16} /> Message Sent!</>
                    ) : status === 'error' ? (
                      <><Icon icon="solar:close-circle-bold" width={16} /> Error — Try Again</>
                    ) : (
                      <><Icon icon="solar:plain-bold" width={16} /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
