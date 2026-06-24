'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  CircleHelp,
  FileText,
  Hammer,
  Layers,
  LayoutGrid,
  ListOrdered,
  Mail,
  MapPin,
  Boxes,
  PanelLeft,
  ShieldCheck,
  Sparkles,
  Terminal,
  Ticket,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ICON_STROKE_WIDTH, iconClassName } from '@/lib/icons'
import { GeistSans } from 'geist/font/sans'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

export type DocsNavIcon =
  | 'book-open'
  | 'hammer'
  | 'layout-grid'
  | 'boxes'
  | 'users'
  | 'building'
  | 'briefcase'
  | 'list-ordered'
  | 'circle-help'
  | 'mail'
  | 'layers'
  | 'ticket'
  | 'wallet'
  | 'sparkles'
  | 'map-pin'
  | 'shield-check'
  | 'file-text'

export type DocsNavItem = { id: string; label: string; icon: DocsNavIcon }
export type DocsNavGroup = { label: string; items: DocsNavItem[] }

type Breadcrumb = { label: string; href?: string }

const NAV_ICONS: Record<DocsNavIcon, LucideIcon> = {
  'book-open': BookOpen,
  hammer: Hammer,
  'layout-grid': LayoutGrid,
  boxes: Boxes,
  users: Users,
  building: Building2,
  briefcase: Briefcase,
  'list-ordered': ListOrdered,
  'circle-help': CircleHelp,
  mail: Mail,
  layers: Layers,
  ticket: Ticket,
  wallet: Wallet,
  sparkles: Sparkles,
  'map-pin': MapPin,
  'shield-check': ShieldCheck,
  'file-text': FileText,
}

type Props = {
  breadcrumbs: Breadcrumb[]
  nav: DocsNavGroup[]
  children: React.ReactNode
}

function DocsNavList({
  nav,
  activeId,
  onSelect,
  variant = 'desktop',
}: {
  nav: DocsNavGroup[]
  activeId: string
  onSelect: (id: string) => void
  variant?: 'desktop' | 'drawer'
}) {
  const isDrawer = variant === 'drawer'

  return (
    <>
      {nav.map(group => (
        <div key={group.label} className={isDrawer ? 'mb-8 last:mb-0' : 'mb-9 last:mb-0'}>
          <p
            className={`mb-2 px-3 font-semibold uppercase tracking-[0.14em] text-gray-400 ${
              isDrawer ? 'text-[11px]' : 'text-[10px]'
            }`}
          >
            {group.label}
          </p>
          <ul className={isDrawer ? 'space-y-0.5' : 'space-y-1'}>
            {group.items.map(item => {
              const active = activeId === item.id
              const Icon = NAV_ICONS[item.icon]
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`relative flex w-full items-center gap-3 rounded-lg text-left transition
                      ${isDrawer ? 'px-3 py-3 text-sm' : 'px-3 py-2.5 text-[13px]'}
                      ${
                        active
                          ? isDrawer
                            ? 'font-medium text-gold'
                            : 'bg-gray-100 font-semibold text-gray-900'
                          : isDrawer
                            ? 'font-normal text-gray-700 hover:text-gray-900'
                            : 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {!isDrawer && active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                    )}
                    <Icon
                      className={`${iconClassName('sm')} ${
                        active
                          ? isDrawer
                            ? 'text-gold'
                            : 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                      strokeWidth={ICON_STROKE_WIDTH}
                      absoluteStrokeWidth
                    />
                    <span className="leading-snug">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}

function useSiteNavHeight() {
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    const nav = document.querySelector('[data-site-navbar]')
    if (!nav) return

    const update = () => setNavHeight(nav.getBoundingClientRect().height)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(nav)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return navHeight
}

export default function DeveloperDocsLayout({ breadcrumbs, nav, children }: Props) {
  const flatNav = nav.flatMap(group => group.items)
  const [activeId, setActiveId] = useState(flatNav[0]?.id ?? '')
  const [menuOpen, setMenuOpen] = useState(false)
  const siteNavHeight = useSiteNavHeight()

  const activeLabel = flatNav.find(item => item.id === activeId)?.label ?? 'Introduction'
  const docsBarHeight = 49
  const scrollOffset = siteNavHeight + docsBarHeight + 12
  const drawerOffsetTop = siteNavHeight > 0 ? siteNavHeight : 56
  const drawerHeaderHeight = 65

  useEffect(() => {
    const elements = flatNav
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const topMargin = siteNavHeight > 0 ? -(siteNavHeight + docsBarHeight) : -120
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: `${topMargin}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [flatNav, siteNavHeight])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return

    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setActiveId(id)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (siteNavHeight > 0) {
      document.documentElement.style.setProperty('--site-nav-height', `${siteNavHeight}px`)
    }
    return () => {
      document.documentElement.style.removeProperty('--site-nav-height')
    }
  }, [siteNavHeight])

  return (
    <>
      {/* Fixed docs toolbar — stays pinned below site navbar like Supabase */}
      <div
        data-docs-mobile-nav
        className="fixed inset-x-0 top-[var(--site-nav-height,3.5rem)] z-40 border-b border-gray-200 bg-white lg:hidden"
      >
        <div className="font-docs mx-auto flex max-w-7xl items-center gap-2 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            aria-label="Open documentation menu"
          >
            <PanelLeft
              className="h-4 w-4 text-gray-600"
              strokeWidth={ICON_STROKE_WIDTH}
              absoluteStrokeWidth
            />
            <span>Menu</span>
          </button>
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0 text-gray-300"
            strokeWidth={ICON_STROKE_WIDTH}
            aria-hidden
          />
          <span className="truncate text-sm font-medium text-gold">{activeLabel}</span>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          offsetTop={drawerOffsetTop}
          overlayClassName="bg-black/40 supports-backdrop-filter:backdrop-blur-sm"
          className={`${GeistSans.variable} font-docs flex min-h-0 w-[min(85vw,340px)] flex-col gap-0 overflow-hidden border-r border-gray-200 bg-white p-0 shadow-xl sm:max-w-none`}
        >
          <SheetTitle className="sr-only">Documentation navigation</SheetTitle>

          <div
            data-docs-drawer-header
            className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4"
          >
            <div className="flex items-center gap-2.5">
              <Terminal
                className="h-5 w-5 text-gold"
                strokeWidth={ICON_STROKE_WIDTH}
                absoluteStrokeWidth
              />
              <span className="text-base font-semibold text-gray-900">Platform</span>
            </div>
            <SheetClose
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={ICON_STROKE_WIDTH} />
            </SheetClose>
          </div>

          <nav
            aria-label="Documentation sections"
            className="min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain px-2 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            style={{
              maxHeight: `calc(100dvh - ${drawerOffsetTop}px - ${drawerHeaderHeight}px)`,
            }}
          >
            <DocsNavList
              nav={nav}
              activeId={activeId}
              onSelect={scrollTo}
              variant="drawer"
            />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="font-docs mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Spacer for fixed docs toolbar on mobile/tablet */}
        <div className="lg:hidden" style={{ height: docsBarHeight }} aria-hidden />

        <div className="flex gap-0 lg:gap-12 xl:gap-16">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
            <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-10 xl:py-12">
              <DocsNavList nav={nav} activeId={activeId} onSelect={scrollTo} variant="desktop" />
            </nav>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 border-gray-200 py-8 sm:py-10 lg:border-l lg:py-12 lg:pl-12 xl:pl-16 xl:py-14">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500 lg:mb-10"
            >
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gray-900 hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-900">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
