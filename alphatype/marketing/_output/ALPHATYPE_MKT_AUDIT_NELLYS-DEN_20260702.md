# Alphatype Marketing — Nelly's Den Audit Report

**Date:** 2026-07-02  
**Scope:** Audit of Nelly's Den database structure, marketing data inventory, organization issues, and proposed clean schema  
**Status:** Data specialist assessment

---

## CRITICAL FINDING: Nelly's Den Tools Unavailable

**Issue:** The MCP tools to query Nelly's Den (`mcp__nellys-den__list_tables`, `describe`, `query`, `list_docs`, `read_doc`) are not available in this session.

**Impact:** Cannot access the actual database schema or confirm what tables/data live in Nelly's Den as SSOT. This audit is based on:
- The old file structure in `C:\Users\USUARIO\Alphatype\marketing` (deprecated per CLAUDE.md)
- Scattered data in `C:\Users\USUARIO\Documents\marketing-ai` (old, deprecated)
- Marketing infrastructure design docs in the old Alphatype folder

**Recommendation:** Before organizing Nelly's Den, restore MCP connectivity or document its current schema.

---

## 1. TABLES/FORMATS FOUND

### A. Alphatype Marketing Structure (Deprecated, but currently THE reference)

**Location:** `C:\Users\USUARIO\Alphatype\marketing\`

#### Products (Editorial & Community)
| Product | Type | Format | Status | Key Files |
|---------|------|--------|--------|-----------|
| **Weekly Breeder's Brief** | Editorial / Source | JSON (briefs) + MD specs | LIVE (email staged) | `breeders-brief/README.md` |
| **Breeder's Brief Highlight** | Editorial Derivative | HTML (web) + PNG (social) | LIVE | `breeders-brief-highlight/README.md`, `examples/web/highlight-web-issue001.html` |
| **Alphatype Bulletin** | Editorial / Web | HTML (web) + PNG (social) | Documented | `alphatype-bulletin/README.md` |
| **Grow Diaries Card** | Community / Social | 1080×1080 PNG | LIVE (bot) | `grow-diaries-card/README.md`, uses Google Drive pool |
| **Photo Update** | Community / Social | PNG + caption | LIVE (bot) | `photo-update/README.md` |
| **Video Update** | Community / Social | MP4 + caption | LIVE (bot) | `video-update/README.md` |

#### Email Infrastructure
| Campaign | Type | Audience | Format | Status |
|----------|------|----------|--------|--------|
| **Weekly Breeder's Brief (Email)** | Newsletter | Opted-in subscribers | HTML email | Staged (no live sends yet) |
| **A15 Outreach** | Commercial/cold | Target accounts (B2B) | Personalized HTML | Infrastructure planned |

#### Bot Integration
| Bot | Products | Status | Files |
|-----|----------|--------|-------|
| **Ms. Bubbles** | Brief posting, Highlight + Bulletin selection, Grow Diaries, Photo/Video | LIVE | `BOT-MENU.md`, `HANDOFF-TO-MANUEL.md` |
| **Miss Bubbles Test Bot** | R&D for photo/video/card rendering | Test | Pool + examples in folder |

#### Shared Assets (Brand/Voice SSOT)
| Type | Location | Contents |
|------|----------|----------|
| **Brand** | `shared/brand/` | Logos (SVG + PNG, 4 colors), fonts, color palette, favicons |
| **Voice** | `shared/voice/` | Tone rules, glossary, anti-slop rules |

---

### B. Old Scattered Data (Deprecated)

**Location:** `C:\Users\USUARIO\Documents\marketing-ai\`

| File | Type | Records | Relevance |
|------|------|---------|-----------|
| `maryjane2026-expositores.csv` | Exhibitor list (Mary Jane Berlin 2026) | 400+ rows | Commercial/event data; should be in Comercial, not Marketing |
| `MaryJane_Correos_expositores-web_2026-06-04.csv` | Email addresses (MJB expositores) | Batch contact data | Lead list; needs segmentation + consent |
| `generador-posts/ejemplo.json` | Example JSON structure | 1 sample | Post generation test data |

**Location:** `C:\Users\USUARIO\Alphatype\` (deprecated)

| Folder | Content |
|--------|---------|
| `marketing/` | Full product + bot structure (see above) |
| `commercial/` | Empty; pending definition |
| `00_foundation/products/` | Empty folder |

---

### C. Current Snoopy Structure (Active)

**Location:** `C:\Users\USUARIO\Snoopy\alphatype\`

| Path | Content | Status |
|------|---------|--------|
| `marketing/bot/` | BOT-MENU.md, flow prototypes, promotion logs | Workflow docs |
| `marketing/_output/` | Reports: Grow Diaries card, menu changes, web pause requests | Output only |
| `00_foundation/` | Empty (products/, design-system/, identity/, voice/) | Intended for centralized assets |

---

## 2. MARKETING DATA IDENTIFIED

### Editorial Pipeline (Live)
1. **Source:** Weekly Breeder's Brief curates 5-10 genetics/breeding news items (7-day window, no press releases)
2. **Weekly cadence:** Monday 06:00 COT bot posts to channel → team approves
3. **Routing:** Button flows → Brief highlight (social + web) OR Bulletin (long-form web article)
4. **Format:** JSON briefs + HTML/PNG templates

### Community Pipeline (Live)
1. **Photo/Video:** User uploads or curated pool (Google Drive)
2. **Grow Diaries:** Bot reads from Drive folder (ID: `1gq9LOGANob1MDNd4mbfRHWnTH9IUOsCJ`), renders card, moves used photos to `Used/` subfolder
3. **Outputs:** 1080×1080 PNG cards with voice options (chill, technical, hype, mentor, terse — NOT brand voice)

### Email Program (Staged)
1. **Newsletter:** Brief curation → HTML email → opted-in list via backend (SES/Postmark/Resend)
2. **Outreach:** Personalized A15 cold emails to targets (GDPR-restricted in EU)
3. **Database:** Needs clean customer list, suppression list, segments, consent tracking

### Event/Commercial Data (Scattered)
- Mary Jane Berlin 2026 exhibitor list (400+ companies, stand positions, logos, descriptions)
- Contact emails for outreach
- Currently in Documents folder; belongs in Comercial area

---

## 3. ORGANIZATION PROBLEMS IDENTIFIED

### Problem 1: Split Between Old and New Locations
| Issue | Impact |
|-------|--------|
| CLAUDE.md declares Snoopy as SSOT, but all marketing products/templates live in deprecated `C:\Users\USUARIO\Alphatype\` | Confusion about where to read/update specs. New work goes to Snoopy, existing product definitions live elsewhere. |
| `00_foundation/` folders in Snoopy are empty; brand assets still in old Alphatype | Brand system not unified. |
| Output files go to `Snoopy/alphatype/marketing/_output/` but products live in old Alphatype | Split workflow. |

### Problem 2: No Marketing Data Table in Nelly's Den
| Table/Data | Should Live in | Currently | Status |
|-----------|---|---|---|
| Product specs (Brief, Highlight, Bulletin, Grow Diaries, Photo/Video) | `mkt_products` (or similar) in Nelly's Den | README.md files scattered in old Alphatype folder | Manual sync; no SSOT |
| Marketing calendar (weekly Brief dates, send dates, post dates) | `mkt_calendar` | Not found; exists in bot code only | No queryable calendar |
| Bot flows / workflows | `mkt_bot_workflows` or similar | BOT-MENU.md in Snoopy; bot code elsewhere | No structured data table |
| Customer/audience list | `mkt_audience` or `mkt_contacts` | Email folder (`shared/audience/`), but files don't exist yet | List is planned, not live |
| Email sends (archive) | `mkt_email_sends` | Email folder (`weekly-breeders-brief/sends/`), but no historical data | No archive yet |

### Problem 3: Naming Inconsistencies
| Issue | Examples | Impact |
|-------|----------|--------|
| Bot name changed mid-project | "Miss Bubbles" vs. "Ms. Bubbles" (correction noted in summary) | Confusion in documentation, past references outdated |
| Product slug naming | Some use "breeders-brief", others "breeder's-brief" | Hard to query/filter by product |
| File naming lacks consistent dates/versions | `BOT-MENU.md` vs. `FORMULARIO-POST-FINAL.html` (no dates in old folder) | No way to tell which version is current |
| Email campaign naming | "Weekly Breeder's Brief" (newsletter) vs. "A15" (outreach) — no slug consistency | Querying/routing difficult |

### Problem 4: Cross-Team Data Ownership Unclear
| Data | Should Live In | Currently Scattered | Team |
|------|---|---|---|
| Mary Jane Berlin 2026 exhibitors (400+ rows) | `Comercial/` (lead gen, events) | `Documents/marketing-ai/maryjane*.csv` | Comercial (not defined yet) |
| Product definitions | Nelly's Den `mkt_products` | Alphatype markdown folders | alphatype-mkt-data |
| Templates & examples | Nelly's Den + Snoopy `00_foundation/` | Old Alphatype `products/*/template/` + `examples/` | alphatype-mkt-designer |
| Email list + segments | Nelly's Den `mkt_audience` | Planned in `email/shared/audience/` | alphatype-mkt-email |

### Problem 5: External Dependencies Not Tracked
| Dependency | Details | Risk |
|---|---|---|
| Google Drive (Grow Diaries pool) | Drive ID: `1gq9LOGANob1MDNd4mbfRHWnTH9IUOsCJ` | Hard-coded; no access tracking or versioning |
| Bot code (Ms. Bubbles) | Engine logic for Brief curation, render code for cards | Live in bot repo, not documented in Nelly's Den |
| MailerLite replacement backend | SES/Postmark/Resend; not yet chosen | Email infrastructure not live; depends on external decision |

---

## 4. PROPOSED CLEAN STRUCTURE FOR NELLY'S DEN

### A. Database Schema (Nelly's Den Tables)

#### 1. `mkt_products` — Marketing Product SSOT
Canonical definitions for all marketing outputs (Editorial, Community, Email campaigns).

```
COLUMNS:
- product_id (PK)
- slug (kebab-case, unique: "weekly-breeders-brief", "grow-diaries-card")
- canonical_name (Title Case: "Weekly Breeder's Brief")
- family (enum: "Editorial", "Community", "Email")
- status (enum: "Live", "Staged", "Design", "Deprecated")
- audience (text: "Working cannabis breeders, B2B, EU+US")
- description (text: what it is)
- content_source (text or FK to another product: "self" or "breeders-brief")
- channels (JSON array: ["web", "social", "email"])
- cadence (text: "weekly Monday 06:00 COT", "on-demand", etc.)
- owner_agent (text: "alphatype-mkt-social", "alphatype-mkt-email", etc.)
- ssot_location (URL or path: "Snoopy/.../breeders-brief/README.md" OR Nelly's Den path)
- notes (text: hard rules, special mechanics)
- created_at, updated_at
```

**Canonical Products to seed:**
1. Weekly Breeder's Brief (Editorial, Live, source)
2. Breeder's Brief Highlight (Editorial, Live, derivative)
3. Alphatype Bulletin (Editorial, Staged)
4. Grow Diaries Card (Community, Live)
5. Photo Update (Community, Live)
6. Video Update (Community, Live)
7. Weekly Breeder's Brief Email (Email/Newsletter, Staged)
8. A15 Outreach (Email/Commercial, Planned)

---

#### 2. `mkt_bot_workflows` — Bot Flows & Routing
Define bot flows, triggers, and product routing logic (replaces BOT-MENU.md as queryable table).

```
COLUMNS:
- workflow_id (PK)
- bot_name (text: "Ms. Bubbles")
- flow_name (text: "Post Brief", "Approve Highlight", "Auto Grow Diaries")
- trigger (text: "schedule", "button", "manual command")
- trigger_detail (text: "Monday 06:00 COT", "/brief button", "/auto command")
- input_product_id (FK → mkt_products)
- output_products (JSON array of FK → mkt_products)
- channels (JSON array: "bot_channel", "social", "email")
- approval_required (boolean)
- approver_role (text: "Sebastián", "Paula", etc.)
- documented_in (URL/path: "Snoopy/BOT-MENU.md", line X)
- status (enum: "Live", "Testing", "Deprecated")
- created_at, updated_at
```

**Example rows:**
- Brief post → Highlight + Bulletin buttons
- Grow Diaries auto → pool photo + quote selection
- Photo upload → Photo Update card
- Video upload → Video Update card

---

#### 3. `mkt_calendar` — Publishing Calendar
Weekly/periodic publishing dates, send times, team responsibilities.

```
COLUMNS:
- calendar_id (PK)
- date (DATE: publication date)
- product_id (FK → mkt_products)
- event (text: "Weekly Brief curated", "Brief posted to bot", "Brief sent to email list", "Highlight published social")
- scheduled_time (TIME)
- responsible_agent (text: "alphatype-mkt-data", "alphatype-mkt-social")
- status (enum: "Scheduled", "Completed", "Skipped", "Delayed")
- notes (text: any ad-hoc changes)
- created_at, updated_at
```

**Generated quarterly/annually from:**
- 52 weekly cycles of Brief curation/posting/email
- On-demand Grow Diaries, Photo, Video schedules

---

#### 4. `mkt_templates` — Template & Example Assets
Track which templates exist, where they live, which products use them.

```
COLUMNS:
- template_id (PK)
- product_id (FK → mkt_products)
- channel (enum: "web", "social", "email")
- template_type (enum: "layout", "example", "proof")
- file_path (absolute path or URI: "Snoopy/alphatype/00_foundation/templates/brief-highlight-web.html")
- format (text: "HTML", "PNG 1080x1080", "MP4", "PDF-proof")
- last_used_date (DATE)
- approved (boolean)
- approver (text: "alphatype-mkt-designer")
- version_date (DATE: file system date)
- notes (text: dependencies, render notes)
- created_at, updated_at
```

**Outcome:** Central registry of all templates; no more searching for which format lives where.

---

#### 5. `mkt_audience` — Customer/Contact Database
Newsletter subscribers, outreach targets, segments, consent.

```
COLUMNS:
- contact_id (PK)
- email (unique, lowercase)
- name (text)
- company (text, optional)
- region (enum: "EU", "US", "Other")
- segments (JSON array: "breeder", "seed-bank", "cultivator", "retailer", "event-attendee")
- newsletter_opted_in (boolean, default false)
- newsletter_consent_date (DATETIME)
- newsletter_consent_source (text: "form", "event", "import", "manual")
- a15_target (boolean: flagged for A15 outreach?)
- a15_sequence_status (enum: "not-targeted", "in-sequence", "completed", "unsubscribed", "bounced")
- suppression_reason (enum: NULL, "unsubscribed", "hard-bounce", "complaint", "gdpr-request")
- last_email_sent (DATETIME)
- bounced_count (int)
- created_at, updated_at
```

**Outcome:** Single source for audience; no duplicate emails, clear segments, GDPR-compliant.

---

#### 6. `mkt_email_sends` — Email Campaign Archive
Track every Brief and A15 send, delivery metrics, engagement.

```
COLUMNS:
- send_id (PK)
- campaign_type (enum: "weekly-brief", "a15-outreach")
- send_date (DATETIME)
- segment (text: "all-subscribers", "eu-breeders", "us-retailers", etc.)
- recipient_count (int)
- template_used (FK → mkt_templates)
- subject_line (text)
- delivered_count (int)
- bounced_count (int)
- complaint_count (int)
- opened_count (int, if tracked)
- clicked_count (int, if tracked)
- notes (text: any issues, approver name)
- created_at
```

**Outcome:** Full email history, deliverability metrics, compliance audit trail.

---

#### 7. `mkt_assets_shared` — Brand Assets (Brand SSOT)
Centralize all shared brand assets: logos, fonts, color palette.

```
COLUMNS:
- asset_id (PK)
- asset_type (enum: "logo", "font", "color", "icon")
- name (text: "Alphatype Logo Gold", "Inter Font Bold", "Primary Gold")
- file_path (URI: "Snoopy/alphatype/00_foundation/brand/alphatype-gold.svg")
- format (text: "SVG", "WOFF2", "HEX", etc.)
- color_value (text: "#C19A6B" for color assets only)
- usage (text: "web", "social", "print")
- approved (boolean)
- approver (text: "alphatype-mkt-designer")
- version_date (DATE)
- deprecated (boolean)
- created_at, updated_at
```

**Outcome:** All brand assets queryable by type, usage, status; no duplication.

---

### B. File Structure (Snoopy — Working Copies)

Migrate/populate Snoopy with active working files; keep deprecated Alphatype as archive.

```
Snoopy/
├── alphatype/
│   ├── 00_foundation/
│   │   ├── brand/                    # (Populate from old Alphatype)
│   │   │   ├── logos/
│   │   │   ├── colors/
│   │   │   └── fonts/
│   │   ├── identity/
│   │   ├── voice/                    # (Populate with tone/glossary/anti-slop)
│   │   └── products/
│   │       ├── README.md             # Index of all product specs
│   │       ├── breeders-brief.md
│   │       ├── breeders-brief-highlight.md
│   │       ├── alphatype-bulletin.md
│   │       ├── grow-diaries-card.md
│   │       ├── photo-update.md
│   │       ├── video-update.md
│   │       ├── weekly-brief-email.md
│   │       └── a15-outreach.md
│   │
│   ├── marketing/
│   │   ├── templates/                # Working templates (drafts + approved)
│   │   │   ├── web/
│   │   │   ├── social/
│   │   │   └── email/
│   │   ├── examples/                 # Approved final examples per product
│   │   │   ├── breeders-brief-highlight/
│   │   │   ├── grow-diaries-card/
│   │   │   └── ...
│   │   ├── bot/                      # (Keep) bot flows, menu docs
│   │   ├── calendar/                 # (New) publishing calendar (generated from Nelly's Den)
│   │   ├── audience/                 # (New) audience segments, suppression list
│   │   ├── _output/                  # (Keep) reports, dashboards, change requests
│   │   └── README.md                 # Marketing home index
│   │
│   └── comercial/
│       ├── leads/
│       │   ├── maryjane-2026-expositores.csv  # (Migrate from Documents)
│       │   └── outreach-targets.csv
│       ├── events/
│       └── README.md
│
├── _shared/
│   ├── nelly-schema.md               # (New) Data dictionary (what's in each Nelly table)
│   └── glossary.md                   # Product/team term definitions
│
└── _migration/
    ├── README.md
    └── alphatype-marketing-archive.txt  # Log: "Files migrated from old Alphatype on 2026-07-XX"
```

---

### C. Data Migration Plan

#### Phase 1: Schema Setup (Week 1)
1. Create Nelly's Den tables: `mkt_products`, `mkt_templates`, `mkt_audience`, `mkt_email_sends`, `mkt_calendar`, `mkt_bot_workflows`, `mkt_assets_shared`
2. Document each table in `_shared/nelly-schema.md` (data dictionary)
3. Verify MCP tools (`list_tables`, `describe`, `query`) are working

#### Phase 2: Bootstrap Data (Week 2)
1. Load product specs from old Alphatype README.md files → `mkt_products` table
2. Load brand assets inventory → `mkt_assets_shared` table
3. Create product-to-template mapping → `mkt_templates` table
4. Load Mary Jane Berlin exhibitors into `Comercial/leads/` AND prepare for `mkt_audience` (segmentation TBD)

#### Phase 3: Populate Snoopy (Week 3)
1. Copy brand assets to `Snoopy/alphatype/00_foundation/brand/`
2. Copy voice docs to `Snoopy/alphatype/00_foundation/voice/`
3. Create product spec MDfiles in `Snoopy/alphatype/00_foundation/products/`
4. Copy templates to `Snoopy/alphatype/marketing/templates/`
5. Copy examples to `Snoopy/alphatype/marketing/examples/`

#### Phase 4: Establish Workflows (Week 4)
1. Publish calendar for next 8 weeks (52 weekly Briefs + on-demand Grow Diaries) → `mkt_calendar` table
2. Define bot workflows → `mkt_bot_workflows` table
3. Clean & segment Mary Jane Berlin list → add to `mkt_audience` with GDPR consent tracking
4. Deploy email backend (SES/Postmark) + sync audience list

#### Phase 5: Ongoing (Post-Migration)
- alphatype-mkt-data: queries Nelly's Den for reports, dashboards, KPIs
- alphatype-mkt-social: works from product specs (Snoopy or Nelly's Den READ), updates calendar
- alphatype-mkt-email: manages audience segments, send tracking in Nelly's Den
- alphatype-mkt-designer: works from templates (Snoopy), updates `mkt_templates` on approval

---

## 5. SUMMARY TABLE: What Goes Where

| Data Type | Nelly's Den Table | Snoopy File Path | Owner Agent | Access |
|-----------|---|---|---|---|
| Product specs | `mkt_products` | `00_foundation/products/*.md` | alphatype-mkt-data | Read-only (updates via CHANGE_REQUEST) |
| Templates | `mkt_templates` | `marketing/templates/` | alphatype-mkt-designer | Working copies; approval triggers Nelly update |
| Examples | N/A | `marketing/examples/` | alphatype-mkt-designer | Working copies |
| Brand assets | `mkt_assets_shared` | `00_foundation/brand/` | alphatype-mkt-designer | Sync'd after approval |
| Voice rules | N/A | `00_foundation/voice/` | alphatype-mkt-data | Read-only; consulted by all |
| Calendar | `mkt_calendar` | `marketing/calendar.json` | alphatype-mkt-social | Synced weekly from Nelly's Den |
| Audience/contacts | `mkt_audience` | N/A (master in Nelly's Den only) | alphatype-mkt-email | Queries Nelly's Den; sends updates via API |
| Email sends | `mkt_email_sends` | N/A | alphatype-mkt-email | Archived in Nelly's Den only |
| Bot workflows | `mkt_bot_workflows` | `bot/BOT-MENU.md` | alphatype-mkt-social | Source of truth in Nelly's Den |
| Event/lead data | `mkt_audience` (future) | `../comercial/leads/` | (Comercial, TBD) | Owned by Comercial; syncs to Nelly's Den |

---

## RECOMMENDATIONS

### 1. Restore Nelly's Den MCP Connectivity
**Blocker:** Cannot audit or populate without access to MCP tools. Check:
- Is `nellys-den` MCP server online?
- Are tools `list_tables`, `describe`, `query` registered?
- What is the `DEN_TOKEN` (review-scope auth)?

### 2. Establish Clear Ownership
- **alphatype-mkt-data:** Nelly's Den SSOT (reads), reports, tracking setup
- **alphatype-mkt-designer:** Template/example working copies; updates Nelly's Den when approved
- **alphatype-mkt-social:** Calendar + bot flows; consults Nelly's Den for product specs
- **alphatype-mkt-email:** Audience segments + send tracking (master in Nelly's Den)

### 3. Prioritize Bot Name Standardization
Change all references from "Miss Bubbles" to "Ms. Bubbles" across all docs (already noted in summary; needs rollout).

### 4. Migrate Event Data to Comercial
Move Mary Jane Berlin exhibitor lists from Documents folder to `Snoopy/comercial/leads/` with proper segmentation metadata.

### 5. Daily Check: Sync Snoopy Working Files
Set up a weekly export from Nelly's Den to Snoopy for:
- Updated calendar (Monday)
- Template changes (after approval)
- Asset versioning (as needed)

This keeps the working copy in Snoopy fresh while Nelly's Den stays the SSOT.

---

## NEXT STEPS

1. **Confirm Nelly's Den is accessible** → run `describe mkt_products` (or equivalent)
2. **Get approval to create missing tables** → submit schema DDL to Manuel via CHANGE_REQUEST
3. **Plan migration sprint** → align with Sebastián on 4-week timeline
4. **Assign agent responsibilities** → brief each agent on their Nelly's Den read/write access
5. **Sunset old Alphatype folder** → archive to `_migration/` after migration completes; never delete

---

**Report saved:** `C:\Users\USUARIO\Snoopy\alphatype\marketing\_output\ALPHATYPE_MKT_AUDIT_NELLYS-DEN_20260702.md`
