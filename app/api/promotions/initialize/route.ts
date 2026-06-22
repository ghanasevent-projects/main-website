import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getPromotionTier } from '@/lib/promotions'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { eventId, tierId } = await request.json()

  const tier = getPromotionTier(tierId)
  if (!tier || tier.priceGhs <= 0) {
    return NextResponse.json({ error: 'Invalid promotion tier' }, { status: 400 })
  }

  // The event must exist and belong to the caller
  const { data: event } = await supabase
    .from('events')
    .select('id, title, organiser_id')
    .eq('id', eventId)
    .single()

  if (!event || event.organiser_id !== user.id) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 })
  }

  const reference = `promo_${event.id.slice(0, 8)}_${Date.now()}`
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin

  // Record the pending payment before redirecting to Paystack
  const admin = createAdminClient()
  const { error: insertError } = await admin.from('event_promotions').insert({
    event_id: event.id,
    organiser_id: user.id,
    tier: tier.id,
    amount_ghs: tier.priceGhs,
    duration_days: tier.durationDays,
    paystack_reference: reference,
    status: 'pending',
  })

  if (insertError) {
    return NextResponse.json(
      { error: 'Could not start payment. Have you run event-promotions.sql in Supabase?' },
      { status: 500 },
    )
  }

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: Math.round(tier.priceGhs * 100), // pesewas
      currency: 'GHS',
      reference,
      callback_url: `${origin}/api/promotions/callback`,
      metadata: {
        kind: 'event_promotion',
        event_id: event.id,
        tier: tier.id,
        custom_fields: [
          { display_name: 'Event', variable_name: 'event', value: event.title },
          { display_name: 'Promotion', variable_name: 'promotion', value: tier.label },
        ],
      },
    }),
  })

  const payload = await res.json()
  if (!res.ok || !payload?.data?.authorization_url) {
    return NextResponse.json(
      { error: payload?.message ?? 'Paystack rejected the transaction' },
      { status: 502 },
    )
  }

  return NextResponse.json({ authorization_url: payload.data.authorization_url })
}
