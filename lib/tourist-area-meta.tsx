import { Landmark, TreePine, Waves, ShoppingBag } from 'lucide-react'

export interface TouristAreaListing {
  id: string
  name: string
  description: string | null
  region: string
  city: string | null
  image_url: string | null
  category: string | null
  entry_fee: string | null
  latitude: number | null
  longitude: number | null
}

export type TouristCategoryKey = 'beach' | 'historical' | 'nature' | 'market'

export const TOURIST_CATEGORY_CONFIG: Record<
  TouristCategoryKey,
  { label: string; className: string; badgeClass: string }
> = {
  beach: {
    label: 'Beach',
    className: 'bg-sky-500 text-white',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  historical: {
    label: 'Historical',
    className: 'bg-amber-600 text-white',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  nature: {
    label: 'Nature',
    className: 'bg-green-600 text-white',
    badgeClass: 'bg-green-50 text-green-700 border-green-200',
  },
  market: {
    label: 'Market',
    className: 'bg-purple-600 text-white',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

export function touristCategoryLabel(category: string | null): string | null {
  if (!category) return null
  return TOURIST_CATEGORY_CONFIG[category as TouristCategoryKey]?.label ?? category
}

export function TouristCategoryIcon({ category, className = 'h-3 w-3' }: { category: string; className?: string }) {
  if (category === 'beach') return <Waves className={className} />
  if (category === 'historical') return <Landmark className={className} />
  if (category === 'nature') return <TreePine className={className} />
  if (category === 'market') return <ShoppingBag className={className} />
  return <Landmark className={className} />
}

export function touristAreaLocation(area: Pick<TouristAreaListing, 'city' | 'region'>) {
  return area.city ? `${area.city}, ${area.region}` : area.region
}

/** Build a human-readable URL slug: {uuid}-{name-kebab}
 *  The UUID prefix (always 36 chars) is used for reliable DB lookups.
 *  e.g. /tourist-areas/126b41be-3720-435b-93be-5a8ee51ba94e-labadi-beach
 */
export function buildAreaSlug(id: string, name: string): string {
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
export function parseAreaId(slug: string): string {
  return slug.slice(0, 36)
}

export function touristAreaMapsUrl(area: Pick<TouristAreaListing, 'name' | 'region' | 'city' | 'latitude' | 'longitude'>) {
  if (area.latitude && area.longitude) {
    return `https://www.google.com/maps?q=${area.latitude},${area.longitude}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${area.name} ${area.city ?? ''} ${area.region} Ghana`)}`
}
