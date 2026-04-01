[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Budget Tracker

A personal budget tracker that lets users log income and expenses by category, monitor running balances, and visualise spending breakdowns through interactive pie and bar charts rendered on HTML canvas. All data is saved automatically using localStorage, so nothing is lost between sessions.

## Features

- **Add Transactions** — Log income or expense entries with an amount, category, and optional note
- **Category Tagging** — Assign each transaction to a category (e.g. Food, Transport, Entertainment, Salary, Bills)
- **Running Balance** — Live-updating total balance calculated from all income and expenses
- **Income vs Expense Summary** — At-a-glance totals for money earned and money spent
- **Pie Chart Breakdown** — Canvas-rendered pie chart showing expense distribution by category
- **Bar Chart Overview** — Bar chart comparing income and expense totals across categories
- **Transaction History** — Scrollable list of all logged transactions with date, category, and amount
- **Delete Entries** — Remove individual transactions from the history
- **Data Persistence** — All transactions saved to localStorage and restored on page load
- **Responsive Layout** — Clean interface that works on desktop and mobile screens

## How to Use

1. Open the app in your browser
2. Select whether the transaction is **Income** or **Expense**
3. Enter the amount and choose a category from the dropdown
4. Add an optional note to describe the transaction
5. Click **Add Transaction** to log the entry
6. View your running balance, totals, and chart breakdowns update in real time
7. Scroll through the transaction history to review past entries
8. Click the delete button on any entry to remove it

## Project Structure

```text
budget-tracker/
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

- **HTML5** — Semantic page structure and canvas elements
- **CSS3** — Responsive layout with CSS variables for theming
- **JavaScript (ES2022+)** — Vanilla JS with ES modules for transaction logic and chart rendering

## Getting Started

No dependencies or build tools required. Run locally with either method:

**Option 1 — Open directly:**

Open `index.html` in your browser.

**Option 2 — Local server:**

```bash
python3 server.py
```

Then visit `http://localhost:5500/budget-tracker` in your browser.
