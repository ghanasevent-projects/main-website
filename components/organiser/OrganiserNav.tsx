import Link from 'next/link'
import { LayoutDashboard, Ticket, PlusCircle } from 'lucide-react'

const LINKS = [
  { href: '/organiser/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/organiser/sales', label: 'Ticket sales', icon: Ticket },
  { href: '/organiser/events/create', label: 'Create event', icon: PlusCircle },
]

export default function OrganiserNav({ current }: { current: string }) {
  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? current === href : current.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition
              sm:text-sm
              ${active
                ? 'bg-[#C9973A]/10 text-[#C9973A]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
