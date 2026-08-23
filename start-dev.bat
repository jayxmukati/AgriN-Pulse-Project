@echo off
title BRICS AgriN-Pulse Live Dev Server
echo =======================================================
echo   BRICS AgriN-Pulse - Continuous Auto-Reload Watcher
echo =======================================================
echo [1/2] Launching Backend with auto-reload on port 8000...
start "AgriN-Pulse Backend (FastAPI Watcher)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Launching Frontend with Vite HMR on port 3000...
start "AgriN-Pulse Frontend (Vite HMR Watcher)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =======================================================
echo   All servers are running with continuous live reload!
echo   - Farmer App:       http://localhost:3000
echo   - Policy Dashboard: http://localhost:3000/dashboard
echo   - Backend APIs:     http://localhost:8000/docs
echo =======================================================
