import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Wifi, Car, Waves, AirVent, ArrowRight, Phone, Globe } from 'lucide-react'

export interface HotelListing {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  region: string
  price_range: 'budget' | 'mid-range' | 'luxury' | null
  phone: string | null
  website: string | null
  image_url: string | null
  amenities: string[] | null
  latitude?: number | null
  longitude?: number | null
}

/** Build a human-readable URL slug: {uuid}-{name-kebab} */
export function buildHotelSlug(id: string, name: string): string {
  const nameSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
  return `${id}-${nameSlug}`
}

/** Extract the UUID from a slug param (first 36 chars). */
export function parseHotelId(slug: string): string {
  return slug.slice(0, 36)
}

const PRICE_CONFIG = {
  budget:      { label: 'Budget',     dot: 'bg-green-500',  badge: 'bg-green-500 text-white' },
  'mid-range': { label: 'Mid-range',  dot: 'bg-blue-500',   badge: 'bg-blue-600 text-white'  },
  luxury:      { label: 'Luxury',     dot: 'bg-gold',       badge: 'bg-gold text-white'      },
} as const

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi:    <Wifi    className="h-3 w-3" />,
  parking: <Car     className="h-3 w-3" />,
  pool:    <Waves   className="h-3 w-3" />,
  ac:      <AirVent className="h-3 w-3" />,
}

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi', parking: 'Parking', pool: 'Pool', ac: 'A/C',
}

export default function HotelCard({
  hotel,
  variant = 'card',
}: {
  hotel: HotelListing
  variant?: 'card' | 'compact' | 'home'
}) {
  const priceConfig = hotel.price_range ? PRICE_CONFIG[hotel.price_range] : null
  const href = `/hotels/${buildHotelSlug(hotel.id, hotel.name)}`

  /* Home showcase card (destination-style, no truncation) */
  if (variant === 'home') {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative aspect-[4/3] w-full">
          {hotel.image_url ? (
            <Image
              src={hotel.image_url}
              alt={hotel.name}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#1a472a] via-[#2d5a3d] to-gold/80" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.2)_100%)]" />

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
              <MapPin className="h-3 w-3" />
              {hotel.city}, {hotel.region}
            </span>
          </div>

          {priceConfig && (
            <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${priceConfig.badge}`}>
              {priceConfig.label}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3
              className="text-lg font-extrabold leading-tight text-white drop-shadow-md"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              {hotel.name}
            </h3>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {hotel.amenities.slice(0, 4).map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm"
                  >
                    {AMENITY_ICONS[a] ?? null}
                    {AMENITY_LABELS[a] ?? a}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex translate-y-3 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-xs font-semibold text-white/90">View hotel</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  /* â”€â”€ Compact (list row) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-3.5 rounded-2xl border border-gray-100 bg-white p-3.5
                   shadow-sm transition-all duration-200 hover:border-gold/30 hover:shadow-md"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {hotel.image_url ? (
            <Image
              src={hotel.image_url}
              alt={hotel.name}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gold/10 to-gold/5 text-2xl">
              ðŸ¨
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-gold"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              {hotel.name}
            </p>
            {priceConfig && (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${priceConfig.badge}`}>
                {priceConfig.label}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {hotel.city}, {hotel.region}
          </p>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 3).map(a => (
                <span key={a} className="flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {AMENITY_ICONS[a] ?? null}
                  {AMENITY_LABELS[a] ?? a}
                </span>
              ))}
            </div>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-gold">
            View hotel <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </Link>
    )
  }

  /* â”€â”€ Full card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm
                 ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-gold/20"
    >
      <Link href={href} className="flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {hotel.image_url ? (
          <Image
            src={hotel.image_url}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gold/10 to-gold/5 text-5xl">
            ðŸ¨
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        {/* Price badge */}
        {priceConfig && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${priceConfig.badge}`}>
            {priceConfig.label}
          </span>
        )}

        {/* Location overlay */}
        <p className="absolute bottom-2.5 left-3 flex items-center gap-1 text-xs font-medium text-white/90 drop-shadow-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {hotel.city}, {hotel.region}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3
          className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900
                     transition-colors group-hover:text-gold"
          style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
        >
          {hotel.name}
        </h3>

        {hotel.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{hotel.description}</p>
        )}

        {/* Amenity pills */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 4).map(a => (
              <span
                key={a}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50
                           px-2 py-1 text-[11px] font-medium capitalize text-gray-600"
              >
                {AMENITY_ICONS[a] ?? null}
                {AMENITY_LABELS[a] ?? a}
              </span>
            ))}
          </div>
        )}
      </div>
      </Link>

      {/* Action row — outside <Link> so phone/website anchors don't nest inside <a> */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          {hotel.phone && (
            <a
              href={`tel:${hotel.phone}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200
                         text-gray-500 transition hover:border-gold/40 hover:text-gold"
              title="Call hotel"
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
          )}
          {hotel.website && (
            <a
              href={hotel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200
                         text-gray-500 transition hover:border-gold/40 hover:text-gold"
              title="Visit website"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <Link href={href}>
          <span className="flex h-7 w-7 items-center justify-center rounded-full
                           bg-gold/10 text-gold transition-all duration-200
                           group-hover:bg-gold group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  )
}
