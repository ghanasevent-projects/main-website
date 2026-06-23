import Link from 'next/link'
import { Mail, MessageCircle, MapPin, Sparkles } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Contact',
  description: 'Contact GhanasEvent support and partnerships team.',
}

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <Sparkles className="h-3.5 w-3.5" />
                Contact GhanasEvent
              </p>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Talk to the team behind the platform
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                We support organisers, attendees, partners, and businesses building with GhanasEvent.
                Use the channel below that best matches what you need.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <Mail className="h-5 w-5 text-gold" />
                  <p className="mt-3 text-sm font-semibold text-gray-900">Support</p>
                  <p className="mt-2 text-sm text-gray-600">support@ghanasevent.com</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-gold" />
                  <p className="mt-3 text-sm font-semibold text-gray-900">Partnerships</p>
                  <p className="mt-2 text-sm text-gray-600">partners@ghanasevent.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Best for</p>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">Help with events, tickets, or account access</div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">Partnership and advertising inquiries</div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">Press, community, and venue collaborations</div>
              </div>
              <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Based in Ghana</p>
                    <p className="mt-1 text-sm text-gray-600">Serving organisers and attendees across cities nationwide.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/community-guidelines" className="text-sm font-semibold text-gold hover:underline">
                  View community guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
