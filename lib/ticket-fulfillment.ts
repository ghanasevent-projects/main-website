import type { SupabaseClient } from '@supabase/supabase-js'
import { generateTicketReference, ticketQrUrl } from '@/lib/paystack'

interface FulfillResult {
  ok: boolean
  error?: string
  ticketIds?: string[]
}

/**
 * Mark a ticket payment as paid and issue ticket(s).
 * Idempotent — safe to call from callback and webhook.
 */
export async function fulfillTicketPayment(
  admin: SupabaseClient,
  paystackReference: string,
  expectedAmountPesewas?: number,
): Promise<FulfillResult> {
  const { data: payment } = await admin
    .from('ticket_payments')
    .select('*')
    .eq('paystack_reference', paystackReference)
    .maybeSingle()

  if (!payment) return { ok: false, error: 'Payment record not found' }
  if (payment.status === 'paid') return { ok: true, ticketIds: [] }

  if (
    expectedAmountPesewas !== undefined &&
    expectedAmountPesewas > 0 &&
    expectedAmountPesewas < Math.round(Number(payment.amount_ghs) * 100)
  ) {
    await admin.from('ticket_payments').update({ status: 'failed' }).eq('id', payment.id)
    return { ok: false, error: 'Amount mismatch' }
  }

  const { data: ticketType } = await admin
    .from('ticket_types')
    .select('id, price, quantity, quantity_sold, event_id')
    .eq('id', payment.ticket_type_id)
    .single()

  if (!ticketType) {
    await admin.from('ticket_payments').update({ status: 'failed' }).eq('id', payment.id)
    return { ok: false, error: 'Ticket type not found' }
  }

  const remaining = ticketType.quantity - (ticketType.quantity_sold ?? 0)
  if (remaining < payment.quantity) {
    await admin.from('ticket_payments').update({ status: 'failed' }).eq('id', payment.id)
    return { ok: false, error: 'Tickets sold out' }
  }

  const unitPrice = Number(ticketType.price)
  const rows = Array.from({ length: payment.quantity }, () => {
    const reference = generateTicketReference()
    return {
      attendee_id: payment.attendee_id,
      ticket_type_id: payment.ticket_type_id,
      event_id: payment.event_id,
      reference,
      qr_code: ticketQrUrl(reference),
      payment_status: 'paid',
      amount_paid: unitPrice,
    }
  })

  const { data: inserted, error: ticketError } = await admin
    .from('tickets')
    .insert(rows)
    .select('id')

  if (ticketError) {
    return { ok: false, error: ticketError.message }
  }

  const { error: stockError } = await admin
    .from('ticket_types')
    .update({ quantity_sold: (ticketType.quantity_sold ?? 0) + payment.quantity })
    .eq('id', ticketType.id)

  if (stockError) {
    return { ok: false, error: stockError.message }
  }

  await admin
    .from('ticket_payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', payment.id)

  return { ok: true, ticketIds: inserted?.map(t => t.id as string) ?? [] }
}

/** Issue free tickets immediately (no Paystack). */
export async function fulfillFreeTicket(
  admin: SupabaseClient,
  params: {
    attendeeId: string
    ticketTypeId: string
    eventId: string
    quantity: number
  },
): Promise<FulfillResult> {
  const reference = `free_${params.eventId.slice(0, 8)}_${Date.now()}`
  const { error: paymentError } = await admin.from('ticket_payments').insert({
    attendee_id: params.attendeeId,
    ticket_type_id: params.ticketTypeId,
    event_id: params.eventId,
    quantity: params.quantity,
    amount_ghs: 0,
    paystack_reference: reference,
    status: 'pending',
  })

  if (paymentError) {
    return { ok: false, error: paymentError.message }
  }

  return fulfillTicketPayment(admin, reference, 0)
}
