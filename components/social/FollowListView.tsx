import Image from 'next/image'
import Link from 'next/link'
import { User, Users } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import FollowButton from '@/components/social/FollowButton'
import {
  getFollowList,
  getFollowingIds,
  type FollowListUser,
} from '@/lib/social'
import { createClient } from '@/lib/supabase/server'

interface Props {
  userId: string
  kind: 'followers' | 'following'
}

export default async function FollowListView({ userId, kind }: Props) {
  const supabase = await createClient()

  const [{ data: owner }, list, followingIds, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('id, name').eq('id', userId).single(),
    getFollowList(userId, kind),
    getFollowingIds(),
    supabase.auth.getUser(),
  ])

  const heading = kind === 'followers' ? 'Followers' : 'Following'
  const ownerName = owner?.name ?? 'User'

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="mb-6">
            <Link
              href={`/u/${userId}`}
              className="text-sm text-gray-500 transition hover:text-[#C9973A]"
            >
              ← Back to {ownerName}
            </Link>
            <h1
              className="mt-2 text-xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              {heading}
            </h1>
            <p className="text-sm text-gray-500">
              {list.length} {list.length === 1 ? 'person' : 'people'}
            </p>
          </div>

          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <Users className="mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-700">
                {kind === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {list.map((person: FollowListUser) => (
                <li key={person.id} className="flex items-center justify-between gap-3 p-4">
                  <Link href={`/u/${person.id}`} className="flex min-w-0 items-center gap-3">
                    {person.avatar_url ? (
                      <Image
                        src={person.avatar_url}
                        alt={person.name ?? 'User'}
                        width={44}
                        height={44}
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C9973A]/10">
                        <User className="h-5 w-5 text-[#C9973A]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {person.name ?? 'GhanasEvent user'}
                      </p>
                      <p className="text-xs capitalize text-gray-400">{person.role ?? 'attendee'}</p>
                    </div>
                  </Link>

                  {user?.id !== person.id && (
                    <FollowButton
                      targetUserId={person.id}
                      initialFollowing={followingIds.has(person.id)}
                      isAuthed={Boolean(user)}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </SiteShell>
  )
}
