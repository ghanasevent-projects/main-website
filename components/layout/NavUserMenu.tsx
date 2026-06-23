'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, ChevronDown, LogOut, LayoutDashboard, Ticket, BarChart3 } from 'lucide-react'

interface Props {
  name: string
  role: string
}

export default function NavUserMenu({ name, role }: Props) {
  const [open, setOpen]     = useState(false)
  const ref                 = useRef<HTMLDivElement>(null)
  const router              = useRouter()
  const supabase            = createClient()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const dashboardHref =
    role === 'admin'     ? '/admin/dashboard'     :
    role === 'organiser' ? '/organiser/dashboard' :
    '/attendee/tickets'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200
                   bg-white px-3 py-2 text-sm font-medium text-gray-700
                   transition hover:border-gray-300 hover:bg-gray-50"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9973A]/10">
          <User className="h-3.5 w-3.5 text-[#C9973A]" />
        </div>
        <span className="hidden max-w-24 truncate sm:block">{name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform
                               ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl
                        border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
          <div className="py-1">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                         hover:bg-gray-50 transition"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-400" />
              Dashboard
            </Link>
            {(role === 'organiser' || role === 'admin') && (
              <Link
                href="/organiser/sales"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                           hover:bg-gray-50 transition"
              >
                <BarChart3 className="h-4 w-4 text-gray-400" />
                Ticket sales
              </Link>
            )}
            {role === 'admin' && (
              <Link
                href="/admin/tickets"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                           hover:bg-gray-50 transition"
              >
                <Ticket className="h-4 w-4 text-gray-400" />
                All ticket sales
              </Link>
            )}
            <Link
              href="/attendee/tickets"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                         hover:bg-gray-50 transition"
            >
              <Ticket className="h-4 w-4 text-gray-400" />
              My tickets
            </Link>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm
                         text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}