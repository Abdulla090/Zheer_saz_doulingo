alter function public.handle_updated_at() set search_path = '';

-- Some early hosted environments already had this legacy table while clean
-- checkouts did not. Keep the historical hardening migration replayable; the
-- canonical payments migration creates and fully secures subscriptions.
do $$
begin
  if to_regclass('public.subscriptions') is not null then
    execute 'create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id)';
    execute 'drop policy if exists "Users can view own subscriptions" on public.subscriptions';
    execute 'create policy "Users can view own subscriptions" on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id)';
    execute 'revoke all on table public.subscriptions from anon, authenticated';
    execute 'grant select on table public.subscriptions to authenticated';
    execute 'grant all on table public.subscriptions to service_role';
  end if;
end;
$$;
