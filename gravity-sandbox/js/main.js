/**
 * File: main.js
 * Description: Entry point — bootstraps app, owns animation loop and input
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CelestialBody } from './modules/body.js';
import { PhysicsEngine } from './modules/physics.js';
import { Renderer } from './modules/renderer.js';

/* ── Constants ── */
const VELOCITY_SCALE = 0.05;
const MAX_DT = 0.033;

/* ── State ── */
let bodies = [];
let isRunning = true;
let isDragging = false;
let dragStart = null;
let dragEnd = null;
let lastTimestamp = 0;
let frameCount = 0;
let fpsDisplay = 60;
let fpsTimer = 0;

/* ── DOM refs ── */
const canvas = document.getElementById('sim-canvas');
const massSlider = document.getElementById('mass-slider');
const massValue = document.getElementById('mass-value');
const massPreview = document.getElementById('mass-preview');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnReset = document.getElementById('btn-reset');
const infoBodies = document.querySelector('#info-bodies strong');
const infoFps = document.querySelector('#info-fps strong');

/* ── Engine instances ── */
const renderer = new Renderer(canvas);
const physics = new PhysicsEngine();

/* ── Canvas sizing ── */
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

/* ── Coordinate helper ── */
function getCanvasPos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/* ── Input handlers ── */
function handleMouseDown(e) {
  dragStart = getCanvasPos(e);
  dragEnd = { ...dragStart };
  isDragging = true;
}

function handleMouseMove(e) {
  if (!isDragging) return;
  dragEnd = getCanvasPos(e);
}

function handleMouseUp() {
  if (!isDragging || !dragStart || !dragEnd) return;

  const mass = parseInt(massSlider.value, 10);
  const vx = (dragEnd.x - dragStart.x) * VELOCITY_SCALE;
  const vy = (dragEnd.y - dragStart.y) * VELOCITY_SCALE;

  bodies.push(
    new CelestialBody({
      x: dragStart.x,
      y: dragStart.y,
      vx,
      vy,
      mass,
    }),
  );

  isDragging = false;
  dragStart = null;
  dragEnd = null;
  updateInfoBar();
}

/* ── Touch handlers ── */
function handleTouchStart(e) {
  e.preventDefault();
  handleMouseDown(e.touches[0]);
}

function handleTouchMove(e) {
  e.preventDefault();
  handleMouseMove(e.touches[0]);
}

function handleTouchEnd(e) {
  e.preventDefault();
  if (e.changedTouches.length > 0) {
    dragEnd = getCanvasPos(e.changedTouches[0]);
  }
  handleMouseUp();
}

/* ── Controls ── */
function togglePlayPause() {
  isRunning = !isRunning;
  const icon = btnPlayPause.querySelector('.btn__icon');
  const label = btnPlayPause.querySelector('.btn__label');

  if (isRunning) {
    icon.textContent = '⏸';
    label.textContent = 'Pause';
    btnPlayPause.setAttribute('data-state', 'playing');
    btnPlayPause.setAttribute('aria-label', 'Pause simulation');
  } else {
    icon.textContent = '▶';
    label.textContent = 'Play';
    btnPlayPause.setAttribute('data-state', 'paused');
    btnPlayPause.setAttribute('aria-label', 'Play simulation');
  }
}

function reset() {
  bodies = [];
  updateInfoBar();
}

function updateMassPreview() {
  const val = parseInt(massSlider.value, 10);
  massValue.textContent = val;
  massSlider.setAttribute('aria-valuenow', val);

  const size = Math.max(8, Math.sqrt(val) * 3);
  massPreview.style.width = size + 'px';
  massPreview.style.height = size + 'px';
}

function updateInfoBar() {
  infoBodies.textContent = bodies.length;
  infoFps.textContent = fpsDisplay;
}

/* ── Game loop ── */
function loop(timestamp) {
  const rawDt = (timestamp - lastTimestamp) / 1000;
  const dt = Math.min(rawDt, MAX_DT);
  lastTimestamp = timestamp;

  // FPS counter
  frameCount++;
  fpsTimer += rawDt;
  if (fpsTimer >= 1) {
    fpsDisplay = frameCount;
    frameCount = 0;
    fpsTimer = 0;
    updateInfoBar();
  }

  // Physics
  if (isRunning && bodies.length > 0) {
    bodies = physics.update(bodies, dt);
  }

  // Render
  const currentMass = parseInt(massSlider.value, 10);
  renderer.draw(bodies, isDragging ? dragStart : null, isDragging ? dragEnd : null, currentMass);

  requestAnimationFrame(loop);
}

/* ── Init ── */
function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  // Touch
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  // Controls
  btnPlayPause.addEventListener('click', togglePlayPause);
  btnReset.addEventListener('click', reset);
  massSlider.addEventListener('input', updateMassPreview);

  // Initial state
  btnPlayPause.setAttribute('data-state', 'playing');
  updateMassPreview();
  updateInfoBar();

  lastTimestamp = performance.now();
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', init);
