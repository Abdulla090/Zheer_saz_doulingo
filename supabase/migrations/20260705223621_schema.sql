-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  age integer,
  path_mode text,
  tutor_voice text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for user progress syncing
create table public.user_progress (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  path_indexes jsonb default '{}'::jsonb not null,
  normal_path_indexes jsonb default '{}'::jsonb not null,
  kids_path_indexes jsonb default '{}'::jsonb not null,
  total_xp integer default 0 not null,
  daily_xp integer default 0 not null,
  streak_days integer default 0 not null,
  last_active_date date,
  last_activity jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on both tables
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Create policies for public.profiles
create policy "Allow public read access to profiles"
  on public.profiles for select
  using (true);

create policy "Allow individual user write access to their own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Create policies for public.user_progress
create policy "Allow individual user read access to their own progress"
  on public.user_progress for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Allow individual user insert access to their own progress"
  on public.user_progress for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Allow individual user update access to their own progress"
  on public.user_progress for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- Create a trigger function to handle new auth users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', substring(new.email from '([^@]+)') || '_' || substring(md5(random()::text) from 1 for 4)),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', substring(new.email from '([^@]+)')),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.user_progress (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run the function when a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to automatically update updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_user_progress_updated
  before update on public.user_progress
  for each row execute procedure public.handle_updated_at();
