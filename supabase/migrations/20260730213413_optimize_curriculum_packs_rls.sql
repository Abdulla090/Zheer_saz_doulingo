-- Cache JWT evaluation once per statement and cover the admin audit foreign key.
alter policy "Published curriculum is readable"
  on public.curriculum_packs
  using (
    is_published
    or coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
  );

alter policy "Curriculum admins can insert"
  on public.curriculum_packs
  with check (
    coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
    and updated_by = (select auth.uid())
  );

alter policy "Curriculum admins can update"
  on public.curriculum_packs
  using (
    coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
  )
  with check (
    coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
    and updated_by = (select auth.uid())
  );

alter policy "Curriculum admins can delete drafts"
  on public.curriculum_packs
  using (
    not is_published
    and coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
  );

create index if not exists curriculum_packs_updated_by_idx
  on public.curriculum_packs (updated_by);
