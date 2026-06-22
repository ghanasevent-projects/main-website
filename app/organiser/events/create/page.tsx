import SiteShell from '@/components/layout/SiteShell'
import EventForm from '@/components/organiser/EventForm'
import OrganiserNav from '@/components/organiser/OrganiserNav'
import { organiserDetailsFromProfile } from '@/lib/organiser-details'
import { requireOrganiserPage } from '@/lib/organiser-auth'

export const metadata = { title: 'Create event' }

export default async function CreateEventPage() {
  const { user, supabase } = await requireOrganiserPage()

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      role, name, phone, whatsapp, website, bio, city, region,
      instagram_url, facebook_url, twitter_url, linkedin_url
    `)
    .eq('id', user.id)
    .single()

  const organiserDetails = organiserDetailsFromProfile(
    profile as Record<string, unknown> | null,
    user.user_metadata ?? {},
  )

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <OrganiserNav current="/organiser/events/create" />

          <div className="mb-6">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
            >
              Create event
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below. Your event goes live after admin review.
            </p>
          </div>

          <EventForm
            userId={user.id}
            categories={categories ?? []}
            mode="create"
            organiserDetails={organiserDetails}
          />
        </div>
      </main>
    </SiteShell>
  )
}
