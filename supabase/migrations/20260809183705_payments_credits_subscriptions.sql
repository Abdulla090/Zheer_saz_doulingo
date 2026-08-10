-- Provider-neutral Twino payments, wallet, credit ledger, and 30-day plans.
-- Monetary values are whole minor units. Wayl currently supports IQD only;
-- product prices are deliberately configured by the merchant rather than
-- guessed in source control.

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credit_balance bigint not null default 0 check (credit_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Preserve balances from the earlier Wayl-only wallet when this migration is
-- applied to an existing project.
do $$
begin
  if to_regclass('public.credit_balances') is not null then
    insert into public.wallets (user_id, credit_balance, created_at, updated_at)
    select user_id, balance, now(), updated_at
      from public.credit_balances
    on conflict (user_id) do update
      set credit_balance = greatest(
            public.wallets.credit_balance,
            excluded.credit_balance
          ),
          updated_at = greatest(public.wallets.updated_at, excluded.updated_at);
  end if;
end;
$$;

create table if not exists public.billing_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  description text,
  product_type text not null check (product_type in ('credits', 'subscription')),
  amount bigint not null check (amount > 0),
  currency text not null default 'IQD' check (currency ~ '^[A-Z]{3}$'),
  credits bigint check (credits is null or credits > 0),
  plan text check (plan is null or plan in ('plus', 'pro')),
  subscription_days integer check (
    subscription_days is null or subscription_days between 1 and 366
  ),
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_products_shape_check check (
    (product_type = 'credits' and credits is not null and plan is null and subscription_days is null)
    or
    (product_type = 'subscription' and credits is null and plan in ('plus', 'pro') and subscription_days is not null)
  )
);

-- Carry over merchant-configured credit packs without inventing prices.
do $$
begin
  if to_regclass('public.credit_packs') is not null then
    insert into public.billing_products (
      id,
      slug,
      name,
      description,
      product_type,
      amount,
      currency,
      credits,
      active,
      sort_order,
      created_at,
      updated_at
    )
    select
      id,
      slug,
      name,
      description,
      'credits',
      price_iqd,
      currency,
      credit_amount,
      active,
      sort_order,
      created_at,
      updated_at
    from public.credit_packs
    on conflict (id) do nothing;
  end if;
end;
$$;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.billing_products(id) on delete set null,
  provider text not null check (provider in ('wayl', 'rasedi')),
  amount bigint not null check (amount > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  product_type text not null check (product_type in ('credits', 'subscription')),
  credits bigint check (credits is null or credits > 0),
  plan text check (plan is null or plan in ('plus', 'pro')),
  subscription_days integer check (
    subscription_days is null or subscription_days between 1 and 366
  ),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired', 'refunded')),
  provider_payment_id text,
  provider_status text,
  checkout_url text,
  failure_code text,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_orders_product_shape_check check (
    (product_type = 'credits' and credits is not null and plan is null and subscription_days is null)
    or
    (product_type = 'subscription' and credits is null and plan in ('plus', 'pro') and subscription_days is not null)
  )
);

create unique index if not exists payment_orders_provider_payment_idx
  on public.payment_orders (provider, provider_payment_id)
  where provider_payment_id is not null;

create index if not exists payment_orders_user_created_idx
  on public.payment_orders (user_id, created_at desc);

create index if not exists payment_orders_pending_idx
  on public.payment_orders (provider, status, created_at)
  where status in ('pending', 'processing');

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'plus', 'pro')),
  status text not null default 'active'
    check (status in ('active', 'expired', 'cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  provider text check (provider is null or provider in ('wayl', 'rasedi')),
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_expiry_check check (
    (plan = 'free' and expires_at is null)
    or
    (plan in ('plus', 'pro') and expires_at is not null)
  )
);

-- Hosted projects that predated repository migrations may already contain a
-- partial subscriptions table. Add the requested columns without dropping data.
alter table public.subscriptions
  add column if not exists plan text,
  add column if not exists status text,
  add column if not exists starts_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists provider text,
  add column if not exists provider_subscription_id text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.subscriptions
set plan = case lower(coalesce(plan, 'free'))
      when 'plus' then 'plus'
      when 'pro' then 'pro'
      when 'max' then 'pro'
      else 'free'
    end,
    status = case lower(coalesce(status, 'active'))
      when 'expired' then 'expired'
      when 'cancelled' then 'cancelled'
      when 'canceled' then 'cancelled'
      else 'active'
    end,
    starts_at = coalesce(starts_at, now()),
    expires_at = case
      when lower(coalesce(plan, 'free')) in ('plus', 'pro', 'max')
        then coalesce(expires_at, now())
      else null
    end,
    created_at = coalesce(created_at, now()),
    updated_at = coalesce(updated_at, now());

create unique index if not exists subscriptions_user_id_unique_idx
  on public.subscriptions (user_id);

insert into public.wallets (user_id)
select id from auth.users
on conflict (user_id) do nothing;

insert into public.subscriptions (user_id, plan, status, starts_at)
select id, 'free', 'active', now() from auth.users
on conflict (user_id) do nothing;

alter table public.credit_transactions
  add column if not exists payment_id uuid references public.payment_orders(id) on delete restrict,
  add column if not exists provider text;

create unique index if not exists credit_transactions_payment_purchase_idx
  on public.credit_transactions (payment_id)
  where payment_id is not null and type = 'purchase';

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('wayl', 'rasedi')),
  event_key text not null,
  payment_order_id uuid not null references public.payment_orders(id) on delete cascade,
  provider_status text,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_key)
);

create index if not exists payment_webhook_events_order_idx
  on public.payment_webhook_events (payment_order_id, received_at desc);

create table if not exists public.payment_logs (
  id bigint generated by default as identity primary key,
  payment_order_id uuid references public.payment_orders(id) on delete set null,
  provider text check (provider is null or provider in ('wayl', 'rasedi')),
  level text not null check (level in ('info', 'warning', 'error')),
  event text not null check (char_length(event) between 2 and 80),
  message text not null check (char_length(message) between 1 and 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payment_logs_order_created_idx
  on public.payment_logs (payment_order_id, created_at desc);

alter table public.wallets enable row level security;
alter table public.billing_products enable row level security;
alter table public.payment_orders enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.payment_logs enable row level security;

drop policy if exists "Users can view own wallet" on public.wallets;
create policy "Users can view own wallet"
  on public.wallets for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own credit transactions" on public.credit_transactions;
create policy "Users can view own credit transactions"
  on public.credit_transactions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own payment orders" on public.payment_orders;
create policy "Users can view own payment orders"
  on public.payment_orders for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions"
  on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.wallets from public, anon, authenticated;
revoke all on table public.credit_transactions from public, anon, authenticated;
revoke all on table public.payment_orders from public, anon, authenticated;
revoke all on table public.subscriptions from public, anon, authenticated;
revoke all on table public.billing_products from public, anon, authenticated;
revoke all on table public.payment_webhook_events from public, anon, authenticated;
revoke all on table public.payment_logs from public, anon, authenticated;

grant select on table public.wallets to authenticated;
grant select on table public.credit_transactions to authenticated;
grant select on table public.payment_orders to authenticated;
grant select on table public.subscriptions to authenticated;

grant all on table public.wallets to service_role;
grant all on table public.credit_transactions to service_role;
grant all on table public.payment_orders to service_role;
grant all on table public.subscriptions to service_role;
grant all on table public.billing_products to service_role;
grant all on table public.payment_webhook_events to service_role;
grant all on table public.payment_logs to service_role;
grant usage, select on sequence public.payment_logs_id_seq to service_role;

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
  v_balance bigint := 0;
  v_event_inserted boolean := false;
  v_credits_applied boolean := false;
  v_subscription_plan text := 'free';
  v_subscription_expires_at timestamptz;
  v_base_expiry timestamptz;
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
    provider,
    event_key,
    payment_order_id,
    provider_status,
    payload
  ) values (
    p_provider,
    p_event_key,
    v_order.id,
    left(p_provider_status, 120),
    p_payload
  )
  on conflict (provider, event_key) do nothing
  returning true into v_event_inserted;

  select coalesce(credit_balance, 0) into v_balance
    from public.wallets where user_id = v_order.user_id;

  select plan, expires_at
    into v_subscription_plan, v_subscription_expires_at
    from public.subscriptions where user_id = v_order.user_id;

  if not coalesce(v_event_inserted, false) or v_order.status = 'completed' then
    return query select
      v_order.status,
      coalesce(v_balance, 0),
      false,
      coalesce(v_subscription_plan, 'free'),
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
      v_order.status,
      coalesce(v_balance, 0),
      false,
      coalesce(v_subscription_plan, 'free'),
      v_subscription_expires_at,
      false;
    return;
  end if;

  if v_order.product_type = 'credits' then
    insert into public.wallets (user_id, credit_balance)
    values (v_order.user_id, 0)
    on conflict (user_id) do nothing;

    select credit_balance into v_balance
      from public.wallets
      where user_id = v_order.user_id
      for update;

    if not exists (
      select 1 from public.credit_transactions
      where payment_id = v_order.id and type = 'purchase'
    ) then
      v_balance := v_balance + v_order.credits;

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
        v_order.credits,
        v_balance,
        v_order.id,
        v_order.provider,
        'payment:' || v_order.id::text,
        'credit_purchase',
        jsonb_build_object(
          'provider', v_order.provider,
          'amount', v_order.amount,
          'currency', v_order.currency,
          'product_id', v_order.product_id
        )
      );

      update public.wallets
        set credit_balance = v_balance, updated_at = now()
        where user_id = v_order.user_id;
      v_credits_applied := true;
    end if;
  else
    insert into public.subscriptions (user_id, plan, status, starts_at)
    values (v_order.user_id, 'free', 'active', now())
    on conflict (user_id) do nothing;

    select
      case
        when status = 'active' and expires_at > now() then expires_at
        else now()
      end
    into v_base_expiry
    from public.subscriptions
    where user_id = v_order.user_id
    for update;

    v_subscription_expires_at :=
      v_base_expiry + make_interval(days => v_order.subscription_days);
    v_subscription_plan := v_order.plan;

    update public.subscriptions
      set plan = v_order.plan,
          status = 'active',
          starts_at = now(),
          expires_at = v_subscription_expires_at,
          provider = v_order.provider,
          -- Wayl's documented link flow is a manual 30-day purchase, not a
          -- recurring subscription identifier.
          provider_subscription_id = null,
          updated_at = now()
      where user_id = v_order.user_id;

    update public.profiles
      set is_premium = true,
          subscription_tier = v_order.plan,
          updated_at = now()
      where id = v_order.user_id;
  end if;

  update public.payment_webhook_events
    set processed_at = now()
    where provider = p_provider and event_key = p_event_key;

  return query select
    'completed'::text,
    coalesce(v_balance, 0),
    v_credits_applied,
    coalesce(v_subscription_plan, 'free'),
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
      and plan in ('plus', 'pro')
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

create or replace function public.spend_credits(
  p_user_id uuid,
  p_amount bigint,
  p_reason text,
  p_idempotency_key text
)
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
  v_reference text;
begin
  if p_user_id is null
    or p_amount <= 0
    or char_length(coalesce(p_reason, '')) not between 3 and 100
    or char_length(coalesce(p_idempotency_key, '')) not between 8 and 120
  then
    raise exception using errcode = '22023', message = 'INVALID_SPEND_REQUEST';
  end if;

  v_reference := 'spend:' || p_user_id::text || ':' || p_idempotency_key;

  insert into public.wallets (user_id, credit_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select credit_balance into v_balance
    from public.wallets where user_id = p_user_id for update;

  select id, balance_after into v_transaction_id, v_balance
    from public.credit_transactions
    where reference = v_reference and user_id = p_user_id and type = 'spend';

  if found then
    return query select v_balance, v_transaction_id, true;
    return;
  end if;

  if v_balance < p_amount then
    raise exception using errcode = 'P0001', message = 'INSUFFICIENT_CREDITS';
  end if;

  v_balance := v_balance - p_amount;
  v_transaction_id := gen_random_uuid();

  insert into public.credit_transactions (
    id, user_id, type, amount, balance_after, reference, reason
  ) values (
    v_transaction_id,
    p_user_id,
    'spend',
    -p_amount,
    v_balance,
    v_reference,
    p_reason
  );

  update public.wallets
    set credit_balance = v_balance, updated_at = now()
    where user_id = p_user_id;

  return query select v_balance, v_transaction_id, false;
end;
$$;

revoke execute on function public.spend_credits(uuid, bigint, text, text)
  from public, anon, authenticated;
grant execute on function public.spend_credits(uuid, bigint, text, text)
  to service_role;

-- Preserve the latest mascot-aware signup behavior and initialize billing rows
-- for every new Supabase Auth user.
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
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

drop trigger if exists wallets_updated_at on public.wallets;
create trigger wallets_updated_at
  before update on public.wallets
  for each row execute procedure public.handle_updated_at();

drop trigger if exists billing_products_updated_at on public.billing_products;
create trigger billing_products_updated_at
  before update on public.billing_products
  for each row execute procedure public.handle_updated_at();

drop trigger if exists payment_orders_updated_at on public.payment_orders;
create trigger payment_orders_updated_at
  before update on public.payment_orders
  for each row execute procedure public.handle_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
