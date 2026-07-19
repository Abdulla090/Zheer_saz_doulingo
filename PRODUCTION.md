# TWINO production release runbook

This is the source of truth for preparing TWINO 1.0.0 for App Store and
Google Play submission.

## 1. Static release gate

Run these checks before creating a store build:

```powershell
npm ci
npm run typecheck
npm run lint:strict
npm run test:ci
npm run doctor
npm run verify
git diff --check
```

The release verifier covers routes, native security flags, protected auth
storage, authenticated AI/account-deletion functions, store asset dimensions,
legal disclosures, and production build profiles.

`npm audit --omit=dev` currently reports moderate advisories inherited through
the Expo native build toolchain, with no compatible upstream fix. Do not force
major downgrades of Expo or Sentry to silence them. Publication is blocked by
any high or critical runtime advisory; re-check the moderate toolchain
advisories whenever Expo publishes compatible updates.

## 2. Production monitoring

Create a React Native project in Sentry and configure these variables in the
EAS `production` environment:

- `EXPO_PUBLIC_SENTRY_DSN` — sensitive
- `SENTRY_ORG` — plaintext
- `SENTRY_PROJECT` — plaintext
- `SENTRY_AUTH_TOKEN` — secret

Example command shape:

```powershell
npx eas-cli env:create production --name SENTRY_ORG --value "<org>" --visibility plaintext --non-interactive
```

Repeat with the appropriate visibility for each variable. Never commit the
token or DSN. `app.config.js` deliberately blocks production builds until all
four variables exist, and enables source-map upload only when the private
upload credentials are complete.

## 3. Supabase production deployment

Authenticate and link the production project:

```powershell
npx supabase login
npx supabase link --project-ref kuvzssufoaynscdgejwe
```

Review and deploy migrations:

```powershell
npx supabase db push --linked --dry-run
npx supabase db push --linked
npx supabase db advisors --linked --type security --level warn --fail-on error
```

Deploy the authenticated Edge Functions:

```powershell
npx supabase functions deploy delete-account gemini-generate gemini-live-token openai-realtime-token --use-api
```

Set the `GEMINI_API_KEY` and `OPENAI_API_KEY` Edge Function secrets in
Supabase before testing cloud AI. Do not create public client-side provider
keys.

In Authentication settings, keep an eight-character minimum with letters and
digits. Supabase leaked-password protection is an additional Pro-plan control;
enable it when the project moves to Pro.

Required live verification:

- Anonymous callers cannot enumerate `profiles`.
- Anonymous callers cannot read `ai_usage_daily`.
- `gemini-generate` rejects callers without a signed-in user JWT.
- `delete-account` rejects callers without a signed-in user JWT.
- A signed-in test account can invoke AI within quota.
- The same account can permanently delete itself in-app.

## 4. Store listing

Source files:

- `store-assets/listing/en-US.md`
- `store-assets/listing/data-safety.md`
- `store-assets/privacy/index.html`
- `store-assets/support/index.html`

Published pages:

- Privacy: <https://abdulla090.github.io/Zheer_saz_doulingo/privacy/>
- Support: <https://abdulla090.github.io/Zheer_saz_doulingo/support/>

Regenerate icons, screenshots, and the Play feature graphic after any source
change:

```powershell
node scripts/build-store-assets.mjs
npm run verify
```

Complete the Google Play Data safety/content-rating forms and Apple App
Privacy/age-rating forms from the checked-in listing documents.

## 5. Store builds and release testing

After Sections 1–4 pass:

1. Create the production Android AAB and iOS archive with EAS.
2. Upload to Play internal testing and TestFlight.
3. Test onboarding, guest lessons, sign-in, sync, microphone denial, cloud AI,
   offline fallback, sign-out, and account deletion on physical devices.
4. Confirm Sentry receives a readable test event with symbolicated source.
5. Promote only the exact tested binaries to production.
