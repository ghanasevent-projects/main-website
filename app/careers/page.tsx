import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Careers',
  description: 'Join the team building event discovery in Ghana.',
}

export default function CareersPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Careers
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            We are building the future of event discovery in Ghana. We welcome product, engineering, and growth talent.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Send your CV to careers@ghanasevent.com
          </p>
        </div>
      </main>
    </SiteShell>
  )
}
