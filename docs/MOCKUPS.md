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
  comp[Components]
  chrome[components-chromeless.html]
  list[components-list.html]
  knob[knob]
  dd[dropdown]
  vsl[vertical-slider]
  sw[switch]
  btn[button]
  xy[xy-surface]
  step[step-control]
  gui[General User Interface Mockups]
  settings[Settings]
  presets[Presets]
  export[Export]
  help[Help]
  mockups --> launch
  mockups --> plugins
  plugins --> u
  plugins --> pan
  plugins --> eq
  plugins --> sat
  mockups --> comp
  comp --> chrome
  chrome --> list
  list --> knob
  list --> dd
  list --> vsl
  list --> sw
  list --> btn
  list --> xy
  list --> step
  mockups --> gui
  gui --> settings
  gui --> presets
  gui --> export
  gui --> help
```

**Components:** **Component mockups** → `components-chromeless.html` in **`#mockup-iframe`** (chromeless mode: frame chrome hidden via `.phone-frame--chromeless`). Per-control pages: `component-mockup-knob`, `-dropdown`, `-vertical-slider`, `-switch`, `-button`, `-xy-surface`, `-step-control`. **`components-list.html`** — notes + inventory (linked from chromeless).

## Standalone App Launch image (blueprint page)

`mockups/blueprint-01-mockup-wireframe.html` + `mockups/blueprint-mockup-wireframe.css`:

- **Standalone app launch art** — same language as `main.html`.
- **Mockups and Wireframes** — collapsible block with **You are a…** card and wireframe canvas.

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

## Architecture (single-iframe)

One viewport (`#mockup-iframe` inside `#phone-frame`) loads all mockups. Chromeless mockups (Components) add `.phone-frame--chromeless` to hide the traffic-light strip; standard mockups show full device chrome. Responsive: 320–767px stacked, 768px+ side-by-side; scales for HiDPI and HD.

## Notes

- Inventory: `docs/MENU_INVENTORY.md`.
- Mockups list uses flat rows + group headings.
