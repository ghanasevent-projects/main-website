'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, ChevronDown, X } from 'lucide-react'

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
  'Northern', 'Volta', 'Upper East', 'Upper West', 'Brong-Ahafo',
  'North East', 'Savannah', 'Bono East', 'Oti', 'Western North', 'Ahafo',
]

const QUICK_CATS = [
  { label: 'Music', slug: 'music' },
  { label: 'Parties', slug: 'nightlife' },
  { label: 'Church', slug: 'spirituality' },
  { label: 'Sports', slug: 'sports-fitness' },
  { label: 'Food & Drink', slug: 'food-drink' },
  { label: 'Arts', slug: 'arts-culture' },
]

export default function HeroSearchBar() {
  const [region, setRegion] = useState('')
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="mt-6 w-full max-w-2xl">
      {/* Search form */}
      <form
        method="GET"
        action="/events"
        className="flex items-center overflow-visible rounded-2xl bg-white shadow-[0_8px_48px_rgba(0,0,0,0.35)]"
      >
        {/* Query input */}
        <div className="flex flex-1 items-center gap-2.5 px-4 min-w-0">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            name="q"
            type="text"
            placeholder="Search events, venues, artists..."
            autoComplete="off"
            className="w-full min-w-0 bg-transparent py-4 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        {/* Separator */}
        <div className="h-8 w-px shrink-0 bg-gray-200" />

        {/* Region picker */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-4 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
          >
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="hidden sm:inline">{region || 'All Ghana'}</span>
            {region ? (
              <X
                className="h-3.5 w-3.5 text-gray-400 hover:text-gray-700"
                onClick={e => { e.stopPropagation(); setRegion('') }}
              />
            ) : (
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            )}
          </button>
          {region && <input type="hidden" name="region" value={region} />}

          {open && (
            <div className="absolute right-0 top-full z-50 mt-1.5 max-h-64 w-52 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1.5 shadow-2xl">
              <button
                type="button"
                onClick={() => { setRegion(''); setOpen(false) }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${!region ? 'font-semibold text-gold' : 'text-gray-600'}`}
              >
                All Ghana
              </button>
              <div className="my-1 h-px bg-gray-100" />
              {REGIONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRegion(r); setOpen(false) }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${region === r ? 'font-semibold text-gold' : 'text-gray-700'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="m-2 flex shrink-0 items-center gap-2 rounded-xl bg-[#C9973A] px-5 py-3
                     text-sm font-bold text-white transition hover:bg-[#A87A28] active:scale-95"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Quick category pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Popular:</span>
        {QUICK_CATS.map(cat => (
          <a
            key={cat.slug}
            href={`/events?category=${cat.slug}`}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs
                       font-medium text-white/85 backdrop-blur-sm transition
                       hover:border-white/40 hover:bg-white/20 hover:text-white"
          >
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  )
}
