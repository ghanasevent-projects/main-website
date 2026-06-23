'use client'

import EventMobileTicketBar from '@/components/events/EventMobileTicketBar'

export default function EventMobileTicketCta({
  label,
  hasTicketSection,
  externalTicketUrl,
}: {
  label: string
  hasTicketSection: boolean
  externalTicketUrl: string | null
}) {
  function handleClick() {
    if (externalTicketUrl && !hasTicketSection) {
      window.open(externalTicketUrl, '_blank', 'noopener,noreferrer')
      return
    }
    const el = document.getElementById('event-tickets') ?? document.getElementById('ticket-sidebar')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <EventMobileTicketBar label={label} onClick={handleClick} />
}
