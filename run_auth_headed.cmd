@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
npx playwright test tests/auth.spec.js --headed
pause
