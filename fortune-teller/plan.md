# Fortune Teller — Magic 8-Ball: Implementation Plan

---

## 1. Overview

### What It Is

A mystical Magic 8-Ball web application built with vanilla HTML5, CSS3, and JavaScript (ES modules). The user thinks of a yes-or-no question, then clicks/taps the 8-Ball (or physically shakes their mobile device) to trigger a shake animation and particle burst, revealing a random cryptic response inside the classic blue triangle window.

### User Flow — Step by Step

1. **Page loads** — The user sees a full-screen dark, starry background with a large 3D-styled Magic 8-Ball centred on screen. A soft ambient glow pulses around the ball. A text prompt reads "Think of a yes-or-no question…" above the ball.
2. **User types a question (optional)** — An input field below the ball lets the user type their question. This is optional — the ball works without typing anything.
3. **User triggers a shake** — The user either:
   - Clicks/taps the 8-Ball directly, OR
   - Clicks the "Shake" button below the input, OR
   - Physically shakes their mobile device (DeviceMotion API).
4. **Shake animation plays** — The ball wobbles with a CSS keyframe animation (rotation, translation, scale pulses). The ambient glow intensifies. The triangle window shows a swirling "consulting the spirits…" state.
5. **Particle burst fires** — As the shake ends, a burst of mystical particles (small glowing circles in purples, blues, and golds) radiates outward from the ball's centre.
6. **Response revealed** — The answer fades into the blue triangle window inside the ball. The text scales up gently for dramatic effect.
7. **Cooldown period** — A short 2-second cooldown prevents spamming. The ball dims slightly and the button is disabled.
8. **Ready for next question** — The glow returns to its idle pulse, the input clears, and the user can ask again.

---

## 2. Page Layout

### ASCII Wireframe — Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────┐
│                     FORTUNE TELLER                      │
│               ✦ Ask the Magic 8-Ball ✦                  │
│                                                         │
│              "Think of a yes-or-no question…"           │
│                                                         │
│                    ┌───────────┐                         │
│                   /             \                        │
│                  /    ┌─────┐    \                       │
│                 │     │ ▲   │     │   ← Blue triangle   │
│                 │     │     │     │     answer window    │
│                 │     │REPLY│     │                      │
│                 │     └─────┘     │                      │
│                  \               /                       │
│                   \             /                        │
│                    └───────────┘                         │
│                     Magic 8-Ball                        │
│                                                         │
│         ┌──────────────────────────────────┐            │
│         │  Type your question here…        │            │
│         └──────────────────────────────────┘            │
│                                                         │
│                   [ 🔮 Shake ]                          │
│                                                         │
│         ─────────────────────────────────               │
│         Tip: You can also shake your phone!             │
│                                                         │
│                     © 2026                              │
└─────────────────────────────────────────────────────────┘
```

### ASCII Wireframe — Mobile (< 768px)

```
┌───────────────────────────┐
│      FORTUNE TELLER       │
│   ✦ Ask the 8-Ball ✦     │
│                           │
│  "Think of a question…"   │
│                           │
│       ┌─────────┐         │
│      /           \        │
│     /   ┌─────┐   \      │
│    │    │  ▲  │    │      │
│    │    │REPLY│    │      │
│    │    └─────┘    │      │
│     \             /       │
│      \           /        │
│       └─────────┘         │
│                           │
│  ┌───────────────────┐    │
│  │  Your question…   │    │
│  └───────────────────┘    │
│                           │
│       [ 🔮 Shake ]       │
│                           │
│  Shake your phone to ask! │
│                           │
│          © 2026           │
└───────────────────────────┘
```

### Responsive Behaviour

| Breakpoint       | Behaviour                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------- |
| ≥ 1024px         | Ball is 320×320px. Question input is 480px wide. Generous vertical spacing.                   |
| 768px – 1023px   | Ball shrinks to 260×260px. Input stretches to 90% container width.                            |
| < 768px          | Ball shrinks to 200×200px. Full-width input. Title font shrinks. Tip text about shaking shown.|
| < 400px          | Ball 160×160px. Triangle text shrinks to 0.75rem. Minimal padding.                            |

---

## 3. Colour Scheme & Typography

### Visual Style

Deep, dark, mystical aesthetic — midnight purples, blacks, and cosmic blues with accents of gold and electric violet. Inspired by fortune-telling parlours, crystal balls, and starry night skies.

### Colour Palette

| CSS Variable                | Hex       | Usage                                          |
| --------------------------- | --------- | ---------------------------------------------- |
| `--clr-bg-primary`         | `#0a0a14` | Page background (near-black with blue tint)     |
| `--clr-bg-secondary`       | `#12121f` | Card/container backgrounds                      |
| `--clr-ball-dark`          | `#1a1a2e` | 8-Ball main body colour (dark navy)             |
| `--clr-ball-highlight`     | `#2a2a4a` | 8-Ball gradient highlight (lighter navy)        |
| `--clr-ball-shine`         | `#4a4a6a` | 8-Ball specular shine spot                      |
| `--clr-triangle`           | `#1a3a6e` | Triangle answer window background (deep blue)   |
| `--clr-triangle-border`    | `#2a5aae` | Triangle border glow                            |
| `--clr-text-primary`       | `#e8e0f0` | Main text (soft lavender white)                 |
| `--clr-text-secondary`     | `#9a8cb8` | Secondary/hint text (muted purple)              |
| `--clr-text-answer`        | `#ffffff` | Answer text inside triangle (pure white)        |
| `--clr-accent-purple`      | `#8b5cf6` | Primary accent — buttons, glows                 |
| `--clr-accent-gold`        | `#f5c542` | Gold sparkle accent — particles, stars          |
| `--clr-accent-violet`      | `#a855f7` | Secondary accent — hover states, particle trail |
| `--clr-accent-blue`        | `#3b82f6` | Tertiary accent — links, focus rings            |
| `--clr-glow`               | `#7c3aed` | Ambient glow around the ball                    |
| `--clr-glow-intense`       | `#a78bfa` | Intensified glow during shake                   |
| `--clr-particle-1`         | `#c084fc` | Particle colour 1 (light purple)                |
| `--clr-particle-2`         | `#818cf8` | Particle colour 2 (indigo)                      |
| `--clr-particle-3`         | `#f5c542` | Particle colour 3 (gold)                        |
| `--clr-particle-4`         | `#f472b6` | Particle colour 4 (pink)                        |
| `--clr-button-bg`          | `#6d28d9` | Shake button background                         |
| `--clr-button-hover`       | `#7c3aed` | Shake button hover state                        |
| `--clr-button-disabled`    | `#3b3b5c` | Shake button disabled state (cooldown)          |
| `--clr-input-bg`           | `#1e1e36` | Question input background                       |
| `--clr-input-border`       | `#3b3b5c` | Question input border                           |
| `--clr-input-focus`        | `#8b5cf6` | Question input focus ring                       |

### CSS Variable Declaration

```css
:root {
  /* Backgrounds */
  --clr-bg-primary: #0a0a14;
  --clr-bg-secondary: #12121f;

  /* 8-Ball */
  --clr-ball-dark: #1a1a2e;
  --clr-ball-highlight: #2a2a4a;
  --clr-ball-shine: #4a4a6a;

  /* Triangle */
  --clr-triangle: #1a3a6e;
  --clr-triangle-border: #2a5aae;

  /* Text */
  --clr-text-primary: #e8e0f0;
  --clr-text-secondary: #9a8cb8;
  --clr-text-answer: #ffffff;

  /* Accents */
  --clr-accent-purple: #8b5cf6;
  --clr-accent-gold: #f5c542;
  --clr-accent-violet: #a855f7;
  --clr-accent-blue: #3b82f6;

  /* Glows */
  --clr-glow: #7c3aed;
  --clr-glow-intense: #a78bfa;

  /* Particles */
  --clr-particle-1: #c084fc;
  --clr-particle-2: #818cf8;
  --clr-particle-3: #f5c542;
  --clr-particle-4: #f472b6;

  /* Button */
  --clr-button-bg: #6d28d9;
  --clr-button-hover: #7c3aed;
  --clr-button-disabled: #3b3b5c;

  /* Input */
  --clr-input-bg: #1e1e36;
  --clr-input-border: #3b3b5c;
  --clr-input-focus: #8b5cf6;

  /* Typography */
  --font-display: 'Cinzel Decorative', serif;
  --font-body: 'Quicksand', sans-serif;
  --font-answer: 'Cinzel', serif;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 3rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 600ms ease;
}
```

### Typography

| Role             | Font Family                         | Weight | Size (desktop)   | Size (mobile)   | Usage                              |
| ---------------- | ----------------------------------- | ------ | ---------------- | --------------- | ---------------------------------- |
| Display / Title  | `Cinzel Decorative` (Google Fonts)  | 700    | 2.5rem           | 1.5rem          | Page title "Fortune Teller"        |
| Subtitle         | `Cinzel Decorative` (Google Fonts)  | 400    | 1.25rem          | 1rem            | Subtitle "Ask the Magic 8-Ball"    |
| Body text        | `Quicksand` (Google Fonts)          | 400    | 1rem             | 0.875rem        | Instructions, tips, labels         |
| Answer text      | `Cinzel` (Google Fonts)             | 700    | 1rem             | 0.75rem         | Fortune text inside triangle       |
| Button text      | `Quicksand` (Google Fonts)          | 600    | 1.125rem         | 1rem            | Shake button label                 |
| Input text       | `Quicksand` (Google Fonts)          | 400    | 1rem             | 0.875rem        | Question input field               |

### Google Fonts Link

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Mystical Magic 8-Ball fortune teller — shake to reveal your destiny.">
  <title>Fortune Teller — Magic 8-Ball</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- Particle canvas layer (behind everything) -->
  <canvas id="particle-canvas" aria-hidden="true"></canvas>

  <main class="app" role="main">

    <!-- Header / Title -->
    <header class="app__header">
      <h1 class="app__title">Fortune Teller</h1>
      <p class="app__subtitle">✦ Ask the Magic 8-Ball ✦</p>
    </header>

    <!-- Instruction prompt -->
    <p class="app__prompt" id="prompt-text">Think of a yes-or-no question…</p>

    <!-- 8-Ball visual -->
    <section class="ball-container" aria-label="Magic 8-Ball">
      <div class="ball" id="magic-ball" role="button" tabindex="0"
           aria-label="Magic 8-Ball — click or press Enter to shake">

        <!-- Ambient glow ring (behind ball) -->
        <div class="ball__glow" id="ball-glow" aria-hidden="true"></div>

        <!-- Ball body -->
        <div class="ball__body">
          <!-- Specular shine -->
          <div class="ball__shine" aria-hidden="true"></div>

          <!-- Number 8 on top half -->
          <span class="ball__eight" aria-hidden="true">8</span>

          <!-- Answer window (circle containing triangle) -->
          <div class="ball__window">
            <div class="ball__triangle" id="answer-triangle">
              <p class="ball__answer" id="answer-text" aria-live="polite" aria-atomic="true"></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Question input -->
    <section class="question-section" aria-label="Ask your question">
      <label for="question-input" class="sr-only">Type your question</label>
      <input
        type="text"
        id="question-input"
        class="question-section__input"
        placeholder="Type your question here…"
        maxlength="200"
        autocomplete="off"
      >
    </section>

    <!-- Shake button -->
    <section class="action-section">
      <button
        type="button"
        id="shake-btn"
        class="shake-btn"
        aria-label="Shake the Magic 8-Ball"
      >
        🔮 Shake
      </button>
    </section>

    <!-- Tip -->
    <p class="app__tip" id="tip-text">
      <span class="app__tip-icon" aria-hidden="true">📱</span>
      You can also shake your phone!
    </p>

  </main>

  <!-- Footer -->
  <footer class="app__footer">
    <p>&copy; 2026 Fortune Teller</p>
  </footer>

  <!-- JavaScript (ES module) -->
  <script type="module" src="js/main.js"></script>

</body>
</html>
```

### Accessibility Notes

- `aria-live="polite"` on the answer text so screen readers announce new fortunes.
- `aria-atomic="true"` ensures the whole answer is read, not just the change.
- The ball has `role="button"` and `tabindex="0"` so keyboard users can press Enter/Space to shake.
- `sr-only` class hides the input label visually but keeps it available for assistive tech.
- `aria-hidden="true"` on decorative elements (glow, shine, canvas, "8" text).
- Semantic `<header>`, `<main>`, `<section>`, `<footer>` structure.
- All paths are relative — `styles/main.css`, `js/main.js`.

---

## 5. CSS Architecture

### File: `styles/main.css`

### 5.1 Reset & Base

```css
/* --- Reset --- */
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
  font-family: var(--font-body);
  background-color: var(--clr-bg-primary);
  color: var(--clr-text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  position: relative;
}

/* Screen-reader only utility */
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

### 5.2 Particle Canvas

```css
#particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
```

### 5.3 App Layout

```css
.app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: var(--space-lg) var(--space-md);
  flex: 1;
}

.app__header {
  text-align: center;
  margin-bottom: var(--space-md);
}

.app__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  text-shadow: 0 0 20px var(--clr-glow), 0 0 40px var(--clr-accent-purple);
  letter-spacing: 0.05em;
}

.app__subtitle {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.25rem;
  color: var(--clr-text-secondary);
  margin-top: var(--space-xs);
}

.app__prompt {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--clr-text-secondary);
  font-style: italic;
  margin-bottom: var(--space-lg);
  text-align: center;
}

.app__tip {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--clr-text-secondary);
  margin-top: var(--space-lg);
  text-align: center;
}

.app__tip-icon {
  margin-right: var(--space-xs);
}

.app__footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--space-md);
  color: var(--clr-text-secondary);
  font-size: 0.75rem;
}
```

### 5.4 Ball Container & Glow

```css
.ball-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.ball {
  position: relative;
  width: 320px;
  height: 320px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.ball:focus-visible .ball__body {
  outline: 3px solid var(--clr-accent-blue);
  outline-offset: 8px;
  border-radius: 50%;
}

/* Ambient glow ring behind the ball */
.ball__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, var(--clr-glow) 0%, transparent 70%);
  opacity: 0.4;
  animation: glow-pulse 3s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}

.ball__glow--intense {
  opacity: 0.9;
  animation: glow-pulse-intense 0.3s ease-in-out infinite;
}
```

### 5.5 Ball Body (3D Circle Shape)

```css
.ball__body {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    var(--clr-ball-shine) 0%,
    var(--clr-ball-highlight) 20%,
    var(--clr-ball-dark) 60%,
    #0d0d1a 100%
  );
  box-shadow:
    inset 0 -8px 20px rgba(0, 0, 0, 0.6),
    0 8px 30px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(124, 58, 237, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform var(--transition-normal);
}

/* Specular shine highlight */
.ball__shine {
  position: absolute;
  top: 12%;
  left: 22%;
  width: 30%;
  height: 20%;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.25) 0%,
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
}

/* Number 8 on the ball */
.ball__eight {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.08);
  pointer-events: none;
  user-select: none;
}
```

### 5.6 Triangle Answer Window

```css
/* Circle window in the centre of the ball */
.ball__window {
  width: 45%;
  height: 45%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--clr-triangle) 0%,
    #0f2a50 100%
  );
  box-shadow:
    inset 0 0 15px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(42, 90, 174, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Triangle shape created with CSS clip-path */
.ball__triangle {
  width: 70%;
  height: 70%;
  background: linear-gradient(
    180deg,
    var(--clr-triangle-border) 0%,
    var(--clr-triangle) 100%
  );
  clip-path: polygon(50% 10%, 5% 90%, 95% 90%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20%;
}

/* Answer text inside the triangle */
.ball__answer {
  font-family: var(--font-answer);
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--clr-text-answer);
  text-align: center;
  line-height: 1.2;
  max-width: 90%;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.ball__answer--visible {
  opacity: 1;
  transform: scale(1);
}

.ball__answer--consulting {
  opacity: 0.5;
  font-style: italic;
  font-size: 0.65rem;
  animation: text-flicker 0.8s ease-in-out infinite;
}
```

### 5.7 Question Input

```css
.question-section {
  width: 100%;
  max-width: 480px;
  margin-bottom: var(--space-md);
}

.question-section__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--clr-text-primary);
  background: var(--clr-input-bg);
  border: 2px solid var(--clr-input-border);
  border-radius: 12px;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.question-section__input::placeholder {
  color: var(--clr-text-secondary);
  opacity: 0.7;
}

.question-section__input:focus {
  border-color: var(--clr-input-focus);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}
```

### 5.8 Shake Button

```css
.shake-btn {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.125rem;
  padding: 0.875rem 2.5rem;
  color: var(--clr-text-answer);
  background: var(--clr-button-bg);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast),
              box-shadow var(--transition-fast);
  box-shadow: 0 4px 15px rgba(109, 40, 217, 0.4);
}

.shake-btn:hover:not(:disabled) {
  background: var(--clr-button-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
}

.shake-btn:active:not(:disabled) {
  transform: translateY(0);
}

.shake-btn:disabled {
  background: var(--clr-button-disabled);
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.shake-btn:focus-visible {
  outline: 3px solid var(--clr-accent-blue);
  outline-offset: 3px;
}
```

### 5.9 Keyframe Animations

```css
/* Idle ambient glow pulse */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 0.5; transform: translate(-50%, -50%) scale(1.05); }
}

/* Intense glow during shake */
@keyframes glow-pulse-intense {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
  50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.15); }
}

/* Ball shake wobble animation */
@keyframes ball-shake {
  0%   { transform: translate(0, 0) rotate(0deg); }
  10%  { transform: translate(-8px, -6px) rotate(-4deg); }
  20%  { transform: translate(10px, 4px) rotate(3deg); }
  30%  { transform: translate(-12px, 2px) rotate(-5deg); }
  40%  { transform: translate(6px, -8px) rotate(4deg); }
  50%  { transform: translate(-4px, 6px) rotate(-2deg); }
  60%  { transform: translate(8px, -4px) rotate(3deg); }
  70%  { transform: translate(-6px, 8px) rotate(-4deg); }
  80%  { transform: translate(10px, -2px) rotate(2deg); }
  90%  { transform: translate(-4px, 4px) rotate(-1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.ball__body--shaking {
  animation: ball-shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Text flicker while "consulting the spirits" */
@keyframes text-flicker {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.7; }
}

/* Answer text scale-in reveal */
@keyframes answer-reveal {
  0%   { opacity: 0; transform: scale(0.6); }
  60%  { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

.ball__answer--reveal {
  animation: answer-reveal 0.6s ease-out forwards;
}

/* Starfield twinkle for background ambient stars (optional CSS-only) */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 1; }
}
```

### 5.10 Responsive Media Queries

```css
@media (max-width: 1023px) {
  .ball {
    width: 260px;
    height: 260px;
  }
  .question-section {
    max-width: 90%;
  }
}

@media (max-width: 767px) {
  .app__title {
    font-size: 1.5rem;
  }
  .app__subtitle {
    font-size: 1rem;
  }
  .ball {
    width: 200px;
    height: 200px;
  }
  .ball__eight {
    font-size: 2rem;
  }
  .ball__answer {
    font-size: 0.65rem;
  }
  .shake-btn {
    font-size: 1rem;
    padding: 0.75rem 2rem;
  }
}

@media (max-width: 399px) {
  .ball {
    width: 160px;
    height: 160px;
  }
  .ball__answer {
    font-size: 0.55rem;
  }
  .app__title {
    font-size: 1.25rem;
  }
}
```

### 5.11 Complete CSS Class Inventory

| Class Name                       | Element                  | Purpose                                         |
| -------------------------------- | ------------------------ | ----------------------------------------------- |
| `.sr-only`                       | utility                  | Visually hidden, screen-reader accessible        |
| `.app`                           | `<main>`                 | Root layout container                            |
| `.app__header`                   | `<header>`               | Title area wrapper                               |
| `.app__title`                    | `<h1>`                   | Main heading with glow text-shadow               |
| `.app__subtitle`                 | `<p>`                    | Subtitle text under title                        |
| `.app__prompt`                   | `<p>`                    | "Think of a question" instruction                |
| `.app__tip`                      | `<p>`                    | "Shake your phone" tip text                      |
| `.app__tip-icon`                 | `<span>`                 | Phone emoji icon                                 |
| `.app__footer`                   | `<footer>`               | Copyright footer                                 |
| `.ball-container`                | `<section>`              | Centres the ball with relative positioning       |
| `.ball`                          | `<div>`                  | Clickable ball wrapper, sets dimensions          |
| `.ball__glow`                    | `<div>`                  | Radial glow ring behind the ball                 |
| `.ball__glow--intense`           | modifier                 | Intensified glow during shake                    |
| `.ball__body`                    | `<div>`                  | The circular ball with 3D gradient               |
| `.ball__body--shaking`           | modifier                 | Applies the shake keyframe animation             |
| `.ball__shine`                   | `<div>`                  | Specular highlight ellipse                       |
| `.ball__eight`                   | `<span>`                 | Faint numeral "8" on ball                        |
| `.ball__window`                  | `<div>`                  | Circular window in ball centre                   |
| `.ball__triangle`                | `<div>`                  | Triangle via clip-path inside window             |
| `.ball__answer`                  | `<p>`                    | Answer text element                              |
| `.ball__answer--visible`         | modifier                 | Makes answer visible (opacity + scale)           |
| `.ball__answer--consulting`      | modifier                 | Flickering "consulting" state                    |
| `.ball__answer--reveal`          | modifier                 | Scale-in reveal animation on answer show         |
| `.question-section`              | `<section>`              | Wraps the question input                         |
| `.question-section__input`       | `<input>`                | Text input field for question                    |
| `.action-section`                | `<section>`              | Wraps the shake button                           |
| `.shake-btn`                     | `<button>`               | Round shake button with gradient                 |

---

## 6. JavaScript Architecture

### File Structure

```
js/
├── main.js              ← Entry point, imports modules, binds events
└── modules/
    ├── responses.js     ← Response data + random selection logic
    ├── animation.js     ← Shake animation control, class toggling, timing
    └── particles.js     ← Canvas-based particle burst system
```

### 6.1 `js/modules/responses.js`

**Exports:**

| Export                   | Type       | Description                                                |
| ------------------------ | ---------- | ---------------------------------------------------------- |
| `RESPONSES`              | `Object`   | `{ positive: [...], neutral: [...], negative: [...] }`     |
| `getRandomResponse()`   | `Function` | Returns a random response string from the full pool         |
| `getAllResponses()`      | `Function` | Returns a flat array of all responses for debugging         |

**Function Detail — `getRandomResponse()`**

```
1. Flatten all three category arrays into a single array.
2. Generate a random index using Math.floor(Math.random() * array.length).
3. Return the string at that index.
```

- No weighting — equal probability across all responses.
- Stateless — no memory of previous answers (each shake is independent).

### 6.2 `js/modules/animation.js`

**Exports:**

| Export                        | Type       | Description                                                         |
| ----------------------------- | ---------- | ------------------------------------------------------------------- |
| `triggerShake(ballBody, glowEl, answerEl, callback)` | `Function` | Runs the full shake → reveal sequence |
| `resetBall(answerEl)`         | `Function` | Clears answer text and animation classes                            |
| `SHAKE_DURATION`              | `const`    | Duration of shake animation in ms (800)                             |
| `REVEAL_DELAY`                | `const`    | Delay after shake before answer appears in ms (300)                 |
| `COOLDOWN_DURATION`           | `const`    | Total cooldown time before next shake in ms (2000)                  |

**Function Detail — `triggerShake(ballBody, glowEl, answerEl, callback)`**

```
1. Add class `ball__body--shaking` to ballBody.
2. Add class `ball__glow--intense` to glowEl.
3. Set answerEl text to "" and apply `ball__answer--consulting` class.
4. Set answerEl textContent to "Consulting the spirits…"
5. After SHAKE_DURATION (800ms) via setTimeout:
   a. Remove `ball__body--shaking` from ballBody.
   b. Remove `ball__glow--intense` from glowEl.
6. After SHAKE_DURATION + REVEAL_DELAY (1100ms) via setTimeout:
   a. Remove `ball__answer--consulting` from answerEl.
   b. Call callback() — which sets the answer text.
   c. Add `ball__answer--reveal` to answerEl.
7. Return the total animation time (SHAKE_DURATION + REVEAL_DELAY + animation settle).
```

**Function Detail — `resetBall(answerEl)`**

```
1. Remove classes: ball__answer--visible, ball__answer--reveal, ball__answer--consulting.
2. Set answerEl textContent to "".
```

### 6.3 `js/modules/particles.js`

**Exports:**

| Export                          | Type       | Description                                            |
| ------------------------------- | ---------- | ------------------------------------------------------ |
| `initParticleCanvas(canvasEl)` | `Function` | Sets up the canvas context, resize listener, anim loop |
| `emitBurst(x, y)`             | `Function` | Spawns a burst of particles at (x, y) coordinates      |

**Internal State:**

- `particles` — Array of active particle objects.
- `ctx` — Canvas 2D rendering context.
- `animationFrameId` — ID for the requestAnimationFrame loop.

**Particle Object Shape:**

```javascript
{
  x: Number,          // current x position
  y: Number,          // current y position
  vx: Number,         // x velocity (-3 to 3)
  vy: Number,         // y velocity (-3 to 3)
  radius: Number,     // 2 to 6
  color: String,      // one of the 4 particle CSS colours
  alpha: Number,      // 1.0, fading to 0
  decay: Number,      // 0.01 to 0.03 — how fast alpha drops per frame
  life: Number        // frames remaining
}
```

**Function Detail — `initParticleCanvas(canvasEl)`**

```
1. Store reference to canvasEl and get 2D context.
2. Set canvas width/height to window.innerWidth / window.innerHeight.
3. Add resize event listener to update dimensions on window resize.
4. Start the animation loop via requestAnimationFrame.
```

**Function Detail — `emitBurst(x, y)`**

```
1. Define PARTICLE_COUNT = 40.
2. Define colour pool: [--clr-particle-1, --clr-particle-2, --clr-particle-3, --clr-particle-4]
   (read computed styles or hardcode hex values).
3. For i = 0 to PARTICLE_COUNT - 1:
   a. angle = (Math.PI * 2 / PARTICLE_COUNT) * i + (Math.random() * 0.5)
   b. speed = 1.5 + Math.random() * 3.5
   c. Create particle { x, y, vx: cos(angle)*speed, vy: sin(angle)*speed,
      radius: 2 + Math.random()*4, color: random from pool,
      alpha: 1, decay: 0.01 + Math.random()*0.02, life: 60 + Math.random()*40 }
   d. Push to particles array.
```

**Animation Loop (internal `animate()`):**

```
1. Clear canvas.
2. For each particle in particles array (iterate backwards for safe removal):
   a. particle.x += particle.vx
   b. particle.y += particle.vy
   c. particle.vy += 0.02 (slight gravity)
   d. particle.vx *= 0.99 (friction)
   e. particle.vy *= 0.99
   f. particle.alpha -= particle.decay
   g. particle.life -= 1
   h. If particle.alpha <= 0 or particle.life <= 0: remove from array. Continue.
   i. Draw filled circle at (particle.x, particle.y) with particle.radius,
      colour = particle.color, globalAlpha = particle.alpha.
3. requestAnimationFrame(animate).
```

### 6.4 `js/main.js` — Entry Point

**Responsibilities:**

1. Import all modules.
2. Cache DOM element references.
3. Bind event listeners.
4. Manage cooldown state.
5. Handle DeviceMotion for mobile shake detection.

**DOM References (cached on load):**

| Variable         | Selector / ID          |
| ---------------- | ---------------------- |
| `ballEl`         | `#magic-ball`          |
| `ballBody`       | `.ball__body`          |
| `glowEl`         | `#ball-glow`           |
| `answerEl`       | `#answer-text`         |
| `shakeBtn`       | `#shake-btn`           |
| `questionInput`  | `#question-input`      |
| `particleCanvas` | `#particle-canvas`     |

**State Variables:**

| Variable      | Type      | Default  | Purpose                          |
| ------------- | --------- | -------- | -------------------------------- |
| `isCooldown`  | `Boolean` | `false`  | Prevents multiple shakes         |

**Function Detail — `handleShake()`**

```
1. If isCooldown is true → return early.
2. Set isCooldown = true.
3. Disable shakeBtn (set disabled attribute).
4. Call resetBall(answerEl).
5. Get ball centre coordinates for particle burst:
   a. rect = ballEl.getBoundingClientRect()
   b. centreX = rect.left + rect.width / 2
   c. centreY = rect.top + rect.height / 2
6. Call triggerShake(ballBody, glowEl, answerEl, () => {
     const response = getRandomResponse();
     answerEl.textContent = response;
   });
7. After SHAKE_DURATION, call emitBurst(centreX, centreY).
8. After COOLDOWN_DURATION (2000ms), set isCooldown = false, re-enable shakeBtn.
```

**Event Bindings:**

| Event                     | Target           | Handler         | Notes                                      |
| ------------------------- | ---------------- | --------------- | ------------------------------------------ |
| `click`                   | `ballEl`         | `handleShake`   | Click/tap the ball to shake                |
| `keydown` (Enter/Space)   | `ballEl`         | `handleShake`   | Keyboard accessibility for the ball        |
| `click`                   | `shakeBtn`       | `handleShake`   | Button click to shake                      |
| `keydown` (Enter)         | `questionInput`  | `handleShake`   | Press Enter in input to shake              |
| `devicemotion`            | `window`         | `onDeviceMotion`| Mobile shake detection                     |

**Function Detail — `onDeviceMotion(event)`**

```
1. Read event.accelerationIncludingGravity (or event.acceleration).
2. Extract x, y, z acceleration values.
3. Calculate totalAcceleration = Math.sqrt(x*x + y*y + z*z).
4. Define SHAKE_THRESHOLD = 25.
5. If totalAcceleration > SHAKE_THRESHOLD:
   a. Call handleShake().
```

**Function Detail — `initDeviceMotion()`**

```
1. Check if DeviceMotionEvent exists on window.
2. If DeviceMotionEvent.requestPermission exists (iOS 13+):
   a. On first user interaction (click anywhere), call
      DeviceMotionEvent.requestPermission().
   b. If granted, add 'devicemotion' event listener.
3. Else (Android / older iOS):
   a. Add 'devicemotion' event listener directly.
```

**Initialisation (on DOMContentLoaded or module top-level):**

```
1. Cache all DOM references.
2. Call initParticleCanvas(particleCanvas).
3. Call initDeviceMotion().
4. Bind click/keydown listeners.
```

---

## 7. Feature Details

### 7.1 Shake Animation Mechanics

- **Trigger methods:** Ball click, button click, Enter key in input, device shake.
- **Animation:** CSS `@keyframes ball-shake` with 10 steps of random-feeling translation (±12px) and rotation (±5deg) over 800ms, eased with `cubic-bezier(0.36, 0.07, 0.19, 0.97)`.
- **Glow intensification:** During the shake, `ball__glow--intense` is added, switching the glow animation to a faster, brighter variant.
- **Consulting state:** The answer text shows "Consulting the spirits…" in italic with a flickering opacity animation during the shake.
- **Post-shake reveal:** 300ms after the shake ends, the answer text scales in from 0.6 to 1.1 then settles at 1.0 via the `answer-reveal` keyframe.
- **Cooldown:** 2000ms total from shake start. Button disabled, ball unclickable. Prevents animation overlap.

### 7.2 Device Motion API (Mobile Shake)

- Uses `window.DeviceMotionEvent` to listen for physical device shake.
- **iOS 13+ Permission:** Requires `DeviceMotionEvent.requestPermission()` called from a user gesture (first tap on page). If denied, falls back to click-only interaction silently.
- **Threshold:** `totalAcceleration > 25` (tuned to avoid accidental triggers while walking but responsive to intentional shakes).
- **Debounce:** Uses the existing cooldown mechanism — if `isCooldown` is true, repeated shake events are ignored.
- **Fallback:** If DeviceMotion is not available (desktop browsers), the feature is silently skipped. The tip text about shaking could be hidden via JS if the API is absent.

### 7.3 Response Categories

Responses are divided into three emotional categories for thematic variety:

| Category    | Count | Tone                                     | Example                        |
| ----------- | ----- | ---------------------------------------- | ------------------------------ |
| Positive    | 10    | Affirming, encouraging, optimistic       | "It is decidedly so."          |
| Neutral     | 5     | Ambiguous, uncertain, deflecting         | "Reply hazy, try again."       |
| Negative    | 5     | Discouraging, doubtful, denying          | "Don't count on it."           |

All categories are pooled with equal probability — no weighting.

### 7.4 Particle Effect Algorithm

- **Engine:** Canvas 2D with `requestAnimationFrame` loop running continuously (efficient — only draws when particles exist).
- **Burst origin:** Centre of the 8-Ball element, calculated via `getBoundingClientRect()`.
- **Count:** 40 particles per burst.
- **Distribution:** Evenly spaced angles (360° / 40 = 9° apart) with small random jitter.
- **Speed:** 1.5–5.0 pixels/frame, randomly assigned.
- **Sizes:** Radius 2–6px.
- **Colours:** Randomly picked from 4-colour pool (purple, indigo, gold, pink).
- **Physics:** Each frame: position += velocity, velocity *= 0.99 (friction), vy += 0.02 (gravity). Alpha decays by 0.01–0.03 per frame.
- **Lifespan:** 60–100 frames (~1–1.7s at 60fps).
- **Cleanup:** Particles removed when alpha ≤ 0 or life ≤ 0. Array iterated backwards for safe splicing.
- **Canvas sizing:** Matches viewport. Re-sized on `window.resize`.

---

## 8. Response Bank

### Positive Responses (10)

| #  | Response                                |
| -- | --------------------------------------- |
| 1  | It is certain.                          |
| 2  | It is decidedly so.                     |
| 3  | Without a doubt.                        |
| 4  | Yes — definitely.                       |
| 5  | You may rely on it.                     |
| 6  | As I see it, yes.                       |
| 7  | Most likely.                            |
| 8  | Outlook good.                           |
| 9  | Yes.                                    |
| 10 | Signs point to yes.                     |

### Neutral Responses (5)

| #  | Response                                |
| -- | --------------------------------------- |
| 11 | Reply hazy, try again.                  |
| 12 | Ask again later.                        |
| 13 | Better not tell you now.                |
| 14 | Cannot predict now.                     |
| 15 | Concentrate and ask again.              |

### Negative Responses (5)

| #  | Response                                |
| -- | --------------------------------------- |
| 16 | Don't count on it.                      |
| 17 | My reply is no.                         |
| 18 | My sources say no.                      |
| 19 | Outlook not so good.                    |
| 20 | Very doubtful.                          |

**Total: 20 responses** (the classic Magic 8-Ball set).

---

## 9. Implementation Order

### Phase 1 — Static Shell

| Step | Task                                                                                              | Files Affected         |
| ---- | ------------------------------------------------------------------------------------------------- | ---------------------- |
| 1.1  | Create `index.html` with full semantic structure, Google Fonts link, and relative CSS/JS paths.    | `index.html`           |
| 1.2  | Create `styles/main.css` with CSS variables, reset, base styles, and layout (app, header, footer). | `styles/main.css`      |
| 1.3  | Style the 8-Ball: `.ball__body` radial gradient, `.ball__shine`, `.ball__eight`, `.ball__window`, `.ball__triangle`. Verify ball looks correct at all breakpoints. | `styles/main.css` |
| 1.4  | Style input and button. Add responsive media queries. Test across viewport sizes.                  | `styles/main.css`      |
| 1.5  | Add idle glow animation (`@keyframes glow-pulse`) and verify it pulses behind the ball.            | `styles/main.css`      |

### Phase 2 — Core JavaScript

| Step | Task                                                                                              | Files Affected                |
| ---- | ------------------------------------------------------------------------------------------------- | ----------------------------- |
| 2.1  | Create `js/modules/responses.js` — define `RESPONSES` object with all 20 answers. Export `getRandomResponse()`. | `js/modules/responses.js` |
| 2.2  | Create `js/modules/animation.js` — implement `triggerShake()` and `resetBall()`. Export timing constants. | `js/modules/animation.js` |
| 2.3  | Create `js/main.js` — import modules, cache DOM refs, implement `handleShake()`, bind click events on ball and button. Test shake → response cycle. | `js/main.js` |
| 2.4  | Add keyboard support — Enter/Space on ball, Enter in input field.                                  | `js/main.js`                  |
| 2.5  | Implement cooldown logic — disable button, set `isCooldown` flag, re-enable after `COOLDOWN_DURATION`. | `js/main.js`            |

### Phase 3 — Shake Animation & Glow

| Step | Task                                                                                              | Files Affected         |
| ---- | ------------------------------------------------------------------------------------------------- | ---------------------- |
| 3.1  | Add `@keyframes ball-shake` and `.ball__body--shaking` class to CSS.                               | `styles/main.css`      |
| 3.2  | Add intense glow animation (`@keyframes glow-pulse-intense`, `.ball__glow--intense`).              | `styles/main.css`      |
| 3.3  | Add "consulting" text flicker (`@keyframes text-flicker`, `.ball__answer--consulting`).            | `styles/main.css`      |
| 3.4  | Add answer reveal animation (`@keyframes answer-reveal`, `.ball__answer--reveal`).                 | `styles/main.css`      |
| 3.5  | Wire animation module to add/remove classes at correct timings. Test full sequence.                | `js/modules/animation.js` |

### Phase 4 — Particle System

| Step | Task                                                                                              | Files Affected             |
| ---- | ------------------------------------------------------------------------------------------------- | -------------------------- |
| 4.1  | Create `js/modules/particles.js` — implement `initParticleCanvas()`, canvas resize handler, and empty animation loop. | `js/modules/particles.js` |
| 4.2  | Implement `emitBurst()` — particle spawning with angle distribution, speed, colour, decay.         | `js/modules/particles.js` |
| 4.3  | Implement animation loop — update positions, apply friction/gravity, fade alpha, draw circles, remove dead particles. | `js/modules/particles.js` |
| 4.4  | Integrate particle burst into `handleShake()` in `main.js` — fire after shake duration, calculate ball centre. | `js/main.js` |
| 4.5  | Tune particle parameters (count, speed, decay, gravity) for visual appeal.                         | `js/modules/particles.js` |

### Phase 5 — Device Motion (Mobile)

| Step | Task                                                                                              | Files Affected |
| ---- | ------------------------------------------------------------------------------------------------- | -------------- |
| 5.1  | Implement `initDeviceMotion()` — feature detect, iOS permission request, add event listener.       | `js/main.js`   |
| 5.2  | Implement `onDeviceMotion()` — read acceleration, calculate magnitude, trigger shake if above threshold. | `js/main.js` |
| 5.3  | Test on mobile device / DevTools emulation. Adjust `SHAKE_THRESHOLD` if needed.                    | `js/main.js`   |
| 5.4  | Optionally hide the tip text if DeviceMotion is not available.                                     | `js/main.js`   |

### Phase 6 — Polish & Accessibility

| Step | Task                                                                                              | Files Affected         |
| ---- | ------------------------------------------------------------------------------------------------- | ---------------------- |
| 6.1  | Verify `aria-live` announcements work with screen readers.                                         | `index.html`           |
| 6.2  | Test keyboard-only navigation: Tab to ball, Enter to shake, Tab to input, Enter to shake.          | `index.html`, `js/main.js` |
| 6.3  | Ensure `prefers-reduced-motion` media query disables shake animation and particle burst.           | `styles/main.css`, `js/main.js` |
| 6.4  | Final responsive testing across 320px, 375px, 768px, 1024px, 1440px viewports.                    | `styles/main.css`      |
| 6.5  | Validate HTML (no errors), check console for JS warnings, clean up any debug code.                 | All files              |
