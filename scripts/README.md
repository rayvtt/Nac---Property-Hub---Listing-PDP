# Notion → PDP sync

The `Sync Notion → PDP HTML` GitHub Action runs every 10 minutes (and on demand)
to pull content from the **🏠 NAC - Property Listings** Notion database and
patch it into each property's HTML file under `properties/`. Edits in Notion
appear on GitHub Pages roughly 5–15 minutes later (10-min cron + Pages rebuild).

## One-time setup

Three steps. Should take under ten minutes.

### 1. Create a Notion internal integration

1. Go to <https://www.notion.so/profile/integrations>.
2. Click **New integration**.
3. Name it something like `NAC PDP Sync`. Type: **Internal**. Associated workspace: the one that owns the property listings database.
4. Capabilities — only **Read content** is required.
5. After it's created, copy the **Internal Integration Secret** (`secret_…`). Treat it like a password.

### 2. Share the property database with the integration

1. Open the **🏠 NAC - Property Listings** database in Notion.
2. Click the **⋯** menu (top-right) → **Connections** → **Add connections** → search for `NAC PDP Sync` → confirm.

The integration can only read pages explicitly shared with it. Without this step the workflow returns an "object_not_found" error.

### 3. Add the token to GitHub secrets

1. Go to <https://github.com/rayvtt/Nac---Property-Hub---Listing-PDP/settings/secrets/actions>.
2. Click **New repository secret**.
3. Name: `NOTION_TOKEN`. Value: paste the integration secret from step 1. Save.

Optional: if you ever change the database, also add a `NOTION_DATABASE_ID` repository **variable** (Settings → Secrets and variables → Actions → Variables). The default `35848ec25e86803283acc7ad989649c9` is hardcoded into the workflow.

### 4. Run it once

Go to the **Actions** tab → **Sync Notion → PDP HTML** → **Run workflow**. If the secret is set up correctly and the database is shared with the integration, you'll see something like:

```
Fetching Live properties from Notion …
  1 Live properties found
  ✓ nobu-da-nang: no change
Done. 0 file(s) changed.
```

After this, the cron runs every 10 minutes.

## What gets synced

Only rows with **Hub Status = Live** are processed. For each row, the script
looks up `properties/<🔗 Slug>.html` and patches:

| Notion property | HTML tag |
|---|---|
| `Property ID`, `Country`, `📍 District`, `🏨 Hub Type`, `🏷️ Tagline EN/VI` | `data-notion="property_id"` etc. (hero eyebrow + tagline) |
| `Purchase Price` | `data-notion="price_short"` (hero) + `data-notion="price_full"` (financials) |
| `Yield %`, `IRR %`, `Cash-on-Cash %`, `Payback Years` | hero KPI + financial cards |
| `Monthly Rental Income` | financial card |
| `📝 Desc EN/VI` | section 01 overview prose |
| `🌍 Market EN/VI` | section 03 market prose |
| `💬 NAC Note EN/VI` | section 10 assessment body |
| `⭐ NAC Score` | section 10 assessment score (also donut center target) |
| `📊 Sub-Scores JSON` | section 05 donut chart + mobile fallback list |
| `✨ Features JSON` | section 06 feature cards |
| `🔄 Process JSON` | section 07 process steps |
| `✅ Pros JSON` / `⚠️ Cons JSON` | section 08 pros/cons bullets |
| `Purchase Price`, `Yield %`, `IRR %`, `Monthly Rental Income` | section 09 ROI simulator `data-*` attributes |

The hero background image, the gallery images, the NAC statement, and the
market stat cards are **not** synced (their Notion fields are either empty or
not in the schema). They stay as hardcoded HTML for now.

## How the tagging works

The script doesn't generate HTML from a template. Instead, the existing
`properties/<slug>.html` is the canonical layout and Notion patches specific
elements that are tagged with one of these attributes:

- `data-notion="key"` — replace this element's first text node, preserve any child elements (e.g., `<span class="nac-stat-unit">%</span>`). Also updates `data-count-to` if present.
- `data-notion-list="features|pros|cons|process|donut_rows"` — replace the element's entire inner HTML with the rendered list.
- `data-notion-json="sub_scores"` — replace the `<script type="application/json">` body with stringified JSON.
- `data-notion-bg="hero_img|gallery_1|gallery_2|gallery_3"` — set `style="background-image:url(…)"`.
- `data-notion-roi` — on the ROI section root, set the four `data-price`, `data-yield`, `data-irr`, `data-rent` attributes from Notion.

To add a new editable field, just tag the relevant element in the HTML with `data-notion="some_key"` and extend the `textMap` in `scripts/sync-notion.mjs`. No template rebuild needed.

## Running locally

```bash
cd scripts
npm install
NOTION_TOKEN=secret_... node sync-notion.mjs
```

## Adding a new property

1. Create a new row in Notion. Fill in `🔗 Slug` (e.g. `mandarin-da-nang`), `Hub Status = Live`, and all the content fields.
2. Copy `properties/nobu-da-nang.html` to `properties/mandarin-da-nang.html` and commit. The next sync run will patch the Notion-controlled bits.
3. (Future improvement: a `_template.html` so step 2 isn't manual.)
