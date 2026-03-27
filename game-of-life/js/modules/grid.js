/**
 * File: grid.js
 * Description: Cell state arrays, Conway rules, generation stepping
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Creates a grid object backed by Uint8Array double-buffers.
 * @param {number} size - Number of rows and columns
 * @param {boolean} wrap - Whether edges wrap toroidally
 * @returns {object} Grid API
 */
export function createGrid(size, wrap) {
  let gridSize = size;
  let wrapEdges = wrap;
  let current = new Uint8Array(gridSize * gridSize);
  let next = new Uint8Array(gridSize * gridSize);

  /**
   * @param {number} row
   * @param {number} col
   * @returns {0|1}
   */
  function getCell(row, col) {
    return current[row * gridSize + col];
  }

  /**
   * @param {number} row
   * @param {number} col
   * @param {0|1} state
   */
  function setCell(row, col, state) {
    current[row * gridSize + col] = state;
  }

  /**
   * Toggles a cell and returns the new state.
   * @param {number} row
   * @param {number} col
   * @returns {0|1}
   */
  function toggleCell(row, col) {
    const idx = row * gridSize + col;
    current[idx] = current[idx] ? 0 : 1;
    return current[idx];
  }

  /**
   * Counts live Moore neighbours for a cell.
   * @param {number} row
   * @param {number} col
   * @returns {number}
   */
  function countNeighbours(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        let nr = row + dr;
        let nc = col + dc;
        if (wrapEdges) {
          nr = (nr + gridSize) % gridSize;
          nc = (nc + gridSize) % gridSize;
        } else {
          if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue;
        }
        count += current[nr * gridSize + nc];
      }
    }
    return count;
  }

  /**
   * Advances one generation using Conway's rules.
   * @returns {{ aliveCount: number }}
   */
  function step() {
    let aliveCount = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const neighbours = countNeighbours(row, col);
        const idx = row * gridSize + col;
        const alive = current[idx];
        if (alive) {
          next[idx] = (neighbours === 2 || neighbours === 3) ? 1 : 0;
        } else {
          next[idx] = (neighbours === 3) ? 1 : 0;
        }
        aliveCount += next[idx];
      }
    }
    [current, next] = [next, current];
    return { aliveCount };
  }

  /** Kills every cell. */
  function clear() {
    current.fill(0);
    next.fill(0);
  }

  /**
   * Randomly populates the grid.
   * @param {number} density - Probability each cell is alive (0–1)
   */
  function randomise(density) {
    for (let i = 0; i < current.length; i++) {
      current[i] = Math.random() < density ? 1 : 0;
    }
  }

  /**
   * Resizes the grid, preserving cells that fit.
   * @param {number} newSize
   */
  function resize(newSize) {
    const oldCurrent = current;
    const oldSize = gridSize;
    gridSize = newSize;
    current = new Uint8Array(gridSize * gridSize);
    next = new Uint8Array(gridSize * gridSize);

    const copySize = Math.min(oldSize, gridSize);
    for (let r = 0; r < copySize; r++) {
      for (let c = 0; c < copySize; c++) {
        current[r * gridSize + c] = oldCurrent[r * oldSize + c];
      }
    }
  }

  /**
   * Counts all living cells.
   * @returns {number}
   */
  function getAliveCount() {
    let count = 0;
    for (let i = 0; i < current.length; i++) {
      count += current[i];
    }
    return count;
  }

  /** @returns {number} Current grid dimension */
  function getSize() {
    return gridSize;
  }

  /**
   * Stamps a pattern of cells onto the grid.
   * @param {Array<[number, number]>} cells - [row, col] offsets
   * @param {number} centerRow
   * @param {number} centerCol
   */
  function stampPattern(cells, centerRow, centerCol) {
    let maxR = 0;
    let maxC = 0;
    for (const [r, c] of cells) {
      if (r > maxR) maxR = r;
      if (c > maxC) maxC = c;
    }
    const offsetR = centerRow - Math.floor(maxR / 2);
    const offsetC = centerCol - Math.floor(maxC / 2);

    for (const [r, c] of cells) {
      const gr = offsetR + r;
      const gc = offsetC + c;
      if (gr >= 0 && gr < gridSize && gc >= 0 && gc < gridSize) {
        current[gr * gridSize + gc] = 1;
      }
    }
  }

  return {
    getCell,
    setCell,
    toggleCell,
    step,
    clear,
    randomise,
    resize,
    getAliveCount,
    getSize,
    stampPattern,
  };
}
