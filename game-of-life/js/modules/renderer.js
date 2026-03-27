/**
 * File: renderer.js
 * Description: Canvas drawing — cells, grid lines, hover preview
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Creates a renderer bound to a canvas and grid.
 * @param {HTMLCanvasElement} canvas
 * @param {object} grid - Grid API from grid.js
 * @param {object} config - CONFIG object
 * @returns {object} Renderer API
 */
export function createRenderer(canvas, grid, config) {
  const ctx = canvas.getContext('2d');
  let canvasSize = config.canvasMaxSize;
  let cellSize = canvasSize / grid.getSize();
  let hoverRow = -1;
  let hoverCol = -1;

  /**
   * Resizes the canvas pixel buffer and recalculates cell size.
   * @param {number} newCanvasSize - New pixel dimension
   * @param {number} gridSize - Current grid dimension
   */
  function resize(newCanvasSize, gridSize) {
    canvasSize = newCanvasSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';
    cellSize = canvasSize / gridSize;
  }

  /** Draws the full grid to the canvas. */
  function render() {
    const size = grid.getSize();
    cellSize = canvasSize / size;

    // Dead-cell background
    ctx.fillStyle = config.colors.dead;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Alive cells
    ctx.fillStyle = config.colors.alive;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid.getCell(row, col)) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = config.colors.gridLine;
    ctx.lineWidth = config.gridLineWidth;
    ctx.beginPath();
    for (let i = 0; i <= size; i++) {
      const pos = i * cellSize;
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvasSize);
      ctx.moveTo(0, pos);
      ctx.lineTo(canvasSize, pos);
    }
    ctx.stroke();

    // Hover highlight
    if (hoverRow >= 0 && hoverCol >= 0) {
      ctx.fillStyle = config.colors.hover;
      ctx.fillRect(hoverCol * cellSize, hoverRow * cellSize, cellSize, cellSize);
    }
  }

  /**
   * Sets the hover cell position.
   * @param {number} row
   * @param {number} col
   */
  function setHover(row, col) {
    hoverRow = row;
    hoverCol = col;
  }

  /** Clears the hover highlight. */
  function clearHover() {
    hoverRow = -1;
    hoverCol = -1;
  }

  /** @returns {number} Current cell size in pixels */
  function getCellSize() {
    return cellSize;
  }

  return { render, resize, setHover, clearHover, getCellSize };
}
