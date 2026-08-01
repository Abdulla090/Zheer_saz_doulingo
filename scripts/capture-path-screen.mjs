import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

async function main() {
  const outDir = "C:\\Users\\TOTAL TECH\\.gemini\\antigravity\\brain\\22f302b0-bdc9-4b20-82ec-8801543fc0e2";
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  await page.goto("http://localhost:8081", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("twino.onboarding.completed", "true");
  });

  await page.goto("http://localhost:8081/(tabs)", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);

  const screenshotPath = path.join(outDir, "learning_path_mobile.png");
  await page.screenshot({ path: screenshotPath });
  console.log("Learning path screenshot saved to:", screenshotPath);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
