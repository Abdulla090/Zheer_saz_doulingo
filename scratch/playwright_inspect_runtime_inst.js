const { chromium } = require('playwright');
async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log("[Browser]:", msg.text());
  });

  console.log("Navigating to http://localhost:8081/(kids)...");
  try {
    await page.goto('http://localhost:8081/(kids)', { waitUntil: 'load', timeout: 30000 });
    console.log("Page loaded. Waiting 10 seconds for Rive to load...");
    await page.waitForTimeout(10000);

    console.log("Inspecting _runtimeInstance...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      const vmInst = rive._viewModelInstance;
      if (!vmInst) {
        console.log("No _viewModelInstance found.");
        return;
      }
      
      const ri = vmInst._runtimeInstance;
      console.log("=== _runtimeInstance ===");
      console.log("Type of _runtimeInstance:", typeof ri);
      if (ri) {
        console.log("Prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(ri)).join(", "));
        
        // Let's search if there are properties or values we can inspect
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(ri))) {
          if (typeof ri[key] !== 'function') {
            console.log(`  ri.${key} =`, ri[key]);
          }
        }
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
