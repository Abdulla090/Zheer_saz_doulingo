-- Local integration proof for provider-neutral fulfillment and billing RLS.
-- The transaction is always rolled back, so the test leaves no fixture data.
begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'payments-test@twino.local', '',
  now(), '{}'::jsonb, '{}'::jsonb, now(), now()
);

insert into public.billing_products (
  id, slug, name, product_type, amount, currency, credits, active
) values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'test-credits', 'Test credits', 'credits', 1000, 'IQD', 50, true
);

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency,
  product_type, credits, status, provider_payment_id
) values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'wayl', 1000, 'IQD', 'credits', 50, 'pending', 'wayl-credit-test'
);

create temporary table first_credit_result as
select * from public.process_payment_order(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'wayl', 'wayl-credit-test',
  'Complete', 'completed', 1000, 'IQD', 'test:credit:completed',
  '{"source":"atomic-test"}'::jsonb
);

create temporary table duplicate_credit_result as
select * from public.process_payment_order(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'wayl', 'wayl-credit-test',
  'Complete', 'completed', 1000, 'IQD', 'test:credit:completed',
  '{"source":"atomic-test"}'::jsonb
);

insert into public.billing_products (
  id, slug, name, product_type, amount, currency, included_credits, plan, subscription_days, active
) values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'test-plus', 'Test Plus', 'subscription', 2000, 'IQD', 2500, 'plus', 30, true
);

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency,
  product_type, included_credits, plan, subscription_days, status, provider_payment_id
) values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '11111111-1111-4111-8111-111111111111',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'wayl', 2000, 'IQD', 'subscription', 2500, 'plus', 30, 'pending', 'wayl-plus-test'
);

create temporary table subscription_result as
select * from public.process_payment_order(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'wayl', 'wayl-plus-test',
  'Complete', 'completed', 2000, 'IQD', 'test:plus:completed',
  '{"source":"atomic-test"}'::jsonb
);

insert into public.payment_orders (
  id, user_id, product_id, provider, amount, currency,
  product_type, credits, status, provider_payment_id
) values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  '11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'wayl', 1000, 'IQD', 'credits', 50, 'pending', 'wayl-mismatch-test'
);

do $mismatch$
begin
  perform * from public.process_payment_order(
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'wayl', 'wayl-mismatch-test',
    'Complete', 'completed', 999, 'IQD', 'test:mismatch:completed',
    '{"source":"atomic-test"}'::jsonb
  );
  raise exception 'EXPECTED_PAYMENT_ORDER_MISMATCH';
exception
  when sqlstate 'P0001' then
    if sqlerrm <> 'PAYMENT_ORDER_MISMATCH' then
      raise;
    end if;
end;
$mismatch$;

do $assertions$
begin
  if (select credit_balance from public.wallets
      where user_id = '11111111-1111-4111-8111-111111111111') <> 2800 then
    raise exception 'wallet balance assertion failed';
  end if;
  if (select count(*) from public.credit_transactions
      where payment_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
        and type = 'purchase') <> 1 then
    raise exception 'idempotent ledger assertion failed';
  end if;
  if (select count(*) from public.credit_transactions
      where payment_id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
        and type = 'purchase' and amount = 2500) <> 1 then
    raise exception 'subscription credit grant assertion failed';
  end if;
  if (select count(*) from public.credit_transactions
      where user_id = '11111111-1111-4111-8111-111111111111'
        and reference = 'starter:11111111-1111-4111-8111-111111111111'
        and amount = 250) <> 1 then
    raise exception 'starter grant assertion failed';
  end if;
  if not (select credits_applied and not duplicate from first_credit_result) then
    raise exception 'first fulfillment assertion failed';
  end if;
  if not (select duplicate and not credits_applied from duplicate_credit_result) then
    raise exception 'duplicate fulfillment assertion failed';
  end if;
  if not exists (
    select 1 from public.subscriptions
    where user_id = '11111111-1111-4111-8111-111111111111'
      and plan = 'plus' and status = 'active'
      and expires_at > now() + interval '29 days'
      and expires_at < now() + interval '31 days'
  ) then
    raise exception 'subscription fulfillment assertion failed';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
      and is_premium and subscription_tier = 'plus'
  ) then
    raise exception 'profile subscription sync assertion failed';
  end if;
  if (select status from public.payment_orders
      where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee') <> 'pending' then
    raise exception 'amount mismatch changed order';
  end if;
  if has_table_privilege('authenticated', 'public.wallets', 'UPDATE') then
    raise exception 'authenticated wallet update privilege exists';
  end if;
  if not has_table_privilege('authenticated', 'public.wallets', 'SELECT') then
    raise exception 'authenticated wallet select privilege missing';
  end if;
  if has_table_privilege('authenticated', 'public.payment_orders', 'INSERT') then
    raise exception 'authenticated payment insert privilege exists';
  end if;
  if has_function_privilege(
    'authenticated',
    'public.process_payment_order(uuid,text,text,text,text,bigint,text,text,jsonb)',
    'EXECUTE'
  ) then
    raise exception 'authenticated fulfillment execute privilege exists';
  end if;
  if not exists (
    select 1 from pg_class
    where oid = 'public.wallets'::regclass and relrowsecurity
  ) then
    raise exception 'wallet RLS is disabled';
  end if;
end;
$assertions$;

update public.subscriptions
set expires_at = now() - interval '1 second'
where user_id = '11111111-1111-4111-8111-111111111111';

select public.expire_user_subscription(
  '11111111-1111-4111-8111-111111111111'
);

do $expiry_assertions$
begin
  if not exists (
    select 1 from public.subscriptions
    where user_id = '11111111-1111-4111-8111-111111111111'
      and plan = 'plus' and status = 'expired'
  ) then
    raise exception 'subscription expiry assertion failed';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
      and not is_premium and subscription_tier = 'free'
  ) then
    raise exception 'expired profile sync assertion failed';
  end if;
end;
$expiry_assertions$;

select 'PAYMENT_ATOMICITY_AND_RLS_OK';
rollback;
