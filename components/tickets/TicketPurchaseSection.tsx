'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, ExternalLink, Lock, MapPin } from 'lucide-react'
import TicketTypeCard from './TicketTypeCard'
import { getEventScheduleLines } from '@/lib/event-format'

interface TicketType {
  id: string
  name: string
  description: string | null
  price: number
  quantity: number
  quantity_sold: number
  sale_start: string | null
  sale_end: string | null
}

interface EventSummary {
  startDate: string
  endDate: string
  venueName: string
  city: string
  region: string
  isFree: boolean
  minPrice: number | null
}

interface Props {
  ticketTypes: TicketType[]
  eventId: string
  eventSlug: string
  externalTicketUrl: string | null
  summary: EventSummary
}

export default function TicketPurchaseSection({
  ticketTypes,
  eventId,
  eventSlug,
  externalTicketUrl,
  summary,
}: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scheduleLines = getEventScheduleLines(summary.startDate, summary.endDate)
  const locationLine = [summary.city, summary.region].filter(Boolean).join(', ')
  const hasInternalTickets = ticketTypes.length > 0

  async function handleBuy(ticketTypeId: string) {
    setLoadingId(ticketTypeId)
    setError(null)
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketTypeId, quantity: 1, eventId }),
      })

      if (res.status === 401) {
        router.push(`/login?redirectTo=/events/${eventSlug}`)
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not start checkout')
        return
      }
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div id="event-tickets" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="hidden space-y-4 border-b border-gray-100 p-5 lg:block">
        <div className="flex gap-3">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#C9973A]" />
          <div className="min-w-0 space-y-2">
            {scheduleLines.map(line => (
              <p key={line} className="text-sm font-semibold leading-snug text-gray-900">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C9973A]" />
          <div>
            <p className="font-semibold text-gray-900">{summary.venueName}</p>
            {locationLine && (
              <p className="mt-0.5 text-sm text-gray-600">{locationLine}</p>
            )}
          </div>
        </div>
      </div>

      {externalTicketUrl && !hasInternalTickets && (
        <div className="p-5">
          <a
            href={externalTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9973A]
                       px-4 py-3.5 text-base font-bold text-white transition hover:bg-[#b8852e]"
          >
            Get tickets
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {hasInternalTickets && (
        <div className="p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            Tickets
          </h3>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {ticketTypes.map(ticket => (
              <TicketTypeCard
                key={ticket.id}
                ticket={ticket}
                onBuy={handleBuy}
                loading={loadingId === ticket.id}
              />
            ))}
          </div>
        </div>
      )}

      {!hasInternalTickets && !externalTicketUrl && (
        <p className="px-5 pb-5 text-center text-sm text-gray-500">
          Ticket information coming soon.
        </p>
      )}

      <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
        <Lock className="h-3 w-3" />
        Secure checkout via Paystack
      </div>
    </div>
  )
}
