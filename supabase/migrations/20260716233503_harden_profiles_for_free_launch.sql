-- Free public release hardening.
-- Premium entitlements are server-managed and the dormant payment simulator
-- is not part of this release.

alter table public.profiles
  add column if not exists is_premium boolean not null default false,
  add column if not exists subscription_tier text;

-- Profiles contain age and learning preferences. They are private to the
-- signed-in owner; guests must not be able to enumerate them.
drop policy if exists "Allow public read access to profiles" on public.profiles;
drop policy if exists "Allow individual user read access to their own profile" on public.profiles;

create policy "Allow individual user read access to their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- RLS controls rows, while column privileges prevent a user from granting
-- their own premium entitlement through the Data API.
revoke all on table public.profiles from anon;
revoke update on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
grant update (username, display_name, avatar_url, age, path_mode, tutor_voice)
  on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

revoke all on table public.user_progress from anon;
grant select, insert, update on table public.user_progress to authenticated;
grant all on table public.user_progress to service_role;

-- The signup trigger needs elevated access, but it is not a public RPC.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)') || '_' || substring(md5(random()::text) from 1 for 4)
    ),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)')
    ),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.user_progress (user_id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
