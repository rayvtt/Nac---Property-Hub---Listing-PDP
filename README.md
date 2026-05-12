# NAC Property Hub — PDP Previews

Auto-published preview snapshots of NAC Property Hub listing PDPs for on-the-go review.

**Live index:** https://rayvtt.github.io/Nac---Property-Hub---Listing-PDP/

## Structure

- `index.html` — listing dashboard
- `properties/` — individual rendered PDP previews (self-contained HTML)

## How it works

The local PDP builder (separate repo) renders each listing from Notion data through a Mustache template, then `sync-gh.js` copies the `.preview.html` files into this repo and pushes.

Each property page is a fully self-contained HTML fragment with inline `<style>` and `<script>` — no build step, just open in browser.

## Enabling GitHub Pages

In repo Settings → Pages: Source = `main` branch, root folder `/`. Site goes live at the URL above within ~1 min.
