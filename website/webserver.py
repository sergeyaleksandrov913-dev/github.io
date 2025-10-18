#!/usr/bin/env python3
"""
Простой HTTP сервер для тестирования сайта
Запуск: python webserver.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

def main():
    # Переходим в директорию с сайтом
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
            print("🚀 Сервер запущен на http://localhost:{}".format(PORT))
            print("📁 Обслуживает файлы из: {}".format(os.getcwd()))
            print("🛑 Для остановки нажмите Ctrl+C")
            print("\n" + "="*50)
            
            # Автоматически открываем браузер
            try:
                webbrowser.open('http://localhost:{}'.format(PORT))
                print("🌐 Браузер открыт автоматически")
            except:
                print("⚠️  Не удалось открыть браузер автоматически")
                print("   Откройте вручную: http://localhost:{}".format(PORT))
            
            print("="*50)
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print("❌ Порт {} уже используется".format(PORT))
            print("   Попробуйте другой порт или остановите другой сервер")
        else:
            print("❌ Ошибка запуска сервера: {}".format(e))
        sys.exit(1)

if __name__ == "__main__":
    main()