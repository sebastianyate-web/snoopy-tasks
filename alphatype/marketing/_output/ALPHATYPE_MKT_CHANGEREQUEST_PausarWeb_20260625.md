# Change Request → Manuel — PAUSAR web (Nelly's Den + formatos)

**De:** Sebastián Yate (Marketing Director) · vía Snoopy (Director de Marketing)
**Para:** Manuel (orquestador / ejecuta cambios en Nelly's Den y repo)
**Fecha:** 2026-06-25
**Estado:** Aprobado por Sebastián · pendiente de tu ejecución
**Prioridad:** Media — no bloquea el bot, alinea el SSOT con "sin web por ahora"
**Relación:** Es la **2.ª entrada** del par que va a tu hub. La 1.ª es el handoff del menú del bot
(`HANDOFF-TO-MANUEL_botmenu.md`), donde el canal web ya se quitó del bot (cambio C10). Este CR es
el lado de **datos/SSOT**: pausar el destino web en Nelly's Den y archivar sus formatos.

---

## Cómo usar este doc (dual)
1. **Para leer** (Resumen + §1): qué se pausa y por qué.
2. **Para ejecutar / subir a tu bot** (§2): changeset atómico con *ubicación → ANTES → DESPUÉS →
   criterio de aceptación*.

---

## Resumen
La página web de Alphatype migra **fuera de Wix** y el diseño/formato nuevo está sin definir.
Hasta decidirlo, se **pausa todo destino web** de los productos de marketing. **No se borra ningún
producto.** Hallazgo clave del inventario: **no hay ninguna automatización web** (sin Wix / Velo /
REST / CMS) — la publicación web siempre fue manual, y el web leg del Breeding Update Engine ya está
HELD en código. Por eso pausar es liviano.

> **Ojo con los nombres:** la tabla `mkt_products` todavía tiene los nombres VIEJOS. Por eso este CR
> referencia por **`id`** (no por nombre) para que no haya ambigüedad. Mapa:
> - **id=3** "Website article" = el **Alphatype Bulletin**
> - **id=2** "Genetics Watch (social card)" = el **Breeder's Brief Highlight**
> Si vas a correr antes el rename pendiente (`CHANGE_REQUEST_Product_Naming_2026-06-23`), hazlo;
> este CR funciona igual porque actúa por `id`.

---

## 2. Changeset (para ejecutar) — atómico

### W1 · `mkt_products` id=3 (Website article = Bulletin): pausar el canal web
- **Ubicación:** Nelly's Den, tabla `mkt_products`, fila `id=3`. **Única fila con canal puramente web** (`channel = alphatype.co`).
- **ANTES:** `channel = 'alphatype.co'`, `status = 'Built; manual publish'`.
- **DESPUÉS:** canal pausado; **la fila NO se borra** (el producto Bulletin sigue vivo, solo sin destino web).
  ```sql
  UPDATE mkt_products
  SET channel = 'Web paused (off-Wix migration)',
      status  = 'Web paused; product retained'
  WHERE id = 3;
  ```
- **Aceptación:** `id=3` ya no apunta a `alphatype.co`; sigue existiendo como producto.

### W2 · `mkt_products` id=2 (Highlight): verificar, sin cambio
- **Ubicación:** `mkt_products`, fila `id=2`.
- **ANTES/DESPUÉS:** `channel = 'Telegram + socials'` — **ya no es web**, no requiere cambio.
- **Acción:** solo confirmar que el Highlight no tiene rama web que pausar (no la tiene, según la DB). Listado aquí solo para cerrar la duda.
- **Aceptación:** confirmado que no hay canal web en `id=2`.

### W3 · Archivar las plantillas / formatos web (NO los social cards)
- **Ubicación:** repo de marketing.
- **ANTES:** dos archivos son el render del **artículo web** (distinto del card 1080×1080):
  - `alphatype/marketing/breeders-brief-standalone.html` (diseño SSOT del artículo web; CSS "Article shell (Insights single story)").
  - `alphatype/marketing/breeders-brief/templates/website-article.template.html` (versión tokenizada que llena `generate.py::make_website()`).
- **DESPUÉS:** archivar / marcar ambos como **"web layout undefined — paused pending off-Wix migration"**. No borrarlos.
- **NO TOCAR:** `social-card-standalone.html` ni `templates/social-card.template.html` — esos son el card de Telegram/redes, no web.
- **Aceptación:** los dos archivos web quedan marcados como pausados; los social cards intactos.

### W4 · Anotar como PAUSED los docs que instruyen destino web
- **Ubicación:** docs en Nelly's Den / repo.
- **DESPUÉS:** marcar las secciones web como pausadas (no borrar el doc):
  - `alphatype/marketing/Breeding-Update-Engine-Instruction.md` → `## 2. Web Output (Insights entry)`, el `## 4. SEO checklist`, el `## 5. Cadence`, y los items 6-7 (meta description / URL slug). (Su código `breeding-updates/generate.py` ya tiene el link HELD, líneas 11 y 177.)
  - `alphatype/marketing/products/README.md` → en la tabla "At a glance" y la `## 3. Website article`, marcar el destino `alphatype.co` como pausado; mantener el producto.
  - `alphatype/marketing/breeders-brief/README.md` → anotar el botón `🌐 Website` y las menciones de "website draft" como pausadas.
- **Aceptación:** ningún doc instruye publicar a web como acción vigente; todas las secciones web quedan marcadas "paused".

### W5 · Mecanismo de publicación: nada automatizado que apagar
- **Hallazgo:** no existe push automático a ningún sitio. La acción es **operativa**: dejar de usar el botón `🌐 Website` del bot como vía de publicación (en el menú nuevo ya se quitó — ver handoff C10), y mantener HELD el web leg del Breeding Update Engine (ya está así en código).
- **Aceptación:** nadie publica a web; el bot ya no ofrece el canal web.

---

## 3. Fuera de alcance (NO hacer)
- **NO borrar productos.** Ni el Bulletin (id=3) ni el Highlight (id=2) se eliminan; solo se pausa lo web.
- **NO tocar** los formatos/rutas de Telegram/redes (social card 1080×1080, Photo/Video Update, Grow Diaries).
- **NO** reactivar nada web hasta que se defina el nuevo host y diseño (post-migración off-Wix).

---

## 4. Checklist de aprobación
- [ ] Manuel corre `UPDATE` de W1 (id=3 → canal pausado) y confirma que la fila sigue existiendo.
- [ ] Manuel confirma W2 (id=2 sin rama web).
- [ ] Manuel archiva/marca las 2 plantillas web (W3) sin tocar los social cards.
- [ ] Manuel anota como paused las secciones web de los 3 docs (W4).
- [ ] Manuel confirma W5: botón web fuera de uso + Breeding Update Engine web leg sigue HELD.
- [ ] (Si aplica) corre antes el rename pendiente; este CR actúa por `id`, así que no depende de ello.
