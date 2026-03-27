/**
 * File: entity.js
 * Description: Base class for all moving agents
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export class Entity {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} speed
   * @param {number} energy
   */
  constructor(x, y, speed, energy) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = energy;
    this.angle = Math.random() * Math.PI * 2;
    this.alive = true;
  }

  /**
   * Moves in the current direction with edge wrapping.
   * @param {number} dt - Normalised delta time
   * @param {number} canvasW
   * @param {number} canvasH
   */
  move(dt, canvasW, canvasH) {
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    if (this.x < 0) this.x += canvasW;
    if (this.x > canvasW) this.x -= canvasW;
    if (this.y < 0) this.y += canvasH;
    if (this.y > canvasH) this.y -= canvasH;
  }

  /**
   * Subtracts energy each frame. Marks dead if depleted.
   * @param {number} decayRate
   * @param {number} dt
   */
  decay(decayRate, dt) {
    this.energy -= decayRate * dt;
    if (this.energy <= 0) {
      this.energy = 0;
      this.alive = false;
    }
  }

  /**
   * Distance to another entity.
   * @param {Entity} other
   * @returns {number}
   */
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Angle toward another entity.
   * @param {Entity} other
   * @returns {number}
   */
  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }
}
