# Space Tracker — Implementation Plan

---

## 1. Overview

### What It Is

Space Tracker is a single-page web application that displays the real-time position of the International Space Station (ISS) on an interactive world map. It uses the free Open Notify API to fetch the ISS's current latitude and longitude, plots a custom marker on a Leaflet.js map, and auto-refreshes the position every 5 seconds so the user can watch the station orbit the Earth live. A secondary API call retrieves the current crew roster aboard the ISS, which is displayed in a sidebar panel alongside a numerical coordinate readout and an orbit path trail.

### User Flow — Step by Step

1. **Page load** — The browser fetches `index.html`, which loads Leaflet.js from CDN, the app stylesheet (`styles/main.css`), and the entry-point script (`js/main.js`).
2. **Initial data fetch** — On `DOMContentLoaded`, the app fires two parallel `fetch` calls:
   - `GET http://api.open-notify.org/iss-now.json` → returns current ISS latitude and longitude.
   - `GET http://api.open-notify.org/astros.json` → returns a list of people currently in space and which craft they are on.
3. **Map renders** — A Leaflet map initialises centred on the ISS's initial coordinates with a dark tile layer. A custom ISS marker is placed at the reported position.
4. **Coordinate display updates** — The latitude and longitude values are rendered in a dedicated readout panel beneath (mobile) or beside (desktop) the map.
5. **Crew panel populates** — The crew list panel filters the `astros.json` response for people aboard the ISS and renders a card for each astronaut.
6. **Auto-refresh begins** — A `setInterval` timer fires every 5 000 ms, calling the ISS position endpoint again. On each tick:
   - The marker smoothly moves to the new coordinates.
   - The previous position is appended to a polyline array, drawing an orbit trail on the map.
   - The coordinate readout text updates.
   - A small "last updated" timestamp refreshes.
7. **User interaction** — The user can pan and zoom the map freely, toggle the orbit trail on/off, or click the "Re-centre" button to snap the map view back to the ISS.
8. **Crew refresh** — The crew data is fetched once on load (it changes infrequently). A manual "Refresh Crew" button lets the user re-fetch if desired.
9. **Error handling** — If a fetch fails (network error, API down), a toast notification appears and the timer continues retrying on the next tick.

---

## 2. Page Layout

### ASCII Wireframe — Desktop (≥ 900 px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER                                                              │
│  🛰️ Space Tracker               [Re-centre]  [Toggle Trail]  [⟳]   │
├──────────────────────────────────────────────────┬───────────────────┤
│                                                  │  CREW PANEL       │
│                                                  │                   │
│              LEAFLET MAP                         │  ┌─────────────┐ │
│         (full height, flex-grow)                  │  │ 👤 Name     │ │
│                                                  │  │   ISS       │ │
│           ╳ ISS marker                           │  └─────────────┘ │
│          ╌╌╌ orbit trail                         │  ┌─────────────┐ │
│                                                  │  │ 👤 Name     │ │
│                                                  │  │   ISS       │ │
│                                                  │  └─────────────┘ │
│                                                  │  ...              │
│                                                  │                   │
├──────────────────────────────────────────────────┤  COORDINATES      │
│  COORDINATE READOUT                              │  Lat: xx.xxxx°   │
│  Latitude: xx.xxxx°  |  Longitude: xx.xxxx°     │  Lng: xx.xxxx°   │
│  Last updated: HH:MM:SS                         │                   │
├──────────────────────────────────────────────────┴───────────────────┤
│  FOOTER  —  Open Notify API  ·  Leaflet.js  ·  © 2026              │
└──────────────────────────────────────────────────────────────────────┘
```

### ASCII Wireframe — Mobile (< 900 px)

```
┌──────────────────────────┐
│  HEADER                  │
│  🛰️ Space Tracker       │
│  [Re-centre] [Trail] [⟳]│
├──────────────────────────┤
│                          │
│      LEAFLET MAP         │
│    (full width, 50vh)    │
│                          │
│       ╳ ISS marker       │
│      ╌╌╌ trail           │
│                          │
├──────────────────────────┤
│  COORDINATE READOUT      │
│  Lat: xx.xxxx°           │
│  Lng: xx.xxxx°           │
│  Updated: HH:MM:SS      │
├──────────────────────────┤
│  CREW PANEL              │
│  ┌────────────────────┐  │
│  │ 👤 Astronaut Name  │  │
│  │   Craft: ISS       │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 👤 Astronaut Name  │  │
│  │   Craft: ISS       │  │
│  └────────────────────┘  │
├──────────────────────────┤
│  FOOTER                  │
└──────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Layout Change |
|---|---|
| ≥ 900 px | Two-column: map left (70 %), crew sidebar right (30 %). Coordinate bar spans map column. |
| 600–899 px | Single column. Map full-width at 55 vh. Crew cards in 2-column CSS grid below. |
| < 600 px | Single column. Map full-width at 45 vh. Crew cards stacked. Font sizes scale down. |

---

## 3. Colour Scheme & Typography

### Design Concept

A deep-space dark theme. The background is near-black with indigo/navy tints. Accent colours pull from ISS solar-panel gold and cool orbital blues. Text is high-contrast white/light-grey. Status indicators use green (live), amber (stale), and red (error).

### Colour Palette

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background Primary | `--clr-bg-primary` | `#0b0d17` | Page body, main background |
| Background Secondary | `--clr-bg-secondary` | `#111428` | Sidebar, crew panel background |
| Background Card | `--clr-bg-card` | `#1a1e35` | Crew cards, coordinate readout |
| Background Card Hover | `--clr-bg-card-hover` | `#252a48` | Card hover state |
| Surface | `--clr-surface` | `#1e2140` | Header, footer, input fields |
| Border | `--clr-border` | `#2d325a` | Card borders, dividers |
| Text Primary | `--clr-text-primary` | `#e8e8f0` | Main body text |
| Text Secondary | `--clr-text-secondary` | `#9a9bbe` | Labels, subtle text |
| Text Muted | `--clr-text-muted` | `#5d5f8a` | Timestamps, footnotes |
| Accent Blue | `--clr-accent-blue` | `#4da6ff` | Links, ISS orbit trail, highlights |
| Accent Gold | `--clr-accent-gold` | `#f0c040` | ISS marker glow, headings accent |
| Accent Teal | `--clr-accent-teal` | `#38d9a9` | Crew count badge, secondary accent |
| Status Live | `--clr-status-live` | `#2ecc71` | Live indicator dot |
| Status Stale | `--clr-status-stale` | `#f39c12` | Data older than 15 s |
| Status Error | `--clr-status-error` | `#e74c3c` | Fetch failure toast |
| Button Primary BG | `--clr-btn-primary` | `#3a7bd5` | Primary action buttons |
| Button Primary Hover | `--clr-btn-primary-hover` | `#5a9bf5` | Hover state |

### Typography

| Role | CSS Variable | Font Family | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|---|
| Headings | `--font-heading` | `'Orbitron', sans-serif` | 700 | 1.5–2 rem | 1.2–1.6 rem |
| Body | `--font-body` | `'Inter', sans-serif` | 400 | 1 rem (16 px) | 0.9 rem |
| Mono / Coordinates | `--font-mono` | `'JetBrains Mono', monospace` | 400 | 0.95 rem | 0.85 rem |
| Labels | `--font-body` | `'Inter', sans-serif` | 600 | 0.85 rem | 0.8 rem |

**Google Fonts import URL:**

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&family=Orbitron:wght@700&display=swap
```

### Additional Design Tokens

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--shadow-card: 0 2px 12px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(77, 166, 255, 0.25);
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-xxl: 3rem;
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Track the International Space Station in real time on an interactive map" />
  <title>Space Tracker — Live ISS Position</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&family=Orbitron:wght@700&display=swap"
    rel="stylesheet"
  />

  <!-- Leaflet CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />

  <!-- App CSS -->
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- ─── HEADER ─── -->
  <header class="header" role="banner">
    <div class="header__brand">
      <span class="header__icon" aria-hidden="true">🛰️</span>
      <h1 class="header__title">Space Tracker</h1>
    </div>
    <nav class="header__controls" aria-label="Map controls">
      <button class="btn btn--primary" id="btn-recentre" type="button" aria-label="Re-centre map on ISS">
        Re-centre
      </button>
      <button class="btn btn--secondary" id="btn-toggle-trail" type="button" aria-label="Toggle orbit trail">
        Toggle Trail
      </button>
      <div class="status-indicator" id="status-indicator" role="status" aria-live="polite">
        <span class="status-indicator__dot"></span>
        <span class="status-indicator__label">Live</span>
      </div>
    </nav>
  </header>

  <!-- ─── MAIN CONTENT ─── -->
  <main class="main" role="main">

    <!-- Map + Coordinates column -->
    <section class="map-section" aria-label="ISS map">
      <div class="map-container" id="map" role="application" aria-label="Interactive map showing ISS position"></div>

      <div class="coordinates" aria-label="ISS coordinates">
        <div class="coordinates__field">
          <span class="coordinates__label">Latitude</span>
          <span class="coordinates__value" id="coord-lat">—</span>
        </div>
        <div class="coordinates__field">
          <span class="coordinates__label">Longitude</span>
          <span class="coordinates__value" id="coord-lng">—</span>
        </div>
        <div class="coordinates__field">
          <span class="coordinates__label">Last updated</span>
          <time class="coordinates__value coordinates__value--time" id="coord-time">—</time>
        </div>
      </div>
    </section>

    <!-- Crew sidebar -->
    <aside class="crew-panel" aria-label="ISS crew information">
      <div class="crew-panel__header">
        <h2 class="crew-panel__title">Crew Aboard ISS</h2>
        <span class="crew-panel__count badge" id="crew-count">0</span>
      </div>
      <ul class="crew-list" id="crew-list" aria-live="polite">
        <!-- Crew cards injected by JS -->
      </ul>
      <button class="btn btn--small" id="btn-refresh-crew" type="button" aria-label="Refresh crew data">
        Refresh Crew
      </button>
    </aside>

  </main>

  <!-- ─── TOAST CONTAINER ─── -->
  <div class="toast-container" id="toast-container" aria-live="assertive" aria-atomic="true"></div>

  <!-- ─── FOOTER ─── -->
  <footer class="footer" role="contentinfo">
    <p class="footer__text">
      Data from <a href="http://open-notify.org/" target="_blank" rel="noopener noreferrer">Open Notify API</a>
      · Map by <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet.js</a>
      · &copy; 2026
    </p>
  </footer>

  <!-- Leaflet JS -->
  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>

  <!-- App JS (ES module) -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- All interactive controls have `aria-label` attributes.
- Status regions use `aria-live="polite"` (coordinate updates) and `aria-live="assertive"` (error toasts).
- Semantic elements: `<header>`, `<main>`, `<aside>`, `<footer>`, `<nav>`, `<section>`, `<time>`.
- `role="application"` on the map container tells screen readers it is an interactive widget.
- Crew list uses `<ul>` / `<li>` for correct list semantics.
- All links have `rel="noopener noreferrer"` for security.
- All paths are relative — no leading `/`.

---

## 5. CSS Architecture

### File: `styles/main.css`

Below is every rule and class, organised by section.

#### 5.1 — Reset & Base

```css
/* --- Reset --- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 100%;               /* 16 px base */
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--clr-bg-primary);
  color: var(--clr-text-primary);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: var(--clr-accent-blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul {
  list-style: none;
}
```

#### 5.2 — CSS Custom Properties

```css
:root {
  /* Colours */
  --clr-bg-primary: #0b0d17;
  --clr-bg-secondary: #111428;
  --clr-bg-card: #1a1e35;
  --clr-bg-card-hover: #252a48;
  --clr-surface: #1e2140;
  --clr-border: #2d325a;
  --clr-text-primary: #e8e8f0;
  --clr-text-secondary: #9a9bbe;
  --clr-text-muted: #5d5f8a;
  --clr-accent-blue: #4da6ff;
  --clr-accent-gold: #f0c040;
  --clr-accent-teal: #38d9a9;
  --clr-status-live: #2ecc71;
  --clr-status-stale: #f39c12;
  --clr-status-error: #e74c3c;
  --clr-btn-primary: #3a7bd5;
  --clr-btn-primary-hover: #5a9bf5;

  /* Typography */
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Shadows */
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(77, 166, 255, 0.25);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

#### 5.3 — Header

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header__icon {
  font-size: 1.8rem;
}

.header__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--clr-accent-gold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
```

#### 5.4 — Buttons

```css
.btn {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background-color: var(--clr-btn-primary);
  color: #fff;
}

.btn--primary:hover {
  background-color: var(--clr-btn-primary-hover);
}

.btn--secondary {
  background-color: var(--clr-bg-card);
  color: var(--clr-text-primary);
  border: 1px solid var(--clr-border);
}

.btn--secondary:hover {
  background-color: var(--clr-bg-card-hover);
}

.btn--small {
  font-size: 0.8rem;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--clr-bg-card);
  color: var(--clr-text-secondary);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-md);
  width: 100%;
}

.btn--small:hover {
  background-color: var(--clr-bg-card-hover);
  color: var(--clr-text-primary);
}
```

#### 5.5 — Status Indicator

```css
.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--clr-text-secondary);
}

.status-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--clr-status-live);
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator--stale .status-indicator__dot {
  background-color: var(--clr-status-stale);
  animation: none;
}

.status-indicator--error .status-indicator__dot {
  background-color: var(--clr-status-error);
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
```

#### 5.6 — Main Layout

```css
.main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0;
  overflow: hidden;
}
```

#### 5.7 — Map Section

```css
.map-section {
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  min-height: 400px;
  z-index: 1;
}

/* Override Leaflet's default white background for dark theme */
.map-container .leaflet-container {
  background-color: var(--clr-bg-primary);
}
```

#### 5.8 — Coordinates Bar

```css
.coordinates {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--clr-bg-card);
  border-top: 1px solid var(--clr-border);
}

.coordinates__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.coordinates__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.coordinates__value {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: var(--clr-accent-blue);
}

.coordinates__value--time {
  color: var(--clr-text-secondary);
  font-size: 0.85rem;
}
```

#### 5.9 — Crew Panel (Sidebar)

```css
.crew-panel {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  background-color: var(--clr-bg-secondary);
  border-left: 1px solid var(--clr-border);
  overflow-y: auto;
  max-height: calc(100vh - 64px);     /* Subtract header height */
}

.crew-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.crew-panel__title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  letter-spacing: 0.04em;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 var(--spacing-sm);
  border-radius: 100px;
  background-color: var(--clr-accent-teal);
  color: var(--clr-bg-primary);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.8rem;
}
```

#### 5.10 — Crew List & Cards

```css
.crew-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.crew-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--clr-bg-card);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.crew-card:hover {
  background-color: var(--clr-bg-card-hover);
  box-shadow: var(--shadow-card);
}

.crew-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--clr-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.crew-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crew-card__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--clr-text-primary);
}

.crew-card__craft {
  font-size: 0.75rem;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

#### 5.11 — Toast Notifications

```css
.toast-container {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  z-index: 9999;
  pointer-events: none;
}

.toast {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  pointer-events: auto;
  animation: toast-in 300ms ease forwards;
  box-shadow: var(--shadow-card);
}

.toast--error {
  background-color: var(--clr-status-error);
}

.toast--info {
  background-color: var(--clr-btn-primary);
}

.toast--leaving {
  animation: toast-out 300ms ease forwards;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes toast-out {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(20px); }
}
```

#### 5.12 — Footer

```css
.footer {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--clr-surface);
  border-top: 1px solid var(--clr-border);
  text-align: center;
}

.footer__text {
  font-size: 0.8rem;
  color: var(--clr-text-muted);
}
```

#### 5.13 — ISS Marker Custom Styles (Leaflet Override)

```css
.iss-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px var(--clr-accent-gold));
  transition: transform var(--transition-normal);
}
```

#### 5.14 — Loading Skeleton (Initial State)

```css
.skeleton {
  background: linear-gradient(90deg, var(--clr-bg-card) 25%, var(--clr-bg-card-hover) 50%, var(--clr-bg-card) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
  height: 56px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### 5.15 — Responsive Media Queries

```css
/* Tablet */
@media (max-width: 899px) {
  .main {
    grid-template-columns: 1fr;
  }

  .map-container {
    min-height: 55vh;
  }

  .crew-panel {
    border-left: none;
    border-top: 1px solid var(--clr-border);
    max-height: none;
  }

  .crew-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .coordinates {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
}

/* Mobile */
@media (max-width: 599px) {
  .header {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .header__title {
    font-size: 1.2rem;
  }

  .header__controls {
    width: 100%;
    justify-content: center;
  }

  .map-container {
    min-height: 45vh;
  }

  .crew-list {
    grid-template-columns: 1fr;
  }

  .coordinates {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .coordinates__value {
    font-size: 0.9rem;
  }

  .toast-container {
    left: var(--spacing-md);
    right: var(--spacing-md);
  }
}
```

### Complete CSS Class Inventory

| Class | Element | Purpose |
|---|---|---|
| `.header` | `<header>` | Sticky top bar |
| `.header__brand` | `<div>` | Logo + title group |
| `.header__icon` | `<span>` | Satellite emoji |
| `.header__title` | `<h1>` | App title |
| `.header__controls` | `<nav>` | Action button group |
| `.btn` | `<button>` | Base button styles |
| `.btn--primary` | `<button>` | Blue filled button |
| `.btn--secondary` | `<button>` | Outlined button |
| `.btn--small` | `<button>` | Small utility button |
| `.status-indicator` | `<div>` | Live/stale/error status |
| `.status-indicator__dot` | `<span>` | Animated dot |
| `.status-indicator__label` | `<span>` | Status text |
| `.status-indicator--stale` | modifier | Amber dot, no animation |
| `.status-indicator--error` | modifier | Red dot, no animation |
| `.main` | `<main>` | CSS Grid layout |
| `.map-section` | `<section>` | Map + coords column |
| `.map-container` | `<div>` | Leaflet map mount point |
| `.coordinates` | `<div>` | Coordinate readout bar |
| `.coordinates__field` | `<div>` | Single coordinate pair |
| `.coordinates__label` | `<span>` | Label text |
| `.coordinates__value` | `<span>` | Mono value |
| `.coordinates__value--time` | `<time>` | Timestamp variant |
| `.crew-panel` | `<aside>` | Sidebar container |
| `.crew-panel__header` | `<div>` | Title + count row |
| `.crew-panel__title` | `<h2>` | Panel heading |
| `.badge` | `<span>` | Crew count badge |
| `.crew-list` | `<ul>` | Cards container |
| `.crew-card` | `<li>` | Individual crew card |
| `.crew-card__avatar` | `<div>` | Emoji avatar circle |
| `.crew-card__info` | `<div>` | Name + craft wrapper |
| `.crew-card__name` | `<span>` | Astronaut name |
| `.crew-card__craft` | `<span>` | Craft label |
| `.toast-container` | `<div>` | Toast stack |
| `.toast` | `<div>` | Single toast |
| `.toast--error` | modifier | Red toast |
| `.toast--info` | modifier | Blue toast |
| `.toast--leaving` | modifier | Exit animation |
| `.footer` | `<footer>` | Page footer |
| `.footer__text` | `<p>` | Credits text |
| `.iss-icon` | Leaflet DivIcon | Custom marker styling |
| `.skeleton` | placeholder | Loading shimmer |

---

## 6. JavaScript Architecture

### File Structure

```
js/
├── main.js              ← Entry point, orchestrator
└── modules/
    ├── api.js           ← All fetch calls (ISS position + crew)
    ├── map.js           ← Leaflet map init, marker, trail
    ├── crew.js          ← Crew list rendering
    ├── ui.js            ← Coordinate display, status indicator, toasts
    └── config.js        ← Constants and configuration
```

---

### `js/modules/config.js`

Exports all magic numbers and configuration values.

```js
/** @constant {string} ISS position endpoint */
export const ISS_POSITION_URL = 'http://api.open-notify.org/iss-now.json';

/** @constant {string} People in space endpoint */
export const ASTROS_URL = 'http://api.open-notify.org/astros.json';

/** @constant {number} Polling interval in milliseconds */
export const POLL_INTERVAL_MS = 5000;

/** @constant {number} Seconds after which data is considered stale */
export const STALE_THRESHOLD_S = 15;

/** @constant {number} Maximum trail points before oldest is dropped */
export const MAX_TRAIL_POINTS = 200;

/** @constant {number} Default map zoom level */
export const DEFAULT_ZOOM = 3;

/** @constant {string} Dark tile layer URL */
export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

/** @constant {string} Tile attribution */
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

/** @constant {number} Toast auto-dismiss duration in ms */
export const TOAST_DURATION_MS = 4000;
```

---

### `js/modules/api.js`

Handles all HTTP requests. Returns parsed JSON or throws.

```
Functions:
─────────────────────────────────────────────────────
fetchISSPosition()
  - Calls ISS_POSITION_URL
  - Returns { latitude: number, longitude: number, timestamp: number }
  - Throws on network / non-OK response

fetchAstros()
  - Calls ASTROS_URL
  - Returns { number: number, people: Array<{ name: string, craft: string }> }
  - Throws on network / non-OK response
```

#### `fetchISSPosition()` — Detailed

```
1. const response = await fetch(ISS_POSITION_URL)
2. if (!response.ok) throw new Error(`ISS API error: ${response.status}`)
3. const data = await response.json()
4. return {
     latitude:  parseFloat(data.iss_position.latitude),
     longitude: parseFloat(data.iss_position.longitude),
     timestamp: data.timestamp
   }
```

#### `fetchAstros()` — Detailed

```
1. const response = await fetch(ASTROS_URL)
2. if (!response.ok) throw new Error(`Astros API error: ${response.status}`)
3. const data = await response.json()
4. return data   // { message: "success", number: N, people: [...] }
```

---

### `js/modules/map.js`

Manages the Leaflet map instance, ISS marker, and orbit trail polyline.

```
State (module-level):
  let map         = null   // L.Map instance
  let issMarker   = null   // L.Marker with custom DivIcon
  let trailLine   = null   // L.Polyline
  let trailCoords = []     // Array of [lat, lng]
  let trailVisible = true

Functions:
─────────────────────────────────────────────────────
initMap(containerId, lat, lng)
  - Creates L.map on the given DOM id
  - Adds dark CartoDB tile layer
  - Sets view to [lat, lng] at DEFAULT_ZOOM
  - Creates ISS marker (L.divIcon with 🛰️ emoji, class "iss-icon")
  - Creates empty polyline with accent-blue colour
  - Stores references in module-level variables
  - Returns void

updateMarker(lat, lng)
  - Moves issMarker to [lat, lng] using setLatLng
  - Appends [lat, lng] to trailCoords
  - If trailCoords.length > MAX_TRAIL_POINTS, shift oldest
  - Updates trailLine.setLatLngs(trailCoords) if trailVisible
  - Returns void

recentreMap()
  - Pans map to issMarker's current position using map.setView
  - Returns void

toggleTrail()
  - If trailVisible: remove trailLine from map, set trailVisible = false
  - Else: add trailLine back to map, set trailVisible = true
  - Returns boolean (new visibility state)

getMap()
  - Returns the L.Map instance (for external access if needed)
```

#### ISS Marker Configuration

```js
const issIcon = L.divIcon({
  className: 'iss-icon',
  html: '🛰️',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});
```

#### Trail Polyline Configuration

```js
const trailLine = L.polyline([], {
  color: '#4da6ff',       // --clr-accent-blue
  weight: 2,
  opacity: 0.6,
  dashArray: '8 4'
}).addTo(map);
```

---

### `js/modules/crew.js`

Renders crew member cards into the DOM.

```
Functions:
─────────────────────────────────────────────────────
renderCrew(people)
  - Accepts Array<{ name: string, craft: string }>
  - Filters for craft === "ISS"
  - Clears #crew-list innerHTML
  - For each ISS crew member, creates an <li class="crew-card"> element:
      <li class="crew-card">
        <div class="crew-card__avatar">👤</div>
        <div class="crew-card__info">
          <span class="crew-card__name">{name}</span>
          <span class="crew-card__craft">{craft}</span>
        </div>
      </li>
  - Uses textContent (not innerHTML) for name/craft to prevent XSS
  - Updates #crew-count badge text with ISS crew count
  - Returns void

showCrewSkeleton(count)
  - Clears #crew-list
  - Inserts `count` skeleton placeholder <li> elements
  - Returns void
```

---

### `js/modules/ui.js`

Handles coordinate display, status indicator, and toast notifications.

```
Functions:
─────────────────────────────────────────────────────
updateCoordinates(lat, lng)
  - Formats lat to "xx.xxxx° N/S" and lng to "xxx.xxxx° E/W"
  - Sets textContent of #coord-lat and #coord-lng
  - Sets textContent of #coord-time to current time HH:MM:SS
  - Returns void

formatCoordinate(value, isLat)
  - Converts numeric lat/lng to human-readable string
  - isLat = true  → suffix N (positive) or S (negative)
  - isLat = false → suffix E (positive) or W (negative)
  - Fixed to 4 decimal places
  - Returns string e.g. "51.5074° N"

setStatus(state)
  - state: 'live' | 'stale' | 'error'
  - Removes all modifier classes from #status-indicator
  - Adds appropriate modifier class
  - Updates label text
  - Returns void

showToast(message, type)
  - type: 'error' | 'info'
  - Creates a .toast element and appends to #toast-container
  - Auto-removes after TOAST_DURATION_MS with leaving animation
  - Returns void
```

---

### `js/main.js`

Entry point. Imports all modules and orchestrates the application.

```
Imports:
  - { fetchISSPosition, fetchAstros } from './modules/api.js'
  - { initMap, updateMarker, recentreMap, toggleTrail } from './modules/map.js'
  - { renderCrew, showCrewSkeleton } from './modules/crew.js'
  - { updateCoordinates, setStatus, showToast } from './modules/ui.js'
  - { POLL_INTERVAL_MS } from './modules/config.js'

State:
  let pollTimerId = null
  let lastSuccessTimestamp = null

Functions:
─────────────────────────────────────────────────────
init()
  - Called on DOMContentLoaded
  - Shows crew skeleton loaders (6 items)
  - Calls fetchISSPosition() to get initial position
  - Calls initMap('map', lat, lng)
  - Calls updateCoordinates(lat, lng)
  - Calls setStatus('live')
  - Calls loadCrew()
  - Starts polling with startPolling()
  - Binds event listeners:
      #btn-recentre   → recentreMap()
      #btn-toggle-trail → toggleTrail()
      #btn-refresh-crew → loadCrew()
  - Wraps in try/catch; on error calls setStatus('error') and showToast

startPolling()
  - Sets pollTimerId = setInterval(pollPosition, POLL_INTERVAL_MS)
  - Returns void

pollPosition()
  - try:
      const pos = await fetchISSPosition()
      updateMarker(pos.latitude, pos.longitude)
      updateCoordinates(pos.latitude, pos.longitude)
      lastSuccessTimestamp = Date.now()
      setStatus('live')
  - catch:
      setStatus('error')
      showToast('Failed to fetch ISS position', 'error')

loadCrew()
  - try:
      showCrewSkeleton(6)
      const data = await fetchAstros()
      renderCrew(data.people)
  - catch:
      showToast('Failed to load crew data', 'error')

document.addEventListener('DOMContentLoaded', init)
```

---

## 7. Feature Details

### 7.1 — ISS Position Tracking

- **Endpoint:** `http://api.open-notify.org/iss-now.json`
- **Method:** GET, no authentication required.
- **Polling interval:** Every 5 000 ms via `setInterval`.
- On each tick, `fetchISSPosition()` returns `{ latitude, longitude, timestamp }`.
- `updateMarker()` moves the Leaflet marker using `marker.setLatLng([lat, lng])`.
- The map does NOT auto-pan on every update (only on user click of Re-centre), so the user can freely explore the map without being yanked back.

### 7.2 — Orbit Trail

- A Leaflet `L.polyline` is initialised as an empty array of coordinates.
- On each position update, the new `[lat, lng]` pair is pushed to `trailCoords`.
- When `trailCoords.length > MAX_TRAIL_POINTS` (200), `trailCoords.shift()` removes the oldest point to prevent memory growth.
- The polyline is styled: blue (#4da6ff), dashed, semi-transparent.
- The "Toggle Trail" button calls `toggleTrail()` which adds/removes the polyline layer from the map.

### 7.3 — Crew Roster

- **Endpoint:** `http://api.open-notify.org/astros.json`
- **Fetched:** Once on page load. Manually refreshable via "Refresh Crew" button.
- The response includes people on all spacecraft. The app filters for `craft === "ISS"`.
- Each crew member is rendered as a card with name and craft.
- The crew count badge updates dynamically.
- Names and craft values are inserted using `textContent` to prevent XSS.

### 7.4 — Coordinate Readout

- Latitude formatted as `xx.xxxx° N` or `xx.xxxx° S`.
- Longitude formatted as `xxx.xxxx° E` or `xxx.xxxx° W`.
- Timestamp shows local time in `HH:MM:SS` format using `toLocaleTimeString()`.
- Updated on every successful position fetch.

### 7.5 — Status Indicator

- Three states: **Live** (green pulsing dot), **Stale** (amber solid dot — data > 15 s old), **Error** (red solid dot — last fetch failed).
- Updated after each poll cycle.
- Uses CSS classes `.status-indicator--stale` and `.status-indicator--error`.

### 7.6 — Toast Notifications

- Appear in bottom-right corner.
- Two types: `error` (red) and `info` (blue).
- Auto-dismiss after 4 000 ms with a slide-out animation.
- Multiple toasts stack vertically.
- Uses `aria-live="assertive"` for screen reader announcements.

### 7.7 — Map Configuration

- **Tile provider:** CartoDB Dark Matter (`dark_all`) — fits the space theme.
- **Default zoom:** 3 (shows a large portion of the globe).
- **ISS marker:** Leaflet `divIcon` using the 🛰️ emoji with a gold drop-shadow.
- **Re-centre button:** Calls `map.setView(marker.getLatLng(), currentZoom)`.
- Map is fully interactive: pinch zoom, scroll zoom, drag to pan.

---

## 8. API Reference

### 8.1 — ISS Current Location

| Detail | Value |
|---|---|
| URL | `http://api.open-notify.org/iss-now.json` |
| Method | `GET` |
| Auth | None required |
| Rate limit | No hard limit, but be courteous (5 s intervals is fine) |
| CORS | Enabled |

**Example Response:**

```json
{
  "message": "success",
  "timestamp": 1743091200,
  "iss_position": {
    "latitude": "51.5074",
    "longitude": "-0.1278"
  }
}
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `message` | string | `"success"` on success |
| `timestamp` | number | Unix timestamp (seconds) |
| `iss_position.latitude` | string | Decimal degrees (parse with `parseFloat`) |
| `iss_position.longitude` | string | Decimal degrees (parse with `parseFloat`) |

---

### 8.2 — People in Space

| Detail | Value |
|---|---|
| URL | `http://api.open-notify.org/astros.json` |
| Method | `GET` |
| Auth | None required |
| CORS | Enabled |

**Example Response:**

```json
{
  "message": "success",
  "number": 10,
  "people": [
    { "name": "Oleg Kononenko", "craft": "ISS" },
    { "name": "Nikolai Chub", "craft": "ISS" },
    { "name": "Tracy Caldwell Dyson", "craft": "ISS" },
    { "name": "Matthew Dominick", "craft": "ISS" },
    { "name": "Michael Barratt", "craft": "ISS" },
    { "name": "Jeanette Epps", "craft": "ISS" },
    { "name": "Alexander Grebenkin", "craft": "ISS" },
    { "name": "Butch Wilmore", "craft": "ISS" },
    { "name": "Sunita Williams", "craft": "ISS" },
    { "name": "Li Cong", "craft": "Tiangong" }
  ]
}
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `message` | string | `"success"` on success |
| `number` | number | Total people in space across all craft |
| `people` | array | Each entry has `name` (string) and `craft` (string) |

**Note:** The `craft` field can be `"ISS"`, `"Tiangong"`, or other station names. The app filters for `"ISS"` only.

---

## 9. Implementation Order

### Phase 1 — Project Scaffold

1. Create `index.html` with the full HTML structure (Section 4).
2. Create `styles/main.css` with CSS variables and reset only — verify the page loads with the dark background.
3. Create empty JS files: `js/main.js`, `js/modules/config.js`, `js/modules/api.js`, `js/modules/map.js`, `js/modules/crew.js`, `js/modules/ui.js`.
4. Start local server: `cd space-tracker && python3 -m http.server 5500`.
5. Confirm the page loads with correct fonts, dark background, and no console errors.

### Phase 2 — Map Foundation

6. Implement `js/modules/config.js` with all constants.
7. Implement `initMap()` in `js/modules/map.js` — render the Leaflet map with the dark tile layer.
8. In `js/main.js`, import `initMap` and call it on `DOMContentLoaded` with hardcoded coordinates.
9. Verify the map renders correctly in the browser.

### Phase 3 — API Integration

10. Implement `fetchISSPosition()` in `js/modules/api.js`.
11. Implement `fetchAstros()` in `js/modules/api.js`.
12. In `js/main.js`, replace the hardcoded coordinates with the live API response.
13. Verify the ISS marker appears at the correct real-time position.

### Phase 4 — Live Tracking

14. Implement `updateMarker()` in `js/modules/map.js` (move marker, extend trail).
15. Implement `startPolling()` and `pollPosition()` in `js/main.js`.
16. Verify the marker moves every 5 seconds and the trail draws behind it.

### Phase 5 — UI Panels

17. Implement `updateCoordinates()` and `formatCoordinate()` in `js/modules/ui.js`.
18. Implement `setStatus()` in `js/modules/ui.js`.
19. Implement `showToast()` in `js/modules/ui.js`.
20. Wire coordinate updates into the polling cycle.
21. Verify coordinates update live and the status indicator pulses green.

### Phase 6 — Crew Roster

22. Implement `renderCrew()` and `showCrewSkeleton()` in `js/modules/crew.js`.
23. Call `loadCrew()` from `js/main.js` on init.
24. Wire up the "Refresh Crew" button.
25. Verify crew cards appear in the sidebar with correct names and count badge.

### Phase 7 — Controls & Polish

26. Wire up "Re-centre" button → `recentreMap()`.
27. Wire up "Toggle Trail" button → `toggleTrail()`.
28. Add all remaining CSS (buttons, transitions, hover states, shadow-glow).
29. Add the complete responsive media queries.
30. Test at desktop (1200 px), tablet (768 px), and mobile (375 px).

### Phase 8 — Error Handling & Edge Cases

31. Test with network disconnected — verify error toast appears and status turns red.
32. Test API returning non-200 — verify graceful fallback.
33. Confirm no `innerHTML` is used with untrusted data anywhere.
34. Run through keyboard navigation — tab order, focus styles, button activation.
35. Verify `aria-live` regions announce updates to screen readers.

### Phase 9 — Final Review

36. Clean up any console.log statements.
37. Add file header comments to each JS file per the repo conventions.
38. Verify all paths are relative (no leading `/`).
39. Final cross-browser check (Chrome, Firefox, Safari).
40. Update `README.md` if any features were added or changed during implementation.
