@echo off
cd /d %~dp0
echo [1/3] Checking .env...
if not exist .env copy .env.example .env
echo [2/3] Installing npm dependencies...
npm install
echo [3/3] Installing Playwright Chromium...
npx playwright install chromium
echo.
echo Setup complete. You can now run:
echo   .\run_i18n_headed.cmd
echo   .\run_public_headed.cmd
echo   .\run_auth_headed.cmd
pause
