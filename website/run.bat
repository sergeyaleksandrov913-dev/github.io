@echo off
title Запуск сайта
color 0A

echo.
echo ========================================
echo    🚀 ЗАПУСК САЙТА
echo ========================================
echo.

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден!
    echo.
    echo 📥 Скачайте Python с https://python.org
    echo    При установке отметьте "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

echo ✅ Python найден
echo.

REM Переходим в папку со скриптом
cd /d "%~dp0"

REM Запускаем сервер
echo 📁 Запуск сервера на http://localhost:8000
echo 🌐 Браузер откроется автоматически
echo 🛑 Для остановки нажмите Ctrl+C
echo.
echo ========================================
echo.

python -m http.server 8000

echo.
echo 🛑 Сервер остановлен
pause