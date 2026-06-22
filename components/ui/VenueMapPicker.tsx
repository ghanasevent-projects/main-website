'use client'

import { useState } from 'react'
import { Loader2, MapPin, Navigation, Search } from 'lucide-react'
import MapEmbed from '@/components/ui/MapEmbed'
import { getCityCoordinates } from '@/lib/city-coordinates'
import CoordinateInput from '@/components/ui/CoordinateInput'
import { formatCoordinatePair, parseCoordinatePair } from '@/lib/coordinates'

interface VenueMapPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
  venueName?: string
  address?: string
  city?: string
}

export default function VenueMapPicker({
  latitude,
  longitude,
  onChange,
  venueName = '',
  address = '',
  city = '',
}: VenueMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function geocode(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return

    const asCoords = parseCoordinatePair(trimmed)
    if (asCoords) {
      setError(null)
      onChange(asCoords.lat, asCoords.lng)
      return
    }

    setSearching(true)
    setError(null)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not find that location')
        return
      }
      onChange(data.lat, data.lng)
      setSearchQuery(data.label ?? trimmed)
    } catch {
      setError('Location search failed. Try again.')
    } finally {
      setSearching(false)
    }
  }

  function searchFromFields() {
    const parts = [venueName, address, city, 'Ghana'].filter(Boolean)
    if (parts.length < 2) {
      setError('Enter a venue name or address first.')
      return
    }
    geocode(parts.join(', '))
  }

  function useCityCenter() {
    if (!city) {
      setError('Select a city first.')
      return
    }
    const coords = getCityCoordinates(city)
    if (!coords) {
      setError('No map coordinates for this city yet.')
      return
    }
    setError(null)
    onChange(coords.lat, coords.lng)
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        onChange(lat, lng)
        setLocating(false)
      },
      () => {
        setError('Could not get your location. Check browser permissions.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const hasPin = latitude != null && longitude != null

  return (
    <div className="space-y-3">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700">
          Map location
        </span>
        <p className="text-xs text-gray-500">
          Pin your venue so attendees can get directions on the event page.
        </p>
      </div>

      <CoordinateInput
        latitude={latitude}
        longitude={longitude}
        onApply={onChange}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), geocode(searchQuery))}
            placeholder="Search address or place name…"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm
                       focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20"
          />
        </div>
        <button
          type="button"
          onClick={() => geocode(searchQuery)}
          disabled={searching || !searchQuery.trim()}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200
                     bg-white px-4 text-sm font-medium text-gray-700 transition
                     hover:border-[#C9973A]/40 disabled:opacity-50"
        >
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={searchFromFields}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50
                     px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <MapPin className="h-3.5 w-3.5" />
          Find from venue details
        </button>
        <button
          type="button"
          onClick={useCityCenter}
          disabled={!city}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50
                     px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100
                     disabled:opacity-50"
        >
          Use city centre
        </button>
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50
                     px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          {locating
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Navigation className="h-3.5 w-3.5" />}
          My location
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {hasPin ? (
        <div className="space-y-2">
          <MapEmbed
            lat={latitude!}
            lng={longitude!}
            title={venueName || 'Event venue'}
            height="h-52"
          />
          <p className="font-mono text-xs text-gray-500">
            {formatCoordinatePair(latitude!, longitude!)}
          </p>
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center rounded-xl border border-dashed
                        border-gray-200 bg-gray-50 text-center">
          <div>
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">No location pinned yet</p>
            <p className="mt-0.5 text-xs text-gray-400">Paste coordinates or search above</p>
          </div>
        </div>
      )}
    </div>
  )
}
