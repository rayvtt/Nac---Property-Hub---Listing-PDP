#!/usr/bin/env node
// Pushes each properties/<slug>.html to its EXISTING WordPress page,
// writing the full HTML into the ACF field "raw_html_code".
//
// Page lookup (in order):
//   1. Notion field "Listing URL"   → parse slug, match WP page by slug + full URL
//   2. Notion field "Property ID"   → match WP page whose ACF "nac_property_id" equals NAC-N
//
// NEVER creates pages. If neither lookup finds a match, the run fails so a
// human can create the WP page or fix the Notion field.
//
// Auth: HTTP Basic with WP_USER + WP_APP_PASSWORD (Application Password).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@notionhq/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROPERTIES_DIR = path.join(ROOT, 'properties');

const WP_BASE = (process.env.WP_BASE_URL || 'https://nomadassetcollective.com').replace(/\/$/, '');
const WP_API = `${WP_BASE}/wp-json/wp/v2`;
const WP_USER = process.env.WP_USER || 'admin_web';
const WP_PASS = process.env.WP_APP_PASSWORD;
const ACF_HTML_FIELD = process.env.WP_ACF_FIELD || 'raw_html_code';
const ACF_PROPERTY_ID_FIELD = process.env.WP_PROPERTY_ID_FIELD || 'nac_property_id';
const NOTION_LISTING_URL_FIELD = process.env.NOTION_LISTING_URL_FIELD || 'Listing URL';
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '35848ec25e86803283acc7ad989649c9';
const ONLY_SLUG = process.env.ONLY_SLUG || null;

if (!WP_PASS) { console.error('WP_APP_PASSWORD env var is required'); process.exit(1); }
if (!NOTION_TOKEN) { console.error('NOTION_TOKEN env var is required'); process.exit(1); }

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const notion = new Client({ auth: NOTION_TOKEN });

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

async function findByListingUrl(listingUrl) {
  if (!listingUrl) return null;
  let parsed;
  try { parsed = new URL(listingUrl); } catch { return null; }
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (!segments.length) return null;
  const slug = segments[segments.length - 1];

  const candidates = await wp(`/pages?slug=${encodeURIComponent(slug)}&per_page=20&status=publish,draft,private,future,pending`);
  if (!candidates.length) return null;

  // Prefer the candidate whose full WP `link` matches the Notion URL exactly.
  const target = normalizeUrl(listingUrl);
  const exact = candidates.find(p => normalizeUrl(p.link) === target);
  if (exact) return exact;
  // If only one candidate exists and the slug matches uniquely, accept it.
  if (candidates.length === 1) return candidates[0];
  return null;
}

let allPagesCache = null;
async function getAllPages() {
  if (allPagesCache) return allPagesCache;
  const out = [];
  for (let p = 1; p <= 50; p++) {
    const batch = await wp(`/pages?per_page=100&page=${p}&_fields=id,slug,link,acf,parent&status=publish,draft,private,future,pending`);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  allPagesCache = out;
  return out;
}

async function findByPropertyId(propertyId) {
  if (!propertyId) return null;
  const pages = await getAllPages();
  return pages.find(p => p.acf && p.acf[ACF_PROPERTY_ID_FIELD] === propertyId) || null;
}

async function updatePageAcf(pageId, html) {
  return wp(`/pages/${pageId}`, {
    method: 'POST',
    body: JSON.stringify({ acf: { [ACF_HTML_FIELD]: html } }),
  });
}

// ─── Notion helpers ─────────────────────────────────────────────────────────

function richText(prop) {
  if (!prop) return '';
  if (prop.title) return prop.title.map(t => t.plain_text).join('');
  if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('');
  return '';
}

function readNumber(prop) { return prop && typeof prop.number === 'number' ? prop.number : null; }

function readUrl(prop) {
  if (!prop) return '';
  if (prop.url) return prop.url;
  if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('').trim();
  return '';
}

async function fetchLiveProperties() {
  let results = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: { property: 'Hub Status', select: { equals: 'Live' } },
      start_cursor: cursor,
    });
    results = results.concat(res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return results.map(page => {
    const p = page.properties;
    const idNum = readNumber(p['Property ID']);
    return {
      slug: richText(p['🔗 Slug']),
      propertyId: idNum != null ? `NAC-${idNum}` : null,
      listingUrl: readUrl(p[NOTION_LISTING_URL_FIELD]),
    };
  }).filter(p => p.slug);
}

// ─── Sync one property ──────────────────────────────────────────────────────

async function syncOne(prop) {
  const file = path.join(PROPERTIES_DIR, `${prop.slug}.html`);
  let html;
  try {
    html = await fs.readFile(file, 'utf-8');
  } catch {
    return { slug: prop.slug, skipped: 'no HTML file at properties/' + prop.slug + '.html' };
  }

  let page = await findByListingUrl(prop.listingUrl);
  let how = 'listing-url';
  if (!page && prop.propertyId) {
    page = await findByPropertyId(prop.propertyId);
    how = 'property-id';
  }
  if (!page) {
    const why = [
      prop.listingUrl ? `URL "${prop.listingUrl}" did not match any WP page` : 'no Listing URL in Notion',
      prop.propertyId ? `Property ID "${prop.propertyId}" not found in ACF.${ACF_PROPERTY_ID_FIELD}` : 'no Property ID in Notion',
    ].join('; ');
    return { slug: prop.slug, error: 'no matching WP page — ' + why };
  }

  await updatePageAcf(page.id, html);
  return { slug: prop.slug, pageId: page.id, link: page.link, how };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching Live properties from Notion…`);
  let properties = await fetchLiveProperties();
  if (ONLY_SLUG) properties = properties.filter(p => p.slug === ONLY_SLUG);
  console.log(`  ${properties.length} property(ies) to sync to ${WP_BASE} as ${WP_USER}`);

  let ok = 0, fail = 0, skip = 0;
  const failures = [];
  for (const prop of properties) {
    try {
      const r = await syncOne(prop);
      if (r.skipped) {
        console.log(`  ⤳ ${r.slug}: skipped (${r.skipped})`);
        skip++;
      } else if (r.error) {
        console.error(`  ✗ ${r.slug}: ${r.error}`);
        fail++;
        failures.push(r);
      } else {
        console.log(`  ✓ ${r.slug} → page ${r.pageId} via ${r.how} (${r.link})`);
        ok++;
      }
    } catch (err) {
      console.error(`  ✗ ${prop.slug}: ${err.message}`);
      fail++;
      failures.push({ slug: prop.slug, error: err.message });
    }
  }
  console.log(`\nDone. ${ok} updated, ${skip} skipped, ${fail} failed.`);
  if (failures.length) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`  - ${f.slug}: ${f.error}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
