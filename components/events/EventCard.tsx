import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Ticket, Info } from 'lucide-react'
import SaveEventButton from '@/components/social/SaveEventButton'
import { formatCediWhole } from '@/lib/currency'
import { formatEventCardDate } from '@/lib/event-format'

export type EventCategoryRef = { name: string; slug: string; icon?: string; id?: string }

export type EventCardEvent = {
  id: string
  slug: string
  title: string
  venue_name: string
  city: string
  region: string
  start_date: string
  end_date?: string
  banner_url?: string | null
  is_free: boolean
  category?: EventCategoryRef | EventCategoryRef[] | null
  ticket_types?: { price: number }[]
}

interface EventCardProps {
  event: EventCardEvent
  isAuthed?: boolean
  isSaved?: boolean
  isPromoted?: boolean
}

export default function EventCard({
  event,
  isAuthed = false,
  isSaved = false,
  isPromoted = false,
}: EventCardProps) {
  const category = event.category
    ? (Array.isArray(event.category) ? event.category[0] : event.category)
    : null
  const minPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map(t => t.price))
    : null

  // Determine urgency label (like Eventbrite's "Sales end soon", "Going fast")
  const now = Date.now()
  const startMs = new Date(event.start_date).getTime()
  const hoursToStart = (startMs - now) / 36e5
  const urgencyLabel =
    hoursToStart > 0 && hoursToStart <= 24 ? 'Starts soon' :
    hoursToStart > 0 && hoursToStart <= 72 ? 'This weekend' :
    null

  const priceLabel = event.is_free
    ? 'Free'
    : minPrice !== null
    ? `From ${formatCediWhole(minPrice)}`
    : 'Paid'

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl bg-white
                  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                  ${isPromoted
                    ? 'ring-2 ring-gold/30 shadow-sm shadow-gold/10'
                    : 'ring-1 ring-gray-200 hover:ring-gold/30'
                  }`}
    >
      {/* Banner — landscape like Eventbrite */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 shrink-0">
        {event.banner_url ? (
          <Image
            src={event.banner_url}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br
                          from-gold/10 to-gold/5">
            <Ticket className="h-10 w-10 text-gold/40" />
          </div>
        )}

        {/* Status pill — top left (urgency) */}
        {urgencyLabel && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1
                           text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            {urgencyLabel}
          </span>
        )}

        {/* Save button — top right */}
        <div className="absolute right-2.5 top-2.5">
          <SaveEventButton
            eventId={event.id}
            initialSaved={isSaved}
            isAuthed={isAuthed}
            variant="icon"
            stopPropagation
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category label */}
        {category && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gold">
            {category.name}
          </p>
        )}

        {/* Title */}
        <h3
          className="line-clamp-3 text-sm font-bold leading-snug text-gray-900
                     transition-colors group-hover:text-gold"
          style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
        >
          {event.title}
        </h3>

        {/* Date */}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          {formatEventCardDate(event.start_date, event.end_date ?? event.start_date)}
        </p>

        {/* Venue */}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          <span className="line-clamp-2 wrap-break-word">{event.venue_name}, {event.city}</span>
        </p>

        {/* Price */}
        <p className={`mt-2 text-sm font-bold ${event.is_free ? 'text-green-600' : 'text-gray-900'}`}>
          {priceLabel}
        </p>

        {/* Promoted footer — exactly like Eventbrite */}
        {isPromoted && (
          <p className="mt-auto pt-2 flex items-center gap-1 border-t border-gray-100 text-[11px] text-gray-400">
            <Info className="h-3 w-3 shrink-0" />
            Promoted
          </p>
        )}
      </div>
    </Link>
  )
}
