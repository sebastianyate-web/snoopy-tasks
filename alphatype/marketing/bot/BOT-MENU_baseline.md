# Ms. Bubbles — Bot menu spec (BASELINE importado)

> **Nota Snoopy (no parte del original):** importado verbatim desde la fuente aprobada
> `BOT-MENU.md` (computador del bot). Los glifos emoji llegaron corruptos por el pegado y
> aquí se normalizaron a su glifo canónico; el texto/wording se conserva exacto. Este archivo
> es la **línea base** de lo que hoy vive en el bot. Las correcciones acordadas NO se aplican
> aquí: van en `BOT-MENU_cambios.md` para que Manuel vea el diff antes de poner en vivo.
> El nombre canónico acordado por Sebastián es **Ms. Bubbles**; el baseline conserva las
> variantes originales ("Mrs."/"Miss") porque normalizarlas es una de las correcciones.

---

# Mrs. Bubbles — Bot menu spec

Single source of truth for the `@a1mktcontentbot` ("Mrs. Bubbles") command menu and
product picker. The bot's only job is to create Alphatype content products, so the menu
funnels everything through one entry instead of privileging a few products with their own
commands. Locked names per `products/README.md` (the 6 canonical products, 2 families).

**Audience: internal only.** Mrs. Bubbles is used by the marketing department (Manuel, Paula,
Sebastián), not by clients. Tone is close, chill, team-to-team in Spanish, not the formal B2B
voice. No walls of text: the `/start` screen shows product names as buttons and nothing else.

## Design rules
1. **One door to the catalog.** The slash list never enumerates products. Either all 6 get a
   command or none do, so none do. Products live in an inline keyboard, not in `/`.
2. **`/start` is the single entry.** Telegram fires it automatically on first contact and every
   user knows it, so it is the shortest, most automatic path. No separate `/crear` / `/menu`.
3. **Product-specific shortcuts fold into their product**, not the command list:
   - old `/auto` -> "Random photo" action inside Grow Diaries Card.
   - old `/brief` -> "Re-post latest" action inside Weekly Breeder's Brief.
4. Always offer an escape (`/cancel`) and a "Back" button inside the inline flow; edit the
   message in place instead of sending new ones.

## 1. Command list (paste into BotFather `/setcommands`)
```
start - Show what Mrs. Bubbles can make
cancel - Cancel whatever's in progress
help - How Mrs. Bubbles works
```

## 2. Inline catalog (opened by `/start`)
Greeting (short, chill, internal):
```
🫧 Miss Bubbles
"If you stay ready, you ain't gotta get ready."

What are we making today?
```
Then the buttons, nothing else. No per-product explainer text on this screen. The tagline is
a fixed team vibe line; `What are we making today?` sits right above the buttons.
**All bot UI is in English** (greeting, prompts, button labels), even though the team is
Spanish-speaking and context often comes in Spanish.

Editorial family:
- `[ ✍️ Weekly Breeder's Brief ]` -> route `breeders-brief/`
- `[ ⭐ Breeder's Brief Highlight ]` -> route `breeders-brief-highlight/`
- `[ 📰 Alphatype Bulletin ]` -> route `alphatype-bulletin/`

Community family:
- `[ 🌱 Grow Diaries Card ]` -> route `grow-diaries-card/`
- `[ 🖼️ Photo Update ]` -> route `photo-update/`
- `[ 🎬 Video Update ]` -> route `video-update/`

Footer: `[ ❌ Cancel ]`

## 3. Second-level actions (edit same message, add `[ Back ]`)
- **Weekly Breeder's Brief** -> `[ Generate new ]` `[ Re-post latest ]`
- **Grow Diaries Card** -> `[ Upload photo ]` `[ Random photo ]`
- **Breeder's Brief Highlight** -> pick a Brief item -> render card
- **Alphatype Bulletin** -> long-form web article on our own work (lab/harvest/field/new varieties); not Brief-derived
- **Photo Update** -> upload photo -> caption -> watermark
- **Video Update** -> upload clip -> caption -> watermark + 4:5 crop

## 4. Shared flow skeleton (all 6 products reuse this)
1. **Input** — media (photo/video) or a selection (a Brief item).
2. **Auto-process** — bot does the mechanical work (logo watermark, render, crop) and shows it.
3. **Copy** — caption / text in our voice; bot can suggest, person edits. **Context input accepts
   text OR a voice note / audio** (farms send context mostly as voice notes); the bot transcribes
   audio and works from the transcript. Output ships in English.
4. **Review** — bot shows the finished piece + copy together for approval.
5. **Publish** — post to the Alphatype Telegram group. Escape at every step: `[ Redo ]` / `[ Cancel ]`.

## 5. Photo Update & Video Update flow (the simplest; they share ~90%)
Both = media + `a1phatype` logo watermark + a caption + publish to the Alphatype Telegram group.

**Trigger:** tap `[ 🖼️ Photo Update ]` / `[ 🎬 Video Update ]`, OR just send media. The bot detects
the file type but only auto-routes when one product matches; it asks when more than one does:
- **Video sent** — unambiguous (Video Update is the only video product) — start Video Update.
- **Photo sent** — two products take an ad-hoc photo: Photo Update (social) and Alphatype Bulletin
  (article hero image). Bot asks: "Nice shot. What do we make?"
  `[ 🖼️ Photo Update ]` `[ 📰 Alphatype Bulletin ]` `[ ❌ Cancel ]`.
  (Grow Diaries Card is NOT in this prompt — it never uses an ad-hoc photo; see §6.)
  Note: the Alphatype Bulletin branch is defined in the editorial round; until it ships, a sent
  photo routes straight to Photo Update.

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
   - `[ 🪄 I'll send context ]` — next message(s) are **raw context as text OR a voice note /
     audio**. Farms send context mostly as voice notes, so the bot must accept audio, transcribe
     it, and use the transcript as context. Context is usually Spanish, messy, can be a forwarded
     team message. Bot **drafts the caption in our voice (English)** and shows it with
     `[ ✅ Use it ]` `[ 🔄 Another version ]` `[ ✏️ Edit ]`.
   Picking the mode first removes the ambiguity entirely; the bot never has to infer intent from
   the text. Voice = `marketing/alphatype-voice.md` (anti-slop).
   **Output language: always English.** Context usually arrives in Spanish (raw from the farm);
   the final published caption ships in English regardless. In the `🪄 I'll send context` mode the
   bot drafts straight to English. In the `✍️ I'll write it` mode you write English; if you wrote
   Spanish, the `🪄 Polish to our voice` button renders it to English before publishing.
4. **Review.** Bot reposts the watermarked media + the chosen caption together. Buttons:
   `[ ✅ Publish to Alphatype group ]` `[ ✏️ Edit caption ]` `[ 🔄 Redo ]` `[ ❌ Cancel ]`.
5. **Publish.** On approve, posts media + caption to the Alphatype Telegram group and confirms.

Only difference between the two: step 2 (image stamp vs. video watermark + 4:5 crop). Everything
else is identical, so they're one code path with a media-type branch.

## 6. Grow Diaries Card flow (skeleton + strain + grower quote + rating)
A "Featured on Grow Diaries" card. Reuses the skeleton; adds strain, a grower-voice quote, and a
rating. Output 1080×1080 PNG (Option 2 "Editorial Quote" template).

**Trigger:** tap `[ 🌱 Grow Diaries Card ]` from the menu. It does NOT take an ad-hoc sent photo;
its photos come from the curated pool, which is the **Google Drive folder "Grow Diaries"**
(`1gq9LOGANob1MDNd4mbfRHWnTH9IUOsCJ`) where the team uploads growdiaries.com downloads. Bot reads
it via the Drive API.

**Steps:**
1. **Photo (from the pool).** `[ 🎲 Random ]` (the folded old `/auto`) or `[ 🖼️ Pick from pool ]`.
   Pool = files at the root of the Drive folder.
2. **Strain.** Bot suggests 3 (from our strain catalog) — pick one or type your own.
3. **Quote — 5 suggestions across DIFFERENT grower voices.** Grow Diaries is a growers' social
   network, so the quotes must sound like real, varied community commenters, NOT Alphatype brand
   voice (anti-slop rules do NOT apply here). The 5 span registers:
   - 🏝️ Chill / casual
   - 🤓 Technical / nerdy (trichomes, terps, pheno)
   - 🔥 Hype / short and excited
   - 🧑‍🌾 Seasoned grower / mentor
   - ✂️ Terse / few words
   Buttons: pick one · `[ 🔄 Regenerate ]` (new batch of 5) · `[ ✍️ Write my own ]`.
   Language: English (Grow Diaries is an English platform).
4. **Rating.** Auto-assigned (adjustable).
5. **Render.** Bot fills the template (photo, GD badge, strain, quote, rating, grower handle) and
   shows the card.
6. **Review — publish.** `[ ✅ Publish to Alphatype group ]` `[ 🔄 Redo ]` `[ ❌ Cancel ]`.
7. **No reuse.** On publish, the bot moves the used photo to a `Used/` subfolder inside the Drive
   folder, so each photo is used once and the pool only shows unused ones.

## 7. Weekly Breeder's Brief flow (+ how Breeder's Brief Highlight spins off)
The Brief is the editorial source. The engine already curates it (Monday 06:00 COT): 5–10 items,
7-day window, genetics/breeding news + research only, no press releases. Issues run sequentially
(latest seen = #215). `/start` — Weekly Breeder's Brief — `[ Generate new ]` / `[ Re-post latest ]`.

**Bot posts:** a header (issue + date + count + "Under each: discard it, or turn it into a social
card or a website draft") — one message per item (headline + one-sentence "so what" + source +
date) — per-item buttons — an approve footer.

- **Per item:** `[ 🗑 Discard ]` `[ 🖼 Social ]` `[ 🌐 Website ]`.
- **Footer:** `[ ✅ Approve & send to mailing list ]`.

**Product mapping (locked):**
- **Weekly Breeder's Brief = the EMAIL.** `Approve & send to mailing list` ships the non-discarded
  items as the newsletter edition. That send is the deliverable.
- **`Discard`** drops an item from the edition.
- **`Social` / `Website` = Breeder's Brief Highlight.** Pick ONE item and spin it into the
  Highlight — `Social` — 1:1 social card, `Website` — web version. Same product, two channels; one
  selected item can go to both. (Selecting "Breeder's Brief Highlight" from `/start` = pick an item
  from the latest Brief, then choose channel.)
- **NOT the Alphatype Bulletin.** The `Website` button is the Highlight's web channel, not the
  Bulletin. Alphatype Bulletin is original content about our own work, not derived from the Brief.

**Where the Highlight publishes:**
- `Social` — 1:1 card to the Alphatype social channel (Telegram group for now).
- `Website` — a post in the **Insights section of alphatype.co**, published **as a draft for
  review** (not auto-live). Site is on **Wix** (interim; a migration is planned).
  **One-click publish design:** Insights = a **Wix CMS collection** (`Insights`, fields
  `title/body/image/source/date/status`) bound to a **dynamic page** (the fixed template). On
  `🌐 Website`, the bot makes ONE POST to that collection via the **Wix Data REST API** (or a Velo
  http-function) with `status=draft` + uploads the image to Wix Media first. The dynamic page shows
  only `published`; someone flips draft→published in Wix to go live. The bot emits **structured
  fields, not Wix-coupled HTML**, so a future CMS migration only swaps the publish adapter.

**Count rule (LOCKED): minimum 5.** Range 5–10, hard floor 5. Curation must deliver ≥5 valid items.
- The engine curates a **ranked candidate pool with a buffer** (e.g. top 8–10): it posts the best
  items and keeps the rest in **reserve**.
- **Discard auto-backfills:** discarding an item promotes the next-best reserve item into its place,
  so the live set never drops below 5. No separate "find another" button.
- If the reserve empties and discarding would drop below 5, the bot runs another curation pass
  first ("curating one more…").
- Safety gate: `[ ✅ Approve & send to mailing list ]` is enabled only when ≥5 items remain.

## Notes / pending
- **"Breeding Update" = Alphatype Bulletin.** Same product; the old bot label is retired.
- **Email rail is staged, not live.** Weekly Breeder's Brief is the email product, but the actual
  send (`Approve & send to mailing list`) still needs wiring. Confirm the mailing-list/ESP setup.
- **A15 is not wired to Mrs. Bubbles yet.** Out of this catalog for now; revisit after the 6
  are live (its script + route get added then).
- **Published caption language: English (locked).** Photo/Video Update are social, published to
  the Alphatype Telegram group for now. Context comes in Spanish from the farm; output is English.
- **OPEN — Telegram destination.** Confirm the Alphatype group/channel ID the bot publishes to
  and that the bot has post rights; record it here.
