import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart3,
  CalendarCheck2,
  Megaphone,
  QrCode,
  ShieldCheck,
  Ticket,
} from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'How It Works',
  description: 'How GhanasEvent helps organisers sell tickets and attendees discover events.',
}

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Create your event in minutes',
      text: 'Set date, location, categories, ticket types, and branding from one organiser workspace. Add venue media and key details attendees need before checkout.',
      icon: Ticket,
    },
    {
      title: 'Publish and get discovered',
      text: 'Launch instantly, rank by category and city, and amplify reach with premium visibility tools. Share your event page anywhere and track performance in real time.',
      icon: Megaphone,
    },
    {
      title: 'Sell, scan, and grow',
      text: 'Process secure payments, issue QR tickets automatically, and validate entry fast at the gate. Use insights to improve your next event and audience retention.',
      icon: QrCode,
    },
  ]

  const faqs = [
    {
      q: 'How quickly can I publish an event?',
      a: 'Most organisers can publish in under 15 minutes once they have title, venue, dates, and ticket details ready.',
    },
    {
      q: 'When do attendees receive tickets?',
      a: 'Tickets are generated immediately after successful payment and can be accessed from confirmation screens and user ticket pages.',
    },
    {
      q: 'Can I run both free and paid ticket types for the same event?',
      a: 'Yes. You can configure multiple ticket tiers, including free registration and paid entry options, inside one event setup.',
    },
    {
      q: 'How does check-in work at the venue?',
      a: 'Each ticket includes a unique QR code. Organisers scan and validate at entry to prevent reuse and reduce queue delays.',
    },
    {
      q: 'Do I need technical skills to use GhanasEvent?',
      a: 'No. The organiser flow is built for non-technical teams with clear forms, guided setup, and simple ticket management tools.',
    },
  ]

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5]">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-12 sm:py-16">
          <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <CalendarCheck2 className="h-3.5 w-3.5" />
                Event growth platform
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Run events that fill seats, sell tickets, and build loyal communities
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                GhanasEvent combines discovery, ticketing, and check-in tools in one workflow. From first publish to last scan,
                you get the systems organisers need and the experience attendees trust.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/organiser/events/create" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-dark">
                  Start creating
                </Link>
                <Link href="/events" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  Explore events
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
              <Image
                src="/hero/music-festival.webp"
                alt="Crowd at a Ghana music event"
                width={960}
                height={640}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 text-white">
                {[
                  { k: 'Tickets sold', v: '10k+' },
                  { k: 'Cities covered', v: '16' },
                  { k: 'Avg check-in speed', v: '2s' },
                ].map(item => (
                  <div key={item.k} className="rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-center backdrop-blur-sm">
                    <p className="text-[11px] text-white/80">{item.k}</p>
                    <p className="text-sm font-bold">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Three steps to go from idea to sold-out event
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                A practical workflow used by organisers, promoters, churches, schools, and event teams across Ghana.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-dark">Step {index + 1}</span>
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="checkin" className="border-y border-gray-200 bg-white px-4 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
              <Image
                src="/hero/tarkwa-crusade.jpg"
                alt="Check-in crowd at a Ghana church event"
                width={960}
                height={640}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                Live gate check-in
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Faster entry with secure QR check-in
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Every successful purchase receives a unique ticket code. At entry, organisers scan and validate instantly,
                reducing queues and preventing duplicate access.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <QrCode className="h-5 w-5 text-gold" />
                  <p className="mt-2 text-sm font-semibold text-gray-900">One-scan validation</p>
                  <p className="mt-1 text-xs text-gray-600">Simple and reliable scanning for on-site teams.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                  <p className="mt-2 text-sm font-semibold text-gray-900">Fraud protection</p>
                  <p className="mt-1 text-xs text-gray-600">Duplicate or invalid ticket attempts are flagged instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Why organisers choose GhanasEvent
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <BarChart3 className="h-5 w-5 text-gold" />
                <p className="mt-3 text-sm font-semibold text-gray-900">Clear performance insights</p>
                <p className="mt-2 text-sm text-gray-600">Track demand, conversion, and sales trends to make better decisions event after event.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <Megaphone className="h-5 w-5 text-gold" />
                <p className="mt-3 text-sm font-semibold text-gray-900">Built-in discovery channels</p>
                <p className="mt-2 text-sm text-gray-600">Get found through homepage placements, category browsing, and city-level search visibility.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <p className="mt-3 text-sm font-semibold text-gray-900">Trusted checkout flow</p>
                <p className="mt-2 text-sm text-gray-600">Reliable payment integration and ticket delivery designed for attendee confidence.</p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Frequently asked questions
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Quick answers for organisers and attendees before you get started.
              </p>

              <div className="mt-5 space-y-3">
                {faqs.map(item => (
                  <details key={item.q} className="group rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-gray-900 marker:content-none">
                      <span className="flex items-center justify-between gap-3">
                        <span>{item.q}</span>
                        <span className="text-gold transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gold/20 bg-linear-to-r from-gold/10 via-amber-50 to-white p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Ready to launch your next event?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-gray-700">
                Publish in minutes, promote with confidence, and deliver a smooth ticket experience from first click to final check-in.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/organiser/events/create" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-dark">
                  Create event
                </Link>
                <Link href="/pricing" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
