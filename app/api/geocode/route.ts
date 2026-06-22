import { NextRequest, NextResponse } from 'next/server'
import { parseCoordinatePair } from '@/lib/coordinates'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 })
  }

  const coords = parseCoordinatePair(q)
  if (coords) {
    return NextResponse.json({
      lat: coords.lat,
      lng: coords.lng,
      label: `${coords.lat}, ${coords.lng}`,
    })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('q', q.includes('Ghana') ? q : `${q}, Ghana`)
  url.searchParams.set('countrycodes', 'gh')
  url.searchParams.set('limit', '1')

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'GhanasEvent/1.0 (contact@ghanasevent.com)' },
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 502 })
  }

  const data = (await res.json()) as { lat: string; lon: string; display_name: string }[]
  if (!data.length) {
    return NextResponse.json({ error: 'No results found' }, { status: 404 })
  }

  return NextResponse.json({
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    label: data[0].display_name,
  })
}
