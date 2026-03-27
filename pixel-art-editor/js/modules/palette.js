/**
 * File: palette.js
 * Description: Colour state, preset swatches, recent colours
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const PRESET_COLOURS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#0088ff', '#88ff00',
  '#ff0088', '#888888', '#cccccc', '#884400',
];

const MAX_RECENT = 8;
let currentColour = '#000000';
const recentColours = [];
let onColourChangeCallback = null;

export function getCurrentColour() { return currentColour; }

export function setCurrentColour(hex) {
  currentColour = hex;
  const preview = document.getElementById('current-colour-preview');
  if (preview) preview.style.backgroundColor = hex;
  const input = document.getElementById('colour-input');
  if (input) input.value = hex;
}

export function addRecentColour(hex) {
  if (!hex || hex === '') return;
  const idx = recentColours.indexOf(hex);
  if (idx !== -1) recentColours.splice(idx, 1);
  recentColours.unshift(hex);
  if (recentColours.length > MAX_RECENT) recentColours.pop();
  renderRecentColours();
}

export function renderPresetSwatches() {
  const container = document.getElementById('palette-swatches');
  if (!container) return;
  container.innerHTML = '';
  for (const hex of PRESET_COLOURS) {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = hex;
    swatch.setAttribute('role', 'listitem');
    swatch.setAttribute('tabindex', '0');
    swatch.setAttribute('aria-label', `Colour ${hex}`);
    swatch.addEventListener('click', () => {
      setCurrentColour(hex);
      if (onColourChangeCallback) onColourChangeCallback(hex);
    });
    container.appendChild(swatch);
  }
}

export function renderRecentColours() {
  const container = document.getElementById('recent-colours');
  if (!container) return;
  container.innerHTML = '';
  for (const hex of recentColours) {
    const swatch = document.createElement('div');
    swatch.className = 'swatch swatch--recent';
    swatch.style.backgroundColor = hex;
    swatch.setAttribute('role', 'listitem');
    swatch.addEventListener('click', () => {
      setCurrentColour(hex);
      if (onColourChangeCallback) onColourChangeCallback(hex);
    });
    container.appendChild(swatch);
  }
}

/**
 * Sets up colour input listener
 * @param {function} onColourChange
 */
export function setupPaletteListeners(onColourChange) {
  onColourChangeCallback = onColourChange;
  const input = document.getElementById('colour-input');
  if (input) {
    input.addEventListener('input', (e) => {
      setCurrentColour(e.target.value);
      if (onColourChange) onColourChange(e.target.value);
    });
  }
}
