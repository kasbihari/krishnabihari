-- Supabase Storage bucket for project / portfolio images.
--
-- The bucket is PUBLIC-READ so that stored image references (full public
-- URLs) can be used directly as <img src> by the public portfolio and the
-- client portal, matching how existing image URLs are consumed.
--
-- Writes are NOT granted to anon/authenticated roles: uploads and deletes
-- happen server-side through admin-authenticated API routes using the
-- service-role key, which bypasses RLS. This keeps the bucket read-public
-- but write-private.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = excluded.public;

-- Public read for anyone (needed for <img src> to load).
drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');
