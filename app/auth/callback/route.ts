// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user role and redirect to correct dashboard
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Fallback: if the DB trigger didn't create a profile, create it
        // here from the sign-up / OAuth metadata so role-based routing works
        if (!profile) {
          const meta = user.user_metadata ?? {}
          const requestedRole = meta.role as string | undefined
          const role = requestedRole === 'organiser' ? 'organiser' : 'attendee'
          const name =
            (meta.name as string | undefined) ??
            (meta.full_name as string | undefined) ??
            user.email?.split('@')[0] ??
            'GhanasEvent user'
          const avatarUrl =
            (meta.avatar_url as string | undefined) ??
            (meta.picture as string | undefined) ??
            null

          const { data: created } = await supabase
            .from('profiles')
            .insert({ id: user.id, name, role, avatar_url: avatarUrl })
            .select('role')
            .single()

          profile = created
        }

        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/admin/dashboard`)
        } else if (profile?.role === 'organiser') {
          return NextResponse.redirect(`${origin}/organiser/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}${redirectTo}`)
        }
      }
    }
  }

  // Auth failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}