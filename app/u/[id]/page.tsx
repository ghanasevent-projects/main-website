import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarCheck, User } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import EventCard from '@/components/events/EventCard'
import FollowButton from '@/components/social/FollowButton'
import OrganiserContactCard from '@/components/organiser/OrganiserContactCard'
import SocialCountStats from '@/components/social/SocialCountStats'
import { getSocialCounts, isFollowing, getSavedEventIds } from '@/lib/social'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('public_profiles').select('name').eq('id', id).single()
  return { title: data?.name ? `${data.name} · GhanasEvent` : 'Profile' }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('public_profiles')
    .select(`
      id, name, role, avatar_url, created_at,
      phone, website, bio, city, region,
      whatsapp, instagram_url, facebook_url, twitter_url, linkedin_url
    `)
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isSelf = user?.id === profile.id

  const [counts, following, savedIds] = await Promise.all([
    getSocialCounts(profile.id),
    isFollowing(profile.id),
    getSavedEventIds(),
  ])

  // Events this user organises (public ones only)
  const { data: events } = await supabase
    .from('events')
    .select(`
      id, slug, title,
      venue_name, city, region,
      start_date, banner_url, is_free,
      category:categories(name, slug),
      ticket_types(price)
    `)
    .eq('organiser_id', profile.id)
    .eq('status', 'approved')
    .order('start_date', { ascending: false })
    .limit(12)

  const hasEvents = (events?.length ?? 0) > 0

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-5xl px-4 py-8">

          {/* Profile header */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name ?? 'Profile photo'}
                  width={80}
                  height={80}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[#C9973A]/30"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#C9973A]/10 ring-2 ring-[#C9973A]/30">
                  <User className="h-9 w-9 text-[#C9973A]" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                  >
                    {profile.name ?? 'GhanasEvent user'}
                  </h1>
                  <span className="rounded-full bg-[#C9973A]/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#C9973A]">
                    {profile.role ?? 'attendee'}
                  </span>
                </div>

                <SocialCountStats followers={counts.followers} following={counts.following} className="mt-2" />

                {profile.created_at && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                  </p>
                )}

                {(profile.role === 'organiser' || profile.role === 'admin') && (
                  <div className="mt-4">
                    <OrganiserContactCard organiser={profile} followerCount={counts.followers} showProfileLink={false} />
                  </div>
                )}
              </div>

              <div className="shrink-0 self-start">
                {isSelf ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white
                               px-5 py-2 text-sm font-medium text-gray-700 transition
                               hover:border-[#C9973A]/50 hover:text-[#C9973A]"
                  >
                    Edit profile
                  </Link>
                ) : (
                  <FollowButton
                    targetUserId={profile.id}
                    initialFollowing={following}
                    initialCount={counts.followers}
                    isAuthed={Boolean(user)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Events */}
          {hasEvents && (
            <div className="mt-8">
              <h2
                className="mb-4 text-lg font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Events by {profile.name ?? 'this organiser'}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events!.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isAuthed={Boolean(user)}
                    isSaved={savedIds.has(event.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {!hasEvents && (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-400">
              No public events yet.
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  )
}
