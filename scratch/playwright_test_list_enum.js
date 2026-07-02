const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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

    console.log("Evaluating enum/list test script...");
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
      
      console.log("=== VM enum/list TEST ===");
      
      try {
        const enVal = vmInst.enum("propertyOfScreenMAPS");
        console.log("vmInst.enum('propertyOfScreenMAPS'):", enVal ? Object.keys(enVal).join(", ") : "null");
        if (enVal) {
          console.log("  value:", enVal.value);
        }
      } catch (e) {
        console.log("vmInst.enum('propertyOfScreenMAPS') failed:", e.message);
      }
      
      try {
        const liVal = vmInst.list("propertyOfScreenMAPS");
        console.log("vmInst.list('propertyOfScreenMAPS'):", liVal ? Object.keys(liVal).join(", ") : "null");
        if (liVal) {
          console.log("  value:", liVal.value);
        }
      } catch (e) {
        console.log("vmInst.list('propertyOfScreenMAPS') failed:", e.message);
      }
      
      // Let's also see what `vmInst.viewModel("propertyOfScreenMAPS")` has as properties/methods
      try {
        const vmVal = vmInst.viewModel("propertyOfScreenMAPS");
        if (vmVal) {
          console.log("viewModel prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(vmVal)).join(", "));
        }
      } catch (e) {}
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
