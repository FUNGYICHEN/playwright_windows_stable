@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
echo Running visual / layout checks...
npx playwright test tests/visual.spec.js --headed
pause
