/**
 * File: transactions.js
 * Description: Transaction creation, deletion, filtering, and sorting
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Creates a new transaction object
 * @param {{ type: string, amount: number, category: string, date: string, description: string }} data
 * @returns {object}
 */
export function createTransaction({ type, amount, category, date, description }) {
  return {
    id: crypto.randomUUID(),
    type,
    amount: Math.round(amount * 100) / 100,
    category,
    date,
    description: description || '',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Removes a transaction by ID (returns new array)
 * @param {Array} transactions
 * @param {string} id
 * @returns {Array}
 */
export function deleteTransaction(transactions, id) {
  return transactions.filter((t) => t.id !== id);
}

/**
 * Filters transactions by type, category, and date range
 * @param {Array} transactions
 * @param {{ type?: string, category?: string, from?: string, to?: string }} filters
 * @returns {Array}
 */
export function filterTransactions(transactions, { type, category, from, to }) {
  return transactions.filter((t) => {
    if (type && type !== 'all' && t.type !== type) return false;
    if (category && category !== 'all' && t.category !== category) return false;
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    return true;
  });
}

/**
 * Sorts transactions by date descending
 * @param {Array} transactions
 * @returns {Array}
 */
export function sortByDateDesc(transactions) {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}
