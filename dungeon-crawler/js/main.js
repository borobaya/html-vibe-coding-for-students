/**
 * File: main.js
 * Description: Entry point — initialises game, binds events, manages game flow
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { getState, resetState, setMode, addMessage, createFreshPlayer } from './modules/state.js';
import { generateFloor } from './modules/dungeon.js';
import { movePlayer, interact as playerInteract } from './modules/player.js';
import { startCombat, playerAction, getCombatState, endCombat } from './modules/combat.js';
import { equipItem, useItem, discardItem } from './modules/inventory.js';
import { rollChestLoot } from './modules/items.js';
import { addItem } from './modules/inventory.js';
import { initFog, updateFog } from './modules/fog.js';
import { renderMap, renderMinimap, renderHUD, renderLog, renderCombat, renderInventory } from './modules/renderer.js';
import { initInput } from './modules/input.js';
import { hasSave, saveGame, loadGame, deleteSave, getBestRun, updateBestRun } from './modules/storage.js';
import { ITEMS } from './modules/config.js';

let selectedInventoryIndex = -1;

// --- Overlay management ---
function showOverlay(id) {
  document.getElementById(id).hidden = false;
}

function hideOverlay(id) {
  document.getElementById(id).hidden = true;
}

function hideAllOverlays() {
  for (const id of ['title-overlay', 'combat-overlay', 'inventory-overlay', 'gameover-overlay', 'controls-overlay']) {
    hideOverlay(id);
  }
}

// --- Game flow ---
function newGame() {
  resetState();
  const state = getState();
  state.player = createFreshPlayer();

  // Give starter weapon
  const starter = { ...ITEMS[0] }; // Rusty Dagger
  state.equipped.weapon = starter;

  startFloor();
  hideAllOverlays();
  setMode('explore');
  addMessage('You enter the dungeon...', 'normal');
  renderAll();
}

function continueGame() {
  const data = loadGame();
  if (!data) return;

  const state = getState();
  Object.assign(state, data);
  setMode('explore');
  hideAllOverlays();
  initFog();

  // Restore fog from saved data
  if (data.fog) {
    const { setFogMap } = import('./modules/fog.js').then ? null : null;
    // Fog is re-initialized; player can re-explore
  }

  updateFog(state.player.x, state.player.y);
  renderAll();
}

function startFloor() {
  const state = getState();
  const { map, enemies, playerStart } = generateFloor(state.floor);
  state.map = map;
  state.enemies = enemies;
  state.player.x = playerStart.x;
  state.player.y = playerStart.y;

  initFog();
  updateFog(state.player.x, state.player.y);
  addMessage(`You entered Floor ${state.floor}.`, 'normal');
}

function nextFloor() {
  const state = getState();
  state.floor++;
  startFloor();

  // Auto-save
  try {
    saveGame({
      floor: state.floor,
      score: state.score,
      player: { ...state.player },
      inventory: [...state.inventory],
      equipped: { ...state.equipped },
      enemiesDefeated: state.enemiesDefeated,
      itemsCollected: state.itemsCollected,
      messages: state.messages.slice(-10),
    });
  } catch { /* */ }

  renderAll();
}

function gameOver() {
  const state = getState();
  setMode('gameover');
  updateBestRun(state.floor);
  deleteSave();

  document.getElementById('go-floor').textContent = `You perished on Floor ${state.floor}.`;
  document.getElementById('go-enemies').textContent = `Enemies defeated: ${state.enemiesDefeated}`;
  document.getElementById('go-items').textContent = `Items collected: ${state.itemsCollected}`;
  document.getElementById('go-level').textContent = `Final level: ${state.player.level}`;
  document.getElementById('go-score').textContent = `Score: ${state.score}`;

  showOverlay('gameover-overlay');
}

// --- Rendering ---
function renderAll() {
  renderMap();
  renderMinimap();
  renderHUD();
  renderLog();
}

// --- Input handlers ---
function handleMove(dx, dy) {
  const state = getState();
  if (state.gameMode !== 'explore') return;

  const result = movePlayer(dx, dy);

  if (result.encounter) {
    startCombat(result.encounter);
    showOverlay('combat-overlay');
    renderCombat();
    renderHUD();
    renderLog();
    return;
  }

  if (result.moved) {
    updateFog(state.player.x, state.player.y);
    renderAll();
  }
}

function handleInteract() {
  const state = getState();
  if (state.gameMode !== 'explore') return;

  const result = playerInteract();
  if (result === 'chest') {
    const loot = rollChestLoot(state.floor);
    if (loot) {
      addItem(loot);
      addMessage(`Found ${loot.name} in the chest!`, 'loot');
      state.itemsCollected++;
    }
    renderAll();
  } else if (result === 'stairs') {
    nextFloor();
  }
}

function handleCombatAction(action) {
  const state = getState();
  if (state.gameMode !== 'combat') return;

  playerAction(action);
  renderCombat();
  renderHUD();
  renderLog();

  const combat = getCombatState();
  if (combat && combat.finished) {
    setTimeout(() => {
      if (combat.result === 'death') {
        hideOverlay('combat-overlay');
        endCombat();
        gameOver();
      } else {
        hideOverlay('combat-overlay');
        endCombat();
        updateFog(state.player.x, state.player.y);
        renderAll();
      }
    }, 1000);
  }
}

function toggleInventory() {
  const state = getState();
  if (state.gameMode === 'inventory') {
    setMode('explore');
    hideOverlay('inventory-overlay');
  } else if (state.gameMode === 'explore') {
    setMode('inventory');
    selectedInventoryIndex = -1;
    renderInventory();
    showOverlay('inventory-overlay');
  }
}

// --- Init ---
function init() {
  // Title screen setup
  const best = getBestRun();
  document.getElementById('best-run').textContent = best > 0 ? `Best Run: Floor ${best}` : 'Best Run: —';

  const btnContinue = document.getElementById('btn-continue');
  if (hasSave()) {
    btnContinue.disabled = false;
  }

  // Button listeners
  document.getElementById('btn-new-game').addEventListener('click', newGame);
  btnContinue.addEventListener('click', continueGame);
  document.getElementById('btn-retry').addEventListener('click', newGame);
  document.getElementById('btn-controls').addEventListener('click', () => showOverlay('controls-overlay'));
  document.getElementById('btn-close-controls').addEventListener('click', () => hideOverlay('controls-overlay'));

  // Combat buttons
  document.getElementById('btn-attack').addEventListener('click', () => handleCombatAction('attack'));
  document.getElementById('btn-defend').addEventListener('click', () => handleCombatAction('defend'));
  document.getElementById('btn-flee').addEventListener('click', () => handleCombatAction('flee'));

  // Inventory buttons
  document.getElementById('btn-close-inv').addEventListener('click', toggleInventory);
  document.getElementById('btn-use').addEventListener('click', () => {
    if (selectedInventoryIndex >= 0) {
      useItem(selectedInventoryIndex);
      selectedInventoryIndex = -1;
      renderInventory();
      renderHUD();
    }
  });
  document.getElementById('btn-equip').addEventListener('click', () => {
    if (selectedInventoryIndex >= 0) {
      equipItem(selectedInventoryIndex);
      selectedInventoryIndex = -1;
      renderInventory();
      renderHUD();
    }
  });
  document.getElementById('btn-discard').addEventListener('click', () => {
    if (selectedInventoryIndex >= 0) {
      discardItem(selectedInventoryIndex);
      selectedInventoryIndex = -1;
      renderInventory();
    }
  });

  // Inventory item selection via delegation
  document.getElementById('inventory-grid').addEventListener('click', (e) => {
    const slot = e.target.closest('.inventory__item');
    if (!slot) return;
    const index = parseInt(slot.dataset.index, 10);
    const state = getState();
    if (index < state.inventory.length) {
      selectedInventoryIndex = index;
      // Highlight selected
      document.querySelectorAll('.inventory__item').forEach(s => s.classList.remove('inventory__item--selected'));
      slot.classList.add('inventory__item--selected');
      document.getElementById('btn-use').disabled = false;
      document.getElementById('btn-equip').disabled = false;
      document.getElementById('btn-discard').disabled = false;
    }
  });

  // Keyboard input
  initInput({
    getMode: () => getState().gameMode,
    explore: {
      'w': () => handleMove(0, -1),
      'a': () => handleMove(-1, 0),
      's': () => handleMove(0, 1),
      'd': () => handleMove(1, 0),
      'ArrowUp': () => handleMove(0, -1),
      'ArrowLeft': () => handleMove(-1, 0),
      'ArrowDown': () => handleMove(0, 1),
      'ArrowRight': () => handleMove(1, 0),
      'e': handleInteract,
      'E': handleInteract,
      'i': toggleInventory,
      'I': toggleInventory,
    },
    combat: {
      '1': () => handleCombatAction('attack'),
      '2': () => handleCombatAction('defend'),
      '3': () => handleCombatAction('flee'),
    },
    inventory: {
      'i': toggleInventory,
      'I': toggleInventory,
      'Escape': toggleInventory,
    },
    title: {},
    gameover: {},
  });
}

init();
