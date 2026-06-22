import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isValidPaystackWebhook } from '@/lib/paystack'
import { fulfillTicketPayment } from '@/lib/ticket-fulfillment'
import { webhookRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
   const ip = getClientIp(request)
   const { success } = await webhookRateLimit.limit(ip)
   if (!success) {
     return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
   }

  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  if (!isValidPaystackWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { event?: string; data?: { reference?: string; status?: string } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true })
  }

  const reference = event.data?.reference
  if (!reference || !reference.startsWith('tkt_')) {
    // Promotion payments use promo_ prefix — handled by callback route
    return NextResponse.json({ received: true })
  }

  const admin = createAdminClient()
  const result = await fulfillTicketPayment(admin, reference)

  if (!result.ok) {
    console.error('Webhook ticket fulfillment failed:', reference, result.error)
  }

  return NextResponse.json({ received: true })
}
