[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Space Tracker

A real-time ISS tracker that plots the current position of the International Space Station on an interactive map. Built with vanilla JavaScript and the free Open Notify API, it auto-refreshes every few seconds so you can watch the station orbit the Earth live. It also pulls in the latest crew manifest so you can see who is on board right now.

## Features

- **Live ISS position** — Fetches latitude and longitude from the Open Notify API and plots a marker on an interactive Leaflet map
- **Auto-refresh tracking** — Position updates automatically every few seconds without needing to reload the page
- **Orbit path trail** — Draws the recent path of the ISS across the map so you can visualise its trajectory
- **Current crew roster** — Displays the names of all astronauts currently aboard the ISS, pulled from the Open Notify `astros.json` endpoint
- **Coordinate readout** — Shows the current latitude and longitude numerically alongside the map
- **Responsive layout** — Works on desktop and mobile screens with a clean, space-themed dark UI

## How to Use

1. Open the app in your browser — the ISS position loads immediately
2. Watch the map marker move as the tracker auto-refreshes every few seconds
3. Scroll down (or check the sidebar) to see the list of current crew members on the ISS
4. Pan and zoom the map to explore where the station is passing over

## Project Structure

```text
space-tracker/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic page structure
- **CSS3** — Dark space-themed styling with CSS variables and responsive layout
- **JavaScript (ES2022+)** — Fetch API calls, DOM updates, and Leaflet map integration
- **Leaflet.js** — Open-source interactive map library (loaded via CDN)
- **Open Notify API** — Free public API for ISS position (`iss-now.json`) and crew data (`astros.json`)

## Getting Started

The app makes API calls, so it needs to be served over HTTP rather than opened as a plain file.

```bash
python3 server.py
```

Then open `http://localhost:5500/space-tracker` in your browser.
