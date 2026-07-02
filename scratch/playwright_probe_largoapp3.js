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
      console.log("base properties: ", inst.propertyNames());
      for (const p of inst.propertyNames()) {
        try {
           const prop = inst.property(p);
           console.log(`Prop ${p} = ${prop.value} (type: ${prop.type})`);
        } catch(e) {}
      }
    }
  });
  await browser.close();
}
run();
