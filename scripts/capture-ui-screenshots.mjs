/**
 * Captures key app routes via Expo web + Playwright.
 * Usage: node scripts/capture-ui-screenshots.mjs [baseUrl]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:8081";
const OUT_DIR =
  process.env.SCREENSHOT_DIR ||
  path.join(process.cwd(), "artifacts", "screenshots");

const ROUTES = [
  { id: "01-home", path: "/", label: "Home" },
  { id: "02-games", path: "/feed", label: "Games hub" },
  { id: "03-ai-teacher", path: "/ai-teacher", label: "AI Teacher" },
  { id: "04-roleplay-picker", path: "/roleplay", label: "AI Role Play" },
  { id: "05-dashboard-street", path: "/dashboard?mode=street", label: "Street path" },
  { id: "06-dashboard-normal", path: "/dashboard?mode=normal", label: "Normal path" },
];

async function waitForApp(page) {
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(2500);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  const captured = [];

  for (const route of ROUTES) {
    const page = await context.newPage();
    const url = `${BASE.replace(/\/$/, "")}${route.path}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await waitForApp(page);
      const file = `${route.id}.png`;
      const filePath = path.join(OUT_DIR, file);
      await page.screenshot({ path: filePath, fullPage: true });
      captured.push({ ...route, file });
      console.log("✓", route.label, "→", file);
    } catch (err) {
      console.warn("✗", route.label, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Phingo UI Screenshots</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f4f9ff; color: #1a2b48; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    p { margin: 0 0 24px; color: #64748b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    figure { margin: 0; background: #fff; border-radius: 16px; padding: 12px; box-shadow: 0 8px 24px rgba(26,43,72,.08); }
    figcaption { font-weight: 700; margin-bottom: 10px; font-size: 14px; }
    img { width: 100%; height: auto; border-radius: 12px; border: 1px solid #eef2f6; display: block; }
  </style>
</head>
<body>
  <h1>Phingo — latest UI screens</h1>
  <p>Captured from Expo web (${new Date().toISOString().slice(0, 10)})</p>
  <div class="grid">
${captured
  .map(
    (r) => `    <figure><figcaption>${r.label}</figcaption><img src="./${r.file}" alt="${r.label}" loading="lazy" /></figure>`,
  )
  .join("\n")}
  </div>
</body>
</html>`;

  await writeFile(path.join(OUT_DIR, "index.html"), html);
  console.log("\nGallery:", path.join(OUT_DIR, "index.html"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
