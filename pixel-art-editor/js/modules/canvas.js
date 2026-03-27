/**
 * File: canvas.js
 * Description: Grid generation, pixel DOM management, pointer events
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { pushState, deepCopyGrid } from './history.js';

let gridSize = 16;
let gridData = [];
let containerEl = null;
let cellActionCallback = null;
let isDrawing = false;

/**
 * Initialises the pixel canvas
 * @param {number} size
 */
export function initCanvas(size = 16) {
  gridSize = size;
  containerEl = document.getElementById('pixel-canvas');
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  renderGrid();
}

/** Renders the grid DOM */
export function renderGrid() {
  containerEl.innerHTML = '';
  containerEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'pixel';
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (gridData[r][c]) {
        cell.style.backgroundColor = gridData[r][c];
      }
      containerEl.appendChild(cell);
    }
  }
}

export function setPixel(row, col, colour) {
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
  gridData[row][col] = colour;
  const idx = row * gridSize + col;
  const cell = containerEl.children[idx];
  if (cell) cell.style.backgroundColor = colour || '';
}

export function getPixel(row, col) {
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return '';
  return gridData[row][col];
}

export function getGridData() { return gridData; }
export function getGridSize() { return gridSize; }

export function setGridData(data) {
  gridData = data;
  gridSize = data.length;
  renderGrid();
}

export function clearCanvas() {
  pushState(gridData);
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  renderGrid();
}

export function resizeCanvas(newSize) {
  gridSize = newSize;
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  renderGrid();
}

export function getCellFromEvent(e) {
  const cell = e.target.closest('.pixel');
  if (!cell) return null;
  return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
}

/**
 * Sets up pointer events for drawing
 * @param {function} onCellAction - (row, col)
 */
export function setupCanvasListeners(onCellAction) {
  cellActionCallback = onCellAction;

  containerEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDrawing = true;
    pushState(gridData);
    const cell = getCellFromEvent(e);
    if (cell) cellActionCallback(cell.row, cell.col);
  });

  containerEl.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const cell = getCellFromEvent(e);
    if (cell) cellActionCallback(cell.row, cell.col);
  });

  document.addEventListener('pointerup', () => { isDrawing = false; });
}
