import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Refund Policy',
  description: 'Refund and cancellation policy for tickets on GhanasEvent.',
}

export default function RefundsPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Refund Policy
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            This Refund Policy explains when ticket buyers may request refunds and how refund requests are handled.
            Organiser rules apply, but all policies must comply with applicable law.
          </p>

          <h2 className="mt-8 text-xl font-bold text-gray-900">1. Eligible refund situations</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>Event is cancelled and not rescheduled.</li>
            <li>Event date or venue changes materially and you cannot attend.</li>
            <li>You were charged more than once for the same order.</li>
            <li>There is a verifiable technical issue resulting in incorrect charge.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">2. Non-refundable situations</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
            <li>Change of mind after purchase where event terms state no refunds.</li>
            <li>Missed attendance due to personal scheduling conflicts.</li>
            <li>Requests made outside organiser or platform timelines without legal basis.</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold text-gray-900">3. Request timelines</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Unless event terms state otherwise, submit requests within 7 days after the event date.
            For duplicate charges, contact support as soon as possible.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">4. How to request a refund</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Send your request through support with ticket reference, event title, purchase email,
            and a short reason. Supporting screenshots may help resolve requests faster.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">5. Processing time</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Approved refunds are typically processed within 5 to 10 business days, depending on payment provider timelines.
          </p>

          <h2 className="mt-6 text-xl font-bold text-gray-900">6. Organiser-specific policies</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Some events may have additional terms displayed on the event page. Where there is a conflict,
            legal requirements and platform safety standards prevail.
          </p>
          <p className="mt-8 text-xs text-gray-500">Last updated: June 21, 2026</p>
        </div>
      </main>
    </SiteShell>
  )
}
