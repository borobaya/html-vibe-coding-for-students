/**
 * File: history.js
 * Description: Undo/redo stack management for pixel grid
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const MAX_HISTORY = 50;
const undoStack = [];
const redoStack = [];

/**
 * Deep copies a 2D grid
 * @param {string[][]} grid
 * @returns {string[][]}
 */
export function deepCopyGrid(grid) {
  return grid.map(row => [...row]);
}

/**
 * Saves current state to undo stack
 * @param {string[][]} gridData
 */
export function pushState(gridData) {
  undoStack.push(deepCopyGrid(gridData));
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack.length = 0;
  updateButtons();
}

/**
 * Undo: restores previous state
 * @param {string[][]} currentGrid
 * @returns {string[][]|null}
 */
export function undo(currentGrid) {
  if (undoStack.length === 0) return null;
  redoStack.push(deepCopyGrid(currentGrid));
  const prev = undoStack.pop();
  updateButtons();
  return prev;
}

/**
 * Redo: restores next state
 * @param {string[][]} currentGrid
 * @returns {string[][]|null}
 */
export function redo(currentGrid) {
  if (redoStack.length === 0) return null;
  undoStack.push(deepCopyGrid(currentGrid));
  const next = redoStack.pop();
  updateButtons();
  return next;
}

export function clearHistory() {
  undoStack.length = 0;
  redoStack.length = 0;
  updateButtons();
}

export function updateButtons() {
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  if (undoBtn) undoBtn.disabled = undoStack.length === 0;
  if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}
