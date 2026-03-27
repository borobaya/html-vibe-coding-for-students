/**
 * File: storage.js
 * Description: localStorage wrapper for settings and stats persistence
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Loads JSON data from localStorage
 * @param {string} key
 * @param {*} fallback - Default value if key missing or parse fails
 * @returns {*}
 */
export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Saves data as JSON in localStorage
 * @param {string} key
 * @param {*} value
 */
export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silent fail
  }
}
