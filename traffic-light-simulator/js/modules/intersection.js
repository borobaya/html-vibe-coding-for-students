/**
 * File: intersection.js
 * Description: Draws roads, lane markings, crossings, sidewalks, and islands
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';

/**
 * Draws the complete intersection on the canvas.
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawIntersection(ctx) {
  const W = CONFIG.canvas.width;
  const H = CONFIG.canvas.height;
  const { start, end } = CONFIG.road;

  // 1. Grass background
  ctx.fillStyle = '#4a8c3f';
  ctx.fillRect(0, 0, W, H);

  // 2. Road surfaces
  ctx.fillStyle = '#3a3a3a';
  // Vertical road
  ctx.fillRect(start, 0, end - start, H);
  // Horizontal road
  ctx.fillRect(0, start, W, end - start);

  // 3. Centre median lines (dashed yellow)
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);

  // Vertical median
  ctx.beginPath();
  ctx.moveTo(350, 0);
  ctx.lineTo(350, start);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, end);
  ctx.lineTo(350, H);
  ctx.stroke();

  // Horizontal median
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.lineTo(start, 350);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(end, 350);
  ctx.lineTo(W, 350);
  ctx.stroke();

  ctx.setLineDash([]);

  // 4. Stop lines (solid white, 3px)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  // North stop
  ctx.beginPath();
  ctx.moveTo(start, 245);
  ctx.lineTo(end, 245);
  ctx.stroke();

  // South stop
  ctx.beginPath();
  ctx.moveTo(start, 455);
  ctx.lineTo(end, 455);
  ctx.stroke();

  // West stop
  ctx.beginPath();
  ctx.moveTo(245, start);
  ctx.lineTo(245, end);
  ctx.stroke();

  // East stop
  ctx.beginPath();
  ctx.moveTo(455, start);
  ctx.lineTo(455, end);
  ctx.stroke();

  // 5. Pedestrian crossings (zebra stripes)
  ctx.fillStyle = '#ffffff';
  const stripeW = CONFIG.crossings.stripeWidth;
  const gap = CONFIG.crossings.stripeGap;

  // North crossing (y: 232→248)
  for (let x = start; x < end; x += stripeW + gap) {
    ctx.fillRect(x, 232, stripeW, 16);
  }

  // South crossing (y: 452→468)
  for (let x = start; x < end; x += stripeW + gap) {
    ctx.fillRect(x, 452, stripeW, 16);
  }

  // West crossing (x: 232→248)
  for (let y = start; y < end; y += stripeW + gap) {
    ctx.fillRect(232, y, 16, stripeW);
  }

  // East crossing (x: 452→468)
  for (let y = start; y < end; y += stripeW + gap) {
    ctx.fillRect(452, y, 16, stripeW);
  }
}
