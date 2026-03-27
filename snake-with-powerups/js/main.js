/**
 * File: main.js
 * Description: Entry point — game loop, state management, UI binding, and module coordination
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS, isOutOfBounds } from './modules/grid.js';
import * as snake from './modules/snake.js';
import * as food from './modules/food.js';
import * as powerups from './modules/powerups.js';
import * as input from './modules/input.js';
import * as renderer from './modules/renderer.js';
import * as storage from './modules/storage.js';

// --- Constants ---
const BASE_INTERVAL = 150;
const SPEED_REDUCTION_PER_5_POINTS = 5;
const MIN_INTERVAL = 80;
const POWERUP_SPAWN_CHANCE = 0.2;

// --- State ---
let gameState = 'idle'; // 'idle' | 'playing' | 'paused' | 'over'
let score = 0;
let highScore = 0;
let baseTickInterval = BASE_INTERVAL;
let currentTickInterval = BASE_INTERVAL;
let lastTickTime = 0;
let animationFrameId = null;
let wallMode = true;
let scoreMultiplier = 1;

// --- DOM References ---
const canvas = document.getElementById('game-canvas');
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const powerupIndicator = document.getElementById('powerup-indicator');
const powerupNameEl = document.getElementById('powerup-name');
const powerupTimerEl = document.getElementById('powerup-timer');
const powerupIconEl = document.getElementById('powerup-icon');
const gameOverOverlay = document.getElementById('game-over-overlay');
const startOverlay = document.getElementById('start-overlay');
const finalScoreEl = document.getElementById('final-score');
const finalHighScoreEl = document.getElementById('final-high-score');

const btnStart = document.getElementById('btn-start');
const btnStartFooter = document.getElementById('btn-start-footer');
const btnPause = document.getElementById('btn-pause');
const btnRestart = document.getElementById('btn-restart');
const btnPlayAgain = document.getElementById('btn-play-again');
const wallModeToggle = document.getElementById('wall-mode-toggle');

// --- Initialisation ---

function init() {
  renderer.init(canvas);
  highScore = storage.getHighScore();
  updateHUD();

  // Draw initial state
  renderer.clear();
  renderer.drawGrid();
  renderer.drawStartScreen();

  // Input module
  input.init(togglePause, handleStartRestart);

  // Button event listeners
  btnStart.addEventListener('click', startGame);
  btnStartFooter.addEventListener('click', startGame);
  btnPause.addEventListener('click', togglePause);
  btnRestart.addEventListener('click', restartGame);
  btnPlayAgain.addEventListener('click', startGame);
  wallModeToggle.addEventListener('change', () => {
    wallMode = wallModeToggle.checked;
  });
}

// --- Game State Management ---

function startGame() {
  score = 0;
  scoreMultiplier = 1;
  baseTickInterval = BASE_INTERVAL;
  currentTickInterval = BASE_INTERVAL;

  snake.createSnake(10, 10, 3);
  food.clearFood();
  powerups.reset();
  input.reset();

  // Spawn first food
  food.spawnFood(snake.getBody());

  gameState = 'playing';
  lastTickTime = performance.now();

  // Hide overlays
  startOverlay.hidden = true;
  gameOverOverlay.hidden = true;
  powerupIndicator.hidden = true;

  // Enable buttons
  btnPause.disabled = false;
  btnRestart.disabled = false;
  btnStartFooter.disabled = true;

  updateHUD();
  canvas.focus();

  // Start game loop
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (gameState === 'playing') {
    pauseGame();
  } else if (gameState === 'paused') {
    resumeGame();
  }
}

function pauseGame() {
  if (gameState !== 'playing') return;
  gameState = 'paused';
  btnPause.textContent = '▶ Resume';
  cancelAnimationFrame(animationFrameId);

  // Draw paused state
  renderer.drawPaused();
}

function resumeGame() {
  if (gameState !== 'paused') return;
  gameState = 'playing';
  btnPause.textContent = '⏸ Pause';
  lastTickTime = performance.now();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameState = 'over';
  cancelAnimationFrame(animationFrameId);

  // Update high score
  storage.setHighScore(score);
  highScore = Math.max(highScore, score);

  // Show game-over overlay
  finalScoreEl.textContent = score;
  finalHighScoreEl.textContent = highScore;
  gameOverOverlay.hidden = false;

  // Reset buttons
  btnPause.disabled = true;
  btnPause.textContent = '⏸ Pause';
  btnStartFooter.disabled = false;

  updateHUD();
}

function restartGame() {
  if (gameState === 'playing' || gameState === 'paused') {
    cancelAnimationFrame(animationFrameId);
  }
  startGame();
}

function handleStartRestart() {
  if (gameState === 'idle' || gameState === 'over') {
    startGame();
  }
}

// --- Game Loop ---

function gameLoop(timestamp) {
  if (gameState !== 'playing') return;

  renderer.updateGlow(timestamp);

  const elapsed = timestamp - lastTickTime;
  if (elapsed >= currentTickInterval) {
    tick(elapsed);
    lastTickTime = timestamp;
  }

  render();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function tick(elapsed) {
  // Process input
  const nextDir = input.getNextDirection();
  if (nextDir.x !== 0 || nextDir.y !== 0) {
    snake.setDirection(nextDir);
    input.setCurrentDirection(nextDir);
  }

  // Move snake
  const wrapEnabled = !wallMode;
  const newHead = snake.move(wrapEnabled);

  // Check wall collision (only in wall mode)
  if (wallMode && isOutOfBounds(newHead.x, newHead.y)) {
    endGame();
    return;
  }

  // Check self-collision
  if (snake.checkSelfCollision()) {
    if (snake.hasActiveShield()) {
      snake.consumeShield();
      // Deactivate shield power-up
      powerups.deactivate(removeEffect);
    } else {
      endGame();
      return;
    }
  }

  // Check food collision
  if (food.isFoodAt(newHead.x, newHead.y)) {
    const currentFood = food.getFood();

    if (currentFood.type === 'powerup') {
      score += 15 * scoreMultiplier;
      // Activate the power-up
      if (powerups.getActive()) {
        powerups.deactivate(removeEffect);
      }
      powerups.activate(currentFood.powerupKind, applyEffect);
    } else {
      score += 10 * scoreMultiplier;
    }

    snake.grow(1);
    food.clearFood();

    // Spawn new food (20% chance of power-up)
    const shouldSpawnPowerup = Math.random() < POWERUP_SPAWN_CHANCE;
    const powerupKind = shouldSpawnPowerup ? powerups.pickRandomPowerup() : null;
    food.spawnFood(snake.getBody(), shouldSpawnPowerup, powerupKind);

    // Recalculate speed based on score
    adjustSpeed();
    updateHUD();
  }

  // Update power-up timer
  if (powerups.getActive()) {
    const expired = powerups.updateTimer(elapsed);
    if (expired) {
      powerups.deactivate(removeEffect);
    }
    updatePowerupHUD();
  }
}

function render() {
  renderer.clear();
  renderer.drawGrid();
  renderer.drawFood(food.getFood());
  renderer.drawSnake(snake.getBody(), snake.hasActiveShield());
}

// --- Power-Up Effect Callbacks ---

function applyEffect(kind) {
  switch (kind) {
    case 'speed':
      currentTickInterval = baseTickInterval * 0.5;
      break;
    case 'slow':
      currentTickInterval = baseTickInterval * 2.0;
      break;
    case 'multiplier':
      scoreMultiplier = 2;
      break;
    case 'shield':
      snake.setShield(true);
      break;
    case 'shrink':
      snake.shrink(3);
      break;
  }
  updatePowerupHUD();
}

function removeEffect(kind) {
  switch (kind) {
    case 'speed':
    case 'slow':
      currentTickInterval = baseTickInterval;
      break;
    case 'multiplier':
      scoreMultiplier = 1;
      break;
    case 'shield':
      snake.setShield(false);
      break;
  }
  powerupIndicator.hidden = true;
  powerupIndicator.classList.remove('hud__powerup--expiring');
}

// --- Speed ---

function adjustSpeed() {
  const reduction = Math.floor(score / 50) * SPEED_REDUCTION_PER_5_POINTS;
  baseTickInterval = Math.max(MIN_INTERVAL, BASE_INTERVAL - reduction);

  // Re-apply power-up speed modifier if active
  const active = powerups.getActive();
  if (active) {
    if (active.kind === 'speed') {
      currentTickInterval = baseTickInterval * 0.5;
    } else if (active.kind === 'slow') {
      currentTickInterval = baseTickInterval * 2.0;
    } else {
      currentTickInterval = baseTickInterval;
    }
  } else {
    currentTickInterval = baseTickInterval;
  }
}

// --- HUD ---

function updateHUD() {
  currentScoreEl.textContent = score;
  highScoreEl.textContent = highScore;
}

function updatePowerupHUD() {
  const active = powerups.getActive();
  if (!active) {
    powerupIndicator.hidden = true;
    powerupIndicator.classList.remove('hud__powerup--expiring');
    return;
  }

  powerupIndicator.hidden = false;
  powerupNameEl.textContent = active.name;
  const secondsLeft = Math.max(0, Math.ceil(active.remainingMs / 1000));
  powerupTimerEl.textContent = `${secondsLeft}s`;

  // Power-up icon colour
  const types = powerups.getPowerupTypes();
  const config = types[active.kind];
  if (config) {
    powerupIconEl.textContent = getIconForKind(active.kind);
    powerupIconEl.style.color = config.colour;
  }

  // Expiring blink
  if (powerups.isExpiringSoon()) {
    powerupIndicator.classList.add('hud__powerup--expiring');
  } else {
    powerupIndicator.classList.remove('hud__powerup--expiring');
  }
}

function getIconForKind(kind) {
  const icons = {
    speed: '⚡',
    slow: '❄',
    multiplier: '★',
    shield: '🛡',
    shrink: '↓',
  };
  return icons[kind] || '?';
}

// --- Start ---
init();
