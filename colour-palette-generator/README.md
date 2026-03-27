[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Colour Palette Generator

A web-based colour palette generator that creates harmonious colour schemes using colour theory. Generate beautiful palettes with multiple harmony modes, view hex and RGB values at a glance, copy colours with a single click, and lock your favourites while regenerating the rest.

## Features

- **Generate random palettes** — produce a five-colour palette instantly with the spacebar or a button click
- **Colour harmony modes** — choose from complementary, analogous, triadic, split-complementary, and monochromatic rules
- **Hex and RGB display** — every swatch shows its hex code and RGB values
- **Click-to-copy** — click any colour value to copy it to the clipboard, with visual confirmation
- **Lock colours** — toggle the lock on individual swatches to keep them fixed while regenerating the rest
- **Responsive layout** — palette swatches reflow cleanly across desktop, tablet, and mobile screens
- **Keyboard shortcut** — press the spacebar to generate a new palette without reaching for a button

## How to Use

1. Open the app in a browser.
2. A random palette is generated on load.
3. Select a harmony mode from the dropdown to change how colours relate to each other.
4. Press the **Generate** button or hit **Spacebar** to create a new palette.
5. Click the **lock icon** on any swatch to freeze that colour during regeneration.
6. Click a **hex or RGB value** to copy it to your clipboard.

## Colour Harmony Modes

| Mode | Description |
|---|---|
| **Random** | Five completely random colours with no harmonic constraint |
| **Complementary** | A base colour paired with its opposite on the colour wheel |
| **Analogous** | Colours sitting next to each other on the colour wheel for a smooth, cohesive feel |
| **Triadic** | Three colours evenly spaced at 120° intervals around the wheel |
| **Split-Complementary** | A base colour plus the two colours adjacent to its complement |
| **Monochromatic** | Variations in lightness and saturation of a single hue |

## Project Structure

```text
colour-palette-generator/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — semantic markup and accessible structure
- **CSS3** — custom properties, flexbox layout, responsive design
- **JavaScript (ES2022+)** — vanilla JS with ES modules for palette generation and clipboard interaction

## Getting Started

Clone the repository and open the project folder:

```bash
cd colour-palette-generator
```

Then either open `index.html` directly in a browser, or start a local server:

```bash
python3 -m http.server 5500
```

Visit `http://localhost:5500` to use the app.
