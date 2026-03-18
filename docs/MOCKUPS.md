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
```

_Presets and Export are not listed in the shell menu._

## Standalone App Launch image (blueprint page)

`mockups/blueprint-01-mockup-wireframe.html` + `mockups/blueprint-mockup-wireframe.css`:

- **Viewport** — Non-scrollable **desktop-style title bar** (title **Launch image**, red close control posts to parent to clear the mockup). Body: launch gradient, logo mark, **spinner** + progress bar, **Launch image** heading.
- **Host page** — When this mockup is selected under **Mockups**, **Standalone App Launch — detail** on `index.html` shows the **“You are a…”** card and **wireframe** canvas (same structure as before; moved out of the iframe).

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
