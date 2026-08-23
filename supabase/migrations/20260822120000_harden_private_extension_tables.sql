-- Private extension bookkeeping is server-only. Keep service_role access while
-- denying direct anon/authenticated table access through the Data API.
alter table if exists private.extension_access enable row level security;
alter table if exists private.extension_requests enable row level security;

drop policy if exists "Deny direct client access" on private.extension_access;
create policy "Deny direct client access"
  on private.extension_access
  for all
  to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "Deny direct client access" on private.extension_requests;
create policy "Deny direct client access"
  on private.extension_requests
  for all
  to anon, authenticated
  using (false)
  with check (false);

revoke all on table private.extension_access from anon, authenticated;
revoke all on table private.extension_requests from anon, authenticated;

-- These public-schema tables are also server-only. Explicit policies keep the
-- RLS posture auditable even when the Data API linter sees them as exposed.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'billing_products',
    'ai_credit_prices',
    'ai_credit_reservations',
    'payment_logs',
    'payment_webhook_events',
    'extension_access',
    'extension_requests'
  ] loop
    execute format('drop policy if exists "Deny direct client access" on public.%I', table_name);
    execute format(
      'create policy "Deny direct client access" on public.%I for all to anon, authenticated using (false) with check (false)',
      table_name
    );
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
  end loop;
end;
$$;

-- credit_transactions has an intentional authenticated own-row read policy;
-- remove the older overlapping deny policy so the effective policy is clear.
drop policy if exists "Deny direct client access" on public.credit_transactions;

create index if not exists wayl_payments_credit_pack_id_idx
  on public.wayl_payments (credit_pack_id);

create index if not exists wayl_webhook_events_payment_id_idx
  on public.wayl_webhook_events (payment_id);

create index if not exists ai_credit_reservations_feature_key_idx
  on public.ai_credit_reservations (feature_key);

create index if not exists ai_credit_reservations_reserve_transaction_id_idx
  on public.ai_credit_reservations (reserve_transaction_id);

create index if not exists ai_credit_reservations_reversal_transaction_id_idx
  on public.ai_credit_reservations (reversal_transaction_id);

create index if not exists payment_orders_product_id_idx
  on public.payment_orders (product_id);
