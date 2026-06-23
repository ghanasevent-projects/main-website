import Link from 'next/link'
import Image from 'next/image'
import { Check, Sparkles, TrendingUp, Users, ShieldCheck, BarChart3 } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    blurb: 'For first-time organisers and small community events.',
    points: ['Create free events', 'Basic event listing', 'Standard analytics', 'Email support'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Growth',
    price: 'Contact sales',
    blurb: 'Best for promoters, churches, schools, and recurring events.',
    points: ['Paid ticketing', 'Promotion boosts', 'Priority support', 'Performance insights'],
    cta: 'Talk to sales',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'For large organisations running high-volume or multi-city experiences.',
    points: ['High-volume ticketing', 'Advanced reports', 'Dedicated success manager', 'Custom onboarding'],
    cta: 'Request a demo',
    featured: false,
  },
]

export const metadata = {
  title: 'Pricing',
  description: 'Pricing plans for organisers on GhanasEvent.',
}

export default function PricingPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5]">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-12 sm:py-16">
          <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <Sparkles className="h-3.5 w-3.5" />
                Flexible pricing for organisers
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Pricing that grows with your event ambitions
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                Start with free events, scale into paid ticketing, and unlock enterprise support when your audience grows.
                Choose a plan that fits how you work today and where you want to go next.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Fast setup', value: '15 min' },
                  { label: 'Secure checkout', value: 'Built-in' },
                  { label: 'Cities supported', value: '16+' },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
              <Image
                src="/hero/music-festival.webp"
                alt="Pricing and event growth"
                width={960}
                height={640}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: Users, title: 'Audience growth', text: 'Reach more people with local discovery.' },
                  { icon: TrendingUp, title: 'Promotion', text: 'Boost visibility when you need momentum.' },
                  { icon: ShieldCheck, title: 'Trust', text: 'Reliable checkout and ticket verification.' },
                  { icon: BarChart3, title: 'Insights', text: 'See what drives sales and attendance.' },
                ].map(card => {
                  const Icon = card.icon
                  return (
                    <div key={card.title} className="rounded-2xl border border-white/20 bg-black/35 p-3 text-white backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-gold" />
                      <p className="mt-2 text-sm font-semibold">{card.title}</p>
                      <p className="mt-1 text-xs text-white/80">{card.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Choose the plan that matches your stage
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                All plans are designed around clean publishing, flexible ticketing, and a smooth attendee experience.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-6 shadow-sm ${plan.featured ? 'border-gold/30 bg-white ring-1 ring-gold/20' : 'border-gray-200 bg-white'}`}
                >
                  {plan.featured && (
                    <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                      Most popular
                    </span>
                  )}
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">{plan.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{plan.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{plan.blurb}</p>
                  <ul className="mt-5 space-y-3 text-sm text-gray-700">
                    {plan.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href={plan.name === 'Starter' ? '/organiser/events/create' : '/contact'}
                      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${plan.featured ? 'bg-gold text-white hover:bg-gold-dark' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                What is included by default
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  'Event pages with beautiful image layouts',
                  'Ticketing with QR code delivery',
                  'Location and category discovery',
                  'Attendee and organiser support tools',
                ].map(item => (
                  <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gold/20 bg-linear-to-r from-gold/10 via-amber-50 to-white p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Need something custom?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-gray-700">
                We can tailor onboarding, event volume support, reporting, and promotion flows for your organisation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-dark">
                  Talk to sales
                </Link>
                <Link href="/how-it-works" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  See how it works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
