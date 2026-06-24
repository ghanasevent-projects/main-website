import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface NavProfile {
  name: string
  role: string
  avatar_url: string | null
}

function metaAvatar(user: User): string | null {
  const meta = user.user_metadata ?? {}
  return (
    (meta.avatar_url as string | undefined) ??
    (meta.picture as string | undefined) ??
    null
  )
}

/** Build a nav profile from auth metadata, optionally merged with a DB row. */
export function profileFromUser(
  user: User,
  row?: { name: string; role: string; avatar_url: string | null } | null,
): NavProfile {
  const avatar = metaAvatar(user)
  if (row) {
    return { ...row, avatar_url: row.avatar_url ?? avatar }
  }

  const meta = user.user_metadata ?? {}
  const requestedRole = meta.role as string | undefined
  return {
    name:
      (meta.name as string | undefined) ??
      (meta.full_name as string | undefined) ??
      user.email?.split('@')[0] ??
      'GhanasEvent user',
    role: requestedRole === 'organiser' ? 'organiser' : 'attendee',
    avatar_url: avatar,
  }
}

/** Load profile from DB, creating the row if the trigger missed it. */
export async function loadNavProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<NavProfile> {
  const { data } = await supabase
    .from('profiles')
    .select('name, role, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (data) return profileFromUser(user, data)

  const fallback = profileFromUser(user, null)
  await supabase.from('profiles').upsert(
    {
      id: user.id,
      name: fallback.name,
      role: fallback.role,
      avatar_url: fallback.avatar_url,
    },
    { onConflict: 'id' },
  )

  return fallback
}
