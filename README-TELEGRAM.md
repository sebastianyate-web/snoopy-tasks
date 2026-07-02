# Tablero de Tareas + Bot de Telegram

Sistema completo para gestionar tareas desde Telegram y sincronizarlas automáticamente en el dashboard.

## 📦 Archivos

```
Snoopy/
├── dashboard-tareas-v3.html    ← Dashboard principal (actualizado con sincronización)
├── telegram-bot/
│   ├── package.json            ← Dependencias Node.js
│   ├── index.js                ← Backend del bot (Express + Telegram API)
│   ├── vercel.json             ← Configuración para Vercel
│   └── .env.example            ← Variables de entorno (template)
├── TELEGRAM-SETUP.md           ← Guía paso a paso para configuración
└── README-TELEGRAM.md          ← Este archivo
```

## 🚀 Inicio Rápido

### 1. Crear Bot en Telegram (2 minutos)
- Abre Telegram → @BotFather
- `/start` → `/newbot`
- Copia el TOKEN generado

### 2. Desplegar en Vercel (5 minutos)
```bash
cd telegram-bot
npm install
vercel --prod
```

Agrega Environment Variables en Vercel:
- `TELEGRAM_TOKEN` = tu token
- `WEBHOOK_URL` = https://snoopy-telegram-bot.vercel.app/webhook

### 3. Conectar Webhook (1 minuto)
Abre en navegador:
```
https://api.telegram.org/bot[TU_TOKEN]/setWebhook?url=https://snoopy-telegram-bot.vercel.app/webhook
```

### 4. Configurar Dashboard (1 minuto)
- Abre `dashboard-tareas-v3.html`
- Click en ⚙️ (esquina inferior derecha)
- Ingresa: `https://snoopy-telegram-bot.vercel.app`
- Click "Guardar"

## 💬 Cómo Usar

**En Telegram:**
```
Categoría: Descripción de la tarea
```

**Ejemplos:**
```
IA: Terminar configuración de Ms. Bubbles
Marketing Alphatype: A15 campaña completa
Raw: Seguimiento Vials
```

**El bot automáticamente:**
- ✅ Confirma en Telegram
- 📱 Aparece en el dashboard en máximo 5 segundos
- 📌 Categoriza correctamente
- 🔔 Estado = "Por hacer"

## 🔧 Características

✅ Crear tareas desde Telegram  
✅ Sincronización automática cada 5 segundos  
✅ Modalidad offline (si el bot no está disponible, las tareas locales funcionan)  
✅ Exportar a CSV  
✅ Delegar tareas  
✅ Cambiar estado  
✅ Persistencia en localStorage  

## 📊 Endpoints del Bot

- `POST /webhook` — Recibe mensajes de Telegram
- `GET /api/tasks` — Obtiene todas las tareas
- `GET /health` — Verifica que el bot está activo
- `GET /api/webhook-info` — Info del webhook (debugging)

## 🔒 Variables de Entorno

```env
TELEGRAM_TOKEN=123456789:ABCDEFGH...
WEBHOOK_URL=https://snoopy-telegram-bot.vercel.app/webhook
PORT=3000  # Solo local
```

## ⚠️ Troubleshooting

**"Conexión rechazada"**
→ Verifica que Vercel esté activo y el TOKEN sea correcto

**"Tareas no sincronizando"**
→ Abre consola (F12) → Red → busca requests a `/api/tasks`

**"Webhook no conecta"**
→ Corre: `https://api.telegram.org/bot[TOKEN]/getWebhookInfo`

## 📱 Próximas Mejoras

- [ ] Base de datos persistente (en vez de JSON)
- [ ] Notificaciones cuando alguien te delega tarea
- [ ] Editar tareas desde Telegram
- [ ] Historial de cambios

---

**¿Necesitas ayuda?** Revisa `TELEGRAM-SETUP.md` para instrucciones detalladas.
