/**
 * File: router.js
 * Description: Hash-based routing for view switching
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** @type {function|null} */
let routeHandler = null;

/**
 * Initialises the router
 * @param {function} handler - Called with the parsed route on every hash change
 */
export function initRouter(handler) {
  routeHandler = handler;
  window.addEventListener('hashchange', route);
  route();
}

/**
 * Parses the current hash and calls the route handler
 */
export function route() {
  const hash = window.location.hash.slice(1) || 'decks';
  const parts = hash.split('/');
  const view = parts[0];
  const id = parts[1] || null;

  if (routeHandler) {
    routeHandler(view, id);
  }
}

/**
 * Navigates to a new hash
 * @param {string} hash
 */
export function navigateTo(hash) {
  window.location.hash = hash;
}
