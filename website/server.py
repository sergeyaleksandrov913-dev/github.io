#!/usr/bin/env python3
"""
Простой HTTP сервер для тестирования сайта
Запуск: python3 server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Добавляем CORS заголовки для тестирования
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Переходим в директорию с сайтом
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Сервер запущен на http://localhost:{PORT}")
            print(f"📁 Обслуживает файлы из: {os.getcwd()}")
            print("🛑 Для остановки нажмите Ctrl+C")
            print("\n" + "="*50)
            
            # Автоматически открываем браузер
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("🌐 Браузер открыт автоматически")
            except:
                print("⚠️  Не удалось открыть браузер автоматически")
                print(f"   Откройте вручную: http://localhost:{PORT}")
            
            print("="*50)
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Порт {PORT} уже используется")
            print("   Попробуйте другой порт или остановите другой сервер")
        else:
            print(f"❌ Ошибка запуска сервера: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()