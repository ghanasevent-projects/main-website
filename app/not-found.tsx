import Link from 'next/link'
import { MapPin, Search, Home, Ticket, Hotel, Globe, ArrowRight } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = { title: 'Page not found – GhanasEvent' }

const QUICK_LINKS = [
  { label: 'Browse Events',  href: '/events',        icon: Search },
  { label: 'Hotels',         href: '/hotels',         icon: Hotel },
  { label: 'Tourist Areas',  href: '/tourist-areas',  icon: Globe },
  { label: 'My Tickets',     href: '/attendee/tickets', icon: Ticket },
]

export default function NotFound() {
  return (
    <SiteShell>
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f8f7f4] px-4 py-20">
        <div className="w-full max-w-lg text-center">

          {/* Visual */}
          <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-[#C9973A]/10">
            <span className="text-6xl" role="img" aria-label="Lost">🗺️</span>
            <span
              className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9973A] text-xs font-bold text-white shadow"
            >
              404
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            You seem lost
          </h1>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            This page doesn&apos;t exist or may have been moved.<br />
            Let&apos;s get you back on the map.
          </p>

          {/* Primary actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9973A]
                         px-6 py-3 text-sm font-semibold text-white shadow-sm transition
                         hover:bg-[#b8852e] active:scale-95"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200
                         bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition
                         hover:border-[#C9973A]/50 hover:text-[#C9973A] active:scale-95"
            >
              <Search className="h-4 w-4" />
              Browse events
            </Link>
          </div>

          {/* Quick links grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200
                           bg-white px-3 py-4 text-xs font-medium text-gray-600 transition
                           hover:border-[#C9973A]/40 hover:text-[#C9973A] hover:shadow-sm"
              >
                <Icon className="h-5 w-5 text-gray-400 transition group-hover:text-[#C9973A]" />
                {label}
              </Link>
            ))}
          </div>

          {/* Help link */}
          <p className="mt-8 text-xs text-gray-400">
            Something broken?{' '}
            <Link
              href="/contact"
              className="inline-flex items-center gap-0.5 text-[#C9973A] hover:underline"
            >
              Let us know <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </main>
    </SiteShell>
  )
}
