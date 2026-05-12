# NAC Property Listing PDP — Design Reference

The master spec for every NAC property dossier (PDP). Source-of-truth implementation: [`properties/nobu-da-nang.html`](./properties/nobu-da-nang.html). Sister docs:

- [`NAC-STICKY-PILLS.md`](./NAC-STICKY-PILLS.md) — bottom CTA pill + top settings pill
- [`NAC-FOOTER.md`](./NAC-FOOTER.md) — bilingual gold-title footer
- [`NAC-BACKLINKS.md`](./NAC-BACKLINKS.md) — canonical URLs (logo / Hub mark / pills / footer / socials)
- [`CLAUDE.md`](./CLAUDE.md) — viewport gotchas + workflow rules

---

## 1. Philosophy

| Pillar | What it means |
|---|---|
| **Editorial-grade** | Reads like a financial dossier, not a marketing landing page. Display-serif (Cormorant) for narrative, mono (JetBrains) for metadata, sans (Inter) for body. |
| **Mobile pristine** | Phones are for the hook + the data. Body prose is **hidden** on mobile; readers are pointed to desktop for the full editorial. |
| **Bilingual native** | Vietnamese-first, English-equal. Every copy block carries both `[data-vi]` and `[data-en]` spans; `data-lang` on the root toggles visibility. |
| **Theme-aware** | Light (cream + navy + gold) and dark (deep-navy + bone + gold) — both first-class, switched via `data-theme` on the root. |
| **Single-file** | No build step, no framework. One ~1800-line HTML file per PDP, hosted on GitHub Pages. Notion sync patches it server-side every 10 min. |

---

## 2. File anatomy

```
properties/nobu-da-nang.html
├── <head>                   meta · favicon · Inter/Cormorant/JetBrains web fonts
├── <body>
│   └── <div class="nac-pdp" data-theme="light" data-lang="vi">   ← single root
│       ├── <progress bar>   scroll progress
│       ├── <header>         logo · date · theme/lang toggles · CTA
│       ├── <section .nac-hero>
│       ├── <section .nac-stmt>
│       ├── <nav .nac-mini>  sticky right-edge spine pips
│       ├── <section .nac-spine>      §01 §02 §03
│       ├── <section .nac-cine>       §04 gallery
│       ├── <section .nac-spine>      §05–§10
│       ├── <section .nac-signoff>    §11 cert + footer
│       ├── <div .nac-tools>          sticky CTA pill (bottom-centre)
│       └── <div .nac-settings>       sticky theme/lang pill (top-right)
└── <script>                 IIFE — reveal, mini-spine, donut, ROI, pills
```

Notion sync (`scripts/sync-notion.mjs`) reads `[data-notion="key"]`, `[data-notion-list="key"]`, `[data-notion-json="key"]`, `[data-notion-roi]`, `[data-notion-bg]` and rewrites with cheerio. Donut score is preserved (only `data-count-to` is updated — the animation runs from 0).

---

## 3. Design tokens

### 3.1 Typography

| Variable | Stack | Used for |
|---|---|---|
| `--ff-display` | `'Cormorant Garamond', 'Times New Roman', serif` | Hero name, statement, section eyebrows, prose feature, watermark, KPI values, gallery captions |
| `--ff-body` | `'Inter', system-ui, sans-serif` | Body prose, facts, financial cards, pros/cons items |
| `--ff-mono` | `'JetBrains Mono', 'SF Mono', monospace` | Eyebrows, labels, dates, property ID, ROI sliders, footer columns |

### 3.2 Brand accents (shared, both themes)

| Variable | Value | Used for |
|---|---|---|
| `--orange` | `#d97c44` | Primary CTA, accent eyebrow ("Định Vị NAC"), trail-id |
| `--orange-2` | `#ed8a52` | CTA hover |
| `--gold` | `#c4922c` | Hero KPI accent (now reserved for premium markers), gallery eye, footer title, mobile disclaimer |
| `--gold-2` | `#e8bf72` | Hero eyebrow pill, gold gradient ends |

> **Note:** Hero KPIs (Giá Vào / Lợi Suất) use **green** — see §6.2.

### 3.3 Light theme (`data-theme="light"`)

| Token | Value | Notes |
|---|---|---|
| `--bg` | `#fafaf7` | Page background — warm cream, not pure white |
| `--surface` | `#ffffff` | Cards, financial-card, cert box |
| `--surface-2` | `#f5f3ee` | Sign-off background, toggle background |
| `--text` | `#14181f` | Body copy |
| `--display` | `#0f1a36` | Headlines (deep navy, never black) |
| `--muted` | `#6b7280` | Metadata, eyebrow labels, deactivated toggle |
| `--line` | `rgba(15,26,54,.08)` | Hairlines |
| `--line-2` | `rgba(15,26,54,.14)` | Card borders, divider strokes |
| `--shadow-sm` | `0 1px 2px rgba(15,26,54,.04)` | Card resting |
| `--shadow` | `0 4px 16px rgba(15,26,54,.06)` | Card hover |
| `--shadow-lg` | `0 24px 60px rgba(15,26,54,.12)` | Hero veil |
| `--hdr-bg` | `rgba(250,250,247,.85)` | Sticky header backdrop |
| `--signoff-bg` | `linear-gradient(180deg, #f5f3ee, #fafaf7)` | Sign-off section |

**Vibe:** parchment + ink-navy. Editorial daylight. Hero veil softer.

### 3.4 Dark theme (`data-theme="dark"`)

| Token | Value | Notes |
|---|---|---|
| `--bg` | `#07091a` | Deep navy-black |
| `--surface` | `#0e1530` | Cards |
| `--surface-2` | `#131c3d` | Sign-off background, secondary surfaces |
| `--text` | `#d8d2c5` | Body copy — warm bone, never pure white |
| `--display` | `#ede8dc` | Headlines |
| `--muted` | `#8a92a5` | Metadata |
| `--line` | `rgba(232,191,114,.10)` | Gold-tinted hairlines |
| `--line-2` | `rgba(232,191,114,.20)` | Card borders |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.4)` | Card resting |
| `--shadow` | `0 8px 24px rgba(0,0,0,.4)` | Card hover |
| `--shadow-lg` | `0 24px 80px rgba(0,0,0,.6)` | Hero veil |
| `--hdr-bg` | `rgba(7,9,26,.78)` | Sticky header backdrop |
| `--signoff-bg` | `linear-gradient(180deg, #131c3d, #07091a)` | Sign-off section |

**Vibe:** midnight library. Gold-leafed accents glow against navy. Hero veil deeper.

### 3.5 Theme-only logos

`.nac-logo-light` (color icon, for light theme) and `.nac-logo-dark` (white icon, for dark theme) are both rendered and the inactive one is `display:none`d per `data-theme`. Header + footer logos share this pattern.

---

## 4. Bilingual mechanics

| Mechanism | Implementation |
|---|---|
| Root attribute | `<div class="nac-pdp" data-lang="vi">` |
| Visibility CSS | `.nac-pdp[data-lang="vi"] [data-en] { display:none }` and the inverse |
| Toggle UI | Header `[data-lang-set]` buttons; mirrored in sticky settings pill |
| Persistence | Not persisted across sessions — initial state is `vi` |
| Notion fields | Most prose keys are doubled: `desc_vi` / `desc_en`, `tagline_vi` / `tagline_en`, `nac_note_vi` / `nac_note_en`, `market_vi` / `market_en` |

**Rule:** every user-facing string lives inside `<span data-vi>` and `<span data-en>`. Mono labels that read the same in both languages (e.g. "USD", "NAC-4") can stay single-string.

---

## 5. Viewport / breakpoint matrix

| Breakpoint | Trigger | What changes |
|---|---|---|
| `(max-width: 980px)` | Tablet / small desktop | Header collapses (date + secondary CTA hide); statement padding shrinks (`8rem → 4rem`) |
| `(max-width: 900px)` | **Mobile boundary** | Spine grid collapses `1fr 140px 1fr → 1fr`. `data-side` left/right/both all stack into a single column with `padding-left:38px` (room for spine line + dot). Marker switches from vertical (dot/num/label stacked) to horizontal (dot floats absolute on spine line, num + label inline). |
| `(max-width: 680px)` | **Phone-only polish** | Body prose hidden (see §6.1). Donut stack-layout fixes. Cinematic gallery disabled (becomes scroll-stack frames). Sticky pills compact paddings. Facts stack key-over-val. Sign-off side padding tightens. Mobile disclaimer appears. |

> **Hard rule (from CLAUDE.md):** never change `data-side` to fix a mobile issue. `data-side` controls desktop only — mobile collapse is automatic at 900px.

---

## 6. Layout systems

### 6.1 Mobile-pristine prose rule

On phones (`≤680px`), the following classes collapse to `display:none`:

```
.nac-prose            §01 description, §03 market narrative
.nac-prose--feature   §06 brand intro line
.nac-assess-body      §10 NAC note
.nac-cert-txt         §11 IMC compliance text
```

In their place, a single italic-gold note appears at the end of `.nac-stmt` (the opening statement section):

> *** Đọc bản đầy đủ trên trình duyệt máy tính. / ** Read the full editorial on desktop.*

Quotes (`.nac-stmt-text`) are explicitly preserved on mobile.

### 6.2 Spine grid (`.nac-spine-section`)

| Viewport | `grid-template-columns` | `data-side` behaviour |
|---|---|---|
| ≥901px | `1fr 140px 1fr` | `left` → col 1 · `right` → col 3 · `full` → cols 1–3 (max 900px centered) · `both` → `.nac-spine-left` in col 1 + `.nac-spine-right` in col 3 |
| ≤900px | `1fr` (single) | all `data-side` values stack in col 1; `.nac-spine-left` + `.nac-spine-right` collapse vertically; left padding 38px to clear spine line |

The vertical `.nac-spine-line` runs through the centre column (desktop) and along the left edge at `left:14px` (mobile).

### 6.3 Hero KPI semantics

| Card variant | Light theme | Dark theme | Used for |
|---|---|---|---|
| Default (`.nac-stat`) | white/transparent + cream text | white-10% backdrop on glass | IRR · Cash-on-Cash · Payback |
| Hero green (`.nac-stat-hero`) | bg `rgba(30,122,74,.25)` · border `rgba(167,230,192,.4)` · val `#5fd391` | same — both themes | **Giá Vào · Lợi Suất** (entry price + yield — the two "value" KPIs) |

Green matches the `.nac-chip-live` ("Đang Live") palette so the bottom-left stats read as "value", not "luxury accent".

---

## 7. Section catalogue

Order top-to-bottom. Each row: what shows / desktop layout / mobile diff / theme nuance / Notion fields.

### Header (`.nac-hdr`)

| Aspect | Detail |
|---|---|
| Anatomy | left col: logo + date · centre: watermark `THE / NAC / Property Hub` · right: theme toggle + lang toggle + WhatsApp CTA |
| Desktop | 3-col grid, max-width 1320px, padding 0.7rem 2rem |
| Mobile (≤980) | Date + CTA hide; logo, watermark, toggles only |
| Light | Cream backdrop `rgba(250,250,247,.85)`, blur 20px |
| Dark | Navy backdrop `rgba(7,9,26,.78)` |
| Notion fields | `property_id` (trail-id) |
| Click targets | Logo → Nomad home · Watermark → Property Hub page (see NAC-BACKLINKS) |

### Hero (`.nac-hero` · `#nac-hero`)

| Aspect | Detail |
|---|---|
| Anatomy | Full-bleed background image · eyebrow (flag · district · property type pill · live chip) · `data-vi/-en` headline · tagline · 5-card stats row · scroll-cue |
| Desktop | Stats left-aligned, hero veil bottom-up gradient |
| Mobile (≤680) | Stats wrap centred; padding `0 1.25rem 4rem` |
| Light | Veil ramp `rgba(15,26,54,0)→…→.92` (navy ink) |
| Dark | Veil ramp `rgba(0,0,0,0)→…→.92` (black) |
| Notion | `country`, `district`, `hub_type`, `tagline_vi/en`, `price_short`, `yield_pct`, `irr_pct`, `coc_pct`, `payback` |
| Special | `.nac-stat-hero` (Giá Vào, Lợi Suất) = green; rest = transparent white |
| Animation | Eyebrow / name / tag / stats fade-in staggered via `.nac-anim --d:0.45s…0.75s` |

### Statement (`.nac-stmt` · `#nac-statement`)

| Aspect | Detail |
|---|---|
| Anatomy | Centred · orange eyebrow ("Định Vị NAC / NAC Positioning") · scroll-faded display-serif quote · **mobile-only disclaimer at end** |
| Desktop | `padding:8rem 2rem`, max-width 1100px, quote max-width 28ch |
| Mobile (≤980) | `padding:4rem 1.25rem` |
| Light/Dark | Quote uses `var(--display)`; highlighted brackets use `var(--gold)` |
| Quote source | `data-stmt` attribute on each `<p>` — JS splits to per-word spans that fade in on scroll; `[text]` brackets become gold/italic |
| Disclaimer | `.nac-spine-mobile-note` — italic-gold, only visible at `≤680px`, sits below the quote |

### Sticky mini-spine nav (`.nac-mini`)

| Aspect | Detail |
|---|---|
| Anatomy | Vertical pip column at `right:1.25rem; top:50%` · 10 buttons (§01–§10) · each pip shows number; expands on hover with section label |
| Visibility | Hidden until scrolled past hero (`.visible` toggled by `updateMini()`) |
| Desktop | Always shown after hero |
| Mobile (≤680) | `bottom:4.5rem` (above the CTA pill); shrinks slightly |
| Light | `rgba(255,255,255,.78)` blur backdrop, gold active dot |
| Dark | `rgba(7,9,26,.78)` blur backdrop, gold active dot |
| Sync | IntersectionObserver flags whichever section is in view; pip flips `.active` |

### §01 Overview (`#nac-overview`, `data-side="left"`)

| Aspect | Detail |
|---|---|
| Content | `.nac-prose` description (hidden mobile) + `.nac-facts` (6 rows: Type / Location / Brand / Ownership / Residency / Completion) |
| Desktop | Prose in col 1, max-width 60ch · facts as `28px / 160px / 1fr` grid (icon / key / value) |
| Mobile (≤680) | Prose hidden · each fact stacks: icon spans both rows, eyebrow key on top, value below at .95rem |
| Notion | `desc_vi`, `desc_en` |

### §02 Financials (`#nac-financials`, `data-side="right"`)

| Aspect | Detail |
|---|---|
| Content | 8-card grid (Entry / m² / Yield / IRR / Cash-on-Cash / Rent/Mo / Payback / Currency) + Yield Benchmark bars (this property vs SEA Branded Avg / Vietnam Condo / US Bond 10Y) |
| Desktop | Cards 2-col, hi cards have gold-tinted gradient `rgba(196,146,60,.08) → transparent` |
| Mobile (≤680) | Cards stay 2-col but tighter padding · benchmark bars stack labels above tracks |
| Light/Dark | Hi-card border `rgba(196,146,60,.25)`; bench bar fill is gold gradient |
| Notion | `price_full`, `yield_pct_unit`, `irr_pct_unit`, `coc_pct_unit`, `monthly_rent`, `payback` |

### §03 Market (`#nac-market`, `data-side="left"`)

| Aspect | Detail |
|---|---|
| Content | `.nac-prose` market narrative (hidden mobile) + `.nac-facts.nac-facts--tight` (4 rows: Beach / Airport / Key Markets / Property YoY) |
| Tight variant | `padding:.7rem 0` per fact (vs 1rem) |
| Mobile | Same stack treatment as §01 facts |
| Notion | `market_vi`, `market_en` |

### §04 Cinematic Gallery (`.nac-cine` · `#nac-gallery`)

| Aspect | Detail |
|---|---|
| Content | 3 frames (article elements), each with caption + 60vh image |
| Desktop | Editorial scroll-stack — caption-then-image flow, full-bleed images |
| Mobile (≤680) | Same scroll-stack but caption padding tightens (`2rem 1.25rem`), images at 55vh |
| Light/Dark | Caption text always `#fff` over image; gallery eye is gold |
| **Note** | The old 500vh sticky-scroll cinematic was retired (unreliable on iOS Safari). Replaced with a pure scroll-stack — works identically on all viewports |

### §05 NAC Analysis (`#nac-analysis`, `data-side="full"`)

| Aspect | Detail |
|---|---|
| Content | SVG donut chart (6 segments: Brand / Yield / Location / Management / Liquidity / Risk) + composite score 81/100 at centre + legible list below |
| Desktop | Donut on left of wrap, hover-popup shows grade for hovered segment |
| Mobile (≤680) | Donut is sibling of `.nac-donut-list` (NOT nested in wrap), so they render stacked, not side-by-side. Hover popup disabled |
| Light/Dark | Each segment uses its own colour; track ring is `var(--line)` |
| Notion | Donut score: only `data-count-to` is patched (preserves count-up animation); `sub_scores` JSON drives segments |

### §06 Features (`#nac-features`, `data-side="both"`)

| Aspect | Detail |
|---|---|
| Content | Left: `.nac-feats` grid of 6 amenity cards (icon + bilingual text). Right: `.nac-prose--feature` brand context paragraph |
| Desktop | Two-column split (features left, brand right) |
| Mobile (≤680) | Brand prose hidden · feats stack full-width below marker |
| Notion | `features` (list of items) |

### §07 Process (`#nac-process`, `data-side="left"`)

| Aspect | Detail |
|---|---|
| Content | 5 numbered process steps |
| Desktop | Steps left-aligned, gold step numbers |
| Mobile (≤680) | Tighter step gap (1rem), smaller dots (36px), padding-bottom 1.25rem |
| Notion | `process` (list) |

### §08 Pros / Cons (`#nac-proscons`, `data-side="both"`)

| Aspect | Detail |
|---|---|
| Content | Two blocks side-by-side — `+` pros (6 items) left, `−` cons (4 items) right |
| Desktop | Two-column with light-tinted backgrounds |
| Mobile (≤680) | Stack — pros above, cons below; padding `1.25rem 1.1rem` |
| Light | Pros bg `rgba(95,211,145,.06)`, cons bg `rgba(217,124,68,.06)` |
| Dark | Pros bg `rgba(95,211,145,.08)`, cons bg `rgba(217,124,68,.10)` |
| Notion | `pros`, `cons` (lists) |

### §09 ROI Simulator (`.nac-roi` · `#nac-roi`, `data-side="both"`)

| Aspect | Detail |
|---|---|
| Content | Left: 4 sliders (Hold Years / LTV / Mortgage Rate / Annual Appreciation) + 4 result cards (Total Return / Cash-on-Cash / IRR / Annualized). Right: So Sánh — comparison bars vs S&P 500, Vàng, VN-Index, Asia REIT |
| Desktop | Two-col split, inputs left, comparison right |
| Mobile (≤680) | Stacks; compare bars get extra `margin-top:2rem`; bar labels ellipsize if too long |
| Light/Dark | Slider track gradient orange→gold; this-property bar highlighted gold |
| Notion | `data-notion-roi` on the section root (provides `data-price`, `data-yield`, `data-rent` attributes via cheerio patching) |
| Recalc | Runs on every slider input; redraws bars on lang toggle |

### §10 Assessment (`#nac-assessment`, `data-side="full"`)

| Aspect | Detail |
|---|---|
| Content | Composite score `81/100` + grade (`★★★★ Xuất Sắc / Excellent`) + meta line · `.nac-assess-body` analyst note (hidden mobile) |
| Desktop | Score 4.5rem left, body underneath |
| Mobile (≤680) | Score 2.6rem, top section wraps, body hidden, no margin-bottom |
| Light | Card bg `var(--surface)`, score `var(--gold)` |
| Dark | Card bg `var(--surface)`, score `var(--gold-2)` |
| Notion | `nac_score`, `nac_note_vi`, `nac_note_en` |
| **Removed** | The three CTA pills (Property Hub / NAC Index / Compare) were removed — those destinations live in the sticky CTA + footer; duplicate noise here |

### §11 Sign-off / Certification (`.nac-signoff`)

| Aspect | Detail |
|---|---|
| Content | NAC × IMC dual-logo seal · "Chứng Nhận NAC" eyebrow · title · `.nac-cert-txt` IMC compliance copy (hidden mobile) · 4 meta tags (IMC version / Partner / Property ID / Status) |
| Desktop | 2-col grid (seal left, body right), `padding:2.5rem`, gap 2.5rem |
| Mobile (≤680) | Stack (single col), `padding:2rem 1.4rem`, gap 1.75rem, outer signoff side padding `.85rem` (gives cert ~24px more horizontal room) |
| Light | Cert card bg `#fff`, logos color icon |
| Dark | Cert card bg `#0e1530`, logos white version |
| Notion | `property_id` (used in both trail and cert tag) |

### Footer (`.nac-foot`)

Full spec in [`NAC-FOOTER.md`](./NAC-FOOTER.md). Summary:

| Aspect | Detail |
|---|---|
| Anatomy | Brand row (logo → Nomad home, eyebrow "The Property Hub · 2026") · big gold title ("NAC Property Listings" → Property Hub) · wave SVG · tagline · contact line · 5 social icons · 3-col nav (NAC PAGES / NAC TOOLS / CONTACT) · copyright row |
| Desktop | 3-col footer cols layout |
| Mobile (≤680) | Cols stack; social icons remain horizontal |
| Light/Dark | Title and wave both `var(--gold)`; social icons use `cdn.simpleicons.org/{slug}/ffffff` so they invert correctly per theme via filter |

### Sticky pills — CTA + Settings

Full spec in [`NAC-STICKY-PILLS.md`](./NAC-STICKY-PILLS.md). Summary:

| Pill | Position | Default | Expanded | Sync |
|---|---|---|---|---|
| `.nac-tools` (CTA) | bottom-centre | icon-only (WhatsApp / NAC Index / Blog) | hover desktop · tap mobile · icon + label | — |
| `.nac-settings` (Display) | top-right | active button per group (e.g. `☀ VI`) | hover desktop · tap mobile · all 4 buttons | shares `[data-theme-set]` / `[data-lang-set]` with header toggles |

Both pills are collapsed-by-default, expand on hover/tap with capture-phase JS to prevent accidental setting changes on first tap.

---

## 8. Interactions

| Behaviour | Implementation |
|---|---|
| Scroll progress | `<div class="nac-prog-fill">` width = `scroll / max * 100%` |
| Section reveal | IntersectionObserver toggles `.in-view` on `.reveal` and `.nac-spine-content` / `.nac-spine-left` / `.nac-spine-right` — fades + translates them in |
| Mini-spine sync | IntersectionObserver flags active section; `.nac-mini button.active` lights the gold dot |
| Count-up KPIs | Elements with `data-count-to="N"` animate from 0 to N over 1.2s when revealed |
| Statement scroll-words | `.nac-stmt-text` paragraph splits its `data-stmt` into per-word spans; scroll position drives `.visible` and `.hl` (gold/italic for `[bracketed]` words) |
| Donut hover (desktop) | Hovering a segment expands it (`stroke-width` bump) and shows a popup with score + grade |
| Donut count (anywhere) | Score 0 → N animation on reveal |
| ROI recalc | Every slider input triggers `recalc()` → updates 4 result cards + redraws benchmark bars |
| Sticky pill tap | `wireCollapsePill()` — touch only; first tap opens, outside-tap closes, capture-phase prevents data-theme-set/lang-set leak |
| Hero veil + light/dark | Veil gradient stops change per theme; logos swap via `.nac-logo-light` / `.nac-logo-dark` |

---

## 9. Notion sync hooks

| Attribute | Target | Patched by `sync-notion.mjs` as |
|---|---|---|
| `data-notion="key"` | Single text node | `.html()` replace from Notion property `key` |
| `data-notion-list="key"` | Container | `.html()` replaces children — full list (features, process, pros, cons, donut_rows) |
| `data-notion-json="key"` | `<script type="application/json">` | Inner text replaced with JSON string |
| `data-notion-roi` | `.nac-roi` section | Adds `data-price` / `data-yield` / `data-rent` from Notion fields |
| `data-notion-bg` | Hero / cine images | `style="background-image:url(…)"` patched |
| `.nac-donut-score` | Special | Only `data-count-to` updated, inner text untouched (preserves count-up) |

**Filter:** only properties with `Hub Status = Live` are synced. Cron runs every 10 minutes via `.github/workflows/sync-notion.yml`. Source DB: `35848ec25e86803283acc7ad989649c9`.

---

## 10. Mobile vs Desktop · summary matrix

| Area | Desktop (≥901px) | Mobile (≤680px) |
|---|---|---|
| **Layout** | Spine 3-col grid `1fr 140px 1fr` | Single column, 38px left padding |
| **Spine marker** | Vertical: dot + num + label stacked in centre col | Horizontal: dot absolute on spine line, num + label inline |
| **Body prose** | Full editorial visible | Hidden — replaced by italic-gold disclaimer in statement section |
| **Hero stats** | Left-aligned row | Centred, wraps |
| **Gallery** | Scroll-stack frames, 60vh images | Scroll-stack, 55vh images, tighter caption padding |
| **Donut** | SVG + hover popup + list | SVG (no popup) + list, both stacked vertically |
| **Sections w/ data-side="both"** | Left + right columns | Stacked, left first |
| **CTA pill** | Hover to expand | Tap to expand |
| **Settings pill** | Hover to expand | Tap to expand |
| **Mini-spine nav** | Right edge, expands on hover | Right edge, smaller pips, bottom raised to clear CTA pill |
| **Header** | Logo + date + watermark + toggles + CTA | Logo + watermark + toggles (date + CTA hide ≤980) |
| **Footer cols** | 3 cols side-by-side | Stacked |
| **§01/§03 facts** | Single-row `icon / key / val` grid | Stacked: icon spans 2 rows, key eyebrow on top, val below |
| **§10 Assessment links** | (removed for both views) | (removed for both views) |
| **§11 Cert** | 2-col seal + body, `padding:2.5rem` | Stacked, `padding:2rem 1.4rem`, more outer breath |

---

## 11. Light vs Dark · summary matrix

| Surface | Light | Dark |
|---|---|---|
| **Page background** | Cream `#fafaf7` | Deep navy `#07091a` |
| **Cards / surfaces** | White `#fff` | Navy `#0e1530` |
| **Body copy** | Charcoal `#14181f` | Bone `#d8d2c5` |
| **Headlines** | Deep navy `#0f1a36` | Bone-white `#ede8dc` |
| **Hairlines** | Navy 8% | Gold 10% |
| **Hero veil** | Navy ramp → 92% navy at bottom | Black ramp → 92% black at bottom |
| **Header backdrop** | Cream 85% + 20px blur | Navy 78% + 20px blur |
| **CTA pill (sticky bottom)** | Cream `rgba(255,255,255,.96)` + navy border + WA `#1eb955` / Index `#c4922c` | Charcoal `rgba(12,12,16,.97)` + white-12 border + WA `#25D366` / Index `#f5d07a` |
| **Settings pill** | Same cream/navy as CTA, active `#c4922c` gold | Same charcoal as CTA, active `#f5d07a` gold |
| **Mini-spine** | Cream blur 78% | Navy blur 78% |
| **Sign-off bg** | Cream-2 → cream gradient | Navy-2 → navy gradient |
| **Cert card** | White | Navy `#0e1530` |
| **Pros/Cons blocks** | Pros green 6% / Cons orange 6% | Pros green 8% / Cons orange 10% |
| **Hero KPI (Giá Vào / Lợi Suất)** | Green `rgba(30,122,74,.25)` bg, val `#5fd391` — same both themes | same |
| **Logos** | Color-icon variants visible | White-icon variants visible |
| **Social icons (footer)** | CDN white SVGs, no inversion | CDN white SVGs, no inversion |

---

## 12. Browser & cache gotchas

| Issue | Mitigation |
|---|---|
| iOS Safari 500vh sticky scroll unreliable | Replaced with scroll-stack `<article>` frames in §04 |
| `backdrop-filter` on `.nac-tools` glitches on older Android | `-webkit-backdrop-filter` fallback included |
| GitHub Pages caches HTML for 600s | Hard-refresh (`⌘+Shift+R`) to bypass; or wait ~10min |
| Notion sync race with donut animation | Sync never writes to `.nac-donut-score` inner text, only `data-count-to` |
| iOS double-tap zoom on pills | `touch-action:manipulation` on `.nac-tool` and `.nac-settings button` |
| Sticky settings + capture-phase | `wireCollapsePill` uses `addEventListener(…, true)` with `stopPropagation` so a tap to open doesn't also fire the data-theme-set/lang-set handler |

---

## 13. Adding a new PDP

1. **Copy** `properties/nobu-da-nang.html` → `properties/<slug>.html`.
2. **Replace** copy strings (Vietnamese + English) — leave structure alone.
3. **Swap** hero background image, gallery image URLs, donut sub_scores JSON.
4. **Update** Notion fields in the source DB so sync can find the matching `property_id`.
5. **Confirm** the property has `Hub Status = Live`.
6. **Test** locally on desktop AND mobile (DevTools at 1440 + 375) AND in both themes BEFORE shipping. (CLAUDE.md gotcha — easy to miss.)
7. **Commit** on `claude/<slug>-qarsn`, open PR, squash-merge, reset to main, delete branch.

That's the full template loop.

---

## 14. Open questions / future work

- **Calendly wiring** — `https://calendly.com/ray-vtt/30min` is in the backlinks but not currently bound to a button. Reserved for a future "Book a call" flow.
- **Per-PDP theme defaults** — every PDP currently boots `data-theme="light"`. Could be Notion-driven (e.g. "dark by default" for night-mode-vibe properties).
- **Mobile prose alternative** — current state hides prose entirely. Future: an optional `data-mobile-prose="show"` per PDP if certain properties need the narrative on phones.
- **ROI persistence** — slider values reset on reload. Could persist in `localStorage` per property.

---

_Last updated: this commit. If something here drifts from `properties/nobu-da-nang.html`, the code wins — update this doc to match._
