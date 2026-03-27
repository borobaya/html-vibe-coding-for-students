[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# GitHub Profile Viewer

A web app that lets you search for any GitHub username and instantly view their profile details, stats, and top repositories — all powered by the free GitHub REST API. Built with vanilla HTML, CSS, and JavaScript.

## Features

- Search for any GitHub user by username
- Displays the user's avatar, name, and bio
- Shows key stats: public repos, followers, and following counts
- Lists the user's top repositories sorted by stars
- Each repo card shows the name, description, primary language, and star count
- Direct links to the user's GitHub profile and each repository
- Responsive layout that works on desktop, tablet, and mobile
- Graceful error handling for invalid usernames or API failures
- Clean, modern UI with loading state feedback

## How to Use

1. Open the app in your browser.
2. Type a GitHub username into the search bar.
3. Press **Enter** or click the **Search** button.
4. View the user's profile card with their avatar, bio, and stats.
5. Scroll down to browse their top public repositories.
6. Click any repo name to open it directly on GitHub.

## Project Structure

```text
github-profile-viewer/
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
- **CSS3** — Styling, layout, and responsive design
- **JavaScript (ES2022+)** — Fetch API calls and DOM manipulation
- **GitHub REST API** — Public user and repository data

## Getting Started

No build tools or dependencies required.

**Option 1 — Open directly:**

Open `index.html` in your browser.

**Option 2 — Local server:**

```bash
cd github-profile-viewer && python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
