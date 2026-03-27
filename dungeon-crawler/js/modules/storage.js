/**
 * File: storage.js
 * Description: localStorage save/load for game state persistence
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const SAVE_KEY = 'dungeonCrawler_save';
const BEST_KEY = 'dungeonCrawler_best';

/**
 * @returns {boolean} Whether a save exists
 */
export function hasSave() {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Saves game state to localStorage
 * @param {Object} data - Serialisable game state
 */
export function saveGame(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch { /* storage unavailable */ }
}

/**
 * Loads saved game state
 * @returns {Object|null}
 */
export function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Deletes the save
 */
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch { /* */ }
}

/**
 * Gets the best run floor
 * @returns {number}
 */
export function getBestRun() {
  try {
    return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
  } catch {
    return 0;
  }
}

/**
 * Updates best run if this one is better
 * @param {number} floor
 */
export function updateBestRun(floor) {
  try {
    const current = getBestRun();
    if (floor > current) {
      localStorage.setItem(BEST_KEY, String(floor));
    }
  } catch { /* */ }
}
