[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Personality Quiz — What Type of Coder Are You?

A fun, interactive personality quiz that reveals your coding personality through a series of carefully crafted questions. Answer honestly, watch your progress build, and discover whether you're a Backend Architect, Frontend Wizard, Full-Stack Explorer, or Data Wrangler — complete with an animated result reveal.

## Features

- **Multi-question quiz flow** — a curated set of personality-driven questions presented one at a time
- **Weighted answer scoring** — each answer contributes weighted points toward different personality types for accurate results
- **Live progress bar** — a visual indicator that fills as you advance through the quiz
- **Animated result reveal** — your personality type is unveiled with a smooth animation and a detailed description
- **Retake option** — restart the quiz at any time to try different answers or share with friends
- **Responsive design** — works seamlessly on desktop, tablet, and mobile screens
- **Keyboard accessible** — all controls are fully navigable via keyboard

## How to Use

1. Open the app and read the welcome prompt.
2. Click **Start Quiz** to begin.
3. For each question, select the answer that best describes you.
4. Watch the progress bar fill as you move through the questions.
5. After the final question, enjoy the animated reveal of your coder personality type.
6. Read your result description to see how it matches your style.
7. Click **Retake Quiz** to start over with a fresh slate.

## Project Structure

```text
personality-quiz/
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

- **HTML5** — semantic markup and accessible form controls
- **CSS3** — animations, transitions, CSS variables, and responsive layout
- **JavaScript (ES2022+)** — vanilla JS with ES modules for quiz logic and DOM updates

## Getting Started

No build tools or dependencies required. Run it locally in two ways:

**Option 1 — Open directly**

Open `index.html` in any modern browser.

**Option 2 — Local server**

```bash
python3 server.py
```

Then visit `http://localhost:5500/personality-quiz` in your browser.
