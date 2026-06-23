'use client'

import { Ticket, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { formatCedi } from '@/lib/currency'

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

interface TicketTypeCardProps {
  ticket: TicketType
  onBuy: (ticketTypeId: string) => void
  loading?: boolean
}

export default function TicketTypeCard({
  ticket,
  onBuy,
  loading = false,
}: TicketTypeCardProps) {
  const remaining = ticket.quantity - ticket.quantity_sold
  const soldOut = remaining <= 0
  const isFree = ticket.price === 0
  const saleEnded = ticket.sale_end && new Date(ticket.sale_end) < new Date()
  const notStarted = ticket.sale_start && new Date(ticket.sale_start) > new Date()
  const unavailable = soldOut || !!saleEnded || !!notStarted

  return (
    <div className={`rounded-xl border bg-white p-4 transition
      ${soldOut ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-[#C9973A]/40'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Ticket className="h-4 w-4 shrink-0 text-[#C9973A]" />
            <h3 className="text-sm font-semibold text-gray-900">{ticket.name}</h3>
          </div>

          {ticket.description && (
            <p className="mb-2 text-xs leading-relaxed text-gray-500">{ticket.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {soldOut && (
              <span className="font-medium text-gray-500">Sold out</span>
            )}

            {ticket.sale_end && !saleEnded && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Sale ends {format(new Date(ticket.sale_end), 'MMM d, yyyy')}
              </span>
            )}

            {notStarted && ticket.sale_start && (
              <span className="flex items-center gap-1 text-[#C9973A]">
                <Clock className="h-3 w-3" />
                Opens {format(new Date(ticket.sale_start), 'MMM d, h:mm a')}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-right">
            {isFree ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatCedi(ticket.price)}
              </span>
            )}
          </div>

          <button
            onClick={() => onBuy(ticket.id)}
            disabled={unavailable || loading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition
              ${unavailable
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-[#C9973A] text-white hover:bg-[#b8852e] active:scale-95'
              }`}
          >
            {loading
              ? 'Loading...'
              : soldOut
                ? 'Sold out'
                : saleEnded
                  ? 'Sale ended'
                  : notStarted
                    ? 'Not yet open'
                    : isFree
                      ? 'Register'
                      : 'Get tickets'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
