import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import CreateHotelForm from '@/components/admin/CreateHotelForm'
import { requireAdminPage } from '@/lib/admin-auth'

export const metadata = { title: 'Add hotel' }

export default async function AdminCreateHotelPage() {
  await requireAdminPage()

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <AdminNav current="/admin/hotels" />

          <Link href="/admin/hotels"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[#C9973A]">
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
              Add hotel or lodge
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              New listings appear on the public hotels page once saved.
            </p>
          </div>

          <CreateHotelForm />
        </div>
      </main>
    </SiteShell>
  )
}
