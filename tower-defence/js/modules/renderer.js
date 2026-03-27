/**
 * File: renderer.js
 * Description: Canvas 2D rendering for tower defence game
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS, TILE_SIZE, isPath } from './map.js';

const BG_COLOUR     = '#3D4F2F';
const PATH_COLOUR   = '#C4A35A';
const GRID_COLOUR   = 'rgba(0,0,0,0.1)';
const HP_BG         = '#555';
const HP_FILL       = '#E74C3C';

/**
 * Main render function – draws one frame
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} state - game state
 * @param {Object|null} selectedTurret
 * @param {string|null} buildType - currently selected build type
 * @param {{gx:number,gy:number}|null} hoverCell
 */
export function render(ctx, state, selectedTurret, buildType, hoverCell) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawGrid(ctx);
  drawTurrets(ctx, state.turrets, selectedTurret);
  drawEnemies(ctx, state.enemies);
  drawProjectiles(ctx, state.projectiles);
  if (buildType && hoverCell) drawBuildPreview(ctx, hoverCell, buildType);
  if (selectedTurret) drawRangeCircle(ctx, selectedTurret);
}

function drawGrid(ctx) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.fillStyle = isPath(x, y) ? PATH_COLOUR : BG_COLOUR;
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = GRID_COLOUR;
      ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawTurrets(ctx, turrets, selectedTurret) {
  for (const t of turrets) {
    const isSelected = selectedTurret && selectedTurret.id === t.id;

    ctx.fillStyle = t.colour;
    ctx.beginPath();
    ctx.arc(t.x, t.y, TILE_SIZE * 0.35, 0, Math.PI * 2);
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = '#F1C40F';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // Level indicator
    if (t.level > 1) {
      ctx.fillStyle = '#FFF';
      ctx.font = '10px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`L${t.level}`, t.x, t.y + 4);
    }
  }
}

function drawEnemies(ctx, enemies) {
  for (const e of enemies) {
    if (!e.alive || e.reachedEnd) continue;

    // Body
    ctx.fillStyle = e.colour;
    ctx.fillRect(e.x - 10, e.y - 10, 20, 20);

    // HP bar
    const barW = 22;
    const barH = 4;
    const bx = e.x - barW / 2;
    const by = e.y - 16;
    const hpRatio = e.hp / e.maxHp;

    ctx.fillStyle = HP_BG;
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = hpRatio > 0.5 ? '#2ECC71' : hpRatio > 0.25 ? '#F39C12' : HP_FILL;
    ctx.fillRect(bx, by, barW * hpRatio, barH);

    // Slow indicator
    if (e.slowTimer > 0) {
      ctx.strokeStyle = '#85C1E9';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - 11, e.y - 11, 22, 22);
      ctx.lineWidth = 1;
    }
  }
}

function drawProjectiles(ctx, projectiles) {
  for (const p of projectiles) {
    if (!p.alive) continue;
    ctx.fillStyle = p.colour;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBuildPreview(ctx, cell, buildType) {
  ctx.fillStyle = 'rgba(39, 174, 96, 0.3)';
  ctx.fillRect(cell.gx * TILE_SIZE, cell.gy * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawRangeCircle(ctx, turret) {
  ctx.strokeStyle = 'rgba(241, 196, 15, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(turret.x, turret.y, turret.range, 0, Math.PI * 2);
  ctx.stroke();
}
