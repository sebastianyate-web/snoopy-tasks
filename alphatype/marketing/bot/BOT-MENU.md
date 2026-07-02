# Ms. Bubbles — Bot menu spec (CANÓNICO)

> **SSOT del menú/flujo del bot de contenido** (`@a1mktcontentbot`, "Ms. Bubbles").
> Este archivo es la versión corregida y aprobada por Sebastián. La línea base original
> (lo que hoy vive en el bot, antes de correcciones) está en `BOT-MENU_baseline.md`.
> Las correcciones aplicadas aquí están listadas, una por una, en `HANDOFF-TO-MANUEL_botmenu.md`,
> que es el doc que Manuel lee y le sube a su bot para ejecutar los cambios.
> Alcance: SOLO menú, guion, botones y flujo conversacional. Las specs de cada producto
> (render, plantillas, schema de datos, rutas de código) viven en Nelly's Den / el repo del bot
> y NO se duplican aquí.

Single source of truth for the `@a1mktcontentbot` ("Ms. Bubbles") command menu and product
picker. The bot's only job is to create Alphatype content products, so the menu funnels
everything through one entry instead of privileging a few products with their own commands.
Locked names per `products/README.md` (the 6 canonical products, 2 families).

**Audience: internal only.** Ms. Bubbles is used by the marketing department (Manuel, Paula,
Sebastián), not by clients. Tone is close, chill, team-to-team. The team works in Spanish, but
**all bot UI (greeting, prompts, button labels) ships in English** — context often arrives in
Spanish, output is always English. No walls of text: the `/start` screen shows product names as
buttons and nothing else.

## Design rules
1. **One door to the catalog.** The slash list never enumerates products. Either all 6 get a
   command or none do, so none do. Products live in an inline keyboard, not in `/`.
2. **`/start` is the single entry.** Telegram fires it automatically on first contact and every
   user knows it, so it is the shortest, most automatic path. No separate `/crear` / `/menu`.
3. **Old per-product shortcuts are gone — their behavior is now the default.** No `/auto`, no
   `/brief`, no sub-menus: Grow Diaries Card auto-builds on one tap (§6) and Weekly Breeder's Brief
   generates the news pool on one tap (§7). Nothing folds into a second screen.
4. **Always offer navigation.** Every inline screen below `/start` carries a `[ ⬅️ Back ]`
   (goes up one level, editing the message in place) plus `/cancel`. Action/review screens add
   `[ 🔄 Redo ]` where a step can be repeated. The bot edits the message in place instead of
   sending new ones. (See §8 for the standard button rows.)

## 1. Command list (paste into BotFather `/setcommands`)
```
start - Show what Ms. Bubbles can make
cancel - Cancel whatever's in progress
help - How Ms. Bubbles works
```

## 2. Inline catalog (opened by `/start`)
Greeting (short, chill, internal):
```
🫧 Ms. Bubbles
Holi Team, What are we making today?
```
Then the buttons, nothing else. No per-product explainer text on this screen.
`Holi Team, What are we making today?` sits right above the buttons.

Catalog buttons — just the six names, no family subtitles on screen (the editorial/community
split is an internal ordering only, never shown to the user). Keep this order:
- `[ ✍️ Weekly Breeder's Brief ]` -> route `breeders-brief/`
- `[ ⭐ Breeder's Brief Highlight ]` -> route `breeders-brief-highlight/`
- `[ 📰 Alphatype Bulletin ]` -> route `alphatype-bulletin/`
- `[ 🌱 Grow Diaries Card ]` -> route `grow-diaries-card/`
- `[ 🖼️ Photo Update ]` -> route `photo-update/`
- `[ 🎬 Video Update ]` -> route `video-update/`

Footer: `[ ❌ Cancel ]`

## 3. Second-level actions (edit same message, add `[ ⬅️ Back ]`)
- **Weekly Breeder's Brief** -> one tap generates the brief immediately (the news pool with per-item buttons); no `Generate / Re-post` step (see §7)
- **Grow Diaries Card** -> one tap = fully automatic, builds the card from the pool with no choices (see §6)
- **Breeder's Brief Highlight** -> pick a Brief item -> render a 1:1 social card (Telegram). Card screen = `[ ✅ Publish ]` `[ ⬅️ Back ]` `[ ❌ Cancel ]` only — no Redo; `Back` = pick another item
- **Alphatype Bulletin** -> long-form article on our own work (lab/harvest/field/new varieties); not Brief-derived; generated in Telegram (no web destination — see Notes)
- **Photo Update** -> upload photo -> caption -> watermark
- **Video Update** -> upload clip -> caption -> watermark + 4:5 crop

## 4. Shared flow skeleton (all 6 products reuse this)
1. **Input** — media (photo/video) or a selection (a Brief item).
2. **Auto-process** — bot does the mechanical work (logo watermark, render, crop) and shows it.
3. **Copy** — caption / text in our voice; bot can suggest, person edits. **Context input accepts
   text OR a Telegram voice note / audio** (farms send context mostly as voice notes). Telegram
   transcribes the voice note and the bot works from that transcript. Output ships in English.
4. **Review** — bot shows the finished piece + copy together for approval.
5. **Publish** — post to the Alphatype Telegram group. Escape at every step (see §8).

## 5. Photo Update & Video Update flow (the simplest; they share ~90%)
Both = media + `a1phatype` logo watermark + a caption + publish to the Alphatype Telegram group.

**Trigger:** tap `[ 🖼️ Photo Update ]` / `[ 🎬 Video Update ]`, OR just send media (sending a photo
with no menu is the normal path). The bot detects the file type but only auto-routes when one
product matches; it asks when more than one does:
- **Video sent** — unambiguous (Video Update is the only video product) — start Video Update.
- **Photo sent** — two products take an ad-hoc photo: Photo Update (social) and Alphatype Bulletin
  (article hero image). Bot asks: "Nice shot. What do we make?"
  `[ 🖼️ Photo Update ]` `[ 📰 Alphatype Bulletin ]` `[ ❌ Cancel ]`.
  (Grow Diaries Card is NOT in this prompt — it never uses an ad-hoc photo; see §6.)

**Steps:**
1. **Send media.** If they tapped the button first: "Send me the photo" / "Send me the clip."
   If they sent media first, skip straight to step 2.
2. **Auto-watermark.** Bot stamps the `a1phatype` logo (bottom-right) and shows the preview.
   - Photo: 1080×1080 PNG.
   - Video: watermark bottom-right + center-crop to 4:5 (Telegram-friendly), MP4. (ffmpeg)
3. **Caption — explicit mode, no guessing.** Bot: "Caption?" with two buttons so it always
   knows whether the next message is final copy or raw context:
   - `[ ✍️ I'll write it ]` — next message is the **final caption, published verbatim** (still
     shown in review). On the review screen, offer an optional `[ 🪄 Polish to our voice ]` to
     one-tap polish if it didn't land in voice.
   - `[ 🪄 I'll send context ]` — next message(s) are **raw context as text OR a Telegram voice
     note / audio**. Farms send context mostly as voice notes; Telegram transcribes them and the
     bot works from the transcript. Context is usually Spanish, messy, can be a forwarded team
     message. Bot **drafts the caption in our voice (English)** and shows it with
     `[ ✅ Use it ]` `[ 🔄 Another version ]` `[ ✏️ Edit ]`.
   Picking the mode first removes the ambiguity entirely; the bot never has to infer intent from
   the text. Voice = `marketing/alphatype-voice.md` (anti-slop).
   **Output language: always English.** Context usually arrives in Spanish (raw from the farm);
   the final published caption ships in English regardless. In the `🪄 I'll send context` mode the
   bot drafts straight to English. In the `✍️ I'll write it` mode you write English; if you wrote
   Spanish, the `🪄 Polish to our voice` button renders it to English before publishing.
4. **Review.** Bot reposts the watermarked media + the chosen caption together. Buttons:
   `[ ✅ Publish to Alphatype group ]` `[ ✏️ Edit caption ]` `[ 🔄 Redo ]` `[ ⬅️ Back ]` `[ ❌ Cancel ]`.
5. **Publish.** On approve, posts media + caption to the Alphatype Telegram group and confirms.

Only difference between the two: step 2 (image stamp vs. video watermark + 4:5 crop). Everything
else is identical, so they're one code path with a media-type branch.

## 6. Grow Diaries Card flow (one tap, fully automatic)
A "Featured on Grow Diaries" card. The gold **"Featured on Grow Diaries" badge is FIXED** and never
changes. **One tap on the menu button builds the whole card** — the bot picks the photo, the
strain, the quote and the rating by itself. The person picks **NOTHING** (not the photo, not the
strain, not the quote, not the stars); they only approve and publish. Output 1080×1080 PNG
(Option 2 "Editorial Quote" template). **No grower / no attribution:** the bottom row carries only
type + rating.

**Trigger:** tap `[ 🌱 Grow Diaries Card ]`. No sub-menu, no photo picker. Photos come from the
curated pool = **Google Drive folder "Grow Diaries"** (`1gq9LOGANob1MDNd4mbfRHWnTH9IUOsCJ`), read
via the Drive API. The bot auto-selects an **unused** photo (never an ad-hoc sent photo).

**What the bot does automatically (no buttons in between):**
1. **Photo** — auto-picks one unused photo from the pool. If none remain, it says
   "Pool's empty — upload more photos" and stops (it never reuses).
2. **Strain** — from the file name if present (e.g. `bubble-gas.jpg` → "Bubble Gas"); otherwise it
   invents a variety name that fits the plant.
3. **Quote** — generates **ONE** quote, placed alone (no picker). Real-grower voice in English
   (not brand voice; anti-slop rules do NOT apply here), max 160 chars, no em dashes, no
   hype/medical claims. The bot still **draws internally on the varied grower-voice registers**
   (chill / technical / hype / seasoned / terse) so cards don't all sound the same — it picks one
   register itself and never shows the options. The quote must be **coherent with the strain**
   (flavor inferred from the name, effect from type: Indica relaxing / Sativa active / Hybrid
   balanced) and never contradict the name. Sensory experience may be invented; numbers (%THC,
   germination) may not. No attribution is shown.
4. **Rating** — auto-assigned. The person does not set it.
5. **Render** — fills the template (fixed badge, photo, strain, quote, type, rating — **NO grower**)
   and shows the finished card.

**The only screen the person sees** is the finished card:
`[ ✅ Publish to Alphatype group ]` `[ 🔄 Redo ]` `[ ⬅️ Back ]` `[ ❌ Cancel ]`. `🔄 Redo` re-rolls
the whole card (new photo + quote); approve to publish.

**No reuse.** On publish, the bot moves the used photo to a `Used/` subfolder inside the Drive
folder, so each photo is used once and the pool only shows unused ones.

> Implementation details (remove grower from the render template, coherence-profiling, the Drive
> service account, UTF-8 for caption emojis) live in Paula's separate Grow Diaries instructivo for
> Manuel, not in this menu spec.

## 7. Weekly Breeder's Brief flow (+ how Breeder's Brief Highlight spins off)
The Brief is the editorial source. The engine already curates it (Monday 06:00 COT): 5–10 items,
7-day window, genetics/breeding news + research only, no press releases. Issues run sequentially;
the bot always works from the **latest issue** (no fixed number in this spec). Tapping
`Weekly Breeder's Brief` in `/start` **generates the brief immediately** — no `Generate new` /
`Re-post latest` step, no double interaction. The bot posts the news pool straight away.

**Bot posts:** a header (issue + date + count + "Under each: discard it, or turn it into a social
card") — one message per item (headline + one-sentence "so what" + source + date) — per-item
buttons — an approve footer.

- **Per item:** `[ 🗑 Discard ]` `[ 🖼 Social ]`.
- **Footer:** `[ ✅ Approve & send to mailing list ]`.

**Product mapping (locked):**
- **Weekly Breeder's Brief = the EMAIL.** `Approve & send to mailing list` ships the non-discarded
  items as the newsletter edition. That send is the deliverable.
- **`Discard`** drops an item from the edition.
- **`Social` = Breeder's Brief Highlight.** Pick ONE item and spin it into the Highlight — a 1:1
  social card published to the Alphatype Telegram group. (Selecting "Breeder's Brief Highlight" from
  `/start` = pick an item from the latest Brief, then render the card.) The card screen offers
  `[ ✅ Publish to Alphatype group ]` `[ ⬅️ Back ]` `[ ❌ Cancel ]` — **no Redo**: the item and the
  card params are fixed, so there's nothing to re-roll; `⬅️ Back` means "pick another item" if you
  don't like it.
- **NOT the Alphatype Bulletin.** The Highlight is Brief-derived; the Alphatype Bulletin is original
  content about our own work, not derived from the Brief.

**No web channel.** There is **no website/Wix publishing in this bot.** The Highlight ships as a
Telegram social card only. (The site is moving off Wix and the new host is undecided; web posting is
out of scope until that's settled — see Notes.)

**Count rule (LOCKED): minimum 5.** Range 5–10, hard floor 5. Curation must deliver ≥5 valid items.
- The engine curates a **ranked candidate pool with a buffer** (e.g. top 8–10): it posts the best
  items and keeps the rest in **reserve**.
- **Discard auto-backfills:** discarding an item promotes the next-best reserve item into its place,
  so the live set never drops below 5. No separate "find another" button.
- If the reserve empties and discarding would drop below 5, the bot runs another curation pass
  first ("curating one more…").
- Safety gate: `[ ✅ Approve & send to mailing list ]` is enabled only when ≥5 items remain.

## 8. Standard button rows (navigation, locked)
Per design rule 4, navigation is consistent across every screen below `/start`:
- **Catalog (`/start`):** product buttons + `[ ❌ Cancel ]` footer (top level, no Back).
- **Second-level / step screens:** the step's actions + `[ ⬅️ Back ]` + `[ ❌ Cancel ]`.
- **Review screens:** `[ ✅ Publish… ]` `[ ✏️ Edit… ]` (where editable) `[ 🔄 Redo ]` `[ ⬅️ Back ]` `[ ❌ Cancel ]`.
- **`[ ⬅️ Back ]`** = go up exactly one level, editing the current message in place (never sends a
  new message). From a review screen, Back returns to the previous step; from a step, to the
  product's second-level screen; from there, to the catalog.
- **`[ 🔄 Redo ]`** = repeat the current step (new render / new draft), staying on the same screen.
- **Deterministic renders drop Redo.** When the output is fixed from its inputs (Breeder's Brief
  Highlight card), there's nothing to re-roll: the screen is `[ ✅ Publish ]` `[ ⬅️ Back ]`
  `[ ❌ Cancel ]`, and `⬅️ Back` means "pick another item". Generative steps (Grow Diaries card,
  caption drafts) keep `🔄 Redo`.
- **`[ ❌ Cancel ]`** / `/cancel` = drop the whole flow, return to idle.

## Notes / status
- **"Breeding Update" = Alphatype Bulletin.** Same product; the old bot label is retired.
- **Bulletin is kept in the catalog (6 products).** A photo sent with no menu offers Photo Update
  OR Alphatype Bulletin (article hero). **Manuel to confirm the Bulletin branch is wired in the
  bot;** if it is not yet, the photo prompt falls back to Photo Update until it ships.
- **No web / Wix destination (locked for now).** All publishing targets are Telegram. The
  Highlight's old "Website" channel and any Wix/Insights publishing are removed. The Alphatype
  Bulletin still *generates* its long-form article content (delivered in Telegram for the team to
  use), but the bot does not post it to any website — the new site host is undecided (moving off
  Wix), so web posting is out of scope until that's settled.
- **Telegram destination — RESOLVED (not an open item).** The bot is LIVE and already publishing
  to the Alphatype Telegram group. The chat/channel ID and the bot's post rights live in the bot
  `.env` (owned by Manuel), not in this spec and not in Nelly's Den. Nothing to capture here.
- **Voice-note transcription — provided by Telegram.** Not a tool to build. Farms send context as
  Telegram voice notes; Telegram transcribes them and the bot works from the transcript.
- **Product names are the locked 2026-06-19 set** (Breeder's Brief Highlight, Alphatype Bulletin).
  Nelly's Den `mkt_products` still carries the old names (Genetics Watch, Website article); this is
  pending Manuel's rename per `CHANGE_REQUEST_Product_Naming_2026-06-23`. The menu is correct; the
  Den lags.
- **Email rail is staged, not live.** Weekly Breeder's Brief is the email product, but the actual
  send (`Approve & send to mailing list`) still needs wiring. Confirm the mailing-list/ESP setup.
- **A15 is not wired to Ms. Bubbles yet.** Out of this catalog for now; revisit after the 6 are
  live (its script + route get added then).
