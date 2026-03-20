@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
echo Running copy / content checks...
npx playwright test tests/copy.spec.js --headed
pause
