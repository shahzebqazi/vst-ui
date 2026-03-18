# VST UI repository — requirements

Contract for **documentation**, **shell behavior**, and **mockup scope** for this static design library.

## Product surface (shell)

- **Layout:** Two-column floating pane when **Mockups** is expanded: left controls, right viewport.
- **Viewport:** Mobile-first reference **390×844**; optional **Ableton-style** (340×200) and **desktop plugin** (960×600) presets.
- **Chromeless column:** **Component mockups** (`components-chromeless.html`) use the full-width chromeless iframe, not the phone frame.

## Visual identity

- Minimal spacing; CSS-only backgrounds in shell:
  - **Blueprint** — blue grid
  - **Paper** — warm grid
  - **Dark Dots** — dark dot field
- Nerd Font stacks for shell chrome (loaded via CDN; see **Design guide** §6–7).

## Information architecture (published site)

### Shell sections

1. **UI configuration** — Theme + viewport size.
2. **Mockups** — All entries listed in `docs/MENU_INVENTORY.md` under “Mockups (shell)”.
3. **Documents** — Executive overview, software engineering requirements specification, design guide, and **Archived documents hub** (`documents/archived-documents.html`).

### Future plugin app

Top-level menus (**Home**, **Capture Modes**, **History**, **Export**, **Settings**, **Help**, **Presets**) are **not** fully implemented as a single app in this repo. Placeholder mockups exist where noted in `docs/MENU_INVENTORY.md`; remaining items are **N/A** until product scope is fixed.

## Published design documents (primary)

- **Executive overview** — program & infrastructure.
- **Software engineering requirements specification** — platform, security, repository, delivery.
- **Design guide** — UX, UI, implementation handoff.

**Archived / supplementary:** `design-specification.html`, `requirements-cto.html`, `executive-design-requirements.html` — indexed from `documents/archived-documents.html`.

## Prompt gates

When overhauling **plugin** menus (not the shell):

- Prompt A: finalize top-level menu list.
- Prompt B: items per menu with MUST/NICE.
- Update `docs/MENU_INVENTORY.md` and mockups in sync.

## GitHub Pages

- Publish from **`main`**; site root at repo root (or `/docs` if configured).
- **`index.html`** at published root; relative paths **`styles/`**, **`scripts/`**, **`mockups/`**, **`documents/`** must work under the deployed base URL (e.g. `/vst-ui/`).

**Live URL:** `https://sqazi.sh/vst-ui/`

## Source files (maintenance)

- `docs/MENU_INVENTORY.md`, `docs/MOCKUPS.md`, `docs/DIAGRAMS.md`
- `styles/backgrounds.css`
- `scripts/shell.js` — shell behavior for `index.html`
- `index.html`, `mockups/*.html`, `documents/*.html`
