/**
 * File: main.js
 * Description: Entry point — initialisation, game loop, window resize
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './modules/config.js';
import { createGrid } from './modules/grid.js';
import { createRenderer } from './modules/renderer.js';
import { initInput } from './modules/input.js';
import { initControls } from './modules/controls.js';

/** Application state */
const state = {
  running: false,
  generation: 0,
  speed: CONFIG.speed,
  gridSize: CONFIG.gridSize,
};

let grid;
let renderer;
let controls;
let lastFrameTime = 0;
let animFrameId = null;

/** Sizes the canvas to fit its container. */
function resizeCanvas() {
  const container = document.querySelector('.canvas-container');
  const available = Math.min(
    container.clientWidth - 40,
    container.clientHeight - 40,
    CONFIG.canvasMaxSize,
  );
  renderer.resize(available, state.gridSize);
  renderer.render();
}

/**
 * Game loop using requestAnimationFrame with timing control.
 * @param {number} timestamp - High-res timestamp from rAF
 */
function gameLoop(timestamp) {
  const interval = 1000 / state.speed;
  if (timestamp - lastFrameTime >= interval) {
    const { aliveCount } = grid.step();
    state.generation++;
    controls.updateStats(aliveCount);
    renderer.render();
    lastFrameTime = timestamp;
  }
  animFrameId = requestAnimationFrame(gameLoop);
}

/** Starts the simulation loop. */
function startLoop() {
  if (animFrameId) return;
  state.running = true;
  lastFrameTime = performance.now();
  animFrameId = requestAnimationFrame(gameLoop);
}

/** Stops the simulation loop. */
function stopLoop() {
  state.running = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

/** Updates the stat displays. */
function updateStats(aliveCount) {
  document.getElementById('stat-generation').textContent = state.generation;
  document.getElementById('stat-alive').textContent =
    aliveCount ?? grid.getAliveCount();
}

/** Initialises the entire application. */
function init() {
  const canvas = document.getElementById('game-canvas');

  grid = createGrid(state.gridSize, CONFIG.wrapEdges);
  renderer = createRenderer(canvas, grid, CONFIG);

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  initInput(canvas, grid, renderer, () => updateStats());

  controls = initControls({
    grid,
    renderer,
    getState: () => state,
    setState: (patch) => Object.assign(state, patch),
    startLoop,
    stopLoop,
  });

  renderer.render();
  updateStats();
}

document.addEventListener('DOMContentLoaded', init);
