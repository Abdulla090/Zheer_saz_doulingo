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

    console.log("Testing propertyFromPath...");
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
      
      // Let's test calling propertyFromPath on propertyOfScreenMAPS
      try {
        const prop = vmInst.propertyFromPath("propertyOfScreenMAPS");
        console.log("propertyFromPath('propertyOfScreenMAPS') type:", typeof prop);
        if (prop) {
          console.log("  keys:", Object.keys(prop).join(", "));
          console.log("  prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(prop)).join(", "));
          
          // Let's inspect descriptors of prototype
          const proto = Object.getPrototypeOf(prop);
          for (const key of Object.getOwnPropertyNames(proto)) {
            const desc = Object.getOwnPropertyDescriptor(proto, key);
            console.log(`    descriptor for '${key}': get=${typeof desc.get === 'function'}, set=${typeof desc.set === 'function'}`);
          }
          
          // Let's test reading/writing .value or other fields
          console.log("  current value field:", prop.value);
          try {
            prop.value = 1;
            console.log("  after setting prop.value = 1, value is:", prop.value);
          } catch (err) {
            console.log("  Failed to set prop.value:", err.message);
          }
        }
      } catch (e) {
        console.log("propertyFromPath failed:", e.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
