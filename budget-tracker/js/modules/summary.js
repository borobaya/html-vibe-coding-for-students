/**
 * File: summary.js
 * Description: Computes totals, category breakdowns, and monthly data
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Computes total income, expenses, and balance
 * @param {Array} transactions
 * @returns {{ totalIncome: number, totalExpenses: number, balance: number }}
 */
export function computeTotals(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  }

  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpenses = Math.round(totalExpenses * 100) / 100;

  return {
    totalIncome,
    totalExpenses,
    balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
  };
}

/**
 * Groups expense amounts by category
 * @param {Array} transactions
 * @returns {Array<{ categoryId: string, total: number }>}
 */
export function expensesByCategory(transactions) {
  const map = {};

  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    if (!map[t.category]) map[t.category] = 0;
    map[t.category] += t.amount;
  }

  return Object.entries(map)
    .map(([categoryId, total]) => ({ categoryId, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Groups income and expense by month
 * @param {Array} transactions
 * @returns {Array<{ month: string, income: number, expense: number }>}
 */
export function monthlyBreakdown(transactions) {
  const map = {};

  for (const t of transactions) {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!map[month]) map[month] = { month, income: 0, expense: 0 };
    if (t.type === 'income') {
      map[month].income += t.amount;
    } else {
      map[month].expense += t.amount;
    }
  }

  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({
      month: m.month,
      income: Math.round(m.income * 100) / 100,
      expense: Math.round(m.expense * 100) / 100,
    }));
}
