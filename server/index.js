require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & basics
app.use(helmet({
  contentSecurityPolicy: false, // keep simple for demo; adjust if you harden CSP
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate limit API
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});
app.use('/api/', apiLimiter);

// Static
app.use(express.static(path.join(__dirname, '..', 'public'), {
  extensions: ['html'],
}));

app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      telegram,
      projectTypes,
      acceptPolicy,
      message,
    } = req.body || {};

    if (!name || !message) {
      return res.status(400).json({ ok: false, error: 'NAME_AND_MESSAGE_REQUIRED' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ ok: false, error: 'BOT_NOT_CONFIGURED' });
    }

    const origin = req.get('origin') || req.get('host') || '';
    const safe = (v) => (typeof v === 'string' ? v.trim() : '');

    const compiledText = [
      `<b>Новая заявка с сайта</b>`,
      origin ? `Источник: ${origin}` : null,
      `Имя: ${safe(name)}`,
      email ? `Email: ${safe(email)}` : null,
      phone ? `Телефон: ${safe(phone)}` : null,
      telegram ? `Telegram: ${safe(telegram)}` : null,
      Array.isArray(projectTypes) && projectTypes.length ? `Тип проекта: ${projectTypes.join(', ')}` : null,
      `Политика: ${acceptPolicy ? 'принята' : 'не принята'}`,
      '',
      `<b>Сообщение:</b>`,
      safe(message),
    ].filter(Boolean).join('\n');

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: compiledText,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Contact error', err?.response?.data || err.message);
    return res.status(500).json({ ok: false, error: 'FAILED_TO_SEND' });
  }
});

// SPA-like root route fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
