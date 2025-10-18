# PowerShell скрипт для запуска сайта
Write-Host "🚀 Запуск сайта..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Проверяем наличие Python
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python не найден"
    }
    Write-Host "✅ Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python не найден! Установите Python с https://python.org" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "📁 Запуск сервера на http://localhost:8000" -ForegroundColor Cyan
Write-Host "🌐 Откройте браузер и перейдите по адресу выше" -ForegroundColor Cyan
Write-Host "🛑 Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Запускаем сервер
try {
    python server.py
} catch {
    Write-Host "❌ Ошибка запуска сервера" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
}