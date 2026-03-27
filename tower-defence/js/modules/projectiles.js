/**
 * File: projectiles.js
 * Description: Projectile creation, movement, and hit detection
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

let nextId = 0;

/**
 * Creates a projectile from turret toward enemy
 * @param {Object} turret
 * @param {Object} target
 * @returns {Object}
 */
export function createProjectile(turret, target) {
  return {
    id: nextId++,
    x: turret.x,
    y: turret.y,
    targetId: target.id,
    speed: turret.projectileSpeed,
    damage: turret.damage,
    colour: turret.projectileColour,
    effect: turret.effect,
    alive: true,
  };
}

/**
 * Moves projectile toward its target
 * @param {Object} proj
 * @param {Array} enemies
 * @param {number} dt - Delta time in seconds
 * @returns {boolean} true if hit
 */
export function moveProjectile(proj, enemies, dt) {
  const target = enemies.find(e => e.id === proj.targetId && e.alive);
  if (!target) {
    proj.alive = false;
    return false;
  }

  const dx = target.x - proj.x;
  const dy = target.y - proj.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 8) {
    applyHit(proj, target, enemies);
    proj.alive = false;
    return true;
  }

  const move = proj.speed * dt;
  proj.x += (dx / dist) * move;
  proj.y += (dy / dist) * move;
  return false;
}

/**
 * @param {Object} proj
 * @param {Object} target
 * @param {Array} enemies
 */
function applyHit(proj, target, enemies) {
  target.hp -= proj.damage;
  if (target.hp <= 0) {
    target.alive = false;
  }

  if (proj.effect === 'slow') {
    target.slowTimer = 2.0;
    target.slowFactor = 0.4;
  }

  if (proj.effect === 'splash') {
    const SPLASH_RADIUS = 50;
    for (const enemy of enemies) {
      if (enemy.id === target.id || !enemy.alive) continue;
      const dx = enemy.x - target.x;
      const dy = enemy.y - target.y;
      if (Math.sqrt(dx * dx + dy * dy) <= SPLASH_RADIUS) {
        enemy.hp -= Math.floor(proj.damage * 0.5);
        if (enemy.hp <= 0) enemy.alive = false;
      }
    }
  }
}
