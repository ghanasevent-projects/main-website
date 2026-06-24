import {
  LayoutDashboard,
  Ticket,
  Settings,
  CalendarPlus,
  CalendarRange,
  Compass,
  ShieldCheck,
  Hotel,
  MapPin,
  Users,
  Heart,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'attendee' | 'organiser' | 'admin' | string

export interface AccountMenuItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface AccountMenuGroup {
  heading?: string
  items: AccountMenuItem[]
}

const BROWSE: AccountMenuItem = { label: 'Browse events', href: '/events', icon: Compass }
const TICKETS: AccountMenuItem = { label: 'My tickets', href: '/attendee/tickets', icon: Ticket }
const SAVED: AccountMenuItem = { label: 'Saved events', href: '/saved', icon: Heart }
const SETTINGS: AccountMenuItem = { label: 'Account settings', href: '/account', icon: Settings }

export function getAccountMenu(role: Role): AccountMenuGroup[] {
  if (role === 'admin') {
    return [
      {
        items: [
          { label: 'Admin dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Review events', href: '/admin/events', icon: ShieldCheck },
        ],
      },
      {
        heading: 'Manage',
        items: [
          { label: 'Hotels', href: '/admin/hotels', icon: Hotel },
          { label: 'Tourist areas', href: '/admin/tourist-areas', icon: MapPin },
          { label: 'Users', href: '/admin/users', icon: Users },
        ],
      },
      { items: [TICKETS, SAVED, SETTINGS] },
    ]
  }

  if (role === 'organiser') {
    return [
      {
        items: [
          { label: 'My events', href: '/organiser/dashboard', icon: CalendarRange },
          { label: 'Create event', href: '/organiser/events/create', icon: CalendarPlus },
        ],
      },
      { items: [BROWSE, TICKETS, SAVED, SETTINGS] },
    ]
  }

  // attendee (default)
  return [
    {
      items: [BROWSE, TICKETS, SAVED, SETTINGS],
    },
  ]
}
