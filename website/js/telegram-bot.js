// Telegram Bot для обработки форм обратной связи

class TelegramBot {
    constructor() {
        this.isConfigured = this.checkConfiguration();
    }

    // Проверка конфигурации
    checkConfiguration() {
        if (!BOT_CONFIG.BOT_TOKEN || BOT_CONFIG.BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
            console.warn('Telegram Bot не настроен. Укажите токен бота в config/bot-config.js');
            return false;
        }
        if (!BOT_CONFIG.CHAT_ID || BOT_CONFIG.CHAT_ID === 'YOUR_CHAT_ID_HERE') {
            console.warn('Telegram Bot не настроен. Укажите Chat ID в config/bot-config.js');
            return false;
        }
        return true;
    }

    // Отправка сообщения в Telegram
    async sendMessage(formData) {
        if (!this.isConfigured) {
            throw new Error('Telegram Bot не настроен');
        }

        const message = this.formatMessage(formData);
        const url = getSendMessageUrl();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: BOT_CONFIG.CHAT_ID,
                    text: message,
                    parse_mode: BOT_CONFIG.MESSAGE_SETTINGS.parse_mode,
                    disable_web_page_preview: BOT_CONFIG.MESSAGE_SETTINGS.disable_web_page_preview
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`);
            }

            return result;
        } catch (error) {
            console.error('Ошибка отправки сообщения в Telegram:', error);
            throw error;
        }
    }

    // Форматирование сообщения
    formatMessage(data) {
        const timestamp = new Date().toLocaleString('ru-RU');
        
        let message = `🆕 <b>Новая заявка с сайта</b>\n\n`;
        message += `📅 <b>Дата:</b> ${timestamp}\n`;
        message += `👤 <b>Имя:</b> ${data.name}\n`;
        message += `📧 <b>Email:</b> ${data.email}\n`;
        
        if (data.phone) {
            message += `📱 <b>Телефон:</b> ${data.phone}\n`;
        }
        
        if (data.service) {
            const serviceNames = {
                'website': 'Создание сайта',
                'redesign': 'Редизайн сайта',
                'mobile': 'Мобильная версия',
                'seo': 'SEO оптимизация',
                'other': 'Другое'
            };
            message += `🛠 <b>Услуга:</b> ${serviceNames[data.service] || data.service}\n`;
        }
        
        if (data.budget) {
            message += `💰 <b>Бюджет:</b> ${data.budget}\n`;
        }
        
        message += `\n💬 <b>Сообщение:</b>\n${data.message}\n`;
        
        if (data.agreement) {
            message += `\n✅ Согласие на обработку данных получено`;
        }

        return message;
    }

    // Отправка уведомления об ошибке
    async sendErrorNotification(error) {
        if (!this.isConfigured) return;

        const message = `❌ <b>Ошибка на сайте</b>\n\n` +
                      `🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}\n` +
                      `⚠️ <b>Ошибка:</b> ${error.message || error}\n` +
                      `🌐 <b>Страница:</b> ${window.location.href}`;

        try {
            await fetch(getSendMessageUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: BOT_CONFIG.CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (err) {
            console.error('Не удалось отправить уведомление об ошибке:', err);
        }
    }
}

// Создание экземпляра бота
const telegramBot = new TelegramBot();

// Функция для отправки формы
async function sendContactForm(formData) {
    try {
        await telegramBot.sendMessage(formData);
        return { success: true, message: 'Сообщение успешно отправлено!' };
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        return { success: false, message: 'Ошибка отправки сообщения. Попробуйте позже.' };
    }
}

// Обработка ошибок JavaScript
window.addEventListener('error', (event) => {
    if (telegramBot.isConfigured) {
        telegramBot.sendErrorNotification(event.error);
    }
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', (event) => {
    if (telegramBot.isConfigured) {
        telegramBot.sendErrorNotification(event.reason);
    }
});