import Link from 'next/link'
import {
  LayoutDashboard,
  ShieldCheck,
  Hotel,
  MapPin,
  Users,
  Ticket,
  UserCircle,
} from 'lucide-react'

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: ShieldCheck },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin/organisers', label: 'Organisers', icon: UserCircle },
  { href: '/admin/hotels', label: 'Hotels', icon: Hotel },
  { href: '/admin/tourist-areas', label: 'Tourist areas', icon: MapPin },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminNav({ current }: { current: string }) {
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
