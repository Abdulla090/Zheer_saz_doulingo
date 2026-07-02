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

    console.log("Evaluating property value inspection script...");
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
      
      const prop = vmInst.properties[0]; // propertyOfScreenMAPS
      console.log("=== PROPERTY OBJECT ===");
      console.log("Keys of propertyOfScreenMAPS:", Object.keys(prop).join(", "));
      const proto = Object.getPrototypeOf(prop);
      console.log("Prototype keys:", Object.getOwnPropertyNames(proto).join(", "));
      
      // Let's dump all fields of prop
      for (const key in prop) {
        try {
          console.log(`  prop.${key} =`, prop[key], `type=`, typeof prop[key]);
        } catch (e) {
          console.log(`  prop.${key} error:`, e.message);
        }
      }
      
      // Let's inspect other properties of type viewModel (like propertyOfBtm)
      const btmProp = vmInst.properties[18]; // propertyOfBtm
      console.log("=== propertyOfBtm PROPERTY OBJECT ===");
      for (const key in btmProp) {
        try {
          console.log(`  btmProp.${key} =`, btmProp[key], `type=`, typeof btmProp[key]);
        } catch (e) {}
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
