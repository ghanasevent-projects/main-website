export const CITY_STORAGE_KEY = 'ghanasevent-city'
export const REGION_STORAGE_KEY = 'ghanasevent-region'
export const LOCATION_CHANGE_EVENT = 'ghanasevent-location-change'

/** @deprecated use LOCATION_CHANGE_EVENT */
export const REGION_CHANGE_EVENT = LOCATION_CHANGE_EVENT

export type StoredLocation = {
  city: string
  region: string
}

export function getStoredLocation(): StoredLocation | null {
  if (typeof window === 'undefined') return null
  const city = localStorage.getItem(CITY_STORAGE_KEY)
  const region = localStorage.getItem(REGION_STORAGE_KEY)
  if (city && region) return { city, region }
  if (region) return { city: '', region }
  return null
}

export function setStoredLocation(location: StoredLocation | null) {
  if (typeof window === 'undefined') return
  if (location?.city) localStorage.setItem(CITY_STORAGE_KEY, location.city)
  else localStorage.removeItem(CITY_STORAGE_KEY)
  if (location?.region) localStorage.setItem(REGION_STORAGE_KEY, location.region)
  else localStorage.removeItem(REGION_STORAGE_KEY)
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
}

export function getStoredRegion(): string {
  return getStoredLocation()?.region ?? ''
}

export function getStoredCity(): string {
  return getStoredLocation()?.city ?? ''
}

export function setStoredRegion(region: string) {
  if (!region) {
    setStoredLocation(null)
    return
  }
  setStoredLocation({ city: '', region })
}
