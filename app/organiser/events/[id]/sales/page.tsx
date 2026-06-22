import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/layout/SiteShell'
import OrganiserNav from '@/components/organiser/OrganiserNav'
import { requireOrganiserPage } from '@/lib/organiser-auth'
import { aggregateTicketTypes } from '@/lib/ticket-stats'
import { formatCedi } from '@/lib/currency'
import { unwrapJoin } from '@/lib/supabase-join'

export const metadata = { title: 'Event sales' }

export default async function OrganiserEventSalesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, supabase } = await requireOrganiserPage()

  const { data: event } = await supabase
    .from('events')
    .select(`
      id, title, slug, status, start_date, city, region,
      ticket_types(id, name, price, quantity, quantity_sold)
    `)
    .eq('id', id)
    .eq('organiser_id', user.id)
    .single()

  if (!event) notFound()

  const ticketTypes = event.ticket_types ?? []
  const totals = aggregateTicketTypes(ticketTypes)

  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      id, reference, amount_paid, created_at,
      ticket_type:ticket_types(name),
      attendee:profiles!attendee_id(name)
    `)
    .eq('event_id', id)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <OrganiserNav current="/organiser/sales" />

          <Link
            href="/organiser/sales"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[#C9973A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all sales
          </Link>

          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              {event.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {format(new Date(event.start_date), 'EEEE, MMMM d, yyyy')} · {event.city}, {event.region}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCedi(totals.revenue)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500">Tickets sold</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {totals.sold} / {totals.capacity}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500">Public page</p>
              {event.status === 'approved' && event.slug ? (
                <Link
                  href={`/events/${event.slug}`}
                  className="mt-1 inline-block text-sm font-medium text-[#C9973A] hover:underline"
                >
                  View event
                </Link>
              ) : (
                <p className="mt-1 text-sm text-gray-400">Not public yet</p>
              )}
            </div>
          </div>

          {ticketTypes.length > 0 && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-sm font-semibold text-gray-900">By ticket type</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Type</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Price</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Sold</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ticketTypes.map((t: {
                      id: string
                      name: string
                      price: number
                      quantity: number
                      quantity_sold: number
                    }) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                        <td className="px-6 py-4 text-gray-600">{formatCedi(Number(t.price))}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {t.quantity_sold} / {t.quantity}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatCedi(t.quantity_sold * Number(t.price))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Recent sales</h2>
              <p className="mt-0.5 text-xs text-gray-400">Last 100 confirmed ticket purchases</p>
            </div>

            {!tickets || tickets.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">No ticket sales yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Attendee</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Ticket type</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Reference</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tickets.map(ticket => {
                      const ticketType = unwrapJoin(ticket.ticket_type)
                      const attendee = unwrapJoin(ticket.attendee)

                      return (
                      <tr key={ticket.id} className="hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {format(new Date(ticket.created_at), 'MMM d, yyyy · h:mm a')}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {attendee?.name ?? 'Guest'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {ticketType?.name ?? '—'}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {ticket.reference}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatCedi(Number(ticket.amount_paid))}
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
