/**
 * File: config.js
 * Description: Game constants — grid dimensions, stats, loot tables, scaling
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

export const TILE_SIZE = 40;
export const GRID_COLS = 40;
export const GRID_ROWS = 30;
export const VIEW_COLS = 20;
export const VIEW_ROWS = 15;
export const FOG_RADIUS = 4;

export const TILE = {
  WALL: 0,
  FLOOR: 1,
  STAIRS: 2,
  CHEST: 3,
  CHEST_OPENED: 4,
  POTION: 5,
};

export const BASE_PLAYER_STATS = {
  maxHp: 100,
  maxMp: 30,
  atk: 5,
  def: 3,
  spd: 4,
  xpToNext: 100,
};

// XP needed per level: level * 100
export function xpForLevel(level) {
  return level * 100;
}

export const ENEMY_TYPES = [
  { id: 'slime',    name: 'Slime',    baseHp: 15, baseAtk: 3,  baseDef: 1, xp: 15, symbol: 'S' },
  { id: 'goblin',   name: 'Goblin',   baseHp: 25, baseAtk: 5,  baseDef: 2, xp: 25, symbol: 'G' },
  { id: 'skeleton', name: 'Skeleton', baseHp: 35, baseAtk: 7,  baseDef: 4, xp: 40, symbol: 'K' },
  { id: 'orc',      name: 'Orc',      baseHp: 50, baseAtk: 10, baseDef: 6, xp: 60, symbol: 'O' },
  { id: 'wraith',   name: 'Wraith',   baseHp: 40, baseAtk: 12, baseDef: 3, xp: 55, symbol: 'W' },
  { id: 'dragon',   name: 'Dragon',   baseHp: 100,baseAtk: 18, baseDef: 10,xp: 150,symbol: 'D' },
];

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOUR: 'armour',
  POTION_HP: 'potion_hp',
  POTION_MP: 'potion_mp',
};

export const ITEMS = [
  { id: 'rusty_dagger',    name: 'Rusty Dagger',    type: 'weapon', atk: 2,  icon: '🗡' },
  { id: 'iron_sword',      name: 'Iron Sword',      type: 'weapon', atk: 4,  icon: '⚔' },
  { id: 'steel_blade',     name: 'Steel Blade',     type: 'weapon', atk: 7,  icon: '⚔' },
  { id: 'magic_staff',     name: 'Magic Staff',     type: 'weapon', atk: 10, icon: '🪄' },
  { id: 'dragon_slayer',   name: 'Dragon Slayer',   type: 'weapon', atk: 15, icon: '⚔' },
  { id: 'cloth_armour',    name: 'Cloth Armour',    type: 'armour', def: 2,  icon: '👕' },
  { id: 'leather_armour',  name: 'Leather Armour',  type: 'armour', def: 3,  icon: '🛡' },
  { id: 'chain_mail',      name: 'Chain Mail',      type: 'armour', def: 5,  icon: '🛡' },
  { id: 'plate_armour',    name: 'Plate Armour',    type: 'armour', def: 8,  icon: '🛡' },
  { id: 'health_potion',   name: 'Health Potion',   type: 'potion_hp', heal: 30, icon: '❤' },
  { id: 'big_health_potion', name: 'Big Health Pot',type: 'potion_hp', heal: 60, icon: '❤' },
  { id: 'mana_potion',     name: 'Mana Potion',     type: 'potion_mp', heal: 20, icon: '💧' },
];

export const MAX_INVENTORY = 16;
