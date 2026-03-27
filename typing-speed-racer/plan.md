# Typing Speed Racer — Implementation Plan

## 1. Overview

Typing Speed Racer is a single-player browser game where the player types words as fast as possible to drive a car across a race track. Each correctly typed word advances the car along the track; typing speed directly maps to car velocity. The game tracks **words per minute (WPM)** and **accuracy** in real time and presents a summary screen at the end of each race.

**Core loop:**

1. Player presses **Start** → a 3-2-1 countdown begins.
2. A word appears on screen from a randomised word bank.
3. The player types the word and presses **Space** or **Enter** to submit.
4. Correct → car moves forward, WPM/accuracy update. Incorrect → word flagged red, accuracy drops.
5. Timer counts down (default 60 s). When it hits 0 the race ends.
6. A results modal shows final WPM, accuracy, and total words typed.
7. Player clicks **Restart** to race again.

**Tech stack:** HTML5, CSS3, vanilla JavaScript (ES2022+, ES modules). No frameworks, no build step.

---

## 2. Page Layout

### 2.1 Wireframe (top → bottom)

```text
┌──────────────────────────────────────────────────────────────────┐
│  HEADER — "Typing Speed Racer" title + subtitle                  │
├──────────────────────────────────────────────────────────────────┤
│  DASHBOARD BAR                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │
│  │ ⏱ Timer │  │ WPM: 0  │  │ Acc: 0% │  │ Words: 0 / 50       │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  RACE TRACK SECTION                                              │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  ░░░░░░░░░░░░░ road surface ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │  🚗─────────────────────────────────────────────── 🏁        ││
│  │  ░░░░░░░░░░░░░ road surface ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │  ┌───────────── progress bar (% complete) ─────────────────┐ ││
│  │  └─────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  WORD DISPLAY AREA                                               │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  previous₁  previous₂  [CURRENT WORD]  next₁  next₂  next₃ ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  INPUT AREA                                                      │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  [ text input field                                ▍]        ││
│  └──────────────────────────────────────────────────────────────┘│
│  Character-by-character feedback shown inline below input        │
├──────────────────────────────────────────────────────────────────┤
│  CONTROLS                                                        │
│  [ ▶ Start Race ]   [ ↻ Restart ]                                │
├──────────────────────────────────────────────────────────────────┤
│  COUNTDOWN OVERLAY (hidden by default)                           │
│  Covers the screen with a large "3… 2… 1… GO!" before race      │
├──────────────────────────────────────────────────────────────────┤
│  RESULTS MODAL (hidden by default)                               │
│  ┌────────────────────────┐                                      │
│  │  🏁 Race Finished!     │                                      │
│  │  WPM: 72               │                                      │
│  │  Accuracy: 94%         │                                      │
│  │  Words Typed: 48       │                                      │
│  │  [ Race Again ]        │                                      │
│  └────────────────────────┘                                      │
├──────────────────────────────────────────────────────────────────┤
│  FOOTER — "Built with HTML, CSS & JS"                            │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Section Breakdown

| Section | Purpose | Key elements |
|---|---|---|
| Header | Branding | `h1` title, tagline `p` |
| Dashboard Bar | Live stats | Timer, WPM, accuracy %, words completed counter |
| Race Track | Visual feedback of progress | Road graphic (`div` with CSS), car element (`div`/emoji/SVG), finish flag, progress bar beneath |
| Word Display | Show upcoming and completed words | Scrollable word queue; current word centred & highlighted |
| Input Area | Player types here | `<input type="text">`, character-level feedback `<span>` elements below |
| Controls | Start / Restart | Two `<button>` elements |
| Countdown Overlay | Pre-race countdown | Full-screen overlay with animated number |
| Results Modal | End-of-race stats | Modal dialog with final stats and "Race Again" button |
| Footer | Credits | Single line |

---

## 3. Colour Scheme & Typography

### 3.1 Colour Palette (Racing Theme)

| Token | Hex Code | Usage |
|---|---|---|
| `--colour-bg` | `#0f0f1a` | Page background — deep midnight blue |
| `--colour-surface` | `#1a1a2e` | Cards, dashboard, modal backgrounds |
| `--colour-track` | `#2d2d44` | Race track road surface |
| `--colour-lane-line` | `#ffffff33` | Dashed lane markings (semi-transparent white) |
| `--colour-primary` | `#e63946` | Primary accent — racing red (buttons, car) |
| `--colour-primary-hover` | `#c1121f` | Button hover state |
| `--colour-secondary` | `#f1faee` | Light text on dark backgrounds |
| `--colour-accent` | `#ffbe0b` | Timer, countdown numbers, highlights |
| `--colour-correct` | `#06d6a0` | Correct character / word highlight — green |
| `--colour-wrong` | `#ef476f` | Incorrect character / word highlight — red |
| `--colour-muted` | `#8d99ae` | Placeholder text, secondary info |
| `--colour-progress-bg` | `#2d2d44` | Progress bar track |
| `--colour-progress-fill` | `#06d6a0` | Progress bar fill |
| `--colour-overlay` | `#0f0f1acc` | Semi-transparent overlay for countdown/modal |

### 3.2 Typography

| Usage | Font | Fallback | Size |
|---|---|---|---|
| Headings | `'Orbitron'` (Google Fonts) | `sans-serif` | `h1`: 2.5 rem, `h2`: 1.8 rem |
| Body text | `'Inter'` (Google Fonts) | `system-ui, sans-serif` | 1 rem (16 px base) |
| Typing input | `'Fira Code'` (Google Fonts) | `'Courier New', monospace` | 1.25 rem |
| Word display | `'Fira Code'` | `monospace` | 1.5 rem |
| Dashboard numbers | `'Orbitron'` | `sans-serif` | 1.4 rem |
| Countdown overlay | `'Orbitron'` | `sans-serif` | 6 rem |

**Google Fonts link (preconnect + stylesheet):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet">
```

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Typing Speed Racer</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <h1 class="header__title">Typing Speed Racer</h1>
    <p class="header__tagline">Type fast. Drive faster.</p>
  </header>

  <!-- MAIN CONTENT -->
  <main class="game">

    <!-- DASHBOARD -->
    <section class="dashboard" aria-label="Race statistics">
      <div class="dashboard__stat">
        <span class="dashboard__label">Time</span>
        <span class="dashboard__value" id="timer">60</span>
      </div>
      <div class="dashboard__stat">
        <span class="dashboard__label">WPM</span>
        <span class="dashboard__value" id="wpm" aria-live="polite">0</span>
      </div>
      <div class="dashboard__stat">
        <span class="dashboard__label">Accuracy</span>
        <span class="dashboard__value" id="accuracy">100%</span>
      </div>
      <div class="dashboard__stat">
        <span class="dashboard__label">Words</span>
        <span class="dashboard__value" id="word-count">0</span>
      </div>
    </section>

    <!-- RACE TRACK -->
    <section class="track" aria-label="Race track">
      <div class="track__road">
        <div class="track__lane-lines"></div>
        <div class="track__car" id="car" role="img" aria-label="Your racing car">🏎️</div>
        <div class="track__finish" aria-label="Finish line">🏁</div>
      </div>
      <div class="track__progress">
        <div class="track__progress-bar" id="progress-bar" role="progressbar"
             aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </section>

    <!-- WORD DISPLAY -->
    <section class="words" aria-label="Words to type">
      <div class="words__queue" id="word-queue">
        <!-- Populated by JS: <span class="words__word words__word--past">hello</span> -->
        <!-- <span class="words__word words__word--current">world</span> -->
        <!-- <span class="words__word words__word--upcoming">example</span> -->
      </div>
    </section>

    <!-- INPUT AREA -->
    <section class="input-area" aria-label="Typing input">
      <label for="typing-input" class="sr-only">Type the displayed word</label>
      <input type="text" id="typing-input" class="input-area__field"
             placeholder="Type here…" autocomplete="off" autocapitalize="off"
             autocorrect="off" spellcheck="false" disabled>
      <div class="input-area__feedback" id="char-feedback" aria-live="polite">
        <!-- Character-by-character spans injected by JS -->
      </div>
    </section>

    <!-- CONTROLS -->
    <section class="controls" aria-label="Game controls">
      <button class="controls__btn controls__btn--start" id="start-btn" type="button">
        ▶ Start Race
      </button>
      <button class="controls__btn controls__btn--restart" id="restart-btn" type="button" disabled>
        ↻ Restart
      </button>
    </section>

  </main>

  <!-- COUNTDOWN OVERLAY -->
  <div class="countdown-overlay" id="countdown-overlay" aria-live="assertive" hidden>
    <span class="countdown-overlay__number" id="countdown-number"></span>
  </div>

  <!-- RESULTS MODAL -->
  <div class="results-modal" id="results-modal" role="dialog" aria-modal="true"
       aria-labelledby="results-title" hidden>
    <div class="results-modal__content">
      <h2 class="results-modal__title" id="results-title">🏁 Race Finished!</h2>
      <dl class="results-modal__stats">
        <div class="results-modal__stat">
          <dt>WPM</dt>
          <dd id="result-wpm">0</dd>
        </div>
        <div class="results-modal__stat">
          <dt>Accuracy</dt>
          <dd id="result-accuracy">0%</dd>
        </div>
        <div class="results-modal__stat">
          <dt>Words Typed</dt>
          <dd id="result-words">0</dd>
        </div>
        <div class="results-modal__stat">
          <dt>Correct Words</dt>
          <dd id="result-correct">0</dd>
        </div>
      </dl>
      <button class="controls__btn controls__btn--start" id="race-again-btn" type="button">
        Race Again
      </button>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <p>Built with HTML, CSS &amp; JavaScript</p>
  </footer>

  <!-- SCRIPTS (ES module) -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 5. CSS Design

### 5.1 File: `styles/main.css`

#### 5.1.1 CSS Custom Properties (`:root`)

```css
:root {
  /* Colours */
  --colour-bg: #0f0f1a;
  --colour-surface: #1a1a2e;
  --colour-track: #2d2d44;
  --colour-lane-line: #ffffff33;
  --colour-primary: #e63946;
  --colour-primary-hover: #c1121f;
  --colour-secondary: #f1faee;
  --colour-accent: #ffbe0b;
  --colour-correct: #06d6a0;
  --colour-wrong: #ef476f;
  --colour-muted: #8d99ae;
  --colour-progress-bg: #2d2d44;
  --colour-progress-fill: #06d6a0;
  --colour-overlay: #0f0f1acc;

  /* Typography */
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Layout */
  --max-width: 900px;
  --border-radius: 8px;
}
```

#### 5.1.2 Reset & Base

- `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
- `body` — full viewport, `background: var(--colour-bg)`, `color: var(--colour-secondary)`, `font-family: var(--font-body)`, `min-height: 100vh`, flex column centred.
- `.sr-only` — screen-reader-only utility class (visually hidden but accessible).

#### 5.1.3 Header

- `.header` — centred text, padding `var(--space-xl)`.
- `.header__title` — `font-family: var(--font-heading)`, `font-size: 2.5rem`, `color: var(--colour-primary)`, `text-transform: uppercase`, `letter-spacing: 0.1em`.
- `.header__tagline` — `color: var(--colour-muted)`, `font-size: 1.1rem`.

#### 5.1.4 Dashboard

- `.dashboard` — flex row, `justify-content: center`, `gap: var(--space-lg)`, `background: var(--colour-surface)`, `border-radius: var(--border-radius)`, padding `var(--space-md) var(--space-lg)`.
- `.dashboard__stat` — flex column, align centre.
- `.dashboard__label` — `font-size: 0.75rem`, `text-transform: uppercase`, `color: var(--colour-muted)`, `letter-spacing: 0.05em`.
- `.dashboard__value` — `font-family: var(--font-heading)`, `font-size: 1.4rem`, `font-weight: 700`, `color: var(--colour-accent)`.

#### 5.1.5 Race Track

- `.track` — `max-width: var(--max-width)`, margin auto, padding `var(--space-lg) 0`.
- `.track__road` — `position: relative`, `height: 100px`, `background: var(--colour-track)`, `border-radius: var(--border-radius)`, `overflow: hidden`, `border: 2px solid var(--colour-lane-line)`.
- `.track__lane-lines` — pseudo-element `::before` with `background: repeating-linear-gradient(90deg, transparent, transparent 30px, var(--colour-lane-line) 30px, var(--colour-lane-line) 60px)` across the centre of the road.
- `.track__car` — `position: absolute`, `top: 50%`, `transform: translateY(-50%)`, `left: 2%`, `font-size: 2.5rem`, `transition: left 0.3s ease-out`. JS updates `left` from `2%` to `92%`.
- `.track__finish` — `position: absolute`, `right: 2%`, `top: 50%`, `transform: translateY(-50%)`, `font-size: 2rem`.
- **Progress bar** — `.track__progress` height `8px`, `background: var(--colour-progress-bg)`, rounded. `.track__progress-bar` — `width: 0%`, `height: 100%`, `background: var(--colour-progress-fill)`, `transition: width 0.3s ease-out`, `border-radius` inherited.

#### 5.1.6 Word Display

- `.words` — text-centre, `padding: var(--space-lg)`, `background: var(--colour-surface)`, `border-radius: var(--border-radius)`.
- `.words__queue` — flex row, `gap: var(--space-md)`, centred, `flex-wrap: nowrap`, `overflow: hidden`.
- `.words__word` — `font-family: var(--font-mono)`, `font-size: 1.5rem`, `padding: var(--space-xs) var(--space-sm)`, `border-radius: 4px`, `transition: all 0.2s`.
- `.words__word--current` — `background: var(--colour-accent)`, `color: var(--colour-bg)`, `font-weight: 600`, `transform: scale(1.1)`.
- `.words__word--correct` — `color: var(--colour-correct)`, `opacity: 0.6`.
- `.words__word--wrong` — `color: var(--colour-wrong)`, `text-decoration: line-through`, `opacity: 0.6`.
- `.words__word--upcoming` — `color: var(--colour-muted)`.

#### 5.1.7 Input Area

- `.input-area__field` — `width: 100%`, `max-width: var(--max-width)`, `padding: var(--space-md)`, `font-family: var(--font-mono)`, `font-size: 1.25rem`, `background: var(--colour-surface)`, `color: var(--colour-secondary)`, `border: 2px solid var(--colour-track)`, `border-radius: var(--border-radius)`, `outline: none`. Focus: `border-color: var(--colour-accent)`, `box-shadow: 0 0 0 3px var(--colour-accent)33`.
- `.input-area__field:disabled` — `opacity: 0.5`, `cursor: not-allowed`.
- `.input-area__feedback` — flex row of `<span>` characters below the input, `font-family: var(--font-mono)`, `font-size: 1.1rem`, `letter-spacing: 0.15em`, `min-height: 1.6rem`.
- `.input-area__feedback .char--correct` — `color: var(--colour-correct)`.
- `.input-area__feedback .char--wrong` — `color: var(--colour-wrong)`, `text-decoration: underline`.
- `.input-area__feedback .char--pending` — `color: var(--colour-muted)`.

#### 5.1.8 Controls

- `.controls` — flex row, centred, `gap: var(--space-md)`.
- `.controls__btn` — `font-family: var(--font-heading)`, `font-size: 1rem`, `padding: var(--space-sm) var(--space-lg)`, `border: none`, `border-radius: var(--border-radius)`, `cursor: pointer`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `transition: background 0.2s`.
- `.controls__btn--start` — `background: var(--colour-primary)`, `color: var(--colour-secondary)`. Hover: `background: var(--colour-primary-hover)`.
- `.controls__btn--restart` — `background: var(--colour-track)`, `color: var(--colour-secondary)`. Hover: `background: var(--colour-muted)`.
- `.controls__btn:disabled` — `opacity: 0.4`, `cursor: not-allowed`.

#### 5.1.9 Countdown Overlay

- `.countdown-overlay` — `position: fixed`, `inset: 0`, `background: var(--colour-overlay)`, `display: flex`, `justify-content: center`, `align-items: center`, `z-index: 100`.
- `.countdown-overlay[hidden]` — `display: none`.
- `.countdown-overlay__number` — `font-family: var(--font-heading)`, `font-size: 6rem`, `font-weight: 900`, `color: var(--colour-accent)`, animate with `@keyframes countdown-pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }`, `animation: countdown-pulse 0.8s ease-out`.

#### 5.1.10 Results Modal

- `.results-modal` — `position: fixed`, `inset: 0`, `background: var(--colour-overlay)`, flex centred, `z-index: 200`.
- `.results-modal[hidden]` — `display: none`.
- `.results-modal__content` — `background: var(--colour-surface)`, `border-radius: var(--border-radius)`, `padding: var(--space-2xl)`, `text-align: center`, `min-width: 320px`, `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`.
- `.results-modal__title` — `font-family: var(--font-heading)`, `font-size: 1.8rem`, `color: var(--colour-accent)`.
- `.results-modal__stats` — grid or flex layout for stat pairs, `gap: var(--space-md)`.
- `.results-modal__stat dt` — `color: var(--colour-muted)`, `font-size: 0.85rem`, uppercase.
- `.results-modal__stat dd` — `font-family: var(--font-heading)`, `font-size: 1.4rem`, `color: var(--colour-secondary)`, `font-weight: 700`.

#### 5.1.11 Footer

- `.footer` — `padding: var(--space-md)`, `text-align: center`, `color: var(--colour-muted)`, `font-size: 0.85rem`.

#### 5.1.12 Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤ 768px` (tablet) | Dashboard wraps to 2×2 grid. Word font size drops to 1.2 rem. Track height drops to 80 px. Car font size to 2 rem. |
| `≤ 480px` (mobile) | Dashboard stacks vertically. Word queue shows only current + 1 upcoming. Input font size to 1 rem. Countdown number 4 rem. |

#### 5.1.13 Animations Summary

| Animation | CSS property | Trigger |
|---|---|---|
| Car movement | `left` via `transition: left 0.3s ease-out` | JS sets inline `style.left` on correct word |
| Progress bar | `width` via `transition: width 0.3s ease-out` | JS sets inline `style.width` |
| Countdown pulse | `@keyframes countdown-pulse` (scale + opacity) | Applied each countdown tick |
| Word highlight | `background`, `transform` via `transition: all 0.2s` | CSS class toggle |
| Input focus glow | `border-color`, `box-shadow` | `:focus` pseudo-class |
| Modal entrance | `@keyframes modal-fade-in` (opacity 0→1, translateY 20px→0) | Removing `hidden` attribute |

---

## 6. JavaScript Architecture

All modules use ES module `import`/`export`. Entry point loaded via `<script type="module" src="js/main.js">`.

### 6.1 `js/main.js` — Entry Point & Event Listeners

**Purpose:** Bootstrap the application. Wire up DOM event listeners. Coordinate between modules.

```text
Imports: game, ui, input
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Called on `DOMContentLoaded`. Caches DOM references, calls `ui.init()`, attaches event listeners |
| `onStartClick()` | — | `void` | Handler for Start button click. Disables button, calls `game.startCountdown()` |
| `onRestartClick()` | — | `void` | Handler for Restart / Race Again button click. Calls `game.reset()`, re-enables Start |
| `onInputKeydown(event)` | `KeyboardEvent` | `void` | Listens for Space/Enter to submit the current word via `input.submitWord()` |
| `onInputChange(event)` | `InputEvent` | `void` | Listens for every keystroke, calls `input.handleTyping(event.target.value)` for live character feedback |

#### Event Listeners Attached

| Target | Event | Handler |
|---|---|---|
| `#start-btn` | `click` | `onStartClick` |
| `#restart-btn` | `click` | `onRestartClick` |
| `#race-again-btn` | `click` | `onRestartClick` |
| `#typing-input` | `keydown` | `onInputKeydown` |
| `#typing-input` | `input` | `onInputChange` |
| `document` | `DOMContentLoaded` | `init` |

---

### 6.2 `js/modules/game.js` — Game State, Timer, WPM & Accuracy

**Purpose:** Own all game state. Manage the countdown, race timer, WPM/accuracy calculation, and game lifecycle (start → running → finished).

#### State Object (private)

```js
const state = {
  status: 'idle',        // 'idle' | 'countdown' | 'running' | 'finished'
  timeRemaining: 60,     // seconds (configurable)
  totalTime: 60,         // seconds (configurable)
  timerInterval: null,    // setInterval ID
  wordsTyped: 0,          // total words submitted
  correctWords: 0,        // correctly typed words
  incorrectWords: 0,      // incorrectly typed words
  totalCharsTyped: 0,     // all characters typed (for raw WPM)
  correctChars: 0,        // correctly typed characters
  startTimestamp: null,    // Date.now() at race start
  currentWordIndex: 0,    // index into the word list
  wordList: [],           // array of word strings for this race
};
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `getState()` | — | `object` (copy of state) | Returns a shallow copy of current game state for other modules to read |
| `startCountdown()` | — | `void` | Sets status to `'countdown'`, shows overlay via `ui.showCountdown()`, counts 3→2→1→GO with 1 s intervals, then calls `startRace()` |
| `startRace()` | — | `void` | Sets status to `'running'`, generates word list via `words.generateWordList()`, stores in state, records `startTimestamp`, starts the 1 s timer interval via `tick()`, enables input, focuses it, calls `ui.renderWords()` |
| `tick()` | — | `void` | Decrements `timeRemaining`, calls `ui.updateTimer()`. If `timeRemaining <= 0`, calls `endRace()` |
| `submitWord(typed)` | `string` — the word the player submitted | `{ correct: boolean, target: string }` | Compares `typed.trim()` to `wordList[currentWordIndex]`. Updates `wordsTyped`, `correctWords` or `incorrectWords`, `totalCharsTyped`, `correctChars`. Advances `currentWordIndex`. Recalculates WPM & accuracy. Calls `ui.updateDashboard()`, `car.updatePosition()`, `ui.markWord()`. Returns result object |
| `calculateWPM()` | — | `number` | Formula: `(correctChars / 5) / elapsedMinutes`. `elapsedMinutes = (Date.now() - startTimestamp) / 60000`. Returns 0 if elapsed is 0 |
| `calculateAccuracy()` | — | `number` (0–100) | Formula: `(correctWords / wordsTyped) * 100`. Returns 100 if `wordsTyped` is 0 |
| `calculateProgress()` | — | `number` (0–100) | `(currentWordIndex / wordList.length) * 100` |
| `endRace()` | — | `void` | Clears timer interval, sets status to `'finished'`, disables input, calls `ui.showResults()` with final stats |
| `reset()` | — | `void` | Resets all state values to defaults. Calls `ui.resetUI()`. Sets status back to `'idle'` |
| `setDifficulty(level)` | `string` (`'easy'` \| `'medium'` \| `'hard'`) | `void` | Adjusts `totalTime` and word difficulty. Easy = 90 s + short words. Medium = 60 s + mixed. Hard = 45 s + long/complex words |

---

### 6.3 `js/modules/words.js` — Word Bank, Selection & Difficulty

**Purpose:** Supply word lists. Categorise words by difficulty. Provide randomised word sets for each race.

#### Word Bank Structure

```js
const WORD_BANK = {
  easy: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'boy',
    'did', 'cat', 'dog', 'run', 'big', 'red', 'sun', 'top', 'hat', 'cup',
    // 100+ short common words (2–4 letters)
  ],
  medium: [
    'about', 'would', 'there', 'their', 'which', 'could', 'other', 'after',
    'first', 'never', 'place', 'think', 'water', 'house', 'world', 'light',
    'three', 'right', 'story', 'point', 'found', 'great', 'under', 'along',
    'while', 'every', 'night', 'heart', 'bring', 'large', 'start', 'small',
    'river', 'plant', 'earth', 'paper', 'group', 'music', 'learn', 'table',
    // 150+ common words (5–6 letters)
  ],
  hard: [
    'because', 'through', 'between', 'another', 'thought', 'country',
    'example', 'without', 'company', 'problem', 'different', 'important',
    'children', 'question', 'national', 'possible', 'sentence', 'together',
    'business', 'mountain', 'remember', 'anything', 'consider', 'continue',
    'keyboard', 'algorithm', 'paragraph', 'challenge', 'development',
    // 100+ words (7+ letters)
  ],
};
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `generateWordList(difficulty, count)` | `string` (`'easy'` \| `'medium'` \| `'hard'`), `number` (default `50`) | `string[]` | Picks `count` random words from `WORD_BANK[difficulty]` using Fisher-Yates shuffle, allows repeats if bank is smaller than count |
| `getWord(wordList, index)` | `string[]`, `number` | `string \| null` | Returns word at given index, or `null` if out of bounds |
| `getWordSlice(wordList, currentIndex, before, after)` | `string[]`, `number`, `number` (default `2`), `number` (default `5`) | `{ past: string[], current: string, upcoming: string[] }` | Returns a window of words around the current index for the word display queue |
| `shuffleArray(arr)` | `any[]` | `any[]` | Fisher-Yates in-place shuffle. Returns the same array reference |

---

### 6.4 `js/modules/car.js` — Car Position & Speed Mapping

**Purpose:** Manage the car's visual position on the track. Map the player's typing progress to a percentage position.

#### Constants

```js
const CAR_START = 2;   // % from left
const CAR_END = 92;    // % from left (finish line position)
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `updatePosition(progress)` | `number` (0–100, from `game.calculateProgress()`) | `number` (the new `left %`) | Maps progress (0–100) to car position (2–92%). Calculates `CAR_START + (progress / 100) * (CAR_END - CAR_START)`. Calls `ui.moveCar(newLeft)` |
| `resetPosition()` | — | `void` | Resets car to `CAR_START`. Calls `ui.moveCar(CAR_START)` |
| `calculateBoost(wpm)` | `number` (current WPM) | `string` (CSS transition duration, e.g. `'0.2s'`) | Higher WPM → shorter transition for snappier car feel. `< 30 WPM` → `0.5s`, `30–60` → `0.3s`, `60–90` → `0.2s`, `> 90` → `0.1s` |

---

### 6.5 `js/modules/input.js` — Input Handling & Word Comparison

**Purpose:** Process every keystroke. Compare typed characters to the target word. Provide character-by-character feedback. Handle word submission.

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `handleTyping(typed)` | `string` (current input value) | `void` | Compares each character of `typed` against the current target word character by character. Builds an array of `{ char, status }` objects where status is `'correct'`, `'wrong'`, or `'pending'`. Calls `ui.renderCharFeedback(charArray)` |
| `submitWord()` | — | `void` | Reads input value, trims it, passes to `game.submitWord(typed)`. Clears input field. Calls `ui.advanceWordQueue()` to shift the word display. Resets character feedback |
| `compareChars(typed, target)` | `string`, `string` | `Array<{ char: string, status: string }>` | Iterates over target word chars. For each index: if `typed[i]` exists and matches → `'correct'`; if exists and doesn't match → `'wrong'`; if not yet typed → `'pending'`. Returns the full array for UI rendering |
| `clearInput()` | — | `void` | Sets input element value to empty string. Clears character feedback |
| `enableInput()` | — | `void` | Removes `disabled` attribute from input, sets focus |
| `disableInput()` | — | `void` | Adds `disabled` attribute, blurs input |

---

### 6.6 `js/modules/ui.js` — DOM Updates, Animations & Results

**Purpose:** All direct DOM manipulation lives here. No other module should touch the DOM. Receives data from other modules and renders it.

#### Cached DOM References (private)

```js
const dom = {
  timer: null,            // #timer
  wpm: null,              // #wpm
  accuracy: null,         // #accuracy
  wordCount: null,        // #word-count
  car: null,              // #car
  progressBar: null,      // #progress-bar
  wordQueue: null,        // #word-queue
  typingInput: null,      // #typing-input
  charFeedback: null,     // #char-feedback
  startBtn: null,         // #start-btn
  restartBtn: null,       // #restart-btn
  raceAgainBtn: null,     // #race-again-btn
  countdownOverlay: null, // #countdown-overlay
  countdownNumber: null,  // #countdown-number
  resultsModal: null,     // #results-modal
  resultWpm: null,        // #result-wpm
  resultAccuracy: null,   // #result-accuracy
  resultWords: null,      // #result-words
  resultCorrect: null,    // #result-correct
};
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Queries all DOM elements by ID, stores in `dom` object. Called once at startup |
| `updateTimer(seconds)` | `number` | `void` | Sets `dom.timer.textContent` to formatted time. Adds warning class if `< 10` |
| `updateDashboard(stats)` | `{ wpm: number, accuracy: number, wordsTyped: number }` | `void` | Updates WPM, accuracy, and word count displays |
| `renderWords(wordSlice)` | `{ past: string[], current: string, upcoming: string[] }` | `void` | Clears `dom.wordQueue` and creates `<span>` elements for each word with appropriate BEM modifier classes |
| `markWord(index, correct)` | `number`, `boolean` | `void` | Adds `words__word--correct` or `words__word--wrong` class to the word span at the given index |
| `advanceWordQueue()` | — | `void` | Re-renders the word queue centred on the new current word index (calls `renderWords` with updated slice) |
| `renderCharFeedback(charArray)` | `Array<{ char: string, status: string }>` | `void` | Clears `dom.charFeedback`, creates a `<span>` for each character with class `char--correct`, `char--wrong`, or `char--pending`. Uses `textContent` (not `innerHTML`) to prevent XSS |
| `moveCar(leftPercent)` | `number` (2–92) | `void` | Sets `dom.car.style.left = leftPercent + '%'` |
| `updateProgressBar(percent)` | `number` (0–100) | `void` | Sets `dom.progressBar.style.width = percent + '%'` and `aria-valuenow` |
| `showCountdown(number)` | `number \| string` (3, 2, 1, or 'GO!') | `void` | Removes `hidden` from overlay, sets `dom.countdownNumber.textContent`, re-triggers animation |
| `hideCountdown()` | — | `void` | Adds `hidden` to overlay |
| `showResults(stats)` | `{ wpm: number, accuracy: number, wordsTyped: number, correctWords: number }` | `void` | Populates result fields, removes `hidden` from modal, traps focus inside modal |
| `hideResults()` | — | `void` | Adds `hidden` to modal |
| `resetUI()` | — | `void` | Resets all displays to defaults (timer to 60, WPM to 0, etc.). Hides results modal. Clears word queue. Resets car position. Clears input and char feedback |
| `setButtonState(button, enabled)` | `string` (`'start'` \| `'restart'`), `boolean` | `void` | Enables or disables the specified button |

---

## 7. Game Mechanics

### 7.1 WPM Formula

**Gross WPM:**

$$
\text{Gross WPM} = \frac{\text{totalCharsTyped} / 5}{\text{elapsedMinutes}}
$$

**Net WPM (used in this game):**

$$
\text{Net WPM} = \frac{\text{correctChars} / 5}{\text{elapsedMinutes}}
$$

Where:

- A "word" is standardised as **5 characters** (industry standard).
- `correctChars` = sum of character lengths of all correctly typed words.
- `elapsedMinutes` = `(Date.now() - startTimestamp) / 60000`.
- If `elapsedMinutes` is 0, WPM returns 0 to avoid division by zero.

### 7.2 Accuracy Formula

$$
\text{Accuracy} = \frac{\text{correctWords}}{\text{wordsTyped}} \times 100
$$

- Rounded to the nearest integer for display.
- Returns `100` if no words have been submitted yet.

### 7.3 Car Speed ↔ Typing Speed Mapping

The car's position is **progress-based**, not speed-based:

$$
\text{carLeft\%} = 2 + \left(\frac{\text{currentWordIndex}}{\text{wordList.length}}\right) \times 90
$$

The car moves from `2%` to `92%` of the track width. Each correct word moves it forward by `90 / wordList.length` percent.

**Transition speed** (visual snappiness) scales with WPM:

| WPM Range | CSS Transition Duration | Feel |
|---|---|---|
| 0–29 | `0.5s` | Slow, sluggish |
| 30–59 | `0.3s` | Normal |
| 60–89 | `0.2s` | Quick, responsive |
| 90+ | `0.1s` | Snappy, zippy |

### 7.4 Difficulty Levels

| Level | Timer | Word Length | Word Count |
|---|---|---|---|
| Easy | 90 seconds | 2–4 characters | 40 words |
| Medium | 60 seconds | 4–7 characters | 50 words |
| Hard | 45 seconds | 7+ characters | 50 words |

Default difficulty: **Medium**.

### 7.5 Scoring

No persistent leaderboard (vanilla JS, no backend). The results modal shows:

- Final Net WPM
- Accuracy %
- Total words submitted
- Correct words count

---

## 8. Data Flow

### 8.1 High-Level Flow

```text
User types character
  → input event fires
  → input.handleTyping(value)
    → input.compareChars(typed, targetWord)
    → ui.renderCharFeedback(charArray)

User presses Space / Enter
  → keydown event fires
  → input.submitWord()
    → game.submitWord(typed)
      → compares typed vs target word
      → updates state (wordsTyped, correctWords, correctChars, etc.)
      → game.calculateWPM() → updates state.wpm
      → game.calculateAccuracy() → updates state.accuracy
      → game.calculateProgress() → returns progress %
      → car.updatePosition(progress)
        → ui.moveCar(newLeft%)
      → ui.updateDashboard({ wpm, accuracy, wordsTyped })
      → ui.updateProgressBar(progress)
    → ui.markWord(index, correct)
    → ui.advanceWordQueue()
    → input.clearInput()

Timer ticks (every 1 second)
  → game.tick()
    → state.timeRemaining--
    → ui.updateTimer(timeRemaining)
    → if timeRemaining <= 0 → game.endRace()
      → ui.showResults(finalStats)
      → input.disableInput()
```

### 8.2 Lifecycle State Diagram

```text
  ┌───────┐    Start click     ┌───────────┐   3-2-1-GO!    ┌─────────┐
  │ IDLE  │ ─────────────────► │ COUNTDOWN │ ──────────────► │ RUNNING │
  └───────┘                    └───────────┘                 └────┬────┘
      ▲                                                          │
      │                    Reset click                           │ Timer = 0
      │◄─────────────────────────────────────────┐               │
      │                                          │               ▼
      │                                     ┌────┴──────┐
      └─────────────────────────────────────│ FINISHED  │
                                            └───────────┘
```

---

## 9. Accessibility

### 9.1 Semantic HTML

- Use `<main>`, `<header>`, `<footer>`, `<section>` with `aria-label` attributes.
- Use `<dl>`/`<dt>`/`<dd>` for stat pairs in the results modal.
- Results modal uses `role="dialog"` and `aria-modal="true"`.
- Progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

### 9.2 Focus Management

| Event | Focus action |
|---|---|
| Race starts (after countdown) | Focus moves to `#typing-input` |
| Race ends | Focus moves to `#race-again-btn` inside the results modal |
| Results modal closes | Focus moves to `#start-btn` |
| Tab trapping in modal | When modal is open, Tab cycles only within modal content |

### 9.3 Live Regions

- `#wpm` element has `aria-live="polite"` so screen readers announce WPM changes without interrupting.
- `#countdown-overlay` has `aria-live="assertive"` to announce countdown numbers immediately.
- `#char-feedback` has `aria-live="polite"` for character-level feedback.

### 9.4 Keyboard Interaction

- All interactive elements (`button`, `input`) are natively focusable.
- No custom keyboard shortcuts required beyond Space/Enter for word submission (standard behaviour).
- Escape key closes the results modal and resets.

### 9.5 Additional

- `.sr-only` class for labels that are visually hidden but read by screen readers.
- Colour contrast: all text meets WCAG AA contrast ratio (≥ 4.5:1 for normal text, ≥ 3:1 for large text). `--colour-secondary` (#f1faee) on `--colour-bg` (#0f0f1a) = 15.7:1. `--colour-accent` (#ffbe0b) on `--colour-bg` (#0f0f1a) = 10.4:1.
- No reliance on colour alone: correct/wrong feedback also uses text-decoration (line-through for wrong).

---

## 10. Step-by-Step Build Order

### Phase 1: Static Shell

1. **Create `index.html`** with all semantic elements, IDs, classes, and ARIA attributes as specified in Section 4.
2. **Create `styles/main.css`** with CSS variables, reset, base styles, and all component styles from Section 5. Use placeholder content to visually verify layout.
3. **Verify layout** by opening in browser. Check:
   - Header, dashboard, track, word area, input, controls, footer all visible and correctly positioned.
   - Car emoji visible on the track at `left: 2%`.
   - Input field visible but disabled.
   - Countdown overlay and results modal hidden.
   - Responsive behaviour at 768 px and 480 px.

### Phase 2: Word Engine

4. **Create `js/modules/words.js`** with the full word bank and all functions (`generateWordList`, `getWord`, `getWordSlice`, `shuffleArray`).
5. **Test** by importing into a temporary script and logging output to console.

### Phase 3: UI Module

6. **Create `js/modules/ui.js`** with `init()`, DOM caching, and all rendering functions from Section 6.6.
7. **Test** by manually calling functions from the console to verify DOM updates work (timer, word rendering, car movement, progress bar).

### Phase 4: Game State & Timer

8. **Create `js/modules/game.js`** with the state object, `startCountdown()`, `startRace()`, `tick()`, `endRace()`, `reset()`, and calculation functions.
9. **Test** countdown → timer → end flow without input handling.

### Phase 5: Car Module

10. **Create `js/modules/car.js`** with `updatePosition()`, `resetPosition()`, and `calculateBoost()`.
11. **Test** by manually calling `updatePosition()` with various progress values and verifying the car moves on the track.

### Phase 6: Input Handling

12. **Create `js/modules/input.js`** with `handleTyping()`, `submitWord()`, `compareChars()`, `clearInput()`, `enableInput()`, `disableInput()`.
13. **Test** character-by-character feedback first, then word submission.

### Phase 7: Integration

14. **Create `js/main.js`** with `init()`, all event listeners, and wiring between modules.
15. **Full integration test:**
    - Click Start → countdown appears → race begins.
    - Type words → car moves, WPM/accuracy update live.
    - Correct words turn green, incorrect turn red.
    - Timer counts down → results modal appears.
    - Click Restart → everything resets.

### Phase 8: Polish

16. **Add CSS animations** — countdown pulse, modal fade-in, car transition speed tiers.
17. **Responsive testing** — verify tablet and mobile breakpoints.
18. **Accessibility audit** — tab through all controls, test with VoiceOver / NVDA, check focus trapping in modal.
19. **Edge case testing:**
    - Submitting empty input (should be ignored).
    - Submitting while paused / finished (should be blocked).
    - Rapid-fire submissions.
    - Very long words with typos.
20. **Performance** — ensure no memory leaks from intervals. Verify `clearInterval` is called on end/reset.

---

## 11. Stretch Goals

### 11.1 Multiplayer (Local)

- Add a second lane on the track with a second car.
- Split the keyboard: Player 1 uses the main input, Player 2 uses a second input field.
- Both players share the same timer. First to finish the word list or highest WPM at time-out wins.
- Requires duplicating input/car modules to handle two independent states.

### 11.2 AI Opponent

- Simulated second car that types at a configurable WPM (e.g. 50 WPM for easy, 80 for hard).
- AI car advances at a steady rate calculated from its target WPM.
- Creates a sense of urgency and competition.

### 11.3 Different Vehicles

- Let the player choose a vehicle before the race: 🏎️ 🚗 🏍️ 🚌 🚀.
- Store choice in `localStorage`.
- Each vehicle is purely cosmetic (different emoji or SVG sprite).

### 11.4 Word Categories

- Add themed word lists: Animals, Technology, Food, Sports, Countries.
- Let the player pick a category before starting.
- Extend `words.js` with a `CATEGORIES` object containing named word arrays.

### 11.5 Personal Best Tracking

- Store the player's best WPM and accuracy per difficulty in `localStorage`.
- Display "Personal Best" on the dashboard.
- Show a "New Record!" badge in the results modal when beaten.

### 11.6 Sound Effects

- Short sound on correct word (ding).
- Error buzz on wrong word.
- Engine revving tied to WPM (higher pitch at higher speed).
- Countdown beeps (3, 2, 1) and a horn on GO!.
- Use the Web Audio API or `<audio>` elements.

### 11.7 Combo System

- Track consecutive correct words.
- Display a "Streak: 5x" counter.
- Combo multiplier gives bonus car movement (car lurches forward for streaks of 5, 10, 15).
- Streak resets on a wrong word.

### 11.8 Dark/Light Theme Toggle

- Add a toggle button in the header.
- Swap CSS variables between dark (current) and light palettes.
- Persist preference in `localStorage`.

### 11.9 Typing Replay

- Record every keystroke with timestamps during the race.
- After the race, offer a "Watch Replay" button that plays back the input in real time.
- Uses `setTimeout` chains to reproduce the typing sequence.

### 11.10 Progressive Difficulty

- Start with easy words. Every 10 correct words, bump to the next difficulty tier.
- Notified via a brief "Difficulty Up!" flash on screen.
- Rewards sustained performance with harder challenges.
