/**
 * File: dungeon.js
 * Description: Procedural dungeon generation — rooms, corridors, entity placement
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { GRID_COLS, GRID_ROWS, TILE, ENEMY_TYPES } from './config.js';

/**
 * Generates a new floor map
 * @param {number} floorNumber - Current floor for difficulty scaling
 * @returns {{ map: number[][], enemies: Array, playerStart: {x,y} }}
 */
export function generateFloor(floorNumber) {
  // Initialise map with walls
  const map = [];
  for (let y = 0; y < GRID_ROWS; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      map[y][x] = TILE.WALL;
    }
  }

  // Generate rooms
  const rooms = [];
  const roomCount = 6 + Math.floor(Math.random() * 4) + Math.floor(floorNumber * 0.5);

  for (let i = 0; i < roomCount * 3; i++) {
    if (rooms.length >= roomCount) break;

    const w = 4 + Math.floor(Math.random() * 6);
    const h = 4 + Math.floor(Math.random() * 5);
    const x = 1 + Math.floor(Math.random() * (GRID_COLS - w - 2));
    const y = 1 + Math.floor(Math.random() * (GRID_ROWS - h - 2));

    // Check overlap
    let overlaps = false;
    for (const room of rooms) {
      if (x < room.x + room.w + 1 && x + w + 1 > room.x &&
          y < room.y + room.h + 1 && y + h + 1 > room.y) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;

    rooms.push({ x, y, w, h });

    // Carve room
    for (let ry = y; ry < y + h; ry++) {
      for (let rx = x; rx < x + w; rx++) {
        map[ry][rx] = TILE.FLOOR;
      }
    }
  }

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    const a = roomCenter(rooms[i - 1]);
    const b = roomCenter(rooms[i]);
    carveCorridor(map, a.x, a.y, b.x, b.y);
  }

  // Place player in first room
  const firstCenter = roomCenter(rooms[0]);
  const playerStart = { x: firstCenter.x, y: firstCenter.y };

  // Place stairs in last room
  const lastCenter = roomCenter(rooms[rooms.length - 1]);
  map[lastCenter.y][lastCenter.x] = TILE.STAIRS;

  // Place enemies in rooms (skip first and last)
  const enemies = [];
  const availableTypes = getAvailableEnemies(floorNumber);

  for (let i = 1; i < rooms.length - 1; i++) {
    const enemyCount = 1 + Math.floor(Math.random() * Math.min(3, Math.ceil(floorNumber / 2)));
    for (let e = 0; e < enemyCount; e++) {
      const pos = randomFloorInRoom(map, rooms[i]);
      if (pos && !(pos.x === playerStart.x && pos.y === playerStart.y)) {
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const scaleFactor = 1 + (floorNumber - 1) * 0.15;
        enemies.push({
          id: `enemy_${i}_${e}`,
          type: type.id,
          name: type.name,
          symbol: type.symbol,
          x: pos.x,
          y: pos.y,
          hp: Math.floor(type.baseHp * scaleFactor),
          maxHp: Math.floor(type.baseHp * scaleFactor),
          atk: Math.floor(type.baseAtk * scaleFactor),
          def: Math.floor(type.baseDef * scaleFactor),
          xp: Math.floor(type.xp * scaleFactor),
          alive: true,
        });
      }
    }
  }

  // Place chests and potions in some rooms
  for (let i = 1; i < rooms.length; i++) {
    if (Math.random() < 0.4) {
      const pos = randomFloorInRoom(map, rooms[i]);
      if (pos && map[pos.y][pos.x] === TILE.FLOOR) {
        map[pos.y][pos.x] = TILE.CHEST;
      }
    }
    if (Math.random() < 0.3) {
      const pos = randomFloorInRoom(map, rooms[i]);
      if (pos && map[pos.y][pos.x] === TILE.FLOOR) {
        map[pos.y][pos.x] = TILE.POTION;
      }
    }
  }

  return { map, enemies, playerStart };
}

function roomCenter(room) {
  return {
    x: Math.floor(room.x + room.w / 2),
    y: Math.floor(room.y + room.h / 2),
  };
}

function carveCorridor(map, x1, y1, x2, y2) {
  let x = x1;
  let y = y1;

  // Horizontal first, then vertical (or vice versa randomly)
  if (Math.random() < 0.5) {
    while (x !== x2) {
      map[y][x] = TILE.FLOOR;
      x += x < x2 ? 1 : -1;
    }
    while (y !== y2) {
      map[y][x] = TILE.FLOOR;
      y += y < y2 ? 1 : -1;
    }
  } else {
    while (y !== y2) {
      map[y][x] = TILE.FLOOR;
      y += y < y2 ? 1 : -1;
    }
    while (x !== x2) {
      map[y][x] = TILE.FLOOR;
      x += x < x2 ? 1 : -1;
    }
  }
  map[y][x] = TILE.FLOOR;
}

function randomFloorInRoom(map, room) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const x = room.x + 1 + Math.floor(Math.random() * (room.w - 2));
    const y = room.y + 1 + Math.floor(Math.random() * (room.h - 2));
    if (map[y][x] === TILE.FLOOR) {
      return { x, y };
    }
  }
  return null;
}

function getAvailableEnemies(floor) {
  if (floor <= 2) return ENEMY_TYPES.slice(0, 2);
  if (floor <= 4) return ENEMY_TYPES.slice(0, 3);
  if (floor <= 6) return ENEMY_TYPES.slice(0, 4);
  if (floor <= 9) return ENEMY_TYPES.slice(0, 5);
  return ENEMY_TYPES;
}
