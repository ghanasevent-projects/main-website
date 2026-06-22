/** Minimal client shape for slug uniqueness checks. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlugClient = any

/** Turn text into a URL-safe kebab-case segment. */
export function slugifyText(text: string, maxLength = 80): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/, '')
}

/** Build a readable event slug from title + start year (Eventbrite-style). */
export function buildEventSlugBase({
  title,
  startDate,
}: {
  title: string
  startDate?: string
}): string {
  const titleSlug = slugifyText(title, 72) || 'event'

  if (!startDate) return titleSlug

  const year = new Date(startDate).getFullYear()
  if (!Number.isFinite(year)) return titleSlug

  const hasYear = new RegExp(`(?:^|-)${year}(?:-|$)`).test(titleSlug)
  if (hasYear) return titleSlug

  const combined = `${titleSlug}-${year}`
  return combined.length <= 80 ? combined : titleSlug
}

/** Append -2, -3, … until the slug is unused. */
export async function ensureUniqueEventSlug(
  supabase: SlugClient,
  baseSlug: string,
  excludeEventId?: string,
): Promise<string> {
  const base = baseSlug || 'event'
  let candidate = base
  let suffix = 2

  while (suffix <= 100) {
    const { data } = await supabase
      .from('events')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()

    if (!data || (excludeEventId && data.id === excludeEventId)) {
      return candidate
    }

    candidate = `${base}-${suffix}`
    suffix += 1
  }

  throw new Error('Could not generate a unique event URL. Try a more specific title.')
}

export async function generateEventSlug(
  supabase: SlugClient,
  input: { title: string; startDate?: string },
  excludeEventId?: string,
): Promise<string> {
  const base = buildEventSlugBase(input)
  return ensureUniqueEventSlug(supabase, base, excludeEventId)
}
