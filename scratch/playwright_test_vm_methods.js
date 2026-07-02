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

    console.log("Evaluating VM methods test script...");
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
      
      console.log("=== VM INSTANCE METHODS TEST ===");
      
      // Let's test calling `vmInst.number`
      try {
        const xBtm = vmInst.number("xBtmValue");
        console.log("vmInst.number('xBtmValue') keys:", xBtm ? Object.keys(xBtm).join(", ") : "null");
        if (xBtm) {
          console.log("  value:", xBtm.value);
        }
      } catch (e) {
        console.log("vmInst.number('xBtmValue') failed:", e.message);
      }
      
      try {
        const haptic = vmInst.number("haptic");
        console.log("vmInst.number('haptic') value:", haptic ? haptic.value : "null");
      } catch (e) {
        console.log("vmInst.number('haptic') failed:", e.message);
      }

      // Let's test calling `vmInst.viewModel` for nested viewmodel propertyOfScreenMAPS
      try {
        const screenMaps = vmInst.viewModel("propertyOfScreenMAPS");
        console.log("vmInst.viewModel('propertyOfScreenMAPS') keys:", screenMaps ? Object.keys(screenMaps).join(", ") : "null");
        if (screenMaps) {
          console.log("  viewModelName:", screenMaps.viewModelName);
          // print properties
          if (screenMaps.properties) {
            console.log("  properties keys:", Object.keys(screenMaps.properties).join(", "));
            for (const key in screenMaps.properties) {
              const prop = screenMaps.properties[key];
              console.log(`    - name="${prop.name}" | type="${prop.type}"`);
            }
          }
        }
      } catch (e) {
        console.log("vmInst.viewModel('propertyOfScreenMAPS') failed:", e.message);
      }

      // Let's test calling `vmInst.viewModel` for other viewmodels
      try {
        const btm = vmInst.viewModel("propertyOfBtm");
        console.log("vmInst.viewModel('propertyOfBtm') keys:", btm ? Object.keys(btm).join(", ") : "null");
        if (btm) {
          console.log("  viewModelName:", btm.viewModelName);
          if (btm.properties) {
            console.log("  properties keys:", Object.keys(btm.properties).join(", "));
            for (const key in btm.properties) {
              const prop = btm.properties[key];
              console.log(`    - name="${prop.name}" | type="${prop.type}"`);
            }
          }
        }
      } catch (e) {
        console.log("vmInst.viewModel('propertyOfBtm') failed:", e.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
