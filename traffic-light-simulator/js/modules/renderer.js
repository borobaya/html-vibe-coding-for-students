/**
 * File: renderer.js
 * Description: Composes all drawing layers to the canvas each frame
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './config.js';
import { drawIntersection } from './intersection.js';

/**
 * Renders a single frame.
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./traffic-light.js').TrafficLightController} controller
 * @param {import('./vehicle.js').VehicleManager} vehicleManager
 * @param {import('./pedestrian.js').PedestrianManager} pedestrianManager
 */
export function render(ctx, controller, vehicleManager, pedestrianManager) {
  // Clear
  ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

  // Layer 1: Intersection (roads, markings, crossings)
  drawIntersection(ctx);

  // Layer 2: Pedestrians (under vehicles)
  pedestrianManager.draw(ctx);

  // Layer 3: Vehicles
  vehicleManager.draw(ctx);

  // Layer 4: Traffic lights (on top)
  controller.drawLights(ctx);

  // Layer 5: Pedestrian signals
  controller.drawPedSignals(ctx);
}
