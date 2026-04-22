import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={100} height={28} className="h-7 w-auto dark:hidden" />
          <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={100} height={28} className="h-7 w-auto hidden dark:block" />
        </div>
        <div className="flex gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-200">Product</Link>
          <Link href="/integrations" className="hover:text-slate-700 dark:hover:text-slate-200">Integrations</Link>
          <Link href="/about-us" className="hover:text-slate-700 dark:hover:text-slate-200">About</Link>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">© 2026 Pristine Inc.</div>
      </div>
    </footer>
  )
}
