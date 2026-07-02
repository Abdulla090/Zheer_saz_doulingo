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

    console.log("Listing all ViewModels...");
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
      
      // Let's find how many viewmodels are in the file/artboard
      // Wait, is there a way to query all viewModels from the artboard or loaded file?
      console.log("Artboard prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(artboard)).join(", "));
      
      // Let's print out what viewmodel definitions are registered in the Rive instance
      console.log("rive prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(rive)).join(", "));
      
      // Let's see if we can iterate over some internal list of viewmodels in rive.file
      const file = rive.file;
      if (file) {
        console.log("file prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(file)).join(", "));
      }
      
      // Let's check all viewmodel names we know from the strings dump:
      // ScreenMAPS, base, ScoreScreen, StreakScreen, BTM, BTNs, Btm, BtmVm, StreakScreenbaseAnima
      const vmNames = [
        "base", "ScreenMAPS", "ScoreScreen", "StreakScreen", "BTM", "BTNs", "Btm", "BtmVm", "StreakScreenbaseAnima"
      ];
      
      for (const name of vmNames) {
        try {
          const vm = rive.viewModelByName(name);
          if (vm) {
            console.log(`VM name="${name}":`);
            const count = typeof vm.instanceCount === 'function' ? vm.instanceCount() : vm.instanceCount;
            console.log(`  instanceCount:`, count);
            console.log(`  instanceNames:`, vm.instanceNames);
            if (vm.properties) {
              console.log(`  properties:`, Object.keys(vm.properties).join(", "));
              for (const pk in vm.properties) {
                console.log(`    - name="${vm.properties[pk].name}" type="${vm.properties[pk].type}"`);
              }
            }
          }
        } catch (err) {
          console.log(`Failed for VM "${name}":`, err.message);
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
