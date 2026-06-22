import type { createClient } from '@/lib/supabase/client'

export interface OrganiserDetailsInitial {
  name: string
  phone: string
  whatsapp: string
  website: string
  bio: string
  city: string
  region: string
  instagramUrl: string
  facebookUrl: string
  twitterUrl: string
  linkedinUrl: string
}

export function organiserDetailsFromProfile(
  profile: Record<string, unknown> | null,
  meta: Record<string, unknown> = {},
): OrganiserDetailsInitial {
  function pick(key: string, metaKey?: string): string {
    const fromProfile = profile?.[key]
    if (typeof fromProfile === 'string' && fromProfile) return fromProfile
    const fromMeta = meta[metaKey ?? key]
    return typeof fromMeta === 'string' ? fromMeta : ''
  }

  return {
    name: pick('name'),
    phone: pick('phone', 'phone_number'),
    whatsapp: pick('whatsapp'),
    website: pick('website'),
    bio: pick('bio'),
    city: pick('city'),
    region: pick('region'),
    instagramUrl: pick('instagram_url'),
    facebookUrl: pick('facebook_url'),
    twitterUrl: pick('twitter_url'),
    linkedinUrl: pick('linkedin_url'),
  }
}

export async function saveOrganiserDetails(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  details: OrganiserDetailsInitial,
) {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: details.name.trim() || null,
      phone: details.phone.trim() || null,
      whatsapp: details.whatsapp.trim() || null,
      website: details.website.trim() || null,
      bio: details.bio.trim() || null,
      city: details.city.trim() || null,
      region: details.region.trim() || null,
      instagram_url: details.instagramUrl.trim() || null,
      facebook_url: details.facebookUrl.trim() || null,
      twitter_url: details.twitterUrl.trim() || null,
      linkedin_url: details.linkedinUrl.trim() || null,
    })
    .eq('id', userId)

  if (error) {
    if (error.message.includes('column')) {
      throw new Error('Profile fields are not set up yet. Run supabase/policies/profile-details.sql in Supabase.')
    }
    throw new Error(error.message)
  }
}
