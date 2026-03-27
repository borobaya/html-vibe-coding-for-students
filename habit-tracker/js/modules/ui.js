/**
 * File: ui.js
 * Description: DOM rendering — habit list, stats cards, heatmap, modals
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getAll, getCompletions } from './habits.js';
import { calculateCurrentStreak, calculateLongestStreak } from './streaks.js';
import { render as renderHeatmap, getDisplayYear } from './heatmap.js';
import { today } from './date-utils.js';

/**
 * Renders the full habit list
 * @param {{ onToggle: function, onEdit: function, onDelete: function }} handlers
 */
export function renderHabitList(handlers) {
  const list = document.getElementById('habits-list');
  const empty = document.getElementById('habits-empty');
  if (!list) return;

  const habits = getAll();
  const completions = getCompletions();
  const todayStr = today();

  list.innerHTML = '';

  if (habits.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  for (const habit of habits) {
    const isCompleted = completions.some(
      (c) => c.habitId === habit.id && c.date === todayStr
    );
    const currentStreak = calculateCurrentStreak(habit.id, completions);
    const longestStreak = calculateLongestStreak(habit.id, completions);

    const card = document.createElement('li');
    card.className = `habit-card${isCompleted ? ' habit-card--completed' : ''}`;
    card.dataset.id = habit.id;

    card.innerHTML = `
      <label class="habit-card__checkbox">
        <input type="checkbox" ${isCompleted ? 'checked' : ''} aria-label="Mark ${habit.name} as complete for today" />
        <span class="habit-card__checkmark" aria-hidden="true"></span>
      </label>
      <span class="habit-card__emoji" aria-hidden="true">${habit.emoji}</span>
      <span class="habit-card__name">${habit.name}</span>
      <span class="habit-card__fire${currentStreak >= 3 ? ' habit-card__fire--active' : ''}" aria-hidden="true">🔥</span>
      <span class="habit-card__streak" title="Current streak">${currentStreak}d</span>
      <span class="habit-card__best" title="Best streak">Best: ${longestStreak}d</span>
      <button class="btn btn--ghost btn--sm habit-card__edit" type="button" aria-label="Edit ${habit.name}">✏️</button>
      <button class="btn btn--ghost btn--sm habit-card__delete" type="button" aria-label="Delete ${habit.name}">🗑️</button>
    `;

    // Checkbox toggle
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => handlers.onToggle(habit.id));

    // Edit
    card.querySelector('.habit-card__edit').addEventListener('click', () => handlers.onEdit(habit.id));

    // Delete
    card.querySelector('.habit-card__delete').addEventListener('click', () => handlers.onDelete(habit.id));

    list.appendChild(card);
  }
}

/**
 * Updates the stats cards
 */
export function updateStats() {
  const habits = getAll();
  const completions = getCompletions();
  const todayStr = today();

  const totalEl = document.getElementById('stat-total');
  const todayEl = document.getElementById('stat-today');
  const overallEl = document.getElementById('stat-overall');
  const bestDayEl = document.getElementById('stat-best-day');

  if (totalEl) totalEl.textContent = habits.length;

  // Today's completion
  const todayCompleted = completions.filter((c) => c.date === todayStr).length;
  if (todayEl) {
    todayEl.textContent = habits.length > 0 ? `${todayCompleted}/${habits.length}` : '0/0';
  }

  // Overall rate
  if (overallEl) {
    if (habits.length === 0) {
      overallEl.textContent = '0%';
    } else {
      const totalPossible = habits.reduce((sum, h) => {
        const created = new Date(h.createdAt);
        const now = new Date(todayStr);
        const days = Math.max(1, Math.ceil((now - created) / 86400000) + 1);
        return sum + days;
      }, 0);
      const rate = totalPossible > 0 ? Math.round((completions.length / totalPossible) * 100) : 0;
      overallEl.textContent = `${rate}%`;
    }
  }

  // Best single day
  if (bestDayEl) {
    const dayCounts = {};
    for (const c of completions) {
      dayCounts[c.date] = (dayCounts[c.date] || 0) + 1;
    }
    const best = Math.max(0, ...Object.values(dayCounts));
    bestDayEl.textContent = best;
  }
}

/**
 * Re-renders the heatmap
 */
export function updateHeatmap() {
  renderHeatmap(getDisplayYear());
}

/**
 * Full re-render of everything
 * @param {{ onToggle: function, onEdit: function, onDelete: function }} handlers
 */
export function renderAll(handlers) {
  renderHabitList(handlers);
  updateStats();
  updateHeatmap();
}

/**
 * Shows the tooltip near a heatmap cell
 * @param {HTMLElement} cell
 * @param {HTMLElement} tooltip
 */
export function showTooltip(cell, tooltip) {
  const textEl = tooltip.querySelector('#tooltip-text') || tooltip;
  const dateStr = cell.dataset.date;
  const level = cell.dataset.level;
  textEl.textContent = `${dateStr} — Level ${level}`;
  tooltip.classList.add('tooltip--visible');

  const rect = cell.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top - 8}px`;
}

/**
 * Hides the tooltip
 * @param {HTMLElement} tooltip
 */
export function hideTooltip(tooltip) {
  tooltip.classList.remove('tooltip--visible');
}
