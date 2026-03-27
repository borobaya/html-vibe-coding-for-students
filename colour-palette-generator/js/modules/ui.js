/**
 * File: ui.js
 * Description: DOM rendering for palette swatches — backgrounds, text, lock icons
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { hslToRgb, rgbToHex, formatRgb, contrastTextColour } from './colour.js';

/**
 * Returns all swatch elements
 * @returns {HTMLElement[]}
 */
export function getSwatchElements() {
  return Array.from(document.querySelectorAll('.swatch'));
}

/**
 * Updates a single swatch's background colour
 * @param {HTMLElement} el
 * @param {string} hex
 */
export function updateSwatchBackground(el, hex) {
  el.style.backgroundColor = hex;
}

/**
 * Updates the hex/rgb text and text colour on a swatch
 * @param {HTMLElement} el
 * @param {string} hex
 * @param {string} rgbString
 * @param {string} textColour
 */
export function updateSwatchText(el, hex, rgbString, textColour) {
  const hexEl = el.querySelector('.swatch__hex');
  const rgbEl = el.querySelector('.swatch__rgb');
  if (hexEl) {
    hexEl.textContent = hex;
    hexEl.style.color = textColour;
  }
  if (rgbEl) {
    rgbEl.textContent = rgbString;
    rgbEl.style.color = textColour;
  }

  // Lock button colour
  const lockBtn = el.querySelector('.swatch__lock');
  if (lockBtn) {
    lockBtn.style.color = textColour;
  }
}

/**
 * Updates the lock button icon and aria state
 * @param {HTMLButtonElement} buttonEl
 * @param {boolean} isLocked
 */
export function updateLockIcon(buttonEl, isLocked) {
  buttonEl.textContent = isLocked ? '🔒' : '🔓';
  buttonEl.setAttribute('aria-pressed', String(isLocked));
  buttonEl.setAttribute('aria-label', isLocked ? 'Unlock swatch' : 'Lock swatch');
}

/**
 * Renders all swatches based on current palette state
 * @param {{ colours: Array<{h:number,s:number,l:number}>, locked: boolean[] }} state
 */
export function renderSwatches(state) {
  const swatches = getSwatchElements();

  state.colours.forEach((hsl, i) => {
    const el = swatches[i];
    if (!el) return;

    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const rgbStr = formatRgb(rgb.r, rgb.g, rgb.b);
    const textClr = contrastTextColour(rgb.r, rgb.g, rgb.b);

    updateSwatchBackground(el, hex);
    updateSwatchText(el, hex, rgbStr, textClr);

    const lockBtn = el.querySelector('.swatch__lock');
    if (lockBtn) {
      updateLockIcon(lockBtn, state.locked[i]);
    }

    el.setAttribute('aria-label', `Swatch ${i + 1}: ${hex}`);
  });
}

/**
 * Attaches click listeners for copy and lock actions on all swatches
 * @param {function} onCopy - (text: string, swatchEl: HTMLElement) => void
 * @param {function} onToggleLock - (index: number) => void
 */
export function attachSwatchListeners(onCopy, onToggleLock) {
  const swatches = getSwatchElements();

  swatches.forEach((el, i) => {
    // Copy hex on click
    const hexEl = el.querySelector('.swatch__hex');
    if (hexEl) {
      hexEl.addEventListener('click', () => onCopy(hexEl.textContent, el));
    }

    // Copy RGB on click
    const rgbEl = el.querySelector('.swatch__rgb');
    if (rgbEl) {
      rgbEl.addEventListener('click', () => onCopy(rgbEl.textContent, el));
    }

    // Lock toggle
    const lockBtn = el.querySelector('.swatch__lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => onToggleLock(i));
    }
  });
}
