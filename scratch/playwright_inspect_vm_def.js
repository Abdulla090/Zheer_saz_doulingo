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

    console.log("Inspecting ViewModel definition...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      // Let's get the viewModel definition object using rive.viewModelByName or similar
      // Wait, let's check what methods are on rive to get a viewModel definition
      console.log("Rive methods for viewmodel:");
      const proto = Object.getPrototypeOf(rive);
      const vmMethods = Object.getOwnPropertyNames(proto).filter(k => k.toLowerCase().includes("viewmodel"));
      console.log("  methods:", vmMethods.join(", "));
      
      // Let's call them
      if (typeof rive.viewModelByName === 'function') {
        const baseVm = rive.viewModelByName("base");
        console.log("baseVm type:", typeof baseVm);
        if (baseVm) {
          console.log("baseVm prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(baseVm)).join(", "));
          for (const key in baseVm) {
            console.log(`  baseVm.${key} =`, baseVm[key]);
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
