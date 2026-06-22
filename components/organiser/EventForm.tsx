'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Plus, Trash2, Rocket, Check, Lock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resolveRegion } from '@/lib/ghana-locations'
import { PROMOTION_TIERS, getPromotionTier } from '@/lib/promotions'
import BannerUpload from '@/components/ui/BannerUpload'
import VenueMapPicker from '@/components/ui/VenueMapPicker'
import VenueGalleryUpload from '@/components/ui/VenueGalleryUpload'
import RegionLocationPicker from '@/components/ui/RegionLocationPicker'
import OrganiserDetailsFields from '@/components/organiser/OrganiserDetailsFields'
import {
  saveOrganiserDetails,
  type OrganiserDetailsInitial,
} from '@/lib/organiser-details'
import { buildEventSlugBase, generateEventSlug } from '@/lib/event-slug'
import { CEDI } from '@/lib/currency'

interface Category {
  id: string
  name: string
}

interface TicketRow {
  id?: string
  name: string
  price: string
  quantity: string
  quantitySold?: number
}

export interface EventFormInitial {
  eventId: string
  slug: string
  title: string
  categoryId: string
  description: string
  bannerUrl: string | null
  venueName: string
  address: string
  region: string
  city: string
  latitude: number | null
  longitude: number | null
  startDate: string
  endDate: string
  isFree: boolean
  externalTicketUrl: string | null
  status: string
  tickets: TicketRow[]
  venueImages?: string[]
}

type TicketMode = 'free' | 'paid' | 'external'

const BANNER_BUCKET = 'event-banners'

function initialTicketMode(data: EventFormInitial): TicketMode {
  if (data.externalTicketUrl) return 'external'
  if (data.tickets.length > 0) return 'paid'
  return 'free'
}

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

export default function EventForm({
  userId,
  categories,
  mode = 'create',
  initial,
  organiserDetails: organiserDetailsInitial,
}: {
  userId: string
  categories: Category[]
  mode?: 'create' | 'edit'
  initial?: EventFormInitial
  organiserDetails?: OrganiserDetailsInitial
}) {
  const isEdit = mode === 'edit' && initial
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(initial?.title ?? '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(initial?.bannerUrl ?? null)
  const [venueName, setVenueName] = useState(initial?.venueName ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [region, setRegion] = useState(initial?.region ?? '')
  const [city, setCity] = useState(initial?.city ?? '')
  const [latitude, setLatitude] = useState<number | null>(initial?.latitude ?? null)
  const [longitude, setLongitude] = useState<number | null>(initial?.longitude ?? null)
  const [venueImageUrls, setVenueImageUrls] = useState<string[]>(initial?.venueImages ?? [])
  const [venueImageFiles, setVenueImageFiles] = useState<File[]>([])
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [ticketMode, setTicketMode] = useState<TicketMode>(
    initial ? initialTicketMode(initial) : 'free',
  )
  const [tickets, setTickets] = useState<TicketRow[]>(
    initial?.tickets.length
      ? initial.tickets
      : [{ name: 'General admission', price: '', quantity: '' }],
  )
  const [externalUrl, setExternalUrl] = useState(initial?.externalTicketUrl ?? '')
  const [tierId, setTierId] = useState('free')
  const [organiserDetails, setOrganiserDetails] = useState<OrganiserDetailsInitial>(
    organiserDetailsInitial ?? {
      name: '',
      phone: '',
      whatsapp: '',
      website: '',
      bio: '',
      city: '',
      region: '',
      instagramUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
    },
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ticketsSold = tickets.some(t => (t.quantitySold ?? 0) > 0)
  const slugPreview = buildEventSlugBase({
    title: title.trim() || 'event',
    startDate: startDate || undefined,
  })
  const showSlugPreview = !isEdit || initial!.status === 'pending' || initial!.status === 'rejected'

  function updateTicket(index: number, patch: Partial<TicketRow>) {
    setTickets(rows => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function validate(): string | null {
    if (title.trim().length < 5) return 'Title must be at least 5 characters'
    if (!categoryId) return 'Choose a category'
    if (description.trim().length < 20) return 'Description must be at least 20 characters'
    if (!venueName.trim()) return 'Venue name is required'
    if (!region.trim()) return 'Choose a region'
    if (!city.trim()) return 'Choose or enter a city / town'
    if (!startDate || !endDate) return 'Start and end date are required'
    if (new Date(startDate) >= new Date(endDate)) return 'End date must be after the start date'
    if (!isEdit && new Date(startDate).getTime() < Date.now()) {
      return 'Start date must be in the future'
    }

    if (ticketMode === 'paid') {
      for (const t of tickets) {
        if (!t.name.trim()) return 'Every ticket type needs a name'
        if (!t.price || Number(t.price) <= 0) return 'Every ticket type needs a price above 0'
        if (!t.quantity || Number(t.quantity) <= 0) return 'Every ticket type needs a quantity'
        const sold = t.quantitySold ?? 0
        if (Number(t.quantity) < sold) {
          return `"${t.name}" quantity cannot be less than ${sold} already sold`
        }
      }
    }
    if (ticketMode === 'external' && !/^https?:\/\//.test(externalUrl.trim())) {
      return 'Enter a valid ticket link starting with http:// or https://'
    }
    if (isEdit && ticketsSold && ticketMode !== 'paid') {
      return 'Cannot change ticket setup while tickets have been sold'
    }
    return null
  }

  async function uploadBanner(): Promise<string | null> {
    if (!bannerFile) return null
    const ext = bannerFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${userId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(BANNER_BUCKET)
      .upload(path, bannerFile, { cacheControl: '3600' })
    if (uploadError) {
      throw new Error(`Banner upload failed: ${uploadError.message}. Have you run event-promotions.sql?`)
    }
    return supabase.storage.from(BANNER_BUCKET).getPublicUrl(path).data.publicUrl
  }

  async function uploadVenueImages(): Promise<string[]> {
    const urls = [...venueImageUrls]
    for (let i = 0; i < venueImageFiles.length; i++) {
      const file = venueImageFiles[i]
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${userId}/venue/${Date.now()}-${i}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(BANNER_BUCKET)
        .upload(path, file, { cacheControl: '3600' })
      if (uploadError) {
        throw new Error(`Venue photo upload failed: ${uploadError.message}`)
      }
      urls.push(supabase.storage.from(BANNER_BUCKET).getPublicUrl(path).data.publicUrl)
    }
    return urls
  }

  async function syncTickets(eventId: string) {
    if (ticketMode === 'free' || ticketMode === 'external') {
      const { data: existing } = await supabase
        .from('ticket_types')
        .select('id, quantity_sold')
        .eq('event_id', eventId)

      if (existing?.some(t => t.quantity_sold > 0)) {
        throw new Error('Cannot remove ticket types that have already sold')
      }
      if (existing?.length) {
        const { error } = await supabase.from('ticket_types').delete().eq('event_id', eventId)
        if (error) throw new Error(error.message)
      }
      return
    }

    const { data: dbTickets } = await supabase
      .from('ticket_types')
      .select('id, quantity_sold')
      .eq('event_id', eventId)

    const keepIds = new Set(tickets.filter(t => t.id).map(t => t.id!))

    for (const db of dbTickets ?? []) {
      if (keepIds.has(db.id)) continue
      if (db.quantity_sold > 0) {
        throw new Error('Cannot remove ticket types that have already sold')
      }
      const { error } = await supabase.from('ticket_types').delete().eq('id', db.id)
      if (error) throw new Error(error.message)
    }

    for (const t of tickets) {
      const payload = {
        name: t.name.trim(),
        price: Number(t.price),
        quantity: Number(t.quantity),
      }
      if (t.id) {
        const { error } = await supabase.from('ticket_types').update(payload).eq('id', t.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('ticket_types').insert({
          event_id: eventId,
          ...payload,
          quantity_sold: 0,
        })
        if (error) throw new Error(error.message)
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const problem = validate()
    if (problem) {
      setError(problem)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    try {
      await saveOrganiserDetails(supabase, userId, organiserDetails)

      const bannerUrl = bannerFile ? await uploadBanner() : (initial?.bannerUrl ?? null)
      const venueImages = await uploadVenueImages()
      const resolvedRegion = resolveRegion(region, city)

      const eventPayload = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        venue_name: venueName.trim(),
        address: address.trim(),
        city: city.trim(),
        region: resolvedRegion,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        banner_url: bannerUrl,
        venue_images: venueImages,
        latitude,
        longitude,
        is_free: ticketMode === 'free',
        external_ticket_url: ticketMode === 'external' ? externalUrl.trim() : null,
      }

      if (isEdit) {
        const slugUpdate =
          initial!.status === 'pending' || initial!.status === 'rejected'
            ? {
                slug: await generateEventSlug(
                  supabase,
                  { title: title.trim(), startDate },
                  initial!.eventId,
                ),
              }
            : {}

        const { error: eventError } = await supabase
          .from('events')
          .update({
            ...eventPayload,
            ...slugUpdate,
            ...(initial!.status === 'approved' ? { status: 'pending' } : {}),
          })
          .eq('id', initial!.eventId)
          .eq('organiser_id', userId)

        if (eventError) {
          if (eventError.message.includes('venue_images')) {
            throw new Error('Venue photos are not set up yet. Run supabase/policies/event-venue-images.sql in Supabase.')
          }
          throw new Error(eventError.message)
        }
        await syncTickets(initial!.eventId)
        router.push('/organiser/dashboard?updated=1')
        router.refresh()
        return
      }

      const slug = await generateEventSlug(supabase, {
        title: title.trim(),
        startDate,
      })

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          ...eventPayload,
          organiser_id: userId,
          slug,
          status: 'pending',
        })
        .select('id')
        .single()

      if (eventError) {
        if (eventError.message.includes('venue_images')) {
          throw new Error('Venue photos are not set up yet. Run supabase/policies/event-venue-images.sql in Supabase.')
        }
        throw new Error(eventError.message)
      }

      if (ticketMode === 'paid') {
        const { error: ticketError } = await supabase.from('ticket_types').insert(
          tickets.map(t => ({
            event_id: event.id,
            name: t.name.trim(),
            price: Number(t.price),
            quantity: Number(t.quantity),
            quantity_sold: 0,
          })),
        )
        if (ticketError) throw new Error(`Event saved but tickets failed: ${ticketError.message}`)
      }

      const tier = getPromotionTier(tierId)
      if (tier && tier.priceGhs > 0) {
        const res = await fetch('/api/promotions/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.id, tierId }),
        })
        const data = await res.json()
        if (!res.ok || !data.authorization_url) {
          throw new Error(data.error ?? 'Could not start the promotion payment')
        }
        window.location.href = data.authorization_url
        return
      }

      router.push('/organiser/dashboard?created=1')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong, please try again')
      setSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectedTier = getPromotionTier(tierId)

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isEdit && initial!.status === 'approved' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Saving changes to an approved event will send it back for admin review.
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <BannerUpload
          preview={bannerPreview}
          onChange={(file, preview) => {
            setBannerFile(file)
            setBannerPreview(preview)
          }}
          label="Event image"
          hint="A great photo is the first thing people notice. Use a clear, vibrant image that shows the vibe of your event."
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Event details
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Event title</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Accra Music Festival 2026" className={inputClass} />
            {showSlugPreview && title.trim().length >= 3 && (
              <p className="mt-1.5 text-xs text-gray-500">
                Event URL:{' '}
                <span className="font-medium text-gray-700">
                  ghanasevent.com/events/{slugPreview}
                </span>
              </p>
            )}
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              rows={5} placeholder="Tell people what your event is about..."
              className={`${inputClass} h-auto py-2.5 resize-y`} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Location & time
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="venue" className={labelClass}>Venue name</label>
            <input id="venue" type="text" value={venueName} onChange={e => setVenueName(e.target.value)}
              placeholder="e.g. Accra International Conference Centre" className={inputClass} />
          </div>
          <RegionLocationPicker
            value={{ region, city }}
            onChange={({ region: r, city: c }) => { setRegion(r); setCity(c) }}
            required
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>Street address (optional)</label>
            <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 1 Liberation Road" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <VenueMapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
              venueName={venueName}
              address={address}
              city={city}
            />
          </div>
          <div>
            <label htmlFor="start" className={labelClass}>Starts</label>
            <input id="start" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="end" className={labelClass}>Ends</label>
            <input id="end" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <VenueGalleryUpload
              images={venueImageUrls}
              pendingFiles={venueImageFiles}
              onAdd={files => setVenueImageFiles(prev => [...prev, ...files])}
              onRemove={url => setVenueImageUrls(prev => prev.filter(u => u !== url))}
              onRemovePending={index => setVenueImageFiles(prev => prev.filter((_, i) => i !== index))}
              uploading={submitting}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Tickets</h2>
        {ticketsSold && (
          <p className="mb-3 text-xs text-amber-700">
            Some tickets have been sold — you can edit names and increase quantities, but cannot remove sold types or switch to free/external.
          </p>
        )}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {([
            { id: 'free', label: 'Free entry' },
            { id: 'paid', label: 'Sell tickets here' },
            { id: 'external', label: 'External link' },
          ] as { id: TicketMode; label: string }[]).map(option => (
            <button
              key={option.id}
              type="button"
              disabled={ticketsSold && option.id !== 'paid'}
              onClick={() => setTicketMode(option.id)}
              className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition sm:text-sm
                disabled:cursor-not-allowed disabled:opacity-40
                ${ticketMode === option.id
                  ? 'border-[#C9973A] bg-[#C9973A]/10 text-[#C9973A]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {ticketMode === 'paid' && (
          <div className="space-y-3">
            {tickets.map((ticket, i) => (
              <div key={ticket.id ?? i} className="flex flex-wrap items-end gap-2 rounded-xl bg-gray-50 p-3">
                <div className="min-w-32 flex-1">
                  <label className="mb-1 block text-xs text-gray-500">Ticket name</label>
                  <input type="text" value={ticket.name} onChange={e => updateTicket(i, { name: e.target.value })}
                    placeholder="e.g. VIP" className={inputClass} />
                </div>
                <div className="w-28">
                  <label className="mb-1 block text-xs text-gray-500">Price ({CEDI})</label>
                  <input type="number" min="1" step="0.01" value={ticket.price}
                    onChange={e => updateTicket(i, { price: e.target.value })} placeholder="50" className={inputClass} />
                </div>
                <div className="w-28">
                  <label className="mb-1 block text-xs text-gray-500">
                    Qty{(ticket.quantitySold ?? 0) > 0 ? ` (min ${ticket.quantitySold})` : ''}
                  </label>
                  <input type="number" min={ticket.quantitySold ?? 1} value={ticket.quantity}
                    onChange={e => updateTicket(i, { quantity: e.target.value })} placeholder="100" className={inputClass} />
                </div>
                {tickets.length > 1 && (ticket.quantitySold ?? 0) === 0 && (
                  <button type="button" onClick={() => setTickets(rows => rows.filter((_, idx) => idx !== i))}
                    aria-label="Remove ticket type"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setTickets(rows => [...rows, { name: '', price: '', quantity: '' }])}
              className="flex items-center gap-1.5 text-sm font-medium text-[#C9973A] hover:underline">
              <Plus className="h-4 w-4" /> Add another ticket type
            </button>
          </div>
        )}

        {ticketMode === 'external' && (
          <div>
            <label htmlFor="external" className={labelClass}>Ticket page link</label>
            <input id="external" type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
              placeholder="https://..." className={inputClass} />
          </div>
        )}
      </section>

      <OrganiserDetailsFields
        value={organiserDetails}
        onChange={patch => setOrganiserDetails(prev => ({ ...prev, ...patch }))}
      />

      {!isEdit && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-1 flex items-center gap-2">
            <Rocket className="h-4 w-4 text-[#C9973A]" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Visibility</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Boosted events appear above free listings in search and on the events page.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROMOTION_TIERS.map(tier => {
              const active = tierId === tier.id
              return (
                <button key={tier.id} type="button" onClick={() => setTierId(tier.id)}
                  className={`relative rounded-xl border p-4 text-left transition
                    ${active ? 'border-[#C9973A] bg-[#C9973A]/5 ring-2 ring-[#C9973A]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  {active && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9973A] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <p className="font-semibold text-gray-900">{tier.label}</p>
                  <p className="mt-0.5 text-lg font-bold text-[#C9973A]">
                    {tier.priceGhs === 0 ? `${CEDI}0` : `${CEDI}${tier.priceGhs}`}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{tier.description}</p>
                </button>
              )
            })}
          </div>
          {selectedTier && selectedTier.priceGhs > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="h-3 w-3" />
              You&apos;ll be taken to Paystack to pay {CEDI}{selectedTier.priceGhs} securely after saving.
            </p>
          )}
        </section>
      )}

      <button type="submit" disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9973A]
                   text-sm font-semibold text-white transition hover:bg-[#b8852e] disabled:cursor-not-allowed disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting
          ? 'Saving...'
          : isEdit
            ? 'Save changes'
            : selectedTier && selectedTier.priceGhs > 0
              ? `Create event & pay ${CEDI}${selectedTier.priceGhs}`
              : 'Create event'}
      </button>

      {!isEdit && (
        <p className="text-center text-xs text-gray-400">
          Your event will be reviewed by our team before it appears publicly.
        </p>
      )}
    </form>
  )
}
