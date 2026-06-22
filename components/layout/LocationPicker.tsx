'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { MapPin, Loader2, Navigation, ChevronDown, Check } from 'lucide-react'
import {
  GHANA_CITIES,
  GHANA_REGIONS,
  POPULAR_CITIES,
  detectCityFromCoords,
  getCitiesByRegion,
  type GhanaCity,
} from '@/lib/ghana-locations'
import {
  getStoredLocation,
  setStoredLocation,
  LOCATION_CHANGE_EVENT,
  type StoredLocation,
} from '@/lib/location-region'

type DropdownPosition = { top: number; left: number; width: number; maxHeight: number }

function locationLabel(location: StoredLocation | null): string {
  if (!location?.city && !location?.region) return 'All Ghana'
  if (location.city) return location.city
  return location.region
}

function locationBarLabel(location: StoredLocation | null): string {
  if (!location?.city && !location?.region) return 'Your location'
  if (location.city) return location.city
  return location.region
}

interface LocationPickerProps {
  /** 'pill' | 'icon' | 'field' | 'bar' (inline inside Eventbrite-style search bar) */
  variant?: 'pill' | 'icon' | 'field' | 'bar'
}

export default function LocationPicker({ variant = 'pill' }: LocationPickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [stored, setStoredState] = useState<StoredLocation | null>(null)
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 288, maxHeight: 440 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const urlCity = searchParams.get('city') ?? ''
  const urlRegion = searchParams.get('region') ?? ''
  const active: StoredLocation | null = urlCity
    ? { city: urlCity, region: urlRegion }
    : urlRegion
      ? { city: '', region: urlRegion }
      : stored

  useEffect(() => {
    setMounted(true)
    setStoredState(getStoredLocation())

    function sync() {
      setStoredState(getStoredLocation())
    }
    window.addEventListener(LOCATION_CHANGE_EVENT, sync)
    return () => window.removeEventListener(LOCATION_CHANGE_EVENT, sync)
  }, [])

  useEffect(() => {
    if (urlCity || urlRegion) {
      const loc = urlCity
        ? { city: urlCity, region: urlRegion }
        : { city: '', region: urlRegion }
      setStoredState(loc)
      setStoredLocation(loc)
    }
  }, [urlCity, urlRegion])

  const updatePosition = useCallback(() => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const width = 288
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)

    // Keep the panel fully on screen: prefer below the trigger, but shift
    // up (and cap the height) when there isn't enough room.
    const maxHeight = Math.min(440, window.innerHeight - 24)
    let top = rect.bottom + 8
    if (top + maxHeight > window.innerHeight - 12) {
      top = Math.max(12, window.innerHeight - 12 - maxHeight)
    }
    setPosition({ top, left, width, maxHeight })
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    function onScrollOrResize() {
      updatePosition()
    }
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function navigate(city: GhanaCity | null) {
    const loc = city ? { city: city.name, region: city.region } : null
    setStoredState(loc)
    setStoredLocation(loc)
    setOpen(false)
    setGeoError(null)

    const p = new URLSearchParams(searchParams.toString())
    if (city) {
      p.set('city', city.name)
      p.set('region', city.region)
    } else {
      p.delete('city')
      p.delete('region')
    }
    p.delete('page')

    const query = p.toString()
    const target = pathname.startsWith('/events')
      ? `${pathname}${query ? `?${query}` : ''}`
      : `/events${query ? `?${query}` : ''}`

    router.push(target)
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported by your browser')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const city = detectCityFromCoords(coords.latitude, coords.longitude)
        setLocating(false)
        if (city) navigate(city)
        else setGeoError('Your location appears to be outside Ghana')
      },
      (err) => {
        setLocating(false)
        if (err.code === 1) {
          setGeoError('Location access denied — please allow in browser settings')
        } else {
          setGeoError('Could not get your location, try again')
        }
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  }

  function isActive(city: GhanaCity) {
    return active?.city === city.name
  }

  const dropdown = open && mounted ? createPortal(
    <>
      <div className="fixed inset-0 z-[60]" aria-hidden onClick={() => setOpen(false)} />
      <div
        ref={panelRef}
        role="listbox"
        className="fixed z-[70] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        style={{ top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight }}
      >
        <div className="border-b border-gray-100 p-2">
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#C9973A]/8 hover:text-[#C9973A] disabled:opacity-50"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#C9973A]" />
            ) : (
              <Navigation className="h-4 w-4 shrink-0 text-[#C9973A]" />
            )}
            {locating ? 'Detecting your location...' : 'Use my current location'}
          </button>
          {geoError && <p className="mt-1.5 px-3 text-xs text-red-500">{geoError}</p>}
        </div>

        <div className="border-b border-gray-100 p-2">
          <button
            type="button"
            onClick={() => navigate(null)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-gray-50"
          >
            <span className={!active?.city && !active?.region ? 'font-semibold text-[#C9973A]' : 'text-gray-700'}>
              All Ghana
            </span>
            {!active?.city && !active?.region && <Check className="h-4 w-4 text-[#C9973A]" />}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Popular cities
          </p>
          {POPULAR_CITIES.map((city) => (
            <CityOption key={city.name} city={city} active={isActive(city)} onSelect={() => navigate(city)} />
          ))}

          {GHANA_REGIONS.map((region) => {
            const cities = getCitiesByRegion(region).filter((c) => !c.popular)
            if (cities.length === 0) return null
            return (
              <div key={region} className="mt-2">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {region}
                </p>
                {cities.map((city) => (
                  <CityOption key={city.name} city={city} active={isActive(city)} onSelect={() => navigate(city)} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </>,
    document.body,
  ) : null

  const triggerClass = variant === 'field'
    ? `flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5
       text-sm font-medium text-gray-700 transition hover:border-[#C9973A]/50 outline-none`
    : variant === 'icon'
      ? `flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200
         bg-white text-gray-500 transition hover:border-[#C9973A]/40 hover:bg-gray-50 outline-none`
      : variant === 'bar'
        ? `flex h-full max-w-[9rem] shrink-0 items-center gap-1.5 rounded-full px-3 text-sm
           text-gray-600 transition hover:bg-gray-50 outline-none sm:max-w-[10rem]`
        : `flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-gray-200
           bg-white px-2.5 text-sm font-medium text-gray-700 transition
           hover:border-[#C9973A]/40 hover:bg-gray-50 outline-none`

  const label = variant === 'bar' ? locationBarLabel(active) : locationLabel(active)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setGeoError(null)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={variant === 'icon' ? `Location: ${label}` : undefined}
        title={variant === 'icon' ? label : undefined}
        className={triggerClass}
      >
        <MapPin
          size={variant === 'field' ? 16 : 14}
          className="shrink-0 text-gray-400"
        />
        {variant !== 'icon' && (
          <>
            <span className={
              variant === 'field'
                ? 'flex-1 truncate text-left'
                : variant === 'bar'
                  ? 'truncate text-gray-700'
                  : 'max-w-[96px] truncate'
            }>
              {label}
            </span>
            {variant !== 'bar' && (
              <ChevronDown
                size={variant === 'field' ? 14 : 12}
                className={`shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              />
            )}
          </>
        )}
      </button>
      {dropdown}
    </>
  )
}

function CityOption({
  city,
  active,
  onSelect,
}: {
  city: GhanaCity
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-gray-50"
    >
      <span>
        <span className={active ? 'font-semibold text-[#C9973A]' : 'text-gray-700'}>{city.name}</span>
        <span className="ml-1.5 text-xs text-gray-400">{city.region}</span>
      </span>
      {active && <Check className="h-4 w-4 shrink-0 text-[#C9973A]" />}
    </button>
  )
}
