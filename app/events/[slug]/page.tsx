import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Pencil } from 'lucide-react'
import Link from 'next/link'
import HotelCard from '@/components/hotels/HotelCard'
import TouristAreaCard from '@/components/tourist-areas/TouristAreaCard'
import MapEmbed from '@/components/ui/MapEmbed'
import TicketPurchaseSection from '@/components/tickets/TicketPurchaseSection'
import SiteShell from '@/components/layout/SiteShell'
import FollowButton from '@/components/social/FollowButton'
import OrganiserContactCard from '@/components/organiser/OrganiserContactCard'
import EventCard from '@/components/events/EventCard'
import EventShareBar from '@/components/events/EventShareBar'
import EventGoodToKnow from '@/components/events/EventGoodToKnow'
import EventMobileTicketCta from '@/components/events/EventMobileTicketCta'
import VenueGallery from '@/components/events/VenueGallery'
import { hasSavedEvent, getEventSaveCount, isFollowing, getFollowerCount, getSavedEventIds } from '@/lib/social'
import {
  fetchRelatedEvents,
  fetchNearbyHotels,
  fetchNearbyTouristAreas,
} from '@/lib/event-nearby'
import { resolveRelation } from '@/lib/resolve-relation'
import EventSchedule from '@/components/events/EventSchedule'
import {
  getEventScheduleLines,
  formatEventDuration,
  minTicketPrice,
} from '@/lib/event-format'
import { formatCediFrom } from '@/lib/currency'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('title, description, banner_url')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Event not found' }

  return {
    title: data.title,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      images: [data.banner_url ?? '/og-default.jpg'],
    },
  }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-bold text-gray-900"
      style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
    >
      {children}
    </h2>
  )
}

function parseVenueImages(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((u): u is string => typeof u === 'string' && u.length > 0)
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      category:categories(name, slug, icon),
      organiser:public_profiles!organiser_id(
        id, name, avatar_url, role,
        phone, website, bio, city, region,
        whatsapp, instagram_url, facebook_url, twitter_url, linkedin_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (!event) notFound()

  const organiser = resolveRelation(event.organiser)
  const category = resolveRelation(event.category)

  const { data: { user } } = await supabase.auth.getUser()
  const organiserId: string | undefined = organiser?.id
  const [savedNow, saveCount, followingNow, followerCount, ticketTypes, relatedEvents, hotels, areas, savedIds] =
    await Promise.all([
      hasSavedEvent(event.id),
      getEventSaveCount(event.id),
      organiserId ? isFollowing(organiserId) : Promise.resolve(false),
      organiserId ? getFollowerCount(organiserId) : Promise.resolve(0),
      supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', event.id)
        .order('price', { ascending: true })
        .then(({ data }) => data ?? []),
      fetchRelatedEvents(supabase, event),
      fetchNearbyHotels(supabase, event),
      fetchNearbyTouristAreas(supabase, event),
      getSavedEventIds(),
    ])

  const locationLabel = [event.city, event.region].filter(Boolean).join(', ')
  const isEventOwner = Boolean(user && event.organiser_id === user.id)
  const scheduleLines = getEventScheduleLines(event.start_date, event.end_date)
  const duration = formatEventDuration(event.start_date, event.end_date)
  const lowestPrice = minTicketPrice(ticketTypes, event.is_free)
  const priceLabel = event.is_free || lowestPrice === 0
    ? 'Free'
    : lowestPrice != null
      ? formatCediFrom(lowestPrice)
      : event.external_ticket_url
        ? 'External tickets'
        : 'Tickets available'

  const venueImages = parseVenueImages(event.venue_images)

  const ticketCtaLabel = event.is_free || lowestPrice === 0 ? 'Register · Free' : 'Get tickets'
  const hasTicketSection = ticketTypes.length > 0

  const eventsBrowseHref = event.city
    ? `/events?city=${encodeURIComponent(event.city)}&region=${encodeURIComponent(event.region ?? '')}`
    : event.region
      ? `/events?region=${encodeURIComponent(event.region)}`
      : '/events'
  const hotelsBrowseHref = event.region
    ? `/hotels?region=${encodeURIComponent(event.region)}`
    : '/hotels'
  const areasBrowseHref = event.region
    ? `/tourist-areas?region=${encodeURIComponent(event.region)}`
    : '/tourist-areas'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.start_date,
    endDate: event.end_date,
    description: event.description,
    image: event.banner_url,
    location: {
      '@type': 'Place',
      name: event.venue_name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: event.city,
        addressRegion: event.region,
        addressCountry: 'GH',
      },
    },
    organizer: organiser
      ? { '@type': 'Organization', name: organiser.name ?? 'GhanasEvent' }
      : { '@type': 'Organization', name: 'GhanasEvent' },
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white pb-24 lg:pb-0">

        {/* Hero — Eventbrite-style wide banner */}
        <div className="bg-[#f8f7f4]">
          <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
            <div className="relative aspect-2/1 w-full max-h-105 overflow-hidden rounded-lg bg-gray-200 shadow-sm">
              {event.banner_url ? (
                <Image
                  src={event.banner_url}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gold/15 to-gold/5">
                  <span className="text-7xl opacity-40">🎉</span>
                </div>
              )}
              <EventShareBar
                eventId={event.id}
                title={event.title}
                slug={event.slug ?? slug}
                initialSaved={savedNow}
                saveCount={saveCount}
                isAuthed={Boolean(user)}
                variant="overlay"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">

            {/* ── Main content ─────────────────────────────── */}
            <div className="min-w-0">

              {/* Title block — Eventbrite header */}
              <header className="border-b border-gray-200 pb-8">
                <h1
                  className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {event.title}
                </h1>

                {/* Date & venue — mobile only (desktop sidebar shows these) */}
                <div className="mt-6 space-y-1.5 lg:hidden">
                  <p className="text-lg font-semibold text-gray-900">{event.venue_name}</p>
                  {locationLabel && (
                    <p className="text-base text-gray-600">{locationLabel}</p>
                  )}
                  <EventSchedule lines={scheduleLines} className="text-base font-medium text-gray-800" />
                </div>

                {isEventOwner && (
                  <Link
                    href={`/organiser/events/${event.id}/edit`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit event
                  </Link>
                )}
              </header>

              {/* Overview */}
              <section className="border-b border-gray-200 py-8">
                <SectionHeading>Overview</SectionHeading>
                <div className="mt-4 prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line text-base">{event.description}</p>
                </div>
              </section>

              {/* Good to know */}
              <section className="border-b border-gray-200 py-8">
                <SectionHeading>Good to know</SectionHeading>
                <div className="mt-5">
                  <EventGoodToKnow
                    duration={duration}
                    priceLabel={priceLabel}
                    category={category ? { name: category.name, slug: category.slug, icon: category.icon } : null}
                  />
                </div>
              </section>

              {/* Location */}
              <section className="border-b border-gray-200 py-8">
                <SectionHeading>Location</SectionHeading>
                <div className="mt-5">
                  {event.address && (
                    <p className="text-base text-gray-600">{event.address}</p>
                  )}
                  {locationLabel && (
                    <p className="mt-0.5 text-base text-gray-600">{locationLabel}</p>
                  )}

                  <VenueGallery images={venueImages} />

                  {event.latitude && event.longitude ? (
                    <div className="mt-5">
                      <MapEmbed
                        lat={event.latitude}
                        lng={event.longitude}
                        title={event.venue_name}
                        height="h-72"
                      />
                    </div>
                  ) : (
                    <div className="mt-5 flex items-start gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>
                        {event.venue_name}
                        {event.address ? `, ${event.address}` : ''}
                        {locationLabel ? `, ${locationLabel}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Organized by */}
              {organiser && (
                <section className="border-b border-gray-200 py-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <SectionHeading>Organized by</SectionHeading>
                    <FollowButton
                      targetUserId={organiser.id}
                      initialFollowing={followingNow}
                      initialCount={followerCount}
                      isAuthed={Boolean(user)}
                      isSelf={user?.id === organiser.id}
                    />
                  </div>
                  <div className="mt-5">
                    <OrganiserContactCard organiser={organiser} showProfileLink />
                    {isEventOwner && (
                      <Link
                        href="/account"
                        className="mt-3 inline-block text-sm font-medium text-gold hover:underline"
                      >
                        Update your contact details →
                      </Link>
                    )}
                  </div>
                </section>
              )}

              {/* Related events */}
              <section className="border-b border-gray-200 py-8">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <SectionHeading>Related events</SectionHeading>
                  {locationLabel && (
                    <p className="text-sm text-gray-500">Near {locationLabel}</p>
                  )}
                </div>
                {relatedEvents.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {relatedEvents.map(related => (
                      <EventCard
                        key={related.id}
                        event={related}
                        isAuthed={Boolean(user)}
                        isSaved={savedIds.has(related.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                    <p className="text-sm font-semibold text-gray-800">No related events yet</p>
                    <p className="mt-1.5 text-sm text-gray-500">
                      More events around {locationLabel || 'this area'} will appear here as organisers publish them.
                    </p>
                    <div className="mt-4">
                      <Link
                        href={eventsBrowseHref}
                        className="inline-flex items-center rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
                      >
                        Browse all events
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {/* Nearby hotels */}
              <section className="border-b border-gray-200 py-8">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <SectionHeading>Nearby hotels & lodges</SectionHeading>
                  <Link href={hotelsBrowseHref} className="text-sm font-semibold text-gold hover:underline">
                    View all
                  </Link>
                </div>
                {hotels.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {hotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                    <p className="text-sm font-semibold text-gray-800">No nearby hotels listed yet</p>
                    <p className="mt-1.5 text-sm text-gray-500">
                      We are still adding accommodation options around {locationLabel || 'this area'}.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/hotels"
                        className="inline-flex items-center rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
                      >
                        Explore hotels across Ghana
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {/* Tourist areas */}
              <section className="py-8">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <SectionHeading>Tourist attractions nearby</SectionHeading>
                  <Link href={areasBrowseHref} className="text-sm font-semibold text-gold hover:underline">
                    View all
                  </Link>
                </div>
                {areas.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {areas.map(area => (
                      <TouristAreaCard key={area.id} area={area} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                    <p className="text-sm font-semibold text-gray-800">No nearby attractions listed yet</p>
                    <p className="mt-1.5 text-sm text-gray-500">
                      Tourist spots around {locationLabel || 'this area'} will show here when available.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/tourist-areas"
                        className="inline-flex items-center rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
                      >
                        Discover tourist areas
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ── Sticky ticket sidebar (single instance — desktop + mobile) ── */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div id="ticket-sidebar">
                <TicketPurchaseSection
                  ticketTypes={ticketTypes}
                  eventId={event.id}
                  eventSlug={event.slug ?? slug}
                  externalTicketUrl={event.external_ticket_url}
                  summary={{
                    startDate: event.start_date,
                    endDate: event.end_date,
                    venueName: event.venue_name,
                    city: event.city,
                    region: event.region,
                    isFree: event.is_free,
                    minPrice: lowestPrice,
                  }}
                />
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile ticket bar — Eventbrite-style fixed CTA */}
        {(hasTicketSection || event.external_ticket_url) && (
          <EventMobileTicketCta
            label={ticketCtaLabel}
            hasTicketSection={hasTicketSection}
            externalTicketUrl={event.external_ticket_url}
          />
        )}
      </main>
    </SiteShell>
  )
}
