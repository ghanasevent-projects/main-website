/** Ghana cedi — GH₵ display. Paystack/API still uses ISO code "GHS". */
export const CEDI = 'GH₵'

export function formatCedi(amount: number, decimals = 2): string {
  return `${CEDI}${amount.toFixed(decimals)}`
}

export function formatCediWhole(amount: number): string {
  return `${CEDI}${Math.round(amount)}`
}

export function formatCediFrom(amount: number, decimals = 0): string {
  return `From ${CEDI}${amount.toFixed(decimals)}`
}
