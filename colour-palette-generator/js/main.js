/**
 * File: main.js
 * Description: Entry point — wires generation, UI rendering, keyboard and click events
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { generatePalette } from './modules/generator.js';
import { getState, setColours, toggleLock, getLockedIndices, getCurrentColours } from './modules/palette.js';
import { renderSwatches, attachSwatchListeners, updateLockIcon } from './modules/ui.js';
import { copyToClipboard, showCopyFeedback } from './modules/clipboard.js';

/* ── DOM References ─────────────────────────────────── */
const harmonySelect = document.getElementById('harmony-mode');
const generateBtn = document.getElementById('generate-btn');

/* ── Core Logic ─────────────────────────────────────── */

/** Generates a new palette and renders it */
function handleGenerate() {
  const mode = harmonySelect.value;
  const locked = getLockedIndices();
  const current = getCurrentColours();
  const newColours = generatePalette(mode, locked, current);

  setColours(newColours);
  renderSwatches(getState());
}

/**
 * Handles spacebar to generate
 * @param {KeyboardEvent} event
 */
function handleKeydown(event) {
  // Don't trigger if user is typing in an input/select
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

  if (event.code === 'Space') {
    event.preventDefault();
    handleGenerate();
  }
}

/**
 * Handles copy click on hex/rgb text
 * @param {string} text
 * @param {HTMLElement} swatchEl
 */
async function handleCopy(text, swatchEl) {
  await copyToClipboard(text);
  showCopyFeedback(swatchEl);
}

/**
 * Handles lock toggle
 * @param {number} index
 */
function handleToggleLock(index) {
  const isNowLocked = toggleLock(index);
  const swatches = document.querySelectorAll('.swatch');
  const lockBtn = swatches[index]?.querySelector('.swatch__lock');
  if (lockBtn) {
    updateLockIcon(lockBtn, isNowLocked);
  }
}

/** Initialises the app */
function init() {
  generateBtn.addEventListener('click', handleGenerate);
  document.addEventListener('keydown', handleKeydown);
  attachSwatchListeners(handleCopy, handleToggleLock);

  // Generate initial palette
  handleGenerate();
}

init();
