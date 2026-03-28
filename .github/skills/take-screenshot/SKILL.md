---
name: take-screenshot
description: "Take a screenshot and generate a thumbnail for a project. Use when: a new project is created, a project's appearance has changed, a student asks to update the preview image, or after significant visual changes to a project."
---

# Take a Project Screenshot

Captures a screenshot of a project's `index.html` and generates a 256px thumbnail for the gallery.

## When to Use

- After creating a new project
- After making significant visual changes to a project
- When a student asks to update the preview or thumbnail
- When a project's gallery thumbnail is missing or outdated

## Procedure

### 1. Run the Screenshot Script

```bash
node .github/skills/take-screenshot/scripts/screenshot.js <project-folder>
```

Replace `<project-folder>` with the folder name (e.g. `my-cool-site`).

This will:
- Spin up a local server for the project
- Open it in a headless browser at 1280×800
- Wait for the page to fully load
- Save `assets/screenshot.png`
- Generate `assets/thumbnail.png` (256px tall)

### 2. Verify the Screenshot

After running the script, check the screenshot looks correct. If the page needs interaction first (e.g. clicking a button, filling in a form) to look representative, do that manually in the project before taking the screenshot, or run the screenshot script and review the result.

### 3. Output Files

| File | Purpose |
|------|---------|
| `<project>/assets/screenshot.png` | Full-size screenshot (1280×800) |
| `<project>/assets/thumbnail.png` | Gallery thumbnail (256px height) |

Both files are referenced by the root `README.md` and `index.html` for the project gallery.
