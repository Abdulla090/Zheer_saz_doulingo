-- Local integration proof for UTC leaderboard periods and the private XP ledger.
begin;

do $security$
begin
  if has_table_privilege('authenticated', 'public.leaderboard_xp_events', 'SELECT')
    or has_table_privilege('authenticated', 'public.leaderboard_xp_events', 'INSERT')
    or has_table_privilege('authenticated', 'public.leaderboard_xp_events', 'UPDATE')
    or has_table_privilege('authenticated', 'public.leaderboard_xp_events', 'DELETE')
  then
    raise exception 'authenticated can access the leaderboard XP ledger directly';
  end if;

  if has_table_privilege('authenticated', 'public.leaderboard_xp_state', 'SELECT')
    or has_table_privilege('authenticated', 'public.leaderboard_xp_state', 'UPDATE')
  then
    raise exception 'authenticated can access the leaderboard XP high-water state';
  end if;

  if has_function_privilege(
    'anon',
    'public.get_leaderboard(integer,text,text)',
    'EXECUTE'
  ) then
    raise exception 'anon can execute get_leaderboard';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.capture_leaderboard_xp_event()',
    'EXECUTE'
  ) then
    raise exception 'authenticated can execute the ledger trigger function';
  end if;
end;
$security$;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  (
    '91111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'leader-a@twino.local', '', now(),
    '{}'::jsonb, '{"display_name":"Learner A"}'::jsonb, now(), now()
  ),
  (
    '92222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'leader-b@twino.local', '', now(),
    '{}'::jsonb, '{"display_name":"Learner B"}'::jsonb, now(), now()
  ),
  (
    '93333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'leader-c@twino.local', '', now(),
    '{}'::jsonb, '{"display_name":"Learner C"}'::jsonb, now(), now()
  );

-- Existing client syncs need no new write path: a positive total XP delta is
-- captured by the trigger, while non-XP progress updates add no event.
update public.user_progress
set total_xp = 10, daily_xp = 10, last_active_date = (now() at time zone 'UTC')::date
where user_id = '91111111-1111-4111-8111-111111111111';

update public.user_progress
set streak_days = 2
where user_id = '91111111-1111-4111-8111-111111111111';

-- A stale device may temporarily lower an absolute total. Returning to the
-- previous high-water mark must not duplicate the original 10 XP event.
update public.user_progress set total_xp = 2
where user_id = '91111111-1111-4111-8111-111111111111';
update public.user_progress set total_xp = 10
where user_id = '91111111-1111-4111-8111-111111111111';

do $capture$
begin
  if (
    select count(*)
    from public.leaderboard_xp_events
    where user_id = '91111111-1111-4111-8111-111111111111'
  ) <> 1 then
    raise exception 'XP trigger wrote the wrong number of events';
  end if;

  if (
    select xp_amount
    from public.leaderboard_xp_events
    where user_id = '91111111-1111-4111-8111-111111111111'
  ) <> 10 then
    raise exception 'XP trigger captured the wrong delta';
  end if;
end;
$capture$;

-- Build deterministic relative periods after proving the trigger path.
truncate table public.leaderboard_xp_events restart identity;

update public.user_progress set total_xp = 10
where user_id = '91111111-1111-4111-8111-111111111111';
update public.user_progress set total_xp = 20
where user_id = '92222222-2222-4222-8222-222222222222';
update public.user_progress set total_xp = 50
where user_id = '93333333-3333-4333-8333-333333333333';

truncate table public.leaderboard_xp_events restart identity;
insert into public.leaderboard_xp_events (user_id, xp_amount, source, occurred_at)
values
  (
    '91111111-1111-4111-8111-111111111111', 10, 'test_today', now()
  ),
  (
    '92222222-2222-4222-8222-222222222222', 20, 'test_week',
    date_trunc('week', now() at time zone 'UTC') at time zone 'UTC'
  ),
  (
    '93333333-3333-4333-8333-333333333333', 50, 'test_before_week',
    (date_trunc('week', now() at time zone 'UTC') at time zone 'UTC') - interval '1 second'
  );

select set_config(
  'request.jwt.claim.sub',
  '91111111-1111-4111-8111-111111111111',
  true
);
set local role authenticated;

create temporary table leaderboard_today as
select * from public.get_leaderboard(50, 'today', 'UTC');

create temporary table leaderboard_week as
select * from public.get_leaderboard(50, 'week', 'UTC');

create temporary table leaderboard_all as
-- The legacy one-parameter call must still resolve to all time.
select * from public.get_leaderboard(50);

reset role;

do $periods$
begin
  if not exists (
    select 1 from leaderboard_today
    where user_id = '91111111-1111-4111-8111-111111111111'
      and period_xp = 10
      and total_xp = 10
  ) then
    raise exception 'today period omitted current UTC-day XP';
  end if;

  if exists (
    select 1 from leaderboard_today
    where user_id = '93333333-3333-4333-8333-333333333333'
  ) then
    raise exception 'today period included pre-week XP';
  end if;

  if not exists (
    select 1 from leaderboard_week
    where user_id = '92222222-2222-4222-8222-222222222222' and period_xp = 20
  ) or exists (
    select 1 from leaderboard_week
    where user_id = '93333333-3333-4333-8333-333333333333'
  ) then
    raise exception 'UTC week boundary is incorrect';
  end if;

  if (select user_id from leaderboard_all order by rank limit 1)
      <> '93333333-3333-4333-8333-333333333333'::uuid
    or (select period_xp from leaderboard_all where rank = 1) <> 50
    or (select total_xp from leaderboard_all where rank = 1) <> 50
  then
    raise exception 'all-time leaderboard no longer uses user_progress.total_xp';
  end if;
end;
$periods$;

do $invalid_period$
begin
  perform public.get_leaderboard(50, 'month');
  raise exception 'invalid period was accepted';
exception
  when sqlstate '22023' then null;
end;
$invalid_period$;

select 'LEADERBOARD_PERIOD_XP_LEDGER_OK';
rollback;
