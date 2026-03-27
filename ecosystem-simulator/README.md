[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Ecosystem Simulator

A real-time ecosystem simulation rendered on HTML5 Canvas where predator and prey agents
roam, hunt, reproduce, and die based on simple AI behaviours. Population levels fluctuate
dynamically and are tracked in a live graph, letting you observe emergent patterns like
boom-and-bust cycles. Tweak parameters such as spawn rate, speed, and energy to see how
small changes ripple through the ecosystem.

## Features

- **Predator and prey agents** — two species with distinct colours and behaviours move
  autonomously across the canvas
- **Simple AI** — prey wander and flee from nearby predators; predators chase the closest
  prey to hunt
- **Energy system** — agents consume energy as they move; predators gain energy by eating
  prey, and agents die when energy reaches zero
- **Reproduction** — agents reproduce when their energy exceeds a threshold, spawning
  offspring nearby
- **Live population graph** — a real-time line chart tracks predator and prey counts over
  time, visualising population dynamics
- **Adjustable parameters** — sliders and inputs let you control spawn rate, agent speed,
  starting energy, and reproduction threshold
- **Play / Pause / Reset** — full simulation controls to start, stop, and restart the
  environment
- **Responsive canvas** — the simulation area scales to fit the browser window

## How to Use

1. Open the app in your browser.
2. Press **Start** to begin the simulation with default settings.
3. Watch predator (red) and prey (green) agents interact on the canvas.
4. Monitor the **population graph** below the canvas to see how numbers change over time.
5. Use the **control panel** to adjust parameters while the simulation is running.
6. Press **Pause** to freeze the simulation or **Reset** to clear and start fresh.

## Controls

| Control                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| Start / Pause            | Toggle the simulation loop                       |
| Reset                    | Clear all agents and reset the graph             |
| Spawn Rate               | How frequently new agents appear                 |
| Agent Speed              | Movement speed for predators and prey             |
| Starting Energy          | Energy each agent begins with                    |
| Reproduction Threshold   | Energy level at which an agent reproduces         |
| Initial Prey Count       | Number of prey spawned on reset                  |
| Initial Predator Count   | Number of predators spawned on reset             |

## Project Structure

```text
ecosystem-simulator/
├── index.html
├── js/
│   ├── main.js
│   └── modules/
│       ├── agent.js
│       ├── simulation.js
│       └── graph.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5 Canvas** — rendering agents and the simulation environment
- **CSS3** — layout, control panel styling, and responsive design
- **JavaScript (ES2022+)** — simulation logic, AI behaviours, and live graphing

## Getting Started

Clone the repository and open the project directly in your browser:

```bash
# Option 1 — open the file directly
open ecosystem-simulator/index.html

# Option 2 — serve locally
cd ecosystem-simulator && python3 -m http.server 5500
# then visit http://localhost:5500
```
