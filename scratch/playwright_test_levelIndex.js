const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://localhost:8081/(kids)');
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const rive = window.riveDebug;
    const vm = rive.viewModelByName('base');
    if (vm) {
      const inst = vm.defaultInstance();
      try {
        const prop = inst.number("levelIndex");
        if (prop) {
           console.log("Setting levelIndex to 100");
           prop.value = 100;
        }
      } catch(e) {}
    }
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'scratch/map_screenshot_levelIndex100.png' });
  await browser.close();
}
run();
