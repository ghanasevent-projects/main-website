import Link from 'next/link'
import { MapPin, Search, Home } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <SiteShell>
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f7f4] px-4 py-16">
        <div className="max-w-md text-center">
          <p
            className="text-7xl font-bold text-[#C9973A]/20"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            404
          </p>
          <h1
            className="mt-2 text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9973A]
                         px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b8852e]"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200
                         bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition
                         hover:border-[#C9973A]/50 hover:text-[#C9973A]"
            >
              <Search className="h-4 w-4" />
              Browse events
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <Link href="/hotels" className="inline-flex items-center gap-1 hover:text-[#C9973A] transition">
              <MapPin className="h-3 w-3" />
              Hotels
            </Link>
            <Link href="/tourist-areas" className="hover:text-[#C9973A] transition">
              Tourist areas
            </Link>
            <Link href="/login" className="hover:text-[#C9973A] transition">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
