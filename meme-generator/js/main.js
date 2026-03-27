/**
 * File: main.js
 * Description: Entry point — wires upload, controls, canvas rendering and export
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { addDragDropListeners } from './modules/upload.js';
import { initCanvas, drawMeme } from './modules/canvas.js';
import { drawAllText } from './modules/text.js';
import { downloadMeme } from './modules/export.js';
import { showCanvas, enableControls, resetToUpload } from './modules/ui.js';

/** @type {HTMLImageElement|null} */
let currentImage = null;

/* ── DOM References ─────────────────────────────────── */
const uploadSection = document.getElementById('upload-section');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const canvasSection = document.getElementById('canvas-section');
const canvas = document.getElementById('meme-canvas');
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const fontSelect = document.getElementById('font-select');
const fontSizeSelect = document.getElementById('font-size');
const textColour = document.getElementById('text-colour');
const strokeColour = document.getElementById('stroke-colour');
const changeImageBtn = document.getElementById('change-image-btn');
const downloadBtn = document.getElementById('download-btn');

/* ── Helpers ────────────────────────────────────────── */

/**
 * Gathers current option values from the control inputs
 * @returns {{ topText: string, bottomText: string, fontFamily: string, fontSize: number, textColour: string, strokeColour: string }}
 */
function gatherOptions() {
  return {
    topText: topTextInput.value,
    bottomText: bottomTextInput.value,
    fontFamily: fontSelect.value,
    fontSize: parseInt(fontSizeSelect.value, 10),
    textColour: textColour.value,
    strokeColour: strokeColour.value,
  };
}

/** Re-renders the canvas with the current image and text options */
function renderCanvas() {
  if (!currentImage) return;
  drawMeme(canvas, currentImage, gatherOptions(), drawAllText);
}

/* ── Setup ──────────────────────────────────────────── */

/**
 * Called when a valid image has been loaded
 * @param {HTMLImageElement} image
 */
function onImageLoaded(image) {
  currentImage = image;
  initCanvas(canvas, image);
  showCanvas(uploadSection, canvasSection);
  enableControls(downloadBtn);
  renderCanvas();
}

/** Wires up upload (drag-drop + file picker) */
function setupUploadListeners() {
  addDragDropListeners(dropZone, fileInput, onImageLoaded);
}

/** Wires up live-preview on every control change */
function setupControlListeners() {
  const controls = [topTextInput, bottomTextInput, fontSelect, fontSizeSelect, textColour, strokeColour];
  for (const el of controls) {
    el.addEventListener('input', renderCanvas);
  }
}

/** Wires up action buttons (change image, download) */
function setupActionListeners() {
  changeImageBtn.addEventListener('click', () => {
    currentImage = null;
    topTextInput.value = '';
    bottomTextInput.value = '';
    resetToUpload(uploadSection, canvasSection, downloadBtn, fileInput);
  });

  downloadBtn.addEventListener('click', () => {
    if (currentImage) {
      downloadMeme(canvas);
    }
  });
}

/** Initialises everything on DOM ready */
function init() {
  setupUploadListeners();
  setupControlListeners();
  setupActionListeners();
}

init();
