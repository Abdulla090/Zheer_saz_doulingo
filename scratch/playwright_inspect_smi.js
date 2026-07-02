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

    console.log("Evaluating stateMachineInputs return value inspection...");
    await page.evaluate(() => {
      const rive = window.riveDebug;
      if (!rive) {
        console.log("Rive instance window.riveDebug not found!");
        return;
      }
      
      const inputs = rive.stateMachineInputs("State Machine 1");
      console.log("=== State Machine Inputs ===");
      console.log("Type of inputs:", typeof inputs);
      console.log("Is array:", Array.isArray(inputs));
      if (inputs) {
        console.log("Length:", inputs.length);
        console.log("Keys:", Object.keys(inputs).join(", "));
        console.log("Stringified:", JSON.stringify(inputs));
        for (let i = 0; i < inputs.length; i++) {
          const inp = inputs[i];
          console.log(`Input [${i}]:`);
          for (const key in inp) {
            try {
              console.log(`  inp.${key} =`, inp[key], `type=`, typeof inp[key]);
            } catch (err) {}
          }
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
