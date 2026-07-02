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

    console.log("Inspecting trigger property...");
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
      
      const screenMaps = vmInst.viewModel("propertyOfScreenMAPS");
      if (!screenMaps) {
        console.log("No propertyOfScreenMAPS found.");
        return;
      }
      
      const triggerNext = screenMaps.trigger("triggerNEXT");
      console.log("Type of triggerNext:", typeof triggerNext);
      if (triggerNext) {
        console.log("triggerNext keys:", Object.keys(triggerNext).join(", "));
        console.log("triggerNext prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(triggerNext)).join(", "));
        
        // Let's print out what methods are on triggerNext
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(triggerNext))) {
          console.log(`  triggerNext.${key} type=`, typeof triggerNext[key]);
        }
      }
      
      const parentTrigger = vmInst.trigger("propertyOfScreenMAPS/triggerNEXT");
      console.log("Type of parentTrigger:", typeof parentTrigger);
      if (parentTrigger) {
        console.log("parentTrigger prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(parentTrigger)).join(", "));
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
