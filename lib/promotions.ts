export interface PromotionTier {
  id: string
  label: string
  /** Price in Ghana cedis. 0 = free listing. */
  priceGhs: number
  durationDays: number
  description: string
}

export const PROMOTION_TIERS: PromotionTier[] = [
  {
    id: 'free',
    label: 'Free listing',
    priceGhs: 0,
    durationDays: 0,
    description: 'Standard listing in search results and category pages',
  },
  {
    id: 'boost_2w',
    label: 'Boost · 2 weeks',
    priceGhs: 100,
    durationDays: 14,
    description: 'Ranked above free listings for 14 days with a Promoted badge',
  },
  {
    id: 'boost_1m',
    label: 'Boost · 1 month',
    priceGhs: 200,
    durationDays: 30,
    description: 'Ranked above free listings for 30 days with a Promoted badge',
  },
  {
    id: 'boost_6m',
    label: 'Boost · 6 months',
    priceGhs: 500,
    durationDays: 180,
    description: 'Ranked above free listings for 180 days with a Promoted badge',
  },
]

export function getPromotionTier(id: string): PromotionTier | undefined {
  return PROMOTION_TIERS.find(t => t.id === id)
}

/** Paid tiers only (everything except the free listing). */
export const PAID_TIERS = PROMOTION_TIERS.filter(t => t.priceGhs > 0)

export function isEventPromoted(promotedUntil: string | null | undefined): boolean {
  return Boolean(promotedUntil && new Date(promotedUntil).getTime() > Date.now())
}
