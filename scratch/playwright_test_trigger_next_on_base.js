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

    console.log("Evaluating trigger('Next') on parent ViewModel...");
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
      
      const nextTrigger = vmInst.trigger("Next");
      if (!nextTrigger) {
        console.log("No 'Next' trigger found on parent ViewModel.");
        return;
      }
      
      console.log("Firing parent 'Next' trigger once...");
      nextTrigger.trigger();
      
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Firing parent 'Next' trigger again...");
      nextTrigger.trigger();
      
      await new Promise(r => setTimeout(r, 2000));
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
