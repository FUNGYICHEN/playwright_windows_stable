const { test, expect } = require('@playwright/test');
const { config } = require('../helpers/config');
const { setLocale } = require('../helpers/locale');
const { login, logout } = require('../helpers/auth');

const authedCategories = [
  ['真人', /\/Categories\/casino/],
  ['電子', /\/Categories\/slots/],
];

test.beforeEach(async ({ page }) => {
  await setLocale(page, 'tw');
});

test('WIN-AUTH-001 可登入並看到帳號資訊', async ({ page }) => {
  await login(page);
  const body = await page.locator('body').innerText();
  expect(body).toContain(config.loginUser);
  expect(body).toContain('投注紀錄');
});

test('WIN-AUTH-002 登入後會員功能文案存在', async ({ page }) => {
  await login(page);
  const body = await page.locator('body').innerText();
  for (const text of ['投注紀錄', '會員訊息', '維護時間', '登出']) {
    expect(body).toContain(text);
  }
});

test('WIN-AUTH-003 登入後會建立主要登入 cookie', async ({ page }) => {
  await login(page);
  const cookieNames = (await page.context().cookies(config.baseURL)).map((cookie) => cookie.name);
  expect(cookieNames).toContain('LaiTsai');
  expect(cookieNames).toContain('userLaiTsai');
});

test('WIN-AUTH-004 登入後可切換真人與電子頁', async ({ page }) => {
  await login(page);
  for (const [label, urlPattern] of authedCategories) {
    await page.getByText(label, { exact: true }).first().click();
    await expect(page).toHaveURL(urlPattern);
    // Page has no <header>/<nav>; username is in a <p class="...font-medium..."> element in the top navbar
    const usernameLoc = page.locator('[class*="font-medium"]:has-text("' + config.loginUser + '")').first();
    await expect(usernameLoc).toBeVisible();
  }
});

test('WIN-AUTH-005 可登出並回到未登入狀態', async ({ page }) => {
  await login(page);
  await logout(page);
  const cookieNames = (await page.context().cookies(config.baseURL)).map((cookie) => cookie.name);
  expect(cookieNames).not.toContain('LaiTsai');
  await expect(page.getByRole('button', { name: '登入' })).toBeVisible();
  await expect(page.getByText(config.loginUser).nth(1)).toHaveCount(0);
});
