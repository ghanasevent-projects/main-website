'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toggleHotelActive, toggleTouristAreaActive } from '@/app/admin/actions'

interface Props {
  id: string
  isActive: boolean
  kind: 'hotel' | 'tourist_area'
}

export default function AdminToggleActive({ id, isActive, kind }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      if (kind === 'hotel') {
        await toggleHotelActive(id, !isActive)
      } else {
        await toggleTouristAreaActive(id, !isActive)
      }
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition disabled:opacity-50
        ${isActive
          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
          : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'}`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isActive ? (
        'Active'
      ) : (
        'Hidden'
      )}
    </button>
  )
}
