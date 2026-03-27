# Memory Card Match — Implementation Plan

## 1. Overview

Memory Card Match is a browser-based card-matching game where the player flips cards two at a time to find matching pairs of symbols. The game features smooth 3D flip animations, a live timer, a move counter, and three difficulty levels that control the grid size. When every pair on the board has been found the player sees a win screen summarising their performance. The entire game is built with vanilla HTML, CSS, and JavaScript (ES2022+) — no frameworks, no build tools, no external dependencies.

### Core Loop

1. Player selects a difficulty (Easy / Medium / Hard).
2. The board populates with face-down cards arranged in a grid.
3. Player clicks/taps a card → it flips to reveal its symbol.
4. Player clicks/taps a second card → it flips to reveal its symbol.
   - **Match** → both cards stay face-up, a glow animation plays, matches counter increments.
   - **Mismatch** → a brief shake animation plays, then both cards flip back face-down after a delay (~1 s).
5. The move counter increments after every pair of flips.
6. The timer starts on the first card flip and counts upward.
7. Repeat until all pairs are matched → win screen appears.

---

## 2. Page Layout

### Wireframe (ASCII)

```text
┌──────────────────────────────────────────────────────┐
│  HEADER                                              │
│  ┌────────────────────────────────────────────────┐  │
│  │  Memory Card Match              [How to Play]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  CONTROLS BAR                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  Difficulty: [Easy] [Medium] [Hard]            │  │
│  │  [Start / Restart]                             │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  STATS BAR                                           │
│  ┌──────────┬──────────┬──────────┐                  │
│  │ ⏱ 00:00  │ 🔄 0 Moves│ ✅ 0/6  │                  │
│  └──────────┴──────────┴──────────┘                  │
│                                                      │
│  CARD GRID                                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
│  │ ?? │ │ ?? │ │ ?? │ │ ?? │                        │
│  └────┘ └────┘ └────┘ └────┘                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
│  │ ?? │ │ ?? │ │ ?? │ │ ?? │                        │
│  └────┘ └────┘ └────┘ └────┘                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
│  │ ?? │ │ ?? │ │ ?? │ │ ?? │                        │
│  └────┘ └────┘ └────┘ └────┘                        │
│                                                      │
│  WIN OVERLAY (hidden until game won)                 │
│  ┌────────────────────────────────────────────────┐  │
│  │            🎉 You Win!                         │  │
│  │     Time: 01:23   Moves: 14                    │  │
│  │            [Play Again]                        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  FOOTER                                              │
│  ┌────────────────────────────────────────────────┐  │
│  │  © 2026 Memory Card Match                      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Layout Sections

| Section | Purpose |
|---|---|
| **Header** | Game title and optional "How to Play" toggle |
| **Controls Bar** | Difficulty radio/button group, Start/Restart button |
| **Stats Bar** | Three inline stat boxes: Timer, Moves, Matches (e.g. 3/6) |
| **Card Grid** | CSS Grid of cards; column count varies with difficulty |
| **Win Overlay** | Centred modal overlay shown when all pairs matched |
| **Footer** | Simple copyright line |

### Responsive Behaviour

- **Desktop (≥ 768 px)**: Stats bar items in a single row; card grid at full size.
- **Mobile (< 768 px)**: Stats bar stacks or wraps; card size shrinks; grid maintains correct column count but cards scale down via `minmax()` or reduced fixed widths.

---

## 3. Colour Scheme and Typography

### Palette

| Role | Colour | Hex |
|---|---|---|
| Background (page) | Deep Navy | `#0f0f2e` |
| Card Back | Vivid Purple | `#7c3aed` |
| Card Back Pattern | Light Lavender | `#c4b5fd` |
| Card Front | White | `#ffffff` |
| Primary Accent | Hot Pink | `#ec4899` |
| Success / Match | Emerald Green | `#10b981` |
| Error / Mismatch | Coral Red | `#ef4444` |
| Text Primary | Off-White | `#f1f5f9` |
| Text Secondary | Slate Grey | `#94a3b8` |
| Stats Bar BG | Dark Slate | `#1e293b` |
| Button BG | Vivid Purple | `#7c3aed` |
| Button Hover | Deep Purple | `#6d28d9` |
| Overlay BG | Semi-transparent Black | `rgba(0, 0, 0, 0.75)` |

### CSS Variables

```css
:root {
  --clr-bg: #0f0f2e;
  --clr-card-back: #7c3aed;
  --clr-card-back-pattern: #c4b5fd;
  --clr-card-front: #ffffff;
  --clr-accent: #ec4899;
  --clr-success: #10b981;
  --clr-error: #ef4444;
  --clr-text: #f1f5f9;
  --clr-text-secondary: #94a3b8;
  --clr-stats-bg: #1e293b;
  --clr-btn: #7c3aed;
  --clr-btn-hover: #6d28d9;
  --clr-overlay: rgba(0, 0, 0, 0.75);

  --font-primary: 'Poppins', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  --shadow-card: 0 4px 14px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(16, 185, 129, 0.6);
}
```

### Typography

- **Headings**: `Poppins` (Google Fonts), weight 700, sizes h1 2rem / h2 1.5rem / h3 1.25rem.
- **Body / UI**: `Poppins`, weight 400, size 1rem (16 px base).
- **Timer display**: `Fira Code` monospace for fixed-width digits.
- **Card symbols**: emoji rendered at 2rem–3rem depending on card size.

### Card Back Design

The card back face uses the vivid purple background (`--clr-card-back`) with a repeating CSS pattern made from radial gradients in lavender (`--clr-card-back-pattern`) to create a subtle polka-dot or diamond texture. A centered `?` or a small star icon sits in the middle. Example:

```css
.card__back {
  background-color: var(--clr-card-back);
  background-image: radial-gradient(
    circle,
    var(--clr-card-back-pattern) 1px,
    transparent 1px
  );
  background-size: 12px 12px;
}
```

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Memory Card Match — flip cards and find matching pairs across three difficulty levels." />
  <title>Memory Card Match</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Fira+Code&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ====== HEADER ====== -->
  <header class="header">
    <h1 class="header__title">Memory Card Match</h1>
    <button class="header__help-btn" id="help-btn" aria-expanded="false" aria-controls="help-panel">
      How to Play
    </button>
    <div class="header__help-panel" id="help-panel" role="region" aria-labelledby="help-btn" hidden>
      <p>Flip two cards at a time. If they match they stay face-up. Match every pair to win!</p>
    </div>
  </header>

  <!-- ====== MAIN ====== -->
  <main class="main">

    <!-- Controls -->
    <section class="controls" aria-label="Game controls">
      <fieldset class="controls__difficulty">
        <legend class="controls__legend">Difficulty</legend>
        <label class="controls__label">
          <input type="radio" name="difficulty" value="easy" checked class="controls__radio" />
          Easy (4 × 3)
        </label>
        <label class="controls__label">
          <input type="radio" name="difficulty" value="medium" class="controls__radio" />
          Medium (4 × 4)
        </label>
        <label class="controls__label">
          <input type="radio" name="difficulty" value="hard" class="controls__radio" />
          Hard (6 × 4)
        </label>
      </fieldset>
      <button class="controls__start-btn" id="start-btn">Start Game</button>
    </section>

    <!-- Stats Bar -->
    <section class="stats" aria-label="Game statistics">
      <div class="stats__item" aria-live="polite">
        <span class="stats__icon" aria-hidden="true">⏱</span>
        <span class="stats__label">Time</span>
        <span class="stats__value" id="timer-display">00:00</span>
      </div>
      <div class="stats__item" aria-live="polite">
        <span class="stats__icon" aria-hidden="true">🔄</span>
        <span class="stats__label">Moves</span>
        <span class="stats__value" id="moves-display">0</span>
      </div>
      <div class="stats__item" aria-live="polite">
        <span class="stats__icon" aria-hidden="true">✅</span>
        <span class="stats__label">Matches</span>
        <span class="stats__value" id="matches-display">0 / 0</span>
      </div>
    </section>

    <!-- Card Grid -->
    <section class="board" aria-label="Game board">
      <div class="board__grid" id="card-grid" role="list">
        <!-- Cards injected by JS. Each card structure: -->
        <!--
        <div class="card" role="listitem" tabindex="0"
             data-symbol="🍎" data-id="0" aria-label="Card 1 — face down">
          <div class="card__inner">
            <div class="card__front" aria-hidden="true">
              <span class="card__symbol">🍎</span>
            </div>
            <div class="card__back" aria-hidden="false">
              <span class="card__back-icon">?</span>
            </div>
          </div>
        </div>
        -->
      </div>
    </section>

  </main>

  <!-- ====== WIN OVERLAY ====== -->
  <div class="overlay" id="win-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title" hidden>
    <div class="overlay__content">
      <h2 class="overlay__title" id="win-title">🎉 You Win!</h2>
      <p class="overlay__stat">Time: <span id="win-time">00:00</span></p>
      <p class="overlay__stat">Moves: <span id="win-moves">0</span></p>
      <button class="overlay__btn" id="play-again-btn">Play Again</button>
    </div>
  </div>

  <!-- ====== FOOTER ====== -->
  <footer class="footer">
    <p class="footer__text">&copy; 2026 Memory Card Match</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Element Inventory

| Element | Class / ID | Purpose |
|---|---|---|
| `<header>` | `.header` | Contains title and help toggle |
| `<button>` | `#help-btn` | Toggles "How to Play" panel |
| `<div>` | `#help-panel` | Collapsible instructions panel |
| `<fieldset>` | `.controls__difficulty` | Radio group for difficulty |
| `<input type="radio">` | `.controls__radio` | Individual difficulty option (easy / medium / hard) |
| `<button>` | `#start-btn` | Starts or restarts the game |
| `<span>` | `#timer-display` | Shows elapsed time `MM:SS` |
| `<span>` | `#moves-display` | Shows move count |
| `<span>` | `#matches-display` | Shows `matched / total` pairs |
| `<div>` | `#card-grid` | Container for all card elements |
| `.card` | — | Individual card wrapper (generated by JS) |
| `.card__inner` | — | Rotating inner container for 3D flip |
| `.card__front` | — | Face-up side showing the symbol |
| `.card__back` | — | Face-down side showing `?` / pattern |
| `<div>` | `#win-overlay` | Full-screen overlay shown on win |
| `<span>` | `#win-time` | Final time on win screen |
| `<span>` | `#win-moves` | Final move count on win screen |
| `<button>` | `#play-again-btn` | Resets and starts a new game |

---

## 5. CSS Design

### 5.1 Card Flip Animation (3D Transforms)

Each card uses a two-sided 3D flip powered by `perspective`, `transform-style: preserve-3d`, and `backface-visibility: hidden`.

```css
/* The grid item — sets perspective for children */
.card {
  perspective: 800px;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 3 / 4;
}

/* Inner wrapper that actually rotates */
.card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

/* When the card is flipped, rotate the inner */
.card--flipped .card__inner {
  transform: rotateY(180deg);
}

/* Both faces share positioning */
.card__front,
.card__back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Front face is pre-rotated 180° so it's hidden initially */
.card__front {
  transform: rotateY(180deg);
  background-color: var(--clr-card-front);
}

/* Back face is the default visible side */
.card__back {
  background-color: var(--clr-card-back);
  /* polka-dot pattern */
  background-image: radial-gradient(circle, var(--clr-card-back-pattern) 1px, transparent 1px);
  background-size: 12px 12px;
  box-shadow: var(--shadow-card);
}
```

### 5.2 Grid Layout Per Difficulty

Grid columns change via a CSS class applied to `#card-grid`:

```css
.board__grid {
  display: grid;
  gap: var(--spacing-md);
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
}

/* Easy: 4 columns × 3 rows = 12 cards (6 pairs) */
.board__grid--easy {
  grid-template-columns: repeat(4, 100px);
}

/* Medium: 4 columns × 4 rows = 16 cards (8 pairs) */
.board__grid--medium {
  grid-template-columns: repeat(4, 100px);
}

/* Hard: 6 columns × 4 rows = 24 cards (12 pairs) */
.board__grid--hard {
  grid-template-columns: repeat(6, 90px);
}

/* Responsive: shrink cards on small screens */
@media (max-width: 600px) {
  .board__grid--easy  { grid-template-columns: repeat(4, 70px); }
  .board__grid--medium { grid-template-columns: repeat(4, 70px); }
  .board__grid--hard  { grid-template-columns: repeat(6, 55px); }
}
```

### 5.3 Match Animation (Glow + Scale)

When a pair matches, both cards receive the `.card--matched` class:

```css
.card--matched .card__inner {
  animation: matchGlow 0.6s ease forwards;
}

@keyframes matchGlow {
  0%   { box-shadow: 0 0 0 rgba(16, 185, 129, 0); transform: rotateY(180deg) scale(1); }
  50%  { box-shadow: var(--shadow-glow); transform: rotateY(180deg) scale(1.08); }
  100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.3); transform: rotateY(180deg) scale(1); }
}
```

### 5.4 Mismatch Shake Animation

When a pair doesn't match, both cards receive `.card--mismatch` briefly:

```css
.card--mismatch .card__inner {
  animation: mismatchShake 0.4s ease;
}

@keyframes mismatchShake {
  0%, 100% { transform: rotateY(180deg) translateX(0); }
  20%      { transform: rotateY(180deg) translateX(-6px); }
  40%      { transform: rotateY(180deg) translateX(6px); }
  60%      { transform: rotateY(180deg) translateX(-4px); }
  80%      { transform: rotateY(180deg) translateX(4px); }
}
```

### 5.5 Win Overlay

```css
.overlay {
  position: fixed;
  inset: 0;
  background: var(--clr-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay[aria-modal="true"]:not([hidden]) {
  opacity: 1;
  pointer-events: auto;
}

.overlay__content {
  background: var(--clr-stats-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  max-width: 400px;
  animation: popIn 0.4s ease;
}

@keyframes popIn {
  0%   { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}
```

### 5.6 Buttons

```css
button {
  font-family: var(--font-primary);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.controls__start-btn,
.overlay__btn {
  background-color: var(--clr-btn);
  color: var(--clr-text);
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
}

.controls__start-btn:hover,
.overlay__btn:hover {
  background-color: var(--clr-btn-hover);
  transform: translateY(-1px);
}
```

### 5.7 Stats Bar

```css
.stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  background: var(--clr-stats-bg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  max-width: 500px;
  margin: var(--spacing-md) auto;
}

.stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stats__value {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--clr-text);
}
```

---

## 6. JavaScript Architecture

### File Map

```text
js/
├── main.js              (entry point, event listeners, imports)
└── modules/
    ├── game.js           (game state machine, moves, match tracking, win condition)
    ├── board.js          (card data generation, Fisher-Yates shuffle, grid rendering)
    ├── card.js           (flip logic, lock mechanism, match comparison)
    ├── timer.js          (start / stop / reset, MM:SS formatting)
    └── ui.js             (DOM reads/writes, difficulty change, win screen)
```

---

### 6.1 `main.js` — Entry Point

**Responsibilities**: Import all modules, grab DOM references, attach event listeners, orchestrate game lifecycle.

```text
Imports:
  - { initGame, restartGame }   from './modules/game.js'
  - { handleCardClick }         from './modules/card.js'
  - { setDifficulty }           from './modules/ui.js'

DOM References (cached once):
  #start-btn
  #play-again-btn
  #card-grid
  #help-btn
  .controls__radio (all)

Event Listeners:
  DOMContentLoaded        → call initGame('easy')
  #start-btn click        → call restartGame()
  #play-again-btn click   → call restartGame()
  #card-grid click        → delegate to handleCardClick(event)
  #card-grid keydown      → on Enter/Space delegate to handleCardClick
  #help-btn click         → toggle #help-panel hidden attribute
  .controls__radio change → call setDifficulty(value), call restartGame()
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Runs on `DOMContentLoaded`. Caches DOM refs, attaches listeners, calls `initGame('easy')`. |
| `onCardInteraction(event)` | `event: Event` | `void` | Event delegation handler. Finds closest `.card` element, calls `handleCardClick(cardEl)`. |
| `toggleHelp()` | — | `void` | Toggles `hidden` attribute on `#help-panel`, updates `aria-expanded` on `#help-btn`. |

---

### 6.2 `modules/game.js` — Game State

**Responsibilities**: Own the game state object, track moves, track matches, determine win condition, coordinate reset.

#### State Object

```js
const state = {
  difficulty: 'easy',        // 'easy' | 'medium' | 'hard'
  totalPairs: 6,             // derived from difficulty
  matchedPairs: 0,           // incremented on each match
  moves: 0,                  // incremented after every two-card flip
  isGameActive: false,       // false until first card flip
  isFirstMove: true,         // true until first flip (starts timer)
};
```

#### Difficulty Config

```js
const DIFFICULTY_CONFIG = {
  easy:   { cols: 4, rows: 3, pairs: 6  },
  medium: { cols: 4, rows: 4, pairs: 8  },
  hard:   { cols: 6, rows: 4, pairs: 12 },
};
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `initGame(difficulty)` | `difficulty: string` | `void` | Sets `state.difficulty`, resets counters, calls `board.buildBoard()`, calls `ui.updateStats()`, calls `timer.reset()`. |
| `restartGame()` | — | `void` | Calls `initGame(state.difficulty)` to rebuild with current difficulty. |
| `incrementMoves()` | — | `void` | `state.moves += 1`, calls `ui.updateMoves(state.moves)`. |
| `registerMatch()` | — | `void` | `state.matchedPairs += 1`, calls `ui.updateMatches(state.matchedPairs, state.totalPairs)`, calls `checkWin()`. |
| `checkWin()` | — | `void` | If `state.matchedPairs === state.totalPairs`, calls `timer.stop()`, calls `ui.showWinScreen(timer.getElapsed(), state.moves)`. |
| `getState()` | — | `object` | Returns a shallow copy of `state` for read-only access by other modules. |
| `setDifficultyState(difficulty)` | `difficulty: string` | `void` | Updates `state.difficulty` and `state.totalPairs` from `DIFFICULTY_CONFIG`. |
| `markGameStarted()` | — | `void` | Sets `state.isGameActive = true`, `state.isFirstMove = false`. Called on first flip. |

---

### 6.3 `modules/board.js` — Board Generation

**Responsibilities**: Generate the card data array, shuffle it, render card elements into the grid.

#### Card Symbols Pool

```js
const SYMBOLS = [
  '🍎', '🍋', '🍇', '🍒', '🍕', '🎸',
  '🚀', '🌈', '⚡', '🎯', '🦊', '🐝',
  '🎲', '🧩', '💎', '🔮'
];
```

(16 symbols available; the game picks the first `N` matching the pair count for the chosen difficulty.)

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `buildBoard(difficulty, gridEl)` | `difficulty: string`, `gridEl: HTMLElement` | `void` | 1. Gets config from `DIFFICULTY_CONFIG`. 2. Slices `SYMBOLS` to `config.pairs`. 3. Duplicates array to create pairs. 4. Shuffles with `shuffle()`. 5. Clears `gridEl`. 6. Calls `createCardElement()` for each item. 7. Applies grid class (`.board__grid--easy`, etc.). |
| `shuffle(array)` | `array: any[]` | `any[]` | Fisher-Yates in-place shuffle. Iterates from end to start, swapping each element with a random earlier element. Returns the same array reference. |
| `createCardElement(symbol, index)` | `symbol: string`, `index: number` | `HTMLElement` | Creates the `.card` → `.card__inner` → `.card__front` + `.card__back` DOM subtree. Sets `data-symbol`, `data-id`, `tabindex="0"`, `role="listitem"`, initial `aria-label`. Returns the root `.card` element. |

#### Fisher-Yates Shuffle Detail

```js
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {any[]} array - The array to shuffle.
 * @returns {any[]} The same array, shuffled.
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

---

### 6.4 `modules/card.js` — Flip Logic

**Responsibilities**: Handle individual card flips, enforce the two-card lock (prevent flipping a 3rd card while two are face-up), compare symbols, trigger match/mismatch outcomes.

#### Module-Level State

```js
let flippedCards = [];   // holds 0–2 card DOM elements currently face-up
let isLocked = false;    // true while a mismatch pair is showing (prevents clicks)
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `handleCardClick(cardEl)` | `cardEl: HTMLElement` | `void` | Main entry called from `main.js`. Guards: bail if `isLocked`, if card already `.card--flipped`, or if card is `.card--matched`. Flips card, pushes to `flippedCards`. If `flippedCards.length === 2`, calls `evaluatePair()`. On first-ever flip, calls `game.markGameStarted()` and `timer.start()`. |
| `flipCard(cardEl)` | `cardEl: HTMLElement` | `void` | Adds `.card--flipped` class. Updates `aria-label` to "Card N — face up, [symbol]". |
| `unflipCard(cardEl)` | `cardEl: HTMLElement` | `void` | Removes `.card--flipped` class. Updates `aria-label` to "Card N — face down". |
| `evaluatePair()` | — | `void` | Reads `data-symbol` from both `flippedCards` entries. Calls `game.incrementMoves()`. If symbols match → `handleMatch()`. Else → `handleMismatch()`. |
| `handleMatch()` | — | `void` | Adds `.card--matched` to both cards. Calls `game.registerMatch()`. Clears `flippedCards`. |
| `handleMismatch()` | — | `void` | Sets `isLocked = true`. Adds `.card--mismatch` to both cards. After 1000 ms timeout: removes `.card--mismatch`, calls `unflipCard()` on both, clears `flippedCards`, sets `isLocked = false`. |
| `resetCards()` | — | `void` | Sets `flippedCards = []`, `isLocked = false`. Called by `game.initGame()` during reset. |

#### Lock Mechanism Detail

The lock prevents a third card from being flipped while the mismatch delay is active:

1. Player flips card A → `flippedCards = [A]`, no lock.
2. Player flips card B → `flippedCards = [A, B]`, `evaluatePair()` runs.
3. If mismatch: `isLocked = true` immediately. No further clicks processed.
4. After 1000 ms timeout: cards unflip, `isLocked = false`. Player can continue.

---

### 6.5 `modules/timer.js` — Timer

**Responsibilities**: Count elapsed seconds, update display every second, provide start/stop/reset, format as `MM:SS`.

#### Module-Level State

```js
let intervalId = null;     // setInterval reference
let elapsedSeconds = 0;    // total seconds since timer started
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `start()` | — | `void` | If already running, bail. Starts `setInterval` at 1000 ms. Each tick: `elapsedSeconds += 1`, calls `ui.updateTimer(formatTime(elapsedSeconds))`. |
| `stop()` | — | `void` | `clearInterval(intervalId)`, sets `intervalId = null`. |
| `reset()` | — | `void` | Calls `stop()`. Sets `elapsedSeconds = 0`. Calls `ui.updateTimer('00:00')`. |
| `formatTime(totalSeconds)` | `totalSeconds: number` | `string` | Converts seconds to `MM:SS`. `const mins = Math.floor(totalSeconds / 60)`, `const secs = totalSeconds % 60`. Pads each to 2 digits with `String.padStart(2, '0')`. Returns formatted string. |
| `getElapsed()` | — | `string` | Returns `formatTime(elapsedSeconds)`. Used by win screen. |

---

### 6.6 `modules/ui.js` — DOM Updates

**Responsibilities**: All reads/writes to DOM elements beyond cards. Keeps DOM manipulation in one place.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `cacheDOMRefs()` | — | `object` | Queries and returns an object with references to `#timer-display`, `#moves-display`, `#matches-display`, `#card-grid`, `#win-overlay`, `#win-time`, `#win-moves`. Called once on init. |
| `updateTimer(timeStr)` | `timeStr: string` | `void` | Sets `#timer-display` `textContent` to `timeStr`. |
| `updateMoves(moves)` | `moves: number` | `void` | Sets `#moves-display` `textContent` to `moves`. |
| `updateMatches(matched, total)` | `matched: number`, `total: number` | `void` | Sets `#matches-display` `textContent` to `"matched / total"`. |
| `resetStats()` | — | `void` | Calls `updateTimer('00:00')`, `updateMoves(0)`, `updateMatches(0, totalPairs)`. |
| `showWinScreen(time, moves)` | `time: string`, `moves: number` | `void` | Sets `#win-time` and `#win-moves` text. Removes `hidden` from `#win-overlay`. Moves focus to `#play-again-btn` for accessibility. |
| `hideWinScreen()` | — | `void` | Adds `hidden` to `#win-overlay`. Returns focus to `#start-btn`. |
| `setGridDifficultyClass(gridEl, difficulty)` | `gridEl: HTMLElement`, `difficulty: string` | `void` | Removes all `.board__grid--*` classes, adds `.board__grid--{difficulty}`. |
| `setDifficulty(difficulty)` | `difficulty: string` | `void` | Calls `game.setDifficultyState(difficulty)`. Updates any visual difficulty indicator. |

---

## 7. Game Mechanics

### 7.1 Card Pair Matching Logic

1. Cards are generated in pairs: for `N` pairs, the data array contains `2N` elements (each symbol appears exactly twice).
2. After shuffling, each card element's `data-symbol` attribute holds its symbol.
3. When two cards are face-up, `evaluatePair()` compares their `data-symbol` values.
4. **Match**: both cards keep `.card--flipped` and receive `.card--matched` (they become non-interactive).
5. **Mismatch**: after a 1-second delay both cards lose `.card--flipped` and return face-down.

### 7.2 Flip Lock Timing

| Event | Time | State |
|---|---|---|
| Player clicks 1st card | 0 ms | Card flips (500 ms CSS transition). `isLocked = false`. |
| Player clicks 2nd card | Any time after 1st | Card flips. `evaluatePair()` runs immediately. |
| Mismatch detected | 0 ms after eval | `isLocked = true`. Shake animation plays (400 ms). |
| Cards flip back | 1000 ms after eval | Cards unflip (500 ms CSS transition). `isLocked = false`. |
| Match detected | 0 ms after eval | Glow animation plays (600 ms). No lock needed. |

### 7.3 Difficulty Levels

| Level | Grid | Cards | Pairs | Symbols Used |
|---|---|---|---|---|
| Easy | 4 × 3 | 12 | 6 | First 6 from pool |
| Medium | 4 × 4 | 16 | 8 | First 8 from pool |
| Hard | 6 × 4 | 24 | 12 | First 12 from pool |

### 7.4 Card Icons / Emojis

A pool of 16 emoji symbols ensures enough variety for all difficulty levels:

```text
🍎  🍋  🍇  🍒  🍕  🎸  🚀  🌈
⚡  🎯  🦊  🐝  🎲  🧩  💎  🔮
```

Emojis are chosen for high visual distinction and cross-platform rendering consistency.

---

## 8. Card Data

### Data Generation Pipeline

1. **Slice**: Take the first `N` symbols from `SYMBOLS` where `N = DIFFICULTY_CONFIG[difficulty].pairs`.
2. **Duplicate**: Spread into a new array `[...sliced, ...sliced]` so each symbol appears exactly twice.
3. **Shuffle**: Apply Fisher-Yates shuffle to randomise positions.
4. **Map to objects** (optional, or use plain strings):

```js
// Example for Easy (6 pairs):
const selectedSymbols = SYMBOLS.slice(0, 6);
// ['🍎', '🍋', '🍇', '🍒', '🍕', '🎸']

const cardData = shuffle([...selectedSymbols, ...selectedSymbols]);
// ['🍕', '🍎', '🍇', '🍎', '🍒', '🎸', '🍋', '🍇', '🎸', '🍋', '🍒', '🍕']
// (random order)
```

5. **Render**: Iterate `cardData` and call `createCardElement(symbol, index)` for each entry, appending to the grid.

### Shuffling Approach

Fisher-Yates (Knuth) shuffle is used because:

- It runs in O(n) time.
- It produces an unbiased permutation (every arrangement equally likely).
- It operates in-place with no extra memory.

---

## 9. Accessibility

### 9.1 Keyboard Card Selection

- Every `.card` element receives `tabindex="0"` so it is keyboard-focusable.
- `main.js` listens for `keydown` events on `#card-grid`.
- When `Enter` or `Space` is pressed on a focused card, `handleCardClick(cardEl)` is called (same as click).
- After a game restart, focus moves to the first card in the grid.

### 9.2 ARIA Labels for Card State

Each card's `aria-label` dynamically reflects its current state:

| State | `aria-label` Example |
|---|---|
| Face down | `"Card 5 — face down"` |
| Face up | `"Card 5 — face up, 🍎"` |
| Matched | `"Card 5 — matched, 🍎"` |

Updates occur inside `flipCard()`, `unflipCard()`, and `handleMatch()`.

### 9.3 Live Regions

- `#timer-display`, `#moves-display`, `#matches-display` containers have `aria-live="polite"` so screen readers announce stat changes without interrupting the user.

### 9.4 Focus Management

| Event | Focus Moves To |
|---|---|
| Game starts / restarts | First card in the grid |
| Win screen appears | `#play-again-btn` |
| Win screen dismissed | `#start-btn` |
| Help panel toggled | Stays on `#help-btn` |

### 9.5 Win Overlay as Modal

- `#win-overlay` has `role="dialog"` and `aria-modal="true"`.
- When visible, a focus trap keeps Tab cycling within the overlay (only `#play-again-btn` is focusable inside).
- Pressing `Escape` dismisses the overlay (calls `hideWinScreen()`).

### 9.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .card__inner {
    transition: none;
  }
  .card--matched .card__inner,
  .card--mismatch .card__inner {
    animation: none;
  }
}
```

---

## 10. Step-by-Step Build Order

### Phase 1 — Static Shell

1. Create `index.html` with the full semantic structure (header, controls, stats bar, empty grid, win overlay, footer).
2. Create `styles/main.css` with CSS variables, base resets, typography, page background, header, footer, controls bar, stats bar styling.
3. Verify the page renders correctly in the browser with placeholder content.

### Phase 2 — Card Appearance

4. Add card HTML (hardcode 12 cards manually in `index.html` for testing).
5. Style the card grid for Easy layout (`grid-template-columns: repeat(4, 100px)`).
6. Style `.card`, `.card__inner`, `.card__front`, `.card__back` with 3D transform setup.
7. Add `.card--flipped` CSS rule. Test by manually toggling the class in DevTools.
8. Add the card back pattern (radial gradient).
9. Verify the 3D flip animation works smoothly.

### Phase 3 — Core JavaScript Scaffolding

10. Create `js/main.js` with module imports and `DOMContentLoaded` listener.
11. Create `js/modules/ui.js` — implement `cacheDOMRefs()` and stat update functions.
12. Create `js/modules/board.js` — implement `shuffle()`, `createCardElement()`, `buildBoard()`.
13. Create `js/modules/game.js` — implement state object, `initGame()`, `restartGame()`.
14. Wire `initGame('easy')` to run on page load. Verify the grid populates dynamically. Remove hardcoded cards from HTML.

### Phase 4 — Flip and Match Logic

15. Create `js/modules/card.js` — implement `flipCard()`, `unflipCard()`, `handleCardClick()`.
16. Implement `evaluatePair()` with match/mismatch branching.
17. Implement `handleMatch()` — add `.card--matched`, call `game.registerMatch()`.
18. Implement `handleMismatch()` — lock, timeout, unflip, unlock.
19. Test: click two matching cards → they stay up. Click two non-matching → they flip back.

### Phase 5 — Timer

20. Create `js/modules/timer.js` — implement `start()`, `stop()`, `reset()`, `formatTime()`.
21. Wire timer start to the first card flip (`game.markGameStarted()` → `timer.start()`).
22. Wire timer stop to win condition.
23. Test: timer counts up, stops on win, resets on restart.

### Phase 6 — Win Condition and UI

24. Implement `checkWin()` in `game.js`.
25. Implement `showWinScreen()` and `hideWinScreen()` in `ui.js`.
26. Wire `#play-again-btn` to `restartGame()`.
27. Test full game cycle: play to completion, see win screen, restart.

### Phase 7 — Difficulty Selection

28. Implement difficulty radio listener in `main.js`.
29. Wire `setDifficulty()` to rebuild the board with the new grid size.
30. Add `.board__grid--medium` and `.board__grid--hard` CSS classes.
31. Test all three difficulties end-to-end.

### Phase 8 — Animations

32. Add `.card--matched` glow animation (`@keyframes matchGlow`).
33. Add `.card--mismatch` shake animation (`@keyframes mismatchShake`).
34. Add win overlay pop-in animation (`@keyframes popIn`).
35. Add `prefers-reduced-motion` media query.

### Phase 9 — Accessibility

36. Add `aria-label` updates in card flip/match functions.
37. Add keyboard event listeners (Enter/Space) for card interaction.
38. Implement focus management (post-restart → first card; win screen → play-again button).
39. Add focus trap inside win overlay.
40. Test with keyboard-only navigation.

### Phase 10 — Responsive Design

41. Add media queries for screens < 768 px and < 600 px.
42. Adjust card sizes, grid gaps, font sizes for mobile.
43. Test on multiple viewports (phone, tablet, desktop).

### Phase 11 — Polish and Cleanup

44. Add the "How to Play" toggle functionality.
45. Refine transitions, spacing, and colour contrast.
46. Add file header comments to every JS file per repo standards.
47. Run through a screen reader (VoiceOver / NVDA) for a11y audit.
48. Final cross-browser test (Chrome, Firefox, Safari).

---

## 11. Stretch Goals

### 11.1 Themes

Allow the player to switch visual themes. Implementation:

- Add a `<select>` or button group in the controls bar.
- Define theme variants as alternative CSS variable sets (e.g. `[data-theme="ocean"]`, `[data-theme="forest"]`).
- Persist selection in `localStorage`.

**Possible themes**:

| Theme | Card Back | Background | Accent |
|---|---|---|---|
| Default (Cosmic) | `#7c3aed` | `#0f0f2e` | `#ec4899` |
| Ocean | `#0284c7` | `#0c1e3a` | `#06b6d4` |
| Forest | `#15803d` | `#0f1f13` | `#84cc16` |
| Sunset | `#ea580c` | `#1c1007` | `#f59e0b` |

### 11.2 Best Time Leaderboard

Track the best completion time and fewest moves per difficulty level.

- Store records in `localStorage` under key `memoryMatch_leaderboard`.
- Data structure: `{ easy: { bestTime: 45, bestMoves: 10 }, medium: { ... }, hard: { ... } }`.
- Display personal bests on the win screen and/or in a leaderboard panel.
- Show a "New Record!" badge when a best is beaten.

### 11.3 Sound Effects

Add optional audio feedback:

| Event | Sound |
|---|---|
| Card flip | Short click/pop (`flip.mp3`) |
| Match found | Cheerful chime (`match.mp3`) |
| Mismatch | Soft buzz/thud (`mismatch.mp3`) |
| Win | Celebration fanfare (`win.mp3`) |

- Use the Web Audio API or `<audio>` elements.
- Provide a mute/unmute toggle button in the controls bar.
- Persist mute preference in `localStorage`.
- Store audio files in `assets/sounds/`.

### 11.4 Additional Stretch Ideas

- **Card flip counter per card**: subtle indicator showing how many times a specific card has been flipped (helps with strategy review after game).
- **Multiplayer mode**: two players take turns; track matches per player, declare winner.
- **Timed challenge mode**: set a countdown timer instead of count-up; game over if time runs out.
- **Custom card images**: let the player upload images or choose from image packs instead of emojis.
- **Animated card backs**: CSS animation on the card back pattern (slow rotation or shimmer).
