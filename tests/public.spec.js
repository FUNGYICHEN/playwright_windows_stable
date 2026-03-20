const { test, expect } = require('@playwright/test');
const { config } = require('../helpers/config');
const { setLocale } = require('../helpers/locale');
const { gotoHome, gotoLogin } = require('../helpers/auth');

const categories = [
  ['熱門', '/Categories/hot', /\/Categories\/hot/],
  ['真人', '/Categories/casino', /\/Categories\/casino/],
  ['電子', '/Categories/slots', /\/Categories\/slots/],
  ['捕魚', '/Categories/fishing', /\/Categories\/fishing/],
];

test.beforeEach(async ({ page }) => {
  await setLocale(page, 'tw');
  await gotoHome(page);
});

test('WIN-PUB-001 首頁可正常開啟', async ({ page }) => {
  await expect(page).toHaveURL(/dev-lt\.t9platform\.com/);
});

test('WIN-PUB-002 首頁主要分類顯示', async ({ page }) => {
  for (const [label] of categories) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

test('WIN-PUB-003 首頁主要分類連結存在', async ({ page }) => {
  for (const [, route] of categories) {
    await expect(page.locator(`a[href="${route}"]`).first()).toBeVisible();
  }
});

test('WIN-PUB-004 客服入口顯示', async ({ page }) => {
  await expect(page.getByText('24小時客服').first()).toBeVisible();
});

test('WIN-PUB-005 語系 icon 存在', async ({ page }) => {
  await expect(page.locator('img[alt="Language"]').first()).toBeVisible();
});

test('WIN-PUB-006 版權資訊顯示', async ({ page }) => {
  await expect(page.getByText('Copyright © 2025 LaiCai All rights reserved.')).toBeVisible();
});

test('WIN-PUB-007 登入頁元素存在', async ({ page }) => {
  await gotoLogin(page);
  await expect(page.locator('input.input-style').nth(0)).toBeVisible();
  await expect(page.locator('input.input-style').nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: '登入' })).toBeVisible();
});

test('WIN-PUB-008 首頁分類可導向對應頁面', async ({ page }) => {
  for (const [label, , urlPattern] of categories) {
    await gotoHome(page);
    await page.getByText(label, { exact: true }).first().click();
    await expect(page).toHaveURL(urlPattern);
  }
});

test('WIN-PUB-009 首頁登入 CTA 可進入登入頁', async ({ page }) => {
  await page.getByRole('button', { name: '登入' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('input.input-style').nth(0)).toBeVisible();
});

test('WIN-PUB-010 客服連結指向 Lin.ee', async ({ page }) => {
  const supportLink = page.getByRole('link', { name: '24小時客服' });
  await expect(supportLink).toHaveAttribute('href', /lin\.ee/);
});

test('WIN-PUB-011 登入頁先去逛逛可回首頁', async ({ page }) => {
  await gotoLogin(page);
  await page.getByRole('button', { name: '先去逛逛' }).click();
  await expect(page).toHaveURL(new RegExp(`^${config.baseURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}?$`));
  await expect(page.getByText('熱門', { exact: true }).first()).toBeVisible();
});
