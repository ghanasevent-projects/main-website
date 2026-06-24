import { createClient } from '@/lib/supabase/server'

export interface SocialCounts {
  followers: number
  following: number
  saved: number
}

/** Follower / following / saved-event counts for a user. */
export async function getSocialCounts(userId: string): Promise<SocialCounts> {
  const supabase = await createClient()

  const [followers, following, saved] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
    supabase.from('saved_events').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  return {
    followers: followers.count ?? 0,
    following: following.count ?? 0,
    saved: saved.count ?? 0,
  }
}

/** Whether the current viewer follows the given user. */
export async function isFollowing(targetUserId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id === targetUserId) return false

  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .maybeSingle()

  return Boolean(data)
}

export interface FollowListUser {
  id: string
  name: string | null
  role: string | null
  avatar_url: string | null
}

/**
 * List of users that follow `userId` ('followers') or that `userId`
 * follows ('following'), joined with their profile.
 */
export async function getFollowList(
  userId: string,
  kind: 'followers' | 'following',
): Promise<FollowListUser[]> {
  const supabase = await createClient()

  const matchColumn = kind === 'followers' ? 'following_id' : 'follower_id'
  const joinColumn = kind === 'followers' ? 'follower_id' : 'following_id'

  const { data } = await supabase
    .from('follows')
    .select(`profile:public_profiles!${joinColumn}(id, name, role, avatar_url)`)
    .eq(matchColumn, userId)
    .order('created_at', { ascending: false })

  return (data ?? [])
    .map(row => (row as unknown as { profile: FollowListUser | null }).profile)
    .filter(Boolean) as FollowListUser[]
}

/** Public follower count for a single user. */
export async function getFollowerCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId)
  return count ?? 0
}

/** Whether the current viewer has saved the given event. */
export async function hasSavedEvent(eventId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('saved_events')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .maybeSingle()

  return Boolean(data)
}

/** Set of user IDs the current user follows (for listing pages). */
export async function getFollowingIds(): Promise<Set<string>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Set()

  const { data } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)

  return new Set((data ?? []).map(r => r.following_id as string))
}

/**
 * Upcoming approved events from organisers the current user follows.
 * Returns an empty array for signed-out users or users who follow no one.
 */
export async function getFollowingFeedEvents(limit = 10) {
  const supabase = await createClient()
  const followingIds = await getFollowingIds()
  if (followingIds.size === 0) return []

  const { data } = await supabase
    .from('events')
    .select(`
      id, slug, title,
      venue_name, city, region,
      start_date, banner_url, is_free,
      organiser_id,
      category:categories(name, slug),
      ticket_types(price)
    `)
    .in('organiser_id', Array.from(followingIds))
    .eq('status', 'approved')
    .gte('end_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit)

  return data ?? []
}

/** Set of event IDs the current user has saved (for listing pages). */
export async function getSavedEventIds(): Promise<Set<string>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Set()

  const { data } = await supabase
    .from('saved_events')
    .select('event_id')
    .eq('user_id', user.id)

  return new Set((data ?? []).map(r => r.event_id as string))
}

/** Public saved/like count for a single event. */
export async function getEventSaveCount(eventId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('saved_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
  return count ?? 0
}
