@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
echo Building visual baseline snapshots...
npx playwright test tests/visual-regression.spec.js --update-snapshots
pause
