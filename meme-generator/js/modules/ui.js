/**
 * File: ui.js
 * Description: DOM visibility toggling for upload/canvas sections
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Shows the canvas section and hides the upload zone
 * @param {HTMLElement} uploadEl
 * @param {HTMLElement} canvasEl
 */
export function showCanvas(uploadEl, canvasEl) {
  uploadEl.classList.add('upload-zone--hidden');
  canvasEl.classList.remove('canvas-section--hidden');
}

/**
 * Hides the canvas section and shows the upload zone
 * @param {HTMLElement} uploadEl
 * @param {HTMLElement} canvasEl
 */
export function hideCanvas(uploadEl, canvasEl) {
  uploadEl.classList.remove('upload-zone--hidden');
  canvasEl.classList.add('canvas-section--hidden');
}

/**
 * Enables the download button
 * @param {HTMLButtonElement} btn
 */
export function enableControls(btn) {
  btn.disabled = false;
}

/**
 * Disables the download button
 * @param {HTMLButtonElement} btn
 */
export function disableControls(btn) {
  btn.disabled = true;
}

/**
 * Resets state back to upload view
 * @param {HTMLElement} uploadEl
 * @param {HTMLElement} canvasEl
 * @param {HTMLButtonElement} downloadBtn
 * @param {HTMLInputElement} fileInput
 */
export function resetToUpload(uploadEl, canvasEl, downloadBtn, fileInput) {
  hideCanvas(uploadEl, canvasEl);
  disableControls(downloadBtn);
  fileInput.value = '';
}
