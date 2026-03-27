/**
 * File: food.js
 * Description: Food (plant) entity and spawning logic
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { config } from './config.js';

export class Food {
  /** @param {number} x  @param {number} y */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
  }
}

/**
 * Spawns food at random canvas positions.
 * @param {number} count
 * @returns {Food[]}
 */
export function spawnFood(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * config.canvasWidth;
    const y = Math.random() * config.canvasHeight;
    items.push(new Food(x, y));
  }
  return items;
}
