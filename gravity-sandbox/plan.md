# Gravity Sandbox — Implementation Plan

---

## 1. Overview

### What It Is

Gravity Sandbox is an interactive Newtonian gravity simulation built entirely with vanilla HTML5 Canvas, CSS3, and JavaScript ES modules. Users click anywhere on a dark-space canvas to spawn celestial bodies with configurable mass. By clicking and dragging they can set an initial velocity vector. Once placed, every body attracts every other body via an inverse-square gravitational force law, producing realistic orbital mechanics — elliptical orbits, slingshot fly-bys, binary systems, chaotic three-body interactions, and collisions that merge smaller bodies into larger ones.

### User Interaction Flow

1. **Open the page** — a full-viewport dark canvas appears with a subtle animated starfield background. A compact control panel sits at the bottom or side of the screen.
2. **Set mass** — the user adjusts a mass slider (range 1–100, default 10). A preview circle near the slider shows the relative size of the body they are about to place.
3. **Click to place** — clicking on the canvas spawns a body at the cursor position with zero initial velocity (it will be pulled by existing bodies only).
4. **Click-and-drag to set velocity** — pressing down starts a placement; dragging draws an arrow (velocity vector preview) from the click point. On mouse-up the body is created with a velocity proportional to drag length and in the drag direction.
5. **Watch the simulation** — `requestAnimationFrame` drives a loop that computes gravitational forces between all body pairs, integrates positions via velocity Verlet, detects collisions, renders bodies with glow effects, and draws fading orbital trails.
6. **Pause / Play** — a toggle button freezes the physics update while still rendering the current state, letting the user inspect orbits.
7. **Reset** — clears every body and trail, returning to an empty canvas ready for a new experiment.

### Physics Concepts Used

| Concept | Role in the Simulation |
|---|---|
| Newton's Law of Universal Gravitation | `F = G * m1 * m2 / r²` — computes the attractive force between every pair of bodies each frame. |
| Superposition of forces | Each body sums the gravitational pull from all other bodies to get a single net force vector. |
| Velocity Verlet integration | A second-order symplectic integrator that updates position and velocity per timestep, preserving energy better than naïve Euler. |
| Conservation of momentum | When two bodies collide and merge, the resulting body's velocity is derived from momentum conservation: `v_new = (m1*v1 + m2*v2) / (m1 + m2)`. |
| Conservation of mass | A merged body's mass equals `m1 + m2`. |
| Inverse-square law | Gravitational force drops off with the square of the distance, producing the characteristic orbital shapes. |

---

## 2. Page Layout

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│ BROWSER VIEWPORT                                                    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │                     CANVAS (id="sim-canvas")                  │  │
│  │                                                               │  │
│  │         ·  ★          ·                       ·               │  │
│  │    ·              ○──→                  ·                     │  │
│  │              ·          ◉                          ★          │  │
│  │     ·                        ·                               │  │
│  │          ★        ·                    ○~~~trail              │  │
│  │   ·                    ·          ★          ·               │  │
│  │              ·                                               │  │
│  │                                                               │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CONTROL PANEL  (id="controls")                               │  │
│  │                                                               │  │
│  │  ┌──────────────────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ Mass: ●━━━━━━━━━━━━━ │  │ ▶ Play   │  │ ↺ Reset  │        │  │
│  │  │ 10                   │  └──────────┘  └──────────┘        │  │
│  │  └──────────────────────┘                                     │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ INFO: Bodies: 3  |  FPS: 60  |  Click & drag to launch  │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Desktop Layout (≥ 768 px)

- **Canvas** fills the viewport width and roughly 75 vh.
- **Control panel** is a fixed bar at the bottom, 120–140 px tall, semi-transparent dark background with a subtle top border.
- Controls are arranged in a single row: mass slider group → buttons → info readout.

### Mobile Layout (< 768 px)

- **Canvas** fills the full screen height minus the control panel.
- **Control panel** stacks vertically: mass slider on one row, buttons on the next, info below.
- Touch events mirror mouse events (touchstart → mousedown, touchmove → mousemove, touchend → mouseup).

### Key Layout Elements

| Element | HTML Tag | Purpose |
|---|---|---|
| Simulation canvas | `<canvas id="sim-canvas">` | All rendering: bodies, trails, starfield, velocity preview |
| Control panel wrapper | `<div id="controls">` | Houses all interactive controls |
| Mass slider group | `<div class="control-group">` | `<label>`, `<input type="range">`, `<span>` for current value |
| Play/Pause button | `<button id="btn-play-pause">` | Toggles simulation running state |
| Reset button | `<button id="btn-reset">` | Clears all bodies and trails |
| Info bar | `<div id="info-bar">` | Displays body count, FPS, hint text |

---

## 3. Colour Scheme & Typography

### Design Philosophy

A deep-space dark theme with cosmic accent colours. The background is near-black to emulate space; bodies glow with bright saturated colours; UI elements use translucent dark panels with crisp white text for readability.

### Colour Palette Table

| Swatch | Name | Hex | CSS Variable | Usage |
|---|---|---|---|---|
| ⬛ | Space Black | `#0a0a1a` | `--clr-bg` | Canvas and page background |
| ⬛ | Panel Dark | `#12122b` | `--clr-panel` | Control panel background |
| ⬛ | Panel Border | `#2a2a5a` | `--clr-panel-border` | Top border of control panel |
| ⬜ | Star White | `#ffffff` | `--clr-text` | Primary text colour |
| 🟦 | Nebula Blue | `#4a9eff` | `--clr-accent` | Focused inputs, active states |
| 🟧 | Solar Orange | `#ff8c42` | `--clr-body-1` | Body colour: low mass range |
| 🟥 | Supernova Red | `#ff4060` | `--clr-body-2` | Body colour: medium-low mass |
| 🟪 | Pulsar Purple | `#b040ff` | `--clr-body-3` | Body colour: medium mass |
| 🟩 | Aurora Green | `#40ff90` | `--clr-body-4` | Body colour: medium-high mass |
| 🟨 | Star Yellow | `#ffe040` | `--clr-body-5` | Body colour: high mass |
| 🟦 | Comet Cyan | `#40e0ff` | `--clr-body-6` | Body colour: very high mass |
| ⬜ | Dwarf White | `#e0e0ff` | `--clr-body-7` | Body colour: maximum mass |
| 🟫 | Muted Grey | `#6a6a8a` | `--clr-muted` | Hint text, secondary info |
| 🟥 | Danger Red | `#ff3333` | `--clr-danger` | Reset button hover |
| 🟩 | Success Green | `#33ff66` | `--clr-success` | Play button active state |
| 🟦 | Velocity Arrow | `#80c0ff` | `--clr-velocity-arrow` | Drag-to-launch preview arrow |

### CSS Variables Block

```css
:root {
  /* Backgrounds */
  --clr-bg: #0a0a1a;
  --clr-panel: #12122b;
  --clr-panel-border: #2a2a5a;

  /* Text */
  --clr-text: #ffffff;
  --clr-muted: #6a6a8a;

  /* Accent */
  --clr-accent: #4a9eff;
  --clr-danger: #ff3333;
  --clr-success: #33ff66;
  --clr-velocity-arrow: #80c0ff;

  /* Body colours (indexed by mass bracket) */
  --clr-body-1: #ff8c42;
  --clr-body-2: #ff4060;
  --clr-body-3: #b040ff;
  --clr-body-4: #40ff90;
  --clr-body-5: #ffe040;
  --clr-body-6: #40e0ff;
  --clr-body-7: #e0e0ff;

  /* Typography */
  --font-primary: 'Exo 2', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Typography Table

| Role | Font Family | Weight | Size | CSS Variable | Source |
|---|---|---|---|---|---|
| Headings / UI Labels | Exo 2 | 600 (Semi-Bold) | 14–18 px | `--font-primary` | Google Fonts |
| Button Text | Exo 2 | 700 (Bold) | 13–14 px | `--font-primary` | Google Fonts |
| Info Readout / Values | Share Tech Mono | 400 (Regular) | 13–14 px | `--font-mono` | Google Fonts |
| Hint Text | Exo 2 | 400 (Regular) | 12 px | `--font-primary` | Google Fonts |

### Google Fonts Link

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
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
  <meta name="description" content="Interactive Newtonian gravity simulation — place celestial bodies and watch them orbit.">
  <title>Gravity Sandbox</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">

  <!-- Stylesheet (relative path) -->
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <main id="app">

    <!-- Simulation Canvas -->
    <canvas id="sim-canvas" aria-label="Gravity simulation canvas — click to place celestial bodies" role="img">
      Your browser does not support HTML5 Canvas.
    </canvas>

    <!-- Control Panel -->
    <section id="controls" aria-label="Simulation controls">

      <!-- Mass Slider -->
      <div class="control-group control-group--mass">
        <label for="mass-slider" class="control-label">Mass</label>
        <input
          type="range"
          id="mass-slider"
          class="slider slider--mass"
          min="1"
          max="100"
          value="10"
          step="1"
          aria-valuemin="1"
          aria-valuemax="100"
          aria-valuenow="10"
        >
        <span id="mass-value" class="control-value" aria-live="polite">10</span>
        <span class="mass-preview" id="mass-preview" aria-hidden="true"></span>
      </div>

      <!-- Action Buttons -->
      <div class="control-group control-group--actions">
        <button id="btn-play-pause" class="btn btn--play" type="button" aria-label="Pause simulation">
          <span class="btn__icon" aria-hidden="true">⏸</span>
          <span class="btn__label">Pause</span>
        </button>
        <button id="btn-reset" class="btn btn--reset" type="button" aria-label="Reset simulation">
          <span class="btn__icon" aria-hidden="true">↺</span>
          <span class="btn__label">Reset</span>
        </button>
      </div>

      <!-- Info Bar -->
      <div id="info-bar" class="info-bar" aria-live="polite">
        <span class="info-item" id="info-bodies">Bodies: <strong>0</strong></span>
        <span class="info-item" id="info-fps">FPS: <strong>60</strong></span>
        <span class="info-item info-item--hint" id="info-hint">Click to place · Drag to launch</span>
      </div>

    </section>

  </main>

  <!-- JavaScript entry point (ES module, relative path) -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- Canvas has `aria-label` and `role="img"` since it is a visual-only element.
- All form inputs have associated `<label>` elements via `for`/`id`.
- Slider uses `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (updated by JS).
- Buttons include `aria-label` for screen readers.
- Info bar uses `aria-live="polite"` for dynamic updates.
- Semantic `<main>` and `<section>` with `aria-label` for landmarks.

### Relative Paths Summary

| Resource | Path |
|---|---|
| Stylesheet | `styles/main.css` |
| JavaScript entry | `js/main.js` |
| Module: Body | `js/modules/body.js` |
| Module: Physics | `js/modules/physics.js` |
| Module: Renderer | `js/modules/renderer.js` |

---

## 5. CSS Architecture

### File: `styles/main.css`

Below is every class and rule group, organised by section.

### 5.1 Reset & Base

```css
/* ── Reset ── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;             /* prevent scroll — everything fits viewport */
  background-color: var(--clr-bg);
  color: var(--clr-text);
  font-family: var(--font-primary);
  font-size: 14px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
```

### 5.2 App Container

```css
/* ── #app ── */
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
```

### 5.3 Canvas

```css
/* ── #sim-canvas ── */
#sim-canvas {
  flex: 1;                     /* fill remaining space above controls */
  display: block;
  width: 100%;
  cursor: crosshair;
  background-color: var(--clr-bg);
}
```

### 5.4 Control Panel

```css
/* ── #controls ── */
#controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--clr-panel);
  border-top: 1px solid var(--clr-panel-border);
  flex-shrink: 0;
  min-height: 80px;
}
```

### 5.5 Control Groups

```css
/* ── .control-group ── */
.control-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.control-group--mass {
  flex: 1;
  max-width: 360px;
}

.control-group--actions {
  display: flex;
  gap: var(--spacing-sm);
}
```

### 5.6 Labels & Values

```css
/* ── .control-label ── */
.control-label {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  color: var(--clr-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── .control-value ── */
.control-value {
  font-family: var(--font-mono);
  font-size: 14px;
  min-width: 2.5em;
  text-align: right;
  color: var(--clr-accent);
}
```

### 5.7 Slider

```css
/* ── .slider ── */
.slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--clr-panel-border);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--clr-accent);
  border: 2px solid var(--clr-text);
  cursor: grab;
  transition: transform 0.15s ease;
}

.slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--clr-accent);
  border: 2px solid var(--clr-text);
  cursor: grab;
}
```

### 5.8 Mass Preview Dot

```css
/* ── .mass-preview ── */
.mass-preview {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--clr-accent);
  box-shadow: 0 0 6px var(--clr-accent);
  transition: width 0.2s ease, height 0.2s ease;
  /* JS will scale width/height based on slider value */
}
```

### 5.9 Buttons

```css
/* ── .btn ── */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid var(--clr-panel-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--clr-text);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--clr-accent);
}

.btn:focus-visible {
  outline: 2px solid var(--clr-accent);
  outline-offset: 2px;
}

.btn__icon {
  font-size: 16px;
}

.btn__label {
  pointer-events: none;
}

/* ── .btn--play (active/paused states toggled by JS) ── */
.btn--play[data-state="playing"] {
  border-color: var(--clr-success);
  color: var(--clr-success);
}

.btn--play[data-state="paused"] {
  border-color: var(--clr-accent);
  color: var(--clr-accent);
}

/* ── .btn--reset ── */
.btn--reset:hover {
  border-color: var(--clr-danger);
  color: var(--clr-danger);
}
```

### 5.10 Info Bar

```css
/* ── .info-bar ── */
.info-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--clr-muted);
}

.info-item strong {
  color: var(--clr-text);
}

.info-item--hint {
  font-family: var(--font-primary);
  font-style: italic;
  font-size: 12px;
  opacity: 0.7;
}
```

### 5.11 Responsive (Mobile < 768 px)

```css
@media (max-width: 767px) {
  #controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: auto;
  }

  .control-group--mass {
    max-width: none;
  }

  .control-group--actions {
    justify-content: center;
  }

  .info-bar {
    justify-content: center;
    margin-left: 0;
    flex-wrap: wrap;
  }
}
```

### Complete CSS Class Reference

| Class | Element | Purpose |
|---|---|---|
| `#app` | `<main>` | Root flex container, full viewport |
| `#sim-canvas` | `<canvas>` | Simulation rendering surface |
| `#controls` | `<section>` | Bottom control panel |
| `.control-group` | `<div>` | Flex row grouping related controls |
| `.control-group--mass` | `<div>` | Mass slider section |
| `.control-group--actions` | `<div>` | Play/Pause + Reset buttons |
| `.control-label` | `<label>` | Uppercase muted label text |
| `.control-value` | `<span>` | Monospace numeric readout |
| `.slider` | `<input[range]>` | Custom-styled range input |
| `.slider--mass` | `<input[range]>` | Mass-specific slider |
| `.mass-preview` | `<span>` | Dot that scales with mass value |
| `.btn` | `<button>` | Base button style |
| `.btn--play` | `<button>` | Play/Pause toggle button |
| `.btn--reset` | `<button>` | Reset button |
| `.btn__icon` | `<span>` | Icon character inside button |
| `.btn__label` | `<span>` | Text label inside button |
| `.info-bar` | `<div>` | Status readout row |
| `.info-item` | `<span>` | Individual info metric |
| `.info-item--hint` | `<span>` | Italic hint/tip text |

---

## 6. JavaScript Architecture

### File Map

```
js/
├── main.js               ← Entry point: bootstraps app, owns animation loop
└── modules/
    ├── body.js            ← CelestialBody class definition
    ├── physics.js         ← Gravity computation, Verlet integration, collision detection
    └── renderer.js        ← Canvas drawing: bodies, trails, starfield, velocity arrow
```

### 6.1 `js/main.js` — Entry Point & Game Loop

**Imports:** `CelestialBody` from `./modules/body.js`, `PhysicsEngine` from `./modules/physics.js`, `Renderer` from `./modules/renderer.js`.

| Function / Block | Description |
|---|---|
| `init()` | Called on `DOMContentLoaded`. Grabs DOM references, creates `Renderer` and `PhysicsEngine` instances, sizes canvas, binds event listeners, starts the loop. |
| `resizeCanvas()` | Sets `canvas.width` and `canvas.height` to match `canvas.clientWidth` and `canvas.clientHeight`. Called on init and `window.resize`. |
| `loop(timestamp)` | The `requestAnimationFrame` callback. Computes `dt` (delta time in seconds, capped at 1/30 to avoid spiral of death). If running: calls `physics.update(bodies, dt)`. Always calls `renderer.draw(...)`. Requests next frame. |
| `handleMouseDown(e)` | Records `dragStart = {x, y}` from canvas-relative mouse position. Sets `isDragging = true`. |
| `handleMouseMove(e)` | If dragging: updates `dragEnd = {x, y}` for velocity preview rendering. |
| `handleMouseUp(e)` | Computes velocity vector `vx, vy` from `(dragEnd - dragStart) * VELOCITY_SCALE`. Creates a new `CelestialBody` at `dragStart` with the computed velocity and the current mass slider value. Pushes to `bodies[]`. Resets drag state. |
| `handleTouchStart(e)` | Maps `e.touches[0]` to `handleMouseDown`. |
| `handleTouchMove(e)` | Maps to `handleMouseMove`. Calls `e.preventDefault()`. |
| `handleTouchEnd(e)` | Maps `e.changedTouches[0]` to `handleMouseUp`. |
| `togglePlayPause()` | Flips `isRunning` boolean. Updates button text/icon and `data-state` attribute. |
| `reset()` | Clears `bodies[]` array. Calls `renderer.clearTrails()`. Updates info bar. |
| `updateMassPreview(value)` | Scales the `.mass-preview` element diameter based on slider value. Updates `aria-valuenow`. |
| `updateInfoBar()` | Sets body count and FPS in the `#info-bar` spans. |

**State variables** held in `main.js` closure:

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `bodies` | `CelestialBody[]` | `[]` | All active bodies in the simulation |
| `isRunning` | `boolean` | `true` | Whether physics updates occur each frame |
| `isDragging` | `boolean` | `false` | Whether user is in a click-drag action |
| `dragStart` | `{x, y} \| null` | `null` | Canvas coordinates of mouse-down |
| `dragEnd` | `{x, y} \| null` | `null` | Canvas coordinates of current mouse position during drag |
| `lastTimestamp` | `number` | `0` | Previous frame timestamp for dt calculation |
| `frameCount` | `number` | `0` | Frame counter for FPS calculation |
| `fpsDisplay` | `number` | `60` | Smoothed FPS value shown in info bar |

**Constants:**

| Constant | Value | Purpose |
|---|---|---|
| `VELOCITY_SCALE` | `0.05` | Multiplier converting drag-pixel-length to simulation velocity units |
| `MAX_DT` | `0.033` | Cap delta-time at ~30 FPS equivalent to prevent physics blow-up |

### 6.2 `js/modules/body.js` — CelestialBody Class

```js
export class CelestialBody {
  constructor({ x, y, vx = 0, vy = 0, mass = 10 }) { ... }
}
```

| Property | Type | Description |
|---|---|---|
| `x` | `number` | Current x position in canvas pixels |
| `y` | `number` | Current y position in canvas pixels |
| `vx` | `number` | Current x velocity (px/s) |
| `vy` | `number` | Current y velocity (px/s) |
| `ax` | `number` | Current x acceleration (set by physics each frame) |
| `ay` | `number` | Current y acceleration (set by physics each frame) |
| `mass` | `number` | Mass value (1–100), affects gravity and visual radius |
| `radius` | `number` | Visual radius, computed as `Math.max(3, Math.sqrt(mass) * 2)` |
| `colour` | `string` | Hex colour string, assigned by `getColourForMass(mass)` |
| `trail` | `{x, y}[]` | Array of recent positions for trail rendering |
| `id` | `number` | Unique identifier (incrementing counter) |

**Methods:**

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `addTrailPoint()` | — | `void` | Pushes `{x: this.x, y: this.y}` to `this.trail`. If `trail.length > MAX_TRAIL_LENGTH` shifts the oldest entry. |
| `clearTrail()` | — | `void` | Empties the `trail` array. |

**Module-level helper:**

| Function | Description |
|---|---|
| `getColourForMass(mass)` | Returns a colour from `BODY_COLOURS[]` based on which bracket the mass falls into (divides 1–100 range into 7 equal buckets). |

**Constants:**

| Constant | Value |
|---|---|
| `MAX_TRAIL_LENGTH` | `150` |
| `BODY_COLOURS` | `['#ff8c42', '#ff4060', '#b040ff', '#40ff90', '#ffe040', '#40e0ff', '#e0e0ff']` |

### 6.3 `js/modules/physics.js` — Physics Engine

```js
export class PhysicsEngine {
  constructor(G = 500, softening = 10) { ... }
}
```

| Property | Type | Description |
|---|---|---|
| `G` | `number` | Gravitational constant (simulation-scale, default 500) |
| `softening` | `number` | Softening length ε to prevent singularity at r → 0 |

**Methods:**

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `update(bodies, dt)` | `CelestialBody[], number` | `CelestialBody[]` | Runs one full physics step: computes accelerations, integrates via velocity Verlet, records trail points, detects and resolves collisions. Returns the (potentially shorter) `bodies` array after merges. |
| `computeAccelerations(bodies)` | `CelestialBody[]` | `void` | For each body, zeroes `ax, ay`, then loops over every other body, computes gravitational acceleration, and accumulates it. Uses softened distance `r_soft = sqrt(dx² + dy² + ε²)`. |
| `integrate(bodies, dt)` | `CelestialBody[], number` | `void` | Velocity Verlet integration step (see §7 for formulas). |
| `detectCollisions(bodies)` | `CelestialBody[]` | `CelestialBody[]` | Checks every pair; if distance < `r1 + r2`, merges them (see §7). Returns new array excluding consumed bodies. |
| `mergeBodies(a, b)` | `CelestialBody, CelestialBody` | `CelestialBody` | Creates a new body at mass-weighted midpoint with momentum-conserving velocity. Mass = `a.mass + b.mass`. |

### 6.4 `js/modules/renderer.js` — Canvas Renderer

```js
export class Renderer {
  constructor(canvas) { ... }
}
```

| Property | Type | Description |
|---|---|---|
| `canvas` | `HTMLCanvasElement` | The simulation canvas |
| `ctx` | `CanvasRenderingContext2D` | 2D drawing context |
| `stars` | `{x, y, r, alpha}[]` | Pre-generated array of ~200 random starfield points |

**Methods:**

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `draw(bodies, dragStart, dragEnd, currentMass)` | various | `void` | Master draw call per frame. Clears canvas, draws starfield, trails, bodies, and (if dragging) velocity arrow. |
| `clearCanvas()` | — | `void` | Fills canvas with `--clr-bg`. |
| `drawStarfield()` | — | `void` | Renders each star in `this.stars` as a tiny white circle with varying alpha. |
| `generateStars(count)` | `number` | `{x,y,r,alpha}[]` | Creates `count` random star objects with position as fractions (0–1) of canvas size, radius 0.5–1.5 px, alpha 0.3–1.0. |
| `drawBody(body)` | `CelestialBody` | `void` | Draws a filled circle at `(body.x, body.y)` with `body.radius`. Adds a radial gradient glow effect using the body's colour fading to transparent. |
| `drawTrail(body)` | `CelestialBody` | `void` | Iterates `body.trail` from oldest to newest, drawing line segments with decreasing opacity (oldest = 0, newest = 0.8). Uses `body.colour`. |
| `drawVelocityArrow(start, end, mass)` | `{x,y}, {x,y}, number` | `void` | Draws a dashed line from `start` to `end` with an arrowhead. Colour is `--clr-velocity-arrow`. Also draws a ghost circle at `start` showing the body that will be placed. |
| `clearTrails()` | — | `void` | Calls `body.clearTrail()` on every body (used on reset). |

---

## 7. Physics Engine — Detailed Formulas

### 7.1 Newtonian Gravity

For two bodies `i` and `j`:

```
dx = xⱼ - xᵢ
dy = yⱼ - yᵢ
r  = √(dx² + dy² + ε²)          ← softened distance (ε = softening parameter)

F  = G · mᵢ · mⱼ / r²           ← gravitational force magnitude

aᵢₓ += F / mᵢ · (dx / r)       = G · mⱼ · dx / r³
aᵢᵧ += F / mᵢ · (dy / r)       = G · mⱼ · dy / r³
```

The softening term `ε²` prevents `r` from reaching zero when bodies are very close, which would cause infinite forces and numerical blow-up. With `ε = 10`, the force saturates at close range rather than exploding.

### 7.2 Complete Acceleration Computation (Pseudocode)

```
for each body i in bodies:
    aᵢ.x = 0
    aᵢ.y = 0
    for each body j in bodies where j ≠ i:
        dx = j.x - i.x
        dy = j.y - i.y
        distSq = dx * dx + dy * dy + softening * softening
        dist = √distSq
        force = G * j.mass / distSq
        aᵢ.x += force * (dx / dist)
        aᵢ.y += force * (dy / dist)
```

Note: we compute `G * mⱼ / r²` directly for the acceleration on body `i` (mass cancels).

### 7.3 Velocity Verlet Integration

The velocity Verlet method is a symplectic integrator that preserves energy better than forward Euler. It uses a half-step velocity update:

```
// Step 1: Half-kick — update velocities by half a timestep using current accelerations
for each body:
    v.x += 0.5 * a.x * dt
    v.y += 0.5 * a.y * dt

// Step 2: Drift — update positions using half-kicked velocities
for each body:
    x += v.x * dt
    y += v.y * dt

// Step 3: Recompute accelerations at new positions
computeAccelerations(bodies)

// Step 4: Half-kick again — update velocities by another half timestep using new accelerations
for each body:
    v.x += 0.5 * a.x * dt
    v.y += 0.5 * a.y * dt

// Step 5: Record trail point
for each body:
    body.addTrailPoint()
```

### 7.4 Collision Detection & Merging

**Detection:** For every unique pair `(i, j)`:

```
dx = j.x - i.x
dy = j.y - i.y
dist = √(dx² + dy²)

if dist < (i.radius + j.radius):
    merge(i, j)
```

**Merging (momentum conservation):**

```
newMass = mᵢ + mⱼ

// Mass-weighted position (centre of mass)
newX = (mᵢ · xᵢ + mⱼ · xⱼ) / newMass
newY = (mᵢ · yᵢ + mⱼ · yⱼ) / newMass

// Momentum-conserving velocity
newVx = (mᵢ · vxᵢ + mⱼ · vxⱼ) / newMass
newVy = (mᵢ · vyᵢ + mⱼ · vyⱼ) / newMass
```

The merged body replaces both originals in the array. Its trail starts fresh. Its colour and radius are recomputed from the new mass.

### 7.5 Simulation Constants & Scale Factors

| Constant | Value | Rationale |
|---|---|---|
| `G` (gravitational constant) | `500` | Tuned so that bodies with mass 10 at ~200 px apart produce visible acceleration within 1–2 seconds. Real G (6.674e-11) is meaningless at pixel scale. |
| `ε` (softening) | `10` | Prevents singularity. At 10 px distance, force is halved vs. un-softened, creating a smooth close-range interaction. |
| `VELOCITY_SCALE` | `0.05` | A 200 px drag → 10 px/s velocity. This keeps initial velocities in a range that produces bound orbits for typical masses. |
| `MAX_DT` | `0.033` | Caps the timestep at ~30 FPS equivalent. If the real frame took longer (e.g. tab was hidden), we don't jump forward too far and destabilise orbits. |
| `MAX_TRAIL_LENGTH` | `150` | Each body stores up to 150 trail points. At 60 FPS this is ~2.5 seconds of trail. Oldest points are discarded (FIFO). |
| Mass range | `1–100` | Provides a 100:1 mass ratio, enough to create both planet/moon and binary-star-like dynamics. |
| Radius formula | `max(3, √mass × 2)` | Ensures even mass-1 bodies are visible (3 px min), while mass-100 is ~20 px. |

---

## 8. Rendering — Detailed Approach

### 8.1 Frame Render Order

Each frame, the renderer paints layers in this order (painter's algorithm — back to front):

1. **Clear canvas** — fill entire canvas with `#0a0a1a` (space black).
2. **Starfield** — draw ~200 tiny white dots at fixed fractional positions (multiplied by current canvas width/height so they survive resize). Varying alpha gives depth.
3. **Trails** — for each body, draw its trail as a polyline with per-segment alpha fade.
4. **Bodies** — draw each body as a glowing filled circle on top of trails.
5. **Velocity preview arrow** — if the user is mid-drag, draw a dashed line and arrowhead from drag start to current cursor, plus a ghost body circle at the start position.

### 8.2 Trail Rendering

Each body's `trail` array stores up to `MAX_TRAIL_LENGTH` (150) points of `{x, y}`.

**Drawing algorithm:**

```
ctx.lineWidth = 2
ctx.lineCap = 'round'
ctx.strokeStyle = body.colour

for i = 1 to trail.length - 1:
    alpha = (i / trail.length) * 0.8     ← linearly ramp from ~0 to 0.8
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
    ctx.lineTo(trail[i].x, trail[i].y)
    ctx.stroke()

ctx.globalAlpha = 1.0                     ← reset
```

This produces a trail that is invisible at the oldest end and nearly opaque near the body.

### 8.3 Body Rendering with Glow Effect

Each body is rendered with a two-layer approach:

1. **Outer glow** — a radial gradient circle from `body.colour` at 40% opacity in the centre to fully transparent at 2.5× the body radius. This simulates atmospheric glow.
2. **Core circle** — a solid filled circle at `body.radius` using `body.colour` at full opacity.

```
// Outer glow
const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.5);
gradient.addColorStop(0, colourWithAlpha(body.colour, 0.4));
gradient.addColorStop(1, colourWithAlpha(body.colour, 0));
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
ctx.fill();

// Core
ctx.fillStyle = body.colour;
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();
```

### 8.4 Starfield Background

Stars are generated once on initialisation:

```
for i = 0 to 199:
    stars[i] = {
        x: Math.random(),          ← fraction of canvas width
        y: Math.random(),          ← fraction of canvas height
        r: 0.5 + Math.random(),    ← radius 0.5–1.5 px
        alpha: 0.3 + Math.random() * 0.7   ← opacity 0.3–1.0
    }
```

Drawing multiplies `x` and `y` by current canvas dimensions so stars reposition correctly after resize.

### 8.5 Velocity Arrow Preview

When the user is mid-drag:

```
ctx.setLineDash([6, 4]);           ← dashed line
ctx.strokeStyle = '--clr-velocity-arrow';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(dragStart.x, dragStart.y);
ctx.lineTo(dragEnd.x, dragEnd.y);
ctx.stroke();
ctx.setLineDash([]);               ← reset

// Arrowhead (small triangle at dragEnd)
drawArrowhead(ctx, dragStart, dragEnd, 10);

// Ghost body preview circle
ctx.globalAlpha = 0.4;
ctx.fillStyle = getColourForMass(currentMass);
ctx.beginPath();
ctx.arc(dragStart.x, dragStart.y, Math.max(3, Math.sqrt(currentMass) * 2), 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1.0;
```

---

## 9. Implementation Order

### Phase 1: Scaffold & Static Layout

| Step | Task | Files Touched |
|---|---|---|
| 1.1 | Create the folder structure: `index.html`, `js/main.js`, `js/modules/body.js`, `js/modules/physics.js`, `js/modules/renderer.js`, `styles/main.css` | All |
| 1.2 | Write the complete `index.html` with Google Fonts, semantic markup, canvas, control panel, and the module `<script>` tag. | `index.html` |
| 1.3 | Write `styles/main.css` with CSS variables, reset, layout, controls, buttons, slider, info bar, and responsive media query. | `styles/main.css` |
| 1.4 | Verify the page loads with a visible dark canvas and styled controls. No JS logic yet — just static UI. | — |

### Phase 2: Canvas Setup & Starfield

| Step | Task | Files Touched |
|---|---|---|
| 2.1 | In `main.js`, implement `init()` and `resizeCanvas()`. Get the canvas context and size it to fill the flex area. | `js/main.js` |
| 2.2 | In `renderer.js`, implement the `Renderer` class constructor, `generateStars()`, `clearCanvas()`, and `drawStarfield()`. | `js/modules/renderer.js` |
| 2.3 | Start the `requestAnimationFrame` loop in `main.js`. Each frame should clear and draw the starfield. | `js/main.js` |
| 2.4 | Test: page shows a dark canvas with twinkling stars. Resize the window and confirm stars reposition. | — |

### Phase 3: Body Placement & Rendering

| Step | Task | Files Touched |
|---|---|---|
| 3.1 | Implement `CelestialBody` class in `body.js` with constructor, properties, `addTrailPoint()`, `clearTrail()`, and `getColourForMass()`. | `js/modules/body.js` |
| 3.2 | In `renderer.js`, implement `drawBody(body)` with glow gradient. | `js/modules/renderer.js` |
| 3.3 | In `main.js`, add `handleMouseDown`, `handleMouseUp` to create a body on click (zero velocity initially). Push to `bodies[]`, render each frame. | `js/main.js` |
| 3.4 | Wire up the mass slider: read its value when placing a body, update `#mass-value` text and `.mass-preview` dot size on input. | `js/main.js` |
| 3.5 | Test: clicking the canvas spawns coloured circles of varying size based on slider. | — |

### Phase 4: Drag-to-Launch & Velocity Arrow

| Step | Task | Files Touched |
|---|---|---|
| 4.1 | Extend mouse handlers: on down record `dragStart`, on move update `dragEnd`, on up compute velocity vector. | `js/main.js` |
| 4.2 | In `renderer.js`, implement `drawVelocityArrow()` with dashed line, arrowhead, and ghost body preview. | `js/modules/renderer.js` |
| 4.3 | Add touch event handlers mirroring mouse behaviour. | `js/main.js` |
| 4.4 | Test: click-and-drag shows the arrow preview; releasing creates a body with the correct initial velocity. | — |

### Phase 5: Physics Engine

| Step | Task | Files Touched |
|---|---|---|
| 5.1 | Implement `PhysicsEngine` constructor with `G` and `softening`. | `js/modules/physics.js` |
| 5.2 | Implement `computeAccelerations(bodies)` using the softened inverse-square formula. | `js/modules/physics.js` |
| 5.3 | Implement `integrate(bodies, dt)` using velocity Verlet (half-kick, drift, recompute, half-kick). | `js/modules/physics.js` |
| 5.4 | Call `physics.update(bodies, dt)` in the game loop when `isRunning` is true. | `js/main.js` |
| 5.5 | Test: place two bodies — they should accelerate towards each other. With a lateral launch velocity, one should orbit the other. | — |

### Phase 6: Trails

| Step | Task | Files Touched |
|---|---|---|
| 6.1 | Ensure `addTrailPoint()` is called after each Verlet integration step (inside `physics.update`). | `js/modules/physics.js` |
| 6.2 | Implement `drawTrail(body)` in `renderer.js` with per-segment alpha fade. | `js/modules/renderer.js` |
| 6.3 | Call `drawTrail` for each body in the main `draw()` method (before drawing bodies so trails are behind). | `js/modules/renderer.js` |
| 6.4 | Test: bodies leave smooth fading trails behind them as they move. | — |

### Phase 7: Collision Detection & Merging

| Step | Task | Files Touched |
|---|---|---|
| 7.1 | Implement `detectCollisions(bodies)` — pair-wise distance check against sum of radii. | `js/modules/physics.js` |
| 7.2 | Implement `mergeBodies(a, b)` — momentum-conserving merge into a new larger body. | `js/modules/physics.js` |
| 7.3 | Integrate collision detection into `update()` after integration. Return the updated bodies array to `main.js`. | `js/modules/physics.js`, `js/main.js` |
| 7.4 | Test: launch two bodies at each other — they should merge into one larger body with a new colour. | — |

### Phase 8: UI Controls

| Step | Task | Files Touched |
|---|---|---|
| 8.1 | Implement `togglePlayPause()` — flip `isRunning`, update button icon (⏸ ↔ ▶), text, and `data-state`. | `js/main.js` |
| 8.2 | Implement `reset()` — empty `bodies[]`, call `renderer.clearTrails()`, reset info bar. | `js/main.js` |
| 8.3 | Implement `updateInfoBar()` — display current body count and smoothed FPS. | `js/main.js` |
| 8.4 | Wire button click listeners. | `js/main.js` |
| 8.5 | Test: Pause freezes bodies in place, Play resumes. Reset clears everything. Info bar updates correctly. | — |

### Phase 9: Polish & Edge Cases

| Step | Task | Files Touched |
|---|---|---|
| 9.1 | Add FPS smoothing (exponential moving average). | `js/main.js` |
| 9.2 | Prevent bodies spawning when clicking on the control panel (check event target). | `js/main.js` |
| 9.3 | Clamp body positions: if a body flies far off-screen (e.g. > 2× canvas size from centre), optionally remove it or leave it (design choice — leaving preserves physics accuracy). | `js/modules/physics.js` |
| 9.4 | Ensure `resizeCanvas()` regenerates star positions relative to new dimensions. | `js/modules/renderer.js` |
| 9.5 | Test on mobile viewport — verify touch drag works and responsive layout is correct. | — |
| 9.6 | Final review: code comments, JSDoc on public functions, file headers per repo guidelines. | All JS files |

---

*End of plan.*
