// app/compare/pristine-vs-clay/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pristine vs Clay: One Platform vs. a Workflow Builder',
  description: 'Clay connects your tools. Pristine replaces them. Compare enrichment, sequencing, and pricing — and see what it actually costs to run a Clay-based stack.',
  alternates: { canonical: 'https://pristinedata.ai/compare/pristine-vs-clay' },
  openGraph: {
    title: 'Pristine vs Clay: One Platform vs. a Workflow Builder',
    description: 'Clay connects your tools. Pristine replaces them. Compare enrichment, sequencing, and pricing — and see what it actually costs to run a Clay-based stack.',
    url: 'https://pristinedata.ai/compare/pristine-vs-clay',
    siteName: 'Pristine Data AI',
    images: [{ url: 'https://pristinedata.ai/og-image.png', width: 1200, height: 630, alt: 'Pristine vs Clay' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pristine vs Clay: One Platform vs. a Workflow Builder',
    description: 'Clay connects your tools. Pristine replaces them.',
    images: ['https://pristinedata.ai/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Pristine vs Clay: One Platform vs. a Workflow Builder',
  description: 'Clay connects your tools. Pristine replaces them. Compare enrichment, sequencing, and pricing.',
  url: 'https://pristinedata.ai/compare/pristine-vs-clay',
}

const enrichmentRows = [
  ['How it works', 'Queries providers one at a time, stops at first hit', 'Queries all providers simultaneously'],
  ['Result quality', 'First available data', 'Highest-confidence data per field'],
  ['Email accuracy', 'Varies by waterfall order', 'Best source for each contact'],
  ['Credit cost', 'Per provider call until hit', 'Flat credit'],
  ['Setup required', 'You configure the waterfall logic', 'None'],
]

const featureRows = [
  ['Database coverage', '700M+ contacts', 'Aggregated from providers you configure'],
  ['Search interface', 'Natural language AI', 'Spreadsheet filters + AI query assistant'],
  ['Enrichment method', 'Parallel across all providers', 'Sequential waterfall'],
  ['Email verification', 'Real-time SMTP verification', 'Depends on provider in waterfall'],
  ['Buying signals', 'Native (job changes, funding, tech stack)', 'Paid add-on, costs credits on each refresh'],
  ['Sales intelligence', 'Opportunity Playbook (structured pre-call brief)', 'AI research agent (unstructured web search)'],
  ['Campaign builder', 'Native, integrated with prospect data', 'Native sequencer (email only, basic)'],
  ['CRM sync', 'Salesforce, HubSpot, Pipedrive', 'Salesforce, HubSpot, webhooks'],
  ['Pricing model', 'Flat monthly', 'Usage-based credits + add-ons'],
  ['Setup time', 'Log in and search', 'Configure waterfalls, connect providers, test logic'],
]

const faqs = [
  {
    q: 'Does Pristine replace Clay entirely?',
    a: "For most use cases, yes. If your team's primary use is prospect discovery, enrichment, personalization, and outreach, Pristine handles all of it natively. Clay is powerful for teams building highly custom data pipelines with proprietary first-party data. If you are using Clay primarily to wire together providers and run outbound sequences, Pristine is a more direct replacement.",
  },
  {
    q: "How does Pristine's enrichment coverage compare?",
    a: 'Pristine queries Apollo, Wiza, Explorium, and CoreSignal in parallel. The result for each contact is the highest-confidence data across all four sources. In independent testing on contact lists with cold email campaigns, parallel enrichment returns measurably better deliverability than single-source or sequential waterfall lookups.',
  },
  {
    q: 'What happens to the tools I have now?',
    a: 'Pristine integrates with Salesforce, HubSpot, Pipedrive, Smartlead, and Instantly. If you are using those today, they connect in. The tools you would typically deprecate are the standalone prospecting database, the enrichment providers you are paying per seat or per credit, and the AI research tools you use for personalization.',
  },
  {
    q: "Is Pristine's pricing really flat?",
    a: 'Yes. There is no per-credit billing for standard enrichment, signals, or campaign activity. Volume tiers exist for enterprise-scale usage, but the core platform is flat.',
  },
  {
    q: 'Can I try it before committing?',
    a: 'Yes. Book a demo and we will run Pristine against your actual ICP in real time. No curated lists, no staged data.',
  },
]

export default function PristineVsClayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6">

          {/* Hero */}
          <section className="py-20 text-center">
            <div className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-950 px-3 py-1 rounded-full mb-6">
              Pristine vs Clay
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              You hired Clay to simplify your stack. How many tools did you add to make it work?
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Clay is a workflow builder. It connects to your enrichment providers, your sequencer, your CRM, and your AI tools. When it works, it works well. But you are still paying Apollo for contacts, ZoomInfo for intent data, Smartlead or Instantly for sending, and OpenAI for writing the emails. Clay sits in the middle, routing data between subscriptions you never planned to manage.
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
              Pristine is a different decision. Prospecting, enrichment, campaign building, and sales intelligence live in one place. You log in. You search. You send. There is no waterfall to configure, no credits to budget across providers, no Zap to break on a Tuesday.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors">
                See Pristine in action
              </Link>
              <Link href="#comparison" className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500 text-sm font-semibold transition-colors">
                Compare features below
              </Link>
            </div>
          </section>

          {/* Credit Problem */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">The Credit Problem Nobody Talks About</h2>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>Clay runs on a credit system. Each enrichment call costs credits. Each signal refresh costs credits. Each Claygent query costs credits. The plan you bought tells you how many credits you get. What it does not tell you is how fast they disappear when you run a real campaign.</p>
              <p>A sales team enriching 5,000 accounts per month, running buying signal checks, and using AI research to personalize emails will blow through credits in ways that are genuinely hard to predict before you start. You can optimize. You can build conditional logic to skip enrichment when data already exists. You can use AI formulas to gate expensive lookups. All of that takes time and expertise that most teams do not have.</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">Pristine's pricing is flat. You know what you pay before the month starts. Account enrichment, contact enrichment, messaging, and outreach infrastructure are all included. No credit math. No mid-campaign surprises.</p>
            </div>
          </section>

          {/* Enrichment Architecture */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Enrichment Architecture</h2>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              <p>Clay's waterfall enrichment is genuinely clever. It queries one provider, and if that returns nothing, it moves to the next. You get higher coverage than a single-source lookup. The catch: it is sequential. The first provider to return a result wins, even if another provider would have returned a higher-confidence email or a more current phone number.</p>
              <p>Pristine runs enrichment in parallel across Apollo, Wiza, Explorium, and CoreSignal simultaneously. Every field is resolved by the highest-confidence source, not the first source to answer. You get a verified email from the provider with the best deliverability track record for that domain, not from the provider that happens to be first in your waterfall sequence.</p>
              <p>The credit cost is the same as a single-provider lookup. Pristine absorbs the provider costs.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide w-1/3"></th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Clay</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-rose-500 uppercase tracking-wide">Pristine</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichmentRows.map(([label, clay, pristine], i) => (
                    <tr key={i} className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-sm">{label}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-sm">{clay}</td>
                      <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-medium text-sm">{pristine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sales Intelligence */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sales Intelligence: Research Agent vs. Playbook</h2>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>Clay has Claygent, an AI agent that can browse the web and return answers to questions you ask about a company or a contact. You write a prompt. It returns a result. It is essentially a GPT model running searches and summarizing what it finds. Useful for research. Not structured for sales.</p>
              <p>Pristine's Opportunity Playbook is purpose-built for the sales call. Before you get on the phone, the Playbook gives you the prospect's strategic objectives, identified pain points, recommended discovery questions, competitive positioning relevant to their situation, and suggested openers tied to things they have actually said publicly. The output is not a summary of the internet. It is a structured pre-call brief.</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">The difference is intent. Claygent surfaces information. The Opportunity Playbook tells you what to do with it.</p>
            </div>
          </section>

          {/* The Stack */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">The Stack You Are Actually Running</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Most teams using a workflow-based enrichment tool are running at least five paid subscriptions alongside it:
            </p>
            <ul className="space-y-2 pl-5 list-disc marker:text-rose-500 text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              <li>A database for contact and company search</li>
              <li>One or two enrichment providers for email and phone coverage</li>
              <li>An intent data platform for buying signals</li>
              <li>A sequencer for email delivery</li>
              <li>An AI tool for personalization and copy</li>
            </ul>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              That is before your CRM, your calling tool, your LinkedIn Sales Navigator seat, and your analytics layer.
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Pristine replaces prospecting, enrichment, buying signals, campaign building, and outreach sequencing. The integrations you keep (Salesforce, HubSpot, Smartlead, Instantly) connect in without custom logic.
            </p>
            <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              The average B2B sales team running a fragmented stack spends significantly more than $860/month before headcount. That is roughly where Pristine's base pricing starts, with the full platform included.
            </p>
          </section>

          {/* Feature Comparison */}
          <section id="comparison" className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Feature Comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide w-1/3"></th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-rose-500 uppercase tracking-wide">Pristine</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Clay</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map(([label, pristine, clay], i) => (
                    <tr key={i} className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-sm">{label}</td>
                      <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-medium text-sm">{pristine}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-sm">{clay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Who Switches */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Who Switches to Pristine</h2>
            <div className="space-y-6">
              {[
                {
                  role: 'SDR managers running volume outbound',
                  body: 'who are tired of debugging waterfall configurations and reconciling credit usage against campaign budgets. Pristine is not simpler because it has fewer features. It is simpler because everything is in one place.',
                },
                {
                  role: 'Sales leaders building signal-based plays',
                  body: "who need buying signals and account intelligence without bolting on another vendor. Pristine's watchlist surfaces job changes, funding rounds, and technology adoption in the platform, with direct pipeline action built in.",
                },
                {
                  role: 'RevOps teams consolidating the stack',
                  body: 'who are auditing what each tool actually costs per closed deal and finding the answer uncomfortable. Tool consolidation is one of the most concrete ROI cases Pristine makes.',
                },
              ].map(({ role, body }) => (
                <div key={role} className="flex gap-4">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{role}</span> {body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{q}</h3>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 border-t border-slate-100 dark:border-slate-800 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to stop managing a stack and start closing pipeline?
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Pristine is a single platform for prospecting, enrichment, and outreach. There is nothing to configure before your first search.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors">
                Book a demo
              </Link>
              <Link href="/stack-audit" className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500 text-sm font-semibold transition-colors">
                See pricing
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
