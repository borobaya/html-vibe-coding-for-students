# Traffic Light Simulator — Implementation Plan

---

## 1. Overview

### What It Is

A real-time, top-down traffic light simulator rendered on an HTML5 Canvas. The simulation models a four-way road intersection with fully synchronised traffic lights, vehicles that spawn from the edges, stop at red lights and proceed on green, pedestrian crossings with walk/don't-walk signals, and a control panel that lets the user adjust timing, spawn rates, and simulation speed.

### Simulation Components

| Component | Description |
|---|---|
| **Intersection** | Two two-lane roads crossing at right angles, with lane markings, stop lines, pedestrian crossings, and corner sidewalks/grass |
| **Traffic Lights** | Four sets of lights (N, S, E, W), each cycling red → green → amber → red. Opposing pairs synchronise (N/S together, E/W together) |
| **Vehicles** | Cars spawn from the four edges, travel along their lane, decelerate and queue at red lights, resume on green |
| **Pedestrians** | Pedestrians spawn at crossing edges, wait for a walk signal, then cross. Pedestrian phase is triggered by a request button |
| **User Controls** | Sliders for green/amber/red duration, vehicle spawn rate, simulation speed. A pedestrian crossing request button. Start/pause/reset buttons |

### How the Cycle Works

1. **Phase A (N/S Green):** North and South lights are green; East and West are red. Vehicles flow N↔S.
2. **Phase A Amber:** N/S lights transition to amber (warning). Vehicles stop spawning through the intersection.
3. **All-Red Clearance:** All four lights are red for a brief interval to let the intersection clear.
4. **Phase B (E/W Green):** East and West lights are green; North and South are red. Vehicles flow E↔W.
5. **Phase B Amber:** E/W lights transition to amber.
6. **All-Red Clearance:** All lights red again.
7. **Pedestrian Phase (if requested):** All vehicle lights red, walk signals activate on all crossings. Pedestrians cross.
8. Cycle repeats from Phase A.

---

## 2. Page Layout

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: "🚦 Traffic Light Simulator"                          │
├───────────────────────────────────┬─────────────────────────────┤
│                                   │  CONTROL PANEL              │
│                                   │                             │
│                                   │  ┌───────────────────────┐  │
│                                   │  │ Simulation Controls   │  │
│                                   │  │ [▶ Start] [⏸ Pause]   │  │
│                                   │  │ [↺ Reset]             │  │
│                                   │  │                       │  │
│          CANVAS (700×700)         │  │ Speed: [━━━●━━] 1.0x  │  │
│                                   │  └───────────────────────┘  │
│    Grass ┃  ↓  │  ↑  ┃ Grass     │                             │
│    ──────┨     │     ┠──────     │  ┌───────────────────────┐  │
│    ← ← ←  🔴  │     → → →      │  │ Timing Controls       │  │
│    ══════╋═════╋═════╋══════     │  │ Green:  [━━━━●━] 10s  │  │
│    ← ← ←      │  🟢 → → →      │  │ Amber:  [━●━━━━]  3s  │  │
│    ──────┨     │     ┠──────     │  │ Red:    [━━●━━━]  2s  │  │
│    Grass ┃  ↓  │  ↑  ┃ Grass     │  │ Ped:    [━━━●━━]  8s  │  │
│                                   │  └───────────────────────┘  │
│    (Traffic lights at corners)    │                             │
│    (Pedestrian crossings shown    │  ┌───────────────────────┐  │
│     as striped zebra markings)    │  │ Traffic Controls      │  │
│    (Cars as coloured rectangles)  │  │ Spawn Rate: [━━●━] 3s │  │
│    (Pedestrians as small circles) │  │                       │  │
│                                   │  │ [🚶 Request Crossing] │  │
│                                   │  └───────────────────────┘  │
│                                   │                             │
│                                   │  ┌───────────────────────┐  │
│                                   │  │ Status                │  │
│                                   │  │ N/S: 🟢 GREEN (7s)    │  │
│                                   │  │ E/W: 🔴 RED   (7s)    │  │
│                                   │  │ Ped: 🔴 DON'T WALK    │  │
│                                   │  │ Cars: 12  Peds: 3     │  │
│                                   │  └───────────────────────┘  │
├───────────────────────────────────┴─────────────────────────────┤
│  FOOTER: "Adjust timings and watch traffic flow"               │
└─────────────────────────────────────────────────────────────────┘
```

### Canvas Layout (700 × 700 px)

```
  0       250  310  390  450       700
  ┌────────┬────┬────┬────┬────────┐  0
  │ GRASS  │    │    │    │ GRASS  │
  │  NW    │ ↓  │    │ ↑  │  NE    │
  │        │SB  │    │NB  │        │
  ├────────┼────┼────┼────┼────────┤ 250
  │  WB →  │    │    │    │  WB →  │
  │========╪════╪════╪════╪========│ 310  (centre line)
  │  EB ←  │    │    │    │  EB ←  │
  ├────────┼────┼────┼────┼────────┤ 450
  │ GRASS  │ ↓  │    │ ↑  │ GRASS  │
  │  SW    │SB  │    │NB  │  SE    │
  │        │    │    │    │        │
  └────────┴────┴────┴────┴────────┘ 700

  Road width: 200px (250→450 on each axis)
  Lane width: 80px per lane, 40px centre median
  Lanes:
    Northbound (NB): x = 390→450, vehicles travel ↑ (decreasing y)
    Southbound (SB): x = 250→310, vehicles travel ↓ (increasing y)
    Eastbound (EB):  y = 310→390, vehicles travel → (ERROR: westbound label issue)
    Westbound (WB):  y = 250→310, vehicles travel → (increasing x)

  Corrected lane assignments:
    North Road:
      - Southbound lane: x centre = 280, travel ↓
      - Northbound lane: x centre = 420, travel ↑
    East-West Road:
      - Westbound lane: y centre = 280, travel ←
      - Eastbound lane:  y centre = 420, travel →

  Stop line positions (distance from canvas edge to stop line):
    North approach:  y = 250  (vehicles stop before entering intersection)
    South approach:  y = 450
    West approach:   x = 250
    East approach:   x = 450

  Pedestrian crossings:
    North crossing: y = 235→250, spanning x = 250→450  (striped)
    South crossing: y = 450→465, spanning x = 250→450
    West crossing:  x = 235→250, spanning y = 250→450
    East crossing:  x = 450→465, spanning y = 250→450

  Traffic light positions (small rectangles at corners):
    NW corner: (240, 240) — controls Southbound & Eastbound approach
    NE corner: (460, 240) — controls Northbound & Westbound approach  
    SW corner: (240, 460) — controls Eastbound & Southbound approach
    SE corner: (460, 460) — controls Westbound & Northbound approach

  Actual relevant lights per direction:
    Northbound vehicles watch: light at (460, 460) — SE corner
    Southbound vehicles watch: light at (240, 240) — NW corner
    Eastbound vehicles watch:  light at (240, 460) — SW corner
    Westbound vehicles watch:  light at (460, 240) — NE corner
```

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 900px | Canvas (700px) + side panel (280px), side-by-side |
| 600–899px | Canvas scales to 100% width, controls move below canvas |
| < 600px | Canvas scales to viewport width, controls stack vertically, sliders full-width |

---

## 3. Colour Scheme & Typography

### CSS Variables

```css
:root {
  /* -- Road & Infrastructure -- */
  --road-surface:       #3a3a3a;    /* Dark grey asphalt */
  --road-border:        #2a2a2a;    /* Darker edge */
  --lane-marking:       #ffffff;    /* White dashed centre lines */
  --stop-line:          #ffffff;    /* Solid white stop line */
  --crossing-stripe:    #ffffff;    /* Zebra crossing white */
  --crossing-gap:       #3a3a3a;    /* Zebra crossing gaps (road colour) */
  --median:             #ffd700;    /* Yellow centre median line */

  /* -- Environment -- */
  --grass:              #4a8c3f;    /* Green grass/verge */
  --sidewalk:           #b0a090;    /* Light tan concrete sidewalk */
  --island:             #b0a090;    /* Corner traffic islands */

  /* -- Traffic Lights -- */
  --light-red:          #e53935;    /* Red signal */
  --light-red-dim:      #5c1a1a;   /* Red off/dim */
  --light-amber:        #ffb300;   /* Amber signal */
  --light-amber-dim:    #5c4a00;   /* Amber off/dim */
  --light-green:        #43a047;   /* Green signal */
  --light-green-dim:    #1a3d1a;   /* Green off/dim */
  --light-housing:      #1a1a1a;   /* Black light housing */

  /* -- Pedestrian Signal -- */
  --ped-walk:           #43a047;   /* Walk (green figure) */
  --ped-stop:           #e53935;   /* Don't walk (red hand) */

  /* -- Vehicles -- */
  --car-red:            #c62828;
  --car-blue:           #1565c0;
  --car-white:          #eceff1;
  --car-black:          #212121;
  --car-silver:         #90a4ae;
  --car-yellow:         #f9a825;
  --car-green:          #2e7d32;
  --car-outline:        #000000;

  /* -- Pedestrians -- */
  --pedestrian-body:    #ff7043;   /* Orange circle */
  --pedestrian-outline: #bf360c;

  /* -- UI / Controls -- */
  --bg-primary:         #1a1a2e;   /* Dark navy background */
  --bg-secondary:       #16213e;   /* Panel background */
  --bg-card:            #0f3460;   /* Card background */
  --text-primary:       #e0e0e0;   /* Light text */
  --text-secondary:     #a0a0b0;   /* Dimmer text */
  --accent:             #e94560;   /* Accent/highlight */
  --accent-hover:       #ff6b81;
  --border:             #2a2a4a;   /* Panel borders */
  --slider-track:       #2a2a4a;
  --slider-thumb:       #e94560;
  --btn-primary-bg:     #43a047;
  --btn-primary-hover:  #66bb6a;
  --btn-pause-bg:       #ffb300;
  --btn-reset-bg:       #e53935;
  --btn-ped-bg:         #1565c0;
  --btn-ped-hover:      #42a5f5;

  /* -- Shadows & Effects -- */
  --shadow-light:       0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-glow-red:    0 0 12px rgba(229, 57, 53, 0.6);
  --shadow-glow-green:  0 0 12px rgba(67, 160, 71, 0.6);
  --shadow-glow-amber:  0 0 12px rgba(255, 179, 0, 0.6);
}
```

### Typography

```css
:root {
  --font-primary:    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono:       'Fira Code', 'Cascadia Code', 'Consolas', monospace;

  --fs-h1:           1.75rem;   /* Page title */
  --fs-h2:           1.15rem;   /* Panel headings */
  --fs-body:         0.95rem;   /* Controls labels */
  --fs-small:        0.8rem;    /* Status text, captions */
  --fs-mono:         0.85rem;   /* Timer readouts */

  --fw-normal:       400;
  --fw-semibold:     600;
  --fw-bold:         700;

  --lh-normal:       1.5;
  --lh-tight:        1.2;
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
  <meta name="description" content="Interactive traffic light simulator with adjustable timing, vehicles, and pedestrian crossings" />
  <title>🚦 Traffic Light Simulator</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <div id="app" class="app">

    <!-- Header -->
    <header class="header">
      <h1 class="header__title">🚦 Traffic Light Simulator</h1>
      <p class="header__subtitle">Model a road intersection with traffic lights, vehicles &amp; pedestrian crossings</p>
    </header>

    <!-- Main Content -->
    <main class="main">

      <!-- Canvas Area -->
      <section class="canvas-container" aria-label="Traffic simulation view">
        <canvas
          id="sim-canvas"
          class="canvas-container__canvas"
          width="700"
          height="700"
          role="img"
          aria-label="Top-down view of a road intersection with traffic lights, vehicles, and pedestrian crossings"
        >
          Your browser does not support the canvas element.
        </canvas>
      </section>

      <!-- Control Panel -->
      <aside class="controls" aria-label="Simulation controls">

        <!-- Simulation Controls -->
        <fieldset class="controls__group">
          <legend class="controls__legend">Simulation</legend>
          <div class="controls__buttons">
            <button id="btn-start" class="btn btn--start" aria-label="Start simulation">
              ▶ Start
            </button>
            <button id="btn-pause" class="btn btn--pause" aria-label="Pause simulation" disabled>
              ⏸ Pause
            </button>
            <button id="btn-reset" class="btn btn--reset" aria-label="Reset simulation">
              ↺ Reset
            </button>
          </div>
          <div class="controls__slider-row">
            <label for="speed-slider" class="controls__label">
              Speed
              <output id="speed-value" class="controls__output">1.0×</output>
            </label>
            <input
              type="range"
              id="speed-slider"
              class="controls__slider"
              min="0.25"
              max="3"
              step="0.25"
              value="1"
              aria-describedby="speed-value"
            />
          </div>
        </fieldset>

        <!-- Timing Controls -->
        <fieldset class="controls__group">
          <legend class="controls__legend">Timing (seconds)</legend>

          <div class="controls__slider-row">
            <label for="green-slider" class="controls__label">
              Green Duration
              <output id="green-value" class="controls__output">10s</output>
            </label>
            <input
              type="range"
              id="green-slider"
              class="controls__slider controls__slider--green"
              min="4"
              max="20"
              step="1"
              value="10"
              aria-describedby="green-value"
            />
          </div>

          <div class="controls__slider-row">
            <label for="amber-slider" class="controls__label">
              Amber Duration
              <output id="amber-value" class="controls__output">3s</output>
            </label>
            <input
              type="range"
              id="amber-slider"
              class="controls__slider controls__slider--amber"
              min="2"
              max="6"
              step="1"
              value="3"
              aria-describedby="amber-value"
            />
          </div>

          <div class="controls__slider-row">
            <label for="red-clearance-slider" class="controls__label">
              All-Red Clearance
              <output id="red-clearance-value" class="controls__output">2s</output>
            </label>
            <input
              type="range"
              id="red-clearance-slider"
              class="controls__slider controls__slider--red"
              min="1"
              max="5"
              step="0.5"
              value="2"
              aria-describedby="red-clearance-value"
            />
          </div>

          <div class="controls__slider-row">
            <label for="ped-slider" class="controls__label">
              Pedestrian Phase
              <output id="ped-value" class="controls__output">8s</output>
            </label>
            <input
              type="range"
              id="ped-slider"
              class="controls__slider controls__slider--ped"
              min="4"
              max="15"
              step="1"
              value="8"
              aria-describedby="ped-value"
            />
          </div>
        </fieldset>

        <!-- Traffic Controls -->
        <fieldset class="controls__group">
          <legend class="controls__legend">Traffic</legend>

          <div class="controls__slider-row">
            <label for="spawn-slider" class="controls__label">
              Spawn Interval
              <output id="spawn-value" class="controls__output">3.0s</output>
            </label>
            <input
              type="range"
              id="spawn-slider"
              class="controls__slider"
              min="0.5"
              max="8"
              step="0.5"
              value="3"
              aria-describedby="spawn-value"
            />
          </div>

          <button id="btn-ped-request" class="btn btn--ped" aria-label="Request pedestrian crossing">
            🚶 Request Crossing
          </button>
        </fieldset>

        <!-- Status Display -->
        <fieldset class="controls__group controls__group--status">
          <legend class="controls__legend">Status</legend>
          <div class="status" role="status" aria-live="polite" id="status-panel">
            <div class="status__row">
              <span class="status__label">N/S:</span>
              <span class="status__indicator status__indicator--red" id="status-ns-light"></span>
              <span class="status__text" id="status-ns">RED</span>
              <span class="status__timer" id="status-ns-timer">(0s)</span>
            </div>
            <div class="status__row">
              <span class="status__label">E/W:</span>
              <span class="status__indicator status__indicator--red" id="status-ew-light"></span>
              <span class="status__text" id="status-ew">RED</span>
              <span class="status__timer" id="status-ew-timer">(0s)</span>
            </div>
            <div class="status__row">
              <span class="status__label">Ped:</span>
              <span class="status__indicator status__indicator--red" id="status-ped-light"></span>
              <span class="status__text" id="status-ped">DON'T WALK</span>
            </div>
            <div class="status__row status__row--counts">
              <span>Cars: <strong id="status-car-count">0</strong></span>
              <span>Pedestrians: <strong id="status-ped-count">0</strong></span>
            </div>
          </div>
        </fieldset>

      </aside>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>Adjust timings and watch traffic flow. Press <kbd>Space</kbd> to start/pause.</p>
    </footer>

  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 5. CSS Design

### Layout Strategy

- **CSS Grid** for the overall page: header, main (canvas + controls), footer.
- **CSS Grid** within `main` for the two-column canvas + controls layout.
- **Flexbox** within control panel for stacking fieldsets and slider rows.
- Canvas is fixed at 700×700 on large screens, scales via `max-width: 100%` on small screens.

### Key Styles

```
.app                →  min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto;
.main               →  display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; padding: 1.5rem;
.canvas-container   →  display: flex; justify-content: center; align-items: flex-start;
  __canvas          →  max-width: 100%; height: auto; border-radius: 8px; box-shadow: var(--shadow-light);
.controls           →  display: flex; flex-direction: column; gap: 1rem;
  __group           →  background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px;
                        padding: 1rem;
  __legend          →  font-weight: var(--fw-semibold); color: var(--text-primary); font-size: var(--fs-h2);
  __slider-row      →  display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem;
  __slider          →  -webkit-appearance: none; height: 6px; background: var(--slider-track);
                        border-radius: 3px; cursor: pointer;
  __slider::-webkit-slider-thumb  →  width: 18px; height: 18px; border-radius: 50%; background: var(--slider-thumb);
  __output          →  font-family: var(--font-mono); font-size: var(--fs-mono); color: var(--accent);
.btn                →  padding: 0.6rem 1rem; border: none; border-radius: 6px; font-weight: var(--fw-semibold);
                        cursor: pointer; transition: background 0.2s, transform 0.1s;
  --start           →  background: var(--btn-primary-bg); color: #fff;
  --pause           →  background: var(--btn-pause-bg); color: #000;
  --reset           →  background: var(--btn-reset-bg); color: #fff;
  --ped             →  background: var(--btn-ped-bg); color: #fff; width: 100%; margin-top: 0.5rem;
                        font-size: 1rem;
.status__indicator  →  width: 12px; height: 12px; border-radius: 50%; display: inline-block;
  --red             →  background: var(--light-red); box-shadow: var(--shadow-glow-red);
  --amber           →  background: var(--light-amber); box-shadow: var(--shadow-glow-amber);
  --green           →  background: var(--light-green); box-shadow: var(--shadow-glow-green);

@media (max-width: 899px):
  .main → grid-template-columns: 1fr; (controls move below canvas)

@media (max-width: 599px):
  .canvas-container__canvas → width: 100%; height: auto;
  .controls__buttons → flex-direction: column;
```

### Slider Colour Accents

- `--green` slider track fill: `var(--light-green)`
- `--amber` slider track fill: `var(--light-amber)`
- `--red` slider track fill: `var(--light-red)`
- `--ped` slider track fill: `var(--btn-ped-bg)`

---

## 6. JavaScript Architecture

### Module Map

```
js/
├── main.js               Entry point: init, game loop, orchestration
└── modules/
    ├── config.js          Default constants, timing, dimensions, colours
    ├── intersection.js    Draw roads, lane markings, crossings, sidewalks, islands
    ├── traffic-light.js   TrafficLightController: state machine, phase timing, coordination
    ├── vehicle.js         Vehicle class: spawn, move, stop, queue, despawn
    ├── pedestrian.js      Pedestrian class: spawn, wait, cross, despawn
    ├── controls.js        Bind DOM controls ↔ config values, event handlers
    └── renderer.js        Compose all draw calls each frame
```

### Module Details

#### `config.js`

```js
export const CONFIG = {
  canvas: {
    width: 700,
    height: 700
  },

  road: {
    start: 250,           // Road area starts at 250px
    end: 450,             // Road area ends at 450px
    width: 200,           // Total road width
    laneWidth: 80,        // Each lane is 80px wide
    medianWidth: 40,      // Centre median/gap between lanes
    centreLine: 350       // Centre of intersection
  },

  lanes: {
    southbound: { x: 280, dir: 'south' },   // Centre x of SB lane
    northbound: { x: 420, dir: 'north' },   // Centre x of NB lane
    eastbound:  { y: 420, dir: 'east' },    // Centre y of EB lane
    westbound:  { y: 280, dir: 'west' }     // Centre y of WB lane
  },

  stopLines: {
    north: 245,   // y position: vehicles approaching from north stop here
    south: 455,   // y position: vehicles approaching from south stop here
    west: 245,    // x position: vehicles approaching from west stop here
    east: 455     // x position: vehicles approaching from east stop here
  },

  crossings: {
    width: 15,            // Crossing stripe area width
    stripeWidth: 4,       // Individual stripe width
    stripeGap: 4          // Gap between stripes
  },

  trafficLight: {
    housingWidth: 16,
    housingHeight: 42,
    bulbRadius: 5,
    positions: {
      // Each light box corner position (top-left of housing)
      northApproach: { x: 453, y: 453 },   // SE corner — NB vehicles watch
      southApproach: { x: 231, y: 231 },   // NW corner — SB vehicles watch
      eastApproach:  { x: 231, y: 453 },   // SW corner — EB vehicles watch
      westApproach:  { x: 453, y: 231 }    // NE corner — WB vehicles watch
    }
  },

  timing: {
    greenDuration: 10000,      // 10 seconds (ms)
    amberDuration: 3000,       // 3 seconds
    allRedClearance: 2000,     // 2 seconds
    pedestrianDuration: 8000,  // 8 seconds
    pedestrianFlash: 3000      // Last 3s of ped phase: flashing DON'T WALK
  },

  vehicles: {
    width: 22,           // Vehicle width (px) — perpendicular to travel
    length: 40,          // Vehicle length (px) — along direction of travel
    speed: 2.0,          // Pixels per frame at 1× speed
    minFollowDistance: 12,  // Min gap between queued vehicles (px)
    spawnInterval: 3000, // ms between spawn attempts per lane
    colours: [
      '#c62828', '#1565c0', '#eceff1', '#212121',
      '#90a4ae', '#f9a825', '#2e7d32'
    ]
  },

  pedestrians: {
    radius: 5,
    speed: 1.0,
    colour: '#ff7043',
    outline: '#bf360c',
    spawnChance: 0.3     // 30% chance to spawn when ped phase starts
  },

  simulation: {
    fps: 60,
    speedMultiplier: 1.0
  }
};
```

#### `main.js`

```
Responsibilities:
  1. Import all modules
  2. Get canvas context
  3. Instantiate TrafficLightController, vehicle manager, pedestrian manager
  4. Call controls.init() to bind UI
  5. Run the simulation loop using requestAnimationFrame
  6. On each frame:
     a. Calculate deltaTime (capped at 50ms to prevent spiral)
     b. Update traffic light state (controller.update(dt))
     c. Update vehicles (spawn, move, stop logic)
     d. Update pedestrians (spawn during ped phase, move, despawn)
     e. Call renderer.draw(ctx, state)
     f. Update status panel DOM
  7. Handle start/pause/reset events

Exports: nothing (entry point)
```

#### `intersection.js`

```
Exports:
  drawIntersection(ctx, config)

Draws (in order):
  1. Grass background — fill entire canvas with var(--grass)
  2. Sidewalks — grey rectangles along road edges (8px wide strips)
  3. Road surfaces — two crossing rectangles of var(--road-surface)
       Vertical road:   x=250, y=0,   w=200, h=700
       Horizontal road: x=0,   y=250, w=700, h=200
  4. Centre median lines — dashed yellow lines down the middle of each road
       Vertical:   x=350, dashed along y
       Horizontal: y=350, dashed along x
  5. Lane edge markings — dashed white lines at lane boundaries
  6. Stop lines — solid white lines perpendicular to traffic flow, 3px thick
       At y=245 (x:250→450), y=455, x=245 (y:250→450), x=455
  7. Pedestrian crossings — alternating white/road stripes
       North crossing: stripes at y=232→248, across road width
       South crossing: stripes at y=452→468
       West crossing:  stripes at x=232→248
       East crossing:  stripes at x=452→468
  8. Corner islands — small rounded rectangles at the four inner corners
```

#### `traffic-light.js`

```
Exports:
  class TrafficLightController

State Machine (see §7 for full diagram):
  Phases: NS_GREEN → NS_AMBER → ALL_RED_1 → EW_GREEN → EW_AMBER → ALL_RED_2 → (PED_PHASE →) repeat

Properties:
  - currentPhase: string
  - phaseTimer: number (ms remaining in current phase)
  - pedRequested: boolean
  - nsState: 'red' | 'amber' | 'green'
  - ewState: 'red' | 'amber' | 'green'
  - pedState: 'stop' | 'walk' | 'flash'

Methods:
  - update(dt): decrement phaseTimer, transition on expiry
  - requestPedestrian(): set pedRequested = true
  - getLightState(direction): returns { state, colour } for a given approach direction
  - getPedState(): returns current pedestrian signal state
  - getPhaseTimeRemaining(): returns seconds left in current phase
  - reset(): return to initial state

Drawing method:
  - drawLights(ctx, config): draw the four traffic light housings with
    correct bulb illumination based on nsState/ewState
  - drawPedSignals(ctx, config): draw walk/don't-walk indicators at crossings
```

#### `vehicle.js`

```
Exports:
  class Vehicle
  class VehicleManager

Vehicle properties:
  - x, y: current position (centre of vehicle)
  - lane: 'northbound' | 'southbound' | 'eastbound' | 'westbound'
  - speed: current speed (px/frame)
  - maxSpeed: from CONFIG.vehicles.speed
  - colour: randomly chosen from CONFIG.vehicles.colours
  - width, length: from CONFIG
  - stopped: boolean

Vehicle methods:
  - update(dt, lightState, vehicleAhead): move, check light, check distance
  - draw(ctx): draw filled rounded rectangle with outline, oriented by lane direction
  - isOffscreen(): returns true if vehicle has exited canvas bounds
  - distanceTo(otherVehicle): calculate gap to vehicle ahead in same lane

VehicleManager properties:
  - vehicles: Vehicle[] — all active vehicles
  - spawnTimers: { north, south, east, west } — per-direction spawn cooldowns

VehicleManager methods:
  - update(dt, lightController): for each vehicle: update; spawn new if timer expired; remove offscreen
  - draw(ctx): draw all vehicles
  - spawnVehicle(direction): create vehicle at edge of canvas in correct lane
  - getVehicleAhead(vehicle): find nearest vehicle ahead in the same lane
  - getCount(): return total active vehicles
  - reset(): clear all vehicles and timers
```

#### `pedestrian.js`

```
Exports:
  class Pedestrian
  class PedestrianManager

Pedestrian properties:
  - x, y: current position
  - crossing: 'north' | 'south' | 'east' | 'west' — which crossing they're using
  - targetX, targetY: destination on the other side
  - speed: CONFIG.pedestrians.speed
  - waiting: boolean (waiting for walk signal)
  - crossing: boolean (currently crossing)
  - finished: boolean (reached other side)

Pedestrian methods:
  - update(dt, pedState): if walk signal active → move toward target; else wait
  - draw(ctx): filled circle with outline

PedestrianManager properties:
  - pedestrians: Pedestrian[]

PedestrianManager methods:
  - update(dt, pedState): update all; spawn on phase start; remove finished
  - draw(ctx): draw all pedestrians
  - spawnPedestrians(): create 1–3 pedestrians at random crossings
  - getCount(): return active pedestrian count
  - reset(): clear all
```

#### `controls.js`

```
Exports:
  function initControls(callbacks)

Responsibilities:
  1. Query all DOM slider/button elements
  2. Bind input events on sliders → update CONFIG values + output displays
  3. Bind click events on buttons → call provided callbacks:
     - btn-start     → callbacks.onStart()
     - btn-pause     → callbacks.onPause()
     - btn-reset     → callbacks.onReset()
     - btn-ped-request → callbacks.onPedRequest()
  4. Bind keyboard shortcuts:
     - Space          → toggle start/pause
     - R              → reset
     - P              → pedestrian request
  5. Update output elements to reflect slider values

Slider → config mappings:
  - green-slider      → CONFIG.timing.greenDuration (value × 1000)
  - amber-slider      → CONFIG.timing.amberDuration (value × 1000)
  - red-clearance-slider → CONFIG.timing.allRedClearance (value × 1000)
  - ped-slider        → CONFIG.timing.pedestrianDuration (value × 1000)
  - spawn-slider      → CONFIG.vehicles.spawnInterval (value × 1000)
  - speed-slider      → CONFIG.simulation.speedMultiplier (value as float)
```

#### `renderer.js`

```
Exports:
  function render(ctx, config, intersection, lightController, vehicleManager, pedestrianManager)

Draw order (back to front):
  1. ctx.clearRect(0, 0, width, height)
  2. intersection.drawIntersection(ctx, config)          — roads, markings
  3. pedestrianManager.draw(ctx)                         — pedestrians (behind vehicles)
  4. vehicleManager.draw(ctx)                            — vehicles
  5. lightController.drawLights(ctx, config)             — traffic light housings + bulbs
  6. lightController.drawPedSignals(ctx, config)         — walk/don't-walk signals
```

---

## 7. Traffic Light Logic

### State Machine

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         │
             ┌──────────┐                                     │
             │ NS_GREEN │  N/S = 🟢  E/W = 🔴                │
             │ (10s)    │  Ped = 🔴 DON'T WALK               │
             └────┬─────┘                                     │
                  │ timer expires                             │
                  ▼                                           │
             ┌──────────┐                                     │
             │ NS_AMBER │  N/S = 🟡  E/W = 🔴                │
             │ (3s)     │                                     │
             └────┬─────┘                                     │
                  │ timer expires                             │
                  ▼                                           │
             ┌───────────┐                                    │
             │ ALL_RED_1 │  N/S = 🔴  E/W = 🔴               │
             │ (2s)      │  (intersection clearance)          │
             └────┬──────┘                                    │
                  │ timer expires                             │
                  ▼                                           │
             ┌──────────┐                                     │
             │ EW_GREEN │  N/S = 🔴  E/W = 🟢                │
             │ (10s)    │  Ped = 🔴 DON'T WALK               │
             └────┬─────┘                                     │
                  │ timer expires                             │
                  ▼                                           │
             ┌──────────┐                                     │
             │ EW_AMBER │  N/S = 🔴  E/W = 🟡                │
             │ (3s)     │                                     │
             └────┬─────┘                                     │
                  │ timer expires                             │
                  ▼                                           │
             ┌───────────┐                                    │
             │ ALL_RED_2 │  N/S = 🔴  E/W = 🔴               │
             │ (2s)      │                                    │
             └────┬──────┘                                    │
                  │ timer expires                             │
                  │                                           │
                  ├── if pedRequested ──▶ ┌──────────────┐    │
                  │                       │  PED_PHASE   │    │
                  │                       │  (8s)        │    │
                  │                       │  All = 🔴     │    │
                  │                       │  Ped = 🟢 WALK│    │
                  │                       │  (last 3s:   │    │
                  │                       │   flashing)  │    │
                  │                       └──────┬───────┘    │
                  │                              │            │
                  │◀─────────────────────────────┘            │
                  │                                           │
                  └── else ───────────────────────────────────┘
                       (loop back to NS_GREEN)
```

### Phase Table

| Phase | N/S Light | E/W Light | Ped Signal | Duration (default) |
|---|---|---|---|---|
| `NS_GREEN` | 🟢 Green | 🔴 Red | 🔴 Don't Walk | 10s |
| `NS_AMBER` | 🟡 Amber | 🔴 Red | 🔴 Don't Walk | 3s |
| `ALL_RED_1` | 🔴 Red | 🔴 Red | 🔴 Don't Walk | 2s |
| `EW_GREEN` | 🔴 Red | 🟢 Green | 🔴 Don't Walk | 10s |
| `EW_AMBER` | 🔴 Red | 🟡 Amber | 🔴 Don't Walk | 3s |
| `ALL_RED_2` | 🔴 Red | 🔴 Red | 🔴 Don't Walk | 2s |
| `PED_PHASE` | 🔴 Red | 🔴 Red | 🟢 Walk (flash last 3s) | 8s |

### Phase Transition Logic (pseudocode)

```
update(dt):
  phaseTimer -= dt * speedMultiplier

  if phaseTimer <= 0:
    switch currentPhase:
      case 'NS_GREEN':
        transitionTo('NS_AMBER', amberDuration)

      case 'NS_AMBER':
        transitionTo('ALL_RED_1', allRedClearance)

      case 'ALL_RED_1':
        transitionTo('EW_GREEN', greenDuration)

      case 'EW_GREEN':
        transitionTo('EW_AMBER', amberDuration)

      case 'EW_AMBER':
        transitionTo('ALL_RED_2', allRedClearance)

      case 'ALL_RED_2':
        if pedRequested:
          pedRequested = false
          transitionTo('PED_PHASE', pedestrianDuration)
        else:
          transitionTo('NS_GREEN', greenDuration)

      case 'PED_PHASE':
        transitionTo('NS_GREEN', greenDuration)

  // Update ped flash state
  if currentPhase === 'PED_PHASE' AND phaseTimer < pedestrianFlash:
    pedState = 'flash'   // Alternates walk/stop every 500ms
```

### Light State Helper

```
getLightState(direction):
  if direction is 'north' or 'south':
    return nsState   // 'red', 'amber', or 'green'
  else:
    return ewState
```

---

## 8. Vehicle Behaviour

### Spawning

Vehicles spawn from the four edges of the canvas, positioned in the correct lane centre:

| Direction | Spawn Position | Lane Centre | Travel |
|---|---|---|---|
| Southbound | (280, −40) | x = 280 | ↓ increasing y |
| Northbound | (420, 740) | x = 420 | ↑ decreasing y |
| Eastbound | (−40, 420) | y = 420 | → increasing x |
| Westbound | (740, 280) | y = 280 | ← decreasing x |

- Each direction has an independent spawn timer initialised to `spawnInterval`.
- When the timer expires, spawn one vehicle and reset the timer.
- Add ±500ms random jitter to avoid synchronised spawning.
- Do not spawn if a vehicle already occupies the spawn zone (within `length + minFollowDistance` of the edge).

### Lane Following

Vehicles move in a straight line along their lane centre. No lane changing or turning is implemented in the base version.

```
update(dt):
  speedMultiplier = CONFIG.simulation.speedMultiplier
  effectiveSpeed = speed * speedMultiplier * (dt / 16.67)  // Normalise to 60fps

  switch lane:
    case 'southbound': y += effectiveSpeed
    case 'northbound': y -= effectiveSpeed
    case 'eastbound':  x += effectiveSpeed
    case 'westbound':  x -= effectiveSpeed
```

### Stopping at Red Lights

```
shouldStop(lightState, stopLinePos):
  // Check if approaching stop line and light is not green
  switch lane:
    case 'southbound':
      approaching = y < stopLines.north AND y > stopLines.north - 120
      return approaching AND lightState !== 'green'

    case 'northbound':
      approaching = y > stopLines.south AND y < stopLines.south + 120
      return approaching AND lightState !== 'green'

    // Similar for east/west...

  // Also stop if light just turned amber and vehicle is far enough away
  // (within 120px of stop line but not yet past it)
```

### Deceleration & Stopping

```
updateSpeed(lightState, vehicleAhead):
  mustStopAtLight = shouldStop(lightState, ...)
  
  if mustStopAtLight:
    // Calculate distance to stop line
    distToStop = calculateDistToStopLine()
    if distToStop < 5:
      speed = 0          // Full stop
    else:
      // Decelerate proportionally
      speed = maxSpeed * (distToStop / 120)
      speed = Math.max(speed, 0.3)   // Minimum creep speed

  else if vehicleAhead exists:
    gap = distanceTo(vehicleAhead)
    if gap < minFollowDistance + length:
      speed = 0          // Stop behind vehicle ahead
    elif gap < minFollowDistance + length + 60:
      // Slow down proportionally
      speed = vehicleAhead.speed * (gap / (minFollowDistance + length + 60))
    else:
      speed = maxSpeed   // Resume full speed

  else:
    speed = maxSpeed     // Open road
```

### Queue Management

When a vehicle stops at a red light, subsequent vehicles in the same lane must also stop, forming a queue:

1. `getVehicleAhead(vehicle)` sorts all vehicles in the same lane by their position along the travel axis.
2. It returns the nearest vehicle ahead (in the direction of travel).
3. Each vehicle checks the gap to the vehicle ahead before deciding its speed.
4. When the light turns green, the front vehicle starts first. Each subsequent vehicle starts once the gap to the vehicle ahead exceeds `minFollowDistance`.

### Despawning

A vehicle is removed from the simulation when it exits the canvas bounds:
- Southbound: `y > canvas.height + length`
- Northbound: `y < -length`
- Eastbound: `x > canvas.width + length`
- Westbound: `x < -length`

### Vehicle Drawing

```
draw(ctx):
  ctx.save()
  ctx.translate(x, y)

  // Rotate based on direction
  switch lane:
    'southbound': rotation = 0          // Default orientation
    'northbound': rotation = Math.PI     // 180°
    'eastbound':  rotation = -Math.PI/2  // 90° CCW
    'westbound':  rotation = Math.PI/2   // 90° CW

  ctx.rotate(rotation)

  // Draw car body (rounded rectangle)
  roundRect(ctx, -width/2, -length/2, width, length, 4)
  ctx.fillStyle = colour
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  ctx.stroke()

  // Draw windshield (darker rectangle at front)
  ctx.fillStyle = 'rgba(100, 180, 255, 0.5)'
  ctx.fillRect(-width/2 + 3, -length/2 + 4, width - 6, 10)

  ctx.restore()
```

---

## 9. Accessibility & State Management

### Accessibility

| Feature | Implementation |
|---|---|
| **Keyboard controls** | Space = start/pause, R = reset, P = request pedestrian crossing |
| **ARIA labels** | All buttons and sliders have `aria-label` attributes |
| **Live region** | Status panel uses `role="status"` and `aria-live="polite"` for screen reader updates |
| **Canvas fallback** | `<canvas>` contains fallback text for browsers without canvas support |
| **Semantic HTML** | `<header>`, `<main>`, `<aside>`, `<footer>`, `<fieldset>`, `<legend>` |
| **Focus indicators** | All interactive controls have visible focus outlines (`:focus-visible`) |
| **`<output>` elements** | Slider values displayed in `<output>` tags linked via `aria-describedby` |
| **Colour not sole indicator** | Status text accompanies coloured indicators (e.g., "GREEN" next to 🟢) |
| **`<kbd>` hints** | Keyboard shortcuts shown in footer with `<kbd>` elements |

### State Management

All simulation state is held in plain JavaScript objects — no external state library.

```
Main state object (conceptual):

simulationState = {
  running: false,              // Is the simulation actively running?
  lastTimestamp: 0,            // Last RAF timestamp for delta calculation

  trafficController: {
    currentPhase: 'NS_GREEN',
    phaseTimer: 10000,
    pedRequested: false,
    nsState: 'green',
    ewState: 'red',
    pedState: 'stop'
  },

  vehicles: Vehicle[],         // Managed by VehicleManager
  pedestrians: Pedestrian[],   // Managed by PedestrianManager

  config: CONFIG               // Mutable config (user adjusts via sliders)
}
```

### Reset Behaviour

When the user clicks Reset:
1. Cancel the current `requestAnimationFrame`.
2. Set `running = false`.
3. Call `trafficController.reset()` — phase back to `NS_GREEN`, timer reset.
4. Call `vehicleManager.reset()` — clear all vehicles and spawn timers.
5. Call `pedestrianManager.reset()` — clear all pedestrians.
6. Redraw the empty intersection once (so the user sees a clean state).
7. Update status panel to reflect initial state.
8. Re-enable the Start button, disable Pause.

---

## 10. Implementation Checklist

### Phase 1: Foundation

- [ ] Create project folder structure (`index.html`, `js/`, `js/modules/`, `styles/`, `assets/`)
- [ ] Write `index.html` with full semantic structure, canvas element, and control panel
- [ ] Write `styles/main.css` with all CSS variables, layout grid, control panel styling, responsive breakpoints
- [ ] Verify page renders correctly with empty canvas and styled controls
- [ ] Test responsive layout at 1200px, 800px, and 400px widths

### Phase 2: Static Intersection

- [ ] Create `js/modules/config.js` with all default values
- [ ] Create `js/modules/intersection.js` — `drawIntersection()` function
- [ ] Draw grass background, road surfaces, lane markings
- [ ] Draw centre median lines (dashed yellow)
- [ ] Draw stop lines (solid white, 3px)
- [ ] Draw pedestrian crossing stripes (zebra pattern)
- [ ] Draw corner islands/sidewalks
- [ ] Create `js/main.js` — get canvas context, call `drawIntersection()` once
- [ ] Verify intersection renders correctly with proper dimensions and colours

### Phase 3: Traffic Lights

- [ ] Create `js/modules/traffic-light.js` — `TrafficLightController` class
- [ ] Implement state machine with all 7 phases
- [ ] Implement `update(dt)` with phase timer and transitions
- [ ] Implement `drawLights(ctx)` — draw four light housings with correct bulb states
- [ ] Add dim bulbs for inactive states (e.g., dim red when green is active)
- [ ] Add glow effect on active bulbs using `ctx.shadowBlur`
- [ ] Implement `getLightState(direction)` helper
- [ ] Implement pedestrian signal drawing (`drawPedSignals`)
- [ ] Wire into main loop — verify lights cycle correctly with timing
- [ ] Test pedestrian request sets `pedRequested` and inserts PED_PHASE

### Phase 4: Vehicles

- [ ] Create `js/modules/vehicle.js` — `Vehicle` and `VehicleManager` classes
- [ ] Implement vehicle spawning from four edges with proper lane positions
- [ ] Implement straight-line movement along lane centre
- [ ] Implement red light detection and deceleration/stopping
- [ ] Implement vehicle-following with minimum gap enforcement
- [ ] Implement queue formation at red lights
- [ ] Implement despawning when offscreen
- [ ] Implement vehicle drawing with rotation and windshield detail
- [ ] Verify vehicles stop at red, queue up, and resume smoothly on green
- [ ] Test that spawn rate slider affects spawn frequency

### Phase 5: Pedestrians

- [ ] Create `js/modules/pedestrian.js` — `Pedestrian` and `PedestrianManager` classes
- [ ] Implement pedestrian spawning at crossing edges when PED_PHASE starts
- [ ] Implement waiting behaviour (stand at crossing edge until walk signal)
- [ ] Implement crossing movement toward opposite side
- [ ] Implement despawning when crossing is complete
- [ ] Draw pedestrians as coloured circles with outlines
- [ ] Verify pedestrians only cross during PED_PHASE
- [ ] Test flashing DON'T WALK in last 3 seconds (pedestrians already crossing continue)

### Phase 6: Controls & UI

- [ ] Create `js/modules/controls.js` — `initControls()` function
- [ ] Bind all sliders to CONFIG values with real-time updates
- [ ] Update `<output>` elements as sliders move
- [ ] Implement Start button → begins `requestAnimationFrame` loop
- [ ] Implement Pause button → cancels RAF loop, preserves state
- [ ] Implement Reset button → full state reset
- [ ] Implement Pedestrian Request button → sets flag, visual feedback (button highlight)
- [ ] Implement keyboard shortcuts (Space, R, P)
- [ ] Wire up status panel — update N/S state, E/W state, ped state, countdown timers, counts
- [ ] Style active status indicators with correct glow colours

### Phase 7: Renderer & Polish

- [ ] Create `js/modules/renderer.js` — `render()` compositing function
- [ ] Ensure correct draw order (intersection → pedestrians → vehicles → lights → signals)
- [ ] Add smooth deceleration curves for vehicles (ease-out near stop line)
- [ ] Add visual feedback on pedestrian request button (flash/pulse when request is pending)
- [ ] Add `requestAnimationFrame` delta time capping (max 50ms per frame)
- [ ] Test full simulation: lights cycle, vehicles flow and stop, pedestrians cross
- [ ] Test all slider adjustments take effect immediately
- [ ] Test keyboard shortcuts work without focus issues
- [ ] Test at multiple simulation speeds (0.25×, 1×, 3×)

### Phase 8: Final Testing & README

- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Responsive test on mobile viewport
- [ ] Accessibility audit: tab order, screen reader, keyboard-only navigation
- [ ] Performance check: confirm 60fps with 20+ vehicles on screen
- [ ] Write `README.md` with project description, features, and how to run
- [ ] Final code review: consistent style, no console errors, clean imports
