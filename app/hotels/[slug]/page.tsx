import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Wifi, Car, Waves, AirVent } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import MapEmbed from '@/components/ui/MapEmbed'
import { ContactBrandIcon } from '@/components/ui/SocialBrandIcons'
import { parseHotelId } from '@/components/hotels/HotelCard'

const PRICE_LABELS = {
  budget: 'Budget',
  'mid-range': 'Mid-range',
  luxury: 'Luxury',
} as const

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
  ac: <AirVent className="h-4 w-4" />,
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = parseHotelId(slug)
  const supabase = await createClient()
  const { data } = await supabase.from('hotels').select('name, description, image_url').eq('id', id).single()
  if (!data) return { title: 'Hotel not found' }
  return {
    title: data.name,
    description: data.description?.slice(0, 160),
    openGraph: { images: data.image_url ? [data.image_url] : [] },
  }
}

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = parseHotelId(slug)
  const supabase = await createClient()

  const { data: hotel } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!hotel) notFound()

  const mapsQuery = encodeURIComponent(`${hotel.name}, ${hotel.address}, ${hotel.city}, ${hotel.region}, Ghana`)
  const mapsUrl = hotel.latitude && hotel.longitude
    ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  const eventsHref = hotel.region
    ? `/events?region=${encodeURIComponent(hotel.region)}&city=${encodeURIComponent(hotel.city)}`
    : '/events'

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="relative h-56 w-full overflow-hidden bg-gray-200 sm:h-72 md:h-96">
          {hotel.image_url ? (
            <Image
              src={hotel.image_url}
              alt={hotel.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gold/15 to-gold/5 text-6xl">
              🏨
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href={`/hotels?region=${encodeURIComponent(hotel.region)}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900 sm:text-3xl"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {hotel.name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  {hotel.address}, {hotel.city}, {hotel.region}
                </p>
              </div>
              {hotel.price_range && (
                <span className="rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                  {PRICE_LABELS[hotel.price_range as keyof typeof PRICE_LABELS]}
                </span>
              )}
            </div>

            {hotel.description && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">About</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {hotel.description}
                </p>
              </section>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hotel.amenities.map((a: string) => (
                    <span
                      key={a}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm capitalize text-gray-700"
                    >
                      {AMENITY_ICONS[a] ?? null}
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(hotel.latitude && hotel.longitude) && (
              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Location</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                  <MapEmbed lat={hotel.latitude} lng={hotel.longitude} title={hotel.name} />
                </div>
              </section>
            )}

            <section className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Contact</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {hotel.phone && (
                  <a
                    href={`tel:${hotel.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gold/40 hover:text-gold"
                  >
                    <ContactBrandIcon brand="phone" size={18} />
                    {hotel.phone}
                  </a>
                )}
                {hotel.website && (
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gold/40 hover:text-gold"
                  >
                    <ContactBrandIcon brand="website" size={18} />
                    Visit website
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gold/40 hover:text-gold"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Maps
                </a>
              </div>
            </section>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <Link
                href={eventsHref}
                className="text-sm font-semibold text-gold hover:underline"
              >
                See events near {hotel.city} →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
