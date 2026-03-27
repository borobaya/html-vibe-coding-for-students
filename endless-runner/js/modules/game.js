/**
 * File: game.js
 * Description: Game state machine, score tracking, and difficulty curve
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const BASE_SPEED = 300;
const MAX_SPEED = 800;
const SPEED_INCREMENT = 0.3;
const SCORE_PER_FRAME = 0.15;

let state = 'idle';
let score = 0;
let speed = BASE_SPEED;
let frameCount = 0;

export function reset() {
  state = 'running';
  score = 0;
  speed = BASE_SPEED;
  frameCount = 0;
}

/** @param {number} dt - delta time in seconds */
export function update(dt) {
  if (state !== 'running') return;
  frameCount++;
  score += SCORE_PER_FRAME * (speed / BASE_SPEED);
  speed = Math.min(speed + SPEED_INCREMENT, MAX_SPEED);
}

/** @returns {string} Zero-padded 5-digit score */
export function getDisplayScore() {
  return String(Math.floor(score)).padStart(5, '0');
}

/** @returns {number} */
export function getScore() {
  return Math.floor(score);
}

/** @returns {number} Current speed in px/s */
export function getSpeed() {
  return speed;
}

export function setGameOver() {
  state = 'over';
}

/** @returns {boolean} */
export function isRunning() {
  return state === 'running';
}
