/**
 * File: config.js
 * Description: Default constants, timing, dimensions, and colours
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const CONFIG = {
  canvas: {
    width: 700,
    height: 700,
  },

  road: {
    start: 250,
    end: 450,
    width: 200,
    laneWidth: 80,
    medianWidth: 40,
    centreLine: 350,
  },

  lanes: {
    southbound: { x: 280, dir: 'south' },
    northbound: { x: 420, dir: 'north' },
    eastbound: { y: 420, dir: 'east' },
    westbound: { y: 280, dir: 'west' },
  },

  stopLines: {
    north: 245,
    south: 455,
    west: 245,
    east: 455,
  },

  crossings: {
    width: 15,
    stripeWidth: 4,
    stripeGap: 4,
  },

  trafficLight: {
    housingWidth: 16,
    housingHeight: 42,
    bulbRadius: 5,
  },

  timing: {
    greenDuration: 10000,
    amberDuration: 3000,
    allRedClearance: 2000,
    pedestrianDuration: 8000,
    pedestrianFlash: 3000,
  },

  vehicles: {
    width: 22,
    length: 40,
    speed: 2.0,
    minFollowDistance: 12,
    spawnInterval: 3000,
    colours: [
      '#c62828', '#1565c0', '#eceff1', '#212121',
      '#90a4ae', '#f9a825', '#2e7d32',
    ],
  },

  pedestrians: {
    radius: 5,
    speed: 1.0,
    colour: '#ff7043',
    outline: '#bf360c',
    spawnChance: 0.3,
  },

  simulation: {
    speedMultiplier: 1.0,
  },
};
