/**
 * File: map.js
 * Description: Tower Defence grid map — path definition, buildable cells
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

export const TILE_SIZE = 40;
export const GRID_COLS = 20;
export const GRID_ROWS = 15;
export const CANVAS_WIDTH = GRID_COLS * TILE_SIZE;
export const CANVAS_HEIGHT = GRID_ROWS * TILE_SIZE;

// Path waypoints (grid coordinates the enemies follow)
export const PATH = [
  { x: 0, y: 7 }, { x: 4, y: 7 }, { x: 4, y: 3 }, { x: 8, y: 3 },
  { x: 8, y: 11 }, { x: 12, y: 11 }, { x: 12, y: 5 }, { x: 16, y: 5 },
  { x: 16, y: 10 }, { x: 19, y: 10 },
];

// Build a set of path tiles for collision checks
const pathTiles = new Set();

function initPathTiles() {
  for (let i = 0; i < PATH.length - 1; i++) {
    const a = PATH[i];
    const b = PATH[i + 1];
    let x = a.x, y = a.y;
    while (x !== b.x || y !== b.y) {
      pathTiles.add(`${x},${y}`);
      if (x < b.x) x++;
      else if (x > b.x) x--;
      else if (y < b.y) y++;
      else if (y > b.y) y--;
    }
    pathTiles.add(`${b.x},${b.y}`);
  }
}

initPathTiles();

/**
 * Checks if a grid cell is part of the path
 * @param {number} gx
 * @param {number} gy
 * @returns {boolean}
 */
export function isPath(gx, gy) {
  return pathTiles.has(`${gx},${gy}`);
}

/**
 * Checks if a cell is valid for building
 * @param {number} gx
 * @param {number} gy
 * @returns {boolean}
 */
export function isBuildable(gx, gy) {
  return gx >= 0 && gx < GRID_COLS && gy >= 0 && gy < GRID_ROWS && !isPath(gx, gy);
}

/**
 * Converts path waypoints to pixel coordinates for smooth enemy movement
 * @returns {Array<{x: number, y: number}>}
 */
export function getPathPixels() {
  return PATH.map(p => ({
    x: p.x * TILE_SIZE + TILE_SIZE / 2,
    y: p.y * TILE_SIZE + TILE_SIZE / 2,
  }));
}
