/**
 * File: main.js
 * Description: Entry point — initialises simulation loop and wires modules together
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { CONFIG } from './modules/config.js';
import { TrafficLightController } from './modules/traffic-light.js';
import { VehicleManager } from './modules/vehicle.js';
import { PedestrianManager } from './modules/pedestrian.js';
import { render } from './modules/renderer.js';
import { initControls, updateStatusPanel } from './modules/controls.js';

/** @type {CanvasRenderingContext2D} */
let ctx;
let controller;
let vehicleManager;
let pedestrianManager;
let isRunning = false;
let animId = null;
let lastTime = 0;

/** Starts (or resumes) the simulation loop. */
function start() {
  if (isRunning) return;
  isRunning = true;
  lastTime = performance.now();
  animId = requestAnimationFrame(loop);
}

/** Pauses the simulation loop. */
function pause() {
  isRunning = false;
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

/** Resets everything to initial state. */
function resetSimulation() {
  pause();
  controller.reset();
  vehicleManager.reset();
  pedestrianManager.reset();
  render(ctx, controller, vehicleManager, pedestrianManager);
  updateStatus();
}

/** The main animation loop. */
function loop(now) {
  if (!isRunning) return;

  const rawDt = now - lastTime;
  lastTime = now;
  const dt = Math.min(rawDt, 50); // cap at ~20 FPS minimum
  const adjustedDt = dt * CONFIG.simulation.speedMultiplier;

  // Update state machine
  controller.update(adjustedDt);

  // Update vehicles
  vehicleManager.update(
    dt,
    (dir) => controller.getLightState(dir),
    CONFIG.simulation.speedMultiplier
  );

  // Update pedestrians
  pedestrianManager.update(
    dt,
    controller.pedState,
    CONFIG.simulation.speedMultiplier
  );

  // Draw
  render(ctx, controller, vehicleManager, pedestrianManager);

  // Update status panel
  updateStatus();

  animId = requestAnimationFrame(loop);
}

/** Pushes current state to the status panel. */
function updateStatus() {
  updateStatusPanel({
    phase: controller.currentPhase,
    timeRemaining: controller.getPhaseTimeRemaining(),
    nsState: controller.nsState,
    ewState: controller.ewState,
    pedState: controller.pedState,
    vehicleCount: vehicleManager.getCount(),
    pedCount: pedestrianManager.getCount(),
  });
}

/** Initialises the simulation. */
function init() {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;

  canvas.width = CONFIG.canvas.width;
  canvas.height = CONFIG.canvas.height;
  ctx = canvas.getContext('2d');

  controller = new TrafficLightController();
  vehicleManager = new VehicleManager();
  pedestrianManager = new PedestrianManager();

  initControls({
    onStart: start,
    onPause: pause,
    onReset: resetSimulation,
    onPedRequest: () => controller.requestPedestrian(),
  });

  // Initial render
  render(ctx, controller, vehicleManager, pedestrianManager);
  updateStatus();
}

document.addEventListener('DOMContentLoaded', init);
