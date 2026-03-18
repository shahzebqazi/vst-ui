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
  homeMenu[Home]
  captureModesMenu[CaptureModes]
  historyMenu[History]
  exportMenu[Export]
  settingsMenu[Settings]
  helpMenu[Help]
  menuRoot --> homeMenu
  menuRoot --> captureModesMenu
  menuRoot --> historyMenu
  menuRoot --> exportMenu
  menuRoot --> settingsMenu
  menuRoot --> helpMenu
```

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
