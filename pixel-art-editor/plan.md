# Pixel Art Editor — Implementation Plan

## 1. Overview

A fully browser-based pixel art editor that runs without any server-side logic, build tools, or external dependencies. Users draw on a grid of individually addressable pixel cells, choose colours from a palette or custom picker, apply tools (pencil, eraser, flood fill, eyedropper), undo/redo actions, resize the canvas, clear the canvas, and export the finished artwork as a PNG file.

The entire application is vanilla HTML5 + CSS3 + JavaScript (ES2022+ with ES modules). It follows the monorepo conventions defined in `.github/copilot-instructions.md`, keeping all source inside `pixel-art-editor/` with relative paths only.

### Goals

- Instant feedback: every pixel change is visible immediately on a CSS-grid-based canvas.
- Lightweight: no frameworks, no bundlers, no npm dependencies.
- Accessible: keyboard-navigable toolbar, ARIA labels, visible focus rings.
- Exportable: convert the in-memory pixel data to a real PNG via the HTML Canvas API.
- Extensible: modular JS architecture that makes stretch goals (layers, animation, save/load) straightforward to add later.

---

## 2. Page Layout

### 2.1 Wireframe (ASCII)

```text
┌──────────────────────────────────────────────────────────┐
│  HEADER — "Pixel Art Editor"                 [Undo][Redo]│
├─────────────┬────────────────────────────────────────────┤
│  TOOLBAR    │                                            │
│             │                                            │
│  [Pencil]   │          PIXEL CANVAS                      │
│  [Eraser]   │       (CSS Grid of divs)                   │
│  [Fill]     │                                            │
│  [Picker]   │      rows × cols cells                     │
│             │      each cell = 1 pixel                   │
│─────────────│                                            │
│  COLOUR     │                                            │
│  <input     │                                            │
│   color>    │                                            │
│             │                                            │
│  SWATCHES   │                                            │
│  ■ ■ ■ ■    │                                            │
│  ■ ■ ■ ■    │                                            │
│  ■ ■ ■ ■    │                                            │
│             │                                            │
│  RECENT     │                                            │
│  ■ ■ ■ ■    │                                            │
│─────────────│                                            │
│  SIZE       │                                            │
│  [8][16]    │                                            │
│  [32][64]   │                                            │
│─────────────│                                            │
│  ACTIONS    │                                            │
│  [Clear]    │                                            │
│  [Export]   │                                            │
├─────────────┴────────────────────────────────────────────┤
│  FOOTER — keyboard shortcuts cheat-sheet                 │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

| Component | HTML Element | Purpose |
|---|---|---|
| Header bar | `<header>` | App title, undo/redo buttons |
| Toolbar sidebar | `<aside class="toolbar">` | Tool buttons (pencil, eraser, fill, picker) |
| Colour section | `<section class="colour-section">` inside sidebar | `<input type="color">`, preset swatches grid, recent colours strip |
| Canvas size selector | `<section class="size-section">` inside sidebar | Buttons for 8×8, 16×16, 32×32, 64×64 |
| Action buttons | `<section class="actions-section">` inside sidebar | Clear canvas, Export PNG |
| Pixel canvas | `<main><div class="canvas-container"><div class="pixel-canvas">` | CSS Grid of `<div class="pixel">` cells |
| Footer | `<footer>` | Keyboard shortcuts help text |

---

## 3. Colour Scheme and Typography

### 3.1 Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-app` | `#1e1e2e` | Page background (dark) |
| `--bg-toolbar` | `#2a2a3d` | Sidebar / toolbar background |
| `--bg-canvas` | `#ffffff` | Default pixel colour (empty) |
| `--border-grid` | `#cccccc` | Grid lines between pixels |
| `--text-primary` | `#e0e0e0` | Headings, labels on dark bg |
| `--text-secondary` | `#a0a0b0` | Muted text, footer |
| `--accent` | `#7c5cfc` | Active tool highlight, selected size button |
| `--accent-hover` | `#9b82fd` | Hover state on accent elements |
| `--danger` | `#f25c5c` | Clear button, destructive actions |
| `--danger-hover` | `#f47c7c` | Hover state for danger |
| `--success` | `#4caf82` | Export button |
| `--success-hover` | `#6bc89a` | Hover state for export |
| `--pixel-hover` | `rgba(124, 92, 252, 0.25)` | Semi-transparent overlay on hovered pixel |

### 3.2 Typography

| Property | Value |
|---|---|
| Font family | `'Segoe UI', system-ui, -apple-system, sans-serif` |
| Heading (h1) | `1.4rem`, weight `700` |
| Tool labels | `0.75rem`, weight `600`, uppercase, letter-spacing `0.05em` |
| Button text | `0.8rem`, weight `600` |
| Footer text | `0.7rem`, weight `400`, colour `--text-secondary` |

### 3.3 Preset Colour Swatches (16 colours)

```text
#000000  #ffffff  #ff0000  #00ff00
#0000ff  #ffff00  #ff00ff  #00ffff
#ff8800  #8800ff  #0088ff  #88ff00
#ff0088  #888888  #cccccc  #884400
```

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pixel Art Editor</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- HEADER -->
  <header class="app-header">
    <h1>Pixel Art Editor</h1>
    <div class="header-actions">
      <button id="btn-undo" class="header-btn" aria-label="Undo" title="Undo (Ctrl+Z)" disabled>↩ Undo</button>
      <button id="btn-redo" class="header-btn" aria-label="Redo" title="Redo (Ctrl+Y)" disabled>↪ Redo</button>
    </div>
  </header>

  <div class="app-body">

    <!-- SIDEBAR / TOOLBAR -->
    <aside class="toolbar" role="toolbar" aria-label="Drawing tools">

      <!-- Tool Buttons -->
      <section class="tool-section">
        <h2 class="section-title">Tools</h2>
        <div class="tool-buttons">
          <button class="tool-btn active" data-tool="pencil" aria-label="Pencil tool" aria-pressed="true" title="Pencil (P)">
            ✏️ Pencil
          </button>
          <button class="tool-btn" data-tool="eraser" aria-label="Eraser tool" aria-pressed="false" title="Eraser (E)">
            🧹 Eraser
          </button>
          <button class="tool-btn" data-tool="fill" aria-label="Fill tool" aria-pressed="false" title="Fill (F)">
            🪣 Fill
          </button>
          <button class="tool-btn" data-tool="picker" aria-label="Colour picker tool" aria-pressed="false" title="Picker (I)">
            💉 Picker
          </button>
        </div>
      </section>

      <!-- Colour Picker & Swatches -->
      <section class="colour-section">
        <h2 class="section-title">Colour</h2>
        <div class="colour-input-row">
          <input type="color" id="colour-input" value="#000000" aria-label="Choose colour" />
          <div id="current-colour-preview" class="current-colour-preview" style="background:#000000;" aria-label="Current colour"></div>
        </div>
        <h3 class="subsection-title">Palette</h3>
        <div id="palette-swatches" class="palette-swatches" role="list" aria-label="Preset colour swatches">
          <!-- 16 swatch divs injected by JS -->
        </div>
        <h3 class="subsection-title">Recent</h3>
        <div id="recent-colours" class="recent-colours" role="list" aria-label="Recently used colours">
          <!-- up to 8 recent colour divs injected by JS -->
        </div>
      </section>

      <!-- Canvas Size -->
      <section class="size-section">
        <h2 class="section-title">Canvas Size</h2>
        <div class="size-buttons">
          <button class="size-btn" data-size="8" aria-label="8 by 8 canvas">8×8</button>
          <button class="size-btn active" data-size="16" aria-label="16 by 16 canvas">16×16</button>
          <button class="size-btn" data-size="32" aria-label="32 by 32 canvas">32×32</button>
          <button class="size-btn" data-size="64" aria-label="64 by 64 canvas">64×64</button>
        </div>
      </section>

      <!-- Actions -->
      <section class="actions-section">
        <h2 class="section-title">Actions</h2>
        <button id="btn-clear" class="action-btn action-btn--danger" aria-label="Clear canvas">🗑️ Clear</button>
        <button id="btn-export" class="action-btn action-btn--success" aria-label="Export as PNG">📥 Export PNG</button>
      </section>

    </aside>

    <!-- PIXEL CANVAS -->
    <main class="canvas-area">
      <div class="canvas-container">
        <div id="pixel-canvas" class="pixel-canvas" role="grid" aria-label="Pixel art canvas">
          <!-- rows × cols pixel divs generated by JS -->
        </div>
      </div>
    </main>

  </div>

  <!-- FOOTER -->
  <footer class="app-footer">
    <p>
      <strong>Shortcuts:</strong> P — Pencil · E — Eraser · F — Fill · I — Picker · Ctrl+Z — Undo · Ctrl+Y — Redo · Ctrl+S — Export
    </p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 4.1 Key HTML Notes

- The `<script>` tag uses `type="module"` to enable ES module imports.
- All paths are relative (`styles/main.css`, `js/main.js`).
- Semantic elements: `<header>`, `<aside>`, `<main>`, `<footer>`.
- ARIA attributes on interactive elements: `role="toolbar"`, `role="grid"`, `aria-label`, `aria-pressed`.
- `data-tool` and `data-size` attributes drive JS logic via event delegation.
- Tool buttons use `aria-pressed` to indicate active state for screen readers.

---

## 5. CSS Design

### 5.1 File: `styles/main.css`

#### 5.1.1 CSS Variables (`:root`)

```css
:root {
  --bg-app: #1e1e2e;
  --bg-toolbar: #2a2a3d;
  --bg-canvas: #ffffff;
  --border-grid: #cccccc;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent: #7c5cfc;
  --accent-hover: #9b82fd;
  --danger: #f25c5c;
  --danger-hover: #f47c7c;
  --success: #4caf82;
  --success-hover: #6bc89a;
  --pixel-hover: rgba(124, 92, 252, 0.25);
  --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --toolbar-width: 220px;
  --header-height: 50px;
  --footer-height: 36px;
}
```

#### 5.1.2 Global Reset and Base

- `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
- `body` — full viewport height, `background: var(--bg-app)`, font-family, colour `var(--text-primary)`, overflow hidden.

#### 5.1.3 Header

- Flexbox row, `justify-content: space-between`, `align-items: center`.
- Fixed height `var(--header-height)`, `background: var(--bg-toolbar)`.
- Border-bottom `1px solid rgba(255,255,255,0.08)`.
- Undo/redo buttons: ghost style, `opacity: 0.4` when `disabled`, `cursor: not-allowed`.

#### 5.1.4 App Body Layout

- Flexbox row filling remaining viewport height.
- `height: calc(100vh - var(--header-height) - var(--footer-height))`.

#### 5.1.5 Toolbar Sidebar

- Fixed width `var(--toolbar-width)`, `background: var(--bg-toolbar)`.
- `overflow-y: auto` for scrolling if content overflows.
- Padding `16px`.
- Section titles: uppercase, `font-size: 0.75rem`, `letter-spacing: 0.05em`, colour `var(--text-secondary)`, `margin-bottom: 8px`.

#### 5.1.6 Tool Buttons

- CSS Grid, `grid-template-columns: 1fr 1fr` (2 per row).
- Gap `6px`.
- Each button: `padding: 8px 4px`, `border-radius: 6px`, `border: 2px solid transparent`, `background: rgba(255,255,255,0.06)`, `color: var(--text-primary)`, `cursor: pointer`, `font-size: 0.78rem`, `transition: all 0.15s`.
- Hover: `background: rgba(255,255,255,0.12)`.
- Active state (`.tool-btn.active`): `border-color: var(--accent)`, `background: rgba(124,92,252,0.15)`.
- Focus-visible: `outline: 2px solid var(--accent)`, `outline-offset: 2px`.

#### 5.1.7 Colour Input Row

- Flexbox row, gap `10px`, align-items center.
- `input[type="color"]`: `width: 44px`, `height: 34px`, `border: none`, `border-radius: 4px`, `cursor: pointer`. Webkit overrides to remove default chrome.
- Current colour preview: `width: 34px`, `height: 34px`, `border-radius: 4px`, `border: 2px solid rgba(255,255,255,0.2)`.

#### 5.1.8 Palette Swatches

- CSS Grid, `grid-template-columns: repeat(4, 1fr)`, gap `4px`.
- Each swatch: `width: 100%`, `aspect-ratio: 1`, `border-radius: 4px`, `cursor: pointer`, `border: 2px solid transparent`, `transition: transform 0.1s`.
- Hover: `transform: scale(1.15)`.
- Selected (`.swatch--selected`): `border-color: var(--accent)`.

#### 5.1.9 Recent Colours Strip

- Flexbox row, gap `4px`, flex-wrap wrap.
- Each recent swatch: `width: 24px`, `height: 24px`, `border-radius: 3px`, `cursor: pointer`.

#### 5.1.10 Size Buttons

- CSS Grid, `grid-template-columns: 1fr 1fr`, gap `6px`.
- Style similar to tool buttons.
- Active (`.size-btn.active`): accent border.

#### 5.1.11 Action Buttons

- Full width, stacked vertically, gap `8px`.
- `padding: 10px`, `border-radius: 6px`, `font-weight: 600`, `cursor: pointer`.
- `--danger` variant: `background: var(--danger)`, hover `var(--danger-hover)`.
- `--success` variant: `background: var(--success)`, hover `var(--success-hover)`.

#### 5.1.12 Canvas Area

- `flex: 1`, `display: flex`, `justify-content: center`, `align-items: center`.
- `overflow: auto` for very large canvases.

#### 5.1.13 Pixel Canvas (the grid)

- `display: grid`.
- `grid-template-columns` and `grid-template-rows` set dynamically via JS inline style (e.g. `repeat(16, 1fr)`).
- `width` and `height` calculated so each pixel cell is a square:
  - For 8×8: cell size ~50px → canvas 400px.
  - For 16×16: cell size ~30px → canvas 480px.
  - For 32×32: cell size ~16px → canvas 512px.
  - For 64×64: cell size ~8px → canvas 512px.
- `border: 1px solid var(--border-grid)`.
- `background: var(--bg-canvas)`.
- `image-rendering: pixelated` (for crispness when zoomed).

#### 5.1.14 Individual Pixel Cells

- `background: transparent` (empty).
- `border: 0.5px solid var(--border-grid)`.
- Hover (when drawing is not active): `box-shadow: inset 0 0 0 100px var(--pixel-hover)`.
- `cursor: crosshair`.
- No text, no overflow.
- `user-select: none` to prevent text selection during drag.

#### 5.1.15 Footer

- `height: var(--footer-height)`, `background: var(--bg-toolbar)`.
- Centred text, `font-size: 0.7rem`, `color: var(--text-secondary)`.

#### 5.1.16 Responsive Adjustments

- **Below 900px**: Toolbar moves to a horizontal strip above the canvas. Grid changes to `grid-template-columns: auto auto auto auto` for tools. Sidebar sections collapse into a single scrollable row.
- **Below 600px**: Tool labels hidden, icons only. Size buttons shrink. Canvas fills available width.

---

## 6. JavaScript Architecture

### 6.1 File Structure

```text
pixel-art-editor/
  js/
    main.js
    modules/
      canvas.js
      tools.js
      palette.js
      export.js
      history.js
```

### 6.2 Module Dependency Graph

```text
main.js
  ├── imports canvas.js
  ├── imports tools.js
  ├── imports palette.js
  ├── imports export.js
  └── imports history.js

tools.js
  └── imports history.js  (to push snapshots on each action)

canvas.js
  └── imports history.js  (to push snapshots on clear/resize)

export.js
  └── (standalone — reads pixel data passed to it)

palette.js
  └── (standalone — manages colour state)

history.js
  └── (standalone — manages undo/redo stack)
```

---

### 6.3 `js/modules/history.js` — Undo/Redo Stack

Manages a stack of canvas state snapshots for undo and redo.

#### Data Structures

```js
/** @type {string[][][]} Array of 2D grid snapshots (each snapshot is a deep copy of the pixel data array). */
let undoStack = [];

/** @type {string[][][]} Array of 2D grid snapshots for redo. */
let redoStack = [];

/** @type {number} Maximum number of snapshots to keep. */
const MAX_HISTORY = 50;
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `pushState(gridData)` | `gridData: string[][]` — current 2D pixel colour array | `void` | Deep-copies `gridData`, pushes onto `undoStack` (caps at `MAX_HISTORY`), clears `redoStack`. Calls `updateButtons()`. |
| `undo(gridData)` | `gridData: string[][]` — current grid state to store in redo | `string[][] \| null` | Pops last snapshot from `undoStack`, pushes current `gridData` onto `redoStack`, returns the popped snapshot (or `null` if stack empty). Calls `updateButtons()`. |
| `redo(gridData)` | `gridData: string[][]` — current grid state to store in undo | `string[][] \| null` | Pops last snapshot from `redoStack`, pushes current `gridData` onto `undoStack`, returns the popped snapshot (or `null` if stack empty). Calls `updateButtons()`. |
| `clearHistory()` | none | `void` | Empties both stacks. Calls `updateButtons()`. |
| `updateButtons()` | none | `void` | Enables/disables undo and redo buttons based on stack lengths. Sets `disabled` attribute and updates `aria-disabled`. |
| `deepCopyGrid(gridData)` | `gridData: string[][]` | `string[][]` | Returns a deep copy: `gridData.map(row => [...row])`. |

---

### 6.4 `js/modules/canvas.js` — Grid Generation and Pixel Interaction

Manages the pixel grid DOM, translates mouse/touch events into pixel coordinates, and handles canvas resizing.

#### State

```js
/** @type {string[][]} 2D array [row][col] of hex colour strings. Empty = '' or null. */
let gridData = [];

/** @type {number} Current grid dimensions (square canvas). */
let gridSize = 16;

/** @type {boolean} Whether the mouse button is currently held down (for drag painting). */
let isDrawing = false;
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `initCanvas(size)` | `size: number` — grid dimension (8, 16, 32, 64) | `void` | Sets `gridSize = size`. Creates `gridData` as `size × size` 2D array filled with `''` (empty). Calls `renderGrid()`. Pushes initial state to history. |
| `renderGrid()` | none | `void` | Clears `#pixel-canvas` innerHTML. Sets CSS grid columns/rows via inline style: `gridTemplateColumns: repeat(${gridSize}, 1fr)`. Computes cell pixel size based on canvas container width and gridSize. Creates `gridSize * gridSize` div elements, each with `data-row` and `data-col` attributes, and `background-color` set from `gridData[row][col]`. Appends all at once using a `DocumentFragment` for performance. |
| `setPixel(row, col, colour)` | `row: number`, `col: number`, `colour: string` | `void` | Updates `gridData[row][col] = colour`. Finds the DOM cell by index (`row * gridSize + col`) and sets its `style.backgroundColor`. |
| `getPixel(row, col)` | `row: number`, `col: number` | `string` | Returns `gridData[row][col]`. |
| `getGridData()` | none | `string[][]` | Returns reference to `gridData`. |
| `getGridSize()` | none | `number` | Returns `gridSize`. |
| `setGridData(data)` | `data: string[][]` | `void` | Sets `gridData = data` and calls `renderGrid()`. Used by undo/redo to restore state. |
| `clearCanvas()` | none | `void` | Pushes current state to history. Fills every cell of `gridData` with `''`. Calls `renderGrid()`. |
| `resizeCanvas(newSize)` | `newSize: number` | `void` | Pushes current state to history. Calls `initCanvas(newSize)`. Clears history (new canvas = fresh history). |
| `getCellFromEvent(event)` | `event: MouseEvent \| TouchEvent` | `{ row: number, col: number } \| null` | If `event.target` has `data-row` and `data-col`, returns `{ row, col }` parsed as integers. Otherwise returns `null`. |
| `setupCanvasListeners(onCellAction)` | `onCellAction: (row, col) => void` — callback invoked when a cell should be affected | `void` | Attaches `pointerdown`, `pointerover`, `pointerup`, and `pointerleave` events to `#pixel-canvas`. On `pointerdown`: sets `isDrawing = true`, calls `onCellAction` for the target cell. On `pointerover`: if `isDrawing`, calls `onCellAction`. On `pointerup`/`pointerleave`: sets `isDrawing = false`. Uses `event.preventDefault()` to suppress drag-select. |

---

### 6.5 `js/modules/tools.js` — Drawing Tool Implementations

Each tool function receives the current row/col, current colour, and references to canvas functions, then performs the appropriate action.

#### State

```js
/** @type {'pencil' | 'eraser' | 'fill' | 'picker'} Currently selected tool. */
let activeTool = 'pencil';
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `getActiveTool()` | none | `string` | Returns `activeTool`. |
| `setActiveTool(tool)` | `tool: string` | `void` | Sets `activeTool`. Updates toolbar button classes (`.active`, `aria-pressed`). |
| `applyTool(row, col, colour, canvasAPI)` | `row: number`, `col: number`, `colour: string`, `canvasAPI: object { setPixel, getPixel, getGridData, getGridSize, setGridData }` | `string \| null` | Dispatches to the appropriate tool function based on `activeTool`. Returns a picked colour string if tool is `'picker'`, otherwise `null`. |
| `pencil(row, col, colour, setPixel)` | `row: number`, `col: number`, `colour: string`, `setPixel: Function` | `void` | Calls `setPixel(row, col, colour)`. |
| `eraser(row, col, setPixel)` | `row: number`, `col: number`, `setPixel: Function` | `void` | Calls `setPixel(row, col, '')` — resets to empty/white. |
| `fill(row, col, newColour, canvasAPI)` | `row: number`, `col: number`, `newColour: string`, `canvasAPI: object` | `void` | Reads the target colour at `(row, col)`. If it matches `newColour`, does nothing (already filled). Otherwise performs BFS flood fill (see section 7). |
| `eyedropper(row, col, getPixel)` | `row: number`, `col: number`, `getPixel: Function` | `string` | Returns `getPixel(row, col)` — the colour at that cell. The caller (main.js) updates the active colour. |
| `setupToolListeners()` | none | `void` | Attaches click listeners to all `.tool-btn` elements via event delegation on `.tool-buttons`. On click, calls `setActiveTool(button.dataset.tool)`. |

---

### 6.6 `js/modules/palette.js` — Colour Management

Manages the active drawing colour, preset swatches, and a list of recently used colours.

#### State

```js
/** @type {string} Currently selected hex colour. */
let currentColour = '#000000';

/** @type {string[]} Array of 16 preset hex colours. */
const PRESET_COLOURS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#8800ff', '#0088ff', '#88ff00',
  '#ff0088', '#888888', '#cccccc', '#884400',
];

/** @type {string[]} Most recent colours used, max 8, newest first. */
let recentColours = [];

/** @type {number} Max recent colours to track. */
const MAX_RECENT = 8;
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `getCurrentColour()` | none | `string` | Returns `currentColour`. |
| `setCurrentColour(hex)` | `hex: string` | `void` | Sets `currentColour = hex`. Updates `<input type="color">` value. Updates current-colour preview div background. Calls `addRecentColour(hex)`. |
| `addRecentColour(hex)` | `hex: string` | `void` | If `hex` is already in `recentColours`, removes it. Prepends `hex`. Trims to `MAX_RECENT`. Calls `renderRecentColours()`. |
| `renderPresetSwatches()` | none | `void` | Clears `#palette-swatches`. For each colour in `PRESET_COLOURS`, creates a `<div>` with `role="listitem"`, `aria-label="Colour #hex"`, `title="#hex"`, `background-color: hex`, `data-colour="hex"`. Appends to `#palette-swatches`. |
| `renderRecentColours()` | none | `void` | Clears `#recent-colours`. For each colour in `recentColours`, creates a `<div>` similarly to preset swatches but smaller. Appends to `#recent-colours`. |
| `setupPaletteListeners(onColourChange)` | `onColourChange: (hex) => void` — callback when colour is selected | `void` | Attaches `input` event to `#colour-input`: calls `setCurrentColour(value)` and `onColourChange(value)`. Attaches click delegation on `#palette-swatches` and `#recent-colours`: when a swatch is clicked, calls `setCurrentColour(dataset.colour)` and `onColourChange(dataset.colour)`. |

---

### 6.7 `js/modules/export.js` — PNG Export

Converts the in-memory pixel grid into a PNG image using an off-screen `<canvas>` element, then triggers a browser download.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `exportToPNG(gridData, gridSize, pixelScale)` | `gridData: string[][]` — the 2D colour array, `gridSize: number`, `pixelScale: number` (default `16`) — how many real pixels per grid pixel | `void` | Creates an off-screen `<canvas>` with dimensions `gridSize * pixelScale` × `gridSize * pixelScale`. Gets a 2D rendering context. Iterates over `gridData`: for each cell, fills a `pixelScale × pixelScale` rectangle with the cell colour (or white `#ffffff` for empty cells). Calls `canvas.toBlob(blob => triggerDownload(blob), 'image/png')`. |
| `triggerDownload(blob)` | `blob: Blob` | `void` | Creates an object URL from the blob, creates an invisible `<a>` element with `href = objectURL` and `download = 'pixel-art.png'`. Appends to body, clicks it programmatically, then removes and revokes the URL. |
| `setupExportListener(getGridData, getGridSize)` | `getGridData: Function`, `getGridSize: Function` | `void` | Attaches click listener to `#btn-export`. On click, calls `exportToPNG(getGridData(), getGridSize(), 16)`. |

---

### 6.8 `js/main.js` — Entry Point and Orchestration

Imports all modules, initialises the app, and wires up cross-module communication.

#### Responsibilities

1. Import all modules.
2. On `DOMContentLoaded`:
   - Call `palette.renderPresetSwatches()`.
   - Call `canvas.initCanvas(16)` (default size).
   - Call `tools.setupToolListeners()`.
   - Call `palette.setupPaletteListeners(onColourChange)`.
   - Call `export.setupExportListener(canvas.getGridData, canvas.getGridSize)`.
   - Call `canvas.setupCanvasListeners(onCellAction)`.
   - Set up size button listeners.
   - Set up clear button listener.
   - Set up undo/redo button listeners.
   - Set up keyboard shortcut listener.
3. Define `onCellAction(row, col)`:
   - On first cell of a stroke (pointerdown), push current `gridData` to history.
   - Call `tools.applyTool(row, col, palette.getCurrentColour(), canvasAPI)`.
   - If tool returns a colour (eyedropper), call `palette.setCurrentColour(colour)`.
4. Define `onColourChange(hex)`:
   - Stores new colour in palette; no other side effects needed.
5. Size button click handler:
   - Remove `.active` from all `.size-btn`, add to clicked.
   - Call `canvas.resizeCanvas(parseInt(button.dataset.size))`.
   - Call `history.clearHistory()`.
6. Clear button handler:
   - Call `canvas.clearCanvas()`.
7. Undo handler:
   - Call `history.undo(canvas.getGridData())`. If returns data, call `canvas.setGridData(data)`.
8. Redo handler:
   - Call `history.redo(canvas.getGridData())`. If returns data, call `canvas.setGridData(data)`.
9. Keyboard shortcuts (on `keydown`):
   - `p` → `tools.setActiveTool('pencil')`
   - `e` → `tools.setActiveTool('eraser')`
   - `f` → `tools.setActiveTool('fill')`
   - `i` → `tools.setActiveTool('picker')`
   - `Ctrl+Z` / `Cmd+Z` → undo
   - `Ctrl+Y` / `Cmd+Y` → redo
   - `Ctrl+S` / `Cmd+S` → prevent default, export PNG

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | none | `void` | Main initialisation, called on `DOMContentLoaded`. |
| `onCellAction(row, col)` | `row: number`, `col: number` | `void` | Central handler: dispatches current tool to the given cell. |
| `onColourChange(hex)` | `hex: string` | `void` | Callback passed to palette so other modules are notified. |
| `handleKeyboard(event)` | `event: KeyboardEvent` | `void` | Maps key presses to tool switches, undo, redo, export. |

---

## 7. Algorithms

### 7.1 Flood Fill (BFS)

Used by the fill tool to paint all contiguous pixels of the same colour.

```text
FUNCTION floodFill(gridData, gridSize, startRow, startCol, newColour):
    targetColour ← gridData[startRow][startCol]

    IF targetColour === newColour THEN
        RETURN                         // nothing to do

    queue ← empty Queue
    visited ← Set of "row,col" strings

    ENQUEUE (startRow, startCol)
    ADD "startRow,startCol" to visited

    WHILE queue is not empty:
        (row, col) ← DEQUEUE

        IF gridData[row][col] !== targetColour THEN
            CONTINUE                   // skip non-matching neighbours

        gridData[row][col] ← newColour
        update DOM cell at (row, col)

        FOR EACH (dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr ← row + dr
            nc ← col + dc
            key ← "nr,nc"

            IF 0 ≤ nr < gridSize AND 0 ≤ nc < gridSize AND key NOT IN visited:
                ADD key to visited
                ENQUEUE (nr, nc)
```

**Why BFS over DFS?** BFS avoids deep recursion stack overflow risk on large grids (64×64 = 4,096 cells). A queue-based approach using an array with `shift()` or a simple ring buffer keeps memory predictable. Alternatively, an iterative DFS with an explicit stack works equally well; BFS is chosen here for clarity.

**Complexity:** O(n) where n = number of cells in the filled region. Each cell is visited at most once.

### 7.2 Grid-to-Canvas Conversion (PNG Export)

```text
FUNCTION gridToCanvas(gridData, gridSize, pixelScale):
    canvasWidth  ← gridSize × pixelScale
    canvasHeight ← gridSize × pixelScale

    CREATE offscreen <canvas> element (canvasWidth × canvasHeight)
    ctx ← canvas.getContext('2d')

    FOR row FROM 0 TO gridSize - 1:
        FOR col FROM 0 TO gridSize - 1:
            colour ← gridData[row][col]
            IF colour is empty:
                colour ← '#ffffff'      // default white background

            ctx.fillStyle ← colour
            ctx.fillRect(col × pixelScale, row × pixelScale, pixelScale, pixelScale)

    RETURN canvas
```

The resulting `<canvas>` is converted to a PNG blob via `canvas.toBlob()`, which yields a downloadable file. `pixelScale = 16` means a 16×16 grid produces a 256×256 px image; a 64×64 grid produces a 1024×1024 px image.

---

## 8. Data Structure

### 8.1 Primary Data Model — `gridData`

```js
/**
 * 2D array representing the pixel canvas.
 *
 * gridData[row][col] = hex colour string (e.g. '#ff0000') or '' (empty/white).
 *
 * Example for a 4×4 grid:
 * [
 *   ['#000000', '',        '#ff0000', ''],
 *   ['',        '#00ff00', '',        ''],
 *   ['',        '',        '',        '#0000ff'],
 *   ['#ffff00', '',        '',        ''],
 * ]
 */
let gridData = [];
```

- **Dimensions:** Always square: `gridSize × gridSize`.
- **Index mapping:** `gridData[row][col]` where `row` = 0 is the top row, `col` = 0 is the leftmost column.
- **DOM mapping:** The flat list of pixel `<div>` elements maps to index `row * gridSize + col`.
- **Empty cell:** Represented by empty string `''`. On render and export, treated as `#ffffff` (white).
- **Deep copy for history:** `gridData.map(row => [...row])` — each row is a flat array of strings, so spread is sufficient.

### 8.2 History Stacks

```js
undoStack = [snapshot0, snapshot1, ...];   // most recent at end
redoStack = [snapshot0, snapshot1, ...];   // most recent at end
// Each snapshot is a string[][], a deep copy of gridData at that point in time.
```

### 8.3 Recent Colours

```js
recentColours = ['#ff0000', '#00ff00', '#0000ff', ...];  // max 8, newest first
```

---

## 9. Accessibility

### 9.1 Keyboard Shortcuts

| Key | Action |
|---|---|
| `P` | Select pencil tool |
| `E` | Select eraser tool |
| `F` | Select fill tool |
| `I` | Select eyedropper / picker tool |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+S` / `Cmd+S` | Export PNG (prevents browser save dialog) |

### 9.2 ARIA Attributes

- Toolbar: `role="toolbar"`, `aria-label="Drawing tools"`.
- Each tool button: `aria-label="Pencil tool"`, `aria-pressed="true|false"`, `title` with shortcut hint.
- Pixel canvas: `role="grid"`, `aria-label="Pixel art canvas"`.
- Colour swatches: `role="list"` on container, `role="listitem"` on each swatch.
- Undo/redo buttons: `aria-label`, `aria-disabled` synced with `disabled` attribute.
- Colour input: `aria-label="Choose colour"`.
- Size buttons: `aria-label` describing the dimension (e.g. "16 by 16 canvas").

### 9.3 Focus Management

- All interactive elements are focusable via Tab.
- Visible focus ring using `:focus-visible` with `outline: 2px solid var(--accent)`.
- Tool buttons and size buttons support Enter/Space activation (native `<button>` behaviour).
- Keyboard shortcuts only fire when no `<input>` is focused (check `event.target.tagName`).

### 9.4 Screen Reader Considerations

- `aria-pressed` on tool buttons toggles correctly to announce active state.
- Undo/redo buttons announce "disabled" when stack is empty.
- Colour swatches announce their hex code via `aria-label`.

---

## 10. Step-by-Step Build Order

### Phase 1 — Static Shell

1. Create `index.html` with full semantic structure (header, sidebar, main, footer).
2. Create `styles/main.css` with CSS variables, reset, layout (flexbox shell, sidebar width, canvas area).
3. Style the header, footer, and sidebar sections (no interactivity yet).
4. Verify layout at desktop width; confirm sidebar + canvas area fill the viewport.

### Phase 2 — Pixel Canvas

5. Create `js/modules/canvas.js` with `initCanvas()` and `renderGrid()`.
6. Create `js/main.js` — import canvas module, call `initCanvas(16)` on `DOMContentLoaded`.
7. Style `.pixel-canvas` grid and `.pixel` cells in CSS.
8. Verify: a 16×16 grid of empty white cells renders centred in the canvas area.

### Phase 3 — Pencil Drawing

9. Implement `setupCanvasListeners()` in canvas.js with pointer events.
10. Create `js/modules/tools.js` with `pencil()` function.
11. Wire `onCellAction` in main.js: pencil draws black pixels on click/drag.
12. Verify: clicking and dragging paints black pixels.

### Phase 4 — Colour Palette

13. Create `js/modules/palette.js` with state, preset rendering, and colour input binding.
14. Wire palette to main.js: selecting a colour updates current drawing colour.
15. Style swatches grid and colour input in CSS.
16. Verify: clicking a swatch or using the colour picker changes the drawing colour.

### Phase 5 — Eraser and Fill

17. Implement `eraser()` in tools.js.
18. Implement `fill()` with BFS flood algorithm in tools.js.
19. Add tool-switching logic: `setupToolListeners()`, `setActiveTool()`.
20. Wire tool buttons in main.js.
21. Style active tool button state.
22. Verify: eraser clears pixels; fill floods a region correctly.

### Phase 6 — Eyedropper

23. Implement `eyedropper()` in tools.js.
24. In main.js, when tool returns a colour, update palette.
25. Verify: clicking a coloured pixel with picker selects that colour.

### Phase 7 — Canvas Sizing

26. Add click listeners for `.size-btn` elements in main.js.
27. Implement `resizeCanvas()` in canvas.js.
28. Verify: switching size regenerates the grid at the chosen dimension.

### Phase 8 — Undo/Redo

29. Create `js/modules/history.js` with push, undo, redo, clear, and button management.
30. In main.js, push state to history before each stroke begins (on `pointerdown`).
31. In canvas.js, push state before clear/resize.
32. Wire undo/redo buttons and keyboard shortcuts.
33. Verify: drawing then undoing restores the previous state; redo re-applies.

### Phase 9 — PNG Export

34. Create `js/modules/export.js` with `exportToPNG()` and `triggerDownload()`.
35. Wire export button and `Ctrl+S` shortcut.
36. Verify: clicking export downloads a PNG image matching the canvas.

### Phase 10 — Polish

37. Add recent-colours strip rendering and interaction.
38. Add hover effect on pixel cells (subtle highlight).
39. Add keyboard shortcuts for tools and display in footer.
40. Style responsive breakpoints (900px, 600px).
41. Add `cursor: crosshair` to canvas, `cursor: pointer` to buttons.
42. Test full flow end-to-end: draw, switch tools, undo/redo, resize, export.

### Phase 11 — Final Review

43. Validate HTML (no errors, proper semantics).
44. Confirm all ARIA attributes are correct and screen reader announces tools properly.
45. Test on Chrome, Firefox, Safari.
46. Confirm all relative paths work when opening `index.html` via file system and via local server.
47. Write/verify `README.md` accuracy.

---

## 11. Stretch Goals

### 11.1 Layers

- Add a layers panel to the sidebar (below tools).
- Data model extends to `layers: { name: string, visible: boolean, gridData: string[][] }[]`.
- Active layer determines which `gridData` is drawn/read.
- Render composites all visible layers (bottom-up) into a single displayed grid.
- Each layer can be toggled visible/hidden, reordered, deleted, or renamed.
- Export merges all visible layers before PNG conversion.

### 11.2 Animation Frames

- Add a timeline strip at the bottom of the canvas area.
- Each frame is a snapshot (or set of layers).
- Data model: `frames: { layers: Layer[] }[]`, with a `currentFrameIndex`.
- Play button cycles through frames at a configurable FPS (e.g. 4, 8, 12).
- Onion skinning: previous frame rendered at 20% opacity behind current frame.
- Export options: animated GIF (using a library like `gif.js`) or sprite sheet PNG.

### 11.3 Save / Load Projects

- Serialise entire project state (grid data, grid size, palette, layers, frames) to JSON.
- Save: `JSON.stringify()` + `Blob` + download as `.json` file.
- Load: file input (`<input type="file" accept=".json">`), `FileReader`, `JSON.parse()`, restore state.
- Optional: use `localStorage` for auto-saving the current session, with a "Restore last session?" prompt on load.

### 11.4 Additional Stretch Ideas

- **Symmetry mode:** Mirror drawing across X/Y axis.
- **Line tool:** Click start and end points; render a pixel-perfect line (Bresenham's algorithm).
- **Rectangle / Ellipse tools:** Draw outlined or filled shapes.
- **Zoom control:** Slider or scroll-wheel zoom on the canvas.
- **Custom grid sizes:** Free-form number input instead of fixed presets.
- **Transparent background:** Toggle grid background between white and checkerboard (transparency indicator).
- **Right-click secondary colour:** Draw with a secondary colour on right-click.

---

*End of implementation plan.*
