/**
 * File: simulation.js
 * Description: Entity manager — update, collisions, spawning, cleanup
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { Prey } from './prey.js';
import { Predator } from './predator.js';
import { spawnFood } from './food.js';
import { config } from './config.js';

export class Simulation {
  constructor() {
    this.preyList = [];
    this.predatorList = [];
    this.foodList = [];
    this.foodTimer = 0;
  }

  /** Populate initial entities. */
  init() {
    this.preyList = [];
    this.predatorList = [];
    this.foodList = [];
    this.foodTimer = 0;

    for (let i = 0; i < config.initialPrey; i++) {
      const x = Math.random() * config.canvasWidth;
      const y = Math.random() * config.canvasHeight;
      this.preyList.push(new Prey(x, y));
    }

    for (let i = 0; i < config.initialPredators; i++) {
      const x = Math.random() * config.canvasWidth;
      const y = Math.random() * config.canvasHeight;
      this.predatorList.push(new Predator(x, y));
    }

    this.foodList = spawnFood(40);
  }

  /**
   * Run one simulation tick.
   * @param {number} dt - Normalised delta time (1.0 ≈ 16.67 ms)
   */
  update(dt) {
    // Update prey
    for (const prey of this.preyList) {
      prey.update(dt, this.predatorList, this.foodList);
      prey.tryEat(this.foodList);
    }

    // Update predators
    for (const pred of this.predatorList) {
      pred.update(dt, this.preyList);
      pred.tryEat(this.preyList);
    }

    // Reproduction
    const newPrey = [];
    for (const prey of this.preyList) {
      if (!prey.alive) continue;
      const offspring = prey.tryReproduce();
      if (offspring && this.preyList.length + newPrey.length < config.maxPrey) {
        newPrey.push(offspring);
      }
    }

    const newPredators = [];
    for (const pred of this.predatorList) {
      if (!pred.alive) continue;
      const offspring = pred.tryReproduce();
      if (offspring && this.predatorList.length + newPredators.length < config.maxPredators) {
        newPredators.push(offspring);
      }
    }

    this.preyList.push(...newPrey);
    this.predatorList.push(...newPredators);

    // Spawn food at interval
    this.foodTimer += dt;
    const spawnInterval = 60 / config.foodSpawnRate;
    if (this.foodTimer >= spawnInterval && this.foodList.length < config.maxFood) {
      this.foodList.push(...spawnFood(1));
      this.foodTimer = 0;
    }

    // Cleanup dead entities
    this.preyList = this.preyList.filter((e) => e.alive);
    this.predatorList = this.predatorList.filter((e) => e.alive);
    this.foodList = this.foodList.filter((e) => e.alive);
  }

  /**
   * Returns current population counts.
   * @returns {{ prey: number, predators: number, food: number }}
   */
  getCounts() {
    return {
      prey: this.preyList.length,
      predators: this.predatorList.length,
      food: this.foodList.length,
    };
  }
}
