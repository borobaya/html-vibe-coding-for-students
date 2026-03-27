/**
 * File: main.js
 * Description: Tower Defence entry point – game loop, event wiring, phase management
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { COLS, ROWS, TILE_SIZE, isBuildable } from './modules/map.js';
import { createGameState, resetGame, spendGold, earnGold, loseLife, addScore } from './modules/game.js';
import { moveEnemy } from './modules/enemies.js';
import { TURRET_TYPES, createTurret, findTarget, upgradeTurret } from './modules/turrets.js';
import { createProjectile, moveProjectile } from './modules/projectiles.js';
import { buildWave, updateWaveSpawning, isWaveComplete } from './modules/waves.js';
import { render } from './modules/renderer.js';
import { initBuildMenu, updateHUD, showUpgradePanel, hideUpgradePanel, showWaveAnnouncement, showGameOver, hideGameOver, clearBuildSelection } from './modules/ui.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const state = createGameState();
let selectedBuildType = null;
let selectedTurret = null;
let hoverCell = null;
let currentWave = null;
let lastTime = 0;

/* ── Build Menu ── */
initBuildMenu(document.getElementById('build-menu'), (type) => {
  selectedBuildType = type;
  selectedTurret = null;
  hideUpgradePanel();
});

/* ── Canvas Click – build or select ── */
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const gx = Math.floor((e.clientX - rect.left) / TILE_SIZE);
  const gy = Math.floor((e.clientY - rect.top) / TILE_SIZE);

  if (selectedBuildType) {
    tryBuild(gx, gy);
  } else {
    trySelectTurret(gx, gy);
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  hoverCell = {
    gx: Math.floor((e.clientX - rect.left) / TILE_SIZE),
    gy: Math.floor((e.clientY - rect.top) / TILE_SIZE),
  };
});

canvas.addEventListener('mouseleave', () => { hoverCell = null; });

function tryBuild(gx, gy) {
  if (!isBuildable(gx, gy, state.turrets)) return;
  const typeData = TURRET_TYPES[selectedBuildType];
  if (state.gold < typeData.cost) return;

  spendGold(state, typeData.cost);
  const turret = createTurret(selectedBuildType, gx, gy);
  state.turrets.push(turret);
  updateHUD(state);
}

function trySelectTurret(gx, gy) {
  const turret = state.turrets.find(t => t.gx === gx && t.gy === gy);
  if (turret) {
    selectedTurret = turret;
    clearBuildSelection();
    selectedBuildType = null;
    showUpgradePanel(turret, () => handleUpgrade(), () => handleSell());
  } else {
    selectedTurret = null;
    hideUpgradePanel();
  }
}

function handleUpgrade() {
  if (!selectedTurret) return;
  if (state.gold < selectedTurret.upgradeCost) return;
  spendGold(state, selectedTurret.upgradeCost);
  upgradeTurret(selectedTurret);
  showUpgradePanel(selectedTurret, () => handleUpgrade(), () => handleSell());
  updateHUD(state);
}

function handleSell() {
  if (!selectedTurret) return;
  earnGold(state, selectedTurret.sellValue);
  state.turrets = state.turrets.filter(t => t.id !== selectedTurret.id);
  selectedTurret = null;
  hideUpgradePanel();
  updateHUD(state);
}

/* ── Start Wave Button ── */
document.getElementById('btn-start-wave').addEventListener('click', startNextWave);

function startNextWave() {
  if (state.phase === 'combat') return;
  state.wave++;
  state.phase = 'combat';
  currentWave = buildWave(state.wave);
  showWaveAnnouncement(state.wave);
  updateHUD(state);
}

/* ── Restart ── */
document.getElementById('btn-restart')?.addEventListener('click', () => {
  resetGame(state);
  selectedTurret = null;
  selectedBuildType = null;
  currentWave = null;
  hideUpgradePanel();
  hideGameOver();
  updateHUD(state);
});

/* ── Game Loop ── */
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  if (state.phase === 'combat' && currentWave) {
    updateCombat(dt);
  }

  render(ctx, state, selectedTurret, selectedBuildType, hoverCell);
  updateHUD(state);
  requestAnimationFrame(gameLoop);
}

function updateCombat(dt) {
  // Spawn
  updateWaveSpawning(currentWave, state.wave, state.enemies, dt);

  // Move enemies
  for (const enemy of state.enemies) {
    if (!enemy.alive || enemy.reachedEnd) continue;
    moveEnemy(enemy, dt);
    if (enemy.reachedEnd) {
      loseLife(state, 1);
      if (state.lives <= 0) {
        state.phase = 'gameover';
        showGameOver(state.score);
        return;
      }
    }
  }

  // Turrets fire
  for (const turret of state.turrets) {
    turret.cooldown -= dt;
    if (turret.cooldown > 0) continue;
    const target = findTarget(turret, state.enemies);
    if (target) {
      turret.cooldown = turret.fireRate;
      state.projectiles.push(createProjectile(turret, target));
    }
  }

  // Move projectiles
  for (const proj of state.projectiles) {
    if (!proj.alive) continue;
    moveProjectile(proj, state.enemies, dt);
  }

  // Award gold for dead enemies
  for (const enemy of state.enemies) {
    if (!enemy.alive && !enemy.rewarded) {
      enemy.rewarded = true;
      earnGold(state, enemy.reward);
      addScore(state, enemy.reward * 2);
    }
  }

  // Clean up
  state.enemies = state.enemies.filter(e => e.alive && !e.reachedEnd);
  state.projectiles = state.projectiles.filter(p => p.alive);

  // Wave complete
  if (isWaveComplete(currentWave, state.enemies)) {
    state.phase = 'build';
    earnGold(state, 25 + state.wave * 5);
    currentWave = null;
  }
}

/* ── Init ── */
updateHUD(state);
requestAnimationFrame(gameLoop);
