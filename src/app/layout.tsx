import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Fraunces, Geist, Instrument_Serif } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { SmoothScroll } from '@/components/SmoothScroll'
import { site } from '@/data/site'
import 'lenis/dist/lenis.css'
import './globals.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-bricolage' })
const body = Geist({ subsets: ['latin'], variable: '--font-geist' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument' })
const thin = Fraunces({ subsets: ['latin'], weight: ['200', '300'], variable: '--font-fraunces' })

export const metadata: Metadata = {
  title: { default: `${site.fullName} — ${site.role}`, template: `%s — ${site.fullName}` },
  description: `${site.firstName} is a fresher ${site.role.toLowerCase()} who builds interfaces with care, clarity, and clean code.`,
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${thin.variable}`}>
      <body>
        <div className="page">
          <SmoothScroll />
          <RevealOnScroll />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
