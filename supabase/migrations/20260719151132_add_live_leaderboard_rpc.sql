-- This security-definer RPC exposes only the small, safe profile subset needed
-- by the authenticated leaderboard. Private profile fields stay owner-only.
create or replace function public.get_leaderboard(p_limit integer default 50)
returns table (
  user_id uuid,
  rank bigint,
  display_name text,
  avatar_url text,
  selected_mascot_id text,
  total_xp integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id as user_id,
    row_number() over (
      order by greatest(coalesce(up.total_xp, 0), 0) desc, p.updated_at asc, p.id
    ) as rank,
    coalesce(nullif(trim(p.display_name), ''), 'New learner') as display_name,
    case
      when p.avatar_url ~* '^https?://'
       and p.avatar_url !~* '\.svg'
       and p.avatar_url !~* '/premade/'
      then p.avatar_url
      else null
    end as avatar_url,
    p.selected_mascot_id,
    greatest(coalesce(up.total_xp, 0), 0)::integer as total_xp
  from public.profiles p
  left join public.user_progress up on up.user_id = p.id
  order by greatest(coalesce(up.total_xp, 0), 0) desc, p.updated_at asc, p.id
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

revoke all on function public.get_leaderboard(integer) from public, anon;
grant execute on function public.get_leaderboard(integer) to authenticated;
grant execute on function public.get_leaderboard(integer) to service_role;
