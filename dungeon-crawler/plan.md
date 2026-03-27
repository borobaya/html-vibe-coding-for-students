# Dungeon Crawler — Implementation Plan

## 1. Overview

A grid-based dungeon exploration game built entirely with vanilla HTML5, CSS3, and JavaScript (ES2022+, ES modules). The player controls a lone adventurer navigating procedurally generated dungeon floors rendered as a tile grid using CSS Grid. Each floor is composed of rooms connected by corridors, scattered with enemies, treasure chests, potions, and a staircase leading to the next level. Combat is turn-based: walking into an enemy initiates a combat overlay where the player chooses to Attack, Defend, or Flee each turn. Defeated enemies drop loot — weapons, armour, and consumables — managed through an inventory panel. A fog-of-war system hides unexplored tiles, revealing them as the player moves through the dungeon. Difficulty scales with each floor: enemies gain more health, deal more damage, and bosses appear at milestone floors. The game tracks player stats (HP, MP, attack, defence, speed, level, XP) and persists the current run via `localStorage` for save/load functionality. No frameworks, no build tools, no external dependencies — all paths are relative.

### Core Gameplay Loop (Step by Step)

1. **New Game** — The player starts on Floor 1 with base stats as a Level 1 adventurer and an empty inventory (one starter weapon equipped).
2. **Dungeon Generation** — A new floor map is procedurally generated with rooms, corridors, walls, enemy placements, chest placements, potion pickups, and a staircase tile.
3. **Exploration** — The player moves tile-by-tile using WASD or arrow keys. Each movement constitutes one turn. Fog of war lifts in a radius around the player, revealing tiles and their contents.
4. **Enemy Encounter** — Moving onto an enemy tile triggers turn-based combat. The combat overlay appears with the enemy's name, HP bar, and action buttons.
5. **Combat Resolution** — The player and enemy alternate turns. The player picks Attack, Defend, or Flee. Damage is calculated from stats, equipment bonuses, and RNG. Combat ends when the enemy's HP reaches 0 (victory), the player's HP reaches 0 (game over), or the player successfully flees.
6. **Loot Collection** — Defeated enemies drop items from a loot table. Treasure chests (interacted with via `E` key) also contain loot. Items go into the inventory.
7. **Inventory Management** — The player opens the inventory (`I` key) to equip weapons/armour, use consumables (potions), or discard unwanted items. Equipped gear modifies player stats.
8. **Floor Descent** — Reaching the staircase tile and pressing `E` generates the next floor. Floor number increments, enemy difficulty scales, and better loot becomes available.
9. **Death / Game Over** — When HP reaches 0, a game-over overlay shows the run summary (floors cleared, enemies defeated, items collected). The player can start a new run.
10. **Save / Load** — The game auto-saves to `localStorage` after each floor descent. The player can resume a saved run from the title screen.

### Target Audience

Students and hobbyist developers learning game development with vanilla web technologies. Players who enjoy roguelike mechanics, turn-based strategy, and retro dungeon-crawling aesthetics.

---

## 2. Page Layout

### ASCII Wireframe

```text
┌──────────────────────────────────────────────────────────────────────┐
│  TITLE BAR                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  ⚔ DUNGEON CRAWLER              Floor: 3    Score: 1240        │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────┬───────────────────────────┤
│                                           │  PLAYER HUD (right)      │
│   DUNGEON MAP GRID                        │  ┌─────────────────────┐ │
│   (CSS Grid, 20×15 visible tiles)         │  │ ♦ Adventurer  Lv.5  │ │
│                                           │  │                     │ │
│   ┌───┬───┬───┬───┬───┬───┬───┐          │  │ HP ████████░░ 64/80 │ │
│   │   │   │ ░ │ ░ │ ░ │   │   │          │  │ MP ████░░░░░░ 20/50 │ │
│   ├───┼───┼───┼───┼───┼───┼───┤          │  │ XP ██████░░░░ 60%   │ │
│   │   │ ░ │ . │ . │ . │ ░ │   │          │  │                     │ │
│   ├───┼───┼───┼───┼───┼───┼───┤          │  │ ATK: 12  DEF: 8     │ │
│   │ ░ │ . │ . │ @ │ . │ . │ ░ │          │  │ SPD: 6   LVL: 5     │ │
│   ├───┼───┼───┼───┼───┼───┼───┤          │  │                     │ │
│   │   │ ░ │ . │ . │ S │ ░ │   │          │  │ ⚔ Iron Sword (+4)   │ │
│   ├───┼───┼───┼───┼───┼───┼───┤          │  │ 🛡 Leather Armour(+3)│ │
│   │   │   │ ░ │ ░ │ ░ │   │   │          │  └─────────────────────┘ │
│   └───┴───┴───┴───┴───┴───┴───┘          │                          │
│                                           │  MINIMAP                 │
│  Legend:                                  │  ┌──────────┐            │
│  @ = Player   S = Skeleton                │  │ ▪▪▪░░░░░ │            │
│  . = Floor    ░ = Fog     # = Wall        │  │ ▪▪▪▪░░░░ │            │
│  ≡ = Stairs   T = Chest   P = Potion      │  │ ▪▪@▪░░░░ │            │
│                                           │  │ ░░░░░░░░ │            │
│                                           │  └──────────┘            │
├───────────────────────────────────────────┴───────────────────────────┤
│  COMBAT LOG / MESSAGE FEED (bottom panel, scrollable)                │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ > You entered Floor 3.                                         │ │
│  │ > A Skeleton lurks nearby...                                   │ │
│  │ > You picked up a Health Potion.                               │ │
│  │ > You attacked the Goblin for 12 damage!                       │ │
│  │ > The Goblin strikes back for 6 damage.                        │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

COMBAT OVERLAY (centred, appears over the map when combat starts):
┌─────────────────────────────────────────┐
│            ⚔ COMBAT ⚔                  │
│                                         │
│   Skeleton  (Floor 3)                   │
│   HP ████████░░░░ 18/30                 │
│                                         │
│   ─────────────────────                 │
│                                         │
│   Adventurer                            │
│   HP ████████████░░ 64/80               │
│                                         │
│   [ 1: Attack ]  [ 2: Defend ]  [ 3: Flee ] │
│                                         │
│   > You slash the Skeleton for 12 dmg!  │
│   > The Skeleton retaliates for 5 dmg.  │
└─────────────────────────────────────────┘

INVENTORY OVERLAY (centred, toggled with `I` key):
┌─────────────────────────────────────────┐
│           🎒 INVENTORY                  │
│                                         │
│  Equipment:                             │
│  ┌──────────┐ ┌──────────┐             │
│  │ Weapon:  │ │ Armour:  │             │
│  │ Iron Sword│ │ Leather  │             │
│  │ ATK +4   │ │ DEF +3   │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  Items:                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ HP │ │ HP │ │ MP │ │ 🗡 │          │
│  │Pot.│ │Pot.│ │Pot.│ │Dggr│          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                         │
│  [Use]  [Equip]  [Discard]  [Close]    │
└─────────────────────────────────────────┘

TITLE SCREEN OVERLAY (shown on first load):
┌─────────────────────────────────────────┐
│                                         │
│        ⚔ DUNGEON CRAWLER ⚔             │
│                                         │
│        [ New Game ]                     │
│        [ Continue ]  (if save exists)   │
│        [ Controls ]                     │
│                                         │
│        Best Run: Floor 7                │
│                                         │
└─────────────────────────────────────────┘

GAME OVER OVERLAY:
┌─────────────────────────────────────────┐
│                                         │
│          ☠ GAME OVER ☠                  │
│                                         │
│   You perished on Floor 3.              │
│   Enemies defeated: 14                  │
│   Items collected: 9                    │
│   Final level: 5                        │
│   Score: 1240                           │
│                                         │
│        [ Try Again ]                    │
│                                         │
└─────────────────────────────────────────┘
```

### UI Section Descriptions

| Section | Description |
|---|---|
| **Title Bar** | Fixed top bar showing the game title, current floor number, and accumulated score. Always visible during gameplay. |
| **Dungeon Map Grid** | The main play area. A CSS Grid of visible tiles (20 columns × 15 rows). Each tile is a `<div>` with a class indicating its type (wall, floor, fog, player, enemy, chest, stairs, potion). The viewport scrolls/centers on the player when the map is larger than the visible grid. |
| **Player HUD** | Right-side panel showing the player's name, level, HP/MP/XP bars (as coloured `<div>` progress bars), core stats (ATK, DEF, SPD), and currently equipped weapon and armour. Updates reactively on stat changes. |
| **Minimap** | A small grid below the HUD showing the full floor layout at a reduced scale. Explored tiles are shown as filled squares, fog tiles as empty. The player's position is highlighted. |
| **Combat Log** | A scrollable bottom panel displaying gameplay messages — movement narration, combat results, loot pickups, level-ups. New messages append at the bottom and the panel auto-scrolls. Limited to the last 50 messages. |
| **Combat Overlay** | A modal-style centred panel that appears when combat begins. Shows the enemy's name, floor, HP bar, the player's HP bar, three action buttons (Attack, Defend, Flee), and a combat-specific message feed. Dismisses on combat end. |
| **Inventory Overlay** | A modal toggled by `I`. Displays two equipment slots (weapon, armour) and a scrollable grid of inventory items (max 16 slots). Each item shows an icon and name. Action buttons at the bottom: Use, Equip, Discard, Close. |
| **Title Screen Overlay** | Shown on initial load. Contains the game logo, New Game and Continue buttons (Continue only if a `localStorage` save exists), a Controls help section, and the best run record. |
| **Game Over Overlay** | Appears when the player dies. Shows run statistics (floor reached, enemies killed, items collected, final level, score) and a Try Again button. |

### Responsive Behaviour

- **Desktop (≥ 1024px):** Full layout — map grid (left, ~65% width), HUD + minimap sidebar (right, ~35% width), combat log below. Tile size: 40px.
- **Tablet (768px–1023px):** HUD collapses to a horizontal bar above the map. Minimap hidden. Tile size: 32px. Combat log shrinks to 3 lines.
- **Mobile (< 768px):** Map fills the viewport width. Tile size: 24px (minimum). HUD becomes a compact top strip (HP bar + floor only). Combat log toggleable. On-screen directional pad overlay for touch controls. Inventory and combat overlays go full-screen.

---

## 3. Colour Scheme & Typography

### Colour Palette — Dark Fantasy

| Purpose | Colour Name | Hex | Usage |
|---|---|---|---|
| Page background | Abyss Black | `#0d0d0d` | `body` and outer wrappers |
| Panel background | Dungeon Grey | `#1a1a1a` | HUD, combat log, overlays |
| Panel border | Stone Grey | `#333333` | Borders around panels and UI sections |
| Wall tile | Dark Stone | `#2a2a2a` | Wall tiles on the map grid |
| Floor tile | Cavern Brown | `#3d2e1f` | Walkable floor tiles |
| Fog of war | Void Black | `#0a0a0a` | Unexplored / hidden tiles |
| Fog edge | Shadow Grey | `#1a1510` | Partially revealed fog (dim adjacent tiles) |
| Player | Hero Gold | `#f5c842` | Player character tile |
| Enemy (common) | Blood Red | `#cc3333` | Common enemy tiles (Slime, Goblin) |
| Enemy (elite) | Crimson | `#991111` | Elite/boss enemy tiles |
| Health bar fill | Vitality Red | `#e63946` | HP bar filled portion |
| Health bar BG | Dried Blood | `#4a1a1a` | HP bar background track |
| Mana bar fill | Arcane Blue | `#4a90d9` | MP bar filled portion |
| Mana bar BG | Deep Blue | `#1a2a4a` | MP bar background track |
| XP bar fill | Mystic Purple | `#9b59b6` | XP bar filled portion |
| XP bar BG | Dark Purple | `#2d1a3d` | XP bar background track |
| Stairs tile | Exit Cyan | `#00cec9` | Staircase leading to next floor |
| Chest tile | Treasure Gold | `#f9ca24` | Unopened treasure chest |
| Chest (opened) | Dull Bronze | `#8a7340` | Already-opened chest |
| Potion tile | Potion Green | `#55efc4` | Health/mana potion pickup |
| Loot text | Loot Amber | `#fdcb6e` | Item drop messages in combat log |
| Damage text | Hit Red | `#ff6b6b` | Damage numbers in combat log |
| Heal text | Heal Green | `#00b894` | Healing messages in combat log |
| Level-up text | XP Gold | `#ffeaa7` | Level-up messages |
| Button default BG | Button Dark | `#2d2d2d` | Action buttons background |
| Button default text | Button Light | `#e0e0e0` | Action buttons text |
| Button hover BG | Button Hover | `#444444` | Button hover state background |
| Button active BG | Action Gold | `#f5c842` | Active/selected button |
| HUD text primary | Parchment | `#e0d5c1` | Main HUD text (names, labels) |
| HUD text secondary | Faded Parchment | `#998e7a` | Secondary info, tooltips |
| Combat overlay BG | Overlay Black | `rgba(0, 0, 0, 0.85)` | Semi-transparent combat backdrop |
| Title text | Title White | `#ffffff` | Game title, headings |
| Grid line | Subtle Border | `#2a231a` | Faint grid lines between tiles |

### CSS Variables

```css
:root {
  /* --- Page & Panels --- */
  --color-bg-page: #0d0d0d;
  --color-bg-panel: #1a1a1a;
  --color-border-panel: #333333;

  /* --- Map Tiles --- */
  --color-tile-wall: #2a2a2a;
  --color-tile-floor: #3d2e1f;
  --color-tile-fog: #0a0a0a;
  --color-tile-fog-edge: #1a1510;
  --color-tile-stairs: #00cec9;
  --color-tile-chest: #f9ca24;
  --color-tile-chest-opened: #8a7340;
  --color-tile-potion: #55efc4;
  --color-tile-grid-line: #2a231a;

  /* --- Characters --- */
  --color-player: #f5c842;
  --color-enemy-common: #cc3333;
  --color-enemy-elite: #991111;

  /* --- Bars --- */
  --color-hp-fill: #e63946;
  --color-hp-track: #4a1a1a;
  --color-mp-fill: #4a90d9;
  --color-mp-track: #1a2a4a;
  --color-xp-fill: #9b59b6;
  --color-xp-track: #2d1a3d;

  /* --- Text --- */
  --color-text-primary: #e0d5c1;
  --color-text-secondary: #998e7a;
  --color-text-title: #ffffff;
  --color-text-damage: #ff6b6b;
  --color-text-heal: #00b894;
  --color-text-loot: #fdcb6e;
  --color-text-levelup: #ffeaa7;

  /* --- Buttons --- */
  --color-btn-bg: #2d2d2d;
  --color-btn-text: #e0e0e0;
  --color-btn-hover: #444444;
  --color-btn-active: #f5c842;

  /* --- Overlay --- */
  --color-overlay-bg: rgba(0, 0, 0, 0.85);

  /* --- Typography --- */
  --font-primary: 'Press Start 2P', monospace;
  --font-body: 'Share Tech Mono', monospace;
  --font-size-title: 1.5rem;
  --font-size-heading: 1rem;
  --font-size-body: 0.75rem;
  --font-size-small: 0.625rem;
  --font-size-hud: 0.6875rem;

  /* --- Spacing --- */
  --tile-size: 40px;
  --grid-cols: 20;
  --grid-rows: 15;
  --gap-sm: 4px;
  --gap-md: 8px;
  --gap-lg: 16px;
  --border-radius: 4px;
}
```

### Typography

| Role | Font | Weight | Size | Source |
|---|---|---|---|---|
| Game title / headings | Press Start 2P | 400 | 1.5rem / 1rem | Google Fonts (link in `<head>`) |
| HUD labels / stats | Share Tech Mono | 400 | 0.6875rem | Google Fonts (link in `<head>`) |
| Body text / combat log | Share Tech Mono | 400 | 0.75rem | Google Fonts (link in `<head>`) |
| Buttons / actions | Press Start 2P | 400 | 0.625rem | Google Fonts (link in `<head>`) |
| Tooltips / secondary | Share Tech Mono | 400 | 0.625rem | Google Fonts (link in `<head>`) |

### Visual Style Description

Dark fantasy pixel-art aesthetic. The dungeon is rendered in earthy browns and greys with high-contrast character and item highlights. Tiles use block colours (no sprite images required — pure CSS or emoji/Unicode symbols). The UI evokes stone-carved dungeon interfaces with subtle borders and parchment-toned text. Bars use saturated colour on near-black tracks. Overlays use heavy transparency to keep the dungeon visible behind combat and inventory panels. All fonts are monospaced for grid alignment and retro consistency.

---

## 4. File Structure

```text
dungeon-crawler/
├── index.html                  # Main HTML page — game shell and UI panels
├── js/
│   ├── main.js                 # Entry point — initialises game, binds events, game loop
│   └── modules/
│       ├── config.js           # Game constants (tile sizes, grid dims, base stats, loot tables)
│       ├── state.js            # Central game state object and state mutation helpers
│       ├── dungeon.js          # Procedural dungeon generation (rooms, corridors, tile placement)
│       ├── player.js           # Player entity — stats, movement, levelling, equipment effects
│       ├── enemies.js          # Enemy definitions, factory, stat scaling, AI behaviour
│       ├── combat.js           # Turn-based combat engine (actions, damage calc, resolution)
│       ├── inventory.js        # Inventory management — add, remove, equip, use, discard items
│       ├── items.js            # Item definitions, loot tables, drop roll logic
│       ├── renderer.js         # DOM rendering — map grid, HUD, minimap, overlays, combat log
│       ├── fog.js              # Fog of war logic — visibility radius, reveal, dim edges
│       ├── input.js            # Keyboard input handler — key bindings, mode-aware dispatch
│       └── storage.js          # localStorage save/load — serialise/deserialise game state
├── styles/
│   └── main.css                # All CSS — layout, tiles, HUD, overlays, animations, responsive
├── assets/
│   └── sprites/                # (Optional) sprite images if desired; game works with CSS-only
├── plan.md                     # This implementation plan
└── README.md                   # Project readme with features, controls, tech stack
```

### File Purposes

| File | Purpose |
|---|---|
| `index.html` | Single-page game shell. Contains all static HTML structure — grid container, HUD, log panel, overlay skeletons. Loads CSS and JS via relative paths. |
| `js/main.js` | Application entry point. Imports all modules, initialises game state, sets up event listeners, manages the title-screen → gameplay → game-over flow. |
| `js/modules/config.js` | Exports constant configuration: grid dimensions, tile size, base player stats, XP curve, enemy stat tables, loot drop tables, floor scaling formulas. No mutable state. |
| `js/modules/state.js` | Exports a reactive game state object. Holds current floor map, player data, enemy list, inventory, turn phase, fog map, message log. Provides getter/setter helpers. |
| `js/modules/dungeon.js` | Procedural map generator. Creates 2D tile arrays with rooms, corridors, walls. Places stairs, enemies, chests, potions. Exports `generateFloor(floorNumber)`. |
| `js/modules/player.js` | Player entity module. Manages HP, MP, XP, level, base stats, equipment bonuses. Exports `createPlayer()`, movement logic, `levelUp()`, `getEffectiveStats()`. |
| `js/modules/enemies.js` | Enemy entity definitions and factory. Each enemy type has base stats, a loot table reference, and AI behaviour (idle, patrol, chase). Exports `spawnEnemy(type, floor)`. |
| `js/modules/combat.js` | Turn-based combat engine. Manages combat state (player turn / enemy turn), processes Attack/Defend/Flee actions, calculates damage, resolves combat end. Exports `startCombat()`, `playerAction()`. |
| `js/modules/inventory.js` | Inventory system. Fixed-size item array (16 slots). Exports `addItem()`, `removeItem()`, `equipItem()`, `useItem()`, `discardItem()`. Handles equipment swap logic. |
| `js/modules/items.js` | Item data and loot generation. Defines all item objects (weapons, armour, potions) with stats. Exports `rollLoot(enemyType, floor)`, `getItemById()`, item type enums. |
| `js/modules/renderer.js` | DOM rendering layer. Reads game state and updates the DOM — redraws map tiles, updates HUD bars/stats, renders minimap, manages overlay visibility, appends combat log messages. |
| `js/modules/fog.js` | Fog of war system. Maintains a 2D visibility array (hidden / dim / visible). Exports `updateFog(playerPos, radius)`, `isTileVisible(x, y)`. |
| `js/modules/input.js` | Input handler. Listens for `keydown` events, maps keys to actions based on current game mode (exploration, combat, inventory, overlay). Exports `initInput()`. |
| `js/modules/storage.js` | Persistence layer. Serialises game state to JSON and saves to `localStorage`. Loads and deserialises on continue. Exports `saveGame()`, `loadGame()`, `hasSave()`, `deleteSave()`. |
| `styles/main.css` | Complete stylesheet. CSS Grid for the dungeon map, Flexbox for panels, CSS variables for theming, tile styling, bar animations, overlay transitions, responsive breakpoints. |

---

## 5. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dungeon Crawler</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <!-- TITLE BAR -->
  <header class="title-bar" role="banner">
    <h1 class="title-bar__name">⚔ Dungeon Crawler</h1>
    <div class="title-bar__info">
      <span id="floor-display" aria-label="Current floor">Floor: 1</span>
      <span id="score-display" aria-label="Current score">Score: 0</span>
    </div>
  </header>

  <!-- MAIN GAME AREA -->
  <main class="game-area" role="main">
    <!-- DUNGEON MAP -->
    <section class="map-container" aria-label="Dungeon map">
      <div id="dungeon-grid" class="dungeon-grid" role="grid" aria-label="Dungeon tile grid">
        <!-- Tiles generated dynamically by renderer.js -->
      </div>
    </section>

    <!-- SIDEBAR: HUD + MINIMAP -->
    <aside class="sidebar" aria-label="Player information">
      <!-- PLAYER HUD -->
      <section class="hud" aria-label="Player stats">
        <h2 class="hud__name" id="player-name">Adventurer</h2>
        <span class="hud__level" id="player-level">Lv. 1</span>

        <!-- HP Bar -->
        <div class="bar bar--hp" role="progressbar" aria-label="Health" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          <div class="bar__fill" id="hp-fill"></div>
          <span class="bar__label" id="hp-label">100/100</span>
        </div>

        <!-- MP Bar -->
        <div class="bar bar--mp" role="progressbar" aria-label="Mana" aria-valuenow="30" aria-valuemin="0" aria-valuemax="30">
          <div class="bar__fill" id="mp-fill"></div>
          <span class="bar__label" id="mp-label">30/30</span>
        </div>

        <!-- XP Bar -->
        <div class="bar bar--xp" role="progressbar" aria-label="Experience" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="bar__fill" id="xp-fill"></div>
          <span class="bar__label" id="xp-label">0/100 XP</span>
        </div>

        <!-- Stats Grid -->
        <div class="hud__stats">
          <span>ATK: <strong id="stat-atk">5</strong></span>
          <span>DEF: <strong id="stat-def">3</strong></span>
          <span>SPD: <strong id="stat-spd">4</strong></span>
        </div>

        <!-- Equipment Display -->
        <div class="hud__equipment">
          <div class="hud__slot">
            <span class="hud__slot-label">Weapon:</span>
            <span id="equipped-weapon">Rusty Dagger</span>
          </div>
          <div class="hud__slot">
            <span class="hud__slot-label">Armour:</span>
            <span id="equipped-armour">None</span>
          </div>
        </div>
      </section>

      <!-- MINIMAP -->
      <section class="minimap-container" aria-label="Minimap">
        <h3 class="minimap__title">Map</h3>
        <div id="minimap" class="minimap" aria-hidden="true">
          <!-- Minimap tiles generated dynamically -->
        </div>
      </section>
    </aside>
  </main>

  <!-- COMBAT LOG -->
  <section class="log-container" aria-label="Combat log" aria-live="polite">
    <ul id="combat-log" class="combat-log" role="log">
      <!-- Messages appended dynamically -->
    </ul>
  </section>

  <!-- TITLE SCREEN OVERLAY -->
  <div id="title-overlay" class="overlay overlay--title" role="dialog" aria-label="Title screen" aria-modal="true">
    <div class="overlay__content">
      <h2 class="overlay__heading">⚔ Dungeon Crawler ⚔</h2>
      <button id="btn-new-game" class="btn btn--primary">New Game</button>
      <button id="btn-continue" class="btn btn--secondary" disabled>Continue</button>
      <button id="btn-controls" class="btn btn--secondary">Controls</button>
      <p id="best-run" class="overlay__subtext">Best Run: —</p>
    </div>
  </div>

  <!-- COMBAT OVERLAY -->
  <div id="combat-overlay" class="overlay overlay--combat" role="dialog" aria-label="Combat" aria-modal="true" hidden>
    <div class="overlay__content">
      <h2 class="overlay__heading">⚔ Combat ⚔</h2>
      <div class="combat__enemy">
        <span id="combat-enemy-name" class="combat__name">Enemy</span>
        <div class="bar bar--enemy-hp" role="progressbar" aria-label="Enemy health">
          <div class="bar__fill" id="enemy-hp-fill"></div>
          <span class="bar__label" id="enemy-hp-label">0/0</span>
        </div>
      </div>
      <div class="combat__player">
        <span class="combat__name">Adventurer</span>
        <div class="bar bar--hp" role="progressbar" aria-label="Your health">
          <div class="bar__fill" id="combat-player-hp-fill"></div>
          <span class="bar__label" id="combat-player-hp-label">0/0</span>
        </div>
      </div>
      <div class="combat__actions">
        <button id="btn-attack" class="btn btn--combat">1: Attack</button>
        <button id="btn-defend" class="btn btn--combat">2: Defend</button>
        <button id="btn-flee" class="btn btn--combat">3: Flee</button>
      </div>
      <ul id="combat-feed" class="combat__feed" role="log" aria-live="assertive">
        <!-- Combat messages appended dynamically -->
      </ul>
    </div>
  </div>

  <!-- INVENTORY OVERLAY -->
  <div id="inventory-overlay" class="overlay overlay--inventory" role="dialog" aria-label="Inventory" aria-modal="true" hidden>
    <div class="overlay__content">
      <h2 class="overlay__heading">🎒 Inventory</h2>
      <div class="inventory__equipment">
        <div class="inventory__slot" id="inv-weapon-slot">
          <span class="inventory__slot-label">Weapon</span>
          <span class="inventory__slot-item" id="inv-weapon-name">Empty</span>
        </div>
        <div class="inventory__slot" id="inv-armour-slot">
          <span class="inventory__slot-label">Armour</span>
          <span class="inventory__slot-item" id="inv-armour-name">Empty</span>
        </div>
      </div>
      <div id="inventory-grid" class="inventory__grid" role="listbox" aria-label="Inventory items">
        <!-- Item slots generated dynamically (16 slots) -->
      </div>
      <div class="inventory__actions">
        <button id="btn-use" class="btn btn--inventory" disabled>Use</button>
        <button id="btn-equip" class="btn btn--inventory" disabled>Equip</button>
        <button id="btn-discard" class="btn btn--inventory" disabled>Discard</button>
        <button id="btn-close-inv" class="btn btn--inventory">Close</button>
      </div>
    </div>
  </div>

  <!-- GAME OVER OVERLAY -->
  <div id="gameover-overlay" class="overlay overlay--gameover" role="dialog" aria-label="Game over" aria-modal="true" hidden>
    <div class="overlay__content">
      <h2 class="overlay__heading">☠ Game Over ☠</h2>
      <p id="go-floor">You perished on Floor 1.</p>
      <p id="go-enemies">Enemies defeated: 0</p>
      <p id="go-items">Items collected: 0</p>
      <p id="go-level">Final level: 1</p>
      <p id="go-score">Score: 0</p>
      <button id="btn-retry" class="btn btn--primary">Try Again</button>
    </div>
  </div>

  <!-- CONTROLS HELP OVERLAY -->
  <div id="controls-overlay" class="overlay overlay--controls" role="dialog" aria-label="Controls help" aria-modal="true" hidden>
    <div class="overlay__content">
      <h2 class="overlay__heading">Controls</h2>
      <table class="controls-table">
        <thead><tr><th>Key</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>W / ↑</td><td>Move up</td></tr>
          <tr><td>A / ←</td><td>Move left</td></tr>
          <tr><td>S / ↓</td><td>Move down</td></tr>
          <tr><td>D / →</td><td>Move right</td></tr>
          <tr><td>I</td><td>Open / close inventory</td></tr>
          <tr><td>E</td><td>Interact (chests, stairs)</td></tr>
          <tr><td>1 / 2 / 3</td><td>Combat actions</td></tr>
          <tr><td>Esc</td><td>Close overlay</td></tr>
        </tbody>
      </table>
      <button id="btn-close-controls" class="btn btn--secondary">Close</button>
    </div>
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Element Details

| Element | Type | Notes |
|---|---|---|
| `<header.title-bar>` | Static | Always visible. Text content updated dynamically for floor/score. |
| `<main.game-area>` | Static container | Flex layout splitting map and sidebar. |
| `<div#dungeon-grid>` | Dynamic | All child tile `<div>` elements created and managed by `renderer.js`. Rebuilt on each floor. |
| `<aside.sidebar>` | Static container | Contains HUD and minimap. Inner text/bars updated dynamically. |
| `<div.bar>` | Semi-static | Shell is static HTML, fill width and label text updated via JS. Uses `role="progressbar"` with ARIA value attributes. |
| `<div#minimap>` | Dynamic | Minimap tile `<div>` elements created by `renderer.js`. |
| `<ul#combat-log>` | Dynamic | `<li>` elements appended by `renderer.js`. Uses `aria-live="polite"` for screen reader announcements. |
| All overlays | Static shell, dynamic content | The overlay `<div>` wrappers are in the HTML with `hidden` attribute toggled by JS. Inner text/buttons wired via event listeners. |
| `<div#inventory-grid>` | Dynamic | 16 inventory slot `<div>` elements generated by `renderer.js` on init. Content updates on inventory changes. |

---

## 6. CSS Architecture

### Layout Approach

- **Page layout:** Flexbox column — title bar (fixed height), main game area (flex-grow), combat log (fixed height).
- **Game area:** Flexbox row — map container (flex-grow) + sidebar (fixed width ~280px).
- **Dungeon grid:** CSS Grid — `grid-template-columns: repeat(var(--grid-cols), var(--tile-size))` and `grid-template-rows: repeat(var(--grid-rows), var(--tile-size))`. Each tile is a grid cell.
- **Minimap:** CSS Grid with much smaller cell size (4px × 4px).
- **Overlays:** Positioned `fixed`, full-viewport, with flexbox-centred content panels.
- **Inventory grid:** CSS Grid — `grid-template-columns: repeat(4, 1fr)` for the 16-slot (4×4) item grid.

### Major CSS Classes / Components

| Class | Description |
|---|---|
| `.title-bar` | Flex row, space-between alignment. Dark background, bottom border. Fixed 48px height. |
| `.game-area` | Flex row container. Takes remaining viewport height. |
| `.map-container` | Flex-grow, overflow hidden. Centres the dungeon grid. Handles scroll when map exceeds viewport. |
| `.dungeon-grid` | CSS Grid. Each cell is `var(--tile-size)` squared. `gap: 1px` for subtle grid lines using `--color-tile-grid-line`. |
| `.tile` | Base tile class. Square, centred content, font for emoji/text symbols. |
| `.tile--wall` | Dark stone colour, no content. |
| `.tile--floor` | Cavern brown, walkable. |
| `.tile--fog` | Void black, completely hidden. |
| `.tile--fog-edge` | Dimmed partial-visibility colour. |
| `.tile--player` | Hero gold background, player symbol centred. Subtle pulse animation. |
| `.tile--enemy` | Blood red background. Enemy symbol centred. |
| `.tile--enemy-elite` | Crimson background. Boss symbol. |
| `.tile--chest` | Treasure gold background. Chest symbol. |
| `.tile--chest-opened` | Dull bronze background. |
| `.tile--stairs` | Cyan background. Stairs symbol. |
| `.tile--potion` | Potion green background. Potion symbol. |
| `.sidebar` | Fixed width 280px, flex column. Dark panel background, left border. |
| `.hud` | Padding, vertical stack of stat elements. |
| `.bar` | Relative container, fixed height (12px). Background is the track colour. |
| `.bar__fill` | Absolute-positioned inner div. Width set via JS as percentage. Transition on width for smooth bar animation. |
| `.bar__label` | Absolute-positioned text overlay on the bar. Small monospace font. |
| `.bar--hp .bar__fill` | Background: `--color-hp-fill`. |
| `.bar--mp .bar__fill` | Background: `--color-mp-fill`. |
| `.bar--xp .bar__fill` | Background: `--color-xp-fill`. |
| `.minimap` | CSS Grid with tiny cells. Fixed height, overflow hidden. |
| `.log-container` | Fixed height (~120px), overflow-y auto, dark background, top border. |
| `.combat-log` | List style none. Each `<li>` is a log message with coloured text based on message type. |
| `.overlay` | Position fixed, inset 0, flex centred. Background: `--color-overlay-bg`. Z-index 100. |
| `.overlay__content` | Max-width 500px, panel background, border, border-radius, padding. |
| `.overlay__heading` | Title font, centred, margin-bottom. |
| `.btn` | Inline-block, padding, title font at small size, border, cursor pointer. |
| `.btn--primary` | Gold text on dark background. Hover: reversed. |
| `.btn--secondary` | Light text on dark background. |
| `.btn--combat` | Equal-width flex children inside `.combat__actions`. |
| `.btn--inventory` | Inventory action buttons. |
| `.inventory__grid` | 4-column CSS Grid. Each slot is a bordered square with item icon/name. |
| `.inventory__slot` | Bordered box showing equipment. Highlight on selection. |
| `.combat__feed` | Scrollable list inside combat overlay. Max-height 120px. |
| `.controls-table` | Simple table with alternating row backgrounds for readability. |

### Animations & Transitions

| Animation | Target | Details |
|---|---|---|
| Player pulse | `.tile--player` | Subtle CSS `@keyframes pulse` — alternates opacity 0.85 → 1.0 over 1s, infinite. Draws attention to the player tile. |
| Bar fill transition | `.bar__fill` | `transition: width 0.3s ease-out`. Smooth HP/MP/XP bar changes. |
| Tile reveal | `.tile--fog` → `.tile--floor` | `transition: background-color 0.2s ease`. Fog tiles fade into floor colour when revealed. |
| Damage flash | `.tile--enemy` (in combat) | `@keyframes flash-red` — briefly turns background white then back to red. Triggered via JS class toggle (`shake`), removed after 300ms. |
| Player hit flash | `.tile--player` (in combat) | Same flash technique, briefly turns red then back to gold. |
| Overlay fade-in | `.overlay` | `transition: opacity 0.25s ease`. Overlays go from `opacity: 0; pointer-events: none` to `opacity: 1; pointer-events: auto`. |
| Loot drop bounce | Combat log `.log-entry--loot` | `@keyframes bounce-in` — entry scales from 0.8 to 1.0. Brief attention-grab. |
| Stairs glow | `.tile--stairs` | `@keyframes glow` — `box-shadow` pulses cyan. Indicates the exit. |

### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1023px) {
  :root { --tile-size: 32px; }
  .sidebar { /* Collapse to horizontal bar above map */ }
  .minimap-container { display: none; }
  .log-container { max-height: 80px; }
}

/* Mobile */
@media (max-width: 767px) {
  :root { --tile-size: 24px; }
  .game-area { flex-direction: column; }
  .sidebar { flex-direction: row; width: 100%; height: auto; }
  .hud__stats, .hud__equipment { display: none; }
  .overlay__content { width: 95vw; max-height: 90vh; overflow-y: auto; }
}
```

---

## 7. JavaScript Architecture

### Module Breakdown

#### `js/main.js` — Entry Point
- Imports all modules.
- Calls `initInput()` to bind keyboard listeners.
- Shows the title screen overlay.
- On "New Game": calls `createPlayer()`, `generateFloor(1)`, `updateFog()`, `renderMap()`, `renderHUD()`.
- On "Continue": calls `loadGame()`, restores state, re-renders.
- Manages the top-level game mode state machine: `TITLE → EXPLORATION → COMBAT → INVENTORY → GAME_OVER`.
- Exports nothing (side-effect module).

#### `js/modules/config.js` — Constants
Exports:
- `GRID_WIDTH` (40), `GRID_HEIGHT` (30): Full map dimensions (larger than viewport).
- `VIEW_WIDTH` (20), `VIEW_HEIGHT` (15): Visible viewport in tiles.
- `TILE_TYPES`: Enum → `{ WALL: 0, FLOOR: 1, STAIRS: 2, CHEST: 3, POTION: 4, ENEMY: 5 }`.
- `BASE_PLAYER_STATS`: `{ hp: 100, mp: 30, atk: 5, def: 3, spd: 4 }`.
- `XP_CURVE`: Array of XP thresholds per level → `[0, 100, 250, 450, 700, 1000, ...]`.
- `STAT_GROWTH`: Per-level stat increases → `{ hp: 10, mp: 5, atk: 2, def: 1, spd: 1 }`.
- `ENEMY_TYPES`: Object keyed by enemy name with base stats (see Game Mechanics).
- `ITEM_CATALOG`: Object keyed by item ID with type, name, stats, description.
- `LOOT_TABLES`: Drop tables per enemy type.
- `FLOOR_SCALING`: Multipliers for enemy stats per floor.
- `FOG_RADIUS`: 4 tiles.
- `MAX_INVENTORY_SLOTS`: 16.
- `ROOM_MIN_SIZE`: 4, `ROOM_MAX_SIZE`: 8, `MAX_ROOMS`: 8.

#### `js/modules/state.js` — Game State
Exports:
- `gameState`: Central object:
  ```js
  {
    mode: 'title',           // 'title' | 'exploration' | 'combat' | 'inventory' | 'gameover'
    floor: 1,
    score: 0,
    map: [],                 // 2D array [y][x] of tile type integers
    fogMap: [],              // 2D array [y][x] of visibility (0=hidden, 1=dim, 2=visible)
    enemies: [],             // Array of enemy objects on current floor
    chests: [],              // Array of { x, y, opened, contents }
    potions: [],             // Array of { x, y, type }
    stairs: { x: 0, y: 0 }, // Stairs position
    player: null,            // Player object reference
    combat: null,            // Current combat state or null
    messageLog: [],          // Array of { text, type } for combat log
    stats: { enemiesDefeated: 0, itemsCollected: 0 }
  }
  ```
- `setMode(mode)`: Updates `gameState.mode`.
- `addMessage(text, type)`: Adds to `messageLog`, trims to 50 entries.
- `resetState()`: Resets everything for a new game.

#### `js/modules/dungeon.js` — Procedural Generation
Exports:
- `generateFloor(floorNumber)` → Returns `{ map, enemies, chests, potions, stairs, playerStart }`.
- Algorithm (BSP / Random Rooms):
  1. Initialise a 2D array (`GRID_WIDTH × GRID_HEIGHT`) filled with `WALL`.
  2. Generate `MAX_ROOMS` rectangular rooms at random positions (min size `ROOM_MIN_SIZE`, max `ROOM_MAX_SIZE`). Reject rooms that overlap existing rooms (with 1-tile buffer).
  3. Sort rooms by centre position. Connect consecutive rooms with L-shaped corridors (horizontal then vertical tunnel, 1-tile wide).
  4. Place the player start position at the centre of the first room.
  5. Place the stairs at the centre of the last room.
  6. Randomly scatter enemies in rooms (count scales with `floorNumber`: `3 + floor * 2`, capped at 15). Enemy type weighted by floor level.
  7. Place 2–4 treasure chests in random floor tiles (not in the first or last room, not on enemies).
  8. Place 2–3 health potions and 1–2 mana potions on random floor tiles.
  9. On floors divisible by 5, replace one enemy with a boss.
  10. Return the generated data.

#### `js/modules/player.js` — Player Entity
Exports:
- `createPlayer()` → Returns player object:
  ```js
  {
    x: 0, y: 0,
    hp: 100, maxHp: 100,
    mp: 30, maxMp: 30,
    xp: 0, level: 1,
    baseAtk: 5, baseDef: 3, baseSpd: 4,
    weapon: { id: 'rusty_dagger', atk: 1 },
    armour: null,
    inventory: []
  }
  ```
- `movePlayer(dx, dy)`: Attempts to move the player by `(dx, dy)`. Checks collision with walls. If enemy tile → triggers combat. If chest → triggers interact prompt. If potion → auto-pickup. If stairs → prompt to descend. Returns `true` if move was valid (counts as a turn).
- `getEffectiveStats(player)` → Returns computed ATK/DEF/SPD including equipment bonuses.
- `levelUp(player)` → Increments level, adds stat growth, restores HP/MP to new maximums. Logs a level-up message.
- `addXP(player, amount)` → Adds XP; if threshold reached, calls `levelUp`. May chain multiple level-ups.
- `takeDamage(player, amount)` → Reduces HP. Clamps to 0. Returns `true` if dead.
- `heal(player, amount)` → Restores HP up to max.
- `restoreMana(player, amount)` → Restores MP up to max.

#### `js/modules/enemies.js` — Enemy Factory & AI
Exports:
- `spawnEnemy(type, floorNumber)` → Returns an enemy object with floor-scaled stats:
  ```js
  {
    id: 'enemy_1',
    type: 'skeleton',
    name: 'Skeleton',
    x: 10, y: 5,
    hp: 30, maxHp: 30,
    atk: 8, def: 4, spd: 3,
    xpReward: 25,
    lootTable: 'skeleton',
    symbol: '💀',
    isBoss: false
  }
  ```
- `getEnemyAI(enemy, player, map)` → Returns the enemy's desired action for this turn. AI types:
  - **Idle**: Doesn't move. Used for mimics / sleeping enemies.
  - **Patrol**: Moves randomly to adjacent floor tiles. Default for most enemies.
  - **Chase**: If player is within 5 tiles (Manhattan distance), moves one tile toward the player. Otherwise, patrols.
- `processEnemyTurns(enemies, player, map)` → Iterates all enemies, calls AI, moves each enemy. If an enemy moves onto the player tile, combat triggers.

#### `js/modules/combat.js` — Turn-Based Combat Engine
Exports:
- `startCombat(player, enemy)` → Initialises combat state:
  ```js
  {
    enemy: enemy,
    turn: 'player',        // 'player' | 'enemy'
    playerDefending: false,
    turnCount: 0,
    fled: false,
    resolved: false,
    result: null            // 'victory' | 'defeat' | 'fled'
  }
  ```
  Sets game mode to `combat`. Shows combat overlay.
- `playerAction(action)` → Processes the player's chosen action:
  - **Attack**: Rolls damage (see formulas). Applies to enemy HP. Logs result. Sets turn to `enemy`.
  - **Defend**: Sets `playerDefending = true` (halves incoming damage this turn). Sets turn to `enemy`.
  - **Flee**: Roll flee chance (based on SPD comparison). If successful, combat ends with `fled`. If failed, sets turn to `enemy`.
- `enemyTurn(combatState, player)` → Enemy attacks the player. Applies damage (halved if defending). Logs result. Sets turn back to `player`. Checks if player HP = 0.
- `resolveCombat(combatState, player)` → Called when combat ends. On victory: awards XP, rolls loot, removes enemy from map. On defeat: triggers game-over. On flee: player stays in place, enemy remains.

#### `js/modules/inventory.js` — Inventory Management
Exports:
- `addItem(player, item)` → Adds item to inventory if slots < 16. Returns `false` if full.
- `removeItem(player, index)` → Removes item at inventory index.
- `equipItem(player, index)` → Equips weapon or armour from inventory. Swaps current equipment back to inventory if a piece is already equipped.
- `useItem(player, index)` → Uses consumable (potion). Applies effect (heal / restore mana). Removes from inventory.
- `discardItem(player, index)` → Permanently removes item without effect.
- `getInventoryDisplay(player)` → Returns formatted array for renderer.

#### `js/modules/items.js` — Item Data & Loot Tables
Exports:
- `ITEM_CATALOG` from config (re-exported for convenience) or inline definitions:
  - Weapons: `rusty_dagger`, `iron_sword`, `steel_axe`, `enchanted_blade`, `doom_hammer`, `shadow_dagger`, `fire_staff`.
  - Armour: `leather_armour`, `chain_mail`, `iron_plate`, `enchanted_robe`, `dragon_scale`.
  - Consumables: `health_potion`, `greater_health_potion`, `mana_potion`, `greater_mana_potion`, `elixir`.
- `rollLoot(enemyType, floorNumber)` → Uses the enemy's loot table. Rolls a random number and picks an item based on weighted probabilities. Floor number influences quality tier. Returns an item object or `null` (empty drop).
- `getItemById(id)` → Returns item definition from the catalog.

#### `js/modules/renderer.js` — DOM Rendering
Exports:
- `renderMap(map, fogMap, player, enemies, chests, potions, stairs)` → Generates/updates the dungeon grid `<div>` tiles. Only renders the visible viewport centred on the player. Sets CSS classes per tile type. Uses `textContent` for emoji symbols (never `innerHTML` with untrusted data).
- `renderHUD(player)` → Updates all HUD elements: name, level, HP/MP/XP bar widths + labels, stat values, equipment names.
- `renderMinimap(map, fogMap, player)` → Renders the full floor as a tiny grid. Explored tiles filled, fog empty, player highlighted.
- `renderCombatOverlay(combatState, player)` → Shows/hides combat overlay. Updates enemy name, HP bars, enables/disables action buttons.
- `renderInventoryOverlay(player)` → Populates inventory grid with item slots. Highlights selected item. Enables/disables action buttons based on item type.
- `appendLog(text, type)` → Creates `<li>` element with appropriate colour class, appends to `#combat-log`, auto-scrolls.
- `showOverlay(id)` / `hideOverlay(id)` → Toggles `hidden` attribute and manages focus trapping.
- `renderGameOver(stats)` → Populates game-over overlay with run statistics.

#### `js/modules/fog.js` — Fog of War
Exports:
- `createFogMap(width, height)` → Returns 2D array filled with `0` (hidden).
- `updateFog(fogMap, playerX, playerY, map, radius)` → For each tile within `radius` of the player: if line-of-sight is clear (no walls blocking), set to `2` (visible). Tiles one step beyond visible range set to `1` (dim) if adjacent to a visible tile. Walls that are adjacent to visible floor tiles are also revealed. Previously revealed tiles stay revealed (fog only hides what you haven't explored, not what you've left).
- `isTileVisible(fogMap, x, y)` → Returns the visibility level (0, 1, or 2).
- Line-of-sight algorithm: Bresenham's line from player to target tile. If any wall tile is encountered before reaching the target, the target remains hidden.

#### `js/modules/input.js` — Keyboard Input
Exports:
- `initInput(handlers)` → Attaches a single `keydown` listener to `document`. Takes a handlers object:
  ```js
  {
    onMove: (dx, dy) => {},
    onInteract: () => {},
    onInventoryToggle: () => {},
    onCombatAction: (action) => {},
    onCloseOverlay: () => {}
  }
  ```
- Internally checks `gameState.mode` to determine which keys are active:
  - **Exploration:** WASD/Arrows → `onMove`, `I` → `onInventoryToggle`, `E` → `onInteract`.
  - **Combat:** `1` → Attack, `2` → Defend, `3` → Flee, via `onCombatAction`.
  - **Inventory:** `I` or `Esc` → close, arrow keys → navigate items, `Enter` → select.
  - **Overlay (title/gameover/controls):** `Esc` → close (where applicable), Enter → confirm.

#### `js/modules/storage.js` — Save/Load
Exports:
- `saveGame(gameState)` → Serialises the full game state (player, map, enemies, chests, potions, stairs, fog, floor, score, stats) to JSON. Writes to `localStorage` under key `'dungeon_crawler_save'`.
- `loadGame()` → Reads from `localStorage`, parses JSON, returns the reconstructed game state. Returns `null` if no save exists.
- `hasSave()` → Returns `true` if `'dungeon_crawler_save'` key exists in `localStorage`.
- `deleteSave()` → Removes the save from `localStorage`.
- `saveBestRun(stats)` → Compares current run's floor with stored best. Updates `'dungeon_crawler_best'` if current run went deeper.
- `getBestRun()` → Returns stored best run data or `null`.

### Turn System Flow

```
Player presses movement key
        │
        ▼
  movePlayer(dx, dy)
        │
   ┌────┴────────────┐
   │   Valid move?    │
   │  (floor tile)    │
   └────┬───────┬─────┘
       Yes      No → do nothing
        │
        ▼
  Update player position
  updateFog()
  renderMap()
        │
   ┌────┴────────────┐
   │ Enemy on tile?   │
   └────┬───────┬─────┘
       Yes      No
        │        │
        ▼        ▼
  startCombat() processEnemyTurns()
        │        │
        ▼        ▼
  Combat overlay  Enemies move
  (see combat     Check for enemy
   resolution)    collisions with
                  player → startCombat()
```

---

## 8. Game Mechanics

### Movement Rules

- Grid-based, 4-directional movement (no diagonal).
- Each movement is one tile and costs one turn.
- Moving into a wall tile is blocked (no turn consumed).
- Moving into an enemy tile initiates combat (turn consumed).
- Moving onto a potion tile auto-collects it into inventory (with log message).
- Moving adjacent to a chest or stairs enables interaction via `E` key.
- After the player moves, all enemies take their turn (simultaneous resolution).

### Combat Formulas

```
Base Damage   = attacker.ATK - (defender.DEF / 2)
Minimum Dmg   = 1 (always deal at least 1)
Variance      = ±20% random (multiply base by 0.8–1.2)
Final Damage  = Math.max(1, Math.round(baseDamage * variance))

If defending:   incoming damage is halved (rounded down), minimum 1.

Critical Hit:
  Chance = 10% + (attacker.SPD - defender.SPD) * 2%
  Clamped between 5% and 40%.
  Critical multiplier = 1.5×

Hit Chance:
  Base = 85%
  Modifier = (attacker.SPD - defender.SPD) * 3%
  Clamped between 50% and 99%.
  On miss: 0 damage, logged as "missed!"

Flee Chance:
  Base = 40%
  Modifier = (player.SPD - enemy.SPD) * 5%
  Clamped between 10% and 80%.
  On failure: enemy gets a free attack, then normal turn resumes.
```

### Level Progression

| Level | XP Required (cumulative) | HP | MP | ATK | DEF | SPD |
|---|---|---|---|---|---|---|
| 1 | 0 | 100 | 30 | 5 | 3 | 4 |
| 2 | 100 | 110 | 35 | 7 | 4 | 5 |
| 3 | 250 | 120 | 40 | 9 | 5 | 6 |
| 4 | 450 | 130 | 45 | 11 | 6 | 7 |
| 5 | 700 | 140 | 50 | 13 | 7 | 8 |
| 6 | 1000 | 150 | 55 | 15 | 8 | 9 |
| 7 | 1400 | 160 | 60 | 17 | 9 | 10 |
| 8 | 1900 | 170 | 65 | 19 | 10 | 11 |
| 9 | 2500 | 180 | 70 | 21 | 11 | 12 |
| 10 | 3200 | 200 | 80 | 24 | 13 | 14 |

- On level-up: HP and MP are fully restored.
- XP curve formula: `XP(n) = 50 * n * (n + 1)` (i.e., Level 2 = 100, Level 3 = 250, etc.).
- Stats increase per level: `+10 HP, +5 MP, +2 ATK, +1 DEF, +1 SPD`.
- Level 10 is the soft cap with a bonus stat boost.

### Item Types and Effects

#### Weapons

| Item ID | Name | ATK Bonus | Floor Available | Drop Weight |
|---|---|---|---|---|
| `rusty_dagger` | Rusty Dagger | +1 | 1+ | Starter |
| `iron_sword` | Iron Sword | +4 | 1+ | Common |
| `steel_axe` | Steel Axe | +6 | 3+ | Uncommon |
| `shadow_dagger` | Shadow Dagger | +5, +3 SPD | 4+ | Rare |
| `fire_staff` | Fire Staff | +8 | 5+ | Rare |
| `enchanted_blade` | Enchanted Blade | +10 | 6+ | Epic |
| `doom_hammer` | Doom Hammer | +14, −2 SPD | 8+ | Epic |

#### Armour

| Item ID | Name | DEF Bonus | Floor Available | Drop Weight |
|---|---|---|---|---|
| `leather_armour` | Leather Armour | +3 | 1+ | Common |
| `chain_mail` | Chain Mail | +5 | 3+ | Uncommon |
| `iron_plate` | Iron Plate | +8, −1 SPD | 5+ | Uncommon |
| `enchanted_robe` | Enchanted Robe | +4, +10 MP | 4+ | Rare |
| `dragon_scale` | Dragon Scale | +12 | 8+ | Epic |

#### Consumables

| Item ID | Name | Effect | Floor Available | Drop Weight |
|---|---|---|---|---|
| `health_potion` | Health Potion | Restore 30 HP | 1+ | Common |
| `greater_health_potion` | Greater Health Potion | Restore 60 HP | 4+ | Uncommon |
| `mana_potion` | Mana Potion | Restore 15 MP | 1+ | Common |
| `greater_mana_potion` | Greater Mana Potion | Restore 30 MP | 4+ | Uncommon |
| `elixir` | Elixir | Full HP + MP restore | 7+ | Rare |

### Enemy Types

| Enemy | Symbol | Base HP | Base ATK | Base DEF | Base SPD | XP Reward | AI | Loot Table |
|---|---|---|---|---|---|---|---|---|
| Slime | 🟢 | 15 | 4 | 1 | 2 | 10 | Idle | health_potion (30%), nothing (70%) |
| Goblin | 👺 | 25 | 7 | 3 | 5 | 20 | Chase | iron_sword (15%), leather_armour (10%), health_potion (25%), nothing (50%) |
| Skeleton | 💀 | 30 | 8 | 4 | 3 | 25 | Patrol | iron_sword (10%), chain_mail (10%), mana_potion (20%), nothing (60%) |
| Dark Bat | 🦇 | 20 | 6 | 2 | 8 | 15 | Chase | shadow_dagger (5%), health_potion (20%), nothing (75%) |
| Orc Warrior | 👹 | 50 | 12 | 8 | 3 | 40 | Chase | steel_axe (20%), iron_plate (15%), greater_health_potion (15%), nothing (50%) |
| Wraith | 👻 | 35 | 10 | 2 | 7 | 35 | Chase | enchanted_robe (10%), mana_potion (25%), greater_mana_potion (10%), nothing (55%) |
| Fire Elemental | 🔥 | 45 | 14 | 5 | 6 | 45 | Patrol | fire_staff (10%), greater_health_potion (20%), nothing (70%) |
| **Floor Boss** | 👑 | 80 | 16 | 10 | 4 | 100 | Chase | enchanted_blade (20%), dragon_scale (15%), elixir (25%), doom_hammer (10%), nothing (30%) |

### Enemy Stat Scaling Per Floor

```
Enemy HP  = baseHP  * (1 + 0.15 * (floor - 1))
Enemy ATK = baseATK * (1 + 0.10 * (floor - 1))
Enemy DEF = baseDEF * (1 + 0.10 * (floor - 1))
Enemy SPD = baseSPD (no scaling)
XP Reward = baseXP  * (1 + 0.20 * (floor - 1))
```

All values rounded to nearest integer.

### Enemy Spawn Weights Per Floor

| Floor | Slime | Goblin | Skeleton | Dark Bat | Orc Warrior | Wraith | Fire Elemental |
|---|---|---|---|---|---|---|---|
| 1–2 | 40% | 35% | 20% | 5% | — | — | — |
| 3–4 | 20% | 25% | 25% | 15% | 10% | 5% | — |
| 5–6 | 10% | 15% | 20% | 15% | 20% | 15% | 5% |
| 7–8 | 5% | 10% | 15% | 10% | 25% | 20% | 15% |
| 9–10 | — | 5% | 10% | 10% | 25% | 25% | 25% |

### Dungeon Floor Progression

- **Floor 1–2:** Tutorial difficulty. Mostly slimes and goblins. 3–5 enemies per floor.
- **Floor 3–4:** Introduce skeletons, dark bats, and orcs. 5–8 enemies. Chests contain uncommon loot.
- **Floor 5 (Boss):** First boss encounter. Boss room is the largest room. Boss drops guaranteed rare+ item.
- **Floor 6–7:** Wraiths and fire elementals introduced. 8–10 enemies. Map gets larger rooms.
- **Floor 8–9:** High-tier enemies dominate. 10–12 enemies. Some enemies patrol corridors.
- **Floor 10 (Final Boss):** Ultimate boss with 2× boss stats. Defeating it triggers a victory screen.
- **Beyond Floor 10 (Endless):** Continues with escalating difficulty for high-score chasers.

### Score Calculation

```
Score = (Enemies Defeated × 10) + (Floor Reached × 100) + (Player Level × 50) + (Items Collected × 5)
```

---

## 9. Implementation Order

### Phase 1 — Project Skeleton & Static Layout
1. Create `index.html` with the full HTML structure (all sections, overlays, semantic elements).
2. Create `styles/main.css` with CSS variables, page layout (Flexbox), title bar, sidebar, log container, and overlay base styles.
3. Create `js/main.js` as empty entry point with module imports stubbed.
4. Create `js/modules/config.js` with all game constants.
5. **Checkpoint:** Open `index.html` in browser. Verify layout renders correctly with placeholder content. All panels visible, overlays positioned correctly.

### Phase 2 — Dungeon Generation & Rendering
6. Create `js/modules/state.js` with game state object and helpers.
7. Create `js/modules/dungeon.js` with `generateFloor()` — room placement, corridor connection, tile array output.
8. Create `js/modules/renderer.js` with `renderMap()` — reads map array, generates tile `<div>` elements in the CSS Grid.
9. Wire `main.js`: on "New Game", generate floor 1 and render the map.
10. Style tiles in `main.css` (wall, floor, stairs colours and symbols).
11. **Checkpoint:** Click "New Game" → procedurally generated dungeon map visible with rooms, corridors, walls, and stairs. No interactivity yet.

### Phase 3 — Player & Movement
12. Create `js/modules/player.js` with `createPlayer()` and movement logic.
13. Create `js/modules/input.js` with keyboard listener and movement dispatch.
14. Wire movement into `main.js`: WASD/arrow keys move the player tile. Render updates after each move.
15. Implement viewport scrolling — centre the visible grid on the player's position.
16. **Checkpoint:** Player moves around the dungeon with WASD. Cannot walk through walls. Map scrolls to follow.

### Phase 4 — Fog of War
17. Create `js/modules/fog.js` with `createFogMap()`, `updateFog()`, and line-of-sight.
18. Integrate fog into `renderer.js` — tiles outside visibility are styled as fog.
19. Fog reveals as the player moves, persisting explored areas.
20. **Checkpoint:** Dungeon starts fully fogged. Tiles reveal in a radius around the player. Walls block vision correctly.

### Phase 5 — Enemies & Combat
21. Create `js/modules/enemies.js` with `spawnEnemy()` and enemy placement during generation.
22. Create `js/modules/combat.js` with `startCombat()`, `playerAction()`, `enemyTurn()`, and `resolveCombat()`.
23. Wire combat into movement: stepping onto an enemy tile opens the combat overlay.
24. Implement Attack, Defend, Flee actions with damage formulas.
25. Render combat overlay: enemy HP bar, player HP bar, action buttons, combat feed.
26. On victory: award XP, remove enemy from map, check for level-up.
27. On defeat: show game-over overlay.
28. **Checkpoint:** Full combat loop works. Player can fight enemies, take damage, defeat them, die, and see game-over.

### Phase 6 — Items, Loot & Inventory
29. Create `js/modules/items.js` with item catalog and `rollLoot()`.
30. Create `js/modules/inventory.js` with add/remove/equip/use/discard.
31. Loot drops after combat victory — items added to inventory.
32. Implement inventory overlay (`I` key): display items, select, equip, use, discard.
33. Equipment affects player stats (rendered in HUD).
34. Chests and floor potions interactable via `E` key.
35. **Checkpoint:** Enemies drop loot. Inventory opens/closes. Items equippable and usable. Stats change visibly.

### Phase 7 — Enemy AI & Turn Resolution
36. Implement enemy AI in `enemies.js`: idle, patrol, chase behaviours.
37. After each player move, `processEnemyTurns()` moves enemies.
38. If an enemy walks into the player, combat triggers.
39. **Checkpoint:** Enemies move on the map between player turns. Chase AI follows the player.

### Phase 8 — HUD, Minimap & Combat Log
40. Full HUD rendering: HP/MP/XP bars with smooth transitions, stat numbers, equipment names.
41. Minimap rendering: full-floor overview with tiny tiles.
42. Combat log: messages appended with coloured text, auto-scroll.
43. **Checkpoint:** HUD updates live. Minimap shows explored areas. Log narrates all events.

### Phase 9 — Floor Progression & Scaling
44. Stairs interaction: pressing `E` on stairs generates the next floor.
45. Enemy stats scale with floor number.
46. Enemy spawn weights shift per floor range.
47. Boss placement on floors 5, 10.
48. Score calculation and display.
49. **Checkpoint:** Player can descend floors. Difficulty increases noticeably. Boss fights work.

### Phase 10 — Save/Load & Polish
50. Create `js/modules/storage.js` with `saveGame()`, `loadGame()`, `hasSave()`, `deleteSave()`, `saveBestRun()`.
51. Auto-save on floor descent.
52. "Continue" button on title screen loads saved game.
53. Best run tracking.
54. Add all CSS animations (pulse, flash, glow, fade-in).
55. Add responsive breakpoints.
56. Final accessibility pass (focus trapping in overlays, ARIA attributes, keyboard-only playability).
57. **Checkpoint:** Full game playable start to finish. Save/load works. Animations polished. Responsive on all screens.

---

## 10. Accessibility

### Keyboard Navigation

- The entire game is playable with keyboard only — no mouse required.
- WASD and arrow keys for movement, number keys for combat, `I`/`E`/`Esc` for UI.
- All buttons are focusable `<button>` elements (not `<div>` with click handlers).
- When an overlay opens, focus is trapped within it (tab cycles through overlay buttons only).
- When an overlay closes, focus returns to the game area.
- Inventory items navigable via arrow keys with visible focus indicator.

### Screen Reader Considerations

- `role="grid"` on the dungeon grid with `aria-label`.
- `role="progressbar"` on all HP/MP/XP bars with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` updated dynamically.
- `aria-live="polite"` on the combat log for ambient messages.
- `aria-live="assertive"` on the combat feed for urgent combat results.
- `role="dialog"` and `aria-modal="true"` on all overlays.
- `aria-label` on all interactive sections.
- The minimap is decorative and uses `aria-hidden="true"`.
- Button labels are descriptive: "1: Attack", "2: Defend", "3: Flee" (not just icons).

### Colour Contrast

- All text meets WCAG AA contrast ratio (4.5:1 minimum) against its background.
- `--color-text-primary` (#e0d5c1) on `--color-bg-panel` (#1a1a1a) = contrast ratio ~11:1.
- HP/MP/XP bars have text labels over the bar, not relying on colour alone to convey value.
- Enemy types use both colour and emoji/symbol to distinguish them (not colour-only).
- Damage/heal messages use text prefixes ("Dealt 12 damage", "Healed 30 HP") in addition to colour coding.

### Focus Management

- On game start, focus is set to the "New Game" button.
- On combat start, focus moves to the "Attack" button.
- On inventory open, focus moves to the first inventory slot or "Close" button.
- On overlay close, focus returns to the previously focused element or the game area.
- Visible focus ring (2px solid outline in `--color-btn-active`) on all focusable elements.
- `tabindex="-1"` on the game area container to allow programmatic focus without tab-stop pollution.
