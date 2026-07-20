-- Server-authoritative prepaid credit wallet and Wayl payment ledger.
-- Wayl currently accepts IQD only. No packs are seeded here because pack size
-- and price are product decisions and must not be guessed in a money flow.

create table public.credit_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  description text,
  credit_amount bigint not null check (credit_amount > 0),
  price_iqd bigint not null check (price_iqd > 0),
  currency text not null default 'IQD' check (currency = 'IQD'),
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'spend', 'refund', 'adjustment')),
  -- Signed ledger delta: purchases are positive; spends/refunds are negative.
  amount bigint not null check (amount <> 0),
  balance_after bigint not null check (balance_after >= 0),
  reference text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index credit_transactions_reference_idx
  on public.credit_transactions (reference)
  where reference is not null;

create index credit_transactions_user_created_idx
  on public.credit_transactions (user_id, created_at desc);

create table public.wayl_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference_id text not null unique,
  wayl_payment_id text unique,
  credit_pack_id uuid references public.credit_packs(id) on delete set null,
  credit_amount bigint not null check (credit_amount > 0),
  amount_iqd bigint not null check (amount_iqd > 0),
  currency text not null default 'IQD' check (currency = 'IQD'),
  checkout_url text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'expired', 'refunded')),
  wayl_status text,
  raw_webhook_payload jsonb,
  credited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wayl_payments_user_created_idx
  on public.wayl_payments (user_id, created_at desc);

create table public.wayl_webhook_events (
  signature text primary key,
  event_id text,
  payment_id uuid not null references public.wayl_payments(id) on delete cascade,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

-- Wayl's webhook `id` may identify the order rather than a unique delivery,
-- so it is searchable but not used as the idempotency key. The signature is
-- unique for an exact signed payload.
create index wayl_webhook_events_event_id_idx
  on public.wayl_webhook_events (event_id)
  where event_id is not null;

create table public.wallet_rate_limit_buckets (
  bucket_key text primary key,
  hits integer not null check (hits > 0),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.credit_packs enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.wayl_payments enable row level security;
alter table public.wayl_webhook_events enable row level security;
alter table public.wallet_rate_limit_buckets enable row level security;

-- Wallet data is available only through authenticated Edge Functions. This
-- prevents a client from ever writing balances or ledger rows directly.
revoke all on table public.credit_packs from public, anon, authenticated;
revoke all on table public.credit_balances from public, anon, authenticated;
revoke all on table public.credit_transactions from public, anon, authenticated;
revoke all on table public.wayl_payments from public, anon, authenticated;
revoke all on table public.wayl_webhook_events from public, anon, authenticated;
revoke all on table public.wallet_rate_limit_buckets from public, anon, authenticated;

grant all on table public.credit_packs to service_role;
grant all on table public.credit_balances to service_role;
grant all on table public.credit_transactions to service_role;
grant all on table public.wayl_payments to service_role;
grant all on table public.wayl_webhook_events to service_role;
grant all on table public.wallet_rate_limit_buckets to service_role;

create or replace function public.prevent_credit_transaction_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'credit transactions are immutable';
end;
$$;

create trigger credit_transactions_are_immutable
  before update or delete on public.credit_transactions
  for each row execute procedure public.prevent_credit_transaction_mutation();

revoke execute on function public.prevent_credit_transaction_mutation()
  from public, anon, authenticated;
grant execute on function public.prevent_credit_transaction_mutation()
  to service_role;

create or replace function public.consume_wallet_rate_limit(
  p_scope text,
  p_subject text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer := greatest(1, least(p_limit, 1000));
  v_window integer := greatest(10, least(p_window_seconds, 86400));
  v_window_epoch bigint;
  v_bucket_key text;
  v_hits integer;
begin
  if p_scope is null or p_subject is null then
    return false;
  end if;

  v_window_epoch :=
    floor(extract(epoch from clock_timestamp()) / v_window)::bigint * v_window;
  v_bucket_key :=
    left(p_scope, 60) || ':' || md5(p_subject) || ':' || v_window_epoch::text;

  insert into public.wallet_rate_limit_buckets (
    bucket_key,
    hits,
    expires_at,
    updated_at
  )
  values (
    v_bucket_key,
    1,
    to_timestamp(v_window_epoch + v_window),
    now()
  )
  on conflict (bucket_key) do update
    set hits = public.wallet_rate_limit_buckets.hits + 1,
        updated_at = now()
    where public.wallet_rate_limit_buckets.hits < v_limit
  returning hits into v_hits;

  return v_hits is not null and v_hits <= v_limit;
end;
$$;

revoke execute on function public.consume_wallet_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_wallet_rate_limit(text, text, integer, integer)
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

  v_reference := 'spend:' || p_idempotency_key;

  insert into public.credit_balances (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance
    into v_balance
    from public.credit_balances
    where user_id = p_user_id
    for update;

  select id, balance_after
    into v_transaction_id, v_balance
    from public.credit_transactions
    where reference = v_reference
      and user_id = p_user_id
      and type = 'spend';

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
    id,
    user_id,
    type,
    amount,
    balance_after,
    reference,
    reason
  )
  values (
    v_transaction_id,
    p_user_id,
    'spend',
    -p_amount,
    v_balance,
    v_reference,
    p_reason
  );

  update public.credit_balances
    set balance = v_balance,
        updated_at = now()
    where user_id = p_user_id;

  return query select v_balance, v_transaction_id, false;
end;
$$;

revoke execute on function public.spend_credits(uuid, bigint, text, text)
  from public, anon, authenticated;
grant execute on function public.spend_credits(uuid, bigint, text, text)
  to service_role;

create or replace function public.record_wayl_payment_event(
  p_reference_id text,
  p_signature text,
  p_event_id text,
  p_wayl_status text,
  p_normalized_status text,
  p_total_iqd bigint,
  p_payload jsonb
)
returns table (
  payment_status text,
  current_balance bigint,
  credits_applied boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.wayl_payments%rowtype;
  v_balance bigint := 0;
  v_transaction_id uuid;
  v_event_inserted boolean := false;
  v_reference text;
begin
  if p_normalized_status not in ('pending', 'paid', 'failed', 'expired', 'refunded')
    or p_signature is null
    or p_payload is null
  then
    raise exception using errcode = '22023', message = 'INVALID_WAYL_EVENT';
  end if;

  select *
    into v_payment
    from public.wayl_payments
    where reference_id = p_reference_id
    for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'WAYL_PAYMENT_NOT_FOUND';
  end if;

  insert into public.wayl_webhook_events (
    signature,
    event_id,
    payment_id,
    payload
  )
  values (
    p_signature,
    nullif(p_event_id, ''),
    v_payment.id,
    p_payload
  )
  on conflict do nothing
  returning true into v_event_inserted;

  if not coalesce(v_event_inserted, false) then
    select coalesce(balance, 0)
      into v_balance
      from public.credit_balances
      where user_id = v_payment.user_id;
    return query select v_payment.status, coalesce(v_balance, 0), false;
    return;
  end if;

  if p_normalized_status = 'paid' and p_total_iqd <> v_payment.amount_iqd then
    raise exception using errcode = 'P0001', message = 'WAYL_AMOUNT_MISMATCH';
  end if;

  update public.wayl_payments
    set wayl_status = left(p_wayl_status, 80),
        raw_webhook_payload = p_payload,
        status = case
          when status = 'refunded' then status
          when status = 'paid' and p_normalized_status <> 'refunded' then status
          else p_normalized_status
        end,
        updated_at = now()
    where id = v_payment.id
    returning * into v_payment;

  if p_normalized_status <> 'paid' then
    select coalesce(balance, 0)
      into v_balance
      from public.credit_balances
      where user_id = v_payment.user_id;
    return query select v_payment.status, coalesce(v_balance, 0), false;
    return;
  end if;

  insert into public.credit_balances (user_id, balance)
  values (v_payment.user_id, 0)
  on conflict (user_id) do nothing;

  select balance
    into v_balance
    from public.credit_balances
    where user_id = v_payment.user_id
    for update;

  v_reference := 'wayl:' || v_payment.reference_id;

  select id, balance_after
    into v_transaction_id, v_balance
    from public.credit_transactions
    where reference = v_reference
      and type = 'purchase';

  if found then
    update public.wayl_payments
      set status = case when status = 'refunded' then status else 'paid' end,
          credited_at = coalesce(credited_at, now()),
          updated_at = now()
      where id = v_payment.id;
    return query
      select
        case when v_payment.status = 'refunded' then 'refunded' else 'paid' end,
        v_balance,
        false;
    return;
  end if;

  v_balance := v_balance + v_payment.credit_amount;

  insert into public.credit_transactions (
    user_id,
    type,
    amount,
    balance_after,
    reference,
    reason,
    metadata
  )
  values (
    v_payment.user_id,
    'purchase',
    v_payment.credit_amount,
    v_balance,
    v_reference,
    'wayl_credit_pack',
    jsonb_build_object(
      'payment_id', v_payment.id,
      'credit_pack_id', v_payment.credit_pack_id,
      'amount_iqd', v_payment.amount_iqd
    )
  );

  update public.credit_balances
    set balance = v_balance,
        updated_at = now()
    where user_id = v_payment.user_id;

  update public.wayl_payments
    set status = 'paid',
        credited_at = now(),
        updated_at = now()
    where id = v_payment.id;

  return query select 'paid'::text, v_balance, true;
end;
$$;

revoke execute on function public.record_wayl_payment_event(
  text, text, text, text, text, bigint, jsonb
) from public, anon, authenticated;
grant execute on function public.record_wayl_payment_event(
  text, text, text, text, text, bigint, jsonb
) to service_role;

create trigger credit_packs_updated_at
  before update on public.credit_packs
  for each row execute procedure public.handle_updated_at();

create trigger wayl_payments_updated_at
  before update on public.wayl_payments
  for each row execute procedure public.handle_updated_at();
