const { chromium } = require('playwright');
async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log("[Browser Console]:", msg.text());
  });

  console.log("Navigating to http://localhost:8081/(kids)...");
  try {
    await page.goto('http://localhost:8081/(kids)', { waitUntil: 'load', timeout: 30000 });
    console.log("Page loaded. Waiting 10 seconds for Rive to load...");
    await page.waitForTimeout(10000);

    console.log("Registering StateChange listener and testing 'triggerNEXT' on ScreenMAPS...");
    await page.evaluate(async () => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      rive.on("statechange", (event) => {
        console.log("[RIVE STATE CHANGE EVENT]:", Array.isArray(event.data) ? event.data.join(",") : event.data);
      });
      
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
      if (!triggerNext) {
        console.log("No triggerNEXT found.");
        return;
      }
      
      console.log("Firing screenMaps 'triggerNEXT' 1st time...");
      triggerNext.trigger();
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Firing screenMaps 'triggerNEXT' 2nd time...");
      triggerNext.trigger();
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Firing screenMaps 'triggerNEXT' 3rd time...");
      triggerNext.trigger();
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Firing screenMaps 'triggerNEXT' 4th time...");
      triggerNext.trigger();
      await new Promise(r => setTimeout(r, 2000));
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
