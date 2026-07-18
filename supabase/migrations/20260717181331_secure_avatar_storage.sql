-- Profile photos are optional public avatars. Uploads are restricted to one
-- 5 MB image at the exact object path <authenticated-user-id>/avatar.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar owners can read their upload" on storage.objects;
drop policy if exists "Avatar owners can create their upload" on storage.objects;
drop policy if exists "Avatar owners can replace their upload" on storage.objects;
drop policy if exists "Avatar owners can delete their upload" on storage.objects;
drop policy if exists "Allow anyone to insert premade avatars" on storage.objects;
drop policy if exists "Allow anyone to update premade avatars" on storage.objects;
drop policy if exists "Authenticated User Upload Avatar" on storage.objects;
drop policy if exists "Authenticated User Update Avatar" on storage.objects;
drop policy if exists "Authenticated User Delete Avatar" on storage.objects;
drop policy if exists "Public Access to Avatars" on storage.objects;

create policy "Avatar owners can read their upload"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and name = ((select auth.uid())::text || '/avatar')
  );

create policy "Avatar owners can create their upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and name = ((select auth.uid())::text || '/avatar')
  );

create policy "Avatar owners can replace their upload"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and name = ((select auth.uid())::text || '/avatar')
  )
  with check (
    bucket_id = 'avatars'
    and name = ((select auth.uid())::text || '/avatar')
  );

create policy "Avatar owners can delete their upload"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and name = ((select auth.uid())::text || '/avatar')
  );
