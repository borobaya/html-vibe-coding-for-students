/**
 * File: waves.js
 * Description: Wave composition, enemy spawning, and wave progression
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { createEnemy } from './enemies.js';

const WAVE_DEFS = [
  { enemies: [{ type: 'scout', count: 5 }] },
  { enemies: [{ type: 'scout', count: 8 }] },
  { enemies: [{ type: 'scout', count: 6 }, { type: 'runner', count: 3 }] },
  { enemies: [{ type: 'runner', count: 6 }, { type: 'scout', count: 4 }] },
  { enemies: [{ type: 'scout', count: 5 }, { type: 'tank',   count: 2 }] },
  { enemies: [{ type: 'runner', count: 8 }, { type: 'tank',   count: 2 }] },
  { enemies: [{ type: 'tank',   count: 5 }, { type: 'scout',  count: 5 }] },
  { enemies: [{ type: 'runner', count: 10 }, { type: 'tank',   count: 3 }] },
  { enemies: [{ type: 'tank',   count: 6 }, { type: 'runner', count: 6 }] },
  { enemies: [{ type: 'boss',   count: 1 }, { type: 'scout',  count: 8 }] },
];

const SPAWN_INTERVAL = 0.8; // seconds between spawns

/**
 * Builds the spawn queue for a given wave number
 * @param {number} waveNum - 1-based wave number
 * @returns {Object} wave state
 */
export function buildWave(waveNum) {
  const defIdx = Math.min(waveNum - 1, WAVE_DEFS.length - 1);
  const def = WAVE_DEFS[defIdx];

  const queue = [];
  for (const group of def.enemies) {
    const count = waveNum > WAVE_DEFS.length
      ? Math.floor(group.count * (1 + (waveNum - WAVE_DEFS.length) * 0.25))
      : group.count;
    for (let i = 0; i < count; i++) {
      queue.push(group.type);
    }
  }

  // Shuffle queue for variety
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  return {
    queue,
    spawnTimer: 0,
    spawnIndex: 0,
    done: false,
  };
}

/**
 * Updates spawning logic
 * @param {Object} wave
 * @param {number} waveNum
 * @param {Array} enemies - game enemies array
 * @param {number} dt
 */
export function updateWaveSpawning(wave, waveNum, enemies, dt) {
  if (wave.done) return;

  wave.spawnTimer += dt;
  if (wave.spawnTimer >= SPAWN_INTERVAL && wave.spawnIndex < wave.queue.length) {
    wave.spawnTimer = 0;
    const enemy = createEnemy(wave.queue[wave.spawnIndex], waveNum);
    enemies.push(enemy);
    wave.spawnIndex++;
  }

  if (wave.spawnIndex >= wave.queue.length) {
    wave.done = true;
  }
}

/**
 * Checks if wave is complete (all spawned & all dead or escaped)
 * @param {Object} wave
 * @param {Array} enemies
 * @returns {boolean}
 */
export function isWaveComplete(wave, enemies) {
  return wave.done && enemies.every(e => !e.alive || e.reachedEnd);
}

export function getTotalWaves() { return WAVE_DEFS.length; }
