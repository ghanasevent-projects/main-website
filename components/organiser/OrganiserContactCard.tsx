import Image from 'next/image'
import Link from 'next/link'
import { MapPin, User } from 'lucide-react'
import {
  ContactBrandIcon,
  CONTACT_BRAND_LABELS,
  type ContactBrand,
} from '@/components/ui/SocialBrandIcons'

export interface OrganiserContact {
  id: string
  name: string | null
  avatar_url: string | null
  role?: string | null
  phone?: string | null
  website?: string | null
  bio?: string | null
  city?: string | null
  region?: string | null
  whatsapp?: string | null
  instagram_url?: string | null
  facebook_url?: string | null
  twitter_url?: string | null
  linkedin_url?: string | null
}

function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

type ContactLink = {
  brand: ContactBrand
  href: string
  label: string
  external?: boolean
}

function buildContactLinks(organiser: OrganiserContact): ContactLink[] {
  const links: ContactLink[] = []

  if (organiser.phone) {
    links.push({
      brand: 'phone',
      href: `tel:${organiser.phone}`,
      label: organiser.phone,
    })
  }
  if (organiser.whatsapp) {
    links.push({
      brand: 'whatsapp',
      href: whatsappHref(organiser.whatsapp),
      label: organiser.whatsapp,
      external: true,
    })
  }
  if (organiser.website) {
    links.push({
      brand: 'website',
      href: normalizeUrl(organiser.website),
      label: 'Website',
      external: true,
    })
  }
  if (organiser.instagram_url) {
    links.push({
      brand: 'instagram',
      href: normalizeUrl(organiser.instagram_url),
      label: CONTACT_BRAND_LABELS.instagram,
      external: true,
    })
  }
  if (organiser.facebook_url) {
    links.push({
      brand: 'facebook',
      href: normalizeUrl(organiser.facebook_url),
      label: CONTACT_BRAND_LABELS.facebook,
      external: true,
    })
  }
  if (organiser.twitter_url) {
    links.push({
      brand: 'twitter',
      href: normalizeUrl(organiser.twitter_url),
      label: CONTACT_BRAND_LABELS.twitter,
      external: true,
    })
  }
  if (organiser.linkedin_url) {
    links.push({
      brand: 'linkedin',
      href: normalizeUrl(organiser.linkedin_url),
      label: CONTACT_BRAND_LABELS.linkedin,
      external: true,
    })
  }

  return links
}

function ContactLinkItem({
  link,
  compact,
}: {
  link: ContactLink
  compact: boolean
}) {
  const className = compact
    ? 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gold/40 hover:bg-gold/5 hover:text-gray-900'
    : 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gold/40 hover:bg-gold/5 hover:text-gray-900'

  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      className={className}
      aria-label={link.label}
      title={link.label}
    >
      <ContactBrandIcon brand={link.brand} size={compact ? 16 : 18} />
      {!compact && (
        <span>{link.label}</span>
      )}
      {compact && link.brand !== 'phone' && link.brand !== 'whatsapp' && (
        <span>{CONTACT_BRAND_LABELS[link.brand]}</span>
      )}
      {compact && (link.brand === 'phone' || link.brand === 'whatsapp') && (
        <span>{link.label}</span>
      )}
    </a>
  )
}

export default function OrganiserContactCard({
  organiser,
  followerCount,
  compact = false,
  showProfileLink = true,
}: {
  organiser: OrganiserContact
  followerCount?: number
  compact?: boolean
  showProfileLink?: boolean
}) {
  const location = [organiser.city, organiser.region].filter(Boolean).join(', ')
  const links = buildContactLinks(organiser)
  const hasContact = links.length > 0

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {links.map(link => (
          <ContactLinkItem key={link.brand} link={link} compact />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gold/20 bg-linear-to-r from-gold/12 via-amber-50 to-white px-4 py-2.5 sm:px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark">
          Organiser profile
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {organiser.avatar_url ? (
            <Image
              src={organiser.avatar_url}
              alt={organiser.name ?? 'Organiser'}
              width={56}
              height={56}
              referrerPolicy="no-referrer"
              className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-gold/20"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/10 ring-2 ring-gold/20">
              <User className="h-6 w-6 text-gold" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                {organiser.name ?? 'Organiser'}
              </h3>
              {organiser.role && (
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                  {organiser.role}
                </span>
              )}
            </div>

            {location && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {followerCount != null && (
            <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
              {followerCount} follower{followerCount !== 1 ? 's' : ''}
            </div>
          )}
          {links.slice(0, 2).map(link => (
            <ContactLinkItem key={link.brand} link={link} compact={false} />
          ))}
        </div>

        {organiser.bio && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {organiser.bio}
          </p>
        )}

        {hasContact && links.length > 2 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.slice(2).map(link => (
              <ContactLinkItem key={link.brand} link={link} compact={false} />
            ))}
          </div>
        )}

        {showProfileLink && (
          <div className="mt-4">
            <Link
              href={`/u/${organiser.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition hover:text-gold-dark hover:underline"
            >
              View full profile →
            </Link>
          </div>
        )}

        {!hasContact && !organiser.bio && !location && (
          <p className="mt-3 text-xs text-gray-400">No contact details added yet.</p>
        )}
      </div>
    </div>
  )
}
