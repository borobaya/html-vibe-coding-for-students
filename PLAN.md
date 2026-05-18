# The "Crisis Mode" Grid Simulator

A single-page web app where you balance the energy grid during absurd, escalating crises. High-stakes, fast-paced, and gamified.

---

# Design Thinking

- **Purpose:** A fun, interactive simulator that teaches grid-balancing concepts through humour and urgency. The user is the "grid operator" trying to keep the lights on.
- **Tone:** Retro-futuristic control room meets arcade chaos. Think NASA mission control crossed with a 1980s sci-fi movie — glowing terminal greens, pulsing warnings, CRT scanline vibes, but modern and crisp.
- **Constraints:** HTML + CSS + vanilla JS. Dark mode only. Responsive at laptop width. No frameworks.
- **Differentiation:** The escalating absurdity of the crises combined with the tension of a ticking gauge. The moment the grid hits "BLACKOUT" and the screen goes dark is unforgettable.

---

## Frontend Aesthetics Guidelines

- **Typography:** Use a monospace display font for headings and readouts (e.g., "Share Tech Mono" or "Space Mono") paired with a clean sans-serif for body text (e.g., "Exo 2"). Numbers on gauges and sliders should feel like control-room instruments.
- **Color & Theme:** Deep charcoal/near-black background. Neon green for "Stable", electric amber for "Overloaded", and pulsing red for "Blackout". Use CSS variables for all status colours. Accent with cyan or electric blue for interactive elements.
- **Motion:** Pulsing glow on the grid gauge when unstable. Screen shake or red flash when critical. Smooth slider transitions. Staggered fade-in on incident log entries. CSS keyframe animations only — no libraries.
- **Spatial Composition:** Top-heavy layout — the gauge dominates the top third. Sliders and controls sit in a dense instrument-panel grid below. The incident log scrolls in a sidebar or bottom panel like a live terminal feed.
- **Backgrounds & Visual Details:** Subtle scanline overlay on the whole page. Faint grid-line pattern behind the main content. Glowing drop-shadows on status indicators. Noise texture at low opacity for depth.

---

## Feature Areas to Include

### 1. Grid Balance Gauge (Top of Page)

- Large, prominent visual indicator showing grid stability from 0–100%
- Three zones: **Stable** (green, 70–100%), **Overloaded** (amber, 30–69%), **Blackout** (red, 0–29%)
- Animated needle or bar that responds in real time to slider and button changes
- Visual/audio alert when entering critical zones (screen flash, pulsing border)

### 2. Power Generation Sliders

- 3–4 interactive range sliders representing energy sources:
  - ☀️ Solar Array
  - ⚛️ Nuclear Core
  - 🐹 Giant Hamster Wheel
  - 💨 Wind Turbines (optional 4th)
- Each slider shows current output in MW
- Adjusting sliders immediately affects the grid gauge
- Sliders can be "knocked offline" by crisis events (greyed out, disabled temporarily)

### 3. Live Incident Log

- A scrolling feed that generates a random funny crisis every 20 seconds
- Example crises:
  - "A rogue squirrel has chewed through Main Transformer 4"
  - "A sudden cloud covers the entire solar farm"
  - "The hamsters have unionised and are demanding better seeds"
  - "Someone plugged a crypto mining rig into the hospital backup"
  - "A flock of seagulls has nested inside Wind Turbine 7"
- Each incident reduces grid stability or disables a power source
- Entries appear with a timestamp and severity icon

### 4. Power Routing Buttons

- Interactive buttons to route power to different sectors:
  - 🏥 Hospital
  - 💰 Cryptocurrency Mine
  - 🚗 The CEO's Electric Vehicle
  - 🏠 Residential District
- Each sector has a power demand value
- Routing power to a sector costs stability — the player must prioritise
- Visual feedback: sector lights up when powered, dims when cut off

### 5. Score & Status Bar

- Running score based on how long the grid stays stable
- Crisis counter: how many incidents survived
- Timer showing elapsed session time
- "Game Over" state when grid hits 0% — screen goes dark with a dramatic blackout animation and a "Try Again" button

---

## UX & Design Requirements

- **Layout:** Single page, no navigation needed. Top-to-bottom flow: Gauge → Sliders → Routing Buttons → Incident Log (or incident log as a side panel on wider screens)
- **Default state:** Grid starts at 85% stability. First crisis arrives after 10 seconds.
- **Responsive:** Looks good at ~1200px laptop width. Stacks vertically on narrower screens.
- **Sound effects:** Optional toggle. Short beep on crisis arrival. Alarm tone when critical. Satisfying click on button presses.
- **Empty/calm state:** When grid is stable and no active crises, show a calm green glow and a message like "All systems nominal. Enjoy it while it lasts…"

---

## Sample Data to Preload

### Power Sources (starting values)
| Source | Default Output | Max Output |
|--------|---------------|------------|
| Solar Array | 30 MW | 50 MW |
| Nuclear Core | 45 MW | 60 MW |
| Giant Hamster Wheel | 10 MW | 20 MW |
| Wind Turbines | 20 MW | 40 MW |

### Sector Demands
| Sector | Power Demand |
|--------|-------------|
| Hospital | 25 MW |
| Cryptocurrency Mine | 35 MW |
| CEO's Electric Vehicle | 15 MW |
| Residential District | 30 MW |

### Crisis Pool (at least 10 random events)
Each crisis has: message text, severity (Minor / Major / Critical), effect (reduce stability %, disable a source, or increase a sector's demand)