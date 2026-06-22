-- Social features: follows + saved (liked) events.
-- Run once in the Supabase Dashboard → SQL Editor.

-- ─────────────────────────────────────────────────────────────
-- 1. FOLLOWS — a user follows another user (organiser/attendee/admin)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.follows (
  id           uuid primary key default gen_random_uuid(),
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  -- a user can only follow another user once
  constraint follows_unique unique (follower_id, following_id),
  -- a user cannot follow themselves
  constraint follows_no_self check (follower_id <> following_id)
);

create index if not exists follows_follower_idx  on public.follows(follower_id);
create index if not exists follows_following_idx on public.follows(following_id);

alter table public.follows enable row level security;

-- Anyone may read follow relationships (needed for public counts)
drop policy if exists "Follows are readable by everyone" on public.follows;
create policy "Follows are readable by everyone"
  on public.follows for select
  to public
  using (true);

-- A user may only create follows where they are the follower
drop policy if exists "Users can follow others" on public.follows;
create policy "Users can follow others"
  on public.follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

-- A user may only remove their own follows
drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow"
  on public.follows for delete
  to authenticated
  using (auth.uid() = follower_id);

-- ─────────────────────────────────────────────────────────────
-- 2. SAVED EVENTS — a user saves / likes an event
-- ─────────────────────────────────────────────────────────────
create table if not exists public.saved_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  -- a user can only save a given event once
  constraint saved_events_unique unique (user_id, event_id)
);

create index if not exists saved_events_user_idx  on public.saved_events(user_id);
create index if not exists saved_events_event_idx on public.saved_events(event_id);

alter table public.saved_events enable row level security;

-- A user may read their own saved events; event-level like counts are public
drop policy if exists "Saved events readable by everyone" on public.saved_events;
create policy "Saved events readable by everyone"
  on public.saved_events for select
  to public
  using (true);

-- A user may only save events for themselves
drop policy if exists "Users can save events" on public.saved_events;
create policy "Users can save events"
  on public.saved_events for insert
  to authenticated
  with check (auth.uid() = user_id);

-- A user may only remove their own saved events
drop policy if exists "Users can unsave events" on public.saved_events;
create policy "Users can unsave events"
  on public.saved_events for delete
  to authenticated
  using (auth.uid() = user_id);
