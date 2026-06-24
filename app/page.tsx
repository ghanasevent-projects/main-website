import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  ChevronRight, Music2, Briefcase, Globe2, Theater, Heart,
  Cpu, UtensilsCrossed, Trophy, Martini, GraduationCap,
  Film, Shirt, Home, Star, Users, Gift, Gamepad2,
  ArrowRight, CalendarCheck, TicketCheck, MapPinned,
  Car, HeartHandshake, Landmark, Activity, Church,
  Ticket, Zap, BadgeCheck, Shield,
} from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import HeroSlider from '@/components/home/HeroSlider'
import HomeDestinations from '@/components/home/HomeDestinations'
import QuickDiscovery from '@/components/home/QuickDiscovery'
import TrendingTicker from '@/components/home/TrendingTicker'
import EventCard  from '@/components/events/EventCard'
import HorizontalScrollRow from '@/components/ui/HorizontalScrollRow'
import type { HotelListing } from '@/components/hotels/HotelCard'
import { getSavedEventIds, getFollowingFeedEvents } from '@/lib/social'
import { showCreateEventsNav } from '@/lib/roles'
import { ICON_STROKE_WIDTH } from '@/lib/icons'


const CAT_ICONS: Record<string, React.ReactNode> = {
  'music':                    <Music2          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'nightlife':                <Martini         size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'film-media':               <Film            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'film_media':               <Film            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'film-&-media':             <Film            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'performing-visual-arts':   <Theater         size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'performing_visual_arts':   <Theater         size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'arts-culture':             <Theater         size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'business':                 <Briefcase       size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'science-tech':             <Cpu             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'science_tech':             <Cpu             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'science-&-tech':           <Cpu             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'government':               <Landmark        size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'food-drink':               <UtensilsCrossed size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'food_drink':               <UtensilsCrossed size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'food-&-drink':             <UtensilsCrossed size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'health':                   <Activity        size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'sports-fitness':           <Trophy          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'sports_fitness':           <Trophy          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'home-lifestyle':           <Home            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'home_lifestyle':           <Home            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'home-&-lifestyle':         <Home            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'fashion':                  <Shirt           size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'community':                <Users           size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'charity-causes':           <HeartHandshake  size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'charity_causes':           <HeartHandshake  size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'charity-&-causes':         <HeartHandshake  size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'spirituality':             <Church          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'religion':                 <Church          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'family-education':         <GraduationCap   size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'family_education':         <GraduationCap   size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'family-&-education':       <GraduationCap   size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'dating':                   <Heart           size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'hobbies':                  <Gamepad2        size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'holidays':                 <Gift            size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'travel-outdoor':           <Globe2          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'travel_outdoor':           <Globe2          size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'auto-boat-air':            <Car             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'auto_boat_air':            <Car             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
  'auto-boat-&-air':          <Car             size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />,
}

function getCatIcon(slug: string): React.ReactNode {
  const key = slug.toLowerCase().trim()
  return CAT_ICONS[key] ?? CAT_ICONS[key.replace(/-/g, '_')] ?? (
    <Star size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-900" />
  )
}

// Category pill shared between mobile and desktop
function CategoryPill({
  cat,
  size = 'md',
}: {
  cat: { id: string; name: string; slug: string; icon: string | null }
  size?: 'sm' | 'md'
}) {
  const circleClass =
    size === 'sm'
      ? 'flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition group-hover:border-gray-300 group-hover:shadow-sm'
      : 'flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition group-hover:border-gray-300 group-hover:shadow-sm'

  const labelClass =
    size === 'sm'
      ? 'max-w-[64px] text-center text-[10px] font-medium leading-tight text-gray-600 transition group-hover:text-gray-900'
      : 'max-w-[80px] text-center text-[11px] font-medium leading-tight text-gray-600 transition group-hover:text-gray-900'

  return (
    <Link
      href={`/events?category=${cat.slug}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className={circleClass}>{getCatIcon(cat.slug)}</div>
      <span className={labelClass}>{cat.name}</span>
    </Link>
  )
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featuredEvents }, { data: rawCategories }] = await Promise.all([
    supabase
      .from('events')
      .select(`
        id, slug, title, description,
        venue_name, city, region,
        start_date, end_date,
        banner_url, is_free,
        promoted_until, promotion_tier,
        category:categories(id, name, slug, icon),
        ticket_types(price)
      `)
      .eq('status', 'approved')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(20),
    supabase
      .from('categories')
      .select('id, name, slug, icon')
      .order('name'),
  ])

  // Hard-cap at 10 on the server side regardless of DB limit behaviour
  const categories = (rawCategories ?? []).slice(0, 10)

  // Sort: active promotions first (longer remaining time wins), then by start_date
  const now = Date.now()
  const sortedEvents = (featuredEvents ?? []).slice().sort((a, b) => {
    const aPromoted = a.promoted_until && new Date(a.promoted_until).getTime() > now
    const bPromoted = b.promoted_until && new Date(b.promoted_until).getTime() > now
    if (aPromoted && !bPromoted) return -1
    if (!aPromoted && bPromoted) return 1
    if (aPromoted && bPromoted) {
      // Longer remaining promotion wins
      return new Date(b.promoted_until).getTime() - new Date(a.promoted_until).getTime()
    }
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  }).slice(0, 10)

  const eventCities = Array.from(
    new Set((featuredEvents ?? []).map(e => e.city).filter((c): c is string => Boolean(c)))
  )
  const eventRegions = Array.from(
    new Set((featuredEvents ?? []).map(e => e.region).filter((r): r is string => Boolean(r)))
  )

  const touristCityQuery = eventCities.length > 0
    ? supabase
        .from('tourist_areas')
        .select('id, name, description, city, region, image_url, category, entry_fee, latitude, longitude')
        .eq('is_active', true)
        .in('city', eventCities)
        .limit(8)
    : null

  const hotelCityQuery = eventCities.length > 0
    ? supabase
        .from('hotels')
        .select('id, name, description, address, city, region, price_range, phone, website, image_url, amenities, latitude, longitude')
        .eq('is_active', true)
        .in('city', eventCities)
        .limit(8)
    : null

  const [{ data: cityTouristAreas }, { data: cityHotels }] = await Promise.all([
    touristCityQuery ?? Promise.resolve({ data: [] as any[] }),
    hotelCityQuery ?? Promise.resolve({ data: [] as HotelListing[] }),
  ])

  const needTouristFallback = !(cityTouristAreas && cityTouristAreas.length > 0)
  const needHotelFallback = !(cityHotels && cityHotels.length > 0)

  const touristRegionQuery = needTouristFallback && eventRegions.length > 0
    ? supabase
        .from('tourist_areas')
        .select('id, name, description, city, region, image_url, category, entry_fee, latitude, longitude')
        .eq('is_active', true)
        .in('region', eventRegions)
        .limit(8)
    : null

  const hotelRegionQuery = needHotelFallback && eventRegions.length > 0
    ? supabase
        .from('hotels')
        .select('id, name, description, address, city, region, price_range, phone, website, image_url, amenities, latitude, longitude')
        .eq('is_active', true)
        .in('region', eventRegions)
        .limit(8)
    : null

  const [{ data: regionTouristAreas }, { data: regionHotels }] = await Promise.all([
    touristRegionQuery ?? Promise.resolve({ data: [] as any[] }),
    hotelRegionQuery ?? Promise.resolve({ data: [] as HotelListing[] }),
  ])

  const touristAreas = (cityTouristAreas && cityTouristAreas.length > 0)
    ? cityTouristAreas
    : (regionTouristAreas ?? [])

  const nearbyHotels: HotelListing[] = (cityHotels && cityHotels.length > 0)
    ? cityHotels
    : (regionHotels ?? [])

  const { data: { user } } = await supabase.auth.getUser()

  let userRole: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role ?? null
  }
  const showCreateEvents = showCreateEventsNav(userRole, Boolean(user))

  const [savedIds, followingFeed] = await Promise.all([
    getSavedEventIds(),
    getFollowingFeedEvents(5),
  ])

  return (
    <SiteShell>
    <div className="min-h-screen bg-white text-gray-900">
      <HeroSlider />

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">

          {/* ── Mobile & tablet: horizontal scroll (grid from md+) */}
          <div className="md:hidden">
            <HorizontalScrollRow
              hideArrowsFrom="md"
              wrapperClassName="-mx-2 px-2"
              className="flex gap-5 overflow-x-auto pb-2"
            >
              {categories.map(cat => (
                <div key={cat.id} className="shrink-0">
                  <CategoryPill cat={cat} size="sm" />
                </div>
              ))}
            </HorizontalScrollRow>
          </div>

          {/* ── Desktop: exactly 5 per row, max 2 rows = 10 (hidden below md) */}
          <div className="hidden md:grid md:grid-cols-5 md:gap-x-4 md:gap-y-4 lg:grid-cols-10 lg:gap-x-2">
            {categories.map(cat => (
              <CategoryPill key={cat.id} cat={cat} size="md" />
            ))}
          </div>

        </div>
      </section>

      {/* ── TRENDING TICKER ─────────────────────────────────────── */}
      <TrendingTicker />

      <QuickDiscovery />

      {/* ── FROM ORGANISERS YOU FOLLOW ──────────────────────────── */}
      {followingFeed.length > 0 && (
        <section className="border-b border-gray-100 bg-[#fdfbf7] px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between sm:mb-8">
              <div>
                <h2
                  className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  From organisers you follow
                </h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Fresh events from people you're following
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4
                            sm:grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            xl:grid-cols-5">
              {followingFeed.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAuthed={Boolean(user)}
                  isSaved={savedIds.has(event.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ─────────────────────────────────────── */}
      <section className="bg-white px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">

          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <div>
              <h2
                className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Upcoming events
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Don't miss what's happening across Ghana
              </p>
            </div>
            <Link
              href="/events"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold
                         text-gold hover:underline underline-offset-2 sm:text-sm"
            >
              See all <ChevronRight size={14} />
            </Link>
          </div>

          <HorizontalScrollRow
            hideArrowsFrom="md"
            wrapperClassName="-mx-2 mb-4 px-2 sm:mb-6 md:hidden"
            className="flex items-center gap-2 overflow-x-auto pb-1"
          >
            {[
              { label: 'All', href: '/events' },
              { label: 'Today', href: '/events?date=today' },
              { label: 'This weekend', href: '/events?date=weekend' },
              { label: 'Free', href: '/events?price=free' },
              { label: 'Paid', href: '/events?price=paid' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="h-9 shrink-0 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
              >
                <span className="inline-flex h-full items-center">{item.label}</span>
              </Link>
            ))}
          </HorizontalScrollRow>

          <div className="mb-4 hidden flex-wrap items-center gap-2 sm:mb-6 md:flex">
            {[
              { label: 'All', href: '/events' },
              { label: 'Today', href: '/events?date=today' },
              { label: 'This weekend', href: '/events?date=weekend' },
              { label: 'Free', href: '/events?price=free' },
              { label: 'Paid', href: '/events?price=paid' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="h-9 shrink-0 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
              >
                <span className="inline-flex h-full items-center">{item.label}</span>
              </Link>
            ))}
          </div>

          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4
                            sm:grid-cols-2
                            md:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4">
              {sortedEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAuthed={Boolean(user)}
                  isSaved={savedIds.has(event.id)}
                  isPromoted={Boolean(
                    event.promoted_until &&
                    new Date(event.promoted_until).getTime() > now
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl
                            border border-dashed border-gray-200 bg-gray-50
                            py-20 text-center">
              <CalendarCheck className="mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-gray-500">Events coming soon — check back soon!</p>
              <p className="mt-1 text-sm text-gray-400">
                {showCreateEvents ? (
                  <>
                    Be the first —{' '}
                    <Link href="/organiser/events/create" className="text-gold hover:underline">
                      create an event
                    </Link>
                  </>
                ) : (
                  <>Check back soon for events in your area.</>
                )}
              </p>
            </div>
          )}

          {sortedEvents.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/events"
                className="flex items-center gap-2 rounded-full border border-gold
                           px-8 py-3 text-sm font-semibold text-gold
                           transition hover:bg-gold hover:text-white"
              >
                Browse all events <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <HomeDestinations
        hotels={(nearbyHotels ?? [])
          .sort((a, b) => {
            if (a.image_url && !b.image_url) return -1
            if (!a.image_url && b.image_url) return 1
            return a.name.localeCompare(b.name)
          })
          .slice(0, 8)}
        touristAreas={(touristAreas ?? [])
          .sort((a, b) => {
            if (a.image_url && !b.image_url) return -1
            if (!a.image_url && b.image_url) return 1
            return a.name.localeCompare(b.name)
          })
          .slice(0, 8)}
      />

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">Simple process</p>
            <h2
              className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              How GhanasEvent works
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base">
              From discovery to showtime in three easy steps.
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Connector line (desktop) */}
            <div className="absolute left-[calc(16.67%+1px)] right-[calc(16.67%+1px)] top-10 hidden h-px
                            bg-linear-to-r from-transparent via-gold/30 to-transparent sm:block" />

            {[
              {
                step: '01',
                icon:  <MapPinned     className="h-7 w-7 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />,
                title: 'Find events near you',
                desc:  'Browse events by region, category, or date across all 16 regions of Ghana. Filter by price, type, and more.',
              },
              {
                step: '02',
                icon:  <TicketCheck   className="h-7 w-7 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />,
                title: 'Buy tickets instantly',
                desc:  'Secure checkout with MTN MoMo, Telecel Cash, AirtelTigo Money, Visa, and Mastercard.',
              },
              {
                step: '03',
                icon:  <CalendarCheck className="h-7 w-7 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />,
                title: 'Show up and enjoy',
                desc:  'Get your QR code ticket by email. Scan and go — no printing, no hassle.',
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center
                                rounded-full border border-gray-200 bg-white shadow-sm">
                  {item.icon}
                  <span
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center
                               rounded-full bg-gold text-[10px] font-extrabold text-white shadow"
                    style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3
                  className="mb-2 text-base font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: <Shield className="h-4 w-4 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />, label: 'SSL Secured payments' },
              { icon: <BadgeCheck className="h-4 w-4 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />, label: 'Verified organisers' },
              { icon: <TicketCheck className="h-4 w-4 text-gray-900" strokeWidth={ICON_STROKE_WIDTH} />, label: 'Instant QR tickets' },
            ].map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50
                           px-4 py-2 text-xs font-medium text-gray-600"
              >
                {badge.icon}
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORGANISER CTA ───────────────────────────────────────── */}
      {showCreateEvents && (
      <section className="relative overflow-hidden bg-gray-950 px-4 py-16 sm:py-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gold/8 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,151,58,0.08),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30
                       bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold"
          >
            <BadgeCheck className="h-4 w-4" /> For organisers
          </p>
          <h2
            className="mt-2 text-3xl font-extrabold text-white sm:text-4xl md:text-6xl"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            Make it happen
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-lg">
            From intimate gatherings to massive festivals — list your event,
            sell tickets, and reach thousands of Ghanaians.
          </p>

          {/* Mini stats */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4">
            {[
              { value: '300+', label: 'Organisers' },
              { value: 'GH₵0.00', label: 'Setup fee' },
              { value: '16', label: 'Regions' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-lg font-extrabold text-white" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/organiser/events/create"
              className="flex w-full items-center justify-center gap-2 rounded-full
                         bg-gold px-9 py-4 text-sm font-bold text-white
                         shadow-lg shadow-gold/20 transition hover:bg-gold-dark
                         active:scale-95 sm:w-auto"
            >
              Create an event <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/events"
              className="flex w-full items-center justify-center rounded-full border
                         border-white/15 px-9 py-4 text-sm font-bold text-gray-300
                         transition hover:border-white/30 hover:text-white sm:w-auto"
            >
              Browse events
            </Link>
          </div>
        </div>
      </section>
      )}
    </div>
    </SiteShell>
  )
}