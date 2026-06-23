'use client'

import { useEffect, useState } from 'react'
import {
  COORDINATE_INPUT_HINT,
  COORDINATE_INPUT_PLACEHOLDER,
  formatCoordinatePair,
  parseCoordinatePair,
} from '@/lib/coordinates'

interface CoordinateInputProps {
  latitude?: number | null
  longitude?: number | null
  onApply: (lat: number, lng: number) => void
  label?: string
  hint?: string
  compact?: boolean
  className?: string
}

export default function CoordinateInput({
  latitude,
  longitude,
  onApply,
  label = 'Coordinates',
  hint = COORDINATE_INPUT_HINT,
  compact = false,
  className = '',
}: CoordinateInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setValue(formatCoordinatePair(latitude, longitude))
    }
  }, [latitude, longitude])

  function apply(from?: string) {
    const parsed = parseCoordinatePair(from ?? value)
    if (!parsed) {
      setError('Enter coordinates as latitude, longitude — e.g. 6.857002589002211, 0.4336800882825621')
      return
    }
    setError(null)
    onApply(parsed.lat, parsed.lng)
    setValue(formatCoordinatePair(parsed.lat, parsed.lng))
  }

  return (
    <div className={className}>
      {label && (
        <label className={`block font-medium text-gray-700 ${compact ? 'mb-1 text-xs' : 'mb-1.5 text-sm'}`}>
          {label}
        </label>
      )}
      <div className={`flex gap-2 ${compact ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <input
          type="text"
          value={value}
          onChange={e => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), apply())}
          placeholder={COORDINATE_INPUT_PLACEHOLDER}
          className={`flex-1 rounded-lg border border-gray-200 bg-white px-3 font-mono
                     focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20
                     ${compact ? 'h-9 text-xs' : 'h-10 text-sm'}`}
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => apply()}
          disabled={!value.trim()}
          className={`flex items-center justify-center rounded-lg bg-[#C9973A] font-semibold
                     text-white transition hover:bg-[#b8852e] disabled:opacity-50
                     ${compact ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm'}`}
        >
          Apply
        </button>
      </div>
      {hint && <p className={`mt-1 text-gray-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>{hint}</p>}
      {error && <p className={`mt-1 text-red-600 ${compact ? 'text-[10px]' : 'text-xs'}`}>{error}</p>}
    </div>
  )
}
