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

    console.log("Testing setNumberStateAtPath with correct arguments...");
    await page.evaluate(async () => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      rive.on("statechange", (event) => {
        console.log("[RIVE STATE CHANGE EVENT]:", Array.isArray(event.data) ? event.data.join(",") : event.data);
      });
      
      const pathsToTry = [
        "propertyOfScreenMAPS",
        "base/propertyOfScreenMAPS",
        "ScreenMAPS/propertyOfScreenMAPS"
      ];
      
      for (const path of pathsToTry) {
        try {
          console.log(`Calling setNumberStateAtPath(1, '${path}')...`);
          rive.setNumberStateAtPath(1, path);
          console.log(`  Success for path: ${path}`);
        } catch (err) {
          console.log(`  Failed for path: ${path} | error:`, err.message);
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
