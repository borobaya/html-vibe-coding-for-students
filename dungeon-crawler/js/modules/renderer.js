/**
 * File: renderer.js
 * Description: DOM rendering — map grid, HUD, minimap, overlays, combat log
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { TILE, VIEW_COLS, VIEW_ROWS, GRID_COLS, GRID_ROWS } from './config.js';
import { getState } from './state.js';
import { getTileVisibility } from './fog.js';
import { getEffectiveStats } from './player.js';

const TILE_SYMBOLS = {
  [TILE.WALL]: '#',
  [TILE.FLOOR]: '.',
  [TILE.STAIRS]: '≡',
  [TILE.CHEST]: 'T',
  [TILE.CHEST_OPENED]: 't',
  [TILE.POTION]: 'P',
};

const TILE_CLASSES = {
  [TILE.WALL]: 'tile--wall',
  [TILE.FLOOR]: 'tile--floor',
  [TILE.STAIRS]: 'tile--stairs',
  [TILE.CHEST]: 'tile--chest',
  [TILE.CHEST_OPENED]: 'tile--chest-opened',
  [TILE.POTION]: 'tile--potion',
};

/**
 * Renders the dungeon grid centred on the player
 */
export function renderMap() {
  const state = getState();
  const { map, player, enemies } = state;
  const grid = document.getElementById('dungeon-grid');

  // Calculate viewport offset to centre on player
  const offsetX = Math.max(0, Math.min(player.x - Math.floor(VIEW_COLS / 2), GRID_COLS - VIEW_COLS));
  const offsetY = Math.max(0, Math.min(player.y - Math.floor(VIEW_ROWS / 2), GRID_ROWS - VIEW_ROWS));

  let html = '';
  for (let vy = 0; vy < VIEW_ROWS; vy++) {
    for (let vx = 0; vx < VIEW_COLS; vx++) {
      const mx = offsetX + vx;
      const my = offsetY + vy;
      const vis = getTileVisibility(mx, my);

      if (vis === 0) {
        html += '<div class="tile tile--fog"></div>';
        continue;
      }

      const tile = map[my]?.[mx] ?? TILE.WALL;
      let tileClass = TILE_CLASSES[tile] || 'tile--wall';
      let content = TILE_SYMBOLS[tile] || '#';
      let extraClass = vis === 1 ? ' tile--dim' : '';

      // Check if player is here
      if (mx === player.x && my === player.y) {
        tileClass = 'tile--player';
        content = '@';
        extraClass = '';
      } else if (vis === 2) {
        // Check enemies
        const enemy = enemies.find(e => e.alive && e.x === mx && e.y === my);
        if (enemy) {
          tileClass = 'tile--enemy';
          content = enemy.symbol;
        }
      }

      html += `<div class="tile ${tileClass}${extraClass}">${content}</div>`;
    }
  }

  grid.innerHTML = '';
  grid.insertAdjacentHTML('beforeend', html);
}

/**
 * Renders the minimap
 */
export function renderMinimap() {
  const state = getState();
  const { map, player } = state;
  const minimap = document.getElementById('minimap');

  let html = '';
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const vis = getTileVisibility(x, y);
      let cls = 'mini--fog';

      if (x === player.x && y === player.y) {
        cls = 'mini--player';
      } else if (vis > 0) {
        const tile = map[y][x];
        cls = tile === TILE.WALL ? 'mini--wall' : 'mini--floor';
      }

      html += `<div class="mini ${cls}"></div>`;
    }
  }

  minimap.innerHTML = '';
  minimap.insertAdjacentHTML('beforeend', html);
}

/**
 * Updates the HUD with current player stats
 */
export function renderHUD() {
  const state = getState();
  const { player, equipped } = state;
  const stats = getEffectiveStats();

  document.getElementById('player-level').textContent = `Lv. ${player.level}`;
  document.getElementById('hp-fill').style.width = `${(player.hp / player.maxHp) * 100}%`;
  document.getElementById('hp-label').textContent = `${player.hp}/${player.maxHp}`;
  document.getElementById('mp-fill').style.width = `${(player.mp / player.maxMp) * 100}%`;
  document.getElementById('mp-label').textContent = `${player.mp}/${player.maxMp}`;
  document.getElementById('xp-fill').style.width = `${(player.xp / player.xpToNext) * 100}%`;
  document.getElementById('xp-label').textContent = `${player.xp}/${player.xpToNext} XP`;
  document.getElementById('stat-atk').textContent = stats.atk;
  document.getElementById('stat-def').textContent = stats.def;
  document.getElementById('stat-spd').textContent = stats.spd;
  document.getElementById('equipped-weapon').textContent = equipped.weapon ? `${equipped.weapon.name} (+${equipped.weapon.atk})` : 'None';
  document.getElementById('equipped-armour').textContent = equipped.armour ? `${equipped.armour.name} (+${equipped.armour.def})` : 'None';
  document.getElementById('floor-display').textContent = `Floor: ${state.floor}`;
  document.getElementById('score-display').textContent = `Score: ${state.score}`;
}

/**
 * Appends messages to the combat log
 */
export function renderLog() {
  const state = getState();
  const log = document.getElementById('combat-log');
  log.innerHTML = '';

  for (const msg of state.messages) {
    const li = document.createElement('li');
    li.textContent = `> ${msg.text}`;
    li.classList.add(`log--${msg.type}`);
    log.appendChild(li);
  }
  log.scrollTop = log.scrollHeight;
}

/**
 * Renders the combat overlay
 */
export function renderCombat() {
  const state = getState();
  const combat = state.combatState;
  if (!combat) return;

  const { enemy } = combat;
  document.getElementById('combat-enemy-name').textContent = `${enemy.name} (Floor ${state.floor})`;
  document.getElementById('enemy-hp-fill').style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
  document.getElementById('enemy-hp-label').textContent = `${enemy.hp}/${enemy.maxHp}`;

  const { player } = state;
  document.getElementById('combat-player-hp-fill').style.width = `${(player.hp / player.maxHp) * 100}%`;
  document.getElementById('combat-player-hp-label').textContent = `${player.hp}/${player.maxHp}`;

  const feed = document.getElementById('combat-feed');
  feed.innerHTML = '';
  for (const msg of combat.messages) {
    const li = document.createElement('li');
    li.textContent = `> ${msg}`;
    feed.appendChild(li);
  }
  feed.scrollTop = feed.scrollHeight;

  const finished = combat.finished;
  document.getElementById('btn-attack').disabled = finished;
  document.getElementById('btn-defend').disabled = finished;
  document.getElementById('btn-flee').disabled = finished;
}

/**
 * Renders the inventory overlay
 */
export function renderInventory() {
  const state = getState();
  const { inventory, equipped } = state;
  const grid = document.getElementById('inventory-grid');

  document.getElementById('inv-weapon-name').textContent = equipped.weapon ? `${equipped.weapon.icon} ${equipped.weapon.name}` : 'Empty';
  document.getElementById('inv-armour-name').textContent = equipped.armour ? `${equipped.armour.icon} ${equipped.armour.name}` : 'Empty';

  grid.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const slot = document.createElement('div');
    slot.classList.add('inventory__item');
    slot.dataset.index = i;

    if (i < inventory.length) {
      const item = inventory[i];
      slot.textContent = `${item.icon} ${item.name}`;
      slot.classList.add('inventory__item--filled');
    } else {
      slot.textContent = '—';
      slot.classList.add('inventory__item--empty');
    }

    grid.appendChild(slot);
  }
}
