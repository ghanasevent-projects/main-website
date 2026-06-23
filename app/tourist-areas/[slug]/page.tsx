import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import MapEmbed from '@/components/ui/MapEmbed'
import HotelCard, { type HotelListing } from '@/components/hotels/HotelCard'
import {
  TOURIST_CATEGORY_CONFIG,
  TouristCategoryIcon,
  touristAreaLocation,
  touristAreaMapsUrl,
  parseAreaId,
  type TouristCategoryKey,
} from '@/lib/tourist-area-meta'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = parseAreaId(slug)
  const supabase = await createClient()
  const { data } = await supabase
    .from('tourist_areas')
    .select('name, description, image_url')
    .eq('id', id)
    .single()
  if (!data) return { title: 'Attraction not found' }
  return {
    title: data.name,
    description: data.description?.slice(0, 160),
    openGraph: { images: data.image_url ? [data.image_url] : [] },
  }
}

export default async function TouristAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = parseAreaId(slug)
  const supabase = await createClient()

  const { data: area } = await supabase
    .from('tourist_areas')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!area) notFound()

  const categoryConfig = area.category
    ? TOURIST_CATEGORY_CONFIG[area.category as TouristCategoryKey]
    : null

  const location = touristAreaLocation(area)
  const mapsUrl = touristAreaMapsUrl(area)

  const eventsHref = area.region
    ? `/events?region=${encodeURIComponent(area.region)}${area.city ? `&city=${encodeURIComponent(area.city)}` : ''}`
    : '/events'

  const hotelsHref = area.region
    ? `/hotels?region=${encodeURIComponent(area.region)}`
    : '/hotels'

  let nearbyHotels: HotelListing[] = []
  if (area.region) {
    const { data } = await supabase
      .from('hotels')
      .select('*')
      .eq('is_active', true)
      .eq('region', area.region)
      .order('name')
      .limit(3)
    nearbyHotels = (data ?? []) as HotelListing[]
  }

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="relative h-56 w-full overflow-hidden bg-gray-200 sm:h-72 md:h-96">
          {area.image_url ? (
            <Image
              src={area.image_url}
              alt={area.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gold/15 to-gold/5">
              <MapPin className="h-16 w-16 text-gold/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          {categoryConfig && area.category && (
            <span
              className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${categoryConfig.className}`}
            >
              <TouristCategoryIcon category={area.category} className="h-3.5 w-3.5" />
              {categoryConfig.label}
            </span>
          )}
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href={`/tourist-areas?region=${encodeURIComponent(area.region)}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to attractions
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900 sm:text-3xl"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {area.name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  {location}
                </p>
              </div>
              {area.entry_fee && (
                <span className="rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                  {area.entry_fee}
                </span>
              )}
            </div>

            {area.description && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">About</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {area.description}
                </p>
              </section>
            )}

            {area.latitude && area.longitude && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Location</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                  <MapEmbed lat={area.latitude} lng={area.longitude} title={area.name} />
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </section>
            )}

            <section className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Plan your visit</h2>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href={eventsHref} className="font-semibold text-gold hover:underline">
                  Events in {area.city ?? area.region} →
                </Link>
                <Link href={hotelsHref} className="font-semibold text-gold hover:underline">
                  Hotels in {area.region} →
                </Link>
              </div>
            </section>

            {nearbyHotels.length > 0 && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Places to stay nearby</h2>
                <div className="mt-4 space-y-3">
                  {nearbyHotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} variant="compact" />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
