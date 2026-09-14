-- A study lesson has a larger, server-capped output budget than a roleplay turn.
-- Keep this price in the same authoritative reservation/settlement ledger.
insert into public.ai_credit_prices (feature_key, credit_cost, label, metadata)
values ('study_tutor', 100, 'AI Study Tutor lesson', '{"pricingUnit":"lesson","maxOutputTokens":4096}'::jsonb)
on conflict (feature_key) do nothing;
