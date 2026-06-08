@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=C:\Program Files\Git\cmd;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;%PATH%

echo === Публикация на GitHub ===
echo.

gh auth status >nul 2>&1
if errorlevel 1 (
  echo Сначала войдите в GitHub...
  gh auth login -h github.com -p https -w
  echo.
)

echo Создание репозитория и отправка кода...
gh repo create finance-assistant --public --source=. --remote=origin --push --description "Финансовый помощник — React, производственная практика"

if errorlevel 1 (
  echo.
  echo Если репозиторий уже существует, выполните вручную:
  echo   git remote add origin https://github.com/ВАШ_ЛОГИН/finance-assistant.git
  echo   git push -u origin main
)

echo.
pause
