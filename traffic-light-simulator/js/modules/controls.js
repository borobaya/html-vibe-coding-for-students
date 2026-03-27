/**
 * File: controls.js
 * Description: Binds UI controls (sliders, buttons) to the simulation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';

/**
 * Initialises UI controls and binds them to config / callbacks.
 * @param {Object} callbacks
 * @param {Function} callbacks.onStart
 * @param {Function} callbacks.onPause
 * @param {Function} callbacks.onReset
 * @param {Function} callbacks.onPedRequest
 */
export function initControls({ onStart, onPause, onReset, onPedRequest }) {
  // Slider bindings
  const sliders = [
    { id: 'green-duration', key: 'greenDuration', section: 'timing', mult: 1000 },
    { id: 'amber-duration', key: 'amberDuration', section: 'timing', mult: 1000 },
    { id: 'all-red-duration', key: 'allRedClearance', section: 'timing', mult: 1000 },
    { id: 'ped-duration', key: 'pedestrianDuration', section: 'timing', mult: 1000 },
    { id: 'spawn-interval', key: 'spawnInterval', section: 'vehicles', mult: 1000 },
    { id: 'sim-speed', key: 'speedMultiplier', section: 'simulation', mult: 1 },
  ];

  for (const binding of sliders) {
    const slider = document.getElementById(binding.id);
    const output = document.getElementById(`${binding.id}-val`);
    if (!slider) continue;

    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      if (output) output.textContent = slider.value;
      CONFIG[binding.section][binding.key] = value * binding.mult;
    });
  }

  // Buttons
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const pedBtn = document.getElementById('ped-btn');

  if (startBtn) startBtn.addEventListener('click', onStart);
  if (pauseBtn) pauseBtn.addEventListener('click', onPause);
  if (resetBtn) resetBtn.addEventListener('click', onReset);
  if (pedBtn) pedBtn.addEventListener('click', onPedRequest);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        onStart();
        break;
      case 'p':
      case 'P':
        onPause();
        break;
      case 'r':
      case 'R':
        onReset();
        break;
    }
  });
}

/**
 * Updates the status panel DOM elements.
 * @param {Object} data
 * @param {string} data.phase
 * @param {number} data.timeRemaining
 * @param {string} data.nsState
 * @param {string} data.ewState
 * @param {string} data.pedState
 * @param {number} data.vehicleCount
 * @param {number} data.pedCount
 */
export function updateStatusPanel(data) {
  const setTextById = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setTextById('phase-display', data.phase.replace(/_/g, ' '));
  setTextById('timer-display', `${data.timeRemaining}s`);
  setTextById('ns-state', data.nsState.toUpperCase());
  setTextById('ew-state', data.ewState.toUpperCase());
  setTextById('ped-state-display', data.pedState === 'walk' ? 'WALK' : 'STOP');
  setTextById('vehicle-count', data.vehicleCount);
  setTextById('ped-count', data.pedCount);

  // Update state colours
  const nsEl = document.getElementById('ns-state');
  const ewEl = document.getElementById('ew-state');
  if (nsEl) nsEl.dataset.state = data.nsState;
  if (ewEl) ewEl.dataset.state = data.ewState;
}
