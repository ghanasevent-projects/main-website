-- Admin access policies (read + manage content).
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

-- Helper: true when the signed-in user is an admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Events ──────────────────────────────────────────────────
drop policy if exists "Admins can read all events" on public.events;
create policy "Admins can read all events"
  on public.events for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update all events" on public.events;
create policy "Admins can update all events"
  on public.events for update
  to authenticated
  using (public.is_admin());

-- ── Profiles ────────────────────────────────────────────────
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- ── Hotels ──────────────────────────────────────────────────
drop policy if exists "Admins can read all hotels" on public.hotels;
create policy "Admins can read all hotels"
  on public.hotels for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update all hotels" on public.hotels;
create policy "Admins can update all hotels"
  on public.hotels for update
  to authenticated
  using (public.is_admin());

-- ── Tourist areas ───────────────────────────────────────────
drop policy if exists "Admins can read all tourist areas" on public.tourist_areas;
create policy "Admins can read all tourist areas"
  on public.tourist_areas for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update all tourist areas" on public.tourist_areas;
create policy "Admins can update all tourist areas"
  on public.tourist_areas for update
  to authenticated
  using (public.is_admin());
