[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Gravity Sandbox

An interactive gravity simulation where you click to place celestial bodies with custom mass and velocity, then watch them orbit, collide, and slingshot around each other under real-time Newtonian gravity. Built on HTML5 Canvas with smooth trail rendering, pause/play controls, and a clean dark-space UI.

## Features

- **Click-to-place bodies** — click anywhere on the canvas to spawn a new celestial body at that position
- **Adjustable mass** — use a slider to set the mass of the next body before placing it, affecting its gravitational pull and visual size
- **Initial velocity control** — click and drag to set a body's starting velocity vector; the direction and length of the drag determine speed and heading
- **Newtonian gravity simulation** — every body attracts every other body using an inverse-square force law, updated each frame
- **Orbital trail rendering** — each body leaves a fading trail behind it so you can trace orbital paths and see patterns form
- **Colour-coded bodies** — bodies are assigned distinct colours based on their mass for easy identification
- **Pause / Play toggle** — freeze the simulation at any moment to inspect positions, then resume
- **Reset button** — clear all bodies and trails to start a fresh simulation
- **Responsive canvas** — the simulation area scales to fit the browser window
- **Smooth animation loop** — uses `requestAnimationFrame` for consistent, jank-free rendering

## How to Use

1. Open the app in your browser.
2. Adjust the **mass slider** to choose how heavy your next body will be.
3. **Click** on the canvas to place a body with zero initial velocity, or **click and drag** to set a velocity — the arrow preview shows the direction and speed.
4. Watch the bodies interact under gravity. Place more bodies to create complex orbital systems.
5. Press **Pause** to freeze the simulation and study the current state.
6. Press **Reset** to clear everything and start over.

## Controls

| Input | Action |
|---|---|
| Left-click | Place a new body at the cursor position |
| Click + drag | Place a body and set its initial velocity (drag direction and length) |
| Mass slider | Adjust the mass of the next body to place |
| Pause / Play button | Toggle the simulation on and off |
| Reset button | Remove all bodies and trails |

## Project Structure

```text
gravity-sandbox/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── body.js
│       ├── physics.js
│       └── renderer.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5 Canvas** — all rendering of bodies, trails, and velocity previews
- **CSS3** — dark-space themed UI, layout, and responsive design
- **JavaScript (ES2022+)** — simulation logic, input handling, and animation loop using ES modules

## Getting Started

Clone the repository and open the project:

```bash
cd gravity-sandbox
```

Then either open `index.html` directly in your browser, or start a local server:

```bash
python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
