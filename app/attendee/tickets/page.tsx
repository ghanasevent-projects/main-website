import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'
import { MapPin, Calendar, Ticket, User, Mail, CalendarCheck, Clock, KeyRound } from 'lucide-react'
import Link from 'next/link'
import SiteShell from '@/components/layout/SiteShell'
import SignOutButton from '@/components/auth/SignOutButton'
import { getSocialCounts } from '@/lib/social'
import SocialCountStats from '@/components/social/SocialCountStats'

export default async function AttendeeTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      *,
      ticket_type:ticket_types(name, price),
      event:events(title, slug, start_date, venue_name, city, region, banner_url)
    `)
    .eq('attendee_id', user.id)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })

  const avatarUrl =
    profile?.avatar_url ??
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null

  const joinedAt = profile?.created_at ?? user.created_at
  const lastSignIn = user.last_sign_in_at
  const provider = user.app_metadata?.provider ?? 'email'
  const providerLabel = provider === 'email' ? 'Email & password' : provider

  const social = await getSocialCounts(user.id)

  const now = Date.now()
  const ticketCount = tickets?.length ?? 0
  const upcomingCount =
    tickets?.filter(t => t.event?.start_date && new Date(t.event.start_date).getTime() >= now).length ?? 0
  const pastCount = ticketCount - upcomingCount

  return (
    <SiteShell>
    <main className="min-h-screen bg-[#f8f7f4]">
      <div className="mx-auto max-w-4xl px-4 py-8">

        {params.purchase === 'success' && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            Payment successful — your ticket is confirmed below. Show the QR code at the venue.
          </div>
        )}
        {params.purchase === 'failed' && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            Payment did not complete. No ticket was issued — you can try again from the event page.
          </div>
        )}

        {/* ── Profile card ───────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={profile?.name ?? 'Profile photo'}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[#C9973A]/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#C9973A]/10 ring-2 ring-[#C9973A]/30">
                <User className="h-9 w-9 text-[#C9973A]" />
              </div>
            )}

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {profile?.name ?? 'Attendee'}
                </h1>
                <span className="rounded-full bg-[#C9973A]/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#C9973A]">
                  {profile?.role ?? 'attendee'}
                </span>
              </div>

              {/* Social counts */}
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                <SocialCountStats followers={social.followers} following={social.following} />
                <Link href="/saved" className="text-gray-600 transition hover:text-[#C9973A]">
                  <span className="font-bold text-gray-900">{social.saved}</span> Saved
                </Link>
              </div>

              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </p>
                {joinedAt && (
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    Joined {format(new Date(joinedAt), 'MMMM d, yyyy')}
                  </p>
                )}
                {lastSignIn && (
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    Last sign-in {format(new Date(lastSignIn), 'MMM d, yyyy · h:mm a')}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <KeyRound className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="capitalize">Signed in with {providerLabel}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:self-start">
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white
                           px-4 py-2 text-sm font-medium text-gray-700 transition
                           hover:border-[#C9973A]/50 hover:text-[#C9973A]"
              >
                Edit profile
              </Link>
              <SignOutButton />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
            <div className="rounded-xl bg-[#f8f7f4] px-4 py-3 text-center">
              <p className="text-2xl font-bold text-[#C9973A]">{ticketCount}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Total ticket{ticketCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f7f4] px-4 py-3 text-center">
              <p className="text-2xl font-bold text-[#C9973A]">{upcomingCount}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Upcoming
              </p>
            </div>
            <div className="rounded-xl bg-[#f8f7f4] px-4 py-3 text-center">
              <p className="text-2xl font-bold text-[#C9973A]">{pastCount}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Attended
              </p>
            </div>
          </div>
        </div>

        {/* ── Tickets ────────────────────────────────────── */}
        <div className="mb-6">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            My Tickets
          </h2>
        </div>

        {!tickets || tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl
                          border border-dashed border-gray-200 bg-white py-24 text-center">
            <Ticket className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No tickets yet</p>
            <p className="text-xs text-gray-400 mb-4">
              Browse events and grab your first ticket
            </p>
            <Link
              href="/events"
              className="rounded-lg bg-[#C9973A] px-4 py-2 text-xs font-semibold
                         text-white hover:bg-[#b8852e] transition"
            >
              Browse events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4
                           hover:border-[#C9973A]/30 hover:shadow-sm transition"
              >
                {/* Event banner */}
                <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {ticket.event?.banner_url ? (
                    <Image
                      src={ticket.event.banner_url}
                      alt={ticket.event.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Ticket className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/events/${ticket.event?.slug}`}
                    className="font-semibold text-gray-900 text-sm hover:text-[#C9973A]
                               transition line-clamp-1"
                  >
                    {ticket.event?.title}
                  </Link>

                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {ticket.event?.start_date &&
                        format(new Date(ticket.event.start_date), 'EEE, MMM d, yyyy · h:mm a')}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {ticket.event?.venue_name}, {ticket.event?.city}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#C9973A]/10 px-2.5 py-1
                                     text-[11px] font-semibold text-[#C9973A]">
                      {ticket.ticket_type?.name}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Ref: {ticket.reference}
                    </span>
                  </div>
                </div>

                {/* QR code */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  {ticket.qr_code && (
                    <Image
                      src={ticket.qr_code}
                      alt="Ticket QR code"
                      width={64}
                      height={64}
                      className="rounded-lg border border-gray-200"
                    />
                  )}
                  <span className="text-xs font-semibold text-green-600 mt-2">
                    Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </SiteShell>
  )
}
