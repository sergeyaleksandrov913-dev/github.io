#!/usr/bin/env python3
"""
Быстрый запуск сайта для Windows
"""

import subprocess
import sys
import os

def main():
    print("🚀 Запуск сайта...")
    print("=" * 40)
    
    # Проверяем Python
    if sys.version_info < (3, 6):
        print("❌ Требуется Python 3.6 или выше")
        sys.exit(1)
    
    # Запускаем сервер
    try:
        subprocess.run([sys.executable, "server.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Остановка сервера...")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()