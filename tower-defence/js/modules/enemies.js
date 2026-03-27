/**
 * File: enemies.js
 * Description: Enemy types, spawning, and path-following movement
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getPathPixels, TILE_SIZE } from './map.js';

const ENEMY_TYPES = {
  basic:  { name: 'Scout',   hp: 50,  speed: 60,  gold: 10, colour: '#E74C3C', radius: 10 },
  fast:   { name: 'Runner',  hp: 30,  speed: 100, gold: 15, colour: '#E67E22', radius: 8 },
  tank:   { name: 'Tank',    hp: 150, speed: 40,  gold: 25, colour: '#8E44AD', radius: 14 },
  boss:   { name: 'Boss',    hp: 500, speed: 30,  gold: 100,colour: '#C0392B', radius: 18 },
};

let nextId = 0;

/**
 * Creates an enemy at the start of the path
 * @param {string} type - Key from ENEMY_TYPES
 * @param {number} wave - Current wave for scaling
 * @returns {Object}
 */
export function createEnemy(type, wave) {
  const template = ENEMY_TYPES[type] || ENEMY_TYPES.basic;
  const path = getPathPixels();
  const scale = 1 + (wave - 1) * 0.12;

  return {
    id: nextId++,
    type,
    name: template.name,
    x: path[0].x,
    y: path[0].y,
    hp: Math.floor(template.hp * scale),
    maxHp: Math.floor(template.hp * scale),
    speed: template.speed,
    gold: Math.floor(template.gold * (1 + wave * 0.05)),
    colour: template.colour,
    radius: template.radius,
    pathIndex: 0,
    alive: true,
    reachedEnd: false,
    slowTimer: 0,
  };
}

/**
 * Moves an enemy along the path
 * @param {Object} enemy
 * @param {number} dt - delta time in seconds
 */
export function moveEnemy(enemy, dt) {
  if (!enemy.alive || enemy.reachedEnd) return;

  const path = getPathPixels();
  if (enemy.pathIndex >= path.length - 1) {
    enemy.reachedEnd = true;
    return;
  }

  const target = path[enemy.pathIndex + 1];
  const dx = target.x - enemy.x;
  const dy = target.y - enemy.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Apply slow effect
  let speed = enemy.speed;
  if (enemy.slowTimer > 0) {
    speed *= 0.5;
    enemy.slowTimer -= dt;
  }

  const step = speed * dt;

  if (dist <= step) {
    enemy.x = target.x;
    enemy.y = target.y;
    enemy.pathIndex++;
  } else {
    enemy.x += (dx / dist) * step;
    enemy.y += (dy / dist) * step;
  }
}

export function getEnemyTypes() { return ENEMY_TYPES; }
