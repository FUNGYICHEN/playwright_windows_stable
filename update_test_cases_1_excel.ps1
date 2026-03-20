$path = 'C:\Users\user\Desktop\test_cases_1.xlsx'
$excel = New-Object -ComObject Excel.Application
$excel.DisplayAlerts = $false
$excel.Visible = $false
$wb = $excel.Workbooks.Open($path)
$ws = $wb.Worksheets.Item(1)
$ws.Range('D4').Value2 = 'Pass'
$ws.Range('D5').Value2 = 'Pass'
$wb.Save()
$wb.Close($true)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ws) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wb) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
Write-Host 'excel-updated'
