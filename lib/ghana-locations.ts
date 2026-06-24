export interface GhanaCity {
  name: string
  region: string
  popular?: boolean
}

export const GHANA_CITIES: GhanaCity[] = [
  // Greater Accra
  { name: 'Accra', region: 'Greater Accra', popular: true },
  { name: 'Tema', region: 'Greater Accra', popular: true },
  { name: 'Madina', region: 'Greater Accra' },
  { name: 'Ashaiman', region: 'Greater Accra' },
  { name: 'Teshie', region: 'Greater Accra' },
  { name: 'Nungua', region: 'Greater Accra' },
  { name: 'Dome', region: 'Greater Accra' },
  { name: 'Adenta', region: 'Greater Accra' },
  { name: 'East Legon', region: 'Greater Accra' },
  { name: 'Osu', region: 'Greater Accra' },
  { name: 'Labadi', region: 'Greater Accra' },
  { name: 'Dansoman', region: 'Greater Accra' },
  { name: 'Weija', region: 'Greater Accra' },
  { name: 'Pokuase', region: 'Greater Accra' },
  { name: 'Dodowa', region: 'Greater Accra' },
  { name: 'Prampram', region: 'Greater Accra' },
  { name: 'Ada', region: 'Greater Accra' },
  // Ashanti
  { name: 'Kumasi', region: 'Ashanti', popular: true },
  { name: 'Obuasi', region: 'Ashanti' },
  { name: 'Ejisu', region: 'Ashanti' },
  { name: 'Konongo', region: 'Ashanti' },
  { name: 'Mampong', region: 'Ashanti' },
  { name: 'Bekwai', region: 'Ashanti' },
  { name: 'Agogo', region: 'Ashanti' },
  { name: 'Offinso', region: 'Ashanti' },
  { name: 'Juaso', region: 'Ashanti' },
  { name: 'Asante Bekwai', region: 'Ashanti' },
  // Western
  { name: 'Takoradi', region: 'Western', popular: true },
  { name: 'Sekondi', region: 'Western' },
  { name: 'Tarkwa', region: 'Western' },
  { name: 'Axim', region: 'Western' },
  { name: 'Prestea', region: 'Western' },
  { name: 'Bogoso', region: 'Western' },
  { name: 'Elubo', region: 'Western' },
  { name: 'Half Assini', region: 'Western' },
  // Central
  { name: 'Cape Coast', region: 'Central', popular: true },
  { name: 'Elmina', region: 'Central' },
  { name: 'Winneba', region: 'Central' },
  { name: 'Kasoa', region: 'Central' },
  { name: 'Agona Swedru', region: 'Central' },
  { name: 'Saltpond', region: 'Central' },
  { name: 'Mankessim', region: 'Central' },
  { name: 'Dunkwa-on-Offin', region: 'Central' },
  { name: 'Twifo Praso', region: 'Central' },
  // Eastern
  { name: 'Koforidua', region: 'Eastern', popular: true },
  { name: 'Nsawam', region: 'Eastern' },
  { name: 'Akropong', region: 'Eastern' },
  { name: 'Aburi', region: 'Eastern' },
  { name: 'Nkawkaw', region: 'Eastern' },
  { name: 'Somanya', region: 'Eastern' },
  { name: 'Kibi', region: 'Eastern' },
  { name: 'Suhum', region: 'Eastern' },
  { name: 'Akim Oda', region: 'Eastern' },
  // Volta
  { name: 'Ho', region: 'Volta', popular: true },
  { name: 'Hohoe', region: 'Volta' },
  { name: 'Keta', region: 'Volta' },
  { name: 'Aflao', region: 'Volta' },
  { name: 'Amedzofe', region: 'Volta' },
  { name: 'Kpando', region: 'Volta' },
  { name: 'Sogakope', region: 'Volta' },
  { name: 'Denu', region: 'Volta' },
  // Northern
  { name: 'Tamale', region: 'Northern', popular: true },
  { name: 'Yendi', region: 'Northern' },
  { name: 'Savelugu', region: 'Northern' },
  { name: 'Bimbilla', region: 'Northern' },
  // Upper East
  { name: 'Bolgatanga', region: 'Upper East' },
  { name: 'Bawku', region: 'Upper East' },
  { name: 'Navrongo', region: 'Upper East' },
  { name: 'Zebilla', region: 'Upper East' },
  // Upper West
  { name: 'Wa', region: 'Upper West' },
  { name: 'Tumu', region: 'Upper West' },
  { name: 'Lawra', region: 'Upper West' },
  { name: 'Jirapa', region: 'Upper West' },
  // Bono
  { name: 'Sunyani', region: 'Bono', popular: true },
  { name: 'Berekum', region: 'Bono' },
  { name: 'Dormaa Ahenkro', region: 'Bono' },
  { name: 'Wenchi', region: 'Bono' },
  // Bono East
  { name: 'Techiman', region: 'Bono East' },
  { name: 'Kintampo', region: 'Bono East' },
  { name: 'Atebubu', region: 'Bono East' },
  { name: 'Nkoranza', region: 'Bono East' },
  // Ahafo
  { name: 'Goaso', region: 'Ahafo' },
  { name: 'Bechem', region: 'Ahafo' },
  { name: 'Duayaw Nkwanta', region: 'Ahafo' },
  // Oti
  { name: 'Dambai', region: 'Oti' },
  { name: 'Jasikan', region: 'Oti' },
  { name: 'Kete Krachi', region: 'Oti' },
  { name: 'Nkwanta', region: 'Oti' },
  // Savannah
  { name: 'Damongo', region: 'Savannah' },
  { name: 'Bole', region: 'Savannah' },
  { name: 'Salaga', region: 'Savannah' },
  // North East
  { name: 'Nalerigu', region: 'North East' },
  { name: 'Gambaga', region: 'North East' },
  { name: 'Walewale', region: 'North East' },
  // Western North
  { name: 'Sefwi Wiawso', region: 'Western North' },
  { name: 'Bibiani', region: 'Western North' },
  { name: 'Enchi', region: 'Western North' },
]

export const POPULAR_CITIES = GHANA_CITIES.filter((c) => c.popular)

const DUPLICATE_CITY_NAMES = new Set(
  GHANA_CITIES.map((c) => c.name).filter(
    (name, _i, arr) => arr.filter((n) => n === name).length > 1,
  ),
)

export function cityDisplayLabel(c: GhanaCity): string {
  return DUPLICATE_CITY_NAMES.has(c.name) ? `${c.name} (${c.region})` : c.name
}

export const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
  'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Oti', 'Savannah', 'North East', 'Western North',
] as const

export const REGION_PRIMARY_CITY: Record<string, string> = {
  'Greater Accra': 'Accra',
  Ashanti: 'Kumasi',
  Western: 'Takoradi',
  Central: 'Cape Coast',
  Eastern: 'Koforidua',
  Volta: 'Ho',
  Northern: 'Tamale',
  'Upper East': 'Bolgatanga',
  'Upper West': 'Wa',
  Bono: 'Sunyani',
  'Bono East': 'Techiman',
  Ahafo: 'Goaso',
  Oti: 'Dambai',
  Savannah: 'Damongo',
  'North East': 'Nalerigu',
  'Western North': 'Sefwi Wiawso',
}

const REGION_BOUNDS: Record<string, [number, number, number, number]> = {
  'Greater Accra': [5.35, 5.90, -0.45, 0.10],
  Ashanti: [6.20, 7.60, -2.50, -0.80],
  Western: [4.50, 6.40, -3.30, -1.80],
  Eastern: [5.80, 7.20, -1.10, 0.40],
  Central: [4.90, 6.10, -2.20, -0.50],
  Northern: [8.80, 10.70, -2.90, -0.10],
  Volta: [5.60, 8.80, 0.00, 1.20],
  'Upper East': [10.50, 11.20, -1.00, 0.80],
  'Upper West': [9.70, 11.20, -2.90, -1.60],
  Oti: [7.50, 9.40, 0.00, 0.90],
  Ahafo: [6.90, 8.00, -3.00, -1.90],
  Bono: [7.20, 8.60, -3.20, -1.80],
  'Bono East': [7.30, 8.80, -1.80, -0.40],
  'Western North': [5.80, 7.80, -3.30, -2.10],
  Savannah: [8.20, 10.50, -2.80, -0.50],
  'North East': [9.80, 11.10, -0.80, 0.70],
}

export function getCityByName(name: string, region?: string): GhanaCity | undefined {
  const normalized = name.toLowerCase()
  if (region) {
    return GHANA_CITIES.find(
      (c) => c.name.toLowerCase() === normalized && c.region === region,
    )
  }
  return GHANA_CITIES.find((c) => c.name.toLowerCase() === normalized)
}

/** Stable id for city pickers when names repeat across regions (e.g. Salaga). */
export function citySelectValue(c: Pick<GhanaCity, 'name' | 'region'>): string {
  return `${c.name}|${c.region}`
}

export function parseCitySelectValue(value: string): GhanaCity | undefined {
  const pipe = value.indexOf('|')
  if (pipe === -1) return getCityByName(value)
  const name = value.slice(0, pipe)
  const region = value.slice(pipe + 1)
  return getCityByName(name, region)
}

export function getRegionForCity(city: string): string | undefined {
  return getCityByName(city)?.region
}

/** Resolve region from explicit value or known city name. */
export function resolveRegion(region: string, city: string): string {
  if (region.trim()) return region.trim()
  return getRegionForCity(city) ?? ''
}

export function getCitiesByRegion(region: string): GhanaCity[] {
  return GHANA_CITIES.filter((c) => c.region === region)
}

export function detectRegionFromCoords(lat: number, lng: number): string | null {
  for (const [region, [minLat, maxLat, minLng, maxLng]] of Object.entries(REGION_BOUNDS)) {
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return region
    }
  }
  return null
}

export function detectCityFromCoords(lat: number, lng: number): GhanaCity | null {
  const region = detectRegionFromCoords(lat, lng)
  if (!region) return null
  const primary = REGION_PRIMARY_CITY[region]
  return getCityByName(primary) ?? getCitiesByRegion(region)[0] ?? null
}

export function buildEventsLocationUrl(city?: string, region?: string): string {
  const p = new URLSearchParams()
  if (city) p.set('city', city)
  if (region) p.set('region', region)
  const qs = p.toString()
  return `/events${qs ? `?${qs}` : ''}`
}
