import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import CreateHotelForm from '@/components/admin/CreateHotelForm'
import { requireAdminPage } from '@/lib/admin-auth'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { admin } = await requireAdminPage()
  const { data } = await admin.from('hotels').select('name').eq('id', id).single()
  return { title: data ? `Edit ${data.name}` : 'Edit hotel' }
}

export default async function AdminEditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { admin } = await requireAdminPage()

  const { data: hotel } = await admin.from('hotels').select('*').eq('id', id).single()
  if (!hotel) notFound()

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
              Edit hotel
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update {hotel.name}. Changes appear on the public listing once saved.
            </p>
          </div>

          <CreateHotelForm hotel={hotel} />
        </div>
      </main>
    </SiteShell>
  )
}
