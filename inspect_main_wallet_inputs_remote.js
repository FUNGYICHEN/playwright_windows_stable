const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  const inputs = await page.locator('input, textarea').evaluateAll((els) => els.map((el, i) => ({
    index: i,
    tag: el.tagName,
    type: el.getAttribute('type'),
    placeholder: el.getAttribute('placeholder'),
    value: el.value || '',
    name: el.getAttribute('name'),
    ariaLabel: el.getAttribute('aria-label'),
    outer: (el.outerHTML || '').slice(0, 250),
  })));

  console.log(JSON.stringify(inputs, null, 2));
})();
