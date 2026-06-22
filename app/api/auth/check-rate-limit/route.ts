// app/api/auth/check-rate-limit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { success, remaining } = await authRateLimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a moment and try again.' },
      { status: 429 },
    )
  }

  return NextResponse.json({ ok: true, remaining })
}