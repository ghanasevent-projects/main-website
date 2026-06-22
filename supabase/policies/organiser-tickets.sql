-- Organisers can view tickets and payments for their own events.
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

drop policy if exists "Organisers can view tickets for own events" on public.tickets;
create policy "Organisers can view tickets for own events"
  on public.tickets for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );

drop policy if exists "Organisers can view ticket payments for own events" on public.ticket_payments;
create policy "Organisers can view ticket payments for own events"
  on public.ticket_payments for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );
