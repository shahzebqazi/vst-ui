# Mockup Rendering Bug — Investigation & Proposed Architecture

**Date:** 2025-03-18  
**Status:** Implemented — single-iframe architecture  
**Scope:** Component mockups section; blank canvas / stale floating mockup surface

---

## 0. Pre-Implementation Additions

### 0.1 Responsive Breakpoints

| Breakpoint | Layout | Mockup viewport behavior |
|------------|--------|---------------------------|
| 320–767px | Stacked (split-narrow) | Phone-frame scales; chromeless iframe full-width |
| 768px+ | Side-by-side (split-wide) | Phone-frame sticky; chromeless stretches |
| HiDPI | Same | CSS scaling; no fixed px for content |
| HD/4K | Same | `min()` / `clamp()` constrain viewport |

### 0.2 Component Pages Roles

| Role | File | Purpose |
|------|------|---------|
| **Shell entry** | `components-chromeless.html` | Loaded by shell; list + links to detail pages |
| **Notes & context** | `components-list.html` | Linked from chromeless for "Full notes & shell context" |

### 0.3 Responsive Test Checklist

- [ ] 320px width (narrow mobile)
- [ ] 390px (phone-frame reference)
- [ ] 768px (split layout)
- [ ] 1200px+ (wide desktop)
- [ ] HiDPI (e.g. devicePixelRatio 2)
- [ ] Square viewport (e.g. 600×600)

---

## 1. Findings

### 1.1 Rendering Surfaces

| Surface | Location | Purpose |
|---------|----------|---------|
| **Phone-frame iframe** | `#phone-frame` → `#mockup-iframe` (name=`mockupViewport`) | Standard mockups (Settings, Presets, plugins, etc.) with device chrome |
| **Chromeless iframe** | `#chromeless-panel` → `#chromeless-iframe` (name=`chromelessMockupViewport`) | Component mockups (list + per-control pages) without device chrome |
| **Right panel** | `#right-panel` | Container for both; shown/hidden based on `shouldShowMockupPanel()` |

Both viewports are **siblings** in the DOM. The shell toggles visibility via the `hidden` attribute and `setViewportMode(chromeless)`.

### 1.2 State Ownership

| Concern | Owner | Mechanism |
|---------|-------|-----------|
| Selected mockup | Shell | `is-active` class on `.mockup-link` |
| Right panel visibility | Shell | `applyLayout()` → `rightPanel.hidden`, `data-layout-split` |
| Phone vs chromeless mode | Shell | `setViewportMode(true|false)` |
| Clearing old mockups | Shell | `iframe.src = "about:blank"` when switching modes |
| Component list ↔ detail | **Child page** | `target="_self"` links inside chromeless iframe |
| Chromeless iframe height | Shell | `syncChromelessIframeHeight()` + ResizeObserver |

### 1.3 Flow When Clicking "Component mockups"

1. User opens Mockups disclosure, clicks "Component mockups".
2. Handler: `mockupsSectionOpen()` → `preventDefault`, add `is-active` to link.
3. `applyLayout()`: `split = true` → show right panel. **Does not** call `hideAllMockupViewports()` when split is true.
4. `applyActiveMockupViewport()`: `chromeless = true` → `setViewportMode(true)` (hide phone-frame, show chromeless-panel), `chromelessIframe.src = url`, `iframe.src = "about:blank"`.

### 1.4 Critical Observations

- **Target mismatch:** All mockup links use `target="mockupViewport"` (phone-frame). The chromeless mockup is loaded via JS into `chromeless-iframe`; the `target` is never used when `preventDefault` runs.
- **Two iframes always in DOM:** Both iframes exist and can hold content. When switching modes, we hide one and show the other, but we do not remove or replace the inactive iframe.
- **Chromeless iframe not cleared on hide:** When switching from chromeless to a standard mockup, we set `chromelessIframe.src = "about:blank"`. When hiding the right panel via `hideAllMockupViewports()`, we clear chromeless height but do **not** clear `chromelessIframe.src`.
- **Child-page navigation:** `components-chromeless.html` uses `target="_self"` for component links. The shell has no awareness of list vs detail; it only knows "Component mockups" is selected.
- **Initial chromeless iframe:** No `src` in HTML → starts as `about:blank`. Default CSS height: 120px.
- **Order of operations:** `applyLayout()` runs before `applyActiveMockupViewport()`. When split becomes true, the right panel is shown while both viewports may still be hidden from a prior `hideAllMockupViewports()`.

### 1.5 CSS / Layout

- `.chromeless-panel`: `display: none` by default; `display: block` when `:not([hidden])`.
- `.phone-frame`: no override of `[hidden]`; relies on native `display: none`.
- Right panel: `display: flex; flex-direction: column` when split. Hidden viewports do not participate in layout.

---

## 2. Root Cause

### Primary

**Dual iframe architecture with shared container and mode switching.** Two iframes coexist; visibility is toggled via `hidden`. This creates:

1. **Stale content:** Chromeless iframe keeps its document when hidden. On re-select, we set `chromelessIframe.src = url`, which triggers a reload. Until load completes, the previous document (e.g. Knob detail) can briefly render → "stale floating mockup surface."
2. **Blank canvas:** Chromeless iframe starts at 120px height and `about:blank` until content loads. During load, or if height sync fails, a blank area appears.
3. **Overlapping / competing viewports:** Both panels live in the same flex container. If `hidden` is applied asynchronously or there is a timing edge case, both can be visible momentarily.

### Secondary

- **No single viewport:** The shell switches between two viewports instead of one. State is split between "which panel" and "which URL."
- **Child navigation invisible to shell:** Component list ↔ detail happens inside the chromeless iframe. The shell only knows "Component mockups" is active, not whether the list or a detail page is shown.
- **Target attribute mismatch:** Links point at `mockupViewport` even for chromeless; relies on `preventDefault` to avoid wrong-frame loads.

---

## 3. Architecture Problems

### 3.1 Duplicated State Ownership

- Shell owns: selected mockup, panel visibility, phone vs chromeless mode.
- Child owns: list vs detail inside chromeless.
- No single source of truth for "what is currently displayed."

### 3.2 Iframe State Leakage

- Chromeless iframe retains its document when hidden.
- Phone-frame iframe is cleared to `about:blank` when switching to chromeless, but chromeless iframe is not cleared when hiding the right panel.
- Both iframes can hold stale content across mode switches.

### 3.3 Parent–Child Responsibility Conflicts

- Shell decides which mockup to load.
- Chromeless page decides list vs detail via in-iframe navigation.
- Close button in chromeless page calls `window.parent.clearVstChromelessMockup()` → shell clears selection. Shell and child both affect "close" behavior.

### 3.4 Fragile Mode Switching

- `setViewportMode()` must correctly hide one panel and show the other.
- `applyActiveMockupViewport()` must run after `applyLayout()` and correctly set `src` for both iframes.
- Order of operations and timing can produce brief blank or stale states.

### 3.5 Legacy / Overcorrection

- `target="mockupViewport"` is redundant for chromeless (handled by JS).
- Comment "Idle: hide the entire mockup pane so no blank component or placeholder renders" suggests prior blank-state fixes; current design still allows blank/stale.

---

## 4. Proposed Architecture

### 4.1 Single Viewport Model

**One iframe** in the right panel. The shell chooses:

- **Frame mode:** phone (with chrome) or chromeless (no chrome).
- **URL:** the mockup to load.

Chrome (traffic lights, rounded frame) is a **shell-level overlay** when in phone mode, not a separate structural layer.

### 4.2 Viewport Surfaces

| Mode | Structure | Behavior |
|------|-----------|----------|
| **Phone** | One iframe inside `.phone-frame` | Frame chrome visible; iframe shows mockup |
| **Chromeless** | Same iframe, chrome hidden | Frame chrome hidden; iframe shows mockup full-bleed |

**One iframe, one `src`.** Mode only affects whether the chrome wrapper is visible.

### 4.3 State Ownership

- **Shell owns all mockup state:** selected link, mode (phone vs chromeless), panel visibility.
- **Single `applyViewport()`:** Given selected link → set mode, set iframe `src`, show/hide chrome.
- **Child pages:** Can call `parent.clearVstChromelessMockup()` to close; no other shell state.

### 4.4 Selection and Clearing

- Clicking a mockup link: set `is-active`, call `applyViewport()`.
- Close button: clear `is-active`, call `applyViewport()` (which hides panel when nothing selected).
- When hiding the right panel: set iframe `src = "about:blank"` so no stale document remains.

### 4.5 Component List vs Detail

- **Option A (recommended):** Keep in-iframe navigation. Shell loads `components-chromeless.html`; list and detail are child navigation. Shell does not track list vs detail.
- **Option B:** Shell could load list and detail URLs directly, but that would require more shell logic and URL handling.

### 4.6 Avoiding Stale Rendering

- One iframe → no mode-switch race between two iframes.
- Clear iframe `src` when hiding the panel.
- Set `src` only when the panel is visible and the correct mode is active.

### 4.7 Fit for GitHub Pages

- Static HTML/CSS/JS; no build step.
- No new dependencies.
- Same file structure; only shell logic and DOM change.

### 4.8 Performance and Responsiveness

- One iframe reduces DOM and layout complexity.
- Clearing `src` on hide avoids keeping unnecessary documents in memory.
- Responsive behavior unchanged; chrome visibility is a CSS toggle.

---

## 5. Task List

1. **Refactor to single iframe**
   - Remove `#chromeless-panel` and `#chromeless-iframe`.
   - Keep `#phone-frame` and `#mockup-iframe` as the only viewport.
   - Add a chromeless mode that hides the frame chrome (traffic lights, rounded border) via a class on `#phone-frame` or a wrapper.

2. **Unify viewport logic**
   - Replace `setViewportMode()` and `applyActiveMockupViewport()` with a single `applyViewport()`.
   - For chromeless mockups: load URL in the single iframe, apply chromeless class to hide chrome.
   - For standard mockups: load URL in the same iframe, remove chromeless class.

3. **Clear iframe on hide**
   - In `hideAllMockupViewports()` (or equivalent), set `iframe.src = "about:blank"` when hiding the right panel.

4. **Update mockup links**
   - Remove `target="mockupViewport"` from chromeless link if it causes confusion, or keep for fallback when JS is disabled.
   - Ensure all mockup links work with the single-iframe flow.

5. **Update CSS**
   - Add `.phone-frame--chromeless` (or similar) to hide chrome when in chromeless mode.
   - Reuse chromeless height logic (e.g. `syncChromelessIframeHeight`) for the single iframe when in chromeless mode.
   - Remove `.chromeless-panel` and `.right-panel--chromeless-active` rules that are no longer needed.

6. **Update tests**
   - Adjust `mockup-mode-switch.test.js` for single-iframe behavior.
   - Add a test that the iframe is cleared when the panel is hidden.

7. **Update docs**
   - `docs/MOCKUPS.md`, `documents/design-guide.html`: describe single-iframe architecture.

---

## 6. GitHub Issue Ready Tasks

### Issue 1: Refactor to single iframe viewport

**Title:** Refactor mockup system to use a single iframe viewport

**Problem:** The shell uses two iframes (phone-frame and chromeless-panel) that are toggled via `hidden`. This leads to blank canvas, stale content, and overlapping viewports when opening Component mockups.

**Proposed change:** Use one iframe (`#mockup-iframe`) for all mockups. In chromeless mode, hide the phone-frame chrome (traffic lights, rounded border) via CSS. Remove `#chromeless-panel` and `#chromeless-iframe`.

**Acceptance criteria:**
- [ ] Only one iframe exists in the right panel
- [ ] Component mockups load in the same iframe as other mockups
- [ ] Chromeless mode hides frame chrome only; same iframe is used
- [ ] No blank canvas when opening Component mockups
- [ ] No stale content from previous mockups

**Dependencies:** None

**Risk level:** Medium — structural change to shell and CSS

**Suggested labels:** `bug`, `architecture`, `mockups`

---

### Issue 2: Unify viewport application logic

**Title:** Unify viewport logic into single applyViewport function

**Problem:** `setViewportMode()` and `applyActiveMockupViewport()` split responsibility and can get out of sync. Mode switching and URL loading are spread across multiple functions.

**Proposed change:** Replace with a single `applyViewport()` that, given the active mockup link, sets chrome visibility, iframe `src`, and panel visibility. Remove `setViewportMode()` and simplify `applyActiveMockupViewport()`.

**Acceptance criteria:**
- [ ] One function drives all viewport updates
- [ ] Chromeless vs phone mode is a single branch
- [ ] No duplicate logic for hiding/showing panels

**Dependencies:** Issue 1 (single iframe)

**Risk level:** Low

**Suggested labels:** `refactor`, `mockups`

---

### Issue 3: Clear iframe when panel is hidden

**Title:** Clear mockup iframe src when right panel is hidden

**Problem:** When the right panel is hidden (e.g. closing Mockups or clearing selection), the iframe can retain its document. On reopen, this can cause stale content to appear briefly.

**Proposed change:** In the logic that hides the right panel, set `iframe.src = "about:blank"` so no document remains loaded.

**Acceptance criteria:**
- [ ] Iframe is cleared when panel is hidden
- [ ] No stale content when reopening mockups
- [ ] No regression for standard mockup switching

**Dependencies:** Issue 1, 2

**Risk level:** Low

**Suggested labels:** `bug`, `mockups`

---

### Issue 4: Update CSS for chromeless mode on single iframe

**Title:** Add chromeless mode styles for single-iframe viewport

**Problem:** Chromeless mockups currently use a separate panel and iframe. After moving to a single iframe, chromeless mode must hide the phone-frame chrome while keeping the same iframe.

**Proposed change:** Add `.phone-frame--chromeless` (or equivalent) to hide traffic lights and frame styling. Adapt chromeless height sync (ResizeObserver, `syncChromelessIframeHeight`) to work with the single iframe. Remove `.chromeless-panel` and `.right-panel--chromeless-active` rules.

**Acceptance criteria:**
- [ ] Chromeless mockups show without device chrome
- [ ] Iframe height still follows content in chromeless mode
- [ ] No leftover chromeless-panel styles

**Dependencies:** Issue 1

**Risk level:** Low

**Suggested labels:** `style`, `mockups`

---

### Issue 5: Update mockup mode switch tests

**Title:** Update mockup-mode-switch tests for single-iframe architecture

**Problem:** `mockup-mode-switch.test.js` asserts on dual-iframe behavior (chromeless clears standard iframe, standard clears chromeless). This no longer applies with a single iframe.

**Proposed change:** Rewrite tests to assert: (1) chromeless mockups load in the single iframe with chrome hidden, (2) standard mockups load with chrome visible, (3) iframe is cleared when panel is hidden.

**Acceptance criteria:**
- [ ] Tests pass with single-iframe implementation
- [ ] Tests cover chromeless and standard modes
- [ ] Test for iframe clear on hide

**Dependencies:** Issue 1, 2, 3

**Risk level:** Low

**Suggested labels:** `testing`, `mockups`

---

### Issue 6: Update documentation for single-iframe architecture

**Title:** Update MOCKUPS.md and design guide for single-iframe viewport

**Problem:** `docs/MOCKUPS.md` and `documents/design-guide.html` describe the dual-iframe setup. After refactoring, docs should match the new architecture.

**Proposed change:** Update both to describe a single iframe, chromeless mode as a chrome-visibility toggle, and the simplified flow.

**Acceptance criteria:**
- [ ] MOCKUPS.md reflects single-iframe design
- [ ] Design guide table matches implementation
- [ ] No references to chromeless-panel or chromeless-iframe

**Dependencies:** Issue 1

**Risk level:** Low

**Suggested labels:** `docs`, `mockups`

---

## 7. Performance / Hosting Notes

### GitHub Pages

- No change to static hosting model.
- Fewer DOM nodes (one iframe instead of two) may slightly reduce memory and layout cost.

### Caching

- No change. Static assets remain cacheable.

### Runtime Cost

- One iframe instead of two.
- ResizeObserver and height sync remain for chromeless mode.
- Clearing iframe on hide can reduce memory by unloading documents.

### Responsiveness

- Same responsive breakpoints and layout.
- Chromeless height sync continues to work for variable-length content.

### Deploy Simplicity

- No new build step or config.
- Deploy flow unchanged.

---

## 8. Risks / Migration Notes

### Regressions

- **Component close button:** Still calls `window.parent.clearVstChromelessMockup()`. Ensure that function continues to clear selection and hide the panel.
- **Chromeless height sync:** Must work with the single iframe; verify ResizeObserver and `syncChromelessIframeHeight` when chrome is hidden.
- **Links with `target="mockupViewport"`:** If JS fails or is disabled, links would load in the iframe. With one iframe, both standard and chromeless URLs would load there. Behavior should remain correct.

### Cleanup

- Remove `chromelessResizeObserver`, `attachChromelessResizeTracking`, `disconnectChromelessResizeTracking` if they become redundant, or adapt them for the single iframe.
- Remove `window.clearVstChromelessMockup` only if the close flow changes; otherwise keep it.

### Browser Compatibility

- `hidden` and `iframe.src` are widely supported.
- ResizeObserver has good support; no change from current usage.

---

## 9. Questions / Assumptions

### Assumptions

- Component list and detail navigation can stay inside the iframe (`target="_self"`). The shell does not need to track list vs detail.
- One iframe is sufficient for all mockup types.
- Hiding the phone-frame chrome via CSS is acceptable for chromeless mode (no separate structural panel).

### Open Questions

- Should `target="mockupViewport"` be removed from the Component mockups link to avoid confusion, or kept for no-JS fallback?
- Is there a requirement to persist "last selected mockup" or "last chromeless sub-page" across reloads? (Current design does not persist mockup selection.)

---

## Implementation Complete

Single-iframe architecture implemented. All tests pass. Manual verification recommended:

1. Open Mockups → Component mockups → only the list should render; no blank canvas.
2. Switch between standard mockups (Settings, etc.) and Component mockups; no stale content.
3. Close mockup; panel hides, iframe cleared.
