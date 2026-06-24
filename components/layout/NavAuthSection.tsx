'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, ChevronDown, LogOut } from 'lucide-react'
import { getAccountMenu } from '@/lib/account-menu'
import { loadNavProfile, type NavProfile } from '@/lib/profile'

interface NavAuthSectionProps {
  /** 'dropdown' = avatar pill with popover (navbar). 'inline' = expanded list (mobile drawer). */
  variant?: 'dropdown' | 'inline'
  /** Called after a link/sign-out is clicked, e.g. to close the mobile drawer. */
  onNavigate?: () => void
}

export default function NavAuthSection({ variant = 'dropdown', onNavigate }: NavAuthSectionProps) {
  const [profile, setProfile] = useState<NavProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const router                = useRouter()
  const supabase              = useMemo(() => createClient(), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        // AuthSessionMissingError is normal when no session exists — treat it as signed out.
        if (error && error.name !== 'AuthSessionMissingError') throw error

        if (!user) {
          if (!cancelled) {
            setProfile(null)
            setLoading(false)
          }
          return
        }

        const nextProfile = await loadNavProfile(supabase, user)
        if (!cancelled) {
          setProfile(nextProfile)
          setLoading(false)
        }
      } catch (err) {
        // Network/Supabase auth failures should not break navbar rendering.
        console.error('NavAuthSection auth load failed', err)
        if (!cancelled) {
          setProfile(null)
          setLoading(false)
        }
      }
    }
    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load())
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase])

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('NavAuthSection sign out failed', err)
    }
    setProfile(null)
    setOpen(false)
    onNavigate?.()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return variant === 'inline'
      ? <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
      : <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
  }

  if (!profile) {
    if (variant === 'inline') {
      return (
        <div className="space-y-2">
          <Link
            href="/login"
            onClick={onNavigate}
            className="block rounded-lg border border-gray-200 px-4 py-2.5 text-center
                       text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={onNavigate}
            className="block rounded-lg bg-gold px-4 py-2.5 text-center
                       text-sm font-semibold text-white transition hover:bg-gold-dark"
          >
            Sign up
          </Link>
        </div>
      )
    }
    return (
      <div className="flex shrink-0 items-center gap-4">
        <Link
          href="/login"
          className="whitespace-nowrap text-sm font-medium text-gray-900 transition hover:text-gray-600"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="whitespace-nowrap rounded-full bg-gold px-4 py-1.5 text-sm
                     font-semibold text-white transition hover:bg-gold-dark"
        >
          Sign up
        </Link>
      </div>
    )
  }

  const menuGroups = getAccountMenu(profile.role)

  // ── Inline variant: expanded list for the mobile drawer ──
  if (variant === 'inline') {
    return (
      <div>
        {/* User header */}
        <div className="mb-3 flex items-center gap-3">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 ring-2 ring-gold/20">
              <User className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{profile.name}</p>
            <p className="text-xs capitalize text-gray-400">{profile.role}</p>
          </div>
        </div>

        {/* Menu links */}
        <nav className="space-y-0.5">
          {menuGroups.map((group, i) => (
            <div key={i}>
              {group.heading && (
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.heading}
                </p>
              )}
              {group.items.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm
                               font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
                     text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200
                   bg-white px-3 py-2 text-sm font-medium text-gray-700
                   transition hover:border-gray-300 hover:bg-gray-50"
      >
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.name}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10">
            <User className="h-3.5 w-3.5 text-gray-900" strokeWidth={1.5} />
          </div>
        )}
        <span className="hidden max-w-24 truncate sm:block">{profile.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform
                               ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden
                          rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-xs font-semibold text-gray-900 truncate">{profile.name}</p>
              <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
            </div>

            {menuGroups.map((group, i) => (
              <div key={i} className="border-b border-gray-50 py-1 last:border-b-0">
                {group.heading && (
                  <p className="px-4 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {group.heading}
                  </p>
                )}
                {group.items.map(item => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                                 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ))}

            <div className="py-1">
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
        </>
      )}
    </div>
  )
}