import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, Landmark, Ticket } from 'lucide-react'
import {
  TOURIST_CATEGORY_CONFIG,
  TouristCategoryIcon,
  touristAreaLocation,
  buildAreaSlug,
  type TouristAreaListing,
  type TouristCategoryKey,
} from '@/lib/tourist-area-meta'

export type { TouristAreaListing }

export default function TouristAreaCard({
  area,
  variant = 'card',
}: {
  area: TouristAreaListing
  variant?: 'card' | 'compact'
}) {
  const href = `/tourist-areas/${buildAreaSlug(area.id, area.name)}`
  const categoryConfig = area.category
    ? TOURIST_CATEGORY_CONFIG[area.category as TouristCategoryKey]
    : null
  const location = touristAreaLocation(area)

  /* ── Compact (list row) ──────────────────────────── */
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-3.5
                   shadow-sm transition-all duration-200 hover:border-gold/30 hover:shadow-md"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {area.image_url ? (
            <Image
              src={area.image_url}
              alt={area.name}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Landmark className="h-7 w-7 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-gold"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              {area.name}
            </p>
            {categoryConfig && area.category && (
              <span className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${categoryConfig.badgeClass}`}>
                <TouristCategoryIcon category={area.category} />
                {categoryConfig.label}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {location}
          </p>
          {area.description && (
            <p className="line-clamp-1 text-xs text-gray-500">{area.description}</p>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-gold">
            Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </Link>
    )
  }

  /* ── Full card ───────────────────────────────────── */
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm
                 ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-gold/20"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {area.image_url ? (
          <Image
            src={area.image_url}
            alt={area.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-50">
            <Landmark className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Dark gradient for bottom readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        {/* Category badge */}
        {categoryConfig && area.category && (
          <span className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${categoryConfig.className}`}>
            <TouristCategoryIcon category={area.category} className="h-3 w-3" />
            {categoryConfig.label}
          </span>
        )}

        {/* Entry fee badge */}
        {area.entry_fee && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/30
                           bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Ticket className="h-3 w-3" />
            {area.entry_fee}
          </span>
        )}

        {/* Location overlay at bottom of image */}
        <p className="absolute bottom-2.5 left-3 flex items-center gap-1 text-xs font-medium text-white/90 drop-shadow-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {location}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900
                     transition-colors group-hover:text-gold"
          style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
        >
          {area.name}
        </h3>

        {area.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{area.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-bold text-gold">Explore attraction</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full
                           bg-gold/10 text-gold transition-all duration-200
                           group-hover:bg-gold group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

