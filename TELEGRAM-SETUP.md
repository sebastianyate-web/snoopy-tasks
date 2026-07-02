# Configuración Bot Telegram + Dashboard

## Paso 1: Crear el Bot en Telegram

1. Abre Telegram y busca **@BotFather**
2. Envía `/start` y luego `/newbot`
3. Dale un nombre (ej: "Snoopy Tasks Bot")
4. Dale un username único (ej: "snoopy_tasks_bot")
5. **Copia el TOKEN que te da** (algo como `123456789:ABCDEFGH...`)

## Paso 2: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Sign up con GitHub, GitLab o email
3. Si usas email: sebastian.yate@613partners.com

## Paso 3: Desplegar el Bot en Vercel

### Opción A: Desde GitHub (recomendado)

1. Crea un repositorio privado en GitHub llamado `snoopy-telegram-bot`
2. Sube el contenido de `telegram-bot/`:
   - `package.json`
   - `index.js`
   - `vercel.json`
   - `.env.example`

3. En Vercel:
   - Click en **"Add New Project"**
   - Conecta tu GitHub
   - Selecciona el repo `snoopy-telegram-bot`
   - Click **"Import"**

4. Configura Environment Variables en Vercel:
   - **TELEGRAM_TOKEN** = el token de BotFather (del Paso 1)
   - **WEBHOOK_URL** = la URL que genera Vercel (ej: `https://snoopy-telegram-bot.vercel.app/webhook`)

5. Click **"Deploy"**

### Opción B: Desde Vercel CLI (sin GitHub)

```bash
cd telegram-bot
npm install -g vercel
vercel login
vercel --prod
```

Vercel te pedirá las variables de entorno. Proporciona:
- TELEGRAM_TOKEN
- WEBHOOK_URL (la verá después de desplegar)

## Paso 4: Conectar Webhook a Telegram

Una vez que Vercel te da una URL (ej: `https://snoopy-telegram-bot.vercel.app`):

Abre tu navegador y ve a:
```
https://api.telegram.org/bot[TU_TOKEN]/setWebhook?url=https://snoopy-telegram-bot.vercel.app/webhook
```

Reemplaza `[TU_TOKEN]` con tu token real.

Deberías ver: `{"ok":true,"result":true}`

## Paso 5: Probar el Bot

1. En Telegram, abre el bot (busca por el username que creaste)
2. Envía `/start`
3. Envía un mensaje con el formato:
   ```
   IA: Terminar configuración de Ms. Bubbles
   ```
   (Categoría: Descripción)

Deberías recibir una confirmación: ✅ Tarea agregada

## Paso 6: Conectar Dashboard con Bot

En tu dashboard (`dashboard-tareas-v3.html`), agrega esta línea en el `<head>`:

```html
<script src="telegram-sync.js"></script>
```

Luego edita `telegram-sync.js` y cambia:
```javascript
const TELEGRAM_BOT_URL = 'https://tu-bot.vercel.app';
```

Por tu URL real de Vercel.

---

## Formato de Mensajes en Telegram

**Para crear tarea:**
```
Categoría: Descripción de la tarea
```

**Ejemplos válidos:**
- `IA: Terminar configuración de Ms. Bubbles`
- `Marketing Alphatype: A15 campaña completa`
- `Raw: Seguimiento Vials`

El bot automáticamente:
- ✅ Crea la tarea
- 📌 Asigna la categoría
- 🔔 Coloca estado "Por hacer"
- 📅 Registra la fecha actual
- 📱 Sincroniza con tu dashboard

---

## Troubleshooting

**"El bot no responde"**
- Verifica que el webhook esté conectado: `https://api.telegram.org/bot[TOKEN]/getWebhookInfo`
- Comprueba que las env vars en Vercel sean correctas

**"Error 403 en Vercel"**
- Revisa que `TELEGRAM_TOKEN` sea correcto
- Elimina espacios en blanco

**"Tareas no aparecen en dashboard"**
- Abre la consola del navegador (F12)
- Busca errores en red
- Verifica que `telegram-sync.js` esté cargado

---

¡Listo! Tus tareas de Telegram aparecerán automáticamente en el dashboard cada 5 segundos. 🎉
