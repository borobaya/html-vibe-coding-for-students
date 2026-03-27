[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Endless Runner

A fast-paced, side-scrolling endless runner game built entirely with vanilla JavaScript and HTML5 Canvas. Guide your character through a never-ending gauntlet of obstacles, rack up points the longer you survive, and chase your personal best. Your high score is saved automatically so you can always come back and try to beat it.

## Features

- Smooth side-scrolling gameplay with increasing difficulty over time
- Responsive jump and duck mechanics for dodging obstacles
- Randomly generated obstacles that keep every run feeling fresh
- Real-time score counter that climbs the longer you survive
- High score tracking persisted to `localStorage` — your best run is always saved
- Start screen, in-game HUD, and game-over screen with restart option
- Gradual speed ramp-up that rewards quick reflexes
- Clean pixel-style visuals with animated character and environment

## How to Play

1. Open the game in your browser.
2. Press any key or click the screen to start a run.
3. Dodge obstacles by jumping or ducking as they approach.
4. Survive as long as possible — your score increases every second.
5. When you hit an obstacle, the game ends and your score is displayed.
6. If you beat your previous high score, it is saved automatically.
7. Click "Play Again" or press the indicated key to start a new run.

## Controls

| Action | Input |
|--------|-------|
| Jump | `Space` / `Up Arrow` / Click |
| Duck | `Down Arrow` |
| Start / Restart | `Space` / Click |

## Project Structure

```text
endless-runner/
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

- **HTML5** — Canvas element for rendering the game world
- **CSS3** — Layout, UI overlays, and responsive styling
- **JavaScript (ES2022+)** — Game loop, physics, collision detection, and localStorage API

## Getting Started

No build tools or dependencies required. Just open the project locally:

```bash
cd endless-runner
python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.

Alternatively, open `index.html` directly in any modern browser.
