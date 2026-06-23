'use client'

import { ContactBrandIcon, type ContactBrand } from '@/components/ui/SocialBrandIcons'

const inputClass = `w-full h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm
  text-gray-900 placeholder:text-gray-400 transition
  focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/20`

export function BrandFieldLabel({
  brand,
  htmlFor,
  children,
}: {
  brand: ContactBrand
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
      <ContactBrandIcon brand={brand} size={16} />
      {children}
    </label>
  )
}

export function BrandInput({
  brand,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = inputClass,
}: {
  brand: ContactBrand
  id?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <ContactBrandIcon brand={brand} size={18} />
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  )
}
