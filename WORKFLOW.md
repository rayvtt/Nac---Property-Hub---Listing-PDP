# NAC Property Hub — PDP Preview Workflow

## How to preview
Open `index.html` in any browser — no build step, no server needed.
Each card links to its PDP file under `properties/`.

---

## Git setup notes
The local git proxy (`127.0.0.1`) **blocks direct pushes to `main`**.
Non-main branches push fine. Always use the branch → merge flow below.

---

## Standard edit flow

```bash
# 1. Make sure you're on a working branch
git checkout -b feat/your-change    # or reuse an existing feature branch

# 2. Edit files
#    e.g. properties/nobu-da-nang.html

# 3. Commit
git add properties/nobu-da-nang.html
git commit -m "Short description of change"

# 4. Push branch (non-main = allowed)
git push -u origin feat/your-change
```

Then in the Claude session, merge to main:
```
mcp__github__create_pull_request  →  mcp__github__merge_pull_request
```

Then pull locally to sync:
```bash
git checkout main
git reset --hard origin/main
```

Open `index.html` → changes are live.

---

## On-the-go / desktop shortcut (Claude session)

Just tell Claude what to change. It will:
1. Edit the file on the feature branch
2. Commit + push to that branch
3. Create PR → merge to main via GitHub MCP
4. Pull + reset local main

You only need to refresh `index.html` to see the result.

---

## File locations

| File | Purpose |
|------|---------|
| `index.html` | Preview index — links to all PDPs |
| `properties/nobu-da-nang.html` | NAC-4 Nobu Da Nang PDP |
| `WORKFLOW.md` | This file |

---

## Repo
`rayvtt/Nac---Property-Hub---Listing-PDP`  
Feature branch pattern: `claude/edit-[property]-[id]` or `feat/[description]`
