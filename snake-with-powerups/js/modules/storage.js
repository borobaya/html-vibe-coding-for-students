/**
 * File: storage.js
 * Description: Read/write high score to localStorage with error handling
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const STORAGE_KEY = 'snake-highscore';

/**
 * Reads the stored high score
 * @returns {number} The high score, or 0 if not found / on error
 */
export function getHighScore() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? parseInt(value, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Saves the high score if it exceeds the current stored value
 * @param {number} score
 */
export function setHighScore(score) {
  try {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEY, String(score));
    }
  } catch {
    // Storage unavailable — silently fail
  }
}

/** Removes the high score from storage */
export function clearHighScore() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}
