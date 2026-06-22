import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How GhanasEvent collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Your trust matters to us. This Privacy Policy explains what information we collect, why we collect it,
            and the choices you have when using GhanasEvent. We only process data needed to run event discovery,
            ticketing, organiser tools, and customer support. We do not sell personal information.
          </p>

          <h2 className="mt-8 text-xl font-bold text-gray-900">1. Information we collect</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Depending on how you use GhanasEvent, we may collect:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>Account details such as name, email address, phone number, and profile preferences.</li>
            <li>Event and ticket activity such as saved events, purchases, attendance, and check-in status.</li>
            <li>Organiser information including payout and business details needed for ticket operations.</li>
            <li>Device and usage information such as browser type, IP address, and interaction logs.</li>
            <li>Payment references from processors like Paystack. We do not store full card numbers.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">2. How we use information</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We use information to provide and improve our services, including:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>Creating and managing user accounts.</li>
            <li>Processing ticket purchases, confirmations, and refunds.</li>
            <li>Helping organisers publish and manage events.</li>
            <li>Personalizing event recommendations and search relevance.</li>
            <li>Preventing fraud, abuse, and policy violations.</li>
            <li>Meeting legal, tax, and compliance obligations.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">3. How we share information</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We share data only when necessary:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>With organisers for tickets and event operations.</li>
            <li>With service providers that help us host, secure, and operate the platform.</li>
            <li>With payment providers to complete transactions.</li>
            <li>When required by law or to protect rights, safety, and platform integrity.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">4. Retention and security</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We retain data for as long as needed to provide services, resolve disputes, and meet legal obligations.
            We apply administrative, technical, and organizational controls to protect information, though no system is perfect.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">5. Your rights and choices</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            You may update profile information in your account settings and request access, correction, or deletion
            of eligible personal data by contacting support.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">6. Children&apos;s privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            GhanasEvent is not intended for children under 13. If you believe a child has provided personal information,
            contact us and we will review and remove data where appropriate.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">7. Policy updates</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We may update this policy from time to time. Material changes will be posted on this page with an updated date.
          </p>
          <p className="mt-8 text-xs text-gray-500">Last updated: June 21, 2026</p>
        </div>
      </main>
    </SiteShell>
  )
}
