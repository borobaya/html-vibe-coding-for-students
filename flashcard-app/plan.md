# Flashcard App — Implementation Plan

---

## 1. Overview

### Project Summary

A browser-based flashcard study app for active recall practice. Users create custom decks of question/answer cards, study them with a 3D flip animation, mark cards as mastered or not-mastered, and track learning progress per deck. All data persists in `localStorage` — no server or account required.

### User Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Deck List  │────▸│  Deck Detail /   │────▸│   Study Mode     │
│  (Home)     │     │  Card Editor     │     │   (Flip & Mark)  │
└─────────────┘     └──────────────────┘     └──────────────────┘
       │                     │                        │
       │  Create Deck        │  Add/Edit/Delete Cards  │  Flip card
       │  Rename Deck        │  View all cards         │  Mark mastered
       │  Delete Deck        │  See mastery stats      │  Mark not-mastered
       │                     │  Back to Deck List      │  Shuffle remaining
       │                     │                        │  Filter unmastered
       │                     │                        │  View progress bar
       └─────────────────────┴────────────────────────┘
                              ▼
                    localStorage persistence
```

### Detailed User Flow

1. **Landing / Deck List View** — User sees all saved decks as cards/tiles with name, card count, and mastery percentage. A "New Deck" button opens a creation form.
2. **Create Deck** — User types a deck name and clicks create. The new deck appears in the list with 0 cards.
3. **Deck Detail / Card Editor View** — User clicks a deck tile to enter it. They see all cards listed (question preview), plus buttons: "Add Card", "Study Deck", "Rename Deck", "Delete Deck". Each card row has edit/delete controls.
4. **Add/Edit Card** — A modal or inline form with "Question" and "Answer" textareas. Save adds/updates the card.
5. **Study Mode View** — A large centred card shows the question. User clicks to flip (3D animation reveals the answer). Below the card: "Mastered" (green) and "Still Learning" (amber) buttons. A progress bar at the top shows mastered/total. Navigation shows current position (e.g. "Card 3 of 12").
6. **Session Completion** — When all cards are reviewed, a summary screen shows: total cards, mastered count, still-learning count, mastery percentage, and a "Study Again" button.
7. **Back Navigation** — Hash-based routing lets the user navigate back to deck list or deck detail at any time.

---

## 2. Page Layout

### Wireframe — Deck List View (Home)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  📚 Flashcard App              [+ New Deck]        │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  MAIN — Deck Grid                                        │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Biology     │  │ History     │  │ JavaScript  │     │
│  │             │  │             │  │             │     │
│  │ 24 cards    │  │ 18 cards    │  │  9 cards    │     │
│  │ ██████░░ 75%│  │ ████░░░ 56%│  │ ██░░░░░ 33%│     │
│  │             │  │             │  │             │     │
│  │ [Edit][Del] │  │ [Edit][Del] │  │ [Edit][Del] │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  ┌─────────────┐                                        │
│  │  + New Deck │  (shown when 0 decks exist as          │
│  │   (empty    │   placeholder tile too)                 │
│  │    state)   │                                        │
│  └─────────────┘                                        │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
│  Built with vanilla JS — Data saved in localStorage     │
└──────────────────────────────────────────────────────────┘
```

### Wireframe — Deck Detail / Card Editor View

```
┌──────────────────────────────────────────────────────────┐
│  HEADER                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  [← Back]   Biology Deck          [Rename][Delete]│  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  STATS BAR                                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  24 cards  |  18 mastered  |  75% complete         │  │
│  │  ████████████████████░░░░░░░░                      │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ACTION BAR                                              │
│  [+ Add Card]                        [▶ Study Deck]     │
├──────────────────────────────────────────────────────────┤
│  CARD LIST                                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. What is mitosis?               ✅  [✏️][🗑️]  │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  2. Define osmosis                 ⬜  [✏️][🗑️]  │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  3. What is DNA?                   ✅  [✏️][🗑️]  │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

### Wireframe — Study Mode View

```
┌──────────────────────────────────────────────────────────┐
│  HEADER                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  [← Exit Study]     Biology     Card 3 of 12      │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  PROGRESS BAR                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ████████░░░░░░░░░░░░  25% mastered               │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  CARD AREA (centred)                                     │
│                                                          │
│         ┌──────────────────────────────┐                │
│         │                              │                │
│         │                              │                │
│         │   What is the powerhouse     │                │
│         │   of the cell?               │                │
│         │                              │                │
│         │        (click to flip)       │                │
│         │                              │                │
│         │                              │                │
│         └──────────────────────────────┘                │
│                                                          │
│         ┌──────────────────────────────┐  ← after flip  │
│         │                              │                │
│         │   The mitochondria           │                │
│         │                              │                │
│         └──────────────────────────────┘                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ACTION BUTTONS (below card)                             │
│                                                          │
│       [✅ Mastered]          [🔄 Still Learning]        │
│                                                          │
│  CONTROLS                                                │
│       [🔀 Shuffle]     [👁️ Unmastered Only]            │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

### Wireframe — Study Complete Screen

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                   🎉 Session Complete!                   │
│                                                          │
│              ┌──────────────────────┐                   │
│              │  Total Cards:   12   │                   │
│              │  Mastered:       9   │                   │
│              │  Still Learning: 3   │                   │
│              │  Mastery:       75%  │                   │
│              └──────────────────────┘                   │
│                                                          │
│         [🔁 Study Again]    [← Back to Deck]            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Deck Grid Columns | Card Size     | Layout Changes                        |
| ---------- | ----------------- | ------------- | ------------------------------------- |
| ≥ 1024px   | 3 columns         | 320 × 220px   | Full layout, side padding 2rem        |
| 768–1023px | 2 columns         | 280 × 200px   | Reduced padding 1.5rem               |
| < 768px    | 1 column          | 100% width    | Stack everything, full-width cards    |

---

## 3. Colour Scheme & Typography

### Colour Palette

| Role                  | CSS Variable                | Value       | Usage                                      |
| --------------------- | --------------------------- | ----------- | ------------------------------------------ |
| **Background**        | `--clr-bg`                  | `#f8f9fa`   | Page background                            |
| **Surface**           | `--clr-surface`             | `#ffffff`   | Card backgrounds, panels                   |
| **Surface Alt**       | `--clr-surface-alt`         | `#f1f3f5`   | Alternate card rows, subtle sections       |
| **Text Primary**      | `--clr-text`                | `#212529`   | Headings, body text                        |
| **Text Secondary**    | `--clr-text-muted`          | `#6c757d`   | Meta info, helper text                     |
| **Primary**           | `--clr-primary`             | `#4361ee`   | Primary buttons, links, active states      |
| **Primary Hover**     | `--clr-primary-hover`       | `#3a56d4`   | Button hover state                         |
| **Primary Light**     | `--clr-primary-light`       | `#eef0fb`   | Primary tinted backgrounds                 |
| **Card Front**        | `--clr-card-front`          | `#ffffff`   | Question side of flashcard                 |
| **Card Back**         | `--clr-card-back`           | `#4361ee`   | Answer side of flashcard                   |
| **Card Back Text**    | `--clr-card-back-text`      | `#ffffff`   | Text colour on answer side                 |
| **Mastered**          | `--clr-mastered`            | `#2ecc71`   | Mastered badge, button, icon               |
| **Mastered Light**    | `--clr-mastered-light`      | `#e8f8ef`   | Mastered background tint                   |
| **Needs Review**      | `--clr-review`              | `#f0a500`   | Still-learning badge, button               |
| **Needs Review Light**| `--clr-review-light`        | `#fef5e0`   | Needs-review background tint              |
| **Danger**            | `--clr-danger`              | `#e74c3c`   | Delete buttons, destructive actions        |
| **Danger Hover**      | `--clr-danger-hover`        | `#c0392b`   | Delete button hover                        |
| **Border**            | `--clr-border`              | `#dee2e6`   | Card borders, dividers, input borders      |
| **Shadow**            | `--clr-shadow`              | `rgba(0,0,0,0.08)` | Box shadows                       |
| **Overlay**           | `--clr-overlay`             | `rgba(0,0,0,0.4)` | Modal backdrop                      |

### CSS Variables Block

```css
:root {
  /* Colours */
  --clr-bg: #f8f9fa;
  --clr-surface: #ffffff;
  --clr-surface-alt: #f1f3f5;
  --clr-text: #212529;
  --clr-text-muted: #6c757d;
  --clr-primary: #4361ee;
  --clr-primary-hover: #3a56d4;
  --clr-primary-light: #eef0fb;
  --clr-card-front: #ffffff;
  --clr-card-back: #4361ee;
  --clr-card-back-text: #ffffff;
  --clr-mastered: #2ecc71;
  --clr-mastered-light: #e8f8ef;
  --clr-review: #f0a500;
  --clr-review-light: #fef5e0;
  --clr-danger: #e74c3c;
  --clr-danger-hover: #c0392b;
  --clr-border: #dee2e6;
  --clr-shadow: rgba(0, 0, 0, 0.08);
  --clr-overlay: rgba(0, 0, 0, 0.4);

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  --fs-xs: 0.75rem;
  --fs-sm: 0.875rem;
  --fs-base: 1rem;
  --fs-md: 1.125rem;
  --fs-lg: 1.5rem;
  --fs-xl: 2rem;
  --fs-2xl: 2.5rem;
  --fw-normal: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --lh-tight: 1.2;
  --lh-normal: 1.5;
  --lh-relaxed: 1.7;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
  --flip-duration: 600ms;

  /* Shadows */
  --shadow-sm: 0 1px 3px var(--clr-shadow);
  --shadow-md: 0 4px 12px var(--clr-shadow);
  --shadow-lg: 0 8px 24px var(--clr-shadow);
}
```

### Typography Scale

| Element            | Size          | Weight    | Line Height |
| ------------------ | ------------- | --------- | ----------- |
| Page title (h1)    | `--fs-2xl`    | 700 bold  | 1.2         |
| Section head (h2)  | `--fs-xl`     | 700 bold  | 1.2         |
| Subsection (h3)    | `--fs-lg`     | 600 semi  | 1.3         |
| Card question text | `--fs-md`     | 500 med   | 1.5         |
| Body text          | `--fs-base`   | 400 norm  | 1.5         |
| Meta / helper      | `--fs-sm`     | 400 norm  | 1.5         |
| Badge / tiny       | `--fs-xs`     | 600 semi  | 1.2         |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Flashcard study app — create decks, flip cards, track mastery with active recall.">
  <title>Flashcard App</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <!-- ===== HEADER ===== -->
  <header class="app-header">
    <div class="header__inner">
      <a href="#" class="header__logo" aria-label="Flashcard App home">
        <span class="header__icon" aria-hidden="true">📚</span>
        <h1 class="header__title">Flashcard App</h1>
      </a>
      <nav class="header__nav" id="header-nav" aria-label="Breadcrumb navigation">
        <!-- Dynamically populated: [Back] / Deck Name / Card X of Y -->
      </nav>
    </div>
  </header>

  <!-- ===== MAIN CONTENT ===== -->
  <main class="app-main" id="app-main">

    <!-- ————— VIEW: Deck List ————— -->
    <section class="view view--deck-list" id="view-deck-list" aria-labelledby="deck-list-heading">
      <div class="view__header">
        <h2 id="deck-list-heading" class="view__title">Your Decks</h2>
        <button class="btn btn--primary" id="btn-new-deck" type="button">
          <span aria-hidden="true">+</span> New Deck
        </button>
      </div>

      <!-- Empty state -->
      <div class="empty-state" id="empty-state-decks" hidden>
        <p class="empty-state__icon" aria-hidden="true">📝</p>
        <p class="empty-state__text">No decks yet. Create your first deck to get started!</p>
      </div>

      <!-- Deck grid -->
      <div class="deck-grid" id="deck-grid" role="list" aria-label="Flashcard decks">
        <!-- Deck tiles rendered by JS -->
      </div>
    </section>

    <!-- ————— VIEW: Deck Detail / Card Editor ————— -->
    <section class="view view--deck-detail" id="view-deck-detail" hidden aria-labelledby="deck-detail-heading">
      <div class="view__header">
        <button class="btn btn--ghost" id="btn-back-to-decks" type="button" aria-label="Back to deck list">
          ← Back
        </button>
        <h2 id="deck-detail-heading" class="view__title"><!-- Deck name --></h2>
        <div class="view__actions">
          <button class="btn btn--ghost" id="btn-rename-deck" type="button" aria-label="Rename deck">Rename</button>
          <button class="btn btn--danger-ghost" id="btn-delete-deck" type="button" aria-label="Delete deck">Delete</button>
        </div>
      </div>

      <!-- Deck stats bar -->
      <div class="stats-bar" id="deck-stats" aria-label="Deck statistics">
        <span class="stats-bar__item" id="stat-total">0 cards</span>
        <span class="stats-bar__divider" aria-hidden="true">|</span>
        <span class="stats-bar__item" id="stat-mastered">0 mastered</span>
        <span class="stats-bar__divider" aria-hidden="true">|</span>
        <span class="stats-bar__item" id="stat-percent">0% complete</span>
      </div>
      <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="deck-progress">
        <div class="progress-bar__fill" id="deck-progress-fill"></div>
      </div>

      <!-- Action bar -->
      <div class="action-bar">
        <button class="btn btn--primary" id="btn-add-card" type="button">
          <span aria-hidden="true">+</span> Add Card
        </button>
        <button class="btn btn--accent" id="btn-study-deck" type="button" aria-label="Start study session">
          ▶ Study Deck
        </button>
      </div>

      <!-- Card list -->
      <div class="card-list" id="card-list" role="list" aria-label="Cards in this deck">
        <!-- Card rows rendered by JS -->
      </div>

      <!-- Empty state for no cards -->
      <div class="empty-state" id="empty-state-cards" hidden>
        <p class="empty-state__icon" aria-hidden="true">🃏</p>
        <p class="empty-state__text">This deck is empty. Add your first card!</p>
      </div>
    </section>

    <!-- ————— VIEW: Study Mode ————— -->
    <section class="view view--study" id="view-study" hidden aria-labelledby="study-heading">
      <div class="view__header">
        <button class="btn btn--ghost" id="btn-exit-study" type="button" aria-label="Exit study session">
          ← Exit Study
        </button>
        <h2 id="study-heading" class="view__title"><!-- Deck name --></h2>
        <span class="study-counter" id="study-counter" aria-live="polite">Card 1 of 12</span>
      </div>

      <!-- Study progress bar -->
      <div class="progress-bar progress-bar--study" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="study-progress">
        <div class="progress-bar__fill" id="study-progress-fill"></div>
      </div>

      <!-- Flashcard container -->
      <div class="study-area">
        <div class="flashcard-container" id="flashcard-container">
          <div class="flashcard" id="flashcard" tabindex="0" role="button" aria-label="Click to flip card" aria-live="polite">
            <div class="flashcard__face flashcard__front" id="flashcard-front">
              <p class="flashcard__label">Question</p>
              <p class="flashcard__content" id="flashcard-question"><!-- Question text --></p>
              <p class="flashcard__hint">Click to reveal answer</p>
            </div>
            <div class="flashcard__face flashcard__back" id="flashcard-back" aria-hidden="true">
              <p class="flashcard__label">Answer</p>
              <p class="flashcard__content" id="flashcard-answer"><!-- Answer text --></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Study action buttons -->
      <div class="study-actions" id="study-actions">
        <button class="btn btn--mastered" id="btn-mastered" type="button" aria-label="Mark as mastered">
          ✅ Mastered
        </button>
        <button class="btn btn--review" id="btn-still-learning" type="button" aria-label="Mark as still learning">
          🔄 Still Learning
        </button>
      </div>

      <!-- Study controls -->
      <div class="study-controls">
        <button class="btn btn--ghost" id="btn-shuffle" type="button" aria-label="Shuffle remaining cards">
          🔀 Shuffle
        </button>
        <button class="btn btn--ghost" id="btn-filter-unmastered" type="button" aria-pressed="false" aria-label="Show only unmastered cards">
          👁️ Unmastered Only
        </button>
      </div>
    </section>

    <!-- ————— VIEW: Study Complete ————— -->
    <section class="view view--complete" id="view-complete" hidden aria-labelledby="complete-heading">
      <div class="complete-screen">
        <p class="complete-screen__icon" aria-hidden="true">🎉</p>
        <h2 id="complete-heading" class="complete-screen__title">Session Complete!</h2>
        <div class="complete-screen__stats" aria-label="Session results">
          <div class="complete-stat">
            <span class="complete-stat__label">Total Cards</span>
            <span class="complete-stat__value" id="complete-total">0</span>
          </div>
          <div class="complete-stat">
            <span class="complete-stat__label">Mastered</span>
            <span class="complete-stat__value complete-stat__value--mastered" id="complete-mastered">0</span>
          </div>
          <div class="complete-stat">
            <span class="complete-stat__label">Still Learning</span>
            <span class="complete-stat__value complete-stat__value--review" id="complete-learning">0</span>
          </div>
          <div class="complete-stat">
            <span class="complete-stat__label">Mastery</span>
            <span class="complete-stat__value" id="complete-percent">0%</span>
          </div>
        </div>
        <div class="complete-screen__actions">
          <button class="btn btn--primary" id="btn-study-again" type="button">🔁 Study Again</button>
          <button class="btn btn--ghost" id="btn-back-to-deck" type="button">← Back to Deck</button>
        </div>
      </div>
    </section>
  </main>

  <!-- ===== MODAL: Card Form ===== -->
  <div class="modal-overlay" id="modal-card" hidden aria-modal="true" role="dialog" aria-labelledby="modal-card-title">
    <div class="modal">
      <div class="modal__header">
        <h3 id="modal-card-title" class="modal__title">Add Card</h3>
        <button class="btn btn--icon" id="btn-close-modal" type="button" aria-label="Close modal">✕</button>
      </div>
      <form class="modal__form" id="form-card">
        <div class="form-group">
          <label for="input-question" class="form-label">Question (Front)</label>
          <textarea id="input-question" class="form-input form-input--textarea" rows="3" required
                    placeholder="Enter the question…" aria-required="true"></textarea>
        </div>
        <div class="form-group">
          <label for="input-answer" class="form-label">Answer (Back)</label>
          <textarea id="input-answer" class="form-input form-input--textarea" rows="3" required
                    placeholder="Enter the answer…" aria-required="true"></textarea>
        </div>
        <div class="modal__actions">
          <button class="btn btn--ghost" type="button" id="btn-cancel-card">Cancel</button>
          <button class="btn btn--primary" type="submit" id="btn-save-card">Save Card</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ===== MODAL: Deck Form ===== -->
  <div class="modal-overlay" id="modal-deck" hidden aria-modal="true" role="dialog" aria-labelledby="modal-deck-title">
    <div class="modal">
      <div class="modal__header">
        <h3 id="modal-deck-title" class="modal__title">New Deck</h3>
        <button class="btn btn--icon" id="btn-close-deck-modal" type="button" aria-label="Close modal">✕</button>
      </div>
      <form class="modal__form" id="form-deck">
        <div class="form-group">
          <label for="input-deck-name" class="form-label">Deck Name</label>
          <input type="text" id="input-deck-name" class="form-input" required maxlength="60"
                 placeholder="e.g. Biology Chapter 5" aria-required="true">
        </div>
        <div class="modal__actions">
          <button class="btn btn--ghost" type="button" id="btn-cancel-deck">Cancel</button>
          <button class="btn btn--primary" type="submit" id="btn-save-deck">Create Deck</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ===== MODAL: Confirm Delete ===== -->
  <div class="modal-overlay" id="modal-confirm" hidden aria-modal="true" role="dialog" aria-labelledby="modal-confirm-title">
    <div class="modal modal--sm">
      <h3 id="modal-confirm-title" class="modal__title">Confirm Delete</h3>
      <p class="modal__text" id="confirm-message">Are you sure you want to delete this?</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" id="btn-confirm-cancel" type="button">Cancel</button>
        <button class="btn btn--danger" id="btn-confirm-delete" type="button">Delete</button>
      </div>
    </div>
  </div>

  <!-- ===== SCRIPTS ===== -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- `aria-live="polite"` on card counter and flashcard so screen readers announce changes.
- `role="progressbar"` with `aria-valuenow` on progress bars, updated by JS.
- All interactive elements have `aria-label` where visible text is insufficient.
- Modals use `aria-modal="true"` and `role="dialog"` with `aria-labelledby`.
- `hidden` attribute used to toggle views (ensures elements are not in the accessibility tree when hidden).
- Focus is managed programmatically: when a modal opens, focus moves to the first input; when it closes, focus returns to the trigger button.
- The flashcard is keyboard-accessible with `tabindex="0"` and responds to Enter/Space.

---

## 5. CSS Design

### Card Flip Animation (CSS 3D Transforms)

```css
/* Flashcard container - establishes 3D context */
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 480px;
  height: 300px;
  margin: 0 auto;
}

/* The card itself - acts as the rotating plane */
.flashcard {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--flip-duration) cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: var(--radius-lg);
}

/* Flip state - applied via JS toggle */
.flashcard.is-flipped {
  transform: rotateY(180deg);
}

/* Shared face styles */
.flashcard__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  overflow-y: auto;
}

/* Front face */
.flashcard__front {
  background: var(--clr-card-front);
  color: var(--clr-text);
  border: 2px solid var(--clr-border);
}

/* Back face - rotated 180deg so it shows when card is flipped */
.flashcard__back {
  background: var(--clr-card-back);
  color: var(--clr-card-back-text);
  transform: rotateY(180deg);
}

/* Flashcard text styling */
.flashcard__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  margin-bottom: var(--space-sm);
}

.flashcard__content {
  font-size: var(--fs-lg);
  font-weight: var(--fw-medium);
  line-height: var(--lh-normal);
  word-break: break-word;
}

.flashcard__hint {
  font-size: var(--fs-sm);
  color: var(--clr-text-muted);
  margin-top: auto;
  padding-top: var(--space-md);
}
```

### View Transitions

```css
/* Views fade in/out */
.view {
  animation: fadeIn 250ms ease forwards;
}

.view[hidden] {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Progress Bar

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--space-sm) 0;
}

.progress-bar__fill {
  height: 100%;
  background: var(--clr-mastered);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
  width: 0%;
}

.progress-bar--study {
  height: 10px;
  margin-bottom: var(--space-lg);
}
```

### Responsive Card Sizing

```css
/* Desktop */
.flashcard-container {
  max-width: 480px;
  height: 300px;
}

/* Tablet */
@media (max-width: 1023px) {
  .flashcard-container {
    max-width: 420px;
    height: 280px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .flashcard-container {
    max-width: 100%;
    height: 260px;
  }

  .flashcard__content {
    font-size: var(--fs-md);
  }
}
```

### Deck Grid

```css
.deck-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 1023px) {
  .deck-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .deck-grid {
    grid-template-columns: 1fr;
  }
}
```

### Button Styles

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.btn:active {
  transform: scale(0.97);
}

.btn--primary {
  background: var(--clr-primary);
  color: #fff;
}
.btn--primary:hover {
  background: var(--clr-primary-hover);
}

.btn--mastered {
  background: var(--clr-mastered);
  color: #fff;
  padding: var(--space-md) var(--space-xl);
  font-size: var(--fs-base);
}

.btn--review {
  background: var(--clr-review);
  color: #fff;
  padding: var(--space-md) var(--space-xl);
  font-size: var(--fs-base);
}

.btn--danger {
  background: var(--clr-danger);
  color: #fff;
}
.btn--danger:hover {
  background: var(--clr-danger-hover);
}

.btn--danger-ghost {
  background: transparent;
  color: var(--clr-danger);
}
.btn--danger-ghost:hover {
  background: var(--clr-danger);
  color: #fff;
}

.btn--ghost {
  background: transparent;
  color: var(--clr-text-muted);
}
.btn--ghost:hover {
  background: var(--clr-surface-alt);
  color: var(--clr-text);
}

.btn--icon {
  background: transparent;
  padding: var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--fs-md);
  color: var(--clr-text-muted);
}
.btn--icon:hover {
  background: var(--clr-surface-alt);
}
```

### Modal Styling

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--clr-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 200ms ease;
}

.modal-overlay[hidden] {
  display: none;
}

.modal {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  width: 90%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
}

.modal--sm {
  max-width: 360px;
}
```

### Form Styles

```css
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--clr-text);
  margin-bottom: var(--space-xs);
}

.form-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--fs-base);
  color: var(--clr-text);
  background: var(--clr-surface);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px var(--clr-primary-light);
}

.form-input--textarea {
  resize: vertical;
  min-height: 80px;
}
```

---

## 6. JavaScript Architecture

### Module Map

```
js/
├── main.js               ← Entry point: init, global event setup
└── modules/
    ├── router.js          ← Hash-based view switching
    ├── storage.js         ← localStorage schema and CRUD
    ├── decks.js           ← Deck CRUD operations (uses storage.js)
    ├── cards.js           ← Card CRUD operations (uses storage.js)
    ├── study.js           ← Study session logic, shuffle, mastery
    └── ui.js              ← DOM rendering, event binding, view updates
```

### `main.js` — Entry Point

```js
/**
 * File: main.js
 * Description: App initialisation, module wiring, global event setup.
 */

import { initRouter } from './modules/router.js';
import { initUI }     from './modules/ui.js';

/**
 * Initialise the application once the DOM is fully loaded.
 */
function init() {
  initUI();
  initRouter();
}

document.addEventListener('DOMContentLoaded', init);
```

**Responsibilities:**
- Call `initUI()` to bind all button click handlers and modal controls.
- Call `initRouter()` to parse the initial hash and show the correct view.
- No other logic lives here — it's purely a coordinator.

---

### `modules/router.js` — Hash-Based View Switching

**Hash scheme:**

| Hash                     | View              | Context               |
| ------------------------ | ----------------- | --------------------- |
| `#` or `#decks`          | Deck List         | —                     |
| `#deck/{deckId}`         | Deck Detail       | Show cards for deckId |
| `#study/{deckId}`        | Study Mode        | Study deckId          |
| `#complete/{deckId}`     | Session Complete  | Results for deckId    |

**Exports:**
```js
export function initRouter()                // Listen to hashchange, call route()
export function route()                     // Parse hash, show correct view
export function navigateTo(hash)            // Set window.location.hash
```

**Logic:**
1. Listen to `window.addEventListener('hashchange', route)`.
2. `route()` reads `window.location.hash`, splits on `/`, extracts the view name and optional deckId.
3. Hides all `.view` sections, unhides the matching one, then calls the appropriate UI render function (e.g. `renderDeckList()`, `renderDeckDetail(deckId)`, `startStudySession(deckId)`).
4. `navigateTo(hash)` is a helper that sets the hash programmatically (used by button handlers).

---

### `modules/storage.js` — localStorage Operations

**Storage key:** `"flashcard-app-data"`

**Exports:**
```js
export function loadData()                  // Parse JSON from localStorage, return full data object
export function saveData(data)              // Stringify and write to localStorage
export function getDecks()                  // Return array of all decks
export function getDeck(deckId)             // Return a single deck by ID
export function saveDeck(deck)              // Add or update a deck in the array
export function deleteDeck(deckId)          // Remove deck by ID
export function getCards(deckId)            // Return cards array for a deck
export function getCard(deckId, cardId)     // Return a single card
export function saveCard(deckId, card)      // Add or update a card in a deck
export function deleteCard(deckId, cardId)  // Remove card from a deck
export function generateId()               // Return a unique ID string (crypto.randomUUID or fallback)
```

**Internal helpers:**
- `loadData()` wraps `JSON.parse(localStorage.getItem(KEY))` with a try/catch. Returns `{ decks: [] }` if empty or corrupted.
- `saveData(data)` wraps `localStorage.setItem(KEY, JSON.stringify(data))`.
- All other functions call `loadData()`, mutate, then call `saveData()`.

---

### `modules/decks.js` — Deck CRUD

**Exports:**
```js
export function createDeck(name)            // Create a new deck, return it
export function renameDeck(deckId, newName)  // Update deck name
export function removeDeck(deckId)          // Delete deck and all its cards
export function getAllDecks()               // Get all decks with computed stats
export function getDeckById(deckId)         // Get single deck with computed stats
```

**Computed stats** (calculated on read, not stored):
- `totalCards` — length of cards array
- `masteredCards` — count where `card.mastered === true`
- `masteryPercent` — `Math.round((masteredCards / totalCards) * 100)` or 0

---

### `modules/cards.js` — Card CRUD

**Exports:**
```js
export function addCard(deckId, question, answer)       // Create card, return it
export function editCard(deckId, cardId, question, answer) // Update card text
export function removeCard(deckId, cardId)               // Delete card
export function toggleMastered(deckId, cardId)           // Flip mastered boolean
export function setMastered(deckId, cardId, value)       // Explicitly set mastered
export function getCardsForDeck(deckId)                  // Return all cards for deck
```

---

### `modules/study.js` — Study Session Logic

**Internal state** (module-scoped variables):
```js
let currentDeckId = null;
let studyQueue = [];       // Cards to study (shuffled subset)
let currentIndex = 0;      // Position in studyQueue
let sessionResults = { mastered: 0, learning: 0 };
let filterUnmastered = false;
```

**Exports:**
```js
export function startSession(deckId)        // Init session, shuffle cards, reset state
export function getCurrentCard()            // Return current card object
export function getSessionProgress()        // Return { current, total, percent, results }
export function markCurrentMastered()       // Mark card mastered, advance to next
export function markCurrentLearning()       // Mark card not-mastered, advance to next
export function shuffleRemaining()          // Re-shuffle cards from currentIndex onward
export function toggleFilterUnmastered()    // Toggle filter, rebuild queue
export function isSessionComplete()         // True if currentIndex >= studyQueue.length
export function getSessionResults()         // Return final stats
export function advanceCard()               // Move to next card (internal, called by mark functions)
```

**Shuffle algorithm** — Fisher-Yates (in-place):
```js
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

---

### `modules/ui.js` — View Rendering & DOM Interaction

**Exports:**
```js
export function initUI()                    // Bind all static event listeners
export function renderDeckList()            // Populate deck grid
export function renderDeckDetail(deckId)    // Populate card list, stats, title
export function renderStudyCard()           // Show current card (question side)
export function flipCard()                  // Toggle .is-flipped class
export function updateProgress(percent)     // Update progress bar width + aria
export function showModal(modalId)          // Unhide modal, trap focus
export function hideModal(modalId)          // Hide modal, restore focus
export function showView(viewId)            // Unhide one view, hide all others
export function renderComplete(results)     // Show completion screen
```

**Event bindings in `initUI()`:**
- `#btn-new-deck` → open deck modal
- `#form-deck` submit → `createDeck()`, re-render, close modal
- `#btn-add-card` → open card modal
- `#form-card` submit → `addCard()`, re-render, close modal
- `#flashcard` click/Enter/Space → `flipCard()`
- `#btn-mastered` → `markCurrentMastered()`, render next card or complete
- `#btn-still-learning` → `markCurrentLearning()`, render next card or complete
- `#btn-shuffle` → `shuffleRemaining()`, render current card
- `#btn-filter-unmastered` → `toggleFilterUnmastered()`, update `aria-pressed`
- `#btn-study-again` → `startSession()` again
- Modal close/cancel buttons → `hideModal()`
- Overlay click → `hideModal()`
- Escape key → `hideModal()`
- Delegate clicks on deck grid (edit/delete) and card list (edit/delete/toggle mastered)

**Dynamic HTML generation** uses `document.createElement` or template literals assigned to `innerHTML` with **text content sanitised** via a helper:

```js
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

---

## 7. Data Model

### localStorage Schema

**Key:** `"flashcard-app-data"`

**Top-level shape:**
```json
{
  "decks": [ ...Deck objects ]
}
```

### Deck Object

```js
{
  id: "a1b2c3d4",          // String — unique ID (crypto.randomUUID())
  name: "Biology Ch. 5",   // String — user-entered deck name (max 60 chars)
  createdAt: 1711497600000, // Number — Date.now() at creation
  updatedAt: 1711497600000, // Number — Date.now() at last modification
  cards: [ ...Card objects ]
}
```

### Card Object

```js
{
  id: "e5f6g7h8",          // String — unique ID
  question: "What is DNA?", // String — front of card (the question)
  answer: "Deoxyribonucleic acid, a molecule that carries genetic instructions.",
                             // String — back of card (the answer)
  mastered: false,          // Boolean — whether user has marked this as mastered
  createdAt: 1711497600000, // Number — Date.now() at creation
  lastReviewed: null        // Number|null — Date.now() of last study review
}
```

### Example localStorage Content

```json
{
  "decks": [
    {
      "id": "dk_abc123",
      "name": "Biology Chapter 5",
      "createdAt": 1711497600000,
      "updatedAt": 1711501200000,
      "cards": [
        {
          "id": "cd_xyz789",
          "question": "What is mitosis?",
          "answer": "A type of cell division resulting in two identical daughter cells.",
          "mastered": true,
          "createdAt": 1711497660000,
          "lastReviewed": 1711500000000
        },
        {
          "id": "cd_def456",
          "question": "Define osmosis",
          "answer": "The movement of water molecules through a semipermeable membrane.",
          "mastered": false,
          "createdAt": 1711497720000,
          "lastReviewed": null
        }
      ]
    }
  ]
}
```

### ID Generation

```js
function generateId(prefix = '') {
  const id = crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  return prefix ? `${prefix}_${id}` : id;
}
```

Use `generateId('dk')` for decks, `generateId('cd')` for cards.

---

## 8. Study Mode Logic

### Session Initialisation

1. `startSession(deckId)` is called when the user clicks "Study Deck".
2. Load all cards for `deckId` from storage.
3. If `filterUnmastered` is `true`, filter to only cards where `mastered === false`.
4. If no cards to study, show an alert/message and don't navigate.
5. Clone the card array (to avoid mutating storage references).
6. Apply Fisher-Yates shuffle to the cloned array → `studyQueue`.
7. Set `currentIndex = 0`, reset `sessionResults = { mastered: 0, learning: 0 }`.
8. Navigate to `#study/{deckId}`.
9. Render the first card (question side).

### Card Interaction Flow

```
User sees question (front)
        │
        ▼
  Click/tap/Enter → card flips (rotateY 180deg)
        │
        ▼
User sees answer (back)
        │
        ├──── Click "Mastered" ──────▶ setMastered(true), sessionResults.mastered++
        │                                     │
        └──── Click "Still Learning" ──▶ setMastered(false), sessionResults.learning++
                                              │
                                              ▼
                                      currentIndex++
                                              │
                              ┌───────────────┴───────────────┐
                              │                               │
                    currentIndex < total              currentIndex >= total
                              │                               │
                              ▼                               ▼
                    Render next card               Navigate to #complete/{deckId}
                    (reset flip to front)          Show session results
```

### Shuffle Algorithm — Fisher-Yates (In-Place)

```js
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} arr - The array to shuffle
 * @returns {Array} The same array, shuffled
 */
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

When "Shuffle" is pressed mid-session:
1. Take the subarray from `currentIndex` to the end of `studyQueue`.
2. Apply Fisher-Yates to that subarray only.
3. Splice it back in.
4. Re-render the current card (which may now be a different card).

### Mastery Tracking

- When the user clicks "Mastered", `cards.setMastered(deckId, cardId, true)` is called → persists immediately to localStorage.
- When the user clicks "Still Learning", `cards.setMastered(deckId, cardId, false)` is called.
- `card.lastReviewed` is updated to `Date.now()` on either action.
- Session results (`sessionResults`) are tracked in memory only (not persisted) for the completion screen.
- The deck's `updatedAt` timestamp is refreshed whenever any card's mastery changes.

### Filter: Unmastered Only

- `toggleFilterUnmastered()` flips `filterUnmastered` boolean.
- Rebuilds `studyQueue` from the full deck, filtering to `mastered === false`.
- Resets `currentIndex = 0`, re-shuffles.
- Updates `aria-pressed` on the filter button.

### Session Completion

When `currentIndex >= studyQueue.length`:
1. Navigate to `#complete/{deckId}`.
2. Display:
   - **Total Cards** — `studyQueue.length`
   - **Mastered** — `sessionResults.mastered`
   - **Still Learning** — `sessionResults.learning`
   - **Mastery %** — overall deck mastery (not just session), recalculated from stored data.
3. "Study Again" → calls `startSession(deckId)` to reset and reshuffle.
4. "Back to Deck" → `navigateTo(`#deck/${deckId}`)`.

---

## 9. Accessibility & State Management

### Accessibility Requirements

| Requirement                | Implementation                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| **Screen reader card flip**| `aria-live="polite"` on `#flashcard` — announces content when card flips.                |
| **Progress announcement**  | `aria-live="polite"` on `#study-counter` — announces "Card X of Y".                     |
| **Progress bar**           | `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.   |
| **Keyboard navigation**    | Flashcard responds to `Enter` and `Space` (via `keydown` listener on `tabindex="0"`).    |
| **Focus management**       | Modal open → focus first input. Modal close → focus trigger button. View change → focus heading. |
| **Focus trapping**         | While a modal is open, Tab cycles only within the modal (first/last focusable element loop). |
| **Skip link**              | Optional: add a skip-to-main link in the header for keyboard users.                      |
| **Button labels**          | All icon-only buttons have `aria-label`. Emoji icons use `aria-hidden="true"`.           |
| **Colour contrast**        | All text/background combinations meet WCAG 2.1 AA (4.5:1 ratio minimum).                |
| **Reduced motion**         | Wrap animations in `@media (prefers-reduced-motion: reduce)` to disable or shorten them. |
| **Visible focus rings**    | All interactive elements have a clear `:focus-visible` outline.                          |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .flashcard {
    transition: none;
  }

  .view {
    animation: none;
  }

  .progress-bar__fill {
    transition: none;
  }
}
```

### Focus Visible

```css
:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}

.btn:focus-visible {
  box-shadow: 0 0 0 3px var(--clr-primary-light);
}
```

### State Management Approach

The app uses a **storage-as-source-of-truth** pattern:

1. **All persistent state** lives in `localStorage` via `storage.js`. There is no in-memory "store" that can fall out of sync.
2. **Read before render** — Every render function reads fresh data from `storage.js`. This prevents stale UI.
3. **Write then re-render** — Every mutation (create, update, delete) writes to storage first, then triggers a re-render of the affected view.
4. **Ephemeral state** — Study session state (`studyQueue`, `currentIndex`, `sessionResults`) is held in module-scoped variables in `study.js`. This state is intentionally non-persistent — refreshing the page exits the study session.
5. **View state** — Which view is active is determined by the URL hash. The router reads the hash and shows the appropriate view. This means the browser back/forward buttons work naturally.

### State Flow Diagram

```
User Action
    │
    ▼
Event Handler (ui.js)
    │
    ├── Calls business logic (decks.js / cards.js / study.js)
    │       │
    │       ▼
    │   storage.js writes to localStorage
    │
    ▼
Re-render affected view (ui.js reads from storage.js)
    │
    ▼
DOM updates → user sees changes
```

---

## 10. Implementation Checklist

### Phase 1: Project Setup & Static Shell
- [ ] Create `index.html` with full semantic markup (all views, modals)
- [ ] Create `styles/main.css` with CSS variables, reset, base typography
- [ ] Add Google Fonts `<link>` for Inter
- [ ] Style the header and footer
- [ ] Style the deck grid and deck tile components
- [ ] Build responsive grid (3 → 2 → 1 column breakpoints)
- [ ] Style the empty state component
- [ ] Create `js/main.js` with `DOMContentLoaded` listener

### Phase 2: Storage & Data Layer
- [ ] Implement `js/modules/storage.js` — `loadData()`, `saveData()`, `generateId()`
- [ ] Implement per-entity CRUD functions in `storage.js`
- [ ] Test storage in browser console: create, read, update, delete
- [ ] Verify data format matches the schema from Section 7

### Phase 3: Deck Management
- [ ] Implement `js/modules/decks.js` — `createDeck()`, `renameDeck()`, `removeDeck()`, `getAllDecks()`, `getDeckById()`
- [ ] Implement `js/modules/router.js` — hash parsing, `initRouter()`, `navigateTo()`
- [ ] Implement `js/modules/ui.js` — `initUI()`, `showView()`, `renderDeckList()`
- [ ] Wire "New Deck" button → modal → create → re-render
- [ ] Wire deck tile click → navigate to `#deck/{id}`
- [ ] Wire deck rename and delete with confirmation modal
- [ ] Show/hide empty state when 0 decks exist
- [ ] Test: create multiple decks, rename, delete, verify localStorage

### Phase 4: Card Management
- [ ] Implement `js/modules/cards.js` — `addCard()`, `editCard()`, `removeCard()`, `toggleMastered()`, `setMastered()`
- [ ] Implement `renderDeckDetail(deckId)` in `ui.js`
- [ ] Wire "Add Card" button → modal → create → re-render card list
- [ ] Wire card edit (populate modal with existing data) → save → re-render
- [ ] Wire card delete with confirmation
- [ ] Display mastery badge (✅/⬜) per card row
- [ ] Display deck stats bar (total, mastered, percentage) and progress bar
- [ ] Disable "Study Deck" button if deck has no cards
- [ ] Test: add/edit/delete cards, verify persistence

### Phase 5: Card Flip Animation
- [ ] Style `.flashcard-container` with `perspective: 1000px`
- [ ] Style `.flashcard` with `transform-style: preserve-3d` and transition
- [ ] Style `.flashcard__front` and `.flashcard__back` with `backface-visibility: hidden`
- [ ] Back face has `transform: rotateY(180deg)` by default
- [ ] `.is-flipped` class sets `transform: rotateY(180deg)` on `.flashcard`
- [ ] Verify smooth 600ms flip on click
- [ ] Add `prefers-reduced-motion` media query to disable animation
- [ ] Test on mobile — ensure touch tap triggers flip

### Phase 6: Study Mode
- [ ] Implement `js/modules/study.js` — session state, Fisher-Yates shuffle
- [ ] Implement `startSession(deckId)` — load cards, shuffle, reset counters
- [ ] Implement `getCurrentCard()`, `advanceCard()`, `isSessionComplete()`
- [ ] Implement `markCurrentMastered()` and `markCurrentLearning()`
- [ ] Wire study view: render card, flip on click, mark buttons advance
- [ ] Update progress bar as cards are reviewed
- [ ] Update counter text ("Card X of Y")
- [ ] Implement `shuffleRemaining()` — reshuffle from current index onward
- [ ] Implement `toggleFilterUnmastered()` — rebuild queue with filter
- [ ] Navigate to `#complete/{deckId}` when session ends

### Phase 7: Session Complete & Stats
- [ ] Implement `renderComplete(results)` in `ui.js`
- [ ] Display total, mastered, still-learning, and mastery percentage
- [ ] Wire "Study Again" → restart session
- [ ] Wire "Back to Deck" → navigate to deck detail
- [ ] Ensure deck detail view stats update after study session

### Phase 8: Accessibility Polish
- [ ] Add `aria-live="polite"` to flashcard and study counter
- [ ] Update `aria-valuenow` on progress bars dynamically
- [ ] Implement focus trapping inside modals (Tab loops)
- [ ] Manage focus on view transitions (focus heading or first interactive element)
- [ ] Ensure flashcard responds to Enter and Space keys
- [ ] Ensure Escape key closes modals
- [ ] Add `:focus-visible` outlines to all interactive elements
- [ ] Verify colour contrast meets WCAG 2.1 AA with a contrast checker
- [ ] Add `@media (prefers-reduced-motion: reduce)` rules
- [ ] Test with keyboard-only navigation end-to-end

### Phase 9: Responsive & Visual Polish
- [ ] Test all views at 1200px, 768px, and 375px widths
- [ ] Verify deck grid reflows correctly
- [ ] Verify flashcard resizes gracefully
- [ ] Verify modals are usable on small screens
- [ ] Verify buttons are large enough for touch targets (min 44×44px)
- [ ] Add hover/active states to all buttons
- [ ] Add subtle box shadows to cards
- [ ] Verify smooth transitions between views

### Phase 10: Edge Cases & Final Testing
- [ ] Handle empty deck name (prevent creation, show validation)
- [ ] Handle empty question/answer (prevent save, show validation)
- [ ] Handle deck with 0 cards — disable "Study Deck", show message
- [ ] Handle deck with all cards mastered — show congratulatory message
- [ ] Handle corrupted localStorage gracefully (reset to empty state)
- [ ] Test with very long question/answer text (overflow handling)
- [ ] Test rapid clicking on mastered/learning buttons (debounce or disable)
- [ ] Verify no XSS via card content (all user text goes through `escapeHTML()`)
- [ ] Write `README.md` with project description and usage instructions
- [ ] Final cross-browser check (Chrome, Firefox, Safari)
