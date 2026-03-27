# Pomodoro Timer — Implementation Plan

---

## 1. Overview

### What It Is

The Pomodoro Timer is a browser-based study productivity tool built around the **Pomodoro Technique**, a time-management method developed by Francesco Cirillo. The app provides a configurable countdown timer with visual feedback through an animated circular progress ring, automatic mode transitions, session tracking, statistics, and audio notifications — all in vanilla HTML, CSS, and JavaScript with no frameworks or build tools.

### How the Pomodoro Technique Works

1. **Work interval** — Focus on a single task for a set duration (default: 25 minutes).
2. **Short break** — Rest for a short period (default: 5 minutes).
3. **Repeat** — Alternate between work and short break intervals.
4. **Long break** — After completing a configurable number of work sessions (default: 4), take a longer break (default: 15 minutes).
5. **Cycle continues** — The pattern resets and repeats indefinitely.

### User Flow (Step by Step)

1. User opens `index.html` in a browser.
2. The timer displays **25:00** in the centre of a circular progress ring, defaulting to "Work" mode.
3. User optionally opens the **Settings** panel to adjust:
   - Work duration (1–60 minutes)
   - Short break duration (1–30 minutes)
   - Long break duration (1–60 minutes)
   - Sessions before long break (1–10)
4. User clicks **Start** (or presses `Space`).
5. The countdown begins — the progress ring animates smoothly, the timer digits update every second.
6. During the countdown the user may:
   - **Pause** — freezes the timer in place.
   - **Resume** — continues from where it was paused.
   - **Reset** — stops the timer and resets the current interval to its full duration.
   - **Skip** — immediately ends the current interval and moves to the next mode.
7. When the timer reaches **00:00**:
   - An audio notification plays.
   - The progress ring fills completely with a brief pulse animation.
   - The mode automatically transitions (Work → Short Break, Short Break → Work, or Work → Long Break after the configured number of sessions).
   - The session counter updates if a work session was completed.
   - Stats are updated and saved.
8. User can view the **Stats** section at any time to see:
   - Total completed sessions (today / all time).
   - Total focus time.
   - Current streak (consecutive sessions without resetting).
9. All settings and stats persist in `localStorage` so they survive page reloads.

---

## 2. Page Layout

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  🍅 Pomodoro Timer                          [⚙ Settings]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────┐                          │
│                    │  MODE LABEL │                          │
│                    │   "Work"    │                          │
│                    └─────────────┘                          │
│                                                             │
│               ╭───────────────────────╮                     │
│              ╱    ╭───────────────╮    ╲                    │
│             │    │               │    │                     │
│             │    │    25 : 00    │    │                     │
│             │    │               │    │                     │
│              ╲    ╰───────────────╯    ╱                    │
│               ╰───────────────────────╯                     │
│              ← SVG Progress Ring (280px) →                  │
│                                                             │
│              ┌──────┐ ┌──────┐ ┌──────┐                    │
│              │ Start│ │Reset │ │ Skip │                    │
│              └──────┘ └──────┘ └──────┘                    │
│                                                             │
│            Session: ● ● ● ○  (3 of 4 completed)            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  STATS PANEL                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ Sessions   │ │ Focus Time │ │  Streak    │              │
│  │     12     │ │   5h 00m   │ │     4      │              │
│  └────────────┘ └────────────┘ └────────────┘              │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
│  Built with the Pomodoro Technique                          │
└─────────────────────────────────────────────────────────────┘

╔═══════════════════════════════╗
║  SETTINGS PANEL (slide-in)   ║
║                               ║
║  Work Duration      [25] min  ║
║  Short Break        [ 5] min  ║
║  Long Break         [15] min  ║
║  Sessions before    [ 4]      ║
║  long break                   ║
║                               ║
║  [Save & Close]               ║
╚═══════════════════════════════╝
```

### Key Layout Details

| Element             | Dimensions / Details                                       |
|----------------------|------------------------------------------------------------|
| Page max-width       | `640px`, centred with `margin: 0 auto`                     |
| Progress ring        | SVG circle, `280px × 280px` viewBox, stroke-width `8px`   |
| Timer digits         | `3.5rem` font size, centred inside the SVG                 |
| Mode label           | `1.25rem`, uppercase, letter-spacing `0.1em`               |
| Control buttons      | `48px` height, `120px` min-width, `8px` border-radius     |
| Session dots         | `12px` diameter circles, `8px` gap                         |
| Stats cards          | `140px × 100px`, flexbox row, `12px` gap                   |
| Settings panel       | `320px` width, slides in from the right, `100vh` height    |
| Settings overlay     | Semi-transparent `rgba(0, 0, 0, 0.5)` backdrop             |

---

## 3. Colour Scheme & Typography

### Colour Palette

| Token                  | Hex         | Usage                                       |
|------------------------|-------------|---------------------------------------------|
| `--clr-bg`             | `#1A1A2E`  | Page background (dark navy)                 |
| `--clr-surface`        | `#16213E`  | Card / panel backgrounds                    |
| `--clr-surface-alt`    | `#0F3460`  | Settings panel background                   |
| `--clr-text`           | `#E8E8E8`  | Primary text                                |
| `--clr-text-muted`     | `#9A9ABF`  | Secondary / muted text                      |
| `--clr-work`           | `#E94560`  | Work mode accent (warm red)                 |
| `--clr-work-glow`      | `#E9456033`| Work mode ring glow (translucent)           |
| `--clr-short-break`    | `#00B4D8`  | Short break accent (cyan)                   |
| `--clr-short-break-glow`| `#00B4D833`| Short break ring glow                      |
| `--clr-long-break`     | `#2DC653`  | Long break accent (green)                   |
| `--clr-long-break-glow`| `#2DC65333`| Long break ring glow                       |
| `--clr-btn-bg`         | `#233554`  | Button default background                   |
| `--clr-btn-hover`      | `#2A4066`  | Button hover background                     |
| `--clr-btn-text`       | `#FFFFFF`  | Button text                                 |
| `--clr-dot-complete`   | `#E94560`  | Completed session dot                       |
| `--clr-dot-incomplete` | `#3A3A5C`  | Incomplete session dot                      |
| `--clr-overlay`        | `#00000080`| Settings overlay background                 |

### CSS Variables Block

```css
:root {
  /* Backgrounds */
  --clr-bg: #1A1A2E;
  --clr-surface: #16213E;
  --clr-surface-alt: #0F3460;

  /* Text */
  --clr-text: #E8E8E8;
  --clr-text-muted: #9A9ABF;

  /* Mode accents */
  --clr-work: #E94560;
  --clr-work-glow: #E9456033;
  --clr-short-break: #00B4D8;
  --clr-short-break-glow: #00B4D833;
  --clr-long-break: #2DC653;
  --clr-long-break-glow: #2DC65333;

  /* Active mode (set dynamically by JS) */
  --clr-active: var(--clr-work);
  --clr-active-glow: var(--clr-work-glow);

  /* Buttons */
  --clr-btn-bg: #233554;
  --clr-btn-hover: #2A4066;
  --clr-btn-text: #FFFFFF;

  /* Session dots */
  --clr-dot-complete: var(--clr-active);
  --clr-dot-incomplete: #3A3A5C;

  /* Overlay */
  --clr-overlay: #00000080;

  /* Typography */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 50%;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### Typography Table

| Role            | Font Family          | Size      | Weight | Tracking      |
|-----------------|----------------------|-----------|--------|---------------|
| Timer digits    | `--font-mono`        | `3.5rem`  | 700    | `0.05em`      |
| Mode label      | `--font-primary`     | `1.25rem` | 600    | `0.1em`       |
| Section heading | `--font-primary`     | `1.1rem`  | 600    | `0.02em`      |
| Body text       | `--font-primary`     | `1rem`    | 400    | normal        |
| Stats value     | `--font-mono`        | `1.5rem`  | 700    | normal        |
| Stats label     | `--font-primary`     | `0.8rem`  | 500    | `0.05em`      |
| Button          | `--font-primary`     | `0.95rem` | 600    | `0.02em`      |
| Settings label  | `--font-primary`     | `0.9rem`  | 500    | normal        |
| Settings input  | `--font-mono`        | `1rem`    | 400    | normal        |

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A Pomodoro study timer with configurable durations, visual countdown, session tracking, and audio notifications." />
  <title>Pomodoro Timer</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ======= HEADER ======= -->
  <header class="header">
    <div class="header__brand">
      <span class="header__icon" aria-hidden="true">🍅</span>
      <h1 class="header__title">Pomodoro Timer</h1>
    </div>
    <button
      class="header__settings-btn"
      id="settings-toggle"
      aria-label="Open settings"
      aria-expanded="false"
      aria-controls="settings-panel"
    >
      ⚙️
    </button>
  </header>

  <!-- ======= MAIN CONTENT ======= -->
  <main class="main">

    <!-- Mode Label -->
    <p class="mode-label" id="mode-label" aria-live="polite">Work</p>

    <!-- Timer Display -->
    <div class="timer" role="timer" aria-label="Pomodoro countdown timer">
      <svg
        class="timer__ring"
        viewBox="0 0 280 280"
        aria-hidden="true"
      >
        <!-- Background track -->
        <circle
          class="timer__ring-bg"
          cx="140"
          cy="140"
          r="126"
          fill="none"
          stroke-width="8"
        />
        <!-- Animated progress arc -->
        <circle
          class="timer__ring-progress"
          id="progress-ring"
          cx="140"
          cy="140"
          r="126"
          fill="none"
          stroke-width="8"
          stroke-linecap="round"
          transform="rotate(-90 140 140)"
        />
      </svg>
      <!-- Timer digits overlaid on the SVG -->
      <div class="timer__display">
        <span class="timer__digits" id="timer-digits" aria-live="off">25:00</span>
      </div>
    </div>

    <!-- Screen-reader only live region for periodic announcements -->
    <div class="sr-only" aria-live="assertive" aria-atomic="true" id="sr-announcement"></div>

    <!-- Controls -->
    <div class="controls" role="group" aria-label="Timer controls">
      <button class="controls__btn controls__btn--start" id="btn-start" aria-label="Start timer">
        Start
      </button>
      <button class="controls__btn controls__btn--reset" id="btn-reset" aria-label="Reset timer" disabled>
        Reset
      </button>
      <button class="controls__btn controls__btn--skip" id="btn-skip" aria-label="Skip to next interval" disabled>
        Skip
      </button>
    </div>

    <!-- Session Indicators -->
    <div class="sessions" role="group" aria-label="Session progress">
      <p class="sessions__label" id="sessions-label">Session 0 of 4</p>
      <div class="sessions__dots" id="sessions-dots" aria-hidden="true">
        <!-- Dots injected by JS based on sessionsBeforeLongBreak -->
      </div>
    </div>

    <!-- Stats Panel -->
    <section class="stats" aria-labelledby="stats-heading">
      <h2 class="stats__heading" id="stats-heading">Today's Stats</h2>
      <div class="stats__grid">
        <div class="stats__card">
          <span class="stats__value" id="stat-sessions">0</span>
          <span class="stats__label">Sessions</span>
        </div>
        <div class="stats__card">
          <span class="stats__value" id="stat-focus-time">0m</span>
          <span class="stats__label">Focus Time</span>
        </div>
        <div class="stats__card">
          <span class="stats__value" id="stat-streak">0</span>
          <span class="stats__label">Streak</span>
        </div>
      </div>
    </section>

  </main>

  <!-- ======= SETTINGS PANEL (off-canvas) ======= -->
  <div class="settings-overlay" id="settings-overlay" aria-hidden="true"></div>
  <aside
    class="settings"
    id="settings-panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-title"
    aria-hidden="true"
  >
    <h2 class="settings__title" id="settings-title">Settings</h2>
    <form class="settings__form" id="settings-form" novalidate>
      <div class="settings__field">
        <label for="setting-work">Work Duration (min)</label>
        <input
          type="number"
          id="setting-work"
          name="workDuration"
          min="1"
          max="60"
          value="25"
        />
      </div>
      <div class="settings__field">
        <label for="setting-short-break">Short Break (min)</label>
        <input
          type="number"
          id="setting-short-break"
          name="shortBreak"
          min="1"
          max="30"
          value="5"
        />
      </div>
      <div class="settings__field">
        <label for="setting-long-break">Long Break (min)</label>
        <input
          type="number"
          id="setting-long-break"
          name="longBreak"
          min="1"
          max="60"
          value="15"
        />
      </div>
      <div class="settings__field">
        <label for="setting-sessions">Sessions Before Long Break</label>
        <input
          type="number"
          id="setting-sessions"
          name="sessionsBeforeLongBreak"
          min="1"
          max="10"
          value="4"
        />
      </div>
      <button type="submit" class="settings__save-btn" id="settings-save">
        Save &amp; Close
      </button>
    </form>
  </aside>

  <!-- ======= FOOTER ======= -->
  <footer class="footer">
    <p>Built with the Pomodoro Technique 🍅</p>
  </footer>

  <!-- Entry Point -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes in HTML

- `role="timer"` on the timer container for semantic meaning.
- `aria-live="polite"` on the mode label so screen readers announce mode changes.
- `aria-live="off"` on timer digits to prevent reading every second; a separate `aria-live="assertive"` region (`#sr-announcement`) is used for periodic announcements (every 5 minutes and at completion).
- `aria-expanded` on the settings toggle tracks panel state.
- `aria-modal="true"` and `role="dialog"` on the settings panel for proper dialog semantics.
- All buttons have `aria-label` attributes.
- Form inputs have associated `<label>` elements.
- `.sr-only` class hides content visually but keeps it available to screen readers.

---

## 5. CSS Design

### Full CSS (`styles/main.css`)

```css
/**
 * File: main.css
 * Description: Styles for the Pomodoro Timer application
 * Author: Student
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

/* ===========================
   RESET & BASE
   =========================== */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-primary);
  background-color: var(--clr-bg);
  color: var(--clr-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.5;
}

/* ===========================
   SCREEN-READER ONLY
   =========================== */

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

/* ===========================
   HEADER
   =========================== */

.header {
  width: 100%;
  max-width: 640px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.header__icon {
  font-size: 1.5rem;
}

.header__title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.header__settings-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.header__settings-btn:hover,
.header__settings-btn:focus-visible {
  background-color: var(--clr-btn-bg);
}

/* ===========================
   MAIN CONTENT
   =========================== */

.main {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg) var(--space-md);
  flex: 1;
  gap: var(--space-lg);
}

/* ===========================
   MODE LABEL
   =========================== */

.mode-label {
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--clr-active);
  transition: color var(--transition-normal);
}

/* ===========================
   TIMER RING
   =========================== */

.timer {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 20px var(--clr-active-glow));
  transition: filter var(--transition-normal);
}

.timer__ring {
  width: 100%;
  height: 100%;
}

.timer__ring-bg {
  stroke: var(--clr-surface);
}

.timer__ring-progress {
  stroke: var(--clr-active);
  transition: stroke var(--transition-normal);
  /* Circumference = 2 * π * 126 ≈ 791.68 */
  stroke-dasharray: 791.68;
  stroke-dashoffset: 0;
}

.timer__display {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer__digits {
  font-family: var(--font-mono);
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--clr-text);
}

/* Pulse animation on timer completion */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.timer--complete {
  animation: pulse 600ms ease-in-out 2;
}

/* ===========================
   CONTROLS
   =========================== */

.controls {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
}

.controls__btn {
  font-family: var(--font-primary);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  min-width: 120px;
  height: 48px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  background-color: var(--clr-btn-bg);
  color: var(--clr-btn-text);
  transition: background-color var(--transition-fast),
              transform var(--transition-fast);
}

.controls__btn:hover:not(:disabled) {
  background-color: var(--clr-btn-hover);
}

.controls__btn:active:not(:disabled) {
  transform: scale(0.96);
}

.controls__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls__btn:focus-visible {
  outline: 2px solid var(--clr-active);
  outline-offset: 2px;
}

.controls__btn--start {
  background-color: var(--clr-active);
  color: #FFFFFF;
  transition: background-color var(--transition-normal);
}

.controls__btn--start:hover:not(:disabled) {
  filter: brightness(1.1);
  background-color: var(--clr-active);
}

/* ===========================
   SESSION DOTS
   =========================== */

.sessions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.sessions__label {
  font-size: 0.9rem;
  color: var(--clr-text-muted);
}

.sessions__dots {
  display: flex;
  gap: var(--space-sm);
}

.sessions__dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background-color: var(--clr-dot-incomplete);
  transition: background-color var(--transition-normal),
              transform var(--transition-fast);
}

.sessions__dot--complete {
  background-color: var(--clr-active);
  transform: scale(1.15);
}

/* ===========================
   STATS
   =========================== */

.stats {
  width: 100%;
  text-align: center;
}

.stats__heading {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: var(--space-md);
  color: var(--clr-text-muted);
}

.stats__grid {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.stats__card {
  background-color: var(--clr-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.stats__value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--clr-active);
}

.stats__label {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--clr-text-muted);
}

/* ===========================
   SETTINGS PANEL
   =========================== */

.settings-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--clr-overlay);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal),
              visibility var(--transition-normal);
  z-index: 90;
}

.settings-overlay--visible {
  opacity: 1;
  visibility: visible;
}

.settings {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background-color: var(--clr-surface-alt);
  padding: var(--space-xl) var(--space-lg);
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  z-index: 100;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.settings--open {
  transform: translateX(0);
}

.settings__title {
  font-size: 1.25rem;
  font-weight: 700;
}

.settings__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.settings__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.settings__field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--clr-text-muted);
}

.settings__field input {
  font-family: var(--font-mono);
  font-size: 1rem;
  background-color: var(--clr-surface);
  color: var(--clr-text);
  border: 1px solid var(--clr-btn-bg);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  width: 100%;
  transition: border-color var(--transition-fast);
}

.settings__field input:focus {
  outline: none;
  border-color: var(--clr-active);
}

.settings__save-btn {
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  padding: var(--space-sm) var(--space-md);
  height: 48px;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--clr-active);
  color: #FFFFFF;
  cursor: pointer;
  transition: filter var(--transition-fast);
}

.settings__save-btn:hover {
  filter: brightness(1.1);
}

.settings__save-btn:focus-visible {
  outline: 2px solid var(--clr-text);
  outline-offset: 2px;
}

/* ===========================
   FOOTER
   =========================== */

.footer {
  width: 100%;
  max-width: 640px;
  padding: var(--space-md) var(--space-lg);
  text-align: center;
  font-size: 0.85rem;
  color: var(--clr-text-muted);
}

/* ===========================
   RESPONSIVE
   =========================== */

@media (max-width: 480px) {
  .timer {
    width: 240px;
    height: 240px;
  }

  .timer__digits {
    font-size: 2.8rem;
  }

  .controls__btn {
    min-width: 100px;
    height: 44px;
    font-size: 0.85rem;
  }

  .stats__card {
    min-width: 100px;
    padding: var(--space-sm) var(--space-md);
  }

  .stats__value {
    font-size: 1.25rem;
  }

  .settings {
    width: 100%;
  }
}
```

### Key CSS Techniques

- **Circular progress ring**: SVG `<circle>` with `stroke-dasharray` set to the circumference (`2 × π × 126 ≈ 791.68`) and `stroke-dashoffset` animated via JS to show progress.
- **Colour transitions between modes**: CSS custom property `--clr-active` is set on `document.documentElement.style` by JS; all elements referencing it transition smoothly.
- **Pulse on completion**: `.timer--complete` class triggers a 2-cycle scale animation.
- **Settings panel slide-in**: `transform: translateX(100%)` off-screen by default, `translateX(0)` when `.settings--open` is added.
- **Glow effect**: `filter: drop-shadow()` on the timer container using the translucent accent colour.

---

## 6. JavaScript Architecture

### File Tree

```
js/
├── main.js
└── modules/
    ├── timer.js
    ├── settings.js
    ├── stats.js
    ├── audio.js
    ├── ui.js
    └── storage.js
```

### Module Table

| Module         | Purpose                                          | Exports                                                                   |
|----------------|--------------------------------------------------|---------------------------------------------------------------------------|
| `main.js`      | Entry point, wires everything together           | None (self-executing init)                                                |
| `timer.js`     | Core countdown logic, interval management        | `createTimer(config)` returning `{ start, pause, reset, skip, getState }` |
| `settings.js`  | Reads form values, validates, saves to storage   | `initSettings(onSave)`, `getSettings()`                                   |
| `stats.js`     | Tracks and aggregates session statistics         | `initStats()`, `recordSession(duration)`, `getStats()`, `resetDaily()`    |
| `audio.js`     | Generates and plays notification sounds          | `playNotification()`, `initAudio()`                                       |
| `ui.js`        | All DOM updates — ring, digits, mode, dots, stats| `initUI()`, `updateDisplay(state)`, `showCompletion()`, `setMode(mode)`   |
| `storage.js`   | localStorage wrapper, JSON serialisation         | `loadData(key, fallback)`, `saveData(key, value)`                         |

### Detailed Module Descriptions

#### `main.js` — Entry Point

```
Responsibilities:
  - Import all modules
  - Call initAudio(), initUI(), initSettings(), initStats() on DOMContentLoaded
  - Load saved settings from storage
  - Create timer instance with current settings
  - Wire button click handlers (start, reset, skip)
  - Wire keyboard shortcuts (Space = start/pause, R = reset, S = skip)
  - Set up settings onSave callback to reconfigure timer
  - On timer tick: call ui.updateDisplay()
  - On timer complete: call audio.playNotification(), stats.recordSession(),
    ui.showCompletion(), advance to next mode
```

#### `timer.js` — Countdown Logic

```
Factory function: createTimer({ durationSeconds, onTick, onComplete })

Internal state:
  - remainingSeconds : number
  - totalSeconds     : number
  - intervalId       : number | null
  - isRunning        : boolean

Methods:
  start()  — if not running, starts setInterval(tick, 1000)
  pause()  — clears interval, sets isRunning = false
  reset()  — clears interval, resets remainingSeconds to totalSeconds
  skip()   — clears interval, calls onComplete() immediately
  getState() — returns { remainingSeconds, totalSeconds, isRunning, progress }

tick():
  - Decrement remainingSeconds by 1
  - Call onTick({ remainingSeconds, totalSeconds, progress })
  - progress = 1 - (remainingSeconds / totalSeconds)
  - If remainingSeconds <= 0: clearInterval, call onComplete()

Edge cases:
  - Calling start() when already running does nothing
  - Calling pause() when not running does nothing
  - Calling reset() while running stops then resets
  - If duration changes via settings, reset with new duration
```

#### `settings.js` — User Preferences

```
Responsibilities:
  - Open/close settings panel (toggle class, aria-expanded, aria-hidden, focus trap)
  - Read form input values on submit
  - Validate inputs (clamp to min/max, parseInt, reject NaN)
  - Save validated settings to localStorage via storage.js
  - Call onSave(newSettings) callback so main.js can reconfigure

Settings schema:
  {
    workDuration: 25,          // minutes (1–60)
    shortBreak: 5,             // minutes (1–30)
    longBreak: 15,             // minutes (1–60)
    sessionsBeforeLongBreak: 4 // count (1–10)
  }

Focus trap:
  - On open: focus first input, listen for Tab/Shift+Tab
  - On Escape: close panel
  - On overlay click: close panel
```

#### `stats.js` — Session Statistics

```
Responsibilities:
  - Track completed work sessions count
  - Track total focus time (in minutes)
  - Track current streak (consecutive sessions without reset)
  - Persist all stats to localStorage keyed by date (YYYY-MM-DD)
  - On load: check if stored date matches today; if not, archive and reset daily

Functions:
  initStats()                 — load from storage, check date, return current stats
  recordSession(durationMin)  — increment sessions, add to focusTime, bump streak, save
  getStats()                  — return { sessions, focusTime, streak, date }
  resetDaily()                — archive current stats, start fresh for today

Storage format (see Section 8):
  Key: "pomodoro-stats"
  Value: { date, sessions, focusTimeMinutes, streak }
```

#### `audio.js` — Notification Sounds

```
Approach: Use the Web Audio API to synthesise a simple notification tone
          (no external audio files needed).

initAudio():
  - Create an AudioContext (lazily, on first user gesture to comply with autoplay policy)
  - Store reference in module scope

playNotification():
  - Resume AudioContext if suspended
  - Create an OscillatorNode:
    - Type: "sine"
    - Frequency sequence: 880Hz for 150ms → pause 100ms → 880Hz for 150ms → pause 100ms → 1046Hz for 300ms
  - Connect through a GainNode for volume envelope (fade in 10ms, sustain, fade out 50ms)
  - Total sound duration: ~800ms
  - Clean up nodes after playback via onended

Why Web Audio API:
  - No external files to load or manage
  - Works offline
  - Precise timing control
  - Small code footprint
```

#### `ui.js` — DOM Updates

```
Responsibilities:
  - Cache all DOM element references on init
  - updateDisplay(state):
    - Format remaining seconds as MM:SS
    - Update #timer-digits text
    - Calculate stroke-dashoffset from progress and set on #progress-ring
      Formula: offset = circumference × (1 - progress)
    - Update session dots (add/remove --complete class)
    - Update #sessions-label text
    - Update stats cards
  - setMode(mode):
    - Update #mode-label text ("Work", "Short Break", "Long Break")
    - Set --clr-active and --clr-active-glow CSS variables on :root
    - Update start button background colour
  - showCompletion():
    - Add .timer--complete class, remove after animation ends
  - announceToScreenReader(message):
    - Set text content of #sr-announcement, clear after 1 second
  - toggleSettingsPanel(open):
    - Toggle classes on #settings-panel and #settings-overlay
    - Update aria attributes
  - renderSessionDots(total, completed):
    - Clear and rebuild dot elements in #sessions-dots
  - updateButtonStates(timerState):
    - Toggle button text "Start" ↔ "Pause"
    - Enable/disable Reset and Skip based on timer state
```

#### `storage.js` — localStorage Wrapper

```
Functions:
  loadData(key, fallback):
    - Try JSON.parse(localStorage.getItem(key))
    - On error or null, return fallback
  saveData(key, value):
    - localStorage.setItem(key, JSON.stringify(value))

Keys used:
  "pomodoro-settings" — user preferences object
  "pomodoro-stats"    — current day stats object
```

---

## 7. Timer Mechanics

### Mode Cycling

The timer operates in a loop of modes:

```
     ┌─────────────────────────────────────────────────────────┐
     │                                                         │
     ▼                                                         │
   WORK ──► SHORT BREAK ──► WORK ──► SHORT BREAK ──► ...      │
     │                                                         │
     └──── After N work sessions ──► LONG BREAK ───────────────┘
                                        │
                                        └──► Reset session counter to 0
```

### Detailed Timer Logic

1. **Initialisation**: Timer starts in `WORK` mode with `remainingSeconds = workDuration × 60`.
2. **Tick**: Every 1000ms, decrement `remainingSeconds`. Call `onTick` with current state.
3. **Completion** (`remainingSeconds` reaches 0):
   - Increment `completedSessions` if current mode is `WORK`.
   - Determine next mode:
     - If current mode is `WORK` and `completedSessions % sessionsBeforeLongBreak === 0`: next mode is `LONG_BREAK`.
     - If current mode is `WORK` (otherwise): next mode is `SHORT_BREAK`.
     - If current mode is `SHORT_BREAK` or `LONG_BREAK`: next mode is `WORK`.
   - If transitioning from `LONG_BREAK` to `WORK`: reset the session counter within the current cycle.
   - Set `remainingSeconds` to the new mode's duration.
   - Call `onComplete(nextMode)`.
4. **Auto-start next interval**: After the completion sound and brief animation, the next interval begins automatically after a 2-second delay. The user can pause or reset during this delay.

### Edge Cases

| Scenario                              | Behaviour                                              |
|---------------------------------------|--------------------------------------------------------|
| User clicks Start then Start again    | Second click is treated as Pause (toggle behaviour)    |
| User clicks Reset while paused        | Timer resets to full duration of the current mode       |
| User clicks Reset while running       | Timer stops and resets to full duration                 |
| User clicks Skip while paused         | Current interval ends, next mode begins paused         |
| User clicks Skip while running        | Current interval ends, next mode begins running        |
| Settings changed while timer runs     | Timer resets with new duration for the current mode     |
| Settings changed while timer paused   | Timer resets with new duration, remains paused         |
| Page refreshed mid-timer              | Timer resets (no background persistence); stats saved  |
| Duration set to 1 minute              | Works normally — minimum granularity is 1 second       |
| All sessions completed                | Long break triggers, cycle resets, stats keep counting |

---

## 8. State Management

### Application States

```
                    ┌──────────┐
                    │  IDLE    │◄──── Reset
                    └────┬─────┘
                         │ Start
                         ▼
                    ┌──────────┐
              ┌────►│ RUNNING  │◄────┐
              │     └────┬─────┘     │
              │          │ Pause     │ Resume
              │          ▼           │
              │     ┌──────────┐     │
              │     │ PAUSED   │─────┘
              │     └────┬─────┘
              │          │ Reset
              │          ▼
              │     ┌──────────┐
              │     │  IDLE    │
              │     └──────────┘
              │
              │ Timer hits 0
              ▼
         ┌──────────┐
         │ COMPLETE  │──── (2s delay) ──► Auto-advance to next mode → RUNNING
         └──────────┘
```

### State Object (in-memory)

```javascript
const appState = {
  timerState: 'idle',            // 'idle' | 'running' | 'paused' | 'complete'
  currentMode: 'work',           // 'work' | 'shortBreak' | 'longBreak'
  remainingSeconds: 1500,        // current countdown value
  totalSeconds: 1500,            // total for current interval
  completedSessions: 0,          // sessions finished in current cycle
  totalCompletedSessions: 0,     // all-time for today
};
```

### localStorage Schema

#### Key: `"pomodoro-settings"`

```json
{
  "workDuration": 25,
  "shortBreak": 5,
  "longBreak": 15,
  "sessionsBeforeLongBreak": 4
}
```

#### Key: `"pomodoro-stats"`

```json
{
  "date": "2026-03-27",
  "sessions": 12,
  "focusTimeMinutes": 300,
  "streak": 4
}
```

### State Transitions

| From      | Event            | To        | Side Effects                                             |
|-----------|------------------|-----------|----------------------------------------------------------|
| idle      | Start            | running   | Begin setInterval, enable Reset/Skip, button → "Pause"  |
| running   | Pause (click/⎵)  | paused    | Clear interval, button → "Resume"                       |
| paused    | Resume (click/⎵) | running   | Restart interval, button → "Pause"                      |
| running   | Timer hits 0     | complete  | Play audio, update stats, show pulse, announce to SR     |
| complete  | 2s delay         | running   | Set next mode, new duration, start interval              |
| running   | Reset            | idle      | Clear interval, reset remaining to total, button → "Start"|
| paused    | Reset            | idle      | Reset remaining to total, button → "Start"              |
| running   | Skip             | complete  | Treat as if timer hit 0                                  |
| paused    | Skip             | idle*     | Advance mode, set new duration, stay paused (idle)       |
| any       | Settings saved   | idle      | Apply new durations, reset timer                         |

---

## 9. Accessibility

### Keyboard Controls

| Key            | Action                                          |
|----------------|------------------------------------------------|
| `Space`        | Toggle Start / Pause                            |
| `R`            | Reset timer                                     |
| `S`            | Skip to next interval                           |
| `Escape`       | Close settings panel (if open)                  |
| `Tab`          | Navigate between controls                       |
| `Shift + Tab`  | Navigate backwards                              |
| `Enter`        | Activate focused button / submit settings form  |

### Screen Reader Announcements

Announcements are pushed to the `#sr-announcement` live region:

| Event                        | Announcement Text                                         |
|------------------------------|-----------------------------------------------------------|
| Timer starts                 | "Work timer started. 25 minutes remaining."               |
| Every 5-minute mark          | "20 minutes remaining." / "15 minutes remaining." etc.    |
| 1 minute remaining           | "1 minute remaining."                                     |
| Timer completes              | "Work session complete! Starting short break."            |
| Mode changes to short break  | "Short break. 5 minutes."                                 |
| Mode changes to long break   | "Long break. 15 minutes. Great job!"                      |
| Timer paused                 | "Timer paused."                                           |
| Timer reset                  | "Timer reset."                                            |
| Settings saved               | "Settings saved."                                         |

### Focus Management

- When the settings panel opens: focus moves to the first input (`#setting-work`).
- Focus is trapped inside the settings panel while open (Tab cycles through inputs and save button).
- When the settings panel closes: focus returns to the settings toggle button (`#settings-toggle`).
- Buttons that are `disabled` are skipped in the tab order (native behaviour).
- All interactive elements have visible `:focus-visible` outlines using the active accent colour.

### Additional Accessibility Considerations

- Timer digits use `aria-live="off"` to prevent per-second announcements which would be overwhelming.
- The SVG progress ring has `aria-hidden="true"` since the spoken timer value conveys the same information.
- Colour is never the sole indicator of mode — the text label ("Work", "Short Break", "Long Break") is always visible.
- Minimum touch target size for buttons is 44×48px, exceeding WCAG 2.5.5 requirements.

---

## 10. Implementation Checklist

Complete these steps in order. Each step should result in a testable, working state.

### Phase 1 — Foundation

- [ ] **Step 1**: Create `index.html` with full semantic structure, linked CSS and JS.
- [ ] **Step 2**: Create `styles/main.css` with CSS variables, reset, layout, and all component styles.
- [ ] **Step 3**: Verify the page renders correctly with placeholder content (static 25:00, dots, stats cards).

### Phase 2 — Core Timer

- [ ] **Step 4**: Create `js/modules/storage.js` with `loadData` and `saveData` functions.
- [ ] **Step 5**: Create `js/modules/timer.js` with `createTimer` factory — countdown logic, start, pause, reset, skip.
- [ ] **Step 6**: Create `js/modules/ui.js` — DOM caching, `updateDisplay`, digit formatting, progress ring offset calculation.
- [ ] **Step 7**: Create `js/main.js` — import modules, initialise on DOMContentLoaded, wire Start button to timer, verify countdown works visually.
- [ ] **Step 8**: Test: Start → digits count down → progress ring animates → timer reaches 00:00.

### Phase 3 — Mode Cycling

- [ ] **Step 9**: Add mode management to `main.js` — track `currentMode`, `completedSessions`, determine next mode on completion.
- [ ] **Step 10**: Implement `setMode` in `ui.js` — update label text, swap CSS variables for colour transitions.
- [ ] **Step 11**: Implement session dots rendering in `ui.js` — `renderSessionDots(total, completed)`.
- [ ] **Step 12**: Test: Complete a work session → auto-transition to short break → colour changes → dots update → after 4 work sessions → long break triggers.

### Phase 4 — Audio

- [ ] **Step 13**: Create `js/modules/audio.js` — `initAudio` (lazy AudioContext), `playNotification` (synthesised tone sequence).
- [ ] **Step 14**: Wire `playNotification` to timer completion in `main.js`.
- [ ] **Step 15**: Test: Timer completes → notification sound plays → pulse animation fires.

### Phase 5 — Settings

- [ ] **Step 16**: Create `js/modules/settings.js` — open/close panel, read form values, validate, save via `storage.js`, call `onSave`.
- [ ] **Step 17**: Wire settings into `main.js` — on save, reconfigure timer with new durations, reset current interval.
- [ ] **Step 18**: Test: Open settings → change work to 10 min → save → timer shows 10:00 → countdown uses new duration.

### Phase 6 — Stats

- [ ] **Step 19**: Create `js/modules/stats.js` — `initStats`, `recordSession`, `getStats`, date-based daily reset.
- [ ] **Step 20**: Wire stats into `main.js` — call `recordSession` on work session completion, update stat cards via `ui.js`.
- [ ] **Step 21**: Test: Complete sessions → stats update live → refresh page → stats persist from localStorage.

### Phase 7 — Accessibility & Polish

- [ ] **Step 22**: Add keyboard shortcuts in `main.js` — Space (start/pause), R (reset), S (skip), Escape (close settings).
- [ ] **Step 23**: Implement screen reader announcements — `announceToScreenReader` in `ui.js`, trigger at start, 5-min marks, 1-min mark, completion, pause, reset.
- [ ] **Step 24**: Implement focus trap in settings panel — Tab cycling, Escape to close, focus return.
- [ ] **Step 25**: Add `Pause` / `Resume` button text toggle and `disabled` state management for Reset and Skip.
- [ ] **Step 26**: Test with keyboard only — all controls reachable, focus visible, settings panel traps focus.
- [ ] **Step 27**: Test responsive layout at 320px, 480px, 768px, 1024px widths.

### Phase 8 — Final

- [ ] **Step 28**: Add auto-start after completion with 2-second delay.
- [ ] **Step 29**: Edge case testing — rapid button clicks, settings change mid-timer, page refresh, extreme durations (1 min, 60 min).
- [ ] **Step 30**: Code cleanup — verify file headers, add JSDoc to public functions, remove console.logs.
- [ ] **Step 31**: Final cross-browser test (Chrome, Firefox, Safari).
