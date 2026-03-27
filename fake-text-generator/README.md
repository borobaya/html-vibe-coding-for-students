[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Fake Text Message Generator

A fake text message generator that lets you design realistic-looking chat conversations for memes, storytelling, or creative projects. Build full conversations with sent and received messages, customise the contact name and avatar, set timestamps on each message, and download the finished conversation as an image.

## Features

- **Send and receive messages** — Add messages on either side of the conversation to simulate a real chat thread
- **Custom contact name** — Set any name for the person you're "texting" displayed at the top of the chat
- **Custom avatar** — Upload or choose an avatar image for the contact
- **Timestamps** — Set the time on individual messages for a realistic look
- **Realistic phone UI** — Chat preview styled to look like a real messaging app on a phone screen
- **Delete and reorder messages** — Remove or rearrange messages to get the conversation just right
- **Download as image** — Export the entire conversation as a PNG image ready to share

## How to Use

1. Open the app in your browser
2. Enter a contact name and optionally set an avatar image
3. Type a message in the input field
4. Choose whether the message is **sent** or **received**
5. Optionally set a timestamp for the message
6. Click **Add** to place the message in the conversation
7. Repeat to build out the full chat thread
8. Click **Download** to save the conversation as a PNG image

## Project Structure

```text
fake-text-generator/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic page structure and chat layout
- **CSS3** — Phone-style chat UI with CSS variables and responsive design
- **JavaScript** — Message management, DOM manipulation, and image export

## Getting Started

No build tools or dependencies required. Run it locally with either method:

**Option 1 — Open directly:**

Open `index.html` in your browser.

**Option 2 — Local server:**

```bash
cd fake-text-generator && python3 -m http.server 5500
```

Then visit `http://localhost:5500` in your browser.
