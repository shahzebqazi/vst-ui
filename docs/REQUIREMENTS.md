# Capture Plugin Requirements

This document is the contract for documentation and mockup scope.

## Product Surface

- Surface type: two-column floating content pane.
- Left column: menu list.
- Right column: screen mockup viewport.
- Mobile-first viewport target: `390x844`.

## Visual Identity

- Minimal layout with simple spacing and padding.
- Use CSS-only backgrounds:
  - Blueprint: blue background with white grid lines.
  - Paper: paper-style background with brown grid lines.
  - Dark Dots: black background with dots.

## Menu Architecture

Top-level menus (subject to Prompt A updates):

- Home
- Capture Modes
- History
- Export
- Settings
- Help

Menu item definitions are maintained in `docs/MENU_INVENTORY.md`.

## Prompt Gates

Requirements are not final until:

- Prompt A finalizes the top-level menu list.
- Prompt B is completed for each menu.
- `docs/MENU_INVENTORY.md` has no unresolved `TODO` entries (or explicit `N/A`).

## GitHub Pages

- Publish from `main` using root or `/docs`.
- Ensure published path contains `index.html`.
- Record live URL here once configured.

Live URL: `https://sqazi.sh/vst-ui/`
