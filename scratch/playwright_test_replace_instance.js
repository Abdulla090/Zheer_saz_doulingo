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

    console.log("Testing ViewModel replacement...");
    await page.evaluate(async () => {
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
      
      const screenMapsVmDef = rive.viewModelByName("ScreenMAPS");
      if (!screenMapsVmDef) {
        console.log("ScreenMAPS ViewModel definition not found.");
        return;
      }
      
      console.log("=== ScreenMAPS Definition ===");
      console.log("instanceCount:", typeof screenMapsVmDef.instanceCount === 'function' ? screenMapsVmDef.instanceCount() : screenMapsVmDef.instanceCount);
      console.log("instanceNames:", screenMapsVmDef.instanceNames);
      
      const count = typeof screenMapsVmDef.instanceCount === 'function' ? screenMapsVmDef.instanceCount() : screenMapsVmDef.instanceCount;
      for (let i = 0; i < count; i++) {
        try {
          const inst = screenMapsVmDef.instanceByIndex(i);
          console.log(`  Instance [${i}]: name="${inst ? inst.viewModelName : 'null'}"`);
        } catch (e) {
          console.log(`  Failed to get instance [${i}]:`, e.message);
        }
      }
      
      // Let's try replacing it with instance 1
      if (count > 1) {
        console.log("Replacing propertyOfScreenMAPS with instance 1...");
        try {
          const inst1 = screenMapsVmDef.instanceByIndex(1);
          const res = vmInst.replaceViewModel("propertyOfScreenMAPS", inst1);
          console.log("replaceViewModel result:", res);
        } catch (err) {
          console.log("replaceViewModel failed:", err.message);
        }
      }
      
      await new Promise(r => setTimeout(r, 2000));
      
      // Let's try replacing it with instance 2
      if (count > 2) {
        console.log("Replacing propertyOfScreenMAPS with instance 2...");
        try {
          const inst2 = screenMapsVmDef.instanceByIndex(2);
          const res = vmInst.replaceViewModel("propertyOfScreenMAPS", inst2);
          console.log("replaceViewModel result:", res);
        } catch (err) {
          console.log("replaceViewModel failed:", err.message);
        }
      }
      
      await new Promise(r => setTimeout(r, 2000));
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
