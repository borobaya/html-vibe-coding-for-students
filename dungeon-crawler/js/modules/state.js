/**
 * File: state.js
 * Description: Central game state object and mutation helpers
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { BASE_PLAYER_STATS } from './config.js';

const state = {
  gameMode: 'title', // 'title' | 'explore' | 'combat' | 'inventory' | 'gameover'
  floor: 1,
  score: 0,
  map: [],
  enemies: [],
  player: null,
  inventory: [],
  equipped: { weapon: null, armour: null },
  fog: [],
  messages: [],
  combatState: null,
  enemiesDefeated: 0,
  itemsCollected: 0,
};

export function getState() {
  return state;
}

export function setMode(mode) {
  state.gameMode = mode;
}

export function resetState() {
  state.gameMode = 'title';
  state.floor = 1;
  state.score = 0;
  state.map = [];
  state.enemies = [];
  state.player = createFreshPlayer();
  state.inventory = [];
  state.equipped = { weapon: null, armour: null };
  state.fog = [];
  state.messages = [];
  state.combatState = null;
  state.enemiesDefeated = 0;
  state.itemsCollected = 0;
}

export function createFreshPlayer() {
  return {
    x: 0,
    y: 0,
    hp: BASE_PLAYER_STATS.maxHp,
    maxHp: BASE_PLAYER_STATS.maxHp,
    mp: BASE_PLAYER_STATS.maxMp,
    maxMp: BASE_PLAYER_STATS.maxMp,
    atk: BASE_PLAYER_STATS.atk,
    def: BASE_PLAYER_STATS.def,
    spd: BASE_PLAYER_STATS.spd,
    level: 1,
    xp: 0,
    xpToNext: BASE_PLAYER_STATS.xpToNext,
  };
}

export function addMessage(text, type = 'normal') {
  state.messages.push({ text, type });
  if (state.messages.length > 50) {
    state.messages.shift();
  }
}
