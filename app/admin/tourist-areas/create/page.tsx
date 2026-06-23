import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import CreateTouristAreaForm from '@/components/admin/CreateTouristAreaForm'
import { requireAdminPage } from '@/lib/admin-auth'

export const metadata = { title: 'Add tourist area' }

export default async function AdminCreateTouristAreaPage() {
  await requireAdminPage()

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <AdminNav current="/admin/tourist-areas" />

          <Link href="/admin/tourist-areas"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[#C9973A]">
            <ArrowLeft className="h-4 w-4" />
            Back to tourist areas
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
              Add tourist area
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Pin the location on the map so visitors can get directions.
            </p>
          </div>

          <CreateTouristAreaForm />
        </div>
      </main>
    </SiteShell>
  )
}
