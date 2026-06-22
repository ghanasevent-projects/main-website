import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { apiRateLimit, getClientIp } from '@/lib/rate-limit'

function needsAuthCheck(pathname: string) {
  return (
    pathname.startsWith('/organiser') ||
    pathname.startsWith('/attendee') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register'
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next({ request })
  }

  const rateLimitedPaths = ['/events', '/hotels', '/tourist-areas']
  if (rateLimitedPaths.some(p => pathname.startsWith(p))) {
    const ip = getClientIp(request)
    const { success } = await apiRateLimit.limit(ip)
    if (!success) {
      return new NextResponse('Too many requests, please slow down.', { status: 429 })
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase unreachable — continue as anonymous so pages still render
  }

  if (!needsAuthCheck(pathname)) {
    return supabaseResponse
  }

  const authRoutes = ['/login', '/register']
  if (authRoutes.includes(pathname) && user) {
    let role: string | undefined
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role
    } catch {
      role = undefined
    }

    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'organiser') return NextResponse.redirect(new URL('/organiser/dashboard', request.url))
    return NextResponse.redirect(new URL('/attendee/tickets', request.url))
  }

  if (pathname.startsWith('/organiser')) {
    if (!user) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    let role: string | undefined
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role
    } catch {
      role = undefined
    }

    if (role !== 'organiser' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (pathname.startsWith('/attendee')) {
    if (!user) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    let role: string | undefined
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role
    } catch {
      role = undefined
    }

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}