import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import DeveloperFontScope from '@/components/developer/DeveloperFontScope'
import DeveloperDocsLayout, {
  type DocsNavGroup,
} from '@/components/developer/DeveloperDocsLayout'
import { ICON_STROKE_WIDTH } from '@/lib/icons'

export const metadata = {
  title: 'Platform Development',
  description:
    'GhanasEvent is designed and built by Celestial Web Solutions — a custom web development agency based in Ghana.',
}

const BREADCRUMBS = [
  { label: 'Platform', href: '/developer' },
  { label: 'Getting Started', href: '/developer' },
  { label: 'Celestial Web Solutions' },
]

const SIDEBAR_NAV: DocsNavGroup[] = [
  {
    label: 'Getting started',
    items: [
      { id: 'introduction', label: 'Introduction', icon: 'book-open' },
      { id: 'about-the-build', label: 'About the build', icon: 'hammer' },
      { id: 'architecture', label: 'Architecture', icon: 'layers' },
    ],
  },
  {
    label: 'The platform',
    items: [
      { id: 'platform-overview', label: 'Platform overview', icon: 'layout-grid' },
      { id: 'platform-modules', label: 'Core modules', icon: 'boxes' },
      { id: 'ticketing-flow', label: 'Ticketing flow', icon: 'ticket' },
      { id: 'payments', label: 'Payments', icon: 'wallet' },
      { id: 'use-cases', label: 'Use cases', icon: 'users' },
      { id: 'design-principles', label: 'Design principles', icon: 'sparkles' },
      { id: 'built-for-ghana', label: 'Built for Ghana', icon: 'map-pin' },
    ],
  },
  {
    label: 'Celestial Web Solutions',
    items: [
      { id: 'about-agency', label: 'About the agency', icon: 'building' },
      { id: 'case-study', label: 'GhanasEvent case study', icon: 'file-text' },
      { id: 'services', label: 'Services', icon: 'briefcase' },
      { id: 'process', label: 'Our process', icon: 'list-ordered' },
      { id: 'support', label: 'Support & maintenance', icon: 'shield-check' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'faq', label: 'FAQ', icon: 'circle-help' },
      { id: 'contact', label: 'Contact', icon: 'mail' },
    ],
  },
]

const PLATFORM_MODULES = [
  ['Event discovery', 'Browse by category, city, region, and interest.'],
  ['Ticketing & checkout', 'Free and paid tickets with secure Paystack checkout.'],
  ['Gate check-in', 'Unique QR codes validated fast at the door.'],
  ['Organiser workspace', 'Publish events, manage tickets, and track sales.'],
  ['Payments & sales', 'MoMo, cards, and webhook-backed fulfilment.'],
  ['Hotels & destinations', 'Help attendees plan stays around events.'],
  ['Accounts & social', 'Profiles, saved events, and organiser following.'],
  ['Admin & moderation', 'Oversight for events, users, and listings.'],
]

const USE_CASES = [
  ['Churches & conventions', 'Clear registration and dependable entry for large gatherings.'],
  ['Concerts & festivals', 'High-demand ticket drops and fast QR validation at the gate.'],
  ['Schools & SRC weeks', 'Multiple sub-events with simple publishing tools.'],
  ['NGOs & community groups', 'Free registrations and trustworthy public pages.'],
]

const USER_ROLES = [
  ['Attendees', 'Discover events, save favourites, purchase tickets, and access QR codes on any device.'],
  ['Organisers', 'Create listings, configure ticket types, track sales, and manage check-in on event day.'],
  ['Administrators', 'Moderate listings, manage users, and oversee hotels and destination content.'],
]

const TICKETING_STEPS = [
  {
    title: 'Browse & select',
    text: 'Attendees find an event, choose a ticket type, and review pricing before checkout.',
  },
  {
    title: 'Pay securely',
    text: 'Checkout runs through Paystack — supporting mobile money, cards, and local payment methods.',
  },
  {
    title: 'Receive QR ticket',
    text: 'A unique QR code is issued instantly and delivered by email for quick access at the venue.',
  },
  {
    title: 'Gate validation',
    text: 'Organisers scan each code once at entry — reducing fraud and keeping queues moving.',
  },
]

const PAYMENT_FEATURES = [
  ['Paystack integration', 'Secure checkout with webhook-backed order fulfilment.'],
  ['Mobile money', 'Supports how most Ghanaian attendees prefer to pay.'],
  ['Free registrations', 'Zero-cost tickets without forcing users through payment flows.'],
  ['Sales reporting', 'Organisers see real-time purchase data in their dashboard.'],
]

const DESIGN_PRINCIPLES = [
  ['Mobile-first', 'Layouts, touch targets, and checkout flows optimised for phones.'],
  ['Clarity over clutter', 'Information hierarchy that works in busy, on-the-go contexts.'],
  ['Fast on slow networks', 'Light pages, optimised images, and minimal friction at every step.'],
  ['Accessible by default', 'Readable type, strong contrast, and keyboard-friendly patterns.'],
]

const GHANA_FEATURES = [
  ['All 16 regions', 'Discovery and filtering across every region in Ghana.'],
  ['Local payment rails', 'MoMo and card checkout through Paystack.'],
  ['City & venue context', 'Hotels, tourist areas, and location-aware event browsing.'],
  ['Locally operated', 'Built and maintained by a Ghana-based development team.'],
]

const CASE_STUDY_MILESTONES = [
  ['Discovery layer', 'Category, city, and interest-based browsing with SEO-friendly event pages.'],
  ['Transaction layer', 'Ticketing, Paystack checkout, and automated QR delivery.'],
  ['Operations layer', 'Organiser dashboards, admin moderation, and gate check-in tools.'],
  ['Growth layer', 'Hotels, destinations, profiles, and social features to keep users returning.'],
]

const SERVICES = [
  {
    title: 'Marketing websites',
    text: 'Brand-led sites with fast load times, strong SEO, and content your team can maintain.',
    image:
      'https://images.unsplash.com/photo-1557186817-c11ad50d5b41?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Marketing website on a laptop',
  },
  {
    title: 'Web applications',
    text: 'Dashboards, booking systems, member portals, and internal tools.',
    image:
      'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Analytics dashboard',
  },
  {
    title: 'E-commerce & payments',
    text: 'Online stores with inventory, orders, and payment integrations.',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85',
    alt: 'E-commerce checkout',
  },
  {
    title: 'Platform products',
    text: 'Multi-sided products like GhanasEvent — discovery, accounts, admin, and transactions.',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    alt: 'Team building a platform',
  },
]

const PROCESS_STEPS = [
  {
    title: 'Discovery & scoping',
    text: 'Map your audience, workflows, and goals — then define scope, priorities, and timeline.',
  },
  {
    title: 'UX & interface design',
    text: 'Wireframes and visual direction built for clarity on mobile, where most users browse and buy.',
  },
  {
    title: 'Engineering & integration',
    text: 'Custom development with auth, payments, email, and the services your product depends on.',
  },
  {
    title: 'Launch & iteration',
    text: 'Structured releases, real-world feedback, and ongoing refinement after go-live.',
  },
]

const FAQS = [
  {
    q: 'Who built GhanasEvent?',
    a: 'GhanasEvent was designed and developed by Celestial Web Solutions, based in Keta, Volta Region, with operations in Accra.',
  },
  {
    q: 'Does Celestial Web Solutions only build event platforms?',
    a: 'No. GhanasEvent is our flagship platform work, but we also build marketing sites, e-commerce stores, dashboards, and bespoke web applications.',
  },
  {
    q: 'Can you build something similar for my organisation?',
    a: 'Yes — booking systems, membership portals, marketplaces, or industry-specific platforms scoped to your requirements.',
  },
  {
    q: 'Do you work with clients outside Ghana?',
    a: 'Yes. We serve organisations locally and internationally with remote collaboration and clear communication.',
  },
  {
    q: 'What makes GhanasEvent different from a template?',
    a: 'Discovery, accounts, organiser tools, payments, tickets, admin, and destinations work as one connected system.',
  },
  {
    q: 'How do I start a project?',
    a: 'Visit celestialwebsolutions.net, share your goals and timeline, and we will follow up with a discovery call and proposal.',
  },
  {
    q: 'Does Celestial Web Solutions provide ongoing support?',
    a: 'Yes. We offer post-launch maintenance, monitoring, and iterative improvements so your product stays reliable as usage grows.',
  },
  {
    q: 'Can GhanasEvent handle free and paid events?',
    a: 'Yes. Organisers can publish free registrations or paid tickets with secure Paystack checkout and instant QR delivery.',
  },
]

function DocHeading({
  id,
  level = 2,
  children,
}: {
  id: string
  level?: 2 | 3
  children: React.ReactNode
}) {
  const Tag = level === 2 ? 'h2' : 'h3'
  const className =
    level === 2
      ? 'scroll-mt-28 mt-14 border-b border-gray-100 pb-4 text-xl font-semibold text-gray-900 sm:text-2xl'
      : 'scroll-mt-28 mt-10 text-base font-semibold text-gray-900 sm:text-lg'

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}

export default function DevelopersPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#fafafa]">
        <DeveloperFontScope>
          <DeveloperDocsLayout breadcrumbs={BREADCRUMBS} nav={SIDEBAR_NAV}>
          <article className="prose prose-gray prose-lg max-w-none prose-a:text-gold prose-a:no-underline hover:prose-a:underline [&_li]:my-1.5 [&_p]:mb-5 [&_p]:leading-relaxed [&_p]:text-[15px] [&_p]:text-gray-600 [&_ul]:my-6">
            <h1 className="mb-6 text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-[2rem]">
              Built by Celestial Web Solutions
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-600">
              GhanasEvent is designed and engineered by{' '}
              <a
                href="https://celestialwebsolutions.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-gold"
              >
                Celestial Web Solutions
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={ICON_STROKE_WIDTH} />
              </a>
              — a custom web development agency helping businesses, churches, NGOs, and institutions
              across Ghana build a stronger presence online.
            </p>

            <DocHeading id="introduction">Introduction</DocHeading>
            <p>
              This page documents who built GhanasEvent, what the platform includes, and how
              Celestial Web Solutions works with organisations that need custom websites and web
              products.
            </p>
            <p>
              The platform is practical for everyday users, dependable on event day, and built to
              grow with the communities it serves — from concerts and church conventions to campus
              programmes and community meetups.
            </p>

            <div className="not-prose my-10 overflow-hidden rounded-lg border border-gray-200">
              <div className="relative aspect-[2/1] max-h-72">
                <Image
                  src="/hero/music-festival.webp"
                  alt="Live event audience in Ghana"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                />
              </div>
            </div>

            <div className="not-prose my-10 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Metric</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {[
                    ['Regions supported', '16 regions across Ghana'],
                    ['Platform scope', 'Full-stack — discovery, ticketing, admin'],
                    ['Design approach', 'Mobile-first'],
                    ['Engineering', 'Ghana-built, locally operated'],
                  ].map(([metric, detail]) => (
                    <tr key={metric}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{metric}</td>
                      <td className="px-5 py-3.5 text-gray-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DocHeading id="about-the-build">About the build</DocHeading>
            <p>
              GhanasEvent is a full-stack event platform — not a single landing page. It connects
              public discovery, secure checkout, QR ticket delivery, organiser tooling, and admin
              moderation in one product.
            </p>
            <ul>
              <li>Public discovery across categories, cities, and regions</li>
              <li>Secure checkout and QR ticket delivery</li>
              <li>Organiser dashboards and admin tooling</li>
              <li>Hotels, destinations, and venue discovery</li>
              <li>Role-based flows for attendees, organisers, and admins</li>
            </ul>

            <DocHeading id="architecture">Architecture</DocHeading>
            <p>
              GhanasEvent is structured around three user roles. Each has dedicated flows, but all
              share the same underlying data — events, tickets, payments, and profiles stay in sync
              across the platform.
            </p>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Role</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Capabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {USER_ROLES.map(([role, desc]) => (
                    <tr key={role}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{role}</td>
                      <td className="px-5 py-3.5 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Public pages handle discovery and checkout. Organiser and admin areas are protected by
              role-based access, keeping sensitive operations separate from the open web.
            </p>

            <DocHeading id="platform-overview">Platform overview</DocHeading>
            <p>
              The platform serves three audiences: attendees discovering and buying tickets,
              organisers publishing and managing events, and administrators overseeing listings
              and users.
            </p>
            <p>
              Most users browse and purchase on mobile. Navigation, search, checkout, and ticket
              access were prioritised for small screens, slower connections, and one-handed use at
              busy venues.
            </p>

            <DocHeading id="platform-modules">Core modules</DocHeading>
            <p>
              These are the main modules Celestial Web Solutions designed and shipped as part of
              GhanasEvent:
            </p>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Module</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {PLATFORM_MODULES.map(([name, desc]) => (
                    <tr key={name}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{name}</td>
                      <td className="px-5 py-3.5 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DocHeading id="ticketing-flow">Ticketing flow</DocHeading>
            <p>
              From first click to gate entry, the ticketing journey is designed to be simple for
              attendees and dependable for organisers — especially during high-traffic on-sales.
            </p>
            <ol className="not-prose my-8 list-none space-y-8 p-0">
              {TICKETING_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <DocHeading id="payments">Payments</DocHeading>
            <p>
              Payments are a core part of the platform — not an afterthought. Celestial Web Solutions
              integrated Paystack so organisers can accept local payment methods with automated
              fulfilment and reliable webhook handling.
            </p>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Feature</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {PAYMENT_FEATURES.map(([feature, detail]) => (
                    <tr key={feature}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{feature}</td>
                      <td className="px-5 py-3.5 text-gray-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DocHeading id="use-cases">Use cases</DocHeading>
            <p>
              GhanasEvent supports organisers running different kinds of experiences. All share the
              same need for clear information, trusted ticketing, and calm operations on the day.
            </p>
            <div className="not-prose my-10 grid gap-5 sm:grid-cols-3">
              {[
                { src: '/hero/music-festival.webp', alt: 'Concert crowd', cap: 'Concerts' },
                { src: '/hero/tarkwa-crusade.jpg', alt: 'Church gathering', cap: 'Faith events' },
                { src: '/hero/kpasec.jpg', alt: 'Campus audience', cap: 'Campus' },
              ].map(photo => (
                <figure key={photo.cap} className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative aspect-[4/3]">
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="33vw" />
                  </div>
                  <figcaption className="border-t border-gray-100 px-4 py-2.5 text-xs font-medium text-gray-700">
                    {photo.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="not-prose overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-gray-100 bg-white">
                  {USE_CASES.map(([title, text]) => (
                    <tr key={title}>
                      <td className="w-2/5 px-5 py-4 font-medium text-gray-900">{title}</td>
                      <td className="px-5 py-4 text-gray-600">{text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DocHeading id="design-principles">Design principles</DocHeading>
            <p>
              Every screen on GhanasEvent follows a consistent set of design principles. These guide
              how Celestial Web Solutions approaches layout, interaction, and performance across the
              product.
            </p>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-gray-100 bg-white">
                  {DESIGN_PRINCIPLES.map(([principle, detail]) => (
                    <tr key={principle}>
                      <td className="w-2/5 px-5 py-4 font-medium text-gray-900">{principle}</td>
                      <td className="px-5 py-4 text-gray-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DocHeading id="built-for-ghana">Built for Ghana</DocHeading>
            <p>
              GhanasEvent is not a generic template adapted for Ghana — it was designed from the
              ground up for how events, payments, and discovery work in this market.
            </p>
            <ul>
              <li>Region and city filters covering all 16 regions</li>
              <li>Paystack checkout with mobile money support</li>
              <li>Hotels and tourist areas to help visitors plan around events</li>
              <li>Local team for support, iteration, and on-the-ground understanding</li>
            </ul>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Area</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">How we localised it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {GHANA_FEATURES.map(([area, detail]) => (
                    <tr key={area}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{area}</td>
                      <td className="px-5 py-3.5 text-gray-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="not-prose my-10 grid gap-5 sm:grid-cols-2">
              {[
                {
                  src: 'https://images.pexels.com/photos/20131678/pexels-photo-20131678.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop',
                  alt: 'Accra skyline',
                  cap: 'Accra',
                },
                {
                  src: 'https://images.pexels.com/photos/20431293/pexels-photo-20431293.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop',
                  alt: 'Kumasi city',
                  cap: 'Kumasi',
                },
              ].map(city => (
                <figure key={city.cap} className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative aspect-[16/10]">
                    <Image src={city.src} alt={city.alt} fill className="object-cover" sizes="50vw" />
                  </div>
                  <figcaption className="border-t border-gray-100 px-4 py-2.5 text-xs font-medium text-gray-700">
                    {city.cap}
                  </figcaption>
                </figure>
              ))}
            </div>

            <DocHeading id="about-agency">About the agency</DocHeading>
            <p>
              Celestial Web Solutions is a custom web development agency based in{' '}
              <strong>Keta, Volta Region</strong>, with operations in <strong>Accra</strong>. We
              partner with organisations that need more than a brochure site — modern, custom-coded
              websites and platforms tailored to each client&apos;s goals, locally in Ghana and
              internationally.
            </p>
            <p>
              GhanasEvent represents the kind of product we build end-to-end: strategy, design,
              engineering, and launch support for mission-critical digital experiences.
            </p>
            <h3 className="mt-10 scroll-mt-28 text-base font-semibold text-gray-900 sm:text-lg">
              Who we serve
            </h3>
            <ul>
              <li>Small and medium businesses</li>
              <li>Churches and faith organisations</li>
              <li>NGOs and community groups</li>
              <li>Schools and educational institutions</li>
              <li>E-commerce and service brands</li>
            </ul>
            <h3 className="mt-10 scroll-mt-28 text-base font-semibold text-gray-900 sm:text-lg">
              How we work
            </h3>
            <ul>
              <li>
                <strong>Partnership over handoff</strong> — we stay close after launch.
              </li>
              <li>
                <strong>Mobile reality first</strong> — design for how Ghanaian users actually browse.
              </li>
              <li>
                <strong>Custom, not cookie-cutter</strong> — purpose-built products, not templates.
              </li>
            </ul>

            <DocHeading id="case-study">GhanasEvent case study</DocHeading>
            <p>
              GhanasEvent is Celestial Web Solutions&apos; flagship platform — a full product
              engagement from initial concept through design, engineering, launch, and ongoing
              iteration. It demonstrates how we build multi-sided platforms for real-world use.
            </p>
            <p>
              The project required connecting discovery, commerce, operations, and content in one
              cohesive system — not a collection of disconnected tools.
            </p>
            <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">Layer</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-900">What we shipped</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {CASE_STUDY_MILESTONES.map(([layer, detail]) => (
                    <tr key={layer}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{layer}</td>
                      <td className="px-5 py-3.5 text-gray-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Need something similar for your organisation?{' '}
              <a href="https://celestialwebsolutions.net" target="_blank" rel="noopener noreferrer">
                Talk to Celestial Web Solutions
              </a>{' '}
              about scoping a platform for your audience.
            </p>

            <DocHeading id="services">Services</DocHeading>
            <p>
              GhanasEvent is one example of our platform work. Celestial Web Solutions also delivers:
            </p>
            <div className="not-prose space-y-10">
              {SERVICES.map((service, index) => (
                <div key={service.title} className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative aspect-[21/9] max-h-48">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover"
                      sizes="720px"
                    />
                  </div>
                  <div className="border-t border-gray-100 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">{service.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <DocHeading id="process">Our process</DocHeading>
            <p>
              Every engagement follows a structured path so clients know what to expect — and the
              final product reflects real user needs, not assumptions.
            </p>
            <ol className="not-prose my-8 list-none space-y-8 p-0">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <DocHeading id="support">Support & maintenance</DocHeading>
            <p>
              Launch is not the finish line. Celestial Web Solutions provides ongoing support so
              platforms like GhanasEvent stay secure, performant, and aligned with user needs as
              they scale.
            </p>
            <ul>
              <li>Bug fixes and priority patches after go-live</li>
              <li>Performance monitoring and optimisation as traffic grows</li>
              <li>Feature iterations based on organiser and attendee feedback</li>
              <li>Security updates and dependency maintenance</li>
              <li>Content and listing support for admin-managed areas</li>
            </ul>
            <div className="not-prose my-8 rounded-lg border border-gray-200 bg-white p-5">
              <p className="text-sm font-semibold text-gray-900">Typical support scope</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Most clients start with a launch window of intensive support, then move to a
                monthly retainer for maintenance and planned improvements. Scope is agreed upfront
                so you know exactly what is covered.
              </p>
            </div>

            <DocHeading id="faq">FAQ</DocHeading>
            <div className="not-prose space-y-3">
              {FAQS.map(faq => (
                <details
                  key={faq.q}
                  className="group rounded-lg border border-gray-200 bg-white px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-gray-900 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-gray-400 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>

            <DocHeading id="contact">Contact</DocHeading>
            <p>
              Ready to start a project or learn more about GhanasEvent? Reach out through either
              channel below.
            </p>
            <div className="not-prose mt-10 flex flex-wrap gap-4">
              <a
                href="https://celestialwebsolutions.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-dark"
              >
                Visit Celestial Web Solutions
                <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE_WIDTH} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Contact GhanasEvent
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                About GhanasEvent
              </Link>
            </div>
          </article>
          </DeveloperDocsLayout>
        </DeveloperFontScope>
      </main>
    </SiteShell>
  )
}
