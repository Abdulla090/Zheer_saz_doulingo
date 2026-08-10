-- The leaderboard RPC joins events by learner and then applies a period
-- boundary, so lead the covering index with the foreign-key column.
drop index if exists public.leaderboard_xp_events_period_idx;

create index leaderboard_xp_events_user_period_idx
  on public.leaderboard_xp_events (user_id, occurred_at desc)
  include (xp_amount);

-- These tables are deliberately server-only. Explicit restrictive policies
-- document the denial in addition to revoked table privileges and make the
-- intended RLS posture visible to database advisors.
create policy "Signed-in users cannot read or write leaderboard XP events"
  on public.leaderboard_xp_events
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);

create policy "Signed-in users cannot read or write leaderboard XP state"
  on public.leaderboard_xp_state
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);
