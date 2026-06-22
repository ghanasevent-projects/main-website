import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'
import StatusBadge from '@/components/ui/StatusBadge'
import AdminEventActions from '@/components/admin/AdminEventActions'
import AdminNav from '@/components/admin/AdminNav'
import SiteShell from '@/components/layout/SiteShell'
import { requireAdminPage } from '@/lib/admin-auth'

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const { admin } = await requireAdminPage()

  let query = admin
    .from('events')
    .select(`
      *,
      category:categories(name),
      organiser:profiles!organiser_id(name, email)
    `)
    .order('created_at', { ascending: false })

  if (params.status && ['pending', 'approved', 'rejected'].includes(params.status)) {
    query = query.eq('status', params.status)
  }

  const { data: events } = await query

  const pending = events?.filter(e => e.status === 'pending') ?? []
  const allSorted = params.status
    ? (events ?? [])
    : [...pending, ...(events?.filter(e => e.status !== 'pending') ?? [])]

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/events" />

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Review events
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {pending.length} pending approval
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <Link
                key={f.value}
                href={f.value ? `/admin/events?status=${f.value}` : '/admin/events'}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition
                  ${(params.status ?? '') === f.value
                    ? 'bg-[#C9973A] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {!allSorted.length ? (
              <div className="py-20 text-center text-sm text-gray-500">No events in this view</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Event</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Organiser</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allSorted.map(event => (
                      <tr
                        key={event.id}
                        className={`transition hover:bg-gray-50/50
                          ${event.status === 'pending' ? 'bg-yellow-50/30' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {event.banner_url && (
                                <Image
                                  src={event.banner_url}
                                  alt={event.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/events/${event.slug}`}
                                className="max-w-40 truncate font-medium text-gray-900 hover:text-[#C9973A]"
                              >
                                {event.title}
                              </Link>
                              <p className="mt-0.5 text-xs text-gray-400">
                                {event.city}, {event.region}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-700">{event.organiser?.name}</p>
                          <p className="text-xs text-gray-400">{event.organiser?.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {format(new Date(event.start_date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={event.status} />
                        </td>
                        <td className="px-6 py-4">
                          <AdminEventActions
                            eventId={event.id}
                            status={event.status}
                            eventTitle={event.title}
                          />
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
