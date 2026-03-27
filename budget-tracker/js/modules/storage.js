/**
 * File: storage.js
 * Description: localStorage persistence for budget transactions
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const STORAGE_KEY = 'budget_tracker_transactions';

/**
 * Loads transactions from localStorage
 * @returns {Array}
 */
export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves transactions to localStorage
 * @param {Array} transactions
 */
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // silent
  }
}
