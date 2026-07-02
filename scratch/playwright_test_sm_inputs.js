const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://localhost:8081/(kids)');
  await page.waitForTimeout(10000);
  await page.evaluate(() => {
    const rive = window.riveDebug;
    try {
      const smNames = rive.stateMachineNames || [];
      const smName = smNames[0] || "State Machine 1";
      const inputs = rive.stateMachineInputs(smName);
      if (inputs) {
        const levelSelected = inputs.find(i => i.name === "levelSelected");
        if (levelSelected) {
          console.log("Setting levelSelected = 6");
          levelSelected.value = 6;
        }
        const levelTrig = inputs.find(i => i.name === "level");
        if (levelTrig) {
          console.log("Triggering level");
          levelTrig.fire();
        }
      }
    } catch(e) { console.error(e) }
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'scratch/map_screenshot_level6.png' });
  await browser.close();
}
run();
