'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function VenueGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)

  if (!images.length) return null

  const prev = () => setActive(i => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActive(i => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="mt-5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[active]}
          alt={`Venue photo ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center
                         rounded-full bg-white/90 text-gray-800 shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center
                         rounded-full bg-white/90 text-gray-800 shadow transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition
                ${i === active ? 'border-[#C9973A]' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
