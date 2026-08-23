Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  BRICS AgriN-Pulse - Continuous Auto-Reload Watcher   " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm run dev"

Write-Host "`nAll servers are running with continuous live reload!" -ForegroundColor Yellow
Write-Host "👉 Frontend:       http://localhost:3000" -ForegroundColor Cyan
Write-Host "👉 Policy Command: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "👉 Backend APIs:   http://localhost:8000/docs" -ForegroundColor Cyan
