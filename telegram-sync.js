// Sincronizar tareas desde GitHub
const GITHUB_OWNER = 'sebastianyate-web';
const GITHUB_REPO = 'snoopy-tasks';
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/tasks.json`;

async function syncTasksFromGithub() {
  try {
    const response = await fetch(GITHUB_RAW);
    if (!response.ok) return false;

    const data = await response.json();
    const remoteTasks = data.tasks || [];
    const localTasks = JSON.parse(localStorage.getItem('snoopy-tasks-v3') || '[]');

    // Agregar tareas remotas que no existan localmente (por ID)
    const localIds = new Set(localTasks.map(t => t.id));
    const newTasks = remoteTasks.filter(t => !localIds.has(t.id));

    if (newTasks.length > 0) {
      localTasks.push(...newTasks);
      localStorage.setItem('snoopy-tasks-v3', JSON.stringify(localTasks));
      return true; // Indica que hay cambios
    }
  } catch (error) {
    console.log('Sync error:', error.message);
  }
  return false;
}

// Sincronizar cada 5 segundos cuando el dashboard está abierto
setInterval(syncTasksFromGithub, 5000);
