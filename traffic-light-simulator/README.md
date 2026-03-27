[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Traffic Light Simulator

An interactive traffic light simulator that models a road intersection with realistic signal cycling, vehicle behaviour, and pedestrian crossings. Watch cars stop at red lights and move on green, trigger pedestrian crossing phases, and fine-tune signal timing — all rendered live on an HTML5 Canvas.

## Features

- **Traffic light cycling** — Lights transition through red, amber, and green in a realistic sequence with configurable durations
- **Multi-directional intersection** — Opposing traffic flows are managed so that one direction gets a green phase while the other holds on red
- **Vehicle simulation** — Cars approach the intersection, decelerate and stop at red lights, then accelerate away when the light turns green
- **Pedestrian crossings** — A dedicated pedestrian phase can be triggered, stopping all vehicle traffic and displaying a walk signal
- **Adjustable timing controls** — Sliders let you change the duration of the red, amber, and green phases in real time
- **Pedestrian request button** — A button simulates pressing the crossing button at a real intersection, queuing a pedestrian phase into the next cycle
- **Smooth animations** — Vehicles and light transitions are rendered at 60 fps on the canvas for fluid motion
- **Day/night indicator** — Visual cues on the canvas reflect the current signal state with glowing light effects

## How to Use

1. Open the simulator in your browser.
2. The intersection begins cycling automatically — watch vehicles approach and respond to the lights.
3. Use the timing sliders in the control panel to adjust how long each light phase lasts.
4. Click the **Request Crossing** button to queue a pedestrian phase into the next cycle.
5. Observe how vehicles stop behind the line during red and pedestrian phases, then move off when green resumes.

## Controls

| Control | Description |
|---------|-------------|
| Red duration slider | Sets how long the red light stays on (seconds) |
| Amber duration slider | Sets how long the amber light stays on (seconds) |
| Green duration slider | Sets how long the green light stays on (seconds) |
| Request Crossing button | Triggers a pedestrian crossing phase in the next cycle |

## Project Structure

```text
traffic-light-simulator/
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

- **HTML5 Canvas** — Renders the intersection, vehicles, lights, and pedestrian crossing
- **CSS3** — Styles the control panel, layout, and responsive design
- **JavaScript (ES2022+)** — Handles signal state logic, vehicle AI, animation loop, and user interaction

## Getting Started

Clone the repository and open the project directly in your browser:

```bash
cd traffic-light-simulator
open index.html
```

Or start a local server for a full development experience:

```bash
cd traffic-light-simulator
python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
