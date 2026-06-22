import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyPaystackReference } from '@/lib/paystack'
import { fulfillTicketPayment } from '@/lib/ticket-fulfillment'

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  const ticketsUrl = `${origin}/attendee/tickets`

  if (!reference) {
    return NextResponse.redirect(`${ticketsUrl}?purchase=failed`)
  }

  const admin = createAdminClient()

  const { data: payment } = await admin
    .from('ticket_payments')
    .select('status, event_id')
    .eq('paystack_reference', reference)
    .maybeSingle()

  if (!payment) {
    return NextResponse.redirect(`${ticketsUrl}?purchase=failed`)
  }

  if (payment.status === 'paid') {
    return NextResponse.redirect(`${ticketsUrl}?purchase=success`)
  }

  const verified = await verifyPaystackReference(reference)
  if (!verified.ok || verified.currency !== 'GHS') {
    await admin.from('ticket_payments').update({ status: 'failed' }).eq('paystack_reference', reference)
    return NextResponse.redirect(`${ticketsUrl}?purchase=failed`)
  }

  const result = await fulfillTicketPayment(admin, reference, verified.amountPesewas)
  if (!result.ok) {
    return NextResponse.redirect(`${ticketsUrl}?purchase=failed`)
  }

  return NextResponse.redirect(`${ticketsUrl}?purchase=success`)
}
