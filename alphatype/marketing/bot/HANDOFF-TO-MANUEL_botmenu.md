# Handoff → Manuel — Ms. Bubbles bot menu corrections

**De:** Sebastián Yate (Marketing Director) · vía Snoopy (Director de Marketing)
**Para:** Manuel (orquestador / deploy del bot)
**Fecha:** 2026-06-25
**Estado:** Aprobado por Sebastián · pendiente de tu revisión y deploy
**Bot:** `@a1mktcontentbot` ("Ms. Bubbles") · interno (Manuel, Paula, Sebastián)
**Alcance:** SOLO menú, guion, botones y flujo conversacional. NO toca specs de producto,
render, plantillas ni rutas de código (eso vive en Nelly's Den / el repo del bot).

---

## Cómo usar este doc (dual)
Este archivo sirve para dos cosas, en dos capas:
1. **Para leer** (esta sección + §1): qué cambia y por qué.
2. **Para ejecutar / subir a tu bot** (§2): un changeset atómico, cada cambio con
   *ubicación → ANTES → DESPUÉS → criterio de aceptación*. La fuente completa ya corregida es
   `BOT-MENU.md` (en la misma carpeta): puedes **reemplazar el spec entero por ese archivo** y
   verificar contra los criterios de §2, o aplicar los cambios uno por uno. Las dos rutas llegan
   al mismo resultado.

Referencias en esta carpeta:
- `BOT-MENU.md` — **spec canónico ya corregido** (el destino).
- `BOT-MENU_baseline.md` — la línea base (lo que hay hoy), para diff.

---

## 1. Resumen (para leer)
Seis cambios, todos cosméticos/de consistencia del menú y la navegación. Ningún cambio de
producto ni de lógica de render. Más una **dependencia en Nelly's Den** (§3) que es tuya de
ejecutar (el rename de productos que ya te pasé el 23-jun).

---

## 2. Changeset (para ejecutar) — atómico

### C1 · Nombre del bot: unificar a "Ms. Bubbles"
- **Ubicación:** todo el spec + strings del bot (header, `/setcommands`, saludo, notas) y el id/label internos de tu lado (`mrs_bubbles` / "Mrs. Bubbles" en el dashboard).
- **ANTES:** mezcla de `Mrs. Bubbles` (header, comandos, notas) y `Miss Bubbles` (saludo).
- **DESPUÉS:** `Ms. Bubbles` en todas partes. Saludo: `🫧 Ms. Bubbles`. Comandos: "Show what Ms. Bubbles can make" / "How Ms. Bubbles works".
- **Aceptación:** `grep -i "mrs\.\? bubbles\|miss bubbles"` en spec y código → 0 resultados (salvo el unit/id técnico si decides no migrarlo; si lo migras, también 0).

### C2 · Quitar el número de issue hardcodeado del spec
- **Ubicación:** §7 (Weekly Breeder's Brief).
- **ANTES:** "Issues run sequentially (latest seen = #215)." (y el README mencionaba #214).
- **DESPUÉS:** "Issues run sequentially; the bot always works from the latest issue (no fixed number in this spec)."
- **Aceptación:** ningún número de issue literal vive en el doc de diseño; el bot lo resuelve en runtime.

### C3 · Arreglar la contradicción de idioma
- **Ubicación:** encabezado "Audience".
- **ANTES:** "Tone is … team-to-team in Spanish" + dos líneas abajo "All bot UI is in English."
- **DESPUÉS:** "The team works in Spanish, but all bot UI (greeting, prompts, button labels) ships in English — context often arrives in Spanish, output is always English."
- **Aceptación:** una sola regla de idioma, sin contradicción.

### C4 · Estandarizar la navegación (botón Back)
- **Ubicación:** design rule 4 + todos los reviews/steps + nueva §8 "Standard button rows".
- **ANTES:** la regla decía "siempre ofrecer Back", pero los reviews de Photo/Video y Grow Diaries solo traían `[ Redo ] [ Cancel ]`.
- **DESPUÉS:** toda pantalla bajo `/start` lleva `[ ⬅️ Back ]` + `[ ❌ Cancel ]`; los reviews añaden `[ 🔄 Redo ]`. Back = sube exactamente un nivel editando el mensaje en sitio (nunca manda mensaje nuevo). Filas exactas en §8 del spec.
- **Aceptación:** cada pantalla inline (excepto el catálogo top-level) ofrece Back; comportamiento de Back uniforme.

### C5 · Bulletin: se queda (catálogo en 6) + nota de cableado
- **Ubicación:** §2 catálogo, §5 prompt de foto, Notes.
- **ANTES:** nota "until it ships, a sent photo routes straight to Photo Update" (ambiguo: parecía que el Bulletin no existe).
- **DESPUÉS:** catálogo mantiene los 6; el prompt de foto mantiene `[ 🖼️ Photo Update ] [ 📰 Alphatype Bulletin ]`. Nota: **confirmar que la rama Bulletin esté cableada en el bot**; si aún no, la foto cae a Photo Update hasta que se shipee.
- **Aceptación / ACCIÓN TUYA:** confirma si la rama Bulletin (foto → hero de artículo) ya está implementada. Marca: [ ] cableada · [ ] fallback a Photo Update por ahora.

### C6 · Sincronizar los dos datos que el spec planteaba mal
- **C6a · Destino Telegram.**
  - **ANTES:** "OPEN — Telegram destination. Confirm the group/channel ID and post rights."
  - **DESPUÉS:** marcado como RESUELTO. El bot ya publica live; el chat/channel ID y los permisos viven en el `.env` del bot (tuyo), no en el spec ni en Nelly's Den.
  - **Aceptación:** ya no figura como pendiente. (Solo confírmame que el `.env` apunta al grupo correcto.)
- **C6b · Transcripción de notas de voz.**
  - **ANTES:** redactado como herramienta a construir ("the bot must accept audio, transcribe it").
  - **DESPUÉS:** la transcripción la provee Telegram; el bot trabaja desde el transcript. Sin herramienta nueva.
  - **Aceptación:** el flujo de "I'll send context" asume transcript de Telegram; no se agenda construir STT.

---

### C7 · Quitar los subtítulos de familia del `/start`
- **Ubicación:** §2 (catálogo inline que abre `/start`).
- **ANTES:** los 6 botones venían bajo dos subtítulos visibles, `Editorial family:` y `Community family:`.
- **DESPUÉS:** solo los seis nombres, sin subtítulos en pantalla. El split editorial/community es solo orden interno, nunca se muestra al usuario. Orden conservado.
- **Aceptación:** la pantalla de `/start` muestra saludo + 6 botones + `[ ❌ Cancel ]`, sin ninguna línea de "family".

### C8 · Cambiar el saludo del `/start`
- **Ubicación:** §2 (greeting block).
- **ANTES:** `🫧 Ms. Bubbles` + tagline `"If you stay ready, you ain't gotta get ready."` + `What are we making today?`
- **DESPUÉS:** dos líneas, sin tagline:
  ```
  🫧 Ms. Bubbles
  Holi Team, What are we making today?
  ```
- **Nota:** "Holi" es la única palabra en español intencional del UI (saludo de equipo, interno); el resto del UI sigue en inglés.
- **Aceptación:** el `/start` ya no muestra el tagline; saluda con "Holi Team, What are we making today?".

### C9 · Grow Diaries Card: flujo automático (alineado con el instructivo de Paula, 2026-06-25)
- **Ubicación:** §6 + la línea de §3.
- **ANTES:** el flujo pedía elegir **strain** (3 sugerencias), elegir **quote** (menú de 5 voces) y la tarjeta mostraba **grower**.
- **DESPUÉS:** flujo **totalmente automático de un solo tap**. Al tocar el botón, el bot: escoge la foto del pool (sin usar) → fija el strain (del nombre del archivo o inventado, coherente) → genera **UNA sola quote** coherente y la coloca sola → asigna el **rating automático** → renderiza la tarjeta **SIN grower / sin atribución** (fila inferior = solo tipo + rating). La persona **no elige NADA** (ni foto, ni strain, ni quote, ni estrellas): la única pantalla es la tarjeta lista con `[ ✅ Publish ] [ 🔄 Redo ] [ ⬅️ Back ] [ ❌ Cancel ]` (Redo re-rola la tarjeta entera). Badge "Featured on Grow Diaries" fijo. Pool vacío → "upload more photos", nunca repite (mueve a `Used/` al publicar).
- **Fuera de alcance (NO en este changeset):** los detalles de implementación —quitar el grower del render, el perfilado de coherencia variedad↔frase, la cuenta de servicio del Drive, UTF-8 para emojis del caption— viven en el **INSTRUCTIVO de Grow Diaries que Paula te entrega aparte**. Aquí solo va el flujo/menú, para no dobletear ni contradecir su doc.
- **Aceptación:** al tocar Grow Diaries Card el bot muestra **directamente** la tarjeta lista, **sin sub-menú y sin pedir foto / strain / quote / estrellas**, y **sin** grower.
- **OJO — conservar las personalidades del copy:** se elimina el **menú** de 5 voces, NO las personalidades. El bot **debe seguir** variando internamente entre los registros (chill / technical / hype / seasoned / terse) al generar la única frase, para que las tarjetas no suenen iguales. Solo deja de mostrar las opciones; la variedad de voz se mantiene en la generación.

### C10 · Quitar todo lo de web / Wix (sin entrada por página web)
- **Ubicación:** §3, §7, Notes.
- **ANTES:** el Highlight tenía canal `🌐 Website` (post a Insights en Wix, `status=draft`, Wix Data REST API); el Weekly Brief tenía botón `🌐 Website` por ítem; el Bulletin se describía como "web article".
- **DESPUÉS:** **no hay publicación web en el bot.** Se elimina el canal Website del Highlight y el botón Website del Brief (por ítem queda solo `🗑 Discard` `🖼 Social`). El Highlight es solo tarjeta social a Telegram. El Bulletin **sigue generando** su artículo, pero se entrega en Telegram; sin destino web. Todo publica/genera en Telegram.
- **Por qué:** la web sale de Wix y el nuevo host está sin definir; cualquier publicación web queda fuera de alcance hasta decidirlo.
- **Aceptación:** en el spec del menú no quedan referencias a publicación web (Wix / Insights / alphatype.co / "Website"); el Brief por ítem solo muestra `Discard` / `Social`.

### C11 · Weekly Brief genera de inmediato (sin doble interacción)
- **Ubicación:** design rule 3, §3, §7.
- **ANTES:** tocar Weekly Breeder's Brief abría un sub-menú `[ Generate new ] [ Re-post latest ]`.
- **DESPUÉS:** un solo tap genera el brief de una vez (lanza el pool de noticias con sus botones por ítem + footer Approve). Sin paso intermedio, sin "Re-post". (El viejo `/brief` desaparece, igual que `/auto` en Grow Diaries.)
- **Aceptación:** `/start` → Weekly Breeder's Brief muestra **directamente** el pool de noticias, sin pantalla previa.

### C12 · Highlight (tarjeta social): sin Redo, solo Back/Cancel
- **Ubicación:** §3, §7, §8.
- **ANTES:** la pantalla de la tarjeta del Highlight traía `🔄 Redo`.
- **DESPUÉS:** la tarjeta es **determinística** (la noticia y los parámetros son fijos), así que **NO hay Redo**. Pantalla = `[ ✅ Publish to Alphatype group ] [ ⬅️ Back ] [ ❌ Cancel ]`. `Back` = volver al listado y **escoger otra noticia** si no gusta.
- **Aceptación:** la tarjeta del Highlight no muestra Redo; `Back` lleva al listado de ítems.

---

## 3. Dependencia en Nelly's Den (acción tuya)
El menú usa los **nombres bloqueados** (`Breeder's Brief Highlight`, `Alphatype Bulletin`).
Nelly's Den `mkt_products` todavía tiene los viejos (`Genetics Watch (social card)`,
`Website article`). **Corre el rename pendiente** (ya te lo pasé en `CHANGE_REQUEST_Product_Naming_2026-06-23`):
```sql
UPDATE mkt_products SET name = 'Breeder''s Brief Highlight' WHERE name = 'Genetics Watch (social card)';
UPDATE mkt_products SET name = 'Alphatype Bulletin'         WHERE name = 'Website article';
```
El menú está correcto; el Den es el que va atrasado. No renombres en el menú.

**Entrada hermana (lado datos):** el quitar web del menú (C10) tiene su contraparte en Nelly's Den
en un CR aparte → `_output/ALPHATYPE_MKT_CHANGEREQUEST_PausarWeb_20260625.md` (pausa el canal web del
producto id=3, archiva las plantillas web, anota docs; sin borrar productos). Las dos entradas van
juntas a tu hub: (1) este handoff del menú, (2) el CR de pausar web.

---

## 4. Fuera de alcance (NO tocar desde el menú)
Vive en Nelly's Den / repo del bot; el menú lo referencia, no lo copia: render specs y dimensiones,
plantillas (`featured-card/`, `quote-card/`, `breeders-brief/templates/`), rutas de código
(`bot/bot.py`, `bot/breeders_brief.py`, `engine.py`), scheduling/ops (Monday 06:00 COT, systemd),
reglas editoriales y campos de status/audience.

---

## 5. Checklist de aprobación
- [ ] Manuel revisa los 6 cambios (C1–C6) y confirma que ninguno rompe el código del bot.
- [ ] Manuel confirma C5: rama Bulletin cableada, o fallback a Photo Update por ahora.
- [ ] Manuel confirma C6a: el `.env` publica al grupo Telegram correcto.
- [ ] Manuel corre el rename de Nelly's Den (§3) y verifica que `mkt_products` queda alineado.
- [ ] Manuel despliega el menú corregido (`BOT-MENU.md`) y prueba `/start`.
- [ ] Sebastián valida el `/start` en vivo (nombre Ms. Bubbles, 6 botones, Back en cada paso).
