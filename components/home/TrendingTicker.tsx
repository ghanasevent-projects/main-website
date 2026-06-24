'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'
import { ICON_STROKE_WIDTH, iconClassName } from '@/lib/icons'

const TRENDING_TAGS = [
  { label: 'Afrobeats Night', href: '/events?q=afrobeats' },
  { label: 'SRC Week Presec', href: '/events?q=SRC+Week' },
  { label: 'Gospel Concert', href: '/events?category=spirituality' },
  { label: 'Accra Food Fest', href: '/events?q=food+festival' },
  { label: 'Tech Summit Accra', href: '/events?category=science-tech&region=Greater+Accra' },
  { label: 'Business Bootcamp', href: '/events?category=business' },
  { label: 'Cape Coast Tours', href: '/events?region=Central' },
  { label: 'Highlife Nite Out', href: '/events?q=highlife' },
  { label: 'Ghana Fashion Week', href: '/events?category=fashion' },
  { label: 'Accra Marathon', href: '/events?category=sports-fitness&region=Greater+Accra' },
  { label: 'Kumasi Cultural Festival', href: '/events?region=Ashanti' },
  { label: 'Free Art Exhibition', href: '/events?category=arts-culture&is_free=true' },
]

export default function TrendingTicker() {
  // Duplicate to create seamless infinite loop
  const items = [...TRENDING_TAGS, ...TRENDING_TAGS]

  return (
    <div className="overflow-hidden border-b border-gray-100 bg-[#fdfbf7] py-3 select-none">
      <div className="flex items-center gap-4">
        {/* Label */}
        <div className="z-10 flex shrink-0 items-center gap-1.5 rounded-r-full bg-white
                        pl-4 pr-4 py-1.5 shadow-sm border border-l-0 border-gray-200">
          <Flame className={iconClassName('xs')} strokeWidth={ICON_STROKE_WIDTH} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900 whitespace-nowrap">
            Trending
          </span>
        </div>

        {/* Marquee track */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max gap-3 ticker-scroll">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="inline-flex shrink-0 items-center rounded-full border border-gray-200
                           bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm
                           transition hover:border-[#C9973A] hover:text-[#C9973A]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
