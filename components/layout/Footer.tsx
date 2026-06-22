import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { showCreateEventsNav } from '@/lib/roles'

const FOOTER_COLUMNS = [
  {
    heading: 'Use GhanasEvent',
    links: [
      { label: 'Create Events',     href: '/organiser/events/create', organiserOnly: true },
      { label: 'Pricing',           href: '/pricing', organiserOnly: true },
      { label: 'Event Ticketing',   href: '/how-it-works' },
      { label: 'QR Code Check-In',  href: '/how-it-works#checkin' },
      { label: 'Organiser Hub',     href: '/organiser/dashboard', organiserOnly: true },
      { label: 'Event Management',  href: '/organiser/dashboard', organiserOnly: true },
      { label: 'FAQs',              href: '/faqs' },
      { label: 'Sitemap',           href: '/sitemap.xml' },
    ],
  },
  {
    heading: 'Plan Events',
    organiserOnly: true,
    links: [
      { label: 'Sell Tickets Online',   href: '/organiser/events/create', organiserOnly: true },
      { label: 'Event Registration',    href: '/organiser/events/create', organiserOnly: true },
      { label: 'Free Events',           href: '/events?price=free' },
      { label: 'Online Events',         href: '/events' },
      { label: 'Music Events',          href: '/events?category=music' },
      { label: 'Business Events',       href: '/events?category=business' },
      { label: 'Food & Drink Events',   href: '/events?category=food-drink' },
      { label: 'Community Events',      href: '/events?category=community' },
    ],
  },
  {
    heading: 'Find Events',
    links: [
      { label: 'Accra Events',          href: '/events?city=Accra&region=Greater+Accra' },
      { label: 'Kumasi Events',         href: '/events?city=Kumasi&region=Ashanti' },
      { label: 'Tamale Events',         href: '/events?city=Tamale&region=Northern' },
      { label: 'Takoradi Events',       href: '/events?city=Takoradi&region=Western' },
      { label: 'Cape Coast Events',     href: '/events?city=Cape Coast&region=Central' },
      { label: 'Ho Events',             href: '/events?city=Ho&region=Volta' },
      { label: 'Koforidua Events',      href: '/events?city=Koforidua&region=Eastern' },
      { label: 'Tema Events',           href: '/events?city=Tema&region=Greater+Accra' },
    ],
  },
  {
    heading: 'For Attendees',
    links: [
      { label: 'Browse Events',    href: '/events' },
      { label: 'Free Events',      href: '/events?price=free' },
      { label: 'Saved Events',     href: '/saved' },
      { label: 'My Tickets',       href: '/attendee/tickets' },
      { label: 'My Account',       href: '/account' },
      { label: 'Hotels',           href: '/hotels' },
      { label: 'Tourist Areas',    href: '/tourist-areas' },
      { label: 'How It Works',     href: '/how-it-works' },
    ],
  },
  {
    heading: 'Connect With Us',
    links: [
      { label: 'Contact Support', href: '/contact' },
      { label: 'About Us',        href: '/about' },
      { label: 'Blog',            href: '/blog' },
      { label: 'Developer API',   href: '/developer', organiserOnly: true },
      { label: 'Careers',         href: '/careers', organiserOnly: true },
      { label: 'Facebook',        href: 'https://facebook.com' },
      { label: 'Instagram',       href: 'https://instagram.com' },
      { label: 'Twitter / X',     href: 'https://twitter.com' },
    ],
  },
]

const LEGAL_LINKS = [
  { label: 'Community Guidelines', href: '/community-guidelines' },
  { label: 'Privacy',      href: '/privacy' },
  { label: 'Terms',        href: '/terms' },
  { label: 'Cookies',      href: '/cookies' },
  { label: 'Refund Policy',href: '/refunds' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing',      href: '/pricing' },
  { label: 'Contact',      href: '/contact' },
]

export default async function Footer() {
  const year = new Date().getFullYear()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  const showOrganiserLinks = showCreateEventsNav(role, Boolean(user))

  const columns = FOOTER_COLUMNS.map(col => ({
    ...col,
    links: col.links.filter(link => !link.organiserOnly || showOrganiserLinks),
  })).filter(col => !col.organiserOnly || showOrganiserLinks)

  return (
    <footer className="bg-[#1c1c3a] text-gray-400">

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-white">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-3 md:flex-row">

          <p className="text-xs text-gray-600 order-2 md:order-1">
            {`© ${year} GhanasEvent.com`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 order-1 md:order-2">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition">
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-gray-700 text-xs">·</span>
                )}
              </span>
            ))}
          </div>

          <p className="order-3 inline-flex items-center text-xs text-gray-600" aria-label="Ghana flag">
            <Image
              src="/flags/ghana.svg"
              alt="Ghana flag"
              width={18}
              height={14}
              className="h-3.5 w-4.5 rounded-xs object-cover"
            />
          </p>

        </div>
      </div>

    </footer>
  )
}
