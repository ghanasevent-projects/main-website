import Image from 'next/image'
import { Globe2, Ticket, Users, ShieldCheck } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'About Us',
  description: 'Learn about the GhanasEvent mission and platform.',
}

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5]">
        <section className="border-b border-gray-200 bg-white px-4 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">About GhanasEvent</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Built to help Ghana discover, sell, and celebrate more events
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                GhanasEvent is a local-first platform for discovery, ticketing, and live entry management.
                We help attendees find meaningful experiences and give organisers the tools to grow with confidence.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
              <Image
                src="/hero/music-festival.webp"
                alt="Ghana event audience"
                width={960}
                height={640}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Globe2, title: 'Local discovery', text: 'Events across cities, regions, and communities.' },
                { icon: Ticket, title: 'Simple ticketing', text: 'Fast publishing with secure checkout and QR delivery.' },
                { icon: Users, title: 'Audience growth', text: 'Tools that help organisers reach the right crowd.' },
                { icon: ShieldCheck, title: 'Trusted experience', text: 'Reliable flows built for confidence and safety.' },
              ].map(card => {
                const Icon = card.icon
                return (
                  <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <Icon className="h-5 w-5 text-gold" />
                    <p className="mt-3 text-sm font-semibold text-gray-900">{card.title}</p>
                    <p className="mt-2 text-sm text-gray-600">{card.text}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-gold/20 bg-linear-to-br from-gold/10 to-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Mission</p>
                <p className="mt-3 text-lg font-bold text-gray-900">Make event discovery and attendance feel simple, trusted, and modern.</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  We want every organiser to have access to premium publishing tools and every attendee to enjoy a clean,
                  fast, and relevant discovery experience.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">What we support</p>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li>Event creation and promotion</li>
                  <li>Ticket sales and QR check-in</li>
                  <li>Destination and venue discovery</li>
                  <li>Community and cultural experiences</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
