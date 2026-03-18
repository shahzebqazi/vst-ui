# AI agent playbook — VST UI mockups repository

Instructions for **AI coding agents** (e.g. Cursor) working in this repo. Follow these rules unless the user explicitly overrides them.

---

## 1. Agent conduct

### 1.1 Ask before guessing

- If requirements are **ambiguous**, **contradictory**, or **missing**, **ask the user** for clarification instead of inventing product decisions.
- Offer **at most two concrete options** when proposing a choice, then wait for the user’s answer.
- Do not assume hosting URLs, menu names, or scope changes without confirmation when the user’s message is unclear.

### 1.2 Complete the Git workflow when work is done

When you finish a **coherent unit of work** (a feature, fix, or doc update the user requested):

1. **`git add`** — stage only paths you changed (avoid unrelated files).
2. **`git commit`** — use a **clear, scoped message** (see §4).
3. **`git push origin main`** — publish to GitHub.

**Do not** leave completed work uncommitted or unpushed unless the user asked you not to push (e.g. local-only experiment).

If **push fails** (auth, network, conflicts): **stop**, report the error and suggested next steps; do not claim the work is “shipped.”

If the workspace is **not a git repository** (no `.git`), skip `git add` / `commit` / `push` until the user initializes git and adds a remote; still complete file changes and summarize work.

### 1.3 Commits: one logical change per commit

- Prefer **one commit per logical change**; avoid mixing unrelated edits.
- If the user asks for a **single commit** with everything, comply.

---

## 2. Design: responsive & aesthetic principles

Apply these when editing **`index.html`**, **`styles/backgrounds.css`**, **`mockups/*.html`**, or **`documents/*.html`**.

### 2.1 Responsive

- Treat the **mockup viewport** as **390×844** (mobile-first reference); shell layout should **degrade gracefully** on smaller desktops and narrow windows.
- Use **flex/grid** with **wrap** and sensible **`min-width`** / **`max-width`** so controls do not overflow the left panel.
- Prefer **relative units** (`rem`, `%`, `min()`, `clamp()`) where appropriate; avoid fixed widths that break on small screens.
- Ensure **touch targets** for interactive controls are at least ~**44×44px** where possible.
- Test mentally: **320px-wide** panel, **stacked shell** on narrow viewports (existing `@media` patterns in `backgrounds.css`).

### 2.2 Aesthetic

- Keep **visual hierarchy** clear: section titles → grouped controls → primary viewport.
- Maintain **consistent spacing**, **border-radius**, and **typography** with existing Nerd Font / chrome patterns unless the user requests a redesign.
- **Contrast**: text and controls must remain readable on **Blueprint**, **Paper**, and **Dark Dots** themes (including translucent left panel).
- **Motion**: subtle transitions only; avoid distracting animation.
- **Accessibility**: preserve **`aria-label`**, **`aria-labelledby`**, focus styles (`:focus-visible`), and semantic HTML when changing buttons or navigation.

---

## 3. GitHub & GitHub Pages

### 3.1 Repository hygiene

- **Branch:** default work on **`main`** unless the user specifies a feature branch.
- **README** and **`docs/REQUIREMENTS.md`** should stay aligned with **canonical live URL** and document structure when those change.
- Do not commit **secrets** (tokens, `.env` with real credentials). Use `.gitignore` for local-only files.

### 3.2 GitHub Pages (static site)

- Site is **static HTML/CSS/JS**; **no build step required** for basic changes.
- Publishing typically uses **`main`** with site root at repo root (or `/docs` if configured that way).
- After deploy-affecting changes, ensure:
  - **`index.html`** exists at the published root.
  - **Relative paths** (`styles/`, `mockups/`, `documents/`) work from the **deployed base URL** (including path prefix if the site lives under e.g. `/vst-ui/`).
- **Canonical URL** for this project: **`https://sqazi.sh/vst-ui/`** — keep **`index.html`** `<link rel="canonical">` and docs in sync when URL policy changes.

### 3.3 Optional: commit message metadata

When the environment allows, append to the commit body:

`Agent-model: <display name>`

---

## 4. Commit message convention

| Prefix    | Use for                          |
| --------- | -------------------------------- |
| `docs:`   | Markdown under `docs/`           |
| `mockups:`| HTML under `mockups/`           |
| `style:`  | CSS / visual shell               |
| `feat:`   | New user-facing behavior         |
| `fix:`    | Bug fixes                        |
| `chore:`  | Repo config, cleanup             |

Examples: `docs: sync MENU_INVENTORY`, `mockups: tighten settings layout`, `style: theme tooltip contrast`.

---

## 5. Deliverables (source of truth)

- `docs/REQUIREMENTS.md`
- `docs/MENU_INVENTORY.md`
- `docs/MOCKUPS.md`
- `docs/DIAGRAMS.md`
- `styles/backgrounds.css`
- `scripts/shell.js` — shell logic for `index.html` (theme, disclosures, mockup iframes, persistence)
- `index.html`
- `mockups/*.html` per screen
- `documents/*.html` — primary: executive overview, software engineering requirements specification, design guide; archived hub: `archived-documents.html` (+ linked legacy pages)

---

## 6. Prompt workflow (requirements depth)

Use this **two-round** workflow when defining or overhauling menus (unless the user waives it).

### Prompt A: Top-level menus

Ask the user for the **final** top-level menu list (add / rename / remove). Baseline reference:

- Home · Capture Modes · History · Export · Settings · Help  
  (or current shell labels — **Blueprints**, UI configuration, Documents — follow repo reality.)

### Prompt B: Items per menu

For each menu:

`Under "<MenuName>", list every row, tab, section, and action. Mark MUST or NICE.`

### Completion gate

`docs/REQUIREMENTS.md` should stay aligned with `docs/MENU_INVENTORY.md` (concrete rows or explicit **`N/A`** per section).

---

## 7. Artifact build order

1. `docs/MENU_INVENTORY.md`
2. `docs/REQUIREMENTS.md`
3. `docs/MOCKUPS.md` / `docs/DIAGRAMS.md` (Mermaid)
4. `index.html`, `styles/backgrounds.css`, `mockups/*.html`
5. Verify navigation + iframe target + responsive shell

**After each step:** commit and push (per §1.2).

---

## 8. Sync: inventory → docs → HTML

When menus change:

1. `MENU_INVENTORY.md` → commit + push  
2. `REQUIREMENTS.md` → commit + push  
3. Mermaid docs → commit + push  
4. `mockups/*.html` + `index.html` → commit + push  

Do not claim sync done until all layers are updated **and** pushed.

---

## 9. HTML mockup rules

- Shell: **left** controls, **right** phone frame (**390×844** iframe).
- Mockup pages should match **defined** menu / screen inventory.
- Theme switcher and mockup controls: follow **§2** (responsive + aesthetic).

---

## 10. Verification before “done”

1. Links and paths resolve for **GitHub Pages** base path.
2. Mermaid blocks valid (if touched).
3. Changes **committed and pushed**.
4. User asked for clarification where needed (§1.1).

---

## Phase 0: New repo (once)

1. `git init` on **`main`**
2. Minimal `README.md`, `.gitignore`
3. Commit; add remote; **`git push -u origin main`**
4. Configure GitHub Pages if applicable; record live URL in `docs/REQUIREMENTS.md`
