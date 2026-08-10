-- Local integration proof for plan transitions and the AI reservation state machine.
begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '22222222-2222-4222-8222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'entitlements-test@twino.local', '',
  now(), '{}'::jsonb, '{}'::jsonb, now(), now()
);

create temporary table duplicate_starter as
select * from public.grant_starter_credits(
  '22222222-2222-4222-8222-222222222222'
);

insert into public.billing_products (
  id, slug, name, product_type, amount, currency,
  included_credits, plan, subscription_days, active
) values
  (
    'f1111111-1111-4111-8111-111111111111',
    'test-transition-plus', 'Transition Plus', 'subscription', 10000, 'IQD',
    2500, 'plus', 30, true
  ),
  (
    'f2222222-2222-4222-8222-222222222222',
    'test-transition-pro', 'Transition Pro', 'subscription', 15000, 'IQD',
    4500, 'pro', 30, true
  );

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency, product_type,
  included_credits, plan, subscription_days, status, provider_payment_id
) values
  (
    'a1111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
    'f1111111-1111-4111-8111-111111111111',
    'wayl', 10000, 'IQD', 'subscription', 2500, 'plus', 30,
    'pending', 'wayl-transition-plus-1'
  ),
  (
    'a2222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    'f1111111-1111-4111-8111-111111111111',
    'wayl', 10000, 'IQD', 'subscription', 2500, 'plus', 30,
    'pending', 'wayl-transition-plus-2'
  ),
  (
    'a3333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'f2222222-2222-4222-8222-222222222222',
    'wayl', 15000, 'IQD', 'subscription', 4500, 'pro', 30,
    'pending', 'wayl-transition-pro'
  ),
  (
    'a4444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'f1111111-1111-4111-8111-111111111111',
    'wayl', 10000, 'IQD', 'subscription', 2500, 'plus', 30,
    'pending', 'wayl-blocked-downgrade'
  );

select * from public.process_payment_order(
  'a1111111-1111-4111-8111-111111111111', 'wayl', 'wayl-transition-plus-1',
  'Complete', 'completed', 10000, 'IQD', 'test:transition:plus:1',
  '{"source":"entitlement-test"}'::jsonb
);

create temporary table first_plus_expiry as
select expires_at from public.subscriptions
where user_id = '22222222-2222-4222-8222-222222222222';

select * from public.process_payment_order(
  'a2222222-2222-4222-8222-222222222222', 'wayl', 'wayl-transition-plus-2',
  'Complete', 'completed', 10000, 'IQD', 'test:transition:plus:2',
  '{"source":"entitlement-test"}'::jsonb
);

do $renewal$
begin
  if not exists (
    select 1 from public.subscriptions s, first_plus_expiry first
    where s.user_id = '22222222-2222-4222-8222-222222222222'
      and s.plan = 'plus'
      and s.expires_at = first.expires_at + interval '30 days'
  ) then
    raise exception 'same-plan renewal did not extend from current expiry';
  end if;
end;
$renewal$;

select * from public.process_payment_order(
  'a3333333-3333-4333-8333-333333333333', 'wayl', 'wayl-transition-pro',
  'Complete', 'completed', 15000, 'IQD', 'test:transition:pro',
  '{"source":"entitlement-test"}'::jsonb
);

create temporary table blocked_downgrade as
select * from public.process_payment_order(
  'a4444444-4444-4444-8444-444444444444', 'wayl', 'wayl-blocked-downgrade',
  'Complete', 'completed', 10000, 'IQD', 'test:transition:blocked-plus',
  '{"source":"entitlement-test"}'::jsonb
);

create temporary table roleplay_reservation as
select * from public.reserve_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  'roleplay_voice_response',
  'roleplay-test-request-0001'
);

create temporary table roleplay_duplicate as
select * from public.reserve_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  'roleplay_voice_response',
  'roleplay-test-request-0001'
);

create temporary table roleplay_settled as
select settled.* from roleplay_reservation reserved
cross join lateral public.settle_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  reserved.reservation_id
) settled;

create temporary table roleplay_settle_duplicate as
select settled.* from roleplay_reservation reserved
cross join lateral public.settle_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  reserved.reservation_id
) settled;

create temporary table pronunciation_reservation as
select * from public.reserve_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  'reading_pronunciation_evaluation',
  'pronunciation-test-request-0001'
);

create temporary table pronunciation_reversed as
select reversed.* from pronunciation_reservation reserved
cross join lateral public.reverse_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  reserved.reservation_id,
  'test_provider_failure'
) reversed;

create temporary table pronunciation_reverse_duplicate as
select reversed.* from pronunciation_reservation reserved
cross join lateral public.reverse_ai_credits(
  '22222222-2222-4222-8222-222222222222',
  reserved.reservation_id,
  'test_provider_failure'
) reversed;

do $assertions$
begin
  if not (select duplicate from duplicate_starter) then
    raise exception 'starter grant is not idempotent';
  end if;
  if (select count(*) from public.credit_transactions
      where reference = 'starter:22222222-2222-4222-8222-222222222222') <> 1 then
    raise exception 'starter ledger reference is not unique';
  end if;
  if not exists (
    select 1 from public.subscriptions
    where user_id = '22222222-2222-4222-8222-222222222222'
      and plan = 'pro' and status = 'active'
      and expires_at > now() + interval '29 days'
      and expires_at < now() + interval '31 days'
  ) then
    raise exception 'Plus-to-Pro upgrade was not immediate';
  end if;
  if not (select order_status = 'failed' from blocked_downgrade) then
    raise exception 'active Pro to Plus downgrade was not blocked';
  end if;
  if (select status from public.payment_orders
      where id = 'a4444444-4444-4444-8444-444444444444') <> 'failed' then
    raise exception 'blocked downgrade order status is wrong';
  end if;
  if (select credit_balance from public.wallets
      where user_id = '22222222-2222-4222-8222-222222222222') <> 9740 then
    raise exception 'wallet result after grants and AI operations is wrong';
  end if;
  if not (select duplicate and reservation_status = 'reserved' from roleplay_duplicate) then
    raise exception 'duplicate reservation was not recognized';
  end if;
  if not (select reservation_status = 'settled' and not duplicate from roleplay_settled) then
    raise exception 'reservation did not settle';
  end if;
  if not (select reservation_status = 'settled' and duplicate from roleplay_settle_duplicate) then
    raise exception 'settlement is not idempotent';
  end if;
  if not (select reservation_status = 'reversed' and not duplicate from pronunciation_reversed) then
    raise exception 'reservation did not reverse';
  end if;
  if not (select reservation_status = 'reversed' and duplicate from pronunciation_reverse_duplicate) then
    raise exception 'reversal is not idempotent';
  end if;
  if has_function_privilege(
    'authenticated',
    'public.reserve_ai_credits(uuid,text,text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated AI reserve execute privilege exists';
  end if;
end;
$assertions$;

do $settled_cannot_reverse$
declare
  v_id uuid;
begin
  select reservation_id into v_id from roleplay_reservation;
  perform * from public.reverse_ai_credits(
    '22222222-2222-4222-8222-222222222222',
    v_id,
    'should_not_refund'
  );
  raise exception 'EXPECTED_SETTLED_REVERSAL_REJECTION';
exception
  when sqlstate 'P0001' then
    if sqlerrm <> 'AI_RESERVATION_ALREADY_SETTLED' then
      raise;
    end if;
end;
$settled_cannot_reverse$;

update public.subscriptions
set expires_at = now() - interval '1 second'
where user_id = '22222222-2222-4222-8222-222222222222';

select public.expire_user_subscription(
  '22222222-2222-4222-8222-222222222222'
);

do $expiry_keeps_credits$
begin
  if (select credit_balance from public.wallets
      where user_id = '22222222-2222-4222-8222-222222222222') <> 9740 then
    raise exception 'subscription expiry deleted credits';
  end if;
  if not exists (
    select 1 from public.subscriptions
    where user_id = '22222222-2222-4222-8222-222222222222'
      and status = 'expired'
  ) then
    raise exception 'subscription did not expire';
  end if;
end;
$expiry_keeps_credits$;

update public.wallets
set credit_balance = 4
where user_id = '22222222-2222-4222-8222-222222222222';

do $insufficient$
begin
  perform * from public.reserve_ai_credits(
    '22222222-2222-4222-8222-222222222222',
    'roleplay_voice_response',
    'insufficient-test-request-0001'
  );
  raise exception 'EXPECTED_INSUFFICIENT_CREDITS';
exception
  when sqlstate 'P0001' then
    if sqlerrm <> 'INSUFFICIENT_CREDITS' then
      raise;
    end if;
end;
$insufficient$;

select 'SUBSCRIPTION_ENTITLEMENTS_AND_AI_RESERVATIONS_OK';
rollback;
