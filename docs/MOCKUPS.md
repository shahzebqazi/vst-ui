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
  examplePluginsMenu[ExamplePlugins]
  historyMenu[History]
  exportMenu[Export]
  settingsMenu[Settings]
  helpMenu[Help]
  menuRoot --> mainMenu
  menuRoot --> examplePluginsMenu
  menuRoot --> historyMenu
  menuRoot --> exportMenu
  menuRoot --> settingsMenu
  menuRoot --> helpMenu
```

## ExamplePlugins Screen

```mermaid
flowchart TB
  epHeader[ExamplePluginsHeader]
  chainMenu[PluginChainMenu]
  win1[Window_Utility]
  win2[Window_Pan]
  win3[Window_EQ]
  win4[Window_Saturator]
  epHeader --> chainMenu
  epHeader --> win1 --> win2 --> win3 --> win4
  chainMenu -.->|anchors| win1
```

- **Desktop / wide viewport:** chain menu on the left; Utility, Pan, EQ, Saturator as stacked plugin windows on the right (blank canvas + centered title each).
- **Mobile / narrow:** menu first, then the same windows stacked vertically.

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
