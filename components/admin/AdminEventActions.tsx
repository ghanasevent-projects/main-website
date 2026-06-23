'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { approveEvent, rejectEvent } from '@/app/admin/actions'

interface Props {
  eventId: string
  status: string
  eventTitle: string
}

export default function AdminEventActions({ eventId, status, eventTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reason, setReason] = useState('')

  async function approve() {
    setLoading('approve')
    try {
      await approveEvent(eventId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setLoading(null)
    }
  }

  async function reject() {
    if (!reason.trim()) return
    setLoading('reject')
    try {
      await rejectEvent(eventId, reason)
      setShowRejectModal(false)
      setReason('')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setLoading(null)
    }
  }

  if (status !== 'pending' && status !== 'rejected') {
    return <span className="text-xs text-gray-400">—</span>
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={approve}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200
                     px-3 py-1.5 text-xs font-semibold text-green-700
                     hover:bg-green-100 disabled:opacity-50 transition"
        >
          {loading === 'approve'
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <CheckCircle className="h-3 w-3" />
          }
          Approve
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200
                     px-3 py-1.5 text-xs font-semibold text-red-700
                     hover:bg-red-100 disabled:opacity-50 transition"
        >
          <XCircle className="h-3 w-3" />
          Reject
        </button>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3
              className="text-base font-bold text-gray-900 mb-1"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Reject event
            </h3>
            <p className="text-sm text-gray-500 mb-4 truncate">
              {eventTitle}
            </p>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Reason for rejection
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Tell the organiser why their event was rejected..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5
                         text-sm text-gray-900 placeholder-gray-400 outline-none resize-none
                         focus:border-[#C9973A] focus:ring-2 focus:ring-[#C9973A]/20
                         focus:bg-white transition"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowRejectModal(false); setReason('') }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm
                           font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={reject}
                disabled={!reason.trim() || loading === 'reject'}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold
                           text-white hover:bg-red-600 disabled:opacity-50 transition
                           flex items-center justify-center gap-2"
              >
                {loading === 'reject' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Send rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}