/** Display coordinates as "lat, lng" with full numeric precision. */
export function formatCoordinatePair(lat: number, lng: number): string {
  return `${lat}, ${lng}`
}

/** Parse "6.857002589002211, 0.4336800882825621" or "lat lng" text. */
export function parseCoordinatePair(input: string): { lat: number; lng: number } | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const parts = trimmed.split(/[,\s]+/).map(p => p.trim()).filter(Boolean)
  if (parts.length !== 2) return null

  const lat = Number(parts[0])
  const lng = Number(parts[1])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

export const COORDINATE_INPUT_PLACEHOLDER = '6.857002589002211, 0.4336800882825621'

export const COORDINATE_INPUT_HINT =
  'Paste or type latitude and longitude separated by a comma, e.g. 6.857002589002211, 0.4336800882825621'
