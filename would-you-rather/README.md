[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Would You Rather?

A fun, interactive "Would You Rather?" game that presents players with random dilemmas and lets them vote on their choice. After voting, the game reveals live vote percentages so you can see how your pick stacks up. Built with vanilla JavaScript and a curated bank of questions that keeps every round fresh.

## Features

- **Random dilemma generation** — questions are drawn from a built-in bank and shuffled so no two sessions feel the same
- **One-click voting** — tap either option to lock in your answer instantly
- **Live vote percentages** — results update on screen immediately after each vote with animated progress bars
- **Vote persistence** — tallies are saved to `localStorage` so totals survive page refreshes
- **Next question button** — cycle through the question bank at your own pace
- **Responsive layout** — works smoothly on desktop, tablet, and mobile screens
- **Clean, bold UI** — large text and high-contrast cards make each dilemma easy to read

## How to Use

1. Open the app — a random "Would You Rather?" dilemma appears on screen
2. Read both options and click the one you prefer
3. View the vote percentages revealed for that question
4. Click **Next Question** to move on to a new dilemma
5. Keep playing — your votes are tracked across the entire session

## Project Structure

```text
would-you-rather/
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
- **CSS3** — custom properties, flexbox layout, animations, and responsive design
- **JavaScript (ES2022+)** — ES modules, DOM manipulation, `localStorage` for vote persistence

## Getting Started

No build tools or dependencies required. Run the project locally with either method:

**Option A — Open directly**

Double-click `index.html` in your browser (or drag it onto an open browser window).

**Option B — Local dev server**

```bash
python3 server.py
```

Then visit `http://localhost:5500/would-you-rather` in your browser.
