[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Fortune Teller — Magic 8-Ball

A mystical Magic 8-Ball web app that delivers random fortunes with satisfying shake animations and particle effects. Click the ball (or physically shake your device) to ask a question and receive a cryptic answer drawn from a pool of classic and custom mystical responses.

## Features

- **Shake to reveal** — Click/tap the 8-Ball or shake your device (using the DeviceMotion API) to trigger a fortune
- **Shake animation** — Smooth CSS keyframe animation that wobbles the ball before revealing the answer
- **Particle effects** — Mystical particle burst radiates outward each time a fortune is revealed
- **Large response pool** — Dozens of possible answers split across positive, neutral, and negative categories
- **Triangle reveal** — Answer fades in on the classic blue triangle window inside the ball
- **Ambient glow** — Subtle pulsing glow around the ball that intensifies during a shake
- **Mobile-friendly** — Fully responsive layout that works on phones, tablets, and desktops
- **Cooldown timer** — Short delay between shakes to let the animation finish before the next question

## How to Use

1. Open the app in a browser.
2. Think of a yes-or-no question.
3. Click or tap the Magic 8-Ball (or shake your phone).
4. Watch the shake animation and particle burst play out.
5. Read your mystical answer in the triangle window.
6. Click again to ask another question.

## Project Structure

```text
fortune-teller/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── responses.js
│       ├── animation.js
│       └── particles.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic markup and accessible structure
- **CSS3** — Keyframe animations, CSS variables, and responsive design
- **JavaScript (ES2022+)** — ES modules, DeviceMotion API, and Canvas/DOM-based particle effects

## Getting Started

No build tools or dependencies required. Run the project locally with either method:

**Option A — Open directly**

Open `index.html` in any modern browser.

**Option B — Local server**

```bash
python3 server.py
```

Then visit `http://localhost:5500/fortune-teller` in your browser.
