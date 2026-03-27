/**
 * File: stats.js
 * Description: Session statistics — track, persist, and reset daily
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { loadData, saveData } from './storage.js';

const STATS_KEY = 'pomodoro-stats';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function defaultStats() {
  return { date: todayKey(), sessions: 0, focusTimeMinutes: 0, streak: 0 };
}

/**
 * Loads stats from localStorage, resetting if date changed
 * @returns {{ sessions: number, focusTimeMinutes: number, streak: number }}
 */
export function getStats() {
  const stored = loadData(STATS_KEY, defaultStats());
  if (stored.date !== todayKey()) {
    return resetDaily(stored);
  }
  return stored;
}

/**
 * Initialises stats (loads or creates fresh)
 */
export function initStats() {
  const stats = getStats();
  saveData(STATS_KEY, stats);
  updateStatsUI(stats);
}

/**
 * Records a completed work session
 * @param {number} durationMinutes
 */
export function recordSession(durationMinutes) {
  const stats = getStats();
  stats.sessions += 1;
  stats.focusTimeMinutes += durationMinutes;
  stats.streak += 1;
  saveData(STATS_KEY, stats);
  updateStatsUI(stats);
}

/**
 * Resets stats for a new day, preserving streak if applicable
 * @param {object} oldStats
 * @returns {object}
 */
export function resetDaily(oldStats) {
  const fresh = defaultStats();
  // Preserve streak if the old date was yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  if (oldStats.date === yesterdayKey && oldStats.sessions > 0) {
    fresh.streak = oldStats.streak;
  }
  saveData(STATS_KEY, fresh);
  return fresh;
}

/**
 * Updates the stats display in the DOM
 * @param {{ sessions: number, focusTimeMinutes: number, streak: number }} stats
 */
function updateStatsUI(stats) {
  const sessionsEl = document.getElementById('stat-sessions');
  const focusEl = document.getElementById('stat-focus-time');
  const streakEl = document.getElementById('stat-streak');

  if (sessionsEl) sessionsEl.textContent = stats.sessions;
  if (focusEl) focusEl.textContent = `${stats.focusTimeMinutes} min`;
  if (streakEl) streakEl.textContent = stats.streak;
}
