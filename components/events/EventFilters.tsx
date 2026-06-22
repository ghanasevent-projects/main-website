'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { GHANA_CITIES, POPULAR_CITIES, cityDisplayLabel, citySelectValue, getCityByName, parseCitySelectValue } from '@/lib/ghana-locations'

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
}

const DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This weekend', value: 'weekend' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
]

const SORT_OPTIONS = [
  { label: 'Soonest', value: 'soonest' },
  { label: 'Latest', value: 'latest' },
]

export default function EventFilterBar({ categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCategory = searchParams.get('category') ?? ''
  const activeCity = searchParams.get('city') ?? ''
  const activeRegion = searchParams.get('region') ?? ''
  const activeDate = searchParams.get('date') ?? ''
  const activePrice = searchParams.get('price') ?? ''
  const activeSort = searchParams.get('sort') ?? 'soonest'

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => {
      router.push(`/events?${params.toString()}`)
    })
  }

  function updateMultipleFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')

    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`)
    })
  }

  function updateCity(raw: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (raw) {
      const city = parseCitySelectValue(raw)
      if (city) {
        params.set('city', city.name)
        params.set('region', city.region)
      }
    } else {
      params.delete('city')
      params.delete('region')
    }
    startTransition(() => {
      router.push(`/events?${params.toString()}`)
    })
  }

  const matchedCity =
    activeCity && activeRegion
      ? getCityByName(activeCity, activeRegion)
      : activeCity
        ? getCityByName(activeCity)
        : undefined

  const citySelectCurrent = matchedCity ? citySelectValue(matchedCity) : ''

  function clearAll() {
    const q = searchParams.get('q')
    const sort = searchParams.get('sort')
    const keepSort = sort && sort !== 'soonest'
    startTransition(() => {
      if (q && keepSort) {
        router.push(`/events?q=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}`)
        return
      }
      if (q) {
        router.push(`/events?q=${encodeURIComponent(q)}`)
        return
      }
      if (keepSort) {
        router.push(`/events?sort=${encodeURIComponent(sort)}`)
        return
      }
      router.push('/events')
    })
  }

  const hasFilters = activeCategory || activeCity || activeRegion || activeDate || activePrice

  const quickFilter = [
    {
      key: 'all',
      label: 'All',
      isActive: !activeDate && !activePrice,
      onClick: () => updateMultipleFilters({ date: '', price: '' }),
    },
    {
      key: 'today',
      label: 'Today',
      isActive: activeDate === 'today',
      onClick: () => updateMultipleFilters({ date: 'today' }),
    },
    {
      key: 'weekend',
      label: 'This weekend',
      isActive: activeDate === 'weekend',
      onClick: () => updateMultipleFilters({ date: 'weekend' }),
    },
    {
      key: 'free',
      label: 'Free',
      isActive: activePrice === 'free',
      onClick: () => updateMultipleFilters({ price: 'free' }),
    },
    {
      key: 'paid',
      label: 'Paid',
      isActive: activePrice === 'paid',
      onClick: () => updateMultipleFilters({ price: 'paid' }),
    },
  ]

  const activeFilterChips = [
    activeCategory
      ? {
          key: 'category',
          label: categories.find(c => c.slug === activeCategory)?.name ?? activeCategory,
          onRemove: () => updateFilter('category', ''),
        }
      : null,
    activeDate
      ? {
          key: 'date',
          label: DATE_OPTIONS.find(d => d.value === activeDate)?.label ?? activeDate,
          onRemove: () => updateFilter('date', ''),
        }
      : null,
    activeCity
      ? {
          key: 'city',
          label: activeCity,
          onRemove: () => updateCity(''),
        }
      : null,
    activePrice
      ? {
          key: 'price',
          label: activePrice === 'free' ? 'Free' : 'Paid',
          onRemove: () => updateFilter('price', ''),
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; onRemove: () => void }>

  return (
    <div className="w-full space-y-3">
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {quickFilter.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              item.isActive
                ? 'bg-gold text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </div>

      <div className="relative">
        <select
          value={activeCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
          className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-sm font-medium cursor-pointer outline-none transition ${
            activeCategory
              ? 'border-gold bg-gold text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${activeCategory ? 'text-white' : 'text-gray-500'}`} />
      </div>

      <div className="relative">
        <select
          value={activeDate}
          onChange={(e) => updateFilter('date', e.target.value)}
          className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-sm font-medium cursor-pointer outline-none transition ${
            activeDate
              ? 'border-gold bg-gold text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <option value="">Date</option>
          {DATE_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${activeDate ? 'text-white' : 'text-gray-500'}`} />
      </div>

      <div className="relative">
        <select
          value={citySelectCurrent}
          onChange={(e) => updateCity(e.target.value)}
          className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-sm font-medium cursor-pointer outline-none transition ${
            activeCity
              ? 'border-gold bg-gold text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <option value="">City</option>
          <optgroup label="Popular">
            {POPULAR_CITIES.map((c) => (
              <option key={citySelectValue(c)} value={citySelectValue(c)}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="All cities">
            {GHANA_CITIES.map((c) => (
              <option key={citySelectValue(c)} value={citySelectValue(c)}>
                {cityDisplayLabel(c)}
              </option>
            ))}
          </optgroup>
        </select>
        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${activeCity ? 'text-white' : 'text-gray-500'}`} />
      </div>

      <div className="relative">
        <select
          value={activePrice}
          onChange={(e) => updateFilter('price', e.target.value)}
          className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-sm font-medium cursor-pointer outline-none transition ${
            activePrice
              ? 'border-gold bg-gold text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <option value="">Price</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${activePrice ? 'text-white' : 'text-gray-500'}`} />
      </div>

      <div className="relative">
        <select
          value={activeSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-sm font-medium cursor-pointer outline-none transition ${
            activeSort !== 'soonest'
              ? 'border-gold bg-gold text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${activeSort !== 'soonest' ? 'text-white' : 'text-gray-500'}`} />
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex h-9 items-center gap-1.5 rounded-full border border-gray-300 px-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}

        {activeFilterChips.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-2 pt-1">
            {activeFilterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold transition hover:bg-gold/15"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
