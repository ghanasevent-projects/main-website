import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import CreateTouristAreaForm from '@/components/admin/CreateTouristAreaForm'
import { requireAdminPage } from '@/lib/admin-auth'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { admin } = await requireAdminPage()
  const { data } = await admin.from('tourist_areas').select('name').eq('id', id).single()
  return { title: data ? `Edit ${data.name}` : 'Edit tourist area' }
}

export default async function AdminEditTouristAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { admin } = await requireAdminPage()

  const { data: area } = await admin.from('tourist_areas').select('*').eq('id', id).single()
  if (!area) notFound()

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
              Edit tourist area
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update {area.name}. Changes appear on the public listing once saved.
            </p>
          </div>

          <CreateTouristAreaForm area={area} />
        </div>
      </main>
    </SiteShell>
  )
}
