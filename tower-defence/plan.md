# Tower Defence — Implementation Plan

## Table of Contents

1. [Overview](#1-overview)
2. [Page Layout & Wireframe](#2-page-layout--wireframe)
3. [Colour Scheme & Typography](#3-colour-scheme--typography)
4. [HTML Structure](#4-html-structure)
5. [CSS Design](#5-css-design)
6. [JavaScript Architecture](#6-javascript-architecture)
7. [Game Mechanics](#7-game-mechanics)
8. [Turret Types Table](#8-turret-types-table)
9. [Enemy Types Table](#9-enemy-types-table)
10. [Wave Progression](#10-wave-progression)
11. [Accessibility](#11-accessibility)
12. [Step-by-Step Build Order](#12-step-by-step-build-order)
13. [Stretch Goals](#13-stretch-goals)

---

## 1. Overview

A classic tower-defence strategy game built with vanilla JavaScript and HTML5 Canvas. The player defends a base by placing turrets along a winding path. Enemies spawn in waves, follow the path, and cost the player lives if they reach the exit. The player earns gold by defeating enemies and spends it on new turrets and upgrades.

### Core Loop

1. **Preparation phase** — The player reviews the map and places or upgrades turrets using available gold.
2. **Combat phase** — The player presses "Start Wave". Enemies spawn at the path entrance and walk toward the exit. Turrets automatically target and fire at enemies within range. Projectiles travel toward targets and deal damage on hit.
3. **Outcome** — Enemies that die award gold. Enemies that reach the exit cost lives. When all enemies in the wave are defeated or have exited, the preparation phase begins again.
4. **Game over** — When lives reach zero, the game ends and the player sees their final wave count and score.

### Design Goals

- Smooth 60 FPS canvas rendering with `requestAnimationFrame`.
- Clean separation between game logic, rendering, and UI.
- ES module architecture with no external dependencies.
- Desktop-first layout that remains playable on tablets.
- Accessible controls — all actions reachable with keyboard and mouse.

---

## 2. Page Layout & Wireframe

### High-Level Layout

The page uses a horizontal split: a large game canvas on the left and a narrower sidebar on the right. A top HUD bar spans the full width above both.

```text
┌─────────────────────────────────────────────────────────────────────┐
│  HUD BAR                                                            │
│  [♥ Lives: 20]   [💰 Gold: 200]   [🌊 Wave: 0 / ∞]   [⭐ Score: 0] │
├─────────────────────────────────────────┬───────────────────────────┤
│                                         │  SIDEBAR                  │
│                                         │                           │
│            GAME CANVAS                  │  ┌─────────────────────┐  │
│          (800 × 600 px)                 │  │  BUILD MENU         │  │
│                                         │  │                     │  │
│  ┌───────────────────────────────────┐  │  │  [Arrow Tower  50g] │  │
│  │                                   │  │  │  [Cannon      100g] │  │
│  │   Grid cells (40 × 40 px each)    │  │  │  [Sniper      150g] │  │
│  │   Path tiles highlighted          │  │  │  [Freeze      120g] │  │
│  │   Turrets rendered on cells       │  │  │                     │  │
│  │   Enemies walk along path         │  │  └─────────────────────┘  │
│  │   Projectiles animate             │  │                           │
│  │   Range circles on hover          │  │  ┌─────────────────────┐  │
│  │                                   │  │  │  UPGRADE PANEL      │  │
│  └───────────────────────────────────┘  │  │  (hidden until a    │  │
│                                         │  │   turret is clicked) │  │
│                                         │  │                     │  │
│                                         │  │  Name: Arrow Tower   │  │
│                                         │  │  Level: 1 / 3        │  │
│                                         │  │  Damage: 10          │  │
│                                         │  │  Range: 120 px       │  │
│                                         │  │  Fire Rate: 0.5 s    │  │
│                                         │  │                     │  │
│                                         │  │  [Upgrade — 40g]    │  │
│                                         │  │  [Sell — 25g]       │  │
│                                         │  └─────────────────────┘  │
│                                         │                           │
│                                         │  ┌─────────────────────┐  │
│                                         │  │  WAVE INFO          │  │
│                                         │  │  Next: 6× Scout     │  │
│                                         │  │        3× Tank      │  │
│                                         │  │                     │  │
│                                         │  │  [▶ START WAVE]     │  │
│                                         │  └─────────────────────┘  │
├─────────────────────────────────────────┴───────────────────────────┤
│  WAVE ANNOUNCEMENT OVERLAY (centered, fades in/out)                 │
│  "WAVE 5"                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Canvas Details

- Internal resolution: **800 × 600 pixels**.
- Grid: **20 columns × 15 rows** (each cell 40 × 40 px).
- Path tiles are a distinct colour; non-path tiles are the buildable area.
- Turrets snap to grid centres when placed.
- Game-over overlay renders directly on the canvas.

### Sidebar Details

- Fixed width: **260 px**.
- Scrollable if content overflows on smaller screens.
- Three panels stacked vertically: Build Menu, Upgrade Panel, Wave Info.

### HUD Bar Details

- Height: **48 px**.
- Displays lives (heart icon), gold (coin icon), wave counter, and score.
- Updates every frame via DOM text content (not innerHTML).

---

## 3. Colour Scheme & Typography

### Palette — Military / Strategy Theme

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background (dark) | Gunmetal | `#1B2631` | Page background, canvas border |
| Canvas ground | Olive Drab | `#3D4F2F` | Grass / buildable tiles |
| Path | Sandy Brown | `#C4A35A` | Enemy path tiles |
| Path border | Dark Khaki | `#8B7D3C` | Path tile outlines |
| Sidebar BG | Charcoal | `#2C3E50` | Sidebar panel background |
| Panel BG | Dark Slate | `#34495E` | Individual panel cards |
| Primary accent | Command Gold | `#F1C40F` | Gold counter, buttons hover |
| Secondary accent | Alert Red | `#E74C3C` | Lives counter, damage flash |
| Tertiary accent | Ice Blue | `#5DADE2` | Freeze tower, info highlights |
| Success | Tactical Green | `#27AE60` | Affordable items, health bars |
| Text primary | Off White | `#ECF0F1` | All body text |
| Text secondary | Silver | `#95A5A6` | Descriptions, disabled text |
| Button BG | Steel Blue | `#2980B9` | Primary action buttons |
| Button hover | Bright Steel | `#3498DB` | Button hover state |
| Danger button | Crimson | `#C0392B` | Sell button |
| Overlay BG | Black 70% | `rgba(0,0,0,0.7)` | Wave announcement, game over |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page title / wave announce | `'Orbitron', sans-serif` | 32 px / 48 px | 700 |
| HUD numbers | `'Orbitron', sans-serif` | 18 px | 600 |
| Sidebar headings | `'Orbitron', sans-serif` | 16 px | 600 |
| Body / descriptions | `'Roboto', sans-serif` | 14 px | 400 |
| Button labels | `'Roboto', sans-serif` | 14 px | 600 |
| Tooltips | `'Roboto', sans-serif` | 12 px | 400 |

Load via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Roboto:wght@400;600&display=swap" rel="stylesheet">
```

### CSS Variables

```css
:root {
  --clr-bg: #1B2631;
  --clr-ground: #3D4F2F;
  --clr-path: #C4A35A;
  --clr-path-border: #8B7D3C;
  --clr-sidebar: #2C3E50;
  --clr-panel: #34495E;
  --clr-gold: #F1C40F;
  --clr-red: #E74C3C;
  --clr-ice: #5DADE2;
  --clr-green: #27AE60;
  --clr-text: #ECF0F1;
  --clr-text-dim: #95A5A6;
  --clr-btn: #2980B9;
  --clr-btn-hover: #3498DB;
  --clr-danger: #C0392B;
  --clr-overlay: rgba(0, 0, 0, 0.7);
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Roboto', sans-serif;
}
```

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tower Defence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Roboto:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- HUD BAR -->
  <header class="hud" role="banner">
    <div class="hud__stat hud__stat--lives">
      <span class="hud__icon" aria-hidden="true">♥</span>
      <span class="hud__label">Lives</span>
      <span class="hud__value" id="hud-lives">20</span>
    </div>
    <div class="hud__stat hud__stat--gold">
      <span class="hud__icon" aria-hidden="true">💰</span>
      <span class="hud__label">Gold</span>
      <span class="hud__value" id="hud-gold">200</span>
    </div>
    <div class="hud__stat hud__stat--wave">
      <span class="hud__icon" aria-hidden="true">🌊</span>
      <span class="hud__label">Wave</span>
      <span class="hud__value" id="hud-wave">0</span>
    </div>
    <div class="hud__stat hud__stat--score">
      <span class="hud__icon" aria-hidden="true">⭐</span>
      <span class="hud__label">Score</span>
      <span class="hud__value" id="hud-score">0</span>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <main class="game-container">

    <!-- CANVAS AREA -->
    <section class="canvas-wrapper" aria-label="Game map">
      <canvas id="game-canvas" width="800" height="600"></canvas>
      <!-- Wave announcement overlay -->
      <div class="wave-announce" id="wave-announce" aria-live="polite" hidden>
        <span class="wave-announce__text" id="wave-announce-text"></span>
      </div>
    </section>

    <!-- SIDEBAR -->
    <aside class="sidebar" aria-label="Game controls">

      <!-- BUILD MENU -->
      <section class="panel panel--build" aria-label="Build menu">
        <h2 class="panel__title">Build</h2>
        <div class="build-menu" id="build-menu" role="radiogroup" aria-label="Turret selection">
          <!-- Turret buttons generated by JS -->
        </div>
      </section>

      <!-- UPGRADE PANEL -->
      <section class="panel panel--upgrade" id="upgrade-panel" aria-label="Upgrade turret" hidden>
        <h2 class="panel__title">Upgrade</h2>
        <div class="upgrade-info">
          <p class="upgrade-info__name" id="upgrade-name"></p>
          <p class="upgrade-info__level" id="upgrade-level"></p>
          <ul class="upgrade-info__stats" id="upgrade-stats" aria-label="Turret stats"></ul>
        </div>
        <div class="upgrade-actions">
          <button class="btn btn--upgrade" id="btn-upgrade" type="button">Upgrade</button>
          <button class="btn btn--sell" id="btn-sell" type="button">Sell</button>
        </div>
      </section>

      <!-- WAVE INFO -->
      <section class="panel panel--wave" aria-label="Wave information">
        <h2 class="panel__title">Next Wave</h2>
        <ul class="wave-preview" id="wave-preview" aria-label="Upcoming enemies"></ul>
        <button class="btn btn--start" id="btn-start-wave" type="button">▶ Start Wave</button>
      </section>

    </aside>
  </main>

  <!-- GAME OVER OVERLAY -->
  <div class="overlay overlay--gameover" id="gameover-overlay" role="dialog" aria-modal="true" aria-label="Game over" hidden>
    <div class="overlay__content">
      <h2 class="overlay__title">Game Over</h2>
      <p class="overlay__stat">Wave Reached: <span id="gameover-wave"></span></p>
      <p class="overlay__stat">Final Score: <span id="gameover-score"></span></p>
      <button class="btn btn--restart" id="btn-restart" type="button">Play Again</button>
    </div>
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Decisions

- Canvas is an inline element within `.canvas-wrapper` so the wave announcement overlay can be absolutely positioned on top.
- Build menu uses `role="radiogroup"` — only one turret type can be selected at a time.
- Upgrade panel starts `hidden` and is revealed when a placed turret is clicked.
- Game-over overlay is a `role="dialog"` outside `<main>` for proper modal semantics.
- All dynamic text updates use `textContent`, never `innerHTML`, to prevent XSS.

---

## 5. CSS Design

### Global Layout

```css
body {
  margin: 0;
  background: var(--clr-bg);
  color: var(--clr-text);
  font-family: var(--font-body);
  overflow: hidden;
}

.game-container {
  display: flex;
  height: calc(100vh - 48px);
}
```

### HUD Bar

```css
.hud {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 48px;
  background: var(--clr-sidebar);
  border-bottom: 2px solid var(--clr-path-border);
  font-family: var(--font-display);
}

.hud__stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.hud__value {
  font-size: 18px;
  font-weight: 600;
  min-width: 3ch;
  text-align: right;
}

.hud__stat--lives .hud__value { color: var(--clr-red); }
.hud__stat--gold .hud__value  { color: var(--clr-gold); }
.hud__stat--wave .hud__value  { color: var(--clr-ice); }
.hud__stat--score .hud__value { color: var(--clr-green); }
```

### Canvas Wrapper

```css
.canvas-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
}

#game-canvas {
  border: 2px solid var(--clr-path-border);
  cursor: crosshair;
}
```

### Sidebar

```css
.sidebar {
  width: 260px;
  background: var(--clr-sidebar);
  border-left: 2px solid var(--clr-path-border);
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
}

.panel {
  padding: 1rem;
  border-bottom: 1px solid var(--clr-path-border);
}

.panel__title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### Build Menu Buttons

```css
.build-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.build-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--clr-panel);
  border: 2px solid transparent;
  border-radius: 6px;
  color: var(--clr-text);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.build-btn:hover {
  border-color: var(--clr-btn-hover);
  background: rgba(52, 152, 219, 0.15);
}

.build-btn[aria-checked="true"] {
  border-color: var(--clr-gold);
  background: rgba(241, 196, 15, 0.1);
}

.build-btn:disabled,
.build-btn--unaffordable {
  opacity: 0.4;
  cursor: not-allowed;
}

.build-btn__icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.build-btn__cost {
  margin-left: auto;
  color: var(--clr-gold);
  font-weight: 600;
}
```

### Upgrade Panel

```css
.panel--upgrade {
  animation: slideIn 0.2s ease-out;
}

.upgrade-info__name {
  font-family: var(--font-display);
  font-size: 15px;
  margin: 0 0 0.4rem;
}

.upgrade-info__stats {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 13px;
  color: var(--clr-text-dim);
}

.upgrade-info__stats li {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
}

.upgrade-info__stats .stat-boost {
  color: var(--clr-green);
}

.upgrade-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
```

### Buttons

```css
.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  color: var(--clr-text);
}

.btn:hover  { transform: scale(1.03); }
.btn:active { transform: scale(0.97); }
.btn:focus-visible { outline: 2px solid var(--clr-gold); outline-offset: 2px; }

.btn--start   { background: var(--clr-btn); width: 100%; margin-top: 0.75rem; }
.btn--start:hover { background: var(--clr-btn-hover); }

.btn--upgrade { background: var(--clr-green); flex: 1; }
.btn--sell    { background: var(--clr-danger); flex: 1; }

.btn--restart { background: var(--clr-btn); margin-top: 1rem; padding: 0.8rem 2rem; }
```

### Wave Announcement Animation

```css
.wave-announce {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-overlay);
  pointer-events: none;
  z-index: 10;
}

.wave-announce__text {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--clr-gold);
  text-shadow: 0 0 20px rgba(241, 196, 15, 0.6);
  animation: waveAnnounce 2s ease-out forwards;
}

@keyframes waveAnnounce {
  0%   { opacity: 0; transform: scale(0.5); }
  20%  { opacity: 1; transform: scale(1.1); }
  40%  { transform: scale(1); }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-30px); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

### Game Over Overlay

```css
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-overlay);
  z-index: 100;
}

.overlay__content {
  text-align: center;
  background: var(--clr-sidebar);
  padding: 2rem 3rem;
  border-radius: 12px;
  border: 2px solid var(--clr-red);
}

.overlay__title {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--clr-red);
  margin: 0 0 1rem;
}
```

### Responsive

```css
@media (max-width: 1100px) {
  .game-container { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; overflow-x: auto; border-left: none; border-top: 2px solid var(--clr-path-border); }
  .panel { min-width: 220px; border-bottom: none; border-right: 1px solid var(--clr-path-border); }
}
```

---

## 6. JavaScript Architecture

### File Tree

```text
js/
├── main.js
└── modules/
    ├── game.js
    ├── map.js
    ├── enemies.js
    ├── turrets.js
    ├── projectiles.js
    ├── waves.js
    ├── renderer.js
    └── ui.js
```

---

### 6.1 `main.js` — Entry Point & Game Loop

Bootstraps the application, grabs the canvas context, and runs the `requestAnimationFrame` loop.

```text
Imports: game, renderer, ui
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Grabs canvas/context, calls `game.init()`, `ui.init()`, starts the loop. |
| `gameLoop(timestamp)` | `timestamp: DOMHighResTimeStamp` | `void` | Calculates `deltaTime` from previous frame, calls `game.update(dt)`, `renderer.draw(ctx, gameState)`, then `requestAnimationFrame(gameLoop)`. |

#### Exports

None (entry point).

#### Details

- Calculates `deltaTime` in **seconds** (`(timestamp - lastTimestamp) / 1000`), capped at `0.05` to avoid spiral-of-death on tab-away.
- Stores `lastTimestamp` in module scope.
- Calls `game.update(dt)` only when `game.isRunning()` is true.

---

### 6.2 `modules/game.js` — Game State & Core Logic

Central state manager. Owns lives, gold, score, wave number, and the collections of turrets/enemies/projectiles.

#### State (module-scoped)

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `lives` | `number` | `20` | Player lives remaining |
| `gold` | `number` | `200` | Current gold balance |
| `score` | `number` | `0` | Cumulative score |
| `waveNumber` | `number` | `0` | Current wave (0 = not started) |
| `phase` | `string` | `'prep'` | `'prep'` or `'combat'` |
| `turrets` | `Array<Turret>` | `[]` | All placed turrets |
| `enemies` | `Array<Enemy>` | `[]` | All living enemies |
| `projectiles` | `Array<Projectile>` | `[]` | All active projectiles |
| `selectedTurretType` | `string\|null` | `null` | Currently selected build type |
| `selectedPlacedTurret` | `Turret\|null` | `null` | Turret clicked for upgrade |
| `running` | `boolean` | `false` | Whether the game is active |

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Resets all state to defaults, loads the map, binds events. |
| `update(dt)` | `dt: number` | `void` | Master update: calls `updateEnemies(dt)`, `updateTurrets(dt)`, `updateProjectiles(dt)`, checks wave completion. |
| `startWave()` | — | `void` | Increments `waveNumber`, sets phase to `'combat'`, calls `waves.generate(waveNumber)` to populate spawn queue. |
| `spawnEnemy(enemyData)` | `enemyData: object` | `void` | Creates an `Enemy` from template and pushes to `enemies`. |
| `addGold(amount)` | `amount: number` | `void` | Increases gold, updates UI. |
| `spendGold(amount)` | `amount: number` | `boolean` | Returns `false` if insufficient; otherwise deducts and updates UI. |
| `loseLife(count)` | `count: number` | `void` | Reduces lives, triggers game over if lives ≤ 0. |
| `addScore(points)` | `points: number` | `void` | Increases score, updates UI. |
| `placeTurret(gridX, gridY)` | `gridX: number, gridY: number` | `boolean` | Validates placement via `map.canPlace()`, deducts gold, creates turret, pushes to array. Returns success. |
| `upgradeTurret(turret)` | `turret: Turret` | `boolean` | Checks max level and gold, deducts cost, applies stat boosts. Returns success. |
| `sellTurret(turret)` | `turret: Turret` | `void` | Refunds 50 % of total investment, removes from array, frees grid cell. |
| `selectTurretType(type)` | `type: string` | `void` | Sets `selectedTurretType`, clears `selectedPlacedTurret`. |
| `selectPlacedTurret(turret)` | `turret: Turret\|null` | `void` | Sets `selectedPlacedTurret`, shows upgrade panel via `ui.showUpgradePanel()`. |
| `isRunning()` | — | `boolean` | Returns `running`. |
| `gameOver()` | — | `void` | Sets `running = false`, shows game-over overlay via `ui.showGameOver()`. |
| `restart()` | — | `void` | Calls `init()` to reset everything. |
| `getState()` | — | `object` | Returns a read-only snapshot: `{ lives, gold, score, waveNumber, phase, turrets, enemies, projectiles, selectedTurretType, selectedPlacedTurret }`. |

#### Exports

All functions above plus `getState`.

---

### 6.3 `modules/map.js` — Path & Grid

Defines the map layout: which cells are path, which are buildable, and the ordered list of waypoints enemies follow.

#### Constants

| Name | Type | Value | Purpose |
|---|---|---|---|
| `COLS` | `number` | `20` | Grid columns |
| `ROWS` | `number` | `15` | Grid rows |
| `CELL_SIZE` | `number` | `40` | Pixel size per cell |
| `PATH_CELLS` | `Set<string>` | — | Set of `"col,row"` strings marking path tiles |
| `WAYPOINTS` | `Array<{x,y}>` | — | Ordered pixel-centre positions enemies follow |

#### Grid Data

- `grid`: a 2D array (`COLS × ROWS`) where each cell is `{ type: 'ground'|'path', occupied: boolean }`.
- Path cells have `type: 'path'`. Ground cells start `occupied: false`.

#### Waypoints (example path)

```javascript
// Enemies enter top-left, snake across, exit bottom-right
const WAYPOINTS = [
  { x: 0,   y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 300 },
  { x: 500, y: 300 },
  { x: 500, y: 100 },
  { x: 700, y: 100 },
  { x: 700, y: 500 },
  { x: 800, y: 500 },
];
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Builds the grid, marks path cells from `WAYPOINTS`, sets all ground cells as unoccupied. |
| `getGrid()` | — | `Array<Array<Cell>>` | Returns the grid. |
| `getWaypoints()` | — | `Array<{x,y}>` | Returns the waypoints array. |
| `canPlace(gridX, gridY)` | `gridX: number, gridY: number` | `boolean` | Returns `true` if cell is ground type and not occupied. |
| `occupy(gridX, gridY)` | `gridX: number, gridY: number` | `void` | Marks cell as occupied. |
| `free(gridX, gridY)` | `gridX: number, gridY: number` | `void` | Marks cell as unoccupied (on sell). |
| `pixelToGrid(px, py)` | `px: number, py: number` | `{col, row}` | Converts canvas pixel coordinates to grid column/row. |
| `gridToPixel(col, row)` | `col: number, row: number` | `{x, y}` | Returns the pixel centre of a grid cell. |
| `isOnPath(col, row)` | `col: number, row: number` | `boolean` | Checks if a cell is a path tile. |
| `getCellSize()` | — | `number` | Returns `CELL_SIZE`. |
| `getCols()` | — | `number` | Returns `COLS`. |
| `getRows()` | — | `number` | Returns `ROWS`. |

#### Exports

All functions above.

---

### 6.4 `modules/enemies.js` — Enemy Types, Spawning & Movement

Defines enemy templates and the `Enemy` class/factory.

#### Enemy Templates

```javascript
const ENEMY_TYPES = {
  scout:   { name: 'Scout',   hp: 60,  speed: 100, reward: 10, colour: '#E67E22', radius: 8,  ability: null },
  soldier: { name: 'Soldier', hp: 120, speed: 70,  reward: 20, colour: '#E74C3C', radius: 10, ability: null },
  tank:    { name: 'Tank',    hp: 300, speed: 40,  reward: 40, colour: '#8E44AD', radius: 14, ability: 'armoured' },
  healer:  { name: 'Healer',  hp: 80,  speed: 60,  reward: 30, colour: '#27AE60', radius: 10, ability: 'heal' },
  runner:  { name: 'Runner',  hp: 40,  speed: 150, reward: 15, colour: '#F39C12', radius: 7,  ability: 'fast' },
};
```

#### Enemy Instance Properties

| Property | Type | Purpose |
|---|---|---|
| `id` | `number` | Unique ID (auto-incremented) |
| `type` | `string` | Key from `ENEMY_TYPES` |
| `hp` | `number` | Current hit points |
| `maxHp` | `number` | Maximum hit points |
| `speed` | `number` | Pixels per second |
| `baseSpeed` | `number` | Original speed (for slow recovery) |
| `reward` | `number` | Gold awarded on death |
| `colour` | `string` | Render colour |
| `radius` | `number` | Circle radius for drawing and hit detection |
| `ability` | `string\|null` | Special ability key |
| `x` | `number` | Current x pixel position |
| `y` | `number` | Current y pixel position |
| `waypointIndex` | `number` | Index of the next waypoint to move toward |
| `alive` | `boolean` | Whether still active |
| `slowTimer` | `number` | Seconds of slow remaining |
| `slowFactor` | `number` | Speed multiplier when slowed (e.g. `0.5`) |

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `createEnemy(typeKey, waypoints)` | `typeKey: string, waypoints: Array<{x,y}>` | `Enemy` | Creates an enemy instance at the first waypoint with full HP. |
| `updateEnemy(enemy, dt, waypoints)` | `enemy: Enemy, dt: number, waypoints: Array<{x,y}>` | `void` | Moves enemy toward current waypoint. Advances `waypointIndex` on arrival. If past last waypoint, sets `alive = false` and triggers life loss. |
| `damageEnemy(enemy, amount)` | `enemy: Enemy, amount: number` | `void` | Reduces `hp`. If `hp ≤ 0`, sets `alive = false`, awards gold and score. |
| `slowEnemy(enemy, factor, duration)` | `enemy: Enemy, factor: number, duration: number` | `void` | Sets `slowTimer` and `slowFactor`. While `slowTimer > 0`, effective speed is `baseSpeed * slowFactor`. |
| `healNearby(enemy, enemies, dt)` | `enemy: Enemy, enemies: Array<Enemy>, dt: number` | `void` | If enemy has `'heal'` ability, restores HP to allies within 80 px at rate of 10 HP/s. |
| `getEnemyTypes()` | — | `object` | Returns `ENEMY_TYPES` for UI display. |
| `isAtEnd(enemy)` | `enemy: Enemy` | `boolean` | Returns true if enemy passed the last waypoint. |

#### Movement Algorithm (inside `updateEnemy`)

1. Get target waypoint: `waypoints[enemy.waypointIndex]`.
2. Calculate direction vector: `dx = target.x - enemy.x`, `dy = target.y - enemy.y`.
3. Calculate distance: `dist = Math.hypot(dx, dy)`.
4. Calculate effective speed: `spd = enemy.slowTimer > 0 ? enemy.baseSpeed * enemy.slowFactor : enemy.speed`.
5. Calculate step: `step = spd * dt`.
6. If `step >= dist`, snap to waypoint, increment `waypointIndex`. If past last waypoint, enemy exits.
7. Else, move: `enemy.x += (dx / dist) * step`, `enemy.y += (dy / dist) * step`.
8. Decrement `slowTimer` by `dt`, floor at `0`.

#### Exports

All functions above.

---

### 6.5 `modules/turrets.js` — Turret Types, Targeting & Upgrades

Defines turret templates, placement, targeting modes, and upgrade tiers.

#### Turret Templates

```javascript
const TURRET_TYPES = {
  arrow: {
    name: 'Arrow Tower',
    cost: 50,
    damage: 10,
    range: 120,
    fireRate: 0.5,   // seconds between shots
    projectileSpeed: 300,
    projectileColour: '#ECF0F1',
    colour: '#2ECC71',
    targeting: 'first',
    upgrades: [
      { cost: 40,  damage: 15,  range: 130, fireRate: 0.45 },
      { cost: 80,  damage: 22,  range: 145, fireRate: 0.38 },
      { cost: 150, damage: 32,  range: 160, fireRate: 0.30 },
    ],
  },
  cannon: {
    name: 'Cannon',
    cost: 100,
    damage: 40,
    range: 90,
    fireRate: 1.5,
    projectileSpeed: 200,
    projectileColour: '#E74C3C',
    colour: '#E74C3C',
    targeting: 'first',
    splash: 50,        // splash radius in px
    upgrades: [
      { cost: 75,  damage: 55,  range: 100, fireRate: 1.3, splash: 60 },
      { cost: 140, damage: 75,  range: 110, fireRate: 1.1, splash: 70 },
      { cost: 250, damage: 100, range: 125, fireRate: 0.9, splash: 85 },
    ],
  },
  sniper: {
    name: 'Sniper',
    cost: 150,
    damage: 80,
    range: 220,
    fireRate: 2.5,
    projectileSpeed: 600,
    projectileColour: '#F1C40F',
    colour: '#F1C40F',
    targeting: 'strongest',
    upgrades: [
      { cost: 100, damage: 110, range: 240, fireRate: 2.2 },
      { cost: 180, damage: 150, range: 260, fireRate: 1.9 },
      { cost: 300, damage: 200, range: 290, fireRate: 1.5 },
    ],
  },
  freeze: {
    name: 'Freeze Tower',
    cost: 120,
    damage: 0,
    range: 100,
    fireRate: 1.0,
    projectileSpeed: 0,     // area effect, no projectile
    projectileColour: '#5DADE2',
    colour: '#5DADE2',
    targeting: 'closest',
    slowFactor: 0.4,
    slowDuration: 2.0,
    upgrades: [
      { cost: 80,  range: 115, slowFactor: 0.35, slowDuration: 2.5 },
      { cost: 150, range: 130, slowFactor: 0.28, slowDuration: 3.0 },
      { cost: 250, range: 150, slowFactor: 0.20, slowDuration: 3.5 },
    ],
  },
};
```

#### Turret Instance Properties

| Property | Type | Purpose |
|---|---|---|
| `id` | `number` | Unique ID |
| `type` | `string` | Key from `TURRET_TYPES` |
| `gridX` | `number` | Grid column |
| `gridY` | `number` | Grid row |
| `x` | `number` | Pixel centre x |
| `y` | `number` | Pixel centre y |
| `level` | `number` | Current upgrade level (0 = base, max 3) |
| `damage` | `number` | Current damage |
| `range` | `number` | Current range in pixels |
| `fireRate` | `number` | Current seconds between shots |
| `fireCooldown` | `number` | Time until next shot (counts down) |
| `targeting` | `string` | `'first'`, `'closest'`, or `'strongest'` |
| `totalInvested` | `number` | Total gold spent (cost + upgrades), for sell refund |

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `createTurret(typeKey, gridX, gridY, pixelX, pixelY)` | `typeKey: string, gridX: number, gridY: number, pixelX: number, pixelY: number` | `Turret` | Creates a turret with base stats from template. |
| `updateTurret(turret, enemies, projectiles, dt)` | `turret: Turret, enemies: Array<Enemy>, projectiles: Array<Projectile>, dt: number` | `void` | Decrements cooldown, finds target via targeting mode, fires if ready. |
| `findTarget(turret, enemies)` | `turret: Turret, enemies: Array<Enemy>` | `Enemy\|null` | Filters enemies in range, then selects by targeting mode. |
| `getEnemiesInRange(turret, enemies)` | `turret: Turret, enemies: Array<Enemy>` | `Array<Enemy>` | Returns all living enemies within `turret.range` pixels of turret centre. |
| `fire(turret, target, projectiles)` | `turret: Turret, target: Enemy, projectiles: Array<Projectile>` | `void` | Resets cooldown, creates projectile (or applies freeze AOE). |
| `upgradeTurret(turret)` | `turret: Turret` | `{cost: number, success: boolean}` | If below max level, applies next tier stats. Returns upgrade cost for gold deduction. |
| `getSellValue(turret)` | `turret: Turret` | `number` | Returns `Math.floor(turret.totalInvested * 0.5)`. |
| `getUpgradeCost(turret)` | `turret: Turret` | `number\|null` | Returns cost of next upgrade, or `null` if max level. |
| `getUpgradePreview(turret)` | `turret: Turret` | `object\|null` | Returns stats after upgrade for UI preview (damage, range, fireRate changes). |
| `getTurretTypes()` | — | `object` | Returns `TURRET_TYPES` for build menu. |

#### Targeting Algorithms (inside `findTarget`)

- **`first`**: Among enemies in range, pick the one with the highest `waypointIndex`. If tied, the one closest to its next waypoint (furthest along the path).
- **`closest`**: Among enemies in range, pick the one with smallest Euclidean distance to turret centre.
- **`strongest`**: Among enemies in range, pick the one with highest current `hp`.

#### Exports

All functions above.

---

### 6.6 `modules/projectiles.js` — Projectile Movement & Hit Detection

Manages projectile creation, flight, hit testing, and damage application.

#### Projectile Instance Properties

| Property | Type | Purpose |
|---|---|---|
| `id` | `number` | Unique ID |
| `x` | `number` | Current x position |
| `y` | `number` | Current y position |
| `targetId` | `number` | ID of the target enemy |
| `speed` | `number` | Pixels per second |
| `damage` | `number` | Damage to apply on hit |
| `colour` | `string` | Render colour |
| `radius` | `number` | Collision / visual radius (3 px) |
| `splash` | `number\|null` | Splash damage radius (null if none) |
| `active` | `boolean` | Whether still in flight |

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `createProjectile(turret, target)` | `turret: Turret, target: Enemy` | `Projectile` | Creates a projectile at turret position aimed at target. |
| `updateProjectile(proj, enemies, dt)` | `proj: Projectile, enemies: Array<Enemy>, dt: number` | `void` | Moves projectile toward target's current position (homing). Checks hit. |
| `checkHit(proj, enemies)` | `proj: Projectile, enemies: Array<Enemy>` | `boolean` | Returns true if projectile is within hit distance of target. |
| `applyHit(proj, enemies)` | `proj: Projectile, enemies: Array<Enemy>` | `void` | Applies damage to target. If splash, damages all enemies within splash radius. Sets `active = false`. |
| `removeInactive(projectiles)` | `projectiles: Array<Projectile>` | `Array<Projectile>` | Returns filtered array with only active projectiles. |

#### Movement Algorithm (inside `updateProjectile`)

1. Find target enemy by `targetId` in enemies array.
2. If target is dead or missing, deactivate projectile (remove on next cleanup).
3. Calculate direction to target's **current** position (homing behaviour).
4. Move `speed * dt` pixels toward target.
5. If distance to target ≤ `proj.radius + target.radius`, call `applyHit`.

#### Splash Damage (inside `applyHit`)

1. Apply full damage to primary target.
2. If `proj.splash` is set, iterate all other enemies. For each within `splash` radius of the impact point, apply **50 %** of `proj.damage`.

#### Exports

All functions above.

---

### 6.7 `modules/waves.js` — Wave Composition & Scaling

Generates wave data based on the current wave number.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `generateWave(waveNumber)` | `waveNumber: number` | `WaveData` | Returns a `WaveData` object describing the enemies to spawn. |
| `getSpawnQueue(waveData)` | `waveData: WaveData` | `Array<{typeKey, delay}>` | Flattens wave data into an ordered queue of spawn events with delays between each. |
| `getPreview(waveNumber)` | `waveNumber: number` | `Array<{name, count}>` | Returns a summary for the wave-info sidebar (e.g. `[{name:'Scout', count:6}, {name:'Tank', count:2}]`). |

#### WaveData Structure

```javascript
{
  enemies: [
    { type: 'scout', count: 6, interval: 0.8 },
    { type: 'soldier', count: 3, interval: 1.2 },
  ],
  hpMultiplier: 1.15,  // applied to all enemy HP this wave
}
```

#### Wave Scaling Formula

```text
Base enemy count   = 4 + floor(waveNumber * 1.5)
HP multiplier      = 1 + (waveNumber - 1) * 0.12
Speed multiplier   = 1 + (waveNumber - 1) * 0.02   (capped at 1.5)
Spawn interval     = max(0.3, 1.0 - waveNumber * 0.03)
```

#### Wave Composition Rules

| Waves | Available Types | Notes |
|---|---|---|
| 1–3 | Scout only | Tutorial waves |
| 4–6 | Scout, Soldier | Soldiers introduced |
| 7–9 | Scout, Soldier, Runner | Fast enemies appear |
| 10–12 | Scout, Soldier, Runner, Tank | Armoured enemies |
| 13+ | All types (including Healer) | Full roster |
| Every 5th | Boss wave modifier | Double HP multiplier, +50 % reward |

#### Exports

`generateWave`, `getSpawnQueue`, `getPreview`.

---

### 6.8 `modules/renderer.js` — Canvas Drawing

Handles all canvas rendering. Called once per frame with the current game state.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `draw(ctx, state)` | `ctx: CanvasRenderingContext2D, state: GameState` | `void` | Master draw: clears canvas, calls all sub-draw functions in order. |
| `drawGrid(ctx, grid)` | `ctx: CanvasRenderingContext2D, grid: Array<Array<Cell>>` | `void` | Draws ground tiles (olive) and path tiles (sandy brown) with subtle borders. |
| `drawPath(ctx, waypoints)` | `ctx: CanvasRenderingContext2D, waypoints: Array<{x,y}>` | `void` | Draws a thick line along waypoints for visual clarity (drawn atop grid). |
| `drawTurrets(ctx, turrets)` | `ctx: CanvasRenderingContext2D, turrets: Array<Turret>` | `void` | Draws each turret as a coloured circle with a directional barrel line. |
| `drawEnemies(ctx, enemies)` | `ctx: CanvasRenderingContext2D, enemies: Array<Enemy>` | `void` | Draws each enemy as a coloured circle with an HP bar above. |
| `drawProjectiles(ctx, projectiles)` | `ctx: CanvasRenderingContext2D, projectiles: Array<Projectile>` | `void` | Draws each projectile as a small filled circle. |
| `drawRangeCircle(ctx, turret)` | `ctx: CanvasRenderingContext2D, turret: Turret` | `void` | Draws a translucent circle showing turret range (on hover/select). |
| `drawPlacementPreview(ctx, gridX, gridY, turretType, canPlace)` | `ctx: CanvasRenderingContext2D, gridX: number, gridY: number, turretType: object, canPlace: boolean` | `void` | Ghost turret at cursor position: green tint if valid, red if invalid. Range circle preview. |
| `drawHealthBar(ctx, x, y, currentHp, maxHp, radius)` | `ctx: CanvasRenderingContext2D, x: number, y: number, currentHp: number, maxHp: number, radius: number` | `void` | Small bar above enemy: green-to-red gradient based on HP percentage. |
| `drawSplashEffect(ctx, x, y, radius)` | `ctx: CanvasRenderingContext2D, x: number, y: number, radius: number` | `void` | Brief expanding circle effect on cannon hit. |
| `drawFreezeAura(ctx, turret)` | `ctx: CanvasRenderingContext2D, turret: Turret` | `void` | Pulsing translucent blue circle for active freeze towers. |
| `drawGameOver(ctx, waveNumber, score)` | `ctx: CanvasRenderingContext2D, waveNumber: number, score: number` | `void` | Dark overlay with "Game Over" text rendered on canvas (backup for DOM overlay). |

#### Draw Order

1. `drawGrid` — base terrain
2. `drawPath` — path highlight
3. `drawFreezeAura` — freeze tower AOE visual (below turrets)
4. `drawTurrets` — turrets on top of terrain
5. `drawEnemies` — enemies with HP bars
6. `drawProjectiles` — projectiles on top
7. `drawRangeCircle` — selected/hovered turret range
8. `drawPlacementPreview` — ghost turret at cursor (if building)

#### Exports

All functions above.

---

### 6.9 `modules/ui.js` — DOM Interface & Event Binding

Manages all sidebar, HUD, and overlay interactions. Bridges user input to `game.js`.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init(canvas)` | `canvas: HTMLCanvasElement` | `void` | Binds all DOM event listeners: canvas click, canvas mousemove, build buttons, start wave, upgrade, sell, restart. Populates build menu. |
| `populateBuildMenu(turretTypes)` | `turretTypes: object` | `void` | Creates a `<button>` for each turret type in `#build-menu` using `textContent` (no innerHTML). |
| `updateHUD(state)` | `state: GameState` | `void` | Sets `textContent` of `#hud-lives`, `#hud-gold`, `#hud-wave`, `#hud-score`. |
| `updateBuildMenu(gold)` | `gold: number` | `void` | Adds/removes `build-btn--unaffordable` class based on current gold. |
| `showUpgradePanel(turret)` | `turret: Turret` | `void` | Populates upgrade panel with turret name, level, stats, and upgrade/sell costs. Removes `hidden`. |
| `hideUpgradePanel()` | — | `void` | Sets `hidden` on upgrade panel. |
| `showWavePreview(preview)` | `preview: Array<{name, count}>` | `void` | Populates `#wave-preview` list with upcoming enemy counts. |
| `showWaveAnnouncement(waveNumber)` | `waveNumber: number` | `void` | Sets announcement text, removes `hidden`, re-triggers CSS animation. Hides after 2 s via `setTimeout`. |
| `showGameOver(waveNumber, score)` | `waveNumber: number, score: number` | `void` | Populates and shows `#gameover-overlay`. |
| `hideGameOver()` | — | `void` | Hides overlay on restart. |
| `getCanvasMousePos(event, canvas)` | `event: MouseEvent, canvas: HTMLCanvasElement` | `{x, y}` | Converts mouse event to canvas-relative pixel coordinates, accounting for CSS scaling. |
| `bindTooltips()` | — | `void` | Adds `title` attributes to build buttons with turret stat summaries for native tooltips. |

#### Canvas Event Flow

1. **`mousemove`** on canvas → Converts to grid coords → If a turret type is selected, stores hover position for placement preview rendering.
2. **`click`** on canvas →
   - If a turret type is selected: attempts `game.placeTurret(gridX, gridY)`.
   - If no turret type selected: checks if click is on an existing turret → calls `game.selectPlacedTurret(turret)`.
   - If click is on empty ground with no selection: calls `game.selectPlacedTurret(null)` to deselect.
3. **`click`** on build button → calls `game.selectTurretType(type)`.
4. **`click`** on Start Wave → calls `game.startWave()`.
5. **`click`** on Upgrade → calls `game.upgradeTurret(selectedTurret)`.
6. **`click`** on Sell → calls `game.sellTurret(selectedTurret)`.
7. **`click`** on Restart → calls `game.restart()`.

#### Exports

All functions above.

---

## 7. Game Mechanics

### 7.1 Turret Targeting Algorithms

Each turret has a `targeting` mode that determines which enemy it shoots at when multiple are in range.

#### `first` (Arrow Tower, Cannon)

1. Filter `enemies` to those within `turret.range` and `alive === true`.
2. For each enemy, calculate a **path progress** score: `enemy.waypointIndex + (1 - distToNextWaypoint / segmentLength)`.
3. Select the enemy with the **highest** path progress (closest to the exit).

#### `closest` (Freeze Tower)

1. Filter enemies in range.
2. Calculate Euclidean distance from turret centre to each enemy.
3. Select the enemy with the **smallest** distance.

#### `strongest` (Sniper)

1. Filter enemies in range.
2. Select the enemy with the **highest** `enemy.hp`.

### 7.2 Projectile Physics

- Projectiles are **homing**: each frame they recalculate direction toward the target's current position.
- Speed is constant (defined per turret type).
- Hit detection: if `distance(proj, target) <= proj.radius + target.radius`, impact occurs.
- If the target dies before impact, the projectile deactivates (disappears).
- Freeze towers do **not** fire projectiles; instead they apply a slow effect to all enemies within range on each fire tick.

### 7.3 Wave Difficulty Formula

```javascript
/**
 * @param {number} wave - Current wave number (1-indexed)
 * @returns {{ baseCount: number, hpMult: number, spdMult: number, interval: number }}
 */
function getDifficultyParams(wave) {
  return {
    baseCount:  4 + Math.floor(wave * 1.5),
    hpMult:     1 + (wave - 1) * 0.12,
    spdMult:    Math.min(1.5, 1 + (wave - 1) * 0.02),
    interval:   Math.max(0.3, 1.0 - wave * 0.03),
  };
}
```

- **Enemy count** grows linearly with a ×1.5 multiplier.
- **HP** scales by 12 % per wave (compound).
- **Speed** scales gently, capped at ×1.5 base speed.
- **Spawn interval** shrinks, floored at 0.3 s to prevent instant floods.

### 7.4 Currency Economy

| Event | Gold Change |
|---|---|
| Game start | +200 |
| Kill Scout | +10 |
| Kill Soldier | +20 |
| Kill Runner | +15 |
| Kill Healer | +30 |
| Kill Tank | +40 |
| Wave completion bonus | +20 + (waveNumber × 5) |
| Place Arrow Tower | −50 |
| Place Cannon | −100 |
| Place Sniper | −150 |
| Place Freeze Tower | −120 |
| Upgrade (varies) | −(upgrade tier cost) |
| Sell turret | +50 % of total invested |

#### Economy Balance Notes

- Early waves provide low income; players must choose between one strong turret or two weak ones.
- Wave completion bonus scales to keep economy viable in later waves.
- Sell refund at 50 % discourages spam-placement but allows recovery from mistakes.

---

## 8. Turret Types Table

### Base Stats

| Turret | Cost | Damage | Range (px) | Fire Rate (s) | Projectile Speed (px/s) | Targeting | Special |
|---|---|---|---|---|---|---|---|
| Arrow Tower | 50 | 10 | 120 | 0.50 | 300 | First | — |
| Cannon | 100 | 40 | 90 | 1.50 | 200 | First | 50 px splash |
| Sniper | 150 | 80 | 220 | 2.50 | 600 | Strongest | — |
| Freeze Tower | 120 | 0 | 100 | 1.00 | — (AOE) | Closest | 0.4× slow, 2 s |

### Upgrade Tiers — Arrow Tower

| Level | Upgrade Cost | Total Invested | Damage | Range | Fire Rate |
|---|---|---|---|---|---|
| 0 (base) | — | 50 | 10 | 120 | 0.50 |
| 1 | 40 | 90 | 15 | 130 | 0.45 |
| 2 | 80 | 170 | 22 | 145 | 0.38 |
| 3 (max) | 150 | 320 | 32 | 160 | 0.30 |

### Upgrade Tiers — Cannon

| Level | Upgrade Cost | Total Invested | Damage | Range | Fire Rate | Splash |
|---|---|---|---|---|---|---|
| 0 (base) | — | 100 | 40 | 90 | 1.50 | 50 |
| 1 | 75 | 175 | 55 | 100 | 1.30 | 60 |
| 2 | 140 | 315 | 75 | 110 | 1.10 | 70 |
| 3 (max) | 250 | 565 | 100 | 125 | 0.90 | 85 |

### Upgrade Tiers — Sniper

| Level | Upgrade Cost | Total Invested | Damage | Range | Fire Rate |
|---|---|---|---|---|---|
| 0 (base) | — | 150 | 80 | 220 | 2.50 |
| 1 | 100 | 250 | 110 | 240 | 2.20 |
| 2 | 180 | 430 | 150 | 260 | 1.90 |
| 3 (max) | 300 | 730 | 200 | 290 | 1.50 |

### Upgrade Tiers — Freeze Tower

| Level | Upgrade Cost | Total Invested | Range | Slow Factor | Slow Duration |
|---|---|---|---|---|---|
| 0 (base) | — | 120 | 100 | 0.40 | 2.0 s |
| 1 | 80 | 200 | 115 | 0.35 | 2.5 s |
| 2 | 150 | 350 | 130 | 0.28 | 3.0 s |
| 3 (max) | 250 | 600 | 150 | 0.20 | 3.5 s |

---

## 9. Enemy Types Table

| Enemy | HP | Speed (px/s) | Reward | Colour | Radius | Ability | Description |
|---|---|---|---|---|---|---|---|
| Scout | 60 | 100 | 10 | `#E67E22` | 8 | — | Fast, weak. Appears in all waves. Cannon fodder. |
| Soldier | 120 | 70 | 20 | `#E74C3C` | 10 | — | Balanced stats. Standard threat. |
| Runner | 40 | 150 | 15 | `#F39C12` | 7 | `fast` | Very fast, very fragile. Overwhelms with numbers. |
| Tank | 300 | 40 | 40 | `#8E44AD` | 14 | `armoured` | Slow, massive HP. Takes reduced splash damage (25 % instead of 50 %). |
| Healer | 80 | 60 | 30 | `#27AE60` | 10 | `heal` | Heals nearby allies for 10 HP/s within 80 px. Priority target. |

### Ability Details

| Ability | Effect |
|---|---|
| `fast` | No mechanical difference — speed is simply higher. Visual: spark trail. |
| `armoured` | Splash damage reduced to 25 % instead of 50 %. Direct hits unaffected. |
| `heal` | Every frame, restores `10 * dt` HP to each ally within 80 px (not self). Visual: green pulse ring. |

---

## 10. Wave Progression

### Waves 1–20 Example

| Wave | Enemy Composition | HP Mult | Speed Mult | Spawn Interval | Reward Bonus |
|---|---|---|---|---|---|
| 1 | 6× Scout | 1.00 | 1.00 | 1.00 s | 25 g |
| 2 | 7× Scout | 1.12 | 1.02 | 0.94 s | 30 g |
| 3 | 8× Scout | 1.24 | 1.04 | 0.91 s | 35 g |
| 4 | 5× Scout, 3× Soldier | 1.36 | 1.06 | 0.88 s | 40 g |
| 5 | 6× Scout, 4× Soldier | 2.96 | 1.08 | 0.85 s | 45 g (**Boss**)  |
| 6 | 6× Scout, 4× Soldier | 1.60 | 1.10 | 0.82 s | 50 g |
| 7 | 5× Scout, 3× Soldier, 4× Runner | 1.72 | 1.12 | 0.79 s | 55 g |
| 8 | 6× Scout, 4× Soldier, 5× Runner | 1.84 | 1.14 | 0.76 s | 60 g |
| 9 | 4× Scout, 4× Soldier, 6× Runner | 1.96 | 1.16 | 0.73 s | 65 g |
| 10 | 5× Scout, 3× Soldier, 4× Runner, 2× Tank | 4.16 | 1.18 | 0.70 s | 70 g (**Boss**) |
| 11 | 5× Scout, 4× Soldier, 4× Runner, 2× Tank | 2.20 | 1.20 | 0.67 s | 75 g |
| 12 | 6× Scout, 4× Soldier, 5× Runner, 3× Tank | 2.32 | 1.22 | 0.64 s | 80 g |
| 13 | 5× Scout, 3× Soldier, 4× Runner, 2× Tank, 2× Healer | 2.44 | 1.24 | 0.61 s | 85 g |
| 14 | 6× Scout, 4× Soldier, 5× Runner, 3× Tank, 2× Healer | 2.56 | 1.26 | 0.58 s | 90 g |
| 15 | 7× Scout, 5× Soldier, 6× Runner, 3× Tank, 3× Healer | 5.36 | 1.28 | 0.55 s | 95 g (**Boss**) |
| 16 | 7× Scout, 5× Soldier, 5× Runner, 3× Tank, 3× Healer | 2.80 | 1.30 | 0.52 s | 100 g |
| 17 | 8× Scout, 5× Soldier, 6× Runner, 4× Tank, 3× Healer | 2.92 | 1.32 | 0.49 s | 105 g |
| 18 | 8× Scout, 6× Soldier, 7× Runner, 4× Tank, 3× Healer | 3.04 | 1.34 | 0.46 s | 110 g |
| 19 | 9× Scout, 6× Soldier, 7× Runner, 4× Tank, 4× Healer | 3.16 | 1.36 | 0.43 s | 115 g |
| 20 | 10× Scout, 7× Soldier, 8× Runner, 5× Tank, 4× Healer | 6.56 | 1.38 | 0.40 s | 120 g (**Boss**) |

### Boss Wave Rules (every 5th wave)

- HP multiplier is **doubled** compared to normal formula.
- Enemy reward is increased by **50 %**.
- Wave completion bonus is **doubled**.
- Visual: wave announcement text turns red, reads "BOSS WAVE 5".

### Post-Wave 20

- Composition continues to add enemies from all types.
- HP and speed multipliers keep scaling by the same formula.
- Spawn interval floors at **0.3 s**.
- The game is endless — difficulty grows until the player loses.

---

## 11. Accessibility

### Keyboard Controls

| Key | Action |
|---|---|
| `1` – `4` | Select turret type (Arrow, Cannon, Sniper, Freeze) |
| `Escape` | Deselect turret type or close upgrade panel |
| `Arrow keys` | Move grid cursor (highlighted cell) |
| `Enter` / `Space` | Place turret at cursor position or select turret at cursor |
| `U` | Upgrade selected turret |
| `S` | Sell selected turret |
| `W` | Start next wave |
| `Tab` | Cycle focus through sidebar panels |

### ARIA & Semantic Features

- Build menu uses `role="radiogroup"` with `aria-checked` on buttons.
- Upgrade panel uses `aria-label` and descriptive stat labels.
- Wave announcement uses `aria-live="polite"` so screen readers announce new waves.
- Game-over overlay uses `role="dialog"` and `aria-modal="true"` with focus trap.
- All HUD values have associated `<span>` labels read by assistive technology.
- Canvas has `aria-label="Game map"` — canvas content is not accessible, but all interactive controls are in DOM.

### Visual Accessibility

- Turret and enemy colours chosen with sufficient contrast against the map.
- HP bars use both colour (green → red) and bar width (proportional).
- Range circles use translucent fill, not just outlines, for visibility.
- Placement validity uses both colour (green / red) and pattern (solid / dashed border).
- Font sizes meet WCAG minimum (12 px body, 14 px interactive).

### Tooltips

- Each build button has a `title` attribute with turret stats: "Arrow Tower — 10 dmg, 120 range, 0.5s rate — 50g".
- Upgrade button shows the stat changes: "Upgrade to Lv.2 — +5 dmg, +10 range — 80g".
- Sell button shows refund: "Sell for 45g".

---

## 12. Step-by-Step Build Order

### Phase 1 — Project Skeleton

1. Create `index.html` with full HTML structure (section 4).
2. Create `styles/main.css` with CSS variables, layout, HUD, sidebar, and button styles (section 5).
3. Create empty module files: `js/main.js`, `js/modules/game.js`, `map.js`, `enemies.js`, `turrets.js`, `projectiles.js`, `waves.js`, `renderer.js`, `ui.js`.
4. Verify the page loads and displays the HUD + sidebar + canvas placeholder.

### Phase 2 — Map & Rendering Foundation

5. Implement `map.js`: grid creation, waypoints array, `canPlace`, `pixelToGrid`, `gridToPixel`.
6. Implement `renderer.js`: `drawGrid` and `drawPath`.
7. Wire `main.js` to initialise the canvas, call `map.init()`, and render the grid in a basic `requestAnimationFrame` loop.
8. Confirm: coloured grid with a visible path renders on the canvas.

### Phase 3 — Turret Placement

9. Implement `turrets.js`: `createTurret`, `getTurretTypes`.
10. Implement `ui.js`: `populateBuildMenu`, canvas `mousemove` for placement preview, canvas `click` for placement.
11. Implement `renderer.js`: `drawPlacementPreview`, `drawTurrets`, `drawRangeCircle`.
12. Implement `game.js`: `placeTurret`, `selectTurretType`, gold deduction.
13. Confirm: player can select turret from sidebar, see ghost, click to place, see gold decrease.

### Phase 4 — Enemies & Pathfinding

14. Implement `enemies.js`: `createEnemy`, `updateEnemy` (path following).
15. Implement `renderer.js`: `drawEnemies`, `drawHealthBar`.
16. Test by manually spawning a few enemies and watching them walk the path.
17. Implement life-loss when enemy exits (call `game.loseLife`).

### Phase 5 — Turret Combat

18. Implement `turrets.js`: `findTarget`, `fire`, `updateTurret` (cooldown and shooting).
19. Implement `projectiles.js`: `createProjectile`, `updateProjectile`, `checkHit`, `applyHit`.
20. Implement `renderer.js`: `drawProjectiles`.
21. Implement `enemies.js`: `damageEnemy` (HP reduction, death, gold award).
22. Confirm: placed turrets auto-fire at passing enemies, enemies take damage and die.

### Phase 6 — Wave System

23. Implement `waves.js`: `generateWave`, `getSpawnQueue`, `getPreview`.
24. Implement `game.js`: wave spawn queue processing (spawn enemies at intervals during combat phase).
25. Implement `ui.js`: Start Wave button, wave preview panel, wave announcement.
26. Implement `game.js`: wave completion detection (all enemies dead or exited), transition back to prep phase.
27. Confirm: full wave flow — prep → announcement → combat → enemies spawn → combat ends → next prep.

### Phase 7 — Upgrades & Selling

28. Implement `turrets.js`: `upgradeTurret`, `getSellValue`, `getUpgradeCost`, `getUpgradePreview`.
29. Implement `ui.js`: click-on-turret to show upgrade panel, upgrade and sell button handlers.
30. Implement `game.js`: `upgradeTurret`, `sellTurret`.
31. Confirm: clicking a turret shows its stats, upgrading increases stats and costs gold, selling refunds gold and removes turret.

### Phase 8 — Special Mechanics

32. Implement Freeze Tower AOE slow (`slowEnemy` in `enemies.js`, fire logic in `turrets.js`).
33. Implement Cannon splash damage (`applyHit` with splash in `projectiles.js`).
34. Implement Sniper `strongest` targeting.
35. Implement Tank `armoured` ability (reduced splash damage).
36. Implement Healer `heal` ability (`healNearby` in `enemies.js`).
37. Implement `renderer.js`: `drawFreezeAura`, `drawSplashEffect`, healer pulse.

### Phase 9 — HUD, Score & Game Over

38. Implement `ui.js`: `updateHUD` called every frame.
39. Implement `game.js`: score tracking, wave completion bonus.
40. Implement `game.js`: `gameOver` trigger, `restart`.
41. Implement `ui.js`: `showGameOver`, `hideGameOver` with DOM overlay.
42. Confirm: full game loop from wave 1 to game over, restart works.

### Phase 10 — Polish & Accessibility

43. Add keyboard controls (section 11).
44. Add `title` tooltips to all interactive elements.
45. Add ARIA attributes to dynamic elements.
46. Add CSS transitions and animations (slide-in upgrade panel, wave announcement).
47. Add affordable/unaffordable styling updates to build menu per frame.
48. Responsive testing — verify layout at 1100 px breakpoint.
49. Performance profiling — ensure 60 FPS with 30+ enemies and 10+ turrets.

### Phase 11 — Final Testing

50. Play-test waves 1–20: verify difficulty curve is challenging but beatable.
51. Test edge cases: placing turret with exact gold, selling last turret, all lives lost mid-wave.
52. Test rapid clicking: double-place prevention, double-upgrade prevention.
53. Verify no memory leaks (enemy/projectile arrays cleaned up).
54. Validate HTML, CSS, and JS lint-clean.

---

## 13. Stretch Goals

### 13.1 Special Abilities (Active Skills)

Give the player 1–2 cooldown-based abilities activated by hotkey:

| Ability | Hotkey | Cooldown | Effect |
|---|---|---|---|
| **Air Strike** | `Q` | 30 s | Click an area; deals 200 damage to all enemies within 80 px after 1 s delay. |
| **Gold Rush** | `E` | 45 s | All enemy kills award double gold for 10 s. |

### 13.2 Maze-Building Mode

- Remove the fixed path. Instead, enemies pathfind from entrance to exit using **A\* algorithm**.
- Turrets placed on ground tiles become obstacles.
- Enemies recalculate their path whenever a turret is placed or sold.
- Placement is blocked if it would completely wall off the path (ensure at least one valid route exists).
- This turns the game into a maze-builder where players create winding corridors to maximise turret exposure.

### 13.3 Boss Enemies

Introduce a single boss enemy every 10th wave with unique mechanics:

| Boss | HP | Speed | Ability |
|---|---|---|---|
| **Juggernaut** (wave 10) | 3000 | 25 | Immune to slow effects. |
| **Phantom** (wave 20) | 1500 | 90 | Turns invisible for 3 s every 5 s (untargetable). |
| **Warlord** (wave 30) | 5000 | 30 | Spawns 3 Scouts every 5 s while alive. |

Boss enemies have a larger render radius, a unique colour, and a thicker HP bar.

### 13.4 Turret Specialisation

At max level (3), offer the player a choice between two specialisation paths:

| Turret | Path A | Path B |
|---|---|---|
| Arrow Tower | **Multishot** — fires 3 arrows per shot | **Poison** — adds 5 DPS for 3 s |
| Cannon | **Napalm** — leaves fire zone for 4 s | **Shrapnel** — splash radius doubled |
| Sniper | **Piercing** — shot hits 2 enemies | **Execute** — instant kill below 15 % HP |
| Freeze Tower | **Blizzard** — range ×2 for 3 s burst | **Permafrost** — slow lingers 5 s |

### 13.5 Save & Load

- Serialise game state to `localStorage` as JSON.
- Auto-save between waves.
- "Continue" button on page load if save data exists.

### 13.6 Sound Effects

- Use the Web Audio API to play short generated tones (no audio files needed):
  - Turret fire: short blip pitched by turret type.
  - Enemy death: low thud.
  - Wave start: ascending tone.
  - Game over: descending tone.
- Master volume slider in sidebar.

### 13.7 Minimap & Speed Controls

- **Minimap**: small canvas in the sidebar showing a zoomed-out view of the full map with enemy dots.
- **Speed controls**: ×1, ×2, ×3 game speed buttons that multiply `deltaTime`.

### 13.8 Leaderboard

- Store top 10 scores in `localStorage` with wave number and date.
- Display a scrollable leaderboard on the game-over screen.
