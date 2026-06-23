import Link from 'next/link'
import { format } from 'date-fns'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'
import { formatCedi } from '@/lib/currency'
import { unwrapJoin } from '@/lib/supabase-join'

export const metadata = { title: 'Ticket sales' }

export default async function AdminTicketsPage() {
  const { admin } = await requireAdminPage()

  const { data: tickets } = await admin
    .from('tickets')
    .select(`
      id, reference, amount_paid, payment_status, created_at,
      ticket_type:ticket_types(name),
      event:events(id, title, slug, organiser:profiles!organiser_id(name)),
      attendee:profiles!attendee_id(name, email)
    `)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(200)

  const paid = tickets ?? []
  const totalRevenue = paid.reduce((a, t) => a + Number(t.amount_paid ?? 0), 0)

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/tickets" />

          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Ticket sales
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {paid.length.toLocaleString()} recent sales · {formatCedi(totalRevenue)} total shown
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {paid.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">No ticket sales yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Event</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Organiser</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Buyer</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Type</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paid.map(ticket => {
                      const event = unwrapJoin(ticket.event)
                      const organiser = unwrapJoin(event?.organiser)
                      const attendee = unwrapJoin(ticket.attendee)
                      const ticketType = unwrapJoin(ticket.ticket_type)

                      return (
                      <tr key={ticket.id} className="hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          {event?.slug ? (
                            <Link
                              href={`/events/${event.slug}`}
                              className="font-medium text-gray-900 hover:text-[#C9973A]"
                            >
                              {event.title}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {event?.title ?? '—'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {organiser?.name ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{attendee?.name ?? 'Guest'}</p>
                          {attendee?.email && (
                            <p className="text-xs text-gray-400">{attendee.email}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {ticketType?.name ?? '—'}
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
