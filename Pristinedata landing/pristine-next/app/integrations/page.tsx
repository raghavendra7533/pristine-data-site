import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Connect Pristine Data AI with Salesforce, HubSpot, Instantly, Smartlead, Warmly, and more. Native integrations that sync leads and automate outreach.',
  alternates: { canonical: 'https://pristinedata.ai/integrations' },
  openGraph: {
    title: 'Integrations | Pristine Data AI',
    description: 'Connect Pristine Data AI with your existing stack.',
    url: 'https://pristinedata.ai/integrations',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Integrations | Pristine Data AI',
    description: 'Connect Pristine Data AI with your existing stack.',
    images: ['/og-image.png'],
  },
}

const crmIntegrations = [
  { name: 'Salesforce', logo: 'https://img.logo.dev/salesforce.com?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: 'Bi-directional sync with Salesforce. Push verified leads directly to your CRM and pull account data for enrichment.' },
  { name: 'HubSpot', logo: 'https://img.logo.dev/hubspot.com?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: 'Native HubSpot integration. Sync contacts, companies, and deals automatically. Trigger workflows from Pristine events.' },
  { name: 'Zoho CRM', logo: 'https://img.logo.dev/zoho.com?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: 'Full Zoho CRM compatibility. Import/export leads, sync contact records, and automate lead scoring workflows.' },
]

const outreachIntegrations = [
  { name: 'Instantly', logo: 'https://img.logo.dev/instantly.ai?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: 'Send verified leads directly to Instantly campaigns. Automatic list syncing and real-time deliverability monitoring.' },
  { name: 'Smartlead', logo: 'https://img.logo.dev/smartlead.ai?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: 'Push leads to Smartlead sequences with one click. Unified inbox sync and campaign performance tracking.' },
]

const inboundIntegrations = [
  { name: 'Warmly', logo: 'https://img.logo.dev/warmly.ai?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: "Identify and enrich anonymous website visitors. Match Warmly's intent signals with Pristine's verified contact data for immediate follow-up." },
  { name: 'RB2B', logo: 'https://img.logo.dev/rb2b.com?token=pk_R0FhQgSqRMmR86Lw1NOJNg', description: "Turn anonymous site traffic into person-level leads. Pipe RB2B's identified visitors directly into Pristine for instant enrichment and outreach." },
]

function IntegrationCard({ name, logo, description }: { name: string; logo: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={name} className="w-8 h-8 object-contain rounded-lg" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">{name}</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">Live</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

function SectionHeader({ icon, iconColor, title }: { icon: string; iconColor: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
        <Icon icon={icon} width={16} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-10 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <div className="inline-flex gap-1.5 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border rounded-full mb-6 px-3 py-1 shadow-sm items-center">
                <Icon icon="solar:plug-circle-bold" className="text-indigo-500" width={14} />
                <span className="text-[10px] uppercase dark:text-slate-300 font-semibold text-slate-600 tracking-wider">Native Integrations</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-950 dark:text-white tracking-tighter mb-4">Seamless Integrations</h1>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Connect Pristine Data to your existing stack. Sync leads, automate outreach, and keep your CRM updated in real-time.
              </p>
            </div>

            <div className="mb-16">
              <SectionHeader icon="solar:database-linear" iconColor="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" title="CRM Integrations" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {crmIntegrations.map((i) => <IntegrationCard key={i.name} {...i} />)}
              </div>
            </div>

            <div className="mb-16">
              <SectionHeader icon="solar:plain-linear" iconColor="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" title="Outreach Platforms" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {outreachIntegrations.map((i) => <IntegrationCard key={i.name} {...i} />)}
              </div>
            </div>

            <div className="mb-16">
              <SectionHeader icon="solar:radar-2-linear" iconColor="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400" title="Inbound Intelligence" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {inboundIntegrations.map((i) => <IntegrationCard key={i.name} {...i} />)}
              </div>
            </div>

            <div className="text-center py-12 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">More Integrations Coming Soon</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">We&apos;re constantly adding new integrations. Let us know what you need.</p>
              <Link href="/contact-us" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/10 dark:shadow-none">
                Request an Integration
                <Icon icon="solar:arrow-right-linear" width={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
