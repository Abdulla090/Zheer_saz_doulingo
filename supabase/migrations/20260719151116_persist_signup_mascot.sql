create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_mascot text;
begin
  requested_mascot := new.raw_user_meta_data->>'selected_mascot_id';

  if requested_mascot not in (
    'pingo', 'violet', 'biscuit', 'waddle', 'sparkle', 'orbit',
    'ember', 'quacks', 'momo', 'buzzwell', 'sprout', 'moonbun'
  ) then
    requested_mascot := 'pingo';
  end if;

  insert into public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    selected_mascot_id
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)') || '_' ||
        substring(md5(random()::text) from 1 for 4)
    ),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)')
    ),
    null,
    requested_mascot
  );

  insert into public.user_progress (user_id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
