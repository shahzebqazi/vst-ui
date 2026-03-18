# Handoff prompt: Example plugin mockups

Repository: **vst-ui** — static HTML mockups loaded in the shell iframe from `index.html`.

The shell lists **four** example plugin targets under **Example plugin mockups**:

| File | Label |
| ---- | ----- |
| `mockups/example-utility.html` | Utility |
| `mockups/example-pan.html` | Pan |
| `mockups/example-eq.html` | EQ |
| `mockups/example-saturator.html` | Saturator |

Shared styles: `mockups/example-plugin-mockup.css` (blank canvas + centered title).

## When extending

- Flesh out controls inside each page or split shared chrome; keep self-contained HTML/CSS unless a build step is added.
- Add new shell entries in `index.html` if more example plugins are needed.
- Follow **PLAYBOOK.md** for commits and pushes.
