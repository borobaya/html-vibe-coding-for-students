/**
 * File: inventory.js
 * Description: Inventory management — add, remove, equip, use, discard
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { MAX_INVENTORY } from './config.js';
import { getState, addMessage } from './state.js';

/**
 * Adds an item to inventory
 * @param {Object} item
 * @returns {boolean} True if added successfully
 */
export function addItem(item) {
  const state = getState();
  if (state.inventory.length >= MAX_INVENTORY) {
    addMessage('Inventory full! Item discarded.', 'normal');
    return false;
  }
  state.inventory.push(item);
  return true;
}

/**
 * Removes an item by index
 * @param {number} index
 */
export function removeItem(index) {
  const state = getState();
  if (index >= 0 && index < state.inventory.length) {
    state.inventory.splice(index, 1);
  }
}

/**
 * Equips a weapon or armour from inventory
 * @param {number} index
 */
export function equipItem(index) {
  const state = getState();
  const item = state.inventory[index];
  if (!item) return;

  if (item.type === 'weapon') {
    // Swap current weapon to inventory if one is equipped
    if (state.equipped.weapon) {
      state.inventory.push(state.equipped.weapon);
    }
    state.equipped.weapon = item;
    state.inventory.splice(index, 1);
    addMessage(`Equipped ${item.name}.`, 'normal');
  } else if (item.type === 'armour') {
    if (state.equipped.armour) {
      state.inventory.push(state.equipped.armour);
    }
    state.equipped.armour = item;
    state.inventory.splice(index, 1);
    addMessage(`Equipped ${item.name}.`, 'normal');
  }
}

/**
 * Uses a consumable item
 * @param {number} index
 */
export function useItem(index) {
  const state = getState();
  const item = state.inventory[index];
  if (!item) return;

  const { player } = state;

  if (item.type === 'potion_hp') {
    const healed = Math.min(item.heal, player.maxHp - player.hp);
    player.hp += healed;
    addMessage(`Used ${item.name}. (+${healed} HP)`, 'heal');
    state.inventory.splice(index, 1);
  } else if (item.type === 'potion_mp') {
    const restored = Math.min(item.heal, player.maxMp - player.mp);
    player.mp += restored;
    addMessage(`Used ${item.name}. (+${restored} MP)`, 'heal');
    state.inventory.splice(index, 1);
  }
}

/**
 * Discards an item from inventory
 * @param {number} index
 */
export function discardItem(index) {
  const state = getState();
  const item = state.inventory[index];
  if (!item) return;
  addMessage(`Discarded ${item.name}.`, 'normal');
  state.inventory.splice(index, 1);
}
