# Ecosystem Simulator — Implementation Plan

---

## 1. Overview

### What It Is

The Ecosystem Simulator is a real-time, browser-based predator–prey simulation rendered on an HTML5 Canvas. Autonomous agents (prey and predators) move across a 2-D world, interact via simple AI behaviours, and create emergent population dynamics inspired by the **Lotka–Volterra equations**. A second canvas displays a live scrolling population graph so the user can observe boom-and-bust cycles as they unfold.

### The Simulation Loop

The core runs on a `requestAnimationFrame` loop that executes every frame (~60 fps). Each tick:

1. **Update phase** — every living entity moves, loses energy, checks for nearby food/prey, eats, reproduces, or dies.
2. **Spawn phase** — new food (plants) appear at a configurable interval.
3. **Cleanup phase** — dead entities (energy ≤ 0) are removed from the entity arrays.
4. **Render phase** — the simulation canvas is cleared and all entities are redrawn.
5. **Graph phase** — the population counts are sampled and appended to the graph data; the graph canvas is redrawn with scrolling time axis.
6. **Stats phase** — on-screen counters for prey, predators, and food are updated.

A `deltaTime` value (ms since last frame, capped at 33 ms to prevent spiral-of-death) is passed to all update functions so behaviour is frame-rate-independent.

### Entity Behaviours

| Entity | Movement | Eating | Reproduction | Death |
|---|---|---|---|---|
| **Food (plant)** | Static | N/A | Spawned by the simulation at intervals | Consumed by prey |
| **Prey** | Wander randomly; flee when a predator is within detection radius | Eat food within eating radius to gain energy | Spawn offspring when energy > reproduction threshold | Energy reaches 0 |
| **Predator** | Chase nearest prey within detection radius; wander if none found | Eat prey within eating radius to gain energy | Spawn offspring when energy > reproduction threshold | Energy reaches 0 |

### Population Self-Regulation (Lotka–Volterra Inspired)

The system self-regulates through negative feedback loops:

1. **Abundant prey → predators thrive** — more prey means predators eat more, gain energy, and reproduce.
2. **Predator boom → prey decline** — too many predators deplete prey faster than prey can reproduce.
3. **Prey scarcity → predator decline** — with fewer prey, predators starve and their population crashes.
4. **Predator crash → prey recovery** — fewer predators lets surviving prey eat food, regain energy, and reproduce.

This creates oscillating population curves visible on the live graph. The user can shift the equilibrium by adjusting parameters like speed, energy costs, or reproduction thresholds.

---

## 2. Page Layout

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: "🌿 Ecosystem Simulator"                                   │
├──────────────────────────────────────────────┬───────────────────────┤
│                                              │   CONTROL PANEL       │
│                                              │                       │
│           SIMULATION CANVAS                  │  ▶ Play  ⏸ Pause     │
│           (800 × 500 default)                │  ↺ Reset              │
│                                              │                       │
│   Prey (green circles) move around           │  ── Parameters ──     │
│   Predators (red circles) chase prey         │                       │
│   Food (yellow dots) scattered               │  Prey Speed     [——●]│
│                                              │  Predator Speed [——●]│
│                                              │  Food Spawn Rate[——●]│
│                                              │  Start Energy   [——●]│
│                                              │  Repro Threshold[——●]│
│                                              │  Initial Prey   [——●]│
│                                              │  Initial Preds  [——●]│
│                                              │  Energy Decay   [——●]│
│                                              │                       │
│                                              │  ── Population ──     │
│                                              │  🟢 Prey:  42         │
│                                              │  🔴 Predators: 12     │
│                                              │  🟡 Food: 87          │
├──────────────────────────────────────────────┴───────────────────────┤
│                                                                      │
│              POPULATION GRAPH CANVAS (full width × 200)              │
│   ┌──────────────────────────────────────────────────────────┐       │
│   │  prey ───  predators ───                                 │       │
│   │     /\        /\                                         │       │
│   │    /  \  /\  /  \                                        │       │
│   │   /    \/  \/    \───                                    │       │
│   │──/                                                       │       │
│   └──────────────────────────────────────────────────────────┘       │
│                        Time →                                        │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER: "Adjust parameters to see how populations change"           │
└──────────────────────────────────────────────────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 900 px | Simulation canvas + control panel side-by-side; graph full width below |
| < 900 px | Everything stacks vertically: canvas → controls → graph |

Both canvases resize via JS on `window.resize`, maintaining aspect ratio. The simulation canvas uses `canvas.width = container.clientWidth` and scales proportionally.

---

## 3. Colour Scheme & Typography

### Colour Palette (CSS Variables)

```css
:root {
  /* Canvas colours */
  --canvas-bg: #1a1a2e;            /* dark navy background for the sim */
  --food-colour: #f5c842;          /* warm yellow for food/plants */
  --prey-colour: #43b581;          /* soft green for prey */
  --predator-colour: #e84057;      /* vibrant red for predators */
  --prey-glow: rgba(67, 181, 129, 0.3);
  --predator-glow: rgba(232, 64, 87, 0.3);

  /* Graph colours */
  --graph-bg: #16213e;             /* dark blue for graph canvas */
  --graph-grid: #2a2a4a;           /* subtle grid lines */
  --graph-prey-line: #43b581;      /* matches prey colour */
  --graph-predator-line: #e84057;  /* matches predator colour */
  --graph-axis: #8892b0;           /* muted axis labels */

  /* UI colours */
  --ui-bg: #0f3460;                /* panel background */
  --ui-bg-light: #16213e;          /* lighter panel variant */
  --ui-text: #e6e6e6;             /* primary text */
  --ui-text-muted: #8892b0;       /* secondary text */
  --ui-accent: #00b4d8;           /* accent for buttons/highlights */
  --ui-accent-hover: #0096c7;     /* button hover */
  --ui-border: #2a2a4a;           /* subtle borders */
  --ui-danger: #e84057;           /* reset button */
  --ui-success: #43b581;          /* play button */

  /* Slider track/thumb */
  --slider-track: #2a2a4a;
  --slider-thumb: #00b4d8;
  --slider-thumb-hover: #0096c7;
}
```

### Typography

```css
:root {
  --font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;

  --text-xs: 0.75rem;    /* 12px — fine labels */
  --text-sm: 0.875rem;   /* 14px — slider labels */
  --text-base: 1rem;     /* 16px — body */
  --text-lg: 1.25rem;    /* 20px — section headings */
  --text-xl: 1.5rem;     /* 24px — page title */

  --weight-normal: 400;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ecosystem Simulator</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ── Header ────────────────────────────────────────── -->
  <header class="site-header">
    <h1 class="site-header__title">🌿 Ecosystem Simulator</h1>
    <p class="site-header__subtitle">Watch predator–prey dynamics unfold in real time</p>
  </header>

  <!-- ── Main Content ──────────────────────────────────── -->
  <main class="app-layout">

    <!-- Simulation Canvas -->
    <section class="sim-panel" aria-label="Simulation display">
      <canvas
        id="sim-canvas"
        class="sim-panel__canvas"
        width="800"
        height="500"
        role="img"
        aria-label="Ecosystem simulation canvas showing predators and prey moving"
      >
        Your browser does not support the Canvas element.
      </canvas>
    </section>

    <!-- Control Panel -->
    <aside class="control-panel" aria-label="Simulation controls">
      <h2 class="control-panel__heading">Controls</h2>

      <!-- Playback Buttons -->
      <div class="control-panel__buttons" role="group" aria-label="Playback controls">
        <button id="btn-play" class="btn btn--play" type="button" aria-label="Play simulation">
          ▶ Play
        </button>
        <button id="btn-pause" class="btn btn--pause" type="button" aria-label="Pause simulation" disabled>
          ⏸ Pause
        </button>
        <button id="btn-reset" class="btn btn--reset" type="button" aria-label="Reset simulation">
          ↺ Reset
        </button>
      </div>

      <!-- Parameter Sliders -->
      <fieldset class="control-panel__params">
        <legend class="control-panel__legend">Parameters</legend>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-prey-speed">
            Prey Speed
            <output id="val-prey-speed" class="slider-group__value">2.0</output>
          </label>
          <input
            type="range" id="slider-prey-speed"
            class="slider-group__input"
            min="0.5" max="5" step="0.1" value="2.0"
            aria-describedby="val-prey-speed"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-predator-speed">
            Predator Speed
            <output id="val-predator-speed" class="slider-group__value">2.5</output>
          </label>
          <input
            type="range" id="slider-predator-speed"
            class="slider-group__input"
            min="0.5" max="5" step="0.1" value="2.5"
            aria-describedby="val-predator-speed"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-food-rate">
            Food Spawn Rate
            <output id="val-food-rate" class="slider-group__value">5</output>
          </label>
          <input
            type="range" id="slider-food-rate"
            class="slider-group__input"
            min="1" max="20" step="1" value="5"
            aria-describedby="val-food-rate"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-start-energy">
            Starting Energy
            <output id="val-start-energy" class="slider-group__value">100</output>
          </label>
          <input
            type="range" id="slider-start-energy"
            class="slider-group__input"
            min="30" max="300" step="5" value="100"
            aria-describedby="val-start-energy"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-repro-threshold">
            Reproduction Threshold
            <output id="val-repro-threshold" class="slider-group__value">150</output>
          </label>
          <input
            type="range" id="slider-repro-threshold"
            class="slider-group__input"
            min="50" max="400" step="10" value="150"
            aria-describedby="val-repro-threshold"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-initial-prey">
            Initial Prey Count
            <output id="val-initial-prey" class="slider-group__value">30</output>
          </label>
          <input
            type="range" id="slider-initial-prey"
            class="slider-group__input"
            min="5" max="100" step="1" value="30"
            aria-describedby="val-initial-prey"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-initial-predators">
            Initial Predators
            <output id="val-initial-predators" class="slider-group__value">5</output>
          </label>
          <input
            type="range" id="slider-initial-predators"
            class="slider-group__input"
            min="1" max="30" step="1" value="5"
            aria-describedby="val-initial-predators"
          />
        </div>

        <div class="slider-group">
          <label class="slider-group__label" for="slider-energy-decay">
            Energy Decay Rate
            <output id="val-energy-decay" class="slider-group__value">0.3</output>
          </label>
          <input
            type="range" id="slider-energy-decay"
            class="slider-group__input"
            min="0.05" max="1.0" step="0.05" value="0.3"
            aria-describedby="val-energy-decay"
          />
        </div>
      </fieldset>

      <!-- Population Stats -->
      <div class="stat-display" aria-live="polite" aria-label="Population statistics">
        <h3 class="stat-display__heading">Population</h3>
        <div class="stat-display__row">
          <span class="stat-display__dot stat-display__dot--prey"></span>
          <span class="stat-display__label">Prey:</span>
          <span id="stat-prey" class="stat-display__count">0</span>
        </div>
        <div class="stat-display__row">
          <span class="stat-display__dot stat-display__dot--predator"></span>
          <span class="stat-display__label">Predators:</span>
          <span id="stat-predators" class="stat-display__count">0</span>
        </div>
        <div class="stat-display__row">
          <span class="stat-display__dot stat-display__dot--food"></span>
          <span class="stat-display__label">Food:</span>
          <span id="stat-food" class="stat-display__count">0</span>
        </div>
      </div>
    </aside>
  </main>

  <!-- ── Population Graph ──────────────────────────────── -->
  <section class="graph-section" aria-label="Population graph">
    <canvas
      id="graph-canvas"
      class="graph-section__canvas"
      width="900"
      height="200"
      role="img"
      aria-label="Line graph of predator and prey populations over time"
    >
      Population graph not supported in your browser.
    </canvas>
    <div class="graph-section__legend">
      <span class="graph-legend__item graph-legend__item--prey">── Prey</span>
      <span class="graph-legend__item graph-legend__item--predator">── Predators</span>
    </div>
  </section>

  <!-- ── Footer ────────────────────────────────────────── -->
  <footer class="site-footer">
    <p>Adjust parameters to see how populations change</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 5. CSS Design

### Layout Strategy

- **CSS Grid** for the top-level `app-layout`: two columns on desktop (canvas 3fr, controls 1fr), single column on mobile.
- **Flexbox** inside the control panel for vertical stacking of slider groups.
- Both canvases have `display: block; width: 100%; height: auto;` for fluid sizing.

### Key CSS Rules

```css
/* ── Reset ──────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-primary);
  background: #0a0a1a;
  color: var(--ui-text);
  line-height: 1.5;
  min-height: 100vh;
}

/* ── Header ─────────────────────────────────────── */
.site-header {
  text-align: center;
  padding: 1.5rem 1rem 1rem;
  background: var(--ui-bg);
  border-bottom: 2px solid var(--ui-border);
}

.site-header__title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
}

.site-header__subtitle {
  font-size: var(--text-sm);
  color: var(--ui-text-muted);
  margin-top: 0.25rem;
}

/* ── App Layout (sim + controls) ────────────────── */
.app-layout {
  display: grid;
  grid-template-columns: 3fr 280px;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Simulation Canvas ──────────────────────────── */
.sim-panel__canvas {
  display: block;
  width: 100%;
  height: auto;
  border: 2px solid var(--ui-border);
  border-radius: 8px;
  background: var(--canvas-bg);
}

/* ── Control Panel ──────────────────────────────── */
.control-panel {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 540px;
  overflow-y: auto;
}

.control-panel__heading {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  text-align: center;
}

/* ── Buttons ────────────────────────────────────── */
.control-panel__buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  color: #fff;
}

.btn:active { transform: scale(0.96); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.btn--play    { background: var(--ui-success); }
.btn--play:hover:not(:disabled) { background: #3aa076; }
.btn--pause   { background: var(--ui-accent); }
.btn--pause:hover:not(:disabled) { background: var(--ui-accent-hover); }
.btn--reset   { background: var(--ui-danger); }
.btn--reset:hover:not(:disabled) { background: #c73549; }

/* ── Slider Groups ──────────────────────────────── */
.control-panel__params {
  border: none;
}

.control-panel__legend {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--ui-accent);
  margin-bottom: 0.5rem;
}

.slider-group {
  margin-bottom: 0.75rem;
}

.slider-group__label {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  margin-bottom: 0.25rem;
}

.slider-group__value {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ui-accent);
}

.slider-group__input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--slider-track);
  border-radius: 3px;
  outline: none;
}

.slider-group__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--slider-thumb);
  cursor: pointer;
  transition: background 0.2s;
}

.slider-group__input::-webkit-slider-thumb:hover {
  background: var(--slider-thumb-hover);
}

/* ── Stat Display ───────────────────────────────── */
.stat-display {
  background: var(--ui-bg-light);
  border-radius: 6px;
  padding: 0.75rem;
}

.stat-display__heading {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  margin-bottom: 0.5rem;
  text-align: center;
}

.stat-display__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.stat-display__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-display__dot--prey     { background: var(--prey-colour); }
.stat-display__dot--predator { background: var(--predator-colour); }
.stat-display__dot--food     { background: var(--food-colour); }

.stat-display__count {
  font-family: var(--font-mono);
  font-weight: var(--weight-bold);
  margin-left: auto;
}

/* ── Graph Section ──────────────────────────────── */
.graph-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 1rem;
}

.graph-section__canvas {
  display: block;
  width: 100%;
  height: auto;
  border: 2px solid var(--ui-border);
  border-radius: 8px;
  background: var(--graph-bg);
}

.graph-section__legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 0.5rem;
  font-size: var(--text-sm);
}

.graph-legend__item--prey     { color: var(--graph-prey-line); }
.graph-legend__item--predator { color: var(--graph-predator-line); }

/* ── Footer ─────────────────────────────────────── */
.site-footer {
  text-align: center;
  padding: 1rem;
  color: var(--ui-text-muted);
  font-size: var(--text-sm);
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 899px) {
  .app-layout {
    grid-template-columns: 1fr;
  }

  .control-panel {
    max-height: none;
    flex-direction: column;
  }

  .control-panel__buttons {
    flex-wrap: wrap;
  }
}
```

---

## 6. JavaScript Architecture

### File / Module Map

```
js/
├── main.js               Entry point, imports all modules, runs init
└── modules/
    ├── config.js          Default parameter values and limits
    ├── entity.js          Base Entity class
    ├── prey.js            Prey class (extends Entity)
    ├── predator.js        Predator class (extends Entity)
    ├── food.js            Food class and spawning logic
    ├── simulation.js      Entity manager — update, collisions, spawning, cleanup
    ├── renderer.js        Draw entities on simulation canvas
    ├── graph.js           Live population graph on graph canvas
    └── controls.js        Bind DOM inputs to config values
```

---

### `js/modules/config.js`

Exports a mutable `config` object read by all modules:

```js
export const config = {
  // Canvas
  canvasWidth: 800,
  canvasHeight: 500,
  graphWidth: 900,
  graphHeight: 200,

  // Initial populations
  initialPrey: 30,
  initialPredators: 5,

  // Movement
  preySpeed: 2.0,           // px per frame (scaled by dt)
  predatorSpeed: 2.5,

  // Energy
  startEnergy: 100,
  energyDecayRate: 0.3,      // energy lost per frame
  preyFoodEnergy: 25,        // energy prey gains from eating food
  predatorKillEnergy: 60,    // energy predator gains from eating prey

  // Reproduction
  reproductionThreshold: 150, // energy required to reproduce
  reproductionCost: 60,       // energy deducted from parent on reproduction

  // Detection & Interaction
  preyDetectionRadius: 80,    // how far prey can "see" predators
  predatorDetectionRadius: 120, // how far predators can "see" prey
  eatingRadius: 10,           // distance at which eating/catching occurs

  // Food
  foodSpawnRate: 5,           // new food items per second
  maxFood: 200,               // cap to prevent runaway food
  foodRadius: 4,              // draw size

  // Entity sizes
  preyRadius: 6,
  predatorRadius: 8,

  // Population caps (soft — prevents simulation from overwhelming the browser)
  maxPrey: 300,
  maxPredators: 150,

  // Wander angle change
  wanderJitter: 0.3,          // radians of random turn per frame

  // Graph
  graphSampleInterval: 200,   // ms between graph data samples
  graphMaxSamples: 300,       // rolling window (~60 s at 200 ms/sample)
};
```

---

### `js/modules/entity.js`

```js
/**
 * Base class for all moving agents.
 * Stores position, velocity (as angle + speed), and energy.
 */
export class Entity {
  constructor(x, y, speed, energy) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = energy;
    this.angle = Math.random() * Math.PI * 2; // random starting direction
    this.alive = true;
  }

  /**
   * Move in the current direction. Wrap around canvas edges.
   * @param {number} dt — delta time normalised (dt / 16.67)
   * @param {number} canvasW
   * @param {number} canvasH
   */
  move(dt, canvasW, canvasH) {
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    // Wrap edges
    if (this.x < 0) this.x += canvasW;
    if (this.x > canvasW) this.x -= canvasW;
    if (this.y < 0) this.y += canvasH;
    if (this.y > canvasH) this.y -= canvasH;
  }

  /**
   * Subtract energy each frame. Mark dead if depleted.
   * @param {number} decayRate
   * @param {number} dt
   */
  decay(decayRate, dt) {
    this.energy -= decayRate * dt;
    if (this.energy <= 0) {
      this.energy = 0;
      this.alive = false;
    }
  }

  /**
   * Distance to another entity.
   */
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Angle toward another entity.
   */
  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }
}
```

---

### `js/modules/prey.js`

```js
import { Entity } from './entity.js';
import { config } from './config.js';

export class Prey extends Entity {
  constructor(x, y) {
    super(x, y, config.preySpeed, config.startEnergy);
  }

  /**
   * Prey AI — runs each frame.
   * 1. Check for nearby predators → flee the closest one.
   * 2. Else check for nearby food → steer toward it.
   * 3. Else wander randomly.
   * 4. Decay energy.
   *
   * @param {number} dt
   * @param {Predator[]} predators
   * @param {Food[]} foods
   */
  update(dt, predators, foods) {
    const nearest = this.findNearest(predators, config.preyDetectionRadius);

    if (nearest) {
      // Flee — move directly away
      this.angle = this.angleTo(nearest) + Math.PI;
    } else {
      // Seek food
      const nearestFood = this.findNearest(foods, config.preyDetectionRadius);
      if (nearestFood) {
        this.angle = this.angleTo(nearestFood);
      } else {
        // Wander
        this.angle += (Math.random() - 0.5) * config.wanderJitter * 2;
      }
    }

    this.speed = config.preySpeed; // live-update from slider
    this.move(dt, config.canvasWidth, config.canvasHeight);
    this.decay(config.energyDecayRate, dt);
  }

  /**
   * Try to eat a food item within eatingRadius.
   * @param {Food[]} foods
   * @returns {Food|null} the consumed food, or null
   */
  tryEat(foods) {
    for (const food of foods) {
      if (!food.alive) continue;
      if (this.distanceTo(food) < config.eatingRadius + config.foodRadius) {
        food.alive = false;
        this.energy += config.preyFoodEnergy;
        return food;
      }
    }
    return null;
  }

  /**
   * Reproduce if energy exceeds threshold.
   * @returns {Prey|null}
   */
  tryReproduce() {
    if (this.energy >= config.reproductionThreshold) {
      this.energy -= config.reproductionCost;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      return new Prey(this.x + offsetX, this.y + offsetY);
    }
    return null;
  }

  /**
   * Find nearest alive entity within radius.
   */
  findNearest(entities, radius) {
    let closest = null;
    let closestDist = radius;
    for (const e of entities) {
      if (!e.alive) continue;
      const d = this.distanceTo(e);
      if (d < closestDist) {
        closestDist = d;
        closest = e;
      }
    }
    return closest;
  }
}
```

---

### `js/modules/predator.js`

```js
import { Entity } from './entity.js';
import { config } from './config.js';

export class Predator extends Entity {
  constructor(x, y) {
    super(x, y, config.predatorSpeed, config.startEnergy);
  }

  /**
   * Predator AI — runs each frame.
   * 1. Find nearest prey within detection radius → chase it.
   * 2. If no prey found → wander randomly.
   * 3. Decay energy (predators decay slightly faster to balance ecosystem).
   *
   * @param {number} dt
   * @param {Prey[]} prey
   */
  update(dt, prey) {
    const target = this.findNearest(prey, config.predatorDetectionRadius);

    if (target) {
      this.angle = this.angleTo(target);
    } else {
      this.angle += (Math.random() - 0.5) * config.wanderJitter * 2;
    }

    this.speed = config.predatorSpeed;
    this.move(dt, config.canvasWidth, config.canvasHeight);
    // Predators lose energy 20 % faster than prey
    this.decay(config.energyDecayRate * 1.2, dt);
  }

  /**
   * Try to eat prey within eatingRadius.
   * @param {Prey[]} prey
   * @returns {Prey|null} the consumed prey, or null
   */
  tryEat(prey) {
    for (const p of prey) {
      if (!p.alive) continue;
      if (this.distanceTo(p) < config.eatingRadius + config.preyRadius) {
        p.alive = false;
        this.energy += config.predatorKillEnergy;
        return p;
      }
    }
    return null;
  }

  /**
   * Reproduce if energy exceeds threshold.
   * @returns {Predator|null}
   */
  tryReproduce() {
    if (this.energy >= config.reproductionThreshold) {
      this.energy -= config.reproductionCost;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      return new Predator(this.x + offsetX, this.y + offsetY);
    }
    return null;
  }

  /** Find nearest alive entity within radius. */
  findNearest(entities, radius) {
    let closest = null;
    let closestDist = radius;
    for (const e of entities) {
      if (!e.alive) continue;
      const d = this.distanceTo(e);
      if (d < closestDist) {
        closestDist = d;
        closest = e;
      }
    }
    return closest;
  }
}
```

---

### `js/modules/food.js`

```js
import { config } from './config.js';

export class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
  }
}

/**
 * Spawn a batch of food at random canvas positions.
 * @param {number} count
 * @returns {Food[]}
 */
export function spawnFood(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * config.canvasWidth;
    const y = Math.random() * config.canvasHeight;
    items.push(new Food(x, y));
  }
  return items;
}
```

---

### `js/modules/simulation.js`

Manages entity arrays, runs update/collision logic per frame, handles spawning and cleanup:

```js
import { Prey } from './prey.js';
import { Predator } from './predator.js';
import { Food, spawnFood } from './food.js';
import { config } from './config.js';

export class Simulation {
  constructor() {
    this.preyList = [];
    this.predatorList = [];
    this.foodList = [];
    this.foodTimer = 0;       // accumulates dt to control food spawn interval
  }

  /** Populate initial entities. */
  init() {
    this.preyList = [];
    this.predatorList = [];
    this.foodList = [];
    this.foodTimer = 0;

    for (let i = 0; i < config.initialPrey; i++) {
      const x = Math.random() * config.canvasWidth;
      const y = Math.random() * config.canvasHeight;
      this.preyList.push(new Prey(x, y));
    }

    for (let i = 0; i < config.initialPredators; i++) {
      const x = Math.random() * config.canvasWidth;
      const y = Math.random() * config.canvasHeight;
      this.predatorList.push(new Predator(x, y));
    }

    // Start with some food already on the field
    this.foodList = spawnFood(40);
  }

  /**
   * Run one simulation tick.
   * @param {number} dt — normalised delta time (1.0 ≈ 16.67 ms)
   */
  update(dt) {
    // 1. Update prey
    for (const prey of this.preyList) {
      prey.update(dt, this.predatorList, this.foodList);
      prey.tryEat(this.foodList);
    }

    // 2. Update predators
    for (const pred of this.predatorList) {
      pred.update(dt, this.preyList);
      pred.tryEat(this.preyList);
    }

    // 3. Reproduction — collect newborns, add after iteration
    const newPrey = [];
    for (const prey of this.preyList) {
      if (!prey.alive) continue;
      const offspring = prey.tryReproduce();
      if (offspring && this.preyList.length + newPrey.length < config.maxPrey) {
        newPrey.push(offspring);
      }
    }

    const newPredators = [];
    for (const pred of this.predatorList) {
      if (!pred.alive) continue;
      const offspring = pred.tryReproduce();
      if (offspring && this.predatorList.length + newPredators.length < config.maxPredators) {
        newPredators.push(offspring);
      }
    }

    this.preyList.push(...newPrey);
    this.predatorList.push(...newPredators);

    // 4. Spawn food at interval
    this.foodTimer += dt;
    const spawnInterval = 60 / config.foodSpawnRate; // frames between spawns at 60 fps
    if (this.foodTimer >= spawnInterval && this.foodList.length < config.maxFood) {
      this.foodList.push(...spawnFood(1));
      this.foodTimer = 0;
    }

    // 5. Cleanup dead entities
    this.preyList = this.preyList.filter(e => e.alive);
    this.predatorList = this.predatorList.filter(e => e.alive);
    this.foodList = this.foodList.filter(e => e.alive);
  }

  /** Return current counts. */
  getCounts() {
    return {
      prey: this.preyList.length,
      predators: this.predatorList.length,
      food: this.foodList.length,
    };
  }
}
```

---

### `js/modules/renderer.js`

Draws all entities on the simulation canvas:

```js
import { config } from './config.js';

export class Renderer {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /** Clear and redraw everything. */
  draw(simulation) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Food — small yellow circles
    ctx.fillStyle = '#f5c842';
    for (const food of simulation.foodList) {
      ctx.beginPath();
      ctx.arc(food.x, food.y, config.foodRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Prey — green circles with subtle glow
    for (const prey of simulation.preyList) {
      // Glow
      ctx.fillStyle = 'rgba(67, 181, 129, 0.25)';
      ctx.beginPath();
      ctx.arc(prey.x, prey.y, config.preyRadius + 4, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = '#43b581';
      ctx.beginPath();
      ctx.arc(prey.x, prey.y, config.preyRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Predators — red circles with subtle glow
    for (const pred of simulation.predatorList) {
      // Glow
      ctx.fillStyle = 'rgba(232, 64, 87, 0.25)';
      ctx.beginPath();
      ctx.arc(pred.x, pred.y, config.predatorRadius + 4, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = '#e84057';
      ctx.beginPath();
      ctx.arc(pred.x, pred.y, config.predatorRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
```

---

### `js/modules/graph.js`

Renders a live scrolling line graph of population counts on the second canvas:

```js
import { config } from './config.js';

export class PopulationGraph {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.preyData = [];      // rolling array of prey counts
    this.predatorData = [];   // rolling array of predator counts
    this.lastSampleTime = 0;
  }

  /** Clear history. */
  reset() {
    this.preyData = [];
    this.predatorData = [];
    this.lastSampleTime = 0;
  }

  /**
   * Called every frame. Samples at config.graphSampleInterval.
   * @param {number} timestamp — performance.now()
   * @param {{ prey: number, predators: number }} counts
   */
  sample(timestamp, counts) {
    if (timestamp - this.lastSampleTime < config.graphSampleInterval) return;
    this.lastSampleTime = timestamp;

    this.preyData.push(counts.prey);
    this.predatorData.push(counts.predators);

    // Trim to rolling window
    if (this.preyData.length > config.graphMaxSamples) {
      this.preyData.shift();
      this.predatorData.shift();
    }
  }

  /** Redraw the graph canvas. */
  draw() {
    const ctx = this.ctx;
    const W = config.graphWidth;
    const H = config.graphHeight;
    const PAD_LEFT = 40;
    const PAD_BOTTOM = 20;
    const PAD_TOP = 10;
    const PAD_RIGHT = 10;
    const plotW = W - PAD_LEFT - PAD_RIGHT;
    const plotH = H - PAD_TOP - PAD_BOTTOM;

    // Clear
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, W, H);

    if (this.preyData.length < 2) return;

    // Determine Y-axis max (auto-scale)
    const allValues = [...this.preyData, ...this.predatorData];
    const maxVal = Math.max(10, ...allValues);
    const yMax = Math.ceil(maxVal / 10) * 10; // round up to nearest 10

    // Draw grid lines
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = PAD_TOP + (plotH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(PAD_LEFT + plotW, y);
      ctx.stroke();

      // Y labels
      const label = Math.round(yMax - (yMax / gridLines) * i);
      ctx.fillStyle = '#8892b0';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(label, PAD_LEFT - 6, y + 4);
    }

    // Draw lines
    this.drawLine(this.preyData, '#43b581', yMax, plotW, plotH, PAD_LEFT, PAD_TOP);
    this.drawLine(this.predatorData, '#e84057', yMax, plotW, plotH, PAD_LEFT, PAD_TOP);
  }

  /** Helper — draw one data series as a line. */
  drawLine(data, colour, yMax, plotW, plotH, padLeft, padTop) {
    const ctx = this.ctx;
    const step = plotW / (config.graphMaxSamples - 1);

    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const startIndex = Math.max(0, data.length - config.graphMaxSamples);
    for (let i = 0; i < data.length; i++) {
      const x = padLeft + i * step;
      const y = padTop + plotH - (data[i] / yMax) * plotH;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}
```

---

### `js/modules/controls.js`

Binds DOM slider inputs to `config` values and updates `<output>` displays:

```js
import { config } from './config.js';

/** Slider binding definitions: [inputId, outputId, configKey, parser] */
const BINDINGS = [
  ['slider-prey-speed',       'val-prey-speed',       'preySpeed',              parseFloat],
  ['slider-predator-speed',   'val-predator-speed',   'predatorSpeed',          parseFloat],
  ['slider-food-rate',        'val-food-rate',         'foodSpawnRate',          parseInt],
  ['slider-start-energy',     'val-start-energy',      'startEnergy',           parseInt],
  ['slider-repro-threshold',  'val-repro-threshold',   'reproductionThreshold', parseInt],
  ['slider-initial-prey',     'val-initial-prey',      'initialPrey',           parseInt],
  ['slider-initial-predators','val-initial-predators',  'initialPredators',     parseInt],
  ['slider-energy-decay',     'val-energy-decay',      'energyDecayRate',       parseFloat],
];

/**
 * Initialise slider bindings. Each slider updates config live.
 */
export function initControls() {
  for (const [inputId, outputId, key, parser] of BINDINGS) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    if (!input || !output) continue;

    input.addEventListener('input', () => {
      const val = parser(input.value);
      config[key] = val;
      output.textContent = input.value;
    });
  }
}

/**
 * Update the stat display elements.
 * @param {{ prey: number, predators: number, food: number }} counts
 */
export function updateStats(counts) {
  document.getElementById('stat-prey').textContent = counts.prey;
  document.getElementById('stat-predators').textContent = counts.predators;
  document.getElementById('stat-food').textContent = counts.food;
}
```

---

### `js/main.js`

Entry point — initialises everything and runs the game loop:

```js
import { config } from './modules/config.js';
import { Simulation } from './modules/simulation.js';
import { Renderer } from './modules/renderer.js';
import { PopulationGraph } from './modules/graph.js';
import { initControls, updateStats } from './modules/controls.js';

// ── DOM Elements ──────────────────────────────────────
const simCanvas = document.getElementById('sim-canvas');
const simCtx = simCanvas.getContext('2d');

const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');

// ── State ─────────────────────────────────────────────
let simulation;
let renderer;
let graph;
let running = false;
let animFrameId = null;
let lastTimestamp = 0;

// ── Init ──────────────────────────────────────────────
function init() {
  resizeCanvases();
  simulation = new Simulation();
  renderer = new Renderer(simCtx);
  graph = new PopulationGraph(graphCtx);
  simulation.init();
  initControls();
  renderer.draw(simulation);
  updateStats(simulation.getCounts());
}

// ── Game Loop ─────────────────────────────────────────
function loop(timestamp) {
  if (!running) return;

  const rawDt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  const dt = Math.min(rawDt, 33) / 16.67; // normalise: 1.0 ≈ one frame at 60 fps

  simulation.update(dt);
  renderer.draw(simulation);

  const counts = simulation.getCounts();
  updateStats(counts);
  graph.sample(timestamp, counts);
  graph.draw();

  animFrameId = requestAnimationFrame(loop);
}

// ── Controls ──────────────────────────────────────────
function play() {
  if (running) return;
  running = true;
  btnPlay.disabled = true;
  btnPause.disabled = false;
  lastTimestamp = performance.now();
  animFrameId = requestAnimationFrame(loop);
}

function pause() {
  running = false;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  if (animFrameId) cancelAnimationFrame(animFrameId);
}

function reset() {
  pause();
  graph.reset();
  simulation.init();
  renderer.draw(simulation);
  updateStats(simulation.getCounts());
  graph.draw();
}

btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);
btnReset.addEventListener('click', reset);

// ── Resize ────────────────────────────────────────────
function resizeCanvases() {
  const simContainer = simCanvas.parentElement;
  const simW = simContainer.clientWidth;
  const simH = Math.round(simW * (500 / 800));
  simCanvas.width = simW;
  simCanvas.height = simH;
  config.canvasWidth = simW;
  config.canvasHeight = simH;

  const graphContainer = graphCanvas.parentElement;
  const gW = graphContainer.clientWidth;
  graphCanvas.width = gW;
  graphCanvas.height = 200;
  config.graphWidth = gW;
  config.graphHeight = 200;
}

window.addEventListener('resize', () => {
  resizeCanvases();
  if (!running) {
    renderer.draw(simulation);
    graph.draw();
  }
});

// ── Start ─────────────────────────────────────────────
init();
```

---

## 7. Simulation Mechanics

### Movement Algorithms

| Behaviour | Algorithm |
|---|---|
| **Wander** | Each frame, the entity's `angle` is perturbed by `(Math.random() - 0.5) * wanderJitter * 2` (±0.3 rad). Position updates by `(cos(angle) * speed * dt, sin(angle) * speed * dt)`. |
| **Flee** (prey) | Angle is set to `angleTo(predator) + π` — directly away from the nearest predator within `preyDetectionRadius` (80 px). |
| **Seek food** (prey) | If no predator is nearby, angle is set toward the nearest food within `preyDetectionRadius`. |
| **Chase** (predator) | Angle is set to `angleTo(prey)` — directly toward the nearest prey within `predatorDetectionRadius` (120 px). |
| **Edge wrapping** | Entities wrap toroidally: leaving the left edge reappears on the right, and vice versa for top/bottom. |

### Energy System

| Parameter | Default | Description |
|---|---|---|
| `startEnergy` | 100 | Energy every new entity (and offspring) starts with |
| `energyDecayRate` | 0.3 / frame | Passive energy loss per normalised frame. Predators lose ×1.2 of this. |
| `preyFoodEnergy` | 25 | Energy prey gains from eating one food |
| `predatorKillEnergy` | 60 | Energy predator gains from eating one prey |

### Reproduction Rules

1. Each frame, if `entity.energy >= config.reproductionThreshold` (default 150) **and** the population is below the soft cap (`maxPrey` 300 / `maxPredators` 150):
   - Deduct `reproductionCost` (60) from the parent.
   - Spawn a new entity of the same type at the parent's position ± 10 px random offset.
   - The offspring starts with `startEnergy` (100).
2. Reproduction is checked **after** movement and eating so that an entity can eat and reproduce in the same frame.

### Death Conditions

- Energy drops to ≤ 0 (from passive decay or from never eating) → `alive = false`.
- Prey eaten by a predator → `alive = false` (set during predator's `tryEat`).

### Collision / Eating Radius

- An entity "eats" a target when `distanceTo(target) < eatingRadius (10) + targetRadius`.
  - Prey eats food: `10 + 4 = 14 px`.
  - Predator eats prey: `10 + 6 = 16 px`.
- Detection (flee/chase) uses `preyDetectionRadius` (80 px) and `predatorDetectionRadius` (120 px) respectively.

### Food Regrowth

- New food items spawn at a rate of `foodSpawnRate` per second (default 5/sec → one food every 12 frames at 60 fps).
- Maximum food items capped at `maxFood` (200) to prevent performance issues.
- On reset, 40 food items are spawned immediately so prey have something to eat.

### Parameter Slider Ranges

| Parameter | Min | Max | Step | Default |
|---|---|---|---|---|
| Prey Speed | 0.5 | 5.0 | 0.1 | 2.0 |
| Predator Speed | 0.5 | 5.0 | 0.1 | 2.5 |
| Food Spawn Rate | 1 | 20 | 1 | 5 |
| Starting Energy | 30 | 300 | 5 | 100 |
| Reproduction Threshold | 50 | 400 | 10 | 150 |
| Initial Prey | 5 | 100 | 1 | 30 |
| Initial Predators | 1 | 30 | 1 | 5 |
| Energy Decay Rate | 0.05 | 1.0 | 0.05 | 0.3 |

---

## 8. Graph Rendering

### Sampling

- Every `graphSampleInterval` ms (default 200 ms), `graph.sample(timestamp, counts)` pushes the current `prey` and `predator` counts onto rolling arrays.
- Arrays are capped at `graphMaxSamples` (300 entries). At 200 ms/sample this represents ~60 seconds of history.
- When the array exceeds 300, the oldest sample is removed via `shift()`, creating a scrolling effect.

### Drawing Algorithm

Each `graph.draw()` call:

1. **Clear** the graph canvas with the graph background colour (`#16213e`).
2. **Compute Y-axis max** — `Math.max(10, ...allValues)` rounded up to the nearest 10 to prevent jitter.
3. **Draw horizontal grid lines** — 4 evenly spaced lines across the plot area. Each labelled with its value on the left margin.
4. **Draw prey line** — iterate `preyData`, mapping each index to an X position (`padLeft + i * stepX`) and each value to a Y position (`padTop + plotH - (value / yMax) * plotH`). Connect with `lineTo`.
5. **Draw predator line** — same process with `predatorData` in a different colour.

### Axis Details

- **X-axis** (time): implicit — the rightmost point is "now", the leftmost is ~60 seconds ago. No numeric labels; the legend says "Time →" below.
- **Y-axis** (population): auto-scaled, labelled at 4 intervals. Padded left by 40 px.

### Colours & Legend

- Prey line: `#43b581` (green), 2 px stroke.
- Predator line: `#e84057` (red), 2 px stroke.
- A legend row below the canvas in HTML: `── Prey` (green) and `── Predators` (red).

---

## 9. Accessibility & State Management

### Accessibility

| Feature | Implementation |
|---|---|
| Semantic HTML | `<header>`, `<main>`, `<aside>`, `<section>`, `<footer>`, `<fieldset>`, `<legend>` |
| ARIA labels | Both `<canvas>` elements have `role="img"` and descriptive `aria-label` attributes |
| Live region | The `.stat-display` container has `aria-live="polite"` so screen readers announce population changes |
| Form labels | Every `<input type="range">` has an associated `<label>` with a `for` attribute |
| Output elements | `<output>` elements tied to each slider display the current value |
| Keyboard access | All buttons and sliders are natively keyboard-focusable and operable |
| Disabled states | Play/Pause buttons toggle `disabled` attribute to communicate state |
| Colour contrast | Text colours on dark backgrounds meet WCAG AA 4.5:1 ratio |
| Focus styles | Rely on browser default focus rings; do not remove `outline` |

### State Management

The simulation state is held entirely in the `Simulation` class instance:

- `preyList`, `predatorList`, `foodList` — arrays of entity objects.
- `running` boolean in `main.js` controls the animation frame loop.
- `config` object is the single source of truth for all tunable parameters; sliders write to it directly.
- **Reset** clears all entity arrays, reinitialises from `config`, and clears the graph data.
- No `localStorage` persistence is needed — the simulation is ephemeral.

---

## 10. Implementation Checklist

### Phase 1 — Scaffolding

- [ ] Create `index.html` with full markup (two canvases, control panel, buttons, sliders, stat display).
- [ ] Create `styles/main.css` with CSS variables, layout grid, control panel, slider and button styles, responsive breakpoint.
- [ ] Create `js/modules/config.js` with default parameter values.

### Phase 2 — Core Entity System

- [ ] Implement `js/modules/entity.js` — `Entity` base class (position, velocity, energy, `move()`, `decay()`, `distanceTo()`, `angleTo()`).
- [ ] Implement `js/modules/food.js` — `Food` class, `spawnFood()` function.
- [ ] Implement `js/modules/prey.js` — `Prey` class: `update()` (wander / flee / seek food), `tryEat()`, `tryReproduce()`, `findNearest()`.
- [ ] Implement `js/modules/predator.js` — `Predator` class: `update()` (chase / wander), `tryEat()`, `tryReproduce()`, `findNearest()`.

### Phase 3 — Simulation Manager

- [ ] Implement `js/modules/simulation.js` — `Simulation` class: `init()`, `update(dt)`, `getCounts()`.
- [ ] Verify entity updates run in correct order (move → eat → reproduce → cleanup).
- [ ] Test food spawning at correct intervals.
- [ ] Test population caps prevent runaway growth.

### Phase 4 — Rendering

- [ ] Implement `js/modules/renderer.js` — `Renderer` class: `draw()` clears canvas, draws food (yellow), prey (green + glow), predators (red + glow).
- [ ] Verify canvas clears and redraws each frame without artefacts.

### Phase 5 — Population Graph

- [ ] Implement `js/modules/graph.js` — `PopulationGraph` class: `sample()`, `draw()`, `reset()`.
- [ ] Verify auto-scaling Y-axis adjusts to population peaks.
- [ ] Verify scrolling window trims old data correctly.
- [ ] Verify both lines render with correct colours.

### Phase 6 — Controls & Integration

- [ ] Implement `js/modules/controls.js` — `initControls()`, `updateStats()`.
- [ ] Verify slider changes update `config` values immediately.
- [ ] Verify `<output>` elements update as sliders move.

### Phase 7 — Main Loop & Playback

- [ ] Implement `js/main.js` — `init()`, `loop()`, `play()`, `pause()`, `reset()`, `resizeCanvases()`.
- [ ] Verify Play starts the loop and disables the Play button / enables Pause.
- [ ] Verify Pause stops the loop cleanly.
- [ ] Verify Reset clears everything and redraws initial state.
- [ ] Verify `deltaTime` is capped at 33 ms to prevent spiral-of-death on tab switch.

### Phase 8 — Responsive & Polish

- [ ] Test at ≥ 900 px (side-by-side layout).
- [ ] Test at < 900 px (stacked layout).
- [ ] Verify both canvases resize on window resize and simulation still renders correctly.
- [ ] Test in Chrome, Firefox, Safari.
- [ ] Verify keyboard navigation through all controls.
- [ ] Confirm colour contrast meets WCAG AA.

### Phase 9 — Tuning & Balance

- [ ] Run simulation for 2–3 minutes with defaults; confirm populations oscillate rather than crashing permanently.
- [ ] Adjust `energyDecayRate`, `preyFoodEnergy`, `predatorKillEnergy`, `reproductionThreshold` if one species dominates.
- [ ] Test extreme slider values (max speed, max spawn rate) — simulation should remain performant.
- [ ] Profile with DevTools; aim for < 4 ms per frame with 300 prey + 150 predators + 200 food on the canvas.

---

*End of implementation plan.*
