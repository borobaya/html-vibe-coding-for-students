[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# Meme Generator

A browser-based meme generator that lets you upload any image, add fully customisable top and bottom text with font and colour options, preview the result in real time, and download the finished meme as a PNG — all without a server or external dependencies.

## Features

- **Image Upload** — Drag and drop or click to upload any image file as the meme base.
- **Top & Bottom Text** — Add classic meme-style captions to the top and bottom of the image.
- **Font Customisation** — Choose from a selection of fonts to style caption text.
- **Colour Picker** — Set custom text and outline colours for each caption.
- **Live Preview** — See changes instantly on a canvas preview as you type and adjust settings.
- **Download as PNG** — Export the finished meme as a high-quality PNG file with a single click.
- **Responsive Layout** — Works across desktop and mobile browsers.

## How to Use

1. Open the app in your browser.
2. Click the upload area or drag and drop an image to use as the meme background.
3. Type your desired text into the **Top Text** and **Bottom Text** fields.
4. Use the font dropdown and colour pickers to style the captions.
5. Preview the meme on the canvas in real time.
6. Click the **Download** button to save the meme as a PNG file.

## Project Structure

```text
meme-generator/
├── index.html
├── js/
│   └── main.js
├── styles/
│   └── main.css
├── assets/
└── README.md
```

## Tech Stack

- **HTML5** — Semantic page structure and file input handling.
- **CSS3** — Responsive styling and layout.
- **JavaScript (Canvas API)** — Image rendering, text overlay drawing, and PNG export.

## Getting Started

No build tools or dependencies required. To run locally:

1. Open `index.html` directly in your browser, or start the website from the project root:

   ```bash
   python3 server.py
   ```

   Then visit `http://localhost:5500/meme-generator` in your browser.
