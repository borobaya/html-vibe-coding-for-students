# Zodiac Compatibility Checker — Implementation Plan

## 1. Overview

The Zodiac Compatibility Checker is a mystical, cosmic-themed web app that determines romantic/friendship compatibility between two people based on their zodiac star signs. Users enter two birthdays, the app automatically detects each person's zodiac sign, then runs a compatibility algorithm based on elemental affinities, sign polarities, and classic astrological pairings. The result is revealed with a dramatic cinematic animation — a glowing compatibility percentage that counts upward, a starfield particle effect, and a personalised reading describing the pairing's strengths and challenges.

Built entirely with vanilla HTML5, CSS3, and JavaScript (ES2022+ modules). No frameworks, no build tools, no external dependencies.

### User Flow (Step by Step)

1. User opens the app and sees a cosmic dark-themed landing view with two birthday input fields side by side (or stacked on mobile), a title, and a subtle animated starfield background.
2. User enters **Person 1's birthday** using a date picker. As soon as a valid date is entered, the corresponding zodiac sign card fades in below the input, showing the sign's symbol (emoji/Unicode), name, element, and date range.
3. User enters **Person 2's birthday** using a second date picker. The second zodiac sign card fades in the same way.
4. Once both dates are valid, the **"Check Compatibility"** button becomes enabled (it is disabled until both inputs are filled).
5. User clicks the button.
6. The input section slides/fades upward or fades out, and the **results section** dramatically reveals:
   - A starfield particle burst animation.
   - The two zodiac sign cards reappear on either side with a glowing cosmic line connecting them.
   - A large **compatibility percentage** counts up from 0 to the final value over ~2 seconds with an easing curve.
   - A circular or arc-shaped **compatibility meter** fills to match the percentage.
   - A **rating label** (e.g. "Soulmates!", "Strong Bond", "It's Complicated") glows into view.
   - A **personalised reading** paragraph fades in describing the specific strengths and challenges of that sign pairing.
7. User can click **"Try Again"** to reset everything and check a different pair.

---

## 2. Page Layout

### Wireframe (ASCII)

```text
┌──────────────────────────────────────────────────────────────┐
│  ✦ STARFIELD BACKGROUND (full page, animated particles) ✦   │
│                                                              │
│  HEADER                                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         ✨ Zodiac Compatibility Checker ✨            │    │
│  │       Discover your cosmic connection                 │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  INPUT SECTION                                               │
│  ┌─────────────────────┐   ┌─────────────────────┐          │
│  │  Person 1            │   │  Person 2            │          │
│  │  ┌─────────────────┐ │   │  ┌─────────────────┐ │          │
│  │  │  📅 Birthday     │ │   │  │  📅 Birthday     │ │          │
│  │  └─────────────────┘ │   │  └─────────────────┘ │          │
│  │                       │   │                       │          │
│  │  ZODIAC CARD (hidden) │   │  ZODIAC CARD (hidden) │          │
│  │  ┌─────────────────┐ │   │  ┌─────────────────┐ │          │
│  │  │  ♈ Aries         │ │   │  │  ♌ Leo           │ │          │
│  │  │  Fire · Mar 21-  │ │   │  │  Fire · Jul 23-  │ │          │
│  │  │  Apr 19           │ │   │  │  Aug 22           │ │          │
│  │  │  Bold, energetic  │ │   │  │  Confident, warm  │ │          │
│  │  └─────────────────┘ │   │  └─────────────────┘ │          │
│  └─────────────────────┘   └─────────────────────┘          │
│                                                              │
│              ┌──────────────────────┐                        │
│              │  🔮 Check Compatibility │                        │
│              └──────────────────────┘                        │
│                                                              │
│  RESULTS SECTION (hidden until calculated)                   │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │   ♈ Aries ──── ✦ cosmic line ✦ ──── ♌ Leo            │    │
│  │                                                        │    │
│  │              ┌─────────────┐                           │    │
│  │              │             │                           │    │
│  │              │    92%      │  ← animated counter       │    │
│  │              │  ▓▓▓▓▓▓▓░  │  ← compatibility meter    │    │
│  │              │             │                           │    │
│  │              └─────────────┘                           │    │
│  │                                                        │    │
│  │           ⭐ "Soulmates!" ⭐                           │    │
│  │                                                        │    │
│  │   ┌──────────────────────────────────────────────┐    │    │
│  │   │  Aries and Leo share a fiery passion...       │    │    │
│  │   │  Your strengths: ...                          │    │    │
│  │   │  Watch out for: ...                           │    │    │
│  │   └──────────────────────────────────────────────┘    │    │
│  │                                                        │    │
│  │              ┌──────────────┐                          │    │
│  │              │  🔄 Try Again │                          │    │
│  │              └──────────────┘                          │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  FOOTER                                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  © 2026 Zodiac Compatibility Checker                  │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Layout Sections

| Section | Element | Purpose |
|---|---|---|
| **Header** | `<header>` | App title with glowing text, subtitle tagline |
| **Input Section** | `<section id="input-section">` | Two person columns each containing a date input and a zodiac card reveal area |
| **Person Column** | `<div class="person-column">` | Groups one person's date input and their zodiac sign card |
| **Zodiac Card** | `<article class="zodiac-card">` | Shows detected sign symbol, name, element, date range, traits; hidden until date entered |
| **Check Button** | `<button id="check-btn">` | Triggers compatibility calculation; disabled until both dates valid |
| **Results Section** | `<section id="results-section">` | All result content; hidden until compatibility is checked |
| **Sign Pairing** | `<div class="sign-pairing">` | The two sign symbols with a connecting cosmic line between them |
| **Percentage Display** | `<div class="percentage-display">` | Large animated number showing compatibility percentage |
| **Compatibility Meter** | `<div class="compat-meter">` | Circular arc or horizontal bar that fills to the percentage |
| **Rating Label** | `<p class="rating-label">` | Text label like "Soulmates!" or "It's Complicated" |
| **Reading** | `<article class="reading">` | Personalised compatibility reading text |
| **Try Again Button** | `<button id="reset-btn">` | Resets the app to the input state |
| **Footer** | `<footer>` | Copyright line |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| **Desktop (≥ 768px)** | Person columns side by side in a row. Results section shows sign pairing horizontally. Percentage display and meter are large. Reading is full-width below. |
| **Mobile (< 768px)** | Person columns stack vertically. Sign pairing stacks vertically with the cosmic line becoming a vertical connector. Percentage display scales down. Reading text has smaller padding. Button stretches to full width. |

---

## 3. Colour Scheme & Typography

### Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background (page) | Cosmic Black | `#0a0a1a` | `body` background, deepest layer |
| Background (cards) | Deep Indigo | `#141432` | Card backgrounds, input containers |
| Background (inputs) | Midnight Blue | `#1a1a3e` | Form input backgrounds |
| Primary Accent | Mystic Purple | `#8b5cf6` | Buttons, active states, borders |
| Primary Accent Hover | Royal Purple | `#7c3aed` | Button hover state |
| Secondary Accent | Celestial Gold | `#f0c040` | Stars, highlights, percentage number |
| Tertiary Accent | Cosmic Pink | `#ec4899` | Hearts, love-related highlights |
| Glow Effect | Nebula Violet | `#a78bfa` | Text glow, card glow, meter glow |
| Element: Fire | Flame Orange | `#f97316` | Fire sign cards accent |
| Element: Earth | Moss Green | `#22c55e` | Earth sign cards accent |
| Element: Air | Sky Cyan | `#06b6d4` | Air sign cards accent |
| Element: Water | Ocean Blue | `#3b82f6` | Water sign cards accent |
| Text Primary | Starlight White | `#f1f5f9` | Headings, body text |
| Text Secondary | Pale Lavender | `#a5b4c8` | Subtitles, secondary info |
| Text Muted | Dust Grey | `#64748b` | Placeholders, footer text |
| Success / High Compat | Emerald Green | `#10b981` | Meter fill ≥ 80% |
| Medium Compat | Amber Yellow | `#f59e0b` | Meter fill 50–79% |
| Low Compat | Soft Red | `#ef4444` | Meter fill < 50% |
| Overlay BG | Shadow Black | `rgba(0, 0, 0, 0.7)` | Modal overlays if needed |
| Star Particle | Warm White | `#fffbe6` | Starfield particles |

### CSS Variables

```css
:root {
  /* ── Backgrounds ── */
  --clr-bg:              #0a0a1a;
  --clr-card-bg:         #141432;
  --clr-input-bg:        #1a1a3e;

  /* ── Accents ── */
  --clr-primary:         #8b5cf6;
  --clr-primary-hover:   #7c3aed;
  --clr-gold:            #f0c040;
  --clr-pink:            #ec4899;
  --clr-glow:            #a78bfa;

  /* ── Elements ── */
  --clr-fire:            #f97316;
  --clr-earth:           #22c55e;
  --clr-air:             #06b6d4;
  --clr-water:           #3b82f6;

  /* ── Text ── */
  --clr-text:            #f1f5f9;
  --clr-text-secondary:  #a5b4c8;
  --clr-text-muted:      #64748b;

  /* ── Compatibility levels ── */
  --clr-compat-high:     #10b981;
  --clr-compat-mid:      #f59e0b;
  --clr-compat-low:      #ef4444;

  /* ── Misc ── */
  --clr-star:            #fffbe6;
  --clr-overlay:         rgba(0, 0, 0, 0.7);

  /* ── Typography ── */
  --ff-display:          'Cinzel Decorative', serif;
  --ff-heading:          'Cinzel', serif;
  --ff-body:             'Nunito', sans-serif;

  /* ── Spacing ── */
  --space-xs:            0.25rem;
  --space-sm:            0.5rem;
  --space-md:            1rem;
  --space-lg:            1.5rem;
  --space-xl:            2rem;
  --space-xxl:           3rem;

  /* ── Borders & Radius ── */
  --radius-sm:           0.375rem;
  --radius-md:           0.75rem;
  --radius-lg:           1rem;
  --radius-full:         50%;

  /* ── Transitions ── */
  --transition-fast:     150ms ease;
  --transition-normal:   300ms ease;
  --transition-slow:     600ms ease;
}
```

### Typography

| Role | Font Family | Weight | Size (desktop) | Size (mobile) | Fallback |
|---|---|---|---|---|---|
| App Title | `Cinzel Decorative` | 700 | 2.5rem | 1.75rem | `serif` |
| Section Headings | `Cinzel` | 600 | 1.5rem | 1.25rem | `serif` |
| Sign Name (card) | `Cinzel` | 700 | 1.25rem | 1.1rem | `serif` |
| Body / Readings | `Nunito` | 400 | 1rem | 0.9rem | `sans-serif` |
| Button Text | `Nunito` | 700 | 1rem | 0.9rem | `sans-serif` |
| Percentage Number | `Cinzel Decorative` | 700 | 4rem | 2.5rem | `serif` |
| Rating Label | `Cinzel` | 600 | 1.75rem | 1.25rem | `serif` |
| Input Labels | `Nunito` | 600 | 0.875rem | 0.875rem | `sans-serif` |
| Footer Text | `Nunito` | 400 | 0.8rem | 0.75rem | `sans-serif` |

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap');
```

---

## 4. HTML Structure

Complete `index.html` located at `zodiac-compatibility/index.html`. All paths are relative.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Discover your cosmic compatibility — enter two birthdays to reveal your zodiac match." />
  <title>Zodiac Compatibility Checker</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- Starfield background canvas -->
  <canvas id="starfield" aria-hidden="true"></canvas>

  <header class="site-header">
    <h1 class="site-title">✨ Zodiac Compatibility Checker ✨</h1>
    <p class="site-subtitle">Discover your cosmic connection</p>
  </header>

  <main>

    <!-- ── INPUT SECTION ── -->
    <section id="input-section" class="input-section" aria-label="Birthday inputs">
      <div class="person-columns">

        <!-- Person 1 -->
        <div class="person-column">
          <label class="input-label" for="birthday-1">Person 1's Birthday</label>
          <input
            type="date"
            id="birthday-1"
            class="date-input"
            aria-describedby="sign-card-1"
            required
          />
          <article id="sign-card-1" class="zodiac-card hidden" aria-live="polite">
            <span class="zodiac-card__symbol" aria-hidden="true"></span>
            <h2 class="zodiac-card__name"></h2>
            <p class="zodiac-card__element"></p>
            <p class="zodiac-card__dates"></p>
            <p class="zodiac-card__traits"></p>
          </article>
        </div>

        <!-- Person 2 -->
        <div class="person-column">
          <label class="input-label" for="birthday-2">Person 2's Birthday</label>
          <input
            type="date"
            id="birthday-2"
            class="date-input"
            aria-describedby="sign-card-2"
            required
          />
          <article id="sign-card-2" class="zodiac-card hidden" aria-live="polite">
            <span class="zodiac-card__symbol" aria-hidden="true"></span>
            <h2 class="zodiac-card__name"></h2>
            <p class="zodiac-card__element"></p>
            <p class="zodiac-card__dates"></p>
            <p class="zodiac-card__traits"></p>
          </article>
        </div>

      </div>

      <button id="check-btn" class="btn btn--primary" disabled>
        🔮 Check Compatibility
      </button>
    </section>

    <!-- ── RESULTS SECTION ── -->
    <section id="results-section" class="results-section hidden" aria-label="Compatibility results">

      <!-- Sign pairing display -->
      <div class="sign-pairing">
        <div class="sign-pairing__sign sign-pairing__sign--left">
          <span class="sign-pairing__symbol"></span>
          <span class="sign-pairing__name"></span>
        </div>
        <div class="sign-pairing__connector" aria-hidden="true">
          <span class="sign-pairing__heart">💫</span>
        </div>
        <div class="sign-pairing__sign sign-pairing__sign--right">
          <span class="sign-pairing__symbol"></span>
          <span class="sign-pairing__name"></span>
        </div>
      </div>

      <!-- Percentage display -->
      <div class="percentage-display">
        <span id="percentage-number" class="percentage-display__number" aria-live="polite">0</span>
        <span class="percentage-display__percent">%</span>
      </div>

      <!-- Compatibility meter -->
      <div class="compat-meter" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Compatibility percentage">
        <div class="compat-meter__track">
          <div class="compat-meter__fill"></div>
        </div>
      </div>

      <!-- Rating label -->
      <p id="rating-label" class="rating-label" aria-live="polite"></p>

      <!-- Personalised reading -->
      <article class="reading">
        <h2 class="reading__title">Your Cosmic Reading</h2>
        <p id="reading-text" class="reading__text"></p>
      </article>

      <button id="reset-btn" class="btn btn--secondary">
        🔄 Try Again
      </button>
    </section>

  </main>

  <footer class="site-footer">
    <p>© 2026 Zodiac Compatibility Checker</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- All form inputs have associated `<label>` elements.
- `aria-live="polite"` on zodiac cards and result regions so screen readers announce changes.
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on the compatibility meter.
- Starfield `<canvas>` has `aria-hidden="true"` since it is purely decorative.
- Semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- All sections have `aria-label` for landmark navigation.
- Colour contrast meets WCAG AA against the dark background.

---

## 5. CSS Architecture

Single file at `styles/main.css`. Every class and rule described below.

### Reset & Base

| Selector | Properties |
|---|---|
| `*, *::before, *::after` | `box-sizing: border-box; margin: 0; padding: 0;` |
| `html` | `font-size: 16px; scroll-behavior: smooth;` |
| `body` | `font-family: var(--ff-body); background: var(--clr-bg); color: var(--clr-text); min-height: 100vh; display: flex; flex-direction: column; align-items: center; overflow-x: hidden; position: relative;` |

### Starfield Canvas

| Selector | Properties |
|---|---|
| `#starfield` | `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;` |

### Site Header

| Selector | Properties |
|---|---|
| `.site-header` | `position: relative; z-index: 1; text-align: center; padding: var(--space-xl) var(--space-md); margin-top: var(--space-lg);` |
| `.site-title` | `font-family: var(--ff-display); font-size: 2.5rem; font-weight: 700; color: var(--clr-gold); text-shadow: 0 0 20px rgba(240, 192, 64, 0.6), 0 0 40px rgba(240, 192, 64, 0.3); animation: glow-pulse 3s ease-in-out infinite;` |
| `.site-subtitle` | `font-family: var(--ff-body); font-size: 1.1rem; color: var(--clr-text-secondary); margin-top: var(--space-sm); letter-spacing: 0.1em;` |

### Input Section

| Selector | Properties |
|---|---|
| `.input-section` | `position: relative; z-index: 1; width: 100%; max-width: 800px; padding: var(--space-xl) var(--space-md); display: flex; flex-direction: column; align-items: center; gap: var(--space-xl); transition: opacity var(--transition-slow), transform var(--transition-slow);` |
| `.input-section.fade-out` | `opacity: 0; transform: translateY(-30px); pointer-events: none;` |
| `.person-columns` | `display: flex; gap: var(--space-xl); width: 100%; justify-content: center; flex-wrap: wrap;` |
| `.person-column` | `flex: 1; min-width: 280px; max-width: 360px; display: flex; flex-direction: column; align-items: center; gap: var(--space-md);` |
| `.input-label` | `font-family: var(--ff-body); font-weight: 600; font-size: 0.875rem; color: var(--clr-text-secondary); text-transform: uppercase; letter-spacing: 0.08em;` |
| `.date-input` | `width: 100%; padding: var(--space-sm) var(--space-md); font-family: var(--ff-body); font-size: 1rem; color: var(--clr-text); background: var(--clr-input-bg); border: 2px solid rgba(139, 92, 246, 0.3); border-radius: var(--radius-md); outline: none; transition: border-color var(--transition-fast), box-shadow var(--transition-fast);` |
| `.date-input:focus` | `border-color: var(--clr-primary); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);` |

### Zodiac Cards

| Selector | Properties |
|---|---|
| `.zodiac-card` | `width: 100%; background: var(--clr-card-bg); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: var(--radius-lg); padding: var(--space-lg); text-align: center; transition: opacity var(--transition-normal), transform var(--transition-normal);` |
| `.zodiac-card.hidden` | `display: none;` |
| `.zodiac-card.fade-in` | `animation: fadeSlideUp 0.5s ease forwards;` |
| `.zodiac-card__symbol` | `font-size: 3rem; display: block; margin-bottom: var(--space-sm);` |
| `.zodiac-card__name` | `font-family: var(--ff-heading); font-weight: 700; font-size: 1.25rem; color: var(--clr-text); margin-bottom: var(--space-xs);` |
| `.zodiac-card__element` | `font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--space-xs);` |
| `.zodiac-card__element--fire` | `color: var(--clr-fire);` |
| `.zodiac-card__element--earth` | `color: var(--clr-earth);` |
| `.zodiac-card__element--air` | `color: var(--clr-air);` |
| `.zodiac-card__element--water` | `color: var(--clr-water);` |
| `.zodiac-card__dates` | `font-size: 0.85rem; color: var(--clr-text-secondary);` |
| `.zodiac-card__traits` | `font-size: 0.85rem; color: var(--clr-text-muted); font-style: italic; margin-top: var(--space-sm);` |

### Buttons

| Selector | Properties |
|---|---|
| `.btn` | `font-family: var(--ff-body); font-weight: 700; font-size: 1rem; padding: var(--space-sm) var(--space-xl); border: none; border-radius: var(--radius-md); cursor: pointer; transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast); text-transform: uppercase; letter-spacing: 0.05em;` |
| `.btn:active` | `transform: scale(0.97);` |
| `.btn--primary` | `background: var(--clr-primary); color: var(--clr-text); box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);` |
| `.btn--primary:hover:not(:disabled)` | `background: var(--clr-primary-hover); box-shadow: 0 0 25px rgba(139, 92, 246, 0.6);` |
| `.btn--primary:disabled` | `opacity: 0.4; cursor: not-allowed; box-shadow: none;` |
| `.btn--secondary` | `background: transparent; color: var(--clr-text-secondary); border: 2px solid var(--clr-text-muted);` |
| `.btn--secondary:hover` | `border-color: var(--clr-primary); color: var(--clr-text);` |

### Results Section

| Selector | Properties |
|---|---|
| `.results-section` | `position: relative; z-index: 1; width: 100%; max-width: 700px; padding: var(--space-xl) var(--space-md); display: flex; flex-direction: column; align-items: center; gap: var(--space-lg); text-align: center;` |
| `.results-section.hidden` | `display: none;` |
| `.results-section.fade-in` | `animation: fadeSlideUp 0.8s ease forwards;` |

### Sign Pairing

| Selector | Properties |
|---|---|
| `.sign-pairing` | `display: flex; align-items: center; justify-content: center; gap: var(--space-lg); width: 100%;` |
| `.sign-pairing__sign` | `display: flex; flex-direction: column; align-items: center; gap: var(--space-xs);` |
| `.sign-pairing__symbol` | `font-size: 3.5rem;` |
| `.sign-pairing__name` | `font-family: var(--ff-heading); font-weight: 600; font-size: 1.1rem; color: var(--clr-text);` |
| `.sign-pairing__connector` | `display: flex; align-items: center; justify-content: center; width: 80px; position: relative;` |
| `.sign-pairing__connector::before` | `content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--clr-primary), var(--clr-gold), var(--clr-primary)); animation: shimmer 2s ease-in-out infinite;` |
| `.sign-pairing__heart` | `position: relative; z-index: 1; font-size: 1.5rem; animation: pulse 1.5s ease-in-out infinite;` |

### Percentage Display

| Selector | Properties |
|---|---|
| `.percentage-display` | `display: flex; align-items: baseline; justify-content: center; gap: 0;` |
| `.percentage-display__number` | `font-family: var(--ff-display); font-size: 4rem; font-weight: 700; color: var(--clr-gold); text-shadow: 0 0 30px rgba(240, 192, 64, 0.5);` |
| `.percentage-display__percent` | `font-family: var(--ff-display); font-size: 2rem; color: var(--clr-gold); text-shadow: 0 0 20px rgba(240, 192, 64, 0.4);` |

### Compatibility Meter

| Selector | Properties |
|---|---|
| `.compat-meter` | `width: 100%; max-width: 400px;` |
| `.compat-meter__track` | `width: 100%; height: 12px; background: rgba(255, 255, 255, 0.08); border-radius: 6px; overflow: hidden; position: relative;` |
| `.compat-meter__fill` | `height: 100%; width: 0%; border-radius: 6px; transition: width 2s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 0 10px currentColor;` |
| `.compat-meter__fill--high` | `background: linear-gradient(90deg, var(--clr-primary), var(--clr-compat-high)); color: var(--clr-compat-high);` |
| `.compat-meter__fill--mid` | `background: linear-gradient(90deg, var(--clr-primary), var(--clr-compat-mid)); color: var(--clr-compat-mid);` |
| `.compat-meter__fill--low` | `background: linear-gradient(90deg, var(--clr-primary), var(--clr-compat-low)); color: var(--clr-compat-low);` |

### Rating Label

| Selector | Properties |
|---|---|
| `.rating-label` | `font-family: var(--ff-heading); font-size: 1.75rem; font-weight: 600; color: var(--clr-gold); text-shadow: 0 0 15px rgba(240, 192, 64, 0.4); opacity: 0; animation: fadeIn 0.5s ease forwards; animation-delay: 1.8s;` |

### Reading

| Selector | Properties |
|---|---|
| `.reading` | `background: var(--clr-card-bg); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: var(--radius-lg); padding: var(--space-lg) var(--space-xl); max-width: 600px; opacity: 0; animation: fadeIn 0.6s ease forwards; animation-delay: 2.2s;` |
| `.reading__title` | `font-family: var(--ff-heading); font-size: 1.25rem; color: var(--clr-gold); margin-bottom: var(--space-md);` |
| `.reading__text` | `font-size: 1rem; line-height: 1.7; color: var(--clr-text-secondary);` |

### Footer

| Selector | Properties |
|---|---|
| `.site-footer` | `position: relative; z-index: 1; margin-top: auto; padding: var(--space-lg) var(--space-md); text-align: center; color: var(--clr-text-muted); font-size: 0.8rem;` |

### Utility Classes

| Selector | Properties |
|---|---|
| `.hidden` | `display: none;` |
| `.sr-only` | `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;` |

### Keyframe Animations

```css
@keyframes glow-pulse {
  0%, 100% { text-shadow: 0 0 20px rgba(240,192,64,0.6), 0 0 40px rgba(240,192,64,0.3); }
  50%      { text-shadow: 0 0 30px rgba(240,192,64,0.8), 0 0 60px rgba(240,192,64,0.5); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(25px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.2); }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}

@keyframes countUp {
  /* Handled in JS — this is a placeholder for the easing reference */
}

@keyframes meterFill {
  from { width: 0%; }
  /* to value set dynamically via JS */
}
```

### Responsive Media Query

```css
@media (max-width: 767px) {
  .site-title          { font-size: 1.75rem; }
  .person-columns      { flex-direction: column; align-items: center; }
  .person-column       { max-width: 100%; }
  .sign-pairing        { flex-direction: column; }
  .sign-pairing__connector { width: auto; height: 40px; }
  .sign-pairing__connector::before { width: 2px; height: 100%; top: 0; left: 50%; right: auto; background: linear-gradient(180deg, var(--clr-primary), var(--clr-gold), var(--clr-primary)); }
  .percentage-display__number { font-size: 2.5rem; }
  .rating-label        { font-size: 1.25rem; }
  .btn                 { width: 100%; }
}
```

---

## 6. JavaScript Architecture

### File Structure

```text
js/
├── main.js              ← Entry point, orchestrates everything
└── modules/
    ├── zodiacData.js    ← All zodiac sign data & compatibility matrix
    ├── zodiacDetector.js← Date-to-sign detection logic
    ├── compatibility.js ← Compatibility algorithm & reading generation
    ├── ui.js            ← All DOM manipulation & animation control
    └── starfield.js     ← Canvas-based starfield background animation
```

### `js/main.js` — Entry Point

```text
Imports: all modules from js/modules/
Responsibilities:
  - Cache DOM references
  - Attach event listeners
  - Orchestrate flow between modules
```

| Function | Signature | Description |
|---|---|---|
| `init()` | `() => void` | Called on `DOMContentLoaded`. Caches DOM elements, binds event listeners, initialises starfield. |
| `handleDateChange(event)` | `(Event) => void` | Fires on `input` event of either date input. Extracts month/day, calls `detectZodiacSign()`, calls `updateZodiacCard()` to show the sign. Calls `updateCheckButton()` to enable/disable the button. |
| `handleCheckCompatibility()` | `() => void` | Fires on click of the Check button. Gets both signs, calls `calculateCompatibility()`, gets the reading, then calls `showResults()`. |
| `handleReset()` | `() => void` | Fires on click of Try Again. Calls `resetUI()` to return to input state. |
| `updateCheckButton()` | `() => void` | Enables the Check button only if both date inputs have valid zodiac signs detected. |

### `js/modules/zodiacData.js` — Zodiac Data Store

Exports all raw zodiac data as constants.

| Export | Type | Description |
|---|---|---|
| `ZODIAC_SIGNS` | `Array<Object>` | Array of 12 sign objects, each with: `name`, `symbol`, `element`, `startMonth`, `startDay`, `endMonth`, `endDay`, `traits`, `dateRange` (display string). Ordered by calendar start date (Capricorn wraps). |
| `COMPATIBILITY_MATRIX` | `Object<string, Object<string, number>>` | Nested object keyed by sign name → sign name → score (0–100). Symmetric: `matrix[A][B] === matrix[B][A]`. |
| `COMPATIBILITY_READINGS` | `Object<string, Object<string, string>>` | Nested object keyed by sign name → sign name → reading text string. |
| `RATING_LABELS` | `Array<Object>` | Array of `{ min, max, label }` objects mapping score ranges to labels (e.g. 90–100 → "Soulmates!", 70–89 → "Strong Bond"). |

### `js/modules/zodiacDetector.js` — Zodiac Detection

| Function | Signature | Description |
|---|---|---|
| `detectZodiacSign(month, day)` | `(number, number) => Object\|null` | Takes 1-based month and day. Iterates `ZODIAC_SIGNS` array, checks if the date falls within each sign's range (handling the Capricorn wrap-around across Dec/Jan). Returns the matching sign object or `null` if date is invalid. |
| `isValidDate(month, day)` | `(number, number) => boolean` | Validates that month is 1–12 and day is within the valid range for that month. |

### `js/modules/compatibility.js` — Compatibility Algorithm

| Function | Signature | Description |
|---|---|---|
| `calculateCompatibility(sign1, sign2)` | `(Object, Object) => Object` | Takes two sign objects. Looks up the base score from `COMPATIBILITY_MATRIX`. Returns `{ score, ratingLabel, reading }`. |
| `getRatingLabel(score)` | `(number) => string` | Maps a numeric score to a label string using `RATING_LABELS`. |
| `getReading(sign1Name, sign2Name)` | `(string, string) => string` | Looks up the personalised reading from `COMPATIBILITY_READINGS`. Creates a key from alphabetically-sorted sign names for consistent lookups. |

### `js/modules/ui.js` — DOM & Animation

| Function | Signature | Description |
|---|---|---|
| `updateZodiacCard(cardElement, signData)` | `(HTMLElement, Object) => void` | Populates a zodiac card element with the sign's symbol, name, element (with correct colour class), date range, and traits. Removes `.hidden`, adds `.fade-in`. |
| `hideZodiacCard(cardElement)` | `(HTMLElement) => void` | Adds `.hidden`, removes `.fade-in`. |
| `showResults(sign1, sign2, result)` | `(Object, Object, Object) => void` | Hides input section (adds `.fade-out`), populates sign pairing, triggers the animated percentage counter and meter fill, sets rating label and reading text, shows results section (removes `.hidden`, adds `.fade-in`). |
| `animatePercentage(targetValue, duration)` | `(number, number) => void` | Uses `requestAnimationFrame` to count from 0 to `targetValue` over `duration` ms with an ease-out curve. Updates `#percentage-number` text content and `aria-valuenow` on the meter each frame. |
| `fillCompatMeter(percentage)` | `(number) => void` | Sets the meter fill width to `percentage%`. Adds the correct colour class (`--high`, `--mid`, `--low`) based on the value. Updates `aria-valuenow`. |
| `resetUI()` | `() => void` | Hides results section, shows input section, clears date inputs, hides zodiac cards, resets meter and percentage, disables check button. |
| `setElementColor(element, elementName)` | `(HTMLElement, string) => void` | Adds the correct element-colour CSS class to a zodiac card's element text (e.g. `zodiac-card__element--fire`). |

### `js/modules/starfield.js` — Starfield Background

| Function | Signature | Description |
|---|---|---|
| `initStarfield(canvasId)` | `(string) => void` | Gets the canvas by ID, sets up 2D context, creates star particle array, starts animation loop. Handles window resize to keep canvas full-screen. |
| `createStars(count)` | `(number) => Array<Object>` | Generates an array of star objects with random `x`, `y`, `radius` (0.3–1.5px), `opacity` (0.3–1), and `twinkleSpeed`. |
| `animateStarfield()` | `() => void` | `requestAnimationFrame` loop. Clears canvas, draws each star as a filled circle, updates opacity to create a twinkling effect using a sine wave. |
| `handleResize()` | `() => void` | Updates canvas width/height to match `window.innerWidth` / `window.innerHeight`. Regenerates stars proportional to new area. |

---

## 7. Feature Details

### Date-to-Zodiac Mapping

All 12 zodiac signs with exact date boundaries (inclusive):

| # | Sign | Symbol | Element | Start Date | End Date |
|---|---|---|---|---|---|
| 1 | Aries | ♈ | Fire 🔥 | March 21 | April 19 |
| 2 | Taurus | ♉ | Earth 🌍 | April 20 | May 20 |
| 3 | Gemini | ♊ | Air 💨 | May 21 | June 20 |
| 4 | Cancer | ♋ | Water 💧 | June 21 | July 22 |
| 5 | Leo | ♌ | Fire 🔥 | July 23 | August 22 |
| 6 | Virgo | ♍ | Earth 🌍 | August 23 | September 22 |
| 7 | Libra | ♎ | Air 💨 | September 23 | October 22 |
| 8 | Scorpio | ♏ | Water 💧 | October 23 | November 21 |
| 9 | Sagittarius | ♐ | Fire 🔥 | November 22 | December 21 |
| 10 | Capricorn | ♑ | Earth 🌍 | December 22 | January 19 |
| 11 | Aquarius | ♒ | Air 💨 | January 20 | February 18 |
| 12 | Pisces | ♓ | Water 💧 | February 19 | March 20 |

**Detection algorithm**: The `detectZodiacSign(month, day)` function iterates the signs array. For most signs, it checks `(month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)`. Capricorn is a special case spanning Dec 22 – Jan 19, so it checks `(month === 12 && day >= 22) || (month === 1 && day <= 19)`.

### Compatibility Algorithm Design

The compatibility score for each pair is pre-defined in a **12×12 symmetric matrix** stored in `COMPATIBILITY_MATRIX`. Scores range from 25 to 98 and are determined by:

1. **Elemental affinity** — Same-element pairs get a base boost. Complementary elements (Fire+Air, Earth+Water) also score well.
2. **Polarity** — Signs of the same polarity (positive: Fire/Air, negative: Earth/Water) tend to have higher base compatibility.
3. **Classic astrological pairings** — Traditional "best match" and "worst match" pairings are reflected in the scores.
4. **Same sign** — Same-sign pairs get moderately high scores (they understand each other but may clash).

### Rating Labels

| Score Range | Label |
|---|---|
| 90–100 | ✨ Soulmates! ✨ |
| 75–89 | 💫 Strong Bond |
| 60–74 | 🌙 Promising Match |
| 45–59 | ☁️ It's Complicated |
| 30–44 | 🌊 Challenging Currents |
| 0–29 | 🔥 Cosmic Friction |

### Animated Percentage Counter

The `animatePercentage()` function:

1. Records a start timestamp via `requestAnimationFrame`.
2. On each frame, calculates elapsed time as a fraction of `duration` (default 2000ms).
3. Applies an ease-out curve: `progress = 1 - Math.pow(1 - t, 3)` where `t` is the linear progress (0→1).
4. Sets the displayed number to `Math.round(targetValue * progress)`.
5. Stops when `t >= 1` and sets the final exact value.

### Compatibility Meter Animation

The meter fill is a CSS `width` transition (2s `cubic-bezier`). JavaScript sets the target width as an inline style after a short delay (50ms) to ensure the transition triggers from 0%.

### Starfield Background

- Canvas-based with ~200 star particles (scaled to screen area).
- Each star has a randomised size (0.3–1.5px radius), position, and opacity.
- Twinkle effect uses `Math.sin(time * twinkleSpeed + offset)` to oscillate opacity.
- Resizes on `window.resize` using a debounced handler.
- Runs at native `requestAnimationFrame` rate (~60fps).

---

## 8. Zodiac Data

### Sign Data Array (`ZODIAC_SIGNS`)

```javascript
export const ZODIAC_SIGNS = [
  { name: 'Aries',       symbol: '♈', element: 'Fire',  startMonth: 3,  startDay: 21, endMonth: 4,  endDay: 19, traits: 'Bold, ambitious, energetic',          dateRange: 'Mar 21 – Apr 19' },
  { name: 'Taurus',      symbol: '♉', element: 'Earth', startMonth: 4,  startDay: 20, endMonth: 5,  endDay: 20, traits: 'Reliable, patient, devoted',            dateRange: 'Apr 20 – May 20' },
  { name: 'Gemini',      symbol: '♊', element: 'Air',   startMonth: 5,  startDay: 21, endMonth: 6,  endDay: 20, traits: 'Curious, adaptable, witty',             dateRange: 'May 21 – Jun 20' },
  { name: 'Cancer',      symbol: '♋', element: 'Water', startMonth: 6,  startDay: 21, endMonth: 7,  endDay: 22, traits: 'Intuitive, sentimental, protective',     dateRange: 'Jun 21 – Jul 22' },
  { name: 'Leo',         symbol: '♌', element: 'Fire',  startMonth: 7,  startDay: 23, endMonth: 8,  endDay: 22, traits: 'Confident, dramatic, warm-hearted',      dateRange: 'Jul 23 – Aug 22' },
  { name: 'Virgo',       symbol: '♍', element: 'Earth', startMonth: 8,  startDay: 23, endMonth: 9,  endDay: 22, traits: 'Analytical, practical, diligent',        dateRange: 'Aug 23 – Sep 22' },
  { name: 'Libra',       symbol: '♎', element: 'Air',   startMonth: 9,  startDay: 23, endMonth: 10, endDay: 22, traits: 'Diplomatic, gracious, fair-minded',      dateRange: 'Sep 23 – Oct 22' },
  { name: 'Scorpio',     symbol: '♏', element: 'Water', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, traits: 'Passionate, resourceful, magnetic',      dateRange: 'Oct 23 – Nov 21' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire',  startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, traits: 'Adventurous, optimistic, philosophical', dateRange: 'Nov 22 – Dec 21' },
  { name: 'Capricorn',   symbol: '♑', element: 'Earth', startMonth: 12, startDay: 22, endMonth: 1,  endDay: 19, traits: 'Disciplined, ambitious, strategic',      dateRange: 'Dec 22 – Jan 19' },
  { name: 'Aquarius',    symbol: '♒', element: 'Air',   startMonth: 1,  startDay: 20, endMonth: 2,  endDay: 18, traits: 'Independent, inventive, humanitarian',   dateRange: 'Jan 20 – Feb 18' },
  { name: 'Pisces',      symbol: '♓', element: 'Water', startMonth: 2,  startDay: 19, endMonth: 3,  endDay: 20, traits: 'Compassionate, artistic, intuitive',     dateRange: 'Feb 19 – Mar 20' },
];
```

### Compatibility Matrix (`COMPATIBILITY_MATRIX`)

A 12×12 symmetric matrix. Scores range from 25–98. Below is the full matrix:

| | Ari | Tau | Gem | Can | Leo | Vir | Lib | Sco | Sag | Cap | Aqu | Pis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Aries** | 76 | 42 | 78 | 42 | 93 | 38 | 72 | 50 | 93 | 47 | 78 | 55 |
| **Taurus** | 42 | 75 | 38 | 90 | 55 | 90 | 65 | 88 | 30 | 95 | 42 | 85 |
| **Gemini** | 78 | 38 | 72 | 40 | 82 | 48 | 93 | 35 | 82 | 32 | 90 | 45 |
| **Cancer** | 42 | 90 | 40 | 75 | 45 | 78 | 38 | 94 | 30 | 60 | 35 | 98 |
| **Leo** | 93 | 55 | 82 | 45 | 78 | 45 | 88 | 55 | 92 | 35 | 68 | 42 |
| **Virgo** | 38 | 90 | 48 | 78 | 45 | 72 | 55 | 88 | 35 | 92 | 38 | 65 |
| **Libra** | 72 | 65 | 93 | 38 | 88 | 55 | 75 | 55 | 72 | 40 | 90 | 48 |
| **Scorpio** | 50 | 88 | 35 | 94 | 55 | 88 | 55 | 78 | 42 | 72 | 45 | 92 |
| **Sagittarius** | 93 | 30 | 82 | 30 | 92 | 35 | 72 | 42 | 76 | 38 | 85 | 50 |
| **Capricorn** | 47 | 95 | 32 | 60 | 35 | 92 | 40 | 72 | 38 | 76 | 42 | 62 |
| **Aquarius** | 78 | 42 | 90 | 35 | 68 | 38 | 90 | 45 | 85 | 42 | 74 | 55 |
| **Pisces** | 55 | 85 | 45 | 98 | 42 | 65 | 48 | 92 | 50 | 62 | 55 | 76 |

### Compatibility Readings (`COMPATIBILITY_READINGS`)

Stored keyed by alphabetically-sorted sign pair (e.g. `"Aries-Leo"`). Every unique pair (78 combinations + 12 same-sign) gets a ~2–3 sentence reading. Below are representative samples:

| Pair | Reading |
|---|---|
| Aries–Aries | "Two Aries together create a whirlwind of energy and passion. You'll never be bored, but learning to take turns leading is the key to lasting harmony. Channel your competitive fire into shared adventures rather than power struggles." |
| Aries–Leo | "This is a powerhouse Fire pairing — bold, passionate, and endlessly exciting. You fuel each other's confidence and ambition. Just remember to share the spotlight; when you do, you're truly unstoppable together." |
| Aries–Taurus | "Fire meets Earth in an opposites-attract dynamic. Aries brings spontaneity while Taurus offers grounding stability. Patience will be tested, but if you respect each other's pace, you'll build something strong and lasting." |
| Cancer–Pisces | "A deeply emotional and intuitive Water pairing — you understand each other on an almost psychic level. Your empathy and devotion create a nurturing bond. Be mindful not to drown in emotions; anchor yourselves with open communication." |
| Gemini–Libra | "Two Air signs in perfect intellectual harmony. Conversation flows endlessly, social life thrives, and ideas spark like lightning. Keep each other grounded with honesty and commitment beneath the charm." |
| Taurus–Capricorn | "Earth meets Earth in the most stable, ambitious pairing of the zodiac. You share values, build empires, and cherish loyalty above all. Just don't forget to schedule spontaneity — all work and no play dims even the strongest bond." |
| Leo–Scorpio | "A dramatic and intense pairing — both signs demand loyalty and possess fierce willpower. The magnetic attraction is undeniable, but control issues can surface. When you channel that intensity into mutual support, you become an unstoppable force." |
| Sagittarius–Aquarius | "Freedom-loving adventurers unite! This pairing thrives on exploration, big ideas, and a shared disdain for convention. You'll travel far — literally and intellectually. Just check in emotionally now and then to keep the bond warm." |
| Virgo–Pisces | "Opposites on the zodiac wheel, you balance each other beautifully. Virgo brings structure and practicality; Pisces brings imagination and empathy. Together you cover every angle — just respect what the other brings to the table." |
| Cancer–Capricorn | "Opposite signs drawn together by complementary strengths. Cancer nurtures the home while Capricorn builds the empire. When you stop competing and start collaborating, this pairing becomes rock-solid and deeply fulfilling." |

*The implementation will include readings for all 78 unique pairs. Each follows this style: a thematic opener, a strength, and a caution/advice.*

### Rating Labels (`RATING_LABELS`)

```javascript
export const RATING_LABELS = [
  { min: 90, max: 100, label: '✨ Soulmates! ✨' },
  { min: 75, max: 89,  label: '💫 Strong Bond' },
  { min: 60, max: 74,  label: '🌙 Promising Match' },
  { min: 45, max: 59,  label: '☁️ It\'s Complicated' },
  { min: 30, max: 44,  label: '🌊 Challenging Currents' },
  { min: 0,  max: 29,  label: '🔥 Cosmic Friction' },
];
```

---

## 9. Implementation Order

### Step 1 — Project Scaffolding

- Create `index.html` with full semantic HTML structure (all sections, cards, inputs, buttons, results area).
- Create empty `styles/main.css`.
- Create empty `js/main.js`.
- Create empty module files: `js/modules/zodiacData.js`, `js/modules/zodiacDetector.js`, `js/modules/compatibility.js`, `js/modules/ui.js`, `js/modules/starfield.js`.
- Verify the page loads with no errors.

### Step 2 — CSS Foundation

- Add Google Fonts `@import`.
- Define all CSS custom properties (`:root` variables).
- Write reset rules (`*`, `html`, `body`).
- Style the header (title with glow, subtitle).
- Style the footer.
- Add base background colour. Verify page looks correct with just header/footer.

### Step 3 — Input Section Styling

- Style `.input-section`, `.person-columns`, `.person-column`.
- Style `.input-label` and `.date-input` (including focus state).
- Style `.zodiac-card` (with `.hidden` state) and all zodiac-card child elements.
- Style element colour modifier classes (`--fire`, `--earth`, `--air`, `--water`).
- Style `.btn`, `.btn--primary`, `.btn--primary:disabled`.
- Add `.fade-in` animation and `@keyframes fadeSlideUp`.
- Verify responsive layout at desktop and mobile widths.

### Step 4 — Zodiac Data Module

- Populate `js/modules/zodiacData.js` with the full `ZODIAC_SIGNS` array (12 signs with all fields).
- Add the complete `COMPATIBILITY_MATRIX` (12×12 scores).
- Add the `RATING_LABELS` array.
- Add a starter set of `COMPATIBILITY_READINGS` (begin with 10–15 key pairings, expand to all 78+ later).
- Export all constants.

### Step 5 — Zodiac Detection

- Implement `detectZodiacSign(month, day)` in `js/modules/zodiacDetector.js`.
- Handle the Capricorn wrap-around (Dec 22 – Jan 19).
- Implement `isValidDate(month, day)`.
- Test with edge-case dates (Jan 1, Dec 31, cusp dates like Mar 20/21).

### Step 6 — Input Handling & Card Display

- In `js/main.js`, implement `init()` — cache DOM references, bind `input` listeners to both date inputs.
- Implement `handleDateChange()` — parse date, call `detectZodiacSign()`, call `updateZodiacCard()`.
- In `js/modules/ui.js`, implement `updateZodiacCard()` and `hideZodiacCard()`.
- Implement `updateCheckButton()` — enable only when both signs are detected.
- Verify: entering a birthday reveals the correct zodiac card with proper symbol, name, element colour, date range, and traits.

### Step 7 — Compatibility Algorithm

- Implement `calculateCompatibility(sign1, sign2)` in `js/modules/compatibility.js`.
- Implement `getRatingLabel(score)`.
- Implement `getReading(sign1Name, sign2Name)`.
- Verify correct lookups from the matrix and readings data.

### Step 8 — Results Display & Animations

- In `js/modules/ui.js`, implement `showResults()` — hide input section, populate sign pairing, trigger animations, show results section.
- Implement `animatePercentage()` — `requestAnimationFrame` counter with ease-out.
- Implement `fillCompatMeter()` — set width with colour class.
- Style results section: `.results-section`, `.sign-pairing`, `.percentage-display`, `.compat-meter`, `.rating-label`, `.reading`.
- Add all remaining `@keyframes` animations (`pulse`, `shimmer`, `glow-pulse`).
- Style `.btn--secondary` for the Try Again button.
- Wire up `handleCheckCompatibility()` in `main.js`.
- Verify: clicking Check shows animated results with correct percentage, meter, label, and reading.

### Step 9 — Reset & Polish

- Implement `resetUI()` in `js/modules/ui.js`.
- Wire up `handleReset()` in `main.js`.
- Verify: clicking Try Again returns to input state with everything cleared.
- Add responsive media query for mobile.
- Test at multiple viewport widths.

### Step 10 — Starfield Background

- Implement `initStarfield()`, `createStars()`, `animateStarfield()`, `handleResize()` in `js/modules/starfield.js`.
- Style `#starfield` canvas (fixed, full-screen, behind content).
- Call `initStarfield('starfield')` from `init()` in `main.js`.
- Verify: twinkling stars visible behind all content, resizes correctly.

### Step 11 — Complete Readings & Final Testing

- Fill in all remaining `COMPATIBILITY_READINGS` for every sign pair (all 78 unique + 12 same-sign = 78 entries using sorted keys).
- Test all 12 same-sign pairs.
- Test several cross-element pairs.
- Test cusp-date edge cases.
- Test keyboard navigation and screen reader announcements.
- Final responsive check on mobile.
- Validate HTML (no errors), CSS (no unused rules), JS (no console errors).
