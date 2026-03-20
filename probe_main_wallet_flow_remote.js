const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  async function clickText(label) {
    const loc = page.getByText(label, { exact: true }).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await loc.click();
      await page.waitForTimeout(2000);
      console.log('CLICKED:', label, 'URL:', page.url());
      return true;
    }
    console.log('NOT FOUND:', label);
    return false;
  }

  await clickText('會員');
  await clickText('管理');
  const body = (await page.locator('body').innerText()).slice(0, 4000);
  console.log('BODY_START');
  console.log(body);
  console.log('BODY_END');
  await page.screenshot({ path: 'C:/Users/user/Desktop/playwright_windows_stable/main_wallet_probe_remote.png', fullPage: true });
  console.log('Saved screenshot: main_wallet_probe_remote.png');
})();
