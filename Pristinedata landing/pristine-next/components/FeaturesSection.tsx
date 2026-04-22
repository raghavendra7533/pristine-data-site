import { Icon } from '@iconify/react'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">The Intelligence Engine</h2>
          <p className="text-base text-slate-700 dark:text-slate-400 max-w-xl mx-auto">
            From raw search to closed deal, powered by granular data and deep AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1: Natural Language Search */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="mb-8 flex-1">
              <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-inner h-full flex flex-col">
                <div className="relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 shadow-sm mb-4">
                  <span className="absolute -top-2 left-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">Prompt</span>
                  &quot;Find me CMOs at SaaS companies with $10M+ ARR&quot;
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Found: 712,405 matches</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">View All</span>
                  </div>
                  {[1, 2].map((n) => (
                    <div key={n} className={`bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 flex items-center gap-3 ${n === 2 ? 'opacity-60' : ''}`}>
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-24 mb-1.5" />
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-16" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Icon icon="solar:check-circle-bold" width={10} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Icon icon="solar:magnifer-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Natural Language Search</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stop filtering columns. Just ask. Our AI parses complex queries to find people, companies, and revenue data instantly.
              </p>
            </div>
          </div>

          {/* Feature 2: Verified SMTP Lists */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <div className="mb-8 flex-1 flex flex-col justify-center">
              <div className="space-y-2">
                {[
                  { initials: 'JM', email: 'john@acme.com', opacity: '' },
                  { initials: 'SD', email: 'sarah@corp.io', opacity: 'opacity-70' },
                  { initials: 'MK', email: 'mike@krea.ai', opacity: 'opacity-40' },
                ].map(({ initials, email, opacity }) => (
                  <div key={email} className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 ${opacity}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">{initials}</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{email}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                      <Icon icon="solar:check-circle-bold" width={12} /> SMTP OK
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Icon icon="solar:shield-check-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Verified SMTP Lists</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Create lists that actually land in the inbox. We perform real-time SMTP pings to verify validity before you export.
              </p>
            </div>
          </div>

          {/* Feature 3: Strategy-Led Outreach */}
          <div className="flex flex-col hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 bg-white dark:bg-slate-950 h-full border-slate-200 dark:border-slate-800 border rounded-2xl p-8 shadow-sm">
            <div className="flex-1 mb-8">
              <div className="text-[11px] leading-loose text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                <span className="text-indigo-500 dark:text-indigo-400">Subject:</span> Solving the {'{{strategic_challenge}}'}<br />
                Hi {'{{first_name}}'},<br />
                <span className="bg-yellow-100/50 dark:bg-yellow-900/20 text-slate-700 dark:text-slate-300 px-1 rounded">Noticed in your Q3 report that reducing CAC is a priority.</span>{' '}
                Given your goal to <span className="bg-yellow-100/50 dark:bg-yellow-900/20 text-slate-700 dark:text-slate-300 px-1 rounded">expand into EMEA</span>...
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Icon icon="solar:target-bold" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Strategy-Led Outreach</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate emails based on the strategic objectives and challenges of the company. We analyze reports to find their pain points.
              </p>
            </div>
          </div>

          {/* Feature 4: Opportunity Playbook */}
          <div className="flex flex-col hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 bg-white dark:bg-slate-950 h-full border-slate-200 dark:border-slate-800 border rounded-2xl p-8 shadow-sm">
            <div className="mb-8 flex-1">
              <div className="playbook-grid">
                {[
                  { icon: 'solar:key-minimalistic-square-linear', label: 'Openers', value: '"Saw your talk at SaaStr..."' },
                  { icon: 'solar:target-linear', label: 'Objectives', value: 'Reduce CAC by 20%' },
                  { icon: 'solar:users-group-rounded-linear', label: 'Social', value: 'Active on LinkedIn (Daily)' },
                  { icon: 'solar:case-minimalistic-linear', label: 'Experience', value: 'Ex-Salesforce VP' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="playbook-cell hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                      <Icon icon={icon} width={12} /> {label}
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Icon icon="solar:book-2-linear" width={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Opportunity Playbook</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep intelligence on every prospect. Get instant access to Sales Openers, Strategic Objectives, Social Summaries, and Experience data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
