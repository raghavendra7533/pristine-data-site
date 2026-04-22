// app/blog/page.tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BlogCard } from '@/components/blog/BlogCard'
import { blogs } from '@/lib/blogs'

export const metadata: Metadata = {
  title: 'GTM & B2B Sales Insights',
  description: 'Practical thinking on go-to-market strategy, B2B sales, and buyer alignment — from the Pristine Data AI team and industry contributors.',
  alternates: { canonical: 'https://pristinedata.ai/blog' },
  openGraph: {
    title: 'GTM & B2B Sales Insights | Pristine Data AI',
    description: 'Practical thinking on go-to-market strategy, B2B sales, and buyer alignment.',
    url: 'https://pristinedata.ai/blog',
    siteName: 'Pristine Data AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Pristine Data AI Blog' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTM & B2B Sales Insights | Pristine Data AI',
    description: 'Practical thinking on go-to-market strategy, B2B sales, and buyer alignment.',
    images: ['/og-image.png'],
  },
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'GTM & B2B Sales Insights',
  url: 'https://pristinedata.ai/blog',
  numberOfItems: blogs.length,
  itemListElement: blogs.map((post, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://pristinedata.ai/blog/${post.slug}`,
    name: post.title,
  })),
}

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Navbar />
      <main>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              GTM & B2B Sales Insights
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Practical thinking on go-to-market strategy, B2B sales, and buyer alignment — from the Pristine Data AI team and industry contributors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
