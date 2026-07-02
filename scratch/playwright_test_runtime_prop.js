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

    console.log("Inspecting runtime instance properties...");
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
      
      const ri = vmInst._runtimeInstance;
      if (!ri) {
        console.log("No _runtimeInstance found.");
        return;
      }
      
      console.log("=== ri.getProperties() ===");
      try {
        const props = ri.getProperties();
        console.log("props type:", typeof props);
        if (props) {
          console.log("props keys:", Object.keys(props).join(", "));
          console.log("props size/length:", props.size ? props.size() : props.length);
          const size = props.size ? props.size() : props.length;
          for (let i = 0; i < size; i++) {
            const p = props.get ? props.get(i) : props[i];
            console.log(`  prop [${i}]: name="${p.name}" | type=${p.type}`);
          }
        }
      } catch (err) {
        console.log("getProperties failed:", err.message);
      }
      
      console.log("=== ri.number('propertyOfScreenMAPS') ===");
      try {
        const numProp = ri.number("propertyOfScreenMAPS");
        console.log("numProp:", numProp ? `Found (value=${numProp.value})` : "null");
        if (numProp) {
          numProp.value = 1;
          console.log("  Successfully set numProp.value to 1. New value:", numProp.value);
        }
      } catch (err) {
        console.log("ri.number('propertyOfScreenMAPS') failed:", err.message);
      }
      
      console.log("=== ri.enum('propertyOfScreenMAPS') ===");
      try {
        const enumProp = ri.enum("propertyOfScreenMAPS");
        console.log("enumProp:", enumProp ? `Found (value=${enumProp.value})` : "null");
      } catch (err) {
        console.log("ri.enum('propertyOfScreenMAPS') failed:", err.message);
      }
    });

  } catch (err) {
    console.error("Failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
}
run();
