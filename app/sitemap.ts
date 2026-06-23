import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ghanasevent.com'

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

function buildPrefixedSlug(id: string, name: string): string {
  return `${id}-${slugifyName(name)}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const supabase = await createClient()

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/hotels`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/tourist-areas`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/community-guidelines`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/refunds`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/developer`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const [{ data: events }, { data: hotels }, { data: areas }] = await Promise.all([
    supabase
      .from('events')
      .select('slug')
      .eq('status', 'approved')
      .not('slug', 'is', null),
    supabase
      .from('hotels')
      .select('id, name')
      .eq('is_active', true),
    supabase
      .from('tourist_areas')
      .select('id, name')
      .eq('is_active', true),
  ])

  const eventUrls: MetadataRoute.Sitemap = (events ?? [])
    .filter((event): event is { slug: string } => Boolean(event.slug))
    .map(event => ({
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }))

  const hotelUrls: MetadataRoute.Sitemap = (hotels ?? [])
    .filter((hotel): hotel is { id: string; name: string } => Boolean(hotel.id && hotel.name))
    .map(hotel => ({
      url: `${SITE_URL}/hotels/${buildPrefixedSlug(hotel.id, hotel.name)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const areaUrls: MetadataRoute.Sitemap = (areas ?? [])
    .filter((area): area is { id: string; name: string } => Boolean(area.id && area.name))
    .map(area => ({
      url: `${SITE_URL}/tourist-areas/${buildPrefixedSlug(area.id, area.name)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  return [...staticUrls, ...eventUrls, ...hotelUrls, ...areaUrls]
}
