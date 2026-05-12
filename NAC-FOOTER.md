# NAC Footer — Design Template

Reusable footer block used at the bottom of every NAC PDP. Mirrors the NAC Brochures footer aesthetic — bilingual gold title with a gradient wave underline, brand eyebrow, social row, 3-column nav, fine print.

---

## Structure

```
.nac-foot
├── .nac-foot-top          (logo + brand eyebrow, big title with wave, tagline)
├── .nac-foot-mid          (contact line + social icons)
├── .nac-foot-divider
├── .nac-foot-cols         (3-col nav: NAC PAGES · NAC TOOLS · CONTACT)
├── .nac-foot-bottom       (copyright · powered-by)
└── .nac-foot-fine         (legal disclaimer)
```

---

## 1. HTML

```html
<footer class="nac-foot">
  <div class="nac-foot-top">
    <div class="nac-foot-brand">
      <a href="https://nomadassetcollective.com" target="_blank" rel="noreferrer"
         class="nac-foot-logo-link" aria-label="Nomad Asset Collective">
        <img src="https://nomadassetcollective.com/wp-content/uploads/2026/05/OTG-Passport-Icons-4.png"
             alt="Nomad Asset Collective" class="nac-foot-logo nac-logo-light">
        <img src="https://nomadassetcollective.com/wp-content/uploads/2026/04/OTG-Passport-Icons-1.png"
             alt="Nomad Asset Collective" class="nac-foot-logo nac-logo-dark">
      </a>
      <span class="nac-foot-eyebrow">
        <span class="nac-foot-eb-mark">⌖</span>
        <span class="nac-foot-eb-txt">The Property Hub</span>
        <span class="nac-foot-eb-sep">·</span>
        <span class="nac-foot-eb-txt">2026</span>
      </span>
    </div>

    <div class="nac-foot-title-wrap">
      <h2 class="nac-foot-title">
        <a href="https://nomadassetcollective.com/property-hub-bat-dong-san/" target="_blank" rel="noreferrer"
           class="nac-foot-title-link">
          <span data-vi>NAC Danh Mục BĐS Chọn Lọc</span>
          <span data-en>NAC Property Listings</span>
        </a>
      </h2>
      <svg class="nac-foot-wave" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="foot-wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"    stop-color="#c4922c" stop-opacity="0"/>
            <stop offset="0.12" stop-color="#c4922c" stop-opacity="1"/>
            <stop offset="0.5"  stop-color="#d97c44" stop-opacity="1"/>
            <stop offset="0.88" stop-color="#c4922c" stop-opacity="1"/>
            <stop offset="1"    stop-color="#c4922c" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 3 Q 6.25 0 12.5 3 T 25 3 T 37.5 3 T 50 3 T 62.5 3 T 75 3 T 87.5 3 T 100 3"
              fill="none" stroke="url(#foot-wave-grad)" stroke-width="1.4" stroke-linecap="round"
              vector-effect="non-scaling-stroke"/>
      </svg>
    </div>

    <p class="nac-foot-tagline">
      <span data-vi>Một danh mục bất động sản chọn lọc, đặt nhà đầu tư Việt vào quỹ đạo toàn cầu.</span>
      <span data-en>A curated property catalogue, putting Vietnamese investors on a global trajectory.</span>
    </p>
  </div>

  <div class="nac-foot-mid">
    <p class="nac-foot-contact-line">
      <span data-vi>Liên lạc NAC qua emails, WhatsApp hoặc trực tiếp tại văn phòng Q1 &amp; Q2, TP.HCM nhé.</span>
      <span data-en>Reach NAC by email, WhatsApp, or in person at our Q1 &amp; Q2 offices in HCMC.</span>
    </p>
    <div class="nac-foot-social">
      <a href="https://www.facebook.com/profile.php?id=61582793351453" target="_blank" rel="noreferrer"
         class="nac-foot-social-link nac-fs-fb" aria-label="Facebook">
        <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="" aria-hidden="true">
      </a>
      <a href="https://instagram.com/nac.global" target="_blank" rel="noreferrer"
         class="nac-foot-social-link nac-fs-ig" aria-label="Instagram">
        <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="" aria-hidden="true">
      </a>
      <a href="https://threads.net/@nac.global" target="_blank" rel="noreferrer"
         class="nac-foot-social-link nac-fs-threads" aria-label="Threads">
        <img src="https://cdn.simpleicons.org/threads/ffffff" alt="" aria-hidden="true">
      </a>
      <a href="https://tiktok.com/@nomadassetcollective" target="_blank" rel="noreferrer"
         class="nac-foot-social-link nac-fs-tiktok" aria-label="TikTok">
        <img src="https://cdn.simpleicons.org/tiktok/ffffff" alt="" aria-hidden="true">
      </a>
      <a href="https://wa.me/447388646000" target="_blank" rel="noreferrer"
         class="nac-foot-social-link nac-fs-wa" aria-label="WhatsApp">
        <img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" aria-hidden="true">
      </a>
    </div>
  </div>

  <hr class="nac-foot-divider">

  <div class="nac-foot-cols">
    <div class="nac-foot-col">
      <h5 class="nac-foot-col-title">NAC PAGES</h5>
      <ul class="nac-foot-col-list">
        <li><a href="https://blog.nomadassetcollective.com" target="_blank" rel="noreferrer">Blog</a></li>
        <li><a href="https://nomadassetcollective.com/brochures" target="_blank" rel="noreferrer">Brochures</a></li>
        <li><a href="https://nomadassetcollective.com" target="_blank" rel="noreferrer">
          <span data-vi>Website Chính</span><span data-en>Main Website</span>
        </a></li>
      </ul>
    </div>
    <div class="nac-foot-col">
      <h5 class="nac-foot-col-title"><span data-vi>CÔNG CỤ NAC</span><span data-en>NAC TOOLS</span></h5>
      <ul class="nac-foot-col-list">
        <li><a href="https://nomadassetcollective.com/so-sanh" target="_blank" rel="noreferrer">
          <span data-vi>Công Cụ So Sánh</span><span data-en>Compare Tool</span>
        </a></li>
        <li><a href="https://nomadassetcollective.com/tu-van-nhanh" target="_blank" rel="noreferrer">
          <span data-vi>Công Cụ Tư Vấn</span><span data-en>Quick Consult</span>
        </a></li>
        <li><a href="https://nomadassetcollective.com/nac-residence-index/" target="_blank" rel="noreferrer">NAC Index</a></li>
      </ul>
    </div>
    <div class="nac-foot-col">
      <h5 class="nac-foot-col-title"><span data-vi>LIÊN HỆ</span><span data-en>CONTACT</span></h5>
      <ul class="nac-foot-col-list nac-foot-contact-list">
        <li><span class="nac-foot-ic">📍</span><span>Sonatus, 15B Lê Thánh Tôn, TP.HCM</span></li>
        <li><span class="nac-foot-ic">✉</span><a href="mailto:hello@nomadassetcollective.com">hello@nomadassetcollective.com</a></li>
        <li><span class="nac-foot-ic">📞</span><a href="tel:+84919199330">+84 919 199 330</a></li>
        <li><span class="nac-foot-ic">📞</span><a href="tel:+447388646000">+44 7388 646 000</a></li>
      </ul>
    </div>
  </div>

  <div class="nac-foot-bottom">
    <p class="nac-foot-copy">© 2026 Nomad Asset Collective · <span data-notion="property_id">NAC-X</span></p>
    <p class="nac-foot-power">
      <span data-vi>Vận hành bởi</span><span data-en>Powered by</span>
      <a href="https://nomadassetcollective.com" target="_blank" rel="noreferrer">NAC Global</a>
    </p>
  </div>

  <p class="nac-foot-fine">
    <span data-vi>Thông tin mang tính tham khảo. Không phải tư vấn tài chính hay pháp lý. Vui lòng xác nhận với đội ngũ NAC trước khi ra quyết định.</span>
    <span data-en>Information is indicative only. Not financial or legal advice. Please confirm with the NAC team before making any investment decision.</span>
  </p>
</footer>
```

---

## 2. CSS

```css
.nac-foot { padding:5rem 0 2.5rem; border-top:1px solid var(--line); margin-top:3rem; text-align:left; }

/* TOP — brand + bilingual title + wave + tagline */
.nac-foot-top { margin-bottom:2.5rem; }
.nac-foot-brand { display:flex; align-items:center; gap:1rem; margin-bottom:1.6rem; }
.nac-foot-logo-link { display:inline-flex; align-items:center; line-height:0; transition:transform .2s ease, filter .2s ease; }
.nac-foot-logo-link:hover { transform:translateY(-1px); filter:brightness(1.05); }
.nac-foot-logo { width:44px; height:44px; opacity:.92; display:block; flex-shrink:0; }
.nac-foot-eyebrow { display:inline-flex; align-items:center; gap:.55rem; font-family:var(--ff-mono); font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); font-weight:500; }
.nac-foot-eb-mark { font-size:.95rem; color:var(--gold); line-height:1; }
.nac-foot-eb-sep { opacity:.4; }
.nac-foot-title-wrap { width:fit-content; max-width:100%; margin-bottom:1.6rem; }
.nac-foot-title { font-family:var(--ff-display); font-size:clamp(2.4rem, 5.2vw, 3.6rem); font-weight:300; color:var(--display); margin:0; letter-spacing:-.015em; line-height:1.08; }
.nac-foot-title-link { color:inherit; text-decoration:none; transition:color .25s ease; }
.nac-foot-title-link:hover { color:var(--gold); }
.nac-foot-wave { width:100%; height:10px; display:block; margin-top:1rem; filter:drop-shadow(0 1px 4px rgba(196,146,60,.45)) drop-shadow(0 0 8px rgba(217,124,68,.22)); }
.nac-foot-tagline { font-family:var(--ff-display); font-style:italic; font-size:1.1rem; font-weight:300; color:var(--muted); margin:0; line-height:1.55; max-width:none; white-space:nowrap; }
@media (max-width:780px) { .nac-foot-tagline { white-space:normal; max-width:60ch; } }
@media (max-width:780px) {
  .nac-foot-brand { gap:.75rem; }
  .nac-foot-logo { width:38px; height:38px; }
  .nac-foot-eyebrow { font-size:.6rem; gap:.4rem; }
}

/* MID — contact line + social row */
.nac-foot-mid { display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2.5rem; }
.nac-foot-contact-line { font-size:.95rem; color:var(--text); margin:0; line-height:1.6; }
.nac-foot-social { display:flex; gap:.75rem; flex-wrap:wrap; }
.nac-foot-social-link { display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; transition:transform .2s ease, filter .2s ease; }
.nac-foot-social-link svg,
.nac-foot-social-link img { width:18px; height:18px; display:block; }
.nac-foot-social-link:hover { transform:translateY(-2px); filter:brightness(1.08); }
.nac-fs-fb      { background:#1877F2; color:#fff; }
.nac-fs-ig      { background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:#fff; }
.nac-fs-threads { background:#000;     color:#fff; }
.nac-fs-tiktok  { background:#000;     color:#fff; }
.nac-fs-wa      { background:#25D366;  color:#fff; }

/* DIVIDER + 3-COL NAV */
.nac-foot-divider { border:none; border-top:1px solid var(--line); margin:0 0 2.5rem; }
.nac-foot-cols { display:grid; grid-template-columns:1.2fr 1fr 1.4fr; gap:2.5rem; margin-bottom:2.5rem; }
.nac-foot-col-title { font-family:var(--ff-mono); font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:var(--display); font-weight:600; margin:0 0 1rem; }
.nac-foot-col-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.6rem; }
.nac-foot-col-list a { color:var(--text); text-decoration:none; font-size:.92rem; transition:color .15s ease; }
.nac-foot-col-list a:hover { color:var(--gold); }
.nac-foot-contact-list li { display:flex; gap:.6rem; align-items:flex-start; font-size:.92rem; color:var(--text); line-height:1.5; }
.nac-foot-ic { flex-shrink:0; width:18px; text-align:center; }

/* BOTTOM — copyright + powered-by */
.nac-foot-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:2rem; border-top:1px solid var(--line); font-size:.78rem; color:var(--muted); gap:1rem; flex-wrap:wrap; }
.nac-foot-copy, .nac-foot-power { margin:0; font-family:var(--ff-mono); letter-spacing:.04em; }
.nac-foot-power a { color:var(--gold); text-decoration:none; font-weight:600; }
.nac-foot-power a:hover { color:var(--orange); }
.nac-foot-fine { max-width:80ch; margin:1.5rem 0 0; font-size:.72rem; color:var(--muted); line-height:1.6; font-style:italic; font-family:var(--ff-body); }

@media (max-width:780px) {
  .nac-foot { padding:3rem 0 1.5rem; }
  .nac-foot-cols { grid-template-columns:1fr; gap:1.8rem; }
  .nac-foot-bottom { flex-direction:column; align-items:flex-start; }
}
```

---

## 3. Theme-aware logo swap

The footer uses two logos — one for light mode, one for dark. Pair these utility rules at the page root:

```css
.nac-pdp[data-theme="light"] .nac-logo-dark  { display:none; }
.nac-pdp[data-theme="dark"]  .nac-logo-light { display:none; }
```

Sources: see `NAC-BACKLINKS.md` (Brand Assets section)
- Dark logo  (for light bg): `OTG-Passport-Icons-4.png`
- White logo (for dark bg):  `OTG-Passport-Icons-1.png`

---

## 4. Wave underline notes

The gold→orange→gold gradient wave under the bilingual title:
- `viewBox="0 0 100 6"` with `preserveAspectRatio="none"` so the wave stretches to the title's text width
- `width:fit-content` on `.nac-foot-title-wrap` constrains the wave to the title's actual rendered width (not the column width)
- `vector-effect="non-scaling-stroke"` keeps the stroke 1.4px regardless of horizontal stretching
- `filter:drop-shadow(...)` adds a soft gold + orange glow

---

## 5. Social icons

Fetched from `cdn.simpleicons.org` (white variant on colored brand background):
- `https://cdn.simpleicons.org/<slug>/ffffff`
- Slugs: `facebook`, `instagram`, `threads`, `tiktok`, `whatsapp`
- Brand backgrounds are CSS class colors on `.nac-fs-{slug}`

To extend (e.g. LinkedIn, YouTube): add new `.nac-fs-<slug>` rule with brand bg color, drop in another `<a class="nac-foot-social-link nac-fs-<slug>">`.

---

## 6. Bilingual columns

The 3-col nav uses the same `data-vi` / `data-en` toggle pattern as the rest of the PDP. Column titles can be:
- **Single language** (e.g. `NAC PAGES`, `Blog`, `Brochures`) — same in both VI/EN
- **Bilingual** — wrap each label in `<span data-vi>...</span><span data-en>...</span>`

Mix freely. The toggle JS at the page level handles display.

---

## 7. To re-apply on a new PDP

1. Paste the HTML block (section 1) at the bottom of the page wrapper (before `.nac-pdp` close).
2. Paste the CSS block (section 2) into the `<style>` block.
3. Add the logo-swap utility rules (section 3) if not already present.
4. Update `data-notion="property_id"` in the copy line to the property's ID slot.
5. Replace `NAC-X` in the copyright line with the property's `NAC-#` ID if you want a static fallback.
6. Audit the URLs against `NAC-BACKLINKS.md` — they should all point to canonical destinations.

Done — the footer will render with the bilingual gold title, animated wave underline, 5-icon social row, and 3-col nav.
