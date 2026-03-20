const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const userDataDir = path.join(process.cwd(), '.controlled-profile');
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
  await page.waitForTimeout(4000);
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  const body = (await page.locator('body').innerText()).slice(0, 3000);
  console.log('BODY_START');
  console.log(body);
  console.log('BODY_END');
  setInterval(async () => {
    try { console.log('HEARTBEAT_URL:', page.url()); } catch (e) {}
  }, 15000);
})();
