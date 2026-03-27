/**
 * File: ui.js
 * Description: DOM rendering — article card, states, history list
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const PLACEHOLDER_SVG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect fill="#f0f0f0" width="120" height="120"/><text x="60" y="65" text-anchor="middle" font-size="40" fill="#ccc">📄</text></svg>'
);

/* ── Cached DOM elements ──────────────────────────── */
const welcomeState = document.getElementById('welcome-state');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const articleCard = document.getElementById('article-card');
const articleThumbnail = document.getElementById('article-thumbnail');
const articleTitle = document.getElementById('article-title');
const articleExtract = document.getElementById('article-extract');
const articleLink = document.getElementById('article-link');

const surpriseBtn = document.getElementById('surprise-btn');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const historyCount = document.getElementById('history-count');
const clearHistoryBtn = document.getElementById('clear-history-btn');

/**
 * Hides all state containers.
 */
function hideAllStates() {
  welcomeState.hidden = true;
  loadingState.hidden = true;
  errorState.hidden = true;
  articleCard.hidden = true;
}

/** Shows the welcome state. */
export function showWelcome() {
  hideAllStates();
  welcomeState.hidden = false;
}

/** Shows the loading spinner state. */
export function showLoading() {
  hideAllStates();
  loadingState.hidden = false;
}

/**
 * Shows the error state with a message.
 * @param {string} message - Error message to display
 */
export function showError(message) {
  hideAllStates();
  errorMessage.textContent = message || 'Could not fetch an article. Please try again.';
  errorState.hidden = false;
}

/** Hides the loading state (convenience). */
export function hideLoading() {
  loadingState.hidden = true;
}

/**
 * Displays an article in the card.
 * @param {object} article - Normalised article object
 */
export function showArticle(article) {
  hideAllStates();

  // Image
  if (article.thumbnail) {
    articleThumbnail.src = article.thumbnail;
    articleThumbnail.alt = article.title;
    articleThumbnail.classList.remove('article-card__thumbnail--placeholder');
  } else {
    articleThumbnail.src = PLACEHOLDER_SVG;
    articleThumbnail.alt = '';
    articleThumbnail.classList.add('article-card__thumbnail--placeholder');
  }

  articleTitle.textContent = article.title;
  articleExtract.textContent = article.extract;
  articleLink.href = article.pageUrl;

  articleCard.hidden = false;

  // Re-trigger animation
  articleCard.style.animation = 'none';
  void articleCard.offsetHeight;
  articleCard.style.animation = '';

  // Focus title for screen readers
  articleTitle.setAttribute('tabindex', '-1');
  articleTitle.focus();
  articleTitle.addEventListener('blur', () => articleTitle.removeAttribute('tabindex'), { once: true });
}

/**
 * Toggles the button loading/disabled state.
 * @param {boolean} isLoading - Whether to show loading
 */
export function setButtonLoading(isLoading) {
  surpriseBtn.disabled = isLoading;
  surpriseBtn.classList.toggle('btn--pulse', isLoading);
}

/**
 * Renders the history list from an array of articles.
 * @param {Array<object>} history - Array of article objects
 * @param {Function} onClick - Callback for clicking a history item
 */
export function renderHistoryList(history, onClick) {
  while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
  }

  if (history.length === 0) {
    historyEmpty.hidden = false;
    clearHistoryBtn.hidden = true;
  } else {
    historyEmpty.hidden = true;
    clearHistoryBtn.hidden = false;
  }

  for (const article of history) {
    const li = document.createElement('li');
    li.className = 'history-list__item';

    const button = document.createElement('button');
    button.className = 'history-list__button';
    button.type = 'button';

    if (article.thumbnail) {
      const img = document.createElement('img');
      img.className = 'history-list__thumb';
      img.src = article.thumbnail;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 40;
      img.height = 40;
      button.appendChild(img);
    }

    const titleSpan = document.createElement('span');
    titleSpan.className = 'history-list__title';
    titleSpan.textContent = article.title;
    button.appendChild(titleSpan);

    button.addEventListener('click', () => onClick(article));

    li.appendChild(button);
    historyList.appendChild(li);
  }

  updateHistoryCount(history.length);
}

/**
 * Updates the history count badge.
 * @param {number} count - Number of items
 */
export function updateHistoryCount(count) {
  historyCount.textContent = count;
}
