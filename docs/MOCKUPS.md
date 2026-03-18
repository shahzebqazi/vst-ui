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
  controlsMenu[Controls]
  historyMenu[History]
  exportMenu[Export]
  settingsMenu[Settings]
  helpMenu[Help]
  menuRoot --> homeMenu
  menuRoot --> controlsMenu
  menuRoot --> historyMenu
  menuRoot --> exportMenu
  menuRoot --> settingsMenu
  menuRoot --> helpMenu
```

## Controls Screen (desktop-focused)

```mermaid
flowchart TB
  controlsHeader[ControlsHeader]
  paramsCol[ParametersAccordion]
  canvasSplit[SplitCanvasTwoTiles]
  controlsHeader --> paramsCol
  controlsHeader --> canvasSplit
  tileA[TileA_Oscillator_ChromePlusWidgets]
  tileB[TileB_FilterEnv_ChromePlusWidgets]
  canvasSplit --> tileA
  canvasSplit --> tileB
```

- **Narrow iframe:** parameters stack above canvas; tiles stack or sit in one column.
- **Desktop iframe (960×600):** parameters column + two tiles side by side; minimized/Ableton sizes out of scope for this layout.

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
