/**
 * File: predator.js
 * Description: Predator agent — chases prey, eats prey, reproduces
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { Entity } from './entity.js';
import { config } from './config.js';

export class Predator extends Entity {
  /** @param {number} x  @param {number} y */
  constructor(x, y) {
    super(x, y, config.predatorSpeed, config.startEnergy);
  }

  /**
   * Per-frame AI: chase nearest prey or wander.
   * @param {number} dt
   * @param {import('./prey.js').Prey[]} prey
   */
  update(dt, prey) {
    const target = this.findNearest(prey, config.predatorDetectionRadius);

    if (target) {
      this.angle = this.angleTo(target);
    } else {
      this.angle += (Math.random() - 0.5) * config.wanderJitter * 2;
    }

    this.speed = config.predatorSpeed;
    this.move(dt, config.canvasWidth, config.canvasHeight);
    this.decay(config.energyDecayRate * 1.2, dt);
  }

  /**
   * Eats prey within eating radius.
   * @param {import('./prey.js').Prey[]} prey
   * @returns {import('./prey.js').Prey|null}
   */
  tryEat(prey) {
    for (const p of prey) {
      if (!p.alive) continue;
      if (this.distanceTo(p) < config.eatingRadius + config.preyRadius) {
        p.alive = false;
        this.energy += config.predatorKillEnergy;
        return p;
      }
    }
    return null;
  }

  /**
   * Reproduces if energy exceeds threshold.
   * @returns {Predator|null}
   */
  tryReproduce() {
    if (this.energy >= config.reproductionThreshold) {
      this.energy -= config.reproductionCost;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      return new Predator(this.x + offsetX, this.y + offsetY);
    }
    return null;
  }

  /**
   * Finds nearest alive entity within radius.
   * @param {Entity[]} entities
   * @param {number} radius
   * @returns {Entity|null}
   */
  findNearest(entities, radius) {
    let closest = null;
    let closestDist = radius;
    for (const e of entities) {
      if (!e.alive) continue;
      const d = this.distanceTo(e);
      if (d < closestDist) {
        closestDist = d;
        closest = e;
      }
    }
    return closest;
  }
}
