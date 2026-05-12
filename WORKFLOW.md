# NAC Property Hub — PDP Workflow

## How to preview
Open `index.html` in any browser — no build step, no server needed.
Each card links to its PDP file under `properties/`.

---

## Notion → Git sync

### Architecture

```
Notion (edit fields)
  ↓  every 5 min (GitHub Actions cron)
scripts/sync-notion.mjs   ← reads Notion API directly (no proxy)
  ↓  patches HTML via cheerio
properties/<slug>.html
  ↓  git commit + push → main
GitHub Pages (live site)
```

Cloudflare is **not** in this loop. It only appears in the browser-side lead capture (PDF export modal → `nac-notion-proxy` Worker → Notion Lead CRM).

### One-time setup — NOTION_TOKEN secret

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **NAC Property Lister**
2. Copy the **Internal Integration Token** (`secret_...`)
3. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `NOTION_TOKEN`
   - Value: paste the token

Without this secret the workflow fails immediately and nothing syncs.

### Trigger a manual sync

Actions tab → **Sync Notion → PDP HTML** → **Run workflow** → watch live log.

Cron runs every ~5 min (GitHub may drift to 5–12 min under load).

### What the script syncs

| HTML attribute | Notion field | Notes |
|---|---|---|
| `data-notion="tagline_vi"` | `🏷️ Tagline VI` | text |
| `data-notion="tagline_en"` | `🏷️ Tagline EN` | text |
| `data-notion="price_short"` | `Purchase Price` | formatted $280K |
| `data-notion="price_full"` | `Purchase Price` | formatted $280,000 |
| `data-notion="yield_pct"` | `Yield %` | stored as decimal (0.062 → 6.2) |
| `data-notion="irr_pct"` | `IRR %` | same |
| `data-notion="coc_pct"` | `Cash-on-Cash %` | same |
| `data-notion="payback"` | `Payback Years` | number |
| `data-notion="monthly_rent"` | `Monthly Rental Income` | formatted |
| `data-notion="nac_score"` | `⭐ NAC Score` | also updates `data-count-to` |
| `data-notion="desc_vi/en"` | `📝 Desc VI/EN` | long text |
| `data-notion="market_vi/en"` | `🌍 Market VI/EN` | long text |
| `data-notion="nac_note_vi/en"` | `💬 NAC Note VI/EN` | long text |
| `data-notion-bg="hero_img"` | `Image URL` | sets `background-image` style |
| `data-notion-bg="gallery_1"` | `🖼️ Image 1` | URL field |
| `data-notion-bg="gallery_2"` | `🖼️ Image 2` | URL field |
| `data-notion-bg="gallery_3"` | `🖼️ Image 3` | URL field |
| `data-notion-bg="gallery_4"` | `🖼️ Image 4` | text field (not URL type) |
| `data-notion-list="features"` | `✨ Features JSON` | JSON array |
| `data-notion-list="pros"` | `✅ Pros JSON` | JSON array |
| `data-notion-list="cons"` | `⚠️ Cons JSON` | JSON array |
| `data-notion-list="process"` | `🔄 Process JSON` | JSON array |
| `data-notion-json="sub_scores"` | `📊 Sub-Scores JSON` | JSON script tag |
| `data-notion-roi` | purchase price / yield / IRR / rent | sets `data-*` attrs on ROI section |

Only rows with `Hub Status = Live` are synced. The `🔗 Slug` field must match the HTML filename (`nobu-da-nang` → `properties/nobu-da-nang.html`).

### Notion source database
ID: `35848ec25e86803283acc7ad989649c9` (🏠 NAC - Property Listings)

---

## Lead capture (PDF export)

```
PDF button (sticky CTA pill)
  ↓  modal: Name / Email / WhatsApp
  ↓  POST to nac-notion-proxy.ray-vtt.workers.dev  ← Cloudflare Worker (CORS proxy)
  ↓  Notion Lead CRM (2fe48ec25e8680efa3a3fb8113cf6657)
  ↓  window.print()
```

The Worker exists because browsers cannot call the Notion API directly (CORS).
Source: `Listing Brochure`, Property field checked, `Nguồn lead = Listing Brochure`.

---

## Git setup notes

The local git proxy (`127.0.0.1`) **blocks direct pushes to `main`**.
Non-main branches push fine. Always use the branch → PR → merge flow.

---

## Standard edit flow

```bash
# 1. Create or reuse a feature branch
git checkout -b claude/edit-nobu-template-qarsn

# 2. Edit files, then commit
git add properties/nobu-da-nang.html
git commit -m "Short description"

# 3. Push branch
git push -u origin claude/edit-nobu-template-qarsn
```

Then in the Claude session, merge to main:
```
mcp__github__create_pull_request  →  mcp__github__merge_pull_request
```

Then reset local main:
```bash
git checkout main && git pull origin main && git branch -D claude/edit-nobu-template-qarsn
```

---

## File locations

| File | Purpose |
|------|---------|
| `index.html` | Preview index — links to all PDPs |
| `properties/nobu-da-nang.html` | NAC-4 Nobu Da Nang PDP |
| `properties/pullman-panama-city.html` | NAC-19 Pullman Panama City PDP |
| `scripts/sync-notion.mjs` | Notion → HTML sync script |
| `.github/workflows/sync-notion.yml` | Cron workflow (every 5 min) |
| `CLAUDE.md` | Layout rules + process notes for Claude |
| `WORKFLOW.md` | This file |
| `NAC-PDP-DESIGN.md` | Full design system reference |
| `NAC-STICKY-PILLS.md` | CTA + settings pill templates |
| `NAC-FOOTER.md` | Footer template |
| `NAC-BACKLINKS.md` | Canonical URLs for all NAC buttons |

---

## Repo
`rayvtt/Nac---Property-Hub---Listing-PDP`  
Feature branch pattern: `claude/<slug>-qarsn`
