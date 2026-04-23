'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTheme } from './ThemeProvider'

export function Navbar() {
  const { toggle, theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-300 top-0 glass-nav bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <Image src="/assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto dark:hidden" />
              <Image src="/assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" width={120} height={32} className="h-8 w-auto hidden dark:block" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Product</Link>
              <Link href="/integrations" className="hover:text-slate-900 dark:hover:text-white transition-colors">Integrations</Link>
              <Link href="/about-us" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen
                ? <Icon icon="solar:close-linear" width={20} />
                : <Icon icon="solar:hamburger-menu-linear" width={20} />}
            </button>
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
            >
              {theme === 'dark'
                ? <Icon icon="solar:sun-2-linear" width={16} />
                : <Icon icon="solar:moon-linear" width={16} />}
            </button>
            <Link
              href="/stack-audit"
              className="hidden md:block px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative"
              style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #F43F5E, #6366f1) border-box', border: '1.5px solid transparent', color: '#0f172a' }}
            >
              Free GTM Stack Audit
            </Link>
            <Link
              href="/contact-us"
              className="hidden md:block px-3.5 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden">
          <div className="px-6 py-6 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-slate-800">Product</Link>
            <Link href="/integrations" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-3 border-b border-slate-100 dark:border-slate-800">Integrations</Link>
            <Link href="/about-us" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-3 border-b border-slate-100 dark:border-slate-800">About</Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/stack-audit" onClick={() => setMobileOpen(false)} className="w-full text-center block py-3 text-sm font-semibold rounded-xl" style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #F43F5E, #6366f1) border-box', border: '1.5px solid transparent', color: '#0f172a' }}>Free GTM Stack Audit</Link>
              <Link href="/contact-us" className="w-full text-center block py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl">Book a Demo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
