/**
 * File: food.js
 * Description: Handles food spawning, placement, and collision detection
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS } from './grid.js';

let currentFood = null;

/**
 * Finds a random empty cell that is not in the occupied set
 * @param {Array<{ x: number, y: number }>} occupiedCells - Cells to avoid
 * @returns {{ x: number, y: number }} Random empty grid position
 */
export function getRandomEmptyCell(occupiedCells) {
  const occupied = new Set(occupiedCells.map(c => `${c.x},${c.y}`));
  const totalCells = COLS * ROWS;

  // If nearly full, collect all empties and pick one
  if (occupied.size > totalCells * 0.8) {
    const empties = [];
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (!occupied.has(`${x},${y}`)) {
          empties.push({ x, y });
        }
      }
    }
    if (empties.length === 0) return null;
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // Otherwise, retry random positions
  for (let attempt = 0; attempt < 100; attempt++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!occupied.has(`${x},${y}`)) {
      return { x, y };
    }
  }
  return null;
}

/**
 * Spawns food at a random empty position
 * @param {Array<{ x: number, y: number }>} occupiedCells - Cells to avoid
 * @param {boolean} spawnPowerup - Whether this food should be a power-up
 * @param {string} [powerupKind] - Specific power-up kind if spawning a power-up
 * @returns {{ x: number, y: number, type: string, powerupKind?: string } | null}
 */
export function spawnFood(occupiedCells, spawnPowerup = false, powerupKind = null) {
  const cell = getRandomEmptyCell(occupiedCells);
  if (!cell) return null;

  if (spawnPowerup && powerupKind) {
    currentFood = { x: cell.x, y: cell.y, type: 'powerup', powerupKind };
  } else {
    currentFood = { x: cell.x, y: cell.y, type: 'normal' };
  }
  return currentFood;
}

/** @returns {{ x: number, y: number, type: string, powerupKind?: string } | null} */
export function getFood() {
  return currentFood;
}

/** Clears the current food */
export function clearFood() {
  currentFood = null;
}

/**
 * Checks if food is at the given position
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isFoodAt(x, y) {
  return currentFood !== null && currentFood.x === x && currentFood.y === y;
}
