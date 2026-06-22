-- Ticket purchases via Paystack.
-- Safe to re-run. Run in the Supabase Dashboard → SQL Editor.

create table if not exists public.ticket_payments (
  id                 uuid primary key default gen_random_uuid(),
  attendee_id        uuid not null references public.profiles(id) on delete cascade,
  ticket_type_id     uuid not null references public.ticket_types(id) on delete cascade,
  event_id           uuid not null references public.events(id) on delete cascade,
  quantity           int not null default 1 check (quantity > 0),
  amount_ghs         numeric not null default 0,
  paystack_reference text not null unique,
  status             text not null default 'pending', -- pending | paid | failed
  created_at         timestamptz not null default now(),
  paid_at            timestamptz
);

create index if not exists ticket_payments_attendee_idx on public.ticket_payments(attendee_id);
create index if not exists ticket_payments_event_idx on public.ticket_payments(event_id);

alter table public.ticket_payments enable row level security;

-- Buyers can see their own payment attempts.
drop policy if exists "Attendees can view own ticket payments" on public.ticket_payments;
create policy "Attendees can view own ticket payments"
  on public.ticket_payments for select
  to authenticated
  using (auth.uid() = attendee_id);

-- Attendees can read their own issued tickets.
drop policy if exists "Attendees can view own tickets" on public.tickets;
create policy "Attendees can view own tickets"
  on public.tickets for select
  to authenticated
  using (auth.uid() = attendee_id);

-- Public can read ticket types for approved events (for event detail page).
drop policy if exists "Ticket types readable for approved events" on public.ticket_types;
create policy "Ticket types readable for approved events"
  on public.ticket_types for select
  to public
  using (
    exists (
      select 1 from public.events
      where id = event_id and status = 'approved'
    )
  );

-- Organisers can read ticket types on their own events.
drop policy if exists "Organisers can view own ticket types" on public.ticket_types;
create policy "Organisers can view own ticket types"
  on public.ticket_types for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );
