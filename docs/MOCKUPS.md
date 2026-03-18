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

## Mockups navigation (shell)

```mermaid
flowchart TB
  mockups[Mockups]
  launch[Standalone App Launch image]
  plugins[Plugins mock-ups]
  u[Utility]
  pan[Pan]
  eq[EQ]
  sat[Saturator]
  gui[General User Interface Mockups]
  settings[Settings]
  help[Help]
  mockups --> launch
  mockups --> plugins
  plugins --> u
  plugins --> pan
  plugins --> eq
  plugins --> sat
  mockups --> gui
  gui --> settings
  gui --> help
  comp[Components]
  cm[Components page]
  mockups --> comp
  comp --> cm
```

_Under **Plugins mock-ups**: Utility, Pan, EQ, Saturator, then **Components** → `components.html` (200×200 mini windows + wireframes). Presets and Export are not in the menu._

## Standalone App Launch image (blueprint page)

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

- Inventory: `docs/MENU_INVENTORY.md`.
- Under **Mockups**, rows use a flat list style (no white card per link); group headings separate **Plugins mock-ups** and **General User Interface Mockups**.
