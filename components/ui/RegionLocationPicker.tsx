'use client'

import { useEffect, useId, useState } from 'react'
import { GHANA_REGIONS, getCitiesByRegion, getCityByName, getRegionForCity } from '@/lib/ghana-locations'

const CUSTOM = '__custom__'

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

export interface RegionLocationValue {
  region: string
  city: string
}

interface RegionLocationPickerProps {
  value: RegionLocationValue
  onChange: (value: RegionLocationValue) => void
  cityLabel?: string
  regionLabel?: string
  required?: boolean
  className?: string
}

/** Region-first location control with list + custom town entry. */
export default function RegionLocationPicker({
  value,
  onChange,
  cityLabel = 'City / town',
  regionLabel = 'Region',
  required = false,
  className = '',
}: RegionLocationPickerProps) {
  const id = useId()
  const listedCity = getCityByName(value.city)
  const [mode, setMode] = useState<'list' | 'custom'>(() =>
    value.city && !listedCity ? 'custom' : 'list',
  )
  const [customCity, setCustomCity] = useState(() =>
    value.city && !listedCity ? value.city : '',
  )

  const citiesInRegion = value.region ? getCitiesByRegion(value.region) : []

  useEffect(() => {
    if (value.city && !getCityByName(value.city) && mode !== 'custom') {
      setMode('custom')
      setCustomCity(value.city)
    }
  }, [value.city, mode])

  function setRegion(region: string) {
    const nextCities = getCitiesByRegion(region)
    if (mode === 'list' && value.city && !nextCities.some(c => c.name === value.city)) {
      onChange({ region, city: '' })
    } else {
      onChange({ region, city: value.city })
    }
  }

  function setCityFromList(cityName: string) {
    if (cityName === CUSTOM) {
      setMode('custom')
      setCustomCity('')
      onChange({ region: value.region, city: '' })
      return
    }
    setMode('list')
    const region = getRegionForCity(cityName) ?? value.region
    onChange({ region, city: cityName })
  }

  function setCustom(valueText: string) {
    setCustomCity(valueText)
    onChange({ region: value.region, city: valueText.trim() })
  }

  const selectValue = mode === 'custom' ? CUSTOM : (value.city || '')

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      <div>
        <label htmlFor={`${id}-region`} className={labelClass}>
          {regionLabel}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <select
          id={`${id}-region`}
          value={value.region}
          onChange={e => setRegion(e.target.value)}
          className={inputClass}
          required={required}
        >
          <option value="">Select region</option>
          {GHANA_REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-city`} className={labelClass}>
          {cityLabel}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <select
          id={`${id}-city`}
          value={selectValue}
          onChange={e => setCityFromList(e.target.value)}
          className={inputClass}
          disabled={!value.region}
          required={required && mode === 'list'}
        >
          <option value="">
            {value.region ? 'Select city or town' : 'Choose a region first'}
          </option>
          {citiesInRegion.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
          {value.region && (
            <option value={CUSTOM}>Other location in {value.region}…</option>
          )}
        </select>
      </div>

      {mode === 'custom' && value.region && (
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-custom`} className={labelClass}>
            Custom location name
            {required && <span className="text-red-500"> *</span>}
          </label>
          <input
            id={`${id}-custom`}
            type="text"
            value={customCity}
            onChange={e => setCustom(e.target.value)}
            placeholder={`e.g. a neighbourhood or town in ${value.region}`}
            className={inputClass}
            required={required}
          />
          <p className="mt-1 text-xs text-gray-500">
            Use this for towns, neighbourhoods, or venues not in the list. It will be tied to{' '}
            <strong>{value.region}</strong>.
          </p>
        </div>
      )}
    </div>
  )
}
