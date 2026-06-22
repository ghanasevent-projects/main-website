'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Upload, X, RefreshCw } from 'lucide-react'

const DEFAULT_MAX_MB = 5
const ACCEPT = 'image/jpeg,image/png,image/webp'

interface BannerUploadProps {
  preview: string | null
  onChange: (file: File | null, preview: string | null) => void
  label?: string
  hint?: string
  maxMb?: number
  required?: boolean
}

export default function BannerUpload({
  preview,
  onChange,
  label = 'Event image',
  hint = 'This image appears at the top of your event page and in search results.',
  maxMb = DEFAULT_MAX_MB,
  required = false,
}: BannerUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndSet = useCallback(
    (file: File | null) => {
      setError(null)
      if (!file) {
        onChange(null, null)
        return
      }
      if (!file.type.startsWith('image/') || !ACCEPT.includes(file.type)) {
        setError('Use JPG, PNG, or WebP.')
        return
      }
      if (file.size > maxMb * 1024 * 1024) {
        setError(`Image must be under ${maxMb} MB.`)
        return
      }
      onChange(file, URL.createObjectURL(file))
    },
    [maxMb, onChange],
  )

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    validateAndSet(e.target.files?.[0] ?? null)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    validateAndSet(e.dataTransfer.files?.[0] ?? null)
  }

  function remove() {
    validateAndSet(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <span className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </span>
          <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
        </div>
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gray-400">
          16 : 9
        </span>
      </div>

      {error && (
        <p className="mb-2 text-xs text-red-600">{error}</p>
      )}

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`group relative overflow-hidden rounded-2xl border-2 transition
          ${dragging
            ? 'border-[#C9973A] bg-[#C9973A]/5 shadow-inner'
            : preview
              ? 'border-gray-200 bg-gray-900'
              : 'border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white hover:border-[#C9973A]/40'}`}
      >
        <div className="aspect-[16/9] w-full">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Banner preview"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
                <p className="text-xs font-medium text-white/90">
                  Looks good — this is how attendees will see your event
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5
                               text-xs font-semibold text-gray-800 shadow transition hover:bg-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={remove}
                    className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5
                               text-xs font-semibold text-white backdrop-blur transition hover:bg-black/55"
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 py-10
                         text-center transition group-hover:bg-[#C9973A]/[0.03]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl
                              bg-[#C9973A]/10 text-[#C9973A] transition group-hover:scale-105">
                <ImagePlus className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Drag & drop or click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended 2160×1080px · JPG, PNG or WebP · Max {maxMb} MB
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200
                               bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                <Upload className="h-3.5 w-3.5" />
                Upload image
              </span>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onFileInput}
          className="hidden"
        />
      </div>
    </div>
  )
}
