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

    console.log("Inspecting State Machine states...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      const artboard = rive.artboard;
      if (!artboard) {
        console.log("No artboard found.");
        return;
      }
      
      const smCount = artboard.stateMachineCount();
      console.log(`State Machine Count: ${smCount}`);
      for (let i = 0; i < smCount; i++) {
        const sm = artboard.stateMachineByIndex(i);
        console.log(`  SM [${i}]: name="${sm.name}"`);
        console.log(`    SM Prototype keys:`, Object.getOwnPropertyNames(Object.getPrototypeOf(sm)).join(", "));
        
        // Check state count
        if (typeof sm.stateCount === 'function') {
          const count = sm.stateCount();
          console.log(`    State Count: ${count}`);
          for (let j = 0; j < count; j++) {
            const state = sm.stateByIndex(j);
            console.log(`      State [${j}]: name="${state.name}"`);
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
