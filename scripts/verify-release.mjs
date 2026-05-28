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
const layout = read("src/app/_layout.tsx");
const tabBar = read("src/components/CustomTabBar.tsx");
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
  "widgets",
];

for (const route of appRoutes) {
  const file = join(root, `src/app/${route}.tsx`);
  if (!existsSync(file)) {
    fail(`Missing route file src/app/${route}.tsx`);
  } else {
    ok(`Route file exists: /${route}`);
  }
}

for (const hidden of [
  "lesson",
  "guidebook",
  "roleplay",
  "ai-teacher",
  "privacy-policy",
  "ai-safety",
  "terms",
  "widgets",
  "quest",
]) {
  if (!tabBar.includes(`"${hidden}"`)) {
    fail(`CustomTabBar should hide tab bar on: ${hidden}`);
  } else {
    ok(`Tab bar hidden for: ${hidden}`);
  }
}

if (!layout.includes('name="ai-teacher"')) {
  fail("_layout missing ai-teacher screen");
} else {
  ok("_layout registers ai-teacher");
}

// Security
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

const feedRoute = read("src/app/feed.tsx");
if (!feedRoute.includes("GamesScreen")) {
  fail("feed.tsx should render GamesScreen (GAMES tab hub)");
} else {
  ok("GAMES tab routes to GamesScreen");
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

const appJson = JSON.parse(read("app.json"));
const pluginList = JSON.stringify(appJson.expo?.plugins ?? []);
if (!pluginList.includes("with-android-widget-resources")) {
  fail(
    "app.json must include ./plugins/with-android-widget-resources.js for EAS widget builds",
  );
} else {
  ok("Android widget resources fix plugin registered");
}

const plugins = appJson.expo?.plugins ?? [];
const widgetFixIdx = plugins.findIndex(
  (p) =>
    p === "./plugins/with-android-widget-resources.js" ||
    (Array.isArray(p) && String(p[0]).includes("with-android-widget-resources")),
);
const expoWidgetsIdx = plugins.findIndex(
  (p) => (Array.isArray(p) && p[0] === "expo-widgets") || p === "expo-widgets",
);
if (widgetFixIdx === -1 || expoWidgetsIdx === -1) {
  fail("Could not locate widget-resources and expo-widgets plugins in app.json");
} else if (widgetFixIdx >= expoWidgetsIdx) {
  fail(
    "with-android-widget-resources.js must be listed before expo-widgets in app.json (dangerous mod order)",
  );
} else {
  ok("Widget resources plugin ordered before expo-widgets");
}

const easIgnore = existsSync(join(root, ".easignore"))
  ? read(".easignore")
  : "";
if (!easIgnore.includes("/android")) {
  fail(".easignore should exclude /android so EAS runs a fresh prebuild");
} else {
  ok(".easignore excludes /android for clean EAS prebuild");
}

if (!appJson.expo?.extra?.eas?.projectId) {
  fail("app.json missing EAS projectId");
} else {
  ok(`EAS projectId: ${appJson.expo.extra.eas.projectId}`);
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
