@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
npx playwright test tests/public.spec.js --headed
pause
