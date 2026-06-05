/**
 * Pre-release checks: routes, security helpers, native perf flags.
 * Run: node scripts/verify-release.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
const appRoutes = [
  "index",
  "dashboard",
  "feed",
  "subscription",
  "more",
  "lesson",
  "guidebook",
  "roleplay",
  "ai-teacher",
  "privacy-policy",
  "ai-safety",
  "terms",
];

for (const route of appRoutes) {
  const file = join(root, `src/app/(tabs)/${route}.tsx`);
  if (!existsSync(file)) {
    fail(`Missing route file src/app/(tabs)/${route}.tsx`);
  } else {
    ok(`Route file exists: /(tabs)/${route}`);
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

const jsTabs = read("src/navigation/JsTabsLayout.tsx");
for (const screen of ["ai-teacher", "podcast", "voice-tutor"]) {
  if (!jsTabs.includes(`name="${screen}"`)) {
    fail(`JsTabsLayout missing ${screen} screen`);
  } else {
    ok(`JsTabsLayout registers ${screen}`);
  }
}

// Security
const boson = read("src/lib/boson-ai.ts");
if (boson.includes("bai-") || boson.match(/Bearer [a-zA-Z0-9_-]{20,}/)) {
  fail("boson-ai.ts must not contain hardcoded API keys");
} else {
  ok("No hardcoded Boson API key");
}

const homeScreen = read("src/screens/home/PhingoLearnHomeScreen.tsx");
if (homeScreen.includes("hapticSelection()") && !homeScreen.includes("hapticSelection")) {
  fail("PhingoLearnHomeScreen uses hapticSelection without import");
} else if (homeScreen.includes('router.push("/games")')) {
  fail('PhingoLearnHomeScreen links to dead route "/games" — use "/feed"');
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
}

const rootLayout = read("src/app/_layout.tsx");
if (!rootLayout.includes("Sentry.wrap(RootLayout)")) {
  fail("Root layout must Sentry.wrap for production");
} else {
  ok("Root layout wrapped with Sentry");
}

const teacherService = read("src/services/ai-teacher-service.ts");
if (!teacherService.includes("isAllowedTeacherApiUrl")) {
  fail("AI teacher service missing HTTPS URL guard");
} else {
  ok("AI teacher API requires HTTPS");
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
const eas = JSON.parse(read("eas.json"));
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
  fail("Shop should stay disabled (ENABLE_SHOP = false) until IAP exists");
} else {
  ok("Shop disabled until IAP");
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

if (!appJson.expo?.extra?.eas?.projectId) {
  fail("app.json missing EAS projectId");
} else {
  ok(`EAS projectId: ${appJson.expo.extra.eas.projectId}`);
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
