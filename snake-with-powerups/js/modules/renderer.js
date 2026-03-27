/**
 * File: renderer.js
 * Description: All canvas 2D rendering — grid, snake, food, power-ups, overlays
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS, CELL_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, cellToPixel } from './grid.js';
import { getPowerupTypes } from './powerups.js';

let ctx = null;
let glowPhase = 0;

/**
 * Initialises the renderer with a canvas element
 * @param {HTMLCanvasElement} canvasElement
 * @returns {CanvasRenderingContext2D}
 */
export function init(canvasElement) {
  ctx = canvasElement.getContext('2d');
  return ctx;
}

/** Fills the canvas with the background colour */
export function clear() {
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/** Draws the subtle grid lines */
export function drawGrid() {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;

  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

/**
 * Draws the snake on the canvas
 * @param {Array<{ x: number, y: number }>} body - Snake segments
 * @param {boolean} hasShield - Whether the snake has an active shield
 */
export function drawSnake(body, hasShield) {
  const pad = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    const { px, py } = cellToPixel(body[i].x, body[i].y);
    const isHead = i === 0;

    ctx.fillStyle = isHead ? '#39ff14' : '#2ecc40';

    const offset = isHead ? pad - 1 : pad;
    const size = CELL_SIZE - offset * 2;

    // Rounded rectangle for each segment
    ctx.beginPath();
    const radius = isHead ? 6 : 4;
    roundRect(ctx, px + offset, py + offset, size, size, radius);
    ctx.fill();

    // Shield glow around head
    if (isHead && hasShield) {
      ctx.save();
      ctx.shadowColor = '#2ecc40';
      ctx.shadowBlur = 10 + Math.sin(glowPhase) * 4;
      ctx.strokeStyle = 'rgba(46, 204, 64, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundRect(ctx, px + offset, py + offset, size, size, radius);
      ctx.stroke();
      ctx.restore();
    }
  }
}

/**
 * Draws food on the canvas
 * @param {{ x: number, y: number, type: string, powerupKind?: string }} food
 */
export function drawFood(food) {
  if (!food) return;

  const { px, py } = cellToPixel(food.x, food.y);
  const cx = px + CELL_SIZE / 2;
  const cy = py + CELL_SIZE / 2;

  if (food.type === 'normal') {
    // Red circle for normal food
    ctx.fillStyle = '#ff4136';
    ctx.beginPath();
    ctx.arc(cx, cy, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Subtle glow
    ctx.save();
    ctx.shadowColor = '#ff4136';
    ctx.shadowBlur = 6 + Math.sin(glowPhase * 2) * 3;
    ctx.beginPath();
    ctx.arc(cx, cy, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (food.type === 'powerup' && food.powerupKind) {
    const types = getPowerupTypes();
    const config = types[food.powerupKind];
    if (config) {
      drawPowerupShape(food.x, food.y, food.powerupKind, config.colour);
    }
  }
}

/**
 * Draws a specific power-up shape at a grid cell
 * @param {number} cellX - Grid column
 * @param {number} cellY - Grid row
 * @param {string} kind - Power-up kind
 * @param {string} colour - Fill colour
 */
export function drawPowerupShape(cellX, cellY, kind, colour) {
  const { px, py } = cellToPixel(cellX, cellY);
  const cx = px + CELL_SIZE / 2;
  const cy = py + CELL_SIZE / 2;
  const r = CELL_SIZE * 0.35;

  ctx.save();
  ctx.shadowColor = colour;
  ctx.shadowBlur = 6 + Math.sin(glowPhase * 2) * 4;
  ctx.fillStyle = colour;
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;

  switch (kind) {
    case 'speed':
      drawLightning(ctx, cx, cy, r);
      break;
    case 'slow':
      drawSnowflake(ctx, cx, cy, r);
      break;
    case 'multiplier':
      drawStar(ctx, cx, cy, r);
      break;
    case 'shield':
      drawShieldIcon(ctx, cx, cy, r);
      break;
    case 'shrink':
      drawArrow(ctx, cx, cy, r);
      break;
  }

  ctx.restore();
}

/**
 * Draws the start screen overlay on canvas
 */
export function drawStartScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = '#39ff14';
  ctx.font = '24px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SNAKE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

  ctx.fillStyle = '#e0e0e0';
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.fillText('with Power-Ups', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText('Press START or ENTER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
}

/**
 * Draws "PAUSED" text on the canvas
 */
export function drawPaused() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = '#ffdc00';
  ctx.font = '20px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  ctx.fillStyle = '#888888';
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillText('Press ESC or P', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
}

/**
 * Updates the glow animation phase — call each frame
 * @param {number} timestamp - Current animation timestamp
 */
export function updateGlow(timestamp) {
  glowPhase = timestamp * 0.003;
}

// --- Shape drawing helpers ---

function drawLightning(c, cx, cy, r) {
  c.beginPath();
  c.moveTo(cx - r * 0.2, cy - r);
  c.lineTo(cx + r * 0.5, cy - r);
  c.lineTo(cx, cy);
  c.lineTo(cx + r * 0.4, cy);
  c.lineTo(cx - r * 0.3, cy + r);
  c.lineTo(cx + r * 0.1, cy + r * 0.1);
  c.lineTo(cx - r * 0.4, cy + r * 0.1);
  c.closePath();
  c.fill();
}

function drawSnowflake(c, cx, cy, r) {
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI) / 3;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;
    const x2 = cx - Math.cos(angle) * r;
    const y2 = cy - Math.sin(angle) * r;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();

    // Small branches
    const branchLen = r * 0.3;
    for (const sign of [1, -1]) {
      const bx = cx + Math.cos(angle) * r * 0.6;
      const by = cy + Math.sin(angle) * r * 0.6;
      const bAngle = angle + sign * Math.PI / 4;
      c.beginPath();
      c.moveTo(bx, by);
      c.lineTo(bx + Math.cos(bAngle) * branchLen, by + Math.sin(bAngle) * branchLen);
      c.stroke();
    }
  }
}

function drawStar(c, cx, cy, r) {
  const spikes = 5;
  const outerRadius = r;
  const innerRadius = r * 0.4;
  c.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
  c.fill();
}

function drawShieldIcon(c, cx, cy, r) {
  // Circle outline
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.stroke();

  // Plus inside
  c.beginPath();
  c.moveTo(cx, cy - r * 0.5);
  c.lineTo(cx, cy + r * 0.5);
  c.moveTo(cx - r * 0.5, cy);
  c.lineTo(cx + r * 0.5, cy);
  c.stroke();
}

function drawArrow(c, cx, cy, r) {
  // Downward chevron / arrow
  c.beginPath();
  c.moveTo(cx - r * 0.6, cy - r * 0.4);
  c.lineTo(cx, cy + r * 0.4);
  c.lineTo(cx + r * 0.6, cy - r * 0.4);
  c.stroke();

  // Vertical line above
  c.beginPath();
  c.moveTo(cx, cy - r * 0.8);
  c.lineTo(cx, cy + r * 0.1);
  c.stroke();
}

/**
 * Helper to draw a rounded rectangle
 * @param {CanvasRenderingContext2D} c
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r - Corner radius
 */
function roundRect(c, x, y, w, h, r) {
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.arcTo(x + w, y, x + w, y + r, r);
  c.lineTo(x + w, y + h - r);
  c.arcTo(x + w, y + h, x + w - r, y + h, r);
  c.lineTo(x + r, y + h);
  c.arcTo(x, y + h, x, y + h - r, r);
  c.lineTo(x, y + r);
  c.arcTo(x, y, x + r, y, r);
}
