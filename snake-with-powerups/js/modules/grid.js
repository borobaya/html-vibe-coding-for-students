/**
 * File: grid.js
 * Description: Central source of truth for grid dimensions and boundary helpers
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

export const COLS = 20;
export const ROWS = 20;
export const CELL_SIZE = 30;
export const CANVAS_WIDTH = COLS * CELL_SIZE;
export const CANVAS_HEIGHT = ROWS * CELL_SIZE;

/**
 * Checks if a grid position is outside the board boundaries
 * @param {number} x - Column index
 * @param {number} y - Row index
 * @returns {boolean} True if the position is out of bounds
 */
export function isOutOfBounds(x, y) {
  return x < 0 || x >= COLS || y < 0 || y >= ROWS;
}

/**
 * Wraps coordinates so the snake re-enters from the opposite edge
 * @param {number} x - Column index
 * @param {number} y - Row index
 * @returns {{ x: number, y: number }} Wrapped grid position
 */
export function wrapPosition(x, y) {
  return {
    x: ((x % COLS) + COLS) % COLS,
    y: ((y % ROWS) + ROWS) % ROWS,
  };
}

/**
 * Converts grid coordinates to top-left pixel position
 * @param {number} cellX - Column index
 * @param {number} cellY - Row index
 * @returns {{ px: number, py: number }} Pixel coordinates
 */
export function cellToPixel(cellX, cellY) {
  return { px: cellX * CELL_SIZE, py: cellY * CELL_SIZE };
}
