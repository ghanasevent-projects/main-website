-- Allow organisers to update and delete unsold ticket types when editing events.
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

drop policy if exists "Organisers can update own ticket types" on public.ticket_types;
create policy "Organisers can update own ticket types"
  on public.ticket_types for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );

drop policy if exists "Organisers can delete own ticket types" on public.ticket_types;
create policy "Organisers can delete own ticket types"
  on public.ticket_types for delete
  to authenticated
  using (
    quantity_sold = 0
    and exists (
      select 1 from public.events
      where id = event_id and organiser_id = auth.uid()
    )
  );
