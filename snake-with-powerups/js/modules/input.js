/**
 * File: input.js
 * Description: Keyboard handler — translates arrow keys to direction vectors with queue and 180° prevention
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const DIRECTION_MAP = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
};

let directionQueue = [];
let currentDirection = { x: 0, y: 0 };
let keydownHandler = null;

/**
 * Initialises the keyboard listener
 * @param {Function} onPause - Callback for pause toggle
 * @param {Function} onStart - Callback for start/restart
 */
export function init(onPause, onStart) {
  keydownHandler = (e) => {
    if (DIRECTION_MAP[e.key]) {
      e.preventDefault();
      const newDir = DIRECTION_MAP[e.key];

      // Reference is last queued direction, or current if queue is empty
      const ref = directionQueue.length > 0
        ? directionQueue[directionQueue.length - 1]
        : currentDirection;

      // Reject 180° reversal
      if (newDir.x + ref.x === 0 && newDir.y + ref.y === 0) return;
      // Reject duplicate
      if (newDir.x === ref.x && newDir.y === ref.y) return;

      // Cap queue at 2 to prevent overflow
      if (directionQueue.length < 2) {
        directionQueue.push(newDir);
      }
    }

    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      onPause();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      onStart();
    }
  };

  document.addEventListener('keydown', keydownHandler);
}

/**
 * Dequeues the next direction from the queue
 * @returns {{ x: number, y: number }}
 */
export function getNextDirection() {
  if (directionQueue.length > 0) {
    return directionQueue.shift();
  }
  return currentDirection;
}

/**
 * Updates the current direction after a move is applied
 * @param {{ x: number, y: number }} dir
 */
export function setCurrentDirection(dir) {
  currentDirection = { ...dir };
}

/** Clears the queue and resets direction */
export function reset() {
  directionQueue = [];
  currentDirection = { x: 0, y: 0 };
}

/** Removes the keydown listener */
export function destroy() {
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }
}
