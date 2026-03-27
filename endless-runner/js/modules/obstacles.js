/**
 * File: obstacles.js
 * Description: Obstacle spawning, movement, and collision detection
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const GROUND_Y = 320;
const CANVAS_WIDTH = 800;
const MIN_SPAWN_INTERVAL = 800;
const MAX_SPAWN_INTERVAL = 2000;
const BASE_SPEED = 300;

const OBSTACLE_TYPES = [
  { name: 'cactus_small',  width: 25, height: 40, yOffset: 0 },
  { name: 'cactus_large',  width: 30, height: 55, yOffset: 0 },
  { name: 'cactus_double', width: 55, height: 45, yOffset: 0 },
  { name: 'bird_low',      width: 40, height: 30, yOffset: -50 },
  { name: 'bird_high',     width: 40, height: 30, yOffset: -100 },
];

let obstacles = [];
let timeSinceLastSpawn = 0;
let spawnInterval = MAX_SPAWN_INTERVAL;

export function reset() {
  obstacles = [];
  timeSinceLastSpawn = 0;
  spawnInterval = MAX_SPAWN_INTERVAL;
}

/**
 * @param {number} dt - delta time in seconds
 * @param {number} speed - current game speed in px/s
 */
export function update(dt, speed) {
  // Move obstacles left
  for (const obs of obstacles) {
    obs.x -= speed * dt;
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Spawn timer
  timeSinceLastSpawn += dt * 1000;
  spawnInterval = Math.max(
    MIN_SPAWN_INTERVAL,
    MAX_SPAWN_INTERVAL - (speed - BASE_SPEED) * 2.4
  );

  if (timeSinceLastSpawn >= spawnInterval) {
    spawn();
    timeSinceLastSpawn = 0;
  }
}

function spawn() {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  obstacles.push({
    x: CANVAS_WIDTH,
    y: GROUND_Y - type.height + type.yOffset,
    width: type.width,
    height: type.height,
    type: type.name,
    passed: false,
  });
}

/**
 * AABB collision check
 * @param {{ x: number, y: number, width: number, height: number }} playerHitbox
 * @returns {boolean}
 */
export function checkCollision(playerHitbox) {
  for (const obs of obstacles) {
    if (
      playerHitbox.x < obs.x + obs.width &&
      playerHitbox.x + playerHitbox.width > obs.x &&
      playerHitbox.y < obs.y + obs.height &&
      playerHitbox.y + playerHitbox.height > obs.y
    ) {
      return true;
    }
  }
  return false;
}

/** @returns {Array} */
export function getObstacles() {
  return obstacles;
}
