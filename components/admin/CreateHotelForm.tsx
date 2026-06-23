'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createHotel, updateHotel } from '@/app/admin/actions'
import BannerUpload from '@/components/ui/BannerUpload'
import VenueMapPicker from '@/components/ui/VenueMapPicker'
import RegionLocationPicker from '@/components/ui/RegionLocationPicker'

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

const AMENITIES = ['wifi', 'parking', 'pool', 'ac'] as const

export interface HotelFormData {
  id: string
  name: string
  description: string | null
  address: string | null
  region: string | null
  city: string | null
  price_range: string | null
  phone: string | null
  website: string | null
  amenities: string[] | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
}

interface CreateHotelFormProps {
  hotel?: HotelFormData
}

export default function CreateHotelForm({ hotel }: CreateHotelFormProps) {
  const router = useRouter()
  const isEdit = Boolean(hotel)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(hotel?.name ?? '')
  const [description, setDescription] = useState(hotel?.description ?? '')
  const [address, setAddress] = useState(hotel?.address ?? '')
  const [region, setRegion] = useState(hotel?.region ?? '')
  const [city, setCity] = useState(hotel?.city ?? '')
  const [priceRange, setPriceRange] = useState(hotel?.price_range ?? '')
  const [phone, setPhone] = useState(hotel?.phone ?? '')
  const [website, setWebsite] = useState(hotel?.website ?? '')
  const [amenities, setAmenities] = useState<string[]>(hotel?.amenities ?? [])
  const [latitude, setLatitude] = useState<number | null>(hotel?.latitude ?? null)
  const [longitude, setLongitude] = useState<number | null>(hotel?.longitude ?? null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(hotel?.image_url ?? null)
  const [removeImage, setRemoveImage] = useState(false)

  function toggleAmenity(a: string) {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  function onBannerChange(file: File | null, preview: string | null) {
    setBannerFile(file)
    setBannerPreview(preview)
    setRemoveImage(!preview)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.set('name', name)
      fd.set('description', description)
      fd.set('address', address)
      fd.set('region', region)
      fd.set('city', city)
      fd.set('price_range', priceRange)
      fd.set('phone', phone)
      fd.set('website', website)
      fd.set('amenities', amenities.join(','))
      if (latitude != null) fd.set('latitude', String(latitude))
      if (longitude != null) fd.set('longitude', String(longitude))
      if (bannerFile) fd.set('image', bannerFile)
      if (removeImage) fd.set('remove_image', 'true')

      if (isEdit && hotel) {
        await updateHotel(hotel.id, fd)
      } else {
        await createHotel(fd)
      }
      router.push('/admin/hotels')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${isEdit ? 'update' : 'create'} hotel`)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Property details
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>Hotel name</label>
            <input id="name" value={name} onChange={e => setName(e.target.value)} className={inputClass}
              placeholder="e.g. Labadi Beach Hotel" required />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              rows={4} className={`${inputClass} h-auto py-2.5 resize-y`}
              placeholder="Brief overview for travellers…" />
          </div>
          <BannerUpload
            preview={bannerPreview}
            onChange={onBannerChange}
            label="Cover photo"
            hint="Shown on the hotels listing page. Use a bright, professional photo of the property."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Location</h2>
        <div className="space-y-4">
          <RegionLocationPicker
            value={{ region, city }}
            onChange={({ region: r, city: c }) => { setRegion(r); setCity(c) }}
            required
          />
          <div>
            <label htmlFor="address" className={labelClass}>Address</label>
            <input id="address" value={address} onChange={e => setAddress(e.target.value)} className={inputClass}
              placeholder="Street address" />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>Price range</label>
            <select id="price" value={priceRange} onChange={e => setPriceRange(e.target.value)} className={inputClass}>
              <option value="">Select range</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <VenueMapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
            venueName={name}
            address={address}
            city={city}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Contact & amenities</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass}
              placeholder="+233 …" />
          </div>
          <div>
            <label htmlFor="website" className={labelClass}>Website</label>
            <input id="website" type="url" value={website} onChange={e => setWebsite(e.target.value)} className={inputClass}
              placeholder="https://…" />
          </div>
        </div>
        <div className="mt-4">
          <span className={labelClass}>Amenities</span>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition
                  ${amenities.includes(a)
                    ? 'border-[#C9973A] bg-[#C9973A]/10 text-[#C9973A]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button type="submit" disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9973A]
                   text-sm font-semibold text-white transition hover:bg-[#b8852e] disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save changes' : 'Add hotel')}
      </button>
    </form>
  )
}
