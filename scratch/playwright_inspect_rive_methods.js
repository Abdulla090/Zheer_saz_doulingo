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

    console.log("Inspecting rive.viewModelInstance...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      console.log("=== rive.viewModelInstance ===");
      console.log("type:", typeof rive.viewModelInstance);
      if (typeof rive.viewModelInstance === 'function') {
        console.log("toString():", rive.viewModelInstance.toString());
        console.log("length:", rive.viewModelInstance.length);
        
        try {
          const res = rive.viewModelInstance();
          console.log("Calling rive.viewModelInstance():", res);
        } catch (e) {
          console.log("Calling rive.viewModelInstance() error:", e.message);
        }
      }
      
      console.log("=== rive.bindViewModelInstance ===");
      console.log("type:", typeof rive.bindViewModelInstance);
      if (typeof rive.bindViewModelInstance === 'function') {
        console.log("toString():", rive.bindViewModelInstance.toString());
        console.log("length:", rive.bindViewModelInstance.length);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
