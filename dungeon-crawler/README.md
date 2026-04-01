[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Dungeon Crawler

A grid-based dungeon exploration game built with vanilla JavaScript. Navigate procedurally generated dungeon floors, battle monsters in turn-based combat, collect loot and potions, and see how deep you can descend before your health runs out.

## Features

- Procedurally generated dungeon maps with rooms, corridors, and hidden paths
- Turn-based combat system with attack, defend, and flee options
- Enemy variety including skeletons, goblins, slimes, and floor bosses
- Inventory system for managing weapons, armour, and consumables
- Loot drops from defeated enemies and treasure chests scattered across the map
- Health and mana bars with potion-based recovery
- Fog of war that reveals tiles as the player explores
- Multiple dungeon floors with increasing difficulty
- Player stats (attack, defence, speed) that scale with equipped gear
- Game over and victory screens with run summary

## How to Play

1. Open the game and start a new run.
2. Move your character through the dungeon grid to explore rooms and corridors.
3. Walk into an enemy tile to initiate turn-based combat.
4. During combat, choose to **Attack**, **Defend**, or **Flee** each turn.
5. Defeat enemies to earn loot — equip weapons and armour from your inventory to get stronger.
6. Pick up potions and use them to restore health or mana between fights.
7. Find the staircase on each floor to descend deeper into the dungeon.
8. Survive as many floors as possible and aim for a high score.

## Controls

| Key | Action |
| --- | --- |
| `W` / `↑` | Move up |
| `A` / `←` | Move left |
| `S` / `↓` | Move down |
| `D` / `→` | Move right |
| `I` | Open / close inventory |
| `E` | Interact (open chests, use stairs) |
| `1` / `2` / `3` | Select combat action (Attack / Defend / Flee) |

## Project Structure

```text
dungeon-crawler/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── dungeon.js
│       ├── player.js
│       ├── enemies.js
│       ├── combat.js
│       ├── inventory.js
│       └── renderer.js
├── styles/
│   └── main.css
├── assets/
│   └── sprites/
└── README.md
```

## Tech Stack

- **HTML5** — Game layout and UI panels
- **CSS3** — Grid rendering, animations, and responsive styling
- **JavaScript (ES2022+)** — Game logic, procedural generation, and state management

## Getting Started

No build tools or dependencies required. To run locally:

1. Open `index.html` directly in your browser, or start the website from the project root:

   ```bash
   python3 server.py
   ```

   Then visit `http://localhost:5500/dungeon-crawler` in your browser.
