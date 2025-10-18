@echo off
echo 🚀 Запуск сайта...
echo ========================================
echo.

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден! Установите Python с https://python.org
    pause
    exit /b 1
)

REM Запускаем сервер
echo 📁 Запуск сервера на http://localhost:8000
echo 🌐 Откройте браузер и перейдите по адресу выше
echo 🛑 Для остановки нажмите Ctrl+C
echo.

python server.py

pause