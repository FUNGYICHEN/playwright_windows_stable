const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  const body = (await page.locator('body').innerText()).slice(0, 3000);
  console.log('BODY_START');
  console.log(body);
  console.log('BODY_END');
})();
