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

    console.log("Evaluating Rive property inspection script...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      console.log("=== RIVE PROPERTY INSPECTION ===");
      const vmInst = rive._viewModelInstance;
      if (!vmInst) {
        console.log("No _viewModelInstance found.");
        return;
      }
      
      console.log("viewModelName:", vmInst.viewModelName);
      
      try {
        console.log("Type of properties:", typeof vmInst.properties);
        console.log("vmInst.properties:", vmInst.properties);
        if (typeof vmInst.properties === 'object') {
          console.log("Properties keys:", Object.keys(vmInst.properties).join(", "));
          // Let's dump all property values
          for (const key in vmInst.properties) {
            console.log(`  Property key "${key}":`, vmInst.properties[key]);
            try {
              const valObj = vmInst.properties[key];
              console.log(`    value=`, valObj.value, `type=`, typeof valObj.value);
            } catch (err) {}
          }
        }
      } catch (e) {
        console.log("Error reading properties:", e.message);
      }
      
      // Let's try to query the viewmodel via rive.artboard.inputByPath or propertyFromPath
      try {
        const prop = vmInst.propertyFromPath("propertyOfScreenMAPS");
        console.log("propertyFromPath('propertyOfScreenMAPS'):", prop ? prop.name : "null");
        if (prop) {
          console.log("  keys:", Object.keys(prop).join(", "));
          console.log("  value:", prop.value);
        }
      } catch (e) {
        console.log("Error propertyFromPath:", e.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
