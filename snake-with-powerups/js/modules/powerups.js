/**
 * File: powerups.js
 * Description: Power-up type definitions, activation, deactivation, and timer management
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const POWERUP_TYPES = {
  speed:      { name: 'Speed Boost',  colour: '#ffdc00', shape: 'lightning',  duration: 5,  probability: 0.25 },
  slow:       { name: 'Slow-Motion',  colour: '#00bfff', shape: 'snowflake',  duration: 6,  probability: 0.25 },
  multiplier: { name: '2× Score',     colour: '#b10dc9', shape: 'star',       duration: 8,  probability: 0.20 },
  shield:     { name: 'Shield',       colour: '#2ecc40', shape: 'circle',     duration: 10, probability: 0.15 },
  shrink:     { name: 'Shrink',       colour: '#ff851b', shape: 'arrow',      duration: 0,  probability: 0.15 },
};

let activePowerup = null;

/** @returns {Object} The POWERUP_TYPES dictionary */
export function getPowerupTypes() {
  return POWERUP_TYPES;
}

/**
 * Selects a random power-up kind using weighted probabilities
 * @returns {string} A key from POWERUP_TYPES
 */
export function pickRandomPowerup() {
  const entries = Object.entries(POWERUP_TYPES);
  const roll = Math.random();
  let cumulative = 0;

  for (const [kind, config] of entries) {
    cumulative += config.probability;
    if (roll < cumulative) {
      return kind;
    }
  }
  // Fallback to last entry
  return entries[entries.length - 1][0];
}

/**
 * Activates a power-up and calls the effect callback
 * @param {string} kind - Key from POWERUP_TYPES
 * @param {Function} applyEffectCallback - Called with (kind) to apply game-state changes
 */
export function activate(kind, applyEffectCallback) {
  const config = POWERUP_TYPES[kind];
  if (!config) return;

  // Shrink is instant — no lingering active state
  if (config.duration === 0) {
    applyEffectCallback(kind);
    return;
  }

  activePowerup = {
    kind,
    name: config.name,
    remainingMs: config.duration * 1000,
    totalMs: config.duration * 1000,
  };
  applyEffectCallback(kind);
}

/** @returns {{ kind: string, name: string, remainingMs: number, totalMs: number } | null} */
export function getActive() {
  return activePowerup;
}

/**
 * Decrements the active power-up timer
 * @param {number} deltaMs - Milliseconds elapsed since last update
 * @returns {boolean} True if the power-up just expired
 */
export function updateTimer(deltaMs) {
  if (!activePowerup) return false;
  activePowerup.remainingMs -= deltaMs;
  return activePowerup.remainingMs <= 0;
}

/**
 * Deactivates the current power-up and calls the removal callback
 * @param {Function} removeEffectCallback - Called with (kind) to revert game-state changes
 */
export function deactivate(removeEffectCallback) {
  if (!activePowerup) return;
  const { kind } = activePowerup;
  activePowerup = null;
  removeEffectCallback(kind);
}

/**
 * Checks if the active power-up is expiring soon (≤ 3 seconds)
 * @returns {boolean}
 */
export function isExpiringSoon() {
  return activePowerup !== null && activePowerup.remainingMs <= 3000;
}

/** Clears active power-up without calling callbacks */
export function reset() {
  activePowerup = null;
}
