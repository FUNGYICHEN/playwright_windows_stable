const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  const active = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName,
      type: el.getAttribute('type'),
      placeholder: el.getAttribute('placeholder'),
      value: el.value || '',
      outer: (el.outerHTML || '').slice(0, 300),
    };
  });

  console.log('ACTIVE_ELEMENT:', JSON.stringify(active));
  const body = (await page.locator('body').innerText()).slice(0, 2000);
  console.log('BODY_START');
  console.log(body);
  console.log('BODY_END');
})();
