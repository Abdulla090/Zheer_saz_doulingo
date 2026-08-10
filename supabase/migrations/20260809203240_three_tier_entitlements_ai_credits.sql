-- Twino launch entitlements and server-authoritative AI credit accounting.
-- Subscription products remain inactive until a payment provider is verified.

alter table public.billing_products
  add column if not exists included_credits bigint not null default 0
    check (included_credits >= 0);

alter table public.payment_orders
  add column if not exists included_credits bigint not null default 0
    check (included_credits >= 0);

insert into public.billing_products (
  slug,
  name,
  description,
  product_type,
  amount,
  currency,
  credits,
  included_credits,
  plan,
  subscription_days,
  active,
  sort_order
) values
  (
    'plus-30-days',
    'Twino Plus',
    '30 days of Plus and 2,500 non-expiring AI credits.',
    'subscription',
    10000,
    'IQD',
    null,
    2500,
    'plus',
    30,
    false,
    100
  ),
  (
    'pro-30-days',
    'Twino Pro',
    '30 days of Pro and 7,500 non-expiring AI credits.',
    'subscription',
    25000,
    'IQD',
    null,
    7500,
    'pro',
    30,
    false,
    110
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
    -- Never activate checkout from a migration.
    active = false,
    sort_order = excluded.sort_order,
    updated_at = now();

create table if not exists public.ai_credit_prices (
  feature_key text primary key check (feature_key ~ '^[a-z][a-z0-9_]{2,63}$'),
  credit_cost bigint not null check (credit_cost > 0),
  label text not null check (char_length(label) between 2 and 80),
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.ai_credit_prices (feature_key, credit_cost, label, metadata)
values
  ('live_tutor_5', 100, 'Live AI Tutor - 5 minutes', '{"durationMinutes":5}'::jsonb),
  ('live_tutor_10', 200, 'Live AI Tutor - 10 minutes', '{"durationMinutes":10}'::jsonb),
  ('live_tutor_15', 300, 'Live AI Tutor - 15 minutes', '{"durationMinutes":15}'::jsonb),
  ('ai_teacher_writing', 20, 'AI Teacher writing evaluation', '{}'::jsonb),
  ('ai_teacher_speaking', 40, 'AI Teacher speaking evaluation', '{}'::jsonb),
  ('reading_passage_generation', 15, 'Reading Practice AI passage', '{}'::jsonb),
  ('reading_pronunciation_evaluation', 30, 'Gemini pronunciation evaluation', '{}'::jsonb),
  ('roleplay_ai_response', 5, 'AI Roleplay response', '{}'::jsonb)
on conflict (feature_key) do update
set credit_cost = excluded.credit_cost,
    label = excluded.label,
    active = true,
    metadata = excluded.metadata,
    updated_at = now();

create table if not exists public.ai_credit_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null references public.ai_credit_prices(feature_key) on delete restrict,
  amount bigint not null check (amount > 0),
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 120),
  status text not null default 'reserved'
    check (status in ('reserved', 'settled', 'reversed')),
  reserve_transaction_id uuid not null references public.credit_transactions(id) on delete restrict,
  reversal_transaction_id uuid references public.credit_transactions(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  reserved_at timestamptz not null default now(),
  settled_at timestamptz,
  reversed_at timestamptz,
  unique (user_id, idempotency_key)
);

create index if not exists ai_credit_reservations_user_created_idx
  on public.ai_credit_reservations (user_id, reserved_at desc);

create index if not exists ai_credit_reservations_open_idx
  on public.ai_credit_reservations (user_id, status, reserved_at)
  where status = 'reserved';

alter table public.ai_credit_prices enable row level security;
alter table public.ai_credit_reservations enable row level security;

revoke all on table public.ai_credit_prices from public, anon, authenticated;
revoke all on table public.ai_credit_reservations from public, anon, authenticated;
grant all on table public.ai_credit_prices to service_role;
grant all on table public.ai_credit_reservations to service_role;

create trigger ai_credit_prices_updated_at
  before update on public.ai_credit_prices
  for each row execute procedure public.handle_updated_at();

create or replace function public.grant_starter_credits(p_user_id uuid)
returns table (
  new_balance bigint,
  transaction_id uuid,
  duplicate boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance bigint;
  v_transaction_id uuid;
  v_reference text := 'starter:' || p_user_id::text;
begin
  if p_user_id is null then
    raise exception using errcode = '22023', message = 'INVALID_STARTER_GRANT';
  end if;

  insert into public.wallets (user_id, credit_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select credit_balance into v_balance
    from public.wallets
    where user_id = p_user_id
    for update;

  select id, balance_after into v_transaction_id, v_balance
    from public.credit_transactions
    where user_id = p_user_id and reference = v_reference;

  if found then
    return query select v_balance, v_transaction_id, true;
    return;
  end if;

  v_balance := v_balance + 250;
  v_transaction_id := gen_random_uuid();

  insert into public.credit_transactions (
    id, user_id, type, amount, balance_after, reference, reason, metadata
  ) values (
    v_transaction_id,
    p_user_id,
    'adjustment',
    250,
    v_balance,
    v_reference,
    'free_account_starter_credits',
    '{"grant":"starter","credits":250}'::jsonb
  );

  update public.wallets
    set credit_balance = v_balance, updated_at = now()
    where user_id = p_user_id;

  return query select v_balance, v_transaction_id, false;
end;
$$;

revoke execute on function public.grant_starter_credits(uuid)
  from public, anon, authenticated;
grant execute on function public.grant_starter_credits(uuid)
  to service_role;

create or replace function public.reserve_ai_credits(
  p_user_id uuid,
  p_feature_key text,
  p_idempotency_key text
)
returns table (
  new_balance bigint,
  charged_amount bigint,
  reservation_id uuid,
  reservation_status text,
  duplicate boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance bigint;
  v_cost bigint;
  v_reservation public.ai_credit_reservations%rowtype;
  v_reservation_id uuid := gen_random_uuid();
  v_transaction_id uuid := gen_random_uuid();
  v_reference text;
begin
  if p_user_id is null
    or p_feature_key !~ '^[a-z][a-z0-9_]{2,63}$'
    or char_length(coalesce(p_idempotency_key, '')) not between 8 and 120
  then
    raise exception using errcode = '22023', message = 'INVALID_AI_RESERVATION';
  end if;

  select credit_cost into v_cost
    from public.ai_credit_prices
    where feature_key = p_feature_key and active = true;

  if not found then
    raise exception using errcode = '22023', message = 'AI_FEATURE_NOT_CONFIGURED';
  end if;

  insert into public.wallets (user_id, credit_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select credit_balance into v_balance
    from public.wallets
    where user_id = p_user_id
    for update;

  select * into v_reservation
    from public.ai_credit_reservations
    where user_id = p_user_id and idempotency_key = p_idempotency_key;

  if found then
    if v_reservation.feature_key <> p_feature_key then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_CONFLICT';
    end if;
    return query select
      v_balance,
      v_reservation.amount,
      v_reservation.id,
      v_reservation.status,
      true;
    return;
  end if;

  if v_balance < v_cost then
    raise exception using errcode = 'P0001', message = 'INSUFFICIENT_CREDITS';
  end if;

  v_balance := v_balance - v_cost;
  v_reference := 'ai:reserve:' || v_reservation_id::text;

  insert into public.credit_transactions (
    id, user_id, type, amount, balance_after, reference, reason, metadata
  ) values (
    v_transaction_id,
    p_user_id,
    'spend',
    -v_cost,
    v_balance,
    v_reference,
    p_feature_key,
    jsonb_build_object(
      'state', 'reserved',
      'featureKey', p_feature_key,
      'idempotencyKey', p_idempotency_key,
      'reservationId', v_reservation_id
    )
  );

  insert into public.ai_credit_reservations (
    id,
    user_id,
    feature_key,
    amount,
    idempotency_key,
    reserve_transaction_id
  ) values (
    v_reservation_id,
    p_user_id,
    p_feature_key,
    v_cost,
    p_idempotency_key,
    v_transaction_id
  );

  update public.wallets
    set credit_balance = v_balance, updated_at = now()
    where user_id = p_user_id;

  return query select v_balance, v_cost, v_reservation_id, 'reserved'::text, false;
end;
$$;

revoke execute on function public.reserve_ai_credits(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.reserve_ai_credits(uuid, text, text)
  to service_role;

create or replace function public.settle_ai_credits(
  p_user_id uuid,
  p_reservation_id uuid
)
returns table (
  new_balance bigint,
  charged_amount bigint,
  reservation_id uuid,
  reservation_status text,
  duplicate boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reservation public.ai_credit_reservations%rowtype;
  v_balance bigint;
begin
  select * into v_reservation
    from public.ai_credit_reservations
    where id = p_reservation_id and user_id = p_user_id
    for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'AI_RESERVATION_NOT_FOUND';
  end if;

  select credit_balance into v_balance
    from public.wallets
    where user_id = p_user_id;

  if v_reservation.status = 'settled' then
    return query select
      v_balance, v_reservation.amount, v_reservation.id, v_reservation.status, true;
    return;
  end if;

  if v_reservation.status = 'reversed' then
    raise exception using errcode = 'P0001', message = 'AI_RESERVATION_REVERSED';
  end if;

  update public.ai_credit_reservations
    set status = 'settled', settled_at = now()
    where id = v_reservation.id;

  return query select
    v_balance, v_reservation.amount, v_reservation.id, 'settled'::text, false;
end;
$$;

revoke execute on function public.settle_ai_credits(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.settle_ai_credits(uuid, uuid)
  to service_role;

create or replace function public.reverse_ai_credits(
  p_user_id uuid,
  p_reservation_id uuid,
  p_reason text default 'ai_provider_failure'
)
returns table (
  new_balance bigint,
  charged_amount bigint,
  reservation_id uuid,
  reservation_status text,
  duplicate boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reservation public.ai_credit_reservations%rowtype;
  v_balance bigint;
  v_transaction_id uuid := gen_random_uuid();
begin
  select * into v_reservation
    from public.ai_credit_reservations
    where id = p_reservation_id and user_id = p_user_id
    for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'AI_RESERVATION_NOT_FOUND';
  end if;

  select credit_balance into v_balance
    from public.wallets
    where user_id = p_user_id
    for update;

  if v_reservation.status = 'reversed' then
    return query select
      v_balance, v_reservation.amount, v_reservation.id, v_reservation.status, true;
    return;
  end if;

  if v_reservation.status = 'settled' then
    raise exception using errcode = 'P0001', message = 'AI_RESERVATION_ALREADY_SETTLED';
  end if;

  v_balance := v_balance + v_reservation.amount;

  insert into public.credit_transactions (
    id, user_id, type, amount, balance_after, reference, reason, metadata
  ) values (
    v_transaction_id,
    p_user_id,
    'refund',
    v_reservation.amount,
    v_balance,
    'ai:reverse:' || v_reservation.id::text,
    left(coalesce(nullif(p_reason, ''), 'ai_provider_failure'), 100),
    jsonb_build_object(
      'state', 'reversed',
      'featureKey', v_reservation.feature_key,
      'reservationId', v_reservation.id
    )
  );

  update public.ai_credit_reservations
    set status = 'reversed',
        reversal_transaction_id = v_transaction_id,
        reversed_at = now()
    where id = v_reservation.id;

  update public.wallets
    set credit_balance = v_balance, updated_at = now()
    where user_id = p_user_id;

  return query select
    v_balance, v_reservation.amount, v_reservation.id, 'reversed'::text, false;
end;
$$;

revoke execute on function public.reverse_ai_credits(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.reverse_ai_credits(uuid, uuid, text)
  to service_role;

-- A verified payment is fulfilled exactly once. Subscription credit amounts
-- come from the immutable order snapshot, never the current catalog row.
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
  v_credits_applied boolean := false;
  v_subscription_plan text := 'free';
  v_subscription_expires_at timestamptz;
  v_base_expiry timestamptz;
  v_grant bigint := 0;
begin
  if p_provider not in ('wayl', 'rasedi')
    or p_normalized_status not in (
      'pending', 'processing', 'completed', 'failed', 'cancelled', 'expired', 'refunded'
    )
    or p_event_key is null
    or char_length(p_event_key) not between 8 and 255
    or p_payload is null
  then
    raise exception using errcode = '22023', message = 'INVALID_PAYMENT_EVENT';
  end if;

  select * into v_order
    from public.payment_orders
    where id = p_order_id and provider = p_provider
    for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'PAYMENT_ORDER_NOT_FOUND';
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

  insert into public.subscriptions (user_id, plan, status, starts_at)
  values (v_order.user_id, 'free', 'active', now())
  on conflict (user_id) do nothing;

  select credit_balance into v_balance
    from public.wallets where user_id = v_order.user_id;

  select * into v_subscription
    from public.subscriptions where user_id = v_order.user_id;
  v_subscription_plan := coalesce(v_subscription.plan, 'free');
  v_subscription_expires_at := v_subscription.expires_at;

  if not coalesce(v_event_inserted, false) or v_order.status = 'completed' then
    return query select
      v_order.status,
      coalesce(v_balance, 0),
      false,
      v_subscription_plan,
      v_subscription_expires_at,
      true;
    return;
  end if;

  if p_normalized_status = 'completed' then
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
  end if;

  -- A stale Plus checkout must never silently downgrade an active Pro plan.
  if p_normalized_status = 'completed'
    and v_order.product_type = 'subscription'
    and v_order.plan = 'plus'
    and v_subscription.plan = 'pro'
    and v_subscription.status = 'active'
    and v_subscription.expires_at > now()
  then
    update public.payment_orders
      set provider_payment_id = coalesce(provider_payment_id, nullif(p_provider_payment_id, '')),
          provider_status = left(p_provider_status, 120),
          status = 'failed',
          failure_code = 'ACTIVE_PRO_DOWNGRADE_BLOCKED',
          updated_at = now()
      where id = v_order.id;
    update public.payment_webhook_events
      set processed_at = now()
      where provider = p_provider and event_key = p_event_key;
    return query select
      'failed'::text, v_balance, false, 'pro'::text,
      v_subscription.expires_at, false;
    return;
  end if;

  update public.payment_orders
    set provider_payment_id = coalesce(provider_payment_id, nullif(p_provider_payment_id, '')),
        provider_status = left(p_provider_status, 120),
        status = case
          when status = 'refunded' then status
          when status = 'completed' and p_normalized_status <> 'refunded' then status
          else p_normalized_status
        end,
        completed_at = case
          when p_normalized_status = 'completed' then coalesce(completed_at, now())
          else completed_at
        end,
        updated_at = now()
    where id = v_order.id
    returning * into v_order;

  if p_normalized_status <> 'completed' then
    update public.payment_webhook_events
      set processed_at = now()
      where provider = p_provider and event_key = p_event_key;
    return query select
      v_order.status, v_balance, false, v_subscription_plan,
      v_subscription_expires_at, false;
    return;
  end if;

  if v_order.product_type = 'subscription' then
    select * into v_subscription
      from public.subscriptions
      where user_id = v_order.user_id
      for update;

    if v_order.plan = 'plus'
      and v_subscription.plan = 'pro'
      and v_subscription.status = 'active'
      and v_subscription.expires_at > now()
    then
      update public.payment_orders
        set status = 'failed',
            failure_code = 'ACTIVE_PRO_DOWNGRADE_BLOCKED',
            completed_at = null,
            updated_at = now()
        where id = v_order.id;
      update public.payment_webhook_events
        set processed_at = now()
        where provider = p_provider and event_key = p_event_key;
      return query select
        'failed'::text, v_balance, false, 'pro'::text,
        v_subscription.expires_at, false;
      return;
    end if;

    if v_subscription.plan = v_order.plan
      and v_subscription.status = 'active'
      and v_subscription.expires_at > now()
    then
      v_base_expiry := v_subscription.expires_at;
    else
      v_base_expiry := now();
    end if;

    v_subscription_expires_at :=
      v_base_expiry + make_interval(days => v_order.subscription_days);
    v_subscription_plan := v_order.plan;

    update public.subscriptions
      set plan = v_order.plan,
          status = 'active',
          starts_at = case
            when v_subscription.plan = v_order.plan
              and v_subscription.status = 'active'
              and v_subscription.expires_at > now()
              then v_subscription.starts_at
            else now()
          end,
          expires_at = v_subscription_expires_at,
          provider = v_order.provider,
          provider_subscription_id = null,
          updated_at = now()
      where user_id = v_order.user_id;

    update public.profiles
      set is_premium = true,
          subscription_tier = v_order.plan,
          updated_at = now()
      where id = v_order.user_id;

    v_grant := v_order.included_credits;
  else
    v_grant := v_order.credits;
  end if;

  if coalesce(v_grant, 0) > 0 then
    select credit_balance into v_balance
      from public.wallets
      where user_id = v_order.user_id
      for update;

    if not exists (
      select 1 from public.credit_transactions
      where payment_id = v_order.id and type = 'purchase'
    ) then
      v_balance := v_balance + v_grant;

      insert into public.credit_transactions (
        user_id,
        type,
        amount,
        balance_after,
        payment_id,
        provider,
        reference,
        reason,
        metadata
      ) values (
        v_order.user_id,
        'purchase',
        v_grant,
        v_balance,
        v_order.id,
        v_order.provider,
        'payment:' || v_order.id::text,
        case
          when v_order.product_type = 'subscription'
            then 'subscription_included_credits'
          else 'credit_purchase'
        end,
        jsonb_build_object(
          'provider', v_order.provider,
          'amount', v_order.amount,
          'currency', v_order.currency,
          'product_id', v_order.product_id,
          'product_type', v_order.product_type,
          'plan', v_order.plan,
          'included_credits', v_order.included_credits
        )
      );

      update public.wallets
        set credit_balance = v_balance, updated_at = now()
        where user_id = v_order.user_id;
      v_credits_applied := true;
    end if;
  end if;

  update public.payment_webhook_events
    set processed_at = now()
    where provider = p_provider and event_key = p_event_key;

  return query select
    'completed'::text,
    coalesce(v_balance, 0),
    v_credits_applied,
    v_subscription_plan,
    v_subscription_expires_at,
    false;
end;
$$;

revoke execute on function public.process_payment_order(
  uuid, text, text, text, text, bigint, text, text, jsonb
) from public, anon, authenticated;
grant execute on function public.process_payment_order(
  uuid, text, text, text, text, bigint, text, text, jsonb
) to service_role;

-- Keep the existing signup behavior, then make the starter grant part of the
-- same Auth transaction. The unique ledger reference makes retries harmless.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_mascot text;
begin
  requested_mascot := new.raw_user_meta_data->>'selected_mascot_id';

  if requested_mascot is null or requested_mascot not in (
    'pingo', 'violet', 'biscuit', 'waddle', 'sparkle', 'orbit',
    'ember', 'quacks', 'momo', 'buzzwell', 'sprout', 'moonbun'
  ) then
    requested_mascot := 'pingo';
  end if;

  insert into public.profiles (
    id, username, display_name, avatar_url, selected_mascot_id
  ) values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)') || '_' ||
        substring(md5(random()::text) from 1 for 4)
    ),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'username',
      substring(new.email from '([^@]+)')
    ),
    null,
    requested_mascot
  );

  insert into public.user_progress (user_id) values (new.id);
  insert into public.wallets (user_id) values (new.id);
  insert into public.subscriptions (user_id, plan, status, starts_at)
    values (new.id, 'free', 'active', now());
  perform public.grant_starter_credits(new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
