[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Habit Tracker

A daily habit tracker that helps you build consistency and stay accountable. Add custom habits, check them off each day, track your streaks, and visualise your progress over time on a GitHub-style calendar heatmap. All data is saved locally in the browser using localStorage — no sign-up required.

## Features

- **Add and remove habits** — Create custom habits with a name and optional emoji icon
- **Daily check-off** — Mark habits as complete for the current day with a single click
- **Streak tracking** — Automatically calculates current and longest streaks for each habit
- **Calendar heatmap** — GitHub-style grid showing activity intensity over the past year
- **Progress overview** — Dashboard displaying completion rates and daily totals
- **Colour-coded intensity** — Heatmap cells shade from light to dark based on how many habits were completed that day
- **Habit editing** — Rename or update existing habits without losing history
- **Data persistence** — All habits and completion data saved to localStorage
- **Responsive layout** — Works across desktop, tablet, and mobile screens
- **Reset option** — Clear individual habit history or wipe all data and start fresh

## How to Use

1. Open the app in your browser
2. Type a habit name into the input field and click **Add Habit**
3. Each habit appears as a card — click the checkbox to mark it done for today
4. View your current streak and best streak displayed on each habit card
5. Scroll down to the **calendar heatmap** to see your overall activity over time
6. Darker squares on the heatmap mean more habits completed that day
7. Click the delete button on a habit card to remove it and its history

## Project Structure

```text
habit-tracker/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── habits.js
│       ├── heatmap.js
│       └── storage.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic markup and accessible form controls
- **CSS3** — Custom properties, grid layout for the heatmap, and responsive design
- **JavaScript (ES2022+)** — ES modules for habit logic, streak calculations, and localStorage management

## Getting Started

No build tools or dependencies required. To run locally:

1. Clone the repository and navigate to the project folder:

   ```bash
   cd habit-tracker
   ```

2. Open `index.html` directly in your browser, or start a local server:

   ```bash
   python3 -m http.server 5500
   ```

   Then visit `http://localhost:5500` in your browser.
