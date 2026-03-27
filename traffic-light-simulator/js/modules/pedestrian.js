/**
 * File: pedestrian.js
 * Description: Pedestrian class and PedestrianManager for crosswalk behaviour
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';

class Pedestrian {
  /**
   * @param {number} x - Starting X
   * @param {number} y - Starting Y
   * @param {number} targetX - Destination X
   * @param {number} targetY - Destination Y
   * @param {'ns'|'ew'} crossing - Which road axis being crossed
   */
  constructor(x, y, targetX, targetY, crossing) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.crossing = crossing;
    this.speed = CONFIG.pedestrians.speed;
    this.radius = CONFIG.pedestrians.radius;
    this.finished = false;
    this.waiting = false;
  }

  /**
   * Moves toward the target.
   * @param {number} dt
   * @param {string} pedState - 'walk' or 'stop'
   * @param {number} speedMultiplier
   */
  update(dt, pedState, speedMultiplier) {
    if (pedState !== 'walk') {
      this.waiting = true;
      return;
    }
    this.waiting = false;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      this.finished = true;
      return;
    }

    const move = this.speed * speedMultiplier * (dt / 16);
    this.x += (dx / dist) * move;
    this.y += (dy / dist) * move;
  }

  /**
   * Draws the pedestrian.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = CONFIG.pedestrians.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    if (this.waiting) {
      ctx.strokeStyle = '#e53935';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

export class PedestrianManager {
  constructor() {
    this.pedestrians = [];
    this.hasSpawnedThisPhase = false;
  }

  /** Resets all pedestrians. */
  reset() {
    this.pedestrians = [];
    this.hasSpawnedThisPhase = false;
  }

  /**
   * Updates all pedestrians.
   * @param {number} dt
   * @param {string} pedState - 'walk' or 'stop'
   * @param {number} speedMultiplier
   */
  update(dt, pedState, speedMultiplier) {
    // Spawn pedestrians when walk phase starts
    if (pedState === 'walk' && !this.hasSpawnedThisPhase) {
      this.spawnPedestrians();
      this.hasSpawnedThisPhase = true;
    }
    if (pedState === 'stop') {
      this.hasSpawnedThisPhase = false;
    }

    for (const ped of this.pedestrians) {
      ped.update(dt, pedState, speedMultiplier);
    }

    this.pedestrians = this.pedestrians.filter((p) => !p.finished);
  }

  /** Spawns pedestrians at each crossing. */
  spawnPedestrians() {
    const roadStart = CONFIG.road.start;
    const roadEnd = CONFIG.road.end;
    const centre = CONFIG.road.centreLine;

    // Each crossing: two directions (side A to side B, and B to A)
    const crossings = [
      // North crosswalk — east-west crossing at top of intersection
      { x1: roadStart - 15, y1: centre - 40, x2: roadEnd + 15, y2: centre - 40, type: 'ew' },
      { x1: roadEnd + 15, y1: centre - 55, x2: roadStart - 15, y2: centre - 55, type: 'ew' },
      // South crosswalk
      { x1: roadStart - 15, y1: centre + 40, x2: roadEnd + 15, y2: centre + 40, type: 'ew' },
      { x1: roadEnd + 15, y1: centre + 55, x2: roadStart - 15, y2: centre + 55, type: 'ew' },
      // West crosswalk — north-south crossing
      { x1: centre - 40, y1: roadStart - 15, x2: centre - 40, y2: roadEnd + 15, type: 'ns' },
      { x1: centre - 55, y1: roadEnd + 15, x2: centre - 55, y2: roadStart - 15, type: 'ns' },
      // East crosswalk
      { x1: centre + 40, y1: roadStart - 15, x2: centre + 40, y2: roadEnd + 15, type: 'ns' },
      { x1: centre + 55, y1: roadEnd + 15, x2: centre + 55, y2: roadStart - 15, type: 'ns' },
    ];

    for (const c of crossings) {
      if (Math.random() < CONFIG.pedestrians.spawnChance) {
        this.pedestrians.push(
          new Pedestrian(c.x1, c.y1, c.x2, c.y2, c.type)
        );
      }
    }
  }

  /**
   * Draws all pedestrians.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    for (const ped of this.pedestrians) {
      ped.draw(ctx);
    }
  }

  /** @returns {number} Current pedestrian count */
  getCount() {
    return this.pedestrians.length;
  }
}
