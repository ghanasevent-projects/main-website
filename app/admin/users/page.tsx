import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Users } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdminPage } from '@/lib/admin-auth'

export const metadata = { title: 'Manage users' }

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  organiser: 'bg-[#C9973A]/10 text-[#C9973A] border-[#C9973A]/20',
  attendee: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default async function AdminUsersPage() {
  const { admin } = await requireAdminPage()

  const { data: users } = await admin
    .from('profiles')
    .select('id, name, email, role, avatar_url, created_at')
    .order('created_at', { ascending: false })

  const roleCounts = {
    admin: users?.filter(u => u.role === 'admin').length ?? 0,
    organiser: users?.filter(u => u.role === 'organiser').length ?? 0,
    attendee: users?.filter(u => u.role === 'attendee').length ?? 0,
  }

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AdminNav current="/admin/users" />

          <div className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#C9973A]" />
              <h1
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Users
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              {users?.length ?? 0} accounts · {roleCounts.admin} admin · {roleCounts.organiser} organisers · {roleCounts.attendee} attendees
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {!users || users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatar_url ? (
                              <Image
                                src={u.avatar_url}
                                alt={u.name ?? 'User'}
                                width={36}
                                height={36}
                                referrerPolicy="no-referrer"
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9973A]/10 text-xs font-bold text-[#C9973A]">
                                {(u.name ?? 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <p className="font-medium text-gray-900">{u.name ?? 'Unnamed user'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{u.email ?? '—'}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px]
                                        font-semibold capitalize ${ROLE_STYLES[u.role ?? 'attendee'] ?? ROLE_STYLES.attendee}`}
                          >
                            {u.role ?? 'attendee'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                          {u.created_at
                            ? format(new Date(u.created_at), 'MMM d, yyyy')
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/u/${u.id}`}
                            className="text-xs font-medium text-[#C9973A] hover:underline"
                          >
                            View profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            To promote a user to admin, update their role in Supabase → Table Editor → profiles.
          </p>
        </div>
      </main>
    </SiteShell>
  )
}
