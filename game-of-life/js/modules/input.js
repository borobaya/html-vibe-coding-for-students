/**
 * File: input.js
 * Description: Mouse and touch handlers for drawing and erasing cells
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Initialises mouse and touch input on the canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {object} grid - Grid API
 * @param {object} renderer - Renderer API
 * @param {Function} onDrawCallback - Called after any cell change
 */
export function initInput(canvas, grid, renderer, onDrawCallback) {
  let isDrawing = false;
  let drawMode = null; // 'draw' | 'erase'
  let lastRow = -1;
  let lastCol = -1;

  /**
   * Converts a pointer event to grid coordinates.
   * @param {MouseEvent|Touch} event
   * @returns {{ row: number, col: number }}
   */
  function pixelToGrid(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pixelX = (event.clientX - rect.left) * scaleX;
    const pixelY = (event.clientY - rect.top) * scaleY;
    const size = grid.getSize();
    const col = Math.max(0, Math.min(size - 1, Math.floor(pixelX / renderer.getCellSize())));
    const row = Math.max(0, Math.min(size - 1, Math.floor(pixelY / renderer.getCellSize())));
    return { row, col };
  }

  function handlePointerDown(event) {
    const { row, col } = pixelToGrid(event);
    const currentState = grid.getCell(row, col);

    if (currentState === 1) {
      drawMode = 'erase';
      grid.setCell(row, col, 0);
    } else {
      drawMode = 'draw';
      grid.setCell(row, col, 1);
    }

    isDrawing = true;
    lastRow = row;
    lastCol = col;

    renderer.render();
    onDrawCallback();
  }

  function handlePointerMove(event) {
    const { row, col } = pixelToGrid(event);

    if (isDrawing) {
      if (row !== lastRow || col !== lastCol) {
        grid.setCell(row, col, drawMode === 'draw' ? 1 : 0);
        lastRow = row;
        lastCol = col;
        renderer.render();
        onDrawCallback();
      }
    } else {
      renderer.setHover(row, col);
      renderer.render();
    }
  }

  function handlePointerUp() {
    isDrawing = false;
    drawMode = null;
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handlePointerDown(e);
  });

  canvas.addEventListener('mousemove', (e) => {
    handlePointerMove(e);
  });

  canvas.addEventListener('mouseup', handlePointerUp);

  canvas.addEventListener('mouseleave', () => {
    handlePointerUp();
    renderer.clearHover();
    renderer.render();
  });

  // Touch events
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handlePointerDown(e.touches[0]);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handlePointerMove(e.touches[0]);
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    handlePointerUp();
  }, { passive: false });
}
