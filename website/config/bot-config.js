// Конфигурация Telegram бота
// ВАЖНО: Замените эти значения на ваши реальные данные

const BOT_CONFIG = {
    // Токен вашего Telegram бота (получите у @BotFather)
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
    
    // ID чата, куда будут отправляться сообщения (ваш Telegram ID)
    CHAT_ID: 'YOUR_CHAT_ID_HERE',
    
    // URL для отправки сообщений через Telegram Bot API
    API_URL: 'https://api.telegram.org/bot',
    
    // Настройки для отправки сообщений
    MESSAGE_SETTINGS: {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }
};

// Функция для получения полного URL API
function getApiUrl() {
    return `${BOT_CONFIG.API_URL}${BOT_CONFIG.BOT_TOKEN}`;
}

// Функция для получения URL отправки сообщений
function getSendMessageUrl() {
    return `${getApiUrl()}/sendMessage`;
}

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BOT_CONFIG;
}