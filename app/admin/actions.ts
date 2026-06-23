'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { resolveRegion } from '@/lib/ghana-locations'
import { revalidatePath } from 'next/cache'

const LISTING_BUCKET = 'listing-images'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Not authorised')
}

async function uploadListingImage(
  admin: ReturnType<typeof getAdminClient>,
  file: File,
  folder: 'hotels' | 'tourist-areas',
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${folder}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await admin.storage
    .from(LISTING_BUCKET)
    .upload(path, buffer, { contentType: file.type, cacheControl: '3600' })

  if (error) {
    throw new Error(`Image upload failed: ${error.message}. Run listing-images.sql in Supabase.`)
  }

  return admin.storage.from(LISTING_BUCKET).getPublicUrl(path).data.publicUrl
}

function revalidateEventPaths() {
  revalidatePath('/admin/events')
  revalidatePath('/admin/dashboard')
  revalidatePath('/events')
  revalidatePath('/')
}

export async function approveEvent(eventId: string) {
  await requireAdmin()

  const { error } = await getAdminClient()
    .from('events')
    .update({ status: 'approved', rejection_reason: null })
    .eq('id', eventId)

  if (error) throw new Error(error.message)
  revalidateEventPaths()
}

export async function rejectEvent(eventId: string, reason?: string) {
  await requireAdmin()

  const { error } = await getAdminClient()
    .from('events')
    .update({ status: 'rejected', rejection_reason: reason ?? null })
    .eq('id', eventId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/admin/dashboard')
}

export async function deleteEvent(eventId: string) {
  await requireAdmin()

  const { error } = await getAdminClient()
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) throw new Error(error.message)
  revalidateEventPaths()
}

export async function toggleHotelActive(hotelId: string, isActive: boolean) {
  await requireAdmin()

  const { error } = await getAdminClient()
    .from('hotels')
    .update({ is_active: isActive })
    .eq('id', hotelId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/hotels')
  revalidatePath('/hotels')
}

export async function toggleTouristAreaActive(areaId: string, isActive: boolean) {
  await requireAdmin()

  const { error } = await getAdminClient()
    .from('tourist_areas')
    .update({ is_active: isActive })
    .eq('id', areaId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/tourist-areas')
  revalidatePath('/tourist-areas')
}

export async function createHotel(formData: FormData) {
  await requireAdmin()
  const admin = getAdminClient()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const regionInput = String(formData.get('region') ?? '').trim()
  const priceRange = String(formData.get('price_range') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const website = String(formData.get('website') ?? '').trim() || null
  const amenitiesRaw = String(formData.get('amenities') ?? '')
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').filter(Boolean) : []
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null
  const imageFile = formData.get('image') as File | null

  if (name.length < 2) throw new Error('Hotel name is required')
  if (!city) throw new Error('City or town is required')
  if (!resolveRegion(regionInput, city)) throw new Error('Region is required')

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadListingImage(admin, imageFile, 'hotels')
  }

  const { error } = await admin.from('hotels').insert({
    name,
    description: description || null,
    address,
    city,
    region: resolveRegion(regionInput, city),
    price_range: priceRange,
    phone,
    website,
    amenities,
    image_url: imageUrl,
    latitude,
    longitude,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/hotels')
  revalidatePath('/hotels')
}

export async function updateHotel(hotelId: string, formData: FormData) {
  await requireAdmin()
  const admin = getAdminClient()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const regionInput = String(formData.get('region') ?? '').trim()
  const priceRange = String(formData.get('price_range') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const website = String(formData.get('website') ?? '').trim() || null
  const amenitiesRaw = String(formData.get('amenities') ?? '')
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').filter(Boolean) : []
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null
  const imageFile = formData.get('image') as File | null
  const removeImage = formData.get('remove_image') === 'true'

  if (name.length < 2) throw new Error('Hotel name is required')
  if (!city) throw new Error('City or town is required')
  if (!resolveRegion(regionInput, city)) throw new Error('Region is required')

  const { data: existing } = await admin.from('hotels').select('image_url').eq('id', hotelId).single()
  if (!existing) throw new Error('Hotel not found')

  let imageUrl = existing.image_url
  if (removeImage) {
    imageUrl = null
  } else if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadListingImage(admin, imageFile, 'hotels')
  }

  const { error } = await admin.from('hotels').update({
    name,
    description: description || null,
    address,
    city,
    region: resolveRegion(regionInput, city),
    price_range: priceRange,
    phone,
    website,
    amenities,
    image_url: imageUrl,
    latitude,
    longitude,
  }).eq('id', hotelId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/hotels')
  revalidatePath(`/admin/hotels/${hotelId}/edit`)
  revalidatePath('/hotels')
  revalidatePath(`/hotels/${hotelId}`)
}

export async function createTouristArea(formData: FormData) {
  await requireAdmin()
  const admin = getAdminClient()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const regionInput = String(formData.get('region') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || null
  const entryFee = String(formData.get('entry_fee') ?? '').trim() || null
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null
  const imageFile = formData.get('image') as File | null

  if (name.length < 2) throw new Error('Name is required')
  if (!city) throw new Error('City or town is required')
  if (!resolveRegion(regionInput, city)) throw new Error('Region is required')

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadListingImage(admin, imageFile, 'tourist-areas')
  }

  const { error } = await admin.from('tourist_areas').insert({
    name,
    description: description || null,
    city,
    region: resolveRegion(regionInput, city),
    category,
    entry_fee: entryFee,
    image_url: imageUrl,
    latitude,
    longitude,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/tourist-areas')
  revalidatePath('/tourist-areas')
}

export async function updateTouristArea(areaId: string, formData: FormData) {
  await requireAdmin()
  const admin = getAdminClient()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const regionInput = String(formData.get('region') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || null
  const entryFee = String(formData.get('entry_fee') ?? '').trim() || null
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null
  const imageFile = formData.get('image') as File | null
  const removeImage = formData.get('remove_image') === 'true'

  if (name.length < 2) throw new Error('Name is required')
  if (!city) throw new Error('City or town is required')
  if (!resolveRegion(regionInput, city)) throw new Error('Region is required')

  const { data: existing } = await admin.from('tourist_areas').select('image_url').eq('id', areaId).single()
  if (!existing) throw new Error('Tourist area not found')

  let imageUrl = existing.image_url
  if (removeImage) {
    imageUrl = null
  } else if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadListingImage(admin, imageFile, 'tourist-areas')
  }

  const { error } = await admin.from('tourist_areas').update({
    name,
    description: description || null,
    city,
    region: resolveRegion(regionInput, city),
    category,
    entry_fee: entryFee,
    image_url: imageUrl,
    latitude,
    longitude,
  }).eq('id', areaId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/tourist-areas')
  revalidatePath(`/admin/tourist-areas/${areaId}/edit`)
  revalidatePath('/tourist-areas')
  revalidatePath(`/tourist-areas/${areaId}`)
}
