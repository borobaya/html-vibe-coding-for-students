/**
 * File: main.js
 * Description: Entry point — initialises app, coordinates modules
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { fetchRandomArticle } from './modules/api.js';
import { createArticle } from './modules/article.js';
import { loadHistory, addToHistory, clearHistory } from './modules/history.js';
import {
  showWelcome,
  showLoading,
  showError,
  showArticle,
  setButtonLoading,
  renderHistoryList,
} from './modules/ui.js';

/**
 * Handles the Surprise Me! button click.
 */
async function handleSurpriseClick() {
  setButtonLoading(true);
  showLoading();

  try {
    const rawData = await fetchRandomArticle();
    const article = createArticle(rawData);
    showArticle(article);
    const updatedHistory = addToHistory(article);
    renderHistoryList(updatedHistory, handleHistoryClick);
  } catch (error) {
    showError('Could not fetch an article. Please check your connection and try again.');
  } finally {
    setButtonLoading(false);
  }
}

/**
 * Handles clicking a history item to re-display it.
 * @param {object} article - The article to re-display
 */
function handleHistoryClick(article) {
  showArticle(article);
}

/**
 * Handles clearing all history.
 */
function handleClearHistory() {
  clearHistory();
  renderHistoryList([], handleHistoryClick);
}

/**
 * Toggles the history panel on mobile.
 */
function handleHistoryToggle() {
  const panel = document.querySelector('.history-panel');
  panel.classList.toggle('history-panel--collapsed');
}

/**
 * Initialises the app.
 */
function init() {
  const history = loadHistory();
  renderHistoryList(history, handleHistoryClick);

  // Bind event listeners
  document.getElementById('surprise-btn').addEventListener('click', handleSurpriseClick);
  document.getElementById('retry-btn').addEventListener('click', handleSurpriseClick);
  document.getElementById('clear-history-btn').addEventListener('click', handleClearHistory);

  // Mobile accordion toggle
  const historyHeader = document.querySelector('.history-panel__header');
  historyHeader.addEventListener('click', handleHistoryToggle);

  // Show welcome state
  showWelcome();
}

document.addEventListener('DOMContentLoaded', init);
