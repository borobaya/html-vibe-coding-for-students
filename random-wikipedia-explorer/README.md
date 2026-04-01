[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Random Wikipedia Explorer

A fun, interactive web app that lets you discover random Wikipedia articles with the click of a button. Hit "Surprise Me" to fetch a random article from the Wikipedia API, complete with its title, summary, thumbnail image, and a direct link to the full article. Every article you view is saved to a browsing history so you can revisit anything that caught your eye.

## Features

- **Surprise Me button** — Fetches a random Wikipedia article instantly using the Wikipedia REST API
- **Article display** — Shows the article title, a short summary extract, and thumbnail image
- **Full article link** — Direct link to read the complete article on Wikipedia
- **Browsing history** — Keeps a scrollable list of all previously viewed articles during your session
- **History navigation** — Click any item in your history to load that article again
- **Loading state** — Visual feedback while articles are being fetched
- **Error handling** — Graceful messages if the API request fails or returns no results
- **Responsive design** — Clean layout that works on desktop and mobile screens

## How to Use

1. Open the app in your browser
2. Click the **Surprise Me** button to load a random Wikipedia article
3. Read the summary, view the thumbnail, and click the link to visit the full article
4. Keep clicking for more random articles — each one is added to your history
5. Scroll through the history panel and click any past article to revisit it

## Project Structure

```text
random-wikipedia-explorer/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic markup and page structure
- **CSS3** — Styling, layout, and responsive design
- **JavaScript (ES2022+)** — Fetching data from the Wikipedia API, DOM updates, and history management
- **Wikipedia REST API** — Source for random articles, summaries, and thumbnails

## Getting Started

This project makes API calls to Wikipedia, so it needs to be served over HTTP rather than opened directly as a file.

```bash
python3 server.py
```

Then open `http://localhost:5500/random-wikipedia-explorer` in your browser.
