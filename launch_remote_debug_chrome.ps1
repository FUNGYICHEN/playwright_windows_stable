$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$profile = 'C:\Users\user\Desktop\playwright_windows_stable\.remote-debug-profile'
$url = 'https://dev-lg-dashboard.t9platform-ph.com/#/agent/agent-management'

New-Item -ItemType Directory -Force -Path $profile | Out-Null
Start-Process -FilePath $chrome -ArgumentList @(
  '--remote-debugging-port=9222',
  "--user-data-dir=$profile",
  '--profile-directory=Default',
  $url
)
Write-Host 'Remote debugging Chrome launched on port 9222.'
Write-Host 'Log in in that Chrome window, then tell Annie to continue.'
