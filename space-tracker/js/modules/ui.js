/**
 * File: ui.js
 * Description: Coordinate display, status indicator, and toast notifications
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { TOAST_DURATION_MS } from './config.js';

const latEl = document.getElementById('lat-value');
const lngEl = document.getElementById('lng-value');
const statusDot = document.querySelector('.status__dot');
const statusLabel = document.getElementById('status-label');
const toastContainer = document.getElementById('toast-container');

/**
 * Formats a coordinate to a cardinal-direction string.
 * @param {number} value - Decimal degree value
 * @param {boolean} isLat - true for latitude (N/S), false for longitude (E/W)
 * @returns {string} Formatted coordinate, e.g. "23.4567° N"
 */
export function formatCoordinate(value, isLat) {
  const direction = isLat
    ? value >= 0 ? 'N' : 'S'
    : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(4)}° ${direction}`;
}

/**
 * Updates the coordinate display in the DOM.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
export function updateCoordinates(lat, lng) {
  if (latEl) latEl.textContent = formatCoordinate(lat, true);
  if (lngEl) lngEl.textContent = formatCoordinate(lng, false);
}

/**
 * Sets the connection status indicator.
 * @param {'live'|'stale'|'error'} state - Current connection status
 */
export function setStatus(state) {
  if (!statusDot || !statusLabel) return;

  statusDot.classList.remove('status__dot--live', 'status__dot--stale', 'status__dot--error');
  statusDot.classList.add(`status__dot--${state}`);

  const labels = {
    live: 'Live',
    stale: 'Stale',
    error: 'Disconnected',
  };

  statusLabel.textContent = labels[state] || 'Unknown';
}

/**
 * Displays a temporary toast notification.
 * @param {string} message - Message to show
 * @param {'info'|'error'} [type='info'] - Toast type
 */
export function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, TOAST_DURATION_MS);
}
