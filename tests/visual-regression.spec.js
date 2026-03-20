const { test, expect } = require('@playwright/test');
const { config } = require('../helpers/config');
const { setLocale } = require('../helpers/locale');

async function openHome(page) {
  await setLocale(page, 'tw');
  await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

async function openLogin(page) {
  await setLocale(page, 'tw');
  await page.goto(`${config.baseURL.replace(/\/$/, '')}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

test.describe('Visual regression', () => {
  test('WIN-VR-001 首頁 shell 截圖比對', async ({ page }) => {
    await openHome(page);
    await expect(page).toHaveScreenshot('win-home-shell.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [
        page.locator('img[src*="Page/Pc"]'),
        page.locator('img[src*="MainPageImage"]'),
        page.locator('[class*="banner"] img'),
        // Announcement bar gradient background - unique selector
        page.locator('[class*="lg:via-[#FFF1A3]"]'),
      ],
    });
  });

  test('WIN-VR-002 登入頁表單截圖比對', async ({ page }) => {
    await openLogin(page);
    const loginPanel = page.locator('main, body').first();
    await expect(loginPanel).toHaveScreenshot('win-login-panel.png', {
      animations: 'disabled',
    });
  });

  test('WIN-VR-003 首頁上方導覽列截圖比對', async ({ page }) => {
    await openHome(page);
    // Page has no <header>/<nav> elements; navigation bar uses class="bg-navbar"
    const topArea = page.locator('[class*="bg-navbar"]').first();
    await expect(topArea).toHaveScreenshot('win-top-nav.png', {
      animations: 'disabled',
    });
  });
});
