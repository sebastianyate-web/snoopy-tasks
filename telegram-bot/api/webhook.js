import fetch from 'node-fetch';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'sebastianyate-web';
const GITHUB_REPO = process.env.GITHUB_REPO || 'snoopy-tasks';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

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
    // Obtener el SHA del archivo actual para poder hacer update
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
    const lastTask = tasksData.tasks[tasksData.tasks.length - 1];
    const body = {
      message: `Add task: ${lastTask.title || lastTask.description || 'Nueva tarea'}`,
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;
    if (!message?.text || !message?.chat?.id) {
      res.status(200).json({ ok: true });
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

    // Obtener tareas actuales desde GitHub
    const tasksData = await getTasksFromGithub();

    // Crear nueva tarea
    const newTask = {
      id: Date.now().toString(),
      description: title,
      category,
      status: 'Por hacer',
      assigned: null,
      created: new Date().toISOString()
    };

    // Agregar y guardar
    tasksData.tasks.push(newTask);
    const saved = await saveTasksToGithub(tasksData);

    if (saved) {
      await sendMessage(chatId, `✅ Agregada:\n📌 ${category}\n📝 ${title}\n🔄 Aparece en dashboard`);
    } else {
      await sendMessage(chatId, `⚠️ Agregada pero no se pudo guardar: ${title}`);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
