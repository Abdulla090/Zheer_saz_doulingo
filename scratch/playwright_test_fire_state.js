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

    console.log("Evaluating fireStateAtPath...");
    await page.evaluate(async () => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      console.log("Firing triggerNEXT via fireStateAtPath...");
      try {
        rive.fireStateAtPath("triggerNEXT", "propertyOfScreenMAPS");
        console.log("Called fireStateAtPath('triggerNEXT', 'propertyOfScreenMAPS')");
      } catch (err) {
        console.log("fireStateAtPath failed:", err.message);
      }
      
      // Wait to see state change logs
      await new Promise(r => setTimeout(r, 2000));
      
      // Let's also check if the state changes or what triggers are available
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
