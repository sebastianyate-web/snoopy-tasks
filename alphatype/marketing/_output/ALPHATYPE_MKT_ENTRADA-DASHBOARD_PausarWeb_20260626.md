# Entrada para el Board — Pausar web
Formato del board (https://alphatype-ssot.pages.dev/). Copiar campo por campo en "NEW POST".

---

**Kind:** Suggestion
**Target bot:** Mrs. Bubbles
**Severity:** Low

**Title:**
```
Pausar destino web (migración fuera de Wix) — sin borrar productos
```

**Body:**
```
Propuesta: pausar todo el destino de publicación web. La página migra fuera de Wix y el diseño nuevo está sin definir, así que se frena la salida web hasta decidirlo. Nada se borra: los productos siguen vivos, solo se pausa su canal web. Es liviano: no hay automatización web que apagar.

Pasos:
W1. En la tabla de productos, cambiar el canal de la fila id=3 (el Bulletin, hoy llamado "Website article") de "alphatype.co" a "Web paused". No borrar la fila.
W2. Verificar que el Highlight (fila id=2) no tiene rama web (no la tiene).
W3. Archivar las 2 plantillas del artículo web; no tocar los social cards de Telegram.
W4. Marcar como "paused" las secciones web de 3 documentos.
W5. Confirmar que el botón web del bot quedó fuera de uso.

Ojo: la base de datos todavía tiene los nombres viejos, por eso el cambio va por número de fila (id), no por nombre. Funciona corras o no antes el rename.

Detalle completo y el SQL listo: en el change request que se comparte aparte.
```

---

Notas:
- "Kind" puesto como **Suggestion**; "Severity" **Low** porque es liviano y no rompe nada.
- Va como **post hermano** del de menú (el cambio 10 del menú es su contraparte).
