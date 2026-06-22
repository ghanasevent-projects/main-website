import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Cookie Policy',
  description: 'How GhanasEvent uses cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Cookie Policy
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            This Cookie Policy explains how GhanasEvent uses cookies and similar technologies to keep our platform reliable,
            secure, and useful. Cookies are small text files stored on your device when you visit our site.
          </p>

          <h2 className="mt-8 text-xl font-bold text-gray-900">1. Types of cookies we use</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>Essential cookies for login sessions, security checks, and checkout flows.</li>
            <li>Preference cookies to remember settings like location, language, and display preferences.</li>
            <li>Analytics cookies to understand product usage and improve discovery and conversion.</li>
            <li>Performance cookies to monitor site speed, reliability, and error patterns.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">2. Why we use cookies</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Cookies help us keep users signed in, secure accounts, process transactions, reduce fraud,
            and improve event search and ticketing experiences.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">3. Cookie duration</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Some cookies are session cookies and expire when you close your browser. Others are persistent
            cookies that remain for a defined period so your preferences are remembered across visits.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">4. Third-party cookies</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Some trusted service providers may place cookies when they support payments, analytics,
            or security features on our behalf.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">5. Managing cookies</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            You can manage or delete cookies through browser settings. Blocking certain cookies may affect
            sign-in, purchase completion, and personalized features.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">6. Updates to this policy</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We may update this Cookie Policy to reflect product, legal, or operational changes.
            The latest version date will always be shown on this page.
          </p>
          <p className="mt-8 text-xs text-gray-500">Last updated: June 21, 2026</p>
        </div>
      </main>
    </SiteShell>
  )
}
