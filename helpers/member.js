const { expect } = require('@playwright/test');
const { config } = require('./config');
const { setLocale } = require('./locale');

const localeLabels = {
  tw: {
    login: '登入',
    bettingRecord: '投注紀錄',
    memberInfo: '會員訊息',
    maintenance: '維護時間',
  },
  cn: {
    login: '登录',
    bettingRecord: '投注记录',
    memberInfo: '会员讯息',
    maintenance: '维护时间',
  },
  en: {
    login: 'Login',
    bettingRecord: 'Betting Record',
    memberInfo: 'Member Messages',
    maintenance: 'Maintenance Time',
  },
  th: {
    login: 'เข้าสู่ระบบ',
    bettingRecord: 'ประวัติการเดิมพัน',
    memberInfo: 'ข้อมูลสมาชิก',
    maintenance: 'ช่วงเวลาบำรุงรักษา',
  },
  vn: {
    login: 'Đăng nhập',
    bettingRecord: 'Lịch sử cược',
    memberInfo: 'Tài khoản',
    maintenance: 'Bảo trì',
  },
};

async function gotoLoginWithLocale(page, locale) {
  await setLocale(page, locale);
  await page.goto(`${config.baseURL.replace(/\/$/, '')}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

async function gotoHomeWithLocale(page, locale) {
  await setLocale(page, locale);
  await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

async function loginWithLocale(page, locale) {
  await gotoLoginWithLocale(page, locale);
  const usernameInput = page.locator('input.input-style').nth(0);
  const passwordInput = page.locator('input.input-style').nth(1);
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await usernameInput.fill(config.loginUser);
  await passwordInput.fill(config.loginPassword);
  await page.locator('button').first().click();
  // SPA login doesn't trigger networkidle - wait for DOM change instead
  await page.waitForTimeout(3000);
  // Verify logged in by checking URL or body content
  const bodyText = await page.locator('body').innerText();
  if (!bodyText.includes(config.loginUser)) {
    throw new Error(`Login failed: username "${config.loginUser}" not found in body`);
  }
}

async function getVisibleMemberDrawer(page) {
  const drawer = page.locator('xpath=//*[.//img[@alt="Exit"] and .//img[@alt="Avatar"]]').last();
  await expect(drawer).toBeVisible();
  return drawer;
}

async function openMemberMenu(page) {
  const trigger = page.locator('.hamburger').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.waitForTimeout(1000);
  await getVisibleMemberDrawer(page);
}

async function openMemberScreen(page, locale, key) {
  const labels = localeLabels[locale];
  await openMemberMenu(page);
  const targetText = labels[key];
  const drawer = await getVisibleMemberDrawer(page);

  // Try multiple strategies to click the target menu item
  // Strategy 1: find the list item that contains the text and click its nearest interactive ancestor
  const menuItem = drawer.getByText(targetText, { exact: true }).last();
  await expect(menuItem).toBeVisible({ timeout: 5000 });

  // Walk up from the text node to find a clickable ancestor
  const clickable = menuItem.locator('xpath=ancestor::*[contains(@class,"cursor-pointer") or contains(@class,"menu") or contains(@class,"item")][1]').first();
  if (await clickable.count() > 0) {
    await clickable.scrollIntoViewIfNeeded();
    await clickable.click({ force: true });
  } else {
    // Strategy 2: direct click on the text node if no wrapper found
    await menuItem.scrollIntoViewIfNeeded();
    await menuItem.click({ force: true });
  }

  // NOTE: waitForLoadState('networkidle') does NOT work for SPA drawer content changes
  // (drawer items don't trigger network requests, they update DOM in-place)
  // Instead wait for the drawer content to stabilize
  await page.waitForTimeout(2000);

  // Verify the target content is now shown in the drawer
  const updatedDrawer = await getVisibleMemberDrawer(page);
  const updatedText = await updatedDrawer.innerText();
  expect(updatedText, `Drawer should show ${targetText} content`).toContain(targetText);
}

async function collectTextOverflowIssues(page) {
  return await page.evaluate(() => {
    const selectors = ['button', 'a', 'p', 'span', 'label', '[role="tab"]', '[role="button"]'];
    const ignoredKeywords = [
      '最新公告',
      'NEWS',
      'Thông báo mới nhất',
      'ประกาศล่าสุด',
      '歡迎貴賓蒞臨',
      '[ประกาศล่าสุด]',
      '24小時客服',
      '客服',
      'CS',
    ];

    const hasAncestorMatching = (element, matcher) => {
      let current = element;
      while (current) {
        if (matcher(current)) return true;
        current = current.parentElement;
      }
      return false;
    };

    const isIgnoredStructure = (element) => {
      return hasAncestorMatching(element, (node) => {
        if (node.matches?.('a[href*="lin.ee"]')) return true;
        if (node.querySelector?.('img[alt="Annt"]')) return true;
        return false;
      });
    };

    const elements = Array.from(document.querySelectorAll(selectors.join(',')));
    return elements
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
        const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        return {
          text,
          tag: el.tagName,
          className: String(el.className || '').slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          clientHeight: el.clientHeight,
          scrollHeight: el.scrollHeight,
          visible,
          ignoredStructure: isIgnoredStructure(el),
        };
      })
      .filter((item) => item.visible && item.text.length >= 2)
      .filter((item) => !item.ignoredStructure)
      .filter((item) => !ignoredKeywords.some((keyword) => item.text.includes(keyword)))
      .filter((item) => (
        (item.scrollWidth - item.clientWidth > 8) ||
        (item.scrollHeight - item.clientHeight > 8) ||
        item.right > window.innerWidth + 2 ||
        item.left < -2
      ))
      .slice(0, 20);
  });
}

module.exports = {
  localeLabels,
  gotoLoginWithLocale,
  gotoHomeWithLocale,
  loginWithLocale,
  openMemberMenu,
  openMemberScreen,
  collectTextOverflowIssues,
};
