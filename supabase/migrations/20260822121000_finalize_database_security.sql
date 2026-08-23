-- Finalize deny-by-default policies and indexes after the billing migrations.
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

drop policy if exists "Deny direct client access" on public.credit_transactions;

create index if not exists ai_credit_reservations_feature_key_idx
  on public.ai_credit_reservations (feature_key);
create index if not exists ai_credit_reservations_reserve_transaction_id_idx
  on public.ai_credit_reservations (reserve_transaction_id);
create index if not exists ai_credit_reservations_reversal_transaction_id_idx
  on public.ai_credit_reservations (reversal_transaction_id);
create index if not exists payment_orders_product_id_idx
  on public.payment_orders (product_id);
