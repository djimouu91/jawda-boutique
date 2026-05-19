@echo off
echo Stopping old server...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul
echo Starting JAWDA server...
cd /d "C:\Users\DELL\Desktop\CLAUDE CODE FOLDER\jawda\server"
start "JAWDA Server" cmd /k "node server.js"
echo Done! Server running at http://localhost:3000
timeout /t 2 /nobreak >nul
start chrome "http://localhost:3000"
