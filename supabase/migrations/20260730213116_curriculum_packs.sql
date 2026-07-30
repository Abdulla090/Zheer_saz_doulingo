-- Database-owned curriculum packs. The app only reads published rows; draft
-- and publishing access is reserved for accounts explicitly promoted through
-- auth.users.raw_app_meta_data.curriculum_admin (never user-editable metadata).
create table public.curriculum_packs (
  path_mode text not null
    check (path_mode in ('street', 'normal', 'kids', 'custom')),
  source_language text not null
    check (source_language ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  target_language text not null
    check (target_language ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  version bigint not null default 1 check (version > 0),
  is_published boolean not null default false,
  content jsonb not null check (jsonb_typeof(content) = 'array'),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (path_mode, source_language, target_language),
  check (source_language <> target_language)
);

comment on table public.curriculum_packs is
  'Editable, versioned lesson banks keyed by path and learning language pair.';
comment on column public.curriculum_packs.content is
  'Validated by the application as UnitBank[] before it is cached or rendered.';

alter table public.curriculum_packs enable row level security;

create policy "Published curriculum is readable"
  on public.curriculum_packs
  for select
  to anon, authenticated
  using (
    is_published
    or coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
  );

create policy "Curriculum admins can insert"
  on public.curriculum_packs
  for insert
  to authenticated
  with check (
    coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
    and updated_by = (select auth.uid())
  );

create policy "Curriculum admins can update"
  on public.curriculum_packs
  for update
  to authenticated
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

create policy "Curriculum admins can delete drafts"
  on public.curriculum_packs
  for delete
  to authenticated
  using (
    not is_published
    and coalesce(
      ((select auth.jwt()) -> 'app_metadata' ->> 'curriculum_admin') = 'true',
      false
    )
  );

revoke all on table public.curriculum_packs from anon, authenticated;
grant select on table public.curriculum_packs to anon, authenticated;
grant insert, update, delete on table public.curriculum_packs to authenticated;
grant all on table public.curriculum_packs to service_role;

create or replace function public.bump_curriculum_pack_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.version = old.version + 1;
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

revoke all on function public.bump_curriculum_pack_version() from public;

create trigger on_curriculum_pack_updated
  before update on public.curriculum_packs
  for each row execute function public.bump_curriculum_pack_version();

create index curriculum_packs_updated_by_idx
  on public.curriculum_packs (updated_by);
