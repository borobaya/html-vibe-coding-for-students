/**
 * File: game.js
 * Description: Game state, core loop, and lifecycle management
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const state = {
  lives: 20,
  gold: 200,
  wave: 0,
  score: 0,
  phase: 'build', // 'build' | 'combat' | 'gameover'
  enemies: [],
  turrets: [],
  projectiles: [],
  selectedTurretType: null,
  selectedPlacedTurret: null,
  animFrameId: null,
};

export function getState() { return state; }

export function resetGame() {
  state.lives = 20;
  state.gold = 200;
  state.wave = 0;
  state.score = 0;
  state.phase = 'build';
  state.enemies = [];
  state.turrets = [];
  state.projectiles = [];
  state.selectedTurretType = null;
  state.selectedPlacedTurret = null;
}

export function spendGold(amount) {
  if (state.gold >= amount) {
    state.gold -= amount;
    return true;
  }
  return false;
}

export function earnGold(amount) {
  state.gold += amount;
}

export function loseLife() {
  state.lives--;
  if (state.lives <= 0) {
    state.lives = 0;
    state.phase = 'gameover';
  }
}

export function addScore(points) {
  state.score += points;
}
