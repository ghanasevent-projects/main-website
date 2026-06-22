import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getPromotionTier } from '@/lib/promotions'

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  const dashboard = `${origin}/organiser/dashboard`

  if (!reference) {
    return NextResponse.redirect(`${dashboard}?promotion=failed`)
  }

  const admin = createAdminClient()

  const { data: promotion } = await admin
    .from('event_promotions')
    .select('*')
    .eq('paystack_reference', reference)
    .single()

  if (!promotion) {
    return NextResponse.redirect(`${dashboard}?promotion=failed`)
  }

  // Already processed (e.g. user refreshed the callback URL)
  if (promotion.status === 'paid') {
    return NextResponse.redirect(`${dashboard}?promotion=success`)
  }

  // Verify with Paystack — never trust the redirect alone
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } },
  )
  const payload = await res.json()
  const tx = payload?.data

  const tier = getPromotionTier(promotion.tier)
  const expectedPesewas = Math.round((tier?.priceGhs ?? promotion.amount_ghs) * 100)

  const paid =
    res.ok &&
    tx?.status === 'success' &&
    tx?.currency === 'GHS' &&
    Number(tx?.amount) >= expectedPesewas

  if (!paid) {
    await admin
      .from('event_promotions')
      .update({ status: 'failed' })
      .eq('id', promotion.id)
    return NextResponse.redirect(`${dashboard}?promotion=failed`)
  }

  // Extend an active promotion rather than overwriting it
  const { data: event } = await admin
    .from('events')
    .select('promoted_until')
    .eq('id', promotion.event_id)
    .single()

  const now = Date.now()
  const base =
    event?.promoted_until && new Date(event.promoted_until).getTime() > now
      ? new Date(event.promoted_until).getTime()
      : now
  const expiresAt = new Date(base + promotion.duration_days * 24 * 60 * 60 * 1000)

  await admin
    .from('event_promotions')
    .update({ status: 'paid', paid_at: new Date().toISOString(), expires_at: expiresAt.toISOString() })
    .eq('id', promotion.id)

  await admin
    .from('events')
    .update({ promotion_tier: promotion.tier, promoted_until: expiresAt.toISOString() })
    .eq('id', promotion.event_id)

  return NextResponse.redirect(`${dashboard}?promotion=success`)
}
