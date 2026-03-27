[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Snake with Power-Ups

A fresh take on the classic snake game, built entirely in the browser. Eat food, grow longer, and grab power-ups that change the way you play — speed boosts, slow-motion, score multipliers, shields, and more. How long can you survive?

## Features

- Smooth, grid-based snake movement with wrap-around or wall-collision modes
- Randomly spawning food and power-up items across the board
- Active power-up timer displayed on screen so you know when an effect expires
- Progressive difficulty — the snake gradually speeds up as your score climbs
- High-score tracking saved to local storage between sessions
- Game-over screen with final score and one-click restart
- Responsive canvas that scales to different screen sizes
- Clean pixel-style visuals with colour-coded power-ups

## How to Play

1. Open the game in your browser.
2. Press any arrow key to start moving the snake.
3. Guide the snake to eat the red food items to grow and earn points.
4. Collect glowing power-up items for temporary boosts.
5. Avoid crashing into your own tail (and walls, if wall mode is on).
6. Try to beat your high score each round.

## Controls

| Key | Action |
| --- | --- |
| Arrow Up | Move up |
| Arrow Down | Move down |
| Arrow Left | Move left |
| Arrow Right | Move right |
| Enter | Start / Restart game |

## Power-Ups

| Power-Up | Colour | Effect |
| --- | --- | --- |
| Speed Boost | Yellow | Temporarily increases snake speed |
| Slow-Motion | Blue | Slows the snake down for easier control |
| Score Multiplier | Purple | Doubles points earned for a short time |
| Shield | Green | Lets you survive one self-collision |
| Shrink | Orange | Removes a few tail segments instantly |

## Project Structure

```text
snake-with-powerups/
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

- **HTML5** — Canvas element for rendering the game board
- **CSS3** — Layout, styling, and responsive design
- **JavaScript (ES2022+)** — Game loop, input handling, collision detection, and power-up logic

## Getting Started

No build tools or dependencies required. To run locally:

1. Clone the repository and navigate to the project folder:

   ```bash
   cd snake-with-powerups
   ```

2. Open `index.html` directly in your browser, **or** start a local server:

   ```bash
   python3 -m http.server 5500
   ```

   Then visit `http://localhost:5500` in your browser.
