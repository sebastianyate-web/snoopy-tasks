# Session Lab Notebook

## 2026-06-25 — Session Wrapped Snoopy

**Focus:** Researching and implementing a session persistence system for Snoopy + refining the Post Marketing form for corrections/proposals workflow.

### Key Findings

1. **Session Wrapped is not SQL — it's Claude Code Hooks + Native Memory**
   - Initial request appeared to be about a database query, but actually requires hooks (`SessionEnd`, `PreCompact`) + Claude Code's native memory system (`MEMORY.md` + `memory/` dir)
   - `claude-sessions` (community tool) installed; provides `/wrap` command for session destillation
   - Hooks can't directly invoke subagents — workaround uses `claude -p` (headless mode)

2. **Nelly's Den is SSOT — Never Disconnect**
   - User emphasized: all metrics and data must come from Nelly's Den database
   - This is a constraint for all future data work; it's the single source of truth
   - Saved as durable memory: [[nellys-den-ssot-datos.md]]

3. **Alphatype Brand Must Be Respected in All Output**
   - No emojis (exception: PDFs/graphics, but not UIs)
   - Color palette: oro (#C19A6B), gris (#2C2C2C), blanco (#F5F3F0)
   - Font: Inter
   - Tone: Direct, technical, B2B (no generic innovation-speak)
   - Never associate Alexandria/Alexa/Tria with Alphatype

4. **User Tone Preference: Colombian, Chill, Direct**
   - "Not Mexican (tela, te late) — more Colombian and relaxed"
   - This affects how Claude should communicate in future sessions

### Workflow Evolution: Post Marketing Form

Iterated 3 versions of an HTML form to capture bot corrections and new tools:

- **V1 (FORMULARIO-POST-MARKETING.html):** Dark theme, heavy emojis, separate BEFORE/AFTER fields, urgency/status badges. Too complex.
- **V2 (FORMULARIO-POST-SIMPLE.html):** Lightened theme, kept emojis, Alphatype colors introduced. Still complex.
- **V3 (FORMULARIO-POST-FINAL.html):** Final version with:
  - Type toggle: "Corrección de Bot" | "Nueva Herramienta"
  - For corrections: bot selector (Ms. Bubbles, Breeding Update, Otro), location/section fields, bullet-point textarea for changes, MD file upload
  - For new tools: tool name, description, usage, optional file attachments
  - Clean design (no emojis), Inter font, Alphatype color scheme
  - Explicit: "El archivo .md se sube a Nelly's Den junto con el post"

Key insight: Sebastián (the boss) has limited time — **speed and simplicity matter more than features**. Each iteration removed complexity and added clarity.

### Open Questions / Next Steps

1. **How does the form actually POST to Nelly's Den?** The form's submit handler currently shows an alert. A backend would need to:
   - Accept the form data + MD file
   - Write to Nelly's Den DB
   - Notify Manuel's dashboard
   - (Future) trigger bot execution via webhook

2. **Multi-user workflow not yet tested:** Paula + Sebastián → form → Manuel (review) → bot execution. Needs validation.

3. **Tone & Memory:** User wants consistent Colombian, chill tone. This is now documented for future sessions.
