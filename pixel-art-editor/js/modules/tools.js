/**
 * File: tools.js
 * Description: Drawing tool implementations
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

let activeTool = 'pencil';

export function getActiveTool() { return activeTool; }

export function setActiveTool(tool) {
  activeTool = tool;
  document.querySelectorAll('.tool-btn').forEach(btn => {
    const isActive = btn.dataset.tool === tool;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Applies the active tool at the given cell
 * @param {number} row
 * @param {number} col
 * @param {string} colour - current colour
 * @param {Object} canvasAPI - { setPixel, getPixel, getGridSize, getGridData }
 * @returns {string|null} colour picked by eyedropper, or null
 */
export function applyTool(row, col, colour, canvasAPI) {
  switch (activeTool) {
    case 'pencil':
      canvasAPI.setPixel(row, col, colour);
      return null;
    case 'eraser':
      canvasAPI.setPixel(row, col, '');
      return null;
    case 'fill':
      floodFill(row, col, colour, canvasAPI);
      return null;
    case 'picker': {
      const picked = canvasAPI.getPixel(row, col);
      return picked || '#000000';
    }
    default:
      return null;
  }
}

/**
 * BFS flood fill
 * @param {number} startRow
 * @param {number} startCol
 * @param {string} fillColour
 * @param {Object} canvasAPI
 */
function floodFill(startRow, startCol, fillColour, canvasAPI) {
  const size = canvasAPI.getGridSize();
  const targetColour = canvasAPI.getPixel(startRow, startCol);
  if (targetColour === fillColour) return;

  const visited = new Set();
  const queue = [[startRow, startCol]];

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= size || c < 0 || c >= size) continue;
    if (canvasAPI.getPixel(r, c) !== targetColour) continue;

    visited.add(key);
    canvasAPI.setPixel(r, c, fillColour);

    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
}

export function setupToolListeners() {
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
  });
}
