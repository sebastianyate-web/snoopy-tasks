import http from 'http';
import fetch from 'node-fetch';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'sebastianyate-web';
const GITHUB_REPO = process.env.GITHUB_REPO || 'snoopy-tasks';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const PORT = process.env.PORT || 3000;

async function sendMessage(chatId, text) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  } catch (error) {
    console.error('Telegram error:', error.message);
  }
}

async function getTasksFromGithub() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/tasks.json`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    if (!response.ok) return { tasks: [] };
    const data = await response.json();
    return JSON.parse(Buffer.from(data.content, 'base64').toString());
  } catch (error) {
    console.error('GitHub fetch error:', error.message);
    return { tasks: [] };
  }
}

async function saveTasksToGithub(tasksData) {
  try {
    let sha = null;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/tasks.json`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
      }
    } catch (e) {
      console.log('No SHA found, creating new file');
    }

    const content = Buffer.from(JSON.stringify(tasksData, null, 2)).toString('base64');
    const body = {
      message: `Add task: ${tasksData.tasks[tasksData.tasks.length - 1].description}`,
      content,
      branch: GITHUB_BRANCH
    };
    if (sha) body.sha = sha;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/tasks.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    return response.ok;
  } catch (error) {
    console.error('GitHub save error:', error.message);
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }));
    return;
  }

  // Webhook de Telegram
  if (req.url === '/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        if (!message?.text || !message?.chat?.id) {
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const { text } = message;
        const chatId = message.chat.id;
        const userName = message.from?.first_name || 'Usuario';

        if (text === '/start') {
          await sendMessage(
            chatId,
            `¡Hola ${userName}! 👋\n📌 Formato: Categoría: Descripción\n✏️ Ejemplo: IA: Terminar Ms. Bubbles`
          );
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const colonIndex = text.indexOf(':');
        if (colonIndex === -1) {
          await sendMessage(chatId, '❌ Formato: `Categoría: Descripción`');
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const category = text.substring(0, colonIndex).trim();
        const title = text.substring(colonIndex + 1).trim();

        if (!category || !title) {
          await sendMessage(chatId, '❌ Ambos campos requeridos');
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const tasksData = await getTasksFromGithub();
        const newTask = {
          id: Date.now().toString(),
          title,
          category,
          state: 'todo',
          delegated: null,
          date: new Date().toISOString().split('T')[0]
        };

        tasksData.tasks.push(newTask);
        const saved = await saveTasksToGithub(tasksData);

        if (saved) {
          await sendMessage(chatId, `✅ Agregada:\n📌 ${category}\n📝 ${title}\n🔄 Aparece en dashboard`);
        } else {
          await sendMessage(chatId, `⚠️ Agregada pero no se pudo guardar: ${title}`);
        }

        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        console.error('Webhook error:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // API para obtener tareas
  if (req.url === '/api/tasks' && req.method === 'GET') {
    const tasks = await getTasksFromGithub();
    res.writeHead(200);
    res.end(JSON.stringify(tasks));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`✅ Bot online en puerto ${PORT}`);
  console.log(`📌 Webhook: https://<railway-url>/webhook`);
});
