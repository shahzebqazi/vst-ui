# Mockups and Wireframes

## Shell Wireframe

```mermaid
flowchart LR
  subgraph floatingPane [FloatingPane]
    leftMenu[LeftMenuList]
    rightViewport[RightViewportPhone390x844]
  end
  leftMenu -->|SelectMenu| rightViewport
```

## Blueprints navigation (shell)

```mermaid
flowchart TB
  blueprints[Blueprints]
  b1[Standalone App Launch image]
  blueprints --> b1
```

## Blueprint 1 — Standalone App Launch image

`mockups/blueprint-01-mockup-wireframe.html` + `mockups/blueprint-mockup-wireframe.css`:

- **Standalone app launch art** — same gradient / mark / progress bar language as `main.html`.
- **“You are a…” mockup** — labeled mockup card with placeholder copy.
- **Wireframe** — white canvas, **black** 2px box strokes; **subtext** states this is a wireframe and that **every wireframe in this project** should carry that kind of label.

## Settings Screen Skeleton

```mermaid
flowchart TB
  settingsHeader[SettingsHeader]
  generalRow[GeneralRow]
  shortcutsRow[ShortcutsRow]
  notificationsRow[NotificationsRow]
  aboutRow[AboutRow]
  settingsHeader --> generalRow --> shortcutsRow --> notificationsRow --> aboutRow
```

## Notes

- Replace placeholder rows with user-defined menu items from `docs/MENU_INVENTORY.md`.
- Add more blueprint rows in `index.html` as the inventory grows; each loads a different iframe target.
