import Link from 'next/link'
import {
  ChevronRight,
  Gift,
  Music2,
  UtensilsCrossed,
  Briefcase,
  Flame,
  Trophy,
  Moon,
  Palette,
  Users,
  GraduationCap,
  Shirt,
  Cpu,
  type LucideIcon,
} from 'lucide-react'

type QuickLink = {
  label: string
  sublabel: string
  href: string
  iconBg: string
  iconColor: string
  ring: string
  icon: LucideIcon
}

const QUICK_LINKS: QuickLink[] = [
  {
    label: 'Free Events',
    sublabel: 'No ticket needed',
    href: '/events?is_free=true',
    iconBg: 'bg-[#006B3F]/10',
    iconColor: 'text-[#006B3F]',
    ring: 'hover:ring-[#006B3F]/20',
    icon: Gift,
  },
  {
    label: 'Music & Concerts',
    sublabel: 'Live performances',
    href: '/events?category=music',
    iconBg: 'bg-[#C9973A]/10',
    iconColor: 'text-[#C9973A]',
    ring: 'hover:ring-[#C9973A]/20',
    icon: Music2,
  },
  {
    label: 'Food & Drink',
    sublabel: 'Tastes of Ghana',
    href: '/events?category=food-drink',
    iconBg: 'bg-[#CE1126]/8',
    iconColor: 'text-[#CE1126]',
    ring: 'hover:ring-[#CE1126]/20',
    icon: UtensilsCrossed,
  },
  {
    label: 'Business & Tech',
    sublabel: 'Grow your network',
    href: '/events?category=business',
    iconBg: 'bg-brand-500/8',
    iconColor: 'text-brand-500',
    ring: 'hover:ring-brand-500/20',
    icon: Briefcase,
  },
  {
    label: 'Church & Faith',
    sublabel: 'Worship & gatherings',
    href: '/events?category=spirituality',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    ring: 'hover:ring-violet-500/20',
    icon: Flame,
  },
  {
    label: 'Sports & Fitness',
    sublabel: 'Matches & marathons',
    href: '/events?category=sports-fitness',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    ring: 'hover:ring-emerald-500/20',
    icon: Trophy,
  },
  {
    label: 'Nightlife',
    sublabel: 'Clubs & parties',
    href: '/events?category=nightlife',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-600',
    ring: 'hover:ring-indigo-500/20',
    icon: Moon,
  },
  {
    label: 'Arts & Culture',
    sublabel: 'Exhibitions & shows',
    href: '/events?category=arts-culture',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    ring: 'hover:ring-rose-500/20',
    icon: Palette,
  },
  {
    label: 'Community',
    sublabel: 'Local meetups',
    href: '/events?category=community',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
    ring: 'hover:ring-sky-500/20',
    icon: Users,
  },
  {
    label: 'Campus & SRC',
    sublabel: 'Student life',
    href: '/events?category=family-education',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-700',
    ring: 'hover:ring-amber-500/20',
    icon: GraduationCap,
  },
  {
    label: 'Fashion',
    sublabel: 'Runways & style',
    href: '/events?category=fashion',
    iconBg: 'bg-fuchsia-500/10',
    iconColor: 'text-fuchsia-600',
    ring: 'hover:ring-fuchsia-500/20',
    icon: Shirt,
  },
  {
    label: 'Science & Tech',
    sublabel: 'Summits & hackathons',
    href: '/events?category=science-tech',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-600',
    ring: 'hover:ring-cyan-500/20',
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

        <div
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory
                     sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0
                     md:grid-cols-3 lg:grid-cols-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {QUICK_LINKS.map(quickLink => {
            const Icon = quickLink.icon
            return (
              <Link
                key={quickLink.label}
                href={quickLink.href}
                className={`group flex min-h-[88px] w-[min(82vw,300px)] shrink-0 snap-start
                            items-center gap-3 rounded-2xl border border-gray-200 bg-white
                            p-4 shadow-sm ring-2 ring-transparent transition duration-200
                            hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5
                            sm:min-h-0 sm:w-auto sm:gap-4 sm:p-5 ${quickLink.ring}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                              sm:h-12 sm:w-12 ${quickLink.iconBg} ${quickLink.iconColor}
                              transition duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5" />
                </div>
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
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-gray-300 transition duration-200
                             group-hover:translate-x-0.5 group-hover:text-gray-500"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
