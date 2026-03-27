/**
 * File: player.js
 * Description: Player entity — stats, movement, levelling, equipment effects
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { TILE, xpForLevel } from './config.js';
import { getState, addMessage } from './state.js';

/**
 * Attempts to move the player by dx, dy
 * @param {number} dx
 * @param {number} dy
 * @returns {{ moved: boolean, encounter: object|null, interact: string|null }}
 */
export function movePlayer(dx, dy) {
  const state = getState();
  const { player, map, enemies } = state;
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Bounds check
  if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
    return { moved: false, encounter: null, interact: null };
  }

  const tile = map[newY][newX];

  // Wall check
  if (tile === TILE.WALL) {
    return { moved: false, encounter: null, interact: null };
  }

  // Enemy check
  const enemy = enemies.find(e => e.alive && e.x === newX && e.y === newY);
  if (enemy) {
    return { moved: false, encounter: enemy, interact: null };
  }

  // Move successfully
  player.x = newX;
  player.y = newY;

  // Check tile interactions
  let interact = null;
  if (tile === TILE.POTION) {
    interact = 'potion';
    player.hp = Math.min(player.maxHp, player.hp + 20);
    map[newY][newX] = TILE.FLOOR;
    addMessage('You picked up a Health Potion. (+20 HP)', 'heal');
    state.itemsCollected++;
  }

  return { moved: true, encounter: null, interact };
}

/**
 * Attempt to interact with adjacent/current tile
 */
export function interact() {
  const state = getState();
  const { player, map } = state;
  const tile = map[player.y][player.x];

  if (tile === TILE.CHEST) {
    map[player.y][player.x] = TILE.CHEST_OPENED;
    addMessage('You opened a treasure chest!', 'loot');
    state.itemsCollected++;
    return 'chest';
  }

  if (tile === TILE.STAIRS) {
    addMessage('You descend deeper into the dungeon...', 'normal');
    return 'stairs';
  }

  return null;
}

/**
 * Awards XP and handles level-ups
 * @param {number} amount
 */
export function gainXP(amount) {
  const state = getState();
  const { player } = state;
  player.xp += amount;

  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.maxHp += 10;
    player.hp = player.maxHp;
    player.maxMp += 5;
    player.mp = player.maxMp;
    player.atk += 2;
    player.def += 1;
    player.spd += 1;
    player.xpToNext = xpForLevel(player.level);
    addMessage(`Level up! You are now level ${player.level}!`, 'levelup');
  }
}

/**
 * Gets effective stats including equipment bonuses
 * @returns {{ atk: number, def: number }}
 */
export function getEffectiveStats() {
  const state = getState();
  const { player, equipped } = state;
  let atk = player.atk;
  let def = player.def;

  if (equipped.weapon) atk += equipped.weapon.atk || 0;
  if (equipped.armour) def += equipped.armour.def || 0;

  return { atk, def, spd: player.spd };
}
