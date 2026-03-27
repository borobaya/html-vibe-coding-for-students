/**
 * File: controls.js
 * Description: Binds DOM slider inputs to config values
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { config } from './config.js';

/** Slider binding definitions: [inputId, outputId, configKey, parser] */
const BINDINGS = [
  ['slider-prey-speed', 'val-prey-speed', 'preySpeed', parseFloat],
  ['slider-predator-speed', 'val-predator-speed', 'predatorSpeed', parseFloat],
  ['slider-food-rate', 'val-food-rate', 'foodSpawnRate', parseInt],
  ['slider-start-energy', 'val-start-energy', 'startEnergy', parseInt],
  ['slider-repro-threshold', 'val-repro-threshold', 'reproductionThreshold', parseInt],
  ['slider-initial-prey', 'val-initial-prey', 'initialPrey', parseInt],
  ['slider-initial-predators', 'val-initial-predators', 'initialPredators', parseInt],
  ['slider-energy-decay', 'val-energy-decay', 'energyDecayRate', parseFloat],
];

/** Initialise slider bindings — each slider updates config live. */
export function initControls() {
  for (const [inputId, outputId, key, parser] of BINDINGS) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    if (!input || !output) continue;

    input.addEventListener('input', () => {
      const val = parser(input.value);
      config[key] = val;
      output.textContent = input.value;
    });
  }
}

/**
 * Updates the stat display elements.
 * @param {{ prey: number, predators: number, food: number }} counts
 */
export function updateStats(counts) {
  document.getElementById('stat-prey').textContent = counts.prey;
  document.getElementById('stat-predators').textContent = counts.predators;
  document.getElementById('stat-food').textContent = counts.food;
}
