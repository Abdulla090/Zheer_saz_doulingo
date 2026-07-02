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

    console.log("Evaluating artboard inputByPath inspection...");
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
      
      console.log("=== ARTBOARD INPUT BY PATH TEST ===");
      const pathsToTry = [
        "propertyOfScreenMAPS",
        "xBtmValue",
        "haptic",
        "base/propertyOfScreenMAPS",
        "base/xBtmValue"
      ];
      
      for (const p of pathsToTry) {
        try {
          const val = artboard.inputByPath(p);
          console.log(`inputByPath('${p}'):`, val ? `Found (name="${val.name}", type=${val.type})` : "null");
          if (val) {
            console.log(`  keys:`, Object.keys(val).join(", "));
            console.log(`  value:`, val.value);
            // Let's see if we can set value
            try {
              val.value = 1;
              console.log(`  Set value to 1 successful! New value:`, val.value);
            } catch (err) {
              console.log(`  Failed to set value:`, err.message);
            }
          }
        } catch (e) {
          console.log(`inputByPath('${p}') error:`, e.message);
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
