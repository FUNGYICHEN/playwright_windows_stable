const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();
  const input = page.locator('input[type="number"]').first();

  await input.scrollIntoViewIfNeeded();
  await input.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('-1');
  await page.waitForTimeout(500);
  const negativeResult = await input.evaluate((el) => ({
    value: el.value,
    min: el.min,
    validationMessage: el.validationMessage,
    valid: el.checkValidity(),
  }));

  await input.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('abc@#');
  await page.waitForTimeout(500);
  const specialResult = await input.evaluate((el) => ({
    value: el.value,
    min: el.min,
    validationMessage: el.validationMessage,
    valid: el.checkValidity(),
  }));

  console.log(JSON.stringify({ negativeResult, specialResult }, null, 2));
})();
