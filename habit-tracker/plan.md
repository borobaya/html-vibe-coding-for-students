# Habit Tracker — Implementation Plan

---

## 1. Overview

### What It Is

A browser-based daily habit tracker that lets users create custom habits, check them off each day, monitor streaks, and visualise long-term consistency on a GitHub-style calendar heatmap. All data is persisted in `localStorage` — no backend, no sign-up, no build tools.

### User Flow

1. **First visit** — The app loads with an empty habit list and a blank heatmap grid. A friendly empty-state message prompts the user to add their first habit.
2. **Adding a habit** — The user types a habit name (e.g. "Read 20 pages") into the input field, optionally picks an emoji icon, and clicks **Add Habit**. The habit card appears instantly in the list.
3. **Daily check-off** — Each habit card shows a checkbox for today's date. Clicking it toggles the habit between complete and incomplete for that day. A subtle check animation plays on completion.
4. **Viewing streaks** — Each habit card displays the current streak (consecutive days completed up to today) and the longest streak ever. A 🔥 emoji appears next to active streaks ≥ 3 days.
5. **Calendar heatmap** — Below the habit list, a 52-week × 7-day grid (like GitHub's contribution graph) shows overall daily activity for the past year. Each cell's colour intensity reflects the percentage of habits completed that day. Hovering a cell shows a tooltip with the date and completion count.
6. **Stats summary** — A stats bar shows total habits tracked, today's completion rate, overall completion rate, and the best single-day count.
7. **Editing / deleting** — Users can rename a habit or delete it (with confirmation). Deleting removes the habit and all its completion history.
8. **Data persistence** — Every change is immediately saved to `localStorage`. On reload the app restores all habits, completions, and the heatmap.

---

## 2. Page Layout

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  🎯 Habit Tracker              [Reset All Data]            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  STATS BAR                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Total    │ │ Today    │ │ Overall  │ │ Best Day │           │
│  │ Habits:5 │ │ 3/5 60% │ │ 72%      │ │ 5/5      │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  ADD HABIT FORM                                                  │
│  ┌────────────────────────────────────┐ ┌───┐ ┌──────────┐     │
│  │  Enter a new habit...              │ │ 😀│ │ + Add    │     │
│  └────────────────────────────────────┘ └───┘ └──────────┘     │
│                                                                  │
│  HABIT LIST                                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [✓] 📖 Read 20 pages        🔥 Streak: 7  Best: 14       │  │
│  │                                          [Edit] [Delete]   │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ [ ] 🏃 Run 5km              Streak: 0    Best: 21         │  │
│  │                                          [Edit] [Delete]   │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ [✓] 💧 Drink 2L water       🔥 Streak: 30 Best: 30       │  │
│  │                                          [Edit] [Delete]   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  CALENDAR HEATMAP                                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │         ◄ 2026                                    ►        │  │
│  │     Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep ...        │  │
│  │ Mon  ░░  ▒▒  ▓▓  ██  ░░  ▒▒  ▓▓  ██  ░░  ...            │  │
│  │ Tue  ░░  ░░  ▒▒  ▓▓  ██  ░░  ▒▒  ▓▓  ██  ...            │  │
│  │ Wed  ▒▒  ░░  ░░  ▒▒  ▓▓  ██  ░░  ▒▒  ▓▓  ...            │  │
│  │ Thu  ▓▓  ▒▒  ░░  ░░  ▒▒  ▓▓  ██  ░░  ▒▒  ...            │  │
│  │ Fri  ██  ▓▓  ▒▒  ░░  ░░  ▒▒  ▓▓  ██  ░░  ...            │  │
│  │ Sat  ░░  ██  ▓▓  ▒▒  ░░  ░░  ▒▒  ▓▓  ██  ...            │  │
│  │ Sun  ▒▒  ░░  ██  ▓▓  ▒▒  ░░  ░░  ▒▒  ▓▓  ...            │  │
│  │                                                            │  │
│  │  □ No activity  ░ 1–25%  ▒ 26–50%  ▓ 51–75%  █ 76–100%  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  FOOTER                                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Data saved locally in your browser. Nothing sent online.  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Dimensions & Responsive Behaviour

| Breakpoint      | Width        | Layout Changes                                                         |
| --------------- | ------------ | ---------------------------------------------------------------------- |
| Desktop         | ≥ 1024px     | Max-width 900px centred. Stats bar in a row of 4 cards. Full heatmap.  |
| Tablet          | 600–1023px   | Stats bar wraps to 2 × 2 grid. Heatmap scrolls horizontally.          |
| Mobile          | < 600px      | Stats stack vertically. Habit cards full-width. Heatmap scrolls.       |

- Heatmap cell size: **13px × 13px** on desktop, **11px × 11px** on tablet, **10px × 10px** on mobile.
- Heatmap gap between cells: **3px**.
- Heatmap container gets `overflow-x: auto` on smaller screens so users can scroll through the year.

---

## 3. Colour Scheme & Typography

### Colour Palette

| Token                    | CSS Variable                | Hex       | Usage                                           |
| ------------------------ | --------------------------- | --------- | ----------------------------------------------- |
| Background               | `--clr-bg`                  | `#0d1117` | Page background (dark theme)                    |
| Surface                  | `--clr-surface`             | `#161b22` | Card backgrounds, form inputs                   |
| Surface Raised           | `--clr-surface-raised`      | `#21262d` | Hover states, active cards                      |
| Border                   | `--clr-border`              | `#30363d` | Card borders, dividers                          |
| Text Primary             | `--clr-text`                | `#e6edf3` | Main body text                                  |
| Text Secondary           | `--clr-text-secondary`      | `#8b949e` | Labels, placeholders, secondary info            |
| Accent                   | `--clr-accent`              | `#58a6ff` | Links, focus rings, active elements             |
| Accent Hover             | `--clr-accent-hover`        | `#79c0ff` | Accent on hover                                 |
| Success                  | `--clr-success`             | `#3fb950` | Completed checkmarks, positive stats            |
| Danger                   | `--clr-danger`              | `#f85149` | Delete buttons, destructive actions             |
| Danger Hover             | `--clr-danger-hover`        | `#ff7b72` | Danger on hover                                 |
| Warning / Streak Fire    | `--clr-warning`             | `#d29922` | Streak fire icon highlight                      |
| Heatmap Level 0 (empty)  | `--clr-heatmap-0`           | `#161b22` | 0% — No completions                             |
| Heatmap Level 1          | `--clr-heatmap-1`           | `#0e4429` | 1–25% of habits completed                       |
| Heatmap Level 2          | `--clr-heatmap-2`           | `#006d32` | 26–50% of habits completed                      |
| Heatmap Level 3          | `--clr-heatmap-3`           | `#26a641` | 51–75% of habits completed                      |
| Heatmap Level 4 (max)    | `--clr-heatmap-4`           | `#39d353` | 76–100% of habits completed                     |
| Tooltip Background       | `--clr-tooltip-bg`          | `#1b1f23` | Tooltip background                              |
| Tooltip Text             | `--clr-tooltip-text`        | `#f0f6fc` | Tooltip text colour                             |

### Typography

| Element        | Font Family                          | Size    | Weight | Line Height |
| -------------- | ------------------------------------ | ------- | ------ | ----------- |
| Page title     | `'Segoe UI', system-ui, sans-serif`  | 1.75rem | 700    | 1.2         |
| Section title  | `'Segoe UI', system-ui, sans-serif`  | 1.25rem | 600    | 1.3         |
| Body text      | `'Segoe UI', system-ui, sans-serif`  | 0.95rem | 400    | 1.5         |
| Habit name     | `'Segoe UI', system-ui, sans-serif`  | 1.05rem | 500    | 1.4         |
| Stats number   | `'Segoe UI', system-ui, sans-serif`  | 1.5rem  | 700    | 1.2         |
| Stats label    | `'Segoe UI', system-ui, sans-serif`  | 0.75rem | 400    | 1.4         |
| Heatmap labels | `'Segoe UI', system-ui, sans-serif`  | 0.65rem | 400    | 1.0         |
| Button text    | `'Segoe UI', system-ui, sans-serif`  | 0.85rem | 600    | 1.0         |
| Tooltip        | `'Segoe UI', system-ui, sans-serif`  | 0.75rem | 400    | 1.3         |

### CSS Variables Block

```css
:root {
  /* Colours */
  --clr-bg: #0d1117;
  --clr-surface: #161b22;
  --clr-surface-raised: #21262d;
  --clr-border: #30363d;
  --clr-text: #e6edf3;
  --clr-text-secondary: #8b949e;
  --clr-accent: #58a6ff;
  --clr-accent-hover: #79c0ff;
  --clr-success: #3fb950;
  --clr-danger: #f85149;
  --clr-danger-hover: #ff7b72;
  --clr-warning: #d29922;
  --clr-heatmap-0: #161b22;
  --clr-heatmap-1: #0e4429;
  --clr-heatmap-2: #006d32;
  --clr-heatmap-3: #26a641;
  --clr-heatmap-4: #39d353;
  --clr-tooltip-bg: #1b1f23;
  --clr-tooltip-text: #f0f6fc;

  /* Typography */
  --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --fs-title: 1.75rem;
  --fs-section: 1.25rem;
  --fs-body: 0.95rem;
  --fs-habit: 1.05rem;
  --fs-stat-number: 1.5rem;
  --fs-stat-label: 0.75rem;
  --fs-heatmap: 0.65rem;
  --fs-button: 0.85rem;
  --fs-tooltip: 0.75rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Heatmap */
  --heatmap-cell: 13px;
  --heatmap-gap: 3px;
}
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Track daily habits, monitor streaks, and visualise progress on a GitHub-style heatmap." />
  <title>Habit Tracker</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <div class="app" id="app">

    <!-- ═══ HEADER ═══ -->
    <header class="header">
      <h1 class="header__title">🎯 Habit Tracker</h1>
      <button
        class="btn btn--danger btn--sm"
        id="btn-reset-all"
        aria-label="Reset all data"
      >
        Reset All
      </button>
    </header>

    <!-- ═══ STATS BAR ═══ -->
    <section class="stats" aria-label="Progress statistics">
      <div class="stats__card">
        <span class="stats__number" id="stat-total">0</span>
        <span class="stats__label">Total Habits</span>
      </div>
      <div class="stats__card">
        <span class="stats__number" id="stat-today">0/0</span>
        <span class="stats__label">Done Today</span>
      </div>
      <div class="stats__card">
        <span class="stats__number" id="stat-overall">0%</span>
        <span class="stats__label">Overall Rate</span>
      </div>
      <div class="stats__card">
        <span class="stats__number" id="stat-best-day">0</span>
        <span class="stats__label">Best Day</span>
      </div>
    </section>

    <!-- ═══ ADD HABIT FORM ═══ -->
    <section class="add-habit" aria-label="Add a new habit">
      <form class="add-habit__form" id="form-add-habit" autocomplete="off">
        <label for="input-habit-name" class="sr-only">Habit name</label>
        <input
          type="text"
          id="input-habit-name"
          class="add-habit__input"
          placeholder="Enter a new habit..."
          maxlength="60"
          required
        />

        <label for="input-habit-emoji" class="sr-only">Emoji icon</label>
        <input
          type="text"
          id="input-habit-emoji"
          class="add-habit__emoji"
          placeholder="😀"
          maxlength="2"
          aria-label="Optional emoji icon for the habit"
        />

        <button type="submit" class="btn btn--accent">
          <span aria-hidden="true">+</span> Add Habit
        </button>
      </form>
    </section>

    <!-- ═══ HABIT LIST ═══ -->
    <section class="habits" aria-label="Your habits">
      <h2 class="section-title">Today's Habits</h2>

      <!-- Empty state (shown when no habits exist) -->
      <div class="habits__empty" id="habits-empty" role="status">
        <p>No habits yet. Add one above to get started!</p>
      </div>

      <!-- Habit cards rendered here by JS -->
      <ul class="habits__list" id="habits-list" role="list">
        <!--
          Template for each habit card (rendered by ui.js):
          <li class="habit-card" data-habit-id="uuid">
            <div class="habit-card__main">
              <label class="habit-card__check">
                <input type="checkbox" class="habit-card__checkbox"
                       aria-label="Mark 'Read 20 pages' as done today" />
                <span class="habit-card__checkmark"></span>
              </label>
              <span class="habit-card__emoji" aria-hidden="true">📖</span>
              <span class="habit-card__name">Read 20 pages</span>
            </div>
            <div class="habit-card__streaks">
              <span class="habit-card__fire" aria-label="Active streak">🔥</span>
              <span class="habit-card__streak">Streak: 7</span>
              <span class="habit-card__best">Best: 14</span>
            </div>
            <div class="habit-card__actions">
              <button class="btn btn--ghost btn--sm btn-edit"
                      aria-label="Edit habit">Edit</button>
              <button class="btn btn--danger btn--sm btn-delete"
                      aria-label="Delete habit">Delete</button>
            </div>
          </li>
        -->
      </ul>
    </section>

    <!-- ═══ CALENDAR HEATMAP ═══ -->
    <section class="heatmap-section" aria-label="Activity heatmap">
      <div class="heatmap-section__header">
        <h2 class="section-title">Activity</h2>
        <div class="heatmap-section__nav">
          <button class="btn btn--ghost btn--sm" id="btn-heatmap-prev" aria-label="Previous year">◄</button>
          <span class="heatmap-section__year" id="heatmap-year">2026</span>
          <button class="btn btn--ghost btn--sm" id="btn-heatmap-next" aria-label="Next year">►</button>
        </div>
      </div>

      <div class="heatmap-wrapper" id="heatmap-wrapper">
        <!-- Day labels column -->
        <div class="heatmap__day-labels" aria-hidden="true">
          <span></span><!-- blank for alignment -->
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>

        <!-- Month labels row + grid rendered by heatmap.js -->
        <div class="heatmap" id="heatmap-grid" role="img" aria-label="Habit completion heatmap for the past year">
          <!-- Month labels and cells injected by JS -->
        </div>
      </div>

      <!-- Legend -->
      <div class="heatmap__legend" aria-label="Heatmap intensity legend">
        <span class="heatmap__legend-label">Less</span>
        <span class="heatmap__legend-cell" style="background:var(--clr-heatmap-0);" title="No activity"></span>
        <span class="heatmap__legend-cell" style="background:var(--clr-heatmap-1);" title="1–25%"></span>
        <span class="heatmap__legend-cell" style="background:var(--clr-heatmap-2);" title="26–50%"></span>
        <span class="heatmap__legend-cell" style="background:var(--clr-heatmap-3);" title="51–75%"></span>
        <span class="heatmap__legend-cell" style="background:var(--clr-heatmap-4);" title="76–100%"></span>
        <span class="heatmap__legend-label">More</span>
      </div>
    </section>

    <!-- ═══ HEATMAP TOOLTIP (positioned absolutely, hidden by default) ═══ -->
    <div class="tooltip" id="heatmap-tooltip" role="tooltip" aria-hidden="true">
      <span class="tooltip__text" id="tooltip-text"></span>
    </div>

    <!-- ═══ EDIT MODAL ═══ -->
    <dialog class="modal" id="modal-edit">
      <form method="dialog" class="modal__form" id="form-edit-habit">
        <h3 class="modal__title">Edit Habit</h3>

        <label for="edit-habit-name" class="modal__label">Name</label>
        <input type="text" id="edit-habit-name" class="modal__input" maxlength="60" required />

        <label for="edit-habit-emoji" class="modal__label">Emoji</label>
        <input type="text" id="edit-habit-emoji" class="modal__input" maxlength="2" />

        <div class="modal__actions">
          <button type="button" class="btn btn--ghost" id="btn-edit-cancel">Cancel</button>
          <button type="submit" class="btn btn--accent">Save</button>
        </div>
      </form>
    </dialog>

    <!-- ═══ CONFIRM DELETE MODAL ═══ -->
    <dialog class="modal" id="modal-delete">
      <div class="modal__content">
        <h3 class="modal__title">Delete Habit?</h3>
        <p class="modal__text">This will permanently remove the habit and all its history.</p>
        <div class="modal__actions">
          <button type="button" class="btn btn--ghost" id="btn-delete-cancel">Cancel</button>
          <button type="button" class="btn btn--danger" id="btn-delete-confirm">Delete</button>
        </div>
      </div>
    </dialog>

    <!-- ═══ FOOTER ═══ -->
    <footer class="footer">
      <p>Data saved locally in your browser. Nothing is sent online.</p>
    </footer>

  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Accessibility Details

- Screen-reader-only class `.sr-only` hides labels visually while keeping them accessible.
- Every interactive element has an `aria-label` or visible `<label>`.
- The heatmap uses `role="img"` with an `aria-label` describing its purpose.
- Modals use the native `<dialog>` element for built-in focus trapping.
- Checkboxes include the habit name in their `aria-label` (set dynamically by JS).
- `role="status"` on the empty state so screen readers announce when habits are added.

---

## 5. CSS Design

### Layout Strategy

```
.app            → max-width: 900px; margin: 0 auto; padding: var(--space-lg);
.header         → display: flex; justify-content: space-between; align-items: center;
.stats          → display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md);
.add-habit__form → display: flex; gap: var(--space-sm);
.habits__list   → display: flex; flex-direction: column; gap: var(--space-sm);
.habit-card     → display: grid; grid-template-columns: 1fr auto auto; align-items: center;
```

### Heatmap Grid Layout

```css
.heatmap {
  display: grid;
  /* 53 columns: 1 for month labels + 52 weeks */
  grid-template-columns: repeat(53, var(--heatmap-cell));
  grid-template-rows: auto repeat(7, var(--heatmap-cell));
  gap: var(--heatmap-gap);
}

.heatmap__month-label {
  grid-row: 1;
  font-size: var(--fs-heatmap);
  color: var(--clr-text-secondary);
}

.heatmap__cell {
  width: var(--heatmap-cell);
  height: var(--heatmap-cell);
  border-radius: 2px;
  background: var(--clr-heatmap-0);
  cursor: pointer;
  transition: outline 0.15s ease;
}

.heatmap__cell:hover {
  outline: 2px solid var(--clr-accent);
  outline-offset: -1px;
}
```

### Habit Card Styling

```css
.habit-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: var(--space-sm);
  transition: background 0.2s ease;
}

.habit-card:hover {
  background: var(--clr-surface-raised);
}

.habit-card--completed {
  border-left: 3px solid var(--clr-success);
}
```

### Check-Off Animation

```css
/* Checkbox custom styling */
.habit-card__checkbox {
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid var(--clr-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.habit-card__checkbox:checked {
  background: var(--clr-success);
  border-color: var(--clr-success);
}

/* Checkmark drawn with CSS */
.habit-card__checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  animation: checkPop 0.3s ease forwards;
}

@keyframes checkPop {
  0%   { transform: rotate(45deg) scale(0); opacity: 0; }
  50%  { transform: rotate(45deg) scale(1.3); opacity: 1; }
  100% { transform: rotate(45deg) scale(1); opacity: 1; }
}
```

### Streak Fire Animation

```css
.habit-card__fire {
  display: none; /* hidden when streak < 3 */
  animation: fireGlow 1.5s ease-in-out infinite alternate;
}

.habit-card__fire--active {
  display: inline;
}

@keyframes fireGlow {
  from { filter: brightness(1); }
  to   { filter: brightness(1.4); }
}
```

### Tooltip Styling

```css
.tooltip {
  position: fixed;
  background: var(--clr-tooltip-bg);
  color: var(--clr-tooltip-text);
  font-size: var(--fs-tooltip);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--clr-border);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 100;
  white-space: nowrap;
}

.tooltip--visible {
  opacity: 1;
}
```

### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1023px) {
  :root {
    --heatmap-cell: 11px;
  }
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .heatmap-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Mobile */
@media (max-width: 599px) {
  :root {
    --heatmap-cell: 10px;
  }
  .stats {
    grid-template-columns: 1fr;
  }
  .add-habit__form {
    flex-direction: column;
  }
  .habit-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
}
```

### Additional CSS Details

- **Focus styles**: All interactive elements get `outline: 2px solid var(--clr-accent); outline-offset: 2px;` on `:focus-visible`.
- **Screen-reader-only class**:
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ```
- **Modal overlay**: `dialog::backdrop { background: rgba(0, 0, 0, 0.6); }`.

---

## 6. JavaScript Architecture

### File Structure

```
js/
├── main.js
└── modules/
    ├── habits.js
    ├── heatmap.js
    ├── streaks.js
    ├── storage.js
    ├── ui.js
    └── date-utils.js
```

### Module Responsibilities

---

#### `js/main.js` — Entry Point

```
Imports: habits, heatmap, ui, storage
Exports: nothing (entry point)

Responsibilities:
  - DOMContentLoaded listener
  - Call storage.load() to hydrate state
  - Call ui.renderAll() for initial paint
  - Bind event listeners:
      • form-add-habit submit  → habits.add()
      • habits-list click      → delegate to checkbox toggle / edit / delete
      • btn-reset-all click    → confirm + storage.clearAll()
      • btn-heatmap-prev/next  → heatmap.changeYear()
      • heatmap-grid mouseover → tooltip show
      • heatmap-grid mouseout  → tooltip hide
      • modal buttons          → edit save / delete confirm
```

---

#### `js/modules/habits.js` — Habit CRUD

```
Imports: storage, date-utils
Exports: add, remove, update, toggleCompletion, getAll, getById

Functions:
  add(name, emoji)
    - Validate name (non-empty, trimmed, max 60 chars)
    - Generate UUID via crypto.randomUUID()
    - Create habit object (see Data Model §7)
    - Append to habits array
    - Save to storage
    - Return new habit

  remove(habitId)
    - Filter out habit from array
    - Remove all associated completions
    - Save to storage

  update(habitId, { name, emoji })
    - Find habit, update fields
    - Save to storage

  toggleCompletion(habitId, dateStr)
    - dateStr defaults to today (YYYY-MM-DD)
    - If completion exists for (habitId, dateStr) → remove it
    - Else → add completion record
    - Save to storage
    - Return updated completion state (true/false)

  getAll()
    - Return all habit objects

  getById(habitId)
    - Return single habit or null
```

---

#### `js/modules/heatmap.js` — Calendar Grid Generation

```
Imports: date-utils, storage
Exports: render, changeYear

Functions:
  render(year)
    - Calculate the first Monday on or before Jan 1 of `year`
    - Generate 52×7 = 364 cells (plus partial week if needed, up to 53×7 = 371)
    - For each cell (date):
        • Count how many habits existed on that date
        • Count how many were completed
        • Calculate percentage = completed / total (or 0 if no habits)
        • Assign intensity level 0–4 based on percentage thresholds
        • Create a div.heatmap__cell with:
            - data-date="YYYY-MM-DD"
            - data-level="0|1|2|3|4"
            - data-count="3/5" (completed/total)
            - background colour set via level class or inline style
    - Inject month labels at appropriate column positions
    - Append all elements to #heatmap-grid

  changeYear(delta)
    - Increment/decrement current display year by delta
    - Update #heatmap-year text
    - Call render(newYear)

  getIntensityLevel(percentage)
    - 0%      → level 0
    - 1–25%   → level 1
    - 26–50%  → level 2
    - 51–75%  → level 3
    - 76–100% → level 4
```

---

#### `js/modules/streaks.js` — Streak Calculations

```
Imports: date-utils
Exports: calculateCurrentStreak, calculateLongestStreak, calculateTotalCompletions

Functions:
  calculateCurrentStreak(habitId, completions)
    - Get today's date string
    - Walk backwards day by day from today (or yesterday if today not yet completed)
    - Count consecutive days where habit was completed
    - Return count (number)

    Algorithm:
      1. let streak = 0
      2. let checkDate = today
      3. If today is NOT completed, set checkDate = yesterday
         (allows checking streak if user hasn't done today's habit yet)
      4. While completions includes checkDate for this habitId:
           streak++
           checkDate = previous day
      5. Return streak

  calculateLongestStreak(habitId, completions)
    - Sort all completion dates for this habit ascending
    - Walk through dates tracking consecutive runs
    - Return largest consecutive run (number)

    Algorithm:
      1. Filter completions for habitId, extract dates, sort ascending
      2. let longest = 0, current = 1
      3. For each pair of consecutive dates:
           if diff === 1 day → current++
           else → longest = Math.max(longest, current); current = 1
      4. Return Math.max(longest, current)

  calculateTotalCompletions(habitId, completions)
    - Count all completion records for this habitId
    - Return count (number)
```

---

#### `js/modules/storage.js` — localStorage Interface

```
Imports: nothing
Exports: load, save, clearAll, STORAGE_KEY

Constants:
  STORAGE_KEY = 'habit-tracker-data'

Data Format (stored as JSON string):
  {
    habits: [ ...habitObjects ],
    completions: [ ...completionRecords ]
  }

Functions:
  load()
    - Read localStorage.getItem(STORAGE_KEY)
    - Parse JSON
    - Validate structure (ensure habits is array, completions is array)
    - If missing or corrupt → return { habits: [], completions: [] }
    - Return parsed data

  save(data)
    - Validate data has habits and completions arrays
    - JSON.stringify and write to localStorage

  clearAll()
    - localStorage.removeItem(STORAGE_KEY)
    - Return empty state { habits: [], completions: [] }
```

---

#### `js/modules/ui.js` — DOM Rendering

```
Imports: habits, streaks, heatmap, date-utils, storage
Exports: renderAll, renderHabitList, updateStats, updateHeatmap

Functions:
  renderAll()
    - Call renderHabitList()
    - Call updateStats()
    - Call updateHeatmap()

  renderHabitList()
    - Get all habits from habits.getAll()
    - Get today's date string
    - Clear #habits-list innerHTML
    - If no habits → show #habits-empty, return
    - Hide #habits-empty
    - For each habit:
        • Build <li> from template (see HTML Structure §4)
        • Set checkbox checked state based on today's completion
        • Calculate and display current streak + longest streak
        • Show/hide 🔥 based on streak ≥ 3
        • Add completed class if checked
    - Append all <li> to #habits-list

  updateStats()
    - Total habits: count of all habits
    - Done today: count of habits completed today / total habits
    - Overall rate: total completions / (total habits × number of days since first habit)
    - Best day: max completions across any single date
    - Update the four stat card spans

  updateHeatmap()
    - Call heatmap.render(currentYear)

  showTooltip(event, cellElement)
    - Read data-date and data-count from cell
    - Format: "Thu, 15 Jan 2026 — 3/5 habits"
    - Position tooltip near cursor
    - Add .tooltip--visible class

  hideTooltip()
    - Remove .tooltip--visible class
```

---

#### `js/modules/date-utils.js` — Date Helpers

```
Imports: nothing
Exports: today, formatDate, parseDate, daysBetween, getWeekStart, getDayOfWeek,
         getMonthName, isLeapYear, addDays, dateRange

Functions:
  today()
    - Return current date as "YYYY-MM-DD" string

  formatDate(date)
    - Accept Date object
    - Return "YYYY-MM-DD" string

  parseDate(dateStr)
    - Accept "YYYY-MM-DD" string
    - Return Date object (at midnight, local time)

  daysBetween(dateStrA, dateStrB)
    - Return absolute integer difference in days

  getWeekStart(date)
    - Return the Monday of the week containing `date`
    - (ISO week starts on Monday)

  getDayOfWeek(date)
    - Return 0 = Monday … 6 = Sunday
    - (Shifted from JS default where 0 = Sunday)

  getMonthName(monthIndex)
    - Return short name: "Jan", "Feb", ... "Dec"

  isLeapYear(year)
    - Return boolean

  addDays(dateStr, n)
    - Return new "YYYY-MM-DD" string, n days after dateStr

  dateRange(startStr, endStr)
    - Return array of "YYYY-MM-DD" strings from start to end inclusive
```

---

## 7. Data Model

### localStorage Schema

The app stores a single JSON object under the key `habit-tracker-data`:

```json
{
  "habits": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Read 20 pages",
      "emoji": "📖",
      "createdAt": "2026-01-15"
    },
    {
      "id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "name": "Run 5km",
      "emoji": "🏃",
      "createdAt": "2026-02-01"
    }
  ],
  "completions": [
    {
      "habitId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "date": "2026-03-25"
    },
    {
      "habitId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "date": "2026-03-26"
    },
    {
      "habitId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "date": "2026-03-26"
    }
  ]
}
```

### Habit Object Shape

| Property    | Type   | Description                               | Example                                  |
| ----------- | ------ | ----------------------------------------- | ---------------------------------------- |
| `id`        | string | UUID v4 via `crypto.randomUUID()`         | `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"` |
| `name`      | string | Habit display name, max 60 chars          | `"Read 20 pages"`                         |
| `emoji`     | string | Single emoji (optional, may be empty)     | `"📖"`                                   |
| `createdAt` | string | ISO date string when habit was created    | `"2026-01-15"`                            |

### Completion Record Shape

| Property  | Type   | Description                               | Example                                  |
| --------- | ------ | ----------------------------------------- | ---------------------------------------- |
| `habitId` | string | References a habit's `id`                 | `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"` |
| `date`    | string | ISO date string of completion             | `"2026-03-26"`                            |

### Design Decisions

- **Flat completions array** — Simple to query and filter. No nested structures. Each toggle either adds or removes a single `{ habitId, date }` record.
- **Date strings, not timestamps** — We only care about calendar dates, not times. Storing `"YYYY-MM-DD"` avoids timezone bugs.
- **No completion ID needed** — A completion is uniquely identified by the `(habitId, date)` pair. Duplicates are prevented in `toggleCompletion()`.
- **`createdAt` on habits** — Used to limit heatmap intensity calculations to only count days where the habit actually existed (avoids penalising newly created habits).

---

## 8. Heatmap Details

### Intensity Level Mapping

The heatmap cell colour is determined by the **percentage of active habits completed that day**. A habit is "active" on a given day if its `createdAt` date is on or before that day.

| Level | Percentage Range | CSS Variable       | Hex       | Visual |
| ----- | ---------------- | ------------------- | --------- | ------ |
| 0     | 0% (no activity) | `--clr-heatmap-0`  | `#161b22` | Empty  |
| 1     | 1% – 25%         | `--clr-heatmap-1`  | `#0e4429` | Light  |
| 2     | 26% – 50%        | `--clr-heatmap-2`  | `#006d32` | Medium |
| 3     | 51% – 75%        | `--clr-heatmap-3`  | `#26a641` | Dark   |
| 4     | 76% – 100%       | `--clr-heatmap-4`  | `#39d353` | Full   |

**Edge case**: If no habits existed on a given day, the cell is level 0 (no activity).

### Colour Scale Algorithm

```
function getIntensityLevel(completedCount, activeHabitCount) {
  if (activeHabitCount === 0 || completedCount === 0) return 0;
  const pct = (completedCount / activeHabitCount) * 100;
  if (pct <= 25) return 1;
  if (pct <= 50) return 2;
  if (pct <= 75) return 3;
  return 4;
}
```

### Grid Construction Algorithm

```
1. Determine Jan 1 of the display year.
2. Find the Monday on or before Jan 1 (this is the grid's start date).
3. Determine Dec 31 of the display year.
4. Find the Sunday on or after Dec 31 (this is the grid's end date).
5. Total cells = days between grid start and grid end (inclusive).
6. Weeks = Math.ceil(totalCells / 7).
7. For each cell:
     - Column = weekIndex (0-based), Row = dayOfWeek (Mon=0 ... Sun=6)
     - If the date falls outside the display year → render as level 0, muted
     - Else → calculate intensity from completion data
8. Place month labels in the first row at the column where each month starts.
```

### Tooltip Content

When hovering over a heatmap cell:

```
Format: "{completed} / {total} habits on {DayName}, {DD} {Mon} {YYYY}"
Example: "3 / 5 habits on Wed, 25 Mar 2026"

If no activity: "No activity on Wed, 25 Mar 2026"
If no habits existed: "No habits tracked on Wed, 25 Mar 2026"
```

### Year Navigation

- **◄ / ► buttons** increment/decrement the displayed year.
- The grid fully re-renders when the year changes.
- The ► button is disabled when viewing the current year (can't navigate to future).
- No lower bound for past navigation.

---

## 9. Accessibility & State Management

### Accessibility Checklist

| Feature                | Implementation                                                                 |
| ---------------------- | ------------------------------------------------------------------------------ |
| Colour contrast        | All text meets WCAG AA (minimum 4.5:1 ratio against `--clr-bg`)              |
| Keyboard navigation    | All buttons, inputs, checkboxes navigable via Tab; Enter/Space to activate    |
| Focus indicators       | `:focus-visible` outline on every interactive element                          |
| Screen reader labels   | `aria-label` on checkboxes includes habit name; heatmap has descriptive label |
| Live regions           | `role="status"` on empty state, stats updates via `aria-live="polite"`       |
| Reduced motion         | `@media (prefers-reduced-motion: reduce)` disables all animations             |
| Semantic HTML          | `<header>`, `<section>`, `<footer>`, `<dialog>`, `<form>`, `<ul>`           |
| Modal focus trap       | Native `<dialog>` handles focus trapping automatically                        |
| Form validation        | `required` attribute + JS validation with descriptive error messages          |
| Skip-link (optional)   | Hidden link at top: "Skip to habit list"                                      |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### State Management

State is managed in-memory and synced to `localStorage` on every mutation:

```
                 ┌────────────┐
                 │ localStorage│
                 └──────┬─────┘
                    load │ save
                 ┌──────▼─────┐
                 │  In-Memory  │
                 │  State      │
                 │  { habits,  │
                 │ completions}│
                 └──────┬─────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
     ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
     │  habits.js │ │ ui.js │ │streaks.js │
     │  (mutate)  │ │(read) │ │  (read)   │
     └───────────┘ └───────┘ └───────────┘
```

**Flow on mutation:**
1. User action (add habit, toggle, delete, edit)
2. `habits.js` modifies in-memory state
3. `storage.save()` writes to `localStorage`
4. `ui.renderAll()` re-reads state and updates the DOM

**Flow on page load:**
1. `storage.load()` reads `localStorage`
2. Populates in-memory state
3. `ui.renderAll()` renders from in-memory state

---

## 10. Implementation Checklist

### Phase 1 — Foundation

- [ ] Create `index.html` with full semantic structure (see §4)
- [ ] Create `styles/main.css` with CSS variables, reset, layout, and `.sr-only`
- [ ] Implement `js/modules/date-utils.js` — all pure date helper functions
- [ ] Implement `js/modules/storage.js` — `load()`, `save()`, `clearAll()`
- [ ] Verify storage round-trip: save sample data, reload page, confirm data persists

### Phase 2 — Habit CRUD

- [ ] Implement `js/modules/habits.js` — `add()`, `remove()`, `update()`, `getAll()`, `getById()`
- [ ] Implement `js/modules/ui.js` — `renderHabitList()` with empty state
- [ ] Wire up `js/main.js` — form submit → `habits.add()` → `ui.renderHabitList()`
- [ ] Style habit cards in CSS (background, border, grid layout)
- [ ] Test: add a habit, see it appear; refresh page, see it persist

### Phase 3 — Daily Check-Off

- [ ] Implement `habits.toggleCompletion(habitId, dateStr)`
- [ ] Update `ui.renderHabitList()` to set checkbox states from today's completions
- [ ] Add checkbox change event delegation in `main.js`
- [ ] Style checked state (green border-left, checkmark animation)
- [ ] Test: check off a habit, refresh, confirm it stays checked for today

### Phase 4 — Streaks

- [ ] Implement `js/modules/streaks.js` — `calculateCurrentStreak()`, `calculateLongestStreak()`, `calculateTotalCompletions()`
- [ ] Update `ui.renderHabitList()` to display streak counts
- [ ] Add 🔥 emoji with `.habit-card__fire--active` class when streak ≥ 3
- [ ] Add fire glow animation in CSS
- [ ] Test: complete a habit 3 consecutive days, verify streak count and fire icon

### Phase 5 — Stats Dashboard

- [ ] Implement `ui.updateStats()` — total habits, done today, overall rate, best day
- [ ] Calculate overall rate = total completions / (sum of active days per habit)
- [ ] Calculate best day = max number of completions on any single date
- [ ] Style stats bar cards
- [ ] Test: add habits + completions, verify stats numbers are correct

### Phase 6 — Calendar Heatmap

- [ ] Implement `js/modules/heatmap.js` — `render(year)`, `getIntensityLevel()`
- [ ] Generate 52–53 week grid with correct day alignment for the given year
- [ ] Apply heatmap colours based on completion data
- [ ] Add month labels at column positions where each month begins
- [ ] Style heatmap grid with CSS Grid
- [ ] Add day-of-week labels (Mon, Wed, Fri) alongside the grid
- [ ] Implement horizontal scrolling on mobile

### Phase 7 — Heatmap Interactions

- [ ] Implement tooltip show/hide on cell hover
- [ ] Format tooltip content: completion count + date
- [ ] Position tooltip near cursor, clamped to viewport
- [ ] Implement year navigation (◄ / ► buttons)
- [ ] Disable ► button when viewing current year
- [ ] Style tooltip and legend
- [ ] Test: hover cells, verify tooltip data; navigate years

### Phase 8 — Edit & Delete

- [ ] Wire up Edit button → open `<dialog>` with pre-filled values
- [ ] Save edit → `habits.update()` → `ui.renderAll()`
- [ ] Wire up Delete button → open confirm `<dialog>`
- [ ] Confirm delete → `habits.remove()` → `ui.renderAll()`
- [ ] Add Reset All button with confirmation
- [ ] Test: edit a habit name, verify it updates; delete a habit, verify removal

### Phase 9 — Polish & Responsiveness

- [ ] Add responsive breakpoints (tablet, mobile) per §5
- [ ] Test heatmap horizontal scroll on narrow screens
- [ ] Add `:focus-visible` styles to all interactive elements
- [ ] Add `prefers-reduced-motion` media query
- [ ] Add transition effects on card hover, button hover
- [ ] Verify colour contrast meets WCAG AA
- [ ] Cross-browser test (Chrome, Firefox, Safari)

### Phase 10 — Final QA

- [ ] Test empty state: no habits, verify messaging
- [ ] Test with 10+ habits: verify performance and layout
- [ ] Test date edge cases: midnight, month/year boundaries, leap years
- [ ] Test localStorage: fill with realistic data, corrupt manually, verify graceful handling
- [ ] Keyboard-only navigation test: tab through entire app
- [ ] Screen reader test: verify all labels and announcements
- [ ] Write `README.md` content (features, usage, tech stack)
- [ ] Final visual review on desktop, tablet, mobile
