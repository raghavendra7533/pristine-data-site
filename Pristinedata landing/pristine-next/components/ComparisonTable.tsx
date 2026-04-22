import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const rows = [
  { feature: 'Database Size', pristine: '700M+ Contacts', traditional: '~250M Contacts' },
  { feature: 'Data Accuracy', pristine: '90% Verified', traditional: '~70% Verified' },
  { feature: 'Search Engine', pristine: 'Natural Language AI', traditional: 'Filter Columns' },
  { feature: 'Enrichment Cost', pristine: 'All-in-one Platform', traditional: 'ZoomInfo + Clay + OpenAI + Instantly' },
]

export function ComparisonTable() {
  return (
    <section className="bg-white dark:bg-slate-950 pt-24 pb-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">Why the top 1% choose Pristine</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Don&apos;t settle for stale databases or fragmented tools.</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-950">
          <div className="grid grid-cols-2 md:grid-cols-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <div className="hidden md:flex p-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider items-center">Feature</div>
            <div className="col-span-1 p-5 bg-slate-50 dark:bg-slate-900 border-r md:border-x border-slate-200 dark:border-slate-800 flex items-center">
              <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={80} height={24} className="h-6 w-auto dark:hidden" />
              <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={80} height={24} className="h-6 w-auto hidden dark:block" />
            </div>
            <div className="col-span-1 p-5 flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500">Traditional Stack</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map(({ feature, pristine, traditional }) => (
              <div key={feature} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <div className="px-5 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider md:hidden">{feature}</div>
                <div className="grid grid-cols-2 md:grid-cols-3">
                  <div className="hidden md:flex p-5 text-sm font-medium text-slate-700 dark:text-slate-300 items-center">{feature}</div>
                  <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 border-r md:border-x border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <Icon icon="solar:check-circle-bold" width={18} /> {pristine}
                    </div>
                  </div>
                  <div className="p-4 md:p-5 text-sm text-slate-500 dark:text-slate-500">
                    <div className="flex gap-2 items-center">
                      <Icon icon="solar:close-circle-linear" className="text-slate-300 dark:text-slate-600 flex-shrink-0" width={18} />
                      {traditional}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/contact-us"
            className="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-none transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            Book a Custom Demo
            <Icon icon="solar:arrow-right-linear" width={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
