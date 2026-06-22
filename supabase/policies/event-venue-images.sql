-- Venue / event-centre photo gallery on events (Eventbrite-style).
-- Safe to re-run. Run in Supabase Dashboard → SQL Editor.

alter table public.events add column if not exists venue_images jsonb not null default '[]'::jsonb;

-- venue_images stores a JSON array of public image URLs, e.g.
-- ["https://.../venue/photo1.jpg", "https://.../venue/photo2.jpg"]
