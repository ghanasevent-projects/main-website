import { Clock, Ticket, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { getCategoryDisplayIcon } from '@/lib/category-icons'

interface Highlight {
  icon: ReactNode
  label: string
  key: string
}

export default function EventGoodToKnow({
  duration,
  priceLabel,
  category,
}: {
  duration: string | null
  priceLabel: string
  category?: { name: string; slug: string; icon?: string | null } | null
}) {
  const lucide = (Icon: LucideIcon, label: string, key: string): Highlight => ({
    icon: <Icon className="h-4 w-4 text-[#C9973A]" />,
    label,
    key,
  })

  const highlights: Highlight[] = [
    ...(duration ? [lucide(Clock, duration, 'duration')] : []),
    lucide(Users, 'In person', 'in-person'),
    lucide(Ticket, priceLabel, 'price'),
    ...(category
      ? [{
          icon: getCategoryDisplayIcon(category.slug, category.icon),
          label: category.name,
          key: 'category',
        }]
      : []),
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {highlights.map(({ icon, label, key }) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#C9973A]">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
      ))}
    </div>
  )
}
