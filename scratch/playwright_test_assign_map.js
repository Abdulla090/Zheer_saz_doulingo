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

    console.log("Testing assignment to propertyOfScreenMAPS...");
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
      
      console.log("=== propertyOfScreenMAPS Property Descriptor ===");
      const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(vmInst), "propertyOfScreenMAPS");
      if (desc) {
        console.log("Has getter:", typeof desc.get === 'function');
        console.log("Has setter:", typeof desc.set === 'function');
      } else {
        console.log("No descriptor found on prototype.");
      }
      
      console.log("Current value:", vmInst.propertyOfScreenMAPS);
      
      // Let's try assigning a number
      try {
        console.log("Assigning vmInst.propertyOfScreenMAPS = 1...");
        vmInst.propertyOfScreenMAPS = 1;
        console.log("After assigning 1, value is:", vmInst.propertyOfScreenMAPS);
      } catch (err) {
        console.log("Assignment failed:", err.message);
      }
      
      // Let's try calling vmInst.number("propertyOfScreenMAPS")
      try {
        const num = vmInst.number("propertyOfScreenMAPS");
        console.log("vmInst.number('propertyOfScreenMAPS') returned:", num);
        if (num) {
          console.log("  value:", num.value);
          num.value = 1;
          console.log("  new value:", num.value);
        }
      } catch (err) {
        console.log("vmInst.number('propertyOfScreenMAPS') error:", err.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
