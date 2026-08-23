-- Owner account: lifetime Max entitlement expressed as ordinary billing data.
--
-- Every edge function, RPC and screen reads the plan and wallet through the
-- normal billing path, so no application code needs an owner special case:
-- billing-account reports plan=max, reserve/settle/reverse charge against a
-- very large wallet, and the usage ledger keeps recording real consumption.

update public.profiles
set is_premium = true,
    subscription_tier = 'max',
    updated_at = now()
where id = 'dee3b9a3-88fe-40e5-b249-ca37d6eba542';

insert into public.subscriptions (user_id, plan, status, starts_at, expires_at)
values (
  'dee3b9a3-88fe-40e5-b249-ca37d6eba542',
  'max',
  'active',
  now(),
  now() + interval '100 years'
)
on conflict (user_id) do update
set plan = 'max',
    status = 'active',
    expires_at = now() + interval '100 years',
    updated_at = now();

insert into public.wallets (user_id, credit_balance)
values ('dee3b9a3-88fe-40e5-b249-ca37d6eba542', 1000000000)
on conflict (user_id) do update
set credit_balance = greatest(wallets.credit_balance, 1000000000),
    updated_at = now();
