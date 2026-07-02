const { chromium } = require('playwright');
const fs = require('fs');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://localhost:8081/(kids)');
  await page.waitForTimeout(10000); // Wait for Rive to load

  for (let mapIndex = 0; mapIndex < 4; mapIndex++) {
    console.log(`Setting propertyOfScreenMAPS = ${mapIndex}`);
    await page.evaluate((idx) => {
      const rive = window.riveDebug;
      if (!rive) return;
      const smNames = rive.stateMachineNames || [];
      const smName = smNames[0] || "State Machine 1";
      const inputs = rive.stateMachineInputs(smName);
      if (inputs) {
        const mapsProp = inputs.find(i => i.name === "propertyOfScreenMAPS");
        if (mapsProp) mapsProp.value = idx;
      }
    }, mapIndex);
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `scratch/map_screenshot_${mapIndex}.png` });
  }

  await browser.close();
}
run();
