/** Approximate city-centre coordinates for map defaults in Ghana. */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Accra: { lat: 5.6037, lng: -0.187 },
  Tema: { lat: 5.6698, lng: -0.0167 },
  Madina: { lat: 5.6833, lng: -0.1667 },
  Kasoa: { lat: 5.5345, lng: -0.4167 },
  Ashaiman: { lat: 5.6944, lng: -0.0292 },
  Kumasi: { lat: 6.6885, lng: -1.6244 },
  Obuasi: { lat: 6.2028, lng: -1.6536 },
  Ejisu: { lat: 6.7333, lng: -1.5167 },
  Konongo: { lat: 6.6167, lng: -1.2167 },
  Takoradi: { lat: 4.8845, lng: -1.7554 },
  Sekondi: { lat: 4.9433, lng: -1.704 },
  Tarkwa: { lat: 5.3014, lng: -1.9897 },
  'Cape Coast': { lat: 5.1053, lng: -1.2466 },
  Elmina: { lat: 5.0833, lng: -1.35 },
  Winneba: { lat: 5.3517, lng: -0.6236 },
  Koforidua: { lat: 6.094, lng: -0.2591 },
  Nsawam: { lat: 5.8083, lng: -0.35 },
  Ho: { lat: 6.6119, lng: 0.4708 },
  Hohoe: { lat: 7.1519, lng: 0.4736 },
  Tamale: { lat: 9.4034, lng: -0.8424 },
  Yendi: { lat: 9.4425, lng: -0.0093 },
  Bolgatanga: { lat: 10.7856, lng: -0.8514 },
  Wa: { lat: 10.0601, lng: -2.5099 },
  Sunyani: { lat: 7.3399, lng: -2.3268 },
  Techiman: { lat: 7.5906, lng: -1.9395 },
  Goaso: { lat: 6.8036, lng: -2.5167 },
  Dambai: { lat: 8.0667, lng: 0.1833 },
  Jasikan: { lat: 7.4571, lng: 0.4783 },
  Damongo: { lat: 9.0833, lng: -1.8167 },
  Nalerigu: { lat: 10.5167, lng: -0.3667 },
  'Sefwi Wiawso': { lat: 6.2, lng: -2.4833 },
}

export function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  return CITY_COORDINATES[city] ?? null
}
