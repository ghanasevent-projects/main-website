'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Variant = 'icon' | 'full'

interface Props {
  eventId: string
  initialSaved: boolean
  initialCount?: number
  isAuthed: boolean
  variant?: Variant
  /** Stop the click from bubbling to a parent link (e.g. on EventCard) */
  stopPropagation?: boolean
  className?: string
}

export default function SaveEventButton({
  eventId,
  initialSaved,
  initialCount,
  isAuthed,
  variant = 'full',
  stopPropagation = false,
  className = '',
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [saved, setSaved] = useState(initialSaved)
  const [count, setCount] = useState(initialCount ?? 0)
  const [loading, setLoading] = useState(false)

  async function toggle(e: React.MouseEvent) {
    if (stopPropagation) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (loading) return

    if (!isAuthed) {
      router.push(`/login?redirectTo=/events`)
      return
    }

    setLoading(true)
    const next = !saved
    // optimistic
    setSaved(next)
    setCount(c => c + (next ? 1 : -1))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    if (next) {
      const { error } = await supabase
        .from('saved_events')
        .insert({ user_id: user.id, event_id: eventId })
      if (error && !error.message.includes('duplicate')) {
        setSaved(false)
        setCount(c => c - 1)
      }
    } else {
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId)
      if (error) {
        setSaved(true)
        setCount(c => c + 1)
      }
    }

    setLoading(false)
    router.refresh()
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? 'Remove from saved' : 'Save event'}
        aria-pressed={saved}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90
                    shadow-sm backdrop-blur transition hover:bg-white ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        ) : (
          <Heart
            className={`h-4 w-4 transition ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm
                  font-medium transition
                  ${saved
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}
                  ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
      )}
      {saved ? 'Saved' : 'Save'}
      {count > 0 && <span className="text-xs text-gray-400">{count}</span>}
    </button>
  )
}
