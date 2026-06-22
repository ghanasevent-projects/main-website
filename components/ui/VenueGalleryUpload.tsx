'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, X } from 'lucide-react'

const MAX_IMAGES = 6
const MAX_MB = 5

export default function VenueGalleryUpload({
  images,
  pendingFiles,
  onAdd,
  onRemove,
  onRemovePending,
  uploading = false,
}: {
  images: string[]
  pendingFiles: File[]
  onAdd: (files: File[]) => void
  onRemove: (url: string) => void
  onRemovePending: (index: number) => void
  uploading?: boolean
}
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const total = images.length + pendingFiles.length
  const canAdd = total < MAX_IMAGES && !uploading

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return

    const room = MAX_IMAGES - total
    const accepted: File[] = []

    for (const file of picked.slice(0, room)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_MB * 1024 * 1024) continue
      accepted.push(file)
    }

    if (accepted.length) onAdd(accepted)
    e.target.value = ''
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-gray-700">Venue photos</p>
      <p className="mb-3 text-xs text-gray-500">
        Add up to {MAX_IMAGES} photos of the event venue so attendees know what to expect.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map(url => (
          <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <Image src={url} alt="Venue" fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => onRemove(url)}
              disabled={uploading}
              aria-label="Remove photo"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full
                         bg-black/55 text-white transition hover:bg-black/70 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {pendingFiles.map((file, i) => (
          <div key={`pending-${file.name}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-[#C9973A]/40 bg-[#C9973A]/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt="Venue preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemovePending(i)}
              disabled={uploading}
              aria-label="Remove photo"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full
                         bg-black/55 text-white transition hover:bg-black/70"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg
                       border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500
                       transition hover:border-[#C9973A]/50 hover:bg-[#C9973A]/5 hover:text-[#C9973A]"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Add photos</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onPick}
      />
    </div>
  )
}
