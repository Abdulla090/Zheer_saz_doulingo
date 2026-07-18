create table if not exists public.ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

alter table public.ai_usage_daily enable row level security;

revoke all on table public.ai_usage_daily from public, anon, authenticated;
grant all on table public.ai_usage_daily to service_role;

create or replace function public.consume_ai_quota(
  p_user_id uuid,
  p_daily_limit integer default 120
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  consumed boolean;
  safe_limit integer := greatest(1, least(p_daily_limit, 500));
begin
  insert into public.ai_usage_daily (user_id, usage_date, request_count, updated_at)
  values (p_user_id, current_date, 1, now())
  on conflict (user_id, usage_date) do update
    set request_count = public.ai_usage_daily.request_count + 1,
        updated_at = now()
    where public.ai_usage_daily.request_count < safe_limit
  returning true into consumed;

  return coalesce(consumed, false);
end;
$$;

revoke all on function public.consume_ai_quota(uuid, integer) from public;
revoke all on function public.consume_ai_quota(uuid, integer) from anon, authenticated;
grant execute on function public.consume_ai_quota(uuid, integer) to service_role;
