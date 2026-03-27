[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Tower Defence

A strategy game where you defend your base by placing turrets along a winding path to stop waves of enemies. Choose from multiple turret types, upgrade your defences, and manage your gold to survive increasingly difficult waves. Built with vanilla JavaScript and HTML5 Canvas.

## Features

- **Wave-based gameplay** with progressively harder enemies each round
- **Multiple turret types** with unique stats, range, and attack styles
- **Upgrade system** to boost turret damage, range, and fire rate
- **Enemy variety** including fast scouts, armoured tanks, and healing units
- **Gold economy** earned from defeating enemies, spent on turrets and upgrades
- **Lives system** — enemies that reach the end cost you lives
- **Interactive grid** for placing and selling turrets along the path
- **Wave counter and stats panel** showing current wave, gold, and lives
- **Start wave button** so you can prepare your defences before each round
- **Visual projectiles and hit effects** rendered on the canvas
- **Responsive layout** that works on different screen sizes

## How to Play

1. Open the game and review the map — enemies follow the highlighted path
2. Select a turret type from the build menu
3. Click on a valid grid tile next to the path to place a turret
4. Press **Start Wave** when you are ready
5. Turrets automatically target and fire at enemies in range
6. Earn gold for each enemy defeated and spend it on new turrets or upgrades
7. Click an existing turret to upgrade or sell it
8. Survive as many waves as possible — the game ends when you run out of lives

## Controls

| Input | Action |
|---|---|
| **Left Click** (on menu) | Select a turret type to build |
| **Left Click** (on grid) | Place the selected turret |
| **Left Click** (on turret) | Open upgrade / sell panel |
| **Start Wave button** | Send the next wave of enemies |

## Turret Types

| Turret | Cost | Damage | Range | Fire Rate | Special |
|---|---|---|---|---|---|
| **Arrow Tower** | 50g | Low | Medium | Fast | Cheap and reliable starter turret |
| **Cannon** | 100g | High | Short | Slow | Splash damage hits nearby enemies |
| **Sniper** | 150g | Very High | Long | Very Slow | Prioritises strongest enemy in range |
| **Freeze Tower** | 120g | None | Medium | Medium | Slows enemies passing through its range |

Each turret can be upgraded up to three times, improving its core stats.

## Project Structure

```text
tower-defence/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Canvas element for game rendering and UI layout
- **CSS3** — Styling for menus, panels, and responsive design
- **JavaScript (ES2022+)** — Game loop, enemy AI, turret logic, and wave management

## Getting Started

Clone the repository and open the project folder:

```bash
cd tower-defence
```

Then either open `index.html` directly in your browser, or start a local server:

```bash
python3 -m http.server 5500
```

Visit `http://localhost:5500` to play.
