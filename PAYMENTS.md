# Twino payments activation

Twino's payment, wallet, credit-ledger, and fixed-duration subscription system
is implemented independently of merchant credentials. Until a provider and
approved products are configured, checkout returns a safe unavailable response;
it never fabricates an order or grants benefits.

## Architecture

- `billing_products` is the server-owned catalogue. The client sends only a
  product UUID; amount, currency, credits, plan, and duration come from the
  database.
- `payment_orders` records each checkout attempt and provider state.
- `payment_webhook_events` deduplicates signed delivery events.
- `process_payment_order` locks the order and atomically updates its state,
  plan expiry, and the immutable included-credit snapshot from that order.
- Free accounts receive one unique 250-credit starter ledger grant. Each
  verified 30-day purchase grants Plus 2,500, Pro 4,500, or Max 8,000 credits.
  Plan access expires independently; unused purchased credits stay in the wallet.
- `ai_credit_prices` is the authoritative cost catalogue. AI functions reserve
  credits before contacting Gemini, settle after success, and reverse once on
  failure. The client never submits an amount.
- `wallets`, `credit_transactions`, `payment_orders`, and `subscriptions` are
  readable only by their owner. Clients cannot write billing data.
- Edge Functions hold every provider secret. The Expo and web bundles contain
  only the public Supabase URL and anon key.
- Wayl uses its documented hosted payment-link API. Plus, Pro, and Max are fixed
  durations because Wayl's public API does not document recurring billing.
- Rasedi is a complete interface boundary but deliberately returns
  `RASEDI_DOCUMENTATION_REQUIRED` until the private contract is supplied.

## 1. Apply the database migration

Review and apply `supabase/migrations/20260809183705_payments_credits_subscriptions.sql`
`supabase/migrations/20260809203240_three_tier_entitlements_ai_credits.sql`,
and `supabase/migrations/20260809211447_pricing_max_and_ai_usage_ledger.sql`
through the normal Supabase migration workflow. Do not paste individual function
bodies into production out of order.

## 2. Review the inactive launch products

The migration creates the selected launch offers but deliberately leaves them
inactive: Plus is 10,000 IQD with 2,500 credits; Pro is 15,000 IQD with 4,500
credits; Max is 25,000 IQD with 8,000 credits. Prices are whole IQD amounts. Do not activate any row until provider
fees, credentials, webhook verification, and merchant approval are complete.

```sql
insert into public.billing_products
  (slug, name, description, product_type, amount, currency, credits, included_credits, plan, subscription_days, active, sort_order)
values
  ('credits-small', 'Small credit pack', 'One-time AI practice credits', <CREDIT_PACK_PRICE_IQD>, 'IQD', <CREDIT_AMOUNT>, 0, null, null, false, 10),
  ('plus-30-days', 'Twino Plus', '30 days plus 2,500 AI credits', 10000, 'IQD', null, 2500, 'plus', 30, false, 100),
  ('pro-30-days', 'Twino Pro', '30 days plus 4,500 AI credits', 15000, 'IQD', null, 4500, 'pro', 30, false, 110),
  ('max-30-days', 'Twino Max', '30 days plus 8,000 AI credits', 25000, 'IQD', null, 8000, 'max', 30, false, 120)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  amount = excluded.amount,
  currency = excluded.currency,
  credits = excluded.credits,
  included_credits = excluded.included_credits,
  plan = excluded.plan,
  subscription_days = excluded.subscription_days,
  active = excluded.active,
  sort_order = excluded.sort_order;
```

## 3. Configure Wayl after credentials arrive

1. Copy the names from `supabase/functions/.env.example` into Supabase Edge
   Function secrets; do not upload that file with real values.
2. Set `PAYMENT_PROVIDER=wayl`, `WAYL_ENV=test`, `WAYL_API_KEY`, a random
   `WAYL_WEBHOOK_SECRET` of at least 32 characters, and the production
   `TWINO_WEB_URL`.
3. Set `AI_COST_SAFETY_IQD_PER_USD` from a current verified rate and keep
   `AI_COST_SAFETY_MULTIPLIER` at 3.1 or higher. Checkout fails closed below 3.
4. Register or confirm the webhook URL:
   `https://<project-ref>.supabase.co/functions/v1/wayl-webhook`.
5. Deploy `create-checkout`, `billing-account`, `credits`, `gemini-generate`,
   `gemini-live-token`, `wayl-checkout`, and `wayl-webhook`. The first two are
   canonical billing endpoints; the Wayl checkout endpoint is a compatibility
   alias.
6. Keep products inactive. Complete a test payment, replay the same webhook,
   and confirm one order, one purchase-ledger entry, and one balance increase.
7. Confirm cancellation/failure grants nothing, an amount mismatch returns an
   error, account refresh shows the same balance and plan on web and Expo, and a
   fixed-duration plan expires correctly.
8. Switch `WAYL_ENV=live`, enable only approved products, then expose the native
   subscription tab if desired.

Wayl reference used for the adapter: <https://wayl.io/docs> and its public
OpenAPI description at <https://api.thewayl.com/openapi.v1.json>.

## 4. Activate Rasedi later

When Rasedi sends the official base URL, authentication scheme, request/response
examples, status values, webhook signature algorithm, replay rules, and refund
contract, implement only those documented fields in
`supabase/functions/_shared/payments/rasedi.ts`. Add provider-contract tests,
then set `PAYMENT_PROVIDER=rasedi`. Until that work is verified, the adapter must
remain fail-closed.

## Production evidence checklist

- Local migration reset succeeds from an empty database.
- TypeScript, strict lint, Jest, web export, and every billing Edge Function
  type-check successfully.
- Test-mode checkout returns only a Wayl HTTPS hosted-checkout URL.
- Webhook signature verification uses the unmodified raw body.
- Duplicate and concurrently delivered events grant benefits exactly once.
- AI reservation, settlement, and reversal retries change the wallet once, and
  concurrent reservations cannot make a balance negative.
- Live Tutor returns a single-use 5, 10, or 15-minute token and the matching
  server charge; final session analysis creates no second charge.
- Provider API verification matches the order reference, exact amount, and
  currency before fulfillment.
- The signed-in user's `/pricing` result and the Expo account screen show the
  same server-owned credit balance, plan, and expiry.
- No provider key or webhook secret appears in the client bundle or repository.
- Live provider credentials, an actual payment, and production deployment are
  separate go-live evidence; this code does not claim those before they occur.
