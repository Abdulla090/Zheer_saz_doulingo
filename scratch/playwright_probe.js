const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Start a local server to receive custom Rive logs if needed
const http = require('http');
const logFile = path.join(__dirname, 'playwright_browser_logs.txt');
fs.writeFileSync(logFile, '');

const logServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = new URL(req.url, `http://${req.headers.host}`);
  const msg = url.searchParams.get('msg');
  if (msg) {
    console.log("[Rive Web Msg]:", msg);
    fs.appendFileSync(logFile, msg + '\n');
  }
  res.writeHead(200);
  res.end('ok');
});
logServer.listen(9999, '0.0.0.0');

async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type()}]:`, msg.text());
    fs.appendFileSync(logFile, `[Console ${msg.type()}]: ${msg.text()}\n`);
  });
  
  page.on('pageerror', err => {
    console.log('[Browser PageError]:', err.message);
    fs.appendFileSync(logFile, `[PageError]: ${err.message}\n`);
  });

  console.log("Navigating to http://localhost:8081/(kids)...");
  try {
    await page.goto('http://localhost:8081/(kids)', { waitUntil: 'load', timeout: 30000 });
    console.log("Page loaded. Waiting 10 seconds for Rive initialization...");
    await page.waitForTimeout(10000);
  } catch (err) {
    console.error("Navigation or wait failed:", err);
  }

  console.log("Closing browser...");
  await browser.close();
  logServer.close();
  console.log("Done. Check playwright_browser_logs.txt for details.");
}

run();
