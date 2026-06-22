import { createClient } from '@/lib/supabase/server'
import TouristAreaCard from '@/components/tourist-areas/TouristAreaCard'
import SiteShell from '@/components/layout/SiteShell'
import { Search } from 'lucide-react'
import { GHANA_REGIONS } from '@/lib/ghana-locations'

export default async function TouristAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; category?: string; q?: string }>
}) {
  const params   = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('tourist_areas')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (params.region)   query = query.eq('region', params.region)
  if (params.category) query = query.eq('category', params.category)
  if (params.q)        query = query.ilike('name', `%${params.q}%`)

  const { data: areas } = await query

  return (
    <SiteShell>
    <main className="min-h-screen bg-[#f8f7f4]">
      <section className="bg-white border-b border-gray-200 px-4 py-5 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <form method="GET" action="/tourist-areas" className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search attractions..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4
                           text-sm outline-none focus:border-[#C9973A] focus:ring-2
                           focus:ring-[#C9973A]/20 transition"
              />
            </div>
            <select name="region" defaultValue={params.region ?? ''}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5
                         text-sm outline-none cursor-pointer focus:border-[#C9973A] transition">
              <option value="">All regions</option>
              {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select name="category" defaultValue={params.category ?? ''}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5
                         text-sm outline-none cursor-pointer focus:border-[#C9973A] transition">
              <option value="">All types</option>
              <option value="beach">Beach</option>
              <option value="historical">Historical</option>
              <option value="nature">Nature</option>
              <option value="market">Market</option>
            </select>
            <button type="submit"
              className="rounded-lg bg-[#C9973A] px-5 py-2.5 text-sm font-semibold
                         text-white hover:bg-[#b8852e] transition">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Tourist Attractions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {areas?.length ?? 0} attractions found
          </p>
        </div>

        {areas?.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl
                          border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">No attractions found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters</p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas?.map(area => (
            <TouristAreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </main>
    </SiteShell>
  )
}