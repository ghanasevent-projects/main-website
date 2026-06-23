'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Church, Music2, GraduationCap, Ticket, MapPin, Users } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    // African church interior, congregation at altar — pexels 29117524
    image: '/hero/tarkwa-crusade.jpg',
    eyebrow: 'Church Events Across Ghana',
    title: 'Worship.\nTogether.',
    subtitle: 'Join thousands of believers across Ghana for powerful worship experiences, conventions, and district services.',
    cta:          { label: 'Find Church Events',    href: '/events?category=religion' },
    secondaryCta: { label: 'Learn more',            href: '/events' },
    icon: <Church className="h-5 w-5" />,
  },
  {
    id: 2,
    // Outdoor concert with stage and hands-up crowd — pexels 3892904
    image: '/hero/music-festival.webp',
    eyebrow: 'Live Music in Accra',
    title: 'Feel the\nBeat.',
    subtitle: 'From Highlife to Afrobeats — the best live concerts, festivals, and shows happening in Greater Accra.',
    cta:          { label: 'Get Concert Tickets',   href: '/events?category=music&region=Greater+Accra' },
    secondaryCta: { label: 'Browse all music',      href: '/events?category=music' },
    icon: <Music2 className="h-5 w-5" />,
  },
  {
    id: 3,
    // Joyful African school students in white uniforms — pexels 34162710
    image: '/hero/kpasec.jpg',
    eyebrow: 'SRC Week 2026 — Kpasec',
    title: 'The Week\nEveryone\nTalks About.',
    subtitle: "Kpando Senior High School SRC Week — concerts, debates, sports, and the most anticipated student events in Ghana.",
    cta:          { label: 'Get SRC Week Tickets',  href: '/events?q=SRC+Week+Kpasec' },
    secondaryCta: { label: 'View schedule',          href: '/events?q=Kpasec' },
    icon: <GraduationCap className="h-5 w-5" />,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const [tick, setTick]       = useState(0) // forces progress bar remount

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length)
    setTick(t => t + 1)
  }, [])

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
    setTick(t => t + 1)
  }, [])

  function goTo(i: number) {
    setCurrent(i)
    setTick(t => t + 1)
  }

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [paused, next])

  const slide = SLIDES[current]

  const STATS = [
    { icon: <Ticket  className="h-4 w-4" />, value: '1,200+', label: 'Events listed' },
    { icon: <MapPin  className="h-4 w-4" />, value: '16',     label: 'Regions covered' },
    { icon: <Users   className="h-4 w-4" />, value: '300+',   label: 'Organisers' },
  ]

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ minHeight: 'clamp(540px, 80vh, 760px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds ─────────────────────────── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000
            ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Image
            src={s.image}
            alt={s.title.replace(/\n/g, ' ')}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center scale-105 transition-transform duration-8000"
            style={{ transform: i === current ? 'scale(1)' : 'scale(1.05)' }}
          />
          {/* Rich layered overlay: radial vignette + linear gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
        </div>
      ))}

      {/* ── Content ──────────────────────────────────── */}
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-center
                      px-6 pb-28 pt-16 mx-auto max-w-7xl md:px-12">

        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-full bg-gold p-1.5 text-white shadow-lg shadow-gold/30">
            {slide.icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            {slide.eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-4 text-5xl font-extrabold leading-[1.04]
                     tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl"
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            whiteSpace: 'pre-line',
          }}
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={slide.cta.href}
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold
                       text-white shadow-lg shadow-black/20 transition hover:bg-gold-dark active:scale-95"
          >
            {slide.cta.label}
          </Link>
          <Link
            href={slide.secondaryCta.href}
            className="rounded-full border-2 border-white/40 px-7 py-3.5 text-sm
                       font-semibold text-white backdrop-blur-sm transition
                       hover:border-white/70 hover:bg-white/10"
          >
            {slide.secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* ── Stats strip (bottom overlay) ─────────────── */}
      <div className="absolute bottom-10 left-0 right-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="hidden md:flex items-center gap-6">
            {STATS.map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-2 rounded-full border border-white/15
                           bg-black/30 px-4 py-2 backdrop-blur-md"
              >
                <span className="text-gold">{stat.icon}</span>
                <span
                  className="text-sm font-extrabold text-white"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-white/60">{stat.label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white/70">Ghana's #1 event platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ───────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10
                   items-center justify-center rounded-full border border-white/20
                   bg-black/25 text-white backdrop-blur-sm transition
                   hover:bg-black/50 hover:border-white/40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10
                   items-center justify-center rounded-full border border-white/20
                   bg-black/25 text-white backdrop-blur-sm transition
                   hover:bg-black/50 hover:border-white/40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Slide indicators ─────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300
              ${i === current
                ? 'w-7 h-2.5 bg-gold'
                : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'
              }`}
          />
        ))}
      </div>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-white/10">
        {!paused && (
          <div key={tick} className="h-full bg-gold hero-progress-bar" />
        )}
      </div>
    </section>
  )
}