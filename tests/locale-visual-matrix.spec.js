const { test, expect } = require('@playwright/test');
const {
  gotoLoginWithLocale,
  gotoHomeWithLocale,
  loginWithLocale,
  openMemberMenu,
  openMemberScreen,
  collectTextOverflowIssues,
} = require('../helpers/member');

const locales = [
  ['tw', '繁中'],
  ['cn', '簡中'],
  ['en', '英文'],
  ['th', '泰文'],
  ['vn', '越文'],
];

async function expectNoMeaningfulOverflow(page, contextLabel) {
  const overflowIssues = await collectTextOverflowIssues(page);
  expect(overflowIssues, `${contextLabel} 發現可能超框/跑版元素：${JSON.stringify(overflowIssues, null, 2)}`).toEqual([]);
}

for (const [locale, localeLabel] of locales) {
  test(`WIN-LVIS-${locale.toUpperCase()}-001 ${localeLabel}首頁 shell baseline + overflow`, async ({ page }) => {
    await gotoHomeWithLocale(page, locale);
    // Wait for SPA dynamic content to settle
    await page.waitForTimeout(3000);
    await expect(page).toHaveScreenshot(`locale-${locale}-home-shell.png`, {
      fullPage: true,
      animations: 'disabled',
      mask: [
        // Banner images (dynamic)
        page.locator('img[src*="Page/Pc"]'),
        page.locator('img[src*="MainPageImage"]'),
        page.locator('[class*="banner"] img'),
        // Announcement bar (dynamic marquee with known site bug)
        page.locator('[class*="lg:via-[#FFF1A3]"]'),
      ],
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}首頁`);
  });

  test(`WIN-LVIS-${locale.toUpperCase()}-002 ${localeLabel}登入頁表單與規章文案 baseline + overflow`, async ({ page }) => {
    await gotoLoginWithLocale(page, locale);
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot(`locale-${locale}-login-page.png`, {
      fullPage: true,
      animations: 'disabled',
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}登入頁`);
  });

  test(`WIN-LVIS-${locale.toUpperCase()}-003 ${localeLabel}會員側欄 baseline + overflow`, async ({ page }) => {
    await loginWithLocale(page, locale);
    await openMemberMenu(page);
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot(`locale-${locale}-member-menu.png`, {
      fullPage: true,
      animations: 'disabled',
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}會員側欄`);
  });

  test(`WIN-LVIS-${locale.toUpperCase()}-004 ${localeLabel}投注紀錄頁 baseline + overflow`, async ({ page }) => {
    await loginWithLocale(page, locale);
    await openMemberScreen(page, locale, 'bettingRecord');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot(`locale-${locale}-betting-record.png`, {
      fullPage: true,
      animations: 'disabled',
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}投注紀錄頁`);
  });

  test(`WIN-LVIS-${locale.toUpperCase()}-005 ${localeLabel}會員資料頁 baseline + overflow`, async ({ page }) => {
    await loginWithLocale(page, locale);
    await openMemberScreen(page, locale, 'memberInfo');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot(`locale-${locale}-member-info.png`, {
      fullPage: true,
      animations: 'disabled',
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}會員資料頁`);
  });

  test(`WIN-LVIS-${locale.toUpperCase()}-006 ${localeLabel}維護時間頁 baseline + overflow`, async ({ page }) => {
    await loginWithLocale(page, locale);
    await openMemberScreen(page, locale, 'maintenance');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot(`locale-${locale}-maintenance.png`, {
      fullPage: true,
      animations: 'disabled',
    });
    await expectNoMeaningfulOverflow(page, `${localeLabel}維護時間頁`);
  });
}
