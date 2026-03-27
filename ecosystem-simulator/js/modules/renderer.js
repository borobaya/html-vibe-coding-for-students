/**
 * File: renderer.js
 * Description: Draws all entities on the simulation canvas
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { config } from './config.js';

export class Renderer {
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Clears and redraws all entities.
   * @param {import('./simulation.js').Simulation} simulation
   */
  draw(simulation) {
    const { ctx } = this;
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Food — yellow circles
    ctx.fillStyle = '#f5c842';
    for (const food of simulation.foodList) {
      ctx.beginPath();
      ctx.arc(food.x, food.y, config.foodRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Prey — green circles with glow
    for (const prey of simulation.preyList) {
      ctx.fillStyle = 'rgba(67, 181, 129, 0.25)';
      ctx.beginPath();
      ctx.arc(prey.x, prey.y, config.preyRadius + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#43b581';
      ctx.beginPath();
      ctx.arc(prey.x, prey.y, config.preyRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Predators — red circles with glow
    for (const pred of simulation.predatorList) {
      ctx.fillStyle = 'rgba(232, 64, 87, 0.25)';
      ctx.beginPath();
      ctx.arc(pred.x, pred.y, config.predatorRadius + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e84057';
      ctx.beginPath();
      ctx.arc(pred.x, pred.y, config.predatorRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
