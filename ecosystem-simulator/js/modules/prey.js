/**
 * File: prey.js
 * Description: Prey agent — flees predators, eats food, reproduces
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { Entity } from './entity.js';
import { config } from './config.js';

export class Prey extends Entity {
  /** @param {number} x  @param {number} y */
  constructor(x, y) {
    super(x, y, config.preySpeed, config.startEnergy);
  }

  /**
   * Per-frame AI: flee predators, seek food, or wander.
   * @param {number} dt
   * @param {import('./predator.js').Predator[]} predators
   * @param {import('./food.js').Food[]} foods
   */
  update(dt, predators, foods) {
    const nearest = this.findNearest(predators, config.preyDetectionRadius);

    if (nearest) {
      this.angle = this.angleTo(nearest) + Math.PI;
    } else {
      const nearestFood = this.findNearest(foods, config.preyDetectionRadius);
      if (nearestFood) {
        this.angle = this.angleTo(nearestFood);
      } else {
        this.angle += (Math.random() - 0.5) * config.wanderJitter * 2;
      }
    }

    this.speed = config.preySpeed;
    this.move(dt, config.canvasWidth, config.canvasHeight);
    this.decay(config.energyDecayRate, dt);
  }

  /**
   * Eats food within eating radius.
   * @param {import('./food.js').Food[]} foods
   * @returns {import('./food.js').Food|null}
   */
  tryEat(foods) {
    for (const food of foods) {
      if (!food.alive) continue;
      if (this.distanceTo(food) < config.eatingRadius + config.foodRadius) {
        food.alive = false;
        this.energy += config.preyFoodEnergy;
        return food;
      }
    }
    return null;
  }

  /**
   * Reproduces if energy exceeds threshold.
   * @returns {Prey|null}
   */
  tryReproduce() {
    if (this.energy >= config.reproductionThreshold) {
      this.energy -= config.reproductionCost;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      return new Prey(this.x + offsetX, this.y + offsetY);
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
