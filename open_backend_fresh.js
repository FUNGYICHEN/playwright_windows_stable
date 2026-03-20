const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    slowMo: 200,
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('https://dev-lg-dashboard.t9platform-ph.com/#/agent/agent-management', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  console.log('Fresh Chrome opened. If login is required, complete login in the opened browser window, then return to chat.');
  setInterval(async () => {
    try {
      console.log('URL:', page.url());
    } catch (e) {}
  }, 10000);
})();
