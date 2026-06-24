import { buildEventsLocationUrl, type GhanaCity } from '@/lib/ghana-locations'

export interface CityDestination {
  city: string
  region: string
  /** Unsplash or CDN image for the destination card */
  imageUrl: string
}

/** Large image cards — Top destinations row */
export const TOP_CITY_DESTINATIONS: CityDestination[] = [
  {
    city: 'Accra',
    region: 'Greater Accra',
    // Independence Arch (Black Star Gate), Accra — pexels photo 20131678
    imageUrl: 'https://images.pexels.com/photos/20131678/pexels-photo-20131678.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Kumasi',
    region: 'Ashanti',
    // Baba Yara Sports Stadium, Kumasi — pexels photo 20431293
    imageUrl: 'https://images.pexels.com/photos/20431293/pexels-photo-20431293.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Cape Coast',
    region: 'Central',
    // Aerial view of Cape Coast Castle and coastline — pexels photo 33658298
    imageUrl: 'https://images.pexels.com/photos/33658298/pexels-photo-33658298.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Takoradi',
    region: 'Western',
    // Aerial shot of Sekondi-Takoradi harbour — pexels photo 19129343
    imageUrl: 'https://images.pexels.com/photos/19129343/pexels-photo-19129343.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Tamale',
    region: 'Northern',
    // Busy street market in Tamale, Northern Ghana — pexels photo 8613913
    imageUrl: 'https://images.pexels.com/photos/8613913/pexels-photo-8613913.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Ho',
    region: 'Volta',
    // Lush greenery and mountain scenery, Volta Region — pexels photo 27564199
    imageUrl: 'https://images.pexels.com/photos/27564199/pexels-photo-27564199.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Sunyani',
    region: 'Bono',
    // Aerial view of lush green neighbourhood in Ghana — pexels photo 35174931
    imageUrl: 'https://images.pexels.com/photos/35174931/pexels-photo-35174931.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Koforidua',
    region: 'Eastern',
    // Umbrella Rock formation, Koforidua — pexels photo 27978225
    imageUrl: 'https://images.pexels.com/photos/27978225/pexels-photo-27978225.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    city: 'Tema',
    region: 'Greater Accra',
    imageUrl: '/cities/tema.jpg',
  },
  {
    city: 'East Legon',
    region: 'Greater Accra',
    imageUrl: '/cities/east-legon.jpg',
  },
  {
    city: 'Bolgatanga',
    region: 'Upper East',
    imageUrl: '/cities/bolgatanga.jpg',
  },
  {
    city: 'Wa',
    region: 'Upper West',
    imageUrl: '/cities/wa.jpg',
  },
]

export function cityEventsHref(city: string, region: string): string {
  return buildEventsLocationUrl(city, region)
}

export function touristAreaBrowseHref(region?: string, category?: string): string {
  const p = new URLSearchParams()
  if (region) p.set('region', region)
  if (category) p.set('category', category)
  const qs = p.toString()
  return `/tourist-areas${qs ? `?${qs}` : ''}`
}
