const { chromium } = require('@playwright/test');

(async () => {
  const userDataDir = 'C:/Users/user/AppData/Local/Google/Chrome/User Data';
  const targetUrl = 'https://dev-lg-dashboard.t9platform-ph.com/#/agent/agent-management';

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: ['--profile-directory=Default'],
    slowMo: 200,
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  console.log('Browser opened with local profile. Leave this terminal running while watching the browser.');
})();
