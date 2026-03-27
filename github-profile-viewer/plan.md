# GitHub Profile Viewer — Implementation Plan

---

## 1. Overview

### What It Is

The GitHub Profile Viewer is a single-page web application that allows users to search for any GitHub username and instantly view their public profile information, statistics, and top repositories. It uses the free GitHub REST API (no authentication required) and is built entirely with vanilla HTML5, CSS3, and JavaScript (ES modules).

### User Flow — Step by Step

1. **Page Load** — The user opens `index.html`. They see a centred search bar with a placeholder prompt ("Enter a GitHub username…") and an empty content area below. No profile is displayed yet.
2. **Enter Username** — The user types a GitHub username into the search input field.
3. **Submit Search** — The user presses **Enter** or clicks the **Search** button.
4. **Input Validation** — JavaScript validates the input:
   - Trims whitespace.
   - Rejects empty strings.
   - Checks the username matches GitHub's username rules (alphanumeric + hyphens, 1–39 characters, no leading/trailing hyphens).
   - Sanitizes against XSS by escaping any HTML entities before rendering.
5. **Loading State** — A skeleton/loading animation appears in the profile card area and the repo list area while API calls are in progress.
6. **API Calls** — Two parallel `fetch` requests fire:
   - `GET https://api.github.com/users/{username}` — profile data.
   - `GET https://api.github.com/users/{username}/repos?per_page=30&sort=stars&direction=desc` — top repos sorted by stars.
7. **Success — Profile Rendered** — The profile card populates with: avatar image, display name, username (with link to GitHub), bio, location, company, blog URL, public repo count, followers count, following count, and account creation date.
8. **Success — Repos Rendered** — The repo list populates with cards for each repository showing: repo name (linked to GitHub), description, primary language (with colour dot), star count, and fork count. Repos are sorted by star count descending.
9. **Error — User Not Found (404)** — A friendly error message replaces the content area: "User not found. Check the username and try again."
10. **Error — Rate Limited (403)** — A specific message: "API rate limit reached. Please wait a minute and try again." Shows the reset time if available from response headers.
11. **Error — Network/Other** — A generic message: "Something went wrong. Please check your connection and try again."
12. **New Search** — The user can type a new username and repeat the flow at any time. Previous results are cleared and replaced.

---

## 2. Page Layout

### ASCII Wireframe — Desktop (≥ 768px)

```
┌──────────────────────────────────────────────────────────────────┐
│                          HEADER                                  │
│              🔍  [  Enter a GitHub username...  ] [ Search ]     │
│                          GitHub Profile Viewer                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      PROFILE CARD                                │
│                                                                  │
│    ┌──────────┐   Name                                           │
│    │          │   @username  → link to github.com/username        │
│    │  Avatar  │   Bio text goes here...                           │
│    │  (150px) │   📍 Location  |  🏢 Company  |  🔗 Blog         │
│    │          │                                                   │
│    └──────────┘   ┌──────────┬──────────┬──────────┐             │
│                   │  Repos   │Followers │Following │             │
│                   │   42     │  1.2k    │   89     │             │
│                   └──────────┴──────────┴──────────┘             │
│                   📅 Joined: Jan 2015                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     TOP REPOSITORIES                             │
│                                                                  │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ repo-name           ⭐ 342  │ │ another-repo        ⭐ 210  │ │
│  │ Short description of the   │ │ Another description of the  │ │
│  │ repository here...         │ │ repository here...          │ │
│  │ 🟡 JavaScript    🍴 28     │ │ 🔵 TypeScript   🍴 15      │ │
│  └─────────────────────────────┘ └─────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ third-repo          ⭐ 99   │ │ fourth-repo         ⭐ 55   │ │
│  │ Description text...        │ │ Description text...         │ │
│  │ 🟢 Python       🍴 12      │ │ 🔴 Ruby          🍴 8      │ │
│  └─────────────────────────────┘ └─────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          FOOTER                                  │
│         Powered by GitHub REST API • Made with ♥                 │
└──────────────────────────────────────────────────────────────────┘
```

### ASCII Wireframe — Mobile (< 768px)

```
┌────────────────────────────┐
│         HEADER             │
│   GitHub Profile Viewer    │
│ [  Enter username...     ] │
│ [       Search           ] │
└────────────────────────────┘

┌────────────────────────────┐
│      PROFILE CARD          │
│                            │
│      ┌──────────┐          │
│      │  Avatar  │          │
│      │ (120px)  │          │
│      └──────────┘          │
│        Name                │
│        @username           │
│   Bio text goes here...    │
│                            │
│   📍 Location              │
│   🏢 Company               │
│   🔗 Blog                  │
│                            │
│  ┌────────┐ ┌────────┐    │
│  │ Repos  │ │Follwrs │    │
│  │  42    │ │ 1.2k   │    │
│  ├────────┤ ├────────┤    │
│  │Follwng │ │        │    │
│  │   89   │ │        │    │
│  └────────┘ └────────┘    │
│   📅 Joined: Jan 2015     │
└────────────────────────────┘

┌────────────────────────────┐
│     TOP REPOSITORIES       │
│                            │
│ ┌────────────────────────┐ │
│ │ repo-name       ⭐ 342 │ │
│ │ Description...        │ │
│ │ 🟡 JavaScript  🍴 28  │ │
│ └────────────────────────┘ │
│                            │
│ ┌────────────────────────┐ │
│ │ another-repo    ⭐ 210 │ │
│ │ Description...        │ │
│ │ 🔵 TypeScript  🍴 15  │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Layout Changes |
|---|---|
| ≥ 1024px (desktop) | Two-column repo grid, profile card avatar beside text, max container width 960px |
| 768px – 1023px (tablet) | Two-column repo grid, profile card stacks avatar above text |
| < 768px (mobile) | Single-column repo list, full-width search button below input, stats grid becomes 2×2, smaller avatar (120px) |

---

## 3. Colour Scheme & Typography

### Design Direction

GitHub-inspired modern dark theme by default with clean contrast. Uses GitHub's own palette as a foundation.

### Colour Palette Table

| CSS Variable | Hex Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0d1117` | Page background |
| `--color-bg-secondary` | `#161b22` | Card backgrounds, footer |
| `--color-bg-tertiary` | `#21262d` | Hover states, input background |
| `--color-border` | `#30363d` | Card borders, dividers |
| `--color-border-focus` | `#58a6ff` | Focused input border |
| `--color-text-primary` | `#e6edf3` | Main body text |
| `--color-text-secondary` | `#8b949e` | Secondary text, labels, metadata |
| `--color-text-link` | `#58a6ff` | Hyperlinks, interactive text |
| `--color-accent-blue` | `#1f6feb` | Primary buttons, active states |
| `--color-accent-green` | `#238636` | Success states |
| `--color-accent-red` | `#da3633` | Error messages, destructive |
| `--color-accent-yellow` | `#d29922` | Warnings, rate-limit notices |
| `--color-accent-purple` | `#8957e5` | Language dots, secondary accents |
| `--color-skeleton` | `#21262d` | Skeleton loader base |
| `--color-skeleton-shine` | `#30363d` | Skeleton loader shimmer |
| `--color-avatar-border` | `#30363d` | Avatar ring |
| `--color-star` | `#e3b341` | Star icon colour |

### CSS Variable Declarations

```css
:root {
    --color-bg-primary: #0d1117;
    --color-bg-secondary: #161b22;
    --color-bg-tertiary: #21262d;
    --color-border: #30363d;
    --color-border-focus: #58a6ff;
    --color-text-primary: #e6edf3;
    --color-text-secondary: #8b949e;
    --color-text-link: #58a6ff;
    --color-accent-blue: #1f6feb;
    --color-accent-green: #238636;
    --color-accent-red: #da3633;
    --color-accent-yellow: #d29922;
    --color-accent-purple: #8957e5;
    --color-skeleton: #21262d;
    --color-skeleton-shine: #30363d;
    --color-avatar-border: #30363d;
    --color-star: #e3b341;

    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-2xl: 2rem;

    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    --border-radius-sm: 6px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-full: 50%;

    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;

    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.4);

    --container-max-width: 960px;
}
```

### Typography Table

| Element | Font Family | Size Variable | Weight | Colour Variable | Google Font |
|---|---|---|---|---|---|
| Page title / h1 | `--font-family-primary` | `--font-size-2xl` | `--font-weight-bold` | `--color-text-primary` | Inter 700 |
| Profile name | `--font-family-primary` | `--font-size-xl` | `--font-weight-semibold` | `--color-text-primary` | Inter 600 |
| Profile username | `--font-family-primary` | `--font-size-lg` | `--font-weight-regular` | `--color-text-secondary` | Inter 400 |
| Bio text | `--font-family-primary` | `--font-size-base` | `--font-weight-regular` | `--color-text-primary` | Inter 400 |
| Stat number | `--font-family-primary` | `--font-size-xl` | `--font-weight-bold` | `--color-text-primary` | Inter 700 |
| Stat label | `--font-family-primary` | `--font-size-sm` | `--font-weight-medium` | `--color-text-secondary` | Inter 500 |
| Repo name | `--font-family-primary` | `--font-size-lg` | `--font-weight-semibold` | `--color-text-link` | Inter 600 |
| Repo description | `--font-family-primary` | `--font-size-sm` | `--font-weight-regular` | `--color-text-secondary` | Inter 400 |
| Repo metadata | `--font-family-mono` | `--font-size-xs` | `--font-weight-regular` | `--color-text-secondary` | JetBrains Mono 400 |
| Button text | `--font-family-primary` | `--font-size-base` | `--font-weight-semibold` | `#ffffff` | Inter 600 |
| Error message | `--font-family-primary` | `--font-size-base` | `--font-weight-medium` | `--color-accent-red` | Inter 500 |
| Footer text | `--font-family-primary` | `--font-size-sm` | `--font-weight-regular` | `--color-text-secondary` | Inter 400 |
| Input text | `--font-family-primary` | `--font-size-base` | `--font-weight-regular` | `--color-text-primary` | Inter 400 |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

---

## 4. HTML Structure

### Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Search any GitHub username and view their profile, stats, and top repositories.">
    <title>GitHub Profile Viewer</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>

    <!-- HEADER -->
    <header class="header">
        <div class="header__container">
            <h1 class="header__title">
                <svg class="header__logo" viewBox="0 0 16 16" width="32" height="32" aria-hidden="true">
                    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub Profile Viewer
            </h1>

            <!-- SEARCH FORM -->
            <form class="search" id="search-form" role="search" aria-label="Search GitHub users">
                <label for="search-input" class="visually-hidden">GitHub username</label>
                <input
                    type="text"
                    id="search-input"
                    class="search__input"
                    placeholder="Enter a GitHub username…"
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="false"
                    maxlength="39"
                    required
                >
                <button type="submit" class="search__button" id="search-button">
                    <svg class="search__icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                        <path fill="currentColor" d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z"></path>
                    </svg>
                    Search
                </button>
            </form>
        </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main" id="main-content">
        <div class="container">

            <!-- ERROR MESSAGE (hidden by default) -->
            <div class="error" id="error-container" role="alert" aria-live="polite" hidden>
                <svg class="error__icon" viewBox="0 0 16 16" width="24" height="24" aria-hidden="true">
                    <path fill="currentColor" d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM8 5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5Zm1 6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"></path>
                </svg>
                <p class="error__message" id="error-message"></p>
            </div>

            <!-- LOADING SKELETON (hidden by default) -->
            <div class="skeleton" id="skeleton-container" hidden>
                <div class="skeleton__profile">
                    <div class="skeleton__avatar"></div>
                    <div class="skeleton__lines">
                        <div class="skeleton__line skeleton__line--wide"></div>
                        <div class="skeleton__line skeleton__line--medium"></div>
                        <div class="skeleton__line skeleton__line--narrow"></div>
                    </div>
                </div>
                <div class="skeleton__stats">
                    <div class="skeleton__stat-block"></div>
                    <div class="skeleton__stat-block"></div>
                    <div class="skeleton__stat-block"></div>
                </div>
                <div class="skeleton__repos">
                    <div class="skeleton__repo-card"></div>
                    <div class="skeleton__repo-card"></div>
                    <div class="skeleton__repo-card"></div>
                    <div class="skeleton__repo-card"></div>
                </div>
            </div>

            <!-- PROFILE CARD (hidden by default) -->
            <section class="profile" id="profile-container" aria-label="User profile" hidden>
                <div class="profile__header">
                    <img class="profile__avatar" id="profile-avatar" src="" alt="" width="150" height="150" loading="lazy">
                    <div class="profile__info">
                        <h2 class="profile__name" id="profile-name"></h2>
                        <a class="profile__username" id="profile-username" href="" target="_blank" rel="noopener noreferrer"></a>
                        <p class="profile__bio" id="profile-bio"></p>
                        <div class="profile__meta" id="profile-meta">
                            <!-- Location, company, blog dynamically inserted -->
                        </div>
                    </div>
                </div>

                <!-- STATS -->
                <div class="stats" id="stats-container">
                    <div class="stats__item">
                        <span class="stats__number" id="stat-repos">0</span>
                        <span class="stats__label">Repos</span>
                    </div>
                    <div class="stats__item">
                        <span class="stats__number" id="stat-followers">0</span>
                        <span class="stats__label">Followers</span>
                    </div>
                    <div class="stats__item">
                        <span class="stats__number" id="stat-following">0</span>
                        <span class="stats__label">Following</span>
                    </div>
                </div>

                <!-- JOINED DATE -->
                <p class="profile__joined" id="profile-joined"></p>
            </section>

            <!-- REPOSITORIES SECTION (hidden by default) -->
            <section class="repos" id="repos-container" aria-label="Top repositories" hidden>
                <h3 class="repos__heading">Top Repositories</h3>
                <div class="repos__grid" id="repos-grid">
                    <!-- Repo cards dynamically inserted -->
                </div>
            </section>

        </div>
    </main>

    <!-- FOOTER -->
    <footer class="footer">
        <p class="footer__text">
            Powered by the <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer" class="footer__link">GitHub REST API</a>
        </p>
    </footer>

    <!-- JavaScript (ES module) -->
    <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- `role="search"` on the form for screen reader landmark navigation.
- `aria-label` on `<section>` elements for landmark identification.
- `aria-live="polite"` on the error container so screen readers announce errors automatically.
- Visually hidden `<label>` for the search input using the `.visually-hidden` utility class.
- `alt` attribute on the avatar dynamically set to `"{name}'s avatar"`.
- All links have `rel="noopener noreferrer"` when `target="_blank"`.
- `hidden` attribute used to hide/show sections (respects assistive tech).
- Keyboard focusable controls: input, button, links.
- SVG icons have `aria-hidden="true"` so they're skipped by screen readers.

---

## 5. CSS Architecture

### File: `styles/main.css`

Below is every CSS class and rule, organised by component.

### 5.1 Reset & Base

```css
/* ===== RESET ===== */
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

img {
    max-width: 100%;
    height: auto;
    display: block;
}

a {
    color: var(--color-text-link);
    text-decoration: none;
    transition: color var(--transition-fast);
}

a:hover {
    text-decoration: underline;
}

a:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
    border-radius: var(--border-radius-sm);
}
```

### 5.2 Utility Classes

```css
/* ===== UTILITIES ===== */
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.container {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}
```

### 5.3 Header & Search

```css
/* ===== HEADER ===== */
.header {
    background-color: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-xl) 0;
}

.header__container {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    text-align: center;
}

.header__title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
}

.header__logo {
    color: var(--color-text-primary);
    flex-shrink: 0;
}

/* ===== SEARCH ===== */
.search {
    display: flex;
    gap: var(--spacing-sm);
    max-width: 540px;
    margin: 0 auto;
}

.search__input {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    background-color: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    outline: none;
    transition: border-color var(--transition-fast);
}

.search__input::placeholder {
    color: var(--color-text-secondary);
}

.search__input:focus {
    border-color: var(--color-border-focus);
}

.search__button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-lg);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: #ffffff;
    background-color: var(--color-accent-blue);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    white-space: nowrap;
}

.search__button:hover {
    background-color: #388bfd;
}

.search__button:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
}

.search__button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.search__icon {
    flex-shrink: 0;
}
```

### 5.4 Main Content Area

```css
/* ===== MAIN ===== */
.main {
    flex: 1;
    padding: var(--spacing-2xl) 0;
}
```

### 5.5 Error State

```css
/* ===== ERROR ===== */
.error {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background-color: rgba(218, 54, 51, 0.1);
    border: 1px solid var(--color-accent-red);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md) var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.error__icon {
    color: var(--color-accent-red);
    flex-shrink: 0;
}

.error__message {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-accent-red);
}

.error--warning {
    background-color: rgba(210, 153, 34, 0.1);
    border-color: var(--color-accent-yellow);
}

.error--warning .error__icon,
.error--warning .error__message {
    color: var(--color-accent-yellow);
}
```

### 5.6 Loading Skeleton

```css
/* ===== SKELETON LOADER ===== */
.skeleton__profile {
    display: flex;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
}

.skeleton__avatar {
    width: 150px;
    height: 150px;
    border-radius: var(--border-radius-full);
    background: var(--color-skeleton);
    animation: shimmer 1.5s infinite linear;
    flex-shrink: 0;
}

.skeleton__lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding-top: var(--spacing-md);
}

.skeleton__line {
    height: 16px;
    border-radius: var(--border-radius-sm);
    background: var(--color-skeleton);
    animation: shimmer 1.5s infinite linear;
}

.skeleton__line--wide {
    width: 60%;
}

.skeleton__line--medium {
    width: 40%;
}

.skeleton__line--narrow {
    width: 80%;
}

.skeleton__stats {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.skeleton__stat-block {
    flex: 1;
    height: 60px;
    border-radius: var(--border-radius-md);
    background: var(--color-skeleton);
    animation: shimmer 1.5s infinite linear;
}

.skeleton__repos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.skeleton__repo-card {
    height: 120px;
    border-radius: var(--border-radius-md);
    background: var(--color-skeleton);
    animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
    0% {
        background: var(--color-skeleton);
    }
    50% {
        background: var(--color-skeleton-shine);
    }
    100% {
        background: var(--color-skeleton);
    }
}
```

### 5.7 Profile Card

```css
/* ===== PROFILE ===== */
.profile {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-card);
}

.profile__header {
    display: flex;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
}

.profile__avatar {
    width: 150px;
    height: 150px;
    border-radius: var(--border-radius-full);
    border: 3px solid var(--color-avatar-border);
    flex-shrink: 0;
    object-fit: cover;
}

.profile__info {
    flex: 1;
}

.profile__name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
}

.profile__username {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-secondary);
    display: inline-block;
    margin-bottom: var(--spacing-sm);
}

.profile__username:hover {
    color: var(--color-text-link);
}

.profile__bio {
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
    line-height: 1.5;
}

.profile__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.profile__meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.profile__meta-icon {
    flex-shrink: 0;
}

.profile__joined {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
}
```

### 5.8 Stats

```css
/* ===== STATS ===== */
.stats {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
}

.stats__item {
    flex: 1;
    text-align: center;
    background-color: var(--color-bg-tertiary);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
}

.stats__number {
    display: block;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
}

.stats__label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xs);
}
```

### 5.9 Repository Cards

```css
/* ===== REPOS ===== */
.repos {
    margin-bottom: var(--spacing-2xl);
}

.repos__heading {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
}

.repos__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

/* ===== REPO CARD ===== */
.repo-card {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    display: flex;
    flex-direction: column;
}

.repo-card:hover {
    border-color: var(--color-border-focus);
    box-shadow: var(--shadow-card-hover);
}

.repo-card__name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-link);
    margin-bottom: var(--spacing-sm);
    word-break: break-word;
}

.repo-card__name:hover {
    text-decoration: underline;
}

.repo-card__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
    flex: 1;
    line-height: 1.5;
    /* Clamp to 3 lines */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.repo-card__footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
}

.repo-card__language {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.repo-card__language-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--border-radius-full);
    display: inline-block;
}

.repo-card__stars {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-star);
}

.repo-card__forks {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}
```

### 5.10 Footer

```css
/* ===== FOOTER ===== */
.footer {
    background-color: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-lg) 0;
    text-align: center;
}

.footer__text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.footer__link {
    color: var(--color-text-link);
}
```

### 5.11 Responsive Styles

```css
/* ===== RESPONSIVE ===== */
@media (max-width: 1023px) {
    .profile__header {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .profile__meta {
        justify-content: center;
    }
}

@media (max-width: 767px) {
    .header__title {
        font-size: var(--font-size-xl);
    }

    .search {
        flex-direction: column;
    }

    .search__button {
        justify-content: center;
    }

    .profile__avatar {
        width: 120px;
        height: 120px;
    }

    .stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .repos__grid {
        grid-template-columns: 1fr;
    }

    .skeleton__profile {
        flex-direction: column;
        align-items: center;
    }

    .skeleton__repos {
        grid-template-columns: 1fr;
    }
}
```

### Complete CSS Class Index

| Class Name | Component | Purpose |
|---|---|---|
| `.visually-hidden` | Utility | Hide element visually but keep accessible |
| `.container` | Layout | Max-width centred content wrapper |
| `.header` | Header | Top bar background & border |
| `.header__container` | Header | Centred content within header |
| `.header__title` | Header | App title with logo |
| `.header__logo` | Header | GitHub SVG icon |
| `.search` | Search | Form flex container |
| `.search__input` | Search | Text input field |
| `.search__button` | Search | Submit button |
| `.search__icon` | Search | Magnifying glass SVG |
| `.main` | Layout | Main content area with flex-grow |
| `.error` | Error | Error message container |
| `.error__icon` | Error | Warning SVG icon |
| `.error__message` | Error | Error text |
| `.error--warning` | Error | Yellow variant for rate-limit warnings |
| `.skeleton` | Skeleton | Loading skeleton wrapper |
| `.skeleton__profile` | Skeleton | Profile skeleton row |
| `.skeleton__avatar` | Skeleton | Circular avatar placeholder |
| `.skeleton__lines` | Skeleton | Text line placeholders container |
| `.skeleton__line` | Skeleton | Single text line placeholder |
| `.skeleton__line--wide` | Skeleton | 60% width line |
| `.skeleton__line--medium` | Skeleton | 40% width line |
| `.skeleton__line--narrow` | Skeleton | 80% width line |
| `.skeleton__stats` | Skeleton | Stats row placeholder |
| `.skeleton__stat-block` | Skeleton | Single stat placeholder |
| `.skeleton__repos` | Skeleton | Repo grid placeholder |
| `.skeleton__repo-card` | Skeleton | Single repo card placeholder |
| `.profile` | Profile | Profile card container |
| `.profile__header` | Profile | Avatar + info flex row |
| `.profile__avatar` | Profile | User avatar image |
| `.profile__info` | Profile | Name, username, bio container |
| `.profile__name` | Profile | Display name heading |
| `.profile__username` | Profile | @handle link |
| `.profile__bio` | Profile | Bio paragraph |
| `.profile__meta` | Profile | Location, company, blog row |
| `.profile__meta-item` | Profile | Single meta item (icon + text) |
| `.profile__meta-icon` | Profile | Meta item SVG icon |
| `.profile__joined` | Profile | Joined date line |
| `.stats` | Stats | Stats flex row |
| `.stats__item` | Stats | Single stat block |
| `.stats__number` | Stats | Stat value |
| `.stats__label` | Stats | Stat label text |
| `.repos` | Repos | Repository section wrapper |
| `.repos__heading` | Repos | Section title |
| `.repos__grid` | Repos | CSS grid for repo cards |
| `.repo-card` | Repo Card | Individual repo card |
| `.repo-card__name` | Repo Card | Repo name link |
| `.repo-card__description` | Repo Card | Repo description (3-line clamp) |
| `.repo-card__footer` | Repo Card | Language, stars, forks row |
| `.repo-card__language` | Repo Card | Language dot + name |
| `.repo-card__language-dot` | Repo Card | Coloured circle for language |
| `.repo-card__stars` | Repo Card | Star count with icon |
| `.repo-card__forks` | Repo Card | Fork count with icon |
| `.footer` | Footer | Page footer |
| `.footer__text` | Footer | Footer paragraph |
| `.footer__link` | Footer | Footer hyperlink |

---

## 6. JavaScript Architecture

### File Structure

```
js/
├── main.js              ← Entry point; imports modules, sets up event listeners
└── modules/
    ├── api.js            ← GitHub API fetch functions
    ├── ui.js             ← DOM rendering functions
    ├── validation.js     ← Input validation and sanitization
    └── language-colors.js ← Language-to-colour map
```

### 6.1 `js/main.js` — Entry Point

```
Purpose: Imports all modules, binds event listeners, orchestrates the search flow.
```

| Function / Block | Description |
|---|---|
| `import` statements | Import `fetchUser`, `fetchRepos` from `./modules/api.js`; `renderProfile`, `renderRepos`, `showError`, `showSkeleton`, `hideSkeleton`, `clearResults` from `./modules/ui.js`; `validateUsername`, `sanitizeInput` from `./modules/validation.js` |
| `DOMContentLoaded` listener | Grabs DOM references: `searchForm`, `searchInput`. Calls `initApp()`. |
| `initApp()` | Attaches `submit` event listener to the search form. Focuses the input field on load. |
| `handleSearch(event)` | `event.preventDefault()`. Gets trimmed input value. Calls `sanitizeInput()`. Calls `validateUsername()` — if invalid, calls `showError()` with validation message and returns. Calls `clearResults()`. Calls `showSkeleton()`. Disables the search button. Calls `searchUser(username)`. |
| `async searchUser(username)` | Wraps API calls in try/catch. Fires `fetchUser(username)` and `fetchRepos(username)` in parallel using `Promise.all()`. On success: calls `hideSkeleton()`, `renderProfile(userData)`, `renderRepos(reposData)`. On error: calls `hideSkeleton()`, inspects error type, calls `showError()` with appropriate message. Finally: re-enables the search button. |

### 6.2 `js/modules/api.js` — API Service

```
Purpose: Encapsulates all GitHub API interactions. Returns parsed JSON or throws typed errors.
```

| Function | Signature | Description |
|---|---|---|
| `fetchUser` | `async fetchUser(username): Object` | Calls `GET https://api.github.com/users/{username}`. Returns parsed JSON user object. Throws `UserNotFoundError` on 404. Throws `RateLimitError` on 403 (checks `X-RateLimit-Remaining` header). Throws `ApiError` on other non-OK statuses. |
| `fetchRepos` | `async fetchRepos(username): Array` | Calls `GET https://api.github.com/users/{username}/repos?per_page=30&sort=stars&direction=desc`. Returns parsed JSON array of repo objects. Throws same error types as `fetchUser`. |
| `handleApiResponse` | `async handleApiResponse(response): Object\|Array` | Shared helper. Checks `response.ok`. If 404 → throw `UserNotFoundError`. If 403 → read `X-RateLimit-Remaining`, parse `X-RateLimit-Reset` header into a Date, throw `RateLimitError` with reset time. If other non-OK → throw `ApiError` with status text. If OK → return `response.json()`. |
| `UserNotFoundError` | `class extends Error` | Custom error: `this.name = 'UserNotFoundError'`. |
| `RateLimitError` | `class extends Error` | Custom error: `this.name = 'RateLimitError'`, `this.resetTime` property (Date). |
| `ApiError` | `class extends Error` | Custom error: `this.name = 'ApiError'`, `this.status` property (number). |

### 6.3 `js/modules/ui.js` — DOM Rendering

```
Purpose: All DOM manipulation lives here. Reads data objects and updates the page.
```

| Function | Signature | Description |
|---|---|---|
| `showSkeleton` | `showSkeleton(): void` | Shows `#skeleton-container` by removing `hidden`. Hides `#profile-container`, `#repos-container`, `#error-container`. |
| `hideSkeleton` | `hideSkeleton(): void` | Adds `hidden` to `#skeleton-container`. |
| `clearResults` | `clearResults(): void` | Hides profile, repos, and error containers. Clears `#repos-grid` innerHTML. |
| `showError` | `showError(message, type): void` | Sets `#error-message` textContent. If `type === 'rate-limit'`, adds `error--warning` class, else removes it. Removes `hidden` from `#error-container`. |
| `renderProfile` | `renderProfile(user): void` | Receives the user API object. Sets `#profile-avatar` `src` to `user.avatar_url`, `alt` to `"${user.name ?? user.login}'s avatar"`. Sets `#profile-name` textContent to `user.name ?? user.login`. Sets `#profile-username` textContent to `@${user.login}`, href to `user.html_url`. Sets `#profile-bio` textContent to `user.bio ?? ''`. Builds meta items (location, company, blog) — only shows items that have values. Uses `textContent` everywhere (never `innerHTML`) for XSS safety. Sets stat numbers. Sets joined date formatted via `Intl.DateTimeFormat`. Removes `hidden` from `#profile-container`. |
| `renderRepos` | `renderRepos(repos): void` | Receives array of repo objects. Clears `#repos-grid`. If no repos, inserts a "No public repositories" message. Iterates repos, for each calls `createRepoCard(repo)` and appends to `#repos-grid`. Removes `hidden` from `#repos-container`. |
| `createRepoCard` | `createRepoCard(repo): HTMLElement` | Creates a `<div class="repo-card">`. Creates `<a class="repo-card__name">` with textContent `repo.name`, href `repo.html_url`. Creates `<p class="repo-card__description">` with textContent `repo.description ?? 'No description'`. Creates footer div with language dot (colour from `languageColors` map), language name, star count with SVG star icon, fork count with SVG fork icon. Returns the card element. |
| `formatNumber` | `formatNumber(num): string` | Formats numbers: < 1000 → as-is; ≥ 1000 → e.g. "1.2k"; ≥ 1000000 → e.g. "1.1M". |
| `formatDate` | `formatDate(isoString): string` | Converts ISO date string to readable format using `new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short' })`. E.g. "Jan 2015". |

### 6.4 `js/modules/validation.js` — Input Validation & Sanitization

```
Purpose: Validates and sanitizes user input before making API requests.
```

| Function | Signature | Description |
|---|---|---|
| `sanitizeInput` | `sanitizeInput(input): string` | Trims whitespace. Escapes `<`, `>`, `"`, `'`, `&` characters. Returns sanitized string. |
| `validateUsername` | `validateUsername(username): { valid: boolean, message: string }` | Checks: (1) not empty after trimming → "Please enter a username". (2) length ≤ 39 → "Username must be 39 characters or fewer". (3) matches regex `/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/` → "Username can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen". Returns `{ valid: true, message: '' }` if all pass. |

### 6.5 `js/modules/language-colors.js` — Language Colour Map

```
Purpose: Maps programming language names to their GitHub-standard dot colours.
```

| Export | Type | Description |
|---|---|---|
| `languageColors` | `Object<string, string>` | Key: language name (e.g. `'JavaScript'`), Value: hex colour (e.g. `'#f1e05a'`). Includes 30+ common languages: JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, HTML, CSS, Shell, Swift, Kotlin, Dart, Scala, R, Lua, Perl, Haskell, Elixir, Clojure, Vim Script, Objective-C, Vue, SCSS, Jupyter Notebook, etc. Default fallback: `'#8b949e'`. |

---

## 7. Feature Details

### 7.1 GitHub API Integration

**Users Endpoint:**
- URL: `https://api.github.com/users/{username}`
- Method: `GET`
- No authentication required. Subject to 60 requests/hour rate limit for unauthenticated requests.
- Fields used from response: `login`, `name`, `avatar_url`, `html_url`, `bio`, `location`, `company`, `blog`, `public_repos`, `followers`, `following`, `created_at`.

**Repos Endpoint:**
- URL: `https://api.github.com/users/{username}/repos?per_page=30&sort=stars&direction=desc`
- Method: `GET`
- Query params: `per_page=30` (max repos to fetch), `sort=stars` (sort by star count), `direction=desc` (highest first).
- Fields used from response (per repo): `name`, `html_url`, `description`, `language`, `stargazers_count`, `forks_count`.

### 7.2 Rate Limiting Handling

- GitHub's unauthenticated rate limit: **60 requests per hour** per IP address.
- Each profile search uses **2 requests** (user + repos), so roughly 30 searches per hour.
- On receiving a `403` response:
  1. Read the `X-RateLimit-Remaining` header — if `0`, this is a rate-limit error.
  2. Read the `X-RateLimit-Reset` header — this is a Unix timestamp of when the limit resets.
  3. Calculate minutes until reset: `Math.ceil((resetTime - Date.now() / 1000) / 60)`.
  4. Display: "API rate limit reached. Try again in X minutes."
  5. Use the `error--warning` CSS modifier (yellow instead of red).

### 7.3 Repo Sorting

- The API itself returns repos sorted by stars descending (via query params).
- No additional client-side sorting needed. The API handles it.
- Display up to 30 repos. If a user has fewer, show all available.

### 7.4 Error States

| Scenario | HTTP Status | User Message | CSS Class |
|---|---|---|---|
| User not found | 404 | "User not found. Check the username and try again." | `.error` (red) |
| Rate limit exceeded | 403 | "API rate limit reached. Try again in X minutes." | `.error--warning` (yellow) |
| Network error | N/A (fetch throws) | "Something went wrong. Please check your connection and try again." | `.error` (red) |
| Empty input | N/A (validation) | "Please enter a username." | `.error` (red) |
| Invalid username format | N/A (validation) | "Username can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen." | `.error` (red) |
| Username too long | N/A (validation) | "Username must be 39 characters or fewer." | `.error` (red) |

### 7.5 Loading States

- When a search begins, the skeleton loader container is shown with animated shimmer placeholders for:
  - Avatar (circle)
  - 3 text lines (name, username, bio)
  - 3 stat blocks
  - 4 repo cards (2×2 grid)
- The skeleton is hidden once data arrives or an error occurs.
- The search button is disabled during loading to prevent duplicate requests.

### 7.6 Input Validation & Sanitization

1. **Trim** — Leading/trailing whitespace removed.
2. **Empty check** — Reject empty strings after trimming.
3. **Length check** — GitHub usernames max 39 characters.
4. **Format check** — Regex validates: alphanumeric + hyphens only, no leading/trailing hyphens (matches GitHub's own rules).
5. **HTML entity escaping** — All rendered text uses `textContent` (never `innerHTML`) to prevent XSS. The `sanitizeInput` function additionally escapes `<>'"&` as a defence-in-depth measure before the username is used in API URLs.
6. **URL encoding** — The username is passed through `encodeURIComponent()` when building the API URL.

---

## 8. API Reference

### Endpoint 1: Get User

```
GET https://api.github.com/users/{username}
```

**Example Response (trimmed to relevant fields):**

```json
{
    "login": "octocat",
    "id": 583231,
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
    "html_url": "https://github.com/octocat",
    "name": "The Octocat",
    "company": "@github",
    "blog": "https://github.blog",
    "location": "San Francisco",
    "bio": "GitHub's mascot.",
    "public_repos": 8,
    "followers": 12345,
    "following": 9,
    "created_at": "2011-01-25T18:44:36Z"
}
```

### Endpoint 2: Get User Repos

```
GET https://api.github.com/users/{username}/repos?per_page=30&sort=stars&direction=desc
```

**Example Response (single repo from array):**

```json
[
    {
        "name": "Hello-World",
        "html_url": "https://github.com/octocat/Hello-World",
        "description": "My first repository on GitHub!",
        "language": "Ruby",
        "stargazers_count": 2345,
        "forks_count": 1876
    }
]
```

### Rate Limit Headers (present on every response)

| Header | Description | Example |
|---|---|---|
| `X-RateLimit-Limit` | Total requests allowed per window | `60` |
| `X-RateLimit-Remaining` | Requests remaining in current window | `57` |
| `X-RateLimit-Reset` | Unix timestamp when window resets | `1711531200` |
| `X-RateLimit-Used` | Requests used in current window | `3` |

### Rate Limits

| Type | Limit | Window |
|---|---|---|
| Unauthenticated | 60 requests/hour | Per IP address |
| Each search costs | 2 requests | 1 user + 1 repos call |
| Effective searches | ~30 per hour | Per IP address |

---

## 9. Implementation Order

### Step 1 — Project Setup
- Create `index.html` with the complete HTML structure from Section 4.
- Create `styles/main.css` with CSS variables (`:root` block only).
- Create empty `js/main.js` with module structure and placeholder imports.
- Create empty module files: `js/modules/api.js`, `js/modules/ui.js`, `js/modules/validation.js`, `js/modules/language-colors.js`.
- Verify the page loads in-browser with no errors.

### Step 2 — CSS Foundation
- Add the reset, base styles, and utility classes to `styles/main.css`.
- Add header and search bar styles.
- Add footer styles.
- Verify the header, search bar, and footer render correctly.

### Step 3 — Skeleton Loader
- Add skeleton CSS (shimmer keyframe animation, skeleton layout).
- Temporarily remove `hidden` from `#skeleton-container` in HTML to visually verify the skeleton looks correct.
- Re-add `hidden` once confirmed.

### Step 4 — Validation Module
- Implement `sanitizeInput()` and `validateUsername()` in `js/modules/validation.js`.
- Test with edge cases: empty string, spaces only, special characters, hyphens at start/end, over 39 characters, valid usernames.

### Step 5 — API Module
- Implement `fetchUser()`, `fetchRepos()`, and `handleApiResponse()` in `js/modules/api.js`.
- Define the three custom error classes (`UserNotFoundError`, `RateLimitError`, `ApiError`).
- Test by calling `fetchUser('octocat')` from the browser console to verify data returns.

### Step 6 — Language Colours
- Populate `js/modules/language-colors.js` with the language colour map (30+ languages).
- Export the `languageColors` object.

### Step 7 — UI Rendering Module
- Implement `showSkeleton()`, `hideSkeleton()`, `clearResults()`, `showError()` in `js/modules/ui.js`.
- Implement `renderProfile()` — populate the profile card with user data. Use `textContent` for all text. Build meta items dynamically.
- Implement `renderRepos()` and `createRepoCard()` — build repo cards with language dot colours, star/fork counts.
- Implement `formatNumber()` and `formatDate()` helpers.

### Step 8 — Main Entry Point
- Wire up `js/main.js`: import all modules, attach form submit listener, implement `handleSearch()` and `searchUser()`.
- Test the full flow: search for "octocat" → see skeleton → see profile + repos.
- Test error flows: search for a non-existent user → see error. Test empty input → see validation error.

### Step 9 — Profile Card & Repo Card CSS
- Add all profile card styles (`.profile`, `.profile__header`, etc.).
- Add stats styles (`.stats`, `.stats__item`, etc.).
- Add repo card styles (`.repo-card`, `.repo-card__name`, etc.).
- Add error state styles (`.error`, `.error--warning`).

### Step 10 — Responsive Design
- Add the `@media` queries for tablet (≤ 1023px) and mobile (≤ 767px).
- Test on mobile viewport: verify single-column repo layout, stacked search bar, stacked profile header.
- Test on tablet viewport: verify 2-column repos, stacked profile avatar.

### Step 11 — Polish & Edge Cases
- Verify rate-limit error shows yellow warning with reset time.
- Verify long bios, long repo names, or missing data (no bio, no location, etc.) render gracefully.
- Verify repos with no language show no language dot.
- Verify profile with no avatar shows gracefully (fallback to GitHub default).
- Verify keyboard navigation: Tab through input → button → profile links → repo links.
- Verify screen reader announces error messages via `aria-live`.

### Step 12 — Final Testing
- Search for popular users: `octocat`, `torvalds`, `gaearon`.
- Search for user with many repos and verify top 30 by stars appear.
- Search for non-existent user (e.g. `thisisnotarealuser12345`) and verify 404 error.
- Trigger rate limit (if possible) and verify warning message.
- Test on Chrome, Firefox, Safari.
- Validate HTML with W3C validator.
- Run Lighthouse accessibility audit — aim for 90+ score.
