[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Flashcard App

A flashcard study app built for active recall practice. Create custom decks, add question and answer cards, flip through them with a smooth animation, and mark cards as mastered to track your learning progress. All data is saved to localStorage so your decks persist between sessions.

## Features

- Create, rename, and delete flashcard decks
- Add, edit, and remove question/answer cards within any deck
- Smooth 3D card-flip animation to reveal answer on click
- Mark individual cards as mastered or unmastered
- Progress bar showing mastered vs. remaining cards per deck
- Shuffle mode to randomise card order for better recall
- Filter view to show only unmastered cards for focused study
- Deck overview displaying total cards and mastery percentage
- Persistent storage using localStorage — no account or server needed
- Fully responsive layout for desktop and mobile devices

## How to Use

1. Open the app and click **New Deck** to create a flashcard deck.
2. Give the deck a name (e.g. "Biology Chapter 5").
3. Inside the deck, click **Add Card** and enter a question on the front and an answer on the back.
4. Click a card to flip it and reveal the answer.
5. Press the **Mastered** button to mark a card you know well — it moves to the mastered pile.
6. Use the **Shuffle** button to randomise the remaining cards.
7. Toggle **Show Unmastered Only** to focus on cards you still need to learn.
8. Track your progress with the deck progress bar and mastery percentage.

## Project Structure

```text
flashcard-app/
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

- **HTML5** — Semantic page structure and accessible markup
- **CSS3** — Responsive layout, CSS variables, and 3D flip animation
- **JavaScript (ES2022+)** — ES modules, DOM manipulation, and localStorage API

## Getting Started

No dependencies or build tools required. To run locally:

1. Open `index.html` directly in your browser, or start the website from the project root:

   ```bash
   python3 server.py
   ```

2. Visit `http://localhost:5500/flashcard-app` if using the server.
