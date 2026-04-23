import Image from 'next/image'
import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '/' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Stack Audit', href: '/stack-audit' },
  ],
  Compare: [
    { label: 'vs Clay', href: '/compare/pristine-vs-clay' },
    { label: 'vs ZoomInfo', href: '/compare/zoominfo' },
    { label: 'vs Apollo', href: '/compare/apollo' },
    { label: 'vs Amplemarket', href: '/compare/amplemarket' },
  ],
  Company: [
    { label: 'About', href: '/about-us' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4 items-start">
          <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto dark:hidden" />
          <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto hidden dark:block" />
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-[200px]">
            The all-in-one GTM platform for sales teams that want to win.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{group}</p>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-slate-400 dark:text-slate-500">© 2026 Pristine Inc. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500">
          <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
