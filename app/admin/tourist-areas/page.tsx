import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import AdminToggleActive from '@/components/admin/AdminToggleActive'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'

export const metadata = { title: 'Manage tourist areas' }

const CATEGORY_LABELS: Record<string, string> = {
  beach: 'Beach',
  historical: 'Historical',
  nature: 'Nature',
  market: 'Market',
}

export default async function AdminTouristAreasPage() {
  const { admin } = await requireAdminPage()

  const { data: areas } = await admin
    .from('tourist_areas')
    .select('*')
    .order('name')

  const activeCount = areas?.filter(a => a.is_active).length ?? 0

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/tourist-areas" />

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#C9973A]" />
                <h1
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  Tourist areas
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {areas?.length ?? 0} total · {activeCount} active on site
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/tourist-areas/create"
                className="rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-white
                           transition hover:bg-[#A87A28]"
              >
                Add area
              </Link>
              <Link
                href="/tourist-areas"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium
                           text-gray-700 transition hover:border-[#C9973A]/50 hover:text-[#C9973A]"
              >
                View public page
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {!areas || areas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MapPin className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">No tourist areas listed yet</p>
                <p className="mt-1 text-xs text-gray-400">Add your first attraction using the button above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Attraction</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Entry fee</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Visibility</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {areas.map(area => (
                      <tr key={area.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {area.image_url && (
                                <Image
                                  src={area.image_url}
                                  alt={area.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <p className="max-w-48 truncate font-medium text-gray-900">{area.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {area.city ? `${area.city}, ` : ''}{area.region}
                        </td>
                        <td className="px-6 py-4 text-xs capitalize text-gray-600">
                          {area.category
                            ? CATEGORY_LABELS[area.category] ?? area.category
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {area.entry_fee ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          <AdminToggleActive
                            id={area.id}
                            isActive={area.is_active ?? false}
                            kind="tourist_area"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/tourist-areas/${area.id}/edit`}
                            className="text-xs font-semibold text-[#C9973A] transition hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
