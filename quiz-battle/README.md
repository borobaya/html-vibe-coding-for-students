[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Quiz Battle

A fast-paced two-player trivia game where friends go head-to-head on the same screen to prove who really knows their stuff. Pick a category, answer questions under pressure, and watch the scoreboard light up as you battle through rounds of trivia. Built with vanilla JavaScript for quick, competitive fun — no installs needed.

## Features

- **Two-Player Local Multiplayer** — Both players compete on the same screen, taking turns to answer
- **Multiple Trivia Categories** — Choose from categories like Science, History, Geography, Entertainment, and Sports
- **Round-Based Gameplay** — Play through multiple rounds with increasing difficulty
- **Live Score Tracking** — Real-time scoreboard updates after every question
- **Countdown Timer** — Each question has a time limit to keep the pressure on
- **Answer Feedback** — Instant visual feedback showing correct and incorrect answers
- **End-of-Game Summary** — Final results screen declaring the winner with a full score breakdown
- **Responsive Design** — Works on desktops, tablets, and mobile devices
- **Sound Effects** — Audio cues for correct answers, wrong answers, and timer warnings

## How to Play

1. Open the game and enter names for Player 1 and Player 2
2. Select a trivia category (or choose Random for a mix)
3. Choose the number of rounds you want to play
4. Player 1 answers first — read the question and pick from the multiple-choice options before time runs out
5. Player 2 then answers the same (or a different) question for that round
6. Points are awarded for correct answers, with bonus points for fast responses
7. After all rounds are complete, the winner is announced on the results screen
8. Hit "Play Again" to rematch or switch categories

## Controls

| Action | Input |
|---|---|
| Select answer | Click / Tap on an option |
| Start game | Click "Start Battle" button |
| Navigate menus | Click / Tap buttons |
| Play again | Click "Play Again" on results screen |

## Project Structure

```text
quiz-battle/
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

- **HTML5** — Semantic markup and game layout
- **CSS3** — Styling, animations, and responsive design
- **JavaScript (ES2022+)** — Game logic, timer, score tracking, and DOM manipulation

## Getting Started

No dependencies or build tools required. Just open the game in a browser:

**Option 1 — Open directly:**

Open `index.html` in your browser by double-clicking the file.

**Option 2 — Local server (recommended for ES modules):**

```bash
python3 server.py
```

Then visit `http://localhost:5500/quiz-battle` in your browser.
