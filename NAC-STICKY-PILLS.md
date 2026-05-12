# NAC Sticky Pills — Design Template

Reusable design template for the two sticky floating pills used across NAC PDPs:

1. **`.nac-tools`** — bottom-center CTA pill (WhatsApp, NAC Index, Blog)
2. **`.nac-settings`** — top-right settings pill (Theme + Language toggles)

Both share the same design DNA: collapsed-by-default, expand on hover (desktop) / tap (mobile), theme-aware backgrounds (dark in dark mode, cream in light mode), smooth `cubic-bezier(.4, .0, .2, 1)` transitions.

---

## 1. CTA Pill (`.nac-tools`)

### Behavior
- **Position:** `fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);` (mobile: `bottom:.85rem`)
- **Collapsed default:** icon-only (~36px wide per button)
- **Expanded (hover desktop / tap mobile):** icon + label, slides + fades in
- **Tap-outside on mobile:** collapses back

### HTML
```html
<div class="nac-tools">
  <a href="https://wa.me/447388646000" target="_blank" rel="noreferrer"
     class="nac-tool nac-tool--wa" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><!-- WA glyph --></svg>
    <span class="nac-tool-txt">WhatsApp</span>
  </a>
  <a href="https://nomadassetcollective.com/" target="_blank" rel="noreferrer"
     class="nac-tool nac-tool--index" aria-label="NAC Index">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>
    </svg>
    <span class="nac-tool-txt">NAC Index</span>
  </a>
  <a href="https://blog.nomadassetcollective.com" target="_blank" rel="noreferrer"
     class="nac-tool" aria-label="Blog">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
    <span class="nac-tool-txt">Blog</span>
  </a>
</div>
```

### Color tokens
| Element                | Dark theme           | Light theme          |
|------------------------|----------------------|----------------------|
| Pill background        | `rgba(12,12,16,.97)` | `rgba(255,255,255,.96)` |
| Pill border            | `rgba(255,255,255,.12)` | `rgba(15,26,54,.10)` |
| Base button text       | `#f4efdf` (cream)    | `#14181f` (charcoal) |
| WhatsApp text          | `#25D366`            | `#1eb955`            |
| WhatsApp hover         | `#3ee87b` / `rgba(37,211,102,.18)` bg | `#138a3e` / `rgba(30,185,85,.12)` bg |
| NAC Index text         | `#f5d07a` (gold)     | `#c4922c` (gold)     |
| NAC Index hover        | `#ffe49a` / `rgba(232,191,114,.18)` bg | `#9a701f` / `rgba(196,146,60,.14)` bg |
| Glow ring (shadow)     | `0 0 60px rgba(196,146,60,.18)` | same gold glow |

---

## 2. Settings Pill (`.nac-settings`)

### Behavior
- **Position:** `fixed; top:1rem; right:1rem;`
- **Visibility:** hidden until scrolled past hero (`.visible` class toggled by `updateMini()`); fades + slides down
- **Collapsed default:** shows ONLY the active button per group (active theme icon + active lang code, e.g. `☀ VI`)
- **Expanded:** all 4 buttons visible with a separator between the two groups
- **State sync:** uses the same `[data-theme-set]` / `[data-lang-set]` selectors as the header toggles — single source of truth, no duplicate JS

### HTML
```html
<div class="nac-settings" aria-label="Display settings">
  <div class="nac-settings-grp nac-settings-theme">
    <button data-theme-set="light" aria-label="Light" class="on">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    </button>
    <button data-theme-set="dark" aria-label="Dark">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
      </svg>
    </button>
  </div>
  <span class="nac-settings-sep"></span>
  <div class="nac-settings-grp nac-settings-lang">
    <button data-lang-set="vi" class="on">VI</button>
    <button data-lang-set="en">EN</button>
  </div>
</div>
```

### Color tokens
| Element            | Dark theme           | Light theme          |
|--------------------|----------------------|----------------------|
| Pill background    | `rgba(12,12,16,.97)` | `rgba(255,255,255,.96)` |
| Idle button text   | `#9ea1a8`            | `#6b7280`            |
| Active (`.on`)     | `#f5d07a`            | `#c4922c`            |
| Hover              | `#f5d07a`            | `#c4922c`            |
| Separator (`-sep`) | `currentColor` @ 22% opacity | same |

---

## 3. Shared Tap-to-Expand JS (touch only)

Lives at the bottom of the main `<script>` block. Reusable wire-up function:

```js
var isTouch = window.matchMedia('(hover: none)').matches;
function wireCollapsePill(el) {
  if (!el || !isTouch) return;
  el.addEventListener('click', function(e){
    if (!el.classList.contains('is-open')) {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add('is-open');
    }
  }, true);  // capture phase — beats data-theme-set/lang-set handlers
  document.addEventListener('click', function(e){
    if (!el.contains(e.target)) el.classList.remove('is-open');
  });
}
wireCollapsePill(document.querySelector('.nac-tools'));
wireCollapsePill(document.querySelector('.nac-settings'));
```

**Why capture phase?** Settings pill buttons have global `[data-theme-set]` / `[data-lang-set]` click handlers. Without capture-phase `stopPropagation`, a single collapsed tap would both open AND change the setting.

---

## 4. Visibility scroll hook (settings pill only)

The settings pill is added to the existing `updateMini()` function so it shares the same hero-past trigger as the mini-spine nav:

```js
var stickySettings = document.querySelector('.nac-settings');
function updateMini() {
  if (!heroEl) return;
  var heroBottom = heroEl.getBoundingClientRect().bottom;
  var pastHero = heroBottom < 100;
  if (miniNav) miniNav.classList.toggle('visible', pastHero);
  if (stickySettings) stickySettings.classList.toggle('visible', pastHero);
}
```

---

## 5. Shared transition recipe

All collapse/expand transitions use:
- **Timing function:** `cubic-bezier(.4, .0, .2, 1)` — Material-style "standard easing"
- **Durations:** `.28s` for layout (max-width, padding, gap, transform); `.22s` for opacity
- **Properties animated:** `max-width`, `opacity`, `transform`, `padding`, `gap`, `color`, `background`

---

## 6. Mobile breakpoint (`max-width:680px`)

- `.nac-tools` — `padding:.4rem; gap:.2rem; bottom:.85rem;`
- `.nac-tool` — `padding:.45rem .55rem; font-size:.7rem;`
- `.nac-tools.is-open .nac-tool` — `padding:.45rem .8rem;`
- `.nac-tools.is-open .nac-tool-txt` — `max-width:100px;`
- `.nac-settings` — `top:.7rem; right:.7rem; padding:.3rem .4rem; gap:.25rem;`
- `.nac-settings button` — `padding:.3rem .4rem; font-size:.68rem;`

---

## 7. To re-apply on a new PDP

1. Paste the two HTML blocks (CTA + settings) just before `</div>` (root `.nac-pdp` close).
2. Paste the CSS blocks (sections 1 & 2 above) into the `<style>` block.
3. Wire the JS (sections 3 & 4) into the existing IIFE that handles theme/lang toggles. The `wireCollapsePill` helper handles both pills via a single call each.
4. Ensure the host page has:
   - `data-theme="light|dark"` on `.nac-pdp` root
   - `[data-theme-set]` / `[data-lang-set]` click handlers already wired
   - A hero `#nac-hero` (or equivalent) for `updateMini()` to detect

That's it — both pills will appear, sticky and collapsed, syncing with the existing header toggles automatically.
