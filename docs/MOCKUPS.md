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

- **Standalone app launch art** — primary viewport content; same gradient / mark / progress bar language as `main.html`.
- **Mockups and Wireframes** — collapsible section below launch art. When expanded: **“You are a…” mockup** (labeled card) and **wireframe** canvas (**black** 2px strokes) plus project-standard wireframe subtext.

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
