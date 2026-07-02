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

    console.log("Evaluating nested viewmodel inspection script...");
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
      
      console.log("=== NESTED VIEWMODELS ===");
      const nestedVms = vmInst._viewModelInstances;
      console.log("Type of _viewModelInstances:", typeof nestedVms);
      if (nestedVms) {
        // If it's a Map, Set, Array, or Object
        let items = [];
        if (typeof nestedVms.forEach === 'function') {
          nestedVms.forEach((val, key) => {
            items.push({ key, val });
          });
        } else if (Array.isArray(nestedVms)) {
          items = nestedVms.map((val, key) => ({ key, val }));
        } else {
          for (const key in nestedVms) {
            items.push({ key, val: nestedVms[key] });
          }
        }
        
        console.log(`Found ${items.length} nested ViewModelInstances:`);
        items.forEach(({ key, val }, index) => {
          console.log(`  [${index}] Key="${key}" | viewModelName="${val.viewModelName}"`);
          // Print properties of this nested VM
          try {
            if (val.properties) {
              const propKeys = Object.keys(val.properties);
              console.log(`    Properties (${propKeys.length}):`);
              propKeys.forEach(pk => {
                const prop = val.properties[pk];
                console.log(`      - name="${prop.name}" | type="${prop.type}"`);
              });
            }
          } catch (err) {
            console.log(`    Error reading properties:`, err.message);
          }
        });
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}

run();
