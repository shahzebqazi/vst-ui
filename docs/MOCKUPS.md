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

## Menu Navigation Wireframe

```mermaid
flowchart TB
  menuRoot[MenuRoot]
  mainMenu[Main]
  util[Utility]
  pan[Pan]
  eq[EQ]
  sat[Saturator]
  historyMenu[History]
  exportMenu[Export]
  settingsMenu[Settings]
  helpMenu[Help]
  menuRoot --> mainMenu
  menuRoot --> util
  menuRoot --> pan
  menuRoot --> eq
  menuRoot --> sat
  menuRoot --> historyMenu
  menuRoot --> exportMenu
  menuRoot --> settingsMenu
  menuRoot --> helpMenu
```

## Example plugin mockups

Four standalone pages (`example-utility.html`, `example-pan.html`, `example-eq.html`, `example-saturator.html`): full-viewport blank canvas with centered plugin title each.

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
- Keep one mockup section per top-level menu as the inventory evolves.
