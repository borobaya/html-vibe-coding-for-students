# Meme Generator — Implementation Plan

## 1. Overview

The Meme Generator is a client-side web application that allows users to:

1. **Upload an image** — via file picker or drag-and-drop — to use as the meme background.
2. **Add top and bottom text** — classic meme-style captions rendered directly onto an HTML5 Canvas.
3. **Customise text appearance** — font family, font size, text colour, and stroke (outline) colour for each caption independently.
4. **Live preview** — every change to text or styling is reflected on the canvas in real time, with no manual refresh.
5. **Download as PNG** — export the finalised meme as a high-quality PNG file to the user's device with a single button click.

There are **no server dependencies, no build tools, and no external libraries**. The entire project runs in the browser using vanilla HTML5, CSS3, and JavaScript (ES2022+ with ES modules), as specified by the repository's copilot-instructions.

---

## 2. Page Layout

### 2.1 High-Level Wireframe

```text
┌─────────────────────────────────────────────────────────────┐
│  HEADER — "Meme Generator" title + subtitle                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │              DRAG & DROP / UPLOAD ZONE                │  │
│  │         (hidden once image is loaded)                 │  │
│  │   ┌─────────────────────────────────────────────┐     │  │
│  │   │  📁  Drag an image here or click to upload  │     │  │
│  │   │         Supports JPG, PNG, GIF, WebP        │     │  │
│  │   └─────────────────────────────────────────────┘     │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │               CANVAS PREVIEW AREA                     │  │
│  │      (visible once an image is loaded)                │  │
│  │                                                       │  │
│  │   ┌─────────────────────────────────────────────┐     │  │
│  │   │                                             │     │  │
│  │   │        TOP TEXT RENDERED HERE                │     │  │
│  │   │                                             │     │  │
│  │   │           (uploaded image)                   │     │  │
│  │   │                                             │     │  │
│  │   │       BOTTOM TEXT RENDERED HERE              │     │  │
│  │   │                                             │     │  │
│  │   └─────────────────────────────────────────────┘     │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   CONTROL PANEL                       │  │
│  │                                                       │  │
│  │  Top Text: [________________________]                 │  │
│  │  Bottom Text: [________________________]              │  │
│  │                                                       │  │
│  │  Font: [Impact ▼]    Size: [48 ▼]                     │  │
│  │  Text Colour: [■ #FFFFFF]   Stroke Colour: [■ #000]   │  │
│  │                                                       │  │
│  │  [ 🔄 Change Image ]   [ ⬇ Download Meme ]           │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER — "Made with ❤️" / credit line                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Zone Details

| Zone | Description |
|------|-------------|
| **Header** | App title "Meme Generator", short tagline "Upload, caption, download — instant memes". |
| **Upload Zone** | Dashed-border drop area. Contains a file input (hidden, triggered by click on the zone) and instructional text. Accepts `image/*` MIME types. Shown by default, hidden after successful upload. |
| **Canvas Preview** | An HTML `<canvas>` element, centred horizontally. Hidden until an image is loaded. Maintains the uploaded image's aspect ratio. Maximum display width of 600px (the internal canvas resolution matches the original image). |
| **Control Panel** | Two text inputs (top/bottom), a font dropdown, a size dropdown, two colour pickers, a "Change Image" button (re-shows upload zone), and a "Download Meme" button. Disabled until an image is loaded. |
| **Footer** | Minimal footer with project credit. |

### 2.3 Responsive Behaviour

- **Desktop (≥ 768px)**: Canvas and control panel sit in a single centred column, max-width 700px.
- **Mobile (< 768px)**: Full-width layout, controls stack vertically, font/size/colour controls wrap into a 2-column grid. Canvas scales to 100% container width.

---

## 3. Colour Scheme & Typography

### 3.1 Application UI Palette

| Role | Colour | Hex |
|------|--------|-----|
| Background (body) | Dark charcoal | `#1a1a2e` |
| Surface (cards, panels) | Deep navy | `#16213e` |
| Primary accent | Electric blue | `#0f3460` |
| Secondary accent / hover | Bright magenta | `#e94560` |
| Text (primary) | White | `#ffffff` |
| Text (secondary/muted) | Light grey | `#a0a0b0` |
| Upload zone border | Dashed, light grey | `#555577` |
| Upload zone border (drag-over) | Bright magenta | `#e94560` |
| Button background | Bright magenta | `#e94560` |
| Button hover | Lighter magenta | `#ff6b81` |
| Input background | Darker surface | `#0f3460` |
| Input border | Subtle grey | `#333355` |
| Input focus ring | Electric blue | `#4da6ff` |
| Success/download glow | Green accent | `#2ecc71` |

### 3.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| App title (h1) | `'Poppins', sans-serif` (Google Fonts) | 700 | 2rem |
| Subtitles / labels | `'Poppins', sans-serif` | 400 | 0.95rem |
| Input text | `'Poppins', sans-serif` | 400 | 1rem |
| Buttons | `'Poppins', sans-serif` | 600 | 1rem |
| **Meme top/bottom text (on canvas)** | `'Impact', 'Arial Black', sans-serif` | 900 | User-adjustable (default 48px) |

### 3.3 CSS Variables Declaration

```css
:root {
  --clr-bg: #1a1a2e;
  --clr-surface: #16213e;
  --clr-primary: #0f3460;
  --clr-accent: #e94560;
  --clr-accent-hover: #ff6b81;
  --clr-text: #ffffff;
  --clr-text-muted: #a0a0b0;
  --clr-input-bg: #0f3460;
  --clr-input-border: #333355;
  --clr-focus: #4da6ff;
  --clr-success: #2ecc71;
  --clr-zone-border: #555577;
  --ff-ui: 'Poppins', sans-serif;
  --ff-meme: 'Impact', 'Arial Black', sans-serif;
  --radius: 12px;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

---

## 4. HTML Structure

The single `index.html` file in `meme-generator/`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meme Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- HEADER -->
  <header class="app-header">
    <h1 class="app-header__title">Meme Generator</h1>
    <p class="app-header__subtitle">Upload, caption, download — instant memes</p>
  </header>

  <!-- MAIN CONTENT -->
  <main class="app-main">

    <!-- Upload Zone -->
    <section id="upload-section" class="upload-zone" aria-label="Image upload area">
      <div class="upload-zone__inner" id="drop-zone" tabindex="0" role="button" aria-label="Click or drag and drop an image to upload">
        <p class="upload-zone__icon">📁</p>
        <p class="upload-zone__text">Drag an image here or click to upload</p>
        <p class="upload-zone__hint">Supports JPG, PNG, GIF, WebP</p>
        <input
          type="file"
          id="file-input"
          class="upload-zone__input"
          accept="image/*"
          aria-label="Choose an image file"
        />
      </div>
    </section>

    <!-- Canvas Preview -->
    <section id="canvas-section" class="canvas-section canvas-section--hidden" aria-label="Meme preview">
      <canvas id="meme-canvas" class="canvas-section__canvas"></canvas>
    </section>

    <!-- Control Panel -->
    <section id="controls-section" class="controls" aria-label="Meme text and style controls">

      <!-- Text Inputs -->
      <div class="controls__group controls__group--text">
        <div class="controls__field">
          <label for="top-text" class="controls__label">Top Text</label>
          <input type="text" id="top-text" class="controls__input" placeholder="Enter top text…" maxlength="120" />
        </div>
        <div class="controls__field">
          <label for="bottom-text" class="controls__label">Bottom Text</label>
          <input type="text" id="bottom-text" class="controls__input" placeholder="Enter bottom text…" maxlength="120" />
        </div>
      </div>

      <!-- Style Controls -->
      <div class="controls__group controls__group--style">
        <div class="controls__field">
          <label for="font-select" class="controls__label">Font</label>
          <select id="font-select" class="controls__select">
            <option value="Impact" selected>Impact</option>
            <option value="Arial Black">Arial Black</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>
        <div class="controls__field">
          <label for="font-size" class="controls__label">Size</label>
          <select id="font-size" class="controls__select">
            <option value="24">24px</option>
            <option value="32">32px</option>
            <option value="40">40px</option>
            <option value="48" selected>48px</option>
            <option value="56">56px</option>
            <option value="64">64px</option>
            <option value="72">72px</option>
            <option value="80">80px</option>
          </select>
        </div>
        <div class="controls__field">
          <label for="text-colour" class="controls__label">Text Colour</label>
          <input type="color" id="text-colour" class="controls__colour" value="#ffffff" />
        </div>
        <div class="controls__field">
          <label for="stroke-colour" class="controls__label">Stroke Colour</label>
          <input type="color" id="stroke-colour" class="controls__colour" value="#000000" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="controls__group controls__group--actions">
        <button id="change-image-btn" class="btn btn--secondary" type="button">🔄 Change Image</button>
        <button id="download-btn" class="btn btn--primary" type="button" disabled>⬇ Download Meme</button>
      </div>

    </section>
  </main>

  <!-- FOOTER -->
  <footer class="app-footer">
    <p>Made with ❤️ — Meme Generator</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 4.1 Key HTML Decisions

- **`<canvas>`** — used instead of `<img>` because Canvas API allows direct pixel-level text rendering and composite export.
- **`type="file"` input** — hidden visually, triggered programmatically when the drop-zone is clicked.
- **`accept="image/*"`** — restricts file picker to image MIME types only.
- **`maxlength="120"`** — prevents excessively long text input that would overflow sensibly.
- **`disabled` on download button** — enabled only after an image is loaded.
- **All inputs have `<label>` elements** — required for accessibility.
- **`role="button"` and `tabindex="0"` on drop zone** — makes it keyboard-accessible and screen-reader-friendly.
- **`aria-label` attributes** — provide descriptive labels for sections and interactive elements.

---

## 5. CSS Design

### 5.1 File: `styles/main.css`

#### Global Reset & Base

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--ff-ui);
  background-color: var(--clr-bg);
  color: var(--clr-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

#### Upload Zone

```css
.upload-zone__inner {
  border: 3px dashed var(--clr-zone-border);
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.upload-zone__inner:hover,
.upload-zone__inner.drag-over {
  border-color: var(--clr-accent);
  background-color: rgba(233, 69, 96, 0.08);
}

.upload-zone__input {
  /* Visually hidden but still accessible */
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

#### Canvas Section

```css
.canvas-section {
  display: flex;
  justify-content: center;
}

.canvas-section--hidden {
  display: none;
}

.canvas-section__canvas {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

#### Control Panel

```css
.controls__group--style {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.controls__input,
.controls__select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: var(--clr-input-bg);
  border: 1px solid var(--clr-input-border);
  border-radius: 8px;
  color: var(--clr-text);
  font-size: 1rem;
}

.controls__input:focus,
.controls__select:focus {
  outline: none;
  border-color: var(--clr-focus);
  box-shadow: 0 0 0 3px rgba(77, 166, 255, 0.3);
}
```

#### Buttons

```css
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--ff-ui);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn:active {
  transform: scale(0.97);
}

.btn--primary {
  background: var(--clr-accent);
  color: var(--clr-text);
}

.btn--primary:hover:not(:disabled) {
  background: var(--clr-accent-hover);
}

.btn--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn--secondary {
  background: var(--clr-primary);
  color: var(--clr-text);
}
```

#### Responsive Breakpoint

```css
@media (max-width: 768px) {
  .controls__group--style {
    grid-template-columns: 1fr 1fr;
  }

  .controls__group--actions {
    flex-direction: column;
  }
}
```

---

## 6. JavaScript Architecture

All JavaScript lives under `meme-generator/js/`. Entry point is `main.js`, which imports from `modules/`.

```text
js/
├── main.js
└── modules/
    ├── upload.js
    ├── canvas.js
    ├── text.js
    ├── export.js
    └── ui.js
```

---

### 6.1 `main.js` — Entry Point & Event Wiring

**Purpose**: Imports all modules, queries DOM elements, attaches event listeners, and orchestrates the data flow between modules.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `init()` | _none_ | `void` | Called on `DOMContentLoaded`. Queries all DOM elements, stores references, calls `setupUploadListeners()`, `setupControlListeners()`, and `setupActionListeners()`. |
| `setupUploadListeners()` | _none_ | `void` | Attaches `click`, `dragover`, `dragleave`, `drop`, and `change` events on the upload zone and file input. Delegates to `upload.js` handlers. |
| `setupControlListeners()` | _none_ | `void` | Attaches `input` events on top-text, bottom-text, font-select, font-size, text-colour, and stroke-colour. Each triggers `renderCanvas()`. |
| `setupActionListeners()` | _none_ | `void` | Attaches `click` on download button (calls `exportMeme()`), and `click` on change-image button (calls `resetUpload()`). |
| `renderCanvas()` | _none_ | `void` | Gathers current state (image, text values, style options) and calls `canvas.drawMeme()` to re-render the full canvas. Called on every input change for live preview. |

#### Event Flow

```text
DOMContentLoaded → init()
  ├── setupUploadListeners()  → file change / drop → upload.handleFile() → image loaded → renderCanvas()
  ├── setupControlListeners() → any input change → renderCanvas()
  └── setupActionListeners()  → download click → export.downloadMeme()
                               → change image click → ui.resetToUpload()
```

---

### 6.2 `modules/upload.js` — File Input & Drag-and-Drop

**Purpose**: Handles all image upload logic — file input change, drag-and-drop events, file validation, and loading the image into an `Image` object.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `handleFile(file, onImageLoaded)` | `file: File` — the uploaded file. `onImageLoaded: (img: HTMLImageElement) => void` — callback invoked with the loaded image. | `void` | Validates the file is an image MIME type. Creates a `FileReader`, reads the file as a data URL, creates a new `Image()`, sets its `src` to the data URL, and on `load` invokes the callback with the image. |
| `validateFile(file)` | `file: File` — the file to validate. | `boolean` | Checks that `file.type` starts with `"image/"`. Returns `true` if valid, `false` otherwise. |
| `addDragDropListeners(dropZone, fileInput, onImageLoaded)` | `dropZone: HTMLElement` — the drop target. `fileInput: HTMLInputElement` — the hidden file input. `onImageLoaded: (img: HTMLImageElement) => void` — callback. | `void` | Attaches `dragover` (prevent default, add visual class), `dragleave` (remove class), `drop` (prevent default, extract `dataTransfer.files[0]`, call `handleFile`), and `click` on dropZone (trigger `fileInput.click()`). Also attaches `change` on `fileInput` to call `handleFile`. |
| `readFileAsDataURL(file)` | `file: File` | `Promise<string>` | Wraps `FileReader.readAsDataURL()` in a Promise. Resolves with the data URL string. Rejects on `onerror`. |
| `loadImage(src)` | `src: string` — data URL or image URL. | `Promise<HTMLImageElement>` | Creates a new `Image`, sets `src`, resolves on `onload`, rejects on `onerror`. |

#### Key Implementation Details

- **FileReader flow**: `file` → `FileReader.readAsDataURL(file)` → `result` (base64 string) → `new Image().src = result` → `image.onload` → image ready.
- **Drag-and-drop**: Must call `e.preventDefault()` on both `dragover` and `drop` to allow the drop. `e.stopPropagation()` prevents bubbling.
- **Validation**: Only accept files where `file.type.startsWith('image/')`. Show an alert or inline error for invalid files.
- **Multiple files**: Only process the first file (`files[0]`). Ignore additional files silently.

---

### 6.3 `modules/canvas.js` — Canvas Rendering Engine

**Purpose**: Manages the `<canvas>` element — sizing it to match the uploaded image, drawing the image, and drawing text overlays. This is the core rendering module.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `initCanvas(canvasEl, image)` | `canvasEl: HTMLCanvasElement` — the canvas DOM element. `image: HTMLImageElement` — the loaded image. | `CanvasRenderingContext2D` | Sets `canvas.width` and `canvas.height` to the image's natural dimensions. Returns the 2D context. |
| `drawMeme(canvasEl, image, options)` | `canvasEl: HTMLCanvasElement`. `image: HTMLImageElement`. `options: MemeOptions` (see below). | `void` | Clears the canvas, draws the image scaled to fill, then calls `text.drawTopText()` and `text.drawBottomText()` with the current options. This is the main re-render function called on every change. |
| `clearCanvas(ctx, width, height)` | `ctx: CanvasRenderingContext2D`. `width: number`. `height: number`. | `void` | Calls `ctx.clearRect(0, 0, width, height)` to wipe the canvas. |
| `drawImage(ctx, image, width, height)` | `ctx: CanvasRenderingContext2D`. `image: HTMLImageElement`. `width: number`. `height: number`. | `void` | Draws the image onto the canvas at `(0, 0)` spanning the full `width` × `height`. Uses `ctx.drawImage(image, 0, 0, width, height)`. |

#### `MemeOptions` Object Shape

```javascript
{
  topText: string,        // e.g. "ONE DOES NOT SIMPLY"
  bottomText: string,     // e.g. "WALK INTO MORDOR"
  fontFamily: string,     // e.g. "Impact"
  fontSize: number,       // e.g. 48 (pixels, relative to canvas resolution)
  textColour: string,     // e.g. "#ffffff"
  strokeColour: string,   // e.g. "#000000"
}
```

#### Canvas Sizing Strategy

- The canvas's internal pixel dimensions (`canvas.width`, `canvas.height`) are set to the **original image resolution** so the exported PNG is full quality.
- The canvas's **CSS display size** is constrained by `max-width: 100%` and `height: auto`, so it scales down visually on screen while maintaining the high-res internal buffer.
- This means font sizes on the canvas must be scaled relative to the image resolution, not the CSS display size.

#### Font Size Scaling

The user selects a font size (e.g. 48px) intended for a "standard" canvas width of 600px. The actual font size drawn on the canvas is scaled proportionally:

```javascript
const scaledFontSize = (userFontSize / 600) * canvas.width;
```

This ensures text looks the same relative size regardless of whether the uploaded image is 400px wide or 2000px wide.

---

### 6.4 `modules/text.js` — Text Positioning, Styling & Wrapping

**Purpose**: Handles all text-related rendering logic — positioning text at the top/bottom of the canvas, applying meme-style stroke outlines, converting to uppercase, and wrapping long text across multiple lines.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `drawTopText(ctx, text, canvasWidth, canvasHeight, options)` | `ctx: CanvasRenderingContext2D`. `text: string`. `canvasWidth: number`. `canvasHeight: number`. `options: TextStyleOptions`. | `void` | Converts text to uppercase. Calls `wrapText()` to get lines. Calculates Y position starting from top margin (roughly 5% from top). Draws each line centred horizontally with fill + stroke. |
| `drawBottomText(ctx, text, canvasWidth, canvasHeight, options)` | Same as above. | `void` | Same as `drawTopText` but positions lines from the bottom of the canvas upward (roughly 5% from bottom). Lines are drawn bottom-to-top so the last line is nearest the bottom edge. |
| `wrapText(ctx, text, maxWidth)` | `ctx: CanvasRenderingContext2D` (font must already be set). `text: string`. `maxWidth: number` — maximum pixel width a line can occupy. | `string[]` | Splits text into words. Iteratively builds lines by measuring each word's width with `ctx.measureText()`. When adding a word would exceed `maxWidth`, starts a new line. Returns an array of line strings. |
| `applyTextStyle(ctx, options)` | `ctx: CanvasRenderingContext2D`. `options: TextStyleOptions`. | `void` | Sets `ctx.font`, `ctx.fillStyle`, `ctx.strokeStyle`, `ctx.lineWidth`, `ctx.lineJoin`, `ctx.textAlign`, `ctx.textBaseline` in preparation for drawing. |
| `drawStrokedText(ctx, line, x, y)` | `ctx: CanvasRenderingContext2D`. `line: string`. `x: number`. `y: number`. | `void` | Calls `ctx.strokeText(line, x, y)` then `ctx.fillText(line, x, y)`. Stroke is drawn first so the fill sits on top, creating the classic meme outline effect. |

#### `TextStyleOptions` Object Shape

```javascript
{
  fontFamily: string,     // e.g. "Impact"
  fontSize: number,       // Already scaled to canvas resolution
  textColour: string,     // e.g. "#ffffff"
  strokeColour: string,   // e.g. "#000000"
}
```

#### Text Wrapping Algorithm (Detailed)

```text
FUNCTION wrapText(ctx, text, maxWidth):
    words ← text.split(' ')
    lines ← []
    currentLine ← ''

    FOR each word IN words:
        testLine ← currentLine + (currentLine ? ' ' : '') + word
        metrics ← ctx.measureText(testLine)

        IF metrics.width > maxWidth AND currentLine !== '':
            lines.push(currentLine)
            currentLine ← word
        ELSE:
            currentLine ← testLine

    IF currentLine !== '':
        lines.push(currentLine)

    RETURN lines
```

- `maxWidth` is set to roughly 90% of the canvas width to leave a margin on each side.
- The font must be set on the context **before** calling `wrapText` so that `measureText` returns accurate widths.

---

### 6.5 `modules/export.js` — PNG Export & Download

**Purpose**: Converts the canvas content to a PNG data URL and triggers a browser download.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `downloadMeme(canvasEl)` | `canvasEl: HTMLCanvasElement` — the rendered meme canvas. | `void` | Calls `canvasEl.toDataURL('image/png')` to get a base64-encoded PNG. Creates a temporary `<a>` element, sets `href` to the data URL, sets `download` to a generated filename, appends it to the DOM, triggers `.click()`, then removes it. |
| `generateFilename()` | _none_ | `string` | Returns a filename like `"meme-2026-03-27-143052.png"` using the current date and time. Format: `meme-YYYY-MM-DD-HHmmss.png`. |

#### Implementation Detail

```javascript
export function downloadMeme(canvasEl) {
  const dataURL = canvasEl.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = generateFilename();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

- `toDataURL('image/png')` exports at the canvas's internal resolution (full quality, not the CSS display size).
- The temporary `<a>` element technique works across all modern browsers without requiring `URL.createObjectURL`.

---

### 6.6 `modules/ui.js` — UI State Management

**Purpose**: Controls visibility of sections, enables/disables controls, and manages UI transitions between the upload state and the editing state.

#### Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `showCanvas(uploadSection, canvasSection)` | `uploadSection: HTMLElement`. `canvasSection: HTMLElement`. | `void` | Hides the upload zone (adds `upload-zone--hidden` class), shows the canvas section (removes `canvas-section--hidden` class). |
| `hideCanvas(uploadSection, canvasSection)` | `uploadSection: HTMLElement`. `canvasSection: HTMLElement`. | `void` | Shows the upload zone, hides the canvas section. |
| `enableControls(downloadBtn)` | `downloadBtn: HTMLButtonElement`. | `void` | Removes the `disabled` attribute from the download button. |
| `disableControls(downloadBtn)` | `downloadBtn: HTMLButtonElement`. | `void` | Sets `disabled` on the download button. |
| `resetToUpload(uploadSection, canvasSection, downloadBtn, topTextInput, bottomTextInput)` | All relevant DOM elements. | `void` | Calls `hideCanvas()`, `disableControls()`, clears text input values, resets the file input value. Used when "Change Image" is clicked. |

---

## 7. Canvas Text Rendering — Deep Dive

### 7.1 Classic Meme Text Style

The universally recognised meme text style consists of:

1. **White fill text** — `ctx.fillStyle = '#ffffff'`
2. **Black stroke outline** — `ctx.strokeStyle = '#000000'`
3. **Bold Impact font** — `ctx.font = 'bold 48px Impact'`
4. **Centred horizontally** — `ctx.textAlign = 'center'`
5. **All uppercase** — `text.toUpperCase()`
6. **Thick outline** — `ctx.lineWidth` set to approximately 8% of the font size (e.g. `fontSize * 0.08`), minimum 2px.
7. **Round line joins** — `ctx.lineJoin = 'round'` to avoid spiky corners on letters.

### 7.2 Drawing Order

```text
1. Set font, alignment, baseline on ctx
2. Set strokeStyle, lineWidth, lineJoin
3. Call ctx.strokeText(line, x, y)     ← draws the black outline
4. Set fillStyle
5. Call ctx.fillText(line, x, y)       ← draws the white fill ON TOP of the stroke
```

The stroke must be drawn **before** the fill. If reversed, the stroke would overlap the fill and the text would look too thick.

### 7.3 Top Text Positioning

```text
X = canvasWidth / 2                          (centred)
Y = canvasHeight * 0.05 + fontSize           (5% margin from top + one line height)

For multi-line, each subsequent line:
Y += fontSize * 1.2                          (1.2× line height spacing)
```

### 7.4 Bottom Text Positioning

```text
Total text height = numberOfLines × fontSize × 1.2
Y_start = canvasHeight - (canvasHeight * 0.05) - totalTextHeight + fontSize

For each line from first to last:
Y += fontSize * 1.2
```

This positions the bottom-most line approximately 5% from the canvas bottom edge, with lines stacking upward.

### 7.5 Text Wrapping on Canvas

Canvas has no built-in text wrapping. The `wrapText()` function in `text.js` handles this:

1. Split the input string into words by spaces.
2. Start with an empty `currentLine`.
3. For each word, build a `testLine` by appending the word.
4. Measure `testLine` width with `ctx.measureText(testLine).width`.
5. If the measured width exceeds `maxWidth` (90% of canvas width) and `currentLine` is not empty, push `currentLine` to the results array and start a new line with the current word.
6. After all words are processed, push any remaining `currentLine`.
7. Return the array of line strings.

---

## 8. Data Flow

### 8.1 Complete Data Flow Diagram

```text
USER ACTION                    MODULE              RESULT
───────────                    ──────              ──────

1. Drag/drop or pick image  →  upload.js
   ├─ validateFile()        →  checks MIME type    →  valid / show error
   ├─ readFileAsDataURL()   →  FileReader          →  base64 data URL string
   └─ loadImage()           →  new Image()         →  HTMLImageElement (loaded)
                                   │
                                   ▼
2. Image loaded callback    →  main.js
   ├─ Store image reference    (module-level variable)
   ├─ ui.showCanvas()      →  ui.js               →  swap upload zone for canvas
   ├─ ui.enableControls()  →  ui.js               →  enable download button
   └─ renderCanvas()       →  main.js             →  triggers step 3
                                   │
                                   ▼
3. Render canvas            →  canvas.js
   ├─ initCanvas()         →  sets canvas.width/height to image dimensions
   ├─ clearCanvas()        →  wipes the canvas
   ├─ drawImage()          →  draws image at full canvas size
   ├─ text.drawTopText()   →  text.js             →  wraps + draws top caption
   └─ text.drawBottomText()→  text.js             →  wraps + draws bottom caption
                                   │
                                   ▼
4. User types/changes       →  main.js  (input event listeners)
   └─ renderCanvas()       →  re-runs step 3      →  live preview updated
                                   │
                                   ▼
5. User clicks Download     →  export.js
   ├─ canvasEl.toDataURL()                         →  PNG base64 string
   ├─ generateFilename()                           →  "meme-2026-03-27-143052.png"
   └─ trigger <a> download                         →  file saved to user's device

6. User clicks Change Image →  ui.js
   └─ resetToUpload()      →  hides canvas, shows upload zone, clears inputs
```

### 8.2 State

There is no complex state management. The application state consists of:

| State Variable | Stored In | Type | Description |
|---------------|-----------|------|-------------|
| `currentImage` | `main.js` (module scope) | `HTMLImageElement \| null` | The currently loaded image. `null` before first upload. |
| Top text | DOM (`#top-text` input value) | `string` | Read directly from the input on each render. |
| Bottom text | DOM (`#bottom-text` input value) | `string` | Read directly from the input on each render. |
| Font family | DOM (`#font-select` value) | `string` | Read directly from the select on each render. |
| Font size | DOM (`#font-size` value) | `number` | Read directly from the select on each render. |
| Text colour | DOM (`#text-colour` value) | `string` | Read directly from the colour input on each render. |
| Stroke colour | DOM (`#stroke-colour` value) | `string` | Read directly from the colour input on each render. |

All text/style state lives in the DOM inputs. On each render, `main.js` reads the current values and passes them to `canvas.drawMeme()`. This avoids the need for a separate state store.

---

## 9. Accessibility

### 9.1 Requirements

| Requirement | Implementation |
|-------------|---------------|
| **Labels for all inputs** | Every `<input>` and `<select>` has an associated `<label>` with a matching `for` attribute. |
| **Keyboard-accessible upload** | The drop zone has `tabindex="0"` and `role="button"`. A `keydown` listener triggers the file input on `Enter` or `Space`. |
| **Focus indicators** | All focusable elements have a visible focus ring via `box-shadow` on `:focus-visible`. The default browser outline is not removed without replacement. |
| **Colour contrast** | White text (`#ffffff`) on dark navy (`#16213e`) exceeds WCAG AA contrast ratio (> 4.5:1). Button text on magenta (`#e94560`) also passes. |
| **Semantic HTML** | `<header>`, `<main>`, `<section>`, `<footer>` provide landmark regions. Heading hierarchy: single `<h1>` for the app title. |
| **`aria-label` on sections** | Each `<section>` has an `aria-label` describing its purpose for screen readers. |
| **Disabled state** | The download button uses the native `disabled` attribute, which is correctly announced by assistive technologies. |
| **Alt text** | The canvas itself does not need alt text (it is a dynamic rendering surface), but the upload zone has descriptive text content visible to screen readers. |
| **No auto-play or flashing** | No animations or transitions exceed accessibility thresholds. |

### 9.2 Keyboard Navigation Order

```text
Tab order:
1. Drop zone (Enter/Space to open file picker)
2. Top Text input
3. Bottom Text input
4. Font select dropdown
5. Size select dropdown
6. Text colour picker
7. Stroke colour picker
8. Change Image button
9. Download Meme button
```

---

## 10. Step-by-Step Build Order

### Phase 1: Project Scaffolding

1. Create `meme-generator/index.html` with the full HTML structure from Section 4.
2. Create `meme-generator/styles/main.css` with CSS variables, reset, and all component styles from Section 5.
3. Create `meme-generator/js/main.js` as an empty module with the `init()` function and `DOMContentLoaded` listener.
4. Create the `meme-generator/js/modules/` directory.
5. Verify the page loads in a browser and displays the upload zone with correct styling.

### Phase 2: Image Upload

6. Create `js/modules/upload.js` with `validateFile()`, `readFileAsDataURL()`, `loadImage()`, `handleFile()`, and `addDragDropListeners()`.
7. Create `js/modules/ui.js` with `showCanvas()`, `hideCanvas()`, `enableControls()`, `disableControls()`, `resetToUpload()`.
8. In `main.js`, import both modules, wire up upload event listeners, and implement the `onImageLoaded` callback to store the image and call `ui.showCanvas()`.
9. Test: drag an image onto the drop zone → upload zone hides, canvas section appears. Click the zone → file picker opens.

### Phase 3: Canvas Rendering

10. Create `js/modules/canvas.js` with `initCanvas()`, `clearCanvas()`, `drawImage()`, and `drawMeme()`.
11. In `main.js`, after image loads, call `canvas.initCanvas()` and `canvas.drawMeme()` to render the image on the canvas.
12. Test: uploaded image appears on the canvas at its natural resolution, scaled visually by CSS.

### Phase 4: Text Rendering

13. Create `js/modules/text.js` with `applyTextStyle()`, `wrapText()`, `drawStrokedText()`, `drawTopText()`, and `drawBottomText()`.
14. Update `canvas.drawMeme()` to call `text.drawTopText()` and `text.drawBottomText()`.
15. In `main.js`, implement `renderCanvas()` — reads all DOM input values, builds the `MemeOptions` object, calls `canvas.drawMeme()`.
16. Wire `input` event listeners on both text fields to call `renderCanvas()`.
17. Test: type text in top/bottom fields → text appears on canvas in real time with white fill and black stroke.

### Phase 5: Style Controls

18. Wire `input`/`change` event listeners on font select, size select, text colour, and stroke colour to call `renderCanvas()`.
19. Verify font size scaling works across different image resolutions.
20. Test: change font → canvas re-renders with new font. Change colour → text colour updates live.

### Phase 6: Export

21. Create `js/modules/export.js` with `downloadMeme()` and `generateFilename()`.
22. In `main.js`, wire the download button click to call `export.downloadMeme(canvasEl)`.
23. Test: click Download → browser downloads a PNG file with the correct meme content at full resolution.

### Phase 7: Change Image & Reset

24. Wire the "Change Image" button to call `ui.resetToUpload()`.
25. Test: click Change Image → upload zone reappears, canvas hides, inputs clear, download button disables.

### Phase 8: Polish & Edge Cases

26. Add keyboard event handling for the drop zone (`Enter`/`Space` triggers file input).
27. Handle edge cases: no text entered (renders image only), very long text (wraps correctly), very small images (minimum canvas display size).
28. Add the `drag-over` CSS class toggle for visual feedback during drag.
29. Test across Chrome, Firefox, Safari. Test on mobile viewport.
30. Validate HTML (no errors), check accessibility with a screen reader or axe DevTools.

### Phase 9: Final Review

31. Verify all file headers match the copilot-instructions format.
32. Ensure all functions have JSDoc comments.
33. Confirm no global variables — all state is module-scoped.
34. Check that relative paths are used for all resources.
35. Final manual test of the complete flow: upload → type text → change styles → download → change image → re-upload.

---

## 11. Stretch Goals

These features are **not** included in the initial build but can be added incrementally after the core is complete.

### 11.1 Template Library

- Add a grid of pre-loaded popular meme templates (Drake, Distracted Boyfriend, Two Buttons, etc.) stored in `assets/templates/`.
- Clicking a template loads it directly onto the canvas without needing to upload.
- UI: A "Templates" tab or modal that appears alongside the upload zone.

### 11.2 Text Dragging (Repositioning)

- Allow users to click and drag the top/bottom text to reposition it anywhere on the canvas.
- Track mouse/touch `mousedown` → `mousemove` → `mouseup` events on the canvas.
- Hit-test to determine if the click is within a text bounding box.
- Store custom `x, y` positions in state and use them during rendering instead of the fixed top/bottom positions.

### 11.3 Sticker Overlays

- Provide a library of transparent PNG stickers (sunglasses, hats, speech bubbles, emojis).
- Users can drag stickers onto the canvas and resize/rotate them.
- Each sticker is an additional `drawImage()` call during the render pass.
- Requires a layer system to manage z-order of stickers vs text.

### 11.4 Multiple Text Boxes

- Allow users to add more than two text captions.
- Each text box has independent position, font, size, and colour settings.
- UI: An "Add Text" button that appends a new text input group to the control panel.
- State: An array of text objects, each rendered in sequence during the canvas draw pass.

### 11.5 Additional Stretch Ideas

| Feature | Description |
|---------|-------------|
| **Undo/Redo** | Maintain a history stack of canvas states for undo/redo support. |
| **Image Filters** | Apply CSS-like filters (grayscale, sepia, blur, brightness) to the uploaded image before text overlay. Uses `ctx.filter`. |
| **Text Shadow** | Add configurable drop shadows behind text using `ctx.shadowColor`, `ctx.shadowBlur`, `ctx.shadowOffsetX/Y`. |
| **Social Share** | Add share buttons that open Twitter/Facebook/Reddit with the meme image attached (requires converting to blob URL). |
| **Local Storage** | Save the last-used settings (font, colours) to `localStorage` so they persist across sessions. |
| **GIF Support** | Allow uploading animated GIFs and preserving animation in the preview (requires frame extraction, significantly more complex). |
