/**
 * Ensures the release APK source tree includes expected product features.
 * Run: node scripts/verify-app-features.mjs
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

const feed = read("src/app/feed.tsx");
if (!feed.includes("GamesScreen")) {
  fail("GAMES tab must render GamesScreen (not placeholder feed)");
} else {
  ok("GAMES tab → GamesScreen");
}

const settings = read("src/screens/settings/SettingsScreen.tsx");
if (!settings.includes("setLocale")) {
  fail("Settings must include language switcher (setLocale)");
} else {
  ok("Settings language switcher");
}

if (!existsSync(join(root, "src/stores/useLocaleStore.ts"))) {
  fail("Missing useLocaleStore");
} else {
  ok("Locale store");
}

if (!existsSync(join(root, "src/screens/games/GamesScreen.tsx"))) {
  fail("Missing GamesScreen");
} else {
  ok("GamesScreen module");
}

if (!existsSync(join(root, "src/widgets/register-widgets.ts"))) {
  fail("Missing home screen widget registration");
} else {
  ok("Home screen widgets");
}

const layout = read("src/app/_layout.tsx");
if (!layout.includes("OnboardingFlow")) {
  fail("_layout must gate on onboarding");
} else {
  ok("Onboarding gate");
}

if (read("src/app/more.tsx").includes("SettingsScreen")) {
  ok("Settings route (/more)");
} else {
  fail("more.tsx must render SettingsScreen");
}

console.log(failed ? `\n${failed} feature check(s) failed.` : "\nAll feature checks passed.");
process.exit(failed ? 1 : 0);
