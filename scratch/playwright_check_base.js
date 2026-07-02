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
      const props = inst.propertyNames();
      console.log('base properties:', props);
      for (const p of props) {
        try {
           const val = inst.property(p);
           console.log('Prop:', p, 'Type:', typeof val, 'Value:', val?.value);
        } catch(e) {}
      }
    }
  });
  await browser.close();
}
run();
