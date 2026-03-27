# Quiz Battle — Implementation Plan

A complete, step-by-step blueprint for building a two-player local-multiplayer trivia game using vanilla HTML, CSS, and JavaScript (ES2022+ modules). A student should be able to build the entire project from this document alone.

---

## 1. Overview

Quiz Battle is a fast-paced, two-player trivia game played on the same screen. Two players enter their names, pick a trivia category, and then take turns answering timed multiple-choice questions. Points are awarded for correct answers, with bonus points for speed. After all rounds are complete, a results screen declares the winner with a full score breakdown.

**Core experience:** competitive, quick, colourful, and accessible — no installs, no server, no frameworks.

---

## 2. Page Layout (Wireframe-Level Detail)

The entire game is a single HTML page (`index.html`) with three "screens" (only one visible at a time):

### 2.1 Start Screen (`#start-screen`)

```text
┌──────────────────────────────────────────────────────────┐
│                      QUIZ BATTLE ⚔️                      │  ← h1 title
│                   "Test your knowledge!"                 │  ← tagline p
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │  PLAYER 1            │  │  PLAYER 2            │       │
│  │  [ Name input      ] │  │  [ Name input      ] │       │  ← two text inputs
│  └─────────────────────┘  └─────────────────────┘       │
│                                                          │
│  Category:  [ ▼ dropdown / button group ────────── ]     │  ← category selector
│             Science | History | Geography |               │
│             Entertainment | Sports | Random               │
│                                                          │
│  Rounds:    ( 5 )  ( 10 )  ( 15 )                        │  ← radio buttons
│                                                          │
│              ┌───────────────────────┐                    │
│              │     START BATTLE      │                    │  ← primary CTA button
│              └───────────────────────┘                    │
│                                                          │
│  Validation error messages appear inline below inputs    │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Game Screen (`#game-screen`)

```text
┌──────────────────────────────────────────────────────────┐
│  P1: Alice  ★ 120pts          ⏱ 00:15        P2: Bob  ★ 90pts │
│  Streak: 🔥3                  Round 4/10      Streak: 🔥1      │
│ ─────────────────────────────────────────────────────────│
│                                                          │
│           Category: Science   |   Question 4 of 10       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │   What is the chemical symbol for gold?           │    │  ← question card
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│     ┌──────────────┐     ┌──────────────┐                │
│     │   A) Ag       │     │   B) Au       │                │  ← answer buttons
│     └──────────────┘     └──────────────┘                │
│     ┌──────────────┐     ┌──────────────┐                │
│     │   C) Fe       │     │   D) Go       │                │
│     └──────────────┘     └──────────────┘                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  TURN INDICATOR: "Alice, it's your turn!"         │    │  ← turn banner
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  [ answer feedback overlay: ✅ Correct! +10pts ]         │  ← temporary overlay
│  [ timer bar ████████░░░░░░░░ ]                          │  ← animated bar
└──────────────────────────────────────────────────────────┘
```

**Split-screen detail:** During each turn the active player's side of the header is highlighted with their theme colour (a coloured border or background glow). The inactive player's side is dimmed. This makes it crystal clear whose turn it is.

### 2.3 Results Screen (`#results-screen`)

```text
┌──────────────────────────────────────────────────────────┐
│                       🏆 RESULTS 🏆                       │
│                                                          │
│                    "Alice wins!"                         │  ← or "It's a tie!"
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │  PLAYER 1: Alice      │  │  PLAYER 2: Bob        │     │
│  │  Score: 150            │  │  Score: 120            │     │
│  │  Correct: 12/15        │  │  Correct: 10/15        │     │
│  │  Best streak: 5        │  │  Best streak: 3        │     │
│  │  Avg time: 4.2s        │  │  Avg time: 6.1s        │     │
│  └──────────────────────┘  └──────────────────────┘     │
│                                                          │
│       ┌──────────────┐  ┌──────────────────────┐        │
│       │  PLAY AGAIN   │  │  CHANGE CATEGORY      │        │
│       └──────────────┘  └──────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Colour Scheme and Typography

### 3.1 Base Palette

| Token                  | Hex       | Usage                                    |
|------------------------|-----------|------------------------------------------|
| `--color-bg`           | `#0f0f1a` | Page background (dark navy)              |
| `--color-surface`      | `#1a1a2e` | Card/panel backgrounds                   |
| `--color-surface-alt`  | `#16213e` | Alternate surface (question card)        |
| `--color-text`         | `#e0e0e0` | Primary body text                        |
| `--color-text-muted`   | `#8888a0` | Secondary/muted text                     |
| `--color-border`       | `#2a2a4a` | Subtle borders                           |

### 3.2 Player Colours

| Token                        | Hex       | Usage                           |
|------------------------------|-----------|----------------------------------|
| `--color-player1`            | `#ff6b6b` | Player 1 primary (coral red)    |
| `--color-player1-light`      | `#ff8e8e` | Player 1 hover/glow             |
| `--color-player1-bg`         | `#2e1a1a` | Player 1 panel background       |
| `--color-player2`            | `#4ecdc4` | Player 2 primary (teal)         |
| `--color-player2-light`      | `#7eddd6` | Player 2 hover/glow             |
| `--color-player2-bg`         | `#1a2e2c` | Player 2 panel background       |

### 3.3 Feedback Colours

| Token                  | Hex       | Usage                           |
|------------------------|-----------|----------------------------------|
| `--color-correct`      | `#51cf66` | Correct answer (green)          |
| `--color-wrong`        | `#ff6b6b` | Wrong answer (red)              |
| `--color-warning`      | `#ffd43b` | Timer low warning (amber)       |
| `--color-accent`       | `#845ef7` | Buttons, links, highlights      |

### 3.4 Typography

| Property        | Value                                         |
|-----------------|-----------------------------------------------|
| Heading font    | `'Poppins', sans-serif` (Google Fonts)        |
| Body font       | `'Inter', sans-serif` (Google Fonts)          |
| Monospace       | `'Fira Code', monospace` (timer display)      |
| Base size       | `16px`                                        |
| Scale           | `h1: 2.5rem`, `h2: 2rem`, `h3: 1.5rem`      |
| Line height     | `1.6` for body, `1.2` for headings            |
| Font weights    | `400` (body), `600` (semibold), `700` (bold)  |

### 3.5 Visual Style

- **Dark theme** for the competitive gaming feel
- **Rounded corners** (`8px` for cards, `12px` for buttons)
- **Subtle box-shadows** on cards (`0 4px 20px rgba(0,0,0,0.3)`)
- **Gradient accents** on the title and winner announcement
- **Player-coloured glows** around the active player section using `box-shadow` with the player colour

---

## 4. HTML Structure

Below is the complete semantic structure for `index.html`. Every element, id, class, and attribute is listed.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Quiz Battle — a two-player trivia game">
    <title>Quiz Battle</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700&family=Fira+Code:wght@400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <!-- ===== START SCREEN ===== -->
    <section id="start-screen" class="screen screen--active" aria-label="Game setup">
        <header class="start-screen__header">
            <h1 class="start-screen__title">Quiz Battle <span aria-hidden="true">⚔️</span></h1>
            <p class="start-screen__tagline">Test your knowledge — head to head!</p>
        </header>

        <form id="setup-form" class="setup-form" novalidate>
            <!-- Player name inputs -->
            <div class="setup-form__players">
                <div class="setup-form__player setup-form__player--p1">
                    <label for="player1-name" class="setup-form__label">Player 1</label>
                    <input
                        type="text"
                        id="player1-name"
                        class="setup-form__input"
                        placeholder="Enter name"
                        maxlength="20"
                        required
                        autocomplete="off"
                        aria-describedby="player1-error"
                    >
                    <span id="player1-error" class="setup-form__error" role="alert" aria-live="polite"></span>
                </div>

                <div class="setup-form__player setup-form__player--p2">
                    <label for="player2-name" class="setup-form__label">Player 2</label>
                    <input
                        type="text"
                        id="player2-name"
                        class="setup-form__input"
                        placeholder="Enter name"
                        maxlength="20"
                        required
                        autocomplete="off"
                        aria-describedby="player2-error"
                    >
                    <span id="player2-error" class="setup-form__error" role="alert" aria-live="polite"></span>
                </div>
            </div>

            <!-- Category selection -->
            <fieldset class="setup-form__fieldset">
                <legend class="setup-form__legend">Choose a Category</legend>
                <div class="setup-form__categories" role="radiogroup">
                    <label class="category-btn">
                        <input type="radio" name="category" value="science"> Science
                    </label>
                    <label class="category-btn">
                        <input type="radio" name="category" value="history"> History
                    </label>
                    <label class="category-btn">
                        <input type="radio" name="category" value="geography"> Geography
                    </label>
                    <label class="category-btn">
                        <input type="radio" name="category" value="entertainment"> Entertainment
                    </label>
                    <label class="category-btn">
                        <input type="radio" name="category" value="sports"> Sports
                    </label>
                    <label class="category-btn">
                        <input type="radio" name="category" value="random" checked> Random
                    </label>
                </div>
            </fieldset>

            <!-- Round count selection -->
            <fieldset class="setup-form__fieldset">
                <legend class="setup-form__legend">Number of Rounds</legend>
                <div class="setup-form__rounds" role="radiogroup">
                    <label class="round-btn">
                        <input type="radio" name="rounds" value="5" checked> 5
                    </label>
                    <label class="round-btn">
                        <input type="radio" name="rounds" value="10"> 10
                    </label>
                    <label class="round-btn">
                        <input type="radio" name="rounds" value="15"> 15
                    </label>
                </div>
            </fieldset>

            <button type="submit" id="start-btn" class="btn btn--primary btn--large">
                Start Battle
            </button>
        </form>
    </section>

    <!-- ===== GAME SCREEN ===== -->
    <section id="game-screen" class="screen" aria-label="Game in progress" hidden>
        <!-- Scoreboard header -->
        <header class="game-header">
            <div class="game-header__player game-header__player--p1" aria-label="Player 1 score">
                <span class="game-header__name" id="game-p1-name">Player 1</span>
                <span class="game-header__score" id="game-p1-score">0</span>
                <span class="game-header__streak" id="game-p1-streak" aria-label="Current streak"></span>
            </div>

            <div class="game-header__centre">
                <div class="game-header__timer" id="timer-display" aria-live="polite" aria-label="Time remaining">
                    <span id="timer-text">15</span>
                </div>
                <div class="game-header__round" id="round-display">Round 1 / 10</div>
            </div>

            <div class="game-header__player game-header__player--p2" aria-label="Player 2 score">
                <span class="game-header__name" id="game-p2-name">Player 2</span>
                <span class="game-header__score" id="game-p2-score">0</span>
                <span class="game-header__streak" id="game-p2-streak" aria-label="Current streak"></span>
            </div>
        </header>

        <!-- Timer bar (visual) -->
        <div class="timer-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
            <div class="timer-bar__fill" id="timer-bar-fill"></div>
        </div>

        <!-- Turn indicator -->
        <div class="turn-indicator" id="turn-indicator" aria-live="assertive">
            <span id="turn-text">Alice, it's your turn!</span>
        </div>

        <!-- Question area -->
        <article class="question-card" id="question-card" aria-label="Current question">
            <p class="question-card__category" id="question-category">Science</p>
            <h2 class="question-card__text" id="question-text">Loading question...</h2>
        </article>

        <!-- Answer buttons -->
        <div class="answers" id="answers-container" role="group" aria-label="Answer options">
            <button class="answer-btn" data-index="0" id="answer-0">A) —</button>
            <button class="answer-btn" data-index="1" id="answer-1">B) —</button>
            <button class="answer-btn" data-index="2" id="answer-2">C) —</button>
            <button class="answer-btn" data-index="3" id="answer-3">D) —</button>
        </div>

        <!-- Answer feedback overlay -->
        <div class="feedback-overlay" id="feedback-overlay" aria-live="polite" hidden>
            <p class="feedback-overlay__text" id="feedback-text"></p>
            <p class="feedback-overlay__points" id="feedback-points"></p>
        </div>
    </section>

    <!-- ===== RESULTS SCREEN ===== -->
    <section id="results-screen" class="screen" aria-label="Game results" hidden>
        <header class="results-header">
            <h1 class="results-header__title" id="results-title">🏆 Results 🏆</h1>
            <p class="results-header__winner" id="winner-text">Player 1 wins!</p>
        </header>

        <div class="results-cards">
            <article class="results-card results-card--p1" aria-label="Player 1 results">
                <h2 class="results-card__name" id="results-p1-name">Player 1</h2>
                <dl class="results-card__stats">
                    <div class="results-card__stat">
                        <dt>Score</dt>
                        <dd id="results-p1-score">0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Correct</dt>
                        <dd id="results-p1-correct">0 / 0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Best Streak</dt>
                        <dd id="results-p1-streak">0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Avg. Time</dt>
                        <dd id="results-p1-time">0s</dd>
                    </div>
                </dl>
            </article>

            <article class="results-card results-card--p2" aria-label="Player 2 results">
                <h2 class="results-card__name" id="results-p2-name">Player 2</h2>
                <dl class="results-card__stats">
                    <div class="results-card__stat">
                        <dt>Score</dt>
                        <dd id="results-p2-score">0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Correct</dt>
                        <dd id="results-p2-correct">0 / 0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Best Streak</dt>
                        <dd id="results-p2-streak">0</dd>
                    </div>
                    <div class="results-card__stat">
                        <dt>Avg. Time</dt>
                        <dd id="results-p2-time">0s</dd>
                    </div>
                </dl>
            </article>
        </div>

        <div class="results-actions">
            <button class="btn btn--primary" id="play-again-btn">Play Again</button>
            <button class="btn btn--secondary" id="change-category-btn">Change Category</button>
        </div>
    </section>

    <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 5. CSS Design

All styles live in `styles/main.css`. Use CSS custom properties defined in `:root`.

### 5.1 CSS Custom Properties (`:root`)

```css
:root {
    /* Base palette */
    --color-bg: #0f0f1a;
    --color-surface: #1a1a2e;
    --color-surface-alt: #16213e;
    --color-text: #e0e0e0;
    --color-text-muted: #8888a0;
    --color-border: #2a2a4a;

    /* Player colours */
    --color-player1: #ff6b6b;
    --color-player1-light: #ff8e8e;
    --color-player1-bg: #2e1a1a;
    --color-player2: #4ecdc4;
    --color-player2-light: #7eddd6;
    --color-player2-bg: #1a2e2c;

    /* Feedback */
    --color-correct: #51cf66;
    --color-wrong: #ff6b6b;
    --color-warning: #ffd43b;
    --color-accent: #845ef7;

    /* Typography */
    --font-heading: 'Poppins', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'Fira Code', monospace;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;

    /* Radii */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### 5.2 Layout Strategy

| Area                 | Technique                                    |
|----------------------|----------------------------------------------|
| Screen switching     | Each `.screen` is `display: none` by default; `.screen--active` sets `display: flex` with `flex-direction: column` and centres content. |
| Start form           | CSS Grid: two-column layout for player inputs side-by-side. Category buttons use `display: flex; flex-wrap: wrap; gap`. |
| Game header          | CSS Grid with three columns: `1fr auto 1fr`. Player 1 left-aligned, timer centred, Player 2 right-aligned. |
| Answer buttons       | 2×2 CSS Grid: `grid-template-columns: 1fr 1fr` with gap. |
| Results cards        | CSS Grid: `grid-template-columns: 1fr 1fr` with gap. |
| Responsive (≤768px)  | Stack player inputs, answer buttons, and result cards to single column. Reduce font sizes. |
| Responsive (≤480px)  | Further font scaling, compact spacing, full-width buttons. |

### 5.3 Screen Switching

```css
.screen {
    display: none;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: var(--space-xl);
    animation: fadeIn 0.4s ease;
}

.screen--active {
    display: flex;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

### 5.4 Player Colour Theming

The active player's header section receives a coloured left/right border and a subtle background glow:

```css
.game-header__player--p1.game-header__player--active {
    border-left: 4px solid var(--color-player1);
    background: var(--color-player1-bg);
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.2);
}

.game-header__player--p2.game-header__player--active {
    border-right: 4px solid var(--color-player2);
    background: var(--color-player2-bg);
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
}
```

### 5.5 Answer Button States

```css
/* Default */
.answer-btn {
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-text);
    padding: var(--space-md) var(--space-lg);
    font-size: 1.1rem;
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

/* Hover */
.answer-btn:hover:not(:disabled) {
    border-color: var(--color-accent);
    transform: translateY(-2px);
}

/* Correct answer */
.answer-btn--correct {
    background: rgba(81, 207, 102, 0.2);
    border-color: var(--color-correct);
    animation: pulse-correct 0.5s ease;
}

/* Wrong answer (selected) */
.answer-btn--wrong {
    background: rgba(255, 107, 107, 0.2);
    border-color: var(--color-wrong);
    animation: shake 0.4s ease;
}

@keyframes pulse-correct {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
}
```

### 5.6 Timer Bar Animation

```css
.timer-bar {
    width: 100%;
    height: 6px;
    background: var(--color-surface);
    border-radius: 3px;
    overflow: hidden;
}

.timer-bar__fill {
    height: 100%;
    width: 100%;
    background: var(--color-accent);
    border-radius: 3px;
    transition: width 1s linear;
}

/* Warning state: under 5 seconds */
.timer-bar__fill--warning {
    background: var(--color-warning);
    animation: timer-pulse 0.5s ease infinite;
}

/* Critical state: under 3 seconds */
.timer-bar__fill--critical {
    background: var(--color-wrong);
    animation: timer-pulse 0.3s ease infinite;
}

@keyframes timer-pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.6; }
}
```

### 5.7 Feedback Overlay

```css
.feedback-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(15, 15, 26, 0.85);
    z-index: 100;
    animation: fadeIn 0.2s ease;
}

.feedback-overlay__text {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
}

.feedback-overlay__text--correct { color: var(--color-correct); }
.feedback-overlay__text--wrong   { color: var(--color-wrong); }
```

### 5.8 Responsive Breakpoints

```css
@media (max-width: 768px) {
    .setup-form__players   { grid-template-columns: 1fr; }
    .answers               { grid-template-columns: 1fr; }
    .results-cards         { grid-template-columns: 1fr; }
    .game-header           { font-size: 0.85rem; }
}

@media (max-width: 480px) {
    .start-screen__title   { font-size: 1.8rem; }
    .question-card__text   { font-size: 1.1rem; }
    .answer-btn            { padding: var(--space-sm) var(--space-md); font-size: 0.95rem; }
}
```

---

## 6. JavaScript Architecture

All JavaScript uses ES modules. Entry point: `js/main.js`. All other modules live in `js/modules/`.

```text
js/
├── main.js
└── modules/
    ├── game.js
    ├── questions.js
    ├── players.js
    ├── timer.js
    └── ui.js
```

### 6.1 `main.js` — Entry Point and Screen Transitions

**Purpose:** Imports all modules, attaches event listeners, and orchestrates the three screens.

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `init()` | none | `void` | Called on `DOMContentLoaded`. Binds form submit, play-again, and change-category buttons. Shows start screen. |
| `handleFormSubmit(event)` | `event: SubmitEvent` | `void` | Validates form inputs (names, category, rounds). If valid, calls `game.startGame()` and switches to game screen via `ui.showScreen()`. |
| `handlePlayAgain()` | none | `void` | Resets game state, keeps player names and category, calls `game.startGame()`, switches to game screen. |
| `handleChangeCategory()` | none | `void` | Resets game state entirely, switches back to start screen. Preserves player names in inputs. |

### 6.2 `modules/game.js` — Game State and Round Management

**Purpose:** Central game state machine. Manages rounds, turns, scoring logic, and the game loop.

**Exported state object:**

```javascript
const gameState = {
    status: 'idle',           // 'idle' | 'playing' | 'feedback' | 'finished'
    category: 'random',
    totalRounds: 10,
    currentRound: 1,
    currentPlayerIndex: 0,    // 0 = Player 1, 1 = Player 2
    currentQuestion: null,
    questionsUsed: [],        // track question IDs to avoid repeats
    turnPhase: 'p1',          // 'p1' | 'p2' — both answer the same round
    roundQuestions: [],       // the pair of questions for the current round
};
```

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `startGame(config)` | `config: { p1Name: string, p2Name: string, category: string, rounds: number }` | `void` | Initialises `gameState`, creates players via `players.createPlayer()`, picks questions via `questions.getQuestions()`, calls `startRound()`. |
| `startRound()` | none | `void` | Increments round counter, selects a question for the round, sets `currentPlayerIndex` to 0 (Player 1 goes first), calls `presentQuestion()`. |
| `presentQuestion()` | none | `void` | Gets the current question, passes it to `ui.displayQuestion()`, starts the timer via `timer.start()`, updates the turn indicator via `ui.showTurnIndicator()`. |
| `handleAnswer(selectedIndex)` | `selectedIndex: number` | `void` | Stops the timer. Determines if the answer is correct. Calculates points (base + time bonus). Updates the player's score/streak via `players.recordAnswer()`. Calls `ui.showFeedback()`. After a delay, calls `nextTurn()`. |
| `handleTimeout()` | none | `void` | Called when timer reaches zero. Treats as a wrong answer with 0 points. Calls `ui.showFeedback()` with timeout messaging. After delay, calls `nextTurn()`. |
| `nextTurn()` | none | `void` | If the current player is Player 1, switches to Player 2 (`currentPlayerIndex = 1`) and calls `presentQuestion()` (with a different question for the same round, or same question — configurable). If Player 2 has already answered, calls `nextRound()`. |
| `nextRound()` | none | `void` | If `currentRound < totalRounds`, increments round and calls `startRound()`. Otherwise, calls `endGame()`. |
| `endGame()` | none | `void` | Sets status to `'finished'`. Gathers final stats from both players, determines winner, calls `ui.showResults()`. |
| `calculatePoints(isCorrect, timeRemaining, maxTime)` | `isCorrect: boolean, timeRemaining: number, maxTime: number` | `number` | If `isCorrect`: base `10` points + up to `5` bonus points proportional to `timeRemaining / maxTime`. If wrong: `0`. Returns the integer score. |
| `getState()` | none | `object` | Returns a shallow copy of `gameState` for read-only access by other modules. |
| `resetGame()` | none | `void` | Resets all `gameState` properties to initial values. |

### 6.3 `modules/questions.js` — Question Bank and Category Filtering

**Purpose:** Stores the question bank, and provides functions to retrieve, filter, and randomise questions.

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `getQuestions(category, count)` | `category: string, count: number` | `Question[]` | Returns an array of `count` questions for the given category. If `category === 'random'`, picks from all categories. Shuffles and avoids duplicates. |
| `getQuestionById(id)` | `id: string` | `Question \| undefined` | Returns a single question by its unique ID. |
| `getCategories()` | none | `string[]` | Returns the list of available category names: `['science', 'history', 'geography', 'entertainment', 'sports']`. |
| `shuffleArray(array)` | `array: any[]` | `any[]` | Fisher-Yates shuffle. Returns a new shuffled array (does not mutate input). |
| `shuffleAnswers(question)` | `question: Question` | `Question` | Returns a copy of the question with the answers array shuffled, updating `correctIndex` accordingly. |

**Internal data:** The `questionBank` is a const array of `Question` objects (see Section 7).

### 6.4 `modules/players.js` — Player Objects, Scores, Streaks

**Purpose:** Creates and manages player data objects.

**Player object shape:**

```javascript
{
    id: 0,                // 0 or 1
    name: 'Alice',
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalTime: 0,         // sum of answer times in seconds
    answeredCount: 0,     // total questions answered
}
```

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `createPlayer(id, name)` | `id: number, name: string` | `Player` | Creates and returns a new player object with zeroed stats. |
| `recordAnswer(player, isCorrect, points, timeTaken)` | `player: Player, isCorrect: boolean, points: number, timeTaken: number` | `void` | Updates the player's score, correct/wrong counts, streak, and time tracking. If `isCorrect`, increments `currentStreak` and updates `bestStreak` if new high. If wrong, resets `currentStreak` to 0. |
| `getAverageTime(player)` | `player: Player` | `number` | Returns `player.totalTime / player.answeredCount`, rounded to 1 decimal place. Returns `0` if no answers yet. |
| `getStats(player)` | `player: Player` | `object` | Returns a summary object `{ name, score, correct, wrong, bestStreak, avgTime }` for the results screen. |
| `resetPlayer(player)` | `player: Player` | `void` | Resets all numeric fields to 0 while keeping `id` and `name`. |
| `getPlayers()` | none | `Player[]` | Returns the current array of both players. |
| `setPlayers(p1, p2)` | `p1: Player, p2: Player` | `void` | Stores the two players in module-level state. |

### 6.5 `modules/timer.js` — Countdown Timer

**Purpose:** Manages a per-question countdown timer with callbacks for tick, warning, and expiry.

**Internal state:**

```javascript
let intervalId = null;
let timeRemaining = 15;  // seconds
const MAX_TIME = 15;
```

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `start(duration, onTick, onExpire)` | `duration: number, onTick: (remaining: number) => void, onExpire: () => void` | `void` | Starts a countdown from `duration` seconds. Calls `onTick(remaining)` every second. When `remaining` hits 0, clears the interval and calls `onExpire()`. |
| `stop()` | none | `number` | Stops the countdown. Clears the interval. Returns the `timeRemaining` value at the moment it was stopped (used for bonus point calculation). |
| `getTimeRemaining()` | none | `number` | Returns the current `timeRemaining`. |
| `getMaxTime()` | none | `number` | Returns `MAX_TIME` constant (used for bonus calculation ratio). |
| `reset()` | none | `void` | Stops any running timer and resets `timeRemaining` to `MAX_TIME`. |

### 6.6 `modules/ui.js` — DOM Manipulation, Screens, Animations

**Purpose:** All direct DOM access is isolated here. Other modules never touch the DOM — they call `ui` functions instead.

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `showScreen(screenId)` | `screenId: string` | `void` | Hides all `.screen` elements, removes `screen--active`. Finds `#${screenId}`, removes `hidden`, adds `screen--active`. Sets `focus` to the first heading or interactive element for accessibility. |
| `displayQuestion(question, roundNum, totalRounds, category)` | `question: Question, roundNum: number, totalRounds: number, category: string` | `void` | Populates `#question-text` with the question text (using `textContent` — never `innerHTML` for user/untrusted data). Sets each answer button's text. Updates round display. Enables all answer buttons. |
| `showTurnIndicator(playerName, playerIndex)` | `playerName: string, playerIndex: number` | `void` | Updates `#turn-text` to `"${playerName}, it's your turn!"`. Adds/removes `game-header__player--active` class on the correct player header section. Sets a `data-active-player` attribute on the game screen for CSS theming. |
| `updateScores(p1Score, p2Score)` | `p1Score: number, p2Score: number` | `void` | Updates text content of `#game-p1-score` and `#game-p2-score`. |
| `updateStreak(playerIndex, streak)` | `playerIndex: number, streak: number` | `void` | Updates the streak display `#game-p1-streak` or `#game-p2-streak`. Shows fire emoji and count if `streak >= 2`, otherwise empty. |
| `updateTimer(remaining)` | `remaining: number` | `void` | Updates `#timer-text` to `remaining`. Adjusts `#timer-bar-fill` width as a percentage of max time. Adds `--warning` class if `remaining <= 5`, `--critical` class if `remaining <= 3`. |
| `showFeedback(isCorrect, points, correctAnswer, isTimeout)` | `isCorrect: boolean, points: number, correctAnswer: string, isTimeout: boolean` | `Promise<void>` | Shows `#feedback-overlay` with appropriate messaging. Highlights the correct answer button green. If the player picked wrong, highlights their pick red. If timeout, shows "Time's up!" messaging. Returns a Promise that resolves after a `1500ms` delay (time for the player to see the feedback). |
| `highlightAnswer(index, className)` | `index: number, className: string` | `void` | Adds the given class (`answer-btn--correct` or `answer-btn--wrong`) to the answer button at `index`. |
| `disableAnswers()` | none | `void` | Sets `disabled` attribute on all four answer buttons. |
| `enableAnswers()` | none | `void` | Removes `disabled` attribute on all four answer buttons. |
| `showResults(p1Stats, p2Stats, winnerName)` | `p1Stats: object, p2Stats: object, winnerName: string \| null` | `void` | Populates all results screen elements. If `winnerName` is null, displays "It's a tie!". Calls `showScreen('results-screen')`. |
| `resetGameUI()` | none | `void` | Clears all game-screen text, resets timer bar, hides feedback overlay. |
| `setPlayerNames(p1Name, p2Name)` | `p1Name: string, p2Name: string` | `void` | Sets names in the game header: `#game-p1-name` and `#game-p2-name`. |
| `showValidationError(inputId, message)` | `inputId: string, message: string` | `void` | Displays an error message in the error `<span>` associated with the given input. Adds `aria-invalid="true"` to the input. |
| `clearValidationErrors()` | none | `void` | Clears all error span text and removes `aria-invalid` from all form inputs. |

---

## 7. Question Data Structure

Questions are stored as a JavaScript array inside `modules/questions.js`. Each question follows this structure:

```javascript
/**
 * @typedef {Object} Question
 * @property {string} id          - Unique identifier (e.g. "sci-001")
 * @property {string} category    - One of: 'science', 'history', 'geography', 'entertainment', 'sports'
 * @property {string} question    - The question text
 * @property {string[]} answers   - Array of exactly 4 answer strings
 * @property {number} correctIndex - Index (0–3) of the correct answer in the answers array
 */
```

**Example questions:**

```javascript
const questionBank = [
    {
        id: "sci-001",
        category: "science",
        question: "What is the chemical symbol for gold?",
        answers: ["Ag", "Au", "Fe", "Go"],
        correctIndex: 1
    },
    {
        id: "sci-002",
        category: "science",
        question: "How many bones are in the adult human body?",
        answers: ["186", "206", "216", "196"],
        correctIndex: 1
    },
    {
        id: "his-001",
        category: "history",
        question: "In which year did the Berlin Wall fall?",
        answers: ["1987", "1988", "1989", "1990"],
        correctIndex: 2
    },
    {
        id: "geo-001",
        category: "geography",
        question: "What is the capital city of Australia?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctIndex: 2
    },
    {
        id: "ent-001",
        category: "entertainment",
        question: "Who directed the film 'Inception'?",
        answers: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Ridley Scott"],
        correctIndex: 1
    },
    {
        id: "spo-001",
        category: "sports",
        question: "In which sport is the term 'love' used to mean zero?",
        answers: ["Badminton", "Cricket", "Tennis", "Golf"],
        correctIndex: 2
    }
    // ... Include at least 15 questions per category (75+ total)
];
```

**Question count targets:**

| Category       | Minimum Questions |
|----------------|-------------------|
| Science        | 15                |
| History        | 15                |
| Geography      | 15                |
| Entertainment  | 15                |
| Sports         | 15                |
| **Total**      | **75+**           |

**Correct/Wrong answer handling:**

- When a player selects an answer, `game.handleAnswer(selectedIndex)` compares `selectedIndex` to `currentQuestion.correctIndex`.
- If correct: award points, increment streak, highlight button green.
- If wrong: award 0 points, reset streak, highlight selected button red AND highlight the correct button green so the player can learn.
- If timeout (no selection): treat as wrong, highlight the correct answer green.
- After feedback, answers are re-shuffled for the next player (so Player 2 cannot memorise button position from Player 1's turn if given the same question, or a new question is drawn).

---

## 8. Game Flow — State Machine

```text
┌─────────┐
│  IDLE    │  (start screen visible)
└────┬─────┘
     │ user submits form
     ▼
┌──────────────┐
│ INITIALISING │  Create players, pick questions
└──────┬───────┘
       │
       ▼
┌─────────────┐
│ START_ROUND  │  Increment round, pick question(s)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ P1_ANSWERING     │  Show question to Player 1, start timer
└──────┬───────────┘
       │ player clicks answer / timeout
       ▼
┌──────────────────┐
│ P1_FEEDBACK      │  Show correct/wrong, update score (1.5s)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ P2_ANSWERING     │  Show (new) question to Player 2, start timer
└──────┬───────────┘
       │ player clicks answer / timeout
       ▼
┌──────────────────┐
│ P2_FEEDBACK      │  Show correct/wrong, update score (1.5s)
└──────┬───────────┘
       │
       ▼
┌───────────────┐     rounds remaining?
│ ROUND_COMPLETE │────── YES ──▶ back to START_ROUND
└──────┬────────┘
       │ NO
       ▼
┌──────────┐
│ FINISHED │  Calculate winner, show results screen
└──────────┘
       │
       ▼
┌────────────────┐
│ user chooses   │
│ Play Again ────│──▶ back to INITIALISING (same settings)
│ Change Cat. ───│──▶ back to IDLE (start screen)
└────────────────┘
```

**Detailed flow for one round:**

1. `startRound()` is called — increments `currentRound`, picks 1–2 questions for this round.
2. `currentPlayerIndex` is set to `0` (Player 1).
3. `presentQuestion()` displays the question and starts the timer.
4. Player 1 clicks an answer (or timer expires).
5. `handleAnswer()` or `handleTimeout()` fires:
   - Timer is stopped, remaining time captured.
   - Points calculated (base `10` + up to `5` speed bonus).
   - Player stats updated.
   - `ui.showFeedback()` displays a 1.5-second overlay.
6. After the feedback delay, `nextTurn()` is called.
7. `currentPlayerIndex` switches to `1` (Player 2).
8. `presentQuestion()` shows a **new question** from the same round pool (so each player gets a unique question per round to prevent cheating by watching).
9. Player 2 answers → same feedback flow.
10. After Player 2's feedback, `nextRound()` is called.
11. If more rounds remain → loop back. If not → `endGame()`.

---

## 9. Data Flow — How Modules Communicate

```text
main.js
  │
  ├── imports → game.js, ui.js
  │
  │   main.js calls:
  │     game.startGame(config)    — passes form data to game
  │     ui.showScreen()           — switches visible screen
  │
  ▼
game.js (central orchestrator)
  │
  ├── imports → questions.js, players.js, timer.js, ui.js
  │
  │   game.js calls:
  │     questions.getQuestions(category, count)  — gets question list
  │     questions.shuffleAnswers(question)       — shuffles for each turn
  │     players.createPlayer(id, name)           — creates player objects
  │     players.recordAnswer(player, ...)        — updates scores
  │     players.getStats(player)                 — gets final stats
  │     timer.start(duration, onTick, onExpire)  — starts countdown
  │     timer.stop()                             — stops and gets remaining time
  │     ui.displayQuestion(...)                  — shows question on screen
  │     ui.showTurnIndicator(...)                — shows whose turn it is
  │     ui.updateScores(...)                     — refreshes scoreboard
  │     ui.showFeedback(...)                     — shows correct/wrong overlay
  │     ui.showResults(...)                      — populates results screen
  │
  ▼
ui.js
  │
  │   ui.js calls:
  │     game.handleAnswer(index)  — when answer button is clicked
  │       (ui.js sets up click listeners on answer buttons and calls back into game.js)
  │
  │   This creates a two-way dependency:
  │     game.js → ui.js  (to update the DOM)
  │     ui.js → game.js  (to report user interactions)
  │
  │   Resolution: ui.js exposes a `setAnswerCallback(fn)` function.
  │   game.js calls `ui.setAnswerCallback(handleAnswer)` during initialisation.
  │   This way ui.js does not directly import game.js — it invokes the callback.
  │
  ▼
questions.js, players.js, timer.js
  │
  │   These are "leaf" modules — they do NOT import other project modules.
  │   They export pure functions or simple stateful objects.
  │   They have no DOM access and no knowledge of each other.
```

**Dependency graph (arrows = "imports from"):**

```text
main.js ──▶ game.js ──▶ questions.js
       ──▶ ui.js   ──▶ players.js
                   ──▶ timer.js
                   ──▶ ui.js (via callback pattern to avoid circular import)
```

---

## 10. Accessibility

### 10.1 Keyboard Navigation

- **Tab order:** All interactive elements (inputs, buttons, radio buttons) must be reachable via Tab in logical order.
- **Answer buttons:** Pressing `Enter` or `Space` on a focused answer button selects that answer.
- **Arrow keys in radio groups:** The category and round radio groups should support arrow-key navigation natively (semantic `<input type="radio">` with shared `name` provides this for free).
- **Focus trap:** During the game, focus should cycle within the answer buttons and not escape to the browser chrome.

### 10.2 Focus Management

- When switching screens (`ui.showScreen()`), programmatically move focus to the first heading or first interactive element of the new screen using `.focus()`.
- After showing feedback and before the next question, focus should return to the first answer button.
- When the results screen appears, focus the "Play Again" button.

### 10.3 Screen Reader Support

- **`aria-live="polite"`** on `#timer-display` so time changes are announced (but not too aggressively).
- **`aria-live="assertive"`** on `#turn-indicator` so the turn announcement is read immediately.
- **`aria-live="polite"`** on `#feedback-overlay` so correct/wrong feedback is announced.
- **`role="alert"`** on validation error spans so errors are announced when they appear.
- **`aria-label`** on each screen section for context.
- **`aria-describedby`** linking inputs to their error messages.
- **`aria-invalid="true"`** added to inputs with validation errors.
- **`role="progressbar"`** on the timer bar with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` updated each second.
- All decorative emojis wrapped in `<span aria-hidden="true">` so they are not read aloud.

### 10.4 Visual Accessibility

- Colour contrast ratios meet WCAG AA (4.5:1 minimum for text).
- Correct/wrong feedback is **not** communicated by colour alone — text labels ("Correct!" / "Wrong!") and icons (✓ / ✗) reinforce meaning.
- Focus indicators are clearly visible (high-contrast outline).

---

## 11. Step-by-Step Build Order

Follow these steps in sequence. Each step produces a testable result.

### Step 1 — Project Scaffolding

1. Create the file structure:
   - `quiz-battle/index.html`
   - `quiz-battle/styles/main.css`
   - `quiz-battle/js/main.js`
   - `quiz-battle/js/modules/game.js`
   - `quiz-battle/js/modules/questions.js`
   - `quiz-battle/js/modules/players.js`
   - `quiz-battle/js/modules/timer.js`
   - `quiz-battle/js/modules/ui.js`
2. Add the file header comments to every JS file.
3. Verify the folder structure matches the README.

### Step 2 — HTML Markup

1. Write the full `index.html` with all three screens as described in Section 4.
2. Include Google Fonts links in `<head>`.
3. Include `<link rel="stylesheet" href="styles/main.css">`.
4. Include `<script type="module" src="js/main.js"></script>` before `</body>`.
5. Mark `#start-screen` with `screen--active`, and `#game-screen` / `#results-screen` with `hidden`.
6. **Test:** Open in browser — you should see the raw unstyled start screen content.

### Step 3 — Base CSS and Layout

1. Define all CSS custom properties in `:root`.
2. Set the base `body` styles: background, font, colour, margin reset.
3. Style the `.screen` class and `.screen--active` for screen switching.
4. Style the start screen: title, tagline, form layout (grid for player inputs), category radio buttons as styled "pill" buttons, round selector, and the Start Battle CTA button.
5. **Test:** Reload — the start screen should look polished and centred.

### Step 4 — Game Screen CSS

1. Style the game header with three-column grid.
2. Style the timer bar and timer text.
3. Style the turn indicator banner.
4. Style the question card.
5. Style the answer buttons in a 2×2 grid.
6. Style the feedback overlay.
7. Add all animations: `fadeIn`, `shake`, `pulse-correct`, `timer-pulse`.
8. **Test:** Temporarily make `#game-screen` visible to verify layout.

### Step 5 — Results Screen CSS

1. Style the results header (winner title).
2. Style the two results cards side-by-side.
3. Style the action buttons.
4. Add responsive styles for all three breakpoints.
5. **Test:** Temporarily make `#results-screen` visible to verify layout.

### Step 6 — Questions Module

1. In `modules/questions.js`, create the `questionBank` array with at least 75 questions (15 per category).
2. Implement `getQuestions(category, count)` — filters by category (or returns mixed for 'random'), shuffles, returns a slice of `count`.
3. Implement `shuffleArray(array)` — Fisher-Yates algorithm.
4. Implement `shuffleAnswers(question)` — shuffles the `answers` array and updates `correctIndex`.
5. Implement `getCategories()` and `getQuestionById(id)`.
6. Export all functions.
7. **Test:** Import in `main.js` and `console.log(getQuestions('science', 5))` to verify.

### Step 7 — Players Module

1. In `modules/players.js`, implement `createPlayer(id, name)`.
2. Implement `recordAnswer(player, isCorrect, points, timeTaken)`.
3. Implement `getAverageTime(player)` and `getStats(player)`.
4. Implement `resetPlayer(player)`, `getPlayers()`, `setPlayers()`.
5. Export all functions.
6. **Test:** Create a player, record some answers, log stats.

### Step 8 — Timer Module

1. In `modules/timer.js`, implement `start(duration, onTick, onExpire)`.
2. Implement `stop()` returning remaining time.
3. Implement `getTimeRemaining()`, `getMaxTime()`, `reset()`.
4. Export all functions.
5. **Test:** Start a timer, log ticks, verify it expires and calls `onExpire`.

### Step 9 — UI Module

1. In `modules/ui.js`, implement `showScreen(screenId)` with focus management.
2. Implement `displayQuestion()` — populate question text and answer buttons using `textContent`.
3. Implement `showTurnIndicator()` — update text and active-player classes.
4. Implement `updateScores()` and `updateStreak()`.
5. Implement `updateTimer()` — update text, bar width, and warning/critical classes.
6. Implement `showFeedback()` — show overlay, highlight answers, return a Promise that resolves after 1500ms.
7. Implement `highlightAnswer()`, `disableAnswers()`, `enableAnswers()`.
8. Implement `showResults()` — populate all stats.
9. Implement `resetGameUI()`, `setPlayerNames()`.
10. Implement `showValidationError()`, `clearValidationErrors()`.
11. Implement `setAnswerCallback(fn)` — stores a callback, and sets up click listeners on answer buttons that call `fn(index)`.
12. Export all functions.
13. **Test:** Call `showScreen('game-screen')`, `displayQuestion(sampleQuestion, ...)` from `main.js` console.

### Step 10 — Game Module (Core Logic)

1. In `modules/game.js`, define the `gameState` object.
2. Implement `startGame(config)`:
   - Call `players.createPlayer()` for both players, `players.setPlayers()`.
   - Call `questions.getQuestions()` to get the full question pool.
   - Call `ui.setPlayerNames()`.
   - Call `ui.setAnswerCallback(handleAnswer)`.
   - Call `startRound()`.
3. Implement `startRound()` → `presentQuestion()`.
4. Implement `handleAnswer(selectedIndex)`:
   - Call `timer.stop()`.
   - Determine correct/wrong.
   - Call `calculatePoints()`.
   - Call `players.recordAnswer()`.
   - Call `ui.disableAnswers()`.
   - Call `ui.showFeedback()`.
   - After feedback resolves, call `nextTurn()`.
5. Implement `handleTimeout()` (similar to `handleAnswer` but always wrong).
6. Implement `nextTurn()` and `nextRound()`.
7. Implement `endGame()` → call `ui.showResults()`.
8. Implement `calculatePoints()`, `getState()`, `resetGame()`.
9. Export `startGame`, `handleAnswer`, `handleTimeout`, `getState`, `resetGame`.

### Step 11 — Main Module (Wire Everything)

1. In `main.js`, import `game` and `ui`.
2. Implement `init()`:
   - `document.addEventListener('DOMContentLoaded', init)`.
   - Bind `#setup-form` submit to `handleFormSubmit`.
   - Bind `#play-again-btn` click to `handlePlayAgain`.
   - Bind `#change-category-btn` click to `handleChangeCategory`.
3. Implement `handleFormSubmit(event)`:
   - `event.preventDefault()`.
   - Read and trim player names.
   - Read selected category and round count.
   - Validate: names must be non-empty, unique, and alphanumeric (with spaces allowed). Show errors via `ui.showValidationError()` if invalid.
   - If valid, call `ui.showScreen('game-screen')` and `game.startGame(config)`.
4. Implement `handlePlayAgain()` and `handleChangeCategory()`.
5. **Test:** Full game loop — enter names, pick category, play through all rounds, see results.

### Step 12 — Polish and Edge Cases

1. Add the answer button hover and focus styles.
2. Ensure all focus management works: after screen transitions, after feedback.
3. Test with keyboard only — Tab through everything, select answers with Enter.
4. Test at all responsive breakpoints.
5. Verify no `innerHTML` is used with dynamic content (XSS prevention).
6. Add input sanitisation: strip HTML tags from player names.
7. Handle edge case: both players tie — display "It's a tie!" on results screen.
8. Handle edge case: not enough questions in a category — fall back to 'random' or show an error.

### Step 13 — Sound Effects (if time permits)

1. Add audio files to `assets/` (correct.mp3, wrong.mp3, tick.mp3, win.mp3).
2. Create a simple `playSound(name)` utility (can live in `ui.js` or a small `audio.js` module).
3. Call `playSound('correct')` or `playSound('wrong')` in `game.handleAnswer()`.
4. Play `tick.mp3` when timer is ≤ 5 seconds.
5. Play `win.mp3` on the results screen.

### Step 14 — Final Testing

1. Play a full game with 5 rounds — verify scores, streaks, and averages are correct.
2. Play a full game with 15 rounds — verify no repeated questions.
3. Test 'random' category — verify questions come from mixed categories.
4. Test timer expiry — let the clock run out and verify it counts as wrong.
5. Test validation — submit with empty names, duplicate names, special characters.
6. Test responsiveness on mobile viewport sizes (375px, 768px, 1024px).
7. Run a screen reader (VoiceOver on macOS) through the full flow.
8. Check browser console for zero errors.

---

## 12. Stretch Goals

These features are optional enhancements to add after the core game is complete.

### 12.1 Sound Effects

- Add `correct.mp3`, `wrong.mp3`, `tick.mp3`, `countdown-warning.mp3`, `victory.mp3` to `assets/`.
- Create `modules/audio.js` with `playSound(name)` and `toggleMute()`.
- Add a mute/unmute button in the game header.

### 12.2 Power-Ups

- **Double Points:** Next correct answer is worth 2×. Each player gets 1 per game.
- **50:50:** Remove two wrong answers, leaving the correct answer and one distractor.
- **Time Freeze:** Pause the timer for the current question.
- Add a power-up bar below each player's header section with clickable icons.
- Track power-up usage in the player object (`powerUpsUsed: { double: false, fiftyFifty: false, freeze: false }`).

### 12.3 Online Questions API

- Replace or supplement the local question bank with the [Open Trivia Database API](https://opentdb.com/api.php).
- API URL pattern: `https://opentdb.com/api.php?amount=10&category=9&type=multiple`
- Add a `modules/api.js` module with:
  - `fetchQuestions(category, count)` — makes the API call, transforms the response into the local `Question` format.
  - Error handling: if the API fails, fall back to local questions, and show a toast notification.
- HTML-decode API responses (they come HTML-encoded).
- Add a loading spinner while questions are being fetched.

### 12.4 Difficulty Levels

- Add a difficulty selector to the start screen: Easy, Medium, Hard.
- Easy: 20-second timer, no trick answers.
- Medium: 15-second timer (default).
- Hard: 10-second timer, more challenging questions.
- Store difficulty in `gameState` and pass to `timer.start()`.

### 12.5 Animations and Juice

- Add confetti animation on the results screen for the winner (a simple canvas-based particle system or CSS animation).
- Add a score counter "counting up" animation on the results screen.
- Add a transition animation between questions (slide out / slide in).

### 12.6 Local High Scores

- Store top scores in `localStorage` keyed by player name.
- Show a "Hall of Fame" section on the start screen with the top 5 scores.
- Module: add `modules/storage.js` with `saveScore(name, score)` and `getTopScores(limit)`.
