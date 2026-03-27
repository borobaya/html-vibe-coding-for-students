# Random Wikipedia Explorer — Implementation Plan

---

## 1. Overview

A single-page web app that lets users discover random Wikipedia articles with one click. Each article is presented as a rich card with a thumbnail image, title, summary extract, and a direct link to the full Wikipedia page. All previously viewed articles are stored in a scrollable history panel so users can revisit anything they found interesting.

### User Flow

1. User lands on the page → sees a large **"Surprise Me!"** button front and centre.
2. User clicks the button → button plays a pulse animation, a loading spinner appears in the article area.
3. The app fetches a random article from the Wikipedia REST API.
4. The spinner disappears, and the article card fades in showing:
   - Thumbnail image (or a placeholder if none exists)
   - Article title
   - Extract text (first ~2–3 paragraphs)
   - "Read Full Article →" link opening Wikipedia in a new tab
5. The article is automatically added to the **history list** (sidebar on desktop, collapsible section on mobile).
6. User can click any history item to re-display that article without a new API call.
7. User clicks "Surprise Me!" again → process repeats, new article replaces the current one.
8. History persists across sessions via `localStorage`.

### Key Behaviours

- **Duplicate prevention**: if the random API returns an article already in history, it still displays but does not create a duplicate entry.
- **Error handling**: network failures show a friendly error message with a "Try Again" button.
- **Empty state**: on first visit, the article area shows a welcome message prompting the user to click the button.

---

## 2. Page Layout

### ASCII Wireframe — Desktop (≥ 768px)

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  🌐  Random Wikipedia Explorer                                   │
│  "Discover something new with every click"                       │
├──────────────────────────────────────────┬───────────────────────┤
│                                          │                       │
│         [ 🎲  Surprise Me! ]             │   HISTORY             │
│                                          │   ───────────         │
│  ┌────────────────────────────────────┐  │   ┌─────────────────┐│
│  │  ┌──────────┐                      │  │   │ • Article Title ││
│  │  │          │  ARTICLE TITLE       │  │   │   snippet...    ││
│  │  │  thumb   │                      │  │   ├─────────────────┤│
│  │  │  nail    │  Extract text here   │  │   │ • Article Title ││
│  │  │          │  spanning multiple   │  │   │   snippet...    ││
│  │  └──────────┘  lines of the       │  │   ├─────────────────┤│
│  │                summary paragraph.  │  │   │ • Article Title ││
│  │                                    │  │   │   snippet...    ││
│  │  [ Read Full Article → ]           │  │   ├─────────────────┤│
│  └────────────────────────────────────┘  │   │       ...       ││
│                                          │   └─────────────────┘│
│                                          │                       │
│                                          │   [ Clear History ]   │
├──────────────────────────────────────────┴───────────────────────┤
│  FOOTER — Built with the Wikipedia API                           │
└──────────────────────────────────────────────────────────────────┘
```

### ASCII Wireframe — Mobile (< 768px)

```
┌──────────────────────────┐
│  HEADER                  │
│  🌐 Random Wikipedia     │
│     Explorer             │
│  "Discover something     │
│   new with every click"  │
├──────────────────────────┤
│                          │
│  [ 🎲  Surprise Me! ]   │
│                          │
│  ┌──────────────────────┐│
│  │    ┌────────────┐    ││
│  │    │  thumbnail │    ││
│  │    └────────────┘    ││
│  │                      ││
│  │  ARTICLE TITLE       ││
│  │                      ││
│  │  Extract text here   ││
│  │  spanning several    ││
│  │  lines...            ││
│  │                      ││
│  │  [ Read Full → ]     ││
│  └──────────────────────┘│
│                          │
│  ▼ History (3)           │
│  ┌──────────────────────┐│
│  │ • Article Title      ││
│  │ • Article Title      ││
│  │ • Article Title      ││
│  └──────────────────────┘│
│                          │
│  FOOTER                  │
└──────────────────────────┘
```

### Layout Strategy

| Area             | Desktop                              | Mobile                          |
| ---------------- | ------------------------------------ | ------------------------------- |
| Overall layout   | CSS Grid: 2 columns (3fr / 1fr)      | Single column, stacked          |
| Header           | Full width, centred text             | Full width, slightly smaller    |
| Button           | Centred above article card           | Full width with padding         |
| Article card     | Left column, max-width 720px        | Full width                      |
| History panel    | Right column, sticky, scrollable    | Collapsible accordion below card|
| Footer           | Full width, spans both columns      | Full width                      |

---

## 3. Colour Scheme & Typography

### Colour Palette — "Knowledge Explorer" Theme

Inspired by Wikipedia's clean white design with bolder accent colours for discovery/exploration.

```css
:root {
  /* Primary */
  --color-primary:         #1a73e8;   /* Bright blue — main button, links        */
  --color-primary-hover:   #1557b0;   /* Darker blue — button hover              */
  --color-primary-light:   #e8f0fe;   /* Pale blue — history item hover bg       */

  /* Accent */
  --color-accent:          #fbbc04;   /* Gold/amber — icon highlights, badges    */
  --color-accent-dark:     #e0a800;   /* Darker gold — accent hover             */

  /* Backgrounds */
  --color-bg-page:         #f8f9fa;   /* Light grey — page background           */
  --color-bg-card:         #ffffff;   /* White — article card, history items     */
  --color-bg-header:       #202124;   /* Near-black — header background         */
  --color-bg-history:      #ffffff;   /* White — history panel background       */

  /* Text */
  --color-text-primary:    #202124;   /* Near-black — headings, article title   */
  --color-text-secondary:  #5f6368;   /* Medium grey — extract text, subtitles  */
  --color-text-tertiary:   #9aa0a6;   /* Light grey — timestamps, meta info     */
  --color-text-on-dark:    #ffffff;   /* White — text on dark backgrounds       */
  --color-text-link:       #1a73e8;   /* Blue — wikipedia link                 */

  /* Borders & Dividers */
  --color-border:          #dadce0;   /* Light grey — card borders, dividers    */
  --color-border-focus:    #1a73e8;   /* Blue — focus rings                    */

  /* State Colours */
  --color-error:           #d93025;   /* Red — error messages                  */
  --color-error-bg:        #fce8e6;   /* Pale red — error message background   */
  --color-success:         #188038;   /* Green — success states                */
  --color-loading:         #1a73e8;   /* Blue — spinner colour                 */

  /* Shadows */
  --shadow-card:           0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-card-hover:     0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-button:         0 2px 8px rgba(26, 115, 232, 0.3);

  /* Spacing */
  --spacing-xs:            0.25rem;
  --spacing-sm:            0.5rem;
  --spacing-md:            1rem;
  --spacing-lg:            1.5rem;
  --spacing-xl:            2rem;
  --spacing-2xl:           3rem;

  /* Borders */
  --radius-sm:             4px;
  --radius-md:             8px;
  --radius-lg:             12px;
  --radius-round:          50%;
  --radius-pill:           999px;
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-primary:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading:    'Georgia', 'Times New Roman', serif;   /* Wikipedia-like serif headings */
  --font-mono:       'Fira Code', 'Courier New', monospace;

  /* Font Sizes */
  --text-xs:         0.75rem;    /* 12px — meta info, timestamps           */
  --text-sm:         0.875rem;   /* 14px — history snippets, captions      */
  --text-base:       1rem;       /* 16px — body text, extract              */
  --text-lg:         1.125rem;   /* 18px — button text                     */
  --text-xl:         1.5rem;     /* 24px — article title                   */
  --text-2xl:        2rem;       /* 32px — page heading                    */
  --text-3xl:        2.5rem;     /* 40px — hero heading (desktop)          */

  /* Font Weights */
  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* Line Heights */
  --leading-tight:   1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.75;
}
```

### Colour Applications

| Element                  | Background            | Text                    | Border               |
| ------------------------ | --------------------- | ----------------------- | -------------------- |
| Page body                | `--color-bg-page`     | —                       | —                    |
| Header                   | `--color-bg-header`   | `--color-text-on-dark`  | —                    |
| "Surprise Me!" button    | `--color-primary`     | `--color-text-on-dark`  | —                    |
| Button hover             | `--color-primary-hover`| `--color-text-on-dark` | —                    |
| Article card             | `--color-bg-card`     | `--color-text-primary`  | `--color-border`     |
| Article title            | —                     | `--color-text-primary`  | —                    |
| Extract text             | —                     | `--color-text-secondary`| —                    |
| "Read Full Article" link | —                     | `--color-text-link`     | —                    |
| History panel            | `--color-bg-history`  | `--color-text-primary`  | `--color-border`     |
| History item (hover)     | `--color-primary-light`| `--color-primary`      | —                    |
| Error message            | `--color-error-bg`    | `--color-error`         | `--color-error`      |
| Loading spinner          | —                     | `--color-loading`       | —                    |
| Footer                   | `--color-bg-header`   | `--color-text-tertiary` | —                    |

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Discover random Wikipedia articles with one click. Explore, learn, and build a history of interesting finds." />
  <title>Random Wikipedia Explorer</title>
  <link rel="stylesheet" href="styles/main.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>

  <!-- ===== HEADER ===== -->
  <header class="site-header">
    <div class="header__content">
      <h1 class="header__title">
        <span class="header__icon" aria-hidden="true">🌐</span>
        Random Wikipedia Explorer
      </h1>
      <p class="header__subtitle">Discover something new with every click</p>
    </div>
  </header>

  <!-- ===== MAIN CONTENT ===== -->
  <main class="main-content">

    <!-- Action Area -->
    <div class="action-area">
      <button
        type="button"
        id="surprise-btn"
        class="btn btn--surprise"
        aria-label="Fetch a random Wikipedia article"
      >
        <span class="btn__icon" aria-hidden="true">🎲</span>
        <span class="btn__text">Surprise Me!</span>
      </button>
    </div>

    <!-- Two-Column Layout -->
    <div class="content-grid">

      <!-- Article Display (Left / Main) -->
      <section class="article-section" aria-live="polite" aria-atomic="true">

        <!-- Welcome State (shown initially) -->
        <div id="welcome-state" class="state-message state-message--welcome">
          <span class="state-message__icon" aria-hidden="true">📚</span>
          <h2 class="state-message__title">Ready to Explore?</h2>
          <p class="state-message__text">
            Click <strong>"Surprise Me!"</strong> to discover a random Wikipedia article.
          </p>
        </div>

        <!-- Loading State (hidden by default) -->
        <div id="loading-state" class="state-message state-message--loading" hidden>
          <div class="spinner" role="status" aria-label="Loading article">
            <div class="spinner__ring"></div>
          </div>
          <p class="state-message__text">Finding something interesting…</p>
        </div>

        <!-- Error State (hidden by default) -->
        <div id="error-state" class="state-message state-message--error" hidden>
          <span class="state-message__icon" aria-hidden="true">⚠️</span>
          <h2 class="state-message__title">Oops! Something went wrong</h2>
          <p id="error-message" class="state-message__text">Could not fetch an article. Please try again.</p>
          <button
            type="button"
            id="retry-btn"
            class="btn btn--retry"
          >
            Try Again
          </button>
        </div>

        <!-- Article Card (hidden by default) -->
        <article id="article-card" class="article-card" hidden>
          <div class="article-card__image-container">
            <img
              id="article-thumbnail"
              class="article-card__thumbnail"
              src=""
              alt=""
              loading="lazy"
            />
          </div>
          <div class="article-card__body">
            <h2 id="article-title" class="article-card__title"></h2>
            <div id="article-extract" class="article-card__extract"></div>
            <a
              id="article-link"
              class="article-card__link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Full Article →
            </a>
          </div>
        </article>

      </section>

      <!-- History Panel (Right / Sidebar) -->
      <aside class="history-panel">
        <div class="history-panel__header">
          <h2 class="history-panel__title">
            History
            <span id="history-count" class="history-panel__count" aria-label="Number of articles in history">0</span>
          </h2>
          <button
            type="button"
            id="clear-history-btn"
            class="btn btn--text"
            aria-label="Clear all history"
            hidden
          >
            Clear
          </button>
        </div>

        <!-- History Empty State -->
        <div id="history-empty" class="history-panel__empty">
          <p>No articles yet. Start exploring!</p>
        </div>

        <!-- History List -->
        <ul id="history-list" class="history-list" aria-label="Previously viewed articles">
          <!-- Items rendered by JS -->
        </ul>
      </aside>

    </div>

  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="site-footer">
    <p>Built with the <a href="https://en.wikipedia.org/api/rest_v1/" target="_blank" rel="noopener noreferrer">Wikipedia REST API</a></p>
  </footer>

  <!-- ===== SCRIPTS ===== -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Checklist

- `aria-live="polite"` on the article section so screen readers announce new articles.
- `aria-atomic="true"` so the entire article region is re-read on update.
- `role="status"` and `aria-label` on the loading spinner.
- All buttons have descriptive `aria-label` attributes.
- External links use `rel="noopener noreferrer"` and `target="_blank"`.
- Semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Proper heading hierarchy: `<h1>` (page title) → `<h2>` (article title, history heading).
- Thumbnail `<img>` `alt` attribute set dynamically to the article title.
- History list uses `<ul>` with `<li>` items and `<button>` elements for keyboard access.
- Focus management: after a new article loads, focus moves to the article title.

---

## 5. CSS Design

### Layout

```css
/* Main grid — 2 columns on desktop */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 3fr 1fr;
  }
}
```

### Article Card

```css
.article-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  animation: fadeSlideIn 0.4s ease-out forwards;
}

.article-card__image-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  background: var(--color-bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-card__thumbnail {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  display: block;
}

/* Placeholder when no image */
.article-card__thumbnail--placeholder {
  width: 120px;
  height: 120px;
  object-fit: contain;
  padding: var(--spacing-xl);
}

.article-card__body {
  padding: var(--spacing-xl);
}

.article-card__title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md);
  line-height: var(--leading-tight);
}

.article-card__extract {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-lg);
  max-height: 300px;
  overflow-y: auto;
}

.article-card__link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-link);
  font-weight: var(--weight-semibold);
  text-decoration: none;
  font-size: var(--text-base);
  transition: color 0.2s;
}

.article-card__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
```

### Surprise Me Button

```css
.btn--surprise {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-on-dark);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn--surprise:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.4);
}

.btn--surprise:active {
  transform: translateY(0);
}

/* Pulse animation on click */
.btn--surprise--pulse {
  animation: buttonPulse 0.4s ease-out;
}

@keyframes buttonPulse {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.93); }
  60%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Disabled state while loading */
.btn--surprise:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

### Loading Spinner

```css
.spinner__ring {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-loading);
  border-radius: var(--radius-round);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Article Fade-In Animation

```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### History Panel

```css
.history-panel {
  background: var(--color-bg-history);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  height: fit-content;
  max-height: 70vh;
  overflow-y: auto;
  position: sticky;
  top: var(--spacing-lg);
}

.history-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.history-panel__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--spacing-xs);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--color-text-on-dark);
  background: var(--color-primary);
  border-radius: var(--radius-pill);
  margin-left: var(--spacing-sm);
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.history-list__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  transition: background 0.15s;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.history-list__item:hover,
.history-list__item:focus-visible {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.history-list__item-thumb {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.history-list__item-title {
  font-weight: var(--weight-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Mobile History Accordion

```css
@media (max-width: 767px) {
  .history-panel {
    position: static;
    max-height: none;
  }

  .history-panel__header {
    cursor: pointer;
  }

  .history-panel__header::after {
    content: '▼';
    font-size: var(--text-xs);
    transition: transform 0.2s;
  }

  .history-panel--collapsed .history-list,
  .history-panel--collapsed .history-panel__empty,
  .history-panel--collapsed .btn--text {
    display: none;
  }

  .history-panel--collapsed .history-panel__header::after {
    transform: rotate(-90deg);
  }
}
```

### Responsive Breakpoints

| Breakpoint   | Width        | Changes                                           |
| ------------ | ------------ | ------------------------------------------------- |
| Mobile       | < 768px      | Single column, stacked layout, accordion history  |
| Tablet+      | ≥ 768px      | Two-column grid, sticky sidebar history           |
| Large        | ≥ 1024px     | Wider article card, more padding                  |

---

## 6. JavaScript Architecture

### Module Dependency Graph

```
main.js
  ├── imports from → api.js
  ├── imports from → article.js
  ├── imports from → history.js
  ├── imports from → ui.js
  └── imports from → storage.js

history.js
  └── imports from → storage.js

ui.js
  └── (no module imports — receives data via function args)
```

### File: `js/main.js`

Entry point. Initialises the app and binds events.

```javascript
/**
 * File: main.js
 * Description: Entry point — initialises the app, binds event listeners.
 */

import { fetchRandomArticle } from './modules/api.js';
import { createArticle } from './modules/article.js';
import { addToHistory, loadHistory, clearHistory } from './modules/history.js';
import {
  showLoading,
  hideLoading,
  showArticle,
  showError,
  showWelcome,
  renderHistoryList,
  updateHistoryCount,
  setButtonLoading
} from './modules/ui.js';

function init() {
  // Load persisted history and render it
  const history = loadHistory();
  renderHistoryList(history, handleHistoryClick);
  updateHistoryCount(history.length);

  // Bind "Surprise Me!" button
  const surpriseBtn = document.getElementById('surprise-btn');
  surpriseBtn.addEventListener('click', handleSurpriseClick);

  // Bind "Try Again" button (in error state)
  const retryBtn = document.getElementById('retry-btn');
  retryBtn.addEventListener('click', handleSurpriseClick);

  // Bind "Clear History" button
  const clearBtn = document.getElementById('clear-history-btn');
  clearBtn.addEventListener('click', handleClearHistory);

  // Mobile: toggle history accordion
  const historyHeader = document.querySelector('.history-panel__header');
  historyHeader.addEventListener('click', handleHistoryToggle);
}

async function handleSurpriseClick() {
  setButtonLoading(true);
  showLoading();

  try {
    const rawData = await fetchRandomArticle();
    const article = createArticle(rawData);

    hideLoading();
    showArticle(article);

    const updatedHistory = addToHistory(article);
    renderHistoryList(updatedHistory, handleHistoryClick);
    updateHistoryCount(updatedHistory.length);
  } catch (error) {
    hideLoading();
    showError(error.message);
  } finally {
    setButtonLoading(false);
  }
}

function handleHistoryClick(article) {
  showArticle(article);
}

function handleClearHistory() {
  clearHistory();
  renderHistoryList([], handleHistoryClick);
  updateHistoryCount(0);
}

function handleHistoryToggle() {
  const panel = document.querySelector('.history-panel');
  panel.classList.toggle('history-panel--collapsed');
}

document.addEventListener('DOMContentLoaded', init);
```

---

### File: `js/modules/api.js`

Handles all Wikipedia API communication.

```javascript
/**
 * File: api.js
 * Description: Fetches random articles from the Wikipedia REST API.
 */

const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1';
const RANDOM_SUMMARY_ENDPOINT = `${WIKI_API_BASE}/page/random/summary`;

/**
 * Fetch a random Wikipedia article summary.
 * @returns {Promise<Object>} Raw API response data.
 * @throws {Error} If the network request fails or returns non-OK status.
 */
export async function fetchRandomArticle() {
  const response = await fetch(RANDOM_SUMMARY_ENDPOINT, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Reject disambiguation or very short stubs — fetch another
  if (data.type === 'disambiguation' || (data.extract && data.extract.length < 50)) {
    return fetchRandomArticle();
  }

  return data;
}
```

---

### File: `js/modules/article.js`

Article data model and formatting.

```javascript
/**
 * File: article.js
 * Description: Article data model and extract text formatting.
 */

/**
 * Create a normalised article object from raw API data.
 * @param {Object} rawData - Raw response from Wikipedia REST API.
 * @returns {Object} Normalised article object.
 */
export function createArticle(rawData) {
  return {
    id: rawData.pageid,
    title: rawData.title || 'Untitled',
    extract: formatExtract(rawData.extract || ''),
    extractHtml: rawData.extract_html || '',
    thumbnail: getThumbnailUrl(rawData),
    pageUrl: rawData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(rawData.title)}`,
    description: rawData.description || '',
    timestamp: Date.now()
  };
}

/**
 * Format extract text: trim length, clean whitespace.
 * @param {string} text - Raw extract string.
 * @returns {string} Cleaned extract text.
 */
function formatExtract(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length > 1000) {
    // Trim to last full sentence within 1000 chars
    const trimmed = cleaned.substring(0, 1000);
    const lastPeriod = trimmed.lastIndexOf('.');
    return lastPeriod > 0 ? trimmed.substring(0, lastPeriod + 1) : trimmed + '…';
  }
  return cleaned;
}

/**
 * Extract the best thumbnail URL from the API response.
 * @param {Object} data - Raw API data.
 * @returns {string|null} Thumbnail URL or null.
 */
function getThumbnailUrl(data) {
  if (data.thumbnail?.source) {
    return data.thumbnail.source;
  }
  if (data.originalimage?.source) {
    return data.originalimage.source;
  }
  return null;
}
```

---

### File: `js/modules/history.js`

Manages the viewed-articles list with persistence.

```javascript
/**
 * File: history.js
 * Description: Manages the history of viewed articles.
 */

import { saveHistory, getHistory } from './storage.js';

const MAX_HISTORY_ITEMS = 50;

/**
 * Load history from localStorage.
 * @returns {Array<Object>} Array of article objects.
 */
export function loadHistory() {
  return getHistory();
}

/**
 * Add an article to the history. Prevents duplicates by page ID.
 * @param {Object} article - Normalised article object.
 * @returns {Array<Object>} Updated history array.
 */
export function addToHistory(article) {
  const history = getHistory();

  // Remove existing entry with same ID to prevent duplicates
  const filtered = history.filter(item => item.id !== article.id);

  // Add new article to the front (most recent first)
  filtered.unshift({
    id: article.id,
    title: article.title,
    thumbnail: article.thumbnail,
    extract: article.extract,
    pageUrl: article.pageUrl,
    description: article.description,
    timestamp: article.timestamp
  });

  // Enforce max length
  if (filtered.length > MAX_HISTORY_ITEMS) {
    filtered.length = MAX_HISTORY_ITEMS;
  }

  saveHistory(filtered);
  return filtered;
}

/**
 * Clear all history.
 */
export function clearHistory() {
  saveHistory([]);
}
```

---

### File: `js/modules/ui.js`

All DOM manipulation — rendering articles, toggling states, updating history list.

```javascript
/**
 * File: ui.js
 * Description: Handles all DOM updates — rendering articles, states, and history.
 */

// ── Element References ──
const welcomeState    = document.getElementById('welcome-state');
const loadingState    = document.getElementById('loading-state');
const errorState      = document.getElementById('error-state');
const errorMessage    = document.getElementById('error-message');
const articleCard     = document.getElementById('article-card');
const articleTitle    = document.getElementById('article-title');
const articleExtract  = document.getElementById('article-extract');
const articleThumbnail = document.getElementById('article-thumbnail');
const articleLink     = document.getElementById('article-link');
const historyList     = document.getElementById('history-list');
const historyCount    = document.getElementById('history-count');
const historyEmpty    = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const surpriseBtn     = document.getElementById('surprise-btn');

const PLACEHOLDER_IMG = 'assets/placeholder.svg';

/** Hide all state panels. */
function hideAllStates() {
  welcomeState.hidden = true;
  loadingState.hidden = true;
  errorState.hidden = true;
  articleCard.hidden = true;
}

/** Show the loading spinner and disable the button. */
export function showLoading() {
  hideAllStates();
  loadingState.hidden = false;
}

/** Hide the loading spinner. */
export function hideLoading() {
  loadingState.hidden = true;
}

/** Show the welcome / empty state. */
export function showWelcome() {
  hideAllStates();
  welcomeState.hidden = false;
}

/**
 * Show an error message.
 * @param {string} message - Error description.
 */
export function showError(message) {
  hideAllStates();
  errorMessage.textContent = message || 'Could not fetch an article. Please try again.';
  errorState.hidden = false;
}

/**
 * Render an article card with fade-in animation.
 * @param {Object} article - Normalised article object.
 */
export function showArticle(article) {
  hideAllStates();

  // Set thumbnail
  if (article.thumbnail) {
    articleThumbnail.src = article.thumbnail;
    articleThumbnail.alt = `Thumbnail for ${article.title}`;
    articleThumbnail.classList.remove('article-card__thumbnail--placeholder');
  } else {
    articleThumbnail.src = PLACEHOLDER_IMG;
    articleThumbnail.alt = '';
    articleThumbnail.classList.add('article-card__thumbnail--placeholder');
  }

  // Set text content (textContent to prevent XSS)
  articleTitle.textContent = article.title;
  articleExtract.textContent = article.extract;

  // Set link
  articleLink.href = article.pageUrl;

  // Show card with re-triggered animation
  articleCard.hidden = false;
  articleCard.classList.remove('fadeSlideIn');
  void articleCard.offsetWidth; // force reflow to restart animation
  articleCard.style.animation = 'none';
  void articleCard.offsetWidth;
  articleCard.style.animation = '';

  // Move focus to the title for accessibility
  articleTitle.setAttribute('tabindex', '-1');
  articleTitle.focus();
}

/**
 * Set the Surprise Me button to loading/disabled state.
 * @param {boolean} isLoading - Whether the button should be disabled.
 */
export function setButtonLoading(isLoading) {
  surpriseBtn.disabled = isLoading;
  if (isLoading) {
    surpriseBtn.classList.add('btn--surprise--pulse');
  } else {
    surpriseBtn.classList.remove('btn--surprise--pulse');
  }
}

/**
 * Render the history list in the sidebar.
 * @param {Array<Object>} history - Array of article objects.
 * @param {Function} onClick - Callback when a history item is clicked.
 */
export function renderHistoryList(history, onClick) {
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyEmpty.hidden = false;
    clearHistoryBtn.hidden = true;
    return;
  }

  historyEmpty.hidden = true;
  clearHistoryBtn.hidden = false;

  history.forEach(article => {
    const li = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-list__item';
    button.setAttribute('aria-label', `View ${article.title}`);

    // Thumbnail
    if (article.thumbnail) {
      const img = document.createElement('img');
      img.className = 'history-list__item-thumb';
      img.src = article.thumbnail;
      img.alt = '';
      img.loading = 'lazy';
      button.appendChild(img);
    }

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'history-list__item-title';
    titleSpan.textContent = article.title;
    button.appendChild(titleSpan);

    button.addEventListener('click', () => onClick(article));

    li.appendChild(button);
    historyList.appendChild(li);
  });
}

/**
 * Update the history count badge.
 * @param {number} count - Number of history items.
 */
export function updateHistoryCount(count) {
  historyCount.textContent = count;
}
```

---

### File: `js/modules/storage.js`

Handles `localStorage` persistence.

```javascript
/**
 * File: storage.js
 * Description: Persists history data in localStorage.
 */

const STORAGE_KEY = 'wiki-explorer-history';

/**
 * Retrieve history from localStorage.
 * @returns {Array<Object>} Stored history array, or empty array if none.
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Failed to parse history from localStorage:', error);
    return [];
  }
}

/**
 * Save history array to localStorage.
 * @param {Array<Object>} history - Array of article objects to persist.
 */
export function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save history to localStorage:', error);
  }
}
```

---

## 7. API Details

### Endpoint

```
GET https://en.wikipedia.org/api/rest_v1/page/random/summary
```

This endpoint returns a **random article summary** including the title, extract, thumbnail, and content URLs.

### Request Details

| Property       | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Method         | `GET`                                                    |
| URL            | `https://en.wikipedia.org/api/rest_v1/page/random/summary` |
| Headers        | `Accept: application/json`                               |
| Authentication | None required                                            |
| CORS           | Supported — the API sends `Access-Control-Allow-Origin: *` headers |
| Rate Limiting  | Best practice: max 200 req/s for polite usage            |

### Sample Response

```json
{
  "type": "standard",
  "title": "Eiffel Tower",
  "displaytitle": "<span>Eiffel Tower</span>",
  "namespace": { "id": 0, "text": "" },
  "wikibase_item": "Q243",
  "titles": {
    "canonical": "Eiffel_Tower",
    "normalized": "Eiffel Tower",
    "display": "<span>Eiffel Tower</span>"
  },
  "pageid": 9232,
  "thumbnail": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/213px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    "width": 213,
    "height": 320
  },
  "originalimage": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    "width": 3648,
    "height": 5472
  },
  "lang": "en",
  "dir": "ltr",
  "revision": "1234567890",
  "tid": "abc-def-123",
  "timestamp": "2025-01-15T10:30:00Z",
  "description": "Tower on the Champ de Mars in Paris, France",
  "description_source": "local",
  "content_urls": {
    "desktop": {
      "page": "https://en.wikipedia.org/wiki/Eiffel_Tower",
      "revisions": "https://en.wikipedia.org/wiki/Eiffel_Tower?action=history",
      "edit": "https://en.wikipedia.org/wiki/Eiffel_Tower?action=edit",
      "talk": "https://en.wikipedia.org/wiki/Talk:Eiffel_Tower"
    },
    "mobile": {
      "page": "https://en.m.wikipedia.org/wiki/Eiffel_Tower"
    }
  },
  "extract": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.",
  "extract_html": "<p>The <b>Eiffel Tower</b> is a wrought-iron lattice tower...</p>"
}
```

### Data Extraction Map

| App property | API field                              | Fallback                                          |
| ------------ | -------------------------------------- | ------------------------------------------------- |
| `id`         | `pageid`                               | —                                                 |
| `title`      | `title`                                | `'Untitled'`                                      |
| `extract`    | `extract`                              | `''`                                              |
| `thumbnail`  | `thumbnail.source`                     | `originalimage.source` → `null`                   |
| `pageUrl`    | `content_urls.desktop.page`            | `https://en.wikipedia.org/wiki/{encoded title}`   |
| `description`| `description`                          | `''`                                              |

### CORS Notes

- The Wikipedia REST API supports CORS natively — no proxy needed.
- Requests from `localhost` or any origin work fine.
- The `Access-Control-Allow-Origin: *` header is sent on all responses.
- **The app must be served via a local server** (not `file://`) because ES modules require HTTP.

### Error Scenarios

| Scenario             | HTTP Status | App Behaviour                                         |
| -------------------- | ----------- | ----------------------------------------------------- |
| Success              | 200         | Parse and display article                             |
| Server error         | 500+        | Show error message with "Try Again" button            |
| Rate limited         | 429         | Show error: "Too many requests, please wait a moment" |
| Network offline      | —           | Catch in `fetch` → show offline error message         |
| Disambiguation page  | 200         | `type === 'disambiguation'` → auto-retry              |
| Stub (< 50 chars)    | 200         | Extract too short → auto-retry                        |

---

## 8. History Feature

### Data Shape (per History Item)

```javascript
{
  id: 9232,                  // Wikipedia page ID (unique key)
  title: "Eiffel Tower",
  thumbnail: "https://...",  // URL string or null
  extract: "The Eiffel Tower is...",
  pageUrl: "https://en.wikipedia.org/wiki/Eiffel_Tower",
  description: "Tower on the Champ de Mars in Paris, France",
  timestamp: 1711526400000   // Date.now() when viewed
}
```

### Storage

- **Key**: `wiki-explorer-history` in `localStorage`.
- **Format**: JSON-serialised array of history item objects.
- **Max items**: 50 — oldest entries are dropped when the limit is exceeded.
- **Safety**: wrapped in `try/catch` to handle `localStorage` being full or disabled.

### Behaviour Rules

| Action                  | Result                                                        |
| ----------------------- | ------------------------------------------------------------- |
| New article loaded      | Added to front of history array; duplicates removed first     |
| Same article fetched    | Existing entry removed, new entry inserted at front (re-dated)|
| Click history item      | Article re-displayed from stored data (no API call)           |
| Clear history           | Array emptied, `localStorage` key set to `[]`                 |
| Page load               | History loaded from `localStorage` and rendered               |

### History UI Details

- Each history item is a `<button>` inside an `<li>` for keyboard accessibility.
- Items show: small thumbnail (36×36px), article title (truncated with ellipsis).
- Clicking an item calls `showArticle()` with the stored article data.
- The count badge in the header updates live.
- "Clear" button appears only when history has items.
- On mobile (< 768px): history section is a collapsible accordion, toggled by clicking the header.

---

## 9. Accessibility & State Management

### Accessibility

| Feature                    | Implementation                                                  |
| -------------------------- | --------------------------------------------------------------- |
| Screen reader announcements| `aria-live="polite"` on the article section                     |
| Loading state              | Spinner has `role="status"` and `aria-label="Loading article"`  |
| Focus management           | After article loads, focus moves to the article title           |
| Keyboard navigation        | All interactive elements are focusable buttons or links         |
| History items              | `<button>` elements with `aria-label="View {title}"`           |
| Skip link (optional)       | Add skip-to-main for keyboard users                             |
| Colour contrast            | All text/background combinations meet WCAG AA (4.5:1)          |
| Reduced motion             | Respect `prefers-reduced-motion` media query                    |

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .article-card {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .btn--surprise--pulse {
    animation: none;
  }

  .spinner__ring {
    animation: spin 2s linear infinite; /* slower, still functional */
  }
}
```

### State Management

The app has four mutually exclusive display states in the article section:

| State       | Visible Element    | Trigger                              |
| ----------- | ------------------ | ------------------------------------ |
| `welcome`   | `#welcome-state`   | Page first load (no article yet)     |
| `loading`   | `#loading-state`   | Button clicked, API call in progress |
| `article`   | `#article-card`    | API call successful                  |
| `error`     | `#error-state`     | API call failed or network error     |

State transitions are managed by `hideAllStates()` followed by showing the relevant element. This keeps logic simple and avoids conflicting visible states.

### Button State

| Button state | `disabled` | CSS class               |
| ------------ | ---------- | ----------------------- |
| Idle         | `false`    | —                       |
| Loading      | `true`     | `btn--surprise--pulse`  |

---

## 10. Implementation Checklist

### Phase 1: Project Setup
- [ ] Create folder structure: `index.html`, `js/main.js`, `js/modules/`, `styles/main.css`, `assets/`
- [ ] Create `assets/placeholder.svg` — simple icon for articles without thumbnails
- [ ] Set up `index.html` with all semantic HTML, states, and elements
- [ ] Link stylesheet and module script

### Phase 2: Styling
- [ ] Define all CSS custom properties (colours, typography, spacing)
- [ ] Style the header (dark background, white text, centred)
- [ ] Style the "Surprise Me!" button (pill shape, shadow, hover/active states)
- [ ] Build the content grid (responsive 2-column → 1-column)
- [ ] Style the article card (border, shadow, image container, body, link)
- [ ] Style the loading spinner (`@keyframes spin`)
- [ ] Style state messages (welcome, error)
- [ ] Style the history panel (sticky sidebar, scrollable, header with count badge)
- [ ] Style history list items (thumbnail, title, hover state)
- [ ] Add `@keyframes fadeSlideIn` for article reveal
- [ ] Add `@keyframes buttonPulse` for button click feedback
- [ ] Add `@media (prefers-reduced-motion: reduce)` overrides
- [ ] Add mobile breakpoint (< 768px) — single column, accordion history
- [ ] Test responsive layout at 320px, 768px, 1024px, 1440px

### Phase 3: JavaScript — Core Modules
- [ ] Implement `storage.js` — `getHistory()`, `saveHistory()`
- [ ] Implement `article.js` — `createArticle()`, `formatExtract()`, `getThumbnailUrl()`
- [ ] Implement `api.js` — `fetchRandomArticle()` with error handling and disambiguation retry
- [ ] Implement `history.js` — `loadHistory()`, `addToHistory()`, `clearHistory()`
- [ ] Implement `ui.js` — all render/show/hide functions, `renderHistoryList()`

### Phase 4: JavaScript — Integration
- [ ] Implement `main.js` — `init()`, event bindings, `handleSurpriseClick()`
- [ ] Wire up history click callback to re-display articles
- [ ] Wire up clear history button
- [ ] Wire up mobile history accordion toggle
- [ ] Test: click button → loading → article displays
- [ ] Test: article added to history list
- [ ] Test: clicking history item re-displays article
- [ ] Test: clear history empties list and localStorage

### Phase 5: Edge Cases & Polish
- [ ] Handle articles with no thumbnail (show placeholder)
- [ ] Handle very long extract text (trim at 1000 chars to last sentence)
- [ ] Handle disambiguation pages (auto-retry)
- [ ] Handle network errors (show error state with retry button)
- [ ] Handle localStorage full/disabled (fail silently)
- [ ] Prevent double-click rapid-fire (disable button during fetch)
- [ ] Focus management: move focus to article title after load
- [ ] Test with keyboard-only navigation
- [ ] Test `aria-live` announcements with a screen reader

### Phase 6: Final Review
- [ ] Validate HTML (no errors, semantic structure)
- [ ] All text rendered with `textContent` (never `innerHTML` with API data)
- [ ] No API keys or secrets in source
- [ ] All paths are relative (`js/main.js`, `styles/main.css`)
- [ ] Test via local server: `cd random-wikipedia-explorer && python3 -m http.server 5500`
- [ ] Write `README.md` with project description and run instructions
