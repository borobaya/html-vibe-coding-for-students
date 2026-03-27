/**
 * File: history.js
 * Description: Manages the article history list with deduplication
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getHistory, saveHistory } from './storage.js';

const MAX_HISTORY = 50;

/**
 * Loads history from localStorage.
 * @returns {Array<object>} Array of article objects
 */
export function loadHistory() {
  return getHistory();
}

/**
 * Adds an article to history. Deduplicates by id, prepends to front.
 * @param {object} article - Normalised article object
 * @returns {Array<object>} Updated history array
 */
export function addToHistory(article) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== article.id);
  filtered.unshift(article);

  if (filtered.length > MAX_HISTORY) {
    filtered.length = MAX_HISTORY;
  }

  saveHistory(filtered);
  return filtered;
}

/**
 * Clears all history.
 */
export function clearHistory() {
  saveHistory([]);
}
