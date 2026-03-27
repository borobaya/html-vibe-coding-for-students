/**
 * File: storage.js
 * Description: localStorage helpers for wiki explorer history
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const STORAGE_KEY = 'wiki-explorer-history';

/**
 * Reads history from localStorage.
 * @returns {Array<object>} Array of saved article objects
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the history array to localStorage.
 * @param {Array<object>} history - Array of article objects
 */
export function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage full or disabled — silently ignore
  }
}
