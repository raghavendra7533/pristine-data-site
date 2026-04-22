import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'GTM Stack Audit',
  description: 'Audit your current GTM stack and discover how much you could save with Pristine Data AI.',
  alternates: { canonical: 'https://pristinedata.ai/stack-audit' },
  openGraph: { title: 'GTM Stack Audit | Pristine Data AI', description: 'Audit your GTM stack.', url: 'https://pristinedata.ai/stack-audit', siteName: 'Pristine Data AI', images: [{ url: '/og-image.png', width: 1200, height: 630 }], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'GTM Stack Audit | Pristine Data AI', description: 'Audit your GTM stack.', images: ['/og-image.png'] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
