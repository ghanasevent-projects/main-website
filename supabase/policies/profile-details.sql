-- Extended organiser / public profile contact fields.
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists website text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists region text;
alter table public.profiles add column if not exists whatsapp text;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists facebook_url text;
alter table public.profiles add column if not exists twitter_url text;
alter table public.profiles add column if not exists linkedin_url text;

-- Backfill from auth metadata where columns are empty
update public.profiles p
set
  phone = coalesce(p.phone, u.raw_user_meta_data ->> 'phone_number'),
  website = coalesce(p.website, u.raw_user_meta_data ->> 'website'),
  bio = coalesce(p.bio, u.raw_user_meta_data ->> 'bio'),
  city = coalesce(p.city, u.raw_user_meta_data ->> 'city'),
  region = coalesce(p.region, u.raw_user_meta_data ->> 'region'),
  whatsapp = coalesce(p.whatsapp, u.raw_user_meta_data ->> 'whatsapp'),
  instagram_url = coalesce(p.instagram_url, u.raw_user_meta_data ->> 'instagram_url'),
  facebook_url = coalesce(p.facebook_url, u.raw_user_meta_data ->> 'facebook_url'),
  twitter_url = coalesce(p.twitter_url, u.raw_user_meta_data ->> 'twitter_url'),
  linkedin_url = coalesce(p.linkedin_url, u.raw_user_meta_data ->> 'linkedin_url')
from auth.users u
where u.id = p.id;
