-- Local integration proof for four-tier pricing, permanent wallets, and the
-- server-only request usage ledger.
begin;

do $catalog$
begin
  if not exists (
    select 1 from public.billing_products
    where slug = 'plus-30-days' and amount = 10000 and included_credits = 2500
      and plan = 'plus' and subscription_days = 30 and active = false
  ) then raise exception 'Plus catalog mismatch'; end if;
  if not exists (
    select 1 from public.billing_products
    where slug = 'pro-30-days' and amount = 15000 and included_credits = 4500
      and plan = 'pro' and subscription_days = 30 and active = false
  ) then raise exception 'Pro catalog mismatch'; end if;
  if not exists (
    select 1 from public.billing_products
    where slug = 'max-30-days' and amount = 25000 and included_credits = 8000
      and plan = 'max' and subscription_days = 30 and active = false
  ) then raise exception 'Max catalog mismatch'; end if;
end;
$catalog$;

do $prices$
begin
  if (select credit_cost from public.ai_credit_prices where feature_key = 'live_tutor_5') <> 200
    or (select credit_cost from public.ai_credit_prices where feature_key = 'live_tutor_10') <> 400
    or (select credit_cost from public.ai_credit_prices where feature_key = 'live_tutor_15') <> 600
    or (select credit_cost from public.ai_credit_prices where feature_key = 'ai_teacher_writing') <> 15
    or (select credit_cost from public.ai_credit_prices where feature_key = 'ai_teacher_speaking') <> 20
    or (select credit_cost from public.ai_credit_prices where feature_key = 'reading_passage_generation') <> 5
    or (select credit_cost from public.ai_credit_prices where feature_key = 'roleplay_text_response') <> 5
    or (select credit_cost from public.ai_credit_prices where feature_key = 'roleplay_voice_response') <> 10
    or (select credit_cost from public.ai_credit_prices where feature_key = 'dynamic_tts_minute') <> 40
  then raise exception 'AI credit price mismatch'; end if;
  if exists (
    select 1 from public.ai_credit_prices
    where feature_key = 'roleplay_ai_response' and active = true
  ) then raise exception 'legacy roleplay price remains active'; end if;
end;
$prices$;

do $security$
begin
  if has_table_privilege('authenticated', 'public.ai_request_usage', 'SELECT')
    or has_table_privilege('authenticated', 'public.ai_request_usage', 'INSERT')
    or has_table_privilege('authenticated', 'public.ai_request_usage', 'UPDATE')
  then raise exception 'authenticated usage-ledger privilege exists'; end if;
end;
$security$;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'max-test@twino.local', '',
  now(), '{}'::jsonb, '{}'::jsonb, now(), now()
);

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency, product_type,
  included_credits, plan, subscription_days, status, provider_payment_id
)
select
  'b1111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333333', id, 'wayl', amount, currency,
  product_type, included_credits, plan, subscription_days, 'pending', 'wayl-max-test'
from public.billing_products where slug = 'max-30-days';

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency, product_type,
  included_credits, plan, subscription_days, status, provider_payment_id
)
select
  'b2222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333', id, 'wayl', amount, currency,
  product_type, included_credits, plan, subscription_days, 'pending', 'wayl-pro-after-max'
from public.billing_products where slug = 'pro-30-days';

select * from public.process_payment_order(
  'b1111111-1111-4111-8111-111111111111', 'wayl', 'wayl-max-test',
  'Complete', 'completed', 25000, 'IQD', 'test:max:complete', '{}'::jsonb
);

create temporary table max_downgrade_result as
select * from public.process_payment_order(
  'b2222222-2222-4222-8222-222222222222', 'wayl', 'wayl-pro-after-max',
  'Complete', 'completed', 15000, 'IQD', 'test:max:blocked-pro', '{}'::jsonb
);

do $max_transition$
begin
  if not exists (
    select 1 from public.subscriptions
    where user_id = '33333333-3333-4333-8333-333333333333'
      and plan = 'max' and status = 'active' and expires_at > now()
  ) then raise exception 'Max purchase did not activate'; end if;
  if not (select order_status = 'failed' from max_downgrade_result) then
    raise exception 'active Max to Pro downgrade was not blocked';
  end if;
  if (select credit_balance from public.wallets
      where user_id = '33333333-3333-4333-8333-333333333333') <> 8250 then
    raise exception 'blocked downgrade changed permanent wallet';
  end if;
end;
$max_transition$;

create temporary table usage_reservation as
select * from public.reserve_ai_credits(
  '33333333-3333-4333-8333-333333333333',
  'roleplay_text_response', 'usage-ledger-test-0001'
);

insert into public.ai_request_usage (
  reservation_id, user_id, feature, gemini_model, input_tokens,
  output_tokens, total_tokens, estimated_api_cost_usd, credits_charged,
  status, completed_at, metadata
)
select reservation_id, '33333333-3333-4333-8333-333333333333',
  'roleplay_text_response', 'gemini-3.5-flash-lite', 100, 50, 150,
  0.000155, charged_amount, 'completed', now(),
  '{"pricing":{"pricedAt":"2026-08-10"}}'::jsonb
from usage_reservation;

do $usage_row$
begin
  if not exists (
    select 1 from public.ai_request_usage
    where user_id = '33333333-3333-4333-8333-333333333333'
      and feature = 'roleplay_text_response'
      and gemini_model = 'gemini-3.5-flash-lite'
      and input_tokens = 100 and output_tokens = 50
      and total_tokens = 150 and credits_charged = 5
  ) then raise exception 'request usage ledger row mismatch'; end if;
end;
$usage_row$;

select 'PRICING_MAX_AND_AI_USAGE_LEDGER_OK';
rollback;
