-- Four-tier plans, permanent AI wallet pricing, and request-level Gemini cost
-- telemetry. Checkout products stay inactive until provider and cost-safety
-- configuration are verified independently.

alter table public.billing_products
  drop constraint if exists billing_products_plan_check,
  drop constraint if exists billing_products_shape_check;

alter table public.billing_products
  add constraint billing_products_plan_check
    check (plan is null or plan in ('plus', 'pro', 'max')),
  add constraint billing_products_shape_check check (
    (product_type = 'credits' and credits is not null and plan is null and subscription_days is null)
    or
    (product_type = 'subscription' and credits is null and plan in ('plus', 'pro', 'max') and subscription_days is not null)
  );

alter table public.payment_orders
  drop constraint if exists payment_orders_plan_check,
  drop constraint if exists payment_orders_product_shape_check;

alter table public.payment_orders
  add constraint payment_orders_plan_check
    check (plan is null or plan in ('plus', 'pro', 'max')),
  add constraint payment_orders_product_shape_check check (
    (product_type = 'credits' and credits is not null and plan is null and subscription_days is null)
    or
    (product_type = 'subscription' and credits is null and plan in ('plus', 'pro', 'max') and subscription_days is not null)
  );

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_check,
  drop constraint if exists subscriptions_expiry_check;

alter table public.subscriptions
  add constraint subscriptions_plan_check
    check (plan in ('free', 'plus', 'pro', 'max')),
  add constraint subscriptions_expiry_check check (
    (plan = 'free' and expires_at is null)
    or
    (plan in ('plus', 'pro', 'max') and expires_at is not null)
  );

insert into public.billing_products (
  slug, name, description, product_type, amount, currency, credits,
  included_credits, plan, subscription_days, active, sort_order
) values
  (
    'plus-30-days', 'Twino Plus',
    '30 days of Plus and 2,500 non-expiring AI credits.',
    'subscription', 10000, 'IQD', null, 2500, 'plus', 30, false, 100
  ),
  (
    'pro-30-days', 'Twino Pro',
    '30 days of Pro and 4,500 non-expiring AI credits.',
    'subscription', 15000, 'IQD', null, 4500, 'pro', 30, false, 110
  ),
  (
    'max-30-days', 'Twino Max',
    '30 days of Max and 8,000 non-expiring AI credits.',
    'subscription', 25000, 'IQD', null, 8000, 'max', 30, false, 120
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    product_type = excluded.product_type,
    amount = excluded.amount,
    currency = excluded.currency,
    credits = excluded.credits,
    included_credits = excluded.included_credits,
    plan = excluded.plan,
    subscription_days = excluded.subscription_days,
    active = false,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.ai_credit_prices (feature_key, credit_cost, label, metadata)
values
  ('live_tutor_5', 200, 'Live AI Tutor - 5 minutes', '{"durationMinutes":5,"pricingUnit":"block"}'::jsonb),
  ('live_tutor_10', 400, 'Live AI Tutor - 10 minutes', '{"durationMinutes":10,"pricingUnit":"block"}'::jsonb),
  ('live_tutor_15', 600, 'Live AI Tutor - 15 minutes', '{"durationMinutes":15,"pricingUnit":"block"}'::jsonb),
  ('ai_teacher_writing', 15, 'AI writing evaluation', '{"pricingUnit":"request"}'::jsonb),
  ('ai_teacher_speaking', 20, 'AI speaking evaluation', '{"pricingUnit":"request"}'::jsonb),
  ('reading_passage_generation', 5, 'Reading passage and quiz generation', '{"pricingUnit":"request"}'::jsonb),
  ('reading_pronunciation_evaluation', 20, 'Reading speaking evaluation', '{"pricingUnit":"request","category":"speaking_evaluation"}'::jsonb),
  ('roleplay_text_response', 5, 'Text AI roleplay response', '{"pricingUnit":"response"}'::jsonb),
  ('roleplay_voice_response', 10, 'Voice roleplay response', '{"pricingUnit":"response"}'::jsonb),
  ('dynamic_tts_minute', 40, 'Dynamic text-to-speech', '{"pricingUnit":"minute","staticLessonTtsCredits":0,"cacheStaticLessons":true}'::jsonb)
on conflict (feature_key) do update
set credit_cost = excluded.credit_cost,
    label = excluded.label,
    active = true,
    metadata = excluded.metadata,
    updated_at = now();

update public.ai_credit_prices
set active = false, updated_at = now()
where feature_key = 'roleplay_ai_response';

create table if not exists public.ai_request_usage (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique
    references public.ai_credit_reservations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature ~ '^[a-z][a-z0-9_]{2,63}$'),
  gemini_model text not null check (char_length(gemini_model) between 3 and 100),
  input_tokens bigint not null default 0 check (input_tokens >= 0),
  output_tokens bigint not null default 0 check (output_tokens >= 0),
  total_tokens bigint not null default 0 check (total_tokens >= 0),
  audio_input_tokens bigint not null default 0 check (audio_input_tokens >= 0),
  audio_output_tokens bigint not null default 0 check (audio_output_tokens >= 0),
  audio_duration_seconds numeric(12,3) not null default 0
    check (audio_duration_seconds >= 0),
  estimated_api_cost_usd numeric(16,8) not null default 0
    check (estimated_api_cost_usd >= 0),
  credits_charged bigint not null default 0 check (credits_charged >= 0),
  status text not null default 'started'
    check (status in ('started', 'completed', 'failed', 'billing_pending', 'abandoned')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists ai_request_usage_user_created_idx
  on public.ai_request_usage (user_id, created_at desc);
create index if not exists ai_request_usage_feature_created_idx
  on public.ai_request_usage (feature, created_at desc);
create index if not exists ai_request_usage_model_created_idx
  on public.ai_request_usage (gemini_model, created_at desc);

alter table public.ai_request_usage enable row level security;
revoke all on table public.ai_request_usage from public, anon, authenticated;
grant all on table public.ai_request_usage to service_role;

create policy "Deny direct client access"
  on public.ai_request_usage
  for all
  to anon, authenticated
  using (false)
  with check (false);

create or replace function public.twino_plan_rank(p_plan text)
returns integer
language sql
immutable
security invoker
set search_path = ''
as $$
  select case p_plan
    when 'max' then 3
    when 'pro' then 2
    when 'plus' then 1
    else 0
  end;
$$;

revoke execute on function public.twino_plan_rank(text) from public, anon, authenticated;
grant execute on function public.twino_plan_rank(text) to service_role;

-- Preserve the original atomic fulfillment implementation behind a generic
-- rank-aware guard. This also protects delayed or replayed provider callbacks,
-- not only the checkout UI.
alter function public.process_payment_order(
  uuid, text, text, text, text, bigint, text, text, jsonb
) rename to process_payment_order_legacy;

create or replace function public.process_payment_order(
  p_order_id uuid,
  p_provider text,
  p_provider_payment_id text,
  p_provider_status text,
  p_normalized_status text,
  p_verified_amount bigint,
  p_verified_currency text,
  p_event_key text,
  p_payload jsonb
)
returns table (
  order_status text,
  current_balance bigint,
  credits_applied boolean,
  subscription_plan text,
  subscription_expires_at timestamptz,
  duplicate boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.payment_orders%rowtype;
  v_subscription public.subscriptions%rowtype;
  v_balance bigint := 0;
  v_event_inserted boolean := false;
begin
  select * into v_order
    from public.payment_orders
    where id = p_order_id and provider = p_provider
    for update;

  if not found
    or p_normalized_status <> 'completed'
    or v_order.status in ('completed', 'refunded')
    or v_order.product_type <> 'subscription'
  then
    return query select * from public.process_payment_order_legacy(
      p_order_id, p_provider, p_provider_payment_id, p_provider_status,
      p_normalized_status, p_verified_amount, p_verified_currency,
      p_event_key, p_payload
    );
    return;
  end if;

  insert into public.subscriptions (user_id, plan, status, starts_at)
  values (v_order.user_id, 'free', 'active', now())
  on conflict (user_id) do nothing;

  select * into v_subscription
    from public.subscriptions
    where user_id = v_order.user_id
    for update;

  if v_subscription.status <> 'active'
    or v_subscription.expires_at is null
    or v_subscription.expires_at <= now()
    or public.twino_plan_rank(v_order.plan) >= public.twino_plan_rank(v_subscription.plan)
  then
    return query select * from public.process_payment_order_legacy(
      p_order_id, p_provider, p_provider_payment_id, p_provider_status,
      p_normalized_status, p_verified_amount, p_verified_currency,
      p_event_key, p_payload
    );
    return;
  end if;

  if p_provider not in ('wayl', 'rasedi')
    or p_event_key is null
    or char_length(p_event_key) not between 8 and 255
    or p_payload is null
  then
    raise exception using errcode = '22023', message = 'INVALID_PAYMENT_EVENT';
  end if;
  if p_verified_amount <> v_order.amount
    or upper(coalesce(p_verified_currency, '')) <> v_order.currency
  then
    raise exception using errcode = 'P0001', message = 'PAYMENT_ORDER_MISMATCH';
  end if;
  if v_order.provider_payment_id is not null
    and nullif(p_provider_payment_id, '') is not null
    and v_order.provider_payment_id <> p_provider_payment_id
  then
    raise exception using errcode = 'P0001', message = 'PROVIDER_PAYMENT_MISMATCH';
  end if;

  insert into public.payment_webhook_events (
    provider, event_key, payment_order_id, provider_status, payload
  ) values (
    p_provider, p_event_key, v_order.id, left(p_provider_status, 120), p_payload
  )
  on conflict (provider, event_key) do nothing
  returning true into v_event_inserted;

  insert into public.wallets (user_id, credit_balance)
  values (v_order.user_id, 0)
  on conflict (user_id) do nothing;
  select credit_balance into v_balance
    from public.wallets where user_id = v_order.user_id;

  if not coalesce(v_event_inserted, false) then
    return query select
      v_order.status, coalesce(v_balance, 0), false,
      v_subscription.plan, v_subscription.expires_at, true;
    return;
  end if;

  update public.payment_orders
    set provider_payment_id = coalesce(provider_payment_id, nullif(p_provider_payment_id, '')),
        provider_status = left(p_provider_status, 120),
        status = 'failed',
        failure_code = 'ACTIVE_PLAN_DOWNGRADE_BLOCKED',
        completed_at = null,
        updated_at = now()
    where id = v_order.id;
  update public.payment_webhook_events
    set processed_at = now()
    where provider = p_provider and event_key = p_event_key;

  return query select
    'failed'::text, coalesce(v_balance, 0), false,
    v_subscription.plan, v_subscription.expires_at, false;
end;
$$;

revoke execute on function public.process_payment_order_legacy(
  uuid, text, text, text, text, bigint, text, text, jsonb
) from public, anon, authenticated, service_role;
revoke execute on function public.process_payment_order(
  uuid, text, text, text, text, bigint, text, text, jsonb
) from public, anon, authenticated;
grant execute on function public.process_payment_order(
  uuid, text, text, text, text, bigint, text, text, jsonb
) to service_role;

create or replace function public.prevent_active_plan_downgrade()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.status = 'active'
    and old.expires_at > now()
    and public.twino_plan_rank(new.plan) < public.twino_plan_rank(old.plan)
  then
    raise exception using errcode = 'P0001', message = 'ACTIVE_PLAN_DOWNGRADE_BLOCKED';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_active_plan_downgrade on public.subscriptions;
create trigger prevent_active_plan_downgrade
  before update of plan on public.subscriptions
  for each row execute function public.prevent_active_plan_downgrade();

revoke execute on function public.prevent_active_plan_downgrade()
  from public, anon, authenticated;
grant execute on function public.prevent_active_plan_downgrade()
  to service_role;

create or replace function public.expire_user_subscription(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.subscriptions
    set status = 'expired', updated_at = now()
    where user_id = p_user_id
      and plan in ('plus', 'pro', 'max')
      and status = 'active'
      and expires_at <= now();

  if found then
    update public.profiles
      set is_premium = false,
          subscription_tier = 'free',
          updated_at = now()
      where id = p_user_id;
  end if;
end;
$$;

revoke execute on function public.expire_user_subscription(uuid)
  from public, anon, authenticated;
grant execute on function public.expire_user_subscription(uuid)
  to service_role;
