const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const userDataDir = path.join(process.cwd(), '.controlled-profile');
  fs.mkdirSync(userDataDir, { recursive: true });

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1440, height: 900 },
    slowMo: 200,
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://dev-lg-dashboard.t9platform-ph.com/#/agent/agent-management', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  console.log('Controlled Chrome opened. Log in within this browser window.');
  console.log('After login reaches dashboard/agent pages, tell Annie to continue.');

  setInterval(async () => {
    try {
      console.log('URL:', page.url());
    } catch (e) {}
  }, 10000);
})();
