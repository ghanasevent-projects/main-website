import type { Metadata } from 'next'
import { Syne, Epilogue } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ghanasevent.com'),
  title: {
    default: 'GhanasEvent — Discover Events in Ghana',
    template: '%s | GhanasEvent',
  },
  description: 'Find events in Ghana, buy tickets, explore Ghana and its events across all regions.',
  openGraph: {
    siteName: 'GhanasEvent',
    locale: 'en_GH',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${epilogue.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-T986R0ZZVV"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T986R0ZZVV');
        `}
      </Script>
    </html>
  )
}