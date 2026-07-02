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

    console.log("Evaluating Rive ViewModels inspection...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      console.log("=== inspect Rive ViewModels ===");
      try {
        const count = rive.viewModelCount();
        console.log("rive.viewModelCount():", count);
        for (let i = 0; i < count; i++) {
          const vm = rive.viewModelByIndex(i);
          console.log(`  VM [${i}]: name="${vm.name}"`);
        }
      } catch (err) {
        console.log("Failed to inspect viewModels:", err.message);
      }
      
      try {
        // Let's print out what methods are available on the rive runtime or artboard to get or instantiate a viewModel
        const artboard = rive.artboard;
        if (artboard) {
          console.log("artboard prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(artboard)).join(", "));
        }
      } catch (err) {}
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
