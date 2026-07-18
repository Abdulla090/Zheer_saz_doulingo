alter function public.handle_updated_at() set search_path = '';

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

drop policy if exists "Users can view own subscriptions"
  on public.subscriptions;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.subscriptions from anon, authenticated;
grant select on table public.subscriptions to authenticated;
grant all on table public.subscriptions to service_role;
