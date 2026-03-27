# Budget Tracker — Implementation Plan

## 1. Overview

### Purpose

A personal finance dashboard that lets users record income and expense transactions, categorise them, track a running balance, and visualise spending/earning patterns through Canvas-rendered pie and bar charts. All data persists in `localStorage`.

### User Flow

```
1. User opens the app
   └─► localStorage is read; existing transactions are loaded

2. User fills the transaction form
   ├─► Selects type: Income or Expense
   ├─► Enters amount (positive number, up to 2 decimal places)
   ├─► Picks a category from a dropdown (list depends on type)
   ├─► Optionally enters a date (defaults to today)
   └─► Optionally enters a description/note

3. User clicks "Add Transaction"
   ├─► Input is validated (amount > 0, category selected)
   ├─► A transaction object is created with a unique ID
   ├─► Transaction is appended to the array in memory
   ├─► localStorage is updated
   ├─► Summary cards recalculate (total income, total expenses, balance)
   ├─► Transaction list re-renders (newest first)
   └─► Charts re-render with updated data

4. User browses the transaction list
   ├─► Filters by type (All / Income / Expense)
   ├─► Filters by category
   ├─► Filters by date range
   └─► Clicks delete (✕) on any row to remove it

5. User views charts
   ├─► Pie chart: expense breakdown by category (percentage + label)
   └─► Bar chart: monthly income vs expense comparison
```

---

## 2. Page Layout

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER — "Budget Tracker"                        [dark bar]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Total Income  │  │Total Expenses│  │   Balance    │           │
│  │   £1,250.00   │  │   £830.50    │  │   £419.50    │           │
│  │   ▲ green     │  │   ▼ red      │  │  blue/green  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ADD TRANSACTION FORM                                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌─────────────┐  │  │
│  │  │ Type ▼   │ │ Amount   │ │ Category ▼│ │    Date     │  │  │
│  │  └──────────┘ └──────────┘ └───────────┘ └─────────────┘  │  │
│  │  ┌──────────────────────────────────┐  ┌───────────────┐   │  │
│  │  │ Description (optional)           │  │ Add Transaction│  │  │
│  │  └──────────────────────────────────┘  └───────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  FILTERS                                                   │  │
│  │  [All | Income | Expense]  [Category ▼]  [From] [To]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  TRANSACTION LIST                                          │  │
│  │  ┌──────┬───────────┬──────────┬────────┬───────┬───────┐  │  │
│  │  │ Date │   Type    │ Category │ Amount │ Note  │  Del  │  │  │
│  │  ├──────┼───────────┼──────────┼────────┼───────┼───────┤  │  │
│  │  │03/27 │  Income   │ Salary   │+1250.00│ March │  ✕    │  │  │
│  │  │03/25 │  Expense  │ Food     │ -45.30 │ Lunch │  ✕    │  │  │
│  │  │03/24 │  Expense  │ Bills    │-120.00 │ Elec  │  ✕    │  │  │
│  │  │ ...  │   ...     │  ...     │  ...   │  ...  │  ...  │  │  │
│  │  └──────┴───────────┴──────────┴────────┴───────┴───────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────┐ ┌──────────────────────────────┐  │
│  │   PIE CHART               │ │   BAR CHART                  │  │
│  │   (Expense by Category)   │ │   (Monthly Income vs Expense)│  │
│  │                           │ │                              │  │
│  │       ┌───┐               │ │   ██                         │  │
│  │      /     \              │ │   ██  ▓▓                     │  │
│  │     | chart |             │ │   ██  ▓▓  ██                 │  │
│  │      \     /              │ │   ██  ▓▓  ██  ▓▓            │  │
│  │       └───┘               │ │   Jan Feb  Mar Apr           │  │
│  │                           │ │                              │  │
│  │  ● Food  ● Transport     │ │   ██ Income  ▓▓ Expense      │  │
│  │  ● Bills ● Entertainment │ │                              │  │
│  └───────────────────────────┘ └──────────────────────────────┘  │
│                                                                  │
│  FOOTER — "Budget Tracker © 2026"                                │
└──────────────────────────────────────────────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 1024 px (desktop) | Summary cards in a 3-column row. Charts side by side. Transaction table full width. |
| 768–1023 px (tablet) | Summary cards in a 3-column row. Charts stack vertically. Table scrolls horizontally if needed. |
| < 768 px (mobile) | Summary cards stack vertically. Form inputs stack. Charts full width, stacked. Table scrolls horizontally. |

---

## 3. Colour Scheme & Typography

### CSS Variables

```css
:root {
  /* ── Brand / UI ── */
  --clr-bg-page:        #f4f6fa;
  --clr-bg-card:        #ffffff;
  --clr-bg-header:      #1a1a2e;
  --clr-text-primary:   #1e1e2f;
  --clr-text-secondary: #6b7280;
  --clr-text-on-dark:   #f0f0f5;
  --clr-border:         #e2e5ec;
  --clr-shadow:         rgba(0, 0, 0, 0.08);

  /* ── Semantic ── */
  --clr-income:         #10b981;   /* emerald green  */
  --clr-income-light:   #d1fae5;
  --clr-expense:        #ef4444;   /* red            */
  --clr-expense-light:  #fee2e2;
  --clr-balance:        #3b82f6;   /* blue           */
  --clr-balance-light:  #dbeafe;

  /* ── Buttons & Accents ── */
  --clr-btn-primary:    #6366f1;   /* indigo         */
  --clr-btn-hover:      #4f46e5;
  --clr-btn-danger:     #ef4444;
  --clr-btn-danger-hover:#dc2626;

  /* ── Category Colours (charts + badges) ── */
  --clr-cat-salary:        #10b981;
  --clr-cat-freelance:     #14b8a6;
  --clr-cat-investments:   #06b6d4;
  --clr-cat-gifts:         #8b5cf6;
  --clr-cat-other-income:  #6366f1;
  --clr-cat-food:          #f59e0b;
  --clr-cat-transport:     #3b82f6;
  --clr-cat-entertainment: #ec4899;
  --clr-cat-bills:         #ef4444;
  --clr-cat-shopping:      #f97316;
  --clr-cat-health:        #14b8a6;
  --clr-cat-education:     #8b5cf6;
  --clr-cat-other-expense: #6b7280;

  /* ── Table ── */
  --clr-table-row-alt:  #f9fafb;
  --clr-table-hover:    #f0f4ff;

  /* ── Typography ── */
  --font-family:        'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono:          'SF Mono', 'Fira Code', 'Consolas', monospace;
  --fs-xs:              0.75rem;
  --fs-sm:              0.875rem;
  --fs-base:            1rem;
  --fs-lg:              1.25rem;
  --fs-xl:              1.5rem;
  --fs-2xl:             2rem;

  /* ── Spacing ── */
  --space-xs:           0.25rem;
  --space-sm:           0.5rem;
  --space-md:           1rem;
  --space-lg:           1.5rem;
  --space-xl:           2rem;
  --space-2xl:          3rem;

  /* ── Misc ── */
  --radius:             0.5rem;
  --radius-lg:          0.75rem;
  --shadow-card:        0 2px 8px var(--clr-shadow);
  --shadow-card-hover:  0 4px 16px rgba(0, 0, 0, 0.12);
  --transition:         0.2s ease;
}
```

### Category Colour Map (used by JS for charts)

| Category | Hex | Usage |
|---|---|---|
| Salary | `#10b981` | Income |
| Freelance | `#14b8a6` | Income |
| Investments | `#06b6d4` | Income |
| Gifts | `#8b5cf6` | Income |
| Other Income | `#6366f1` | Income |
| Food | `#f59e0b` | Expense |
| Transport | `#3b82f6` | Expense |
| Entertainment | `#ec4899` | Expense |
| Bills | `#ef4444` | Expense |
| Shopping | `#f97316` | Expense |
| Health | `#14b8a6` | Expense |
| Education | `#8b5cf6` | Expense |
| Other Expense | `#6b7280` | Expense |

### Typography Scale

| Element | Size | Weight | Colour |
|---|---|---|---|
| Page title (header h1) | `--fs-xl` (1.5 rem) | 700 | `--clr-text-on-dark` |
| Summary card label | `--fs-sm` (0.875 rem) | 500 | `--clr-text-secondary` |
| Summary card value | `--fs-2xl` (2 rem) | 700 | Semantic colour |
| Form labels | `--fs-sm` | 500 | `--clr-text-primary` |
| Table header | `--fs-sm` | 600 | `--clr-text-primary` |
| Table body | `--fs-base` (1 rem) | 400 | `--clr-text-primary` |
| Chart labels | 12 px on canvas | — | `#333` or white on slice |
| Footer | `--fs-xs` | 400 | `--clr-text-secondary` |

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Budget Tracker</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ═══════════ HEADER ═══════════ -->
  <header class="header">
    <h1 class="header__title">Budget Tracker</h1>
  </header>

  <main class="main">

    <!-- ═══════════ SUMMARY CARDS ═══════════ -->
    <section class="summary" aria-label="Financial summary">
      <div class="summary__card summary__card--income">
        <span class="summary__label">Total Income</span>
        <span class="summary__value" id="total-income">£0.00</span>
      </div>
      <div class="summary__card summary__card--expense">
        <span class="summary__label">Total Expenses</span>
        <span class="summary__value" id="total-expenses">£0.00</span>
      </div>
      <div class="summary__card summary__card--balance">
        <span class="summary__label">Balance</span>
        <span class="summary__value" id="balance">£0.00</span>
      </div>
    </section>

    <!-- ═══════════ TRANSACTION FORM ═══════════ -->
    <section class="form-section" aria-label="Add a transaction">
      <h2 class="form-section__title">Add Transaction</h2>
      <form id="transaction-form" class="form" novalidate>
        <div class="form__row">
          <div class="form__group">
            <label for="tx-type" class="form__label">Type</label>
            <select id="tx-type" class="form__select" required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div class="form__group">
            <label for="tx-amount" class="form__label">Amount (£)</label>
            <input
              type="number"
              id="tx-amount"
              class="form__input"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div class="form__group">
            <label for="tx-category" class="form__label">Category</label>
            <select id="tx-category" class="form__select" required>
              <!-- Options populated by JS based on selected type -->
            </select>
          </div>
          <div class="form__group">
            <label for="tx-date" class="form__label">Date</label>
            <input type="date" id="tx-date" class="form__input" required />
          </div>
        </div>
        <div class="form__row">
          <div class="form__group form__group--wide">
            <label for="tx-description" class="form__label">Description (optional)</label>
            <input
              type="text"
              id="tx-description"
              class="form__input"
              placeholder="e.g. Weekly food shop"
              maxlength="100"
            />
          </div>
          <div class="form__group form__group--btn">
            <button type="submit" class="btn btn--primary">Add Transaction</button>
          </div>
        </div>
      </form>
    </section>

    <!-- ═══════════ FILTERS ═══════════ -->
    <section class="filters" aria-label="Filter transactions">
      <div class="filters__group">
        <button class="filters__btn filters__btn--active" data-filter-type="all">All</button>
        <button class="filters__btn" data-filter-type="income">Income</button>
        <button class="filters__btn" data-filter-type="expense">Expense</button>
      </div>
      <div class="filters__group">
        <label for="filter-category" class="sr-only">Filter by category</label>
        <select id="filter-category" class="form__select">
          <option value="all">All Categories</option>
          <!-- Populated by JS -->
        </select>
      </div>
      <div class="filters__group">
        <label for="filter-from" class="sr-only">From date</label>
        <input type="date" id="filter-from" class="form__input" aria-label="From date" />
        <label for="filter-to" class="sr-only">To date</label>
        <input type="date" id="filter-to" class="form__input" aria-label="To date" />
      </div>
    </section>

    <!-- ═══════════ TRANSACTION LIST ═══════════ -->
    <section class="transactions" aria-label="Transaction history">
      <h2 class="transactions__title">Transaction History</h2>
      <div class="transactions__table-wrapper">
        <table class="transactions__table" id="transaction-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Note</th>
              <th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody id="transaction-tbody">
            <!-- Rows rendered by JS -->
          </tbody>
        </table>
        <p class="transactions__empty" id="empty-msg" hidden>
          No transactions yet. Add one above!
        </p>
      </div>
    </section>

    <!-- ═══════════ CHARTS ═══════════ -->
    <section class="charts" aria-label="Spending charts">
      <div class="charts__card">
        <h2 class="charts__title">Expenses by Category</h2>
        <canvas id="pie-chart" width="400" height="400" role="img"
                aria-label="Pie chart showing expense distribution by category"></canvas>
        <div class="charts__legend" id="pie-legend"></div>
      </div>
      <div class="charts__card">
        <h2 class="charts__title">Monthly Overview</h2>
        <canvas id="bar-chart" width="600" height="400" role="img"
                aria-label="Bar chart comparing monthly income and expenses"></canvas>
        <div class="charts__legend" id="bar-legend"></div>
      </div>
    </section>

  </main>

  <!-- ═══════════ FOOTER ═══════════ -->
  <footer class="footer">
    <p>Budget Tracker &copy; 2026</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 5. CSS Design

### Layout Strategy

```
Page layout:           Single-column centred container (max-width: 1100px)
Summary cards:         CSS Grid — 3 equal columns, gap 1rem
Form:                  CSS Grid — 4 columns on desktop, stacks on mobile
Filters:               Flexbox row, wrap on mobile
Transaction table:     Full width, horizontal scroll wrapper on small screens
Charts:                CSS Grid — 2 columns on desktop, 1 column on mobile
```

### Key CSS Rules

```css
/* ── Reset & Base ── */
*,
*::before,
*::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-family);
  font-size: var(--fs-base);
  color: var(--clr-text-primary);
  background: var(--clr-bg-page);
  line-height: 1.6;
}

/* ── Container ── */
.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-lg) var(--space-md);
}

/* ── Summary Cards ── */
.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.summary__card {
  background: var(--clr-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  text-align: center;
  box-shadow: var(--shadow-card);
  border-top: 4px solid transparent;
  transition: box-shadow var(--transition);
}

.summary__card:hover { box-shadow: var(--shadow-card-hover); }
.summary__card--income  { border-top-color: var(--clr-income); }
.summary__card--expense { border-top-color: var(--clr-expense); }
.summary__card--balance { border-top-color: var(--clr-balance); }

/* ── Table ── */
.transactions__table {
  width: 100%;
  border-collapse: collapse;
}

.transactions__table th {
  background: var(--clr-bg-header);
  color: var(--clr-text-on-dark);
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  font-size: var(--fs-sm);
  font-weight: 600;
}

.transactions__table td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--clr-border);
}

.transactions__table tbody tr:nth-child(even) {
  background: var(--clr-table-row-alt);
}

.transactions__table tbody tr:hover {
  background: var(--clr-table-hover);
}

/* ── Income/expense amount colouring ── */
.amount--income  { color: var(--clr-income);  font-weight: 600; }
.amount--expense { color: var(--clr-expense); font-weight: 600; }

/* ── Charts Grid ── */
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.charts__card {
  background: var(--clr-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.charts__card canvas {
  max-width: 100%;
  height: auto;
}

/* ── Button ── */
.btn--primary {
  background: var(--clr-btn-primary);
  color: #fff;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: var(--fs-base);
  font-weight: 600;
  transition: background var(--transition);
}

.btn--primary:hover { background: var(--clr-btn-hover); }

/* ── Filter buttons ── */
.filters__btn--active {
  background: var(--clr-btn-primary);
  color: #fff;
}

/* ── Accessibility ── */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .summary       { grid-template-columns: 1fr; }
  .charts        { grid-template-columns: 1fr; }
  .form__row     { grid-template-columns: 1fr; }
  .filters       { flex-direction: column; }
}
```

### Form Styling

- Inputs and selects: full width within their grid cell, consistent padding (`0.5rem 0.75rem`), border `1px solid var(--clr-border)`, border-radius `var(--radius)`.
- Focus state: `outline: 2px solid var(--clr-btn-primary); outline-offset: 2px`.
- Invalid state (after attempted submit): `border-color: var(--clr-expense)`.

### Delete Button

- Small circular button with `✕` text, `background: transparent`, red on hover.
- `aria-label="Delete transaction"` on each button.

---

## 6. JavaScript Architecture

### Module Map

```
js/
├── main.js                  Entry point — imports, init, global event listeners
└── modules/
    ├── categories.js        Category definitions + colour map
    ├── storage.js           localStorage read/write
    ├── transactions.js      CRUD operations, filtering logic
    ├── summary.js           Calculate totals & category breakdowns
    ├── charts.js            Canvas pie chart + bar chart rendering
    └── ui.js                DOM rendering, form handling, event wiring
```

### 6.1 `main.js` — Entry Point

```js
/**
 * File: main.js
 * Description: Application entry point. Initialises state from storage,
 *              binds events, and triggers the first render.
 */
import { loadTransactions } from './modules/storage.js';
import { initUI } from './modules/ui.js';

function init() {
  const transactions = loadTransactions();
  initUI(transactions);
}

document.addEventListener('DOMContentLoaded', init);
```

Responsibilities:
- Call `loadTransactions()` to hydrate state from `localStorage`.
- Call `initUI(transactions)` which sets up the form, renders the list, updates summary cards, and draws charts.

### 6.2 `modules/categories.js` — Category Definitions

```js
/**
 * File: categories.js
 * Description: Defines all available categories with display names,
 *              types, and assigned hex colours for chart rendering.
 */

export const CATEGORIES = {
  income: [
    { id: 'salary',       label: 'Salary',       colour: '#10b981' },
    { id: 'freelance',    label: 'Freelance',     colour: '#14b8a6' },
    { id: 'investments',  label: 'Investments',   colour: '#06b6d4' },
    { id: 'gifts',        label: 'Gifts',         colour: '#8b5cf6' },
    { id: 'other-income', label: 'Other Income',  colour: '#6366f1' },
  ],
  expense: [
    { id: 'food',          label: 'Food',          colour: '#f59e0b' },
    { id: 'transport',     label: 'Transport',     colour: '#3b82f6' },
    { id: 'entertainment', label: 'Entertainment', colour: '#ec4899' },
    { id: 'bills',         label: 'Bills',         colour: '#ef4444' },
    { id: 'shopping',      label: 'Shopping',      colour: '#f97316' },
    { id: 'health',        label: 'Health',        colour: '#14b8a6' },
    { id: 'education',     label: 'Education',     colour: '#8b5cf6' },
    { id: 'other-expense', label: 'Other Expense', colour: '#6b7280' },
  ],
};

/**
 * Returns the colour hex string for a given category id.
 * @param {string} categoryId
 * @returns {string} Hex colour
 */
export function getCategoryColour(categoryId) { ... }

/**
 * Returns the display label for a given category id.
 * @param {string} categoryId
 * @returns {string}
 */
export function getCategoryLabel(categoryId) { ... }

/**
 * Returns category options filtered by type ('income' | 'expense').
 * @param {string} type
 * @returns {Array<{id: string, label: string, colour: string}>}
 */
export function getCategoriesByType(type) { ... }
```

### 6.3 `modules/storage.js` — localStorage Operations

```js
/**
 * File: storage.js
 * Description: Handles reading and writing the transaction array
 *              to/from localStorage. Provides a single storage key.
 */

const STORAGE_KEY = 'budget_tracker_transactions';

/**
 * Load all transactions from localStorage.
 * @returns {Array<Transaction>} Parsed array or empty array if none.
 */
export function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save the full transactions array to localStorage.
 * @param {Array<Transaction>} transactions
 */
export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
```

### 6.4 `modules/transactions.js` — CRUD & Filtering

```js
/**
 * File: transactions.js
 * Description: Creates, deletes, and filters transaction objects.
 */

/**
 * Create a new transaction object.
 * @param {object} params
 * @param {'income'|'expense'} params.type
 * @param {number} params.amount - Positive number.
 * @param {string} params.category - Category id.
 * @param {string} params.date - ISO date string (YYYY-MM-DD).
 * @param {string} [params.description] - Optional note.
 * @returns {Transaction}
 */
export function createTransaction({ type, amount, category, date, description }) {
  return {
    id: crypto.randomUUID(),
    type,
    amount: Math.round(amount * 100) / 100,  // prevent float drift
    category,
    date,
    description: description || '',
    createdAt: Date.now(),
  };
}

/**
 * Delete a transaction by id from the array. Returns new array.
 * @param {Array<Transaction>} transactions
 * @param {string} id
 * @returns {Array<Transaction>}
 */
export function deleteTransaction(transactions, id) {
  return transactions.filter(tx => tx.id !== id);
}

/**
 * Filter transactions by type, category, and date range.
 * @param {Array<Transaction>} transactions
 * @param {object} filters
 * @param {string} [filters.type] - 'all' | 'income' | 'expense'
 * @param {string} [filters.category] - 'all' or category id
 * @param {string} [filters.from] - ISO date string
 * @param {string} [filters.to] - ISO date string
 * @returns {Array<Transaction>}
 */
export function filterTransactions(transactions, { type, category, from, to }) {
  let result = [...transactions];
  if (type && type !== 'all') {
    result = result.filter(tx => tx.type === type);
  }
  if (category && category !== 'all') {
    result = result.filter(tx => tx.category === category);
  }
  if (from) {
    result = result.filter(tx => tx.date >= from);
  }
  if (to) {
    result = result.filter(tx => tx.date <= to);
  }
  return result;
}

/**
 * Sort transactions by date descending (newest first).
 * @param {Array<Transaction>} transactions
 * @returns {Array<Transaction>}
 */
export function sortByDateDesc(transactions) {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}
```

### 6.5 `modules/summary.js` — Calculations

```js
/**
 * File: summary.js
 * Description: Computes totals, balance, and per-category breakdowns
 *              from the transaction array.
 */

/**
 * @param {Array<Transaction>} transactions
 * @returns {{ totalIncome: number, totalExpenses: number, balance: number }}
 */
export function computeTotals(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const tx of transactions) {
    if (tx.type === 'income') totalIncome += tx.amount;
    else totalExpenses += tx.amount;
  }
  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
  };
}

/**
 * Group expense amounts by category.
 * @param {Array<Transaction>} transactions
 * @returns {Array<{ categoryId: string, total: number }>} Sorted desc.
 */
export function expensesByCategory(transactions) {
  const map = {};
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue;
    map[tx.category] = (map[tx.category] || 0) + tx.amount;
  }
  return Object.entries(map)
    .map(([categoryId, total]) => ({ categoryId, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Group income and expense totals by month (YYYY-MM).
 * @param {Array<Transaction>} transactions
 * @returns {Array<{ month: string, income: number, expense: number }>}
 *          Sorted chronologically.
 */
export function monthlyBreakdown(transactions) {
  const map = {};
  for (const tx of transactions) {
    const month = tx.date.slice(0, 7); // "YYYY-MM"
    if (!map[month]) map[month] = { income: 0, expense: 0 };
    if (tx.type === 'income') map[month].income += tx.amount;
    else map[month].expense += tx.amount;
  }
  return Object.entries(map)
    .map(([month, data]) => ({
      month,
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
```

### 6.6 `modules/charts.js` — Canvas Rendering

Full detail in **Section 7** below. Exports:

```js
export function drawPieChart(canvasId, categoryData) { ... }
export function drawBarChart(canvasId, monthlyData) { ... }
export function renderPieLegend(containerId, categoryData) { ... }
export function renderBarLegend(containerId) { ... }
```

### 6.7 `modules/ui.js` — DOM Rendering & Events

```js
/**
 * File: ui.js
 * Description: Handles all DOM interactions — form submission,
 *              transaction list rendering, summary card updates,
 *              filter controls, and triggering chart draws.
 */

import { createTransaction, deleteTransaction, filterTransactions, sortByDateDesc } from './transactions.js';
import { saveTransactions } from './storage.js';
import { computeTotals, expensesByCategory, monthlyBreakdown } from './summary.js';
import { drawPieChart, drawBarChart, renderPieLegend, renderBarLegend } from './charts.js';
import { CATEGORIES, getCategoryLabel, getCategoryColour, getCategoriesByType } from './categories.js';

let transactions = [];         // in-memory state
let currentFilters = { type: 'all', category: 'all', from: '', to: '' };

/**
 * Initialise the UI: bind events, populate dropdowns, first render.
 * @param {Array<Transaction>} loadedTransactions
 */
export function initUI(loadedTransactions) { ... }

// ── Private helpers ──

function handleFormSubmit(e) {
  // 1. Prevent default
  // 2. Read form values
  // 3. Validate (amount > 0, category chosen)
  // 4. Create transaction via createTransaction()
  // 5. Push to transactions array
  // 6. saveTransactions()
  // 7. renderAll()
  // 8. Reset form
}

function handleDelete(id) {
  // 1. Filter out transaction
  // 2. Save & re-render
}

function handleFilterChange() {
  // 1. Read filter control values
  // 2. Update currentFilters
  // 3. Re-render transaction list only (not charts)
}

function populateCategoryDropdown(selectEl, type) {
  // Clear options, add categories for the given type
}

function renderAll() {
  renderSummaryCards();
  renderTransactionList();
  renderCharts();
}

function renderSummaryCards() {
  const { totalIncome, totalExpenses, balance } = computeTotals(transactions);
  // Update #total-income, #total-expenses, #balance text content
  // Format as £X,XXX.XX using toLocaleString('en-GB')
}

function renderTransactionList() {
  const filtered = filterTransactions(transactions, currentFilters);
  const sorted = sortByDateDesc(filtered);
  // Build <tr> elements for each transaction
  // Show/hide empty message
  // Attach delete button event listeners via event delegation
}

function renderCharts() {
  const catData = expensesByCategory(transactions);
  drawPieChart('pie-chart', catData);
  renderPieLegend('pie-legend', catData);

  const monthData = monthlyBreakdown(transactions);
  drawBarChart('bar-chart', monthData);
  renderBarLegend('bar-legend');
}

/**
 * Format a number as currency: £1,234.56
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return '£' + value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
```

---

## 7. Chart Rendering Details

### 7.1 Pie Chart — Expense Distribution by Category

#### Canvas Setup

```
Canvas element:   #pie-chart
Logical size:     400 × 400 (set via HTML attributes)
CSS scaling:      max-width: 100%; height: auto  (responsive)
Device pixels:    Scale canvas by window.devicePixelRatio for sharpness
Centre point:     (200, 200)
Radius:           150 px
```

#### DPR Handling

```js
function setupCanvas(canvas, logicalWidth, logicalHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  canvas.style.width = logicalWidth + 'px';
  canvas.style.height = logicalHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

#### Pie Chart Algorithm

```
Input:  categoryData = [{ categoryId, total }, ...]
        (already sorted by total descending)

1. Compute grandTotal = sum of all totals.
2. If grandTotal === 0, draw a grey circle with "No data" text; return.
3. Let startAngle = -π/2    (12 o'clock position).
4. For each category slice:
   a. percentage = total / grandTotal
   b. sliceAngle = percentage × 2π
   c. endAngle   = startAngle + sliceAngle
   d. Draw arc:
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = getCategoryColour(categoryId)
      ctx.fill()
   e. Draw label if percentage ≥ 5%:
      - midAngle = startAngle + sliceAngle / 2
      - labelX = cx + (radius × 0.65) × cos(midAngle)
      - labelY = cy + (radius × 0.65) × sin(midAngle)
      - ctx.fillStyle = '#fff'
      - ctx.font = 'bold 12px sans-serif'
      - ctx.textAlign = 'center'
      - ctx.fillText(Math.round(percentage × 100) + '%', labelX, labelY)
   f. startAngle = endAngle
5. Draw a white circle in the centre for a donut effect (optional):
   - ctx.arc(cx, cy, radius × 0.45, 0, 2π) — fill white
   - Draw total text in the centre hole
```

#### Pie Legend (HTML, not canvas)

```html
<!-- Rendered into #pie-legend -->
<ul class="legend">
  <li><span class="legend__swatch" style="background:#f59e0b"></span> Food — £245.00 (29%)</li>
  <li>...</li>
</ul>
```

Built in `renderPieLegend()` by iterating `categoryData`, computing percentage, and creating list items with a coloured swatch `<span>`.

### 7.2 Bar Chart — Monthly Income vs Expense

#### Canvas Setup

```
Canvas element:   #bar-chart
Logical size:     600 × 400
Padding:          top: 30, right: 20, bottom: 60, left: 70
Chart area:       510 × 310  (600-70-20 × 400-30-60)
```

#### Bar Chart Algorithm

```
Input:  monthlyData = [{ month: "2026-01", income: 1200, expense: 800 }, ...]

1. If monthlyData is empty, draw "No data" text in centre; return.

2. Determine scale:
   a. maxValue = max across all income and expense values
   b. Round maxValue up to nearest nice number (e.g. next multiple of 100/500/1000)
   c. yScale  = chartHeight / maxValue

3. Compute bar positions:
   a. numberOfMonths = monthlyData.length
   b. groupWidth     = chartWidth / numberOfMonths
   c. barWidth       = groupWidth × 0.3        (each bar is 30% of group)
   d. barGap         = groupWidth × 0.05       (5% gap between paired bars)

4. Draw Y-axis gridlines & labels:
   a. Divide maxValue into 5 equal ticks
   b. For each tick value:
      - y = paddingTop + chartHeight - (tickValue × yScale)
      - Draw dashed horizontal line across chart area
      - Draw label text (formatted as "£XXX") at left of line

5. Draw bars for each month:
   For monthIndex 0..n:
     a. groupX = paddingLeft + monthIndex × groupWidth
     b. Income bar:
        - x      = groupX + (groupWidth - 2×barWidth - barGap) / 2
        - height = income × yScale
        - y      = paddingTop + chartHeight - height
        - ctx.fillStyle = '#10b981' (income green)
        - ctx.fillRect(x, y, barWidth, height)
     c. Expense bar:
        - x      = incomeBarX + barWidth + barGap
        - height = expense × yScale
        - same y calculation
        - ctx.fillStyle = '#ef4444' (expense red)
        - ctx.fillRect(x, y, barWidth, height)
     d. Value labels above each bar (if height > 20px):
        - ctx.fillText(formatCurrency(value), barCentreX, y - 5)

6. Draw X-axis month labels:
   For each month:
     - x = groupX + groupWidth / 2
     - y = paddingTop + chartHeight + 20
     - Format "2026-01" → "Jan 26" or "Jan"
     - ctx.fillText(label, x, y)
     - Rotate text 45° if more than 6 months for readability

7. Draw axes:
   - Y-axis: vertical line at paddingLeft
   - X-axis: horizontal line at paddingTop + chartHeight
```

#### Bar Legend (HTML)

```html
<ul class="legend">
  <li><span class="legend__swatch" style="background:#10b981"></span> Income</li>
  <li><span class="legend__swatch" style="background:#ef4444"></span> Expense</li>
</ul>
```

### 7.3 Chart Helpers

```js
/**
 * Format month string "YYYY-MM" to short label "Jan 26".
 * @param {string} monthStr
 * @returns {string}
 */
function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return names[parseInt(month, 10) - 1] + ' ' + year.slice(2);
}

/**
 * Round a number up to the next "nice" value for axis scaling.
 * e.g. 870 → 1000, 4500 → 5000
 * @param {number} value
 * @returns {number}
 */
function niceMax(value) {
  if (value <= 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  if (residual <= 1) return magnitude;
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}
```

---

## 8. Data Model

### Transaction Object

```js
/**
 * @typedef {Object} Transaction
 * @property {string}  id          - UUID (crypto.randomUUID())
 * @property {'income'|'expense'} type
 * @property {number}  amount      - Positive number, 2 decimal places max
 * @property {string}  category    - Category id (e.g. 'food', 'salary')
 * @property {string}  date        - ISO date string "YYYY-MM-DD"
 * @property {string}  description - User-entered note (may be empty)
 * @property {number}  createdAt   - Date.now() timestamp for sort tiebreaking
 */
```

### Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "type": "expense",
  "amount": 45.30,
  "category": "food",
  "date": "2026-03-25",
  "description": "Lunch with friends",
  "createdAt": 1774627200000
}
```

### localStorage Schema

```
Key:   "budget_tracker_transactions"
Value: JSON stringified array of Transaction objects

Example:
[
  { "id": "...", "type": "income",  "amount": 1250, "category": "salary", "date": "2026-03-01", "description": "March salary", "createdAt": 1774000000000 },
  { "id": "...", "type": "expense", "amount": 45.30, "category": "food",  "date": "2026-03-25", "description": "Lunch",        "createdAt": 1774627200000 }
]
```

### Category List (Reference)

| ID | Label | Type | Colour |
|---|---|---|---|
| `salary` | Salary | income | `#10b981` |
| `freelance` | Freelance | income | `#14b8a6` |
| `investments` | Investments | income | `#06b6d4` |
| `gifts` | Gifts | income | `#8b5cf6` |
| `other-income` | Other Income | income | `#6366f1` |
| `food` | Food | expense | `#f59e0b` |
| `transport` | Transport | expense | `#3b82f6` |
| `entertainment` | Entertainment | expense | `#ec4899` |
| `bills` | Bills | expense | `#ef4444` |
| `shopping` | Shopping | expense | `#f97316` |
| `health` | Health | expense | `#14b8a6` |
| `education` | Education | expense | `#8b5cf6` |
| `other-expense` | Other Expense | expense | `#6b7280` |

---

## 9. Accessibility & State Management

### Accessibility

| Requirement | Implementation |
|---|---|
| Semantic HTML | `<header>`, `<main>`, `<section>`, `<footer>`, `<table>`, `<form>` |
| Heading hierarchy | `h1` (page title) → `h2` (section titles) |
| Form labels | Every `<input>` and `<select>` has a visible `<label>` or `sr-only` label |
| Canvas alt text | `role="img"` + `aria-label` on each `<canvas>` |
| Delete buttons | `aria-label="Delete transaction"` on each delete button |
| Keyboard nav | All controls are natively focusable (`button`, `input`, `select`). Delete button reachable via Tab. |
| Focus indicators | Custom `:focus-visible` outline (`2px solid var(--clr-btn-primary)`) |
| Colour contrast | All text meets WCAG AA (4.5:1 for body, 3:1 for large text). Income green and expense red chosen for sufficient contrast on white. |
| Screen reader | Summary cards use `aria-label` on the section. Empty state message announced. |
| Filter state | Active filter button uses `aria-pressed="true"` |

### State Management

```
State lives in a single `transactions` array inside ui.js.

On every mutation (add / delete):
  1. Update the in-memory array
  2. Call saveTransactions(transactions) → writes to localStorage
  3. Call renderAll() → recalculates totals, re-renders list, redraws charts

Filters modify only the *displayed* list, not the underlying data.
Charts always render from the full unfiltered dataset.

No external state library. The single array is the source of truth.
localStorage is the persistence layer — read once on load, written on every change.
```

### Input Validation

| Field | Rule | Error Handling |
|---|---|---|
| Type | Must be `income` or `expense` | Select defaults to `expense`; always valid |
| Amount | Must be > 0, max 2 decimal places | Show inline error, prevent submission |
| Category | Must be selected (not empty) | Show inline error |
| Date | Must be valid date, defaults to today | Pre-filled; always valid |
| Description | Optional, max 100 chars | `maxlength` attribute on input |

Validation uses `form.checkValidity()` and the Constraint Validation API. Custom messages via `setCustomValidity()` only where needed.

### XSS Prevention

- Transaction description is rendered using `textContent`, never `innerHTML`.
- All user input that reaches the DOM is text-only.
- No `innerHTML` with user data anywhere in the app.

---

## 10. Implementation Checklist

### Phase 1 — Foundation

- [ ] Create `index.html` with full semantic structure (header, summary, form, filters, table, charts, footer)
- [ ] Create `styles/main.css` with CSS variables, reset, layout grid, responsive breakpoints
- [ ] Style summary cards (3-column grid, coloured top borders, shadows)
- [ ] Style the transaction form (grid layout, input/select styling, button)
- [ ] Style the filter bar (flexbox row, active-state button)

### Phase 2 — Core Data

- [ ] Create `js/modules/categories.js` — export category arrays and lookup functions
- [ ] Create `js/modules/storage.js` — `loadTransactions()` and `saveTransactions()`
- [ ] Create `js/modules/transactions.js` — `createTransaction()`, `deleteTransaction()`, `filterTransactions()`, `sortByDateDesc()`
- [ ] Create `js/modules/summary.js` — `computeTotals()`, `expensesByCategory()`, `monthlyBreakdown()`

### Phase 3 — UI & Interaction

- [ ] Create `js/modules/ui.js` — `initUI()`, form submission handler, category dropdown population
- [ ] Implement `renderSummaryCards()` — format and display totals
- [ ] Implement `renderTransactionList()` — build table rows, attach delete handlers via event delegation
- [ ] Implement filter controls — type toggle buttons, category dropdown, date range inputs
- [ ] Implement empty state — show "No transactions yet" message when list is empty
- [ ] Wire up `js/main.js` — import modules, call `init()` on DOMContentLoaded

### Phase 4 — Charts

- [ ] Implement `setupCanvas()` — DPR-aware canvas sizing
- [ ] Implement `drawPieChart()` — arc rendering, percentage labels, donut hole
- [ ] Implement `renderPieLegend()` — HTML legend with swatches and values
- [ ] Implement `drawBarChart()` — axis scaling, gridlines, paired bars, month labels
- [ ] Implement `renderBarLegend()` — HTML legend for income/expense colours
- [ ] Handle "no data" state for both charts (grey placeholder)

### Phase 5 — Table Styling & Polish

- [ ] Style transaction table (alternating rows, hover, income/expense colour coding)
- [ ] Style delete button (small ✕, red hover state)
- [ ] Add horizontal scroll wrapper for table on mobile
- [ ] Add transitions on card hover, button hover

### Phase 6 — Accessibility & Testing

- [ ] Verify all form inputs have associated labels
- [ ] Add `aria-label` to canvas elements and delete buttons
- [ ] Add `aria-pressed` to active filter button
- [ ] Tab through entire UI — confirm logical focus order
- [ ] Test screen reader announcements for summary values
- [ ] Verify colour contrast ratios (WCAG AA)

### Phase 7 — Responsiveness & Final QA

- [ ] Test at 1200px, 1024px, 768px, 480px, 320px widths
- [ ] Verify form stacks correctly on mobile
- [ ] Verify charts scale within container on small screens
- [ ] Verify table scrolls horizontally on narrow viewports
- [ ] Test adding, deleting, filtering with 0, 1, 10, 50 transactions
- [ ] Test localStorage persistence — reload page, verify data survives
- [ ] Clear localStorage — verify app loads cleanly with empty state
- [ ] Validate HTML (no errors in W3C validator)
- [ ] Final visual review and polish
