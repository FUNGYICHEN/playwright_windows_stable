const { test, expect } = require('@playwright/test');
const { setLocale } = require('../helpers/locale');
const { gotoHome, gotoLogin } = require('../helpers/auth');

test.beforeEach(async ({ page }) => {
  await setLocale(page, 'tw');
});

test('WIN-VIS-001 首頁沒有明顯橫向超框', async ({ page }) => {
  await gotoHome(page);
  // Wait for SPA to fully render
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000); // Wait for dynamic content to settle
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 4);
});

test('WIN-VIS-002 首頁圖片資源沒有明顯破圖', async ({ page }) => {
  await gotoHome(page);
  const brokenImages = await page.locator('img').evaluateAll((imgs) =>
    imgs
      .map((img) => ({
        src: img.getAttribute('src'),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }))
      .filter((img) => img.complete && img.naturalWidth === 0)
  );
  expect(brokenImages, `Broken images: ${JSON.stringify(brokenImages, null, 2)}`).toEqual([]);
});

test('WIN-VIS-003 首頁主要 banner 區塊可見', async ({ page }) => {
  await gotoHome(page);
  const banner = page.locator('img[src*="Page/Pc"], img[src*="MainPageImage"], [class*="banner"] img').first();
  await expect(banner).toBeVisible();
});

test('WIN-VIS-004 首頁主要文案區塊未明顯被裁切', async ({ page }) => {
  await gotoHome(page);
  const overflowNodes = await page.evaluate(() => {
    const targets = Array.from(document.querySelectorAll('a, button, p, span, h1, h2, h3'));
    return targets
      .map((el) => {
        const style = window.getComputedStyle(el);
        return {
          text: (el.textContent || '').trim(),
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          overflowX: style.overflowX,
          whiteSpace: style.whiteSpace,
        };
      })
      .filter((item) => item.text && item.clientWidth > 0 && item.scrollWidth - item.clientWidth > 20)
      .slice(0, 10);
  });
  expect(overflowNodes, `Possible overflow text nodes: ${JSON.stringify(overflowNodes, null, 2)}`).toEqual([]);
});

test('WIN-VIS-005 登入頁沒有明顯橫向超框', async ({ page }) => {
  await gotoLogin(page);
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 4);
});

test('WIN-VIS-006 登入表單輸入框與按鈕左右對齊', async ({ page }) => {
  await gotoLogin(page);
  const metrics = await page.evaluate(() => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    return {
      username: rect(document.querySelectorAll('input.input-style')[0]),
      password: rect(document.querySelectorAll('input.input-style')[1]),
      loginButton: rect([...document.querySelectorAll('button')].find((button) => (button.textContent || '').includes('登入'))),
      browseButton: rect([...document.querySelectorAll('button')].find((button) => (button.textContent || '').includes('先去逛逛'))),
    };
  });

  const xs = [metrics.username.x, metrics.password.x, metrics.loginButton.x, metrics.browseButton.x];
  const widths = [metrics.username.width, metrics.password.width, metrics.loginButton.width, metrics.browseButton.width];
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(2);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);
});

test('WIN-VIS-007 首頁桌機導覽列與登入 CTA 都在視窗內', async ({ page }) => {
  await gotoHome(page);
  const metrics = await page.evaluate(() => {
    const navLinks = [...document.querySelectorAll('a[href^="/Categories/"]')]
      .slice(0, 4)
      .map((link) => {
        const box = link.getBoundingClientRect();
        return { text: (link.textContent || '').trim(), left: box.left, right: box.right, top: box.top };
      });
    const loginButton = [...document.querySelectorAll('button')].find((button) => (button.textContent || '').includes('登入'));
    const loginBox = loginButton.getBoundingClientRect();
    return {
      innerWidth: window.innerWidth,
      navLinks,
      loginButton: { left: loginBox.left, right: loginBox.right, top: loginBox.top },
    };
  });

  for (const item of [...metrics.navLinks, metrics.loginButton]) {
    expect(item.left).toBeGreaterThanOrEqual(0);
    expect(item.right).toBeLessThanOrEqual(metrics.innerWidth + 1);
    expect(item.top).toBeGreaterThanOrEqual(0);
  }
});
