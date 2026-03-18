# Handoff prompt: Controls surface (parameters menu)

**Copy everything below the line into a new chat with your AI coding agent.**

---

## Context

Repository: **vst-ui** — static HTML mockups for VST-style plugin UIs, loaded in a phone-sized iframe (`390×844` reference) from `index.html`.

The shell labels this screen **Controls**; the file is still:

- **`mockups/capture-modes.html`**

It currently contains only placeholders (“Capture Modes”, TODO list). **Rename the visible title to “Controls”** (or match product naming) and replace the body with a credible **parameters / controls surface** mockup.

## Your mission

Design and implement the **Controls** mockup as a self-contained HTML page that shows:

1. **A clear parameters menu** — how users navigate groups of controls (e.g. sections, tabs, accordion, or sidebar) appropriate for a compact mobile-first plugin chrome.
2. **Concrete menu items** — each item should map to a plausible control group (e.g. Input / Tone / Dynamics / Output, or Amp / Cab / Mic, etc.—pick a coherent fictional plugin domain or stay generic “Parameter group A/B/C”).
3. **At least one expanded view** — when a menu item is selected, show representative **parameters** (sliders, toggles, stepped controls, or read-only values) as static HTML/CSS. No backend; interactive affordances can be pure CSS/JS optional.

## Constraints

- **Single file:** `mockups/capture-modes.html` (inline `<style>` OK; no build step).
- **Self-contained:** must render correctly inside an iframe; no dependency on parent shell.
- **Accessibility:** semantic regions, headings hierarchy, focusable controls if interactive.
- **Readable on small width:** ~390px; avoid horizontal overflow.
- Follow repo **PLAYBOOK.md**: after changes, **git add**, **commit** with message like `mockups: Controls surface — parameters menu and items`, **git push origin main** (unless user says not to push).

## Suggested deliverables checklist

- [ ] Title + `<h1>` aligned with **Controls** (not “Capture Modes” unless product requires it).
- [ ] Documented IA: short comment in HTML or a one-line note in commit body listing menu structure.
- [ ] Update **`docs/MENU_INVENTORY.md`** under the Controls / Capture Modes section with **MUST/NICE** rows for each menu item you add (or add a new subsection if structure changed).
- [ ] Optionally sync one sentence into **`docs/MOCKUPS.md`** Mermaid or text if the menu graph should reflect the new structure.

## Open decisions (ask the user if unclear)

- Plugin metaphor (amp modeler vs synth vs FX generic).
- Density: few large controls vs many small parameters.
- Whether **Main** (`mockups/home.html`) should link or cross-nav to Controls (out of scope unless user asks).

## Do not

- Rename `capture-modes.html` without updating **`index.html`** mockup links and any docs that reference the path.
- Add frameworks or npm unless the user explicitly requests it.

Start by summarizing your proposed **menu tree** and **parameter groups** in 5–10 bullets, then implement.

---

_End of handoff prompt._
