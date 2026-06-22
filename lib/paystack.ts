import crypto from 'crypto'

export interface PaystackVerifyResult {
  ok: boolean
  amountPesewas?: number
  currency?: string
  metadata?: Record<string, unknown>
  message?: string
}

/** Verify a Paystack transaction reference server-side. */
export async function verifyPaystackReference(
  reference: string,
): Promise<PaystackVerifyResult> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return { ok: false, message: 'Paystack is not configured' }
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  )

  const payload = await res.json()
  const tx = payload?.data

  if (!res.ok || tx?.status !== 'success') {
    return { ok: false, message: payload?.message ?? 'Payment not successful' }
  }

  return {
    ok: true,
    amountPesewas: Number(tx.amount),
    currency: tx.currency as string,
    metadata: (tx.metadata ?? {}) as Record<string, unknown>,
  }
}

/** Validate Paystack webhook signature (raw request body). */
export function isValidPaystackWebhook(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
  } catch {
    return false
  }
}

export function ticketQrUrl(reference: string): string {
  const data = encodeURIComponent(`ghanasevent:ticket:${reference}`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`
}

export function generateTicketReference(): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `TKT-${Date.now().toString(36).toUpperCase()}-${rand}`
}
