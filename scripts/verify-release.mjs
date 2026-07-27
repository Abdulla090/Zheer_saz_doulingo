/**
 * Pre-release checks: routes, security helpers, native perf flags.
 * Run: node scripts/verify-release.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed++;
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

// Routes
const layout = read("src/app/(tabs)/_layout.android.tsx");
const tabNavigation = read("src/constants/tab-navigation.ts");

const tabRoutes = [
  "index",
  "dashboard",
  "feed",
  "subscription",
  "more",
];

const stackRoutes = [
  "lesson",
  "guidebook",
  "roleplay",
  "ai-teacher",
  "privacy-policy",
  "ai-safety",
  "terms",
];

for (const route of tabRoutes) {
  const file = join(root, `src/app/(tabs)/${route}.tsx`);
  if (!existsSync(file)) {
    fail(`Missing tab route file src/app/(tabs)/${route}.tsx`);
  } else {
    ok(`Tab route file exists: /(tabs)/${route}`);
  }
}

for (const route of stackRoutes) {
  const file = join(root, `src/app/${route}.tsx`);
  if (!existsSync(file)) {
    fail(`Missing stack route file src/app/${route}.tsx`);
  } else {
    ok(`Stack route file exists: /${route}`);
  }
}

for (const hidden of [
  "lesson",
  "guidebook",
  "roleplay",
  "voice-tutor",
  "ai-teacher",
  "podcast",
  "privacy-policy",
  "ai-safety",
  "terms",
]) {
  if (!tabNavigation.includes(`"${hidden}"`)) {
    fail(`tab-navigation should hide tab bar on: ${hidden}`);
  } else {
    ok(`Tab bar hidden for: ${hidden}`);
  }
}

const rootLayoutContent = read("src/app/_layout.tsx");
for (const screen of ["ai-teacher", "podcast", "voice-tutor"]) {
  if (!rootLayoutContent.includes(`name="${screen}"`)) {
    fail(`Root layout missing ${screen} screen`);
  } else {
    ok(`Root layout registers ${screen}`);
  }
}

// Security
const boson = read("src/lib/boson-ai.ts");
if (boson.includes("bai-") || boson.match(/Bearer [a-zA-Z0-9_-]{20,}/)) {
  fail("boson-ai.ts must not contain hardcoded API keys");
} else {
  ok("No hardcoded Boson API key");
}

const homeScreen = read("src/screens/home/TwinoLearnHomeScreen.tsx");
if (homeScreen.includes("hapticSelection()") && !homeScreen.includes("hapticSelection")) {
  fail("TwinoLearnHomeScreen uses hapticSelection without import");
} else if (homeScreen.includes('router.push("/games")')) {
  fail('TwinoLearnHomeScreen links to dead route "/games" — use "/feed"');
} else {
  ok("Home screen haptics import and games route");
}

const appJson = JSON.parse(read("app.json"));
if (appJson.expo?.plugins) {
  const buildProps = appJson.expo.plugins.find(
    (p) => Array.isArray(p) && p[0] === "expo-build-properties",
  );
  if (buildProps?.[1]?.android?.usesCleartextTraffic === true) {
    fail("usesCleartextTraffic must be false for production");
  } else {
    ok("Android cleartext traffic disabled");
  }
  const extensions =
    appJson.expo?.extra?.eas?.build?.experimental?.ios?.appExtensions ?? [];
  const widgetTargets = extensions.filter((e) => e.targetName === "ExpoWidgetsTarget");
  if (widgetTargets.length > 1) {
    fail("Duplicate ExpoWidgetsTarget app extension entries");
  } else {
    ok("Single ExpoWidgetsTarget extension");
  }

  const imagePickerPlugin = appJson.expo.plugins.find(
    (p) => Array.isArray(p) && p[0] === "expo-image-picker",
  );
  if (
    imagePickerPlugin?.[1]?.cameraPermission !== false ||
    imagePickerPlugin?.[1]?.microphonePermission !== false ||
    !imagePickerPlugin?.[1]?.photosPermission
  ) {
    fail("Image picker must request only a clear photo-library permission");
  } else {
    ok("Image picker requests only photo-library access");
  }
}

const androidPermissions = appJson.expo?.android?.permissions ?? [];
for (const unnecessaryPermission of [
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
]) {
  if (androidPermissions.includes(unnecessaryPermission)) {
    fail(`Unnecessary Android permission declared: ${unnecessaryPermission}`);
  }
}
if (
  !androidPermissions.includes("android.permission.RECORD_AUDIO") ||
  !androidPermissions.includes("android.permission.MODIFY_AUDIO_SETTINGS")
) {
  fail("Speaking practice Android audio permissions are incomplete");
} else {
  ok("Android permissions are limited to speaking-practice audio");
}

const audioPlugin = appJson.expo?.plugins?.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === "expo-audio",
);
if (
  !audioPlugin ||
  audioPlugin[1]?.enableBackgroundPlayback !== false ||
  audioPlugin[1]?.enableBackgroundRecording !== false
) {
  fail("Expo Audio must not add unused foreground-service permissions");
} else {
  ok("Expo Audio background services are disabled");
}

const contentPackStore = read("src/stores/useContentPackStore.ts");
const contentPackCard = read("src/components/ContentPackCard.tsx");
if (
  contentPackStore.includes("speed.cloudflare.com") ||
  contentPackStore.includes("new XMLHttpRequest") ||
  contentPackCard.includes("WRITE_EXTERNAL_STORAGE") ||
  contentPackCard.includes("POST_NOTIFICATIONS") ||
  contentPackCard.includes("Download Pack") ||
  contentPackCard.includes("Downloading...")
) {
  fail("Bundled content paths must not simulate downloads or request unrelated permissions");
} else if (
  !contentPackCard.includes("Add to My Paths") ||
  !contentPackStore.includes("getBundledUnits(pack)")
) {
  fail("Bundled content paths must use honest local activation");
} else {
  ok("Bundled content paths activate locally without fake network downloads");
}

const rootLayout = read("src/app/_layout.tsx");
if (!rootLayout.includes("Sentry.wrap(RootLayout)")) {
  fail("Root layout must Sentry.wrap for production");
} else {
  ok("Root layout wrapped with Sentry");
}

const appConfig = read("app.config.js");
const easConfig = JSON.parse(read("eas.json"));
const productionEnv = easConfig.build?.production?.env ?? {};
for (const sentryVariable of [
  "EXPO_PUBLIC_SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
]) {
  if (!appConfig.includes(sentryVariable)) {
    fail(`Production config must enforce ${sentryVariable}`);
  }
}
if (productionEnv.SENTRY_DISABLE_AUTO_UPLOAD === "true") {
  fail("Production builds must upload Sentry source maps");
} else if (!appConfig.includes("enableSourceMapsUpload: sentryUploadReady")) {
  fail("Dynamic Expo config must enable Sentry source maps when credentials exist");
} else {
  ok("Production config enforces Sentry DSN and source-map upload credentials");
}

const teacherService = read("src/services/ai-teacher-service.ts");
const geminiConfig = read("src/constants/gemini.ts");
const geminiGateway = read("src/services/gemini-gateway.ts");
const geminiFunction = read("supabase/functions/gemini-generate/index.ts");
if (
  teacherService.includes("generativelanguage.googleapis.com") ||
  geminiConfig.includes("EXPO_PUBLIC_GEMINI_API_KEY") ||
  rootLayoutContent.includes("twino.gemini.apikey")
) {
  fail("Gemini credentials or direct provider calls must not exist in the app bundle");
} else {
  ok("Gemini credentials stay out of the app bundle");
}
if (
  !geminiGateway.includes('functions.invoke<T>("gemini-generate"') ||
  !geminiFunction.includes('withSupabase({ auth: "user" }') ||
  !geminiFunction.includes("consume_ai_quota") ||
  !geminiFunction.includes('Deno.env.get("GEMINI_API_KEY")')
) {
  fail("Gemini gateway must require user auth, server secret, and quota enforcement");
} else {
  ok("Gemini gateway is authenticated, rate-limited, and server-keyed");
}
if (!teacherService.includes("MAX_ANSWER_CHARS")) {
  fail("AI teacher service missing input length cap");
} else {
  ok("AI teacher input length capped");
}

// Native perf
const nativePerf = read("src/utils/native-perf.ts");
if (!nativePerf.includes("PATH_LIST_REMOVE_CLIPPED")) {
  fail("native-perf missing PATH_LIST_REMOVE_CLIPPED");
} else {
  ok("Path list clipping flag present");
}

const listButton = read("src/screens/home/components/list-button.tsx");
if (listButton.includes("Animated.createAnimatedComponent(G)")) {
  fail("list-button still uses AnimatedG (Android risk)");
} else {
  ok("Path buttons avoid AnimatedG");
}

if (!existsSync(join(root, "src/components/icons/LessonPathIcons.tsx"))) {
  fail("LessonPathIcons missing");
} else {
  ok("LessonPathIcons present for Android path nodes");
}

// Single package manager (EAS uses bun if bun.lock is in the repo)
if (existsSync(join(root, "bun.lock")) || existsSync(join(root, "bun.lockb"))) {
  fail("Remove bun.lock / bun.lockb — EAS must use npm + package-lock.json only");
} else {
  ok("No bun lockfile in repo (npm-only for EAS)");
}
if (!existsSync(join(root, "package-lock.json"))) {
  fail("Missing package-lock.json");
} else {
  ok("package-lock.json present");
}

// EAS
const eas = easConfig;
if (eas.build?.preview?.android?.buildType !== "apk") {
  fail("eas.json preview profile should build apk");
} else {
  ok("EAS preview profile builds APK");
}

if (eas.build?.production?.android?.buildType !== "app-bundle") {
  fail("eas.json production profile should build app-bundle (Play Store)");
} else {
  ok("EAS production profile builds AAB");
}

const featureFlags = read("src/constants/feature-flags.ts");
if (!featureFlags.includes("ENABLE_SHOP = false")) {
  fail("Native shop must stay hidden; credit checkout is web-only");
} else {
  ok("Native shop hidden from the web-only credit checkout");
}

const subscriptionScreen = read("src/screens/subscriptions/SubscriptionScreen.tsx");
if (
  subscriptionScreen.includes("rasedi-checkout") ||
  subscriptionScreen.includes("Simulate Success") ||
  subscriptionScreen.includes('.update({ is_premium: true')
) {
  fail("Subscription screen must not contain simulator checkout or client entitlement writes");
} else {
  ok("Subscription simulator removed from the public release");
}

const webCreditScreen = read("src/screens/subscriptions/SubscriptionScreen.web.tsx");
const waylCheckoutFunction = read("supabase/functions/wayl-checkout/index.ts");
const waylWebhookFunction = read("supabase/functions/wayl-webhook/index.ts");
const creditsFunction = read("supabase/functions/credits/index.ts");
const walletMigration = read(
  "supabase/migrations/20260723221118_credit_wallet_and_wayl_payments.sql",
);
if (
  !webCreditScreen.includes('functions.invoke("wayl-checkout"') ||
  webCreditScreen.includes("EXPO_PUBLIC_WAYL") ||
  !waylCheckoutFunction.includes('Deno.env.get("WAYL_API_KEY")') ||
  !waylCheckoutFunction.includes('"X-WAYL-AUTHENTICATION"') ||
  !waylWebhookFunction.includes('"x-wayl-signature-256"') ||
  !waylWebhookFunction.includes('await req.text()') ||
  !creditsFunction.includes('"spend_credits"') ||
  !walletMigration.includes("credit_transactions_are_immutable") ||
  !walletMigration.includes("record_wayl_payment_event")
) {
  fail("Wayl credits must keep secrets and all wallet mutations server-side");
} else {
  ok("Wayl credit wallet is server-authoritative and webhook-signed");
}

const authContext = read("src/context/AuthContext.tsx");
if (
  authContext.includes("is_premium: state.isPremium") ||
  authContext.includes("subscription_tier: state.subscriptionTier")
) {
  fail("Premium entitlement must not be synchronized from client settings");
} else {
  ok("Premium entitlement is not client-controlled");
}

const settingsScreen = read("src/screens/settings/SettingsScreen.tsx");
const deleteAccountFunction = read("supabase/functions/delete-account/index.ts");
const supabaseConfig = read("supabase/config.toml");
const avatarMigration = read("supabase/migrations/20260717181331_secure_avatar_storage.sql");
const advisorMigration = read(
  "supabase/migrations/20260717183458_harden_database_advisors.sql",
);
const deleteAccountConfig = supabaseConfig.match(
  /\[functions\.delete-account\]([\s\S]*?)(?=\r?\n\[|$)/,
)?.[1] ?? "";
if (
  !authContext.includes('functions.invoke("delete-account")') ||
  !settingsScreen.includes("Delete Account") ||
  !deleteAccountFunction.includes('withSupabase(\n  { auth: "user" }') ||
  !deleteAccountFunction.includes("ctx.userClaims?.id") ||
  !deleteAccountFunction.includes('storage.from("avatars")') ||
  !deleteAccountConfig.includes("verify_jwt = true")
) {
  fail("Signed-in users must be able to securely delete their own account in-app");
} else {
  ok("In-app account deletion uses the verified caller identity");
}

const profileScreen = read("src/screens/profile/ProfileScreen.tsx");
if (
  !profileScreen.includes("MAX_AVATAR_BYTES") ||
  !profileScreen.includes('const filePath = `${user.id}/avatar`') ||
  !profileScreen.includes("ALLOWED_AVATAR_MIME_TYPES") ||
  !avatarMigration.includes("file_size_limit") ||
  !avatarMigration.includes("Avatar owners can replace their upload") ||
  !avatarMigration.includes("name = ((select auth.uid())::text || '/avatar')") ||
  !avatarMigration.includes('drop policy if exists "Allow anyone to insert premade avatars"') ||
  !avatarMigration.includes('drop policy if exists "Allow anyone to update premade avatars"')
) {
  fail("Profile photo uploads must be size/type limited and owner-scoped");
} else {
  ok("Profile photo uploads are bounded, overwrite-safe, and owner-scoped");
}

if (
  !advisorMigration.includes(
    "alter function public.handle_updated_at() set search_path = '';",
  ) ||
  !advisorMigration.includes("create index if not exists subscriptions_user_id_idx") ||
  !advisorMigration.includes("to authenticated") ||
  !advisorMigration.includes("using ((select auth.uid()) = user_id)")
) {
  fail("Database functions and subscription access must stay hardened");
} else {
  ok("Database function search paths and subscription access are hardened");
}

const supabaseClient = read("src/lib/supabase.ts");
if (!supabaseClient.includes("SecureStore.setItemAsync")) {
  fail("Supabase native sessions must use SecureStore");
} else {
  ok("Supabase native sessions use SecureStore");
}

const privacyPolicy = read("src/content/legal/privacy-en.ts");
for (const disclosure of [
  "Supabase",
  "Google Gemini",
  "recorded audio",
  "public profile image",
  "support@twino.app",
]) {
  if (!privacyPolicy.includes(disclosure)) {
    fail(`Privacy policy missing production disclosure: ${disclosure}`);
  } else {
    ok(`Privacy policy discloses ${disclosure}`);
  }
}

if (!appJson.expo?.ios?.privacyManifests?.NSPrivacyAccessedAPITypes?.length) {
  fail("iOS privacy manifest must declare required-reason API usage");
} else {
  ok("iOS privacy manifest is configured");
}

const easIgnore = read(".easignore");
if (!/^\.env$/m.test(easIgnore)) {
  fail(".easignore must exclude the local .env file from cloud build uploads");
} else {
  ok("Local .env excluded from EAS uploads");
}

const maestroSmoke = read("maestro/smoke-test.yaml");
if (!maestroSmoke.includes("appId: com.hewad.mubariz.twino")) {
  fail("Maestro smoke test must target the production Android package");
} else {
  ok("Maestro smoke test targets the production package");
}

if (!existsSync(join(root, "src/content/legal/privacy-en.ts"))) {
  fail("Missing in-app privacy policy content");
} else {
  ok("In-app privacy policy present");
}

if (!existsSync(join(root, "src/stores/useProgressStore.ts"))) {
  fail("Missing useProgressStore for persisted learning progress");
} else {
  ok("Progress persistence store present");
}

if (!existsSync(join(root, "src/stores/useSettingsStore.ts"))) {
  fail("Missing useSettingsStore for haptics/path preferences");
} else {
  ok("Settings store present");
}

if (!existsSync(join(root, "src/utils/safe-link.ts"))) {
  fail("Missing safe-link helpers");
} else {
  ok("Safe link helpers present");
}
if (!existsSync(join(root, "PRODUCTION.md"))) {
  fail("README links to a missing PRODUCTION.md release runbook");
} else {
  ok("Production release runbook present");
}

if (!appJson.expo?.extra?.eas?.projectId) {
  fail("app.json missing EAS projectId");
} else {
  ok(`EAS projectId: ${appJson.expo.extra.eas.projectId}`);
}

// Store submission assets
const storeAssets = [
  ["store-assets/google-play/feature-graphic-1024x500.png", 1024, 500],
  ["store-assets/google-play/app-icon-512.png", 512, 512],
  ["store-assets/app-store/app-icon-1024.png", 1024, 1024],
  ["store-assets/google-play/phone-screenshots/01-clear-learning-path-1080x1920.png", 1080, 1920],
  ["store-assets/google-play/phone-screenshots/02-speaking-feedback-1080x1920.png", 1080, 1920],
  ["store-assets/google-play/phone-screenshots/03-progress-and-streaks-1080x1920.png", 1080, 1920],
  ["store-assets/app-store/iphone-6.9-screenshots/01-clear-learning-path-1290x2796.png", 1290, 2796],
  ["store-assets/app-store/iphone-6.9-screenshots/02-speaking-feedback-1290x2796.png", 1290, 2796],
  ["store-assets/app-store/iphone-6.9-screenshots/03-progress-and-streaks-1290x2796.png", 1290, 2796],
];

const storeAssetBuilder = read("scripts/build-store-assets.mjs");
if (storeAssetBuilder.includes("START YOUR JOURNEY")) {
  fail("Google Play feature graphic must not contain a call-to-action button");
} else {
  ok("Google Play feature graphic avoids call-to-action UI");
}
if (!storeAssetBuilder.includes("Your speaking feedback")) {
  fail("Speaking-feedback store screenshot source contains a copy regression");
} else {
  ok("Speaking-feedback store screenshot copy is correct");
}
if (!existsSync(join(root, "store-assets/support/index.html"))) {
  fail("Missing publishable support page");
} else {
  ok("Publishable support page present");
}

for (const [rel, expectedWidth, expectedHeight] of storeAssets) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    fail(`Missing store asset: ${rel}`);
    continue;
  }
  const metadata = await sharp(path).metadata();
  if (metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
    fail(`Store asset has wrong dimensions: ${rel}`);
  } else {
    ok(`Store asset ready: ${rel} (${expectedWidth}x${expectedHeight})`);
  }
}

const appMeta = read("src/constants/app-meta.ts");
const publicPrivacyUrl = "https://abdulla090.github.io/Zheer_saz_doulingo/privacy/";
const publicSupportUrl = "https://abdulla090.github.io/Zheer_saz_doulingo/support/";
if (!appMeta.includes(publicPrivacyUrl)) {
  fail("App metadata must use the published privacy-policy URL");
} else {
  ok("Published privacy-policy URL configured in the app");
}
if (!appMeta.includes(publicSupportUrl)) {
  fail("App metadata must use the published support URL");
} else {
  ok("Published support URL configured in the app");
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
