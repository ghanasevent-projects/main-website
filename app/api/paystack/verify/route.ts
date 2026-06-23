import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { verifyPaystackReference } from '@/lib/paystack'

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: payment } = await admin
    .from('ticket_payments')
    .select('status, attendee_id, amount_ghs, quantity, event_id, ticket_type_id, paid_at')
    .eq('paystack_reference', reference)
    .maybeSingle()

  if (!payment || payment.attendee_id !== user.id) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  if (payment.status === 'paid') {
    return NextResponse.json({
      status: 'success',
      reference,
      quantity: payment.quantity,
      amount_ghs: payment.amount_ghs,
      paid_at: payment.paid_at,
    })
  }

  const verified = await verifyPaystackReference(reference)
  return NextResponse.json({
    status: verified.ok ? 'success' : 'pending',
    reference,
    message: verified.message,
  })
}
