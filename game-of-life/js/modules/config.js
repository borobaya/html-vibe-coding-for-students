/**
 * File: config.js
 * Description: Default constants and settings for Game of Life
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const CONFIG = {
  /** Number of rows and columns (square grid) */
  gridSize: 50,

  /** Generations per second (1–30) */
  speed: 10,

  /** Canvas maximum pixel size (px) */
  canvasMaxSize: 640,

  /** Minimum cell pixel size before grid size is capped */
  cellMinSize: 4,

  /** Grid line width in pixels */
  gridLineWidth: 0.5,

  /** Whether the grid wraps around edges (toroidal) */
  wrapEdges: true,

  /** Probability a cell is alive when randomising (0–1) */
  randomDensity: 0.3,

  /** Colours (mirror CSS vars for canvas use) */
  colors: {
    alive: '#00e676',
    dead: '#0f0f1a',
    gridLine: '#2a2a3e',
    hover: 'rgba(0, 230, 118, 0.3)',
  },
};
