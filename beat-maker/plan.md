# Beat Maker — Implementation Plan

## 1. Overview

A browser-based drum machine and beat maker built with vanilla HTML, CSS, and JavaScript (ES2022+). The app presents a step-sequencer grid where each row represents an instrument (kick, snare, hi-hat, clap, etc.) and each column represents a time step (16 steps = one bar of 4/4 time at 16th-note resolution). Users toggle cells on/off to build patterns, press Play to loop the pattern, adjust tempo via a BPM slider, and control per-instrument and master volume. All audio is powered by the Web Audio API for low-latency, sample-accurate playback. No frameworks, no build tools, no dependencies.

### Core Feature Set

- **Step sequencer grid**: 6 instrument rows × 16 step columns (expandable).
- **Transport controls**: Play, Stop, Clear.
- **Tempo control**: BPM slider (60–200 BPM, default 120).
- **Volume controls**: Master volume knob/slider + per-instrument volume sliders.
- **Visual playhead**: Animated column highlight showing the current step during playback.
- **Toggle pads**: Click/tap a cell to activate/deactivate a beat at that position.
- **Instrument labels**: Clearly labelled rows with instrument names and optional icons.
- **Responsive design**: Works on desktop, tablet, and mobile.

---

## 2. Page Layout

### Wireframe Description

```text
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🥁 Beat Maker                                            │  │
│  │  [subtitle: "Build beats. Layer loops. Make music."]      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  TRANSPORT BAR                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [▶ Play] [■ Stop] [✕ Clear]   BPM: [====●=====] 120     │  │
│  │                                 Vol: [====●=====] 80%     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  SEQUENCER GRID                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         │ 1  2  3  4 │ 5  6  7  8 │ 9 10 11 12│13 14 15 16│ │
│  │  ───────┼────────────┼────────────┼───────────┼───────────│ │
│  │  Kick   │ ●  .  .  . │ .  .  .  . │ ●  .  .  .│ .  .  .  .│ │
│  │  Snare  │ .  .  .  . │ ●  .  .  . │ .  .  .  .│ ●  .  .  .│ │
│  │  Hi-Hat │ ●  .  ●  . │ ●  .  ●  . │ ●  .  ●  .│ ●  .  ●  .│ │
│  │  Clap   │ .  .  .  . │ ●  .  .  . │ .  .  .  .│ ●  .  .  .│ │
│  │  Tom    │ .  .  .  . │ .  .  .  ● │ .  .  .  .│ .  .  .  ●│ │
│  │  Rim    │ .  .  ●  . │ .  .  .  . │ .  .  ●  .│ .  .  .  .│ │
│  │  ───────┼────────────┼────────────┼───────────┼───────────│ │
│  │  [vol]  │  ▲ playhead highlight on current column          │ │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  FOOTER                                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Built with Web Audio API · Keyboard: Space=Play/Stop     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Layout Zones (Top to Bottom)

| Zone | Content | Behaviour |
|---|---|---|
| **Header** | App title "Beat Maker", tagline | Fixed at top, always visible |
| **Transport Bar** | Play/Stop/Clear buttons, BPM slider + readout, master volume slider + readout | Sticky below header so controls remain accessible while scrolling grid on small screens |
| **Sequencer Grid** | Instrument labels (left column), 16 step-cell columns, per-instrument volume sliders (right column) | Horizontally scrollable on very small screens; divided into 4-step groups with subtle visual separators for readability |
| **Footer** | Keyboard shortcuts hint, attribution | Fixed at bottom or static |

### Grid Detail

- **Rows**: 6 instruments by default (Kick, Snare, Hi-Hat, Clap, Tom, Rim).
- **Columns**: 16 steps (one bar of 16th notes).
- **Beat grouping**: Visual dividers every 4 columns to show beat boundaries (beat 1, 2, 3, 4).
- **Column headers**: Step numbers 1–16 displayed above the grid.
- **Row labels**: Instrument name to the left of each row.
- **Per-instrument volume**: Small horizontal slider to the right of each row.

---

## 3. Colour Scheme and Typography

### Colour Palette — Dark Studio Theme

| Role | Colour | Hex Code | Usage |
|---|---|---|---|
| **Background (primary)** | Near-black | `#0D0D0D` | Page body, main canvas |
| **Surface** | Dark grey | `#1A1A2E` | Grid container, transport bar background |
| **Surface raised** | Slate | `#16213E` | Inactive pad cells, card backgrounds |
| **Border / separator** | Charcoal | `#2A2A3D` | Grid lines, beat-group dividers |
| **Text primary** | Off-white | `#E0E0E0` | Headings, instrument labels, readouts |
| **Text secondary** | Muted grey | `#8888AA` | Subtitle, footer text, step numbers |
| **Accent — active pad** | Neon cyan | `#00F5D4` | Toggled-on pad cells (glow) |
| **Accent — playhead** | Neon magenta | `#F72585` | Current-step column highlight |
| **Accent — play button** | Neon green | `#39FF14` | Play button active state |
| **Accent — stop button** | Neon red | `#FF3131` | Stop button |
| **Accent — clear button** | Amber/yellow | `#FFD60A` | Clear button |
| **Slider track** | Mid-grey | `#3A3A5C` | BPM and volume slider tracks |
| **Slider thumb** | Neon cyan | `#00F5D4` | Slider thumb / handle |

### CSS Variables Definition

```css
:root {
  --bg-primary: #0D0D0D;
  --bg-surface: #1A1A2E;
  --bg-raised: #16213E;
  --border: #2A2A3D;
  --text-primary: #E0E0E0;
  --text-secondary: #8888AA;
  --accent-active: #00F5D4;
  --accent-playhead: #F72585;
  --accent-play: #39FF14;
  --accent-stop: #FF3131;
  --accent-clear: #FFD60A;
  --slider-track: #3A3A5C;
  --slider-thumb: #00F5D4;
  --glow-active: 0 0 12px rgba(0, 245, 212, 0.6);
  --glow-playhead: 0 0 16px rgba(247, 37, 133, 0.5);
  --font-main: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### Typography

| Element | Font | Size | Weight | Colour |
|---|---|---|---|---|
| App title (h1) | `--font-main` | 28px | 700 (bold) | `--text-primary` |
| Subtitle | `--font-main` | 14px | 400 | `--text-secondary` |
| Instrument labels | `--font-mono` | 13px | 600 | `--text-primary` |
| Step numbers | `--font-mono` | 11px | 400 | `--text-secondary` |
| Button text | `--font-main` | 14px | 600 | Dark bg colour (for contrast) |
| BPM / vol readout | `--font-mono` | 16px | 700 | `--accent-active` |
| Footer | `--font-main` | 12px | 400 | `--text-secondary` |

### Glow Effects

- **Active pad**: `box-shadow: var(--glow-active);` with background set to `var(--accent-active)`.
- **Playhead column**: Each cell in the current column receives `box-shadow: var(--glow-playhead);` and a subtle background tint of `rgba(247, 37, 133, 0.15)`.
- **Buttons on hover**: Slight scale transform `scale(1.05)` and intensified glow.

---

## 4. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beat Maker</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <h1 class="header__title">🥁 Beat Maker</h1>
    <p class="header__subtitle">Build beats. Layer loops. Make music.</p>
  </header>

  <!-- MAIN -->
  <main class="app">

    <!-- TRANSPORT CONTROLS -->
    <section class="transport" aria-label="Transport controls">
      <div class="transport__buttons">
        <button id="btn-play" class="transport__btn transport__btn--play"
                aria-label="Play pattern" title="Play (Space)">
          ▶ Play
        </button>
        <button id="btn-stop" class="transport__btn transport__btn--stop"
                aria-label="Stop playback" title="Stop (Space)">
          ■ Stop
        </button>
        <button id="btn-clear" class="transport__btn transport__btn--clear"
                aria-label="Clear all pads" title="Clear pattern (C)">
          ✕ Clear
        </button>
      </div>

      <div class="transport__sliders">
        <div class="transport__slider-group">
          <label for="bpm-slider" class="transport__label">BPM</label>
          <input type="range" id="bpm-slider" class="transport__range"
                 min="60" max="200" value="120" step="1"
                 aria-label="Tempo in beats per minute">
          <output id="bpm-display" class="transport__readout"
                  for="bpm-slider">120</output>
        </div>

        <div class="transport__slider-group">
          <label for="master-volume" class="transport__label">Vol</label>
          <input type="range" id="master-volume" class="transport__range"
                 min="0" max="100" value="80" step="1"
                 aria-label="Master volume">
          <output id="volume-display" class="transport__readout"
                  for="master-volume">80%</output>
        </div>
      </div>
    </section>

    <!-- SEQUENCER GRID -->
    <section class="sequencer" aria-label="Step sequencer grid">

      <!-- Column step numbers (header row) -->
      <div class="sequencer__header">
        <div class="sequencer__corner"></div>
        <!-- Steps 1–16 generated by JS, or hard-coded: -->
        <div class="sequencer__step-number">1</div>
        <div class="sequencer__step-number">2</div>
        <!-- ... through 16 ... -->
        <div class="sequencer__step-number">16</div>
        <div class="sequencer__vol-header">Vol</div>
      </div>

      <!-- Instrument rows — one per instrument, generated by JS -->
      <!-- Example static row for Kick: -->
      <div class="sequencer__row" data-instrument="kick">
        <div class="sequencer__label">Kick</div>
        <button class="sequencer__pad" data-instrument="kick" data-step="0"
                aria-label="Kick step 1" aria-pressed="false"></button>
        <button class="sequencer__pad" data-instrument="kick" data-step="1"
                aria-label="Kick step 2" aria-pressed="false"></button>
        <!-- ... through step 15 ... -->
        <input type="range" class="sequencer__vol-slider"
               data-instrument="kick" min="0" max="100" value="80"
               aria-label="Kick volume">
      </div>
      <!-- Repeat for: snare, hihat, clap, tom, rim -->

    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <p>Built with Web Audio API · <kbd>Space</kbd> Play/Stop · <kbd>C</kbd> Clear</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key HTML Decisions

- **`<button>` elements for pads**: Semantically correct for toggle actions; supports `aria-pressed` for accessibility.
- **`data-instrument` and `data-step` attributes**: Allow JS to identify each pad by row/column without querying DOM position.
- **`<input type="range">` for sliders**: Native browser range inputs, styled via CSS.
- **`<output>` for readouts**: Semantically linked to their slider inputs via the `for` attribute.
- **Grid generated by JS**: The sequencer rows and step-number headers are generated dynamically by `ui.js` based on the instrument definitions. The HTML above is illustrative of the final rendered DOM.

---

## 5. CSS Design

### Grid Layout for Sequencer

```css
.sequencer__header,
.sequencer__row {
  display: grid;
  grid-template-columns: 80px repeat(16, 1fr) 60px;
  gap: var(--spacing-xs);
  align-items: center;
}
```

- **First column (80px)**: Instrument label.
- **Middle 16 columns (1fr each)**: Pad cells — equal width, squarish.
- **Last column (60px)**: Per-instrument volume slider.

### Pad Cell Styling

```css
.sequencer__pad {
  aspect-ratio: 1;
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-raised);
  cursor: pointer;
  transition: background 0.1s ease, box-shadow 0.1s ease, transform 0.05s ease;
}

.sequencer__pad[aria-pressed="true"] {
  background: var(--accent-active);
  box-shadow: var(--glow-active);
}

.sequencer__pad:hover {
  border-color: var(--accent-active);
  transform: scale(1.08);
}
```

### Playhead Highlight

```css
.sequencer__pad.playhead {
  box-shadow: var(--glow-playhead);
  background-color: rgba(247, 37, 133, 0.15);
}

.sequencer__pad[aria-pressed="true"].playhead {
  background: var(--accent-playhead);
  box-shadow: 0 0 20px rgba(247, 37, 133, 0.8);
}
```

The `playhead` class is added/removed from all pads in the current step column by `ui.js` on each step advance.

### Button Glow Effects

```css
.transport__btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.15s ease;
}

.transport__btn--play {
  background: var(--accent-play);
  color: #0D0D0D;
}
.transport__btn--play:hover {
  box-shadow: 0 0 16px rgba(57, 255, 20, 0.6);
  transform: scale(1.05);
}

.transport__btn--stop {
  background: var(--accent-stop);
  color: #0D0D0D;
}
.transport__btn--stop:hover {
  box-shadow: 0 0 16px rgba(255, 49, 49, 0.6);
  transform: scale(1.05);
}

.transport__btn--clear {
  background: var(--accent-clear);
  color: #0D0D0D;
}
.transport__btn--clear:hover {
  box-shadow: 0 0 16px rgba(255, 214, 10, 0.6);
  transform: scale(1.05);
}
```

### Beat-Group Dividers

Every 4th column boundary gets a heavier left border to visually separate beats:

```css
.sequencer__pad:nth-child(4n + 2) {
  border-left: 2px solid var(--text-secondary);
}
```

(Offset by 2 because child 1 is the instrument label.)

### Custom Range Slider Styling

Override default browser range inputs to match the dark theme:

```css
.transport__range,
.sequencer__vol-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: var(--slider-track);
  border-radius: 3px;
  outline: none;
}

.transport__range::-webkit-slider-thumb,
.sequencer__vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--slider-thumb);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 245, 212, 0.5);
}
```

### Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| **≥ 1024px** (desktop) | Full grid visible, pads are ~40×40px. Transport bar in one row. |
| **768–1023px** (tablet) | Pads shrink to ~30×30px. Transport buttons and sliders stack into two rows. |
| **< 768px** (mobile) | Pads shrink to ~24×24px. Sequencer scrolls horizontally. Transport stacks vertically. Instrument labels abbreviate (e.g., "KCK", "SNR", "HH"). |

```css
@media (max-width: 768px) {
  .sequencer__header,
  .sequencer__row {
    grid-template-columns: 48px repeat(16, 28px) 48px;
    gap: 2px;
  }
  .transport {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
```

---

## 6. JavaScript Architecture

### Module Map

```text
js/
├── main.js                  ← Entry point
└── modules/
    ├── sequencer.js          ← Beat grid state, step logic
    ├── audio.js              ← Web Audio API, sample loading, playback
    ├── instruments.js        ← Instrument definitions and sample paths
    ├── transport.js          ← Play/stop/clear, BPM, timing loop
    └── ui.js                 ← DOM rendering, playhead, event binding
```

---

### 6.1 `main.js` — Entry Point

**Purpose**: Import all modules, create the shared `AudioContext`, initialise the app on `DOMContentLoaded`.

```js
import { initAudio } from './modules/audio.js';
import { initSequencer } from './modules/sequencer.js';
import { initTransport } from './modules/transport.js';
import { initUI } from './modules/ui.js';
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | None | `void` | Called on `DOMContentLoaded`. Creates `AudioContext`, calls each module's init function in order: `initAudio(ctx)` → `initSequencer()` → `initUI()` → `initTransport()`. Resumes `AudioContext` on first user gesture. |

**AudioContext resume strategy**: The `AudioContext` is created in a suspended state. A one-time `click` listener on `document.body` calls `ctx.resume()` so browsers that require user-gesture activation work correctly.

---

### 6.2 `modules/sequencer.js` — Beat Grid State

**Purpose**: Owns the 2D boolean grid that represents the pattern. Provides functions to toggle cells, read state, clear the grid, and advance the step position.

#### Data

```js
// grid[instrumentIndex][stepIndex] = true | false
let grid = [];       // 2D boolean array, e.g. 6 × 16
let currentStep = 0; // 0–15, the column index currently playing
const TOTAL_STEPS = 16;
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `initSequencer(instrumentCount)` | `instrumentCount: number` — how many rows | `void` | Creates the 2D array filled with `false`. Resets `currentStep` to `0`. |
| `togglePad(instrumentIndex, stepIndex)` | `instrumentIndex: number`, `stepIndex: number` | `boolean` — the new state of the pad | Flips `grid[instrumentIndex][stepIndex]`. Returns new value so UI can update. |
| `isPadActive(instrumentIndex, stepIndex)` | `instrumentIndex: number`, `stepIndex: number` | `boolean` | Returns the on/off state of a single cell. |
| `getActiveInstrumentsAtStep(stepIndex)` | `stepIndex: number` — column index 0–15 | `number[]` — array of instrument indices that are active at this step | Used by `transport.js` on each step tick to know which sounds to trigger. |
| `advanceStep()` | None | `number` — the new `currentStep` value | Increments `currentStep`, wraps from 15 → 0. Returns the new value for playhead rendering. |
| `getCurrentStep()` | None | `number` | Returns `currentStep`. |
| `resetStep()` | None | `void` | Sets `currentStep` back to `0`. Called on Stop. |
| `clearGrid()` | None | `void` | Sets every cell in `grid` to `false`. Does not reset `currentStep`. |
| `getGrid()` | None | `boolean[][]` | Returns the full 2D grid (read-only reference for debugging / export). |
| `getTotalSteps()` | None | `number` | Returns `TOTAL_STEPS` constant. |

---

### 6.3 `modules/audio.js` — Web Audio API: Load Samples, Play Sounds

**Purpose**: Manages the `AudioContext`, loads audio sample files into `AudioBuffer` objects, provides a function to play a specific instrument sound at a specific time with volume control, and controls master volume via a `GainNode`.

#### Internal State

```js
let audioCtx = null;         // AudioContext instance
let masterGain = null;        // GainNode at end of signal chain
const buffers = new Map();    // Map<string, AudioBuffer> — instrument name → decoded buffer
const instrumentGains = new Map(); // Map<string, GainNode> — per-instrument volume
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `initAudio(ctx)` | `ctx: AudioContext` | `void` | Stores reference to the shared `AudioContext`. Creates `masterGain` node connected to `ctx.destination`. |
| `loadSample(name, url)` | `name: string` — instrument id (e.g. `"kick"`), `url: string` — path to audio file | `Promise<void>` | Fetches the audio file, decodes it via `ctx.decodeAudioData()`, stores the resulting `AudioBuffer` in `buffers` map. Creates a `GainNode` for this instrument in `instrumentGains`. Wrapped in `try/catch`; logs error and stores `null` on failure. |
| `loadAllSamples(instruments)` | `instruments: Array<{id, name, sampleUrl}>` | `Promise<void>` | Calls `loadSample()` for each instrument in parallel via `Promise.all()`. |
| `playSample(name, time)` | `name: string` — instrument id, `time: number` — `AudioContext.currentTime` offset for scheduling | `void` | Creates a new `AudioBufferSourceNode`, sets its `buffer` from the `buffers` map, connects through the instrument's `GainNode` → `masterGain` → `destination`, and calls `source.start(time)`. No-ops if the buffer is `null` (failed to load). |
| `setMasterVolume(value)` | `value: number` — 0 to 1 | `void` | Sets `masterGain.gain.value`. |
| `setInstrumentVolume(name, value)` | `name: string`, `value: number` — 0 to 1 | `void` | Sets the `GainNode` gain for a specific instrument. |
| `getAudioContext()` | None | `AudioContext` | Returns the stored `AudioContext` reference. |

#### Signal Chain

```text
AudioBufferSourceNode → InstrumentGainNode → MasterGainNode → AudioContext.destination
```

---

### 6.4 `modules/instruments.js` — Instrument Definitions

**Purpose**: Exports an array of instrument definition objects. Each object describes one row in the sequencer.

#### Data Structure

```js
const INSTRUMENTS = [
  {
    id: 'kick',
    name: 'Kick',
    shortName: 'KCK',
    sampleUrl: 'assets/samples/kick.wav',
    defaultVolume: 0.9,
    colour: '#00F5D4'       // per-instrument accent (optional)
  },
  {
    id: 'snare',
    name: 'Snare',
    shortName: 'SNR',
    sampleUrl: 'assets/samples/snare.wav',
    defaultVolume: 0.85,
    colour: '#00F5D4'
  },
  {
    id: 'hihat',
    name: 'Hi-Hat',
    shortName: 'HH',
    sampleUrl: 'assets/samples/hihat.wav',
    defaultVolume: 0.7,
    colour: '#00F5D4'
  },
  {
    id: 'clap',
    name: 'Clap',
    shortName: 'CLP',
    sampleUrl: 'assets/samples/clap.wav',
    defaultVolume: 0.8,
    colour: '#00F5D4'
  },
  {
    id: 'tom',
    name: 'Tom',
    shortName: 'TOM',
    sampleUrl: 'assets/samples/tom.wav',
    defaultVolume: 0.75,
    colour: '#00F5D4'
  },
  {
    id: 'rim',
    name: 'Rim',
    shortName: 'RIM',
    sampleUrl: 'assets/samples/rim.wav',
    defaultVolume: 0.7,
    colour: '#00F5D4'
  }
];
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `getInstruments()` | None | `Array<InstrumentDef>` | Returns a shallow copy of the `INSTRUMENTS` array. |
| `getInstrumentById(id)` | `id: string` | `InstrumentDef \| undefined` | Finds and returns the instrument object matching the given id. |
| `getInstrumentCount()` | None | `number` | Returns `INSTRUMENTS.length`. |

#### Sample Files

Audio samples are stored in `assets/samples/`. Acceptable formats: `.wav` (preferred for low latency) or `.mp3`. Files should be short one-shot percussion hits (< 1 second, < 100 KB each). Free-licence samples from sources like freesound.org or synthed via code can be used.

If sample files are unavailable at build time, a fallback synthesiser approach can generate simple sine/noise bursts via `OscillatorNode` and `AudioBufferSourceNode` with generated white noise.

---

### 6.5 `modules/transport.js` — Play, Stop, BPM, Timing Loop

**Purpose**: Manages playback state (playing/stopped), BPM, and the timing loop that advances the sequencer step and triggers sounds.

#### Internal State

```js
let isPlaying = false;
let bpm = 120;
let timerID = null;          // ID from setInterval or requestAnimationFrame
let nextStepTime = 0;        // AudioContext time when the next step should fire
const SCHEDULE_AHEAD = 0.1;  // seconds — how far ahead to schedule audio
const LOOKAHEAD = 25;        // ms — how often the scheduler runs
```

#### Timing Strategy — Lookahead Scheduler

**Why not plain `setInterval`?** `setInterval` jitter can reach 10–50 ms because the JS event loop is not real-time. This causes audible timing drift and swing.

**Solution**: Use a **lookahead scheduler** pattern (per Chris Wilson's "A Tale of Two Clocks"):

1. A `setInterval` fires every `LOOKAHEAD` ms (25 ms) — this is the "scheduling" clock.
2. Each time it fires, it checks: "Is `nextStepTime` within `SCHEDULE_AHEAD` seconds of `audioCtx.currentTime`?"
3. If yes, it schedules the audio events at the precise `nextStepTime` via `playSample(name, nextStepTime)`, advances the step, and calculates the next `nextStepTime` based on BPM.
4. This way audio is scheduled at sample-accurate times even though JS timing is imprecise.

```text
Step interval = 60 / bpm / 4  (seconds per 16th note)
Example at 120 BPM: 60 / 120 / 4 = 0.125 s = 125 ms per step
```

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `initTransport(audioCtx, sequencer, audio, ui)` | Module references | `void` | Stores references to the audio context and sibling modules. Binds DOM event listeners for Play, Stop, Clear buttons, BPM slider, and master volume slider. Binds keyboard shortcuts. |
| `play()` | None | `void` | Sets `isPlaying = true`, records `nextStepTime = audioCtx.currentTime`, starts the scheduler interval. Updates UI to show playing state. |
| `stop()` | None | `void` | Sets `isPlaying = false`, clears the scheduler interval, resets the sequencer step to 0, clears playhead highlight in UI. |
| `clear()` | None | `void` | Calls `sequencer.clearGrid()`, updates UI to remove all active pad highlights. If currently playing, also calls `stop()`. |
| `setBPM(newBPM)` | `newBPM: number` — 60–200 | `void` | Updates `bpm`. The scheduler automatically picks up the new value on the next tick since step interval is recalculated each cycle. |
| `scheduler()` | None | `void` | The core loop function called by `setInterval`. While `nextStepTime < audioCtx.currentTime + SCHEDULE_AHEAD`: gets active instruments at current step via `sequencer.getActiveInstrumentsAtStep()`, calls `audio.playSample()` for each, calls `ui.highlightStep()`, advances step, calculates next `nextStepTime`. |
| `getStepInterval()` | None | `number` — seconds | Returns `60 / bpm / 4` (duration of one 16th note at current BPM). |
| `isCurrentlyPlaying()` | None | `boolean` | Returns `isPlaying`. |

#### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Toggle Play/Stop |
| `c` or `C` | Clear grid |

---

### 6.6 `modules/ui.js` — Grid Rendering, Playhead, Event Binding

**Purpose**: Builds the sequencer grid DOM from the instrument definitions, handles pad click events (delegated), updates visual state of pads (active/inactive), moves the playhead highlight, and updates slider readouts.

#### Functions

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `initUI(instruments, sequencer, audio)` | `instruments: InstrumentDef[]`, `sequencer` module ref, `audio` module ref | `void` | Calls `renderGrid()`, binds pad click events via event delegation on the sequencer container, binds slider `input` events for per-instrument volumes. |
| `renderGrid(instruments)` | `instruments: InstrumentDef[]` | `void` | Clears the sequencer `<section>`, builds the header row (step numbers 1–16) and one row per instrument (label + 16 `<button>` pads + volume slider). Appends to DOM. |
| `handlePadClick(event)` | `event: PointerEvent` | `void` | Reads `data-instrument` and `data-step` from clicked pad. Calls `sequencer.togglePad()`. Updates `aria-pressed` and active CSS class on the pad based on return value. |
| `highlightStep(stepIndex)` | `stepIndex: number` — 0–15 | `void` | Removes `playhead` class from all pads in the previous step column. Adds `playhead` class to all pads in the new step column. Uses `requestAnimationFrame()` to batch DOM updates for smooth rendering. |
| `clearPlayhead()` | None | `void` | Removes `playhead` class from all pads. Called on Stop. |
| `clearAllPads()` | None | `void` | Removes active class and resets `aria-pressed="false"` on every pad. Called on Clear. |
| `updateBPMDisplay(value)` | `value: number` | `void` | Sets the `#bpm-display` `<output>` text content. |
| `updateVolumeDisplay(value)` | `value: number` — 0–100 | `void` | Sets the `#volume-display` `<output>` text content with `%` suffix. |
| `setPlayingState(isPlaying)` | `isPlaying: boolean` | `void` | Toggles a `.playing` class on the Play button and disables/enables the Stop button as appropriate. Provides visual feedback for the current transport state. |

#### Event Delegation

Pad clicks are handled via a single `click` listener on `.sequencer` that checks `event.target.matches('.sequencer__pad')`. This avoids 96+ individual listeners (6 × 16 pads).

#### Playhead Rendering Optimisation

`highlightStep()` is called from the scheduler, which runs in `setInterval`. To avoid layout thrashing, the actual DOM class changes are batched inside `requestAnimationFrame()`:

```js
function highlightStep(stepIndex) {
  requestAnimationFrame(() => {
    // remove previous playhead classes
    // add new playhead classes for column stepIndex
  });
}
```

---

## 7. Audio Technical Details

### AudioContext Lifecycle

1. **Creation**: `new AudioContext()` is called once in `main.js init()`.
2. **Suspension**: Modern browsers create contexts in a suspended state. The first user interaction (click on any element) triggers `audioCtx.resume()`.
3. **Shared reference**: The single `AudioContext` instance is passed to `audio.js` and `transport.js`.

### Loading and Decoding Samples

```js
const response = await fetch(url);
const arrayBuffer = await response.arrayBuffer();
const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
```

- `fetch()` retrieves the `.wav` file as raw bytes.
- `decodeAudioData()` converts to a browser-native `AudioBuffer` stored in memory.
- Each instrument's buffer is stored in a `Map<string, AudioBuffer>` for O(1) lookup.

### Playing a Sample

```js
const source = audioCtx.createBufferSource();
source.buffer = buffers.get(instrumentId);
source.connect(instrumentGainNodes.get(instrumentId));
source.start(scheduledTime);
```

- A **new** `AudioBufferSourceNode` is created for every hit (they are single-use).
- `source.start(scheduledTime)` uses the `AudioContext.currentTime` clock for sample-accurate scheduling.
- The node is automatically garbage-collected after playback ends.

### Avoiding Timing Drift

The lookahead scheduler (see section 6.5) prevents drift by:

- Running a coarse JS timer (`setInterval` at 25 ms).
- Scheduling audio events ahead of time using the high-resolution `AudioContext.currentTime` clock.
- Never relying on JS timer accuracy for the actual moment sounds play.

### Signal Chain Summary

```text
AudioBufferSourceNode (per hit, per instrument)
  → GainNode (per instrument — controls individual volume)
    → GainNode (master — controls overall volume)
      → AudioContext.destination (speakers)
```

### Audio Format Considerations

| Format | Pros | Cons |
|---|---|---|
| `.wav` (PCM) | Zero decode latency, lossless | Larger files (~100 KB per sample) |
| `.mp3` | Smaller files | Decode latency, potential gap at start |
| `.ogg` | Small files, no patent issues | Not supported in Safari |

**Decision**: Use `.wav` for all samples. Files are small (one-shot hits < 1 s) and the zero-decode-latency property is critical for a beat maker.

---

## 8. Data Structures

### Primary Data: The Beat Grid

```js
// Type: boolean[][]
// Dimensions: grid[instrumentIndex][stepIndex]
// instrumentIndex: 0 to INSTRUMENTS.length - 1 (0 = kick, 1 = snare, ...)
// stepIndex: 0 to TOTAL_STEPS - 1 (0 = step 1, 15 = step 16)

const grid = [
  // Kick:    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  // Snare:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  // Hi-Hat:  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  // Clap:    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  // Tom:     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  // Rim:     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
];
```

### Instrument Definition Object

```js
/**
 * @typedef {Object} InstrumentDef
 * @property {string}  id            — Unique identifier (e.g. "kick")
 * @property {string}  name          — Display name (e.g. "Kick")
 * @property {string}  shortName     — Abbreviated name for mobile (e.g. "KCK")
 * @property {string}  sampleUrl     — Relative path to audio file
 * @property {number}  defaultVolume — Initial volume 0–1
 * @property {string}  colour        — Hex colour for accent (optional)
 */
```

### Playback State

```js
/**
 * @typedef {Object} TransportState
 * @property {boolean} isPlaying    — Whether the loop is currently running
 * @property {number}  bpm          — Current tempo (60–200)
 * @property {number}  currentStep  — Current step column index (0–15)
 * @property {number}  masterVolume — Master gain value (0–1)
 */
```

### Volume Map

Per-instrument volumes are stored as `GainNode` values within `audio.js`. A separate lookup isn't needed because the `GainNode` references in `instrumentGains` map serve as both storage and audio pipeline.

---

## 9. Accessibility

### Keyboard Navigation

| Key | Context | Action |
|---|---|---|
| `Tab` | Anywhere | Move focus through transport buttons → BPM slider → volume slider → first pad → next pad → ... |
| `Enter` / `Space` | Focused on a pad | Toggle the pad on/off (equivalent to click) |
| `Arrow Right` | Focused on a pad | Move focus to the next step in the same row |
| `Arrow Left` | Focused on a pad | Move focus to the previous step |
| `Arrow Down` | Focused on a pad | Move focus to the same step in the next instrument row |
| `Arrow Up` | Focused on a pad | Move focus to the same step in the previous row |
| `Space` | Not focused on a pad | Toggle Play/Stop |
| `c` | Not focused on an input | Clear grid |

### ARIA Attributes

| Element | Attribute | Value | Purpose |
|---|---|---|---|
| Each pad `<button>` | `aria-pressed` | `"true"` / `"false"` | Announces whether the beat is active at this position |
| Each pad `<button>` | `aria-label` | e.g. `"Kick step 5"` | Describes which instrument and step this pad controls |
| Sequencer `<section>` | `aria-label` | `"Step sequencer grid"` | Identifies the grid landmark |
| Transport `<section>` | `aria-label` | `"Transport controls"` | Identifies the controls landmark |
| Play button | `aria-label` | `"Play pattern"` | Clear action label |
| Stop button | `aria-label` | `"Stop playback"` | Clear action label |
| Clear button | `aria-label` | `"Clear all pads"` | Clear action label |
| BPM slider | `aria-label` | `"Tempo in beats per minute"` | Describes the slider purpose |
| Master volume slider | `aria-label` | `"Master volume"` | Describes the slider purpose |
| Per-instrument volume | `aria-label` | e.g. `"Kick volume"` | Describes which instrument this volume controls |
| `<output>` elements | `for` | Matching slider `id` | Links the readout to its slider |

### Focus Management

- Pad grid implements a **roving tabindex** pattern: only the currently focused pad has `tabindex="0"`; all others have `tabindex="-1"`. Arrow keys move the roving focus.
- Transport buttons and sliders use natural tab order.

### Visual Indicators

- Active pads use colour change AND glow (not colour alone) to accommodate colour-blind users.
- Playhead uses a distinct magenta colour plus a glow effect for dual-channel indication.
- All interactive elements have visible `:focus-visible` outlines:

```css
.sequencer__pad:focus-visible,
.transport__btn:focus-visible {
  outline: 2px solid var(--accent-active);
  outline-offset: 2px;
}
```

---

## 10. Step-by-Step Build Order

### Phase 1 — Project Scaffold

1. Create the folder structure: `beat-maker/index.html`, `js/main.js`, `js/modules/`, `styles/main.css`, `assets/samples/`.
2. Add the HTML skeleton with `<header>`, `<main>`, `<footer>`, linked CSS and JS.
3. Add the CSS reset, CSS variables, and base body styles (dark background, font).
4. Verify the page loads and displays the header text.

### Phase 2 — Instrument Definitions

5. Create `js/modules/instruments.js` with the `INSTRUMENTS` array and exported getter functions.
6. Source or create 6 `.wav` sample files (kick, snare, hihat, clap, tom, rim) and place in `assets/samples/`.

### Phase 3 — Audio Engine

7. Create `js/modules/audio.js` with `initAudio()`, `loadSample()`, `loadAllSamples()`, `playSample()`.
8. Create `masterGain` and per-instrument `GainNode` chain.
9. In `main.js`, create `AudioContext`, call `initAudio()`, load all samples.
10. **Test**: Add a temporary button that calls `playSample('kick', audioCtx.currentTime)` to verify audio works.

### Phase 4 — Sequencer State

11. Create `js/modules/sequencer.js` with the grid array, `initSequencer()`, `togglePad()`, `getActiveInstrumentsAtStep()`, `advanceStep()`, `clearGrid()`.
12. **Test**: Log grid state to console after toggling a few positions.

### Phase 5 — UI Rendering

13. Create `js/modules/ui.js` with `renderGrid()` — dynamically build step-number header and instrument rows.
14. Style the grid with CSS Grid: label column + 16 pad columns + volume column.
15. Style pads with the dark raised background, border, hover effects.
16. Implement `handlePadClick()` — toggle `aria-pressed` and active class on click.
17. **Test**: Click pads, verify visual toggle and that `sequencer.togglePad()` is called.

### Phase 6 — Transport and Playback

18. Create `js/modules/transport.js` with `play()`, `stop()`, `clear()`, `setBPM()`, and the `scheduler()` lookahead loop.
19. Wire Play/Stop/Clear buttons to their handlers.
20. Wire the BPM slider `input` event to `setBPM()` and display update.
21. Wire the master volume slider to `audio.setMasterVolume()`.
22. **Test**: Create a simple pattern, press Play, verify sounds loop at the correct tempo.

### Phase 7 — Playhead Visualisation

23. Implement `ui.highlightStep()` — add/remove `playhead` class on the correct column.
24. Call `highlightStep()` from the scheduler on each step advance.
25. Style the playhead with the magenta glow.
26. **Test**: Verify the playhead sweeps across the grid in time with audio.

### Phase 8 — Per-Instrument Volume

27. Wire per-instrument volume sliders to `audio.setInstrumentVolume()`.
28. **Test**: Adjust a single instrument's volume, verify it changes independently.

### Phase 9 — Keyboard Accessibility

29. Add keyboard event listeners for `Space` (play/stop) and `C` (clear).
30. Implement roving tabindex for arrow-key navigation within the pad grid.
31. Add `:focus-visible` styles.
32. **Test**: Navigate the entire app with keyboard only.

### Phase 10 — Responsive Design

33. Add media queries for tablet (768–1023px) and mobile (< 768px).
34. Test horizontal scroll behaviour on narrow screens.
35. Use abbreviated instrument labels (`shortName`) on mobile.

### Phase 11 — Polish and Edge Cases

36. Handle edge case: clicking Play when already playing (no-op or restart).
37. Handle edge case: changing BPM while playing (seamless update).
38. Handle edge case: sample load failure (skip instrument, log warning).
39. Add subtle CSS transitions for pad toggle (0.1s ease).
40. Add button press animation (scale down on `:active`).
41. Final cross-browser test (Chrome, Firefox, Safari, Edge).

---

## 11. Stretch Goals

### 11.1 Record and Export Audio

- Use `MediaRecorder` API with `AudioContext.createMediaStreamDestination()`.
- Capture the master output as a `MediaStream`.
- Record for N loops, then produce a `.webm` or `.wav` blob.
- Provide a "Download" button that creates an `<a>` with `URL.createObjectURL()`.

### 11.2 Custom Sample Upload

- Add a file `<input type="file" accept="audio/*">` per instrument row.
- On upload, read the file with `FileReader.readAsArrayBuffer()`, decode with `audioCtx.decodeAudioData()`, replace that instrument's buffer.
- Validate file size (< 2 MB) and type before processing.

### 11.3 Multiple Patterns / Pattern Bank

- Store up to 4–8 patterns, each a separate 2D grid.
- Add pattern selector buttons (A, B, C, D) above the grid.
- Allow switching patterns while playing (pattern changes take effect at the start of the next loop).
- Store patterns in `localStorage` for persistence across sessions.

### 11.4 Swing / Shuffle

- Add a swing slider (0–100%).
- Offset every other 16th note forward in time: `swingOffset = stepInterval * (swingAmount / 100) * 0.5`.
- Apply the offset in the scheduler when calculating `nextStepTime` for odd-numbered steps.

### 11.5 Preset Patterns

- Bundle 4–6 classic beat presets (four-on-the-floor, boom-bap, breakbeat, reggaeton, etc.).
- Add a "Presets" dropdown that populates the grid with a predefined 2D array.

### 11.6 Visual Waveform / Analyser

- Connect an `AnalyserNode` after `masterGain`.
- Draw the waveform or frequency bars in a `<canvas>` element below the grid.
- Use `requestAnimationFrame()` for real-time rendering.

### 11.7 MIDI Input Support

- Use the Web MIDI API (`navigator.requestMIDIAccess()`) to accept input from external MIDI controllers.
- Map MIDI note numbers to instrument triggers and pad toggles.
