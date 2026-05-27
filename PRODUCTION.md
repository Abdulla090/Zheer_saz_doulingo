# Phingo English — production checklist

Use this before Play Store / App Store submission.

## Automated checks

```bash
npm run verify
```

## Done in this repo

| Item | Status |
|------|--------|
| Shop tab hidden (`ENABLE_SHOP = false`) | ✅ |
| In-app Privacy Policy, Terms, AI safety | ✅ Settings → Legal |
| Learning progress persisted (street + normal paths) | ✅ |
| Haptics preference persisted (`useSettingsStore`) | ✅ |
| Safe mailto / HTTPS links | ✅ |
| Native TTS (Guidebook) via `expo-speech` | ✅ |
| Profile settings (no `@expo/ui` crash) | ✅ |
| Production Android **AAB** (`eas.json`) | ✅ |
| Error boundary on root layout | ✅ |
| Mic permission strings | ✅ `app.json` |

## You still need (store / ops)

1. **Google Play Console** — create app, upload AAB (`eas build -p android --profile production`), complete Data safety (microphone, local storage), content rating, screenshots.
2. **Apple App Store Connect** — iOS production build (`eas build -p ios --profile production`), TestFlight, privacy labels, screenshots.
3. **Hosted policy URL** — publish `docs/PRIVACY.md` on GitHub Pages or your site; set `EXPO_PUBLIC_PRIVACY_POLICY_URL` if you want an external link in store listings.
4. **Support email** — ensure `support@phingo.app` is monitored (or change `src/constants/app-meta.ts`).
5. **Real device QA** — PATH, lesson complete → progress advances, mic on Android release APK, Kurdish locale, legal screens.
6. **Optional before scale** — Sentry/Crashlytics, user accounts (Supabase/Clerk), real AI Teacher API backend.

## Build commands

```bash
# Internal APK (testing)
npm run build:apk

# Play Store bundle
eas build --platform android --profile production --non-interactive

# iOS (requires Apple credentials in EAS)
eas build --platform ios --profile production
```

## Re-enable shop later

1. Implement StoreKit + Play Billing (e.g. RevenueCat).
2. Set `ENABLE_SHOP = true` in `src/constants/feature-flags.ts`.
3. Update Terms and store listing for subscriptions.
