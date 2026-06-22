'use client'

import { Share2 } from 'lucide-react'
import SaveEventButton from '@/components/social/SaveEventButton'

export default function EventShareBar({
  eventId,
  title,
  slug,
  initialSaved,
  saveCount,
  isAuthed,
  variant = 'overlay',
}: {
  eventId: string
  title: string
  slug: string
  initialSaved: boolean
  saveCount: number
  isAuthed: boolean
  variant?: 'overlay' | 'inline'
}) {
  const url = `https://ghanasevent.com/events/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ]

  const wrapperClass =
    variant === 'overlay'
      ? 'absolute right-4 top-4 flex items-center gap-2'
      : 'flex flex-wrap items-center gap-2'

  return (
    <div className={wrapperClass}>
      <SaveEventButton
        eventId={eventId}
        initialSaved={initialSaved}
        initialCount={saveCount}
        isAuthed={isAuthed}
        variant="icon"
      />
      <div className="group relative">
        <button
          type="button"
          aria-label="Share event"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200
                     bg-white/95 text-gray-700 shadow-sm backdrop-blur transition
                     hover:border-gray-300 hover:text-gray-900"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <div
          className="pointer-events-none absolute right-0 top-full z-20 mt-2 min-w-[140px]
                     rounded-lg border border-gray-200 bg-white py-1 opacity-0 shadow-lg
                     transition group-hover:pointer-events-auto group-hover:opacity-100
                     group-focus-within:pointer-events-auto group-focus-within:opacity-100"
        >
          {shareLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
