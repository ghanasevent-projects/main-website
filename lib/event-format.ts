import {
  eachDayOfInterval,
  format,
  differenceInMinutes,
  isSameDay,
  startOfDay,
} from 'date-fns'

/** One line per calendar day the event runs (multi-day festivals, etc.). */
export function getEventScheduleLines(startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isSameDay(start, end)) {
    return [
      `${format(start, 'EEEE, MMMM d')} · ${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`,
    ]
  }

  const days = eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) })
  const startTime = format(start, 'h:mm a')
  const endTime = format(end, 'h:mm a')

  return days.map(day => {
    const dayLabel = format(day, 'EEEE, MMMM d')
    return `${dayLabel} · ${startTime} – ${endTime}`
  })
}

/** @deprecated Use getEventScheduleLines — kept for single-line fallbacks */
export function formatEventDateLine(startDate: string, endDate: string): string {
  return getEventScheduleLines(startDate, endDate).join('\n')
}

export function formatEventDuration(startDate: string, endDate: string): string | null {
  const minutes = differenceInMinutes(new Date(endDate), new Date(startDate))
  if (minutes <= 0) return null

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const dayCount = eachDayOfInterval({
    start: startOfDay(new Date(startDate)),
    end: startOfDay(new Date(endDate)),
  }).length

  if (dayCount > 1) {
    return `${dayCount} days`
  }

  if (hours === 0) return `${mins} min`
  if (mins === 0) return hours === 1 ? '1 hour' : `${hours} hours`
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`
}

export function minTicketPrice(
  ticketTypes: { price: number }[],
  isFree: boolean,
): number | null {
  if (isFree || ticketTypes.length === 0) return null
  return Math.min(...ticketTypes.map(t => t.price))
}

/** Compact range for cards, e.g. "Jun 28 – 30, 2026" or "Jun 28, 2026 · 3:00 PM" */
export function formatEventCardDate(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isSameDay(start, end)) {
    return format(start, 'EEE, MMM d · h:mm a')
  }

  const days = eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) })
  if (days.length === 2) {
    return `${format(start, 'EEE, MMM d')} – ${format(end, 'EEE, MMM d, yyyy')}`
  }

  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')} (${days.length} days)`
}
