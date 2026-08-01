import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Navigate to profile tab
  console.log('Navigating to profile tab...');
  await page.goto('http://localhost:8081/(tabs)/more', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const profileScreenshotPath = path.resolve('C:/Users/TOTAL TECH/.gemini/antigravity/brain/22f302b0-bdc9-4b20-82ec-8801543fc0e2/desktop_profile_screen.png');
  await page.screenshot({ path: profileScreenshotPath, fullPage: true });
  console.log('Saved profile screenshot to', profileScreenshotPath);

  // Navigate to settings screen
  console.log('Navigating to settings screen...');
  await page.goto('http://localhost:8081/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const settingsScreenshotPath = path.resolve('C:/Users/TOTAL TECH/.gemini/antigravity/brain/22f302b0-bdc9-4b20-82ec-8801543fc0e2/desktop_settings_screen.png');
  await page.screenshot({ path: settingsScreenshotPath, fullPage: true });
  console.log('Saved settings screenshot to', settingsScreenshotPath);

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
