import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { fulfillFreeTicket } from '@/lib/ticket-fulfillment'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const ticketTypeId = body.ticketTypeId as string | undefined
  const eventId = body.eventId as string | undefined
  const quantity = Math.min(Math.max(Number(body.quantity ?? 1), 1), 10)

  if (!ticketTypeId || !eventId) {
    return NextResponse.json({ error: 'Missing ticket or event' }, { status: 400 })
  }

  const { data: ticketType } = await supabase
    .from('ticket_types')
    .select('id, name, price, quantity, quantity_sold, sale_start, sale_end, event_id')
    .eq('id', ticketTypeId)
    .single()

  if (!ticketType || ticketType.event_id !== eventId) {
    return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 })
  }

  const { data: event } = await supabase
    .from('events')
    .select('id, title, slug, status')
    .eq('id', eventId)
    .single()

  if (!event || event.status !== 'approved') {
    return NextResponse.json({ error: 'Event is not available for ticket sales' }, { status: 400 })
  }

  const now = Date.now()
  if (ticketType.sale_start && new Date(ticketType.sale_start).getTime() > now) {
    return NextResponse.json({ error: 'Ticket sales have not opened yet' }, { status: 400 })
  }
  if (ticketType.sale_end && new Date(ticketType.sale_end).getTime() < now) {
    return NextResponse.json({ error: 'Ticket sales have ended' }, { status: 400 })
  }

  const remaining = ticketType.quantity - (ticketType.quantity_sold ?? 0)
  if (remaining < quantity) {
    return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 })
  }

  const unitPrice = Number(ticketType.price)
  const totalGhs = unitPrice * quantity

  // ── Free registration ──────────────────────────────────────
  if (totalGhs <= 0) {
    const admin = createAdminClient()
    const result = await fulfillFreeTicket(admin, {
      attendeeId: user.id,
      ticketTypeId,
      eventId,
      quantity,
    })
    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? 'Could not register' }, { status: 500 })
    }
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
    return NextResponse.json({
      authorization_url: `${origin}/attendee/tickets?purchase=success`,
    })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 })
  }

  const reference = `tkt_${eventId.slice(0, 8)}_${Date.now()}`
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  const amountPesewas = Math.round(totalGhs * 100)

  const admin = createAdminClient()
  const { error: insertError } = await admin.from('ticket_payments').insert({
    attendee_id: user.id,
    ticket_type_id: ticketTypeId,
    event_id: eventId,
    quantity,
    amount_ghs: totalGhs,
    paystack_reference: reference,
    status: 'pending',
  })

  if (insertError) {
    return NextResponse.json(
      { error: 'Could not start checkout. Have you run ticket-payments.sql in Supabase?' },
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
      amount: amountPesewas,
      currency: 'GHS',
      reference,
      callback_url: `${origin}/api/paystack/callback`,
      metadata: {
        kind: 'ticket_purchase',
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        attendee_id: user.id,
        quantity,
        custom_fields: [
          { display_name: 'Event', variable_name: 'event', value: event.title },
          { display_name: 'Ticket', variable_name: 'ticket', value: ticketType.name },
          { display_name: 'Quantity', variable_name: 'quantity', value: String(quantity) },
        ],
      },
    }),
  })

  const payload = await res.json()
  if (!res.ok || !payload?.data?.authorization_url) {
    await admin.from('ticket_payments').update({ status: 'failed' }).eq('paystack_reference', reference)
    return NextResponse.json(
      { error: payload?.message ?? 'Paystack rejected the transaction' },
      { status: 502 },
    )
  }

  return NextResponse.json({ authorization_url: payload.data.authorization_url })
}
