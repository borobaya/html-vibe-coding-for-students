/**
 * File: export.js
 * Description: PNG download functionality for finished memes
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Generates a timestamped filename for the meme download
 * @returns {string}
 */
export function generateFilename() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `meme-${stamp}.png`;
}

/**
 * Triggers a PNG download of the canvas content
 * @param {HTMLCanvasElement} canvasEl
 */
export function downloadMeme(canvasEl) {
  const dataURL = canvasEl.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = generateFilename();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
