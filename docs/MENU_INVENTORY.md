# Menu Inventory Worksheet

Use this worksheet to capture all menu items before finalizing requirements or mockups.

Rules:

- Fill every `TODO` marker or replace with `N/A`.
- Mark each item priority as `MUST` or `NICE`.
- Keep labels user-facing and concise.

## Global Prompt

For each menu below, answer:

`Under "<MenuName>", list every row, tab, section, and action the user should see. Mark each as MUST or NICE.`

---

## Menu: Home

<!-- TODO: replace placeholder rows -->

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| TODO | row | MUST | |

## Menu: Controls

_Screen: `mockups/capture-modes.html` (shell label: Controls)._

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| Parameters — Global / voice | section (accordion) | MUST | Poly/mono, voice count |
| Parameters — Oscillator | section | MUST | Wave / source selection |
| Parameters — Filter | section | MUST | Cutoff, resonance, key track (expanded in mock) |
| Parameters — Envelope | section | MUST | ADSR / stage steps, levels |
| Parameters — Modulation | section | NICE | Matrix / routing rows |
| Parameters — Output | section | MUST | Master, limiter, metering |
| Desktop split canvas | region | MUST | Two tiles side by side (desktop viewport) |
| Per-tile chrome — Move / Resize / Lock / More | toolbar per tile | MUST | Layout UX; real impl = drag/resize |
| Tile body widgets | embedded controls | MUST | Knobs, sliders, fields, meters |
| Add control / + Knob / + Slider / + Meter | action buttons | NICE | Authoring empty tile slots |

## Menu: History

<!-- TODO: replace placeholder rows -->

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| TODO | row | MUST | |

## Menu: Export

<!-- TODO: replace placeholder rows -->

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| TODO | row | MUST | |

## Menu: Settings

<!-- TODO: replace placeholder rows -->

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| TODO | row | MUST | |

## Menu: Help

<!-- TODO: replace placeholder rows -->

| Item Label | Type (row/tab/action) | Priority (MUST/NICE) | Notes |
| ---------- | --------------------- | -------------------- | ----- |
| TODO | row | MUST | |

---

## Completion Checklist

- [ ] Prompt A finalized top-level menu list.
- [ ] Prompt B answered for every menu.
- [ ] No unresolved `TODO` markers remain, or each is explicitly `N/A`.
