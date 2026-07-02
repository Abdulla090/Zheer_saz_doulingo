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

    console.log("Evaluating functions inspection...");
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
      
      console.log("=== inspect replaceViewModel ===");
      console.log("replaceViewModel.toString():", vmInst.replaceViewModel.toString());
      console.log("replaceViewModel.length:", vmInst.replaceViewModel.length);
      console.log("internalReplaceViewModel.toString():", vmInst.internalReplaceViewModel.toString());
      console.log("internalReplaceViewModel.length:", vmInst.internalReplaceViewModel.length);
      
      // Let's also inspect how viewmodel instances are created in the rive runtime
      console.log("Keys of window.riveDebug:", Object.keys(rive).join(", "));
      console.log("Prototype keys of window.riveDebug:", Object.getOwnPropertyNames(Object.getPrototypeOf(rive)).join(", "));
      
      // Let's inspect the global rive runtime object constructor or similar if available
      try {
        console.log("rive.runtimeInstance keys:", Object.keys(rive.runtimeInstance).join(", "));
      } catch (e) {}
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
