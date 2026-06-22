'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, User, Camera, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import RegionLocationPicker from '@/components/ui/RegionLocationPicker'
import { BrandFieldLabel, BrandInput } from '@/components/ui/BrandInput'

const AVATAR_BUCKET = 'avatars'
const MAX_AVATAR_MB = 2

export interface ProfileFormData {
  userId: string
  email: string
  name: string
  role: string
  avatarUrl: string | null
  phone: string
  whatsapp: string
  city: string
  region: string
  website: string
  bio: string
  instagramUrl: string
  facebookUrl: string
  twitterUrl: string
  linkedinUrl: string
}

export default function ProfileForm({ initial }: { initial: ProfileFormData }) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isOrganiser = initial.role === 'organiser' || initial.role === 'admin'

  const [name, setName] = useState(initial.name)
  const [phone, setPhone] = useState(initial.phone)
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp)
  const [region, setRegion] = useState(initial.region)
  const [city, setCity] = useState(initial.city)
  const [website, setWebsite] = useState(initial.website)
  const [bio, setBio] = useState(initial.bio)
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl)
  const [facebookUrl, setFacebookUrl] = useState(initial.facebookUrl)
  const [twitterUrl, setTwitterUrl] = useState(initial.twitterUrl)
  const [linkedinUrl, setLinkedinUrl] = useState(initial.linkedinUrl)

  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, or WebP).')
      return
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_AVATAR_MB} MB.`)
      return
    }
    setError(null)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!avatarFile) return avatarUrl

    const ext = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${initial.userId}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, avatarFile, { upsert: true, cacheControl: '3600' })

    if (uploadError) {
      if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket')) {
        throw new Error('Photo upload is not configured yet (missing "avatars" storage bucket in Supabase).')
      }
      if (uploadError.message.includes('row-level security')) {
        throw new Error(
          'The "avatars" bucket is missing upload permissions. Run supabase/policies/avatars-storage.sql in Supabase.',
        )
      }
      throw new Error(`Photo upload failed: ${uploadError.message}`)
    }

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const newAvatarUrl = await uploadAvatar()

      const payload = {
        name: name.trim(),
        avatar_url: newAvatarUrl,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        website: website.trim() || null,
        bio: bio.trim() || null,
        city: city.trim() || null,
        region: region.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        twitter_url: twitterUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', initial.userId)

      if (profileError) {
        if (profileError.message.includes('column')) {
          throw new Error('Profile fields are not set up yet. Run supabase/policies/profile-details.sql in Supabase.')
        }
        throw new Error(profileError.message)
      }

      setAvatarUrl(newAvatarUrl)
      setAvatarFile(null)
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong, please try again.')
    } finally {
      setSaving(false)
    }
  }

  const shownAvatar = avatarPreview ?? avatarUrl

  const inputClass = `w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm
    text-gray-900 placeholder-gray-400 outline-none transition
    focus:border-[#C9973A] focus:ring-2 focus:ring-[#C9973A]/20`

  return (
    <form onSubmit={onSubmit} className="space-y-8">

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
          Profile photo
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {shownAvatar ? (
              <Image
                src={shownAvatar}
                alt="Profile photo"
                width={88}
                height={88}
                className="h-22 w-22 rounded-full object-cover ring-2 ring-[#C9973A]/30"
                style={{ width: 88, height: 88 }}
                referrerPolicy="no-referrer"
                unoptimized={Boolean(avatarPreview)}
              />
            ) : (
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#C9973A]/10 ring-2 ring-[#C9973A]/30">
                <User className="h-10 w-10 text-[#C9973A]" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center
                         rounded-full bg-[#C9973A] text-white shadow hover:bg-[#A87A28] transition"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <p className="font-medium text-gray-700">Choose an image to upload</p>
            <p className="text-xs mt-0.5">JPG, PNG or WebP — up to {MAX_AVATAR_MB} MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
          Contact information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input value={initial.email} disabled className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
          </div>
          <div className="space-y-1.5">
            <BrandFieldLabel brand="phone" htmlFor="phone">Phone</BrandFieldLabel>
            <BrandInput id="phone" brand="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 000 0000" />
          </div>
          <div className="space-y-1.5">
            <BrandFieldLabel brand="whatsapp" htmlFor="whatsapp">WhatsApp</BrandFieldLabel>
            <BrandInput id="whatsapp" brand="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+233 24 000 0000" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <BrandFieldLabel brand="website" htmlFor="website">Website</BrandFieldLabel>
            <BrandInput id="website" brand="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbrand.com" />
          </div>
        </div>
      </section>

      {isOrganiser && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
            Social links
          </h2>
          <p className="mb-4 text-xs text-gray-500">
            Shown on your public profile and event pages so attendees can connect with you.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <BrandFieldLabel brand="instagram" htmlFor="instagram">Instagram</BrandFieldLabel>
              <BrandInput id="instagram" brand="instagram" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/…" />
            </div>
            <div className="space-y-1.5">
              <BrandFieldLabel brand="facebook" htmlFor="facebook">Facebook</BrandFieldLabel>
              <BrandInput id="facebook" brand="facebook" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/…" />
            </div>
            <div className="space-y-1.5">
              <BrandFieldLabel brand="twitter" htmlFor="twitter">X / Twitter</BrandFieldLabel>
              <BrandInput id="twitter" brand="twitter" value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/…" />
            </div>
            <div className="space-y-1.5">
              <BrandFieldLabel brand="linkedin" htmlFor="linkedin">LinkedIn</BrandFieldLabel>
              <BrandInput id="linkedin" brand="linkedin" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/…" />
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
          Location
        </h2>
        <RegionLocationPicker
          value={{ region, city }}
          onChange={({ region: r, city: c }) => { setRegion(r); setCity(c) }}
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
          {isOrganiser ? 'About your organisation' : 'About you'}
        </h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder={isOrganiser
            ? 'Tell attendees about your brand, past events, and what you do…'
            : 'Tell people a little about yourself…'}
          className={`${inputClass} h-auto py-2.5 resize-none`}
        />
        <p className="mt-1 text-right text-xs text-gray-400">{bio.length}/500</p>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-full bg-[#C9973A] px-6 py-2.5 text-sm
                     font-semibold text-white transition hover:bg-[#A87A28] disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        {saved && !saving && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="h-4 w-4" /> Profile updated
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </form>
  )
}
