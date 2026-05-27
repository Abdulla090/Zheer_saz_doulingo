/**
 * Capture Games hub + AI Teacher screenshots (Expo web).
 * Usage: node scripts/capture-games-screenshots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "artifacts", "screenshots");
const base = process.argv[2] || "http://localhost:8081";

const routes = [
  { path: "/feed", file: "phingo-games-hub.png", wait: 2500 },
  { path: "/ai-teacher", file: "phingo-ai-teacher-input.png", wait: 2500 },
  { path: "/ai-teacher?demo=results", file: "phingo-ai-teacher-results.png", wait: 2000 },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  for (const { path: route, file, wait } of routes) {
    const url = `${base}${route}`;
    console.log(`→ ${url}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(wait);
    await page.screenshot({
      path: path.join(outDir, file),
      fullPage: true,
    });
    console.log(`  saved ${file}`);
  }

  await browser.close();
  console.log(`Done. Files in ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
