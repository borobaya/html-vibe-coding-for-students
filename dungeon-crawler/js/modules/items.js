/**
 * File: items.js
 * Description: Item definitions, loot tables, and drop logic
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { ITEMS } from './config.js';

/**
 * Rolls a random loot drop based on floor number
 * @param {number} floor
 * @returns {Object|null} An item object or null
 */
export function rollLoot(floor) {
  // 60% chance to drop something
  if (Math.random() > 0.6) return null;

  // Higher floors have access to better gear
  const maxTier = Math.min(ITEMS.length, 4 + Math.floor(floor * 0.8));
  const availableItems = ITEMS.slice(0, maxTier);

  // Potions are more common
  const roll = Math.random();
  if (roll < 0.4) {
    // Drop a potion
    const potions = availableItems.filter(i => i.type.startsWith('potion'));
    if (potions.length > 0) {
      return { ...potions[Math.floor(Math.random() * potions.length)] };
    }
  }

  const item = availableItems[Math.floor(Math.random() * availableItems.length)];
  return { ...item };
}

/**
 * Gets an item by its ID
 * @param {string} itemId
 * @returns {Object|null}
 */
export function getItemById(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  return item ? { ...item } : null;
}

/**
 * Rolls a chest loot drop (better odds, always drops)
 * @param {number} floor
 * @returns {Object}
 */
export function rollChestLoot(floor) {
  const maxTier = Math.min(ITEMS.length, 5 + Math.floor(floor * 0.8));
  const availableItems = ITEMS.slice(0, maxTier);
  const item = availableItems[Math.floor(Math.random() * availableItems.length)];
  return { ...item };
}
