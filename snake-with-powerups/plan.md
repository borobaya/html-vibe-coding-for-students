# Snake with Power-Ups — Implementation Plan

## 1. Overview

A browser-based reimagining of the classic Snake game, rendered on an HTML5 Canvas element with vanilla JavaScript (ES2022+, ES modules). The snake moves on a grid, eats food to grow and score points, and collects randomly spawning power-ups that temporarily alter gameplay — speed boost, slow-motion, 2× score multiplier, shield (survive one self-collision), and shrink (instantly remove tail segments). Difficulty increases progressively as the score climbs: the base tick rate shortens, making the snake faster. High scores persist via `localStorage`. The game supports two wall modes — classic (collision = game over) and wrap-around (snake re-enters from the opposite edge). All visuals use a retro neon palette on a dark background, with distinct shapes per power-up for colourblind accessibility.

---

## 2. Page Layout & Wireframe

```text
┌──────────────────────────────────────────────────────────┐
│  HEADER BAR (fixed height, full width)                   │
│  ┌────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │ SCORE: 042 │  │ HIGH: 128     │  │ ⚡ SPEED 4.2s   │ │
│  └────────────┘  └───────────────┘  └─────────────────┘ │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    GAME CANVAS                           │
│              (centred, square, 600×600)                   │
│                                                          │
│            ┌──────────────────────────┐                  │
│            │                          │                  │
│            │    20 × 20 grid cells    │                  │
│            │    each cell = 30 px     │                  │
│            │                          │                  │
│            │   🐍  ●  ⚡               │                  │
│            │                          │                  │
│            └──────────────────────────┘                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  FOOTER CONTROLS BAR                                     │
│  [ ▶ Start ]  [ ⏸ Pause ]  [ 🔄 Restart ]  [Wall Mode] │
└──────────────────────────────────────────────────────────┘

GAME OVER OVERLAY (centred on canvas, semi-transparent bg):
┌─────────────────────────┐
│       GAME OVER         │
│     Score: 042          │
│   High Score: 128       │
│   [ Play Again ]        │
└─────────────────────────┘
```

### Element Breakdown

| Area | Content | Notes |
|---|---|---|
| Header bar | Current score, high score, active power-up indicator with countdown timer | Stays visible during gameplay |
| Game canvas | 600 × 600 px `<canvas>` (scales responsively) | Grid of 20 × 20 cells, each 30 px |
| Footer controls | Start, Pause/Resume, Restart buttons, wall-mode toggle | Keyboard shortcuts mirror buttons |
| Game-over overlay | Semi-transparent overlay on the canvas with final score, high score, and a "Play Again" button | Rendered via canvas drawing or a positioned `<div>` |
| Active power-up indicator | Icon + name + remaining seconds (countdown bar or numeric) | Appears in header only while a power-up is active |

---

## 3. Colour Scheme & Typography

### Palette (Retro Neon on Dark)

| Role | Hex | Swatch | Usage |
|---|---|---|---|
| Background (page) | `#0a0a0a` | Near-black | `body` background |
| Canvas background | `#111111` | Charcoal | Canvas fill each frame |
| Grid lines | `#1a1a1a` | Subtle dark grey | 1 px grid overlay |
| Snake head | `#39ff14` | Neon green | Head segment |
| Snake body | `#2ecc40` | Medium green | Body segments (gradient optional) |
| Normal food | `#ff4136` | Bright red | Standard food dot |
| Speed boost power-up | `#ffdc00` | Neon yellow | Lightning-bolt shape |
| Slow-motion power-up | `#00bfff` | Electric blue | Snowflake/clock shape |
| Score multiplier power-up | `#b10dc9` | Vivid purple | Star shape |
| Shield power-up | `#2ecc40` | Emerald green | Circle-with-cross shape |
| Shrink power-up | `#ff851b` | Bright orange | Down-arrow shape |
| HUD text | `#e0e0e0` | Light grey | Scores, labels |
| HUD accent | `#39ff14` | Neon green | Active power-up name |
| Game-over overlay bg | `rgba(0, 0, 0, 0.75)` | Semi-transparent black | Overlay backdrop |
| Game-over text | `#ffffff` | White | Heading and score |
| Buttons | `#39ff14` text on `#1a1a1a` bg | Neon green / dark | Control buttons |
| Button hover | `#2ecc40` text, `#222` bg | Slightly brighter | Hover state |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page title / Game Over heading | `"Press Start 2P"`, `monospace` fallback | 24 px | 400 |
| HUD scores | `"Press Start 2P"`, `monospace` | 14 px | 400 |
| Power-up indicator | `"Press Start 2P"`, `monospace` | 12 px | 400 |
| Buttons | `"Press Start 2P"`, `monospace` | 12 px | 400 |

Font loaded via Google Fonts link in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

### Grid Style

- Grid lines drawn every 30 px in `#1a1a1a` (1 px stroke, 0.3 opacity) to create a subtle tiled look without distracting from gameplay.
- Optional: every 5th line slightly brighter (`#222222`) for spatial reference.

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snake with Power-Ups</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- HUD (heads-up display) -->
  <header class="hud" role="banner">
    <div class="hud__score">
      <span class="hud__label">Score</span>
      <span id="current-score" class="hud__value">0</span>
    </div>
    <div class="hud__high-score">
      <span class="hud__label">High</span>
      <span id="high-score" class="hud__value">0</span>
    </div>
    <div class="hud__powerup" id="powerup-indicator" aria-live="polite" hidden>
      <span id="powerup-icon" class="hud__powerup-icon" aria-hidden="true"></span>
      <span id="powerup-name" class="hud__powerup-name"></span>
      <span id="powerup-timer" class="hud__powerup-timer"></span>
    </div>
  </header>

  <!-- Game area -->
  <main class="game-area" role="main">
    <canvas id="game-canvas" width="600" height="600"
            aria-label="Snake game board" tabindex="0"></canvas>

    <!-- Game-over overlay (hidden by default) -->
    <div id="game-over-overlay" class="overlay" hidden>
      <h2 class="overlay__title">Game Over</h2>
      <p class="overlay__score">Score: <span id="final-score">0</span></p>
      <p class="overlay__high">High Score: <span id="final-high-score">0</span></p>
      <button id="btn-play-again" class="btn btn--primary">Play Again</button>
    </div>

    <!-- Start screen overlay (visible initially) -->
    <div id="start-overlay" class="overlay">
      <h1 class="overlay__title">Snake</h1>
      <p class="overlay__subtitle">with Power-Ups</p>
      <button id="btn-start" class="btn btn--primary">Start Game</button>
    </div>
  </main>

  <!-- Controls footer -->
  <footer class="controls" role="contentinfo">
    <button id="btn-start-footer" class="btn" aria-label="Start game">▶ Start</button>
    <button id="btn-pause" class="btn" aria-label="Pause game" disabled>⏸ Pause</button>
    <button id="btn-restart" class="btn" aria-label="Restart game" disabled>🔄 Restart</button>
    <label class="controls__toggle">
      <input type="checkbox" id="wall-mode-toggle" checked>
      <span>Wall Collision</span>
    </label>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Points

- `<canvas>` carries `tabindex="0"` so it can receive keyboard focus.
- `aria-live="polite"` on the power-up indicator announces changes to screen readers.
- Overlay `<div>`s are positioned absolutely over the canvas container.
- Single `<script type="module">` entry point loads all modules.

---

## 5. CSS Design

### File: `styles/main.css`

```text
Sections within main.css:
  1. CSS custom properties (variables)
  2. Reset / base styles
  3. Typography (Google Font)
  4. HUD layout
  5. Game area & canvas sizing
  6. Overlay styles
  7. Controls footer
  8. Power-up indicator animations
  9. Buttons
 10. Responsive breakpoints
```

### 5.1 CSS Custom Properties

```css
:root {
  --bg-page: #0a0a0a;
  --bg-canvas: #111111;
  --grid-line: #1a1a1a;
  --snake-head: #39ff14;
  --snake-body: #2ecc40;
  --food: #ff4136;
  --pu-speed: #ffdc00;
  --pu-slow: #00bfff;
  --pu-multiplier: #b10dc9;
  --pu-shield: #2ecc40;
  --pu-shrink: #ff851b;
  --text-primary: #e0e0e0;
  --text-accent: #39ff14;
  --overlay-bg: rgba(0, 0, 0, 0.75);
  --btn-bg: #1a1a1a;
  --btn-text: #39ff14;
  --btn-hover-bg: #222222;
  --font-game: "Press Start 2P", monospace;
  --canvas-size: 600px;
  --cell-size: 30px;
}
```

### 5.2 Canvas Sizing

```css
.game-area {
  position: relative;          /* anchor for overlays */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

#game-canvas {
  display: block;
  width: var(--canvas-size);
  height: var(--canvas-size);
  max-width: 100vw;
  max-height: 100vw;           /* keep square on small screens */
  border: 2px solid var(--snake-head);
  image-rendering: pixelated;  /* crisp pixel look */
}
```

### 5.3 HUD Layout

```css
.hud {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 1rem;
  background: var(--bg-page);
  font-family: var(--font-game);
  color: var(--text-primary);
  flex-wrap: wrap;
}
```

### 5.4 Power-Up Indicator Animations

```css
/* Pulsing glow while a power-up is active */
@keyframes powerup-pulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 6px var(--text-accent); }
  50%      { opacity: 0.6; text-shadow: 0 0 12px var(--text-accent); }
}

.hud__powerup:not([hidden]) {
  animation: powerup-pulse 1s ease-in-out infinite;
}

/* Fast blink in last 3 seconds */
@keyframes powerup-expiring {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
}

.hud__powerup--expiring {
  animation: powerup-expiring 0.4s ease-in-out infinite;
}
```

### 5.5 Game-Over Overlay

```css
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--overlay-bg);
  z-index: 10;
  font-family: var(--font-game);
  color: #ffffff;
  gap: 1rem;
}

.overlay[hidden] {
  display: none;
}
```

### 5.6 Responsive Breakpoints

```css
@media (max-width: 640px) {
  :root { --canvas-size: 90vw; --cell-size: calc(90vw / 20); }
  .hud { font-size: 10px; gap: 1rem; }
}

@media (max-width: 400px) {
  .controls { flex-direction: column; gap: 0.5rem; }
}
```

---

## 6. JavaScript Architecture

### Module Dependency Graph

```text
main.js
  ├── modules/grid.js          (pure config, no deps)
  ├── modules/input.js          (depends on: grid)
  ├── modules/snake.js          (depends on: grid)
  ├── modules/food.js           (depends on: grid, snake)
  ├── modules/powerups.js       (depends on: grid, snake, food)
  ├── modules/renderer.js       (depends on: grid)
  ├── modules/storage.js        (no deps)
  └── (DOM references)
```

---

### 6.1 `js/main.js` — Entry Point & Game Loop

**Purpose:** Initialises the game, owns the game-loop tick, coordinates all modules, and binds UI controls.

#### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `gameState` | `"idle" \| "playing" \| "paused" \| "over"` | Current state machine state |
| `score` | `number` | Current score this round |
| `baseTickInterval` | `number` | Starting ms between ticks (e.g. 150) |
| `currentTickInterval` | `number` | Active ms between ticks (modified by power-ups & progressive speed) |
| `lastTickTime` | `number` | Timestamp of last movement tick |
| `animationFrameId` | `number` | ID from `requestAnimationFrame` for cancellation |
| `wallMode` | `boolean` | `true` = walls kill, `false` = wrap-around |

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Grabs DOM refs, loads high score, attaches event listeners, draws start screen |
| `startGame()` | — | `void` | Resets score, creates snake/food, sets state to `"playing"`, begins loop |
| `gameLoop(timestamp)` | `timestamp: number` (from rAF) | `void` | Called every frame; checks if enough time elapsed since `lastTickTime`; if yes, calls `tick()`. Always calls `render()`. Requests next frame. |
| `tick()` | — | `void` | Advances game by one step: process input queue → move snake → check collisions → check food → check power-ups → update score → adjust speed |
| `render()` | — | `void` | Delegates to `renderer.draw()` with current game objects |
| `pauseGame()` | — | `void` | Sets state to `"paused"`, cancels rAF |
| `resumeGame()` | — | `void` | Sets state to `"playing"`, restarts rAF loop |
| `endGame()` | — | `void` | Sets state to `"over"`, saves high score, shows game-over overlay |
| `restartGame()` | — | `void` | Calls `endGame()` clean-up then `startGame()` |
| `updateHUD()` | — | `void` | Updates score, high score, and power-up indicator in the DOM |
| `adjustSpeed()` | — | `void` | Calculates `currentTickInterval` from base − (score-based reduction) ± power-up modifier. Clamps to min 50 ms. |

#### Game Loop Strategy

Uses `requestAnimationFrame` for smooth rendering, but movement advances only when `timestamp - lastTickTime >= currentTickInterval`. This decouples render rate (60 fps) from game-logic tick rate (variable, starts ~150 ms).

```text
requestAnimationFrame loop:
  ┌─ elapsed = now - lastTickTime
  │  if elapsed >= currentTickInterval:
  │    tick()              ← game logic
  │    lastTickTime = now
  └─ render()              ← always draw
     requestAnimationFrame(gameLoop)
```

---

### 6.2 `js/modules/snake.js` — Snake Entity

**Purpose:** Manages the snake's body segments, direction, movement, growth, and self-collision detection.

#### Data Structures

```js
// Each segment is a grid coordinate
// { x: number, y: number }
// body[0] = head, body[body.length-1] = tail
let body = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };  // not moving until first input
let growthPending = 0;            // segments to add on next moves
let hasShield = false;            // shield power-up flag
```

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `createSnake(startX, startY, length)` | `startX: number`, `startY: number`, `length: number` | `{ body: Array, direction: Object }` | Creates a fresh snake at the given grid position with the specified number of initial segments extending leftward |
| `getHead()` | — | `{ x: number, y: number }` | Returns a copy of the head segment |
| `getBody()` | — | `Array<{ x: number, y: number }>` | Returns the full body array (reference; treat as read-only externally) |
| `setDirection(newDir)` | `newDir: { x: number, y: number }` | `boolean` | Sets direction if valid (not 180° reversal). Returns `true` if accepted |
| `move(wrapMode, gridCols, gridRows)` | `wrapMode: boolean`, `gridCols: number`, `gridRows: number` | `{ x: number, y: number }` | Advances the head by one cell in the current direction. If `wrapMode` is true, wraps coordinates; otherwise returns the raw new position. Removes tail unless `growthPending > 0`. Returns new head position |
| `grow(amount)` | `amount: number` (default 1) | `void` | Increases `growthPending` by `amount` |
| `shrink(amount)` | `amount: number` | `void` | Removes up to `amount` segments from the tail. Minimum body length is 1 (head only) |
| `checkSelfCollision()` | — | `boolean` | Returns `true` if the head occupies the same cell as any body segment (index ≥ 1) |
| `setShield(active)` | `active: boolean` | `void` | Enables/disables the shield flag |
| `hasActiveShield()` | — | `boolean` | Returns current shield status |
| `consumeShield()` | — | `void` | Deactivates shield (used after surviving one collision) |
| `reset()` | — | `void` | Resets all internal state to defaults |
| `getLength()` | — | `number` | Returns `body.length` |

---

### 6.3 `js/modules/food.js` — Food Spawning

**Purpose:** Places food items on the grid, avoiding occupied cells. Distinguishes between normal food and power-up food.

#### Data Structures

```js
// { x: number, y: number, type: "normal" | "powerup", powerupKind?: string }
let currentFood = null;
```

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `spawnFood(occupiedCells, gridCols, gridRows, spawnPowerup)` | `occupiedCells: Array<{x,y}>`, `gridCols: number`, `gridRows: number`, `spawnPowerup: boolean` | `{ x: number, y: number, type: string, powerupKind?: string }` | Generates a random grid position not in `occupiedCells`. If `spawnPowerup` is `true`, assigns a random `powerupKind`. Returns the food object |
| `getFood()` | — | `Object \| null` | Returns the current food item |
| `clearFood()` | — | `void` | Sets `currentFood` to `null` |
| `isFoodAt(x, y)` | `x: number`, `y: number` | `boolean` | Checks if the current food is at the given position |
| `getRandomEmptyCell(occupiedCells, gridCols, gridRows)` | `occupiedCells: Array<{x,y}>`, `gridCols: number`, `gridRows: number` | `{ x: number, y: number }` | Utility: picks a random cell not occupied. Used internally and by `powerups.js` |

#### Spawn Logic

1. Build a set of occupied cell keys (`"x,y"` strings) from the snake body + any existing power-up positions.
2. Generate random `x` in `[0, gridCols)` and `y` in `[0, gridRows)`.
3. If occupied, retry (max 100 attempts; if grid is nearly full, iterate all empty cells and pick randomly).
4. Decide type: if `spawnPowerup` flag is true (determined by caller based on spawn-rate probability), select a `powerupKind` using weighted random (see §8).

---

### 6.4 `js/modules/powerups.js` — Power-Up System

**Purpose:** Defines power-up types, manages active power-up state, applies/removes effects, handles duration timers.

#### Power-Up Type Definitions

```js
const POWERUP_TYPES = {
  speed:      { name: "Speed Boost",     colour: "#ffdc00", shape: "lightning", duration: 5, probability: 0.25 },
  slow:       { name: "Slow-Motion",     colour: "#00bfff", shape: "snowflake", duration: 6, probability: 0.25 },
  multiplier: { name: "2× Score",        colour: "#b10dc9", shape: "star",      duration: 8, probability: 0.20 },
  shield:     { name: "Shield",          colour: "#2ecc40", shape: "circle",    duration: 10, probability: 0.15 },
  shrink:     { name: "Shrink",          colour: "#ff851b", shape: "arrow",     duration: 0,  probability: 0.15 },
};
```

#### Active Power-Up State

```js
let activePowerup = null;
// { kind: string, name: string, remainingMs: number, totalMs: number }
```

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `getPowerupTypes()` | — | `Object` | Returns the `POWERUP_TYPES` dictionary |
| `pickRandomPowerup()` | — | `string` | Selects a powerup kind using the weighted probabilities |
| `activate(kind, applyEffectCallback)` | `kind: string`, `applyEffectCallback: Function` | `void` | Sets `activePowerup`, calls `applyEffectCallback(kind)` to let `main.js` apply the game-state change (speed modification, shield flag, score multiplier flag, or immediate shrink) |
| `getActive()` | — | `Object \| null` | Returns the current active power-up or `null` |
| `updateTimer(deltaMs)` | `deltaMs: number` | `boolean` | Decrements `remainingMs` by `deltaMs`. Returns `true` if the power-up just expired |
| `deactivate(removeEffectCallback)` | `removeEffectCallback: Function` | `void` | Clears `activePowerup`, calls `removeEffectCallback(kind)` to revert game-state changes |
| `isExpiringSoon()` | — | `boolean` | Returns `true` if `remainingMs` ≤ 3000 (triggers fast-blink CSS class on HUD) |
| `reset()` | — | `void` | Clears active power-up without calling callbacks |

#### Stacking Rules

- **No stacking.** Collecting a new power-up while one is active immediately replaces the current one (the old effect is removed first, then the new effect is applied).
- Shrink is **instant** — has `duration: 0`, so it never occupies the `activePowerup` slot. It fires once and is done.

---

### 6.5 `js/modules/grid.js` — Grid Configuration

**Purpose:** Central source of truth for grid dimensions and boundary helpers.

#### Exported Constants & Functions

| Export | Type | Value / Purpose |
|---|---|---|
| `COLS` | `number` | `20` — number of columns |
| `ROWS` | `number` | `20` — number of rows |
| `CELL_SIZE` | `number` | `30` — px per cell |
| `CANVAS_WIDTH` | `number` | `COLS * CELL_SIZE` = 600 |
| `CANVAS_HEIGHT` | `number` | `ROWS * CELL_SIZE` = 600 |
| `isOutOfBounds(x, y)` | `(number, number) → boolean` | Returns `true` if `x < 0 || x >= COLS || y < 0 || y >= ROWS` |
| `wrapPosition(x, y)` | `(number, number) → { x: number, y: number }` | Wraps coordinates: `((x % COLS) + COLS) % COLS`, same for `y` |
| `cellToPixel(cellX, cellY)` | `(number, number) → { px: number, py: number }` | Converts grid coordinates to top-left pixel position: `{ px: cellX * CELL_SIZE, py: cellY * CELL_SIZE }` |

---

### 6.6 `js/modules/renderer.js` — Canvas Drawing

**Purpose:** All canvas 2D rendering logic. Receives game state each frame and draws everything.

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init(canvasElement)` | `canvasElement: HTMLCanvasElement` | `CanvasRenderingContext2D` | Stores canvas ref, gets 2D context, returns it |
| `clear()` | — | `void` | Fills entire canvas with `--bg-canvas` colour |
| `drawGrid()` | — | `void` | Draws vertical and horizontal grid lines at `CELL_SIZE` intervals in `--grid-line` colour |
| `drawSnake(body, hasShield)` | `body: Array<{x,y}>`, `hasShield: boolean` | `void` | Draws each segment as a filled rounded rect. Head gets `--snake-head` colour and is slightly larger. Body segments use `--snake-body`. If shield is active, draws a faint glowing outline around the head |
| `drawFood(food)` | `food: { x, y, type, powerupKind? }` | `void` | If `type === "normal"`: draw a filled circle in `--food` colour. If `type === "powerup"`: draw the shape defined by `powerupKind` (see §8) in the corresponding colour |
| `drawPowerupShape(x, y, kind, colour)` | `x: number`, `y: number`, `kind: string`, `colour: string` | `void` | Draws a specific shape (lightning bolt, snowflake, star, circle-cross, down-arrow) at the given grid cell. Each shape is distinct for colourblind accessibility |
| `drawGameOver(score, highScore)` | `score: number`, `highScore: number` | `void` | (Optional — used if rendering game-over via canvas instead of DOM overlay.) Draws semi-transparent overlay + text |
| `drawStartScreen()` | — | `void` | Draws the initial "Press Start" screen on the canvas |

#### Rendering Order (per frame)

1. `clear()` — wipe canvas
2. `drawGrid()` — background grid
3. `drawFood(food)` — food item
4. `drawSnake(body, hasShield)` — snake on top of food so head is visible
5. (If game over) `drawGameOver()` — overlay

---

### 6.7 `js/modules/input.js` — Keyboard Handler

**Purpose:** Listens for keyboard events, translates arrow keys to direction vectors, maintains a direction queue to prevent 180° reversals and handle rapid key presses within a single tick.

#### Data Structures

```js
const DIRECTION_MAP = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
};

let directionQueue = [];   // max length 2
let currentDirection = { x: 0, y: 0 };
```

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Adds `keydown` listener to `document` |
| `getNextDirection()` | — | `{ x: number, y: number }` | Dequeues the next direction from `directionQueue` (if any). Returns it. If queue is empty, returns `currentDirection` |
| `setCurrentDirection(dir)` | `dir: { x: number, y: number }` | `void` | Updates `currentDirection` (called after a move is applied, so 180° check uses the post-move direction) |
| `reset()` | — | `void` | Clears queue, resets `currentDirection` to `{ x: 0, y: 0 }` |
| `destroy()` | — | `void` | Removes the `keydown` listener |

#### 180° Prevention Logic

When a key is pressed:

1. Look up direction vector from `DIRECTION_MAP`.
2. Determine the "reference direction" = last item in `directionQueue`, or `currentDirection` if queue is empty.
3. If `newDir.x + refDir.x === 0 && newDir.y + refDir.y === 0`, the move is a 180° reversal → **reject**.
4. If `newDir` equals the reference direction → **reject** (redundant).
5. Otherwise push onto `directionQueue` (cap at 2 entries to prevent overflow).

---

### 6.8 `js/modules/storage.js` — Local Storage

**Purpose:** Read/write high score to `localStorage`. Wrapped in try/catch for environments where storage is disabled.

#### Exported Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `getHighScore()` | — | `number` | Reads `"snake-highscore"` from `localStorage`. Returns `0` if not found or on error |
| `setHighScore(score)` | `score: number` | `void` | Writes `score` to `localStorage` under key `"snake-highscore"` if it exceeds the current stored value |
| `clearHighScore()` | — | `void` | Removes the key from `localStorage` |

---

## 7. Game Mechanics

### 7.1 Movement Tick System

- The game uses a **variable-rate tick** controlled by `currentTickInterval` (milliseconds).
- `requestAnimationFrame` runs at display refresh rate (~60 fps). Each frame, a timestamp comparison determines whether a tick should fire.
- **Base interval:** 150 ms (≈6.67 cells/second).
- **Progressive speed-up:** Every 5 points scored, reduce `baseTickInterval` by 5 ms, down to a floor of 80 ms.
- Power-ups temporarily override `currentTickInterval`:
  - Speed boost: `currentTickInterval = baseTickInterval * 0.5` (twice as fast).
  - Slow-motion: `currentTickInterval = baseTickInterval * 2.0` (half speed).

### 7.2 Collision Detection

| Collision Type | Detection | Outcome |
|---|---|---|
| **Wall (wall mode on)** | After moving head, call `grid.isOutOfBounds(head.x, head.y)` | Game over |
| **Wall (wrap mode)** | After moving head, call `grid.wrapPosition(head.x, head.y)` and update head | Snake appears on opposite side |
| **Self** | After moving, `snake.checkSelfCollision()` compares head with body[1..n] | If shield active → consume shield, survive. Otherwise → game over |
| **Food** | After moving, compare `head.x === food.x && head.y === food.y` | Eat food → grow snake, add score, spawn new food |
| **Power-up food** | Same position check; `food.type === "powerup"` | Eat → activate power-up effect, spawn new normal food |

### 7.3 Scoring

| Event | Points |
|---|---|
| Eat normal food | 10 |
| Eat food while 2× multiplier active | 20 |
| Eat power-up food (triggers effect, also scores) | 15 (or 30 with 2×) |

### 7.4 Power-Up Spawn Rate

- After eating food and spawning a replacement, roll a random number.
- **20% chance** the new food item is a power-up food instead of normal food.
- Only one food item exists on the grid at a time (either normal or power-up).
- A power-up food stays on the grid until eaten; it does not expire or despawn.

### 7.5 Power-Up Duration & Stacking

- Each power-up (except shrink) lasts a fixed number of seconds (see §8 table).
- Duration countdown is managed in `powerups.updateTimer(deltaMs)` called each tick.
- **No simultaneous power-ups.** A new pickup replaces the active one.
- The HUD indicator shows remaining time and blinks fast when ≤ 3 seconds remain.

### 7.6 Progressive Difficulty Formula

```js
const BASE_INTERVAL = 150;
const SPEED_REDUCTION_PER_5_POINTS = 5;
const MIN_INTERVAL = 80;

function calculateBaseInterval(score) {
  const reduction = Math.floor(score / 5) * SPEED_REDUCTION_PER_5_POINTS;
  return Math.max(MIN_INTERVAL, BASE_INTERVAL - reduction);
}
```

At score 0 → 150 ms, score 5 → 145 ms, score 10 → 140 ms, …, score 70+ → 80 ms (floor).

---

## 8. Power-Up Details

| Power-Up | Visual Shape | Colour | Effect on Gameplay | Duration | Spawn Probability |
|---|---|---|---|---|---|
| **Speed Boost** | Lightning bolt (zig-zag path) | `#ffdc00` Neon yellow | Halves `currentTickInterval` → snake moves 2× faster | 5 seconds | 25% |
| **Slow-Motion** | Snowflake / clock (6-armed radial) | `#00bfff` Electric blue | Doubles `currentTickInterval` → snake moves at half speed | 6 seconds | 25% |
| **2× Score** | 5-pointed star | `#b10dc9` Vivid purple | All food eaten during effect scores double points | 8 seconds | 20% |
| **Shield** | Circle with inner cross | `#2ecc40` Emerald green | Snake survives exactly one self-collision, then shield breaks | 10 seconds (or until used) | 15% |
| **Shrink** | Downward-pointing arrow / chevron | `#ff851b` Bright orange | Instantly removes 3 tail segments (min body length = 1). No lingering effect | Instant (0 s) | 15% |

### Visual Rendering Details

Each power-up renders inside a single grid cell (30 × 30 px). The shape is drawn with the power-up's colour, with a subtle pulsing glow animation (canvas `shadowBlur` oscillating between 4 and 10 px). Shapes are distinct enough to differentiate without colour:

- **Lightning:** Sharp zig-zag line (3 segments).
- **Snowflake:** 3 lines crossing at centre with small branches.
- **Star:** Classic 5-pointed star polygon.
- **Shield circle:** Circle outline with a "+" inside.
- **Shrink arrow:** Hollow downward chevron/arrow.

---

## 9. Accessibility

### 9.1 Keyboard-Only Play

- All gameplay uses arrow keys — no mouse required.
- `Enter` key starts/restarts the game.
- `Escape` or `P` key toggles pause.
- Footer buttons are focusable with `Tab` and activatable with `Enter`/`Space`.
- Canvas element has `tabindex="0"` to receive focus.

### 9.2 Screen Reader Support

- `aria-live="polite"` on the power-up indicator so changes are announced.
- Game-over overlay uses semantic headings and descriptive text.
- Canvas has `aria-label="Snake game board"`.
- Score changes are reflected in DOM elements (not only drawn on canvas).

### 9.3 Colourblind Support

- Every power-up has a **unique shape** in addition to its colour, so players who cannot distinguish colours can still identify power-ups.
- Normal food is always a circle; power-up food is always a non-circular shape.
- Snake head is visually distinct from body (slightly larger, brighter colour).
- High-contrast neon palette on dark background provides strong luminance contrast.

### 9.4 Pause Functionality

- Game can be paused at any time with `Escape` or `P` or the pause button.
- While paused, "PAUSED" text is drawn on the canvas.
- No game-state changes occur while paused.

### 9.5 Reduced Motion

- Respect `prefers-reduced-motion` media query: disable the pulsing glow animation on power-ups and HUD indicator when the user prefers reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  .hud__powerup:not([hidden]) { animation: none; }
  .hud__powerup--expiring { animation: none; }
}
```

---

## 10. Step-by-Step Build Order

### Phase 1 — Skeleton & Static Layout

| Step | Task | Output |
|---|---|---|
| 1.1 | Create `index.html` with full HTML structure (§4) | Viewable page with placeholder content |
| 1.2 | Create `styles/main.css` with variables, reset, HUD layout, canvas sizing, overlays, buttons, responsive rules (§5) | Styled page, canvas has border, HUD visible |
| 1.3 | Add Google Fonts `<link>` and verify "Press Start 2P" loads | Retro font visible in HUD and overlays |

### Phase 2 — Grid & Renderer

| Step | Task | Output |
|---|---|---|
| 2.1 | Create `js/modules/grid.js` with constants and helper functions (§6.5) | Importable grid config |
| 2.2 | Create `js/modules/renderer.js` with `init()`, `clear()`, `drawGrid()` (§6.6) | Canvas shows dark background with grid lines |
| 2.3 | In `js/main.js`, import grid and renderer, call `renderer.init()` and draw the empty grid on page load | Visible grid on canvas |

### Phase 3 — Snake

| Step | Task | Output |
|---|---|---|
| 3.1 | Create `js/modules/snake.js` with `createSnake()`, `getHead()`, `getBody()`, `move()`, `grow()`, `reset()` (§6.2) | Snake module ready |
| 3.2 | Add `renderer.drawSnake()` | Snake appears on canvas |
| 3.3 | Implement a basic game loop in `main.js` using `requestAnimationFrame` + tick timing. Snake auto-moves rightward | Snake moves across grid |
| 3.4 | Add wall collision (`grid.isOutOfBounds`) → game over state | Snake stops at walls |

### Phase 4 — Input

| Step | Task | Output |
|---|---|---|
| 4.1 | Create `js/modules/input.js` with direction queue and 180° prevention (§6.7) | Input module ready |
| 4.2 | Wire input into `main.js` tick: `getNextDirection()` → `snake.setDirection()` → `snake.move()` | Arrow keys control snake |
| 4.3 | Add `Enter` to start, `Escape`/`P` to pause | Keyboard controls complete |

### Phase 5 — Food & Scoring

| Step | Task | Output |
|---|---|---|
| 5.1 | Create `js/modules/food.js` with `spawnFood()`, `getFood()`, collision helper (§6.3) | Food module ready |
| 5.2 | Add `renderer.drawFood()` for normal food (red circle) | Food appears on canvas |
| 5.3 | In `tick()`, detect food collision → `snake.grow()`, update score, spawn new food | Eating works, score increments |
| 5.4 | Wire score display to DOM (`#current-score`) | HUD shows live score |

### Phase 6 — High Score & Storage

| Step | Task | Output |
|---|---|---|
| 6.1 | Create `js/modules/storage.js` (§6.8) | Storage module ready |
| 6.2 | Load high score on init, save on game over | High score persists between sessions |
| 6.3 | Display high score in HUD and game-over overlay | Visible high score |

### Phase 7 — Self-Collision & Game Over

| Step | Task | Output |
|---|---|---|
| 7.1 | Implement `snake.checkSelfCollision()` | Self-collision detection works |
| 7.2 | In `tick()`, after move, check self-collision → `endGame()` | Game ends on self-bite |
| 7.3 | Show game-over overlay with score, high score, "Play Again" button | Game-over screen functional |
| 7.4 | Wire restart button and `Enter` key to restart | Full play cycle works |

### Phase 8 — Power-Ups

| Step | Task | Output |
|---|---|---|
| 8.1 | Create `js/modules/powerups.js` with type definitions, activate/deactivate, timer (§6.4) | Power-up module ready |
| 8.2 | In `food.spawnFood()`, implement 20% chance to spawn power-up food | Power-up food appears on grid |
| 8.3 | Add `renderer.drawPowerupShape()` for each of the 5 shapes | Distinct shapes visible on canvas |
| 8.4 | Implement speed boost effect: halve tick interval during duration | Speed-up works |
| 8.5 | Implement slow-motion effect: double tick interval | Slow-down works |
| 8.6 | Implement 2× score multiplier: flag checked in score calculation | Double points work |
| 8.7 | Implement shield: flag on snake, survives one self-collision | Shield works |
| 8.8 | Implement shrink: immediately remove 3 tail segments | Shrink works |
| 8.9 | Wire HUD power-up indicator: show/hide, name, countdown, expiring blink | HUD indicator works |

### Phase 9 — Progressive Difficulty

| Step | Task | Output |
|---|---|---|
| 9.1 | Implement `adjustSpeed()` using the formula from §7.6 | Snake gets faster as score rises |
| 9.2 | Test that power-up speed modifiers apply on top of progressive speed correctly | Combined speed effects work |

### Phase 10 — Wall Mode Toggle

| Step | Task | Output |
|---|---|---|
| 10.1 | Wire `#wall-mode-toggle` checkbox to `wallMode` variable | Toggle switches mode |
| 10.2 | In `tick()`, branch on `wallMode` for wall collision vs. wrap-around | Both modes work |

### Phase 11 — Polish & Accessibility

| Step | Task | Output |
|---|---|---|
| 11.1 | Add `prefers-reduced-motion` CSS media query | Animations respect user preference |
| 11.2 | Test all keyboard controls without mouse | Fully keyboard-accessible |
| 11.3 | Add ARIA attributes and verify screen reader announcements | Accessible to assistive tech |
| 11.4 | Add canvas glow effects on power-ups (pulsing `shadowBlur`) | Visual polish |
| 11.5 | Add start-screen overlay drawing | Nice startup experience |
| 11.6 | Add paused-screen overlay text | Clear pause state |

### Phase 12 — Testing & Bug Fixing

| Step | Task | Output |
|---|---|---|
| 12.1 | Play-test at least 10 full rounds, verify each power-up | All mechanics verified |
| 12.2 | Test edge cases: snake fills most of grid, food spawn with very few empty cells | No infinite loops in spawn |
| 12.3 | Test rapid direction changing (mash keys) | No glitches, 180° prevention works |
| 12.4 | Test localStorage in incognito mode (should gracefully degrade) | No crashes if storage blocked |
| 12.5 | Test responsive canvas on mobile viewport | Canvas scales correctly |

---

## 11. Stretch Goals

### 11.1 Wrap-Around Walls Mode (Core — already planned)

Already included in the base implementation via the wall-mode toggle. Mark as complete after Phase 10.

### 11.2 Leaderboard (Top 10 Scores)

- Extend `storage.js` to store an array of `{ score, date }` objects (max 10, sorted descending).
- New `js/modules/leaderboard.js` module:
  - `getLeaderboard()` → `Array<{ score: number, date: string }>` — reads from `localStorage` key `"snake-leaderboard"`.
  - `addEntry(score)` → `void` — inserts score, trims to top 10, re-saves.
  - `clearLeaderboard()` → `void`.
- Add a leaderboard overlay/modal accessible from a "Leaderboard" button in the footer.
- Display rank, score, and date for each entry.
- Highlight the current game's score if it made the leaderboard.

### 11.3 Mobile Swipe Controls

- New `js/modules/touch.js` module:
  - `init(canvasElement)` → `void` — attaches `touchstart` and `touchend` listeners to the canvas.
  - Calculates swipe direction from the vector between touch start and end points.
  - Minimum swipe distance threshold: 30 px to avoid accidental triggers.
  - Translates swipe into the same direction vectors used by `input.js`.
  - Calls `input.enqueueDirection(dir)` (requires adding this method to `input.js`).
- Add on-screen directional pad (4 arrow buttons) as a fallback for short taps.
- Show touch controls only on devices with `('ontouchstart' in window)`.

### 11.4 Additional Stretch Ideas

| Feature | Description |
|---|---|
| Sound effects | Use Web Audio API for eat, power-up, game-over sounds. Mute toggle in footer |
| Difficulty selector | Easy / Medium / Hard presets that change `BASE_INTERVAL` and power-up spawn rate |
| Snake skin selector | Choose from 3–4 colour themes for the snake (neon green, cyan, pink, gold) |
| Obstacles mode | Randomly placed wall blocks on the grid that the snake must avoid |
| Ghost trail | Semi-transparent trail behind the snake that fades over 3–5 frames |
| Achievement badges | Track milestones ("Score 100", "Use all 5 power-ups in one game") stored in `localStorage` |
