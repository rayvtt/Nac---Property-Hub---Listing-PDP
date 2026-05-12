#!/usr/bin/env node
// Rebuilds index.html's card grid from Notion's Live property rows.
//
// Markers in index.html bound the rebuilt section:
//   <!-- INDEX_CARDS_START --> ... <!-- INDEX_CARDS_END -->
//
// Skips Live rows whose properties/<slug>.html doesn't exist on disk
// (avoids broken links on the GitHub Pages preview index).
//
// Card data sourced from Notion: 🔗 Slug, Property ID, Property Name,
// Country, 📍 District (fallback Region/City), ⭐ NAC Score,
// Purchase Price, Yield %, Image URL, Tags.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@notionhq/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const PROPERTIES_DIR = path.join(ROOT, 'properties');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '35848ec25e86803283acc7ad989649c9';

if (!NOTION_TOKEN) { console.error('NOTION_TOKEN env var is required'); process.exit(1); }

const notion = new Client({ auth: NOTION_TOKEN });

const COUNTRY_FLAGS = {
  'Vietnam': '🇻🇳', 'Panama': '🇵🇦', 'Japan': '🇯🇵',
  'Thailand': '🇹🇭', 'Indonesia': '🇮🇩', 'Philippines': '🇵🇭',
  'Malaysia': '🇲🇾', 'Singapore': '🇸🇬', 'Cambodia': '🇰🇭',
  'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'UAE': '🇦🇪',
  'Mexico': '🇲🇽', 'Colombia': '🇨🇴', 'Costa Rica': '🇨🇷',
};

function richText(prop) {
  if (!prop) return '';
  if (prop.title) return prop.title.map(t => t.plain_text).join('');
  if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('');
  return '';
}
const readNumber = (p) => (p && typeof p.number === 'number' ? p.number : null);
const readSelect = (p) => (p && p.select ? p.select.name : null);
const readUrl = (p) => (p && p.url ? p.url : null);
const readMultiSelect = (p) => (p && Array.isArray(p.multi_select) ? p.multi_select.map(s => s.name) : []);

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function fmtMoneyShort(n) {
  if (n == null) return '';
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return '$' + Math.round(n);
}
function fmt1(n) {
  if (n == null) return '';
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? r.toFixed(1) : r.toString();
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
      propertyIdNum: idNum,
      propertyName: richText(p['Property Name']),
      country: readSelect(p['Country']),
      district: richText(p['📍 District']),
      regionCity: richText(p['Region/City']),
      nacScore: readNumber(p['⭐ NAC Score']),
      purchasePrice: readNumber(p['Purchase Price']),
      yieldPct: readNumber(p['Yield %']),
      heroImg: readUrl(p['Image URL']),
      tags: readMultiSelect(p['Tags']),
    };
  }).filter(p => p.slug);
}

function renderCard(p) {
  const flag = (p.country && COUNTRY_FLAGS[p.country]) || '🌍';
  const district = p.district || p.regionCity || '';
  const idHtml = p.propertyId
    ? `\n            <span class="id">${esc(p.propertyId)}</span>`
    : '';
  const scoreHtml = p.nacScore != null
    ? `\n            <span class="sep">·</span>\n            <span class="score">NAC Score ${Math.round(p.nacScore)}/100</span>`
    : '';
  const yieldPctScaled = p.yieldPct != null ? p.yieldPct * 100 : null;
  const priceYieldBits = [
    p.purchasePrice != null ? fmtMoneyShort(p.purchasePrice) : null,
    yieldPctScaled != null ? `${fmt1(yieldPctScaled)}% yield` : null,
    ...(p.tags || []).slice(0, 1),
  ].filter(Boolean);
  const priceYield = priceYieldBits.length
    ? `\n            <span class="sep">·</span>\n            <span>${esc(priceYieldBits.join(' · '))}</span>`
    : '';
  const districtHtml = district
    ? `\n            <span class="sep">·</span>\n            <span>${esc(district)}</span>`
    : '';
  const imgHtml = p.heroImg
    ? `<img class="card-thumb" src="${esc(p.heroImg)}" alt="${esc(p.propertyName)}" loading="lazy">`
    : `<div class="card-thumb" aria-hidden="true"></div>`;

  return `      <a href="properties/${esc(p.slug)}.html" class="card">
        ${imgHtml}
        <div class="card-body">
          <div class="row">${idHtml}
            <span class="name">${esc(p.propertyName)}</span>
            <span class="arrow">→</span>
          </div>
          <div class="meta">
            <span>${flag} ${esc(p.country || '')}</span>${districtHtml}${scoreHtml}${priceYield}
          </div>
        </div>
      </a>`;
}

async function main() {
  const properties = await fetchLiveProperties();
  console.log(`Found ${properties.length} Live propert(ies) in Notion.`);
  for (const p of properties) {
    console.log(`  • slug=${p.slug || '(missing)'} id=${p.propertyId || '(missing)'} name="${p.propertyName || ''}"`);
  }

  // Keep only listings whose HTML file exists on disk
  const valid = [];
  for (const p of properties) {
    const filepath = path.join(PROPERTIES_DIR, `${p.slug}.html`);
    try {
      await fs.access(filepath);
      valid.push(p);
    } catch {
      console.log(`  ⤳ ${p.slug}: no HTML file at properties/${p.slug}.html — skipped`);
    }
  }
  valid.sort((a, b) => (a.propertyIdNum ?? 999) - (b.propertyIdNum ?? 999));

  const html = await fs.readFile(INDEX_PATH, 'utf-8');
  const re = /<!-- INDEX_CARDS_START[\s\S]*?<!-- INDEX_CARDS_END -->/;
  if (!re.test(html)) {
    console.error('Marker block (INDEX_CARDS_START/END) not found in index.html — cannot rebuild.');
    process.exit(1);
  }
  if (!valid.length) {
    console.log('No valid listings to render — leaving index.html untouched so manual cards survive.');
    return;
  }

  const cards = valid.map(renderCard).join('\n');
  const markerStart = '<!-- INDEX_CARDS_START — rebuilt by scripts/update-index.mjs from Notion Live rows -->';
  const updated = html.replace(re, `${markerStart}\n${cards}\n      <!-- INDEX_CARDS_END -->`);

  if (updated === html) {
    console.log(`No index change — ${valid.length} card(s) already match.`);
    return;
  }
  await fs.writeFile(INDEX_PATH, updated, 'utf-8');
  console.log(`Done. Rebuilt index with ${valid.length} card(s).`);
  for (const p of valid) console.log(`  • ${p.propertyId || '(no id)'} ${p.propertyName} → properties/${p.slug}.html`);
}

main().catch(err => { console.error(err); process.exit(1); });
