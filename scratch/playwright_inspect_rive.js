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

    console.log("Evaluating Rive inspection script...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      console.log("=== RIVE DETAILED INSPECTION ===");
      const vmInst = rive._viewModelInstance;
      if (!vmInst) {
        console.log("No _viewModelInstance found on rive instance.");
      } else {
        console.log("=== ViewModelInstance found ===");
        console.log("Keys of _viewModelInstance:", Object.keys(vmInst).join(", "));
        const proto = Object.getPrototypeOf(vmInst);
        console.log("Prototype keys:", Object.getOwnPropertyNames(proto).join(", "));
        
        // Let's print out some common properties of the ViewModelInstance
        const propertiesToTry = ["xBtmValue", "haptic", "level", "levelIndex", "propertyOfScreenMAPS", "levelSelected", "propertyOfBtmVm"];
        for (const prop of propertiesToTry) {
          try {
            console.log(`Property "${prop}":`, vmInst[prop]);
          } catch (e) {
            console.log(`Failed to read "${prop}":`, e.message);
          }
        }
      }
      
      // Let's list all elements of the artboard textruns
      try {
        const artboard = rive.artboard;
        if (artboard && typeof artboard.textValueRunCount === 'function') {
          const count = artboard.textValueRunCount();
          console.log(`TextValueRunCount: ${count}`);
          for (let i = 0; i < count; i++) {
            const run = artboard.textValueRunByIndex(i);
            console.log(`  TextRun ${i}: name="${run.name}" text="${run.text}"`);
          }
        }
      } catch (e) {
        console.log("Error checking text runs:", e.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
