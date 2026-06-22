import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Calendar, Ticket, Clock, CheckCircle, Banknote } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import SiteShell from '@/components/layout/SiteShell'
import OrganiserNav from '@/components/organiser/OrganiserNav'
import { getSocialCounts } from '@/lib/social'
import SocialCountStats from '@/components/social/SocialCountStats'
import { requireOrganiserPage } from '@/lib/organiser-auth'
import { aggregateTicketTypes } from '@/lib/ticket-stats'
import { formatCedi } from '@/lib/currency'

export default async function OrganiserDashboard({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; promotion?: string; updated?: string }>
}) {
  const params = await searchParams
  const { user, profile, supabase } = await requireOrganiserPage()

  const { data: events } = await supabase
    .from('events')
    .select('*, ticket_types(price, quantity, quantity_sold)')
    .eq('organiser_id', user.id)
    .order('created_at', { ascending: false })

  const stats = {
    total:    events?.length ?? 0,
    approved: events?.filter(e => e.status === 'approved').length ?? 0,
    pending:  events?.filter(e => e.status === 'pending').length ?? 0,
    rejected: events?.filter(e => e.status === 'rejected').length ?? 0,
  }

  const social = await getSocialCounts(user.id)

  const salesTotals = (events ?? []).reduce(
    (acc, event) => {
      const { sold, revenue } = aggregateTicketTypes(event.ticket_types)
      return { sold: acc.sold + sold, revenue: acc.revenue + revenue }
    },
    { sold: 0, revenue: 0 },
  )

  return (
    <SiteShell>
    <main className="min-h-screen bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        <OrganiserNav current="/organiser/dashboard" />

        {/* Status banners */}
        {params.created === '1' && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            Your event was created and is awaiting admin review. It will appear publicly once approved.
          </div>
        )}
        {params.updated === '1' && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            Your event was updated successfully. Approved events are sent back for admin review.
          </div>
        )}
        {params.promotion === 'success' && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            Payment received — your event was created and will be promoted once approved. Thank you!
          </div>
        )}
        {params.promotion === 'failed' && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            The promotion payment didn&apos;t complete. Your event was still created (pending review) —
            you can retry the boost later.
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              My Events
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {profile?.name}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <Link href={`/u/${user.id}`} className="text-gray-600 transition hover:text-[#C9973A]">
                View public profile
              </Link>
              <SocialCountStats followers={social.followers} following={social.following} />
              <Link href="/saved" className="text-gray-600 transition hover:text-[#C9973A]">
                <span className="font-bold text-gray-900">{social.saved}</span> Saved
              </Link>
            </div>
          </div>
          <Link
            href="/organiser/events/create"
            className="flex items-center gap-2 rounded-xl bg-[#C9973A] px-4 py-2.5
                       text-sm font-semibold text-white hover:bg-[#b8852e] transition"
          >
            <Plus className="h-4 w-4" />
            Create event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Total events', value: stats.total,    icon: <Calendar   className="h-5 w-5 text-gray-400" /> },
            { label: 'Approved',     value: stats.approved, icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            { label: 'Pending',      value: stats.pending,  icon: <Clock       className="h-5 w-5 text-yellow-500" /> },
            { label: 'Rejected',     value: stats.rejected, icon: <Ticket      className="h-5 w-5 text-red-400" /> },
            { label: 'Tickets sold', value: salesTotals.sold, icon: <Ticket className="h-5 w-5 text-[#C9973A]" /> },
            { label: 'Revenue',      value: formatCedi(salesTotals.revenue), icon: <Banknote className="h-5 w-5 text-green-600" /> },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Events table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">All events</h2>
          </div>

          {!events || events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">No events yet</p>
              <p className="text-xs text-gray-400 mb-4">
                Create your first event to get started
              </p>
              <Link
                href="/organiser/events/create"
                className="rounded-lg bg-[#C9973A] px-4 py-2 text-xs font-semibold
                           text-white hover:bg-[#b8852e] transition"
              >
                Create event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">Event</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">Tickets sold</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map(event => {
                    const sold = event.ticket_types?.reduce(
                      (a: number, t: { quantity_sold: number }) => a + t.quantity_sold, 0
                    ) ?? 0
                    const total = event.ticket_types?.reduce(
                      (a: number, t: { quantity: number }) => a + t.quantity, 0
                    ) ?? 0

                    return (
                      <tr key={event.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 truncate max-w-48">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {event.city}, {event.region}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {format(new Date(event.start_date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={event.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {sold} / {total}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/organiser/events/${event.id}/edit`}
                              className="text-xs text-[#C9973A] hover:underline font-medium"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/organiser/events/${event.id}/sales`}
                              className="text-xs text-gray-500 hover:text-[#C9973A] hover:underline font-medium"
                            >
                              Sales
                            </Link>
                          </div>
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