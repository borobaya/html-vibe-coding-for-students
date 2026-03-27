[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Zodiac Compatibility Checker

A mystical zodiac compatibility checker that reveals the cosmic connection between two people. Enter two birthdays, and the app automatically detects each person's star sign, runs a compatibility algorithm based on elemental affinities and sign pairings, then delivers a dramatic animated result complete with a compatibility percentage and personalised reading.

## Features

- **Automatic Zodiac Detection** — Determines each person's star sign from their birthday input, displaying the correct zodiac symbol and date range.
- **Compatibility Algorithm** — Calculates compatibility based on elemental groups (Fire, Earth, Air, Water), sign polarities, and classic astrological pairings.
- **Compatibility Percentage** — Generates a scored percentage that animates upward on reveal for a satisfying visual effect.
- **Personalised Readings** — Displays a unique compatibility reading tailored to the specific sign combination, covering strengths and challenges.
- **Dramatic Reveal Animation** — Results appear with a cinematic starfield animation, glowing text, and smooth transitions for maximum impact.
- **Zodiac Sign Cards** — Each detected sign is shown with its symbol, element, and key personality traits.
- **Responsive Design** — Fully usable on desktop, tablet, and mobile screens with a cosmic-themed dark UI.
- **Input Validation** — Ensures valid dates are entered before running the compatibility check.

## How to Use

1. Open the app in your browser.
2. Enter the first person's birthday using the date picker.
3. Enter the second person's birthday using the date picker.
4. Click the **Check Compatibility** button.
5. Watch the dramatic reveal animation as your compatibility percentage counts up.
6. Read the personalised compatibility summary for the two star signs.

## Project Structure

```text
zodiac-compatibility/
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

- **HTML5** — Semantic markup and accessible form inputs.
- **CSS3** — Custom properties, keyframe animations, and responsive layout.
- **JavaScript (ES2022+)** — Vanilla JS with ES modules for zodiac detection, compatibility logic, and DOM animation.

## Getting Started

No build tools or dependencies required. To run locally:

1. Clone the repository and navigate to the project folder:

   ```bash
   cd zodiac-compatibility
   ```

2. Open `index.html` directly in your browser, or start a local server:

   ```bash
   python3 -m http.server 5500
   ```

   Then visit `http://localhost:5500` in your browser.
