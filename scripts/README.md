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

---

# PDP HTML → WordPress sync

The `Sync PDP HTML → WordPress` workflow (`.github/workflows/sync-wp.yml`)
pushes each `properties/<slug>.html` file into the **existing** WordPress page
that maps to it, writing the full HTML into the ACF field `raw_html_code`.
It never creates pages — the WP page must already exist.

Triggers:

- Every push to `main` that touches `properties/*.html` (or the script/workflow themselves).
- Manual `workflow_dispatch` — accepts an optional `only_slug` input to push just one PDP.

Combined with the Notion sync above:

```
Notion edit ─► sync-notion commit on main ─► sync-wp run ─► WP page ACF updated
```

## How pages are matched

For each Live row in the Notion DB, the script tries two lookups in order:

1. **Listing URL** (Notion field `Listing URL`, URL or text type) — parses the slug from the URL (`https://…/property-hub-bat-dong-san/vietnam/nobu-da-nang/` → `nobu-da-nang`), queries `GET /wp-json/wp/v2/pages?slug=nobu-da-nang`, and picks the candidate whose full WP `link` matches the Notion URL exactly. If only one candidate exists, it's accepted.
2. **Property ID** (Notion `Property ID` → `NAC-<n>`) — fallback. Paginates `/wp-json/wp/v2/pages` and matches the WP page whose ACF field `nac_property_id` equals `NAC-<n>`.

If neither lookup finds a match, the run **fails loudly** so you can either fix the Notion field or create the WP page. The script never creates pages.

## One-time setup

### 1. Application Password in WordPress

1. WP admin → **Users → Profile** for `admin_web` (or whichever user the sync should run as).
2. Scroll to **Application Passwords**. Name it `nac-pdp-sync`. Click **Add New**.
3. Copy the generated password (looks like `abcd EFGH ijkl MNOP qrst UVWX`). It's only shown once.

The user needs `edit_pages` capability — editor or admin role is fine.

### 2. GitHub secrets

Settings → **Secrets and variables → Actions → Secrets**:

| Secret | Notes |
|---|---|
| `WP_APP_PASSWORD` | The application password from step 1 (spaces are part of the password). |
| `NOTION_TOKEN` | Already present (used by the Notion sync). Re-used by sync-wp to look up the Listing URL / Property ID. |

### 3. Notion fields

The Notion DB needs two fields the sync reads:

| Field | Type | Notes |
|---|---|---|
| `Listing URL` | URL (or text) | Full WP URL, e.g. `https://nomadassetcollective.com/property-hub-bat-dong-san/vietnam/nobu-da-nang/`. Primary lookup key. Empty values fall back to Property ID. |
| `Property ID` | Number | Already in use — produces `NAC-<n>`. Fallback lookup key. |

If you've named `Listing URL` differently (e.g. `🔗 Listing URL`), set the `NOTION_LISTING_URL_FIELD` repo variable to that name.

### 4. WordPress: ACF fields on PDP pages

Two ACF fields on the WP page (both should have **Show in REST API** enabled):

| ACF field name | Type | Purpose |
|---|---|---|
| `raw_html_code` | Textarea (or WYSIWYG with formatting OFF) | Receives the full HTML from sync-wp. The WP page template echoes it: `<?php the_field('raw_html_code'); ?>`. |
| `nac_property_id` | Text | Stores `NAC-<n>` so sync-wp can find the page via the Property-ID fallback when the Listing URL is missing or doesn't match. Optional, but recommended. |

ACF Pro 5.11+ exposes ACF fields under `acf` on the REST page resource by default. ACF Free needs the *ACF to REST API* plugin.

### 5. (Optional) Repo Variables to override defaults

Settings → **Variables** tab:

| Variable | Default | Notes |
|---|---|---|
| `WP_USER` | `admin_web` | WP username that owns the application password. |
| `WP_BASE_URL` | `https://nomadassetcollective.com` | Site root, no trailing slash. |
| `WP_ACF_FIELD` | `raw_html_code` | ACF field key that receives the HTML. |
| `WP_PROPERTY_ID_FIELD` | `nac_property_id` | ACF field key used for the Property ID fallback. |
| `NOTION_LISTING_URL_FIELD` | `Listing URL` | Name of the Notion field that holds the WP URL. |

## Running locally

```bash
cd scripts
npm install
NOTION_TOKEN=secret_… WP_APP_PASSWORD='xxxx yyyy zzzz' node sync-wp.mjs            # all
NOTION_TOKEN=secret_… WP_APP_PASSWORD='xxxx yyyy zzzz' ONLY_SLUG=nobu-da-nang \
  node sync-wp.mjs                                                                # one slug
```

## Failure modes

| Symptom | Likely cause |
|---|---|
| `401 incorrect_password` | App password copied wrong, or `WP_USER` doesn't match the password owner. |
| `rest_cannot_edit` | The WP user lacks `edit_pages`. Promote to editor/admin. |
| `no matching WP page — URL "…" did not match any WP page; Property ID "NAC-4" not found in ACF.nac_property_id` | Neither lookup worked. Either: (a) the Listing URL in Notion doesn't match an existing WP page (typo? draft slug? wrong domain?), or (b) the WP page exists but doesn't have `nac_property_id` set. Create/fix the WP page, then re-run. |
| ACF field doesn't update but page does | `raw_html_code` isn't exposed via REST. Enable **Show in REST API** on the field group, or install *ACF to REST API*. |
| Listing URL lookup matches the wrong page | Slug collides across the site. Fix by populating `nac_property_id` on the right WP page and removing the Notion Listing URL (forces the ID fallback), or rename the colliding page slug. |
