import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'
import EventCard from '@/components/events/EventCard'

export const metadata = { title: 'Saved events' }

export default async function SavedEventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/saved')

  const { data: saved } = await supabase
    .from('saved_events')
    .select(`
      event_id,
      event:events(
        id, slug, title,
        venue_name, city, region,
        start_date, banner_url, is_free,
        category:categories(name, slug),
        ticket_types(price)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const events = (saved ?? [])
    .map(row => {
      const ev = row.event
      return Array.isArray(ev) ? ev[0] : ev
    })
    .filter(Boolean)

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </div>
            <div>
              <h1
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Saved events
              </h1>
              <p className="text-sm text-gray-500">
                {events.length} event{events.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-800 mb-1">No saved events yet</p>
              <p className="text-sm text-gray-400 mb-5">
                Tap the heart on any event to save it for later
              </p>
              <Link
                href="/events"
                className="rounded-full bg-[#C9973A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b8852e] transition"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAuthed
                  isSaved
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  )
}
