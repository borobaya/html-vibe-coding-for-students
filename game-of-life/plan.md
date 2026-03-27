# Conway's Game of Life — Implementation Plan

---

## 1. Overview

### What Is Conway's Game of Life?

Conway's Game of Life is a **zero-player cellular automaton** devised by the British mathematician John Horton Conway in 1970. It takes place on an infinite (or finite, bounded) two-dimensional orthogonal grid of square cells. Each cell exists in one of two states: **alive** (populated) or **dead** (empty). The grid evolves in discrete time steps called **generations**. At each generation every cell simultaneously examines its eight surrounding neighbours (the Moore neighbourhood) and transitions according to four deterministic rules.

### The Four Rules

| # | Rule Name | Condition | Outcome |
|---|-----------|-----------|---------|
| 1 | **Underpopulation** | A live cell has **fewer than 2** live neighbours | Cell **dies** |
| 2 | **Survival** | A live cell has **exactly 2 or 3** live neighbours | Cell **stays alive** |
| 3 | **Overpopulation** | A live cell has **more than 3** live neighbours | Cell **dies** |
| 4 | **Reproduction** | A dead cell has **exactly 3** live neighbours | Cell **becomes alive** |

All births and deaths happen **simultaneously** — the current generation is read, and the next generation is written in one atomic step (double-buffering).

### User Interactions

- **Draw cells**: click or click-and-drag on the canvas to set cells alive.
- **Erase cells**: click an already-alive cell (or drag over alive cells) to kill them.
- **Play**: start automatic generation advancement at the configured speed.
- **Pause**: freeze simulation; grid remains interactive for drawing.
- **Step**: advance exactly one generation while paused.
- **Clear**: kill every cell on the grid, reset generation counter.
- **Speed control**: slider from ~1 generation/sec to ~30 generations/sec.
- **Grid size control**: change the number of rows/columns (e.g. 20×20 up to 100×100).
- **Load preset**: stamp a well-known pattern (glider, pulsar, etc.) onto the centre of the grid.

### Simulation States

| State | Description |
|-------|-------------|
| **Idle** | Initial load or after Clear. No simulation running. User can draw. |
| **Running** | Simulation advancing automatically at configured speed. User can still draw. |
| **Paused** | Simulation frozen. User can draw, step, or resume. |

---

## 2. Page Layout

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  TOOLBAR                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ Play │ │ Step │ │Clear │ │ Rand │                         │
│  └──────┘ └──────┘ └──────┘ └──────┘                         │
│                                                              │
│  Speed: ■■■■■■□□□□  [1x ——— 30x]                             │
│  Grid:  [ 50 × 50  ▾ ]                                      │
│  Preset: [ Select pattern ▾ ]                                │
│                                                              │
│  Generation: 0        Alive: 0                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                   ┌────────────────────┐                     │
│                   │                    │                     │
│                   │   CANVAS GRID      │                     │
│                   │   (square,         │                     │
│                   │    centred)        │                     │
│                   │                    │                     │
│                   │                    │                     │
│                   └────────────────────┘                     │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER: Conway's Game of Life · Student Project 2026        │
└──────────────────────────────────────────────────────────────┘
```

### Layout Details

- **Toolbar**: fixed at the top. Contains all interactive controls arranged in a flex row that wraps on narrow screens.
- **Canvas area**: fills remaining viewport height, canvas centred horizontally and vertically within this area.
- **Canvas sizing**: the canvas is always **square**. Its side length = `min(availableWidth - 40px padding, availableHeight - 40px padding)`. Capped at a maximum of **640px** on desktop.
- **Stats bar**: generation counter and alive-cell count sit inside the toolbar section or immediately below it.
- **Footer**: simple text footer.

### Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| ≥ 768px (desktop) | Toolbar controls in a single horizontal row. Canvas up to 640×640. |
| < 768px (mobile) | Toolbar wraps into multiple rows. Canvas fills available width minus 20px side padding. Buttons stack into rows of 2–3. |

---

## 3. Colour Scheme & Typography

### CSS Custom Properties (Variables)

```css
:root {
  /* --- Core palette --- */
  --color-bg:             #0f0f1a;     /* page background — deep navy/black          */
  --color-surface:        #1a1a2e;     /* toolbar & card background                  */
  --color-surface-alt:    #16213e;     /* footer, secondary surfaces                 */

  /* --- Grid / Canvas --- */
  --color-cell-alive:     #00e676;     /* bright green — alive cells                 */
  --color-cell-dead:      #0f0f1a;     /* matches page bg — dead cells               */
  --color-grid-line:      #2a2a3e;     /* subtle grid lines between cells            */
  --color-cell-hover:     rgba(0, 230, 118, 0.3); /* translucent green hover preview */

  /* --- UI Controls --- */
  --color-btn-primary:    #00e676;     /* play button background                     */
  --color-btn-primary-hover: #00c853; /* play button hover                          */
  --color-btn-secondary:  #3a3a5e;     /* step, clear, random button background      */
  --color-btn-secondary-hover: #4a4a6e;
  --color-btn-text:       #0f0f1a;     /* text on primary buttons                    */
  --color-btn-text-light: #e0e0e0;     /* text on secondary buttons                  */
  --color-btn-danger:     #ff5252;     /* clear button accent (optional)             */

  /* --- Typography --- */
  --color-text-primary:   #e0e0e0;     /* main body text                             */
  --color-text-secondary: #9e9e9e;     /* labels, hints                              */
  --color-text-accent:    #00e676;     /* highlighted stats                          */

  /* --- Slider track --- */
  --color-slider-track:   #3a3a5e;
  --color-slider-fill:    #00e676;
  --color-slider-thumb:   #ffffff;

  /* --- Misc --- */
  --border-radius:        8px;
  --transition-speed:     0.2s;
}
```

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Body / default | `'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | 16px | 400 |
| H1 (page title) | Same stack | 1.5rem (24px) | 700 |
| Button labels | Same stack | 0.875rem (14px) | 600 |
| Stat values (gen counter) | `'Courier New', monospace` | 1.125rem (18px) | 700 |
| Stat labels | Sans-serif stack | 0.75rem (12px) | 400 |
| Footer | Sans-serif stack | 0.75rem (12px) | 400 |

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Conway's Game of Life — interactive cellular automaton simulation" />
  <title>Conway's Game of Life</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ===== TOOLBAR ===== -->
  <header class="toolbar" role="toolbar" aria-label="Simulation controls">
    <h1 class="toolbar__title">Game of Life</h1>

    <!-- Action buttons -->
    <div class="toolbar__group toolbar__actions">
      <button id="btn-play" class="btn btn--primary" aria-label="Play simulation">
        ▶ Play
      </button>
      <button id="btn-step" class="btn btn--secondary" aria-label="Advance one generation">
        ⏭ Step
      </button>
      <button id="btn-clear" class="btn btn--secondary btn--danger" aria-label="Clear all cells">
        ✕ Clear
      </button>
      <button id="btn-random" class="btn btn--secondary" aria-label="Randomise grid">
        🎲 Random
      </button>
    </div>

    <!-- Speed control -->
    <div class="toolbar__group toolbar__speed">
      <label for="speed-slider" class="toolbar__label">Speed</label>
      <input
        type="range"
        id="speed-slider"
        class="slider"
        min="1"
        max="30"
        value="10"
        aria-label="Generations per second"
      />
      <span id="speed-value" class="toolbar__value">10 gen/s</span>
    </div>

    <!-- Grid size -->
    <div class="toolbar__group toolbar__grid-size">
      <label for="grid-size" class="toolbar__label">Grid</label>
      <select id="grid-size" class="select" aria-label="Grid size">
        <option value="20">20 × 20</option>
        <option value="30">30 × 30</option>
        <option value="40">40 × 40</option>
        <option value="50" selected>50 × 50</option>
        <option value="60">60 × 60</option>
        <option value="80">80 × 80</option>
        <option value="100">100 × 100</option>
      </select>
    </div>

    <!-- Preset patterns -->
    <div class="toolbar__group toolbar__presets">
      <label for="preset-select" class="toolbar__label">Preset</label>
      <select id="preset-select" class="select" aria-label="Load preset pattern">
        <option value="">— Select pattern —</option>
        <option value="glider">Glider</option>
        <option value="blinker">Blinker</option>
        <option value="toad">Toad</option>
        <option value="beacon">Beacon</option>
        <option value="pulsar">Pulsar</option>
        <option value="lwss">Lightweight Spaceship</option>
        <option value="glider-gun">Gosper Glider Gun</option>
        <option value="diehard">Diehard</option>
        <option value="acorn">Acorn</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="toolbar__group toolbar__stats" aria-live="polite">
      <div class="stat">
        <span class="stat__label">Generation</span>
        <span id="stat-generation" class="stat__value">0</span>
      </div>
      <div class="stat">
        <span class="stat__label">Alive</span>
        <span id="stat-alive" class="stat__value">0</span>
      </div>
    </div>
  </header>

  <!-- ===== CANVAS ===== -->
  <main class="canvas-container">
    <canvas
      id="game-canvas"
      class="game-canvas"
      aria-label="Game of Life grid — click or drag to draw cells"
      role="img"
    ></canvas>
  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    Conway's Game of Life · Student Project 2026
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- `role="toolbar"` on the header for assistive technology.
- `aria-label` on every button, slider, and select.
- `aria-live="polite"` on the stats region so screen readers announce generation changes.
- Canvas has `role="img"` and a descriptive `aria-label`.
- All form inputs have associated `<label>` elements.

---

## 5. CSS Design

### Key Layout Rules

```
body
├── .toolbar          → position: sticky; top: 0; z-index: 10
│   ├── display: flex; flex-wrap: wrap; gap: 12px 16px
│   ├── align-items: center; justify-content: flex-start
│   └── padding: 12px 20px
├── .canvas-container → flex: 1; display: flex; justify-content: center; align-items: center
│   └── canvas        → width/height set via JS; max-width: 640px
└── .footer           → text-align: center; padding: 12px
```

### Toolbar

- `position: sticky; top: 0` so it remains visible while scrolling (relevant on small screens).
- Background: `var(--color-surface)` with subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.3)`.
- `.toolbar__group` items use `display: flex; align-items: center; gap: 8px`.

### Buttons

```css
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background var(--transition-speed), transform var(--transition-speed);
}
.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn--primary {
  background: var(--color-btn-primary);
  color: var(--color-btn-text);
}
.btn--primary:hover { background: var(--color-btn-primary-hover); }

.btn--secondary {
  background: var(--color-btn-secondary);
  color: var(--color-btn-text-light);
}
.btn--secondary:hover { background: var(--color-btn-secondary-hover); }
```

### Slider

- Custom styled: track is `var(--color-slider-track)`, filled portion `var(--color-slider-fill)`.
- Thumb: 18px circle, white, with box-shadow.
- Webkit and Firefox pseudo-elements needed (`-webkit-slider-thumb`, `-moz-range-thumb`).

### Select Dropdowns

- Background: `var(--color-btn-secondary)`.
- Text: `var(--color-btn-text-light)`.
- Border-radius: `var(--border-radius)`.
- Padding: `6px 12px`.

### Canvas Container

- `min-height: calc(100vh - toolbar-height - footer-height)`.
- Canvas has a 1px solid border using `var(--color-grid-line)`.
- `image-rendering: pixelated` for crisp cell edges.

### Responsive Media Query

```css
@media (max-width: 767px) {
  .toolbar {
    justify-content: center;
    gap: 8px 12px;
  }
  .toolbar__title {
    width: 100%;
    text-align: center;
  }
  .toolbar__actions {
    width: 100%;
    justify-content: center;
  }
  .game-canvas {
    max-width: calc(100vw - 20px);
    max-height: calc(100vw - 20px);
  }
}
```

---

## 6. JavaScript Architecture

### Module Map

```
js/
├── main.js                  ← entry point, imports all modules, runs init()
└── modules/
    ├── config.js             ← default constants and settings
    ├── grid.js               ← cell state array, Conway rules, generation step
    ├── renderer.js           ← canvas drawing: cells, grid lines, hover preview
    ├── input.js              ← mouse + touch handlers, coordinate mapping
    ├── controls.js           ← toolbar button/slider/select event bindings
    └── presets.js            ← pattern definitions and stamping function
```

---

### `config.js` — Default Values

```js
export const CONFIG = {
  /** Number of rows and columns (square grid) */
  gridSize: 50,

  /** Generations per second (1–30) */
  speed: 10,

  /** Canvas maximum pixel size (px) */
  canvasMaxSize: 640,

  /** Minimum cell pixel size before grid size is capped */
  cellMinSize: 4,

  /** Grid line width in pixels */
  gridLineWidth: 0.5,

  /** Whether the grid wraps around edges (toroidal) */
  wrapEdges: true,

  /** Probability a cell is alive when randomising (0–1) */
  randomDensity: 0.3,

  /** Colours (mirror CSS vars for canvas use) */
  colors: {
    alive:    '#00e676',
    dead:     '#0f0f1a',
    gridLine: '#2a2a3e',
    hover:    'rgba(0, 230, 118, 0.3)',
  },
};
```

---

### `grid.js` — Cell State & Conway Logic

**Responsibilities:**
1. Maintain two flat `Uint8Array` buffers — `current` (read) and `next` (write) — for double-buffering.
2. Provide `getCell(row, col)` / `setCell(row, col, state)`.
3. `countNeighbours(row, col)` — count the 8 Moore neighbours, handling wrapping or boundary.
4. `step()` — apply the four rules to produce the next generation and swap buffers.
5. `clear()` — zero out all cells.
6. `randomise(density)` — randomly populate.
7. `resize(newSize)` — allocate new buffers, copy what fits.
8. `getAliveCount()` — iterate and count living cells.

**Key implementation details:**

```
Index into flat array: index = row * gridSize + col

countNeighbours(row, col):
  count = 0
  for dr in [-1, 0, 1]:
    for dc in [-1, 0, 1]:
      if dr === 0 && dc === 0: skip (don't count self)
      nr = row + dr
      nc = col + dc
      if wrapEdges:
        nr = (nr + gridSize) % gridSize
        nc = (nc + gridSize) % gridSize
      else:
        if nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize: skip
      count += current[nr * gridSize + nc]
  return count

step():
  aliveCount = 0
  for row 0..gridSize-1:
    for col 0..gridSize-1:
      neighbours = countNeighbours(row, col)
      idx = row * gridSize + col
      alive = current[idx]
      if alive:
        next[idx] = (neighbours === 2 || neighbours === 3) ? 1 : 0
      else:
        next[idx] = (neighbours === 3) ? 1 : 0
      aliveCount += next[idx]
  swap current ↔ next
  return aliveCount
```

**Exports:**

```js
export function createGrid(size, wrap)        → grid object
// grid.getCell(r, c) → 0 | 1
// grid.setCell(r, c, state)
// grid.toggleCell(r, c) → newState
// grid.step() → { aliveCount }
// grid.clear()
// grid.randomise(density)
// grid.resize(newSize)
// grid.getAliveCount()
// grid.getSize()
// grid.stampPattern(pattern, centerRow, centerCol)
```

---

### `renderer.js` — Canvas Drawing

**Responsibilities:**
1. Calculate `cellSize` = `canvasPixelSize / gridSize`.
2. Clear canvas each frame.
3. Draw dead-cell background (single `fillRect` covering entire canvas).
4. Draw alive cells (iterate grid, `fillRect` for each alive cell).
5. Draw grid lines (vertical and horizontal thin lines).
6. Draw optional hover highlight.

**Key calculations:**

```
canvasPixelSize = min(containerWidth - 40, containerHeight - 40, CONFIG.canvasMaxSize)
canvas.width = canvas.height = canvasPixelSize  (set actual pixel buffer)
canvas.style.width = canvas.style.height = canvasPixelSize + 'px'

cellSize = canvasPixelSize / gridSize
  e.g. 640 / 50 = 12.8px per cell

Cell at (row, col):
  x = col * cellSize
  y = row * cellSize
  width = height = cellSize
```

**Drawing order (per frame):**
1. `ctx.fillStyle = deadColor; ctx.fillRect(0, 0, canvasSize, canvasSize);`
2. `ctx.fillStyle = aliveColor;` then for each alive cell: `ctx.fillRect(x, y, cellSize, cellSize);`
3. Grid lines: `ctx.strokeStyle = gridLineColor; ctx.lineWidth = 0.5;` draw horizontal lines at `y = row * cellSize` and vertical lines at `x = col * cellSize`.
4. Hover cell: `ctx.fillStyle = hoverColor; ctx.fillRect(hx, hy, cellSize, cellSize);`

**Exports:**

```js
export function createRenderer(canvas, grid, config)  → renderer object
// renderer.render()
// renderer.setHover(row, col)
// renderer.clearHover()
// renderer.resize(canvasSize, gridSize)
// renderer.getCellSize()
```

---

### `input.js` — Mouse & Touch Handling

**Responsibilities:**
1. Convert pixel coordinates (from mouse/touch event relative to canvas) to grid row/col.
2. Handle `mousedown` → begin draw mode; determine if drawing or erasing based on clicked cell state.
3. Handle `mousemove` → if drawing, continue setting/clearing cells along drag path.
4. Handle `mouseup` → end draw mode.
5. Handle `touchstart`, `touchmove`, `touchend` — mirror mouse behaviour, call `preventDefault()` to block scrolling.
6. Track hover position for renderer highlight (while not drawing).

**Coordinate mapping:**

```
pixelToGrid(event):
  rect = canvas.getBoundingClientRect()
  scaleX = canvas.width / rect.width
  scaleY = canvas.height / rect.height
  pixelX = (event.clientX - rect.left) * scaleX
  pixelY = (event.clientY - rect.top) * scaleY
  col = Math.floor(pixelX / cellSize)
  row = Math.floor(pixelY / cellSize)
  clamp row to [0, gridSize - 1]
  clamp col to [0, gridSize - 1]
  return { row, col }
```

**Draw/erase logic:**

```
onMouseDown(event):
  { row, col } = pixelToGrid(event)
  currentCellState = grid.getCell(row, col)
  if currentCellState === 1:
    drawMode = 'erase'   // user clicked an alive cell → erase mode
    grid.setCell(row, col, 0)
  else:
    drawMode = 'draw'    // user clicked a dead cell → draw mode
    grid.setCell(row, col, 1)
  isDrawing = true
  lastCell = { row, col }

onMouseMove(event):
  { row, col } = pixelToGrid(event)
  if isDrawing:
    if { row, col } !== lastCell:   // avoid redundant writes
      grid.setCell(row, col, drawMode === 'draw' ? 1 : 0)
      lastCell = { row, col }
  else:
    renderer.setHover(row, col)

onMouseUp():
  isDrawing = false
  drawMode = null
```

**Exports:**

```js
export function initInput(canvas, grid, renderer, onDrawCallback)
// onDrawCallback is called after any cell change so the UI
// can update the alive-count stat without waiting for next frame
```

---

### `controls.js` — UI Bindings

**Responsibilities:**
1. Bind Play/Pause button: toggles simulation state, swaps button text between "▶ Play" and "⏸ Pause".
2. Bind Step button: calls `grid.step()` + `renderer.render()` + update stats if simulation is paused.
3. Bind Clear button: `grid.clear()`, reset generation counter, `renderer.render()`, update stats.
4. Bind Random button: `grid.randomise(CONFIG.randomDensity)`, render, update stats.
5. Bind Speed slider: update `speed` state, display value as `"{n} gen/s"`.
6. Bind Grid Size select: `grid.resize(newSize)`, `renderer.resize(...)`, `renderer.render()`, reset generation counter.
7. Bind Preset select: look up pattern from `presets.js`, `grid.stampPattern(...)`, `renderer.render()`, update stats.
8. Update stat displays: write generation count and alive count to DOM spans.

**Exports:**

```js
export function initControls({
  grid,
  renderer,
  getState,      // () → { running, generation, speed }
  setState,      // (patch) → void
  startLoop,
  stopLoop,
})
```

---

### `presets.js` — Pattern Definitions

See **Section 8** for full coordinate arrays. This module exports:

```js
export const PRESETS = {
  glider:      { name: 'Glider',               cells: [...] },
  blinker:     { name: 'Blinker',              cells: [...] },
  toad:        { name: 'Toad',                  cells: [...] },
  beacon:      { name: 'Beacon',               cells: [...] },
  pulsar:      { name: 'Pulsar',               cells: [...] },
  lwss:        { name: 'Lightweight Spaceship', cells: [...] },
  'glider-gun':{ name: 'Gosper Glider Gun',    cells: [...] },
  diehard:     { name: 'Diehard',              cells: [...] },
  acorn:       { name: 'Acorn',                cells: [...] },
};

/**
 * Stamps a pattern onto the grid centred at (centerRow, centerCol).
 * Each pattern's `cells` is an array of [rowOffset, colOffset] pairs
 * relative to a (0, 0) origin.
 * @param {object} grid - The grid object.
 * @param {string} patternKey - Key into PRESETS.
 * @param {number} centerRow
 * @param {number} centerCol
 */
export function stampPattern(grid, patternKey, centerRow, centerCol) { ... }
```

---

### `main.js` — Entry Point & Game Loop

```js
import { CONFIG } from './modules/config.js';
import { createGrid } from './modules/grid.js';
import { createRenderer } from './modules/renderer.js';
import { initInput } from './modules/input.js';
import { initControls } from './modules/controls.js';

/** Application state */
const state = {
  running: false,
  generation: 0,
  speed: CONFIG.speed,       // gen/sec
  gridSize: CONFIG.gridSize,
};

let grid, renderer;
let lastFrameTime = 0;
let animFrameId = null;

function init() {
  const canvas = document.getElementById('game-canvas');

  grid = createGrid(state.gridSize, CONFIG.wrapEdges);
  renderer = createRenderer(canvas, grid, CONFIG);

  // Size canvas to container
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Input handling
  initInput(canvas, grid, renderer, () => updateStats());

  // Control panel
  initControls({
    grid,
    renderer,
    getState: () => state,
    setState: (patch) => Object.assign(state, patch),
    startLoop,
    stopLoop,
  });

  renderer.render();
  updateStats();
}

function resizeCanvas() {
  const container = document.querySelector('.canvas-container');
  const available = Math.min(
    container.clientWidth - 40,
    container.clientHeight - 40,
    CONFIG.canvasMaxSize
  );
  renderer.resize(available, state.gridSize);
  renderer.render();
}

/** Game loop using requestAnimationFrame with timing control */
function gameLoop(timestamp) {
  const interval = 1000 / state.speed;   // ms between generations
  if (timestamp - lastFrameTime >= interval) {
    const { aliveCount } = grid.step();
    state.generation++;
    updateStats(aliveCount);
    renderer.render();
    lastFrameTime = timestamp;
  }
  animFrameId = requestAnimationFrame(gameLoop);
}

function startLoop() {
  if (animFrameId) return;
  state.running = true;
  lastFrameTime = performance.now();
  animFrameId = requestAnimationFrame(gameLoop);
}

function stopLoop() {
  state.running = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function updateStats(aliveCount) {
  document.getElementById('stat-generation').textContent = state.generation;
  document.getElementById('stat-alive').textContent =
    aliveCount ?? grid.getAliveCount();
}

document.addEventListener('DOMContentLoaded', init);
```

**Game loop timing:**
- `requestAnimationFrame` runs as fast as the browser allows (~60fps).
- Inside the callback, we check elapsed time against `1000 / speed`.
- At speed = 10, the interval is 100ms → 10 generations per second.
- At speed = 1, interval is 1000ms → 1 generation per second.
- At speed = 30, interval is ~33ms → 30 generations per second.

---

## 7. Conway's Rules — Detailed Explanation

### The Moore Neighbourhood

Every cell has exactly **8 neighbours** — the cells directly adjacent horizontally, vertically, and diagonally:

```
  [NW] [N ] [NE]
  [W ] [C ] [E ]       C = the cell being examined
  [SW] [S ] [SE]       8 surrounding cells = the Moore neighbourhood
```

For a cell at `(row, col)`, the 8 neighbours are:

| Neighbour | Position |
|-----------|----------|
| NW | `(row-1, col-1)` |
| N  | `(row-1, col  )` |
| NE | `(row-1, col+1)` |
| W  | `(row  , col-1)` |
| E  | `(row  , col+1)` |
| SW | `(row+1, col-1)` |
| S  | `(row+1, col  )` |
| SE | `(row+1, col+1)` |

### Edge Handling — Toroidal Wrapping

By default the grid uses **toroidal wrapping**: the top edge connects to the bottom, and the left edge connects to the right. This makes the grid behave as though it lives on the surface of a torus.

```
Wrapping formula:
  wrappedRow = (row + gridSize) % gridSize
  wrappedCol = (col + gridSize) % gridSize

Example (gridSize = 50):
  cell (0, 0) looking NW → (-1, -1) → (49, 49)
  cell (49, 49) looking SE → (50, 50) → (0, 0)
```

Alternatively, a **bounded** mode treats out-of-bounds cells as permanently dead (no wrapping).

### Rule Application — Worked Example

Given a 5×5 grid (· = dead, ● = alive):

```
Generation 0:       Neighbour counts:      Generation 1:
· · · · ·           0 1 1 1 0              · · · · ·
· · ● · ·           1 1 2 1 1              · · · · ·
· · ● · ·     →     1 2 2 2 1        →     · ● ● ● ·
· · ● · ·           1 1 2 1 1              · · · · ·
· · · · ·           0 1 1 1 0              · · · · ·

The vertical "blinker" has rotated to a horizontal blinker.

Centre cell (2,2): alive, 2 neighbours → survives ✓
Cell (2,1): dead, 3 neighbours → born ✓
Cell (2,3): dead, 3 neighbours → born ✓
Cell (1,2): alive, 1 neighbour → dies (underpopulation) ✗
Cell (3,2): alive, 1 neighbour → dies (underpopulation) ✗
```

This demonstrates the blinker — a period-2 oscillator.

---

## 8. Preset Patterns

All coordinates are `[rowOffset, colOffset]` relative to a `(0, 0)` top-left origin of the pattern's bounding box. Patterns are stamped so that `(0, 0)` maps to `(centerRow - halfHeight, centerCol - halfWidth)`.

### Blinker (Period-2 Oscillator)

```
·●·      Cells: [[0,0], [0,1], [0,2]]
         Bounding box: 1×3
```
Oscillates between horizontal and vertical bar every generation.

### Toad (Period-2 Oscillator)

```
·●●●     Cells: [[0,1], [0,2], [0,3],
●●●·              [1,0], [1,1], [1,2]]
         Bounding box: 2×4
```
Two offset rows of three cells that toggle each generation.

### Beacon (Period-2 Oscillator)

```
●●··     Cells: [[0,0], [0,1],
●●··              [1,0], [1,1],
··●●              [2,2], [2,3],
··●●              [3,2], [3,3]]
         Bounding box: 4×4
```
Two 2×2 blocks at diagonally adjacent corners that blink.

### Glider (Spaceship — moves diagonally)

```
·●·      Cells: [[0,1],
··●              [1,2],
●●●              [2,0], [2,1], [2,2]]
         Bounding box: 3×3
```
Moves one cell diagonally (SE) every 4 generations. The smallest and most famous spaceship.

### Lightweight Spaceship (LWSS — moves horizontally)

```
·●··●    Cells: [[0,1], [0,4],
●····             [1,0],
●···●             [2,0], [2,4],
●●●●·             [3,0], [3,1], [3,2], [3,3]]
         Bounding box: 4×5
```
Moves 2 cells to the right every 4 generations.

### Pulsar (Period-3 Oscillator)

```
··●●●···●●●··

··············
●····●·●····●      Full coordinate set (13×13 bounding box):
●····●·●····●
●····●·●····●      The pulsar has 4-fold symmetry.
··●●●···●●●··      
··············      Cells (48 cells total, quarter-symmetry expanded):
··●●●···●●●··
●····●·●····●      [[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],
●····●·●····●       [2,0],[2,5],[2,7],[2,12],
●····●·●····●       [3,0],[3,5],[3,7],[3,12],
··············       [4,0],[4,5],[4,7],[4,12],
··●●●···●●●··       [5,2],[5,3],[5,4],[5,8],[5,9],[5,10],
                     [7,2],[7,3],[7,4],[7,8],[7,9],[7,10],
                     [8,0],[8,5],[8,7],[8,12],
                     [9,0],[9,5],[9,7],[9,12],
                     [10,0],[10,5],[10,7],[10,12],
                     [12,2],[12,3],[12,4],[12,8],[12,9],[12,10]]
```
Beautiful period-3 oscillator with 4-fold rotational symmetry.

### Gosper Glider Gun (Infinite Growth)

Bounding box: **9 × 36**. Produces a new glider every 30 generations. The first known finite pattern with unbounded growth.

```
Cells (36 cells):
[[ 0,24],
 [ 1,22],[ 1,24],
 [ 2,12],[ 2,13],[ 2,20],[ 2,21],[ 2,34],[ 2,35],
 [ 3,11],[ 3,15],[ 3,20],[ 3,21],[ 3,34],[ 3,35],
 [ 4, 0],[ 4, 1],[ 4,10],[ 4,16],[ 4,20],[ 4,21],
 [ 5, 0],[ 5, 1],[ 5,10],[ 5,14],[ 5,16],[ 5,17],[ 5,22],[ 5,24],
 [ 6,10],[ 6,16],[ 6,24],
 [ 7,11],[ 7,15],
 [ 8,12],[ 8,13]]
```

### Diehard (Methuselah)

```
······●·     Cells: [[0,6],
●●······              [1,0],[1,1],
·●···●●●              [2,1],[2,5],[2,6],[2,7]]
             Bounding box: 3×8
```
Vanishes completely after exactly **130 generations**. Fast and dramatic.

### Acorn (Methuselah)

```
·●·····      Cells: [[0,1],
···●···              [1,3],
●●··●●●              [2,0],[2,1],[2,4],[2,5],[2,6]]
             Bounding box: 3×7
```
From 7 cells, takes **5206 generations** to stabilise, producing 633 cells including 13 gliders.

### Stamping Logic

```js
function stampPattern(grid, patternKey, centerRow, centerCol) {
  const pattern = PRESETS[patternKey];
  if (!pattern) return;

  // Calculate bounding box to centre the pattern
  let maxR = 0, maxC = 0;
  for (const [r, c] of pattern.cells) {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }
  const offsetR = centerRow - Math.floor(maxR / 2);
  const offsetC = centerCol - Math.floor(maxC / 2);

  for (const [r, c] of pattern.cells) {
    const gr = offsetR + r;
    const gc = offsetC + c;
    if (gr >= 0 && gr < grid.getSize() && gc >= 0 && gc < grid.getSize()) {
      grid.setCell(gr, gc, 1);
    }
  }
}
```

---

## 9. Performance

### Double-Buffering Strategy

The grid maintains **two** flat `Uint8Array` buffers of size `gridSize * gridSize`:

| Buffer | Role |
|--------|------|
| `current` | Read-only during a generation step. Source of truth for neighbour counts. |
| `next` | Write-only during a step. Receives the new generation's cell states. |

After a complete step, the references are swapped: `[current, next] = [next, current]`. The old `next` (now `current`) becomes the new read buffer; the old `current` (now `next`) will be overwritten in the following step. No allocation occurs per frame.

### Why `Uint8Array`?

- `Uint8Array` uses 1 byte per cell vs 8 bytes for a standard JS number in an `Array`.
- For a 100×100 grid: `Uint8Array` = 10 KB vs `Array` = 80 KB.
- Flat indexing (`row * size + col`) avoids the overhead of nested arrays.
- Typed arrays have better cache locality.

### Neighbour Counting Optimisation

The naive 8-direction loop per cell is O(1) per cell (constant 8 checks), so the total per generation is O(n²) where n = gridSize. For n = 100, that's 10,000 cells × 8 neighbour checks = 80,000 lookups — well within budget for 30fps.

**Optional further optimisations** (not required for MVP):
- **Changed-cell tracking**: maintain a "dirty" set of cells that changed in the last step, and only recompute neighbours for cells within 1 step of a change.
- **Bitwise packing**: pack 8 cells into a single byte for even denser storage.

### Rendering Optimisation

**MVP approach (sufficient for ≤100×100 grids):**
- Full canvas clear + redraw every frame.
- At 100×100 = 10,000 cells, drawing ≤10,000 rectangles per frame at 30fps is trivial for `<canvas>` 2D context.

**Optional optimisation — dirty rendering:**
- After `grid.step()`, collect a list of cells that changed state.
- Only redraw those cells (fill alive or dead colour).
- Skip grid-line redraw unless canvas resized.
- Reduces draw calls from ~10,000 to typically ~100–500 per frame.

### Timing Accuracy

`requestAnimationFrame` fires at ~60fps (16.7ms). The game loop checks elapsed time and only advances a generation when the configured interval has passed. This decouples rendering framerate from simulation speed. At speed = 30 gen/s, one generation fires roughly every other animation frame.

---

## 10. Accessibility & State Management

### Accessibility

| Feature | Implementation |
|---------|----------------|
| Keyboard focus | All buttons and controls are focusable via Tab. Canvas receives focus for potential keyboard shortcuts. |
| ARIA roles | `role="toolbar"` on header; `aria-label` on all interactive elements. |
| Live regions | `aria-live="polite"` on stats container announces generation updates to screen readers. |
| Colour contrast | Green (#00e676) on dark (#0f0f1a) meets WCAG AA for large text/icons. |
| Reduced motion | Respect `prefers-reduced-motion: reduce` — disable auto-play, require manual Step. |
| Touch support | All mouse handlers have touch equivalents with `preventDefault()` to avoid scroll interference. |
| Button states | Play button text/icon changes between Play ▶ and Pause ⏸ to reflect current state. |
| Skip links | Optional: skip-to-canvas link for keyboard users. |

### State Management

All application state lives in a single `state` object in `main.js`:

```js
const state = {
  running: false,         // is the simulation auto-advancing?
  generation: 0,          // current generation number
  speed: 10,              // generations per second
  gridSize: 50,           // current grid dimensions
};
```

- **Grid data** (cell states) lives in the `grid` module's typed arrays — not duplicated in the state object.
- **State transitions**:
  - `Play` → sets `state.running = true`, calls `startLoop()`.
  - `Pause` → sets `state.running = false`, calls `stopLoop()`.
  - `Step` (while paused) → calls `grid.step()`, increments `state.generation`.
  - `Clear` → calls `grid.clear()`, resets `state.generation = 0`.
  - `Grid resize` → calls `grid.resize()`, resets `state.generation = 0`.
  - `Preset load` → calls `grid.clear()` then `stampPattern()`, resets `state.generation = 0`.
- Stats are derived (read from `state.generation` and `grid.getAliveCount()`) and rendered into the DOM — no separate stats state.

### Local Persistence (Optional Enhancement)

Use `localStorage` to save/restore:
- Current grid state (serialised `Uint8Array`).
- Current grid size and speed settings.
- Generation counter.

Saved on `beforeunload`, restored on `DOMContentLoaded`.

---

## 11. Implementation Checklist

### Phase 1: Project Skeleton

- [ ] Create `index.html` with full HTML structure from Section 4
- [ ] Create `styles/main.css` with CSS variables, layout, and responsive rules from Sections 3 & 5
- [ ] Create `js/modules/config.js` with default constants
- [ ] Create `js/main.js` with empty `init()` and `DOMContentLoaded` listener
- [ ] Verify page loads with styled toolbar and empty canvas area

### Phase 2: Grid Logic

- [ ] Create `js/modules/grid.js`
- [ ] Implement `createGrid(size, wrap)` with dual `Uint8Array` buffers
- [ ] Implement `getCell`, `setCell`, `toggleCell`
- [ ] Implement `countNeighbours` with toroidal wrapping
- [ ] Implement `step()` applying all four Conway rules with buffer swap
- [ ] Implement `clear()`, `randomise(density)`, `getAliveCount()`, `getSize()`
- [ ] Implement `resize(newSize)`
- [ ] Implement `stampPattern(pattern, centerRow, centerCol)`
- [ ] Test manually: create grid, set cells, step, verify outcomes match rules

### Phase 3: Canvas Rendering

- [ ] Create `js/modules/renderer.js`
- [ ] Implement `createRenderer(canvas, grid, config)`
- [ ] Calculate `cellSize` from canvas dimensions and grid size
- [ ] Implement `render()`: clear canvas, draw alive cells, draw grid lines
- [ ] Implement `setHover(row, col)` and `clearHover()` for preview highlight
- [ ] Implement `resize(canvasSize, gridSize)` — update canvas dimensions and recalculate cell size
- [ ] Wire renderer into `main.js`, verify grid displays on screen

### Phase 4: Input Handling

- [ ] Create `js/modules/input.js`
- [ ] Implement `pixelToGrid(event)` coordinate mapping
- [ ] Implement `mousedown` / `touchstart` — detect draw vs erase mode
- [ ] Implement `mousemove` / `touchmove` — continuous drawing/erasing
- [ ] Implement `mouseup` / `touchend` — end draw mode
- [ ] Implement hover tracking for cell highlight
- [ ] Wire into `main.js`, verify click-to-draw and drag-to-draw work
- [ ] Verify touch input works on mobile/tablet

### Phase 5: Controls

- [ ] Create `js/modules/controls.js`
- [ ] Bind Play/Pause button — toggle `state.running`, swap label/icon
- [ ] Bind Step button — single generation advance when paused
- [ ] Bind Clear button — clear grid, reset generation, re-render
- [ ] Bind Random button — randomise grid, re-render
- [ ] Bind Speed slider — update `state.speed`, display value
- [ ] Bind Grid Size select — resize grid and canvas, reset generation
- [ ] Bind Preset select — load selected pattern, re-render
- [ ] Wire into `main.js`

### Phase 6: Game Loop

- [ ] Implement `gameLoop(timestamp)` using `requestAnimationFrame`
- [ ] Implement timing control: only advance when elapsed time ≥ interval
- [ ] Implement `startLoop()` and `stopLoop()`
- [ ] Verify simulation runs at configured speed
- [ ] Verify user can still draw/erase cells while simulation is running

### Phase 7: Preset Patterns

- [ ] Create `js/modules/presets.js`
- [ ] Define all 9 patterns with coordinate arrays (blinker, toad, beacon, glider, LWSS, pulsar, glider gun, diehard, acorn)
- [ ] Implement `stampPattern()` centering logic
- [ ] Test each preset: load it, run simulation, verify expected behaviour
- [ ] Verify patterns that outgrow the grid are clipped gracefully

### Phase 8: Polish & Responsiveness

- [ ] Fine-tune responsive layout: test at 320px, 768px, 1024px, 1440px widths
- [ ] Ensure toolbar wraps cleanly on narrow screens
- [ ] Ensure canvas resizes on window resize
- [ ] Add `prefers-reduced-motion` media query handling
- [ ] Add hover/focus states to all buttons and controls
- [ ] Add transition animations on button interactions
- [ ] Style scrollbar if content overflows on small screens
- [ ] Cross-browser test (Chrome, Firefox, Safari)

### Phase 9: Final Verification

- [ ] All 9 preset patterns load and behave correctly
- [ ] Blinker oscillates with period 2
- [ ] Glider moves diagonally
- [ ] Glider Gun produces gliders every 30 generations
- [ ] Diehard vanishes at generation 130
- [ ] Speed slider smoothly adjusts simulation rate from 1–30 gen/s
- [ ] Grid size change preserves general cell positions where possible
- [ ] Clear resets everything including generation counter
- [ ] Random button produces varied initial states
- [ ] Draw/erase works during both paused and running states
- [ ] Generation and alive counters update accurately
- [ ] No console errors during normal operation
- [ ] Page loads cleanly with no external dependencies
