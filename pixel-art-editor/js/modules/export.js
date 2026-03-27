/**
 * File: export.js
 * Description: PNG export via offscreen canvas
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const PIXEL_SCALE = 16;

/**
 * Exports grid data to a PNG blob
 * @param {string[][]} gridData
 * @param {number} gridSize
 * @param {number} pixelScale
 * @returns {Promise<Blob>}
 */
export function exportToPNG(gridData, gridSize, pixelScale = PIXEL_SCALE) {
  const canvas = document.createElement('canvas');
  const size = gridSize * pixelScale;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const colour = gridData[r][c];
      ctx.fillStyle = colour || '#ffffff';
      ctx.fillRect(c * pixelScale, r * pixelScale, pixelScale, pixelScale);
    }
  }

  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
}

/**
 * Triggers download of a blob
 * @param {Blob} blob
 */
export function triggerDownload(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pixel-art.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sets up export button listener
 * @param {function} getGridData
 * @param {function} getGridSize
 */
export function setupExportListener(getGridData, getGridSize) {
  const btn = document.getElementById('btn-export');
  if (btn) {
    btn.addEventListener('click', async () => {
      const blob = await exportToPNG(getGridData(), getGridSize());
      triggerDownload(blob);
    });
  }
}
