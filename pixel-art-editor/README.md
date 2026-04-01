[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Pixel Art Editor

A browser-based pixel art drawing tool that lets you create retro-style artwork right in your browser. Draw on a customisable grid canvas, pick colours, fill regions, erase mistakes, and export your finished piece as a PNG — no installs required.

## Features

- **Grid canvas** — Draw pixel by pixel on a clean, resizable grid
- **Colour picker** — Choose any colour using a full-spectrum colour input
- **Colour palette** — Quick-access preset colours for fast workflow
- **Pencil tool** — Click or drag to paint individual pixels
- **Eraser tool** — Remove pixels by resetting them to the background colour
- **Fill tool** — Flood-fill an entire region with the selected colour
- **Clear canvas** — Wipe the entire grid and start fresh
- **PNG export** — Download your artwork as a PNG image file
- **Responsive layout** — Works across desktop and tablet screen sizes

## How to Use

1. Open the app in your browser.
2. Select a colour from the palette or use the colour picker for a custom shade.
3. Choose a drawing tool (pencil, eraser, or fill).
4. Click or drag on the grid to draw your pixel art.
5. Use the clear button to reset the canvas if needed.
6. When you are happy with your creation, hit the export button to download it as a PNG.

## Controls / Tools

| Tool       | Description                                      |
| ---------- | ------------------------------------------------ |
| Pencil     | Draw individual pixels by clicking or dragging    |
| Eraser     | Remove colour from pixels                        |
| Fill       | Flood-fill a connected region with one colour    |
| Colour Picker | Select any custom colour                      |
| Palette    | Choose from a set of preset colours              |
| Clear      | Reset the entire canvas                          |
| Export PNG | Download the canvas as a PNG image               |

## Project Structure

```text
pixel-art-editor/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic markup and canvas structure
- **CSS3** — Layout, theming, and responsive design
- **JavaScript (ES2022+)** — Drawing logic, flood-fill algorithm, and PNG export

## Getting Started

No dependencies or build tools needed. Just open the project locally:

```bash
cd pixel-art-editor
```

**Option A** — Open `index.html` directly in your browser.

**Option B** — Start the website from the project root:

```bash
python3 server.py
```

Then visit `http://localhost:5500/pixel-art-editor` in your browser.
