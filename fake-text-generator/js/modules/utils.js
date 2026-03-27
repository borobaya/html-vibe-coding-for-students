/**
 * File: utils.js
 * Description: Utility functions — ID generation, time formatting, sanitisation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Generates a unique ID
 * @returns {string}
 */
export function generateId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

/**
 * Formats a Date object to HH:MM
 * @param {Date} date
 * @returns {string}
 */
export function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Parses time input value, auto-generating if empty
 * @param {string} value - Value from input[type=time]
 * @param {string|null} lastTimestamp - Previous message timestamp (HH:MM)
 * @returns {string} HH:MM string
 */
export function parseTimeInput(value, lastTimestamp) {
  if (value) return value;

  if (lastTimestamp) {
    const [h, m] = lastTimestamp.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + 1 + Math.floor(Math.random() * 5));
    return formatTime(date);
  }

  return formatTime(new Date());
}

/**
 * Sanitises text to prevent XSS
 * @param {string} text
 * @returns {string}
 */
export function sanitise(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, c => map[c]);
}

/**
 * Clamps a value between min and max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
