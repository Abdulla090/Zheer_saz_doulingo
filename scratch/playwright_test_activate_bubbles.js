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

    console.log("Activating all bubbles...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      const file = rive.file;
      if (!file) {
        console.log("No file found.");
        return;
      }
      
      // Let's get the BtmVm ViewModel and set colorOn = true for all its instances
      try {
        const btmVm = rive.viewModelByName("BtmVm");
        if (btmVm) {
          const count = typeof btmVm.instanceCount === 'function' ? btmVm.instanceCount() : btmVm.instanceCount;
          console.log(`Setting colorOn=true and nextBTM=true for all ${count} BtmVm instances...`);
          for (let i = 0; i < count; i++) {
            const inst = btmVm.instanceByIndex(i);
            if (inst) {
              // Let's set properties
              try {
                const colorProp = inst.boolean("colorOn");
                if (colorProp) {
                  colorProp.value = true;
                  console.log(`  Set colorOn=true on BtmVm instance [${i}]`);
                }
              } catch (e) {}
              
              try {
                const nextBtmProp = inst.boolean("nextBTM");
                if (nextBtmProp) {
                  nextBtmProp.value = true;
                  console.log(`  Set nextBTM=true on BtmVm instance [${i}]`);
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.log("Failed for BtmVm:", err.message);
      }
      
      // Let's get the Btm ViewModel and set actif/isPressed properties
      try {
        const btm = rive.viewModelByName("Btm");
        if (btm) {
          const count = typeof btm.instanceCount === 'function' ? btm.instanceCount() : btm.instanceCount;
          console.log(`Setting properties for all ${count} Btm instances...`);
          for (let i = 0; i < count; i++) {
            const inst = btm.instanceByIndex(i);
            if (inst) {
              try {
                const actifProp = inst.trigger("actif");
                if (actifProp) {
                  actifProp.trigger();
                  console.log(`  Fired actif trigger on Btm instance [${i}]`);
                }
              } catch (e) {}
              
              try {
                const isPressedProp = inst.boolean("isPressed");
                if (isPressedProp) {
                  isPressedProp.value = true;
                  console.log(`  Set isPressed=true on Btm instance [${i}]`);
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.log("Failed for Btm:", err.message);
      }
    });

    await page.waitForTimeout(5000);

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
