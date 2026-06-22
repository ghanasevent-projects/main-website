import Link from 'next/link'
import { Code2, Zap, Shield, Globe, ChevronRight, Terminal, Key, Webhook, BookOpen } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/events',
    description: 'List approved events with optional filters: region, category, q, page',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'POST',
    path: '/api/events',
    description: 'Create a new event (requires authentication + organiser role)',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'GET',
    path: '/api/events/:slug',
    description: 'Get a single event by slug with full details',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'GET',
    path: '/api/hotels',
    description: 'List active hotels with optional region and price_range filters',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'GET',
    path: '/api/tourist-areas',
    description: 'List tourist areas with optional region and category filters',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'POST',
    path: '/api/paystack/initialize',
    description: 'Initialize a Paystack transaction for ticket purchase',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'GET',
    path: '/api/paystack/verify',
    description: 'Verify a Paystack transaction by reference',
    color: 'bg-green-100 text-green-700',
  },
  {
    method: 'POST',
    path: '/api/paystack/webhook',
    description: 'Paystack webhook — creates tickets on successful payment',
    color: 'bg-purple-100 text-purple-700',
  },
]

export const metadata = {
  title: 'Developer API',
  description: 'GhanasEvent Developer Documentation — integrate Ghana event data into your apps.',
}

export default function DeveloperPage() {
  return (
    <SiteShell>
    <div className="min-h-screen bg-white">

      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#C9973A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9973A]">Developer</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            GhanasEvent API
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-500">
            Integrate Ghana event data, ticketing, and tourism information into your apps,
            websites, and platforms. Built on Next.js 15 with a RESTful API.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#endpoints" className="rounded-full bg-[#C9973A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A87A28] transition">
              View endpoints
            </a>
            <a href="#authentication" className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Authentication
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-14">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Zap className="h-5 w-5 text-[#C9973A]" />,     title: 'Fast',      desc: 'Responses in under 200ms globally' },
            { icon: <Shield className="h-5 w-5 text-[#C9973A]" />,  title: 'Secure',    desc: 'JWT auth via Supabase, webhook HMAC verification' },
            { icon: <Globe className="h-5 w-5 text-[#C9973A]" />,   title: 'RESTful',   desc: 'Standard REST conventions, JSON responses' },
            { icon: <Webhook className="h-5 w-5 text-[#C9973A]" />, title: 'Webhooks',  desc: 'Real-time event notifications via Paystack' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9973A]/10">
                {f.icon}
              </div>
              <p className="mb-1 text-sm font-semibold text-gray-900">{f.title}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>Base URL</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
            <code className="text-sm font-mono text-gray-800">https://ghanasevent.com</code>
          </div>
        </div>

        <div id="authentication">
          <h2 className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>Authentication</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C9973A]/10">
                <Key className="h-4 w-4 text-[#C9973A]" />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-900">Supabase JWT Bearer Token</p>
                <p className="text-sm text-gray-500">Protected endpoints require a valid JWT from Supabase Auth.</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-900 px-4 py-3">
              <code className="text-xs text-green-400 font-mono">Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN</code>
            </div>
          </div>
        </div>

        <div id="endpoints">
          <h2 className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>Endpoints</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            {ENDPOINTS.map((ep, i) => (
              <div
                key={`${ep.method}-${ep.path}`}
                className={`flex flex-wrap items-center gap-4 px-5 py-4 ${i < ENDPOINTS.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}
              >
                <span className={`flex-shrink-0 rounded-md px-2.5 py-1 text-xs font-bold font-mono w-14 text-center ${ep.color}`}>
                  {ep.method}
                </span>
                <code className="flex-shrink-0 text-sm font-mono text-gray-800">{ep.path}</code>
                <p className="text-sm text-gray-500 hidden md:block">{ep.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>Example Request</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <Terminal className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">GET /api/events</span>
            </div>
            <div className="bg-gray-900 px-5 py-4 space-y-1">
              <code className="block text-xs font-mono text-green-400">
                {"fetch('https://ghanasevent.com/api/events?region=Greater+Accra&category=music')"}
              </code>
              <code className="block text-xs font-mono text-gray-300">{"  .then(res => res.json())"}</code>
              <code className="block text-xs font-mono text-gray-300">{"  .then(data => console.log(data.events))"}</code>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-xs font-medium text-gray-500">Response</span>
            </div>
            <div className="bg-gray-900 px-5 py-4">
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto">{`{
  "events": [
    {
      "id": "uuid",
      "slug": "accra-music-festival-2026",
      "title": "Accra Music Festival 2026",
      "start_date": "2026-08-15T18:00:00Z",
      "venue_name": "Accra Sports Stadium",
      "city": "Accra",
      "region": "Greater Accra",
      "is_free": false,
      "ticket_types": [{ "price": 50 }]
    }
  ],
  "total": 24,
  "page": 1,
  "totalPages": 2
}`}</pre>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C9973A]/20 bg-[#C9973A]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C9973A]/10">
              <BookOpen className="h-5 w-5 text-[#C9973A]" />
            </div>
            <div>
              <p className="mb-1 font-semibold text-gray-900">Need API access?</p>
              <p className="mb-3 text-sm text-gray-500">The API is currently in private beta. Contact us to request access.</p>
              <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9973A] hover:underline">
                Get in touch <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
    </SiteShell>
  )
}