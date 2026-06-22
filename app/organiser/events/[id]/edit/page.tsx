import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/layout/SiteShell'
import EventForm, { type EventFormInitial } from '@/components/organiser/EventForm'
import OrganiserNav from '@/components/organiser/OrganiserNav'
import { organiserDetailsFromProfile } from '@/lib/organiser-details'
import { requireOrganiserPage } from '@/lib/organiser-auth'

export const metadata = { title: 'Edit event' }

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function parseVenueImages(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((u): u is string => typeof u === 'string' && u.length > 0)
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, supabase } = await requireOrganiserPage()

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      role, name, phone, whatsapp, website, bio, city, region,
      instagram_url, facebook_url, twitter_url, linkedin_url
    `)
    .eq('id', user.id)
    .single()

  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      ticket_types(id, name, price, quantity, quantity_sold)
    `)
    .eq('id', id)
    .eq('organiser_id', user.id)
    .single()

  if (!event) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const ticketTypes = event.ticket_types ?? []
  const hasExternal = Boolean(event.external_ticket_url)
  const hasPaid = ticketTypes.length > 0

  const initial: EventFormInitial = {
    eventId: event.id,
    slug: event.slug,
    title: event.title,
    categoryId: event.category_id ?? '',
    description: event.description ?? '',
    bannerUrl: event.banner_url,
    venueName: event.venue_name ?? '',
    address: event.address ?? '',
    region: event.region ?? '',
    city: event.city ?? '',
    latitude: event.latitude,
    longitude: event.longitude,
    startDate: toDatetimeLocal(event.start_date),
    endDate: toDatetimeLocal(event.end_date),
    isFree: event.is_free && !hasPaid && !hasExternal,
    externalTicketUrl: event.external_ticket_url,
    status: event.status,
    tickets: ticketTypes.map((t: {
      id: string
      name: string
      price: number
      quantity: number
      quantity_sold?: number | null
    }) => ({
      id: t.id,
      name: t.name,
      price: String(t.price),
      quantity: String(t.quantity),
      quantitySold: t.quantity_sold ?? 0,
    })),
    venueImages: parseVenueImages(event.venue_images),
  }

  const organiserDetails = organiserDetailsFromProfile(
    profile as Record<string, unknown> | null,
    user.user_metadata ?? {},
  )

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <OrganiserNav current="/organiser/dashboard" />

          <Link
            href="/organiser/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[#C9973A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mb-6">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Edit event
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update your event details. Changes to approved events may require re-review.
            </p>
          </div>

          <EventForm
            userId={user.id}
            categories={categories ?? []}
            mode="edit"
            initial={initial}
            organiserDetails={organiserDetails}
          />
        </div>
      </main>
    </SiteShell>
  )
}
