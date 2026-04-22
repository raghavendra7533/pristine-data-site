import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { StatsSection } from '@/components/StatsSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { ComparisonTable } from '@/components/ComparisonTable'

export const metadata: Metadata = {
  title: 'Pristine Data AI - The All-in-One GTM Platform',
  description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts. Stop paying for ZoomInfo, Amplemarket, and OpenAI separately.',
  alternates: { canonical: 'https://pristinedata.ai' },
  openGraph: {
    title: 'Pristine Data AI - The All-in-One GTM Platform',
    description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts.',
    url: 'https://pristinedata.ai',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Pristine Data AI' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pristine Data AI - The All-in-One GTM Platform',
    description: 'Find prospects, enrich data, and run outreach — all in one place. 700M+ verified contacts.',
    images: ['/og-image.png'],
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Pristine Data AI',
            applicationCategory: 'BusinessApplication',
            description: 'The all-in-one GTM platform with 700M+ verified contacts, AI-powered search, and automated outreach.',
            url: 'https://pristinedata.ai',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <ComparisonTable />
      </main>
      <Footer />
    </>
  )
}
