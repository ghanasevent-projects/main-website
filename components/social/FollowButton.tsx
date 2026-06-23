'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  targetUserId: string
  initialFollowing: boolean
  initialCount?: number
  isAuthed: boolean
  /** Hide entirely when the viewer is looking at their own profile */
  isSelf?: boolean
  className?: string
}

export default function FollowButton({
  targetUserId,
  initialFollowing,
  initialCount,
  isAuthed,
  isSelf = false,
  className = '',
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [following, setFollowing] = useState(initialFollowing)
  const [count, setCount] = useState(initialCount ?? 0)
  const [loading, setLoading] = useState(false)

  if (isSelf) return null

  async function toggle() {
    if (loading) return
    if (!isAuthed) {
      router.push('/login')
      return
    }

    setLoading(true)
    const next = !following
    setFollowing(next)
    setCount(c => c + (next ? 1 : -1))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    if (next) {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: targetUserId })
      if (error && !error.message.includes('duplicate')) {
        setFollowing(false)
        setCount(c => c - 1)
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
      if (error) {
        setFollowing(true)
        setCount(c => c + 1)
      }
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={following}
      className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm
                  font-semibold transition
                  ${following
                    ? 'border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                    : 'bg-[#C9973A] text-white hover:bg-[#A87A28]'}
                  ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : following ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {following ? 'Following' : 'Follow'}
      {count > 0 && (
        <span className={following ? 'text-xs text-gray-400' : 'text-xs text-white/80'}>
          {count}
        </span>
      )}
    </button>
  )
}
