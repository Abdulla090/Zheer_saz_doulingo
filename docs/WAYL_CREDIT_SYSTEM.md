# TWINO prepaid credits with Wayl

Status: code-ready, not live. Merchant onboarding, API secrets, pack pricing,
credit costs, and a Wayl sandbox payment are still required before checkout can
be enabled.

This is a prepaid wallet, not a subscription. The mobile app never opens or
links to checkout. It only reads a server balance and, after product costs are
approved, asks the server to spend credits. Purchase happens on the web-only
`/credits` route and then on Wayl's hosted checkout.

## Confirmed Wayl API contract

Verified against Wayl's official [integration guide](https://wayl.io/docs) and
[API reference](https://api.thewayl.com/reference) on 2026-07-19.

- Base URL: `https://api.thewayl.com`
- Authentication header: `X-WAYL-AUTHENTICATION: <merchant token>`
- Create link: `POST /api/v1/links`
- Check link: `GET /api/v1/links/{referenceId}`
- Refund: `POST /api/v1/refunds`
- Currency: `IQD` only in the current official API
- Test/live selection: `env` is `test` or `live`
- Checkout URL: returned in `data.url`
- Webhook signature header: `x-wayl-signature-256`
- Signature algorithm: lowercase hex HMAC-SHA256 over the exact raw request
  body using the merchant-supplied `webhookSecret`
- Successful payment statuses: `Complete` and `Delivered`
- Other documented lifecycle values include `Created`, `Pending`,
  `Processing`, `Cancelled`, `Rejected`, and `Returned`

The implementation sends `referenceId`, integer IQD `total`, `currency`,
`lineItem`, `webhookUrl`, `webhookSecret`, and `redirectionUrl`, matching the
official schema.

## What is implemented

- Migration: `credit_packs`, `credit_balances`, immutable
  `credit_transactions`, `wayl_payments`, webhook event deduplication, and
  rate-limit buckets.
- Atomic database functions:
  - `spend_credits`
  - `record_wayl_payment_event`
  - `consume_wallet_rate_limit`
- Authenticated Edge Functions:
  - `wayl-checkout`: list packs, create a Wayl checkout, inspect payment status
  - `credits`: balance, history, and configured server-validated spending
- Public Edge Function:
  - `wayl-webhook`: raw-body HMAC verification before any database mutation
- Web-only credit-pack page with shared TWINO login and Wayl redirect.
- Mobile/home credit-balance badge. It has no purchase link.

All balance mutations are made by service-role-only database functions.
Authenticated and anonymous Data API roles have no direct wallet-table access.
Payment webhook retries cannot double-credit a user because both webhook events
and purchase ledger references are unique.

## Finish Wayl onboarding

1. Complete the merchant information in the Wayl dashboard.
2. Ask Wayl for a test merchant token. Their guide currently lists
   `jisr@wayl.io`; the WooCommerce plugin also lists `support@wayl.io`.
3. Confirm the store is permitted to create API payment links.
4. Keep `WAYL_ENV=test` until an end-to-end sandbox payment passes.
5. Ask Wayl whether their sandbox can emit `Complete`, `Rejected`, and
   duplicate webhook deliveries for testing.

## Required Supabase secrets

Set these only as Supabase Edge Function secrets. Never add any of them to
`EXPO_PUBLIC_*`, the mobile bundle, Vercel client variables, or source control.

```text
WAYL_API_KEY=<test merchant token>
WAYL_WEBHOOK_SECRET=<at least 32 random characters>
WAYL_WEBHOOK_URL=https://<project-ref>.supabase.co/functions/v1/wayl-webhook
WAYL_ENV=test
TWINO_WEB_URL=https://<your web domain>
CREDIT_SPEND_COSTS_JSON={}
```

`CREDIT_SPEND_COSTS_JSON` intentionally defaults to an empty map, so spending
is disabled until costs are approved. A future approved value could look like:

```json
{
  "ai_tutor_session": 10,
  "roleplay_session": 15
}
```

The client-submitted amount must exactly match the server-configured cost.

## Configure credit packs

No price or pack size is seeded because money values require product-owner
approval. After deciding the pack names, credits, and IQD prices, insert them
through a trusted database/admin workflow:

```sql
insert into public.credit_packs (
  slug,
  name,
  description,
  credit_amount,
  price_iqd,
  active,
  sort_order
)
values
  ('starter', '<approved name>', '<approved description>', <credits>, <iqd>, true, 10);
```

Wayl's current API is IQD-only, so the live checkout does not pretend to support
USD conversion. If Wayl adds another currency, update the confirmed contract,
schema constraints, UI, and tests together.

## Deployment order

1. Apply `20260719143218_credit_wallet_and_wayl_payments.sql`.
2. Run database security/performance advisors and resolve findings.
3. Set the six Supabase secrets above.
4. Deploy `credits` with JWT verification enabled.
5. Deploy `wayl-checkout` with JWT verification enabled.
6. Deploy `wayl-webhook` with JWT verification disabled; the function performs
   Wayl HMAC authentication itself.
7. Add approved, active credit packs.
8. Deploy the web bundle.
9. Run the sandbox test matrix below.
10. Only then switch `WAYL_ENV=live`.

## Required sandbox tests

- Create a link and verify the returned host is `checkout.thewayl.com`.
- Complete a test payment and confirm one positive `purchase` ledger row and
  one balance increment.
- Replay the exact webhook and confirm the balance does not change twice.
- Send an invalid signature and confirm HTTP 401 with no database changes.
- Send the correct signature with a different amount and confirm HTTP 409 with
  no credit.
- Attempt six checkout creations inside five minutes and confirm rate limiting.
- Configure one spend action, spend concurrently, and confirm the balance never
  becomes negative.
- Repeat a spend with the same idempotency key and confirm only one debit.
- Test insufficient balance and confirm the mobile copy contains information
  only, with no checkout URL.

## Decisions still required

- Pack sizes and IQD prices
- Which AI actions cost credits and the cost of each action
- Whether credits expire
- Refund policy

`Returned`/`Refunded` Wayl events are recorded, but credits are not
automatically removed yet. That is deliberate: a user may already have spent
some credits, and the business rule for that situation must be approved before
money or balances are changed.
