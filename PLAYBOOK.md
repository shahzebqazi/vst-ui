# Capture Plugin Documentation and Mockup Playbook

This playbook defines an execution workflow in Cursor for generating and maintaining Capture Plugin requirements, mockups, diagrams, and HTML previews.

## Working Mode

- Work in Cursor ([cursor.com](https://cursor.com)).
- Use this repository as the source of truth.
- Apply one logical change at a time.
- After each logical change, commit and push.

## Phase 0: Instantiate Repository

Run this phase once when starting a new project from an empty folder.

1. Initialize git with `main`.
2. Add minimal scaffold (`README.md`, `.gitignore`).
3. Commit the scaffold.
4. Create remote repository with `gh repo create ... --source=. --remote=origin --push` or create in GitHub UI and add remote manually.
5. Confirm `main` tracks `origin/main`.

## Commit and Push Rule (Mandatory)

After every code or documentation modification:

1. `git add` only touched paths.
2. `git commit` with a precise message.
3. `git push origin main`.

Do not batch unrelated changes into a single commit unless explicitly requested by the user.

If push fails, stop and report the failure before proceeding.

## Cursor Model Traceability Rule (Mandatory)

Every commit message must include the model tag line in the body:

`Agent-model: <ModelDisplayName>`

Use the current model display name shown in Cursor.

## Commit Message Convention

- `docs:` for markdown documentation changes
- `mockups:` for HTML mockup changes
- `style:` for CSS changes
- `chore:` for repository/setup changes

Examples:

- `docs: add menu inventory worksheet`
- `mockups: add settings screen structure`
- `style: add blueprint paper and dot backgrounds`

## Deliverables

- `docs/REQUIREMENTS.md`
- `docs/MENU_INVENTORY.md`
- `docs/MOCKUPS.md`
- `docs/DIAGRAMS.md`
- `styles/backgrounds.css`
- `index.html`
- `mockups/*.html` for each top-level menu

## Prompt Workflow (Mandatory)

Use this exact two-round solicitation workflow before finalizing requirements.

### Prompt A: Top-Level Menus

Ask the user:

`Provide your final top-level menu list (add, rename, remove as needed).`

Starter baseline:

- Home
- Capture Modes
- History
- Export
- Settings
- Help

### Prompt B: Items Per Menu

For each final menu from Prompt A, ask:

`Under "<MenuName>", list every row, tab, section, and action the user should see. Mark each as MUST or NICE.`

Do this for every menu. No exceptions.

## Completion Gate for Requirements

`docs/REQUIREMENTS.md` is not considered complete until:

- Every menu in `docs/MENU_INVENTORY.md` has items, or explicit `N/A`.
- No unresolved `TODO` markers remain for core menu structure.

## Artifact Build Order

1. Create and fill `docs/MENU_INVENTORY.md`.
2. Sync finalized menu structure into `docs/REQUIREMENTS.md`.
3. Update `docs/MOCKUPS.md` and `docs/DIAGRAMS.md` Mermaid blocks to match menu structure.
4. Build or update `index.html`, `styles/backgrounds.css`, and `mockups/*.html`.
5. Verify the shell navigation and right-pane rendering.

Commit and push after each step.

## Sync Procedure: Inventory to Docs and HTML

Whenever menu items change, run this sequence in order:

1. Update the relevant menu section in `docs/MENU_INVENTORY.md`, then commit and push.
2. Mirror those menu changes into `docs/REQUIREMENTS.md`, then commit and push.
3. Update Mermaid structures in `docs/MOCKUPS.md` and `docs/DIAGRAMS.md`, then commit and push.
4. Update corresponding screen content in `mockups/*.html` and any shell navigation references in `index.html`, then commit and push.

Do not skip steps, and do not mark the sync complete until every updated layer has been committed and pushed.

## HTML Mockup Rules

- Left column: menu list.
- Right column: phone-sized viewport (`390x844` suggested).
- Clicking a left menu item loads its corresponding mockup page.
- Mockups should represent only defined menu items.

## Background Styles

Implement these CSS-only options in `styles/backgrounds.css`:

1. Blueprint: blue background with white grid lines.
2. Paper: paper-toned background with brown grid lines.
3. Dark Dots: black background with dot pattern.

## Verification Checklist

Before declaring a step complete:

1. Confirm files exist and links are correct.
2. Confirm Mermaid syntax is valid.
3. Confirm each changed step was committed and pushed.
4. Confirm model tag is present in commit body.

## GitHub Pages

For static publishing:

- Use `main` branch and either root or `/docs` source.
- Ensure the served path contains `index.html`.
- Record the live URL in `docs/REQUIREMENTS.md` when available.
