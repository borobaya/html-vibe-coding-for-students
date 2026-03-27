/**
 * File: habits.js
 * Description: Habit CRUD and completion toggling with in-memory state
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { load, save } from './storage.js';

/** @type {{ habits: Array, completions: Array }} */
let data = { habits: [], completions: [] };

/**
 * Loads persisted data into memory
 */
export function init() {
  data = load();
}

/**
 * Returns all habits
 * @returns {Array<{ id: string, name: string, emoji: string, createdAt: string }>}
 */
export function getAll() {
  return data.habits;
}

/**
 * Returns a habit by its ID
 * @param {string} habitId
 * @returns {object|undefined}
 */
export function getById(habitId) {
  return data.habits.find((h) => h.id === habitId);
}

/**
 * Returns all completions
 * @returns {Array<{ habitId: string, date: string }>}
 */
export function getCompletions() {
  return data.completions;
}

/**
 * Adds a new habit
 * @param {string} name
 * @param {string} emoji
 * @returns {object} The created habit
 */
export function add(name, emoji) {
  const habit = {
    id: crypto.randomUUID(),
    name: name.trim(),
    emoji: emoji || '✅',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  data.habits.push(habit);
  save(data);
  return habit;
}

/**
 * Removes a habit and its completions
 * @param {string} habitId
 */
export function remove(habitId) {
  data.habits = data.habits.filter((h) => h.id !== habitId);
  data.completions = data.completions.filter((c) => c.habitId !== habitId);
  save(data);
}

/**
 * Updates a habit's name/emoji
 * @param {string} habitId
 * @param {{ name?: string, emoji?: string }} updates
 */
export function update(habitId, updates) {
  const habit = getById(habitId);
  if (!habit) return;
  if (updates.name !== undefined) habit.name = updates.name.trim();
  if (updates.emoji !== undefined) habit.emoji = updates.emoji;
  save(data);
}

/**
 * Toggles a habit's completion for a given date
 * @param {string} habitId
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {boolean} Whether the habit is now completed for that date
 */
export function toggleCompletion(habitId, dateStr) {
  const idx = data.completions.findIndex(
    (c) => c.habitId === habitId && c.date === dateStr
  );

  if (idx >= 0) {
    data.completions.splice(idx, 1);
    save(data);
    return false;
  }

  data.completions.push({ habitId, date: dateStr });
  save(data);
  return true;
}

/**
 * Clears all data and re-initialises
 */
export function resetAll() {
  data = { habits: [], completions: [] };
  save(data);
}
