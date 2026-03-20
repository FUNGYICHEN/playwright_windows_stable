const { expect } = require('@playwright/test');
const { config } = require('./config');

async function gotoLogin(page) {
  await page.goto(`${config.baseURL.replace(/\/$/, '')}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

async function gotoHome(page) {
  await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
}

async function login(page) {
  await gotoLogin(page);
  const usernameInput = page.locator('input.input-style').nth(0);
  const passwordInput = page.locator('input.input-style').nth(1);
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await usernameInput.fill(config.loginUser);
  await passwordInput.fill(config.loginPassword);
  await page.getByRole('button', { name: '登入' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

async function logout(page) {
  await page.evaluate(() => {
    const logoutButton = [...document.querySelectorAll('button')].find((button) =>
      (button.textContent || '').includes('登出')
    );
    if (!logoutButton) {
      throw new Error('Logout button not found');
    }
    logoutButton.click();
  });
  await page.waitForTimeout(3000);
}

module.exports = { gotoHome, gotoLogin, login, logout };
