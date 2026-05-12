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

5. **Cinematic gallery** (`#nac-gallery`) is disabled on mobile (`@max-width:680px`) — track height becomes `auto`, stick becomes `position:relative` at 72vh. `updateCine()` exits early because `scrollable <= 0`. Only the dot-tap nav switches images on mobile. Desktop keeps the 500vh sticky-scroll experience.

## Workflow

- Develop on a feature branch (`claude/<slug>-qarsn`).
- Push, open PR via `mcp__github__create_pull_request`, squash-merge via `mcp__github__merge_pull_request`. No need to ask before merging.
- Then `git checkout main && git pull origin main && git branch -D <branch>`.
- Never push direct to main — the proxy blocks it.

## Templates

Two design templates that should be the source-of-truth for future PDPs:

- [`NAC-STICKY-PILLS.md`](./NAC-STICKY-PILLS.md) — bottom-center CTA pill + top-right settings pill (theme + lang). Both collapsed-by-default, expand on hover/tap.
- [`NAC-FOOTER.md`](./NAC-FOOTER.md) — bilingual gold title, wave underline, 5-icon social row, 3-col nav.
- [`NAC-BACKLINKS.md`](./NAC-BACKLINKS.md) — canonical URLs for every NAC button across all PDPs.

## Notion sync

- Cron every 5 minutes via `.github/workflows/sync-notion.yml` (GitHub may drift to ~7–12 min under load). Use Actions tab → "Run workflow" for immediate sync.
- Source DB ID: `35848ec25e86803283acc7ad989649c9` (🏠 NAC - Property Listings).
- Script: `scripts/sync-notion.mjs`. Filters by `Hub Status = Live`, patches HTML via cheerio targeting `data-notion="*"`, `data-notion-list="*"`, `data-notion-json="*"`, `data-notion-roi`, `data-notion-bg`.
- Donut score (`.nac-donut-score`) is a special case — sync only updates `data-count-to`, never the inner text (preserves the count-up-from-0 animation).
