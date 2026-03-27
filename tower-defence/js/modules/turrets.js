/**
 * File: turrets.js
 * Description: Turret types, placement, targeting, and upgrades
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { TILE_SIZE } from './map.js';

export const TURRET_TYPES = {
  arrow:  { name: 'Arrow Tower', cost: 50,  damage: 15,  range: 120, fireRate: 1.0, colour: '#27AE60', projectileColour: '#2ECC71', projectileSpeed: 300, effect: null },
  cannon: { name: 'Cannon',      cost: 100, damage: 40,  range: 100, fireRate: 2.0, colour: '#7F8C8D', projectileColour: '#95A5A6', projectileSpeed: 200, effect: 'splash' },
  sniper: { name: 'Sniper',      cost: 150, damage: 80,  range: 200, fireRate: 3.0, colour: '#2C3E50', projectileColour: '#ECF0F1', projectileSpeed: 500, effect: null },
  freeze: { name: 'Freeze Tower', cost: 120, damage: 10, range: 110, fireRate: 1.5, colour: '#5DADE2', projectileColour: '#85C1E9', projectileSpeed: 250, effect: 'slow' },
};

let nextId = 0;

/**
 * Creates a turret on the grid
 * @param {string} type
 * @param {number} gx - Grid X
 * @param {number} gy - Grid Y
 * @returns {Object}
 */
export function createTurret(type, gx, gy) {
  const t = TURRET_TYPES[type];
  return {
    id: nextId++,
    type,
    name: t.name,
    x: gx * TILE_SIZE + TILE_SIZE / 2,
    y: gy * TILE_SIZE + TILE_SIZE / 2,
    gx,
    gy,
    damage: t.damage,
    range: t.range,
    fireRate: t.fireRate,
    colour: t.colour,
    projectileColour: t.projectileColour,
    projectileSpeed: t.projectileSpeed,
    effect: t.effect,
    level: 1,
    cooldown: 0,
    sellValue: Math.floor(t.cost * 0.6),
    upgradeCost: Math.floor(t.cost * 0.75),
  };
}

/**
 * Finds the closest enemy in range
 * @param {Object} turret
 * @param {Array} enemies
 * @returns {Object|null}
 */
export function findTarget(turret, enemies) {
  let closest = null;
  let minDist = Infinity;

  for (const enemy of enemies) {
    if (!enemy.alive || enemy.reachedEnd) continue;
    const dx = enemy.x - turret.x;
    const dy = enemy.y - turret.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= turret.range && dist < minDist) {
      minDist = dist;
      closest = enemy;
    }
  }
  return closest;
}

/**
 * Upgrades a turret
 * @param {Object} turret
 */
export function upgradeTurret(turret) {
  turret.level++;
  turret.damage = Math.floor(turret.damage * 1.4);
  turret.range += 10;
  turret.fireRate *= 0.85;
  turret.sellValue += Math.floor(turret.upgradeCost * 0.5);
  turret.upgradeCost = Math.floor(turret.upgradeCost * 1.5);
}

export function getTurretTypes() { return TURRET_TYPES; }
