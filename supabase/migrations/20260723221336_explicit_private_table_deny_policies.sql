-- These tables are intentionally server-only. Explicit deny policies make the
-- access model auditable while service_role continues to bypass RLS for the
-- authenticated Edge Functions.

create policy "Deny direct client access"
  on public.ai_usage_daily
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.credit_packs
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.credit_balances
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.credit_transactions
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.wayl_payments
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.wayl_webhook_events
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "Deny direct client access"
  on public.wallet_rate_limit_buckets
  for all
  to anon, authenticated
  using (false)
  with check (false);
