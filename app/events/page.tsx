import { createClient } from '../../lib/supabase/server'
import EventCard from '../../components/events/EventCard'
import EventFilterBar from '../../components/events/EventFilters'
import SiteShell from '@/components/layout/SiteShell'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { getSavedEventIds } from '@/lib/social'

interface PageProps {
  searchParams: Promise<{
    category?: string
    city?: string
    region?: string
    date?: string
    price?: string
    sort?: string
    q?: string
    page?: string
  }>
}

const PAGE_SIZE = 12

export default async function EventsPage({ searchParams }: PageProps) {
  const params   = await searchParams
  const supabase = await createClient()
  const page     = Number(params.page ?? 1)
  const offset   = (page - 1) * PAGE_SIZE

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  let categoryId: string | null = null
  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    categoryId = cat?.id ?? null
  }

  const now = new Date()
  let dateFrom = now.toISOString()
  let dateTo: string | null = null

  if (params.date === 'today') {
    const end = new Date(now); end.setHours(23, 59, 59)
    dateTo = end.toISOString()
  } else if (params.date === 'weekend') {
    const day  = now.getDay()
    const sat  = new Date(now); sat.setDate(now.getDate() + (6 - day))
    const sun  = new Date(sat); sun.setDate(sat.getDate() + 1); sun.setHours(23, 59, 59)
    dateFrom   = sat.toISOString()
    dateTo     = sun.toISOString()
  } else if (params.date === 'week') {
    const end  = new Date(now); end.setDate(now.getDate() + 7)
    dateTo     = end.toISOString()
  } else if (params.date === 'month') {
    const end  = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    dateTo     = end.toISOString()
  }

  let query = supabase
    .from('events')
    .select(`
      id, slug, title, description,
      venue_name, city, region,
      start_date, end_date,
      banner_url, is_free,
      category:categories(id, name, slug, icon),
      organiser:profiles!organiser_id(id, name, avatar_url),
      ticket_types(price)
    `, { count: 'exact' })
    .eq('status', 'approved')
    .gte('start_date', dateFrom)
    .range(offset, offset + PAGE_SIZE - 1)

  query = query.order('start_date', { ascending: params.sort !== 'latest' })

  if (dateTo)          query = query.lte('end_date', dateTo)
  if (categoryId)      query = query.eq('category_id', categoryId)
  if (params.city)     query = query.ilike('city', params.city)
  else if (params.region) query = query.eq('region', params.region)
  if (params.q)        query = query.ilike('title', `%${params.q}%`)
  if (params.price === 'free') query = query.eq('is_free', true)
  if (params.price === 'paid') query = query.eq('is_free', false)

  const { data: events, count, error } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const activeCat  = categories?.find(c => c.slug === params.category)

  // ── Promoted events: pinned to the top of page 1 ─────────
  let promotedEvents: NonNullable<typeof events> = []
  if (page === 1) {
    let promoQuery = supabase
      .from('events')
      .select(`
        id, slug, title, description,
        venue_name, city, region,
        start_date, end_date,
        banner_url, is_free,
        category:categories(id, name, slug, icon),
        organiser:profiles!organiser_id(id, name, avatar_url),
        ticket_types(price)
      `)
      .eq('status', 'approved')
      .gte('start_date', dateFrom)
      .gt('promoted_until', new Date().toISOString())
      .limit(8)

    promoQuery = promoQuery.order('start_date', { ascending: params.sort !== 'latest' })

    if (dateTo)          promoQuery = promoQuery.lte('end_date', dateTo)
    if (categoryId)      promoQuery = promoQuery.eq('category_id', categoryId)
    if (params.city)     promoQuery = promoQuery.ilike('city', params.city)
    else if (params.region) promoQuery = promoQuery.eq('region', params.region)
    if (params.q)        promoQuery = promoQuery.ilike('title', `%${params.q}%`)
    if (params.price === 'free') promoQuery = promoQuery.eq('is_free', true)
    if (params.price === 'paid') promoQuery = promoQuery.eq('is_free', false)

    const { data: promoted } = await promoQuery
    promotedEvents = promoted ?? []
  }

  const promotedIds = new Set(promotedEvents.map(e => e.id))
  const regularEvents = (events ?? []).filter(e => !promotedIds.has(e.id))

  const { data: { user } } = await supabase.auth.getUser()
  const savedIds = await getSavedEventIds()

  const pageTitle = params.city
    ? `Events in ${params.city}`
    : params.region
      ? `Events in ${params.region}`
      : activeCat
        ? `${activeCat.name} Events`
        : 'All Events in Ghana'

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <EventFilterBar categories={categories ?? []} />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {count ?? 0} event{count !== 1 ? 's' : ''} found
                {params.q && ` for "${params.q}"`}
                {params.city && params.region && (
                  <span className="text-gray-400"> · {params.region}</span>
                )}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error.message}
            </div>
          )}

          {!error && events?.length === 0 && promotedEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-800 mb-1">No events found</p>
              <p className="text-sm text-gray-400 mb-5">Try adjusting your filters</p>
              <Link
                href="/events"
                className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white hover:bg-gold-dark transition"
              >
                Browse all events
              </Link>
            </div>
          )}

          {(promotedEvents.length > 0 || regularEvents.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {promotedEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAuthed={Boolean(user)}
                  isSaved={savedIds.has(event.id)}
                  isPromoted
                />
              ))}
              {regularEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAuthed={Boolean(user)}
                  isSaved={savedIds.has(event.id)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              {page > 1 && (
                <Link
                  href={buildUrl(params, { page: String(page - 1) })}
                  className="flex h-9 items-center rounded-full border border-gray-300 px-4 text-sm text-gray-600 hover:border-gold/50 hover:text-gold bg-white transition"
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={buildUrl(params, { page: String(p) })}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                    p === page
                      ? 'bg-gold text-white shadow-sm'
                      : 'border border-gray-300 bg-white text-gray-600 hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={buildUrl(params, { page: String(page + 1) })}
                  className="flex h-9 items-center rounded-full border border-gray-300 px-4 text-sm text-gray-600 hover:border-gold/50 hover:text-gold bg-white transition"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  )
}

type Params = Record<string, string | undefined>

function buildUrl(current: Params, overrides: Params): string {
  const merged = { ...current, ...overrides }
  const p      = new URLSearchParams()
  if (merged.q)                           p.set('q', merged.q)
  if (merged.category)                    p.set('category', merged.category)
  if (merged.city)                        p.set('city', merged.city)
  if (merged.region)                      p.set('region', merged.region)
  if (merged.date)                        p.set('date', merged.date)
  if (merged.price)                       p.set('price', merged.price)
  if (merged.sort && merged.sort !== 'soonest') p.set('sort', merged.sort)
  if (merged.page && merged.page !== '1') p.set('page', merged.page)
  const qs = p.toString()
  return `/events${qs ? `?${qs}` : ''}`
}
