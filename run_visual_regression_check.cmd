@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
echo Checking current UI against saved visual snapshots...
npx playwright test tests/visual-regression.spec.js
pause
