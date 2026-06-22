'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import NavAuthSection from './NavAuthSection'
import LocationPicker from './LocationPicker'
import NavbarSearch from './NavbarSearch'
import { SiteLogo } from '@/components/brand/SiteLogo'
import { POPULAR_CITIES, buildEventsLocationUrl } from '@/lib/ghana-locations'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { showCreateEventsNav } from '@/lib/roles'

const BASE_NAV_LINKS = [
  { label: 'Find Events', href: '/events' },
  { label: 'Create Events', href: '/organiser/events/create', organiserOnly: true },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Tourist Areas', href: '/tourist-areas' },
]

const navLinkClass =
  'whitespace-nowrap text-sm font-medium text-gray-900 transition hover:text-gray-600'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const { role, isLoggedIn, loading } = useUserRole()

  const navLinks = BASE_NAV_LINKS.filter(link =>
    !link.organiserOnly || loading || showCreateEventsNav(role, isLoggedIn),
  )

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

          <SiteLogo size="md" priority />

          {/* Eventbrite-style combined search + location bar */}
          <div className="hidden w-full max-w-md shrink sm:block lg:max-w-lg">
            <NavbarSearch />
          </div>

          {/* Nav links + auth — aligned right like Eventbrite */}
          <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
            <NavAuthSection />
          </div>

          {/* Tablet / mobile controls */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
            <div className="hidden sm:block">
              <NavAuthSection />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200
                         text-gray-600 transition hover:bg-gray-50"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* Mobile: full-width search bar below logo row */}
        <div className="border-t border-gray-100 px-4 py-2 sm:hidden">
          <NavbarSearch compact />
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-72 overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <SiteLogo size="sm" href="/" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="border-b border-gray-100 px-4 py-4">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Your Location
              </p>
              <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />}>
                <LocationPicker variant="field" />
              </Suspense>
            </div>

            <div className="px-4 py-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Menu
              </p>
              <nav className="space-y-0.5">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-gray-100 px-4 py-4">
              <button
                type="button"
                onClick={() => setCitiesOpen(v => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Browse by City</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${citiesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {citiesOpen && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {POPULAR_CITIES.map((city) => (
                    <Link
                      key={city.name}
                      href={buildEventsLocationUrl(city.name, city.region)}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 px-4 py-4 pb-8 sm:hidden">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Account
              </p>
              <NavAuthSection variant="inline" onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
