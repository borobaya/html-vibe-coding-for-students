[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Typing Speed Racer

A fast-paced typing game where your car races across the screen as you type words correctly. The faster and more accurately you type, the quicker your car moves toward the finish line. Track your words-per-minute (WPM) and accuracy in real time and push yourself to beat your best run.

## Features

- **Car racing animation** — your car moves across the track based on how fast you type each word
- **Random word prompts** — a fresh set of words each round to keep things unpredictable
- **Live WPM counter** — words-per-minute calculated and displayed in real time as you type
- **Accuracy tracking** — see your accuracy percentage update with every word you complete
- **Countdown timer** — race against the clock with a visible countdown
- **Visual feedback** — correct words highlight green, mistakes highlight red instantly
- **End-of-race summary** — final stats screen showing WPM, accuracy, and total words typed
- **Restart button** — jump straight into a new race without refreshing the page
- **Responsive layout** — works on desktop and tablet screens

## How to Play

1. Open the game and press the **Start** button to begin the race.
2. A word appears on screen — type it into the input field as fast as you can.
3. Press **Space** or **Enter** to submit the word and move on to the next one.
4. Each correct word drives your car forward along the track.
5. Incorrect words are flagged and count against your accuracy.
6. When the timer runs out, your final WPM and accuracy are displayed.
7. Hit **Restart** to try again and beat your score.

## Controls

| Action | Input |
|---|---|
| Type a word | Keyboard |
| Submit word | Space / Enter |
| Start race | Click **Start** button |
| Restart | Click **Restart** button |

## Project Structure

```text
typing-speed-racer/
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

- **HTML5** — semantic page structure and game layout
- **CSS3** — animations, car movement, responsive styling
- **JavaScript (ES2022+)** — game logic, WPM calculation, DOM updates

## Getting Started

Clone the repository and open the project:

```bash
cd typing-speed-racer
```

Open `index.html` directly in your browser, or start the website from the project root:

```bash
python3 server.py
```

Visit `http://localhost:5500/typing-speed-racer` to play.
