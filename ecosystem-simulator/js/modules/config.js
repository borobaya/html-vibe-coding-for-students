/**
 * File: config.js
 * Description: Default parameter values and limits for the ecosystem
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const config = {
  // Canvas
  canvasWidth: 800,
  canvasHeight: 500,
  graphWidth: 900,
  graphHeight: 200,

  // Initial populations
  initialPrey: 30,
  initialPredators: 5,

  // Movement
  preySpeed: 2.0,
  predatorSpeed: 2.5,

  // Energy
  startEnergy: 100,
  energyDecayRate: 0.3,
  preyFoodEnergy: 25,
  predatorKillEnergy: 60,

  // Reproduction
  reproductionThreshold: 150,
  reproductionCost: 60,

  // Detection & Interaction
  preyDetectionRadius: 80,
  predatorDetectionRadius: 120,
  eatingRadius: 10,

  // Food
  foodSpawnRate: 5,
  maxFood: 200,
  foodRadius: 4,

  // Entity sizes
  preyRadius: 6,
  predatorRadius: 8,

  // Population caps
  maxPrey: 300,
  maxPredators: 150,

  // Wander
  wanderJitter: 0.3,

  // Graph
  graphSampleInterval: 200,
  graphMaxSamples: 300,
};
