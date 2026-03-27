# Personality Quiz — "What Type of Coder Are You?"

## 1. Overview

A single-page personality quiz that determines the user's coding personality type through a series of weighted multiple-choice questions, culminating in an animated result reveal.

### User Flow

```
Landing Page (intro screen)
    │
    ▼
[Start Quiz] button clicked
    │
    ▼
Question 1 of 10 displayed
    ├── 4 answer cards shown
    ├── Progress bar at 0%
    │
    ▼
User selects an answer card
    ├── Card highlights with select animation
    ├── Score weights added to personality totals
    ├── 600ms delay for visual feedback
    │
    ▼
Next question slides in
    ├── Progress bar fills incrementally (10% per question)
    │
    ▼
... repeat for all 10 questions ...
    │
    ▼
Final answer submitted
    ├── Progress bar hits 100%
    ├── Brief 800ms pause
    │
    ▼
Result Screen animates in
    ├── Personality type emoji scales up
    ├── Title fades in
    ├── Description typing effect
    ├── Traits list staggers in
    ├── Accent colour matches personality type
    │
    ▼
[Retake Quiz] button → resets all state → Landing Page
```

### Key Features

- 10 multiple-choice questions with 4 answer options each
- 5 personality types with unique accent colours and descriptions
- Weighted scoring system — each answer distributes points across multiple types
- Animated progress bar tracking quiz completion
- Smooth view transitions (intro → quiz → result)
- Keyboard navigation (1-4 keys, Enter, Tab)
- Fully responsive — works on mobile, tablet, desktop
- No external dependencies — vanilla HTML/CSS/JS only

---

## 2. Page Layout

### Intro Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🧑‍💻                                │
│                                                 │
│         What Type of Coder Are You?             │
│                                                 │
│    Answer 10 questions to discover your         │
│    coding personality type.                     │
│                                                 │
│          ┌──────────────────┐                   │
│          │   Start Quiz  →  │                   │
│          └──────────────────┘                   │
│                                                 │
│    · 10 questions · 2 min · No wrong answers    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Question View

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Question 3 of 10                               │
│  ┌─────────────────────────────────────────┐    │
│  │████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░│    │
│  └─────────────────────────────────────────┘    │
│  30% complete                                   │
│                                                 │
│  You're starting a new project. What do         │
│  you do first?                                  │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │  A               │  │  B               │     │
│  │                  │  │                  │      │
│  │  Plan the full   │  │  Jump straight   │     │
│  │  architecture    │  │  into code       │     │
│  │  on paper        │  │                  │      │
│  └─────────────────┘  └─────────────────┘      │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │  C               │  │  D               │     │
│  │                  │  │                  │      │
│  │  Search for      │  │  Sketch the UI   │     │
│  │  similar open    │  │  and user flow   │     │
│  │  source projects │  │  first           │     │
│  └─────────────────┘  └─────────────────┘      │
│                                                 │
│  Press 1-4 or click to select                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Result Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│               Your Result:                      │
│                                                 │
│                 🏗️                              │
│            (scales up animation)                │
│                                                 │
│          The Architect                          │
│          ═══════════════                        │
│                                                 │
│  You think in systems. Before writing a         │
│  single line of code, you've already mapped     │
│  out the data flow, the edge cases, and the     │
│  deployment strategy.                           │
│                                                 │
│  Your Traits:                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ ✦ Systems thinker                       │    │
│  │ ✦ Loves clean architecture              │    │
│  │ ✦ Plans before coding                   │    │
│  │ ✦ Whiteboard enthusiast                 │    │
│  │ ✦ Designs for scale                     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Share: "I'm The Architect! 🏗️"        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│          ┌──────────────────┐                   │
│          │  Retake Quiz  ↺  │                   │
│          └──────────────────┘                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Answer Cards Layout | Font Scale |
|---|---|---|
| Desktop (≥768px) | 2×2 grid | Base (1rem = 16px) |
| Mobile (<768px) | Single column stack | 0.9rem base |

---

## 3. Colour Scheme & Typography

### CSS Custom Properties

```css
:root {
  /* === Base Palette === */
  --color-bg-primary: #0f0f1a;          /* Deep navy background */
  --color-bg-secondary: #1a1a2e;        /* Slightly lighter panels */
  --color-bg-card: #25253e;             /* Answer card background */
  --color-bg-card-hover: #2f2f4f;       /* Card hover state */
  --color-text-primary: #e8e8f0;        /* Main body text */
  --color-text-secondary: #a0a0b8;      /* Muted / helper text */
  --color-text-heading: #ffffff;        /* Headings */
  --color-border: #3a3a5c;             /* Card borders */
  --color-border-hover: #5a5a8c;       /* Card border on hover */

  /* === Progress Bar === */
  --color-progress-bg: #2a2a44;         /* Track background */
  --color-progress-fill: #6c63ff;       /* Fill gradient start */
  --color-progress-fill-end: #ab63ff;   /* Fill gradient end */

  /* === Personality Type Accent Colours === */
  --color-architect: #6c63ff;           /* Purple — The Architect */
  --color-creative: #ff6b9d;           /* Pink — The Creative */
  --color-debugger: #00d4aa;           /* Teal — The Debugger */
  --color-fullstack: #ffa726;          /* Amber — The Full-Stack Hero */
  --color-hacker: #76ff03;             /* Lime green — The Hacker */

  /* === Answer Card Selection === */
  --color-selected-bg: #3a3a6b;         /* Selected card fill */
  --color-selected-border: #6c63ff;     /* Selected card border */

  /* === UI Accents === */
  --color-button-primary: #6c63ff;      /* CTA button */
  --color-button-hover: #5a52e0;        /* CTA hover */
  --color-button-text: #ffffff;         /* Button text */
  --color-shadow: rgba(0, 0, 0, 0.3);  /* Drop shadows */

  /* === Typography === */
  --font-heading: 'Poppins', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  --fs-hero: clamp(2rem, 5vw, 3rem);    /* Landing page title */
  --fs-h1: clamp(1.5rem, 4vw, 2.25rem); /* Result type title */
  --fs-h2: clamp(1.2rem, 3vw, 1.5rem);  /* Question text */
  --fs-body: 1rem;                       /* Body text */
  --fs-small: 0.875rem;                  /* Helper / meta text */
  --fs-label: 0.8rem;                    /* Card option labels */

  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;

  /* === Spacing === */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 600ms ease;

  /* === Border Radius === */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-full: 50%;
}
```

### Font Loading

Load from Google Fonts in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
```

### Personality Type Colour Application

Each result screen dynamically applies the personality type's accent colour:

| Type | Accent Variable | Applied To |
|---|---|---|
| The Architect | `--color-architect` (#6c63ff) | Result title underline, emoji glow, trait bullets |
| The Creative | `--color-creative` (#ff6b9d) | Same elements, pink theme |
| The Debugger | `--color-debugger` (#00d4aa) | Same elements, teal theme |
| The Full-Stack Hero | `--color-fullstack` (#ffa726) | Same elements, amber theme |
| The Hacker | `--color-hacker` (#76ff03) | Same elements, lime theme |

The active accent colour is set via `data-personality` attribute on the result container, which maps to the correct CSS variable.

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Discover your coding personality type with this fun quiz. Are you The Architect, The Creative, The Debugger, The Full-Stack Hero, or The Hacker?">
  <title>What Type of Coder Are You? — Personality Quiz</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="app" class="app">

    <!-- ===== INTRO VIEW ===== -->
    <section id="view-intro" class="view view--intro active" aria-label="Quiz introduction">
      <div class="intro">
        <span class="intro__emoji" aria-hidden="true">🧑‍💻</span>
        <h1 class="intro__title">What Type of Coder Are You?</h1>
        <p class="intro__subtitle">
          Answer 10 quick questions to discover your coding personality type.
        </p>
        <button id="btn-start" class="btn btn--primary" type="button">
          Start Quiz <span aria-hidden="true">→</span>
        </button>
        <ul class="intro__meta" aria-label="Quiz details">
          <li>10 questions</li>
          <li>~2 minutes</li>
          <li>No wrong answers</li>
        </ul>
      </div>
    </section>

    <!-- ===== QUIZ VIEW ===== -->
    <section id="view-quiz" class="view view--quiz" aria-label="Quiz questions" hidden>
      <div class="quiz">
        <header class="quiz__header">
          <p class="quiz__counter">
            Question <span id="question-current">1</span> of <span id="question-total">10</span>
          </p>
          <div
            class="progress"
            role="progressbar"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Quiz progress"
          >
            <div id="progress-fill" class="progress__fill" style="width: 0%"></div>
          </div>
          <p class="quiz__percent" aria-live="polite">
            <span id="progress-text">0</span>% complete
          </p>
        </header>

        <h2 id="question-text" class="quiz__question"></h2>

        <div
          id="answers-grid"
          class="answers"
          role="radiogroup"
          aria-labelledby="question-text"
        >
          <!-- Answer cards rendered by JS -->
          <!--
          <button class="answer-card" role="radio" aria-checked="false" data-index="0" tabindex="0">
            <span class="answer-card__key">A</span>
            <span class="answer-card__text">Answer text here</span>
          </button>
          -->
        </div>

        <p class="quiz__hint" aria-live="polite">Press 1–4 or click to select</p>
      </div>
    </section>

    <!-- ===== RESULT VIEW ===== -->
    <section id="view-result" class="view view--result" aria-label="Quiz result" hidden>
      <div class="result" id="result-container">
        <p class="result__label">Your Result:</p>
        <span id="result-emoji" class="result__emoji" aria-hidden="true"></span>
        <h1 id="result-title" class="result__title"></h1>
        <p id="result-description" class="result__description"></p>

        <div class="result__traits">
          <h2 class="result__traits-heading">Your Traits:</h2>
          <ul id="result-traits-list" class="result__traits-list" aria-label="Personality traits">
            <!-- Trait items rendered by JS -->
          </ul>
        </div>

        <button id="btn-retake" class="btn btn--primary" type="button">
          Retake Quiz <span aria-hidden="true">↺</span>
        </button>
      </div>
    </section>

  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Structural Decisions

- **Three sibling `<section>` views** — only one has `active` class at a time; others get `hidden` attribute
- **Progress bar** uses `role="progressbar"` with `aria-valuenow` updated by JS
- **Answer cards** use `role="radio"` within a `role="radiogroup"` for screen reader compatibility
- **`aria-live="polite"`** on progress percentage and hint text for dynamic updates
- **`data-index`** on answer cards maps to the answer index in the question data
- **No `<form>`** element — quiz is interactive, not a traditional form submission

---

## 5. CSS Design

### View Transitions

```css
/* Base view state — hidden by default */
.view {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
  pointer-events: none;
}

/* Active view slides in and fades */
.view.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  position: relative;
}

/* Exiting view slides up and fades out */
.view.exit {
  opacity: 0;
  transform: translateY(-20px);
}
```

### Answer Card Styles

```css
.answer-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  text-align: left;
  width: 100%;
  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--color-text-primary);
}

/* Hover — lift and brighten */
.answer-card:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-border-hover);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--color-shadow);
}

/* Focus visible — keyboard navigation ring */
.answer-card:focus-visible {
  outline: 2px solid var(--color-selected-border);
  outline-offset: 3px;
}

/* Selected state */
.answer-card.selected {
  background: var(--color-selected-bg);
  border-color: var(--color-selected-border);
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(108, 99, 255, 0.3);
}

/* After selection — disable other cards */
.answers--locked .answer-card:not(.selected) {
  opacity: 0.5;
  pointer-events: none;
  transform: scale(0.98);
}

/* Key badge on each card */
.answer-card__key {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: var(--fw-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* Answer cards 2×2 grid on desktop */
.answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  max-width: 640px;
  width: 100%;
}

@media (max-width: 767px) {
  .answers {
    grid-template-columns: 1fr;
  }
}
```

### Progress Bar Animation

```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--color-progress-bg);
  border-radius: 4px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-progress-fill), var(--color-progress-fill-end));
  border-radius: 4px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Result Reveal Animations

```css
/* Emoji — scales from 0 and bounces */
@keyframes emoji-reveal {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.3);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.result__emoji {
  font-size: 5rem;
  display: block;
  opacity: 0;
}

.view--result.active .result__emoji {
  animation: emoji-reveal 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Title — fade in and slide up, delayed */
@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result__title {
  opacity: 0;
}

.view--result.active .result__title {
  animation: fade-slide-up 500ms ease forwards;
  animation-delay: 400ms;
}

/* Description — delayed further */
.result__description {
  opacity: 0;
}

.view--result.active .result__description {
  animation: fade-slide-up 500ms ease forwards;
  animation-delay: 700ms;
}

/* Traits list — each item staggers */
.result__traits-list li {
  opacity: 0;
}

.view--result.active .result__traits-list li {
  animation: fade-slide-up 400ms ease forwards;
}

.view--result.active .result__traits-list li:nth-child(1) { animation-delay: 900ms; }
.view--result.active .result__traits-list li:nth-child(2) { animation-delay: 1000ms; }
.view--result.active .result__traits-list li:nth-child(3) { animation-delay: 1100ms; }
.view--result.active .result__traits-list li:nth-child(4) { animation-delay: 1200ms; }
.view--result.active .result__traits-list li:nth-child(5) { animation-delay: 1300ms; }

/* Retake button — last to appear */
.view--result .btn {
  opacity: 0;
}

.view--result.active .btn {
  animation: fade-slide-up 400ms ease forwards;
  animation-delay: 1500ms;
}

/* Result accent colour glow on emoji (set via JS data attribute) */
.result[data-personality="architect"] .result__emoji {
  filter: drop-shadow(0 0 20px var(--color-architect));
}
.result[data-personality="creative"] .result__emoji {
  filter: drop-shadow(0 0 20px var(--color-creative));
}
.result[data-personality="debugger"] .result__emoji {
  filter: drop-shadow(0 0 20px var(--color-debugger));
}
.result[data-personality="fullstack"] .result__emoji {
  filter: drop-shadow(0 0 20px var(--color-fullstack));
}
.result[data-personality="hacker"] .result__emoji {
  filter: drop-shadow(0 0 20px var(--color-hacker));
}

/* Accent-coloured title underline */
.result[data-personality="architect"] .result__title { color: var(--color-architect); }
.result[data-personality="creative"] .result__title { color: var(--color-creative); }
.result[data-personality="debugger"] .result__title { color: var(--color-debugger); }
.result[data-personality="fullstack"] .result__title { color: var(--color-fullstack); }
.result[data-personality="hacker"] .result__title { color: var(--color-hacker); }
```

### Question Transition (within quiz view)

```css
/* Question text and answers slide/fade for each new question */
@keyframes question-enter {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.quiz__question.entering {
  animation: question-enter 350ms ease forwards;
}

.answers.entering {
  animation: question-enter 350ms ease forwards;
  animation-delay: 100ms;
}
```

---

## 6. JavaScript Architecture

### Module Map

```
js/
├── main.js              Entry point, imports and initialises everything
└── modules/
    ├── questions.js     Question bank data (exported array)
    ├── quiz.js          Quiz state and flow logic (class)
    ├── results.js       Personality type definitions + scoring resolution
    ├── ui.js            All DOM manipulation, rendering, animations
    └── router.js        View switching logic
```

### `js/main.js` — Entry Point

```javascript
/**
 * File: main.js
 * Description: Entry point — initialises the quiz application
 * Author: Student
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { Quiz } from './modules/quiz.js';
import { Router } from './modules/router.js';
import { UI } from './modules/ui.js';
import { questions } from './modules/questions.js';
import { getResult } from './modules/results.js';

function init() {
  const router = new Router();
  const quiz = new Quiz(questions);
  const ui = new UI();

  // Start button → begin quiz
  ui.onStart(() => {
    quiz.reset();
    ui.renderQuestion(quiz.getCurrentQuestion(), quiz.currentIndex, quiz.totalQuestions);
    ui.updateProgress(quiz.getProgress());
    router.showView('quiz');
  });

  // Answer selected → advance or finish
  ui.onAnswer((answerIndex) => {
    quiz.submitAnswer(answerIndex);

    if (quiz.isComplete()) {
      ui.updateProgress(100);
      setTimeout(() => {
        const result = getResult(quiz.getScores());
        ui.showResult(result);
        router.showView('result');
      }, 800);
    } else {
      quiz.advance();
      setTimeout(() => {
        ui.renderQuestion(quiz.getCurrentQuestion(), quiz.currentIndex, quiz.totalQuestions);
        ui.updateProgress(quiz.getProgress());
      }, 600);
    }
  });

  // Retake button → reset
  ui.onRetake(() => {
    quiz.reset();
    router.showView('intro');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (router.currentView !== 'quiz') return;
    const key = parseInt(e.key, 10);
    if (key >= 1 && key <= 4) {
      ui.selectAnswer(key - 1);
    }
  });

  router.showView('intro');
}

document.addEventListener('DOMContentLoaded', init);
```

### `js/modules/questions.js` — Question Bank

Exports a `questions` array. Each question object:

```javascript
/**
 * @typedef {Object} Answer
 * @property {string} text - The answer display text
 * @property {Object} weights - Points added per personality type
 * @property {number} weights.architect
 * @property {number} weights.creative
 * @property {number} weights.debugger
 * @property {number} weights.fullstack
 * @property {number} weights.hacker
 */

/**
 * @typedef {Object} Question
 * @property {string} question - The question text
 * @property {Answer[]} answers - Array of 4 answer options
 */

export const questions = [ /* ... see Section 7 ... */ ];
```

### `js/modules/quiz.js` — Quiz State Manager

```javascript
export class Quiz {
  /** @param {Question[]} questions */
  constructor(questions) {
    this.questions = questions;
    this.reset();
  }

  reset() {
    this.currentIndex = 0;
    this.scores = { architect: 0, creative: 0, debugger: 0, fullstack: 0, hacker: 0 };
  }

  get totalQuestions() {
    return this.questions.length;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  /**
   * Applies score weights from the selected answer.
   * @param {number} answerIndex - Index of selected answer (0-3)
   */
  submitAnswer(answerIndex) {
    const answer = this.questions[this.currentIndex].answers[answerIndex];
    for (const [type, points] of Object.entries(answer.weights)) {
      this.scores[type] += points;
    }
  }

  advance() {
    this.currentIndex++;
  }

  isComplete() {
    return this.currentIndex >= this.questions.length - 1;
  }

  /** @returns {number} Progress as 0-100 */
  getProgress() {
    return Math.round(((this.currentIndex) / this.totalQuestions) * 100);
  }

  getScores() {
    return { ...this.scores };
  }
}
```

### `js/modules/results.js` — Personality Types & Scoring Resolution

```javascript
/**
 * @typedef {Object} PersonalityResult
 * @property {string} key - Internal key (e.g. "architect")
 * @property {string} emoji - Display emoji
 * @property {string} title - Display title
 * @property {string} description - Full description paragraph
 * @property {string[]} traits - Array of 5 trait strings
 * @property {string} color - CSS variable name for accent colour
 */

const personalityTypes = { /* ... see Section 7 ... */ };

/**
 * Determines personality type from accumulated scores.
 * @param {Object} scores - { architect, creative, debugger, fullstack, hacker }
 * @returns {PersonalityResult}
 */
export function getResult(scores) {
  // Find the type(s) with highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  // Tie-breaking: if top two are equal, use predefined priority order
  const winner = sorted[0][0];
  return personalityTypes[winner];
}
```

### `js/modules/ui.js` — DOM Rendering & Animations

```javascript
export class UI {
  constructor() {
    this.els = {
      btnStart: document.getElementById('btn-start'),
      btnRetake: document.getElementById('btn-retake'),
      questionCurrent: document.getElementById('question-current'),
      questionTotal: document.getElementById('question-total'),
      questionText: document.getElementById('question-text'),
      answersGrid: document.getElementById('answers-grid'),
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      resultContainer: document.getElementById('result-container'),
      resultEmoji: document.getElementById('result-emoji'),
      resultTitle: document.getElementById('result-title'),
      resultDescription: document.getElementById('result-description'),
      resultTraitsList: document.getElementById('result-traits-list'),
    };
    this._answerCallback = null;
    this._locked = false;
  }

  // Event binding methods
  onStart(callback)  { this.els.btnStart.addEventListener('click', callback); }
  onRetake(callback) { this.els.btnRetake.addEventListener('click', callback); }
  onAnswer(callback) { this._answerCallback = callback; }

  /**
   * Renders a question and its answer cards.
   * @param {Question} question
   * @param {number} index - Zero-based current question index
   * @param {number} total - Total number of questions
   */
  renderQuestion(question, index, total) {
    this._locked = false;
    this.els.questionCurrent.textContent = index + 1;
    this.els.questionTotal.textContent = total;
    this.els.questionText.textContent = question.question;

    // Add entering animation class
    this.els.questionText.classList.add('entering');
    this.els.answersGrid.classList.add('entering');
    this.els.answersGrid.classList.remove('answers--locked');

    // Remove animation classes after they finish
    setTimeout(() => {
      this.els.questionText.classList.remove('entering');
      this.els.answersGrid.classList.remove('entering');
    }, 500);

    const keys = ['A', 'B', 'C', 'D'];
    this.els.answersGrid.innerHTML = '';

    question.answers.forEach((answer, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-card';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('data-index', i);
      btn.tabIndex = i === 0 ? 0 : -1;

      btn.innerHTML = `
        <span class="answer-card__key">${keys[i]}</span>
        <span class="answer-card__text">${answer.text}</span>
      `;

      btn.addEventListener('click', () => this.selectAnswer(i));
      this.els.answersGrid.appendChild(btn);
    });
  }

  /**
   * Highlights the selected answer and triggers callback after a delay.
   * @param {number} index - 0-based answer index
   */
  selectAnswer(index) {
    if (this._locked) return;
    this._locked = true;

    const cards = this.els.answersGrid.querySelectorAll('.answer-card');
    if (!cards[index]) return;

    cards[index].classList.add('selected');
    cards[index].setAttribute('aria-checked', 'true');
    this.els.answersGrid.classList.add('answers--locked');

    if (this._answerCallback) {
      this._answerCallback(index);
    }
  }

  /**
   * Updates the progress bar width and text.
   * @param {number} percent - 0 to 100
   */
  updateProgress(percent) {
    this.els.progressFill.style.width = `${percent}%`;
    this.els.progressText.textContent = percent;
    const bar = this.els.progressFill.closest('.progress');
    bar.setAttribute('aria-valuenow', percent);
  }

  /**
   * Populates the result screen with personality type data.
   * @param {PersonalityResult} result
   */
  showResult(result) {
    this.els.resultContainer.setAttribute('data-personality', result.key);
    this.els.resultEmoji.textContent = result.emoji;
    this.els.resultTitle.textContent = result.title;
    this.els.resultDescription.textContent = result.description;

    this.els.resultTraitsList.innerHTML = '';
    result.traits.forEach((trait) => {
      const li = document.createElement('li');
      li.textContent = `✦ ${trait}`;
      this.els.resultTraitsList.appendChild(li);
    });
  }
}
```

### `js/modules/router.js` — View Switching

```javascript
export class Router {
  constructor() {
    this.views = {
      intro: document.getElementById('view-intro'),
      quiz: document.getElementById('view-quiz'),
      result: document.getElementById('view-result'),
    };
    this.currentView = null;
  }

  /**
   * Shows the target view with transition.
   * @param {'intro' | 'quiz' | 'result'} viewName
   */
  showView(viewName) {
    // Exit current view
    for (const [name, el] of Object.entries(this.views)) {
      if (name === viewName) continue;
      el.classList.remove('active');
      el.classList.add('exit');
      el.setAttribute('hidden', '');
      // Clean up exit class after transition
      setTimeout(() => el.classList.remove('exit'), 600);
    }

    // Enter target view
    const target = this.views[viewName];
    target.removeAttribute('hidden');
    // Force reflow so transition plays
    void target.offsetHeight;
    target.classList.add('active');

    this.currentView = viewName;
  }
}
```

---

## 7. Quiz Content

### The 5 Personality Types

#### 🏗️ The Architect (`architect`)

- **Emoji:** 🏗️
- **Title:** The Architect
- **Description:** You think in systems. Before writing a single line of code, you've already mapped out the data flow, the edge cases, and the deployment strategy. Your projects have clear folder structures, meaningful variable names, and documentation that actually makes sense. You believe the best code is the code you planned before you wrote it.
- **Traits:**
  1. Systems thinker — sees the big picture first
  2. Loves clean architecture and design patterns
  3. Plans thoroughly before coding
  4. Whiteboard enthusiast and diagram lover
  5. Designs for scale from day one

#### 🎨 The Creative (`creative`)

- **Emoji:** 🎨
- **Title:** The Creative
- **Description:** Code is your canvas. You're drawn to the visual and interactive side of development — CSS animations, UI polish, and making things feel alive. You'd rather spend an extra hour perfecting a hover effect than writing backend logic. Your projects might not be the most architecturally pristine, but they always look and feel incredible.
- **Traits:**
  1. Eye for design and aesthetics
  2. Obsessed with CSS animations and transitions
  3. Cares deeply about user experience
  4. Happiest when building interfaces
  5. Turns wireframes into art

#### 🔍 The Debugger (`debugger`)

- **Emoji:** 🔍
- **Title:** The Debugger
- **Description:** While others create the bugs, you live to squash them. You have an uncanny ability to look at broken code and just know where the problem is. Console.log is your weapon of choice, and you find deep satisfaction in making failing tests pass. You're the person everyone calls when nothing works.
- **Traits:**
  1. Patience of a saint with broken code
  2. Console.log detective extraordinaire
  3. Reads error messages like poetry
  4. Finds the needle in the haystack
  5. Thrives under "it's broken, fix it" pressure

#### ⚡ The Full-Stack Hero (`fullstack`)

- **Emoji:** ⚡
- **Title:** The Full-Stack Hero
- **Description:** Frontend? Backend? Databases? DevOps? You do it all and somehow keep it all in your head. You're the Swiss army knife of developers — maybe not the world's best at any one thing, but dangerously competent across the entire stack. You love building complete projects from scratch.
- **Traits:**
  1. Jack of all trades, master of shipping
  2. Comfortable across the entire stack
  3. Loves building projects end-to-end
  4. Adapts quickly to any technology
  5. The go-to person for "how does this work?"

#### 💀 The Hacker (`hacker`)

- **Emoji:** 💀
- **Title:** The Hacker
- **Description:** You don't follow the rules — you bend them. Your code might look unconventional, but it works, and it works fast. You love shortcuts, clever one-liners, and finding creative workarounds. Hackathons are your natural habitat. Ship first, refactor never (well... maybe later).
- **Traits:**
  1. Moves fast and ships things
  2. Loves clever shortcuts and one-liners
  3. Hackathon champion energy
  4. Breaks things to understand them
  5. "It works on my machine" is a valid argument

---

### The 10 Questions

Each answer distributes points across the 5 types. Points per answer always total 10 to keep scoring balanced.

#### Question 1

**"You're starting a brand new project. What's the very first thing you do?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Plan the full architecture on paper first | 6 | 0 | 1 | 2 | 1 |
| B | Sketch the UI and pick a colour palette | 0 | 7 | 0 | 2 | 1 |
| C | Set up the repo, CI/CD, and folder structure immediately | 3 | 0 | 1 | 5 | 1 |
| D | Just start coding and figure it out as I go | 0 | 1 | 1 | 1 | 7 |

#### Question 2

**"Your code is throwing a weird error. What do you do?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Read the full error stack trace line by line | 2 | 0 | 7 | 1 | 0 |
| B | Add console.log statements everywhere | 0 | 0 | 5 | 1 | 4 |
| C | Refactor the whole section — the error means the design was wrong | 6 | 1 | 1 | 2 | 0 |
| D | Google the error and paste the first Stack Overflow solution | 0 | 0 | 2 | 2 | 6 |

#### Question 3

**"What part of a project excites you the most?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Designing the system architecture and data models | 7 | 0 | 1 | 2 | 0 |
| B | Making the UI beautiful and interactive | 0 | 7 | 0 | 2 | 1 |
| C | Making everything work together end-to-end | 1 | 1 | 1 | 6 | 1 |
| D | Getting a working prototype out as fast as possible | 0 | 0 | 1 | 1 | 8 |

#### Question 4

**"How do you feel about writing documentation?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Love it — good docs are as important as good code | 7 | 1 | 1 | 1 | 0 |
| B | I'll write a nice README with screenshots | 2 | 6 | 0 | 2 | 0 |
| C | I document the tricky parts and known issues | 1 | 0 | 6 | 2 | 1 |
| D | The code is the documentation | 0 | 0 | 1 | 1 | 8 |

#### Question 5

**"Pick your ideal weekend coding project:"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | A beautifully animated personal portfolio site | 0 | 8 | 0 | 1 | 1 |
| B | A full-stack app with auth, database, and deployment | 2 | 0 | 0 | 7 | 1 |
| C | A script that automates something annoying in your life | 1 | 0 | 2 | 1 | 6 |
| D | Refactoring an open-source project to be cleaner | 6 | 0 | 3 | 1 | 0 |

#### Question 6

**"A teammate's code has a bug. How do you approach it?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Step through it mentally, predicting the flow | 4 | 0 | 5 | 1 | 0 |
| B | Open DevTools and start inspecting everything | 0 | 2 | 5 | 1 | 2 |
| C | Rewrite the function from scratch — faster than fixing | 1 | 0 | 0 | 2 | 7 |
| D | Check the tests first, write one that reproduces the bug | 3 | 0 | 4 | 3 | 0 |

#### Question 7

**"What's your reaction to learning a brand new framework?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Read the full documentation before writing any code | 7 | 0 | 2 | 1 | 0 |
| B | Follow a tutorial and build a small demo | 1 | 2 | 1 | 5 | 1 |
| C | Skip the docs — just start building and learn by doing | 0 | 1 | 0 | 1 | 8 |
| D | Check what UI components and styling options it offers | 0 | 7 | 1 | 2 | 0 |

#### Question 8

**"Which of these bothers you the most in a codebase?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Inconsistent naming conventions and messy structure | 7 | 1 | 1 | 1 | 0 |
| B | Ugly UI with no attention to spacing or colour | 0 | 8 | 0 | 1 | 1 |
| C | Unhandled errors and missing edge cases | 1 | 0 | 7 | 1 | 1 |
| D | Overengineered code that could be 10× simpler | 1 | 0 | 1 | 2 | 6 |

#### Question 9

**"You have 24 hours in a hackathon. What's your strategy?"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Spend the first few hours planning, then execute cleanly | 7 | 0 | 1 | 1 | 1 |
| B | Build the flashiest demo possible — judges love visuals | 0 | 7 | 0 | 1 | 2 |
| C | Go for a complete, working product with all features connected | 1 | 0 | 1 | 7 | 1 |
| D | Hack together a prototype in 3 hours, then polish | 0 | 1 | 1 | 1 | 7 |

#### Question 10

**"If coding were a superpower, yours would be:"**

| Option | Text | architect | creative | debugger | fullstack | hacker |
|---|---|---|---|---|---|---|
| A | Seeing the entire system in your head before it exists | 8 | 0 | 1 | 1 | 0 |
| B | Making anything look and feel amazing | 0 | 8 | 0 | 1 | 1 |
| C | Finding the one broken line in 10,000 lines of code | 0 | 0 | 8 | 1 | 1 |
| D | Building a working app in any language in one afternoon | 1 | 0 | 0 | 5 | 4 |

### `questions.js` — Full Data Export

```javascript
export const questions = [
  {
    question: "You're starting a brand new project. What's the very first thing you do?",
    answers: [
      { text: "Plan the full architecture on paper first", weights: { architect: 6, creative: 0, debugger: 1, fullstack: 2, hacker: 1 } },
      { text: "Sketch the UI and pick a colour palette", weights: { architect: 0, creative: 7, debugger: 0, fullstack: 2, hacker: 1 } },
      { text: "Set up the repo, CI/CD, and folder structure immediately", weights: { architect: 3, creative: 0, debugger: 1, fullstack: 5, hacker: 1 } },
      { text: "Just start coding and figure it out as I go", weights: { architect: 0, creative: 1, debugger: 1, fullstack: 1, hacker: 7 } },
    ],
  },
  {
    question: "Your code is throwing a weird error. What do you do?",
    answers: [
      { text: "Read the full error stack trace line by line", weights: { architect: 2, creative: 0, debugger: 7, fullstack: 1, hacker: 0 } },
      { text: "Add console.log statements everywhere", weights: { architect: 0, creative: 0, debugger: 5, fullstack: 1, hacker: 4 } },
      { text: "Refactor the whole section — the error means the design was wrong", weights: { architect: 6, creative: 1, debugger: 1, fullstack: 2, hacker: 0 } },
      { text: "Google the error and paste the first Stack Overflow solution", weights: { architect: 0, creative: 0, debugger: 2, fullstack: 2, hacker: 6 } },
    ],
  },
  {
    question: "What part of a project excites you the most?",
    answers: [
      { text: "Designing the system architecture and data models", weights: { architect: 7, creative: 0, debugger: 1, fullstack: 2, hacker: 0 } },
      { text: "Making the UI beautiful and interactive", weights: { architect: 0, creative: 7, debugger: 0, fullstack: 2, hacker: 1 } },
      { text: "Making everything work together end-to-end", weights: { architect: 1, creative: 1, debugger: 1, fullstack: 6, hacker: 1 } },
      { text: "Getting a working prototype out as fast as possible", weights: { architect: 0, creative: 0, debugger: 1, fullstack: 1, hacker: 8 } },
    ],
  },
  {
    question: "How do you feel about writing documentation?",
    answers: [
      { text: "Love it — good docs are as important as good code", weights: { architect: 7, creative: 1, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: "I'll write a nice README with screenshots", weights: { architect: 2, creative: 6, debugger: 0, fullstack: 2, hacker: 0 } },
      { text: "I document the tricky parts and known issues", weights: { architect: 1, creative: 0, debugger: 6, fullstack: 2, hacker: 1 } },
      { text: "The code is the documentation", weights: { architect: 0, creative: 0, debugger: 1, fullstack: 1, hacker: 8 } },
    ],
  },
  {
    question: "Pick your ideal weekend coding project:",
    answers: [
      { text: "A beautifully animated personal portfolio site", weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: "A full-stack app with auth, database, and deployment", weights: { architect: 2, creative: 0, debugger: 0, fullstack: 7, hacker: 1 } },
      { text: "A script that automates something annoying in your life", weights: { architect: 1, creative: 0, debugger: 2, fullstack: 1, hacker: 6 } },
      { text: "Refactoring an open-source project to be cleaner", weights: { architect: 6, creative: 0, debugger: 3, fullstack: 1, hacker: 0 } },
    ],
  },
  {
    question: "A teammate's code has a bug. How do you approach it?",
    answers: [
      { text: "Step through it mentally, predicting the flow", weights: { architect: 4, creative: 0, debugger: 5, fullstack: 1, hacker: 0 } },
      { text: "Open DevTools and start inspecting everything", weights: { architect: 0, creative: 2, debugger: 5, fullstack: 1, hacker: 2 } },
      { text: "Rewrite the function from scratch — faster than fixing", weights: { architect: 1, creative: 0, debugger: 0, fullstack: 2, hacker: 7 } },
      { text: "Check the tests first, write one that reproduces the bug", weights: { architect: 3, creative: 0, debugger: 4, fullstack: 3, hacker: 0 } },
    ],
  },
  {
    question: "What's your reaction to learning a brand new framework?",
    answers: [
      { text: "Read the full documentation before writing any code", weights: { architect: 7, creative: 0, debugger: 2, fullstack: 1, hacker: 0 } },
      { text: "Follow a tutorial and build a small demo", weights: { architect: 1, creative: 2, debugger: 1, fullstack: 5, hacker: 1 } },
      { text: "Skip the docs — just start building and learn by doing", weights: { architect: 0, creative: 1, debugger: 0, fullstack: 1, hacker: 8 } },
      { text: "Check what UI components and styling options it offers", weights: { architect: 0, creative: 7, debugger: 1, fullstack: 2, hacker: 0 } },
    ],
  },
  {
    question: "Which of these bothers you the most in a codebase?",
    answers: [
      { text: "Inconsistent naming conventions and messy structure", weights: { architect: 7, creative: 1, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: "Ugly UI with no attention to spacing or colour", weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: "Unhandled errors and missing edge cases", weights: { architect: 1, creative: 0, debugger: 7, fullstack: 1, hacker: 1 } },
      { text: "Overengineered code that could be 10× simpler", weights: { architect: 1, creative: 0, debugger: 1, fullstack: 2, hacker: 6 } },
    ],
  },
  {
    question: "You have 24 hours in a hackathon. What's your strategy?",
    answers: [
      { text: "Spend the first few hours planning, then execute cleanly", weights: { architect: 7, creative: 0, debugger: 1, fullstack: 1, hacker: 1 } },
      { text: "Build the flashiest demo possible — judges love visuals", weights: { architect: 0, creative: 7, debugger: 0, fullstack: 1, hacker: 2 } },
      { text: "Go for a complete, working product with all features connected", weights: { architect: 1, creative: 0, debugger: 1, fullstack: 7, hacker: 1 } },
      { text: "Hack together a prototype in 3 hours, then polish", weights: { architect: 0, creative: 1, debugger: 1, fullstack: 1, hacker: 7 } },
    ],
  },
  {
    question: "If coding were a superpower, yours would be:",
    answers: [
      { text: "Seeing the entire system in your head before it exists", weights: { architect: 8, creative: 0, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: "Making anything look and feel amazing", weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: "Finding the one broken line in 10,000 lines of code", weights: { architect: 0, creative: 0, debugger: 8, fullstack: 1, hacker: 1 } },
      { text: "Building a working app in any language in one afternoon", weights: { architect: 1, creative: 0, debugger: 0, fullstack: 5, hacker: 4 } },
    ],
  },
];
```

### `results.js` — Full Data Export

```javascript
const personalityTypes = {
  architect: {
    key: 'architect',
    emoji: '🏗️',
    title: 'The Architect',
    description: "You think in systems. Before writing a single line of code, you've already mapped out the data flow, the edge cases, and the deployment strategy. Your projects have clear folder structures, meaningful variable names, and documentation that actually makes sense. You believe the best code is the code you planned before you wrote it.",
    traits: [
      'Systems thinker — sees the big picture first',
      'Loves clean architecture and design patterns',
      'Plans thoroughly before coding',
      'Whiteboard enthusiast and diagram lover',
      'Designs for scale from day one',
    ],
  },
  creative: {
    key: 'creative',
    emoji: '🎨',
    title: 'The Creative',
    description: "Code is your canvas. You're drawn to the visual and interactive side of development — CSS animations, UI polish, and making things feel alive. You'd rather spend an extra hour perfecting a hover effect than writing backend logic. Your projects might not be the most architecturally pristine, but they always look and feel incredible.",
    traits: [
      'Eye for design and aesthetics',
      'Obsessed with CSS animations and transitions',
      'Cares deeply about user experience',
      'Happiest when building interfaces',
      'Turns wireframes into art',
    ],
  },
  debugger: {
    key: 'debugger',
    emoji: '🔍',
    title: 'The Debugger',
    description: "While others create the bugs, you live to squash them. You have an uncanny ability to look at broken code and just know where the problem is. Console.log is your weapon of choice, and you find deep satisfaction in making failing tests pass. You're the person everyone calls when nothing works.",
    traits: [
      'Patience of a saint with broken code',
      'Console.log detective extraordinaire',
      'Reads error messages like poetry',
      'Finds the needle in the haystack',
      'Thrives under "it\'s broken, fix it" pressure',
    ],
  },
  fullstack: {
    key: 'fullstack',
    emoji: '⚡',
    title: 'The Full-Stack Hero',
    description: "Frontend? Backend? Databases? DevOps? You do it all and somehow keep it all in your head. You're the Swiss army knife of developers — maybe not the world's best at any one thing, but dangerously competent across the entire stack. You love building complete projects from scratch.",
    traits: [
      'Jack of all trades, master of shipping',
      'Comfortable across the entire stack',
      'Loves building projects end-to-end',
      'Adapts quickly to any technology',
      'The go-to person for "how does this work?"',
    ],
  },
  hacker: {
    key: 'hacker',
    emoji: '💀',
    title: 'The Hacker',
    description: "You don't follow the rules — you bend them. Your code might look unconventional, but it works, and it works fast. You love shortcuts, clever one-liners, and finding creative workarounds. Hackathons are your natural habitat. Ship first, refactor never (well... maybe later).",
    traits: [
      'Moves fast and ships things',
      'Loves clever shortcuts and one-liners',
      'Hackathon champion energy',
      'Breaks things to understand them',
      '"It works on my machine" is a valid argument',
    ],
  },
};

// Tie-breaking priority order (if two types are tied, the one earlier in this list wins)
const PRIORITY_ORDER = ['architect', 'creative', 'debugger', 'fullstack', 'hacker'];

export function getResult(scores) {
  const sorted = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return PRIORITY_ORDER.indexOf(a[0]) - PRIORITY_ORDER.indexOf(b[0]);
  });
  return personalityTypes[sorted[0][0]];
}
```

---

## 8. Scoring Algorithm

### How Weighted Scoring Works

1. **Initialisation:** When the quiz starts, a scores object is created with all types at `0`:
   ```javascript
   { architect: 0, creative: 0, debugger: 0, fullstack: 0, hacker: 0 }
   ```

2. **Each answer distributes exactly 10 points** across the 5 personality types. This ensures fairness — every answer carries equal total weight, but distributes it differently.

3. **Primary answers** (the answer most aligned with a type) give **6-8 points** to that type and scatter 2-4 points among others.

4. **Secondary answers** give a moderate amount (4-5 points) to a main type with more balanced distribution.

5. **After 10 questions**, each user has accumulated exactly **100 total points** (10 questions × 10 points per answer), distributed across the 5 types.

### Score Range Analysis

| Scenario | Dominant Type Score | Description |
|---|---|---|
| Very strong match | 60-80 | User consistently picked one type's answers |
| Strong match | 40-59 | Clear leaning with some variety |
| Moderate match | 25-39 | Mixed preferences, slight lean |
| Close call | 20-24 | Nearly tied — tie-breaker applies |

### Tie-Breaking

When two or more types share the highest score:

1. **Sort by score** descending.
2. **If scores are equal**, sort by priority order: `architect > creative > debugger > fullstack > hacker`.
3. The first type in the sorted list wins.

This priority order is arbitrary but ensures deterministic results. It slightly favours more "methodical" types in ambiguous cases, which feels appropriate for a coding personality quiz.

### Example Walkthrough

A user who picks: A, A, C, B, B, D, B, A, C, D

```
Q1-A:  architect +6, creative +0, debugger +1, fullstack +2, hacker +1
Q2-A:  architect +2, creative +0, debugger +7, fullstack +1, hacker +0
Q3-C:  architect +1, creative +1, debugger +1, fullstack +6, hacker +1
Q4-B:  architect +2, creative +6, debugger +0, fullstack +2, hacker +0
Q5-B:  architect +2, creative +0, debugger +0, fullstack +7, hacker +1
Q6-D:  architect +3, creative +0, debugger +4, fullstack +3, hacker +0
Q7-B:  architect +1, creative +2, debugger +1, fullstack +5, hacker +1
Q8-A:  architect +7, creative +1, debugger +1, fullstack +1, hacker +0
Q9-C:  architect +1, creative +0, debugger +1, fullstack +7, hacker +1
Q10-D: architect +1, creative +0, debugger +0, fullstack +5, hacker +4

TOTALS:
  architect: 26
  creative:  10
  debugger:  16
  fullstack: 39  ← WINNER
  hacker:     9

Result: ⚡ The Full-Stack Hero
```

---

## 9. Accessibility & State Management

### Accessibility Requirements

#### Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Move focus between answer cards |
| `1` / `2` / `3` / `4` | Select answer A / B / C / D directly |
| `Enter` / `Space` | Activate the focused answer card |

#### ARIA Implementation

- **Progress bar**: `role="progressbar"`, `aria-valuenow` updated dynamically, `aria-valuemin="0"`, `aria-valuemax="100"`
- **Answer cards**: `role="radio"` inside `role="radiogroup"`, `aria-checked="true"` on selected card
- **View transitions**: `aria-live="polite"` on progress text for screen reader announcements
- **Hidden views**: `hidden` attribute on inactive views (removes from accessibility tree)
- **Decorative emojis**: `aria-hidden="true"` on all emoji `<span>` elements
- **Sections**: `aria-label` on each view section

#### Focus Management

- When a new question renders, focus moves to the first answer card
- When the result screen appears, focus moves to the result title
- When retake is clicked and intro loads, focus moves to the Start button
- Use `element.focus()` after view transitions complete (after animation delay)

#### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Colour Contrast

All text-on-background combinations meet WCAG AA contrast ratio (≥4.5:1 for body, ≥3:1 for large text):

- `--color-text-primary` (#e8e8f0) on `--color-bg-primary` (#0f0f1a) → ~14:1
- `--color-text-secondary` (#a0a0b8) on `--color-bg-primary` (#0f0f1a) → ~7:1
- Button text (#fff) on `--color-button-primary` (#6c63ff) → ~4.6:1

### State Management

All quiz state is held in-memory in the `Quiz` class instance. No persistence to `localStorage` or session storage (not needed for this single-session quiz).

#### State Shape

```javascript
// Quiz class internal state
{
  questions: Question[],      // Immutable reference to question bank
  currentIndex: number,       // 0-based index of current question (0–9)
  scores: {                   // Running score totals
    architect: number,
    creative: number,
    debugger: number,
    fullstack: number,
    hacker: number,
  },
}
```

#### State Transitions

```
INIT (DOMContentLoaded)
  ├── quiz.reset() → scores zeroed, index = 0
  └── router.showView('intro')

START QUIZ (btn-start click)
  ├── quiz.reset() → ensures clean state
  ├── ui.renderQuestion(0)
  ├── ui.updateProgress(0%)
  └── router.showView('quiz')

SELECT ANSWER (card click or key 1-4)
  ├── ui.selectAnswer(index) → visual feedback, lock cards
  ├── quiz.submitAnswer(index) → add weights to scores
  ├── IF quiz.isComplete():
  │     ├── ui.updateProgress(100)
  │     ├── 800ms delay
  │     ├── getResult(scores) → determine winner
  │     ├── ui.showResult(result)
  │     └── router.showView('result')
  └── ELSE:
        ├── quiz.advance() → currentIndex++
        ├── 600ms delay (visual feedback)
        ├── ui.renderQuestion(next)
        └── ui.updateProgress(new %)

RETAKE (btn-retake click)
  ├── quiz.reset() → scores zeroed, index = 0
  └── router.showView('intro')
```

---

## 10. Implementation Checklist

### Phase 1: Project Setup

- [ ] Create `personality-quiz/index.html` with full HTML structure (Section 4)
- [ ] Create `personality-quiz/styles/main.css` with CSS variables (Section 3)
- [ ] Create `personality-quiz/js/main.js` entry point
- [ ] Create `personality-quiz/js/modules/` directory
- [ ] Create all 5 module files (empty exports)

### Phase 2: Data Layer

- [ ] Implement `js/modules/questions.js` with all 10 questions and weights (Section 7)
- [ ] Implement `js/modules/results.js` with all 5 personality types and `getResult()` (Section 7)
- [ ] Verify all answer weights sum to 10 per answer

### Phase 3: Core Logic

- [ ] Implement `js/modules/quiz.js` — `Quiz` class with `reset()`, `submitAnswer()`, `advance()`, `isComplete()`, `getProgress()`, `getScores()` (Section 6)
- [ ] Implement `js/modules/router.js` — `Router` class with `showView()` (Section 6)

### Phase 4: UI Rendering

- [ ] Implement `js/modules/ui.js` — DOM caching, `renderQuestion()`, `selectAnswer()`, `updateProgress()`, `showResult()` (Section 6)
- [ ] Wire up event listeners in `main.js` (start, answer, retake, keyboard)
- [ ] Test full quiz flow: intro → 10 questions → result → retake

### Phase 5: Styling

- [ ] Base layout styles (app container, centring, spacing)
- [ ] Intro screen styles (emoji, title, button, meta list)
- [ ] Quiz question view styles (counter, progress bar track/fill, question text)
- [ ] Answer card grid (2×2 desktop, stacked mobile)
- [ ] Answer card states (default, hover, focus, selected, locked)
- [ ] Result screen styles (emoji large, title, description, traits list)
- [ ] Personality accent colours via `data-personality` attribute

### Phase 6: Animations

- [ ] View transitions (fade + slide between intro/quiz/result) (Section 5)
- [ ] Progress bar fill animation (smooth width transition)
- [ ] Question enter animation (slide from right)
- [ ] Answer card select animation (scale + glow)
- [ ] Result emoji reveal (scale bounce keyframes)
- [ ] Result title/description staggered fade-in
- [ ] Traits list staggered entrance (100ms offset per item)
- [ ] Retake button delayed appearance
- [ ] `prefers-reduced-motion` respect

### Phase 7: Accessibility

- [ ] Keyboard shortcuts (1-4 keys, Tab, Enter)
- [ ] Focus management (move focus on view change)
- [ ] ARIA attributes (progressbar, radiogroup, radio, aria-checked, aria-live)
- [ ] Colour contrast verification
- [ ] Screen reader testing with VoiceOver

### Phase 8: Polish & Testing

- [ ] Test all 5 result paths (force each personality type)
- [ ] Test tie-breaking (verify deterministic results)
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Cross-browser test (Chrome, Firefox, Safari)
- [ ] Verify no console errors
- [ ] Write `README.md` with project description and features
