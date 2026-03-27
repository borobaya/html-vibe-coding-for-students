/**
 * File: snake.js
 * Description: Manages the snake entity — body segments, direction, movement, growth, and collision
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS, wrapPosition } from './grid.js';

let body = [];
let direction = { x: 0, y: 0 };
let growthPending = 0;
let shieldActive = false;

/**
 * Creates a fresh snake at the given grid position
 * @param {number} startX - Head column
 * @param {number} startY - Head row
 * @param {number} length - Number of initial segments
 */
export function createSnake(startX = 10, startY = 10, length = 3) {
  body = [];
  for (let i = 0; i < length; i++) {
    body.push({ x: startX - i, y: startY });
  }
  direction = { x: 0, y: 0 };
  growthPending = 0;
  shieldActive = false;
}

/** @returns {{ x: number, y: number }} Copy of the head segment */
export function getHead() {
  return { ...body[0] };
}

/** @returns {Array<{ x: number, y: number }>} Full body array */
export function getBody() {
  return body;
}

/**
 * Sets direction if valid (not a 180° reversal)
 * @param {{ x: number, y: number }} newDir
 * @returns {boolean} True if the direction was accepted
 */
export function setDirection(newDir) {
  // Prevent reversal — can't go back on yourself
  if (direction.x + newDir.x === 0 && direction.y + newDir.y === 0 && (direction.x !== 0 || direction.y !== 0)) {
    return false;
  }
  direction = { ...newDir };
  return true;
}

/** @returns {{ x: number, y: number }} Current direction vector */
export function getDirection() {
  return { ...direction };
}

/**
 * Advances the snake by one cell in the current direction
 * @param {boolean} wrapMode - If true, coordinates wrap around; otherwise raw position returned
 * @returns {{ x: number, y: number }} New head position
 */
export function move(wrapMode) {
  if (direction.x === 0 && direction.y === 0) {
    return getHead();
  }

  let newHead = {
    x: body[0].x + direction.x,
    y: body[0].y + direction.y,
  };

  if (wrapMode) {
    newHead = wrapPosition(newHead.x, newHead.y);
  }

  body.unshift(newHead);

  if (growthPending > 0) {
    growthPending--;
  } else {
    body.pop();
  }

  return newHead;
}

/**
 * Queue additional segments to grow
 * @param {number} amount - Number of segments to add
 */
export function grow(amount = 1) {
  growthPending += amount;
}

/**
 * Remove segments from the tail
 * @param {number} amount - Segments to remove (min body length = 1)
 */
export function shrink(amount) {
  const removeCount = Math.min(amount, body.length - 1);
  body.splice(body.length - removeCount, removeCount);
}

/**
 * Checks whether the head overlaps any body segment
 * @returns {boolean} True if self-collision detected
 */
export function checkSelfCollision() {
  const head = body[0];
  for (let i = 1; i < body.length; i++) {
    if (body[i].x === head.x && body[i].y === head.y) {
      return true;
    }
  }
  return false;
}

/** @param {boolean} active */
export function setShield(active) {
  shieldActive = active;
}

/** @returns {boolean} */
export function hasActiveShield() {
  return shieldActive;
}

/** Deactivates shield after surviving one collision */
export function consumeShield() {
  shieldActive = false;
}

/** Resets all internal state */
export function reset() {
  body = [];
  direction = { x: 0, y: 0 };
  growthPending = 0;
  shieldActive = false;
}

/** @returns {number} Current body length */
export function getLength() {
  return body.length;
}
