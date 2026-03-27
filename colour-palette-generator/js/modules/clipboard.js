/**
 * File: clipboard.js
 * Description: Copy-to-clipboard helper with visual tooltip feedback
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Copies text to the clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Shows a brief "Copied!" tooltip on a swatch element
 * @param {HTMLElement} swatchElement
 */
export function showCopyFeedback(swatchElement) {
  const tooltip = swatchElement.querySelector('.swatch__tooltip');
  if (!tooltip) return;

  tooltip.textContent = 'Copied!';
  tooltip.classList.add('swatch__tooltip--visible');

  setTimeout(() => {
    tooltip.classList.remove('swatch__tooltip--visible');
  }, 1500);
}
