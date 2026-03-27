# Fake Text Message Generator — Implementation Plan

---

## 1. Overview

### What It Is

The Fake Text Message Generator is a single-page web application that allows users to design realistic-looking smartphone chat conversations. The finished conversation can be downloaded as a PNG image for use in memes, storytelling, social media content, or creative projects. The app renders a phone-shaped mockup on screen with an interactive chat thread inside it, while a control panel beside (or below on mobile) lets the user build the conversation message by message.

### User Flow — Step by Step

1. **Page Load** — The user opens `index.html`. The page renders a phone mockup (empty chat screen with a status bar and header) on the left and a control panel on the right. A default contact name ("Contact") is shown in the phone header. The chat area is empty with a placeholder prompt ("Add a message to start the conversation").
2. **Set Contact Details** — In the control panel the user types a contact name (e.g. "Alex") and optionally uploads an avatar image or picks from a set of default avatars. The phone header updates in real time to show the new name and avatar.
3. **Compose a Message** — The user types message text into a textarea in the control panel.
4. **Choose Direction** — The user toggles a "Sent / Received" switch to decide which side of the conversation the message appears on.
5. **Set Timestamp (Optional)** — The user picks a time using an `<input type="time">` field. If left blank the app auto-generates a timestamp a few minutes after the previous message.
6. **Add Message** — The user clicks the "Add Message" button. The message bubble appears inside the phone mockup with the correct alignment (right for sent, left for received), colour, tail shape, and timestamp.
7. **Repeat** — The user continues adding messages to build a full conversation thread.
8. **Edit / Delete / Reorder** — Each message bubble in the phone has hover controls (edit, delete, move up, move down) so the user can refine the conversation.
9. **Download** — The user clicks a "Download as PNG" button. The app uses `html2canvas` (loaded from a CDN) to capture the phone mockup element and triggers a file download of the resulting PNG image.
10. **Clear / Reset** — A "Clear All" button wipes all messages and resets the contact details to defaults so the user can start a new conversation.

---

## 2. Page Layout

### ASCII Wireframe — Desktop (≥ 900px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER BAR  — "Fake Text Generator" logo/title              [Dark Mode 🌙] │
├────────────────────────────────┬─────────────────────────────────────────────┤
│                                │                                             │
│   ┌────────────────────────┐   │   CONTROL PANEL                             │
│   │  ╔══════════════════╗  │   │                                             │
│   │  ║ 9:41    ▓▓▓ ████ ║  │   │   Contact Name: [ Alex______________ ]     │
│   │  ╠══════════════════╣  │   │                                             │
│   │  ║ ← Alex       ⓘ  ║  │   │   Avatar:  [Upload] [Default 1][2][3][4]   │
│   │  ╠══════════════════╣  │   │                                             │
│   │  ║                  ║  │   │   ─────────────────────────────────────      │
│   │  ║   ┌──────────┐   ║  │   │                                             │
│   │  ║   │ Hey!     │   ║  │   │   Message:                                  │
│   │  ║   └──────────┘   ║  │   │   ┌────────────────────────────────────┐    │
│   │  ║          10:30   ║  │   │   │                                    │    │
│   │  ║                  ║  │   │   │  (textarea)                        │    │
│   │  ║    ┌──────────┐  ║  │   │   │                                    │    │
│   │  ║    │ Hi there │  ║  │   │   └────────────────────────────────────┘    │
│   │  ║    └──────────┘  ║  │   │                                             │
│   │  ║          10:31   ║  │   │   Direction:  (●) Sent  ( ) Received        │
│   │  ║                  ║  │   │                                             │
│   │  ║   ┌───────────┐  ║  │   │   Timestamp:  [ 10:32 ]  (time picker)     │
│   │  ║   │ What's up │  ║  │   │                                             │
│   │  ║   └───────────┘  ║  │   │   [ ＋ Add Message ]                        │
│   │  ║          10:32   ║  │   │                                             │
│   │  ║                  ║  │   │   ─────────────────────────────────────      │
│   │  ║                  ║  │   │                                             │
│   │  ╚══════════════════╝  │   │   [ 📥 Download as PNG ]                    │
│   │      PHONE MOCKUP      │   │   [ 🗑  Clear All ]                         │
│   └────────────────────────┘   │                                             │
│                                │                                             │
├────────────────────────────────┴─────────────────────────────────────────────┤
│  FOOTER  — "Made with ❤️ · Fake Text Generator"                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### ASCII Wireframe — Mobile (< 900px)

```
┌──────────────────────────────┐
│ HEADER — "Fake Text Gen" [🌙]│
├──────────────────────────────┤
│  ┌──────────────────────┐    │
│  │ ╔══════════════════╗ │    │
│  │ ║ 9:41   ▓▓ ████  ║ │    │
│  │ ╠══════════════════╣ │    │
│  │ ║ ← Alex       ⓘ  ║ │    │
│  │ ╠══════════════════╣ │    │
│  │ ║  ┌──────────┐    ║ │    │
│  │ ║  │ Hey!     │    ║ │    │
│  │ ║  └──────────┘    ║ │    │
│  │ ║         10:30    ║ │    │
│  │ ║   ┌──────────┐   ║ │    │
│  │ ║   │ Hi there │   ║ │    │
│  │ ║   └──────────┘   ║ │    │
│  │ ║         10:31    ║ │    │
│  │ ╚══════════════════╝ │    │
│  └──────────────────────┘    │
├──────────────────────────────┤
│ CONTROL PANEL                │
│ Contact: [_______________]   │
│ Avatar: [Upload] [1][2][3]   │
│ ─────────────────────────    │
│ Message: [________________]  │
│ Direction: (●)Sent ( )Recv   │
│ Timestamp: [ 10:32 ]        │
│ [ ＋ Add Message ]           │
│ ─────────────────────────    │
│ [ 📥 Download ] [ 🗑 Clear ] │
├──────────────────────────────┤
│ FOOTER                       │
└──────────────────────────────┘
```

### Responsive Behaviour

| Breakpoint | Layout | Notes |
|---|---|---|
| ≥ 900px | Two-column: phone left, controls right | `display: grid; grid-template-columns: auto 1fr;` |
| < 900px | Single column: phone stacked above controls | Phone mockup centres horizontally, controls fill width below |
| < 480px | Compact single column | Phone mockup scales down slightly, font sizes reduce, controls tighten padding |

---

## 3. Colour Scheme & Typography

### Design System — iOS-Inspired Message Style

The phone mockup mimics the iOS Messages experience for maximum realism: blue sent bubbles, grey received bubbles, rounded corners, subtle shadows, a white/light-grey chat background, and proper timestamp typography.

### Colour Palette Table

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Sent Bubble | `--clr-sent` | `#007AFF` | iMessage-style blue sent bubbles |
| Sent Text | `--clr-sent-text` | `#FFFFFF` | White text on sent bubbles |
| Received Bubble | `--clr-received` | `#E9E9EB` | Light grey received bubbles |
| Received Text | `--clr-received-text` | `#1C1C1E` | Dark text on received bubbles |
| Chat Background | `--clr-chat-bg` | `#FFFFFF` | Chat area background |
| Phone Frame | `--clr-phone-frame` | `#1C1C1E` | Dark phone bezel |
| Status Bar BG | `--clr-status-bar` | `#F2F2F7` | iOS light status bar |
| Header BG | `--clr-header-bg` | `#F8F8F8` | Chat header strip |
| Header Text | `--clr-header-text` | `#000000` | Contact name in header |
| Timestamp | `--clr-timestamp` | `#8E8E93` | Grey timestamp text |
| Page Background | `--clr-page-bg` | `#F0F0F5` | Overall page background |
| Accent / Button | `--clr-accent` | `#007AFF` | Primary action buttons |
| Accent Hover | `--clr-accent-hover` | `#005EC4` | Button hover state |
| Danger | `--clr-danger` | `#FF3B30` | Delete/clear buttons |
| Danger Hover | `--clr-danger-hover` | `#D32F2F` | Danger hover state |
| Panel BG | `--clr-panel-bg` | `#FFFFFF` | Control panel background |
| Panel Border | `--clr-panel-border` | `#D1D1D6` | Panel and input borders |
| Input BG | `--clr-input-bg` | `#F2F2F7` | Input field backgrounds |
| Dark Mode BG | `--clr-dark-bg` | `#1C1C1E` | Dark mode page background |
| Dark Mode Surface | `--clr-dark-surface` | `#2C2C2E` | Dark mode panels |

### CSS Variables Block

```css
:root {
  /* Sent / Received */
  --clr-sent: #007AFF;
  --clr-sent-text: #FFFFFF;
  --clr-received: #E9E9EB;
  --clr-received-text: #1C1C1E;

  /* Chat UI */
  --clr-chat-bg: #FFFFFF;
  --clr-phone-frame: #1C1C1E;
  --clr-status-bar: #F2F2F7;
  --clr-header-bg: #F8F8F8;
  --clr-header-text: #000000;
  --clr-timestamp: #8E8E93;

  /* Page */
  --clr-page-bg: #F0F0F5;
  --clr-accent: #007AFF;
  --clr-accent-hover: #005EC4;
  --clr-danger: #FF3B30;
  --clr-danger-hover: #D32F2F;

  /* Panel */
  --clr-panel-bg: #FFFFFF;
  --clr-panel-border: #D1D1D6;
  --clr-input-bg: #F2F2F7;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Radius */
  --radius-bubble: 18px;
  --radius-panel: 12px;
  --radius-btn: 8px;
  --radius-phone: 40px;
}
```

### Typography Table

| Element | Font Family | Weight | Size | Line Height | Colour Variable |
|---|---|---|---|---|---|
| Page Title (h1) | Inter | 700 | 1.75rem | 1.2 | `--clr-header-text` |
| Contact Name | Inter | 600 | 1.0rem | 1.3 | `--clr-header-text` |
| Message Text | Inter | 400 | 0.9375rem (15px) | 1.4 | `--clr-sent-text` / `--clr-received-text` |
| Timestamp | Inter | 400 | 0.6875rem (11px) | 1.2 | `--clr-timestamp` |
| Status Bar Time | Inter | 600 | 0.75rem (12px) | 1.0 | `--clr-header-text` |
| Button Text | Inter | 600 | 0.875rem (14px) | 1.0 | `#FFFFFF` |
| Label Text | Inter | 500 | 0.875rem (14px) | 1.3 | `--clr-header-text` |
| Input Text | Inter | 400 | 0.875rem (14px) | 1.4 | `--clr-received-text` |
| Placeholder | Inter | 400 | 0.875rem | 1.4 | `--clr-timestamp` |

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

---

## 4. HTML Structure — Complete `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Fake Text Message Generator — design realistic chat conversations for memes and storytelling." />
  <title>Fake Text Message Generator</title>
  <link rel="stylesheet" href="styles/main.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>

  <!-- ===== SITE HEADER ===== -->
  <header class="site-header">
    <h1 class="site-header__title">Fake Text Generator</h1>
    <button class="site-header__theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode">🌙</button>
  </header>

  <!-- ===== MAIN CONTENT ===== -->
  <main class="app-layout">

    <!-- ─── Phone Preview ─── -->
    <section class="phone-preview" aria-label="Phone conversation preview">
      <div class="phone-frame" id="phoneFrame">

        <!-- Status Bar -->
        <div class="phone-frame__status-bar">
          <span class="status-bar__time">9:41</span>
          <span class="status-bar__icons" aria-hidden="true">
            <span class="status-bar__signal">●●●●○</span>
            <span class="status-bar__wifi">▲</span>
            <span class="status-bar__battery">🔋</span>
          </span>
        </div>

        <!-- Chat Header -->
        <div class="phone-frame__chat-header">
          <button class="chat-header__back" aria-label="Decorative back button" tabindex="-1">‹</button>
          <div class="chat-header__avatar" id="chatAvatar" aria-hidden="true">
            <img src="assets/default-avatar.svg" alt="" class="chat-header__avatar-img" id="avatarImg" />
          </div>
          <span class="chat-header__name" id="chatName">Contact</span>
          <span class="chat-header__status">online</span>
        </div>

        <!-- Chat Messages Area -->
        <div class="phone-frame__messages" id="messagesContainer" role="log" aria-label="Chat messages" aria-live="polite">
          <p class="messages__placeholder" id="emptyPlaceholder">Add a message to start the conversation.</p>
        </div>

      </div><!-- /.phone-frame -->
    </section>

    <!-- ─── Control Panel ─── -->
    <aside class="control-panel" aria-label="Conversation controls">

      <!-- Contact Settings -->
      <fieldset class="control-panel__section">
        <legend class="control-panel__legend">Contact Details</legend>

        <label class="control-panel__label" for="contactName">Contact Name</label>
        <input class="control-panel__input" type="text" id="contactName" placeholder="Enter contact name" maxlength="30" />

        <label class="control-panel__label" for="avatarUpload">Avatar Image</label>
        <div class="control-panel__avatar-row">
          <input class="control-panel__file-input" type="file" id="avatarUpload" accept="image/*" />
          <div class="control-panel__default-avatars" id="defaultAvatars" role="radiogroup" aria-label="Default avatars">
            <button class="avatar-option" data-avatar="assets/avatar-1.svg" type="button" aria-label="Avatar 1">😀</button>
            <button class="avatar-option" data-avatar="assets/avatar-2.svg" type="button" aria-label="Avatar 2">😎</button>
            <button class="avatar-option" data-avatar="assets/avatar-3.svg" type="button" aria-label="Avatar 3">🤖</button>
            <button class="avatar-option" data-avatar="assets/avatar-4.svg" type="button" aria-label="Avatar 4">👽</button>
          </div>
        </div>
      </fieldset>

      <!-- Message Composer -->
      <fieldset class="control-panel__section">
        <legend class="control-panel__legend">Add Message</legend>

        <label class="control-panel__label" for="messageText">Message Text</label>
        <textarea class="control-panel__textarea" id="messageText" rows="3" placeholder="Type your message…" maxlength="500"></textarea>
        <span class="control-panel__char-count" id="charCount">0 / 500</span>

        <div class="control-panel__direction">
          <span class="control-panel__label">Direction</span>
          <label class="control-panel__radio-label">
            <input type="radio" name="direction" value="sent" checked /> Sent
          </label>
          <label class="control-panel__radio-label">
            <input type="radio" name="direction" value="received" /> Received
          </label>
        </div>

        <label class="control-panel__label" for="messageTime">Timestamp</label>
        <input class="control-panel__input control-panel__time-input" type="time" id="messageTime" />

        <button class="control-panel__btn control-panel__btn--add" id="addMessageBtn" type="button">＋ Add Message</button>
      </fieldset>

      <!-- Actions -->
      <fieldset class="control-panel__section control-panel__actions">
        <legend class="control-panel__legend">Actions</legend>
        <button class="control-panel__btn control-panel__btn--download" id="downloadBtn" type="button">📥 Download as PNG</button>
        <button class="control-panel__btn control-panel__btn--clear" id="clearBtn" type="button">🗑 Clear All</button>
      </fieldset>

    </aside>

  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="site-footer">
    <p>Made with ❤️ · Fake Text Generator</p>
  </footer>

  <!-- html2canvas CDN for image export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" defer></script>
  <!-- App entry point -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Accessibility Notes

- `role="log"` and `aria-live="polite"` on the messages container so screen readers announce new messages.
- Every interactive control has a `<label>` or `aria-label`.
- Radio buttons are grouped with `name="direction"`.
- Decorative elements use `aria-hidden="true"` and `tabindex="-1"`.
- `alt=""` on the avatar image (decorative within the phone mockup).
- Heading hierarchy: `h1` site title only — no deeper headings needed; fieldset/legend provides panel structure.

---

## 5. CSS Architecture — `styles/main.css`

### File Overview

The stylesheet is organised into the following sections, each separated by a comment banner:

1. **Reset & Base** — box-sizing, margin reset, font smoothing
2. **CSS Variables** — custom properties (see Section 3)
3. **Typography** — Google Fonts import, body font
4. **Site Header** — flex row, title, theme toggle
5. **App Layout** — CSS Grid two-column / single-column
6. **Phone Frame** — phone bezel, rounded corners, inner shadow, fixed dimensions
7. **Status Bar** — time, signal icons row
8. **Chat Header** — avatar circle, contact name, back chevron
9. **Messages Container** — scrollable flex column
10. **Message Bubbles** — sent vs received, tails, timestamps
11. **Message Hover Controls** — edit/delete/reorder buttons overlay
12. **Control Panel** — fieldsets, inputs, textarea, buttons
13. **Buttons** — primary, danger, icon-only variants
14. **Avatar Picker** — file input styling, default emoji buttons
15. **Footer** — centred text
16. **Responsive** — `@media` breakpoints
17. **Dark Mode** — `.dark-mode` class overrides
18. **Utility** — sr-only, visually-hidden

### Complete Class List & Descriptions

| Class | Element | Styles |
|---|---|---|
| `.site-header` | `<header>` | `display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); background: var(--clr-panel-bg); border-bottom: 1px solid var(--clr-panel-border);` |
| `.site-header__title` | `<h1>` | `font-size: 1.75rem; font-weight: 700; color: var(--clr-header-text);` |
| `.site-header__theme-toggle` | `<button>` | `background: none; border: none; font-size: 1.5rem; cursor: pointer;` |
| `.app-layout` | `<main>` | `display: grid; grid-template-columns: 375px 1fr; gap: var(--space-xl); max-width: 1100px; margin: var(--space-xl) auto; padding: 0 var(--space-lg); align-items: start;` |
| `.phone-preview` | `<section>` | `display: flex; justify-content: center;` |
| `.phone-frame` | `<div>` | `width: 375px; height: 700px; background: var(--clr-chat-bg); border: 8px solid var(--clr-phone-frame); border-radius: var(--radius-phone); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.15);` |
| `.phone-frame__status-bar` | `<div>` | `display: flex; justify-content: space-between; align-items: center; padding: 8px 20px; background: var(--clr-status-bar); font-size: 0.75rem; font-weight: 600;` |
| `.status-bar__time` | `<span>` | `color: var(--clr-header-text);` |
| `.status-bar__icons` | `<span>` | `display: flex; gap: 4px; font-size: 0.65rem;` |
| `.status-bar__signal` | `<span>` | `letter-spacing: -2px;` |
| `.status-bar__wifi` | `<span>` | `font-size: 0.6rem;` |
| `.status-bar__battery` | `<span>` | `font-size: 0.7rem;` |
| `.phone-frame__chat-header` | `<div>` | `display: flex; align-items: center; gap: var(--space-sm); padding: 10px 16px; background: var(--clr-header-bg); border-bottom: 1px solid var(--clr-panel-border);` |
| `.chat-header__back` | `<button>` | `background: none; border: none; font-size: 1.5rem; color: var(--clr-accent); cursor: default;` |
| `.chat-header__avatar` | `<div>` | `width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: var(--clr-received); flex-shrink: 0;` |
| `.chat-header__avatar-img` | `<img>` | `width: 100%; height: 100%; object-fit: cover;` |
| `.chat-header__name` | `<span>` | `font-size: 1rem; font-weight: 600; color: var(--clr-header-text);` |
| `.chat-header__status` | `<span>` | `font-size: 0.6875rem; color: var(--clr-timestamp); margin-left: auto;` |
| `.phone-frame__messages` | `<div>` | `flex: 1; overflow-y: auto; padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs);` |
| `.messages__placeholder` | `<p>` | `text-align: center; color: var(--clr-timestamp); font-size: 0.875rem; margin: auto;` |
| `.message` | `<div>` (each message row) | `display: flex; flex-direction: column; max-width: 75%; position: relative;` |
| `.message--sent` | modifier | `align-self: flex-end; align-items: flex-end;` |
| `.message--received` | modifier | `align-self: flex-start; align-items: flex-start;` |
| `.message__bubble` | `<div>` | `padding: 8px 14px; border-radius: var(--radius-bubble); font-size: 0.9375rem; line-height: 1.4; word-wrap: break-word; position: relative;` |
| `.message--sent .message__bubble` | sent bubble | `background: var(--clr-sent); color: var(--clr-sent-text); border-bottom-right-radius: 4px;` (tail effect) |
| `.message--received .message__bubble` | received bubble | `background: var(--clr-received); color: var(--clr-received-text); border-bottom-left-radius: 4px;` (tail effect) |
| `.message__timestamp` | `<span>` | `font-size: 0.6875rem; color: var(--clr-timestamp); margin-top: 2px;` |
| `.message--sent .message__timestamp` | sent timestamp | `text-align: right;` |
| `.message__controls` | `<div>` overlay | `position: absolute; top: -28px; right: 0; display: none; gap: 4px; background: var(--clr-panel-bg); border-radius: 6px; padding: 2px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);` |
| `.message:hover .message__controls` | hover reveal | `display: flex;` |
| `.message__control-btn` | `<button>` | `background: none; border: none; font-size: 0.75rem; cursor: pointer; padding: 2px 4px; border-radius: 4px;` |
| `.message__control-btn:hover` | hover | `background: var(--clr-input-bg);` |
| `.control-panel` | `<aside>` | `background: var(--clr-panel-bg); border: 1px solid var(--clr-panel-border); border-radius: var(--radius-panel); padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md);` |
| `.control-panel__section` | `<fieldset>` | `border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-sm);` |
| `.control-panel__legend` | `<legend>` | `font-size: 1rem; font-weight: 600; color: var(--clr-header-text); margin-bottom: var(--space-xs); padding: 0;` |
| `.control-panel__label` | `<label>` | `font-size: 0.875rem; font-weight: 500; color: var(--clr-header-text);` |
| `.control-panel__input` | `<input>` | `padding: 10px 12px; border: 1px solid var(--clr-panel-border); border-radius: var(--radius-btn); background: var(--clr-input-bg); font-size: 0.875rem; font-family: var(--font-primary); outline: none; transition: border-color 0.2s;` |
| `.control-panel__input:focus` | focus | `border-color: var(--clr-accent); box-shadow: 0 0 0 3px rgba(0,122,255,0.15);` |
| `.control-panel__textarea` | `<textarea>` | Same base styles as input, `resize: vertical; min-height: 60px;` |
| `.control-panel__char-count` | `<span>` | `font-size: 0.75rem; color: var(--clr-timestamp); text-align: right;` |
| `.control-panel__direction` | `<div>` | `display: flex; align-items: center; gap: var(--space-md);` |
| `.control-panel__radio-label` | `<label>` | `display: flex; align-items: center; gap: var(--space-xs); font-size: 0.875rem; cursor: pointer;` |
| `.control-panel__time-input` | `<input type="time">` | Inherits `.control-panel__input`; `max-width: 160px;` |
| `.control-panel__avatar-row` | `<div>` | `display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center;` |
| `.control-panel__file-input` | `<input type="file">` | `font-size: 0.8rem;` |
| `.avatar-option` | `<button>` | `width: 40px; height: 40px; font-size: 1.25rem; border: 2px solid var(--clr-panel-border); border-radius: 50%; cursor: pointer; background: var(--clr-input-bg); transition: border-color 0.2s;` |
| `.avatar-option--active` | selected avatar | `border-color: var(--clr-accent); box-shadow: 0 0 0 2px rgba(0,122,255,0.25);` |
| `.control-panel__btn` | `<button>` | `padding: 12px 20px; border: none; border-radius: var(--radius-btn); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background 0.2s;` |
| `.control-panel__btn--add` | add button | `background: var(--clr-accent); color: #fff;` hover: `background: var(--clr-accent-hover);` |
| `.control-panel__btn--download` | download button | `background: var(--clr-accent); color: #fff;` |
| `.control-panel__btn--clear` | clear button | `background: var(--clr-danger); color: #fff;` hover: `background: var(--clr-danger-hover);` |
| `.control-panel__actions` | actions fieldset | `flex-direction: row; gap: var(--space-sm); flex-wrap: wrap;` |
| `.site-footer` | `<footer>` | `text-align: center; padding: var(--space-lg); color: var(--clr-timestamp); font-size: 0.8rem;` |
| `.sr-only` | utility | `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;` |
| `.dark-mode` | body class | Overrides CSS variable values for dark backgrounds and adjusted colours. |

### Message Bubble Tails (CSS Pseudo-Elements)

Sent messages get a small triangular tail on the bottom-right:

```css
.message--sent .message__bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: -6px;
  width: 12px;
  height: 12px;
  background: var(--clr-sent);
  clip-path: polygon(0 0, 0 100%, 100% 100%);
}
```

Received messages get a tail on the bottom-left:

```css
.message--received .message__bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -6px;
  width: 12px;
  height: 12px;
  background: var(--clr-received);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}
```

### Dark Mode Overrides

```css
.dark-mode {
  --clr-page-bg: #1C1C1E;
  --clr-panel-bg: #2C2C2E;
  --clr-panel-border: #3A3A3C;
  --clr-input-bg: #3A3A3C;
  --clr-chat-bg: #000000;
  --clr-header-bg: #1C1C1E;
  --clr-header-text: #FFFFFF;
  --clr-status-bar: #1C1C1E;
  --clr-received: #3A3A3C;
  --clr-received-text: #FFFFFF;
  --clr-timestamp: #8E8E93;
}
```

---

## 6. JavaScript Architecture

### File Structure

```
js/
├── main.js              ← Entry point, imports modules, wires up event listeners
└── modules/
    ├── messageStore.js   ← Message data model & state management
    ├── renderer.js       ← Renders messages into the phone mockup DOM
    ├── controls.js       ← Handles control panel inputs & avatar picker
    ├── exporter.js       ← html2canvas capture & PNG download
    └── utils.js          ← Helper functions (ID generation, time formatting)
```

### Module-by-Module Breakdown

---

#### `js/modules/utils.js`

**Purpose:** Pure utility functions with no side effects.

| Function | Signature | Description |
|---|---|---|
| `generateId()` | `() → string` | Returns a unique string ID using `crypto.randomUUID()` with a fallback to `Date.now() + Math.random()`. |
| `formatTime(date)` | `(Date) → string` | Formats a Date object into `HH:MM` (24-hour) string. |
| `parseTimeInput(value)` | `(string) → string` | Takes the value from `<input type="time">` (e.g. `"14:30"`) and returns a display string like `"14:30"`. Returns current time if value is empty. |
| `sanitise(text)` | `(string) → string` | Escapes HTML special characters (`<`, `>`, `&`, `"`, `'`) to prevent XSS when inserting user text into the DOM. |
| `clamp(val, min, max)` | `(number, number, number) → number` | Clamps a number between min and max. |

---

#### `js/modules/messageStore.js`

**Purpose:** Manages the conversation state as an array of message objects. Provides CRUD operations. This is the single source of truth for all message data.

**State Shape:**

```javascript
/** @typedef {Object} Message
 * @property {string} id        — Unique identifier
 * @property {string} text      — Message content
 * @property {'sent'|'received'} direction — Which side
 * @property {string} timestamp — Display time string "HH:MM"
 * @property {number} order     — Position index
 */
```

| Function | Signature | Description |
|---|---|---|
| `getMessages()` | `() → Message[]` | Returns a shallow copy of the messages array sorted by `order`. |
| `addMessage(text, direction, timestamp)` | `(string, string, string) → Message` | Creates a new `Message` object with a generated ID, appends it to the store, and returns it. |
| `deleteMessage(id)` | `(string) → boolean` | Removes the message with the given ID. Returns `true` if found and removed. |
| `editMessage(id, newText)` | `(string, string) → Message\|null` | Updates the text of the message with the given ID. Returns the updated message or `null`. |
| `moveMessage(id, direction)` | `(string, 'up'\|'down') → boolean` | Swaps the `order` of the target message with its neighbour. Returns `true` if the swap occurred. |
| `clearAll()` | `() → void` | Empties the messages array. |
| `getMessageCount()` | `() → number` | Returns the current number of messages. |

---

#### `js/modules/renderer.js`

**Purpose:** Reads from `messageStore` and renders message bubbles into the `#messagesContainer` element. Handles the full DOM representation of each message including bubble, timestamp, and hover controls.

| Function | Signature | Description |
|---|---|---|
| `renderMessages(container)` | `(HTMLElement) → void` | Clears the container, then for each message from `getMessages()` creates and appends the DOM structure: `.message > .message__bubble + .message__timestamp + .message__controls`. Shows/hides the placeholder. |
| `createMessageElement(msg)` | `(Message) → HTMLElement` | Builds a single message `<div>` with the correct classes (`.message--sent` or `.message--received`), inner bubble with sanitised text, timestamp span, and control buttons (edit ✏️, delete 🗑, move up ↑, move down ↓). |
| `updateContactInfo(name, avatarSrc)` | `(string, string) → void` | Updates `#chatName` text content and `#avatarImg` src attribute. |
| `scrollToBottom(container)` | `(HTMLElement) → void` | Scrolls the messages container to show the latest message. |

---

#### `js/modules/controls.js`

**Purpose:** Manages all control panel interactivity — reading input values, handling avatar selection/upload, wiring up form submission, character count, and direction toggle.

| Function | Signature | Description |
|---|---|---|
| `initControls(onAddMessage, onClear)` | `(Function, Function) → void` | Main setup function. Queries all control panel DOM elements, attaches event listeners, and stores callback references. Called once from `main.js`. |
| `getMessageInput()` | `() → { text: string, direction: string, timestamp: string }` | Reads the current values from the textarea, radio buttons, and time input. |
| `clearMessageInput()` | `() → void` | Resets the textarea, time input, and character count after a message is added. |
| `initContactListeners(onNameChange, onAvatarChange)` | `(Function, Function) → void` | Attaches `input` event on `#contactName` and `change`/`click` events on avatar controls. Calls the provided callbacks with new values. |
| `initCharCounter(textarea, counterEl, maxLen)` | `(HTMLElement, HTMLElement, number) → void` | Updates the character count display on each `input` event. |
| `handleAvatarUpload(file)` | `(File) → Promise<string>` | Reads the file as a data URL using `FileReader` and returns it via a Promise. |

---

#### `js/modules/exporter.js`

**Purpose:** Captures the phone mockup element as a PNG image and triggers a download.

| Function | Signature | Description |
|---|---|---|
| `downloadAsPng(element, filename)` | `(HTMLElement, string) → Promise<void>` | Calls `html2canvas(element, { useCORS: true, scale: 2, backgroundColor: null })` to render the phone frame into a canvas at 2× resolution. Converts the canvas to a Blob, creates an object URL, programmatically clicks a hidden `<a>` element with `download` attribute to trigger the file save, then revokes the object URL. |
| `canvasToBlob(canvas)` | `(HTMLCanvasElement) → Promise<Blob>` | Wraps `canvas.toBlob()` in a Promise for cleaner async/await usage. |

**html2canvas Usage Notes:**
- The library is loaded via a `<script>` tag in `index.html` (CDN, deferred).
- `html2canvas` is accessed as a global (`window.html2canvas`).
- `useCORS: true` is needed if the avatar is loaded from a remote URL.
- `scale: 2` produces a crisp 2× resolution image.

---

#### `js/main.js`

**Purpose:** Application entry point. Imports all modules, queries key DOM elements, and wires everything together.

| Function / Block | Description |
|---|---|
| **Imports** | `import { getMessages, addMessage, deleteMessage, editMessage, moveMessage, clearAll } from './modules/messageStore.js';` etc. |
| **DOM References** | `const messagesContainer = document.getElementById('messagesContainer');` and all other key elements. |
| **`handleAddMessage()`** | Reads input via `getMessageInput()`, validates text is non-empty, calls `addMessage()`, calls `renderMessages()`, calls `clearMessageInput()`, scrolls to bottom. |
| **`handleDelete(id)`** | Calls `deleteMessage(id)`, re-renders. |
| **`handleEdit(id)`** | Prompts user with current text (using `window.prompt` or an inline edit mode), calls `editMessage(id, newText)`, re-renders. |
| **`handleMove(id, dir)`** | Calls `moveMessage(id, dir)`, re-renders. |
| **`handleClear()`** | Confirms with `window.confirm()`, calls `clearAll()`, re-renders. |
| **`handleDownload()`** | Calls `downloadAsPng(phoneFrame, 'fake-text-conversation.png')`. |
| **`handleThemeToggle()`** | Toggles `.dark-mode` class on `<body>`. Updates button emoji (🌙 ↔ ☀️). Stores preference in `localStorage`. |
| **Event Delegation** | Attaches a single `click` listener on `#messagesContainer` using event delegation to handle edit/delete/move button clicks on any message. Reads `data-action` and `data-id` from the clicked button. |
| **`init()`** | Called on `DOMContentLoaded`. Runs `initControls()`, `initContactListeners()`, restores theme from `localStorage`, renders initial empty state. |

### Event Delegation Pattern for Message Controls

Each message control button is rendered with data attributes:

```html
<button class="message__control-btn" data-action="edit" data-id="abc123" aria-label="Edit message">✏️</button>
<button class="message__control-btn" data-action="delete" data-id="abc123" aria-label="Delete message">🗑</button>
<button class="message__control-btn" data-action="moveUp" data-id="abc123" aria-label="Move message up">↑</button>
<button class="message__control-btn" data-action="moveDown" data-id="abc123" aria-label="Move message down">↓</button>
```

The delegated listener on `#messagesContainer`:

```javascript
messagesContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.message__control-btn');
  if (!btn) return;
  const { action, id } = btn.dataset;
  switch (action) {
    case 'edit':    handleEdit(id);         break;
    case 'delete':  handleDelete(id);       break;
    case 'moveUp':  handleMove(id, 'up');   break;
    case 'moveDown': handleMove(id, 'down'); break;
  }
});
```

---

## 7. Feature Details

### 7.1 Message CRUD

**Add:**
1. User types text, selects direction, optionally sets time.
2. Click "Add Message" (or press `Enter` in textarea with `Shift+Enter` for newline).
3. `messageStore.addMessage()` creates a message object and appends to the array.
4. `renderer.renderMessages()` rebuilds the DOM.
5. Input fields are cleared; container scrolls to bottom.

**Edit:**
1. User hovers over a message bubble, revealing control buttons.
2. Click ✏️ (edit).
3. A `window.prompt()` opens pre-filled with the current message text.
4. On confirm, `messageStore.editMessage(id, newText)` updates the store.
5. Re-render.

**Delete:**
1. Hover → click 🗑 (delete).
2. `messageStore.deleteMessage(id)` removes from the array.
3. Re-render. If no messages remain, placeholder is shown again.

**Reorder:**
1. Hover → click ↑ or ↓.
2. `messageStore.moveMessage(id, 'up'|'down')` swaps the `order` property with the adjacent message.
3. Re-render with updated ordering.

### 7.2 Sent vs Received Toggle

- Two radio buttons in the control panel: `Sent` (default checked) and `Received`.
- The selected value is read at add-time and stored in the message object as `direction: 'sent' | 'received'`.
- The renderer applies `.message--sent` or `.message--received` class accordingly, controlling alignment, colour, and bubble tail direction.

### 7.3 Contact Customisation

**Name:**
- `<input type="text" id="contactName">` with `maxlength="30"`.
- On every `input` event, `renderer.updateContactInfo()` updates `#chatName` text.
- Default value: "Contact".

**Avatar:**
- **File upload:** `<input type="file" accept="image/*">`. On `change`, `controls.handleAvatarUpload()` converts to a data URL and sets `#avatarImg` src.
- **Default avatars:** Four emoji buttons. On click, sets `#avatarImg` src to the corresponding SVG from `assets/` and adds `.avatar-option--active` to the selected button (removing from others).
- When no avatar is set, a default SVG silhouette (`assets/default-avatar.svg`) is shown.

### 7.4 Timestamp Handling

- `<input type="time" id="messageTime">` lets the user pick a time.
- If the user leaves it blank, `utils.parseTimeInput('')` generates a time:
  - If there are existing messages, it takes the last message's timestamp and adds 1–5 random minutes.
  - If there are no messages, it uses the current time.
- The timestamp is stored as a `"HH:MM"` string and rendered below each bubble.

### 7.5 Download as PNG

**Approach: html2canvas**

1. User clicks "📥 Download as PNG".
2. `exporter.downloadAsPng()` is called with the `#phoneFrame` element.
3. Before capture, message hover controls are temporarily hidden (add a `.exporting` class that sets `.message__controls { display: none !important; }`).
4. `html2canvas` renders the element into an off-screen `<canvas>` at 2× scale for retina quality.
5. The canvas is converted to a PNG Blob via `canvas.toBlob()`.
6. A temporary `<a>` element is created with `href` set to an object URL of the blob and `download="fake-text-conversation.png"`.
7. The link is programmatically clicked to trigger the browser's download dialog.
8. The object URL is revoked and the `.exporting` class is removed.

**Error Handling:**
- Wrap in `try/catch`.
- If `window.html2canvas` is undefined (CDN failed to load), show an `alert('Image export unavailable. Please check your internet connection.')`.
- Disable the download button and show a loading spinner while capturing.

### 7.6 Dark Mode

- Toggle button in the site header swaps 🌙 / ☀️.
- Adds/removes `.dark-mode` class on `<body>`.
- All colour changes are handled via CSS variable overrides (see Section 5).
- User preference is stored in `localStorage` under key `"theme"` with value `"dark"` or `"light"`.
- On page load, the stored preference is read and applied immediately.

### 7.7 Clear All

- "🗑 Clear All" button in the control panel.
- Shows a `window.confirm('Clear all messages and reset the conversation?')` dialog.
- If confirmed, calls `messageStore.clearAll()`, resets the contact name input to empty, resets avatar to default, and re-renders.

---

## 8. Asset Requirements

All assets live in the `assets/` folder with relative paths from `index.html`.

| File | Type | Purpose | Source |
|---|---|---|---|
| `assets/default-avatar.svg` | SVG | Default contact avatar (grey silhouette) | Create manually — simple circle with head/shoulders shape |
| `assets/avatar-1.svg` | SVG | Default avatar option 1 (smiley face) | Create manually — yellow circle with smile |
| `assets/avatar-2.svg` | SVG | Default avatar option 2 (cool face with sunglasses) | Create manually |
| `assets/avatar-3.svg` | SVG | Default avatar option 3 (robot face) | Create manually |
| `assets/avatar-4.svg` | SVG | Default avatar option 4 (alien face) | Create manually |
| `assets/favicon.svg` | SVG | Browser tab icon (chat bubble icon) | Create manually — speech bubble shape in brand blue |

**Notes:**
- All avatars are simple inline SVGs or small SVG files (< 2 KB each).
- No raster images are required for the core UI.
- User-uploaded avatars are handled as data URLs in memory — never saved to the `assets/` folder.
- The html2canvas library is loaded from CDN, not stored locally.

---

## 9. Implementation Order

### Phase 1 — Project Scaffolding & Static Shell

| Step | Task | Files |
|---|---|---|
| 1.1 | Create folder structure: `js/`, `js/modules/`, `styles/`, `assets/` | directories |
| 1.2 | Create `index.html` with complete semantic structure (Section 4), all containers empty or with placeholders | `index.html` |
| 1.3 | Create SVG avatar assets (default silhouette + 4 emoji avatars + favicon) | `assets/*.svg` |
| 1.4 | Link Google Fonts and html2canvas CDN in HTML `<head>` | `index.html` |

### Phase 2 — CSS Styling

| Step | Task | Files |
|---|---|---|
| 2.1 | Set up `styles/main.css` with reset, CSS variables, and typography base | `styles/main.css` |
| 2.2 | Style the site header (flex layout, title, theme toggle button) | `styles/main.css` |
| 2.3 | Style the app layout grid (two-column desktop, single-column mobile) | `styles/main.css` |
| 2.4 | Style the phone frame (border, border-radius, dimensions, shadow) | `styles/main.css` |
| 2.5 | Style the status bar (time, signal icons) | `styles/main.css` |
| 2.6 | Style the chat header (avatar circle, contact name, back chevron) | `styles/main.css` |
| 2.7 | Style the messages container (scrollable flex column) | `styles/main.css` |
| 2.8 | Style message bubbles — sent (blue, right-aligned) and received (grey, left-aligned), including pseudo-element tails | `styles/main.css` |
| 2.9 | Style message timestamps | `styles/main.css` |
| 2.10 | Style message hover controls (edit/delete/move buttons overlay) | `styles/main.css` |
| 2.11 | Style the control panel (fieldsets, labels, inputs, textarea, radio buttons, file input, avatar picker buttons, action buttons) | `styles/main.css` |
| 2.12 | Style the footer | `styles/main.css` |
| 2.13 | Add responsive breakpoints (`@media` queries for < 900px and < 480px) | `styles/main.css` |
| 2.14 | Add dark mode CSS variable overrides under `.dark-mode` | `styles/main.css` |
| 2.15 | Add `.sr-only` utility class | `styles/main.css` |
| 2.16 | Add `.exporting` class to hide controls during PNG capture | `styles/main.css` |

### Phase 3 — JavaScript Utilities & Data Layer

| Step | Task | Files |
|---|---|---|
| 3.1 | Create `js/modules/utils.js` with `generateId()`, `formatTime()`, `parseTimeInput()`, `sanitise()`, `clamp()` | `js/modules/utils.js` |
| 3.2 | Create `js/modules/messageStore.js` with messages array, `addMessage()`, `deleteMessage()`, `editMessage()`, `moveMessage()`, `clearAll()`, `getMessages()`, `getMessageCount()` | `js/modules/messageStore.js` |
| 3.3 | Manually test the store by calling functions in the browser console | — |

### Phase 4 — Rendering

| Step | Task | Files |
|---|---|---|
| 4.1 | Create `js/modules/renderer.js` with `renderMessages()`, `createMessageElement()`, `updateContactInfo()`, `scrollToBottom()` | `js/modules/renderer.js` |
| 4.2 | Wire up renderer to display hardcoded test messages inside the phone mockup | `js/main.js` |
| 4.3 | Verify sent vs received styling, bubble tails, and timestamps render correctly | — |

### Phase 5 — Control Panel Interactivity

| Step | Task | Files |
|---|---|---|
| 5.1 | Create `js/modules/controls.js` with `initControls()`, `getMessageInput()`, `clearMessageInput()`, `initContactListeners()`, `initCharCounter()`, `handleAvatarUpload()` | `js/modules/controls.js` |
| 5.2 | In `js/main.js`, implement `handleAddMessage()` — read inputs, validate, add to store, render, clear inputs, scroll | `js/main.js` |
| 5.3 | Implement contact name live update | `js/main.js` |
| 5.4 | Implement avatar upload and default avatar picker | `js/main.js` |
| 5.5 | Implement character counter on textarea | `js/main.js` |
| 5.6 | Implement Enter-to-add keyboard shortcut (Shift+Enter for newline) | `js/main.js` |

### Phase 6 — Message Management (Edit, Delete, Reorder)

| Step | Task | Files |
|---|---|---|
| 6.1 | Add event delegation listener on `#messagesContainer` for control button clicks | `js/main.js` |
| 6.2 | Implement `handleEdit(id)` with `window.prompt()` | `js/main.js` |
| 6.3 | Implement `handleDelete(id)` | `js/main.js` |
| 6.4 | Implement `handleMove(id, direction)` | `js/main.js` |
| 6.5 | Implement `handleClear()` with confirmation dialog | `js/main.js` |

### Phase 7 — Image Export

| Step | Task | Files |
|---|---|---|
| 7.1 | Create `js/modules/exporter.js` with `downloadAsPng()` and `canvasToBlob()` | `js/modules/exporter.js` |
| 7.2 | Wire download button in `main.js` to call `downloadAsPng(phoneFrame, 'fake-text-conversation.png')` | `js/main.js` |
| 7.3 | Add `.exporting` class toggle before/after capture | `js/main.js` |
| 7.4 | Test PNG output — verify resolution, colours, and that hover controls are hidden | — |
| 7.5 | Add error handling for missing html2canvas | `js/modules/exporter.js` |

### Phase 8 — Dark Mode & Polish

| Step | Task | Files |
|---|---|---|
| 8.1 | Implement theme toggle in `main.js` — toggle `.dark-mode`, swap emoji, store in `localStorage` | `js/main.js` |
| 8.2 | On page load, read `localStorage` theme and apply | `js/main.js` |
| 8.3 | Test dark mode across all UI components | — |
| 8.4 | Add focus styles, hover transitions, and micro-animations | `styles/main.css` |
| 8.5 | Accessibility review — keyboard navigation, screen reader testing, colour contrast checks | — |

### Phase 9 — Testing & Final Review

| Step | Task | Files |
|---|---|---|
| 9.1 | Test full user flow end-to-end (add messages, edit, delete, reorder, change contact, download) | — |
| 9.2 | Test responsive layout at 1200px, 900px, 600px, 375px viewports | — |
| 9.3 | Test dark mode toggle and persistence across page reloads | — |
| 9.4 | Test PNG download quality and file size | — |
| 9.5 | Test with empty state, single message, and 50+ messages (scroll behaviour) | — |
| 9.6 | Validate HTML with W3C validator | — |
| 9.7 | Cross-browser check (Chrome, Firefox, Safari) | — |
| 9.8 | Final code cleanup — remove console.logs, verify all relative paths | all files |
