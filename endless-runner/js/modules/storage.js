/**
 * File: storage.js
 * Description: High score persistence via localStorage
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const STORAGE_KEY = 'endlessRunner_highScore';

/**
 * @returns {number} Stored high score, or 0
 */
export function getHighScore() {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * @param {number} score
 */
export function setHighScore(score) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch { /* storage unavailable */ }
}

/**
 * @param {number} currentScore
 * @param {number} previousHigh
 * @returns {boolean}
 */
export function isNewHighScore(currentScore, previousHigh) {
  return currentScore > previousHigh;
}

/**
 * @param {number} score
 * @returns {string} Zero-padded to 5 digits
 */
export function formatScore(score) {
  return String(Math.floor(score)).padStart(5, '0');
}
