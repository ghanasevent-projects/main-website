import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms for using GhanasEvent services.',
}

export default function TermsPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Terms of Service
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            These Terms govern your use of GhanasEvent websites, applications, and related services.
            By accessing or using our services, you agree to these Terms and applicable laws.
          </p>

          <h2 className="mt-8 text-xl font-bold text-gray-900">1. Eligibility and accounts</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            You must provide accurate information when creating an account. You are responsible for keeping
            credentials secure and for activity under your account.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">2. Organiser responsibilities</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Organisers are responsible for event content, ticket terms, schedule accuracy, venue permissions,
            and legal compliance. Organisers must honor ticket commitments and communicate material changes promptly.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">3. Attendee responsibilities</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Attendees should review event details, pricing, refund rules, and entry requirements before purchase.
            Tickets may not be transferable unless the event policy allows it.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">4. Payments and fees</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Payments are processed by approved providers. Service fees, taxes, and payout timelines may vary by event,
            product, or payment method.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">5. Acceptable use</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            You agree not to use GhanasEvent for illegal, fraudulent, deceptive, harmful, or abusive activity.
            Prohibited behavior includes spam, impersonation, scraping in violation of policy, and interference with platform security.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">6. Content and intellectual property</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            You retain rights to your content. By posting on GhanasEvent, you grant us a limited license to host,
            display, and distribute content for operating and promoting the service.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">7. Suspension and termination</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We may suspend or terminate accounts that violate these Terms, applicable law, or platform safety requirements.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">8. Disclaimers and liability</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Services are provided on an "as is" basis. To the extent permitted by law, GhanasEvent disclaims implied warranties
            and limits liability for indirect or consequential losses.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">9. Changes to these Terms</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We may update these Terms. Continued use after updates means you accept the revised Terms.
          </p>
          <p className="mt-8 text-xs text-gray-500">Last updated: June 21, 2026</p>
        </div>
      </main>
    </SiteShell>
  )
}
