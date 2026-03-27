/**
 * File: controls.js
 * Description: Toolbar button, slider, and select event bindings
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { stampPattern } from './presets.js';
import { CONFIG } from './config.js';

/**
 * Initialises all toolbar controls.
 * @param {object} opts
 * @param {object} opts.grid - Grid API
 * @param {object} opts.renderer - Renderer API
 * @param {Function} opts.getState - Returns current state
 * @param {Function} opts.setState - Merges a patch into state
 * @param {Function} opts.startLoop - Starts the game loop
 * @param {Function} opts.stopLoop - Stops the game loop
 */
export function initControls({ grid, renderer, getState, setState, startLoop, stopLoop }) {
  const btnPlay = document.getElementById('btn-play');
  const btnStep = document.getElementById('btn-step');
  const btnClear = document.getElementById('btn-clear');
  const btnRandom = document.getElementById('btn-random');
  const speedSlider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  const gridSizeSelect = document.getElementById('grid-size');
  const presetSelect = document.getElementById('preset-select');
  const statGeneration = document.getElementById('stat-generation');
  const statAlive = document.getElementById('stat-alive');

  function updateStats(aliveCount) {
    const state = getState();
    statGeneration.textContent = state.generation;
    statAlive.textContent = aliveCount ?? grid.getAliveCount();
  }

  // Play / Pause
  btnPlay.addEventListener('click', () => {
    const state = getState();
    if (state.running) {
      stopLoop();
      setState({ running: false });
      btnPlay.textContent = '▶ Play';
      btnPlay.setAttribute('aria-label', 'Play simulation');
    } else {
      startLoop();
      setState({ running: true });
      btnPlay.textContent = '⏸ Pause';
      btnPlay.setAttribute('aria-label', 'Pause simulation');
    }
  });

  // Step
  btnStep.addEventListener('click', () => {
    const state = getState();
    if (state.running) return;
    const { aliveCount } = grid.step();
    setState({ generation: state.generation + 1 });
    renderer.render();
    updateStats(aliveCount);
  });

  // Clear
  btnClear.addEventListener('click', () => {
    const state = getState();
    if (state.running) {
      stopLoop();
      setState({ running: false });
      btnPlay.textContent = '▶ Play';
      btnPlay.setAttribute('aria-label', 'Play simulation');
    }
    grid.clear();
    setState({ generation: 0 });
    renderer.render();
    updateStats(0);
  });

  // Random
  btnRandom.addEventListener('click', () => {
    grid.randomise(CONFIG.randomDensity);
    renderer.render();
    updateStats();
  });

  // Speed slider
  speedSlider.addEventListener('input', () => {
    const speed = parseInt(speedSlider.value, 10);
    setState({ speed });
    speedValue.textContent = `${speed} gen/s`;
  });

  // Grid size
  gridSizeSelect.addEventListener('change', () => {
    const newSize = parseInt(gridSizeSelect.value, 10);
    const state = getState();

    if (state.running) {
      stopLoop();
      setState({ running: false });
      btnPlay.textContent = '▶ Play';
    }

    grid.resize(newSize);
    setState({ gridSize: newSize, generation: 0 });

    const container = document.querySelector('.canvas-container');
    const available = Math.min(
      container.clientWidth - 40,
      container.clientHeight - 40,
      CONFIG.canvasMaxSize,
    );
    renderer.resize(available, newSize);
    renderer.render();
    updateStats();
  });

  // Preset patterns
  presetSelect.addEventListener('change', () => {
    const key = presetSelect.value;
    if (!key) return;

    grid.clear();
    const center = Math.floor(grid.getSize() / 2);
    stampPattern(grid, key, center, center);
    setState({ generation: 0 });
    renderer.render();
    updateStats();
    presetSelect.value = '';
  });

  // Expose updateStats for external use
  return { updateStats };
}
