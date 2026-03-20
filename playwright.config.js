const { defineConfig } = require('@playwright/test');
require('dotenv').config({ quiet: true });

// Use local Chromium if no system Chrome available (WSL / Linux without Chrome)
const localChromiumPath = '/home/user/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const windowsChromePath = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://dev-lt.t9platform.com/',
    headless: String(process.env.HEADLESS || 'false').toLowerCase() === 'true',
    channel: process.env.BROWSER_CHANNEL || 'chromium',
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
      (require('fs').existsSync(windowsChromePath) ? windowsChromePath : localChromiumPath),
    launchOptions: { slowMo: Number(process.env.SLOW_MO || 300) },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
});
