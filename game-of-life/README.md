[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Conway's Game of Life

A browser-based implementation of Conway's Game of Life — the famous zero-player cellular automaton devised by mathematician John Conway. A grid of cells evolves through generations based on four simple rules:

1. Any live cell with fewer than two live neighbours dies (underpopulation).
2. Any live cell with two or three live neighbours survives.
3. Any live cell with more than three live neighbours dies (overpopulation).
4. Any dead cell with exactly three live neighbours becomes alive (reproduction).

Despite these minimal rules, the simulation produces endlessly complex and surprising patterns. Draw your own creations, load classic patterns, and watch them evolve.

## Features

- **Interactive canvas grid** — click or drag to draw and erase cells freely
- **Play / Pause / Step** — run the simulation continuously or advance one generation at a time
- **Adjustable speed** — control how fast generations tick with a speed slider
- **Adjustable grid size** — change the number of rows and columns to explore at different scales
- **Clear board** — reset the entire grid to a blank state
- **Preset patterns** — instantly load well-known patterns such as the Glider, Pulsar, Gosper Glider Gun, and more
- **Generation counter** — track how many generations have elapsed
- **Responsive layout** — works on various screen sizes with a centred canvas and clean controls

## How to Use

1. Open the app in your browser.
2. **Draw cells** by clicking or dragging on the grid. Click an active cell to erase it.
3. Press **Play** to start the simulation and watch cells evolve each generation.
4. Press **Pause** to freeze the simulation at any point.
5. Use **Step** to advance exactly one generation while paused.
6. Adjust the **Speed** slider to control the tick rate.
7. Change the **Grid Size** to make the board larger or smaller.
8. Select a **Preset Pattern** from the dropdown to load a classic configuration.
9. Press **Clear** to wipe the board and start fresh.

## Controls

| Action | Control |
|---|---|
| Draw / erase cells | Left-click or click-and-drag on the grid |
| Start simulation | Play button |
| Pause simulation | Pause button |
| Advance one generation | Step button |
| Change speed | Speed slider |
| Change grid dimensions | Grid size control |
| Load a preset pattern | Preset dropdown menu |
| Reset the board | Clear button |

## Project Structure

```text
game-of-life/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5 Canvas** — renders the cell grid and handles drawing
- **CSS3** — layout, controls styling, and responsive design
- **JavaScript (ES2022+)** — game logic, simulation loop, and DOM interaction

## Getting Started

No build tools or dependencies required. Clone the repo and open the project:

```bash
cd game-of-life
python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.

Alternatively, open `index.html` directly in any modern browser.
