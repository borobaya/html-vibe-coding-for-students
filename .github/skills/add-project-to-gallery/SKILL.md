---
name: add-project-to-gallery
description: "Add a new student project to the gallery. Use when: you create a new project folder for a student, or you detect a new project that isn't listed in the root README.md or index.html."
---

# Add a New Project to the Gallery

When you create a new project folder for a student, add it to the **Your Projects** section in both the root `README.md` and `index.html`. Do this automatically as part of setting up the project — don't wait for the student to ask.

## Procedure

### 1. Root `README.md`

Add a new row to the table under the **Your Projects** heading. Use this exact format:

```markdown
| ![](folder-name/assets/thumbnail.png) | [folder-name](folder-name/README.md) | Short description |
```

### 2. Root `index.html`

Add a new `<li>` inside the `<ul class="projects">` under the **Your Projects** `<h2>`. Use this exact format:

```html
<li><a href="folder-name/index.html"><img src="folder-name/assets/thumbnail.png" alt="Project Name preview"><span>Project Name</span></a></li>
```

If the project doesn't have a thumbnail yet, leave the `<img>` tag in place — it will show once a screenshot is taken later.

### 3. Project `README.md`

Make sure the project's own `README.md` has the nav bar at the top:

```markdown
[← Back to all projects](../README.md) | [🌐 Open Website](index.html)
```
