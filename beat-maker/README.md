[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Beat Maker

A browser-based beat maker with interactive drum pads, loop layering, and real-time playback. Tap pads to trigger sounds, build layered loops, adjust the tempo, and switch between instrument kits — all from the browser with no installs required.

## Features

- Interactive drum pad grid with visual feedback on each hit
- Multiple instrument sound kits (kick, snare, hi-hat, clap, toms, and more)
- Loop layering — toggle pads on and off to build patterns step by step
- Play, pause, and stop controls for loop playback
- Adjustable tempo (BPM) slider for precise speed control
- Real-time audio powered by the Web Audio API
- Visual highlight on the active step during playback
- Clear button to reset the entire pattern
- Responsive layout that works on desktop and mobile browsers

## How to Use

1. Open the app in your browser.
2. Select an instrument kit from the available options.
3. Click or tap pads on the grid to activate or deactivate beats.
4. Press **Play** to hear your pattern loop continuously.
5. Adjust the **BPM slider** to speed up or slow down the tempo.
6. Layer different instruments by toggling pads across multiple rows.
7. Press **Stop** to end playback or **Clear** to reset the grid.

## Controls

| Control | Action |
|---------|--------|
| Drum pad (click/tap) | Toggle a beat on or off for that step |
| Play button | Start looping the current pattern |
| Stop button | Stop playback |
| Clear button | Reset all pads to off |
| BPM slider | Adjust playback speed (beats per minute) |
| Kit selector | Switch between different instrument sound sets |

## Project Structure

```text
beat-maker/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
│   └── (audio samples and images)
└── README.md
```

## Tech Stack

- **HTML5** — Page structure and layout
- **CSS3** — Styling, grid layout, and pad animations
- **JavaScript (ES2022+)** — App logic and interactivity
- **Web Audio API** — Low-latency sound playback and scheduling

## Getting Started

No build tools or dependencies needed. Run it locally with either method:

**Option 1 — Open directly:**

Open `index.html` in your browser.

**Option 2 — Local server:**

```bash
cd beat-maker && python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
