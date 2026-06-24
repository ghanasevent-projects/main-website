import Link from 'next/link'
import { ShieldCheck, AlertTriangle, MessageSquare, Users } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import { ICON_STROKE_WIDTH, iconClassName } from '@/lib/icons'

export const metadata = {
  title: 'Community Guidelines',
  description: 'Guidelines for safe, respectful participation on GhanasEvent.',
}

export default function CommunityGuidelinesPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <Users className={iconClassName('xs')} strokeWidth={ICON_STROKE_WIDTH} />
                Community standards
              </p>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                A safer, clearer, and more trusted experience for everyone
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                These guidelines shape how we protect the community, keep event information honest, and respond when something goes wrong.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, title: 'Respect', text: 'Treat every user fairly and avoid harmful content.' },
                { icon: AlertTriangle, title: 'Integrity', text: 'Post truthful events and honest ticket information.' },
                { icon: MessageSquare, title: 'Responsibility', text: 'Use the platform in ways that protect the community.' },
                { icon: ShieldCheck, title: 'Enforcement', text: 'We act quickly on reports, abuse, and safety issues.' },
              ].map(card => {
                const Icon = card.icon
                return (
                  <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <Icon className={iconClassName('md')} strokeWidth={ICON_STROKE_WIDTH} />
                    <p className="mt-3 text-sm font-semibold text-gray-900">{card.title}</p>
                    <p className="mt-2 text-sm text-gray-600">{card.text}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">What we expect</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
                <li>Treat others with respect regardless of identity, belief, or background.</li>
                <li>Use accurate titles, images, dates, venues, and pricing.</li>
                <li>Do not impersonate brands, people, or organisations.</li>
                <li>Do not spam, scam, scrape, or manipulate rankings and engagement.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-gold/20 bg-linear-to-br from-gold/10 to-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">How we respond</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
                <li>Content removal or event unlisting.</li>
                <li>Temporary restrictions or account suspension.</li>
                <li>Permanent removal for repeated or serious violations.</li>
                <li>Review and appeals when moderation errors are reported.</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="text-sm font-semibold text-gold hover:underline">
                  Report a concern or contact support
                </Link>
              </div>
            </div>
          </section>

          <p className="mt-8 text-xs text-gray-500">Last updated: June 21, 2026</p>
        </div>
      </main>
    </SiteShell>
  )
}
