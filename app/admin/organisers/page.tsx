import Link from 'next/link'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'
import { groupSalesByOrganiser } from '@/lib/ticket-stats'
import { formatCedi } from '@/lib/currency'

export const metadata = { title: 'Organiser sales' }

export default async function AdminOrganisersPage() {
  const { admin } = await requireAdminPage()

  const { data: events } = await admin
    .from('events')
    .select(`
      organiser_id,
      organiser:profiles!organiser_id(id, name, email),
      ticket_types(price, quantity_sold)
    `)

  const organisers = groupSalesByOrganiser(events ?? [])

  const platformTotals = organisers.reduce(
    (acc, o) => ({
      events: acc.events + o.eventCount,
      sold: acc.sold + o.ticketsSold,
      revenue: acc.revenue + o.revenue,
    }),
    { events: 0, sold: 0, revenue: 0 },
  )

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/organisers" />

          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Organiser sales
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {organisers.length} organisers · {platformTotals.sold.toLocaleString()} tickets sold · {formatCedi(platformTotals.revenue)} revenue
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {organisers.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">No organiser activity yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Organiser</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Events</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Tickets sold</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500">Revenue</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {organisers.map(row => (
                      <tr key={row.organiserId} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{row.name}</p>
                          {row.email && (
                            <p className="text-xs text-gray-400">{row.email}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{row.eventCount}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {row.ticketsSold.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatCedi(row.revenue)}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/u/${row.organiserId}`}
                            className="text-xs font-medium text-[#C9973A] hover:underline"
                          >
                            View profile
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
