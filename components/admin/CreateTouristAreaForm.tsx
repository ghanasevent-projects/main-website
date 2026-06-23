'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createTouristArea, updateTouristArea } from '@/app/admin/actions'
import BannerUpload from '@/components/ui/BannerUpload'
import VenueMapPicker from '@/components/ui/VenueMapPicker'
import RegionLocationPicker from '@/components/ui/RegionLocationPicker'

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

const CATEGORIES = [
  { value: 'beach', label: 'Beach' },
  { value: 'historical', label: 'Historical' },
  { value: 'nature', label: 'Nature' },
  { value: 'market', label: 'Market' },
] as const

export interface TouristAreaFormData {
  id: string
  name: string
  description: string | null
  region: string | null
  city: string | null
  category: string | null
  entry_fee: string | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
}

interface CreateTouristAreaFormProps {
  area?: TouristAreaFormData
}

export default function CreateTouristAreaForm({ area }: CreateTouristAreaFormProps) {
  const router = useRouter()
  const isEdit = Boolean(area)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(area?.name ?? '')
  const [description, setDescription] = useState(area?.description ?? '')
  const [region, setRegion] = useState(area?.region ?? '')
  const [city, setCity] = useState(area?.city ?? '')
  const [category, setCategory] = useState(area?.category ?? '')
  const [entryFee, setEntryFee] = useState(area?.entry_fee ?? '')
  const [latitude, setLatitude] = useState<number | null>(area?.latitude ?? null)
  const [longitude, setLongitude] = useState<number | null>(area?.longitude ?? null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(area?.image_url ?? null)
  const [removeImage, setRemoveImage] = useState(false)

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
      fd.set('region', region)
      fd.set('city', city)
      fd.set('category', category)
      fd.set('entry_fee', entryFee)
      if (latitude != null) fd.set('latitude', String(latitude))
      if (longitude != null) fd.set('longitude', String(longitude))
      if (bannerFile) fd.set('image', bannerFile)
      if (removeImage) fd.set('remove_image', 'true')

      if (isEdit && area) {
        await updateTouristArea(area.id, fd)
      } else {
        await createTouristArea(fd)
      }
      router.push('/admin/tourist-areas')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${isEdit ? 'update' : 'create'} tourist area`)
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
          Attraction details
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input id="name" value={name} onChange={e => setName(e.target.value)} className={inputClass}
              placeholder="e.g. Kakum National Park" required />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              rows={4} className={`${inputClass} h-auto py-2.5 resize-y`}
              placeholder="What makes this place special…" />
          </div>
          <BannerUpload
            preview={bannerPreview}
            onChange={onBannerChange}
            label="Cover photo"
            hint="A striking photo helps travellers discover this attraction."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Location & category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <RegionLocationPicker
            value={{ region, city }}
            onChange={({ region: r, city: c }) => { setRegion(r); setCity(c) }}
            cityLabel="City / nearest town"
            required
            className="sm:col-span-2"
          />
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="entry_fee" className={labelClass}>Entry fee (display text)</label>
            <input id="entry_fee" value={entryFee} onChange={e => setEntryFee(e.target.value)} className={inputClass}
              placeholder="e.g. Free · GHS 20 · GHS 10–40" />
          </div>
        </div>
        <div className="mt-4">
          <VenueMapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
            venueName={name}
            city={city}
          />
        </div>
      </section>

      <button type="submit" disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9973A]
                   text-sm font-semibold text-white transition hover:bg-[#b8852e] disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save changes' : 'Add tourist area')}
      </button>
    </form>
  )
}
