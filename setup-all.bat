@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-all.ps1"
pause
