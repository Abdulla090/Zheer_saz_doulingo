-- Persist the pet chosen during onboarding and retire the old generated SVG
-- avatar selections. Uploaded JPG/PNG/WebP photos remain untouched.
alter table public.profiles
  add column if not exists selected_mascot_id text not null default 'pingo';

alter table public.profiles
  drop constraint if exists profiles_selected_mascot_id_check;

alter table public.profiles
  add constraint profiles_selected_mascot_id_check
  check (
    selected_mascot_id in (
      'pingo', 'violet', 'biscuit', 'waddle', 'sparkle', 'orbit',
      'ember', 'quacks', 'momo', 'buzzwell', 'sprout', 'moonbun'
    )
  );

update public.profiles
set avatar_url = null
where avatar_url ilike '%.svg%'
   or avatar_url ilike '%/premade/%';

grant update (selected_mascot_id)
  on table public.profiles to authenticated;
