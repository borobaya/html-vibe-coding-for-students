/**
 * File: heatmap.js
 * Description: GitHub-style contribution heatmap rendering
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { formatDate, getWeekStart, getDayOfWeek, getMonthName } from './date-utils.js';
import { getAll, getCompletions } from './habits.js';

/**
 * Gets the intensity level (0-4) based on completion percentage
 * @param {number} completedCount
 * @param {number} activeHabitCount
 * @returns {number} 0-4
 */
export function getIntensityLevel(completedCount, activeHabitCount) {
  if (activeHabitCount === 0 || completedCount === 0) return 0;
  const pct = (completedCount / activeHabitCount) * 100;
  if (pct <= 25) return 1;
  if (pct <= 50) return 2;
  if (pct <= 75) return 3;
  return 4;
}

/**
 * Renders the heatmap grid for a given year
 * @param {number} year
 */
export function render(year) {
  const grid = document.getElementById('heatmap-grid');
  const yearLabel = document.getElementById('heatmap-year');
  if (!grid || !yearLabel) return;

  yearLabel.textContent = year;

  // Disable "next" if showing current year
  const nextBtn = document.getElementById('btn-heatmap-next');
  if (nextBtn) {
    nextBtn.disabled = year >= new Date().getFullYear();
  }

  const habits = getAll();
  const completions = getCompletions();

  // Date range: Monday on/before Jan 1 → Sunday on/after Dec 31
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  const start = getWeekStart(jan1);
  const endDow = getDayOfWeek(dec31);
  const end = new Date(dec31);
  if (endDow < 6) {
    end.setDate(end.getDate() + (6 - endDow));
  }

  // Build completion counts per day
  const completionsByDate = {};
  for (const c of completions) {
    if (!completionsByDate[c.date]) completionsByDate[c.date] = new Set();
    completionsByDate[c.date].add(c.habitId);
  }

  grid.innerHTML = '';

  // Generate cells
  const current = new Date(start);
  while (current <= end) {
    const dateStr = formatDate(current);
    const dow = getDayOfWeek(current);

    // Count active habits on this date (created on or before this date)
    const activeCount = habits.filter((h) => h.createdAt <= dateStr).length;
    const completedSet = completionsByDate[dateStr];
    const completedCount = completedSet ? completedSet.size : 0;
    const level = getIntensityLevel(completedCount, activeCount);

    const cell = document.createElement('div');
    cell.className = 'heatmap__cell';
    cell.dataset.date = dateStr;
    cell.dataset.level = level;
    cell.style.gridRow = dow + 1;
    cell.setAttribute('aria-label', `${dateStr}: ${completedCount}/${activeCount} habits`);

    grid.appendChild(cell);
    current.setDate(current.getDate() + 1);
  }

  // Month labels
  renderMonthLabels(grid, start, end);
}

/**
 * Adds month labels above heatmap columns
 * @param {HTMLElement} grid
 * @param {Date} start
 * @param {Date} end
 */
function renderMonthLabels(grid, start, end) {
  // Remove old labels
  grid.querySelectorAll('.heatmap__month-label').forEach((el) => el.remove());

  const current = new Date(start);
  let lastMonth = -1;
  let weekCol = 1;

  while (current <= end) {
    const dow = getDayOfWeek(current);
    if (dow === 0) {
      // Monday — start of a week column
      if (current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        const label = document.createElement('span');
        label.className = 'heatmap__month-label';
        label.textContent = getMonthName(lastMonth);
        label.style.gridColumn = weekCol;
        label.style.gridRow = 0;
        grid.appendChild(label);
      }
      weekCol += 1;
    }
    current.setDate(current.getDate() + 1);
  }
}

/** @type {number} */
let displayYear = new Date().getFullYear();

/**
 * Changes the display year by a delta and re-renders
 * @param {number} delta - +1 or -1
 */
export function changeYear(delta) {
  const newYear = displayYear + delta;
  if (newYear > new Date().getFullYear()) return;
  displayYear = newYear;
  render(displayYear);
}

/**
 * Returns the current display year
 * @returns {number}
 */
export function getDisplayYear() {
  return displayYear;
}
