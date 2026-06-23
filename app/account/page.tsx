import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SiteShell from '@/components/layout/SiteShell'
import ProfileForm from '@/components/account/ProfileForm'

export const metadata = {
  title: 'Account settings',
}

function pick(
  profile: Record<string, unknown> | null,
  meta: Record<string, unknown>,
  key: string,
  metaKey?: string,
): string {
  const fromProfile = profile?.[key]
  if (typeof fromProfile === 'string' && fromProfile) return fromProfile
  const fromMeta = meta[metaKey ?? key]
  return typeof fromMeta === 'string' ? fromMeta : ''
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const meta = user.user_metadata ?? {}
  const p = profile as Record<string, unknown> | null

  const initial = {
    userId: user.id,
    email: user.email ?? '',
    name: (profile?.name as string | undefined) ?? (meta.name as string | undefined) ?? '',
    role: (profile?.role as string | undefined) ?? 'attendee',
    avatarUrl:
      (profile?.avatar_url as string | undefined) ??
      (meta.avatar_url as string | undefined) ??
      (meta.picture as string | undefined) ??
      null,
    phone: pick(p, meta, 'phone', 'phone_number'),
    whatsapp: pick(p, meta, 'whatsapp'),
    city: pick(p, meta, 'city'),
    region: pick(p, meta, 'region'),
    website: pick(p, meta, 'website'),
    bio: pick(p, meta, 'bio'),
    instagramUrl: pick(p, meta, 'instagram_url'),
    facebookUrl: pick(p, meta, 'facebook_url'),
    twitterUrl: pick(p, meta, 'twitter_url'),
    linkedinUrl: pick(p, meta, 'linkedin_url'),
  }

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Account settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Update your profile, contact details, and social links
            </p>
          </div>

          <ProfileForm initial={initial} />
        </div>
      </main>
    </SiteShell>
  )
}
