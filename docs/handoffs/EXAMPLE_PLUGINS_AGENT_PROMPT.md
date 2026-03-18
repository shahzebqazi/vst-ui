# Handoff prompt: ExamplePlugins (plugin chain mock)

Repository: **vst-ui** — static HTML mockups for VST-style plugin UIs, loaded in an iframe from `index.html`.

The shell labels this screen **ExamplePlugins**; the file is:

- **`mockups/capture-modes.html`**

## Current mock

- **Plugin chain** nav (Utility, Pan, EQ, Saturator) with in-page anchors.
- **Layout:** desktop-width → menu beside a **vertical stack** of four desktop-style plugin windows; narrow → menu on top, windows below.
- Each window: minimal title bar + **blank canvas** with **centered plugin title** only.

## When extending

- Add real controls inside canvases per product spec; keep self-contained HTML/CSS in this file.
- Follow repo **PLAYBOOK.md**: stage, commit, push when changes are complete.
- Update **`docs/MENU_INVENTORY.md`** if structure or labels change.

## Pitfalls

- Renaming `capture-modes.html` without updating **`index.html`** mockup links and docs that reference the path.
