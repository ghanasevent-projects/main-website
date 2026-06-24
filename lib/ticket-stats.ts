export type TicketTypeStats = {
  id?: string
  name?: string
  price: number
  quantity?: number
  quantity_sold: number
}

export function aggregateTicketTypes(types: TicketTypeStats[] | null | undefined) {
  const list = types ?? []
  const sold = list.reduce((a, t) => a + (t.quantity_sold ?? 0), 0)
  const capacity = list.reduce((a, t) => a + (t.quantity ?? 0), 0)
  const revenue = list.reduce(
    (a, t) => a + (t.quantity_sold ?? 0) * Number(t.price ?? 0),
    0,
  )
  return { sold, capacity, revenue }
}

export type OrganiserSalesRow = {
  organiserId: string
  name: string
  email: string | null
  eventCount: number
  ticketsSold: number
  revenue: number
}

export function groupSalesByOrganiser(
  events: {
    organiser_id: string
    organiser?:
      | { name?: string | null; email?: string | null }
      | { name?: string | null; email?: string | null }[]
      | null
    ticket_types?: TicketTypeStats[] | null
  }[],
): OrganiserSalesRow[] {
  const map = new Map<string, OrganiserSalesRow>()

  for (const event of events) {
    const id = event.organiser_id
    const existing = map.get(id)
    const { sold, revenue } = aggregateTicketTypes(event.ticket_types)
    const organiser = Array.isArray(event.organiser)
      ? event.organiser[0]
      : event.organiser

    if (existing) {
      existing.eventCount += 1
      existing.ticketsSold += sold
      existing.revenue += revenue
    } else {
      map.set(id, {
        organiserId: id,
        name: organiser?.name ?? 'Unknown',
        email: organiser?.email ?? null,
        eventCount: 1,
        ticketsSold: sold,
        revenue,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
}
