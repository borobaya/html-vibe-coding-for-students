[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Pomodoro Timer

A productivity-focused study timer built around the Pomodoro Technique. Set custom work and break durations, stay on track with a visual countdown and progress ring, and review your study stats at the end of each session. An audio alert plays when each interval ends so you never miss a transition.

## Features

- **Configurable durations** — adjust work, short break, and long break lengths to suit your study style
- **Visual countdown** — large, clear timer display with an animated circular progress ring
- **Auto-switching intervals** — automatically transitions between work and break periods
- **Session counter** — tracks how many Pomodoro cycles you have completed
- **Stats tracking** — logs total focus time, total break time, and number of sessions finished
- **Audio notifications** — plays a sound when a work or break interval ends
- **Start / Pause / Reset controls** — full control over the timer at any point
- **Long break support** — triggers a longer break after every four completed work sessions
- **Responsive layout** — works cleanly on desktop and mobile screens
- **Keyboard-friendly** — all controls are accessible via keyboard

## How to Use

1. Open the app in your browser.
2. Set your preferred work duration, short break, and long break using the settings inputs.
3. Click **Start** to begin the first work interval.
4. Focus on your task until the timer reaches zero and the audio alert plays.
5. Take your break — the timer switches automatically.
6. After four work sessions a longer break is triggered.
7. Use **Pause** to temporarily stop the timer or **Reset** to start over.
8. Check the stats panel to review total focus time and completed sessions.

## Project Structure

```text
pomodoro-timer/
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

- **HTML5** — semantic page structure and accessible controls
- **CSS3** — layout, animations, and responsive design with CSS variables
- **JavaScript (ES2022+)** — timer logic, DOM updates, and audio playback

## Getting Started

No build tools or dependencies are required. Run the project locally with either method:

**Option A — open directly:**

Open `index.html` in any modern browser.

**Option B — local server:**

```bash
python3 server.py
```

Then visit `http://localhost:5500/pomodoro-timer` in your browser.
