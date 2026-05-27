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
];

for (const route of appRoutes) {
  const file = join(root, `src/app/${route}.tsx`);
  if (!existsSync(file)) {
    fail(`Missing route file src/app/${route}.tsx`);
  } else {
    ok(`Route file exists: /${route}`);
  }
}

for (const hidden of ["lesson", "guidebook", "roleplay", "ai-teacher"]) {
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

// EAS
const eas = JSON.parse(read("eas.json"));
if (eas.build?.preview?.android?.buildType !== "apk") {
  fail("eas.json preview profile should build apk");
} else {
  ok("EAS preview profile builds APK");
}

const appJson = JSON.parse(read("app.json"));
if (!appJson.expo?.extra?.eas?.projectId) {
  fail("app.json missing EAS projectId");
} else {
  ok(`EAS projectId: ${appJson.expo.extra.eas.projectId}`);
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
