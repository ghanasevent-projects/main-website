-- Auto-create a public.profiles row for every new auth user.
-- Pulls name/role from the sign-up metadata (email form) or the
-- OAuth provider profile (Google/Facebook). Safe to re-run.
-- Run in the Supabase Dashboard → SQL Editor.

-- ─────────────────────────────────────────────────────────────
-- 1. Trigger function
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_name   text;
  v_role   text;
  v_avatar text;
begin
  v_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1)
  );

  -- Only allow the two self-service roles; admins are promoted manually.
  v_role := new.raw_user_meta_data ->> 'role';
  if v_role is null or v_role not in ('attendee', 'organiser') then
    v_role := 'attendee';
  end if;

  v_avatar := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );

  -- Never abort the sign-up: if the profile insert fails we log a warning
  -- and let the app's /auth/callback fallback create the profile instead.
  begin
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'email'
    ) then
      insert into public.profiles (id, email, name, role, avatar_url)
      values (new.id, new.email, v_name, v_role, v_avatar)
      on conflict (id) do nothing;
    else
      insert into public.profiles (id, name, role, avatar_url)
      values (new.id, v_name, v_role, v_avatar)
      on conflict (id) do nothing;
    end if;
  exception when others then
    raise warning 'handle_new_user: could not create profile for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. Row-level access for profiles
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  to public
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- 3. Let signed-in users create their own profile row
--    (fallback used by the app if the trigger was missing)
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- 4. Backfill: create profiles for existing users that have none
-- ─────────────────────────────────────────────────────────────
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'email'
  ) then
    insert into public.profiles (id, email, name, role, avatar_url)
    select
      u.id,
      u.email,
      coalesce(
        u.raw_user_meta_data ->> 'name',
        u.raw_user_meta_data ->> 'full_name',
        split_part(u.email, '@', 1)
      ),
      case
        when u.raw_user_meta_data ->> 'role' in ('attendee', 'organiser')
          then u.raw_user_meta_data ->> 'role'
        else 'attendee'
      end,
      coalesce(
        u.raw_user_meta_data ->> 'avatar_url',
        u.raw_user_meta_data ->> 'picture'
      )
    from auth.users u
    left join public.profiles p on p.id = u.id
    where p.id is null;
  else
    insert into public.profiles (id, name, role, avatar_url)
    select
      u.id,
      coalesce(
        u.raw_user_meta_data ->> 'name',
        u.raw_user_meta_data ->> 'full_name',
        split_part(u.email, '@', 1)
      ),
      case
        when u.raw_user_meta_data ->> 'role' in ('attendee', 'organiser')
          then u.raw_user_meta_data ->> 'role'
        else 'attendee'
      end,
      coalesce(
        u.raw_user_meta_data ->> 'avatar_url',
        u.raw_user_meta_data ->> 'picture'
      )
    from auth.users u
    left join public.profiles p on p.id = u.id
    where p.id is null;
  end if;
end $$;
