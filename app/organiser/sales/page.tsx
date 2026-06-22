import Link from 'next/link'
import { format } from 'date-fns'
import { Banknote, Ticket, TrendingUp } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import StatusBadge from '@/components/ui/StatusBadge'
import OrganiserNav from '@/components/organiser/OrganiserNav'
import { requireOrganiserPage } from '@/lib/organiser-auth'
import { aggregateTicketTypes } from '@/lib/ticket-stats'
import { formatCedi } from '@/lib/currency'

export const metadata = { title: 'Ticket sales' }

export default async function OrganiserSalesPage() {
  const { user, profile, supabase } = await requireOrganiserPage()

  const { data: events } = await supabase
    .from('events')
    .select('id, title, slug, status, start_date, city, region, ticket_types(name, price, quantity, quantity_sold)')
    .eq('organiser_id', user.id)
    .order('start_date', { ascending: false })

  const rows = (events ?? []).map(event => {
    const stats = aggregateTicketTypes(event.ticket_types)
    return { event, ...stats }
  })

  const totals = rows.reduce(
    (acc, row) => ({
      sold: acc.sold + row.sold,
      capacity: acc.capacity + row.capacity,
      revenue: acc.revenue + row.revenue,
    }),
    { sold: 0, capacity: 0, revenue: 0 },
  )

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <OrganiserNav current="/organiser/sales" />

          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Ticket sales
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Track tickets sold and revenue across your events, {profile?.name}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Total revenue', value: formatCedi(totals.revenue), icon: <Banknote className="h-5 w-5 text-[#C9973A]" /> },
              { label: 'Tickets sold', value: totals.sold.toLocaleString(), icon: <Ticket className="h-5 w-5 text-green-500" /> },
              { label: 'Fill rate', value: totals.capacity > 0 ? `${Math.round((totals.sold / totals.capacity) * 100)}%` : '—', icon: <TrendingUp className="h-5 w-5 text-blue-500" /> },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Sales by event</h2>
            </div>

            {rows.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">
                No events yet. Create an event to start selling tickets.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Event</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Sold</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Revenue</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(({ event, sold, capacity, revenue }) => (
                      <tr key={event.id} className="transition hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <p className="max-w-48 truncate font-medium text-gray-900">{event.title}</p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {event.city}, {event.region}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {format(new Date(event.start_date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={event.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {sold} / {capacity}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-900">
                          {formatCedi(revenue)}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/organiser/events/${event.id}/sales`}
                            className="text-xs font-medium text-[#C9973A] hover:underline"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
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
