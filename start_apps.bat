@echo off
cd /d %~dp0

:: Start Node.js backend in a new terminal window
start cmd /k "cd /d client && npm run dev"

:: Start Vite React frontend in a new terminal window
start cmd /k "cd /d api && node app.js"

exit