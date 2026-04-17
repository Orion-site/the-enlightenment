import type { Metadata } from 'next'
import { Cormorant_Garamond, Libre_Baskerville } from 'next/font/google'
import '@/styles/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
// MetaPixel self-disables when NEXT_PUBLIC_META_PIXEL_ID is not set
import MetaPixel from '@/components/MetaPixel'
import PageTransition from '@/components/PageTransition'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://the-enlightenment.salon'),
  title: {
    template: '%s | The Enlightenment',
    default: "The Enlightenment — Madrid's Private Gentlemen's Network",
  },
  description: 'A private network for gentlemen who lead. Madrid.',
  openGraph: {
    type: 'website',
    siteName: 'The Enlightenment',
    title: "The Enlightenment — Madrid's Private Gentlemen's Network",
    description: 'A private network for gentlemen who lead. Madrid.',
    images: [{ url: '/te-1.jpeg', width: 1200, height: 630, alt: 'The Enlightenment' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${baskerville.variable}`}>
      <body>
        <MetaPixel />
        <Nav />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}
