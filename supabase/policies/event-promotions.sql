-- Event creation + paid promotion (Paystack).
-- Safe to re-run. Run in the Supabase Dashboard → SQL Editor.

-- ─────────────────────────────────────────────────────────────
-- 1. Promotion columns on events
-- ─────────────────────────────────────────────────────────────
alter table public.events add column if not exists promotion_tier text;
alter table public.events add column if not exists promoted_until timestamptz;

create index if not exists events_promoted_until_idx on public.events(promoted_until);

-- ─────────────────────────────────────────────────────────────
-- 2. Promotion payments ledger
-- ─────────────────────────────────────────────────────────────
create table if not exists public.event_promotions (
  id                 uuid primary key default gen_random_uuid(),
  event_id           uuid not null references public.events(id) on delete cascade,
  organiser_id       uuid not null references public.profiles(id) on delete cascade,
  tier               text not null,
  amount_ghs         numeric not null,
  duration_days      int not null,
  paystack_reference text not null unique,
  status             text not null default 'pending', -- pending | paid | failed
  created_at         timestamptz not null default now(),
  paid_at            timestamptz,
  expires_at         timestamptz
);

create index if not exists event_promotions_event_idx on public.event_promotions(event_id);
create index if not exists event_promotions_organiser_idx on public.event_promotions(organiser_id);

alter table public.event_promotions enable row level security;

-- Organisers can see their own promotion payments.
-- Writes happen only through the API with the service-role key (bypasses RLS).
drop policy if exists "Organisers can view own promotions" on public.event_promotions;
create policy "Organisers can view own promotions"
  on public.event_promotions for select
  to authenticated
  using (auth.uid() = organiser_id);

-- ─────────────────────────────────────────────────────────────
-- 3. Organisers can create and edit their own events + tickets
--    (required by the create-event page)
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Organisers can create events" on public.events;
create policy "Organisers can create events"
  on public.events for insert
  to authenticated
  with check (
    auth.uid() = organiser_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('organiser', 'admin')
    )
  );

drop policy if exists "Organisers can update own events" on public.events;
create policy "Organisers can update own events"
  on public.events for update
  to authenticated
  using (auth.uid() = organiser_id);

drop policy if exists "Organisers can manage own ticket types" on public.ticket_types;
create policy "Organisers can manage own ticket types"
  on public.ticket_types for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 4. Storage bucket for event banners
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('event-banners', 'event-banners', true)
on conflict (id) do nothing;

drop policy if exists "Event banners are publicly readable" on storage.objects;
create policy "Event banners are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'event-banners');

drop policy if exists "Organisers can upload event banners" on storage.objects;
create policy "Organisers can upload event banners"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'event-banners'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Organisers can update own event banners" on storage.objects;
create policy "Organisers can update own event banners"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'event-banners'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
