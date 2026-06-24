'use client'

import Link from 'next/link'
import {
  ChevronRight,
  Gift,
  Music2,
  UtensilsCrossed,
  Briefcase,
  Church,
  Trophy,
  Martini,
  Theater,
  Users,
  GraduationCap,
  Shirt,
  Cpu,
  type LucideIcon,
} from 'lucide-react'
import HorizontalScrollRow from '@/components/ui/HorizontalScrollRow'
import { ICON_STROKE_WIDTH, iconClassName } from '@/lib/icons'

type QuickLink = {
  label: string
  sublabel: string
  href: string
  icon: LucideIcon
  /** Some Lucide glyphs read heavier at the same strokeWidth — tune individually. */
  strokeWidth?: number
}

const QUICK_LINKS: QuickLink[] = [
  {
    label: 'Free Events',
    sublabel: 'No ticket needed',
    href: '/events?is_free=true',
    icon: Gift,
    strokeWidth: 1.25,
  },
  {
    label: 'Music & Concerts',
    sublabel: 'Live performances',
    href: '/events?category=music',
    icon: Music2,
  },
  {
    label: 'Food & Drink',
    sublabel: 'Tastes of Ghana',
    href: '/events?category=food-drink',
    icon: UtensilsCrossed,
  },
  {
    label: 'Business & Tech',
    sublabel: 'Grow your network',
    href: '/events?category=business',
    icon: Briefcase,
  },
  {
    label: 'Church & Faith',
    sublabel: 'Worship & gatherings',
    href: '/events?category=spirituality',
    icon: Church,
  },
  {
    label: 'Sports & Fitness',
    sublabel: 'Matches & marathons',
    href: '/events?category=sports-fitness',
    icon: Trophy,
  },
  {
    label: 'Nightlife',
    sublabel: 'Clubs & parties',
    href: '/events?category=nightlife',
    icon: Martini,
  },
  {
    label: 'Arts & Culture',
    sublabel: 'Exhibitions & shows',
    href: '/events?category=arts-culture',
    icon: Theater,
  },
  {
    label: 'Community',
    sublabel: 'Local meetups',
    href: '/events?category=community',
    icon: Users,
  },
  {
    label: 'Campus & SRC',
    sublabel: 'Student life',
    href: '/events?category=family-education',
    icon: GraduationCap,
  },
  {
    label: 'Fashion',
    sublabel: 'Runways & style',
    href: '/events?category=fashion',
    icon: Shirt,
    strokeWidth: 1.25,
  },
  {
    label: 'Science & Tech',
    sublabel: 'Summits & hackathons',
    href: '/events?category=science-tech',
    icon: Cpu,
  },
]

export default function QuickDiscovery() {
  return (
    <section className="border-b border-gray-100 bg-[#fdfbf7] px-4 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 sm:mb-6">
          <h2
            className="text-lg font-bold text-gray-900 sm:text-xl"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            Browse by interest
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Jump straight to the events you care about
          </p>
        </div>

        <HorizontalScrollRow
          hideArrowsFrom="lg"
          edgeFadeClass="from-[#fdfbf7]"
          wrapperClassName="-mx-2 px-2 lg:mx-0 lg:px-0"
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory
                     lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {QUICK_LINKS.map(quickLink => {
            const Icon = quickLink.icon
            const stroke = quickLink.strokeWidth ?? ICON_STROKE_WIDTH
            return (
              <Link
                key={quickLink.label}
                href={quickLink.href}
                className="group flex min-h-[88px] w-[min(82vw,300px)] shrink-0 snap-start
                            items-start gap-4 rounded-xl border border-gray-200 bg-white
                            p-4 transition duration-200 hover:border-gray-300 hover:shadow-md
                            hover:-translate-y-0.5 lg:min-h-0 lg:w-auto lg:p-5"
              >
                <span className="flex h-[2.375rem] w-6 shrink-0 items-center justify-center">
                  <Icon
                    className={iconClassName('lg')}
                    strokeWidth={stroke}
                    absoluteStrokeWidth
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold leading-snug text-gray-900 sm:text-[15px]"
                    style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                  >
                    {quickLink.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-gray-500">
                    {quickLink.sublabel}
                  </p>
                </div>
                <span className="flex h-[2.375rem] shrink-0 items-center">
                  <ChevronRight
                    className="h-4 w-4 text-gray-300 transition duration-200
                               group-hover:translate-x-0.5 group-hover:text-gray-500"
                    strokeWidth={ICON_STROKE_WIDTH}
                    absoluteStrokeWidth
                  />
                </span>
              </Link>
            )
          })}
        </HorizontalScrollRow>
      </div>
    </section>
  )
}
