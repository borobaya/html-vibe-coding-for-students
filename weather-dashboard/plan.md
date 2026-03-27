# Weather Dashboard — Implementation Plan

---

## 1. Overview

### What It Is

The Weather Dashboard is a browser-based weather application that fetches real-time weather data from the **OpenWeatherMap API** and presents it in a clean, responsive dashboard layout. Users can search for any city worldwide to view current conditions, a 5-day forecast, and detailed atmospheric stats. The app features dynamic theming — the colour palette shifts to match the current weather conditions (warm tones for sunny skies, cool tones for rain, dark tones for nighttime). Built entirely with vanilla HTML5, CSS3, and JavaScript (ES2022+) — no frameworks, no build tools.

### Core User Flow (Step by Step)

1. User opens `index.html` in a browser (or via a local server at `http://localhost:5500`).
2. On first visit, the app attempts to use the **Browser Geolocation API** to detect the user's location and fetch weather for their current city. If geolocation is denied or unavailable, a default city (London) is loaded.
3. The dashboard renders with:
   - A **search bar** at the top.
   - A **current weather card** showing temperature, description, icon, and key stats.
   - A **5-day forecast strip** with daily high/low temperatures and weather icons.
   - A **weather details panel** showing humidity, wind speed/direction, pressure, sunrise/sunset, feels-like temperature, and visibility.
4. User types a city name into the search bar and presses **Enter** or clicks the **Search** button.
5. The app fetches current weather and 5-day forecast data from OpenWeatherMap.
6. The dashboard updates with the new city's data — cards fade in with a smooth transition.
7. The searched city is saved to **recent searches** (displayed as clickable chips below the search bar, stored in `localStorage`).
8. User can click any recent search chip to instantly reload that city's weather.
9. User can toggle between **°C** and **°F** using a toggle switch — the preference is saved in `localStorage`.
10. If the city is not found or a network error occurs, a user-friendly error message is displayed inline (no browser alerts).
11. On return visits, the app loads the **last viewed city** from `localStorage`.

### API Used

- **OpenWeatherMap Free Tier** — [https://openweathermap.org/api](https://openweathermap.org/api)
- Free tier allows **60 calls/minute** and **1,000,000 calls/month**.
- Two endpoints used:
  - **Current Weather**: `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric`
  - **5-Day / 3-Hour Forecast**: `https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric`
- Students must sign up for their own free API key at [https://openweathermap.org/api](https://openweathermap.org/api).

---

## 2. Page Layout

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
│  ☁️  Weather Dashboard                              [°C / °F toggle] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🔍 [  Search for a city...                    ] [SearchBtn] │  │
│  │  Recent: [London ✕] [Paris ✕] [Tokyo ✕]                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────┐  ┌────────────────────────────────┐  │
│  │  CURRENT WEATHER CARD     │  │  WEATHER DETAILS PANEL         │  │
│  │                           │  │                                │  │
│  │  📍 London, GB            │  │  💧 Humidity:     65%          │  │
│  │                           │  │  💨 Wind:         12 km/h NW   │  │
│  │      ☀️  (large icon)      │  │  🌡️  Feels Like:  19°C        │  │
│  │                           │  │  📊 Pressure:    1013 hPa      │  │
│  │      22°C                 │  │  👁️  Visibility:  10 km        │  │
│  │  "Clear Sky"              │  │  🌅 Sunrise:     06:12        │  │
│  │                           │  │  🌇 Sunset:      20:34        │  │
│  │  Updated: 14:32           │  │  🧭 Wind Dir:    315° (NW)    │  │
│  │                           │  │                                │  │
│  └───────────────────────────┘  └────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  5-DAY FORECAST                                               │  │
│  │                                                               │  │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐               │  │
│  │  │ Mon │  │ Tue │  │ Wed │  │ Thu │  │ Fri │               │  │
│  │  │ ☀️   │  │ 🌤️   │  │ 🌧️   │  │ ⛅  │  │ ☀️   │               │  │
│  │  │24/18│  │22/16│  │19/14│  │21/15│  │25/19│               │  │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘               │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                             │
│  Data from OpenWeatherMap  •  Weather Dashboard © 2026              │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (≤ 768px)

```
┌──────────────────────────────┐
│  ☁️  Weather Dashboard       │
│                [°C/°F toggle]│
├──────────────────────────────┤
│  🔍 [Search...   ] [🔎]     │
│  Recent: [London] [Paris]    │
├──────────────────────────────┤
│  CURRENT WEATHER CARD        │
│  📍 London, GB               │
│       ☀️   22°C               │
│       "Clear Sky"            │
│  Updated: 14:32              │
├──────────────────────────────┤
│  WEATHER DETAILS             │
│  (2-column grid)             │
│  💧 65%       💨 12 km/h     │
│  🌡️  19°C      📊 1013 hPa   │
│  👁️  10 km     🌅 06:12      │
│  🌇 20:34     🧭 NW          │
├──────────────────────────────┤
│  5-DAY FORECAST              │
│  (horizontal scroll)         │
│  [Mon] [Tue] [Wed] [Thu]...  │
├──────────────────────────────┤
│  Footer                      │
└──────────────────────────────┘
```

### UI Sections — Detailed Descriptions

#### Header

- Contains the app title ("Weather Dashboard") with a weather emoji icon.
- Right-aligned temperature unit toggle switch (°C / °F) styled as a pill-shaped slider.
- Sticky at the top on scroll.

#### Search Section

- Full-width text input with placeholder "Search for a city...".
- Search button (magnifying glass icon) on the right of the input.
- Pressing **Enter** or clicking the button triggers the search.
- Below the input: a row of **recent search chips** — small rounded pills showing previously searched city names with an **✕** button to remove individual entries.
- Maximum of **6** recent searches displayed; oldest are removed when the limit is exceeded.

#### Current Weather Card

- Displays the city name and country code (e.g. "London, GB").
- A large weather icon (emoji-based, mapped from API condition codes).
- The current temperature in large text.
- A weather description in sentence case (e.g. "Partly cloudy").
- "Last updated" timestamp showing when the data was fetched.

#### Weather Details Panel

- A grid of individual stat items, each with an emoji icon, label, and value:
  - **Humidity** — percentage.
  - **Wind Speed** — in km/h (metric) or mph (imperial) with cardinal direction (N, NE, E, etc.).
  - **Feels Like** — adjusted temperature.
  - **Pressure** — in hPa.
  - **Visibility** — in km or miles.
  - **Sunrise** — local time.
  - **Sunset** — local time.
  - **Wind Direction** — degrees with compass label.

#### 5-Day Forecast Strip

- A horizontal row of 5 cards, one per day.
- Each card shows:
  - Day name (Mon, Tue, etc.).
  - Weather icon (emoji).
  - High temperature / Low temperature.
- On mobile, the strip scrolls horizontally if needed.

#### Footer

- Simple text: data attribution to OpenWeatherMap and copyright.

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| **≥ 1024px** (desktop) | Two-column layout: current weather card on the left, details panel on the right. Forecast strip spans full width below. |
| **768px – 1023px** (tablet) | Same two-column layout but narrower. Forecast cards shrink slightly. |
| **≤ 767px** (mobile) | Single-column stack: search → current weather → details (2-col grid) → forecast (horizontal scroll). Header unit toggle moves below title. |

---

## 3. Colour Scheme & Typography

### Colour Palette

| Purpose | Colour Name | Hex | Usage |
|---|---|---|---|
| Primary Background | Cloud White | `#F0F4F8` | Page background |
| Card Background | White | `#FFFFFF` | Weather cards, details panel |
| Primary Text | Charcoal | `#1A1A2E` | Headings, main temperature |
| Secondary Text | Slate Grey | `#64748B` | Descriptions, labels, timestamps |
| Accent / Primary | Sky Blue | `#3B82F6` | Search button, active states, links |
| Accent Hover | Deep Blue | `#2563EB` | Button hover states |
| Border / Divider | Light Grey | `#E2E8F0` | Card borders, separators |
| Success | Green | `#22C55E` | Successful data load indicator |
| Warning | Amber | `#F59E0B` | API rate limit warnings |
| Error | Red | `#EF4444` | Error messages, city not found |
| Error Background | Light Red | `#FEF2F2` | Error message container background |
| Forecast Card BG | Ice Blue | `#EFF6FF` | 5-day forecast card background |
| Detail Icon BG | Pale Blue | `#DBEAFE` | Circular background behind detail icons |
| Shadow | Shadow Grey | `rgba(0,0,0,0.08)` | Card box-shadows |

### Dynamic Weather Themes

The dashboard applies a CSS class to `<body>` based on the current weather condition, shifting the accent colours and background gradient:

| Weather Condition | Theme Class | Background Gradient | Accent Colour |
|---|---|---|---|
| Clear (day) | `theme-sunny` | `#FEF9C3 → #FDE68A` (warm yellow) | `#F59E0B` (amber) |
| Clear (night) | `theme-night` | `#1E1B4B → #312E81` (deep indigo) | `#818CF8` (indigo) |
| Clouds | `theme-cloudy` | `#F1F5F9 → #CBD5E1` (grey) | `#64748B` (slate) |
| Rain / Drizzle | `theme-rainy` | `#E0F2FE → #BAE6FD` (cool blue) | `#0EA5E9` (sky blue) |
| Thunderstorm | `theme-storm` | `#1E293B → #334155` (dark slate) | `#A78BFA` (violet) |
| Snow | `theme-snow` | `#F8FAFC → #E2E8F0` (ice white) | `#06B6D4` (cyan) |
| Mist / Haze / Fog | `theme-mist` | `#F5F5F4 → #D6D3D1` (stone) | `#78716C` (warm grey) |

### CSS Variables Block

```css
:root {
  /* --- Base Palette --- */
  --color-bg-primary: #F0F4F8;
  --color-bg-card: #FFFFFF;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #64748B;
  --color-accent: #3B82F6;
  --color-accent-hover: #2563EB;
  --color-border: #E2E8F0;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-error-bg: #FEF2F2;
  --color-forecast-bg: #EFF6FF;
  --color-detail-icon-bg: #DBEAFE;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.12);

  /* --- Dynamic Theme (overridden by theme classes) --- */
  --theme-bg-start: #F0F4F8;
  --theme-bg-end: #F0F4F8;
  --theme-accent: #3B82F6;

  /* --- Typography --- */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* --- Spacing --- */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* --- Border Radius --- */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* --- Transitions --- */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### Typography

| Role | Font | Weight | Size | Source |
|---|---|---|---|---|
| Headings (h1) | Inter | 700 (Bold) | 28px / 1.75rem | Google Fonts |
| Headings (h2) | Inter | 600 (Semibold) | 22px / 1.375rem | Google Fonts |
| Temperature (large) | Inter | 700 (Bold) | 64px / 4rem | Google Fonts |
| Temperature (forecast) | Inter | 600 (Semibold) | 18px / 1.125rem | Google Fonts |
| Body Text | Inter | 400 (Regular) | 16px / 1rem | Google Fonts |
| Labels / Captions | Inter | 500 (Medium) | 14px / 0.875rem | Google Fonts |
| Small Text | Inter | 400 (Regular) | 12px / 0.75rem | Google Fonts |
| Monospace (times) | JetBrains Mono | 400 (Regular) | 14px / 0.875rem | Google Fonts |

### Visual Style Description

The app follows a **clean, modern weather dashboard aesthetic** — white cards with subtle shadows floating on a light tinted background. Generous whitespace, rounded corners, and a single accent colour provide visual coherence. The large temperature reading dominates the current weather card as the hero element. Weather icons use emoji for universal support without custom assets. The dynamic weather theme creates an immersive feel — warm amber gradients for sunny days, cool blues for rain, deep indigos for nighttime — all applied via CSS custom properties so transitions between themes are smooth.

---

## 4. File Structure

```
weather-dashboard/
├── index.html              # Main HTML page — semantic structure, all UI sections
├── js/
│   ├── main.js             # Entry point — initialises app, coordinates modules
│   └── modules/
│       ├── api.js           # API calls — fetches weather and forecast data from OpenWeatherMap
│       ├── config.js        # API key and endpoint constants
│       ├── dom.js           # DOM rendering — creates/updates all weather display elements
│       ├── search.js        # Search logic — input handling, debouncing, recent searches
│       ├── storage.js       # localStorage — save/load recent searches, last city, unit preference
│       ├── theme.js         # Dynamic theming — applies weather-based theme classes
│       └── utils.js         # Helpers — date formatting, wind direction, temp conversion, icon mapping
├── styles/
│   └── main.css            # All styles — variables, layout, components, themes, responsive, animations
├── assets/                  # Reserved for any future static assets (favicons, images)
├── plan.md                  # This implementation plan
└── README.md                # Project documentation
```

### File Purposes

| File | Purpose |
|---|---|
| `index.html` | Semantic HTML shell; contains all static structure (header, search, card containers, footer) and links to CSS/JS |
| `js/main.js` | App entry point; imports all modules, runs initialisation on `DOMContentLoaded`, wires up event listeners |
| `js/modules/api.js` | Exports `fetchCurrentWeather(city)` and `fetchForecast(city)` — both return parsed JSON; handles HTTP errors |
| `js/modules/config.js` | Exports `API_KEY`, `BASE_URL`, and endpoint builder functions; students replace the API key here |
| `js/modules/dom.js` | Exports render functions: `renderCurrentWeather(data)`, `renderForecast(data)`, `renderDetails(data)`, `renderError(msg)`, `renderRecentSearches(list)` |
| `js/modules/search.js` | Exports `initSearch()` — attaches input/button listeners, validates input, calls API, manages debounce |
| `js/modules/storage.js` | Exports `getRecentSearches()`, `addRecentSearch(city)`, `removeRecentSearch(city)`, `getLastCity()`, `setLastCity(city)`, `getUnit()`, `setUnit(unit)` |
| `js/modules/theme.js` | Exports `applyWeatherTheme(weatherCode, isNight)` — adds/removes theme classes on `<body>` |
| `js/modules/utils.js` | Exports helper functions: `formatTemp()`, `formatTime()`, `getWindDirection()`, `getWeatherEmoji()`, `formatDate()`, `debounce()` |
| `styles/main.css` | Complete stylesheet — CSS custom properties, base reset, layout grid, all component styles, theme overrides, animations, media queries |

---

## 5. HTML Structure

### Document Head

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Weather Dashboard — search for any city to view current conditions and a 5-day forecast">
  <title>Weather Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
```

### Body Structure (Detailed)

```html
<body>
  <!-- HEADER -->
  <header class="header">
    <div class="header__title">
      <span class="header__icon" aria-hidden="true">☁️</span>
      <h1 class="header__heading">Weather Dashboard</h1>
    </div>
    <div class="unit-toggle" role="radiogroup" aria-label="Temperature unit">
      <button class="unit-toggle__btn unit-toggle__btn--active" data-unit="metric" aria-pressed="true">°C</button>
      <button class="unit-toggle__btn" data-unit="imperial" aria-pressed="false">°F</button>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <main class="main">

    <!-- SEARCH SECTION -->
    <section class="search" aria-label="City search">
      <form class="search__form" role="search">
        <label for="search-input" class="sr-only">Search for a city</label>
        <input
          type="text"
          id="search-input"
          class="search__input"
          placeholder="Search for a city..."
          autocomplete="off"
          required
        >
        <button type="submit" class="search__btn" aria-label="Search">
          <span aria-hidden="true">🔍</span>
        </button>
      </form>
      <!-- Recent searches — dynamically generated -->
      <div class="search__recent" aria-label="Recent searches" role="list">
        <!-- JS injects chips here:
          <button class="search__chip" role="listitem" data-city="London">
            London <span class="search__chip-remove" aria-label="Remove London">✕</span>
          </button>
        -->
      </div>
    </section>

    <!-- ERROR MESSAGE (hidden by default) -->
    <div class="error" role="alert" aria-live="polite" hidden>
      <span class="error__icon" aria-hidden="true">⚠️</span>
      <p class="error__message"></p>
    </div>

    <!-- LOADING SPINNER (hidden by default) -->
    <div class="loading" aria-live="polite" hidden>
      <div class="loading__spinner" aria-hidden="true"></div>
      <p class="loading__text">Fetching weather data...</p>
    </div>

    <!-- WEATHER DASHBOARD (hidden until data loads) -->
    <div class="dashboard" hidden>

      <!-- Top row: Current Weather + Details -->
      <div class="dashboard__top">

        <!-- CURRENT WEATHER CARD -->
        <section class="current-weather" aria-label="Current weather conditions">
          <h2 class="current-weather__city">
            <span class="current-weather__city-name">—</span>,
            <span class="current-weather__country">—</span>
          </h2>
          <div class="current-weather__icon" aria-hidden="true">☀️</div>
          <p class="current-weather__temp">—°</p>
          <p class="current-weather__description">—</p>
          <p class="current-weather__updated">
            <time class="current-weather__time" datetime="">—</time>
          </p>
        </section>

        <!-- WEATHER DETAILS PANEL -->
        <section class="weather-details" aria-label="Detailed weather information">
          <h2 class="weather-details__title">Weather Details</h2>
          <dl class="weather-details__grid">
            <!-- Each detail item -->
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">💧</span> Humidity
              </dt>
              <dd class="weather-details__value" data-detail="humidity">—%</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">💨</span> Wind
              </dt>
              <dd class="weather-details__value" data-detail="wind">— km/h</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">🌡️</span> Feels Like
              </dt>
              <dd class="weather-details__value" data-detail="feels-like">—°</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">📊</span> Pressure
              </dt>
              <dd class="weather-details__value" data-detail="pressure">— hPa</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">👁️</span> Visibility
              </dt>
              <dd class="weather-details__value" data-detail="visibility">— km</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">🌅</span> Sunrise
              </dt>
              <dd class="weather-details__value" data-detail="sunrise">—</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">🌇</span> Sunset
              </dt>
              <dd class="weather-details__value" data-detail="sunset">—</dd>
            </div>
            <div class="weather-details__item">
              <dt class="weather-details__label">
                <span class="weather-details__icon" aria-hidden="true">🧭</span> Wind Dir
              </dt>
              <dd class="weather-details__value" data-detail="wind-direction">—</dd>
            </div>
          </dl>
        </section>

      </div>

      <!-- FORECAST SECTION -->
      <section class="forecast" aria-label="5-day weather forecast">
        <h2 class="forecast__title">5-Day Forecast</h2>
        <div class="forecast__cards" role="list">
          <!-- JS generates 5 forecast cards:
            <article class="forecast__card" role="listitem">
              <h3 class="forecast__day">Mon</h3>
              <div class="forecast__icon" aria-hidden="true">🌤️</div>
              <p class="forecast__temp">
                <span class="forecast__high">22°</span>
                <span class="forecast__low">16°</span>
              </p>
            </article>
          -->
        </div>
      </section>

    </div>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <p class="footer__text">
      Data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" class="footer__link">OpenWeatherMap</a>
      &bull; Weather Dashboard &copy; 2026
    </p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Static vs Dynamically Generated Elements

| Element | Static / Dynamic | Notes |
|---|---|---|
| Header, footer | Static | Always present in HTML |
| Search form (input + button) | Static | HTML structure stays; JS adds event listeners |
| Recent search chips | **Dynamic** | JS injects `<button>` chips from `localStorage` data |
| Error message | Static container, **dynamic** content | Container exists hidden; JS shows it and sets the message text |
| Loading spinner | Static container | Hidden/shown via `hidden` attribute |
| Current weather card | Static container, **dynamic** values | Container and labels in HTML; JS updates text content and icon |
| Weather details grid | Static container and labels, **dynamic** values | `<dd>` values updated by JS |
| 5-day forecast cards | **Fully dynamic** | JS creates all `<article>` card elements from API data |

### Accessibility Notes

- `role="search"` on the search form.
- `aria-label` on all `<section>` elements for screen reader context.
- `aria-live="polite"` on the error and loading containers so screen readers announce changes.
- `sr-only` class on the search input label (visually hidden but readable).
- `aria-hidden="true"` on all decorative emoji icons.
- `role="list"` and `role="listitem"` on forecast card containers.
- `aria-pressed` on unit toggle buttons to indicate active state.
- `<time>` element with `datetime` attribute for the "last updated" timestamp.
- All interactive elements are native `<button>` or `<input>` for keyboard accessibility.

---

## 6. CSS Architecture

### Layout Approach

- **CSS Grid** for the main dashboard layout — two-column top row (current weather + details), full-width forecast strip.
- **Flexbox** for internal component layouts — header, search bar, forecast card row, detail items.
- **CSS Grid** for the weather details panel — 2×4 grid of detail items.

### Dashboard Grid (Desktop)

```css
.dashboard__top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}
```

On mobile (`≤ 767px`):
```css
.dashboard__top {
  grid-template-columns: 1fr;
}
```

### Major CSS Components

| Class | Description |
|---|---|
| `.header` | Flex row, space-between, sticky top, z-index above content, blurred background |
| `.header__title` | Flex row with icon + h1 |
| `.unit-toggle` | Pill-shaped container; two `<button>` children, `.unit-toggle__btn--active` has accent background |
| `.search` | Full-width section with max-width constraint, centered |
| `.search__form` | Flex row; input takes remaining space, button fixed width |
| `.search__input` | Rounded left corners, border, focus ring with accent colour, large padding |
| `.search__btn` | Rounded right corners, accent background, white text, pointer cursor |
| `.search__recent` | Flex row, wrapping, gap between chips |
| `.search__chip` | Small rounded pill with background, text + ✕ button; hover darkens background |
| `.error` | Flex row, red border-left accent, light red background, icon + message |
| `.loading` | Centred flex column, spinner + text |
| `.loading__spinner` | `border` spinner animation (rotating ring) via `@keyframes spin` |
| `.dashboard` | Max-width container, centred, padding |
| `.dashboard__top` | CSS Grid, 2 columns on desktop, 1 column on mobile |
| `.current-weather` | Card with white background, shadow, rounded corners, centred text, padding |
| `.current-weather__icon` | Large emoji, `font-size: 4rem`, subtle bounce animation |
| `.current-weather__temp` | Extra-large text (`4rem`), bold weight |
| `.weather-details` | Card matching current weather card styling |
| `.weather-details__grid` | CSS Grid, 2 columns, gap between items |
| `.weather-details__item` | Flex row, icon and label left, value right, border-bottom separator |
| `.weather-details__icon` | Small circular background (`var(--color-detail-icon-bg)`), centred emoji |
| `.forecast` | Full width section below dashboard__top |
| `.forecast__cards` | Flex row, gap, horizontal scroll on mobile (`overflow-x: auto`) |
| `.forecast__card` | Fixed-width card, centred content, rounded corners, light background, hover lift |
| `.footer` | Centred text, small font, top border separator, padding |
| `.sr-only` | Visually hidden but accessible (clip-rect pattern) |

### Animations & Transitions

| Animation | Trigger | CSS |
|---|---|---|
| **Card fade-in** | Weather data loads | `@keyframes fadeInUp` — opacity 0→1, translateY 10px→0; applied via `.dashboard.is-visible` class |
| **Loading spinner** | API call in progress | `@keyframes spin` — 360° border-top rotation, infinite loop |
| **Weather icon bounce** | Data renders | `@keyframes gentleBounce` — subtle translateY oscillation, 2s infinite |
| **Card hover lift** | Mouse over forecast card | `transform: translateY(-4px); box-shadow: var(--shadow-card-hover);` — `transition: var(--transition-normal)` |
| **Theme transition** | Weather condition changes | `background: linear-gradient(...)` with `transition: background var(--transition-slow)` on `<body>` |
| **Error shake** | Error appears | `@keyframes shake` — small horizontal oscillation, runs once |
| **Chip appear** | Recent search added | `@keyframes scaleIn` — scale 0.8→1 with opacity |
| **Focus ring** | Keyboard focus on inputs/buttons | `outline: 3px solid var(--color-accent); outline-offset: 2px;` |

### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1023px) {
  .dashboard__top {
    gap: var(--spacing-md);
  }
  .current-weather__temp {
    font-size: 3rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .dashboard__top {
    grid-template-columns: 1fr;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  .forecast__cards {
    overflow-x: auto;
    flex-wrap: nowrap;
    scroll-snap-type: x mandatory;
  }
  .forecast__card {
    flex: 0 0 120px;
    scroll-snap-align: start;
  }
  .weather-details__grid {
    grid-template-columns: 1fr 1fr;
  }
  .current-weather__temp {
    font-size: 2.5rem;
  }
}
```

### Dynamic Theme Classes

Applied to `<body>` by `theme.js`:

```css
body.theme-sunny {
  --theme-bg-start: #FEF9C3;
  --theme-bg-end: #FDE68A;
  --theme-accent: #F59E0B;
}
body.theme-night {
  --theme-bg-start: #1E1B4B;
  --theme-bg-end: #312E81;
  --theme-accent: #818CF8;
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #CBD5E1;
  --color-bg-card: rgba(30, 27, 75, 0.6);
  --color-border: #3730A3;
}
body.theme-cloudy {
  --theme-bg-start: #F1F5F9;
  --theme-bg-end: #CBD5E1;
  --theme-accent: #64748B;
}
body.theme-rainy {
  --theme-bg-start: #E0F2FE;
  --theme-bg-end: #BAE6FD;
  --theme-accent: #0EA5E9;
}
body.theme-storm {
  --theme-bg-start: #1E293B;
  --theme-bg-end: #334155;
  --theme-accent: #A78BFA;
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-bg-card: rgba(30, 41, 59, 0.7);
}
body.theme-snow {
  --theme-bg-start: #F8FAFC;
  --theme-bg-end: #E2E8F0;
  --theme-accent: #06B6D4;
}
body.theme-mist {
  --theme-bg-start: #F5F5F4;
  --theme-bg-end: #D6D3D1;
  --theme-accent: #78716C;
}
```

The background gradient is applied to `<body>`:
```css
body {
  background: linear-gradient(135deg, var(--theme-bg-start), var(--theme-bg-end));
  transition: background var(--transition-slow);
  min-height: 100vh;
}
```

---

## 7. JavaScript Architecture

### Module Breakdown

```
js/main.js                 ← Entry point, imports + coordinates
js/modules/config.js       ← API key + URL constants
js/modules/api.js          ← fetch() calls to OpenWeatherMap
js/modules/dom.js          ← All DOM rendering + updates
js/modules/search.js       ← Search input handling + debounce
js/modules/storage.js      ← localStorage read/write
js/modules/theme.js        ← Weather-based theme switching
js/modules/utils.js        ← Pure helper functions
```

### `js/modules/config.js`

```javascript
// Students: replace this with your own API key from https://openweathermap.org/api
export const API_KEY = 'YOUR_API_KEY_HERE';

export const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const ENDPOINTS = {
  currentWeather: (city, units = 'metric') =>
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`,
  forecast: (city, units = 'metric') =>
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`,
  currentWeatherByCoords: (lat, lon, units = 'metric') =>
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
  forecastByCoords: (lat, lon, units = 'metric') =>
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
};

export const MAX_RECENT_SEARCHES = 6;
export const DEBOUNCE_DELAY = 400; // ms
```

### `js/modules/api.js`

**Exports:**
- `fetchCurrentWeather(city, units)` → `Promise<Object>` — fetches current conditions.
- `fetchForecast(city, units)` → `Promise<Object>` — fetches 5-day/3-hour forecast.
- `fetchWeatherByCoords(lat, lon, units)` → `Promise<Object>` — fetches current weather by coordinates.
- `fetchForecastByCoords(lat, lon, units)` → `Promise<Object>` — fetches forecast by coordinates.

**Implementation details:**
- All functions use `fetch()` with `try/catch`.
- Check `response.ok` before parsing JSON; if not ok, throw a descriptive error.
- Handle specific HTTP status codes:
  - `404` → "City not found. Please check the spelling and try again."
  - `401` → "Invalid API key. Please check your config.js file."
  - `429` → "API rate limit reached. Please wait a moment and try again."
  - Other errors → "Something went wrong. Please try again later."
- Returns parsed JSON data on success.

**Example structure:**

```javascript
export async function fetchCurrentWeather(city, units = 'metric') {
  const url = ENDPOINTS.currentWeather(city, units);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }
    return await response.json();
  } catch (error) {
    throw getErrorMessage(error);
  }
}
```

### `js/modules/dom.js`

**Exports:**
- `renderCurrentWeather(data, unit)` — Updates the current weather card with city, temp, icon, description, timestamp.
- `renderForecast(data, unit)` — Clears and rebuilds the 5 forecast cards from API data.
- `renderDetails(data, unit)` — Updates all 8 weather detail `<dd>` values.
- `renderRecentSearches(searches)` — Clears and rebuilds the recent search chips.
- `renderError(message)` — Shows the error container with the given message.
- `clearError()` — Hides the error container.
- `showLoading()` — Shows the loading spinner, hides dashboard.
- `hideLoading()` — Hides the loading spinner, shows dashboard with fade-in.
- `showDashboard()` — Removes `hidden` from dashboard, adds `is-visible` for animation.

**DOM update approach:**
- Use `textContent` (never `innerHTML`) for all user-facing data to prevent XSS.
- For forecast cards (fully dynamic), build elements with `document.createElement()` and append.
- Clear dynamic containers with a while loop removing `firstChild` before re-rendering.

### `js/modules/search.js`

**Exports:**
- `initSearch(onSearch)` — Sets up the search form submit listener and recent search chip click handlers.

**Behaviour:**
1. Attach `submit` event to `.search__form`.
2. Prevent default, trim input value, validate non-empty.
3. Call the `onSearch(city)` callback provided by `main.js`.
4. Attach delegated `click` event to `.search__recent` for chip clicks (load city) and ✕ buttons (remove from recents).
5. **Debouncing** is not applied to form submit (it's intentional), but is available via `utils.js` if an autocomplete feature is added later.

### `js/modules/storage.js`

**Exports:**

| Function | Description |
|---|---|
| `getRecentSearches()` | Returns `string[]` from localStorage key `weather_recent` (max 6). Returns `[]` if empty. |
| `addRecentSearch(city)` | Adds city to the front of the array. Removes duplicates (case-insensitive). Trims to max 6. Saves to localStorage. |
| `removeRecentSearch(city)` | Removes a city from the array. Saves to localStorage. |
| `getLastCity()` | Returns the last viewed city string, or `null`. Key: `weather_last_city`. |
| `setLastCity(city)` | Saves the city string. Key: `weather_last_city`. |
| `getUnit()` | Returns `'metric'` or `'imperial'`. Key: `weather_unit`. Defaults to `'metric'`. |
| `setUnit(unit)` | Saves the unit preference. Key: `weather_unit`. |

**All localStorage operations wrapped in try/catch** to handle cases where storage is disabled or full.

### `js/modules/theme.js`

**Exports:**
- `applyWeatherTheme(weatherId, sunriseTimestamp, sunsetTimestamp)` — Determines the correct theme class and applies it to `<body>`.

**Logic:**

1. Determine if it's night: current time is before sunrise or after sunset.
2. Map the OpenWeatherMap **weather condition ID** to a theme class:
   - `200–299` (Thunderstorm) → `theme-storm`
   - `300–399` (Drizzle) → `theme-rainy`
   - `500–599` (Rain) → `theme-rainy`
   - `600–699` (Snow) → `theme-snow`
   - `700–799` (Atmosphere: mist, fog, haze) → `theme-mist`
   - `800` (Clear):
     - Day → `theme-sunny`
     - Night → `theme-night`
   - `801–804` (Clouds) → `theme-cloudy`
3. Remove all existing `theme-*` classes from `<body>`.
4. Add the new theme class.

### `js/modules/utils.js`

**Exports:**

| Function | Signature | Description |
|---|---|---|
| `getWeatherEmoji` | `(weatherId: number) → string` | Maps OpenWeatherMap condition ID to an emoji (see Weather Icons Mapping in section 8) |
| `formatTemp` | `(temp: number, unit: string) → string` | Returns rounded temp with unit symbol, e.g. `"22°C"` or `"72°F"` |
| `convertTemp` | `(tempCelsius: number, unit: string) → number` | Converts Celsius to Fahrenheit if unit is `'imperial'` |
| `formatTime` | `(unixTimestamp: number, timezoneOffset: number) → string` | Converts Unix timestamp to `HH:MM` format adjusted for the city's timezone |
| `formatDate` | `(unixTimestamp: number) → string` | Returns day name (e.g. "Mon", "Tue") |
| `formatFullDate` | `(unixTimestamp: number) → string` | Returns "Updated: HH:MM" string for the last-updated display |
| `getWindDirection` | `(degrees: number) → string` | Converts wind bearing degrees to compass direction (N, NE, E, SE, S, SW, W, NW) |
| `debounce` | `(fn: Function, delay: number) → Function` | Returns a debounced wrapper function |
| `capitalise` | `(str: string) → string` | Capitalises first letter of each word in a weather description |

### `js/main.js` — Entry Point

**Initialisation flow (on `DOMContentLoaded`):**

1. Import all modules.
2. Load saved unit preference from storage → set active toggle button.
3. Render recent searches from storage.
4. Attach unit toggle button listeners → on click: save preference, re-fetch and re-render with new unit.
5. Call `initSearch(handleSearch)` to wire up search form.
6. Determine initial city:
   - If `getLastCity()` returns a city → use it.
   - Else if browser supports geolocation → request position → fetch weather by coordinates.
   - Else → use `'London'` as default.
7. Call `handleSearch(initialCity)`.

**`handleSearch(city)` function:**

1. `clearError()`.
2. `showLoading()`.
3. Get current unit from storage.
4. `await` `fetchCurrentWeather(city, unit)` and `fetchForecast(city, unit)` in parallel using `Promise.all()`.
5. On success:
   - `renderCurrentWeather(currentData, unit)`.
   - `renderDetails(currentData, unit)`.
   - `renderForecast(forecastData, unit)`.
   - `applyWeatherTheme(currentData.weather[0].id, currentData.sys.sunrise, currentData.sys.sunset)`.
   - `addRecentSearch(city)` → `renderRecentSearches(getRecentSearches())`.
   - `setLastCity(city)`.
   - `hideLoading()` + `showDashboard()`.
6. On error:
   - `hideLoading()`.
   - `renderError(errorMessage)`.

### Data Transformation (API → Display)

The OpenWeatherMap `/weather` response includes nested objects. Key mappings:

| API Field | Display Value |
|---|---|
| `data.name` | City name |
| `data.sys.country` | Country code |
| `data.main.temp` | Current temperature (already in requested units) |
| `data.main.feels_like` | Feels-like temperature |
| `data.main.humidity` | Humidity percentage |
| `data.main.pressure` | Atmospheric pressure (hPa) |
| `data.weather[0].id` | Condition code → emoji mapping + theme selection |
| `data.weather[0].description` | Text description (capitalised for display) |
| `data.wind.speed` | Wind speed (m/s for metric, mph for imperial — convert m/s × 3.6 for km/h display) |
| `data.wind.deg` | Wind direction in degrees → compass label |
| `data.visibility` | Visibility in metres → convert to km |
| `data.sys.sunrise` | Unix timestamp → formatted time |
| `data.sys.sunset` | Unix timestamp → formatted time |
| `data.timezone` | Timezone offset in seconds from UTC |

The `/forecast` response contains `list[]` with 40 entries (every 3 hours for 5 days). To get **daily** forecasts:

1. Group entries by date (using `dt_txt` which includes `YYYY-MM-DD HH:MM:SS`).
2. For each day, find the **maximum** and **minimum** `main.temp` across all 3-hour entries.
3. Pick the **midday** entry's `weather[0].id` for the day's icon (or the entry closest to 12:00).
4. Skip the current day (start from tomorrow) if there are enough entries, to always show 5 **future** days.

### Geolocation (Optional Default City)

```javascript
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }),
      (error) => reject(error),
      { timeout: 5000 }
    );
  });
}
```

If geolocation succeeds, use `fetchWeatherByCoords` instead of `fetchCurrentWeather`. If it fails or is denied, silently fall back to the default city.

### Temperature Unit Toggle

- Two `<button>` elements inside `.unit-toggle`.
- Clicking a button:
  1. Updates `aria-pressed` on both buttons.
  2. Moves the `.unit-toggle__btn--active` class.
  3. Saves the unit to storage via `setUnit()`.
  4. Re-fetches weather data for the current city with the new unit (the API returns values in the requested unit system).

### Error States

| Error Scenario | User-Facing Message | Behaviour |
|---|---|---|
| Empty search input | "Please enter a city name." | Prevent API call, show inline error |
| City not found (404) | "City not found. Please check the spelling and try again." | Show error container, hide dashboard |
| Invalid API key (401) | "Invalid API key. Please check your config.js file." | Show error container |
| Rate limited (429) | "Too many requests. Please wait a moment and try again." | Show error container |
| Network failure | "Unable to connect. Please check your internet connection." | Show error container |
| Geolocation denied | *(silent)* | Fall back to default city without showing error |

---

## 8. Weather Display Details

### Current Weather Card

| Element | Source | Format |
|---|---|---|
| City name | `data.name` | Text, e.g. "London" |
| Country code | `data.sys.country` | Text, e.g. "GB" |
| Weather icon | `data.weather[0].id` | Emoji via `getWeatherEmoji()` |
| Temperature | `data.main.temp` | Rounded integer + unit, e.g. "22°C" |
| Description | `data.weather[0].description` | Capitalised, e.g. "Partly Cloudy" |
| Last updated | Current time on fetch | "Updated: 14:32" |

### Weather Details Panel

| Detail | Source | Format |
|---|---|---|
| Humidity | `data.main.humidity` | `65%` |
| Wind Speed | `data.wind.speed` | `12 km/h NW` (metric: m/s × 3.6 = km/h; imperial: mph) + direction |
| Feels Like | `data.main.feels_like` | `19°C` or `66°F` |
| Pressure | `data.main.pressure` | `1013 hPa` |
| Visibility | `data.visibility` | `10 km` (API returns metres ÷ 1000) |
| Sunrise | `data.sys.sunrise` | `06:12` (formatted with timezone) |
| Sunset | `data.sys.sunset` | `20:34` (formatted with timezone) |
| Wind Direction | `data.wind.deg` | `315° (NW)` — degrees + compass label |

### 5-Day Forecast Cards

Each of the 5 cards displays:

| Element | Source | Format |
|---|---|---|
| Day name | Derived from `list[].dt` | "Mon", "Tue", etc. |
| Weather icon | Midday entry `weather[0].id` | Emoji |
| High temp | Max `main.temp` for the day | `24°` |
| Low temp | Min `main.temp` for the day | `18°` (styled slightly dimmer) |

### Weather Icons Mapping (Condition ID → Emoji)

| Condition ID Range | Weather | Emoji |
|---|---|---|
| 200–232 | Thunderstorm | ⛈️ |
| 300–321 | Drizzle | 🌦️ |
| 500–504 | Light–Heavy Rain | 🌧️ |
| 511 | Freezing Rain | 🌨️ |
| 520–531 | Shower Rain | 🌧️ |
| 600–622 | Snow | ❄️ |
| 701 | Mist | 🌫️ |
| 711 | Smoke | 🌫️ |
| 721 | Haze | 🌫️ |
| 731, 761 | Dust | 🌫️ |
| 741 | Fog | 🌫️ |
| 751 | Sand | 🏜️ |
| 762 | Volcanic Ash | 🌋 |
| 771 | Squalls | 💨 |
| 781 | Tornado | 🌪️ |
| 800 (day) | Clear Sky | ☀️ |
| 800 (night) | Clear Sky | 🌙 |
| 801 | Few Clouds | 🌤️ |
| 802 | Scattered Clouds | ⛅ |
| 803 | Broken Clouds | 🌥️ |
| 804 | Overcast | ☁️ |

### Wind Direction Mapping

| Degrees | Direction |
|---|---|
| 0° – 22.5° | N |
| 22.5° – 67.5° | NE |
| 67.5° – 112.5° | E |
| 112.5° – 157.5° | SE |
| 157.5° – 202.5° | S |
| 202.5° – 247.5° | SW |
| 247.5° – 292.5° | W |
| 292.5° – 337.5° | NW |
| 337.5° – 360° | N |

### Sunrise & Sunset

- API returns Unix timestamps (`data.sys.sunrise`, `data.sys.sunset`).
- Convert using the city's timezone offset (`data.timezone` in seconds).
- Display in `HH:MM` 24-hour format (or 12-hour with AM/PM — student choice).
- Used by `theme.js` to determine day vs night for theme selection.

---

## 9. Implementation Order

### Phase 1 — Project Skeleton

1. **Create `index.html`** — Full semantic HTML structure with all containers, placeholder text (dashes), linked CSS and JS.
2. **Create `styles/main.css`** — CSS variables, reset, base typography, header, footer, and the `.sr-only` utility class.
3. **Create `js/modules/config.js`** — API key placeholder and endpoint builder functions.
4. **Create `js/main.js`** — Empty entry point with `DOMContentLoaded` listener.

**Checkpoint:** Page loads in browser with styled header, empty containers, and footer. No errors in console.

### Phase 2 — API Integration

5. **Create `js/modules/api.js`** — Implement `fetchCurrentWeather()` and `fetchForecast()` with error handling.
6. **Create `js/modules/utils.js`** — Implement `getWeatherEmoji()`, `formatTemp()`, `formatTime()`, `getWindDirection()`, `formatDate()`, `capitalise()`.
7. **Test API calls** — Temporarily call `fetchCurrentWeather('London')` in `main.js` and log the response to the console.

**Checkpoint:** Console shows valid JSON weather data for London. Error handling works for invalid city names.

### Phase 3 — DOM Rendering

8. **Create `js/modules/dom.js`** — Implement `renderCurrentWeather()`, `renderDetails()`, `renderForecast()`, `showLoading()`, `hideLoading()`, `renderError()`, `clearError()`.
9. **Wire up `main.js`** — On load, fetch London's weather and render it to the page.

**Checkpoint:** Dashboard displays London's current weather, all 8 detail stats, and a 5-day forecast with correct data.

### Phase 4 — Search Functionality

10. **Create `js/modules/search.js`** — Implement `initSearch()` with form submit handler.
11. **Create `js/modules/storage.js`** — Implement all localStorage functions.
12. **Connect search to main.js** — `handleSearch()` fetches data and re-renders.
13. **Implement recent searches** — `renderRecentSearches()`, chip click to reload, ✕ to remove.

**Checkpoint:** User can search for any city, see results, and recent searches persist across page reloads.

### Phase 5 — Unit Toggle & Persistence

14. **Implement unit toggle** — Button event listeners, save preference, re-fetch on change.
15. **Implement last city** — Save last searched city, load on return visit.

**Checkpoint:** Toggling °C/°F re-fetches and re-renders with correct units. Refreshing the page loads the last viewed city.

### Phase 6 — Theming & Polish

16. **Create `js/modules/theme.js`** — Implement `applyWeatherTheme()` with condition-to-class mapping.
17. **Add theme CSS classes** — All 7 theme variants in `main.css`.
18. **Add animations** — Card fade-in, spinner, icon bounce, hover effects, error shake.

**Checkpoint:** Background and accent colours change based on current weather. Smooth transitions between themes.

### Phase 7 — Geolocation & Final Polish

19. **Add geolocation** — Request user position on first visit, fetch weather by coordinates.
20. **Responsive testing** — Verify layout at all breakpoints (desktop, tablet, mobile).
21. **Accessibility audit** — Tab through all controls, verify screen reader output, check colour contrast.
22. **Edge case testing** — API key missing, network offline, very long city names, special characters in city names.

**Checkpoint:** App is fully functional, responsive, accessible, and handles all error states gracefully.

---

## 10. Accessibility

### Keyboard Navigation

- **Tab order:** Header → Unit toggle (°C, °F) → Search input → Search button → Recent search chips → Forecast cards → Footer link.
- All interactive elements (`<button>`, `<input>`, `<a>`) are natively focusable — no `tabindex` hacks needed.
- **Enter** submits the search form.
- Recent search chips are buttons — activated by Enter or Space.
- The unit toggle buttons respond to Enter and Space.
- Visible **focus ring** on all focusable elements (3px solid accent-coloured outline with offset).

### Screen Reader Considerations

- **`aria-live="polite"`** on the error container and loading spinner — screen readers announce when these appear/change without interrupting the user.
- **`aria-label`** on all `<section>` elements provides context ("Current weather conditions", "5-day weather forecast", "Detailed weather information").
- **`aria-hidden="true"`** on all decorative emoji icons — screen readers skip them.
- **`role="search"`** on the search form.
- **`role="radiogroup"`** on the unit toggle container; each button has `aria-pressed`.
- **`role="list"` and `role="listitem"`** on the forecast card container and individual cards.
- The **`sr-only`** CSS class hides the search input label visually while keeping it available to assistive technology.
- Weather description text provides the same information as the emoji icon, so nothing is lost for screen reader users.

### Colour Contrast

- All text/background combinations meet **WCAG 2.1 AA** contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text).
- The night theme and storm theme use light text on dark backgrounds — contrast ratios verified.
- Error text (red on light red background) meets AA standards.
- The sunny theme uses dark text on light yellow — sufficient contrast.

### Focus Management After Search

- After a search completes and the dashboard updates, focus is programmatically moved to the **current weather card's city name** heading (`<h2 class="current-weather__city">`).
- This ensures screen reader users are immediately informed of the result rather than having to manually navigate to the new content.
- The city heading receives a temporary `tabindex="-1"` for programmatic focus, then it is removed after blur to avoid disrupting the natural tab order.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who prefer reduced motion will not see the bounce, fade, or spin animations — the content will appear instantly.
