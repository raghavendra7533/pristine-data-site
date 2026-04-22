// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogCard } from '@/components/blog/BlogCard'
import { blogs, getBlogBySlug, getRelatedPosts } from '@/lib/blogs'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogBySlug(slug)
  if (!post) return {}

  const url = `https://pristinedata.ai/blog/${post.slug}`
  const absoluteImage = `https://pristinedata.ai${post.image}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'Pristine Data AI',
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: post.title }],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [absoluteImage],
    },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = getBlogBySlug(slug)
  if (!post) return notFound()

  const related = getRelatedPosts(slug, 3)

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://pristinedata.ai/blog/${post.slug}`,
    image: `https://pristinedata.ai${post.image}`,
    author: {
      '@type': 'Organization',
      name: 'Pristine Data AI',
      url: 'https://pristinedata.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pristine Data AI',
      url: 'https://pristinedata.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pristinedata.ai/images/pristine-data-logo.svg',
      },
    },
  }

  // Separate body sections from CTA (last section)
  const bodySections = post.sections.slice(0, -1)
  const ctaSection = post.sections[post.sections.length - 1]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main>
        {/* Article header */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="mb-4">
            <Link
              href="/blog"
              className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ← All articles
            </Link>
          </div>
          <time className="text-sm text-slate-400 dark:text-slate-500" dateTime={post.date}>
            {formattedDate}
          </time>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
            {post.title}
          </h1>
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 896px) 832px, 100vw"
            />
          </div>

          {/* Article body */}
          <BlogContent sections={bodySections} />

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 text-center">
            {ctaSection.heading && (
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                {ctaSection.heading}
              </h2>
            )}
            {ctaSection.body?.map((para, i) => (
              <p key={i} className="text-slate-500 dark:text-slate-400 mb-6">
                {para}
              </p>
            ))}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/try-it"
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
              >
                Take a Tour
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500 text-sm font-semibold transition-colors"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-8">
              More articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
