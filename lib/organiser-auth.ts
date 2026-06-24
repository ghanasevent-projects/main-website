import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireOrganiserPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'organiser' && profile?.role !== 'admin') {
    redirect('/')
  }

  return { user, profile, supabase }
}
