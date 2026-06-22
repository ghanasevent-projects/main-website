import type { SupabaseClient } from '@supabase/supabase-js'

const EVENT_SELECT = `
  id, slug, title,
  venue_name, city, region,
  start_date, banner_url, is_free,
  category:categories(name, slug),
  ticket_types(price)
`

interface EventLocation {
  id: string
  city: string | null
  region: string | null
  category_id: string | null
}

export async function fetchRelatedEvents(
  supabase: SupabaseClient,
  event: EventLocation,
  limit = 6,
) {
  const now = new Date().toISOString()
  const base = () =>
    supabase
      .from('events')
      .select(EVENT_SELECT)
      .eq('status', 'approved')
      .neq('id', event.id)
      .gte('end_date', now)
      .order('start_date', { ascending: true })
      .limit(limit)

  if (event.city) {
    const { data } = await base().eq('city', event.city)
    if (data?.length) return data
  }

  if (event.category_id && event.region) {
    const { data } = await base()
      .eq('region', event.region)
      .eq('category_id', event.category_id)
    if (data?.length) return data
  }

  if (event.region) {
    const { data } = await base().eq('region', event.region)
    if (data?.length) return data
  }

  const { data } = await base()
  return data ?? []
}

export async function fetchNearbyHotels(
  supabase: SupabaseClient,
  event: { city: string | null; region: string | null },
  limit = 4,
) {
  const base = () =>
    supabase.from('hotels').select('*').eq('is_active', true).limit(limit)

  if (event.city) {
    const { data } = await base().eq('city', event.city)
    if (data?.length) return data
  }

  if (event.region) {
    const { data } = await base().eq('region', event.region)
    return data ?? []
  }

  return []
}

export async function fetchNearbyTouristAreas(
  supabase: SupabaseClient,
  event: { city: string | null; region: string | null },
  limit = 4,
) {
  const base = () =>
    supabase.from('tourist_areas').select('*').eq('is_active', true).limit(limit)

  if (event.city) {
    const { data } = await base().eq('city', event.city)
    if (data?.length) return data
  }

  if (event.region) {
    const { data } = await base().eq('region', event.region)
    return data ?? []
  }

  return []
}
