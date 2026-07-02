import fetch from 'node-fetch';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
let tasksDb = [];

async function sendMessage(chatId, text) {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const path = req.url.split('?')[0];

  if (path === '/health') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  if (path === '/' && req.method === 'GET') {
    res.status(200).json({ status: 'ok', tasks: tasksDb.length });
    return;
  }

  if (path === '/api/tasks' && req.method === 'GET') {
    res.status(200).json({ tasks: tasksDb });
    return;
  }

  if (path === '/webhook' && req.method === 'POST') {
    try {
      const data = req.body;
      if (!data?.message?.text) {
        res.status(200).json({ ok: true });
        return;
      }

      const { text } = data.message;
      const chatId = data.message.chat.id;
      const userName = data.message.from.first_name || 'Usuario';

      if (text === '/start') {
        await sendMessage(chatId, `¡Hola ${userName}! 👋\n📌 Formato: Categoría: Descripción`);
        res.status(200).json({ ok: true });
        return;
      }

      const colonIndex = text.indexOf(':');
      if (colonIndex === -1) {
        await sendMessage(chatId, '❌ Formato: `Categoría: Descripción`');
        res.status(200).json({ ok: true });
        return;
      }

      const category = text.substring(0, colonIndex).trim();
      const title = text.substring(colonIndex + 1).trim();

      if (!category || !title) {
        await sendMessage(chatId, '❌ Ambos campos requeridos');
        res.status(200).json({ ok: true });
        return;
      }

      const task = {
        id: Date.now(),
        category,
        title,
        state: 'todo',
        delegated: null,
        date: new Date().toISOString().split('T')[0]
      };

      tasksDb.push(task);
      await sendMessage(chatId, `✅ Agregada:\n📌 ${category}\n📝 ${title}`);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
