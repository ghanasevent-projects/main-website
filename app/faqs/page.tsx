import Link from 'next/link'
import { HelpCircle, Ticket, QrCode, Sparkles } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

const FAQS = [
  {
    q: 'How do I create an event?',
    a: 'Sign in as an organiser, then use Create Events from the navigation menu.',
  },
  {
    q: 'How do attendees receive tickets?',
    a: 'After payment, tickets are delivered with a QR code for check-in.',
  },
  {
    q: 'Can I host free events?',
    a: 'Yes. You can publish free events with registration tracking.',
  },
]

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about GhanasEvent.',
}

export default function FaqsPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5] px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Help center
            </p>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
              Frequently asked questions
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
              Quick answers about publishing, ticketing, QR check-in, and using GhanasEvent as an attendee or organiser.
            </p>

            <div className="mt-8 space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-gray-900 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-gold transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Popular topics</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: Ticket, label: 'Creating events' },
                { icon: QrCode, label: 'QR check-in' },
                { icon: HelpCircle, label: 'Account support' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <Icon className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-4">
              <p className="text-sm font-semibold text-gray-900">Still need help?</p>
              <p className="mt-2 text-sm text-gray-600">Our team can help with events, ticketing, and partnership questions.</p>
              <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-gold hover:underline">
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </SiteShell>
  )
}
