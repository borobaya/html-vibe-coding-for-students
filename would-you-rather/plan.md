# Would You Rather? — Implementation Plan

## 1. Overview

A browser-based "Would You Rather?" game built with vanilla HTML5, CSS3, and JavaScript (ES2022+). The app presents players with random dilemmas — two options side by side — and lets them vote by clicking one. After voting, animated percentage bars reveal how every visitor has voted on that question. All vote tallies persist in `localStorage` so totals survive page refreshes. No frameworks, no build tools, no dependencies.

### Core Feature Set

- **Random dilemma generation**: Questions drawn from a built-in bank of 20+ dilemmas, shuffled each session so no two rounds feel identical.
- **One-click voting**: Tap/click either option card to lock in your choice instantly.
- **Live vote percentages**: Animated progress bars show the split immediately after each vote.
- **Vote persistence**: Tallies saved to `localStorage`; totals accumulate across sessions.
- **Re-vote prevention**: Once a user votes on a question, that choice is locked for the session (tracked in `localStorage`).
- **Next question button**: Cycle through the bank at your own pace.
- **Responsive layout**: Desktop two-column cards, tablet/mobile stacked cards.
- **Clean, bold UI**: Large text, high-contrast gradient cards, smooth transitions.

### User Flow — Step by Step

1. **Page loads** → JavaScript imports the question bank, shuffles it, and displays the first unanswered question.
2. **User reads the dilemma** → Two large option cards sit side by side, each showing one choice (e.g., "Always be 10 minutes late" vs. "Always be 20 minutes early").
3. **User clicks one card** → The card pulses with a selection animation; the other card dims slightly.
4. **Vote is recorded** → The vote count for that option increments in `localStorage`.
5. **Results are revealed** → Both cards transition to show a percentage bar and vote count, with the bars animating from 0% to their final width.
6. **User clicks "Next Question"** → The current question fades out, the next unanswered question fades in.
7. **Bank exhausted** → When all questions have been answered, a summary screen appears ("You've answered all questions! Reset to play again?") with a reset button.

---

## 2. Page Layout

### Wireframe (Desktop — 900px+)

```text
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  🤔 Would You Rather?                                      │  │
│  │  [subtitle: "Make your choice. See how others voted."]     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  QUESTION COUNTER                                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            Question 3 of 20      ● ● ◐ ○ ○ ○ ...          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  DILEMMA CARDS                                                   │
│  ┌──────────────────────┐   VS   ┌──────────────────────┐       │
│  │                      │        │                      │       │
│  │   Option A text      │        │   Option B text      │       │
│  │                      │        │                      │       │
│  │  ┌────────────────┐  │        │  ┌────────────────┐  │       │
│  │  │ ████████░░ 63% │  │        │  │ ███░░░░░░ 37%  │  │       │
│  │  └────────────────┘  │        │  └────────────────┘  │       │
│  │  (142 votes)         │        │  (84 votes)          │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                  │
│  CONTROLS                                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             [Next Question →]     [Reset All Votes]        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  FOOTER                                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Total questions answered: 3 · Votes saved locally         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Wireframe (Mobile — below 640px)

```text
┌──────────────────────────┐
│  🤔 Would You Rather?    │
│  Make your choice.       │
│                          │
│  Question 3 of 20       │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │  Option A text     │  │
│  │                    │  │
│  │  ████████░░ 63%    │  │
│  │  (142 votes)       │  │
│  └────────────────────┘  │
│                          │
│         — VS —           │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │  Option B text     │  │
│  │                    │  │
│  │  ███░░░░░░ 37%     │  │
│  │  (84 votes)        │  │
│  └────────────────────┘  │
│                          │
│   [Next Question →]      │
│   [Reset All Votes]      │
│                          │
│  Footer                  │
└──────────────────────────┘
```

### Layout Zones (Top to Bottom)

| Zone | Content | Behaviour |
|---|---|---|
| **Header** | App title "Would You Rather?", tagline | Centered, always visible |
| **Question Counter** | "Question X of Y" text, optional dot progress | Updates on navigation |
| **Dilemma Cards** | Two side-by-side cards (desktop) or stacked (mobile), each with option text, percentage bar (hidden until voted), vote count | Cards are interactive before voting; become display-only after |
| **VS Divider** | "VS" badge between cards | Circular badge on desktop, horizontal text on mobile |
| **Controls** | "Next Question" button (disabled until voted), "Reset All Votes" button | Centered below cards |
| **Footer** | Total answered count, persistence note | Static bottom |

### Responsive Behaviour

| Breakpoint | Layout Change |
|---|---|
| ≥ 900px | Two cards side by side in a row, generous padding, large fonts |
| 640px – 899px | Cards side by side but narrower, reduced padding |
| < 640px | Cards stack vertically, full width, VS divider between them horizontally |

---

## 3. Colour Scheme & Typography

### Design Philosophy

Bold, playful, high-contrast. The two option cards use distinct gradient backgrounds (warm vs cool) to create a visual "versus" tension. The overall page uses a deep dark background for focus, with vibrant accents for interactivity.

### Colour Palette

| Role | Colour Name | Hex Code | CSS Variable | Usage |
|---|---|---|---|---|
| **Background (page)** | Deep navy | `#0F0E17` | `--bg-primary` | Body background |
| **Surface** | Dark indigo | `#1A1A2E` | `--bg-surface` | Card backgrounds (base), controls bar |
| **Card A gradient start** | Electric violet | `#7F5AF0` | `--card-a-start` | Option A card gradient start |
| **Card A gradient end** | Deep purple | `#5A2D82` | `--card-a-end` | Option A card gradient end |
| **Card B gradient start** | Hot coral | `#FF6B6B` | `--card-b-start` | Option B card gradient start |
| **Card B gradient end** | Deep rose | `#C23A5B` | `--card-b-end` | Option B card gradient end |
| **Text primary** | Off-white | `#FFFFFE` | `--text-primary` | Card text, headings |
| **Text secondary** | Lavender grey | `#A7A9BE` | `--text-secondary` | Subtitle, footer, counters |
| **Accent highlight** | Neon teal | `#2CB67D` | `--accent` | Next button, active states, progress bar fill |
| **Accent hover** | Light teal | `#3DD68C` | `--accent-hover` | Button hover state |
| **Danger / reset** | Soft red | `#E53170` | `--danger` | Reset button, warning states |
| **Danger hover** | Light red | `#FF4F8B` | `--danger-hover` | Reset button hover |
| **VS badge** | Amber gold | `#FFD803` | `--vs-colour` | VS circle between cards |
| **Border subtle** | Muted purple | `#2E2E4A` | `--border` | Card borders, dividers |
| **Progress track** | Dark slate | `#2A2A3D` | `--progress-track` | Percentage bar background |
| **Progress fill A** | Card A accent | `#7F5AF0` | `--progress-fill-a` | Option A percentage bar fill |
| **Progress fill B** | Card B accent | `#FF6B6B` | `--progress-fill-b` | Option B percentage bar fill |
| **Card selected glow** | White alpha | `rgba(255,255,255,0.25)` | `--glow-selected` | Selected card border glow |
| **Disabled state** | Grey | `#555570` | `--disabled` | Disabled next button |

### CSS Variables Definition

```css
:root {
  /* Backgrounds */
  --bg-primary: #0F0E17;
  --bg-surface: #1A1A2E;

  /* Card gradients */
  --card-a-start: #7F5AF0;
  --card-a-end: #5A2D82;
  --card-b-start: #FF6B6B;
  --card-b-end: #C23A5B;

  /* Text */
  --text-primary: #FFFFFE;
  --text-secondary: #A7A9BE;

  /* Accents */
  --accent: #2CB67D;
  --accent-hover: #3DD68C;
  --danger: #E53170;
  --danger-hover: #FF4F8B;
  --vs-colour: #FFD803;

  /* UI elements */
  --border: #2E2E4A;
  --progress-track: #2A2A3D;
  --progress-fill-a: #7F5AF0;
  --progress-fill-b: #FF6B6B;
  --glow-selected: rgba(255, 255, 255, 0.25);
  --disabled: #555570;

  /* Typography */
  --font-main: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  --font-accent: 'Fredoka One', 'Poppins', cursive, sans-serif;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### Typography

Google Fonts import: `Poppins` (400, 600, 700) and `Fredoka One` (400).

```
https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;600;700&display=swap
```

| Element | Font | Size (desktop) | Size (mobile) | Weight | Colour | Letter-spacing |
|---|---|---|---|---|---|---|
| App title (h1) | `--font-accent` | 40px | 28px | 400 | `--text-primary` | 1px |
| Subtitle | `--font-main` | 16px | 14px | 400 | `--text-secondary` | 0 |
| Question counter | `--font-main` | 14px | 12px | 600 | `--text-secondary` | 0.5px |
| Card option text | `--font-main` | 22px | 18px | 700 | `--text-primary` | 0 |
| Percentage number | `--font-accent` | 36px | 28px | 400 | `--text-primary` | 0 |
| Vote count | `--font-main` | 14px | 12px | 400 | `--text-secondary` | 0 |
| Button text | `--font-main` | 16px | 14px | 600 | `--text-primary` | 0.5px |
| VS badge | `--font-accent` | 20px | 16px | 400 | `--bg-primary` | 0 |
| Footer | `--font-main` | 13px | 12px | 400 | `--text-secondary` | 0 |

---

## 4. HTML Structure

Complete `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Would You Rather?</title>
  <meta name="description" content="A fun Would You Rather dilemma game with vote tracking and percentage reveals.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <h1 class="header__title">🤔 Would You Rather?</h1>
    <p class="header__subtitle">Make your choice. See how others voted.</p>
  </header>

  <!-- MAIN -->
  <main class="app">

    <!-- QUESTION COUNTER -->
    <div class="counter" aria-live="polite">
      <span class="counter__text" id="counter-text">Question 1 of 20</span>
      <div class="counter__dots" id="counter-dots" aria-hidden="true">
        <!-- Dots generated by JS -->
      </div>
    </div>

    <!-- DILEMMA SECTION -->
    <section class="dilemma" aria-label="Would you rather dilemma" id="dilemma-section">

      <!-- Option A Card -->
      <article class="card card--a" id="card-a"
               role="button" tabindex="0"
               aria-label="Option A">
        <span class="card__label">Option A</span>
        <p class="card__text" id="card-a-text">Loading...</p>

        <!-- Results (hidden until voted) -->
        <div class="card__results" id="results-a" aria-hidden="true">
          <div class="card__progress">
            <div class="card__progress-bar card__progress-bar--a" id="progress-a"></div>
          </div>
          <span class="card__percentage" id="percentage-a">0%</span>
          <span class="card__votes" id="votes-a">(0 votes)</span>
        </div>
      </article>

      <!-- VS Badge -->
      <div class="vs-badge" aria-hidden="true">VS</div>

      <!-- Option B Card -->
      <article class="card card--b" id="card-b"
               role="button" tabindex="0"
               aria-label="Option B">
        <span class="card__label">Option B</span>
        <p class="card__text" id="card-b-text">Loading...</p>

        <!-- Results (hidden until voted) -->
        <div class="card__results" id="results-b" aria-hidden="true">
          <div class="card__progress">
            <div class="card__progress-bar card__progress-bar--b" id="progress-b"></div>
          </div>
          <span class="card__percentage" id="percentage-b">0%</span>
          <span class="card__votes" id="votes-b">(0 votes)</span>
        </div>
      </article>

    </section>

    <!-- CONTROLS -->
    <div class="controls">
      <button class="btn btn--next" id="btn-next" disabled
              aria-label="Go to next question">
        Next Question →
      </button>
      <button class="btn btn--reset" id="btn-reset"
              aria-label="Reset all votes">
        Reset All Votes
      </button>
    </div>

    <!-- ALL-DONE MESSAGE (hidden by default) -->
    <section class="done-screen" id="done-screen" aria-hidden="true">
      <h2 class="done-screen__title">🎉 You've answered all the questions!</h2>
      <p class="done-screen__text">You made it through every dilemma. Reset to play again.</p>
      <button class="btn btn--next" id="btn-replay"
              aria-label="Reset and play again">
        Play Again 🔄
      </button>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <p class="footer__text">
      Total answered: <span id="total-answered">0</span> ·
      Votes saved locally
    </p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- Cards use `role="button"` and `tabindex="0"` so they are keyboard-focusable and activatable with Enter/Space.
- `aria-live="polite"` on the counter so screen readers announce question changes.
- `aria-hidden="true"` on decorative elements (VS badge, dots, hidden results).
- Results containers toggle `aria-hidden` when revealed.
- All buttons have descriptive `aria-label` attributes.
- Colour contrast ratios exceed WCAG AA for all text/background combinations.

---

## 5. CSS Architecture

File: `styles/main.css`

### Reset & Base

```css
/* === RESET === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
```

### Complete Class List

| CSS Class | Element | Purpose |
|---|---|---|
| `.header` | `<header>` | Top header container, centered text, padding |
| `.header__title` | `<h1>` | App title, `--font-accent`, large size |
| `.header__subtitle` | `<p>` | Tagline below title, `--text-secondary` |
| `.app` | `<main>` | Main content wrapper, max-width, centered |
| `.counter` | `<div>` | Question counter bar, flex row |
| `.counter__text` | `<span>` | "Question X of Y" text |
| `.counter__dots` | `<div>` | Dot progress indicators container |
| `.counter__dot` | `<span>` | Individual dot (generated by JS) |
| `.counter__dot--done` | modifier | Filled dot for answered questions |
| `.counter__dot--active` | modifier | Pulsing dot for current question |
| `.dilemma` | `<section>` | Flex container for the two cards + VS badge |
| `.card` | `<article>` | Option card — base styles, cursor pointer, border radius, transition |
| `.card--a` | modifier | Option A gradient background (`--card-a-start` → `--card-a-end`) |
| `.card--b` | modifier | Option B gradient background (`--card-b-start` → `--card-b-end`) |
| `.card:hover` | state | Scale up slightly (`transform: scale(1.03)`), brighten border glow |
| `.card:focus-visible` | state | Outline ring for keyboard navigation |
| `.card--selected` | modifier | Added on vote — pulsing border glow animation |
| `.card--dimmed` | modifier | Added to the non-selected card — reduced opacity (0.6), no pointer events |
| `.card--voted` | modifier | Post-vote state — cursor default, hover disabled |
| `.card__label` | `<span>` | "Option A" / "Option B" label, small uppercase text |
| `.card__text` | `<p>` | The dilemma option text, large font weight 700 |
| `.card__results` | `<div>` | Results container — hidden by default (`display: none`), shown after vote |
| `.card__results--visible` | modifier | `display: block` with fade-in animation |
| `.card__progress` | `<div>` | Progress bar track — full width, border-radius, `--progress-track` bg |
| `.card__progress-bar` | `<div>` | Progress bar fill — animates width from 0% to computed value |
| `.card__progress-bar--a` | modifier | Uses `--progress-fill-a` colour |
| `.card__progress-bar--b` | modifier | Uses `--progress-fill-b` colour |
| `.card__percentage` | `<span>` | Large percentage number (e.g., "63%"), `--font-accent` |
| `.card__votes` | `<span>` | Vote count text "(142 votes)", `--text-secondary` |
| `.vs-badge` | `<div>` | Circular badge between cards — gold bg, dark text, centered |
| `.controls` | `<div>` | Button container — flex, gap, centered |
| `.btn` | `<button>` | Base button styles — padding, border-radius, font, transition |
| `.btn--next` | modifier | Green accent background (`--accent`), white text |
| `.btn--next:hover` | state | `--accent-hover` background, slight scale |
| `.btn--next:disabled` | state | `--disabled` background, no pointer events, reduced opacity |
| `.btn--reset` | modifier | Outlined style, `--danger` border and text |
| `.btn--reset:hover` | state | Filled `--danger` background, white text |
| `.done-screen` | `<section>` | All-done overlay — hidden by default, centered column layout |
| `.done-screen--visible` | modifier | Displayed with fade-in |
| `.done-screen__title` | `<h2>` | Completion heading |
| `.done-screen__text` | `<p>` | Completion message |
| `.footer` | `<footer>` | Bottom footer — centered, padding, border top |
| `.footer__text` | `<p>` | Footer content text |

### Key Style Rules — Detail

#### Card Hover & Focus

```css
.card {
  flex: 1;
  min-height: 220px;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal),
              opacity var(--transition-normal);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  position: relative;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.1);
}

.card:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

.card--a {
  background: linear-gradient(135deg, var(--card-a-start), var(--card-a-end));
}

.card--b {
  background: linear-gradient(135deg, var(--card-b-start), var(--card-b-end));
}
```

#### Selected & Dimmed States

```css
.card--selected {
  transform: scale(1.05);
  border-color: var(--glow-selected);
  box-shadow: 0 0 30px var(--glow-selected);
  animation: pulse-glow 1s ease-in-out;
}

.card--dimmed {
  opacity: 0.55;
  transform: scale(0.97);
  pointer-events: none;
}

.card--voted {
  cursor: default;
}

.card--voted:hover {
  transform: none;
  box-shadow: none;
}
```

#### Progress Bar Animation

```css
.card__progress {
  width: 100%;
  height: 12px;
  background: var(--progress-track);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.card__progress-bar {
  height: 100%;
  width: 0%;
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.card__progress-bar--a {
  background: var(--progress-fill-a);
}

.card__progress-bar--b {
  background: var(--progress-fill-b);
}
```

#### Animations

```css
@keyframes pulse-glow {
  0%   { box-shadow: 0 0 10px var(--glow-selected); }
  50%  { box-shadow: 0 0 40px var(--glow-selected); }
  100% { box-shadow: 0 0 20px var(--glow-selected); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card__results--visible {
  display: block;
  animation: fade-in 0.5s ease forwards;
}
```

#### VS Badge

```css
.vs-badge {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--vs-colour);
  color: var(--bg-primary);
  font-family: var(--font-accent);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 16px rgba(255, 216, 3, 0.4);
  z-index: 2;
}
```

#### Dilemma Layout

```css
.dilemma {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 900px;
  margin: var(--spacing-xl) auto;
}

/* Tablet */
@media (max-width: 899px) {
  .dilemma {
    gap: var(--spacing-md);
  }
  .card {
    min-height: 180px;
    padding: var(--spacing-lg);
  }
}

/* Mobile */
@media (max-width: 639px) {
  .dilemma {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  .vs-badge {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  .card {
    width: 100%;
    min-height: 150px;
  }
}
```

#### Buttons

```css
.btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 600;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background var(--transition-fast),
              transform var(--transition-fast),
              box-shadow var(--transition-fast);
  letter-spacing: 0.5px;
}

.btn--next {
  background: var(--accent);
  color: var(--text-primary);
}

.btn--next:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.btn--next:disabled {
  background: var(--disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--reset {
  background: transparent;
  color: var(--danger);
  border-color: var(--danger);
}

.btn--reset:hover {
  background: var(--danger);
  color: var(--text-primary);
}
```

---

## 6. JavaScript Architecture

### File Structure

```text
js/
├── main.js              ← Entry point: imports modules, initialises app
└── modules/
    ├── questions.js      ← Question bank data array
    ├── game.js           ← Game state management, question navigation
    ├── voting.js         ← Vote recording, percentage calculation, localStorage
    └── ui.js             ← DOM manipulation, rendering, animations
```

### Module: `js/modules/questions.js`

Exports the question bank as an array of objects.

```javascript
/**
 * @typedef {Object} Question
 * @property {string} id        — Unique identifier (e.g., "q1", "q2")
 * @property {string} optionA   — Text for option A
 * @property {string} optionB   — Text for option B
 */

/** @type {Question[]} */
export const questions = [
  { id: 'q1', optionA: '...', optionB: '...' },
  // ... 20+ entries (see Section 8)
];
```

**Functions exported:** None (data-only module).

### Module: `js/modules/voting.js`

Handles all vote data: recording, reading, calculating, clearing.

```javascript
/**
 * @function getVotes
 * @param {string} questionId — The question's unique ID
 * @returns {{ a: number, b: number }} — Vote counts for option A and B
 * @description Reads vote tallies from localStorage for a given question.
 */
export function getVotes(questionId) { ... }

/**
 * @function recordVote
 * @param {string} questionId — The question's unique ID
 * @param {'a' | 'b'} choice — Which option was chosen
 * @returns {{ a: number, b: number }} — Updated vote counts
 * @description Increments the vote count for the chosen option in localStorage.
 *              Also marks the question as answered for the current user.
 */
export function recordVote(questionId, choice) { ... }

/**
 * @function hasVoted
 * @param {string} questionId — The question's unique ID
 * @returns {boolean} — True if the user has already voted on this question
 * @description Checks localStorage for a record of the user voting on this question.
 */
export function hasVoted(questionId) { ... }

/**
 * @function calculatePercentages
 * @param {{ a: number, b: number }} votes — Raw vote counts
 * @returns {{ a: number, b: number }} — Percentages (0–100), always summing to 100
 * @description Computes percentage split. If total is 0, returns { a: 50, b: 50 }.
 */
export function calculatePercentages(votes) { ... }

/**
 * @function resetAllVotes
 * @returns {void}
 * @description Clears all vote data and user vote records from localStorage.
 */
export function resetAllVotes() { ... }

/**
 * @function getAnsweredCount
 * @returns {number} — Number of questions the user has voted on
 * @description Counts how many questions have a user vote record in localStorage.
 */
export function getAnsweredCount() { ... }
```

**localStorage schema:**

| Key | Value | Example |
|---|---|---|
| `wyr_votes_{questionId}` | JSON `{ "a": number, "b": number }` | `wyr_votes_q1` → `{"a": 142, "b": 84}` |
| `wyr_user_votes` | JSON `{ [questionId]: "a" \| "b" }` | `{"q1": "a", "q3": "b"}` |

### Module: `js/modules/ui.js`

All DOM manipulation and rendering logic.

```javascript
/**
 * @function renderQuestion
 * @param {Question} question — The question object to display
 * @param {boolean} alreadyVoted — Whether the user already voted on this question
 * @param {{ a: number, b: number } | null} existingVotes — Previous votes if already voted
 * @returns {void}
 * @description Updates the card text, hides/shows results, sets card interactivity.
 */
export function renderQuestion(question, alreadyVoted, existingVotes) { ... }

/**
 * @function showResults
 * @param {{ a: number, b: number }} votes — Raw vote counts
 * @param {{ a: number, b: number }} percentages — Calculated percentages
 * @param {'a' | 'b'} userChoice — Which option the user picked
 * @returns {void}
 * @description Reveals result bars with animated width transition, percentage text,
 *              vote counts. Adds selected/dimmed classes to cards.
 */
export function showResults(votes, percentages, userChoice) { ... }

/**
 * @function updateCounter
 * @param {number} current — Current question index (1-based)
 * @param {number} total — Total number of questions
 * @param {Set<string>} answeredIds — Set of answered question IDs
 * @returns {void}
 * @description Updates the "Question X of Y" text and dot indicators.
 */
export function updateCounter(current, total, answeredIds) { ... }

/**
 * @function renderDots
 * @param {number} total — Total number of questions
 * @param {number} currentIndex — Current question index (0-based)
 * @param {Set<string>} answeredIds — Set of answered question IDs
 * @param {Question[]} orderedQuestions — Questions in display order
 * @returns {void}
 * @description Generates dot span elements in the counter__dots container.
 */
export function renderDots(total, currentIndex, answeredIds, orderedQuestions) { ... }

/**
 * @function showDoneScreen
 * @returns {void}
 * @description Hides the dilemma section and controls, shows the done screen.
 */
export function showDoneScreen() { ... }

/**
 * @function hideDoneScreen
 * @returns {void}
 * @description Hides the done screen, shows the dilemma section and controls.
 */
export function hideDoneScreen() { ... }

/**
 * @function updateFooter
 * @param {number} answeredCount — Number of questions answered
 * @returns {void}
 * @description Updates the footer total answered count.
 */
export function updateFooter(answeredCount) { ... }

/**
 * @function animateCardTransition
 * @param {'in' | 'out'} direction — Whether cards are entering or leaving
 * @returns {Promise<void>} — Resolves when animation completes
 * @description Adds slide-up or fade-out classes; resolves after transition.
 */
export function animateCardTransition(direction) { ... }

/**
 * @function setNextButtonState
 * @param {boolean} enabled — Whether the button should be enabled
 * @returns {void}
 */
export function setNextButtonState(enabled) { ... }
```

### Module: `js/modules/game.js`

Core game state: shuffling, navigation, event coordination.

```javascript
/**
 * @function initGame
 * @returns {void}
 * @description Shuffles the question bank, sets the starting index,
 *              loads the first unanswered question, renders UI.
 */
export function initGame() { ... }

/**
 * @function shuffleQuestions
 * @param {Question[]} questionsArray — The full question bank
 * @returns {Question[]} — A new shuffled copy of the array
 * @description Fisher-Yates shuffle for randomisation.
 */
export function shuffleQuestions(questionsArray) { ... }

/**
 * @function loadQuestion
 * @param {number} index — Index into the shuffled questions array
 * @returns {void}
 * @description Loads the question at the given index. If already voted,
 *              immediately shows results. Updates counter and dots.
 */
export function loadQuestion(index) { ... }

/**
 * @function handleVote
 * @param {'a' | 'b'} choice — The option the user chose
 * @returns {void}
 * @description Records the vote, calculates percentages, triggers result reveal,
 *              enables the Next button.
 */
export function handleVote(choice) { ... }

/**
 * @function nextQuestion
 * @returns {void}
 * @description Advances to the next question. If all answered, shows done screen.
 */
export function nextQuestion() { ... }

/**
 * @function resetGame
 * @returns {void}
 * @description Clears all votes, reshuffles questions, restarts from the beginning.
 */
export function resetGame() { ... }

/**
 * @function getCurrentQuestion
 * @returns {Question} — The question object currently on screen
 */
export function getCurrentQuestion() { ... }
```

### Entry Point: `js/main.js`

```javascript
/**
 * File: main.js
 * Description: Entry point — imports game module and binds DOM event listeners.
 * Author: Student
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { initGame, handleVote, nextQuestion, resetGame } from './modules/game.js';

/**
 * @function setupEventListeners
 * @returns {void}
 * @description Binds click and keyboard listeners to cards, buttons.
 *              - Card A click/Enter → handleVote('a')
 *              - Card B click/Enter → handleVote('b')
 *              - Next button click → nextQuestion()
 *              - Reset button click → confirm dialog → resetGame()
 *              - Replay button click → resetGame()
 */
function setupEventListeners() { ... }

// Initialise on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setupEventListeners();
});
```

---

## 7. Feature Details

### 7.1 Question Randomisation

- **Shuffle algorithm**: Fisher-Yates (Knuth) shuffle on a copy of the questions array.
- **Timing**: Shuffle occurs once on `initGame()` and again on `resetGame()`.
- **No repeats**: The shuffled array is traversed linearly; each question appears exactly once per session.
- **Persistence**: The shuffle order is NOT saved — each page load produces a new order. Only votes persist.

```javascript
// Fisher-Yates shuffle
function shuffleQuestions(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### 7.2 Vote Recording

- On card click, `recordVote(questionId, choice)` is called.
- Reads current tallies from `localStorage` key `wyr_votes_{id}`, increments the chosen side, writes back.
- Also updates `wyr_user_votes` object to mark this question as voted by the user.
- All reads/writes use `JSON.parse()` / `JSON.stringify()` with `try/catch` for safety.

### 7.3 Percentage Calculation

```javascript
function calculatePercentages(votes) {
  const total = votes.a + votes.b;
  if (total === 0) return { a: 50, b: 50 };
  return {
    a: Math.round((votes.a / total) * 100),
    b: Math.round((votes.b / total) * 100)
  };
}
```

- Edge case: if rounding causes `a + b !== 100`, adjust the larger value to compensate.
- Zero votes → display 50/50 as a neutral state.

### 7.4 Animation on Reveal

1. User clicks a card.
2. Selected card receives `.card--selected` (pulse glow animation, slight scale-up).
3. Non-selected card receives `.card--dimmed` (opacity fade, slight scale-down).
4. After a 300ms delay, results containers receive `.card__results--visible` (fade-in).
5. Progress bar widths are set via inline style `width: XX%` — the CSS `transition: width 1s cubic-bezier(...)` handles the animated fill.
6. Percentage text counts up from 0 to the final value over 800ms using `requestAnimationFrame`.

### 7.5 Preventing Re-Voting

- `hasVoted(questionId)` checks the `wyr_user_votes` object in `localStorage`.
- If already voted, clicks on cards are ignored (the event handler returns early).
- Cards receive `.card--voted` class which sets `cursor: default` and disables hover effects.
- If the user revisits a question they already voted on (via Next/Back), results are shown immediately with their previous choice highlighted.

### 7.6 Next Question Navigation

- The "Next Question" button is disabled (`disabled` attribute) until the user votes.
- On click, `nextQuestion()` increments the index and calls `loadQuestion()`.
- A fade-out / slide-up transition occurs between questions (handled by `animateCardTransition()`).
- If the new index exceeds the array length, `showDoneScreen()` is called.

### 7.7 Reset Functionality

- "Reset All Votes" button triggers a `confirm()` dialog: "This will clear ALL vote data. Continue?"
- If confirmed, `resetAllVotes()` clears all `wyr_*` keys from `localStorage`.
- `initGame()` is called again to reshuffle and restart.
- The `window.confirm()` prevents accidental data loss.

### 7.8 All-Done Screen

- When every question in the shuffled array has been answered, the dilemma section and controls are hidden.
- The `.done-screen` is shown with a slide-up animation.
- A "Play Again" button calls `resetGame()`.

---

## 8. Questions Bank

At least 20 "Would You Rather?" dilemmas. Stored in `js/modules/questions.js`.

```javascript
export const questions = [
  {
    id: 'q1',
    optionA: 'Always be 10 minutes late to everything',
    optionB: 'Always be 20 minutes early to everything'
  },
  {
    id: 'q2',
    optionA: 'Be able to fly but only as fast as you can walk',
    optionB: 'Be able to run at 100 mph but not fly'
  },
  {
    id: 'q3',
    optionA: 'Have unlimited money but no friends',
    optionB: 'Have no money but the best friends in the world'
  },
  {
    id: 'q4',
    optionA: 'Live without music for the rest of your life',
    optionB: 'Live without movies and TV for the rest of your life'
  },
  {
    id: 'q5',
    optionA: 'Always have to speak your mind',
    optionB: 'Never be able to speak again'
  },
  {
    id: 'q6',
    optionA: 'Be able to read everyone\'s thoughts',
    optionB: 'Be able to make anyone do what you want'
  },
  {
    id: 'q7',
    optionA: 'Live in a world with no internet',
    optionB: 'Live in a world with no air conditioning or heating'
  },
  {
    id: 'q8',
    optionA: 'Have a rewind button for your life',
    optionB: 'Have a pause button for your life'
  },
  {
    id: 'q9',
    optionA: 'Be famous but constantly followed by paparazzi',
    optionB: 'Be unknown but free to do whatever you want'
  },
  {
    id: 'q10',
    optionA: 'Only be able to eat sweet foods',
    optionB: 'Only be able to eat savoury foods'
  },
  {
    id: 'q11',
    optionA: 'Have the ability to talk to animals',
    optionB: 'Have the ability to speak every human language fluently'
  },
  {
    id: 'q12',
    optionA: 'Live 200 years in the past',
    optionB: 'Live 200 years in the future'
  },
  {
    id: 'q13',
    optionA: 'Always feel too hot no matter what',
    optionB: 'Always feel too cold no matter what'
  },
  {
    id: 'q14',
    optionA: 'Have a photographic memory',
    optionB: 'Have the ability to forget anything you want'
  },
  {
    id: 'q15',
    optionA: 'Be the funniest person in every room',
    optionB: 'Be the smartest person in every room'
  },
  {
    id: 'q16',
    optionA: 'Never have to sleep but you can\'t rest either',
    optionB: 'Need to sleep 12 hours a day but dreams are amazing'
  },
  {
    id: 'q17',
    optionA: 'Only be able to whisper for the rest of your life',
    optionB: 'Only be able to shout for the rest of your life'
  },
  {
    id: 'q18',
    optionA: 'Know the date of your own death',
    optionB: 'Know the cause of your own death'
  },
  {
    id: 'q19',
    optionA: 'Have free Wi-Fi everywhere you go',
    optionB: 'Have free coffee everywhere you go'
  },
  {
    id: 'q20',
    optionA: 'Be stuck in a lift with your worst enemy for 3 hours',
    optionB: 'Be stuck on a broken rollercoaster for 3 hours'
  },
  {
    id: 'q21',
    optionA: 'Have hands for feet',
    optionB: 'Have feet for hands'
  },
  {
    id: 'q22',
    optionA: 'Live in a treehouse in the middle of a forest',
    optionB: 'Live in a houseboat on the open ocean'
  },
  {
    id: 'q23',
    optionA: 'Be able to teleport but only to places you\'ve been before',
    optionB: 'Be able to time travel but only for 10 minutes at a time'
  },
  {
    id: 'q24',
    optionA: 'Have your life narrated by Morgan Freeman',
    optionB: 'Have your life narrated by David Attenborough'
  },
  {
    id: 'q25',
    optionA: 'Give up your smartphone forever',
    optionB: 'Give up your favourite food forever'
  }
];
```

---

## 9. Implementation Order

### Step 1: Project Scaffolding
- Create folder structure: `index.html`, `js/`, `js/modules/`, `styles/`, `assets/`.
- Create empty placeholder files: `js/main.js`, `js/modules/questions.js`, `js/modules/voting.js`, `js/modules/game.js`, `js/modules/ui.js`, `styles/main.css`.

### Step 2: Questions Data
- Populate `js/modules/questions.js` with the full 25-question bank from Section 8.
- Export the array.

### Step 3: HTML Markup
- Build `index.html` exactly as defined in Section 4.
- Include Google Fonts link, stylesheet link, and module script tag.
- Verify the page loads in a browser (blank but no errors).

### Step 4: CSS — Variables & Reset
- Add the `:root` CSS variables block from Section 3.
- Add the reset and base body styles.
- Add Google Fonts `@import` or confirm the `<link>` tag works.

### Step 5: CSS — Layout & Cards
- Style the `.header`, `.app`, `.counter`, `.dilemma` flex container.
- Style `.card`, `.card--a`, `.card--b` with gradients, padding, border-radius.
- Style `.vs-badge`.
- Test two cards side by side in the browser.

### Step 6: CSS — Buttons, Footer, Responsive
- Style `.btn`, `.btn--next`, `.btn--reset`, `.controls`.
- Style `.footer`.
- Add media queries for tablet (≤899px) and mobile (≤639px).
- Test on different viewport sizes.

### Step 7: CSS — Animations & States
- Add `@keyframes` for `pulse-glow`, `fade-in`, `slide-up`.
- Style `.card--selected`, `.card--dimmed`, `.card--voted`.
- Style `.card__results`, `.card__results--visible`, `.card__progress`, `.card__progress-bar`.
- Style `.card__percentage`, `.card__votes`.
- Style `.done-screen`, `.done-screen--visible`.

### Step 8: JavaScript — Voting Module
- Implement all functions in `js/modules/voting.js`: `getVotes`, `recordVote`, `hasVoted`, `calculatePercentages`, `resetAllVotes`, `getAnsweredCount`.
- Test in browser console by calling functions directly.

### Step 9: JavaScript — UI Module
- Implement `renderQuestion`, `showResults`, `updateCounter`, `renderDots`, `showDoneScreen`, `hideDoneScreen`, `updateFooter`, `animateCardTransition`, `setNextButtonState` in `js/modules/ui.js`.
- Wire up to DOM elements by ID.

### Step 10: JavaScript — Game Module
- Implement `initGame`, `shuffleQuestions`, `loadQuestion`, `handleVote`, `nextQuestion`, `resetGame`, `getCurrentQuestion` in `js/modules/game.js`.
- This module imports from `questions.js`, `voting.js`, and `ui.js`.

### Step 11: JavaScript — Main Entry
- Implement `js/main.js`: import `initGame`, bind event listeners to cards and buttons.
- Handle both click and keyboard (Enter/Space) events on cards.
- Add `confirm()` dialog for reset button.

### Step 12: Integration Testing
- Open the app. Verify:
  - A random question appears.
  - Clicking a card records the vote and shows animated percentages.
  - Next button is disabled until voted, then enabled.
  - Next loads a new question.
  - Previously voted questions show results immediately when navigated back to.
  - All questions answered → done screen appears.
  - Reset clears everything and restarts.
  - Refresh the page → votes persist, user vote records persist.
- Test on mobile viewport.
- Test keyboard navigation (Tab to cards, Enter to vote, Tab to Next).

### Step 13: Polish & Edge Cases
- Handle `localStorage` being unavailable (private browsing) — wrap in `try/catch`, fall back to in-memory object.
- Ensure percentage rounding always sums to 100.
- Add subtle hover sound or haptic feedback (optional stretch).
- Verify WCAG AA contrast on all text.
- Minify nothing — keep source readable for student project.
