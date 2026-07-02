const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://localhost:8081/(kids)');
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const rive = window.riveDebug;
    if (rive) {
      const inputs = rive.stateMachineInputs("State Machine 1");
      console.log("Inputs length:", inputs ? inputs.length : "null");
      if (inputs) {
        inputs.forEach(i => console.log("Input:", i.name, i.type, i.value));
      }
    }
  });
  await browser.close();
}
run();
