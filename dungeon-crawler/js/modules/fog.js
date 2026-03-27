/**
 * File: fog.js
 * Description: Fog of war — visibility radius, reveal, dim edges
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { GRID_COLS, GRID_ROWS, FOG_RADIUS } from './config.js';

// Visibility states: 0 = hidden, 1 = dim (previously seen), 2 = visible
let fogMap = [];

/**
 * Initialises a blank fog map (all hidden)
 */
export function initFog() {
  fogMap = [];
  for (let y = 0; y < GRID_ROWS; y++) {
    fogMap[y] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      fogMap[y][x] = 0;
    }
  }
}

/**
 * Updates fog around the player position
 * @param {number} px - Player x
 * @param {number} py - Player y
 */
export function updateFog(px, py) {
  // Dim all currently visible tiles
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (fogMap[y][x] === 2) {
        fogMap[y][x] = 1;
      }
    }
  }

  // Reveal tiles in radius around player
  for (let dy = -FOG_RADIUS; dy <= FOG_RADIUS; dy++) {
    for (let dx = -FOG_RADIUS; dx <= FOG_RADIUS; dx++) {
      const nx = px + dx;
      const ny = py + dy;
      if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= FOG_RADIUS) {
          fogMap[ny][nx] = 2;
        }
      }
    }
  }
}

/**
 * Gets the visibility of a tile
 * @param {number} x
 * @param {number} y
 * @returns {number} 0=hidden, 1=dim, 2=visible
 */
export function getTileVisibility(x, y) {
  if (y < 0 || y >= GRID_ROWS || x < 0 || x >= GRID_COLS) return 0;
  return fogMap[y][x];
}

/** @returns {number[][]} The full fog map */
export function getFogMap() {
  return fogMap;
}

/**
 * Sets fog map from saved data
 * @param {number[][]} saved
 */
export function setFogMap(saved) {
  fogMap = saved;
}
