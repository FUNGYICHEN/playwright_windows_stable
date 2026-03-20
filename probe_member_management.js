const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const userDataDir = path.join(process.cwd(), '.controlled-profile');
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1440, height: 900 },
    slowMo: 300,
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://dev-lg-dashboard.t9platform-ph.com/#/agent/agent-management', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  async function clickIfExists(label) {
    const loc = page.getByText(label, { exact: true }).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await loc.click();
      await page.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  console.log('STEP: try click 會員');
  await clickIfExists('會員');
  console.log('STEP: try click 管理');
  await clickIfExists('管理');
  console.log('STEP: current URL =', page.url());
  const body = (await page.locator('body').innerText()).slice(0, 4000);
  console.log('BODY_START');
  console.log(body);
  console.log('BODY_END');
  await page.screenshot({ path: 'C:/Users/user/Desktop/playwright_windows_stable/member_management_probe.png', fullPage: true });
  console.log('Saved screenshot to member_management_probe.png');
  setInterval(async () => {
    try { console.log('HEARTBEAT_URL:', page.url()); } catch (e) {}
  }, 15000);
})();
