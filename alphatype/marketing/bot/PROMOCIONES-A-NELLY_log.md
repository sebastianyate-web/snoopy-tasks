# Registro — Promociones a Nelly's Den (Ms. Bubbles)

Bitácora de lo que se ha promovido al Den (entrada de Board + deliverable enlazado), para que
Snoopy (la SSOT) refleje qué hay en revisión en el board de Manuel.

> **El skill que hace esto** (`promover-a-nelly`) vive en la config global de Claude
> (`~/.claude/skills/promover-a-nelly/`), no dentro de Snoopy, porque ahí es donde un skill puede
> ejecutarse. Encapsula: crear la entrada del Board (`submit_suggestion`) + subir el MD en "idioma
> del bot" como deliverable en `review` (`promote_deliverable`) con `ref` al post, enlazados.
> Disparador: "Promueve esto a Nelly". Requiere el `DEN_TOKEN` (review) de Sebastián.

## Promociones

| Fecha | Tema | Entrada del Board (post id) | Deliverable | Estado | MD origen |
|---|---|---|---|---|---|
| 2026-06-26 | Menú y flujos Ms. Bubbles (12 cambios) | `2026-06-26T17-59-23-469Z-4c6tx4` | #226 (`r2://nellys-den-deliverables/226.md`) | review | `BOT-MENU.md` |
| 2026-06-26 | Pausar web (W1–W5, sin borrar productos) | `2026-06-26T18-10-23-509Z-isun9t` | #232 (`r2://nellys-den-deliverables/232.md`) | review | `ALPHATYPE_MKT_CHANGEREQUEST_PausarWeb_20260625.md` |

## Notas
- Ambas están en `review` (en la cola de Manuel; no se auto-publican). Manuel revisa/aprueba y su
  bot aplica el deliverable enlazado.
- Las **tablas** del Den (p. ej. `mkt_products`) siguen siendo read-only; los cambios de datos van
  como CHANGE_REQUEST que Manuel corre por SQL.
- Pendiente de promover: la **propuesta de horarios de publicación** de Paula (Grow Diaries jueves
  08:00 COT, Bulletin martes 03:00 COT) — en revisión, faltan definir canal del Bulletin y si
  espera OK humano.
