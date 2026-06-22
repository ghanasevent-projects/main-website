-- Storage RLS policies for the "avatars" bucket.
-- Run this once in the Supabase Dashboard → SQL Editor.
--
-- Creating a bucket does NOT grant upload permission; storage.objects has
-- row-level security, so without these policies every upload fails with
-- "new row violates row-level security policy".

-- Anyone can view avatars (bucket is public, this covers signed/API reads too)
create policy "Avatars are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Signed-in users can upload files whose name starts with their own user id
-- (the app uploads as `<userId>-<timestamp>.<ext>`)
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and name like auth.uid()::text || '-%'
);

-- Signed-in users can replace their own avatar (upsert needs update too)
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and name like auth.uid()::text || '-%'
);

-- Optional: let users delete their old avatars
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and name like auth.uid()::text || '-%'
);
