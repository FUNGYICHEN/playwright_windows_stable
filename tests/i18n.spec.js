const { test, expect } = require('@playwright/test');
const { config } = require('../helpers/config');
const { setLocale } = require('../helpers/locale');

const localeChecks = [
  ['WIN-I18N-001', 'tw', ['熱門', '真人', '電子', '捕魚', '登入'], '繁中首頁文案正確'],
  ['WIN-I18N-002', 'cn', ['热门', '真人', '电子', '捕鱼', '登录'], '簡中首頁文案正確'],
  ['WIN-I18N-003', 'en', ['Hot', 'Live Casino', 'Slots', 'Fishing', 'Login'], '英文首頁文案正確'],
  ['WIN-I18N-004', 'th', ['ยอดฮิต', 'คนจริง', 'อิเล็กทรอนิกส์', 'ยิงปลา', 'เข้าสู่ระบบ'], '泰文首頁文案正確'],
  ['WIN-I18N-005', 'vn', ['Phổ biến', 'Người thật', 'Điện tử', 'Câu cá', 'Đăng nhập'], '越文首頁文案正確'],
];

for (const [caseId, locale, texts, title] of localeChecks) {
  test(`${caseId} ${title}`, async ({ page }) => {
    await setLocale(page, locale);
    await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const body = await page.locator('body').innerText();
    for (const text of texts) {
      expect(body).toContain(text);
    }
  });
}
