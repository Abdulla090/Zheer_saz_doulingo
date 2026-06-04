const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://127.0.0.1:8081...');
  try {
    await page.goto('http://127.0.0.1:8081', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Page loaded successfully.');
    await page.waitForTimeout(5000); // wait for JS to execute

    const text = await page.evaluate(() => document.body.innerText);
    console.log('BODY TEXT:\n', text);
    
    // Also save html
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('web-output-dev.html', html);

  } catch (err) {
    console.log('Navigation failed:', err.message);
  }

  await browser.close();
})();
