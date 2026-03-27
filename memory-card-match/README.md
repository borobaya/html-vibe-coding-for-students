[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Memory Card Match

A browser-based memory card game where players flip cards to find matching pairs. Test your
recall across multiple difficulty levels while racing against the clock and tracking your moves.
Built with vanilla HTML, CSS, and JavaScript — no frameworks required.

## Features

- Smooth 3D card flip animations with front and back faces
- Timed gameplay with a live countdown timer
- Move counter that tracks every card flip
- Three difficulty levels — Easy (4x3), Medium (4x4), and Hard (6x4)
- Cards shuffle randomly at the start of each round
- Match detection with visual feedback for correct and incorrect pairs
- Win screen showing total time and number of moves
- Restart button to replay without refreshing the page
- Fully responsive layout for desktop and mobile screens
- Accessible markup with keyboard-focusable cards

## How to Play

1. Choose a difficulty level from the menu.
2. Click or tap a card to flip it over and reveal the symbol.
3. Flip a second card — if both symbols match, the pair stays face-up.
4. If the symbols don't match, both cards flip back after a short delay.
5. Continue until every pair on the board has been matched.
6. Try to finish with the fewest moves and fastest time.

## Controls

| Input | Action |
| ----- | -------------- |
| Click / Tap | Flip a card |
| Restart button | Reset the board |
| Difficulty selector | Change grid size |

## Project Structure

```text
memory-card-match/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — semantic page structure and card grid layout
- **CSS3** — 3D flip animations, transitions, and responsive design
- **JavaScript (ES2022+)** — game logic, timer, shuffle algorithm, and DOM updates

## Getting Started

No build tools or dependencies needed. Run the game locally with either method:

**Option A — Open directly**

Open `index.html` in any modern browser.

**Option B — Local server**

```bash
cd memory-card-match && python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
