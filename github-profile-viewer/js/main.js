/**
 * File: main.js
 * Description: Entry point — binds event listeners, orchestrates search flow
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { fetchUser, fetchRepos, UserNotFoundError, RateLimitError } from './modules/api.js';
import {
  renderProfile,
  renderRepos,
  showError,
  showSkeleton,
  hideSkeleton,
  clearResults,
} from './modules/ui.js';
import { validateUsername, sanitizeInput } from './modules/validation.js';

/** Cached DOM references. */
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

/**
 * Handles the search form submission.
 * @param {Event} event - Submit event
 */
async function handleSearch(event) {
  event.preventDefault();

  const raw = searchInput.value;
  const sanitized = sanitizeInput(raw);
  const { valid, message } = validateUsername(sanitized);

  if (!valid) {
    clearResults();
    showError(message);
    return;
  }

  clearResults();
  showSkeleton();
  searchButton.disabled = true;

  try {
    const [userData, reposData] = await Promise.all([
      fetchUser(sanitized),
      fetchRepos(sanitized),
    ]);

    hideSkeleton();
    renderProfile(userData);
    renderRepos(reposData);
  } catch (error) {
    hideSkeleton();

    if (error instanceof UserNotFoundError) {
      showError('User not found. Check the username and try again.');
    } else if (error instanceof RateLimitError) {
      let msg = 'API rate limit reached.';
      if (error.resetTime) {
        const minutes = Math.ceil(
          (error.resetTime.getTime() - Date.now()) / 60_000
        );
        msg += ` Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`;
      } else {
        msg += ' Please wait a minute and try again.';
      }
      showError(msg, 'rate-limit');
    } else if (error instanceof TypeError) {
      showError(
        'Something went wrong. Please check your connection and try again.'
      );
    } else {
      showError(
        'Something went wrong. Please check your connection and try again.'
      );
    }
  } finally {
    searchButton.disabled = false;
  }
}

/** Initialises the app. */
function initApp() {
  searchForm.addEventListener('submit', handleSearch);
  searchInput.focus();
}

document.addEventListener('DOMContentLoaded', initApp);
