'use client'

import RegionLocationPicker from '@/components/ui/RegionLocationPicker'
import { BrandFieldLabel, BrandInput } from '@/components/ui/BrandInput'
import type { OrganiserDetailsInitial } from '@/lib/organiser-details'

export type { OrganiserDetailsInitial }

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

export default function OrganiserDetailsFields({
  value,
  onChange,
}: {
  value: OrganiserDetailsInitial
  onChange: (patch: Partial<OrganiserDetailsInitial>) => void
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-gray-500">
        Your organiser details
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Shown on your event page and public profile so attendees can contact you.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="organiser-name" className={labelClass}>Display name</label>
          <input
            id="organiser-name"
            type="text"
            value={value.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="e.g. Accra Events Co."
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <BrandFieldLabel brand="phone" htmlFor="organiser-phone">Phone</BrandFieldLabel>
            <BrandInput
              brand="phone"
              id="organiser-phone"
              type="tel"
              value={value.phone}
              onChange={e => onChange({ phone: e.target.value })}
              placeholder="+233 24 000 0000"
            />
          </div>
          <div>
            <BrandFieldLabel brand="whatsapp" htmlFor="organiser-whatsapp">WhatsApp</BrandFieldLabel>
            <BrandInput
              brand="whatsapp"
              id="organiser-whatsapp"
              type="tel"
              value={value.whatsapp}
              onChange={e => onChange({ whatsapp: e.target.value })}
              placeholder="+233 24 000 0000"
            />
          </div>
          <div className="sm:col-span-2">
            <BrandFieldLabel brand="website" htmlFor="organiser-website">Website</BrandFieldLabel>
            <BrandInput
              brand="website"
              id="organiser-website"
              type="url"
              value={value.website}
              onChange={e => onChange({ website: e.target.value })}
              placeholder="https://ghanasevent.com"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Your location (optional)</label>
          <RegionLocationPicker
            value={{ region: value.region, city: value.city }}
            onChange={({ region, city }) => onChange({ region, city })}
            className="mt-0"
          />
        </div>

        <div>
          <label htmlFor="organiser-bio" className={labelClass}>About you / your brand</label>
          <textarea
            id="organiser-bio"
            value={value.bio}
            onChange={e => onChange({ bio: e.target.value })}
            rows={3}
            maxLength={500}
            placeholder="Tell attendees about your organisation and past events…"
            className={`${inputClass} h-auto resize-y py-2.5`}
          />
        </div>

        <div>
          <p className={labelClass}>Social links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <BrandInput
              brand="instagram"
              value={value.instagramUrl}
              onChange={e => onChange({ instagramUrl: e.target.value })}
              placeholder="https://instagram.com/…"
            />
            <BrandInput
              brand="facebook"
              value={value.facebookUrl}
              onChange={e => onChange({ facebookUrl: e.target.value })}
              placeholder="https://facebook.com/…"
            />
            <BrandInput
              brand="twitter"
              value={value.twitterUrl}
              onChange={e => onChange({ twitterUrl: e.target.value })}
              placeholder="https://x.com/…"
            />
            <BrandInput
              brand="linkedin"
              value={value.linkedinUrl}
              onChange={e => onChange({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/…"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
