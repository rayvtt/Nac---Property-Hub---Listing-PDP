#!/usr/bin/env node
// Pushes each country program brochure (properties/<slug>.html) to its
// existing WordPress page via the ACF field "raw_html_code".
//
// Notion-free: the slug → WP URL mapping is hardcoded here (see NAC-BROCHURE-URLS.md).
// Auth: HTTP Basic with WP_USER + WP_APP_PASSWORD (same secrets as sync-wp.mjs).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROPERTIES_DIR = path.join(ROOT, 'properties');

const WP_BASE = (process.env.WP_BASE_URL || 'https://nomadassetcollective.com').replace(/\/$/, '');
const WP_API = `${WP_BASE}/wp-json/wp/v2`;
const WP_USER = process.env.WP_USER || 'admin_web';
const WP_PASS = process.env.WP_APP_PASSWORD;
const ACF_HTML_FIELD = process.env.WP_ACF_FIELD || 'raw_html_code';
const ONLY_SLUG = process.env.ONLY_SLUG || null;

if (!WP_PASS) { console.error('WP_APP_PASSWORD env var is required'); process.exit(1); }

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// ─── Brochure slug → WP page URL mapping ────────────────────────────────────
// Source of truth: NAC-BROCHURE-URLS.md
const BROCHURES = [
  { slug: 'turkey-cbi',           url: 'https://nomadassetcollective.com/brochures/chuong-trinh-tho-nhi-ky-cbi-citizenship-by-investment/' },
  { slug: 'cyprus-rbi',           url: 'https://nomadassetcollective.com/brochures/chuong-trinh-dao-sip-rbi-residence-by-investment/' },
  { slug: 'greece-golden-visa',   url: 'https://nomadassetcollective.com/brochures/residences-chuong-trinh-hy-lap-golden-visa/' },
  { slug: 'malaysia-mm2h',        url: 'https://nomadassetcollective.com/brochures/chuong-trinh-malaysia-rbi-mm2h-dau-tu-quyen-cu-tru/' },
  { slug: 'malta-mprp',           url: 'https://nomadassetcollective.com/brochures/chuong-trinh-malta-thuong-tru-nhan-rbi/' },
  { slug: 'new-zealand-rbi',      url: 'https://nomadassetcollective.com/brochures/chuong-trinh-new-zealand-rbi-dau-tu-di-tru/' },
  { slug: 'panama-rbi',           url: 'https://nomadassetcollective.com/brochures/chuong-trinh-panama-rbi-quyen-cu-tru-vinh-vien/' },
  { slug: 'portugal-golden-visa', url: 'https://nomadassetcollective.com/brochures/chuong-trinh-bo-dao-nha-golden-visa/' },
  { slug: 'st-kitts-cbi',         url: 'https://nomadassetcollective.com/brochures/chuong-trinh-si-kitts-nevis-quoc-tich/' },
  { slug: 'thailand-ltr',         url: 'https://nomadassetcollective.com/brochures/chuong-trinh-thai-lan-cu-tru-dai-han-ltr-rbi/' },
  { slug: 'uae-golden-visa',      url: 'https://nomadassetcollective.com/brochures/chuong-trinh-uae-golden-visa-2/' },
  { slug: 'uk-innovator-visa',    url: 'https://nomadassetcollective.com/brochures/chuong-trinh-uk-thuong-tru-visa-dau-tu-rbi/' },
];

// ─── WP REST helpers ────────────────────────────────────────────────────────

async function wp(pathname, options = {}) {
  const res = await fetch(`${WP_API}${pathname}`, {
    ...options,
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WP ${options.method || 'GET'} ${pathname} → ${res.status} ${res.statusText}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

const normalizeUrl = (u) => String(u || '').replace(/\/+$/, '').toLowerCase();

async function findByUrl(pageUrl) {
  const parsed = new URL(pageUrl);
  const segments = parsed.pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1];
  const candidates = await wp(`/pages?slug=${encodeURIComponent(slug)}&per_page=20&status=publish,draft,private,future,pending`);
  if (!candidates.length) return null;
  const target = normalizeUrl(pageUrl);
  const exact = candidates.find(p => normalizeUrl(p.link) === target);
  if (exact) return exact;
  if (candidates.length === 1) return candidates[0];
  return null;
}

// ─── Sync one brochure ───────────────────────────────────────────────────────

async function syncOne({ slug, url }) {
  const file = path.join(PROPERTIES_DIR, `${slug}.html`);
  let html;
  try {
    html = await fs.readFile(file, 'utf-8');
  } catch {
    return { slug, skipped: `no HTML file at properties/${slug}.html` };
  }

  const page = await findByUrl(url);
  if (!page) {
    return { slug, error: `URL "${url}" did not match any WP page` };
  }

  await wp(`/pages/${page.id}`, {
    method: 'POST',
    body: JSON.stringify({ acf: { [ACF_HTML_FIELD]: html } }),
  });
  return { slug, pageId: page.id, link: page.link };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let brochures = BROCHURES;
  if (ONLY_SLUG) brochures = brochures.filter(b => b.slug === ONLY_SLUG);
  console.log(`Syncing ${brochures.length} brochure(s) to ${WP_BASE} as ${WP_USER}`);

  let ok = 0, fail = 0, skip = 0;
  const failures = [];
  for (const b of brochures) {
    try {
      const r = await syncOne(b);
      if (r.skipped) {
        console.log(`  ⤳ ${r.slug}: skipped (${r.skipped})`);
        skip++;
      } else if (r.error) {
        console.error(`  ✗ ${r.slug}: ${r.error}`);
        fail++;
        failures.push(r);
      } else {
        console.log(`  ✓ ${r.slug} → page ${r.pageId} (${r.link})`);
        ok++;
      }
    } catch (err) {
      console.error(`  ✗ ${b.slug}: ${err.message}`);
      fail++;
      failures.push({ slug: b.slug, error: err.message });
    }
  }
  console.log(`\nDone. ${ok} updated, ${skip} skipped, ${fail} failed.`);
  if (failures.length) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`  - ${f.slug}: ${f.error}`);
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
