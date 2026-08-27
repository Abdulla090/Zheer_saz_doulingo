-- Fix starter credit allocation and ensure auth.users signup trigger never fails.
-- The previous grant_starter_credits implementation had a variable clobber bug:
-- 'select id, balance_after into v_transaction_id, v_balance' overwrote v_balance
-- with NULL when no transaction record existed, causing a NOT NULL violation on balance_after.

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
  v_balance bigint := 0;
  v_existing_tx_id uuid;
  v_existing_balance bigint;
  v_transaction_id uuid;
  v_reference text := 'starter:' || p_user_id::text;
begin
  if p_user_id is null then
    raise exception using errcode = '22023', message = 'INVALID_STARTER_GRANT';
  end if;

  insert into public.wallets (user_id, credit_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select coalesce(credit_balance, 0) into v_balance
    from public.wallets
    where user_id = p_user_id
    for update;

  v_balance := coalesce(v_balance, 0);

  -- Use separate variables so v_balance is not set to NULL when row is not found
  select id, balance_after into v_existing_tx_id, v_existing_balance
    from public.credit_transactions
    where user_id = p_user_id and reference = v_reference;

  if found then
    return query select coalesce(v_existing_balance, v_balance), v_existing_tx_id, true;
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

-- Make handle_new_user resilient to duplicate usernames, missing fields, and unexpected sub-action errors
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_mascot text;
  v_base_username text;
  v_final_username text;
begin
  requested_mascot := new.raw_user_meta_data->>'selected_mascot_id';

  if requested_mascot is null or requested_mascot not in (
    'pingo', 'violet', 'biscuit', 'waddle', 'sparkle', 'orbit',
    'ember', 'quacks', 'momo', 'buzzwell', 'sprout', 'moonbun'
  ) then
    requested_mascot := 'pingo';
  end if;

  v_base_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    substring(new.email from '([^@]+)')
  );

  -- Safe unique username fallback
  v_final_username := v_base_username;
  if exists (select 1 from public.profiles where username = v_final_username) then
    v_final_username := v_base_username || '_' || substring(md5(random()::text) from 1 for 4);
  end if;

  insert into public.profiles (
    id, username, display_name, avatar_url, selected_mascot_id
  ) values (
    new.id,
    v_final_username,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      substring(new.email from '([^@]+)')
    ),
    null,
    requested_mascot
  )
  on conflict (id) do update set
    username = coalesce(public.profiles.username, excluded.username),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    selected_mascot_id = coalesce(public.profiles.selected_mascot_id, excluded.selected_mascot_id),
    updated_at = now();

  insert into public.user_progress (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

  insert into public.wallets (user_id, credit_balance)
    values (new.id, 0)
    on conflict (user_id) do nothing;

  insert into public.subscriptions (user_id, plan, status, starts_at)
    values (new.id, 'free', 'active', now())
    on conflict (user_id) do nothing;

  begin
    perform public.grant_starter_credits(new.id);
  exception
    when others then
      raise warning 'grant_starter_credits failed for user %: %', new.id, SQLERRM;
  end;

  return new;
exception
  when others then
    raise warning 'handle_new_user error for user %: %', new.id, SQLERRM;
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
