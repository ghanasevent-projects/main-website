'use client'

import { Suspense } from 'react'
import { Search } from 'lucide-react'
import LocationPicker from './LocationPicker'
import { useSelectedLocation } from './useSelectedLocation'

function SearchInput({ formId }: { formId: string }) {
  const location = useSelectedLocation()

  return (
    <form id={formId} method="GET" action="/events" className="flex min-w-0 flex-1 items-center pl-4">
      <Search size={16} className="mr-2 shrink-0 text-gray-400" />
      <input
        name="q"
        placeholder="Search events"
        aria-label="Search events"
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none"
      />
      {location?.city ? <input type="hidden" name="city" value={location.city} /> : null}
      {location?.region ? <input type="hidden" name="region" value={location.region} /> : null}
    </form>
  )
}

function NavbarSearchBar({ formId }: { formId: string }) {
  return (
    <div
      className="flex h-10 w-full min-w-0 items-center rounded-full border border-gray-300
                 bg-white shadow-sm transition hover:border-gray-400"
    >
      <SearchInput formId={formId} />
      <div className="mx-1 h-5 w-px shrink-0 bg-gray-200" />
      <LocationPicker variant="bar" />
      <button
        type="submit"
        form={formId}
        aria-label="Search"
        className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9973A]
                   text-white transition hover:bg-[#A87A28]"
      >
        <Search size={14} />
      </button>
    </div>
  )
}

export default function NavbarSearch({ compact = false }: { compact?: boolean }) {
  const formId = compact ? 'navbar-search-mobile' : 'navbar-search'

  return (
    <Suspense
      fallback={
        <div className={`h-10 rounded-full border border-gray-300 bg-white ${compact ? 'w-full' : 'hidden w-full max-w-md sm:block'}`} />
      }
    >
      <div className={compact ? 'w-full' : 'hidden w-full sm:block'}>
        <NavbarSearchBar formId={formId} />
      </div>
    </Suspense>
  )
}
