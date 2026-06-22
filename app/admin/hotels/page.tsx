import Link from 'next/link'
import Image from 'next/image'
import { Hotel } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import AdminToggleActive from '@/components/admin/AdminToggleActive'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'

export const metadata = { title: 'Manage hotels' }

const PRICE_LABELS: Record<string, string> = {
  budget: 'Budget',
  'mid-range': 'Mid-range',
  luxury: 'Luxury',
}

export default async function AdminHotelsPage() {
  const { admin } = await requireAdminPage()

  const { data: hotels } = await admin
    .from('hotels')
    .select('*')
    .order('name')

  const activeCount = hotels?.filter(h => h.is_active).length ?? 0

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/hotels" />

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Hotel className="h-5 w-5 text-[#C9973A]" />
                <h1
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                >
                  Hotels & lodges
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {hotels?.length ?? 0} total · {activeCount} active on site
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/hotels/create"
                className="rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-white
                           transition hover:bg-[#A87A28]"
              >
                Add hotel
              </Link>
              <Link
                href="/hotels"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium
                           text-gray-700 transition hover:border-[#C9973A]/50 hover:text-[#C9973A]"
              >
                View public page
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {!hotels || hotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Hotel className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">No hotels listed yet</p>
                <p className="mt-1 text-xs text-gray-400">Add your first hotel using the button above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Property</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Visibility</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {hotels.map(hotel => (
                      <tr key={hotel.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {hotel.image_url && (
                                <Image
                                  src={hotel.image_url}
                                  alt={hotel.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <p className="max-w-48 truncate font-medium text-gray-900">{hotel.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {hotel.city}, {hotel.region}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {hotel.price_range
                            ? PRICE_LABELS[hotel.price_range] ?? hotel.price_range
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {hotel.phone ?? hotel.website ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          <AdminToggleActive
                            id={hotel.id}
                            isActive={hotel.is_active ?? false}
                            kind="hotel"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/hotels/${hotel.id}/edit`}
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
