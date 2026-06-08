@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%

if not exist "node_modules" (
  echo Установка зависимостей...
  call npm install
)

echo.
echo Запуск приложения...
echo Откройте в браузере адрес из строки ниже (обычно http://localhost:5173)
echo Для остановки нажмите Ctrl+C
echo.

call npm run dev
pause
