# NAC Brochure URLs

Mapping of local file slug → WP page slug for all 12 country program brochures.
Used by `scripts/sync-brochures-wp.mjs` (Notion-free direct WP push).

| Local file (`properties/<slug>.html`) | WP page URL |
|--------------------------------------|-------------|
| `turkey-cbi` | https://nomadassetcollective.com/brochures/chuong-trinh-tho-nhi-ky-cbi-citizenship-by-investment/ |
| `cyprus-rbi` | https://nomadassetcollective.com/brochures/chuong-trinh-dao-sip-rbi-residence-by-investment/ |
| `greece-golden-visa` | https://nomadassetcollective.com/brochures/residences-chuong-trinh-hy-lap-golden-visa/ |
| `malaysia-mm2h` | https://nomadassetcollective.com/brochures/chuong-trinh-malaysia-rbi-mm2h-dau-tu-quyen-cu-tru/ |
| `malta-mprp` | https://nomadassetcollective.com/brochures/chuong-trinh-malta-thuong-tru-nhan-rbi/ |
| `new-zealand-rbi` | https://nomadassetcollective.com/brochures/chuong-trinh-new-zealand-rbi-dau-tu-di-tru/ |
| `panama-rbi` | https://nomadassetcollective.com/brochures/chuong-trinh-panama-rbi-quyen-cu-tru-vinh-vien/ |
| `portugal-golden-visa` | https://nomadassetcollective.com/brochures/chuong-trinh-bo-dao-nha-golden-visa/ |
| `st-kitts-cbi` | https://nomadassetcollective.com/brochures/chuong-trinh-si-kitts-nevis-quoc-tich/ |
| `thailand-ltr` | https://nomadassetcollective.com/brochures/chuong-trinh-thai-lan-cu-tru-dai-han-ltr-rbi/ |
| `uae-golden-visa` | https://nomadassetcollective.com/brochures/chuong-trinh-uae-golden-visa-2/ |
| `uk-innovator-visa` | https://nomadassetcollective.com/brochures/chuong-trinh-uk-thuong-tru-visa-dau-tu-rbi/ |

## Notes
- These brochures are NOT in the Notion `🏠 NAC - Property Listings` DB — `sync-wp.mjs` (Notion-driven) will skip them.
- Use `sync-brochures-wp.mjs` for all brochure pushes.
- Trigger via Actions → **Sync Brochure HTML → WordPress** → Run workflow.
- To push a single brochure: enter `only_slug` (e.g. `panama-rbi`) in the workflow dispatch.
