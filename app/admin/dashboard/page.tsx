import Link from 'next/link'
import { Calendar, Users, Hotel, MapPin, Clock, CheckCircle, Ticket, Banknote } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import { getSocialCounts } from '@/lib/social'
import SocialCountStats from '@/components/social/SocialCountStats'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'
import { formatCedi } from '@/lib/currency'

export default async function AdminDashboard() {
  const { user, profile, admin } = await requireAdminPage()

  const social = await getSocialCounts(user.id)

  const [events, users, organisers, hotels, areas, tickets] = await Promise.all([
    admin.from('events').select('status'),
    admin.from('profiles').select('id', { count: 'exact', head: true }),
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'organiser'),
    admin.from('hotels').select('id', { count: 'exact', head: true }),
    admin.from('tourist_areas').select('id', { count: 'exact', head: true }),
    admin.from('tickets').select('payment_status, amount_paid'),
  ])

  const eventData   = events.data ?? []
  const pending     = eventData.filter(e => e.status === 'pending').length
  const approved    = eventData.filter(e => e.status === 'approved').length
  const totalRevenue = tickets.data
    ?.filter(t => t.payment_status === 'paid')
    .reduce((a, t) => a + (t.amount_paid ?? 0), 0) ?? 0
  const ticketsSold = tickets.data?.filter(t => t.payment_status === 'paid').length ?? 0

  const stats = [
    { label: 'Total events',     value: eventData.length,        icon: <Calendar   className="h-5 w-5 text-[#C9973A]" />,  href: '/admin/events' },
    { label: 'Pending approval', value: pending,                  icon: <Clock      className="h-5 w-5 text-yellow-500" />, href: '/admin/events?status=pending', highlight: pending > 0 },
    { label: 'Approved events',  value: approved,                 icon: <CheckCircle className="h-5 w-5 text-green-500" />, href: '/admin/events?status=approved' },
    { label: 'Tickets sold',     value: ticketsSold,              icon: <Ticket     className="h-5 w-5 text-[#C9973A]" />,  href: '/admin/tickets' },
    { label: 'Total users',      value: users.count ?? 0,         icon: <Users      className="h-5 w-5 text-blue-500" />,  href: '/admin/users' },
    { label: 'Organisers',       value: organisers.count ?? 0,    icon: <Users      className="h-5 w-5 text-orange-500" />, href: '/admin/organisers' },
    { label: 'Hotels listed',    value: hotels.count ?? 0,        icon: <Hotel      className="h-5 w-5 text-purple-500" />,href: '/admin/hotels' },
    { label: 'Tourist areas',    value: areas.count ?? 0,         icon: <MapPin     className="h-5 w-5 text-pink-500" />,  href: '/admin/tourist-areas' },
  ]

  return (
    <SiteShell>
    <main className="min-h-screen bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        <AdminNav current="/admin/dashboard" />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome, {profile.name}
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
          {stats.map(stat => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`rounded-2xl border bg-white p-5 transition hover:shadow-sm
                ${stat.highlight ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
            >
              <div className="mb-3">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                <Banknote className="h-4 w-4" />
                Total revenue
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {formatCedi(totalRevenue)}
              </p>
              <p className="text-xs text-gray-400 mt-1">From all confirmed ticket sales</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/tickets"
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#C9973A]/40"
              >
                All ticket sales
              </Link>
              <Link
                href="/admin/organisers"
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#C9973A]/40"
              >
                By organiser
              </Link>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Review events',    href: '/admin/events',          desc: 'Approve or reject' },
            { label: 'Ticket sales',     href: '/admin/tickets',         desc: 'All purchases' },
            { label: 'Organiser sales',  href: '/admin/organisers',      desc: 'Revenue by organiser' },
            { label: 'Users',            href: '/admin/users',           desc: 'View all accounts' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-gray-200 bg-white p-4
                         hover:border-[#C9973A]/40 hover:shadow-sm transition"
            >
              <p className="text-sm font-semibold text-gray-900">{link.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
    </SiteShell>
  )
}