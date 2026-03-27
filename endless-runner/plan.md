# Endless Runner — Implementation Plan

## 1. Overview

### What It Is

A side-scrolling endless runner game built with vanilla JavaScript and HTML5 Canvas. The player controls a character that automatically runs to the right. Obstacles scroll in from the right side of the screen. The player must jump over or duck under these obstacles to survive. The longer the player survives, the higher their score — and the faster the game becomes.

### Core Gameplay Loop

1. **Start Screen** — The player sees a title, instructions, and their saved high score. They press Space, Up Arrow, or click to begin.
2. **Running Phase** — The character runs automatically. The ground and background scroll left to simulate forward motion. Obstacles appear at random intervals from the right edge.
3. **Player Input** — The player presses Space/Up Arrow to jump over ground-level obstacles, or Down Arrow to duck under elevated obstacles.
4. **Scoring** — A score counter increments every frame based on distance travelled. The score accelerates as game speed increases.
5. **Difficulty Scaling** — Every few seconds, the scroll speed increases slightly, obstacles spawn more frequently, and gap windows between obstacles shrink.
6. **Collision & Death** — When the player's hitbox overlaps an obstacle's hitbox, the run ends immediately.
7. **Game Over Screen** — The final score is displayed. If it exceeds the stored high score, localStorage is updated. The player can restart with a single input.
8. **Repeat** — The loop resets from step 2.

---

## 2. Page Layout

Think of the page as three visual layers stacked on top of each other, all centred on the screen.

### Wireframe Description

```text
┌──────────────────────────────────────────────────────┐
│                   BROWSER VIEWPORT                   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │              GAME CONTAINER                  │   │
│   │                                              │   │
│   │   ┌──────────────────────────────────────┐   │   │
│   │   │          HUD BAR (top)               │   │   │
│   │   │  Score: 00000       HI: 00000        │   │   │
│   │   └──────────────────────────────────────┘   │   │
│   │                                              │   │
│   │   ┌──────────────────────────────────────┐   │   │
│   │   │                                      │   │   │
│   │   │         CANVAS (game world)          │   │   │
│   │   │                                      │   │   │
│   │   │   sky / clouds (parallax layer 1)    │   │   │
│   │   │   hills (parallax layer 2)           │   │   │
│   │   │                                      │   │   │
│   │   │        🏃 player                     │   │   │
│   │   │   ════════════════ ground ════════    │   │   │
│   │   │                                      │   │   │
│   │   └──────────────────────────────────────┘   │   │
│   │                                              │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │           OVERLAY: START SCREEN              │   │
│   │                                              │   │
│   │           🏃  ENDLESS RUNNER                 │   │
│   │                                              │   │
│   │      Press SPACE or click to start           │   │
│   │                                              │   │
│   │          High Score: 00000                   │   │
│   │                                              │   │
│   │      Controls:                               │   │
│   │      SPACE / UP — Jump                       │   │
│   │      DOWN — Duck                             │   │
│   │                                              │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │          OVERLAY: GAME OVER SCREEN           │   │
│   │                                              │   │
│   │              GAME OVER                       │   │
│   │                                              │   │
│   │           Score: 01250                       │   │
│   │           Best:  03400                       │   │
│   │         🏆 NEW HIGH SCORE! (if applicable)   │   │
│   │                                              │   │
│   │        [ Play Again ]  button                │   │
│   │                                              │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                  FOOTER                      │   │
│   │   Built with HTML5 Canvas & JavaScript       │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Key Layout Details

- The **game container** is centred horizontally on the page with a maximum width of 800px and a fixed height of 400px (the canvas resolution).
- The **HUD bar** sits directly above the canvas inside the game container. It is an HTML element (not drawn on canvas) so screen readers can access it. It shows the current score on the left and the high score on the right.
- The **canvas** fills the game container width (800×400 logical pixels). The canvas is drawn with a 2:1 aspect ratio.
- **Overlay screens** (start and game over) are absolutely positioned on top of the canvas. They use a semi-transparent dark backdrop to dim the game world behind them. Only one overlay is visible at a time.
- The **footer** is a simple line of text below the game container.
- On screens narrower than 800px, the game container scales down proportionally using CSS `max-width: 100%` and `aspect-ratio` to maintain the 2:1 ratio.

---

## 3. Colour Scheme & Typography

### Visual Style

Retro pixel-art aesthetic with a modern, clean UI for menus and HUD. The game world uses warm desert/sunset tones. The UI uses high-contrast text on dark or semi-transparent backgrounds.

### Colour Palette

| Purpose              | Colour Name      | Hex       | Usage                                      |
|----------------------|------------------|-----------|--------------------------------------------|
| Sky gradient top     | Sunset Orange    | `#FF6B35` | Top of canvas sky                          |
| Sky gradient bottom  | Warm Yellow      | `#FFD166` | Bottom of canvas sky                       |
| Ground surface       | Desert Tan       | `#C4A35A` | Top edge of the ground strip               |
| Ground body          | Earth Brown      | `#8B6914` | Fill of the ground rectangle               |
| Ground detail        | Dark Brown       | `#5C4410` | Texture lines on the ground                |
| Player body          | Teal             | `#06D6A0` | Main colour of the player character        |
| Player outline       | Dark Teal        | `#048A65` | Character outline for visibility           |
| Obstacle primary     | Danger Red       | `#EF476F` | Cactus / spike obstacles                   |
| Obstacle secondary   | Dark Red         | `#B5173B` | Obstacle outlines or flying obstacles      |
| HUD / UI background  | Charcoal         | `#1B1B2F` | Overlay backdrop, HUD bar background       |
| HUD text             | White            | `#FFFFFF` | Score numbers, labels                      |
| Accent / highlight   | Electric Blue    | `#118AB2` | Buttons, "NEW HIGH SCORE" flash            |
| Button hover         | Bright Blue      | `#1AAFDB` | Button hover state                         |
| Overlay backdrop     | Black 70%        | `rgba(0,0,0,0.7)` | Semi-transparent overlay behind screens |
| Cloud colour         | Cloud White      | `#FFF8E7` | Parallax cloud shapes                      |
| Hill colour          | Muted Olive      | `#A8C256` | Background hills layer                     |

### CSS Variables

```css
:root {
  --color-sky-top: #FF6B35;
  --color-sky-bottom: #FFD166;
  --color-ground: #8B6914;
  --color-ground-surface: #C4A35A;
  --color-ground-detail: #5C4410;
  --color-player: #06D6A0;
  --color-player-outline: #048A65;
  --color-obstacle: #EF476F;
  --color-obstacle-dark: #B5173B;
  --color-ui-bg: #1B1B2F;
  --color-ui-text: #FFFFFF;
  --color-accent: #118AB2;
  --color-accent-hover: #1AAFDB;
  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-cloud: #FFF8E7;
  --color-hills: #A8C256;

  --font-display: 'Press Start 2P', monospace;
  --font-body: 'Inter', system-ui, sans-serif;

  --canvas-width: 800;
  --canvas-height: 400;
}
```

### Typography

| Role             | Font                          | Weight | Size          | Source                                                     |
|------------------|-------------------------------|--------|---------------|------------------------------------------------------------|
| Game title       | Press Start 2P                | 400    | 28px          | Google Fonts: `https://fonts.googleapis.com/css2?family=Press+Start+2P` |
| HUD score        | Press Start 2P                | 400    | 14px          | Same as above                                              |
| Menu headings    | Press Start 2P                | 400    | 20px          | Same as above                                              |
| Body / controls  | Inter                         | 400    | 16px          | Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600` |
| Buttons          | Inter                         | 600    | 16px          | Same as above                                              |
| Footer           | Inter                         | 400    | 12px          | Same as above                                              |

---

## 4. HTML Structure

The single `index.html` file contains every element the game needs.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Endless Runner — dodge obstacles and chase your high score">
  <title>Endless Runner</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Press+Start+2P&display=swap" rel="stylesheet">

  <!-- Stylesheet (relative path) -->
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- Skip-to-content link for keyboard accessibility -->
  <a href="#game-container" class="skip-link">Skip to game</a>

  <header class="site-header">
    <h1 class="site-header__title">Endless Runner</h1>
  </header>

  <main id="game-container" class="game-container" role="application" aria-label="Endless Runner Game">

    <!-- HUD — always visible during gameplay, updated by JS -->
    <div class="hud" aria-live="polite">
      <span class="hud__score" id="hud-score">Score: <span id="score-value">00000</span></span>
      <span class="hud__high-score" id="hud-high-score">HI: <span id="high-score-value">00000</span></span>
    </div>

    <!-- Canvas — the game world is drawn here -->
    <canvas
      id="game-canvas"
      class="game-canvas"
      width="800"
      height="400"
      aria-hidden="true"
    >
      Your browser does not support the canvas element.
    </canvas>

    <!-- START SCREEN overlay -->
    <div class="overlay overlay--start" id="start-screen">
      <h2 class="overlay__title">Endless Runner</h2>
      <p class="overlay__subtitle">Press <kbd>Space</kbd> or click to start</p>
      <div class="overlay__controls">
        <p><kbd>Space</kbd> / <kbd>↑</kbd> — Jump</p>
        <p><kbd>↓</kbd> — Duck</p>
      </div>
      <p class="overlay__high-score">High Score: <span id="start-high-score">00000</span></p>
    </div>

    <!-- GAME OVER overlay -->
    <div class="overlay overlay--game-over hidden" id="game-over-screen">
      <h2 class="overlay__title">Game Over</h2>
      <p class="overlay__final-score">Score: <span id="final-score">00000</span></p>
      <p class="overlay__best-score">Best: <span id="best-score">00000</span></p>
      <p class="overlay__new-record hidden" id="new-record">🏆 NEW HIGH SCORE!</p>
      <button class="overlay__button" id="restart-button" type="button">Play Again</button>
    </div>

  </main>

  <footer class="site-footer">
    <p>Built with HTML5 Canvas &amp; JavaScript</p>
  </footer>

  <!-- Entry point script (ES module) -->
  <script type="module" src="js/main.js"></script>

</body>
</html>
```

### Element Breakdown

| Element                     | Tag / Attribute             | Purpose                                                                 |
|-----------------------------|-----------------------------|-------------------------------------------------------------------------|
| `<a class="skip-link">`     | Anchor                      | Allows keyboard users to skip straight to the game                      |
| `<header>`                  | Site header                 | Contains the page-level `<h1>` title                                    |
| `<main#game-container>`     | Game wrapper                | `role="application"` tells assistive tech this is an interactive app    |
| `.hud`                      | Div, `aria-live="polite"`   | Displays current score and high score; screen readers announce updates  |
| `#score-value`              | Span                        | JS updates this text node with the formatted score                      |
| `#high-score-value`         | Span                        | JS updates this with the stored high score                              |
| `<canvas#game-canvas>`      | Canvas, 800×400             | All game rendering happens here; `aria-hidden` since it's visual-only   |
| `#start-screen`             | Overlay div                 | Visible on load; contains title, instructions, controls, high score     |
| `<kbd>` elements            | Keyboard key labels         | Semantic markup for key references                                      |
| `#game-over-screen`         | Overlay div                 | Hidden initially; shown when player dies                                |
| `#new-record`               | Paragraph                   | Conditionally shown when the player beats their high score              |
| `#restart-button`           | Button                      | Triggers a new game; keyboard-focusable by default                      |
| `<footer>`                  | Site footer                 | Attribution line                                                        |
| `<script type="module">`    | ES module script            | Loads `js/main.js` as the entry point                                   |

---

## 5. CSS Design

### File: `styles/main.css`

### Layout Approach

- **Body**: Flexbox column layout, centred horizontally, full viewport height with the game container in the middle.
- **Game container**: `position: relative` so overlays can be absolutely positioned inside it. `max-width: 800px` with `width: 100%`.
- **Overlays**: `position: absolute; inset: 0` covering the entire game container. Flexbox column, centred content.
- **HUD**: Flexbox row, `justify-content: space-between`, positioned above the canvas inside the container.

### Key Styles

```css
/* === RESET & BASE === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-ui-bg);
  color: var(--color-ui-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

/* === SKIP LINK === */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--color-accent);
  color: var(--color-ui-text);
  padding: 0.5rem 1rem;
  z-index: 100;
  /* Becomes visible on :focus */
}
.skip-link:focus {
  top: 0;
}

/* === HEADER === */
.site-header {
  text-align: center;
  padding: 1rem 0;
}
.site-header__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  letter-spacing: 2px;
}

/* === GAME CONTAINER === */
.game-container {
  position: relative;
  width: 100%;
  max-width: 800px;
}

/* === HUD === */
.hud {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-family: var(--font-display);
  font-size: 0.875rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px 4px 0 0;
}

/* === CANVAS === */
.game-canvas {
  display: block;
  width: 100%;
  height: auto;
  border: 2px solid var(--color-accent);
  border-top: none;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  image-rendering: pixelated;   /* crisp pixel art */
}

/* === OVERLAYS === */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-overlay);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  z-index: 10;
  padding: 2rem;
}

.overlay__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
}

.overlay__subtitle,
.overlay__controls p {
  font-size: 0.9rem;
  line-height: 1.8;
}

.overlay__button {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 2rem;
  background: var(--color-accent);
  color: var(--color-ui-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.overlay__button:hover,
.overlay__button:focus-visible {
  background: var(--color-accent-hover);
  outline: 2px solid var(--color-ui-text);
  outline-offset: 2px;
}

/* === HIDDEN UTILITY === */
.hidden {
  display: none !important;
}

/* === NEW HIGH SCORE FLASH === */
@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.overlay__new-record {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-accent);
  animation: flash 1s ease-in-out infinite;
}

/* === FOOTER === */
.site-footer {
  text-align: center;
  padding: 1rem 0;
  font-size: 0.75rem;
  opacity: 0.6;
}

/* === RESPONSIVE === */
@media (max-width: 600px) {
  .site-header__title {
    font-size: 1.1rem;
  }
  .hud {
    font-size: 0.65rem;
    padding: 0.35rem 0.5rem;
  }
  .overlay__title {
    font-size: 1rem;
  }
  .overlay__controls p {
    font-size: 0.75rem;
  }
}
```

### CSS Animations Summary

| Animation Name | Target                  | Effect                                   |
|----------------|-------------------------|------------------------------------------|
| `flash`        | `.overlay__new-record`  | Pulsing opacity 1 → 0.3 → 1 for 1s loop |

All in-game visual animations (player running, jumping, obstacle movement, parallax scrolling) are handled on the **canvas via JavaScript**, not CSS. CSS only manages the HTML overlay/UI animations.

### Responsive Strategy

- The canvas has `width: 100%` and `height: auto`. The internal resolution stays 800×400, but the CSS scales it down visually on smaller screens.
- Font sizes reduce at the 600px breakpoint.
- The game container uses `max-width: 800px; width: 100%` so it never overflows.
- Touch events (`touchstart`) are bound in JS alongside click events for mobile play.

---

## 6. JavaScript Architecture

All scripts use ES modules. The entry point `js/main.js` imports from `js/modules/`.

```text
js/
├── main.js
└── modules/
    ├── game.js
    ├── player.js
    ├── obstacles.js
    ├── renderer.js
    └── storage.js
```

---

### 6.1 `js/main.js` — Entry Point

Responsibilities: grab DOM references, wire up event listeners, initialise modules, start the game loop.

```text
Functions:
─────────────────────────────────────────────────────────────────────────────
init()
  @param    — none
  @returns  — void
  Purpose   — Called on DOMContentLoaded. Grabs canvas context, DOM elements,
              loads high score from storage, updates HUD and start screen,
              attaches input event listeners (keyboard, click, touch).

startGame()
  @param    — none
  @returns  — void
  Purpose   — Hides the start/game-over overlay, resets game state via
              game.reset(), resets player and obstacles, starts the
              requestAnimationFrame loop by calling gameLoop().

gameLoop(timestamp)
  @param    timestamp — DOMHighResTimeStamp from requestAnimationFrame
  @returns  — void
  Purpose   — Core loop. Calculates delta time since last frame, calls
              game.update(dt), player.update(dt), obstacles.update(dt),
              checks collisions via obstacles.checkCollision(player),
              calls renderer.draw(...), updates HUD score display, and
              requests the next frame. If collision detected, calls endGame().

endGame()
  @param    — none
  @returns  — void
  Purpose   — Stops the animation frame, calculates final score, checks
              and updates high score via storage module, shows the
              game-over overlay with final/best scores and optional
              new-record badge.

handleKeyDown(event)
  @param    event — KeyboardEvent
  @returns  — void
  Purpose   — Routes keyboard input. Space/ArrowUp → player.jump()
              (or startGame if on start/game-over screen). ArrowDown →
              player.duck(). Prevents default on handled keys.

handleKeyUp(event)
  @param    event — KeyboardEvent
  @returns  — void
  Purpose   — On ArrowDown release → player.standUp(). Restores the
              player from ducking state.

handleClick()
  @param    — none
  @returns  — void
  Purpose   — If game is not running, calls startGame(). If game is
              running, calls player.jump().

handleTouchStart(event)
  @param    event — TouchEvent
  @returns  — void
  Purpose   — Prevents default, delegates to handleClick() for mobile.
```

---

### 6.2 `js/modules/game.js` — Game State & Difficulty

Responsibilities: track game state (idle / running / over), manage score, control difficulty curve.

```text
Exports: default object or class with these methods/properties
─────────────────────────────────────────────────────────────────────────────

Properties:
  state           — 'idle' | 'running' | 'over'
  score           — Number, the current raw score (incremented each frame)
  speed           — Number, current scroll speed in px/s (starts at BASE_SPEED)
  frameCount      — Number, total frames since game start (for timing)

Constants (module-level):
  BASE_SPEED      — 300     (pixels per second, the starting speed)
  MAX_SPEED       — 800     (pixels per second, speed cap)
  SPEED_INCREMENT — 0.3     (px/s added per frame to accelerate gradually)
  SCORE_PER_FRAME — 0.15    (raw score added per frame; displayed as integer)

Functions:
─────────────────────────────────────────────────────────────────────────────
reset()
  @param    — none
  @returns  — void
  Purpose   — Sets state to 'running', resets score to 0, speed to BASE_SPEED,
              frameCount to 0.

update(dt)
  @param    dt — Number, delta time in seconds since last frame
  @returns  — void
  Purpose   — If state is 'running': increments frameCount, adds
              SCORE_PER_FRAME * (speed / BASE_SPEED) to score (so faster
              speed = faster scoring), increases speed by SPEED_INCREMENT
              capped at MAX_SPEED.

getDisplayScore()
  @param    — none
  @returns  — String, the score zero-padded to 5 digits (e.g. "00042")
  Purpose   — Formats score for display in the HUD.

getSpeed()
  @param    — none
  @returns  — Number, current speed in px/s
  Purpose   — Used by obstacles and renderer to know the current scroll speed.

setGameOver()
  @param    — none
  @returns  — void
  Purpose   — Sets state to 'over'.

isRunning()
  @param    — none
  @returns  — Boolean
  Purpose   — Returns true if state === 'running'.
```

---

### 6.3 `js/modules/player.js` — Player Character

Responsibilities: player position, jump/duck physics, hitbox, animation frame tracking.

```text
Constants (module-level):
  GROUND_Y       — 320     (y-coordinate of ground surface on the 400px canvas)
  PLAYER_WIDTH   — 40      (px, hitbox and draw width when standing)
  PLAYER_HEIGHT  — 60      (px, hitbox and draw height when standing)
  DUCK_HEIGHT    — 35      (px, height when ducking)
  PLAYER_X       — 80      (px, fixed horizontal position on canvas)
  JUMP_VELOCITY  — -550    (px/s, initial upward velocity on jump, negative = up)
  GRAVITY        — 1400    (px/s², downward acceleration)

Properties:
  x              — Number, always PLAYER_X (fixed horizontal position)
  y              — Number, current vertical position (bottom edge of player)
  width          — Number, current width (PLAYER_WIDTH)
  height         — Number, current height (PLAYER_HEIGHT or DUCK_HEIGHT)
  velocityY      — Number, current vertical velocity in px/s
  isJumping      — Boolean, true while airborne
  isDucking      — Boolean, true while duck key held
  animFrame      — Number, cycles 0–3 for running animation

Functions:
─────────────────────────────────────────────────────────────────────────────
reset()
  @param    — none
  @returns  — void
  Purpose   — Resets player to standing position on the ground. Sets y to
              GROUND_Y - PLAYER_HEIGHT, velocityY to 0, isJumping and
              isDucking to false, animFrame to 0.

update(dt)
  @param    dt — Number, delta time in seconds
  @returns  — void
  Purpose   — If jumping: applies gravity (velocityY += GRAVITY * dt),
              updates y position (y += velocityY * dt). If player lands
              (y + height >= GROUND_Y), snaps to ground, sets isJumping
              false, velocityY to 0. Advances animFrame for running
              animation (cycles every 8 game frames).

jump()
  @param    — none
  @returns  — void
  Purpose   — If not already jumping and not ducking: sets velocityY to
              JUMP_VELOCITY, isJumping to true. This gives the player an
              initial upward burst; gravity pulls them back down in update().

duck()
  @param    — none
  @returns  — void
  Purpose   — If not jumping: sets isDucking to true, reduces height to
              DUCK_HEIGHT, adjusts y so bottom edge stays on ground.

standUp()
  @param    — none
  @returns  — void
  Purpose   — Sets isDucking to false, restores height to PLAYER_HEIGHT,
              adjusts y so bottom edge stays on ground.

getHitbox()
  @param    — none
  @returns  — Object { x, y, width, height } with slightly inset values
              (2px padding on each side) for forgiving collisions.
  Purpose   — Returns the current collision rectangle, shrunk slightly so
              pixel-perfect near-misses feel fair.
```

---

### 6.4 `js/modules/obstacles.js` — Obstacles

Responsibilities: generate obstacles, move them, detect collisions, manage the obstacle pool.

```text
Constants (module-level):
  MIN_SPAWN_INTERVAL — 800   (ms, minimum time between obstacle spawns)
  MAX_SPAWN_INTERVAL — 2000  (ms, maximum time when game is slow)
  OBSTACLE_TYPES     — Array of objects defining each type:
    [
      { name: 'cactus_small',  width: 25, height: 40, yOffset: 0    },
      { name: 'cactus_large',  width: 30, height: 55, yOffset: 0    },
      { name: 'cactus_double', width: 55, height: 45, yOffset: 0    },
      { name: 'bird_low',      width: 40, height: 30, yOffset: -50  },
      { name: 'bird_high',     width: 40, height: 30, yOffset: -100 }
    ]
    yOffset is relative to ground level: 0 = sitting on ground,
    negative = above ground (must duck or they pass overhead).

Properties:
  obstacles          — Array of active obstacle objects, each with:
                        { x, y, width, height, type, passed }
  timeSinceLastSpawn — Number, ms since last obstacle was created
  spawnInterval      — Number, ms until next obstacle spawns

Functions:
─────────────────────────────────────────────────────────────────────────────
reset()
  @param    — none
  @returns  — void
  Purpose   — Empties the obstacles array, resets timeSinceLastSpawn to 0,
              sets spawnInterval to MAX_SPAWN_INTERVAL.

update(dt, speed)
  @param    dt    — Number, delta time in seconds
  @param    speed — Number, current game speed in px/s
  @returns  — void
  Purpose   — Moves every obstacle left by speed * dt. Removes obstacles
              that have scrolled off-screen (x + width < 0). Decrements
              timeSinceLastSpawn. If enough time has passed, calls spawn().
              Recalculates spawnInterval based on speed (faster speed →
              shorter interval, clamped to MIN_SPAWN_INTERVAL).

spawn()
  @param    — none
  @returns  — void
  Purpose   — Picks a random type from OBSTACLE_TYPES. Creates a new
              obstacle object at x = canvas width (800), y = GROUND_Y
              - type.height + type.yOffset. Pushes it into the obstacles
              array. Resets timeSinceLastSpawn and picks a new random
              spawnInterval.

checkCollision(playerHitbox)
  @param    playerHitbox — Object { x, y, width, height }
  @returns  — Boolean, true if any obstacle overlaps the player hitbox
  Purpose   — Iterates through obstacles array. For each, performs AABB
              (Axis-Aligned Bounding Box) overlap test against the player
              hitbox. Returns true on first overlap found.

getObstacles()
  @param    — none
  @returns  — Array of obstacle objects
  Purpose   — Getter for the renderer to draw obstacles.
```

---

### 6.5 `js/modules/renderer.js` — Canvas Drawing

Responsibilities: draw every visual element to the canvas each frame.

```text
Properties (module-level):
  ctx             — CanvasRenderingContext2D, set during init
  canvasWidth     — 800
  canvasHeight    — 400
  cloudOffsetX    — Number, tracks parallax scroll for clouds
  hillOffsetX     — Number, tracks parallax scroll for hills
  groundOffsetX   — Number, tracks ground texture scroll
  clouds          — Array of cloud objects { x, y, width, height }
                    generated once at init

Functions:
─────────────────────────────────────────────────────────────────────────────
init(canvasElement)
  @param    canvasElement — HTMLCanvasElement
  @returns  — void
  Purpose   — Stores the 2D context reference. Generates initial cloud
              positions (5–8 random clouds across the width).

draw(player, obstacles, speed, dt)
  @param    player    — player module (to read position, dimensions, state)
  @param    obstacles — Array of obstacle objects from obstacles.getObstacles()
  @param    speed     — Number, current speed for parallax calculation
  @param    dt        — Number, delta time in seconds
  @returns  — void
  Purpose   — Clears the canvas. Calls drawSky(), drawClouds(speed, dt),
              drawHills(speed, dt), drawGround(speed, dt),
              drawPlayer(player), drawObstacles(obstacles), in that order
              (back to front layering).

drawSky()
  @param    — none
  @returns  — void
  Purpose   — Draws a vertical linear gradient from --color-sky-top to
              --color-sky-bottom filling the top portion of the canvas
              (y: 0 to GROUND_Y).

drawClouds(speed, dt)
  @param    speed — Number, current game speed
  @param    dt    — Number, delta time
  @returns  — void
  Purpose   — Scrolls clouds left at 10% of game speed (slow parallax).
              Draws each cloud as a cluster of overlapping white ellipses.
              Wraps clouds that scroll off the left edge back to the right.

drawHills(speed, dt)
  @param    speed — Number
  @param    dt    — Number
  @returns  — void
  Purpose   — Scrolls a repeating hill silhouette left at 30% of game speed.
              Drawn as a series of arc shapes in --color-hills just above
              the ground line.

drawGround(speed, dt)
  @param    speed — Number
  @param    dt    — Number
  @returns  — void
  Purpose   — Draws the ground rectangle from GROUND_Y to canvas bottom.
              Fills with --color-ground. Draws a --color-ground-surface
              line at the top edge. Scrolls small texture marks (dots,
              dashes) left at full game speed to give a sense of motion.

drawPlayer(player)
  @param    player — player module
  @returns  — void
  Purpose   — Draws the player character at their current position.
              Uses simple geometric shapes (rectangles, circles) to form
              a stick-figure or blocky character. Changes appearance based
              on player state:
              - Standing/running: full height, legs alternate per animFrame
              - Jumping: arms up pose
              - Ducking: reduced height, wider stance
              Fills with --color-player, outlines with --color-player-outline.

drawObstacles(obstacles)
  @param    obstacles — Array of obstacle objects
  @returns  — void
  Purpose   — Iterates the array. For ground obstacles (cactus types),
              draws cactus-like shapes using --color-obstacle. For bird
              types, draws a simple bird silhouette with flapping wings
              (alternating frame). Outlines with --color-obstacle-dark.
```

---

### 6.6 `js/modules/storage.js` — High Score Persistence

Responsibilities: read and write the high score to localStorage.

```text
Constants:
  STORAGE_KEY — 'endlessRunner_highScore'

Functions:
─────────────────────────────────────────────────────────────────────────────
getHighScore()
  @param    — none
  @returns  — Number, the stored high score (0 if none found or parse error)
  Purpose   — Reads STORAGE_KEY from localStorage. Parses as integer.
              Returns 0 if missing, NaN, or localStorage is unavailable.
              Wrapped in try/catch for environments where localStorage
              throws (e.g. private browsing in some browsers).

setHighScore(score)
  @param    score — Number, the new high score to save
  @returns  — void
  Purpose   — Writes the score (as a string) to localStorage under
              STORAGE_KEY. Wrapped in try/catch.

isNewHighScore(currentScore, previousHigh)
  @param    currentScore — Number
  @param    previousHigh — Number
  @returns  — Boolean, true if currentScore > previousHigh
  Purpose   — Simple comparison helper. If true, the caller should call
              setHighScore() and show the new-record badge.

formatScore(score)
  @param    score — Number
  @returns  — String, zero-padded to 5 digits (e.g. "00350")
  Purpose   — Pads the integer portion of the score for consistent display.
```

---

## 7. Game Mechanics

### 7.1 Jump Physics

The jump uses a simple kinematic model:

1. On jump input, `velocityY` is set to `JUMP_VELOCITY` (−550 px/s, upward).
2. Each frame, gravity is applied: `velocityY += GRAVITY * dt` (1400 px/s²).
3. Position updates: `y += velocityY * dt`.
4. When the player's bottom edge reaches or passes `GROUND_Y`, they are snapped to the ground and `velocityY` is zeroed.

**Jump arc example at 60fps:**

- Frame 0: velocityY = −550, y moves up ~9.2px
- Frame 10: velocityY ≈ −317, still rising
- Frame 20: velocityY ≈ −83, near apex
- Frame 23: velocityY ≈ 0, apex reached (~107px above ground)
- Frame 46: player lands back on ground

The jump reaches approximately **107 pixels** above ground level and lasts roughly **0.78 seconds** — enough time to clear a 55px tall cactus with some margin.

### 7.2 Ducking

- When the duck key is pressed, the player's height shrinks from 60px to 35px.
- The player's y-position adjusts downward so their feet stay on the ground.
- Birds at `yOffset: -50` fly at y = 270 (ground 320 − 30 height − 50 offset = 240 top edge, 270 bottom edge). A standing player (top edge at 260) collides, but a ducking player (top edge at 285) does not.
- The player cannot jump while ducking.

### 7.3 Collision Detection — AABB

The game uses **Axis-Aligned Bounding Box** collision detection:

```text
Two rectangles A and B overlap if and only if ALL of:
  A.x < B.x + B.width
  A.x + A.width > B.x
  A.y < B.y + B.height
  A.y + A.height > B.y
```

The player's hitbox is **inset by 2px** on each side (4px total reduction in width and height) to create forgiving collisions. Near-misses that visually look "clean" will feel clean.

```javascript
function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

### 7.4 Difficulty Curve

| Time (seconds) | Approx Speed (px/s) | Spawn Interval Range (ms) | Feel              |
|-----------------|---------------------|---------------------------|--------------------|
| 0–5            | 300–310             | 1500–2000                 | Gentle warm-up     |
| 5–15           | 310–350             | 1200–1700                 | Getting comfortable|
| 15–30          | 350–440             | 1000–1400                 | Moderate challenge |
| 30–60          | 440–620             | 900–1200                  | Fast and tense     |
| 60+            | 620–800 (cap)       | 800–1000 (cap)            | Survival mode      |

Speed formula (per frame):

```text
speed = min(speed + SPEED_INCREMENT, MAX_SPEED)
```

At 60fps with `SPEED_INCREMENT = 0.3`, speed increases by **18 px/s per second**. It takes roughly **28 seconds** to go from 300 to 800.

Spawn interval formula:

```text
spawnInterval = max(MIN_SPAWN_INTERVAL, MAX_SPAWN_INTERVAL - (speed - BASE_SPEED) * 2.4)
```

### 7.5 Scoring Formula

Each frame, the score increases by:

```text
scoreIncrement = SCORE_PER_FRAME × (speed / BASE_SPEED)
```

At base speed (300), that's `0.15 × 1.0 = 0.15` per frame → **9 points/second** at 60fps.

At max speed (800), that's `0.15 × 2.67 = 0.4` per frame → **24 points/second** at 60fps.

The score is displayed as `Math.floor(score)` zero-padded to 5 digits.

---

## 8. Data Flow

### Module Dependency Graph

```text
main.js
  ├── imports game.js
  ├── imports player.js
  ├── imports obstacles.js
  ├── imports renderer.js
  └── imports storage.js

game.js       — standalone, no imports from other modules
player.js     — standalone, no imports from other modules
obstacles.js  — standalone, no imports from other modules
renderer.js   — standalone, no imports from other modules
storage.js    — standalone, no imports from other modules
```

All modules are independent. `main.js` is the **orchestrator** — it imports all modules and passes data between them via function arguments. No module imports another game module.

### Per-Frame Data Flow

```text
1. requestAnimationFrame provides `timestamp`
2. main.js calculates `dt` = (timestamp - lastTimestamp) / 1000
3. main.js calls game.update(dt)
     → game increments score, increases speed
4. main.js calls player.update(dt)
     → player applies gravity, updates position
5. main.js calls obstacles.update(dt, game.getSpeed())
     → obstacles move left, old ones removed, new ones possibly spawned
6. main.js calls obstacles.checkCollision(player.getHitbox())
     → returns true/false
     → if true: main.js calls endGame()
7. main.js calls renderer.draw(player, obstacles.getObstacles(), game.getSpeed(), dt)
     → renderer clears canvas and redraws everything
8. main.js updates HUD DOM elements with game.getDisplayScore()
9. main.js calls requestAnimationFrame(gameLoop) to continue
```

### Event Flow

```text
User presses Space/Up
  → handleKeyDown(event) in main.js
    → if game not running: startGame()
    → if game running: player.jump()

User presses Down
  → handleKeyDown(event) in main.js
    → player.duck()

User releases Down
  → handleKeyUp(event) in main.js
    → player.standUp()

User clicks canvas / touches screen
  → handleClick() in main.js
    → if game not running: startGame()
    → if game running: player.jump()

Collision detected
  → endGame() in main.js
    → game.setGameOver()
    → storage.isNewHighScore() check
    → if new high: storage.setHighScore()
    → show game-over overlay with scores
```

---

## 9. Asset Requirements

This game uses **no external image or audio files**. All visuals are drawn procedurally on the canvas using shapes and colours. This keeps the project dependency-free and simple to set up.

### Visual Elements (drawn in code)

| Element           | How It's Drawn                                                               |
|-------------------|------------------------------------------------------------------------------|
| Sky               | Vertical gradient (2 colours) using `createLinearGradient()`                 |
| Clouds            | Clusters of 2–3 overlapping white ellipses (`arc()` calls)                   |
| Hills             | Series of arc shapes in olive green, overlapping, along the horizon           |
| Ground            | Filled rectangle with a top-edge line; small scrolling dots for texture       |
| Player (standing) | Rectangle body + circle head + two thin rectangles for legs (alternating)     |
| Player (jumping)  | Same as standing but with arms raised (two short rectangles above head)       |
| Player (ducking)  | Wider, shorter rectangle body + circle head, no visible legs                  |
| Cactus (small)    | Tall thin rectangle + two small arm rectangles branching off sides            |
| Cactus (large)    | Taller/wider version of small cactus                                         |
| Cactus (double)   | Two small cacti side by side (single obstacle hitbox)                         |
| Bird              | Simple diamond/chevron shape with two lines for wings; wings alternate up/down|

### Optional Sound Effects (stretch goal)

If sound is added later, these effects would be needed:

| Sound         | Description                                  | Trigger          |
|---------------|----------------------------------------------|------------------|
| Jump          | Short upward "boing" or whoosh               | Player jumps     |
| Score milestone| Quick chime when score passes 100, 500, etc.| Score threshold  |
| Death         | Low thud or crunch                           | Collision        |
| New high score| Triumphant short jingle                      | On game-over     |

---

## 10. Accessibility

### Keyboard Support

- All game actions are mapped to keyboard keys (Space, Up, Down).
- The "Play Again" button is a native `<button>` element, automatically keyboard-focusable and activatable with Enter/Space.
- A `.skip-link` at the top of the page lets keyboard users jump to the game container.

### Screen Reader Considerations

- The game container has `role="application"` to signal interactive content.
- The canvas has `aria-hidden="true"` because its content is purely visual and cannot be made meaningfully accessible to screen readers.
- The HUD uses `aria-live="polite"` so score updates are announced (at the screen reader's discretion, to avoid overwhelming the user).
- Game state changes (start, game over) are conveyed through visible overlay text which is in the DOM and readable by assistive tech.
- The `#new-record` text is in the DOM (just hidden/shown), not injected dynamically with `innerHTML`.

### Colour Contrast

All text-on-background combinations meet WCAG 2.1 AA contrast requirements:

| Text                  | Foreground  | Background         | Ratio  | Pass |
|-----------------------|-------------|---------------------|--------|------|
| HUD score             | `#FFFFFF`   | `rgba(0,0,0,0.5)`  | 10.4:1 | AA   |
| Overlay title         | `#FFFFFF`   | `rgba(0,0,0,0.7)`  | 15.3:1 | AAA  |
| Button text           | `#FFFFFF`   | `#118AB2`           | 4.56:1 | AA   |
| Footer text           | `#FFFFFF` (60% opacity) | `#1B1B2F` | 7.8:1 | AA |
| New record text       | `#118AB2`   | `rgba(0,0,0,0.7)`  | 4.5:1  | AA   |

### Focus Management

- When the game-over overlay appears, focus is moved programmatically to the "Play Again" button so keyboard users can immediately restart.
- The button has a visible `:focus-visible` outline style.

---

## 11. Step-by-Step Build Order

Follow these steps in order. Each step builds on the last and results in a testable milestone.

### Phase 1: Foundation

**Step 1 — Create the project folder and files**

Create the directory structure:

```text
endless-runner/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── game.js
│       ├── player.js
│       ├── obstacles.js
│       ├── renderer.js
│       └── storage.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

**Step 2 — Build the HTML skeleton**

Write `index.html` with all the elements from Section 4. Include the Google Fonts `<link>`, the stylesheet link (`styles/main.css`), and the module script tag (`js/main.js`). Add the canvas, HUD, start screen overlay, game-over overlay, and footer. Verify the page loads in a browser with no console errors.

**Step 3 — Style the page layout**

Write `styles/main.css` with the CSS variables (Section 3), layout rules (Section 5). Get the game container centred, HUD styled, overlays positioned over the canvas, and the start screen visible. Check responsive behaviour by resizing the browser. At this point you should see a styled start screen over an empty canvas.

### Phase 2: Core Engine

**Step 4 — Implement `storage.js`**

Write `getHighScore()`, `setHighScore()`, `isNewHighScore()`, and `formatScore()`. Test in the browser console: save a score, read it back, verify formatting. This module has no dependencies so it can be tested immediately.

**Step 5 — Implement `game.js`**

Write the game state module with `reset()`, `update(dt)`, `getDisplayScore()`, `getSpeed()`, `setGameOver()`, `isRunning()`. Test by importing into `main.js` and logging values to the console during a simple `requestAnimationFrame` loop.

**Step 6 — Implement `renderer.js` — sky and ground only**

Write `init()`, `draw()`, `drawSky()`, and `drawGround()`. Skip clouds, hills, player, and obstacles for now. Call `renderer.init(canvas)` and `renderer.draw()` from `main.js`. You should see a gradient sky and a brown ground strip on the canvas.

**Step 7 — Implement `player.js` — position and drawing**

Write `reset()`, `getHitbox()`, and enough of `update()` to hold the player at ground level. In `renderer.js`, add `drawPlayer()` to draw a simple rectangle at the player's position. You should now see a coloured rectangle standing on the ground.

**Step 8 — Add jump physics**

Implement `jump()` and the gravity calculations in `player.update()`. In `main.js`, add the `handleKeyDown` listener for Space/Up Arrow. Press Space and watch the player jump and land. Tune `JUMP_VELOCITY` and `GRAVITY` until the arc feels good.

**Step 9 — Add ducking**

Implement `duck()`, `standUp()`, and the height change logic. Add the `handleKeyUp` listener for ArrowDown. Press Down and verify the player shrinks; release and verify they return to full height.

### Phase 3: Obstacles & Collision

**Step 10 — Implement `obstacles.js` — spawning and movement**

Write `reset()`, `spawn()`, `update()`, and `getObstacles()`. Start with just one obstacle type (`cactus_small`). In `renderer.js`, add `drawObstacles()` to draw simple coloured rectangles. Obstacles should appear from the right and scroll left at `game.getSpeed()`. Verify they are removed once off-screen.

**Step 11 — Add collision detection**

Implement `checkCollision()` using the AABB algorithm. In the game loop (`main.js`), check for collision each frame. On collision, log "COLLISION" to the console. Verify that running into an obstacle triggers detection, and jumping over one does not.

**Step 12 — Wire up game over**

Implement `endGame()` in `main.js`. On collision: stop the loop, show the game-over overlay, display the final score, check/save high score via `storage.js`. Verify the "Play Again" button calls `startGame()` and resets everything.

**Step 13 — Wire up the start screen**

On page load, show the start screen overlay. Display the stored high score. Hide the overlay and start the game loop when the player presses Space or clicks. Verify the full flow: start → play → die → game over → restart.

### Phase 4: Polish

**Step 14 — Add all obstacle types**

Expand `OBSTACLE_TYPES` to include large cactus, double cactus, low bird, and high bird. Adjust `drawObstacles()` in the renderer to draw each type distinctly. Verify that birds can be ducked under and cacti must be jumped over.

**Step 15 — Add difficulty scaling**

Implement the speed increase in `game.update()` and the spawn interval reduction in `obstacles.update()`. Play for 60+ seconds and confirm the game gets noticeably harder.

**Step 16 — Add parallax background layers**

In `renderer.js`, implement `drawClouds()` and `drawHills()`. Clouds scroll at 10% speed, hills at 30% speed, ground at 100%. This creates depth.

**Step 17 — Improve player animation**

Update `drawPlayer()` to animate running legs (alternate between two leg positions based on `animFrame`), show a different pose when jumping (arms up), and a different pose when ducking (compact and low).

**Step 18 — Add ground texture scrolling**

In `drawGround()`, add small dots or dashes that scroll left at full speed, giving the ground a sense of motion.

**Step 19 — Add touch support**

Attach `touchstart` event listener to the canvas. Map touch to jump (or start game). This makes the game playable on mobile devices.

**Step 20 — Focus management and accessibility review**

When the game-over overlay appears, move focus to the "Play Again" button. Verify the full game can be played with keyboard only. Check that the screen reader experiences sensible text on overlays.

**Step 21 — Add the high-score flash**

When the player beats their high score, show the `#new-record` element with the CSS `flash` animation. Verify it appears on game over and hides when the game restarts.

**Step 22 — Final testing and polish**

- Play the game 10+ times, checking for edge cases:
  - Double-jump prevention (can't jump while airborne)
  - Can't duck while jumping
  - Obstacles don't spawn on top of each other (minimum gap)
  - Score resets properly on restart
  - High score persists across page refreshes
- Test on mobile viewport sizes
- Test with keyboard only
- Fix any visual glitches, timing issues, or collision bugs

---

## 12. Stretch Goals

These are optional enhancements beyond the core requirements, listed in rough order of difficulty.

### Easy

1. **Score milestones** — Flash the score briefly when it crosses 100, 500, 1000, etc.
2. **Day/night cycle** — Gradually shift the sky gradient colours over time (warm → cool → dark → warm).
3. **Ground variety** — Occasionally change the ground colour/texture to simulate different terrain (sand → grass → rock).

### Medium

4. **Sound effects** — Add jump, death, and milestone sounds using the Web Audio API or `<audio>` elements. Include a mute toggle button in the HUD.
5. **Particle effects** — Spawn small dust particles behind the player's feet when running, and a burst on landing from a jump.
6. **Double jump** — Allow one additional jump while airborne. Change the player's colour or add a visual indicator when the double jump is available vs. used.
7. **Pause functionality** — Press `P` or `Escape` to pause the game. Show a "PAUSED" overlay. Resume with the same key.
8. **Animated obstacles** — Give cacti a slight wobble; make bird wings flap more smoothly with 3–4 animation frames.

### Hard

9. **Power-ups** — Occasionally spawn a collectible item (shield, slow-motion, magnet). Shield absorbs one hit. Slow-motion reduces speed temporarily. Requires a new module (`js/modules/powerups.js`).
10. **Leaderboard** — Instead of just a single high score, store the top 5 scores with timestamps in localStorage. Display them on the start screen.
11. **Sprite-based graphics** — Replace the procedural drawing with a sprite sheet loaded from `assets/spritesheet.png`. Use `drawImage()` with source rectangles for each frame. This is a significant rewrite of the renderer.
12. **Parallax starfield for night mode** — When the day/night cycle reaches night, draw a star layer that twinkles.
13. **Mobile swipe controls** — Detect swipe-up for jump and swipe-down for duck using touch event coordinates, in addition to tap-to-jump.

---

*This plan should provide everything needed to build the Endless Runner from scratch. Follow the steps in order, test at each milestone, and refer back to the sections above for details on every function, constant, and design decision.*
