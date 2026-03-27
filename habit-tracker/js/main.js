/**
 * File: main.js
 * Description: Entry point — wires events for habit CRUD, modals, heatmap navigation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import * as habits from './modules/habits.js';
import { renderAll, updateStats, updateHeatmap, renderHabitList, showTooltip, hideTooltip } from './modules/ui.js';
import { changeYear } from './modules/heatmap.js';
import { today } from './modules/date-utils.js';

/* ── State ──────────────────────────────────────────── */
let editingHabitId = null;
let deletingHabitId = null;

/* ── Event Handlers ─────────────────────────────────── */
const handlers = {
  onToggle(habitId) {
    habits.toggleCompletion(habitId, today());
    renderAll(handlers);
  },
  onEdit(habitId) {
    editingHabitId = habitId;
    const habit = habits.getById(habitId);
    if (!habit) return;
    const nameInput = document.getElementById('edit-habit-name');
    const emojiInput = document.getElementById('edit-habit-emoji');
    if (nameInput) nameInput.value = habit.name;
    if (emojiInput) emojiInput.value = habit.emoji;
    document.getElementById('modal-edit')?.showModal();
  },
  onDelete(habitId) {
    deletingHabitId = habitId;
    document.getElementById('modal-delete')?.showModal();
  },
};

/* ── Initialisation ─────────────────────────────────── */
function init() {
  habits.init();
  renderAll(handlers);

  // Add habit form
  const addForm = document.getElementById('form-add-habit');
  addForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('input-habit-name');
    const emojiInput = document.getElementById('input-habit-emoji');
    const name = nameInput?.value.trim();
    if (!name) return;
    habits.add(name, emojiInput?.value || '✅');
    nameInput.value = '';
    if (emojiInput) emojiInput.value = '';
    renderAll(handlers);
  });

  // Edit modal
  const editForm = document.getElementById('form-edit-habit');
  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editingHabitId) return;
    const name = document.getElementById('edit-habit-name')?.value.trim();
    const emoji = document.getElementById('edit-habit-emoji')?.value;
    if (name) habits.update(editingHabitId, { name, emoji });
    editingHabitId = null;
    document.getElementById('modal-edit')?.close();
    renderAll(handlers);
  });

  document.getElementById('btn-edit-cancel')?.addEventListener('click', () => {
    editingHabitId = null;
    document.getElementById('modal-edit')?.close();
  });

  // Delete modal
  document.getElementById('btn-delete-confirm')?.addEventListener('click', () => {
    if (deletingHabitId) {
      habits.remove(deletingHabitId);
      deletingHabitId = null;
    }
    document.getElementById('modal-delete')?.close();
    renderAll(handlers);
  });

  document.getElementById('btn-delete-cancel')?.addEventListener('click', () => {
    deletingHabitId = null;
    document.getElementById('modal-delete')?.close();
  });

  // Reset all
  document.getElementById('btn-reset-all')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      habits.resetAll();
      renderAll(handlers);
    }
  });

  // Heatmap year navigation
  document.getElementById('btn-heatmap-prev')?.addEventListener('click', () => {
    changeYear(-1);
  });

  document.getElementById('btn-heatmap-next')?.addEventListener('click', () => {
    changeYear(1);
  });

  // Heatmap tooltip
  const tooltip = document.getElementById('heatmap-tooltip');
  const grid = document.getElementById('heatmap-grid');
  if (grid && tooltip) {
    grid.addEventListener('mouseover', (e) => {
      const cell = e.target.closest('.heatmap__cell');
      if (cell) showTooltip(cell, tooltip);
    });
    grid.addEventListener('mouseout', () => hideTooltip(tooltip));
  }
}

document.addEventListener('DOMContentLoaded', init);
