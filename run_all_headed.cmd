@echo off
cd /d %~dp0
if not exist .env copy .env.example .env
echo Running all headed UI tests...
npx playwright test --headed
pause
