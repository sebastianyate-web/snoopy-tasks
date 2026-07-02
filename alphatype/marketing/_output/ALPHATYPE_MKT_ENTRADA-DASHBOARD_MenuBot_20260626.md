# Entrada para el Board — Menú Ms. Bubbles
Formato del board (https://alphatype-ssot.pages.dev/). Copiar campo por campo en "NEW POST".

---

**Kind:** Suggestion
**Target bot:** Mrs. Bubbles
**Severity:** Medium

**Title:**
```
Menú y flujos de Ms. Bubbles — 12 correcciones (revisar y desplegar)
```

**Body:**
```
Propuesta: aplicar 12 correcciones al menú y los flujos del bot. Resumen:

1. Unificar el nombre del bot a "Ms. Bubbles" (hoy aparece como Mrs./Miss en distintos lados).
2. Quitar el número de issue fijo del Weekly Brief (el bot usa siempre el último).
3. Aclarar idioma: el equipo trabaja en español, pero todo el texto del bot va en inglés.
4. Navegación estándar: botón Back en toda pantalla; los reviews llevan Redo; comportamiento uniforme.
5. Bulletin se mantiene (6 productos). Una foto enviada sin menú ofrece Photo Update o Alphatype Bulletin.
6. Destino Telegram ya resuelto (vive en el .env del bot). Transcripción de notas de voz: la da Telegram, no hay herramienta que construir.
7. En /start quitar los subtítulos de familia (Editorial/Community); dejar solo los 6 nombres.
8. Saludo nuevo: "Holi Team, What are we making today?" (sin el tagline anterior).
9. Grow Diaries Card: un solo tap, 100% automático. El bot elige la foto del pool, la variedad, la frase (1 sola, coherente con la variedad, variando la voz internamente sin mostrar menú) y el rating. Sin grower. Pool vacío: avisa, nunca repite.
10. Quitar el canal web (Wix/Insights). Todo se publica/genera en Telegram. Ver post hermano "Pausar web".
11. Weekly Brief: un solo tap genera el pool de noticias (sin paso Generate/Re-post).
12. Highlight: la tarjeta social no lleva Redo (es determinística); solo Publish/Back/Cancel, y Back sirve para escoger otra noticia.

Qué se necesita confirmar/hacer:
- Confirmar que la rama Bulletin está cableada (foto a hero de artículo).
- Confirmar que el .env publica al grupo de Telegram correcto.
- Correr el rename de productos pendiente en la base de datos (va por id de fila).
- Desplegar y probar /start.

Detalle exacto (antes/después de cada cambio) y la maqueta para probar las rutas: en el handoff del menú y el prototipo HTML, que se comparten aparte.
```

---

Notas:
- "Target bot" solo ofrece "Mrs. Bubbles" en el dropdown: es el mismo bot; renombrarlo a "Ms. Bubbles" es parte de la propuesta (cambio 1).
- "Kind" puesto como **Suggestion** (son cambios propuestos, no un incidente). Si prefieres otra categoría del dropdown, cámbiala.
