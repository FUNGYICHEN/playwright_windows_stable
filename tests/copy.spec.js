const { test, expect } = require('@playwright/test');
const { config } = require('../helpers/config');
const { setLocale } = require('../helpers/locale');
const { gotoHome, gotoLogin } = require('../helpers/auth');

test.beforeEach(async ({ page }) => {
  await setLocale(page, 'tw');
});

test('WIN-COPY-001 首頁標題與頁尾文案一致', async ({ page }) => {
  await gotoHome(page);
  await expect(page).toHaveTitle('LM來財信用網');
  await expect(page.getByText('Copyright © 2025 LaiCai All rights reserved.')).toBeVisible();
});

test('WIN-COPY-002 登入頁 placeholder 與 CTA 文案正確', async ({ page }) => {
  await gotoLogin(page);
  await expect(page.locator('input.input-style').nth(0)).toHaveAttribute('placeholder', '請填寫4-10位的字母或數字');
  await expect(page.locator('input.input-style').nth(1)).toHaveAttribute('placeholder', '請填寫 8-20 位的字母或數字');
  await expect(page.getByRole('button', { name: '登入' })).toContainText('登入');
  await expect(page.getByRole('button', { name: '先去逛逛' })).toContainText('先去逛逛');
});

test('WIN-COPY-003 登入頁欄位標籤文案正確', async ({ page }) => {
  await gotoLogin(page);
  const loginBody = await page.locator('body').innerText();
  expect(loginBody).toContain('會員登入');
  expect(loginBody).toContain('會員帳號');
  expect(loginBody).toContain('登入密碼');
});

test('WIN-COPY-004 登入頁免責聲明文案存在', async ({ page }) => {
  await gotoLogin(page);
  const loginBody = await page.locator('body').innerText();
  expect(loginBody).toContain('登入即表示您已閱讀並同意本平台之');
  expect(loginBody).toContain('免責聲明');
  expect(loginBody).toContain('如不同意請勿使用本服務');
});

test('WIN-COPY-005 首頁四個主分類文案順序一致', async ({ page }) => {
  await gotoHome(page);
  const navTexts = await page.locator('a[href^="/Categories/"]').evaluateAll((links) =>
    links
      .map((link) => (link.textContent || '').trim())
      .filter(Boolean)
      .slice(0, 4)
  );
  expect(navTexts).toEqual(['熱門', '真人', '電子', '捕魚']);
});
