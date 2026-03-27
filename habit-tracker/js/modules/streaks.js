/**
 * File: streaks.js
 * Description: Streak calculation — current and longest consecutive days
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { today, addDays } from './date-utils.js';

/**
 * Calculates the current streak for a habit (consecutive days ending today or yesterday)
 * @param {string} habitId
 * @param {Array<{ habitId: string, date: string }>} completions
 * @returns {number}
 */
export function calculateCurrentStreak(habitId, completions) {
  const dates = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  const todayStr = today();
  const yesterdayStr = addDays(todayStr, -1);

  // Streak must start from today or yesterday
  let checkDate;
  if (dates[0] === todayStr) {
    checkDate = todayStr;
  } else if (dates[0] === yesterdayStr) {
    checkDate = yesterdayStr;
  } else {
    return 0;
  }

  const dateSet = new Set(dates);
  let streak = 0;

  while (dateSet.has(checkDate)) {
    streak += 1;
    checkDate = addDays(checkDate, -1);
  }

  return streak;
}

/**
 * Calculates the longest ever streak for a habit
 * @param {string} habitId
 * @param {Array<{ habitId: string, date: string }>} completions
 * @returns {number}
 */
export function calculateLongestStreak(habitId, completions) {
  const dates = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
    .sort();

  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const expected = addDays(dates[i - 1], 1);
    if (dates[i] === expected) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Counts total completions for a habit
 * @param {string} habitId
 * @param {Array<{ habitId: string, date: string }>} completions
 * @returns {number}
 */
export function calculateTotalCompletions(habitId, completions) {
  return completions.filter((c) => c.habitId === habitId).length;
}
