import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pristinedata.ai'),
  title: {
    default: 'Pristine Data AI - The All-in-One GTM Platform',
    template: '%s | Pristine Data AI',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable}`} suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 overflow-x-hidden selection:bg-rose-100 selection:text-rose-900 dark:selection:bg-indigo-900 dark:selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>

        <Script
          id="warmly-script-loader"
          src="https://opps-widget.getwarmly.com/warmly.js?clientId=ff085db792eda57552e92a30070b59cc"
          strategy="afterInteractive"
        />
        <Script id="reb2b" strategy="afterInteractive">{`
          !function(key) {
            if (window.reb2b) return;
            window.reb2b = {loaded: true};
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";
            document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
          }("961Y0HXR7RNG");
        `}</Script>
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vwjincq9ud");
        `}</Script>
      </body>
    </html>
  )
}
