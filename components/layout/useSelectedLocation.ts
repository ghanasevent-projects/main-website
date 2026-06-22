'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  getStoredLocation,
  LOCATION_CHANGE_EVENT,
  type StoredLocation,
} from '@/lib/location-region'
import { getRegionForCity } from '@/lib/ghana-locations'

export function useSelectedLocation(): StoredLocation | null {
  const searchParams = useSearchParams()
  const urlCity = searchParams.get('city') ?? ''
  const urlRegion = searchParams.get('region') ?? ''
  const [stored, setStored] = useState<StoredLocation | null>(null)

  useEffect(() => {
    function sync() {
      setStored(getStoredLocation())
    }
    sync()
    window.addEventListener(LOCATION_CHANGE_EVENT, sync)
    return () => window.removeEventListener(LOCATION_CHANGE_EVENT, sync)
  }, [])

  if (urlCity) {
    return { city: urlCity, region: urlRegion || getRegionForCity(urlCity) || '' }
  }
  if (urlRegion) {
    return { city: '', region: urlRegion }
  }
  return stored
}

/** @deprecated use useSelectedLocation */
export function useSelectedRegion() {
  const location = useSelectedLocation()
  return location?.city || location?.region || ''
}
