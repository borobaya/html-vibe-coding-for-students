/**
 * File: presets.js
 * Description: Pattern definitions and stamping for well-known Game of Life patterns
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const PRESETS = {
  blinker: {
    name: 'Blinker',
    cells: [[0, 0], [0, 1], [0, 2]],
  },
  toad: {
    name: 'Toad',
    cells: [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2]],
  },
  beacon: {
    name: 'Beacon',
    cells: [
      [0, 0], [0, 1],
      [1, 0], [1, 1],
      [2, 2], [2, 3],
      [3, 2], [3, 3],
    ],
  },
  glider: {
    name: 'Glider',
    cells: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  },
  lwss: {
    name: 'Lightweight Spaceship',
    cells: [
      [0, 1], [0, 4],
      [1, 0],
      [2, 0], [2, 4],
      [3, 0], [3, 1], [3, 2], [3, 3],
    ],
  },
  pulsar: {
    name: 'Pulsar',
    cells: [
      [0, 2], [0, 3], [0, 4], [0, 8], [0, 9], [0, 10],
      [2, 0], [2, 5], [2, 7], [2, 12],
      [3, 0], [3, 5], [3, 7], [3, 12],
      [4, 0], [4, 5], [4, 7], [4, 12],
      [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10],
      [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10],
      [8, 0], [8, 5], [8, 7], [8, 12],
      [9, 0], [9, 5], [9, 7], [9, 12],
      [10, 0], [10, 5], [10, 7], [10, 12],
      [12, 2], [12, 3], [12, 4], [12, 8], [12, 9], [12, 10],
    ],
  },
  'glider-gun': {
    name: 'Gosper Glider Gun',
    cells: [
      [0, 24],
      [1, 22], [1, 24],
      [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35],
      [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35],
      [4, 0], [4, 1], [4, 10], [4, 16], [4, 20], [4, 21],
      [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17], [5, 22], [5, 24],
      [6, 10], [6, 16], [6, 24],
      [7, 11], [7, 15],
      [8, 12], [8, 13],
    ],
  },
  diehard: {
    name: 'Diehard',
    cells: [[0, 6], [1, 0], [1, 1], [2, 1], [2, 5], [2, 6], [2, 7]],
  },
  acorn: {
    name: 'Acorn',
    cells: [[0, 1], [1, 3], [2, 0], [2, 1], [2, 4], [2, 5], [2, 6]],
  },
};

/**
 * Stamps a pattern onto the grid centred at the given position.
 * @param {object} grid - Grid API
 * @param {string} patternKey - Key into PRESETS
 * @param {number} centerRow
 * @param {number} centerCol
 */
export function stampPattern(grid, patternKey, centerRow, centerCol) {
  const pattern = PRESETS[patternKey];
  if (!pattern) return;

  grid.stampPattern(pattern.cells, centerRow, centerCol);
}
