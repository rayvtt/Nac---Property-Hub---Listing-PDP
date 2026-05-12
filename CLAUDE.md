# CLAUDE.md — Working Notes

Process rules and gotchas for this repo. Read this before making layout changes.

## Viewports

Two viewports drive every layout decision:

| View      | Viewport       | Spine grid                       | Marker layout                     |
|-----------|----------------|----------------------------------|-----------------------------------|
| **Desktop** | width ≥ 901px | `grid-template-columns:1fr 140px 1fr` | Vertical (dot/num/label stacked) in center column |
| **Mobile**  | width ≤ 900px | `grid-template-columns:1fr` (single)  | Horizontal row at top of section (dot absolute on spine line, num + label inline) |

The mobile breakpoint is `@media(max-width:900px)`. Some component-level rules also use `@media(max-width:680px)` for tighter phone-only tweaks (eg. donut, cine gallery, CTA pill paddings).

## `data-side` on spine sections

`data-side` is set on `.nac-spine-section`. It drives where content sits on **desktop**. On mobile, every value collapses to single-column.

| `data-side` value | Desktop layout                                           | HTML inner wrapper(s)                          | Mobile (auto)         |
|-------------------|----------------------------------------------------------|------------------------------------------------|-----------------------|
| `left`            | Content in col 1 (left of spine)                         | `.nac-spine-content`                           | Single col            |
| `right`           | Content in col 3 (right of spine)                        | `.nac-spine-content`                           | Single col            |
| `full`            | Content spans all 3 cols, max-width 900px, centered      | `.nac-spine-content`                           | Single col            |
| `both`            | Two columns — left in col 1, right in col 3              | `.nac-spine-left` + `.nac-spine-right`         | Both stack in col 1   |

**Critical:** to "collapse a section into one view on mobile only," do NOT change `data-side`. The mobile media query already stacks `both` into a single column. Changing `data-side` affects the **desktop** layout too.

## Common pitfalls (learned the hard way)

1. **Don't change `data-side` to fix mobile.** It changes desktop. The mobile CSS already collapses `both` to single column. If a `both` section looks wrong on mobile, fix the mobile media query, not the structure.

2. **Always check both views.** Before reporting a task done, mentally walk through what changed at desktop (≥901px) AND mobile (≤900px) widths. The user has called this out as a recurring issue.

3. **`@media(max-width:680px)` is for phone-only polish** (tighter padding, smaller fonts on the pills, donut, gallery). Use this when a change should affect phones only, not tablets.

4. **`.nac-spine-marker` on mobile** uses `position:relative` with `padding-left:22px` and an absolute-positioned `.nac-spine-dot` at `left:-9px` so the dot floats over the spine line. Don't apply margin-left to the marker — it shifts the section number text off-position.

5. **Image breaks** — the old single cinematic gallery (`#nac-gallery`) was replaced with 3 individual full-bleed image sections (`#nac-img-1`, `#nac-img-2`, `#nac-img-3`) distributed at §04, §07, §10 in the spine. `#nac-img-3` has class `nac-cine--aspiration` (gradient overlay + CTA button). These are standard `position:relative` blocks — no sticky scroll.

## Workflow

- Develop on a feature branch (`claude/<slug>-qarsn`).
- Push, open PR via `mcp__github__create_pull_request`, squash-merge via `mcp__github__merge_pull_request`. No need to ask before merging.
- Then `git checkout main && git pull origin main && git branch -D <branch>`.
- Never push direct to main — the proxy blocks it.

## Templates

Templates and references:

- [`properties/_template-listing-pdp.html`](./properties/_template-listing-pdp.html) — **master PDP template** (snapshot 2026-05-12, post-PR #47). Duplicate this for every new listing.
- [`NAC-STICKY-PILLS.md`](./NAC-STICKY-PILLS.md) — bottom-center CTA pill + top-right settings pill (theme + lang). Both collapsed-by-default, expand on hover/tap.
- [`NAC-FOOTER.md`](./NAC-FOOTER.md) — bilingual gold title, wave underline, 5-icon social row, 3-col nav.
- [`NAC-BACKLINKS.md`](./NAC-BACKLINKS.md) — canonical URLs for every NAC button across all PDPs.

## Notion sync

- Cron every 2 minutes via `.github/workflows/sync-notion.yml` (GitHub may drift to ~2–7 min under load). Use Actions tab → "Run workflow" for immediate sync.
- Source DB ID: `35848ec25e86803283acc7ad989649c9` (🏠 NAC - Property Listings).
- Script: `scripts/sync-notion.mjs`. Filters by `Hub Status = Live`, patches HTML via cheerio targeting `data-notion="*"`, `data-notion-list="*"`, `data-notion-json="*"`, `data-notion-roi`, `data-notion-bg`.
- Donut score (`.nac-donut-score`) is a special case — sync only updates `data-count-to`, never the inner text (preserves the count-up-from-0 animation).

## WordPress sync

- Triggered by every push to `main` that touches `properties/*.html`, plus an hourly cron and on-demand via `.github/workflows/sync-wp.yml`.
- Script: `scripts/sync-wp.mjs`. Posts the **full HTML** of each `properties/<slug>.html` into ACF field `raw_html_code` on the matching WP page.
- Lookup: reads the Notion `Listing URL` field, parses the slug from the URL, and matches the WP page by slug + full URL. Property ID is Notion-only and not used for matching.
- **Never creates pages.** Skips (not fails) if `Listing URL` is empty (normal for newly scaffolded listings). Fails loudly if `Listing URL` is set but no WP page matches — fix the URL or create the page, then re-run.
- Auth: HTTP Basic with `WP_USER` (default `admin_web`) and the `WP_APP_PASSWORD` secret (a WP Application Password). Also requires `NOTION_TOKEN`.
- WP-side requirement: ACF field `raw_html_code` (textarea) with **Show in REST API** enabled. Template echoes `<?php the_field('raw_html_code'); ?>`.
- Manual single-slug sync: Actions tab → **Sync PDP HTML → WordPress** → **Run workflow** → enter `only_slug` (e.g. `nobu-da-nang`).

## New listing automation (Hub Status → Live)

Two parallel automations run when a Notion row flips to **Hub Status = Live**:

**Side A — WP automation (set up in Notion/WordPress, outside this repo):**
- Creates a WP page using the `[NAC Residence Index]` template (with empty `raw_html_code` ACF field)
- Writes back WP Page ID and Listing URL to the Notion row

**Side B — Git automation (`.github/workflows/create-pdp.yml`, cron every 5 min):**
1. Queries Notion for Live rows
2. For each slug with no `properties/<slug>.html`, copies `_template-listing-pdp.html` to that path
3. Immediately runs `sync-notion.mjs` to patch the new file with current Notion content
4. Commits and pushes to `main` → triggers `sync-wp.yml`

**Full end-to-end flow once both sides are active:**
```
Notion Hub Status → Live
  │
  ├── Side A: WP automation creates page → writes Listing URL back to Notion
  │
  └── Side B (within ~5 min):
        create-pdp.yml: scaffold properties/<slug>.html → patch with Notion → push
          └── sync-wp.yml: skips (Listing URL empty) on first push
              ↳ hourly retry: once Listing URL is in Notion, push succeeds → WP page live
```

The hourly `sync-wp.yml` cron ensures the WP push happens automatically once Side A finishes, with no manual intervention required.
