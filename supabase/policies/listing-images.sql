-- Storage bucket for hotel & tourist-area listing images.
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "Listing images are publicly readable" on storage.objects;
create policy "Listing images are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'listing-images');

-- Admins upload via service role in server actions (bypasses RLS).
-- Authenticated users with admin role can also upload for future client-side flows.
drop policy if exists "Admins can upload listing images" on storage.objects;
create policy "Admins can upload listing images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can update listing images" on storage.objects;
create policy "Admins can update listing images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'listing-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Optional lat/lng on hotels for future map features
alter table public.hotels add column if not exists latitude double precision;
alter table public.hotels add column if not exists longitude double precision;

-- Admin INSERT policies (service role bypasses RLS; these cover direct client use)
drop policy if exists "Admins can insert hotels" on public.hotels;
create policy "Admins can insert hotels"
  on public.hotels for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update hotels" on public.hotels;
create policy "Admins can update hotels"
  on public.hotels for update
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert tourist areas" on public.tourist_areas;
create policy "Admins can insert tourist areas"
  on public.tourist_areas for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update tourist areas" on public.tourist_areas;
create policy "Admins can update tourist areas"
  on public.tourist_areas for update
  to authenticated
  using (public.is_admin());
