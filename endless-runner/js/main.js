/**
 * File: main.js
 * Description: Entry point — event handling, game loop orchestration
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import * as game from './modules/game.js';
import * as player from './modules/player.js';
import * as obstacles from './modules/obstacles.js';
import * as renderer from './modules/renderer.js';
import { getHighScore, setHighScore, isNewHighScore, formatScore } from './modules/storage.js';

// DOM references
const canvas = document.getElementById('game-canvas');
const scoreValueEl = document.getElementById('score-value');
const highScoreValueEl = document.getElementById('high-score-value');
const startScreen = document.getElementById('start-screen');
const startHighScoreEl = document.getElementById('start-high-score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');
const newRecordEl = document.getElementById('new-record');
const restartButton = document.getElementById('restart-button');

let animFrameId = null;
let lastTimestamp = 0;
let highScore = 0;

function init() {
  renderer.init(canvas);
  highScore = getHighScore();
  highScoreValueEl.textContent = formatScore(highScore);
  startHighScoreEl.textContent = formatScore(highScore);

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  restartButton.addEventListener('click', startGame);
}

function startGame() {
  game.reset();
  player.reset();
  obstacles.reset();

  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  newRecordEl.classList.add('hidden');

  lastTimestamp = performance.now();
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (!game.isRunning()) return;

  const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
  lastTimestamp = timestamp;

  game.update(dt);
  player.update(dt);
  obstacles.update(dt, game.getSpeed());

  if (obstacles.checkCollision(player.getHitbox())) {
    endGame();
    return;
  }

  renderer.draw(player, obstacles.getObstacles(), game.getSpeed(), dt);
  scoreValueEl.textContent = game.getDisplayScore();

  animFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  game.setGameOver();
  cancelAnimationFrame(animFrameId);

  const finalScore = game.getScore();
  finalScoreEl.textContent = formatScore(finalScore);
  bestScoreEl.textContent = formatScore(highScore);

  if (isNewHighScore(finalScore, highScore)) {
    highScore = finalScore;
    setHighScore(highScore);
    highScoreValueEl.textContent = formatScore(highScore);
    newRecordEl.classList.remove('hidden');
  }

  bestScoreEl.textContent = formatScore(highScore);
  gameOverScreen.classList.remove('hidden');
  restartButton.focus();
}

function handleKeyDown(e) {
  if (e.key === ' ' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!game.isRunning()) {
      startGame();
    } else {
      player.jump();
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (game.isRunning()) player.duck();
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    player.standUp();
  }
}

function handleClick() {
  if (!game.isRunning()) {
    startGame();
  } else {
    player.jump();
  }
}

function handleTouchStart(e) {
  e.preventDefault();
  handleClick();
}

init();
