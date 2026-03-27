# Colour Palette Generator — Implementation Plan

## 1. Overview

Build a browser-based colour palette generator that displays five harmonious colour swatches side by side. Users can:

- Generate a new palette on page load, by clicking a button, or by pressing the spacebar.
- Select a harmony mode (random, complementary, analogous, triadic, split-complementary, monochromatic) to control how the five colours relate.
- Click any hex or RGB value to copy it to the clipboard, with a brief "Copied!" tooltip.
- Lock individual swatches so they survive regeneration — only unlocked swatches receive new colours.
- View swatches at full viewport height on desktop; stacked vertically on mobile.

The palette colours themselves are the primary visual element. The surrounding UI chrome is intentionally minimal so that the generated colours dominate the screen.

---

## 2. Page Layout

### 2.1 Desktop Wireframe (≥ 768 px)

```text
┌──────────────────────────────────────────────────────────────────────┐
│  TOOLBAR  [ Harmony Mode ▼ ]              [ Generate ]              │
├────────────┬────────────┬────────────┬────────────┬────────────────-─┤
│            │            │            │            │                  │
│            │            │            │            │                  │
│   SWATCH   │   SWATCH   │   SWATCH   │   SWATCH   │     SWATCH      │
│     1      │     2      │     3      │     4      │       5         │
│            │            │            │            │                  │
│            │            │            │            │                  │
│  🔓 / 🔒  │  🔓 / 🔒  │  🔓 / 🔒  │  🔓 / 🔒  │   🔓 / 🔒      │
│  #A1B2C3   │  #D4E5F6   │  #789ABC   │  #DEF012   │   #345678       │
│ rgb(…)     │ rgb(…)     │ rgb(…)     │ rgb(…)     │  rgb(…)         │
│            │            │            │            │                  │
├────────────┴────────────┴────────────┴────────────┴─────────────────-┘
```

- **Toolbar**: fixed at the top; contains the harmony-mode `<select>` dropdown on the left and the Generate button on the right. Semi-transparent dark background so it floats over the palette without hiding colour.
- **Swatches**: five equal-width columns occupying the full remaining viewport height (`calc(100vh - toolbar height)`). Each swatch's background is its generated colour.
- **Swatch content** (vertically centred inside each column):
  1. Lock toggle button (unlocked padlock icon by default; filled/locked padlock when active).
  2. Hex code displayed in large text (e.g. `#A1B2C3`).
  3. RGB value displayed below in smaller text (e.g. `rgb(161, 178, 195)`).
- Text colour on each swatch is dynamically white or black based on the background's relative luminance (see §8).

### 2.2 Mobile Wireframe (< 768 px)

```text
┌──────────────────────────┐
│ TOOLBAR  [Mode▼] [Gen]   │
├──────────────────────────┤
│      SWATCH 1            │
│   🔓  #A1B2C3  rgb(…)   │
├──────────────────────────┤
│      SWATCH 2            │
│   🔓  #D4E5F6  rgb(…)   │
├──────────────────────────┤
│      SWATCH 3            │
│   🔓  #789ABC  rgb(…)   │
├──────────────────────────┤
│      SWATCH 4            │
│   🔓  #DEF012  rgb(…)   │
├──────────────────────────┤
│      SWATCH 5            │
│   🔓  #345678  rgb(…)   │
└──────────────────────────┘
```

Swatches stack vertically, each taking `20vh` (five fill the viewport). The toolbar becomes compact with shorter labels.

---

## 3. Colour Scheme and Typography

### 3.1 UI Chrome Colours

The palettes themselves supply all visual colour. The small amount of UI chrome around them uses a neutral palette:

| Element | Hex | Usage |
|---|---|---|
| Toolbar background | `#1a1a2e` at 90 % opacity | Dark semi-transparent bar above swatches |
| Toolbar text / icons | `#e0e0e0` | Labels and button text |
| Generate button bg | `#16213e` | Primary action button |
| Generate button hover | `#0f3460` | Hover / focus state |
| Generate button text | `#ffffff` | Button label |
| Focus ring | `#e94560` | Keyboard-focus outline for accessibility |
| Tooltip background | `#1a1a2e` | "Copied!" tooltip |
| Tooltip text | `#ffffff` | Tooltip label |

### 3.2 Typography

- **Font stack**: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`.
- **Hex code**: `1.8rem`, `font-weight: 700`, uppercase, `letter-spacing: 0.05em`.
- **RGB value**: `1rem`, `font-weight: 400`.
- **Toolbar text**: `0.9rem`, `font-weight: 500`.
- **Tooltip**: `0.8rem`, `font-weight: 600`.

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colour Palette Generator</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <!-- Toolbar -->
  <header class="toolbar" role="banner">
    <h1 class="toolbar__title">Palette Generator</h1>

    <div class="toolbar__controls">
      <label for="harmony-mode" class="toolbar__label">Mode</label>
      <select id="harmony-mode" class="toolbar__select">
        <option value="random" selected>Random</option>
        <option value="complementary">Complementary</option>
        <option value="analogous">Analogous</option>
        <option value="triadic">Triadic</option>
        <option value="split-complementary">Split-Complementary</option>
        <option value="monochromatic">Monochromatic</option>
      </select>

      <button id="generate-btn" class="toolbar__button" type="button">
        Generate
      </button>
    </div>
  </header>

  <!-- Palette -->
  <main class="palette" role="main">
    <!-- Repeated five times (index 0 – 4) -->
    <section class="swatch" data-index="0" aria-label="Colour swatch 1">
      <button
        class="swatch__lock"
        type="button"
        aria-pressed="false"
        aria-label="Lock colour 1"
      >
        <!-- Unlocked padlock SVG icon -->
      </button>

      <div class="swatch__values">
        <span
          class="swatch__hex"
          role="button"
          tabindex="0"
          aria-label="Copy hex value"
        >
          #A1B2C3
        </span>
        <span
          class="swatch__rgb"
          role="button"
          tabindex="0"
          aria-label="Copy RGB value"
        >
          rgb(161, 178, 195)
        </span>
      </div>

      <!-- Tooltip (hidden by default) -->
      <span class="swatch__tooltip" aria-live="polite" role="status">
        Copied!
      </span>
    </section>
    <!-- … swatches 1 – 4 … -->
  </main>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Markup Notes

- Each swatch is a `<section>` with `data-index` for JS targeting.
- Hex and RGB spans have `role="button"` and `tabindex="0"` so they are keyboard-activatable.
- The lock button uses `aria-pressed` to convey toggle state to screen readers.
- The tooltip `<span>` uses `aria-live="polite"` so assistive tech announces "Copied!" without focus moving.
- All paths are relative (`styles/main.css`, `js/main.js`).

---

## 5. CSS Design

### 5.1 File: `styles/main.css`

#### 5.1.1 Reset and Base

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* UI chrome variables */
  --toolbar-bg: rgba(26, 26, 46, 0.9);
  --toolbar-text: #e0e0e0;
  --btn-bg: #16213e;
  --btn-hover: #0f3460;
  --btn-text: #ffffff;
  --focus-ring: #e94560;
  --tooltip-bg: #1a1a2e;
  --tooltip-text: #ffffff;
  --toolbar-height: 56px;
  --font-stack: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--font-stack);
  overflow: hidden;           /* prevent scroll on desktop */
}
```

#### 5.1.2 Toolbar

```css
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--toolbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: var(--toolbar-bg);
  color: var(--toolbar-text);
  z-index: 100;
  backdrop-filter: blur(6px);
}
```

#### 5.1.3 Palette Flex Layout

```css
.palette {
  display: flex;
  width: 100%;
  height: calc(100vh - var(--toolbar-height));
  margin-top: var(--toolbar-height);
}

.swatch {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.4s ease;
  cursor: default;
}
```

Each swatch takes exactly `1/5` of the viewport width. Backgrounds are set via inline `style="background-color: …"` by JS.

#### 5.1.4 Swatch Content

```css
.swatch__hex {
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: all;
}

.swatch__rgb {
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.4rem;
  cursor: pointer;
  user-select: all;
}

.swatch__hex:hover,
.swatch__rgb:hover {
  text-decoration: underline;
}
```

#### 5.1.5 Lock Button Toggle

```css
.swatch__lock {
  background: none;
  border: 2px solid currentColor;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-bottom: 1rem;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}

.swatch__lock:hover,
.swatch__lock:focus-visible {
  opacity: 1;
  transform: scale(1.1);
}

.swatch__lock[aria-pressed="true"] {
  opacity: 1;
  /* filled padlock icon swap handled by toggling a CSS class or swapping SVG content */
}
```

#### 5.1.6 Copy Feedback Tooltip Animation

```css
.swatch__tooltip {
  position: absolute;
  bottom: 20%;
  background: var(--tooltip-bg);
  color: var(--tooltip-text);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.swatch__tooltip--visible {
  opacity: 1;
  transform: translateY(0);
}
```

JS adds the `--visible` modifier, waits ~1.5 s, then removes it.

#### 5.1.7 Responsive — Mobile (< 768 px)

```css
@media (max-width: 767px) {
  body {
    overflow-y: auto;
  }

  .palette {
    flex-direction: column;
    height: auto;
  }

  .swatch {
    height: 20vh;
    min-height: 120px;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem;
  }

  .swatch__lock {
    margin-bottom: 0;
    margin-right: 1rem;
  }
}
```

#### 5.1.8 Focus Styles

```css
*:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```

---

## 6. JavaScript Architecture

### 6.0 File Tree

```text
js/
├── main.js
└── modules/
    ├── generator.js
    ├── colour.js
    ├── palette.js
    ├── clipboard.js
    └── ui.js
```

---

### 6.1 `main.js` — Entry Point

**Purpose**: initialise app, wire up event listeners, import modules.

```text
Imports:
  - generatePalette   from './modules/generator.js'
  - { getState }       from './modules/palette.js'
  - { renderSwatches } from './modules/ui.js'
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `init()` | — | `void` | Called on `DOMContentLoaded`. Generates the first palette, renders swatches, attaches listeners. |
| `handleGenerate()` | — | `void` | Reads selected harmony mode, calls `generatePalette()`, calls `renderSwatches()`. |
| `handleKeydown(event)` | `KeyboardEvent` | `void` | If `event.code === 'Space'` and target is not an input/button, calls `handleGenerate()`. Prevents default scroll. |

#### Event Listeners Attached

| Target | Event | Handler |
|---|---|---|
| `document` | `DOMContentLoaded` | `init` |
| `#generate-btn` | `click` | `handleGenerate` |
| `document` | `keydown` | `handleKeydown` |
| `#harmony-mode` | `change` | `handleGenerate` (regenerate immediately on mode change) |

---

### 6.2 `modules/generator.js` — Colour Generation and Harmony Algorithms

**Purpose**: produce an array of five HSL colour objects according to the chosen harmony mode.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `generatePalette(mode, lockedIndices, currentColours)` | `mode: string`, `lockedIndices: number[]`, `currentColours: HSL[]` | `HSL[]` (length 5) | Dispatches to the appropriate harmony function. Replaces only unlocked slots. |
| `randomPalette()` | — | `HSL[]` | Returns 5 independently random HSL colours. |
| `complementaryPalette()` | — | `HSL[]` | Generates a base hue then fills 5 slots using complementary logic (see §7.2). |
| `analogousPalette()` | — | `HSL[]` | Generates 5 colours within a 30° spread (see §7.3). |
| `triadicPalette()` | — | `HSL[]` | Generates 3 triad hues then adds 2 saturation/lightness variants (see §7.4). |
| `splitComplementaryPalette()` | — | `HSL[]` | Base + two colours ±30° from the complement, plus 2 variants (see §7.5). |
| `monochromaticPalette()` | — | `HSL[]` | Single hue with 5 different saturation/lightness steps (see §7.6). |
| `randomHue()` | — | `number` | Returns a random integer 0–359. |
| `randomSaturation()` | — | `number` | Returns a random integer 40–90 (avoids dull or fully saturated). |
| `randomLightness()` | — | `number` | Returns a random integer 25–75 (avoids near-black and near-white). |
| `clampHue(h)` | `h: number` | `number` | Wraps hue into 0–359 using modulo. |

---

### 6.3 `modules/colour.js` — Colour Conversions and Manipulation

**Purpose**: convert between HSL, RGB, and HEX representations; compute relative luminance.

#### Type Definitions

```js
/** @typedef {{ h: number, s: number, l: number }} HSL  – h: 0-359, s: 0-100, l: 0-100 */
/** @typedef {{ r: number, g: number, b: number }} RGB  – each 0-255 */
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `hslToRgb(h, s, l)` | `h: number (0-359)`, `s: number (0-100)`, `l: number (0-100)` | `RGB` | Converts HSL to RGB using the standard algorithm (chroma, intermediate, match). |
| `rgbToHex(r, g, b)` | `r: number`, `g: number`, `b: number` | `string` | Returns uppercase hex string, e.g. `#A1B2C3`. Pads single-digit channels with leading zero. |
| `hslToHex(h, s, l)` | `h`, `s`, `l` | `string` | Convenience: `hslToRgb` → `rgbToHex`. |
| `hexToRgb(hex)` | `hex: string` | `RGB` | Parses a `#RRGGBB` string into `{ r, g, b }`. |
| `rgbToHsl(r, g, b)` | `r`, `g`, `b` | `HSL` | Converts RGB to HSL. |
| `relativeLuminance(r, g, b)` | `r`, `g`, `b` (0-255) | `number` (0-1) | Computes WCAG relative luminance (see §8). |
| `contrastTextColour(r, g, b)` | `r`, `g`, `b` | `string` (`'#ffffff'` or `'#000000'`) | Returns white or black depending on luminance threshold (see §8). |
| `formatRgb(r, g, b)` | `r`, `g`, `b` | `string` | Returns `rgb(r, g, b)` display string. |

---

### 6.4 `modules/palette.js` — Palette State Management

**Purpose**: hold the current palette's five colours and their lock states; expose methods to mutate state immutably.

#### Internal State

```js
let state = {
  colours: [null, null, null, null, null],   // HSL objects
  locked:  [false, false, false, false, false]
};
```

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `getState()` | — | `{ colours: HSL[], locked: boolean[] }` | Returns a shallow copy of the current state. |
| `setColours(newColours)` | `newColours: HSL[]` | `void` | Replaces the colours array. Only overwrites indices that are NOT locked. |
| `toggleLock(index)` | `index: number (0-4)` | `boolean` | Flips the lock at `index` and returns the new lock value. |
| `isLocked(index)` | `index: number` | `boolean` | Returns the lock state for a given index. |
| `getLockedIndices()` | — | `number[]` | Returns an array of indices that are currently locked. |
| `getCurrentColours()` | — | `HSL[]` | Returns the colours array (used when regenerating so locked colours can be preserved). |

---

### 6.5 `modules/clipboard.js` — Copy to Clipboard with Feedback

**Purpose**: copy a string to the system clipboard and trigger visual feedback.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `copyToClipboard(text)` | `text: string` | `Promise<boolean>` | Uses `navigator.clipboard.writeText(text)`. Returns `true` on success, `false` on failure. Wrapped in `try/catch`. |
| `showCopyFeedback(swatchElement)` | `swatchElement: HTMLElement` | `void` | Adds `swatch__tooltip--visible` class to the tooltip inside the swatch, then removes it after 1 500 ms with `setTimeout`. |

---

### 6.6 `modules/ui.js` — Rendering and DOM Updates

**Purpose**: render swatch backgrounds, text values, and text colour; handle lock icon state.

#### Functions

| Function | Params | Returns | Purpose |
|---|---|---|---|
| `renderSwatches(state)` | `state: { colours: HSL[], locked: boolean[] }` | `void` | Iterates over all 5 swatch elements. For each: sets `background-color`, updates hex text, updates RGB text, sets text `color` via `contrastTextColour()`, sets lock button `aria-pressed`. |
| `updateSwatchBackground(el, hex)` | `el: HTMLElement`, `hex: string` | `void` | Sets `el.style.backgroundColor` to `hex`. |
| `updateSwatchText(el, hex, rgbString, textColour)` | `el`, `hex`, `rgbString`, `textColour` | `void` | Sets the hex span's `textContent`, the RGB span's `textContent`, and both spans' `color` plus the lock button's `color`. |
| `updateLockIcon(buttonEl, isLocked)` | `buttonEl: HTMLButtonElement`, `isLocked: boolean` | `void` | Swaps the inner SVG between locked/unlocked padlock. Sets `aria-pressed` to match. |
| `getSwatchElements()` | — | `HTMLElement[]` | Returns the five `.swatch` elements as an array. |
| `attachSwatchListeners(onCopy, onToggleLock)` | `onCopy: (index, valueType) => void`, `onToggleLock: (index) => void` | `void` | Attaches `click` and `keydown (Enter)` listeners to each hex span, RGB span, and lock button. |

---

## 7. Colour Theory Algorithms

All harmony calculations operate in **HSL space** because hue is a single angular value on the colour wheel, making rotational harmony straightforward.

### 7.1 Random

No constraints. Each of the 5 colours receives an independently random H (0–359), S (40–90), and L (25–75).

### 7.2 Complementary

Two hues sit 180° apart on the wheel.

1. Pick a random base hue `H₀`.
2. Compute complement `H₁ = (H₀ + 180) % 360`.
3. Fill 5 slots:
   - Slot 0: `(H₀, S_rand, L_rand)`
   - Slot 1: `(H₀, S_rand, L_rand ± 15)` — lighter/darker variant of base
   - Slot 2: `(H₁, S_rand, L_rand)`
   - Slot 3: `(H₁, S_rand, L_rand ± 15)` — variant of complement
   - Slot 4: `((H₀ + 90) % 360, S_low, L_mid)` — neutral accent at 90°

### 7.3 Analogous

Colours sit within a ~60° arc.

1. Pick a random base hue `H₀`.
2. Define spread = 30°.
3. Compute hues: `H₀ - 2×spread`, `H₀ - spread`, `H₀`, `H₀ + spread`, `H₀ + 2×spread`.
   - i.e. offsets of `−60°, −30°, 0°, +30°, +60°`, each clamped via modulo.
4. Vary saturation (50–80) and lightness (35–65) slightly per slot for visual interest.

**Formulas:**

```text
Hᵢ = (H₀ + (i − 2) × 30) mod 360    for i = 0…4
Sᵢ = rand(50, 80)
Lᵢ = rand(35, 65)
```

### 7.4 Triadic

Three hues equally spaced at 120°.

1. Pick `H₀`.
2. `H₁ = (H₀ + 120) % 360`.
3. `H₂ = (H₀ + 240) % 360`.
4. Fill 5 slots:
   - Slot 0: `(H₀, S_rand, L_rand)`
   - Slot 1: `(H₁, S_rand, L_rand)`
   - Slot 2: `(H₂, S_rand, L_rand)`
   - Slot 3: `(H₀, S_rand, L_rand ± 20)` — variant of H₀
   - Slot 4: `(H₁, S_rand, L_rand ± 20)` — variant of H₁

**Formulas:**

```text
H₁ = (H₀ + 120) mod 360
H₂ = (H₀ + 240) mod 360
```

### 7.5 Split-Complementary

The complement is replaced by the two hues flanking it.

1. Pick `H₀`.
2. Complement = `(H₀ + 180) % 360`.
3. Split hues:
   - `H₁ = (H₀ + 150) % 360`  (complement − 30°)
   - `H₂ = (H₀ + 210) % 360`  (complement + 30°)
4. Fill 5 slots:
   - Slot 0: `(H₀, S_rand, L_rand)`
   - Slot 1: `(H₁, S_rand, L_rand)`
   - Slot 2: `(H₂, S_rand, L_rand)`
   - Slot 3: `(H₀, S_rand, L_rand ± 15)` — base variant
   - Slot 4: `(H₁, S_rand, L_rand ± 15)` — split variant

**Formulas:**

```text
H₁ = (H₀ + 150) mod 360
H₂ = (H₀ + 210) mod 360
```

### 7.6 Monochromatic

Single hue; variety comes from saturation and lightness.

1. Pick `H₀`.
2. Define 5 lightness steps evenly spaced across 20–80 %:
   - `L = [20, 35, 50, 65, 80]`
3. Vary saturation slightly around a random base S (±10):
   - `S_base = rand(50, 80)`
   - `Sᵢ = clamp(S_base + rand(-10, 10), 20, 95)`

**Formulas:**

```text
Hᵢ = H₀                        (constant)
Lᵢ = 20 + i × 15                for i = 0…4
Sᵢ = clamp(S_base + δ, 20, 95)  where δ ∈ [-10, 10]
```

---

## 8. Contrast Detection

To ensure readability, text on each swatch must be white or black depending on the swatch background.

### 8.1 Relative Luminance (WCAG 2.1)

Given an RGB colour where each channel is 0–255:

```text
1. Convert each channel to sRGB:
   R_srgb = R / 255
   G_srgb = G / 255
   B_srgb = B / 255

2. Linearize each channel:
   if C_srgb ≤ 0.04045  →  C_lin = C_srgb / 12.92
   else                 →  C_lin = ((C_srgb + 0.055) / 1.055) ^ 2.4

3. Compute relative luminance:
   L = 0.2126 × R_lin + 0.7152 × G_lin + 0.0722 × B_lin
```

### 8.2 Decision Threshold

```text
if L > 0.179  →  use BLACK text (#000000)
else          →  use WHITE text (#ffffff)
```

The 0.179 threshold (approximately the midpoint for perceptual brightness) provides a contrast ratio of at least 4.5 : 1 against both choices in most practical cases.

### 8.3 Implementation in `colour.js`

```js
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastTextColour(r, g, b) {
  return relativeLuminance(r, g, b) > 0.179 ? '#000000' : '#ffffff';
}
```

---

## 9. Accessibility

### 9.1 Keyboard Navigation

| Key | Context | Action |
|---|---|---|
| `Space` | Anywhere (unless focus is on input/select/button) | Generate a new palette |
| `Enter` | Focus on hex or RGB value | Copy value to clipboard |
| `Enter` / `Space` | Focus on lock button | Toggle lock |
| `Tab` | General | Cycle through toolbar controls, then each swatch's lock → hex → RGB |

The `handleKeydown` function in `main.js` checks `event.target.tagName` to avoid capturing spacebar presses inside the `<select>` or `<button>` elements.

### 9.2 ARIA Attributes

| Element | Attribute | Value | Reason |
|---|---|---|---|
| Lock button | `aria-pressed` | `"true"` / `"false"` | Communicates toggle state |
| Lock button | `aria-label` | `"Lock colour N"` | Descriptive label |
| Hex / RGB spans | `role` | `"button"` | Communicates clickability |
| Hex / RGB spans | `tabindex` | `"0"` | Makes non-button elements focusable |
| Hex / RGB spans | `aria-label` | `"Copy hex value"` / `"Copy RGB value"` | Describes action |
| Tooltip | `aria-live` | `"polite"` | Announces "Copied!" to screen readers without moving focus |
| Tooltip | `role` | `"status"` | Semantic status message |
| Toolbar `<header>` | `role` | `"banner"` | Landmark for screen readers |
| `<main>` | `role` | `"main"` | Main-content landmark |

### 9.3 Focus Management

- All interactive elements receive a visible focus ring (`outline: 3px solid var(--focus-ring)`).
- Focus order follows DOM order: toolbar controls left-to-right, then each swatch's lock → hex → RGB, left-to-right across swatches.

---

## 10. Step-by-Step Build Order

### Phase 1 — Foundation

1. **Create `index.html`** with the full semantic structure (§4). Include all five swatch `<section>` elements with placeholder values. Link `styles/main.css` and `js/main.js`.
2. **Create `styles/main.css`** with the CSS reset, CSS variables, toolbar styles, and flex layout (§5.1.1 – §5.1.3). Verify the five swatches appear as equal columns filling the viewport.
3. **Style swatch content** — hex text, RGB text, lock button appearance (§5.1.4 – §5.1.5). Use hard-coded background colours temporarily to verify layout.

### Phase 2 — Colour Logic

4. **Create `js/modules/colour.js`** with `hslToRgb`, `rgbToHex`, `hslToHex`, `hexToRgb`, `rgbToHsl`, `relativeLuminance`, `contrastTextColour`, `formatRgb` (§6.3). Test each function with known values in the console.
5. **Create `js/modules/palette.js`** with state object, `getState`, `setColours`, `toggleLock`, `isLocked`, `getLockedIndices`, `getCurrentColours` (§6.4).
6. **Create `js/modules/generator.js`** starting with `randomPalette()` only (§6.2). Export `generatePalette(mode, …)` that dispatches to `randomPalette` for `mode === 'random'`.

### Phase 3 — Rendering

7. **Create `js/modules/ui.js`** with `renderSwatches`, `updateSwatchBackground`, `updateSwatchText`, `getSwatchElements` (§6.6). Import from `colour.js` for conversions and contrast.
8. **Create `js/main.js`** with `init`, `handleGenerate`, `handleKeydown` (§6.1). Wire up `DOMContentLoaded`, button click, and spacebar listeners. Verify a random palette renders on load and on button press.

### Phase 4 — Clipboard

9. **Create `js/modules/clipboard.js`** with `copyToClipboard` and `showCopyFeedback` (§6.5).
10. **Add copy feedback CSS** — tooltip styles and `--visible` animation (§5.1.6).
11. **Wire copy listeners in `ui.js`** via `attachSwatchListeners`. Verify clicking hex/RGB copies to clipboard and shows tooltip.

### Phase 5 — Lock Toggle

12. **Add lock toggle interaction** — `attachSwatchListeners` calls `onToggleLock(index)`, which calls `palette.toggleLock(index)`, then `ui.updateLockIcon(…)`.
13. **Modify `handleGenerate`** to pass `getLockedIndices()` and `getCurrentColours()` to `generatePalette`, which preserves locked slots.

### Phase 6 — Harmony Modes

14. **Implement `complementaryPalette()`** in `generator.js` (§7.2).
15. **Implement `analogousPalette()`** (§7.3).
16. **Implement `triadicPalette()`** (§7.4).
17. **Implement `splitComplementaryPalette()`** (§7.5).
18. **Implement `monochromaticPalette()`** (§7.6).
19. **Update `generatePalette` dispatch** to route each mode value to its function.

### Phase 7 — Responsive and Polish

20. **Add responsive CSS** (§5.1.7) for mobile breakpoint. Test on 375 px and 768 px viewports.
21. **Add focus styles** (§5.1.8) and verify keyboard navigation flow (§9).
22. **Cross-browser test** — verify in Chrome, Firefox, Safari, and Edge.
23. **Verify accessibility** — screen reader announces lock state changes and "Copied!" feedback.

---

## 11. Stretch Goals

### 11.1 Save Palettes to localStorage

- Add a ❤️ "Save" button in the toolbar.
- On click, serialise the current 5 HSL values into a JSON array and append to `localStorage.getItem('savedPalettes')`.
- Add a drawer/panel that lists saved palettes as small colour strips.
- Each saved palette can be clicked to restore it or deleted.

### 11.2 Export as CSS Variables

- Add an "Export CSS" button.
- On click, generate a string:

```css
:root {
  --palette-1: #A1B2C3;
  --palette-2: #D4E5F6;
  --palette-3: #789ABC;
  --palette-4: #DEF012;
  --palette-5: #345678;
}
```

- Copy the string to clipboard (reuse `clipboard.js`) and show feedback.

### 11.3 Colour Blindness Preview

- Add a "Simulate" dropdown with options: Protanopia, Deuteranopia, Tritanopia.
- Apply an SVG `<filter>` with a `<feColorMatrix>` to the `.palette` container using published colour-blindness simulation matrices.
- Toggling the dropdown applies/removes the CSS `filter: url(#filter-id)`.
- Matrices for each type:
  - **Protanopia** (red-blind): shift red channel toward green.
  - **Deuteranopia** (green-blind): shift green channel toward red.
  - **Tritanopia** (blue-blind): shift blue channel toward green.

This allows designers to verify that their palette remains distinguishable under common colour vision deficiencies.
